# -*- coding: utf-8 -*-
"""Códice iluminado sin enredadera y sin capitular separada: F1 (inicial dorada en línea) y F2 (viñeta con el ave)."""
import sys
from itertools import combinations
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parent))
from gen_variantes import AQUI, CATEG, FENIX, FENIX_AVE, H, ORO, W, imagen, render, sello  # noqa: E402

PERG, RUBRICA = "#f3e9d2", "#9b2c2c"
LIBROS = [
    ("marmion-vida-del-alma", "Jesucristo, vida del alma", "Beato Columba Marmion", "Lectura espiritual"),
    ("historia-de-un-alma", "Historia de un alma", "Santa Teresa del Niño Jesús", "Oración"),
    ("imitacion-de-cristo", "Imitación de Cristo", "Tomás de Kempis", "Lectura espiritual"),
]


def partir(titulo, lim, max_lineas=3):
    p = titulo.split()
    for n in range(1, max_lineas + 1):
        mejor = None
        for cortes in combinations(range(1, len(p)), n - 1):
            b = (0,) + cortes + (len(p),)
            ls = [" ".join(p[b[i]:b[i + 1]]) for i in range(n)]
            m = max(len(s) for s in ls)
            if m <= lim and (mejor is None or m < mejor[0]):
                mejor = (m, ls)
        if mejor:
            return mejor[1]
    return [titulo]


def titulo_svg(titulo, x, y, col, tam, anchor, lim, inicial_oro):
    ls = partir(titulo.upper(), lim)
    alto = tam * 1.12
    y0 = y - alto * (len(ls) - 1) / 2
    out = []
    for i, s in enumerate(ls):
        if i == 0 and inicial_oro:
            cuerpo = (f'<tspan fill="{ORO}" font-size="{tam*1.3:.0f}" stroke="{col}" stroke-width="1.2">{s[0]}</tspan>'
                      f'{s[1:]}')
        else:
            cuerpo = s
        out.append(f'<text x="{x}" y="{y0 + i*alto:.0f}" text-anchor="{anchor}" dominant-baseline="middle" '
                   f'font-family="Garamond" font-weight="700" font-size="{tam}" fill="{col}" letter-spacing="1">{cuerpo}</text>')
    return "".join(out)


def base(id_, col, y_img=560):
    href = (FENIX / "img/portadas" / f"{id_}.jpg").as_uri()
    ventana = f"M140,1380 L140,{y_img+120} Q140,{y_img} 500,{y_img} Q860,{y_img} 860,{y_img+120} L860,1380 Z"
    return f'''
<rect width="{W}" height="{H}" fill="{PERG}"/>
<rect x="40" y="40" width="{W-80}" height="{H-80}" fill="none" stroke="{col}" stroke-width="3"/>
<rect x="54" y="54" width="{W-108}" height="{H-108}" fill="none" stroke="{ORO}" stroke-width="1.5"/>
<defs><clipPath id="v"><path d="{ventana}"/></clipPath></defs>
{imagen(href, 140, y_img, 720, 1380 - y_img, "v")}
<path d="{ventana}" fill="none" stroke="{ORO}" stroke-width="6"/>
{sello(500, 1380, 40, PERG, col)}
'''


def var_f1(id_, titulo, autor, cat):
    col = CATEG[cat]
    return base(id_, col) + f'''
<line x1="140" y1="130" x2="860" y2="130" stroke="{RUBRICA}" stroke-width="2"/>
<line x1="140" y1="138" x2="860" y2="138" stroke="{RUBRICA}" stroke-width="0.8"/>
{titulo_svg(titulo, 500, 280, col, 74, "middle", 17, True)}
<line x1="140" y1="430" x2="860" y2="430" stroke="{RUBRICA}" stroke-width="2"/>
<text x="500" y="485" text-anchor="middle" font-family="Garamond" font-style="italic" font-size="38" fill="{RUBRICA}" letter-spacing="1">{autor}</text>
'''


def var_f2(id_, titulo, autor, cat):
    col = CATEG[cat]
    s = 130 / 64 * 0.7
    return base(id_, col) + f'''
<rect x="140" y="140" width="150" height="150" fill="{col}"/>
<rect x="149" y="149" width="132" height="132" fill="none" stroke="{ORO}" stroke-width="2.5"/>
<g transform="translate({215-32*s:.1f},{218-33*s:.1f}) scale({s:.3f})" fill="{ORO}">{FENIX_AVE}</g>
{titulo_svg(titulo, 325, 215, col, 64, "start", 15, False)}
<line x1="140" y1="400" x2="860" y2="400" stroke="{RUBRICA}" stroke-width="2"/>
<text x="140" y="460" font-family="Garamond" font-style="italic" font-size="38" fill="{RUBRICA}" letter-spacing="1">{autor}</text>
'''


VARIANTES = [("F1", "Códice, inicial dorada en línea", var_f1), ("F2", "Códice, viñeta con el ave", var_f2)]


def main():
    out = AQUI / "png"
    celdas = []
    for letra, nombre, fn in VARIANTES:
        fila = []
        for id_, t, a, c in LIBROS:
            png = out / f"{letra}_{id_}.png"
            render(fn(id_, t, a, c), png)
            fila.append(png)
        celdas.append((letra, nombre, fila))
    tw, th, pad, cab = 400, 600, 30, 70
    hoja = Image.new("RGB", (pad + 3 * (tw + pad), len(celdas) * (th + cab + pad) + pad), "#ece6dc")
    d = ImageDraw.Draw(hoja)
    f = ImageFont.truetype(r"C:\Windows\Fonts\GARABD.TTF", 40)
    for r, (letra, nombre, fila) in enumerate(celdas):
        y = pad + r * (th + cab + pad)
        d.text((pad, y + 10), f"{letra} · {nombre}", font=f, fill="#2a1f1a")
        for c, png in enumerate(fila):
            hoja.paste(Image.open(png).convert("RGB").resize((tw, th), Image.LANCZOS), (pad + c * (tw + pad), y + cab))
    hoja.save(AQUI / "hoja_codice.png")
    print(AQUI / "hoja_codice.png")


if __name__ == "__main__":
    main()
