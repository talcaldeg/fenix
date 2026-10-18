# -*- coding: utf-8 -*-
"""Maquetas del marco Fénix: 3 variantes x 3 libros, render con Chrome headless y hoja de contacto."""
import math
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

AQUI = Path(__file__).resolve().parent
FENIX = Path(r"C:\Users\ASISTENTECOMERCIAL01\Desktop\Personal\Claude\fenix")
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
W, H = 1000, 1500

CREMA, CREMA2, ORO, TINTA = "#f6efe2", "#efe4d0", "#c9973a", "#2a1f1a"
CATEG = {  # color por categoría
    "Lectura espiritual": "#6b1d24",
    "Oración": "#1f3a5f",
    "Clásicos": "#2f4a3a",
}
LIBROS = [
    ("marmion-vida-del-alma", "Jesucristo, vida del alma", "Beato Columba Marmion", "Lectura espiritual"),
    ("historia-de-un-alma", "Historia de un alma", "Santa Teresa del Niño Jesús", "Oración"),
    ("cervantes-don-quijote", "Don Quijote de la Mancha", "Miguel de Cervantes", "Clásicos"),
]

FENIX_AVE = ('<path d="M32 10c3 6 9 9 9 17 0 3-1 5-2 7 4-2 8-6 9-11 4 8 2 18-5 24-3 3-7 4-11 4s-8-1-11-4'
             'c-7-6-9-16-5-24 1 5 5 9 9 11-1-2-2-4-2-7 0-8 6-11 9-17z"/>')


def sello(cx, cy, r, fondo, tinta):
    s = r * 2 / 64 * 0.62
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fondo}" stroke="{tinta}" stroke-width="3"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r-7}" fill="none" stroke="{tinta}" stroke-width="1.2"/>'
            f'<g transform="translate({cx-32*s},{cy-33*s}) scale({s})" fill="{tinta}">{FENIX_AVE}</g>')


def onda(y0, amp, periodos, fase=0.0, x0=0, x1=W, pasos=200):
    pts = []
    for i in range(pasos + 1):
        x = x0 + (x1 - x0) * i / pasos
        y = y0 + amp * math.sin(2 * math.pi * periodos * i / pasos + fase)
        pts.append(f"{x:.1f},{y:.1f}")
    return pts


def hoja(x, y, ang, largo, color):
    """Hoja lanceolada orientada en ang (grados)."""
    a = largo
    return (f'<path transform="translate({x:.1f},{y:.1f}) rotate({ang:.1f})" '
            f'd="M0,0 C{a*0.3:.1f},{-a*0.32:.1f} {a*0.75:.1f},{-a*0.28:.1f} {a:.1f},0 '
            f'C{a*0.75:.1f},{a*0.28:.1f} {a*0.3:.1f},{a*0.32:.1f} 0,0Z" fill="{color}"/>'
            f'<path transform="translate({x:.1f},{y:.1f}) rotate({ang:.1f})" d="M2,0 L{a*0.85:.1f},0" '
            f'stroke="{CREMA}" stroke-opacity=".35" stroke-width="1.3"/>')


def zarcillo(x, y, ang, r, color):
    """Espiral corta (zarcillo) que sale del tallo."""
    pts = []
    for i in range(60):
        t = i / 59 * 2.6 * math.pi
        rr = r * (1 - i / 75)
        pts.append((x + rr * math.cos(t + math.radians(ang)) - r * math.cos(math.radians(ang)),
                    y + rr * math.sin(t + math.radians(ang)) - r * math.sin(math.radians(ang))))
    d = "M" + " L".join(f"{px:.1f},{py:.1f}" for px, py in pts)
    return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="2.4" stroke-linecap="round"/>'


def enredadera(puntos, color, cada=34, largo=44, lado_alterno=True):
    """Tallo por una lista de puntos (x,y) con hojas alternas y zarcillos."""
    d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in puntos)
    out = [f'<path d="{d}" fill="none" stroke="{color}" stroke-width="5" stroke-linecap="round"/>']
    lado = 1
    for i in range(cada, len(puntos) - 2, cada):
        (x0, y0), (x1, y1) = puntos[i - 1], puntos[i + 1]
        ang = math.degrees(math.atan2(y1 - y0, x1 - x0))
        k = (i // cada)
        tam = largo * (0.75 + 0.35 * ((k * 7) % 5) / 4)
        out.append(hoja(*puntos[i], ang + lado * 48, tam, color))
        if k % 3 == 1:
            out.append(zarcillo(*puntos[i], ang - lado * 70, 16, color))
        if lado_alterno:
            lado = -lado
    return "".join(out)


def texto_titulo(titulo, x, y, ancho, color, tam=78, fuente="Garamond", peso=700, max_lineas=3):
    # partición equilibrada: menos líneas posibles y, entre ellas, la de línea más larga más corta
    from itertools import combinations
    palabras = titulo.split()
    lim = ancho / (tam * 0.62)
    lineas = None
    for n in range(1, max_lineas + 1):
        mejor = None
        for cortes in combinations(range(1, len(palabras)), n - 1):
            b = (0,) + cortes + (len(palabras),)
            ls = [" ".join(palabras[b[i]:b[i + 1]]) for i in range(n)]
            m = max(len(s) for s in ls)
            if m <= lim and (mejor is None or m < mejor[0]):
                mejor = (m, ls)
        if mejor:
            lineas = mejor[1]
            break
    if lineas is None:
        return texto_titulo(titulo, x, y, ancho, color, tam * 0.9, fuente, peso, max_lineas)
    alto = tam * 1.08
    y0 = y - alto * (len(lineas) - 1) / 2
    return "".join(
        f'<text x="{x}" y="{y0 + i*alto:.1f}" text-anchor="middle" dominant-baseline="middle" '
        f'font-family="{fuente}" font-weight="{peso}" font-size="{tam:.0f}" fill="{color}" '
        f'letter-spacing="1">{l.upper()}</text>' for i, l in enumerate(lineas))


def imagen(href, x, y, w, h, clip=None):
    c = f' clip-path="url(#{clip})"' if clip else ""
    return (f'<image href="{href}" x="{x}" y="{y}" width="{w}" height="{h}" '
            f'preserveAspectRatio="xMidYMid slice"{c}/>')


# ---------------------------------------------------------------- variante A: onda
def var_onda(id_, titulo, autor, cat):
    col = CATEG[cat]
    href = (FENIX / "img/portadas" / f"{id_}.jpg").as_uri()
    yb = 560
    borde = onda(yb, 26, 2.5)
    banda = "M0,0 L1000,0 L" + " L".join(reversed(borde)) + " Z"
    linea1 = "M" + " L".join(onda(yb + 14, 26, 2.5))
    linea2 = "M" + " L".join(onda(yb + 24, 26, 2.5))
    return f'''
<defs><clipPath id="c"><rect width="{W}" height="{H}"/></clipPath></defs>
{imagen(href, 0, 380, W, H-380)}
<path d="{banda}" fill="{CREMA}"/>
<path d="{linea1}" fill="none" stroke="{ORO}" stroke-width="4"/>
<path d="{linea2}" fill="none" stroke="{col}" stroke-width="2"/>
<rect x="0" y="0" width="{W}" height="18" fill="{col}"/>
<text x="500" y="105" text-anchor="middle" font-family="Garamond" font-size="34" fill="{col}" letter-spacing="6">{autor.upper()}</text>
<path d="M330,140 Q415,120 500,140 T670,140" fill="none" stroke="{ORO}" stroke-width="2.5"/>
{texto_titulo(titulo, 500, 300, 820, col, 92)}
{sello(500, 1395, 50, CREMA, col)}
'''


# ---------------------------------------------------------------- variante B: enredadera
def var_enredadera(id_, titulo, autor, cat):
    col = CATEG[cat]
    href = (FENIX / "img/portadas" / f"{id_}.jpg").as_uri()
    # cartucho de bordes ondulados
    sup = onda(150, 12, 3, 0, 90, 910)
    inf = onda(560, 14, 3, math.pi, 90, 910)
    izq_x, der_x = 90, 910
    cart = ("M" + " L".join(sup) + f" Q{der_x+40},355 " + inf[-1] + " L" + " L".join(reversed(inf))
            + f" Q{izq_x-40},355 " + sup[0] + " Z")
    # tallo: sube por la izquierda desde abajo, abraza el cartucho por arriba y baja por la derecha
    tallo = []
    for i in range(420):
        t = i / 419
        if t < 0.42:  # sube por la izquierda
            u = t / 0.42
            tallo.append((48 + 16 * math.sin(u * 7 * math.pi), 1460 - u * 1330))
        elif t < 0.58:  # cruza por arriba
            u = (t - 0.42) / 0.16
            tallo.append((48 + u * 904, 130 - 75 * math.sin(u * math.pi) + 12 * math.sin(u * 6 * math.pi)))
        else:  # baja por la derecha, más corto
            u = (t - 0.58) / 0.42
            tallo.append((952 - 16 * math.sin(u * 5 * math.pi), 130 + u * 700))
    return f'''
<rect width="{W}" height="{H}" fill="{col}"/>
<rect x="34" y="34" width="{W-68}" height="{H-68}" fill="none" stroke="{ORO}" stroke-width="2"/>
<defs><clipPath id="ventana"><path d="M110,640 Q500,600 890,640 L890,1430 L110,1430 Z"/></clipPath></defs>
{imagen(href, 110, 600, 780, 830, "ventana")}
<path d="M110,640 Q500,600 890,640" fill="none" stroke="{ORO}" stroke-width="5"/>
<path d="{cart}" fill="{CREMA}" stroke="{ORO}" stroke-width="5"/>
<text x="500" y="225" text-anchor="middle" font-family="Garamond" font-size="32" fill="{col}" letter-spacing="5">{autor.upper()}</text>
{texto_titulo(titulo, 500, 385, 700, col, 84)}
{enredadera(tallo, ORO, cada=18, largo=58)}
{sello(500, 1430, 46, col, ORO)}
'''


# ---------------------------------------------------------------- variante C: arco con orla
def var_arco(id_, titulo, autor, cat):
    col = CATEG[cat]
    href = (FENIX / "img/portadas" / f"{id_}.jpg").as_uri()
    # arco de medio punto
    ax0, ax1, ay_top, ay_bot = 150, 850, 160, 1000
    r = (ax1 - ax0) / 2
    arco = f"M{ax0},{ay_bot} L{ax0},{ay_top+r} A{r},{r} 0 0 1 {ax1},{ay_top+r} L{ax1},{ay_bot} Z"
    # orla sinusoidal alrededor del arco (dos ondas entrelazadas)
    def orla(fase):
        pts = []
        per = 2 * (ay_bot - ay_top - r) + math.pi * (r + 26)
        n = 500
        for i in range(n + 1):
            s = per * i / n
            seg1 = ay_bot - ay_top - r
            rr = r + 26
            if s < seg1:  # sube por la izquierda
                bx, by, nx, ny = ax0 - 26, ay_bot - s, -1, 0
            elif s < seg1 + math.pi * rr:
                th = math.pi - (s - seg1) / rr
                cx, cy = (ax0 + ax1) / 2, ay_top + r
                bx, by = cx + rr * math.cos(th), cy - rr * math.sin(th)
                nx, ny = math.cos(th), -math.sin(th)
            else:
                bx, by, nx, ny = ax1 + 26, ay_top + r + (s - seg1 - math.pi * rr), 1, 0
            o = 11 * math.sin(s / 22 + fase)
            pts.append(f"{bx + nx*o:.1f},{by + ny*o:.1f}")
        return "M" + " L".join(pts)
    # volutas en las esquinas inferiores
    def voluta(x, y, sgn):
        pts = []
        for i in range(80):
            t = i / 79 * 3 * math.pi
            rr = 40 * (1 - i / 95)
            pts.append(f"{x + sgn*rr*math.cos(t):.1f},{y - rr*math.sin(t):.1f}")
        return f'<path d="M{" L".join(pts)}" fill="none" stroke="{ORO}" stroke-width="3"/>'
    return f'''
<rect width="{W}" height="{H}" fill="{CREMA}"/>
<defs><clipPath id="arco"><path d="{arco}"/></clipPath></defs>
{imagen(href, ax0, ay_top, ax1-ax0, ay_bot-ay_top, "arco")}
<path d="{arco}" fill="none" stroke="{col}" stroke-width="6"/>
<path d="{orla(0)}" fill="none" stroke="{ORO}" stroke-width="2.5"/>
<path d="{orla(math.pi)}" fill="none" stroke="{col}" stroke-width="2.5"/>
{voluta(110, 1045, 1)}{voluta(890, 1045, -1)}
<path d="M0,1060 C250,1020 750,1100 1000,1060 L1000,1500 L0,1500 Z" fill="{col}"/>
<path d="M0,1072 C250,1032 750,1112 1000,1072" fill="none" stroke="{ORO}" stroke-width="3"/>
{texto_titulo(titulo, 500, 1225, 820, CREMA, 80)}
<text x="500" y="1365" text-anchor="middle" font-family="Garamond" font-size="32" fill="{ORO}" letter-spacing="5">{autor.upper()}</text>
{sello(500, 85, 40, CREMA, col)}
'''


VARIANTES = [("A", "Onda suave", var_onda), ("B", "Enredadera", var_enredadera), ("C", "Arco con orla", var_arco)]


def render(svg_cuerpo, salida_png):
    html = AQUI / (salida_png.stem + ".html")
    html.write_text(
        f'<!doctype html><meta charset="utf-8"><style>html,body{{margin:0;background:#fff}}</style>'
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
        f'{svg_cuerpo}</svg>', encoding="utf-8")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                    "--allow-file-access-from-files", f"--window-size={W},{H}",
                    f"--screenshot={salida_png}", html.as_uri()],
                   check=True, capture_output=True, timeout=60)


def main():
    out = AQUI / "png"
    out.mkdir(exist_ok=True)
    celdas = []
    for letra, nombre, fn in VARIANTES:
        fila = []
        for id_, t, a, c in LIBROS:
            png = out / f"{letra}_{id_}.png"
            render(fn(id_, t, a, c), png)
            fila.append(png)
        celdas.append((letra, nombre, fila))
    # hoja de contacto
    tw, th, pad, cab = 400, 600, 30, 70
    hoja = Image.new("RGB", (pad + 3 * (tw + pad), len(celdas) * (th + cab + pad) + pad), "#ece6dc")
    d = ImageDraw.Draw(hoja)
    f = ImageFont.truetype(r"C:\Windows\Fonts\GARABD.TTF", 40)
    for r, (letra, nombre, fila) in enumerate(celdas):
        y = pad + r * (th + cab + pad)
        d.text((pad, y + 10), f"{letra} · {nombre}", font=f, fill="#2a1f1a")
        for c, png in enumerate(fila):
            im = Image.open(png).convert("RGB").resize((tw, th), Image.LANCZOS)
            hoja.paste(im, (pad + c * (tw + pad), y + cab))
    hoja.save(AQUI / "hoja_variantes.png")
    print(AQUI / "hoja_variantes.png")


if __name__ == "__main__":
    main()
