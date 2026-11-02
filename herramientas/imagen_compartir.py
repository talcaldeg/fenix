# -*- coding: utf-8 -*-
"""Imagen para la vista previa al compartir el enlace (WhatsApp, redes): img/compartir.jpg, 1200x630.

    python herramientas/imagen_compartir.py [--dona]

También deja img/compartir-dona.jpg y img/compartir-dona-en.jpg, para la página de donaciones.
Toma cuatro portadas de img/portadas/ y les pone al lado el nombre y una línea de qué es el sitio.
Se vuelve a correr si cambian las portadas; index.html la declara en og:image.
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
FUENTES = Path("C:/Windows/Fonts")
PORTADAS = ["cervantes-don-quijote", "stevenson-isla-del-tesoro", "shakespeare-hamlet", "verne-la-vuelta-al-mundo-en-80-dias"]
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
    d.text((70, 150), "BIBLIOTECA GRATUITA", font=f_eti, fill=ORO)
    d.text((70, 188), "Proyecto Fénix", font=f_tit, fill=CREMA)
    lineas = ["Libros que vuelven a la vida:", "novelas, teatro, poesía y", "clásicos en EPUB y PDF, con", "reseñas y citas."]
    for i, l in enumerate(lineas):
        d.text((70, 300 + i * 44), l, font=f_sub, fill=(240, 222, 196))
    d.rectangle((70, 500, 190, 504), fill=ORO)
    salida = RAIZ / "img" / "compartir.jpg"
    im.save(salida, "JPEG", quality=85, optimize=True, progressive=True)
    print(f"{salida.relative_to(RAIZ)}: {salida.stat().st_size // 1024} KB")


# Página de donaciones (dona/ y dona/en/, gen_estaticos.js): el fénix del inicio a la derecha y el
# llamado a la izquierda, para que el enlace compartido no salga con la tarjeta de la portada.
DONA = {
    "es": ("APOYA LA BIBLIOTECA", "Dona a Fénix", ["Tu aporte ayuda a digitalizar,", "corregir y traducir libros que", "de otro modo se perderían."]),
    "en": ("SUPPORT THE LIBRARY", "Donate to Fénix", ["Your gift helps us digitise,", "proofread and translate books", "that would otherwise be lost."]),
}


def dona():
    w, h = 1200, 630
    fenix = Image.open(RAIZ / "img" / "inicio-fenix.jpg").convert("RGB")
    ancho = round(fenix.width * h / fenix.height)
    fenix = fenix.resize((ancho, h), Image.LANCZOS)
    # Degradado del granate al cuadro, para que el texto no quede sobre el fuego.
    mascara = Image.new("L", (ancho, h), 255)
    dm = ImageDraw.Draw(mascara)
    for i in range(220):
        dm.line((i, 0, i, h), fill=round(255 * i / 220))
    f_tit = ImageFont.truetype(str(FUENTES / "georgiab.ttf"), 64)
    f_sub = ImageFont.truetype(str(FUENTES / "georgia.ttf"), 30)
    f_eti = ImageFont.truetype(str(FUENTES / "georgiab.ttf"), 22)
    for lang, (eti, tit, lineas) in DONA.items():
        im = Image.new("RGB", (w, h), GRANATE)
        im.paste(fenix, (w - ancho + 40, 0), mascara)  # el ala derecha se corta un poco; el cuerpo queda entero
        d = ImageDraw.Draw(im)
        d.text((70, 170), eti, font=f_eti, fill=ORO)
        d.text((70, 208), tit, font=f_tit, fill=CREMA)
        for i, l in enumerate(lineas):
            d.text((70, 320 + i * 44), l, font=f_sub, fill=(240, 222, 196))
        d.rectangle((70, 476, 190, 480), fill=ORO)
        salida = RAIZ / "img" / ("compartir-dona.jpg" if lang == "es" else f"compartir-dona-{lang}.jpg")
        im.save(salida, "JPEG", quality=85, optimize=True, progressive=True)
        print(f"{salida.relative_to(RAIZ)}: {salida.stat().st_size // 1024} KB")


# Encuadernar (encuadernar/ y encuadernar/en/, gen_estaticos.js): a la derecha, el prompt en una
# terminal y una portada, para que se lea «tu agente de IA prepara un libro».
ENCUADERNAR = {
    "es": ("SÚMATE CON TU IA", ["Encuaderna", "un libro con tu IA"], ["Copias un prompt, tu agente", "prepara el libro y Fénix", "lo publica gratis."],
           ["> Quiero preparar un libro", "  para Proyecto Fénix, una", "  biblioteca gratuita de", "  buenos libros..."]),
    "en": ("JOIN US WITH YOUR AI", ["Bind a book", "with your AI"], ["You copy a prompt, your agent", "prepares the book and Fénix", "publishes it for free."],
           ["> I want to prepare a book", "  for Proyecto Fénix, a free", "  library of good books..."]),
}


def encuadernar():
    w, h = 1200, 630
    f_tit = ImageFont.truetype(str(FUENTES / "georgiab.ttf"), 58)
    f_sub = ImageFont.truetype(str(FUENTES / "georgia.ttf"), 30)
    f_eti = ImageFont.truetype(str(FUENTES / "georgiab.ttf"), 22)
    f_mono = ImageFont.truetype(str(FUENTES / "consola.ttf"), 26)
    portada = Image.open(RAIZ / "img" / "portadas" / f"{PORTADAS[0]}.jpg").convert("RGB").resize((200, 300), Image.LANCZOS)
    for lang, (eti, titulo, lineas, prompt) in ENCUADERNAR.items():
        im = Image.new("RGB", (w, h), GRANATE)
        d = ImageDraw.Draw(im)
        # Terminal con el comienzo del prompt.
        x, y, ancho, alto = 620, 110, 500, 300
        sombra = Image.new("L", (ancho + 40, alto + 40), 0)
        ImageDraw.Draw(sombra).rounded_rectangle((20, 20, ancho + 20, alto + 20), 16, fill=150)
        im.paste((20, 6, 8), (x - 14, y - 6), sombra.filter(ImageFilter.GaussianBlur(10)))
        d.rounded_rectangle((x, y, x + ancho, y + alto), 16, fill=(29, 18, 6), outline=(90, 60, 30), width=2)
        for i, c in enumerate([(210, 90, 80), (232, 176, 74), (120, 160, 90)]):
            d.ellipse((x + 22 + i * 26, y + 20, x + 38 + i * 26, y + 36), fill=c)
        for i, l in enumerate(prompt):
            d.text((x + 28, y + 66 + i * 38), l, font=f_mono, fill=ORO if i == 0 else (240, 222, 196))
        # La portada que sale de la terminal: el libro que queda listo.
        px, py = 960, 300
        sombra = Image.new("L", (240, 340), 0)
        ImageDraw.Draw(sombra).rectangle((20, 20, 220, 320), fill=150)
        im.paste((20, 6, 8), (px - 14, py - 6), sombra.filter(ImageFilter.GaussianBlur(10)))
        im.paste(portada, (px, py))
        d.rectangle((px, py, px + 199, py + 299), outline=CREMA, width=2)
        d.text((70, 130), eti, font=f_eti, fill=ORO)
        for i, l in enumerate(titulo):
            d.text((70, 166 + i * 66), l, font=f_tit, fill=CREMA)
        for i, l in enumerate(lineas):
            d.text((70, 330 + i * 44), l, font=f_sub, fill=(240, 222, 196))
        d.rectangle((70, 486, 190, 490), fill=ORO)
        salida = RAIZ / "img" / ("compartir-encuadernar.jpg" if lang == "es" else f"compartir-encuadernar-{lang}.jpg")
        im.save(salida, "JPEG", quality=85, optimize=True, progressive=True)
        print(f"{salida.relative_to(RAIZ)}: {salida.stat().st_size // 1024} KB")


if __name__ == "__main__":
    # --dona o --encuadernar: solo esas (las portadas no cambiaron).
    solo = [a for a in ("--dona", "--encuadernar") if a in sys.argv]
    if not solo:
        main()
    if not solo or "--dona" in solo:
        dona()
    if not solo or "--encuadernar" in solo:
        encuadernar()
