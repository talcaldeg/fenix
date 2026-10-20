# -*- coding: utf-8 -*-
"""Portada de un libro: el cuadro con el marco Fénix, para el sitio y dentro del EPUB.

    python herramientas/portadas.py <nombre> --cuadro <original.jpg> [--cx 0.5] [--cy 0.5] [--epub]
    python herramientas/portadas.py <nombre> [<nombre> ...] [--epub]
    python herramientas/portadas.py --todos [--epub]

<nombre> es el de la imagen en datos.js: img/portadas/<nombre>.jpg (casi siempre el id del libro;
una versión en otro idioma lleva su propia imagen, p. ej. imitacion-de-cristo-en).

- Con --cuadro, recorta el original a 2:3 alrededor de (cx, cy) (0 a 1, desde arriba a la
  izquierda) y lo guarda sin marco en img/cuadros/<nombre>.jpg, de donde se regenera todo.
- Arma la portada con el marco (herramientas/marco.py: códice para lectura y oración, enredadera
  para lo demás) con título, autor y categoría de datos.js, y la deja en img/portadas/<nombre>.jpg,
  que usa el sitio. Un libro que aún no está en datos.js lleva --titulo, --autor y --categoria.
- Con --epub, pone la portada en el EPUB de esa ficha o versión (reemplaza la de Gutenberg si la
  hay, o la agrega al inicio) y regenera su PDF con herramientas/epub_a_pdf.py.
Solo para libros sin portada oficial (una imagen con URL externa se deja como está). El cuadro debe
ser de dominio público (Wikimedia Commons); su crédito va en `imagen` de datos.js.
"""
import argparse
import json
import re
import subprocess
import sys
import tempfile
import zipfile
from io import BytesIO
from pathlib import Path
from xml.sax.saxutils import escape

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
import marco  # noqa: E402
from epub_a_pdf import convertir  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
CUADROS = RAIZ / "img" / "cuadros"
PORTADAS = RAIZ / "img" / "portadas"
NOMBRE_EN_EPUB = "fenix-portada.jpg"


def recortar(origen: Path, ancho: int, cx: float, cy: float) -> Image.Image:
    im = Image.open(origen).convert("RGB")
    w, h = im.size
    if w / h > 2 / 3:
        nw, nh = round(h * 2 / 3), h
    else:
        nw, nh = w, round(w * 3 / 2)
    x = min(max(round(cx * w - nw / 2), 0), w - nw)
    y = min(max(round(cy * h - nh / 2), 0), h - nh)
    return im.crop((x, y, x + nw, y + nh)).resize((ancho, ancho * 3 // 2), Image.LANCZOS)


def catalogo():
    """Cada portada del catálogo: nombre, título, autor, categoría y EPUB (ficha y versiones)."""
    js = ("global.window={};require(process.argv[1]);"
          "console.log(JSON.stringify(window.FENIX.libros))")
    libros = json.loads(subprocess.run(["node", "-e", js, str(RAIZ / "datos.js")], check=True,
                                       capture_output=True, encoding="utf-8").stdout)
    out = {}
    for l in libros:
        fichas = [(l, l)] + [({**l, **v}, v) for v in (l.get("versiones") or {}).values()]
        for f, propia in fichas:
            img = (f.get("imagen") or {}).get("src", "")
            if not img or img.startswith("http"):
                continue  # sin imagen o portada oficial
            if propia is not l and "imagen" not in propia:
                sys.exit(f"{l['id']}: la versión «{f['titulo']}» necesita su propia imagen en datos.js")
            nombre = Path(img).stem
            out[nombre] = {"titulo": f["titulo"], "autor": f["autor"], "categoria": l["categoria"],
                           "epub": (propia.get("archivos") or {}).get("epub")}
    return out


def pagina_portada(portada: Image.Image, titulo: str, href: str = NOMBRE_EN_EPUB,
                   tipo: str = "cover") -> bytes:
    """Página de imagen (portada o exlibris) como envoltura SVG: los lectores (Play Books, Apple
    Books, Kobo) la escalan a la pantalla completa sin recortarla. Un <img> con max-height:100vh queda chico.
    Lo que sobra de pantalla toma el color del borde de la portada, no el negro del lector."""
    w, h = portada.size
    titulo = escape(titulo)
    fondo = "#%02x%02x%02x" % portada.getpixel((2, h // 2))[:3]
    return ('<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n'
            '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">\n'
            f'<head><title>{titulo}</title>'
            f'<style>html,body{{margin:0;padding:0;height:100%;background:{fondo}}}'
            'svg{display:block;width:100%;height:100%;overflow:visible}</style></head>\n'
            f'<body epub:type="{tipo}"><svg xmlns="http://www.w3.org/2000/svg" '
            'xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="100%" height="100%" '
            f'viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid meet" overflow="visible">'
            f'<rect x="-{w}" y="-{h}" width="{3 * w}" height="{3 * h}" fill="{fondo}"/>'
            f'<image width="{w}" height="{h}" xlink:href="{href}"><title>{titulo}</title></image>'
            '</svg></body></html>\n').encode("utf-8")


def poner_en_epub(epub: Path, portada: Image.Image, titulo: str):
    z = zipfile.ZipFile(epub)
    archivos = {i.filename: z.read(i.filename) for i in z.infolist()}
    z.close()
    opf_ruta = re.search(r'full-path="([^"]+)"', archivos["META-INF/container.xml"].decode("utf-8")).group(1)
    base = opf_ruta.rsplit("/", 1)[0] + "/" if "/" in opf_ruta else ""
    opf = archivos[opf_ruta].decode("utf-8")
    buf = BytesIO()
    portada.save(buf, "JPEG", quality=85)
    archivos[base + NOMBRE_EN_EPUB] = buf.getvalue()

    if NOMBRE_EN_EPUB not in opf:
        # Quitar la marca de portada anterior y declarar la nueva.
        opf = re.sub(r'\s*properties="cover-image"', "", opf)
        opf = re.sub(r'<meta name="cover"[^>]*/>\s*', "", opf)
        item = f'<item href="{NOMBRE_EN_EPUB}" id="fenix-portada" media-type="image/jpeg" properties="cover-image"/>'
        opf = opf.replace("</manifest>", item + "\n  </manifest>", 1)
        opf = re.sub(r"(<metadata[^>]*>)", r'\1\n    <meta name="cover" content="fenix-portada"/>', opf, count=1)
        envoltura = re.search(r'<item [^>]*href="([^"]+)"[^>]*id="coverpage-wrapper"', opf)
        if envoltura:
            # Gutenberg: la página de portada apunta a su imagen; se la cambia por la nuestra.
            ruta = base + envoltura.group(1)
            x = archivos[ruta].decode("utf-8")
            x = re.sub(r'(xlink:href|href|src)="[^"]+\.(png|jpg|jpeg)"', rf'\1="{NOMBRE_EN_EPUB}"', x)
            x = re.sub(r'viewBox="[^"]+"', 'viewBox="0 0 1200 1800"', x)
            x = re.sub(r'(<image[^>]*?)width="\d+"', r'\1width="1200"', x)
            x = re.sub(r'(<image[^>]*?)height="\d+"', r'\1height="1800"', x)
            archivos[ruta] = x.encode("utf-8")
        else:
            opf = opf.replace("</manifest>", '<item href="fenix-portada.xhtml" id="fenix-portada-pag" media-type="application/xhtml+xml" properties="svg"/>\n  </manifest>', 1)
            opf = re.sub(r"(<spine[^>]*>)", r'\1\n    <itemref idref="fenix-portada-pag"/>', opf, count=1)
    if base + "fenix-portada.xhtml" in archivos or 'id="fenix-portada-pag"' in opf:
        # Se reescribe siempre, para que un EPUB con la página vieja (<img>) quede al día.
        archivos[base + "fenix-portada.xhtml"] = pagina_portada(portada, titulo)
        opf = re.sub(r'(<item [^>]*id="fenix-portada-pag" media-type="application/xhtml\+xml")\s*/>',
                     r'\1 properties="svg"/>', opf)
    envoltura = re.search(r'<item [^>]*href="([^"]+)"[^>]*id="coverpage-wrapper"', opf)
    if envoltura and NOMBRE_EN_EPUB in opf:
        # La envoltura de Gutenberg no da altura a html, body ni a su div, así que el SVG queda
        # chico en Play Books: se la reemplaza por la nuestra.
        archivos[base + envoltura.group(1)] = pagina_portada(portada, titulo)
    archivos[opf_ruta] = opf.encode("utf-8")

    with zipfile.ZipFile(epub, "w") as z:
        z.writestr(zipfile.ZipInfo("mimetype"), archivos.pop("mimetype"), compress_type=zipfile.ZIP_STORED)
        for nombre, datos in archivos.items():
            z.writestr(nombre, datos, compress_type=zipfile.ZIP_DEFLATED)


def generar(portadas: dict, con_epub: bool):
    PORTADAS.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        trabajos = []
        for nombre, p in portadas.items():
            cuadro = CUADROS / f"{nombre}.jpg"
            if not cuadro.exists():
                sys.exit(f"{nombre}: falta {cuadro.relative_to(RAIZ)} (páselo con --cuadro)")
            trabajos.append((marco.svg(cuadro, p["titulo"], p["autor"], p["categoria"]), Path(tmp) / f"{nombre}.png"))
        marco.rasterizar(trabajos)
        for nombre, p in portadas.items():
            grande = Image.open(Path(tmp) / f"{nombre}.png").convert("RGB")
            salida = PORTADAS / f"{nombre}.jpg"
            grande.resize((600, 900), Image.LANCZOS).save(salida, "JPEG", quality=84, optimize=True, progressive=True)
            print(f"{salida.relative_to(RAIZ).as_posix()}: {salida.stat().st_size // 1024} KB")
            if con_epub and p["epub"]:
                epub = RAIZ / p["epub"]
                poner_en_epub(epub, grande, p["titulo"])
                print(f"{p['epub']}: portada puesta")
                convertir(epub)


def main():
    a = argparse.ArgumentParser()
    a.add_argument("nombres", nargs="*")
    a.add_argument("--todos", action="store_true")
    a.add_argument("--cuadro", type=Path)
    a.add_argument("--cx", type=float, default=0.5)
    a.add_argument("--cy", type=float, default=0.5)
    a.add_argument("--titulo")
    a.add_argument("--autor")
    a.add_argument("--categoria")
    a.add_argument("--epub", action="store_true")
    o = a.parse_args()
    if o.todos == bool(o.nombres):
        a.error("indique uno o más nombres, o --todos")
    if o.cuadro:
        if len(o.nombres) != 1:
            a.error("--cuadro va con un solo nombre")
        CUADROS.mkdir(parents=True, exist_ok=True)
        destino = CUADROS / f"{o.nombres[0]}.jpg"
        recortar(o.cuadro, 600, o.cx, o.cy).save(destino, "JPEG", quality=88, optimize=True)
        print(f"{destino.relative_to(RAIZ).as_posix()}: cuadro guardado")
    todo = catalogo()
    if o.todos:
        elegidas = todo
    else:
        elegidas = {}
        for n in o.nombres:
            if n in todo:
                elegidas[n] = todo[n]
            elif o.titulo and o.autor and o.categoria:
                elegidas[n] = {"titulo": o.titulo, "autor": o.autor, "categoria": o.categoria, "epub": None}
            else:
                a.error(f"{n} no está en datos.js: agregue la ficha o pase --titulo, --autor y --categoria")
    generar(elegidas, o.epub)
    import miniaturas  # noqa: E402  (WebP livianas para el sitio)
    miniaturas.generar(set(elegidas))


if __name__ == "__main__":
    main()
