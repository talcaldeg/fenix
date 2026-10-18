# -*- coding: utf-8 -*-
"""Imagen para la vista previa al compartir el enlace (WhatsApp, redes): img/compartir.jpg, 1200x630.

    python herramientas/imagen_compartir.py

Toma cuatro portadas de img/portadas/ y les pone al lado el nombre y una línea de qué es el sitio.
Se vuelve a correr si cambian las portadas; index.html la declara en og:image.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
FUENTES = Path("C:/Windows/Fonts")
PORTADAS = ["marmion-vida-del-alma", "quo-vadis", "confesiones", "imitacion-de-cristo"]
GRANATE, ORO, CREMA = (74, 20, 26), (232, 176, 74), (255, 244, 214)


def main():
    w, h = 1200, 630
    im = Image.new("RGB", (w, h), GRANATE)
    d = ImageDraw.Draw(im)
    # Abanico de portadas a la derecha, con sombra.
    x0, ancho, alto = 600, 220, 330
    for i, nombre in enumerate(PORTADAS):
        p = Image.open(RAIZ / "img" / "portadas" / f"{nombre}.jpg").convert("RGB").resize((ancho, alto), Image.LANCZOS)
        x, y = x0 + i * 120, 150 + (i % 2) * 40
        sombra = Image.new("L", (ancho + 40, alto + 40), 0)
        ImageDraw.Draw(sombra).rectangle((20, 20, ancho + 20, alto + 20), fill=150)
        im.paste((20, 6, 8), (x - 14, y - 6), sombra.filter(ImageFilter.GaussianBlur(10)))
        im.paste(p, (x, y))
        d.rectangle((x, y, x + ancho - 1, y + alto - 1), outline=CREMA, width=2)
    # Texto a la izquierda.
    f_tit = ImageFont.truetype(str(FUENTES / "georgiab.ttf"), 64)
    f_sub = ImageFont.truetype(str(FUENTES / "georgia.ttf"), 30)
    f_eti = ImageFont.truetype(str(FUENTES / "georgiab.ttf"), 22)
    d.text((70, 150), "BIBLIOTECA CATÓLICA GRATUITA", font=f_eti, fill=ORO)
    d.text((70, 188), "Proyecto Fénix", font=f_tit, fill=CREMA)
    lineas = ["Libros que vuelven a la vida:", "lectura espiritual, oración y", "novelas en EPUB y PDF, con", "reseñas, citas y plan de vida."]
    for i, l in enumerate(lineas):
        d.text((70, 300 + i * 44), l, font=f_sub, fill=(240, 222, 196))
    d.rectangle((70, 500, 190, 504), fill=ORO)
    salida = RAIZ / "img" / "compartir.jpg"
    im.save(salida, "JPEG", quality=85, optimize=True, progressive=True)
    print(f"{salida.relative_to(RAIZ)}: {salida.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
