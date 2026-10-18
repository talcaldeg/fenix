# -*- coding: utf-8 -*-
"""Portada de un libro: la imagen del sitio y la portada dentro del EPUB.

    python herramientas/portadas.py <id> <cuadro.jpg> --titulo "..." --autor "..." [--cx 0.5] [--cy 0.5] [--epub libros/<archivo>.epub]

- Recorta el cuadro a 2:3 alrededor de (cx, cy) (0 a 1, desde arriba a la izquierda) y lo deja en
  img/portadas/<id>.jpg, que usa el sitio (lista, recomendados y ficha).
- Con --epub, arma la portada con título y autor sobre el cuadro y la pone como portada del EPUB:
  reemplaza la de Gutenberg si la hay, o la agrega al inicio. Después se regenera el PDF con
  herramientas/epub_a_pdf.py.
El cuadro debe ser de dominio público (Wikimedia Commons); su crédito va en `imagen` de datos.js.
"""
import argparse
import re
import zipfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
FUENTES = Path("C:/Windows/Fonts")
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


def partir(texto, fuente, ancho, d):
    lineas, actual = [], ""
    for p in texto.split():
        prueba = (actual + " " + p).strip()
        if d.textlength(prueba, font=fuente) <= ancho or not actual:
            actual = prueba
        else:
            lineas.append(actual)
            actual = p
    return lineas + [actual]


def portada_libro(cuadro: Image.Image, titulo: str, autor: str) -> Image.Image:
    im = cuadro.resize((1200, 1800), Image.LANCZOS)
    w, h = im.size
    # Degradado oscuro abajo para que el texto se lea sobre cualquier cuadro.
    sombra = Image.new("L", (1, h))
    for y in range(h):
        sombra.putpixel((0, y), int(235 * max(0, (y - h * 0.45) / (h * 0.55)) ** 1.2))
    im.paste(Image.new("RGB", (w, h), (22, 15, 12)), (0, 0), sombra.resize((w, h)))
    d = ImageDraw.Draw(im)
    f_tit = ImageFont.truetype(str(FUENTES / "georgiab.ttf"), 92)
    f_aut = ImageFont.truetype(str(FUENTES / "georgia.ttf"), 50)
    f_sel = ImageFont.truetype(str(FUENTES / "georgia.ttf"), 34)
    margen = 90
    lin_t = partir(titulo, f_tit, w - 2 * margen, d)
    lin_a = partir(autor, f_aut, w - 2 * margen, d)
    y = h - 150 - len(lin_a) * 64 - 40 - len(lin_t) * 108
    for l in lin_t:
        d.text((margen, y), l, font=f_tit, fill=(255, 248, 236))
        y += 108
    y += 40
    for l in lin_a:
        d.text((margen, y), l, font=f_aut, fill=(232, 214, 190))
        y += 64
    d.text((margen, h - 100), "PROYECTO FÉNIX", font=f_sel, fill=(214, 170, 90))
    d.rectangle((40, 40, w - 40, h - 40), outline=(255, 240, 210), width=3)
    return im


def poner_en_epub(epub: Path, portada: Image.Image, titulo: str):
    z = zipfile.ZipFile(epub)
    archivos = {i.filename: z.read(i.filename) for i in z.infolist()}
    z.close()
    opf_ruta = re.search(r'full-path="([^"]+)"', archivos["META-INF/container.xml"].decode("utf-8")).group(1)
    base = opf_ruta.rsplit("/", 1)[0] + "/" if "/" in opf_ruta else ""
    opf = archivos[opf_ruta].decode("utf-8")
    from io import BytesIO
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
            pagina = ('<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n'
                      '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">\n'
                      f'<head><title>{titulo}</title><style>body{{margin:0;padding:0;text-align:center}}'
                      'img{max-width:100%;max-height:100vh}</style></head>\n'
                      f'<body epub:type="cover"><img src="{NOMBRE_EN_EPUB}" alt="{titulo}"/></body></html>\n')
            archivos[base + "fenix-portada.xhtml"] = pagina.encode("utf-8")
            opf = opf.replace("</manifest>", '<item href="fenix-portada.xhtml" id="fenix-portada-pag" media-type="application/xhtml+xml"/>\n  </manifest>', 1)
            opf = re.sub(r"(<spine[^>]*>)", r'\1\n    <itemref idref="fenix-portada-pag"/>', opf, count=1)
        archivos[opf_ruta] = opf.encode("utf-8")

    with zipfile.ZipFile(epub, "w") as z:
        z.writestr(zipfile.ZipInfo("mimetype"), archivos.pop("mimetype"), compress_type=zipfile.ZIP_STORED)
        for nombre, datos in archivos.items():
            z.writestr(nombre, datos, compress_type=zipfile.ZIP_DEFLATED)


def main():
    a = argparse.ArgumentParser()
    a.add_argument("id")
    a.add_argument("cuadro", type=Path)
    a.add_argument("--titulo", required=True)
    a.add_argument("--autor", required=True)
    a.add_argument("--cx", type=float, default=0.5)
    a.add_argument("--cy", type=float, default=0.5)
    a.add_argument("--epub", type=Path)
    o = a.parse_args()
    cuadro = recortar(o.cuadro, 1200, o.cx, o.cy)
    salida = RAIZ / "img" / "portadas" / f"{o.id}.jpg"
    salida.parent.mkdir(parents=True, exist_ok=True)
    cuadro.resize((600, 900), Image.LANCZOS).save(salida, "JPEG", quality=82, optimize=True, progressive=True)
    print(f"{salida.relative_to(RAIZ)}: {salida.stat().st_size // 1024} KB")
    if o.epub:
        poner_en_epub(o.epub, portada_libro(cuadro, o.titulo, o.autor), o.titulo)
        print(f"{o.epub}: portada puesta")


if __name__ == "__main__":
    main()
