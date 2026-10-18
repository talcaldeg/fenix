# -*- coding: utf-8 -*-
"""Logo de Fénix: un libro abierto cuyas páginas se levantan como las alas del ave.

Única fuente del dibujo. De aquí salen img/favicon.svg (que también usa el encabezado del sitio),
la viñeta y el sello de las portadas (marco.py) y el timbre del exlibris (exlibris.py).

    python herramientas/logo.py      (reescribe img/favicon.svg e imprime el data URI para index.html)

- Caja 64 x 64. Las alas-página tienen tres plumas: los dos cortes de cada lado se dibujan como
  trazo del color de fondo, así que `marca()` necesita saber sobre qué color va.
- Se eligió el 18-oct-2026 en vez de la llama anterior: una llama sola, en una biblioteca, se lee
  como libros quemándose, y no se veía el fénix.
"""
from pathlib import Path
from urllib.parse import quote

RAIZ = Path(__file__).resolve().parent.parent
VINO, ORO = "#6b1d24", "#e8b04a"

CUERPO = (
    '<path d="M31 56C24 52 15 51 7 53L6.5 46.5 4.5 45.5 6 38.5 3.5 37 5 29 2.5 27.5 2.5 7.5C8 17 19 26 31 36.5Z"/>'
    '<path d="M33 56C40 52 49 51 57 53L57.5 46.5 59.5 45.5 58 38.5 60.5 37 59 29 61.5 27.5 61.5 7.5C56 17 45 26 33 36.5Z"/>'
    '<path d="M32 38C29.3 33 28.9 27.6 29.8 22.8C30.7 18.4 33.4 15.6 37.2 16.1L42.6 18 37.6 20.1C36 23 35.7 28 34.8 32.8Z"/>'
    '<path d="M31.4 19.4C28 17 26.6 13.2 27.7 9.2C28.8 12.4 30.6 14 33 15.2Z"/>'
    '<path d="M33.6 16.4C32.4 12.8 33.2 9.4 35.4 6.8C35.2 10.2 36.1 12.4 37.5 14.4Z"/>'
)
CORTES = ("M5 45.2C13 42.6 22 43.4 30.4 48.2M4.6 36.8C11.6 33.6 19.6 34.2 27.4 39.2"
          "M59 45.2C51 42.6 42 43.4 33.6 48.2M59.4 36.8C52.4 33.6 44.4 34.2 36.6 39.2")


def marca(tinta, fondo):
    """El dibujo en la caja de 64, de color `tinta` sobre `fondo` (los cortes van del color del fondo)."""
    return (f'<g fill="{tinta}">{CUERPO}</g>'
            f'<path d="{CORTES}" fill="none" stroke="{fondo}" stroke-width="2.4" stroke-linecap="round"/>')


def favicon():
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
            f'<rect width="64" height="64" rx="14" fill="{VINO}"/>{marca(ORO, VINO)}</svg>')


def data_uri():
    return "data:image/svg+xml," + quote(favicon(), safe="/")


if __name__ == "__main__":
    (RAIZ / "img" / "favicon.svg").write_text(favicon(), encoding="utf-8")
    print(data_uri())
