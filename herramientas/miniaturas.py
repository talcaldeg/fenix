# -*- coding: utf-8 -*-
"""Miniaturas livianas en WebP para el sitio: cuadros y portadas de 600x900 (~200 KB) pesan
demasiado como miniatura, y en el celular la biblioteca bajaba 14 MB.

    python herramientas/miniaturas.py              # solo lo que falta o cambió
    python herramientas/miniaturas.py --todas      # rehace todas

- img/cuadros/mini/<nombre>.webp   96x144: filas de la biblioteca, citas, parecidos (se ven a 44x66).
- img/cuadros/medio/<nombre>.webp  360x540: accesos de la portada y la vista Editorial.
- img/portadas/medio/<nombre>.webp 360x540: tarjetas y ficha (se ven a 180-220 px de ancho).
- img/inicio-fenix.webp y -movil.webp (860 px, celulares de hasta 480 px): el fondo del inicio.
- img/portadas/og/<nombre>.jpg     1200x630: vista previa al compartir un libro (og:image). WhatsApp y
  las redes dibujan la tarjeta con el ancho de la imagen; con la portada vertical salía angosta.
La fuente sigue siendo el JPG; portadas.py llama a este script al terminar.
"""
import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent
IMG = RAIZ / "img"
TRABAJOS = [  # (carpeta fuente, subcarpeta destino, ancho)
    (IMG / "cuadros", "mini", 96),
    (IMG / "cuadros", "medio", 360),
    (IMG / "portadas", "medio", 360),
]


def hacer(origen: Path, destino: Path, ancho: int | None, todas: bool) -> bool:
    if not todas and destino.exists() and destino.stat().st_mtime >= origen.stat().st_mtime:
        return False
    im = Image.open(origen).convert("RGB")
    if ancho:
        im = im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)
    destino.parent.mkdir(parents=True, exist_ok=True)
    im.save(destino, "WEBP", quality=78 if ancho and ancho < 200 else 72 if ancho and ancho > 600 else 80, method=6)
    return True


def hacer_og(origen: Path, destino: Path, todas: bool) -> bool:
    """Portada centrada sobre un fondo de la misma portada, ampliada, difuminada y oscurecida."""
    if not todas and destino.exists() and destino.stat().st_mtime >= origen.stat().st_mtime:
        return False
    w, h = 1200, 630
    p = Image.open(origen).convert("RGB")
    fondo = p.resize((w, round(p.height * w / p.width)), Image.LANCZOS)
    arriba = (fondo.height - h) // 2
    fondo = fondo.crop((0, arriba, w, arriba + h)).filter(ImageFilter.GaussianBlur(28))
    fondo = Image.blend(ImageEnhance.Brightness(fondo).enhance(0.55), Image.new("RGB", (w, h), (74, 20, 26)), 0.35)
    alto = 570
    ancho = round(p.width * alto / p.height)
    x, y = (w - ancho) // 2, (h - alto) // 2
    sombra = Image.new("L", (ancho + 60, alto + 60), 0)
    ImageDraw.Draw(sombra).rectangle((30, 30, ancho + 30, alto + 30), fill=170)
    fondo.paste((15, 5, 6), (x - 30, y - 18), sombra.filter(ImageFilter.GaussianBlur(14)))
    fondo.paste(p.resize((ancho, alto), Image.LANCZOS), (x, y))
    destino.parent.mkdir(parents=True, exist_ok=True)
    fondo.save(destino, "JPEG", quality=82, optimize=True, progressive=True)
    return True


def generar(nombres=None, todas=False) -> int:
    """Rehace las miniaturas de esos nombres (o de todos) y borra las que quedaron huérfanas."""
    hechas = 0
    for fuente, sub, ancho in TRABAJOS:
        jpgs = {p.stem: p for p in fuente.glob("*.jpg")}
        for n, p in jpgs.items():
            if nombres is None or n in nombres:
                hechas += hacer(p, fuente / sub / f"{n}.webp", ancho, todas)
        for w in (fuente / sub).glob("*.webp"):
            if w.stem not in jpgs:
                w.unlink()
                print(f"borrada {w.relative_to(RAIZ).as_posix()}")
    portadas = {p.stem: p for p in (IMG / "portadas").glob("*.jpg")}
    for n, p in portadas.items():
        if nombres is None or n in nombres:
            hechas += hacer_og(p, IMG / "portadas" / "og" / f"{n}.jpg", todas)
    for j in (IMG / "portadas" / "og").glob("*.jpg"):
        if j.stem not in portadas:
            j.unlink()
            print(f"borrada {j.relative_to(RAIZ).as_posix()}")
    hechas += hacer(IMG / "inicio-fenix.jpg", IMG / "inicio-fenix.webp", None, todas)
    hechas += hacer(IMG / "inicio-fenix.jpg", IMG / "inicio-fenix-movil.webp", 860, todas)
    return hechas


if __name__ == "__main__":
    a = argparse.ArgumentParser()
    a.add_argument("--todas", action="store_true")
    print(f"{generar(todas=a.parse_args().todas)} miniaturas hechas")
