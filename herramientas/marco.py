# -*- coding: utf-8 -*-
"""Marco Fénix: la portada de un libro armada alrededor de su cuadro de dominio público.

Dos plantillas (decididas por Tomás el 18-oct-2026):
- Códice (lectura espiritual y oración): pergamino, doble filete, viñeta de color con el ave en
  oro junto al título, filete rojo de rúbrica, autor en cursiva roja y el cuadro en una ventana
  de arco suave. Sin sello abajo: el ave ya va en la viñeta.
- Enredadera (todo lo demás): fondo del color de la categoría, filete dorado, cartucho crema de
  bordes ondulados con autor y título, cuadro en ventana de borde superior curvo, enredadera
  dorada que sube por la izquierda, cruza arriba y baja por la derecha, y sello del ave abajo.

Se dibuja en SVG (1000 x 1500) y se rasteriza con Chrome headless a 1200 x 1800; portadas.py
saca de ahí la imagen del sitio y la del EPUB.
"""
import base64
import html
import math
import subprocess
import tempfile
from concurrent.futures import ThreadPoolExecutor
from itertools import combinations
from pathlib import Path

from PIL import Image, ImageFont

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
FUENTES = Path("C:/Windows/Fonts")
W, H = 1000, 1500
ESCALA = 1.2  # 1000 x 1500 -> 1200 x 1800

ORO, CREMA, PERG, RUBRICA = "#c9973a", "#f6efe2", "#f3e9d2", "#9b2c2c"
COLOR = {"lectura": "#6b1d24", "oracion": "#1f3a5f"}
VERDE = "#2f4a3a"  # novelas y demás clásicos
CODICE = {"lectura", "oracion"}

FENIX_AVE = ('<path d="M32 10c3 6 9 9 9 17 0 3-1 5-2 7 4-2 8-6 9-11 4 8 2 18-5 24-3 3-7 4-11 4s-8-1-11-4'
             'c-7-6-9-16-5-24 1 5 5 9 9 11-1-2-2-4-2-7 0-8 6-11 9-17z"/>')

_FUENTE = {"bd": "GARABD.TTF", "it": "GARAIT.TTF", "rg": "GARA.TTF"}


def _ancho(texto, tam, estilo="bd", espaciado=0.0):
    f = ImageFont.truetype(str(FUENTES / _FUENTE[estilo]), max(1, round(tam)))
    return f.getlength(texto) + espaciado * len(texto)


def _x(t):
    return html.escape(t, quote=True)


def partir_texto(titulo, autor):
    """Separa subtítulo (tras «:» o entre paréntesis al final) y limpia el autor para la tapa:
    se quitan los paréntesis (traductor, nombre real) salvo «(ed.)»."""
    sub = ""
    if ": " in titulo:
        titulo, sub = titulo.split(": ", 1)
    elif titulo.endswith(")") and " (" in titulo:
        titulo, sub = titulo[:-1].split(" (", 1)
    partes = []
    resto = autor
    while "(" in resto and ")" in resto:
        a, b = resto.split("(", 1)
        dentro, resto = b.split(")", 1)
        partes.append(a)
        if dentro.strip() == "ed.":
            partes.append("(ed.)")
    partes.append(resto)
    autor = " ".join(" ".join(partes).split()).rstrip(",")
    return titulo, sub, autor


# Una línea no termina en estas palabras (queda colgando «DE», «EL», «OF»...).
FUNCIONALES = {"A", "AL", "CON", "DE", "DEL", "EL", "EN", "LA", "LAS", "LOS", "O", "Y", "UN", "UNA", "POR", "SIN",
               "SU", "QUE", "THE", "OF", "AND", "IN", "TO", "AN"}


def _fea(ls):
    """Cuán feo es un corte (0 = limpio): 1 por línea que termina en palabra funcional (0,3 si toda
    la línea lo es, como «DE LOS») y 1 por línea de una sola palabra corta."""
    def funcional(p):
        return p.strip(",;:").upper() in FUNCIONALES
    pena = sum((0.3 if all(map(funcional, l.split())) else 1) for l in ls[:-1] if funcional(l.split()[-1]))
    return pena + sum(1 for l in ls if len(ls) > 1 and len(l) <= 3)


def lineas_equilibradas(texto, tam, ancho, max_lineas, estilo="bd", espaciado=0.0, aceptar_feo=True):
    """Menos líneas posibles sin cortes feos y, entre ellas, la de línea más larga más corta.
    Si todo corte posible es feo, el mejor feo con menos líneas (o None si no se acepta feo).
    None si no cabe."""
    p = texto.split()
    feo = None
    for n in range(1, min(max_lineas, len(p)) + 1):
        mejor = None
        for cortes in combinations(range(1, len(p)), n - 1):
            b = (0,) + cortes + (len(p),)
            ls = [" ".join(p[b[i]:b[i + 1]]) for i in range(n)]
            m = max(_ancho(s, tam, estilo, espaciado) for s in ls)
            if m > ancho:
                continue
            pena = _fea(ls)
            if pena:
                if feo is None or (feo[0] == n and (pena, m) < feo[1]):
                    feo = (n, (pena, m), ls)
            elif mejor is None or m < mejor[0]:
                mejor = (m, ls)
        if mejor:
            return mejor[1]
    return feo[2] if feo and aceptar_feo else None


def bloque(texto, tam, ancho, max_lineas, alto_max, estilo="bd", espaciado=0.0, interlinea=1.1, minimo=0.45):
    """Achica la letra hasta que el texto quepa en ancho, líneas y alto. Devuelve (lineas, tam).
    Primero busca, achicando hasta un 75 %, un corte sin palabras colgando; si no hay, acepta el feo."""
    for aceptar_feo, piso in ((False, 0.75), (True, minimo)):
        t = tam
        while t >= tam * piso:
            ls = lineas_equilibradas(texto, t, ancho, max_lineas, estilo, espaciado, aceptar_feo)
            if ls and len(ls) * t * interlinea <= alto_max:
                return ls, t
            t *= 0.95
    return [texto], t


def _texto(ls, x, y_centro, tam, color, anchor="middle", estilo="bd", espaciado=0.0, interlinea=1.1, alto_ref=None):
    alto = tam * interlinea
    y0 = y_centro - alto * (len(ls) - 1) / 2
    atr = {"bd": 'font-weight="700"', "it": 'font-style="italic"', "rg": ""}[estilo]
    return "".join(
        f'<text x="{x}" y="{y0 + i * alto:.1f}" text-anchor="{anchor}" dominant-baseline="middle" '
        f'font-family="Garamond" {atr} font-size="{tam:.1f}" fill="{color}" letter-spacing="{espaciado}">{_x(s)}</text>'
        for i, s in enumerate(ls))


def _imagen(cuadro: Path, x, y, w, h, clip):
    datos = base64.b64encode(cuadro.read_bytes()).decode("ascii")
    return (f'<image href="data:image/jpeg;base64,{datos}" x="{x}" y="{y}" width="{w}" height="{h}" '
            f'preserveAspectRatio="xMidYMid slice" clip-path="url(#{clip})"/>')


def sello(cx, cy, r, fondo, tinta):
    s = r * 2 / 64 * 0.62
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fondo}" stroke="{tinta}" stroke-width="3"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r - 7}" fill="none" stroke="{tinta}" stroke-width="1.2"/>'
            f'<g transform="translate({cx - 32 * s:.1f},{cy - 33 * s:.1f}) scale({s:.3f})" fill="{tinta}">{FENIX_AVE}</g>')


def onda(y0, amp, periodos, fase=0.0, x0=0, x1=W, pasos=200):
    return [f"{x0 + (x1 - x0) * i / pasos:.1f},{y0 + amp * math.sin(2 * math.pi * periodos * i / pasos + fase):.1f}"
            for i in range(pasos + 1)]


def _hoja(x, y, ang, a, color):
    return (f'<path transform="translate({x:.1f},{y:.1f}) rotate({ang:.1f})" '
            f'd="M0,0 C{a*0.3:.1f},{-a*0.32:.1f} {a*0.75:.1f},{-a*0.28:.1f} {a:.1f},0 '
            f'C{a*0.75:.1f},{a*0.28:.1f} {a*0.3:.1f},{a*0.32:.1f} 0,0Z" fill="{color}"/>'
            f'<path transform="translate({x:.1f},{y:.1f}) rotate({ang:.1f})" d="M2,0 L{a*0.85:.1f},0" '
            f'stroke="{CREMA}" stroke-opacity=".35" stroke-width="1.3"/>')


def _zarcillo(x, y, ang, r, color):
    pts = []
    for i in range(60):
        t = i / 59 * 2.6 * math.pi
        rr = r * (1 - i / 75)
        pts.append((x + rr * math.cos(t + math.radians(ang)) - r * math.cos(math.radians(ang)),
                    y + rr * math.sin(t + math.radians(ang)) - r * math.sin(math.radians(ang))))
    d = "M" + " L".join(f"{px:.1f},{py:.1f}" for px, py in pts)
    return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="2.4" stroke-linecap="round"/>'


def _enredadera(puntos, color, cada=18, largo=58):
    d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in puntos)
    out = [f'<path d="{d}" fill="none" stroke="{color}" stroke-width="5" stroke-linecap="round"/>']
    lado = 1
    for i in range(cada, len(puntos) - 2, cada):
        (x0, y0), (x1, y1) = puntos[i - 1], puntos[i + 1]
        ang = math.degrees(math.atan2(y1 - y0, x1 - x0))
        k = i // cada
        out.append(_hoja(*puntos[i], ang + lado * 48, largo * (0.75 + 0.35 * ((k * 7) % 5) / 4), color))
        if k % 3 == 1:
            out.append(_zarcillo(*puntos[i], ang - lado * 70, 16, color))
        lado = -lado
    return "".join(out)


def enredadera(cuadro: Path, titulo, autor, categoria):
    col = COLOR.get(categoria, VERDE)
    titulo, sub, autor = partir_texto(titulo, autor)
    sup = onda(150, 12, 3, 0, 90, 910)
    inf = onda(560, 14, 3, math.pi, 90, 910)
    cart = ("M" + " L".join(sup) + " Q950,355 " + inf[-1] + " L" + " L".join(reversed(inf))
            + " Q50,355 " + sup[0] + " Z")
    tallo = []
    for i in range(420):
        t = i / 419
        if t < 0.42:
            u = t / 0.42
            tallo.append((48 + 16 * math.sin(u * 7 * math.pi), 1460 - u * 1330))
        elif t < 0.58:
            u = (t - 0.42) / 0.16
            tallo.append((48 + u * 904, 130 - 75 * math.sin(u * math.pi) + 12 * math.sin(u * 6 * math.pi)))
        else:
            u = (t - 0.58) / 0.42
            tallo.append((952 - 16 * math.sin(u * 5 * math.pi), 130 + u * 700))
    # Autor arriba del cartucho; título (y subtítulo) centrados en el resto.
    la, ta = bloque(autor.upper(), 32, 720, 1, 40, "rg", 5)
    svg_aut = _texto(la, 500, 225, ta, col, "middle", "rg", 5)
    zona_top, zona_bot = 262, 525
    ls_s, ts = (bloque(sub, 38, 700, 2, 90, "it") if sub else ([], 0))
    alto_sub = len(ls_s) * ts * 1.15 + (14 if sub else 0)
    lt, tt = bloque(titulo.upper(), 84, 700, 3, zona_bot - zona_top - alto_sub, "bd", 1, 1.08)
    alto_tit = len(lt) * tt * 1.08
    y = (zona_top + zona_bot) / 2 - (alto_tit + alto_sub) / 2
    svg_tit = _texto(lt, 500, y + alto_tit / 2, tt, col, "middle", "bd", 1, 1.08)
    svg_sub = _texto(ls_s, 500, y + alto_tit + 14 + len(ls_s) * ts * 1.15 / 2, ts, col, "middle", "it", 0, 1.15) if sub else ""
    return f'''
<rect width="{W}" height="{H}" fill="{col}"/>
<rect x="34" y="34" width="{W-68}" height="{H-68}" fill="none" stroke="{ORO}" stroke-width="2"/>
<defs><clipPath id="ventana"><path d="M110,640 Q500,600 890,640 L890,1430 L110,1430 Z"/></clipPath></defs>
{_imagen(cuadro, 110, 600, 780, 830, "ventana")}
<path d="M110,640 Q500,600 890,640" fill="none" stroke="{ORO}" stroke-width="5"/>
<path d="{cart}" fill="{CREMA}" stroke="{ORO}" stroke-width="5"/>
{svg_aut}{svg_tit}{svg_sub}
{_enredadera(tallo, ORO)}
{sello(500, 1430, 46, col, ORO)}
'''


def codice(cuadro: Path, titulo, autor, categoria):
    col = COLOR[categoria]
    titulo, sub, autor = partir_texto(titulo, autor)
    y_img = 560
    ventana = f"M140,1380 L140,{y_img+120} Q140,{y_img} 500,{y_img} Q860,{y_img} 860,{y_img+120} L860,1380 Z"
    s = 130 / 64 * 0.7
    # Título a la derecha de la viñeta (x 325 a 860), entre y 140 y 385.
    ls_s, ts = (bloque(sub, 34, 535, 2, 80, "it") if sub else ([], 0))
    alto_sub = len(ls_s) * ts * 1.15 + (10 if sub else 0)
    lt, tt = bloque(titulo.upper(), 64, 535, 4, 245 - alto_sub, "bd", 1, 1.12)
    alto_tit = len(lt) * tt * 1.12
    total = alto_tit + alto_sub
    y = max(140, min(215 - total / 2, 385 - total))
    svg_tit = _texto(lt, 325, y + alto_tit / 2, tt, col, "start", "bd", 1, 1.12)
    svg_sub = _texto(ls_s, 325, y + alto_tit + 10 + len(ls_s) * ts * 1.15 / 2, ts, col, "start", "it", 0, 1.15) if sub else ""
    la, ta = bloque(autor, 38, 720, 1, 50, "it", 1)
    return f'''
<rect width="{W}" height="{H}" fill="{PERG}"/>
<rect x="40" y="40" width="{W-80}" height="{H-80}" fill="none" stroke="{col}" stroke-width="3"/>
<rect x="54" y="54" width="{W-108}" height="{H-108}" fill="none" stroke="{ORO}" stroke-width="1.5"/>
<defs><clipPath id="v"><path d="{ventana}"/></clipPath></defs>
{_imagen(cuadro, 140, y_img, 720, 1380 - y_img, "v")}
<path d="{ventana}" fill="none" stroke="{ORO}" stroke-width="6"/>
<rect x="140" y="140" width="150" height="150" fill="{col}"/>
<rect x="149" y="149" width="132" height="132" fill="none" stroke="{ORO}" stroke-width="2.5"/>
<g transform="translate({215-32*s:.1f},{218-33*s:.1f}) scale({s:.3f})" fill="{ORO}">{FENIX_AVE}</g>
{svg_tit}{svg_sub}
<line x1="140" y1="400" x2="860" y2="400" stroke="{RUBRICA}" stroke-width="2"/>
{_texto(la, 140, 460, ta, RUBRICA, "start", "it", 1)}
'''


def svg(cuadro: Path, titulo, autor, categoria):
    fn = codice if categoria in CODICE else enredadera
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
            f'{fn(cuadro, titulo, autor, categoria)}</svg>')


def _rasterizar(svg_txt, salida: Path):
    with tempfile.TemporaryDirectory() as tmp:
        pagina = Path(tmp) / "p.html"
        pagina.write_text('<!doctype html><meta charset="utf-8"><style>html,body{margin:0;overflow:hidden}'
                          'svg{display:block}</style>' + svg_txt, encoding="utf-8")
        png = Path(tmp) / "p.png"
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                        f"--user-data-dir={Path(tmp) / 'perfil'}", f"--window-size={W},{H}",
                        f"--force-device-scale-factor={ESCALA}", f"--screenshot={png}", pagina.as_uri()],
                       check=True, capture_output=True, timeout=120)
        im = Image.open(png).convert("RGB")
        if im.size != (round(W * ESCALA), round(H * ESCALA)):
            raise RuntimeError(f"{salida.name}: Chrome devolvió {im.size}")
        im.save(salida, "PNG")


def rasterizar(trabajos):
    """trabajos: lista de (svg, salida.png). Rasteriza en paralelo."""
    with ThreadPoolExecutor(4) as ex:
        list(ex.map(lambda t: _rasterizar(*t), trabajos))
