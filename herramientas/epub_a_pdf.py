# -*- coding: utf-8 -*-
"""Convierte un EPUB de libros/ en PDF con PyMuPDF, para ofrecer los dos formatos.

    python herramientas/epub_a_pdf.py libros/<archivo>.epub [--hoja 104x174]

La hoja es A5 salvo para los libros de HOJAS, que copian la página de su original; --hoja (en
milímetros) manda sobre las dos. Si MuPDF achica un dibujo con {width=N%} porque no cabe en lo
que queda de la página, ese dibujo pasa a la página siguiente (solo en el PDF, el EPUB no cambia).
"""
import argparse
import io
import re
import sys
import zipfile
from pathlib import Path

import fitz  # PyMuPDF

sys.path.insert(0, str(Path(__file__).resolve().parent))
from anclas import arreglar  # noqa: E402

MM = 72 / 25.4
A5 = (148, 210)  # mm
# Hoja del original, en mm. Con el margen de página de MuPDF (2em) y el 4 % del cuerpo, en
# 104 mm de ancho la caja de texto queda en el 78 % del ancho, como en el original.
HOJAS = {
    "saint-exupery-el-principito": (104, 174),  # Gallimard 1984, alto/ancho 1,68
}

IMG_ANCHO = re.compile(r'<img src="([^"]+)" style="width: (\d+)%"')
LETRA = 11  # pt; MuPDF deja 2em de margen de página


def rehacer_enlaces(doc, pdf) -> None:
    """convert_to_pdf deja todo enlace interno apuntando a la página 1 (la portada) y no copia
    el índice lateral: se reponen desde el EPUB ya diagramado, que tiene las mismas páginas."""
    for i in range(pdf.page_count):
        pag = pdf[i]
        for l in pag.get_links():
            if l["kind"] == fitz.LINK_GOTO:
                pag.delete_link(l)
        for l in doc[i].get_links():
            if l["kind"] == fitz.LINK_GOTO and l.get("page", -1) >= 0:
                pag.insert_link({"kind": fitz.LINK_GOTO, "from": l["from"],
                                 "page": l["page"], "to": l["to"]})
    pdf.set_toc(doc.get_toc())


def spine(z: zipfile.ZipFile) -> tuple:
    """(carpeta del OPF, rutas de los xhtml en el orden del spine)."""
    opf = next(n for n in z.namelist() if n.endswith(".opf"))
    base = opf.rpartition("/")[0] + "/" if "/" in opf else ""
    texto = z.read(opf).decode("utf-8")
    hrefs = {}  # portadas.py y exlibris.py escriben sus <item> con otro orden de atributos
    for item in re.findall(r"<item\b[^>]*>", texto):
        attrs = dict(re.findall(r'(\w[\w-]*)="([^"]*)"', item))
        hrefs[attrs.get("id")] = attrs.get("href")
    return base, [base + hrefs[i] for i in re.findall(r'<itemref idref="([^"]+)"', texto)]


def paginas_de_imagen(z: zipfile.ZipFile, doc, pdf) -> None:
    """La portada y el ex libris van en una envoltura SVG con preserveAspectRatio="meet", pero
    MuPDF la rasteriza en 816 x 1056 (carta) y estira eso a la caja de la página: la imagen sale
    deformada (un 9 % en A5, un 31 % en la hoja de El principito). Esas páginas se rehacen: el
    color de fondo de la envoltura de canto a canto y la imagen entera, sin deformar, al centro."""
    base, xhtmls = spine(z)
    for i in range(doc.page_count):
        cap, sub = doc.location_from_page_number(i)
        if sub or cap >= len(xhtmls):
            continue
        xhtml = z.read(xhtmls[cap]).decode("utf-8")
        img = re.search(r'<image\b[^>]*xlink:href="([^"]+)"', xhtml)
        if "<svg" not in xhtml or not img or re.search(r"<p\b", xhtml):
            continue
        fondo = re.search(r'<rect\b[^>]*fill="#([0-9a-fA-F]{6})"', xhtml)
        color = tuple(int(fondo.group(1)[k:k + 2], 16) / 255 for k in (0, 2, 4)) if fondo else (1, 1, 1)
        datos = z.read(xhtmls[cap].rpartition("/")[0] + "/" + img.group(1) if "/" in xhtmls[cap]
                       else img.group(1))
        pm = fitz.Pixmap(datos)
        r = pdf[i].rect
        esc = min(r.width / pm.width, r.height / pm.height)
        w, h = pm.width * esc, pm.height * esc
        pdf.delete_page(i)
        pag = pdf.new_page(i, width=r.width, height=r.height)
        pag.draw_rect(r, color=None, fill=color)
        pag.insert_image(fitz.Rect((r.width - w) / 2, (r.height - h) / 2,
                                   (r.width + w) / 2, (r.height + h) / 2), stream=datos)


def dibujos_con_ancho(z: zipfile.ZipFile) -> list:
    """(xhtml, posición del <img>, ancho pedido, tamaño en píxeles), en el orden del spine."""
    base, xhtmls = spine(z)
    dibujos = []
    for nombre in xhtmls:
        xhtml = z.read(nombre).decode("utf-8")
        for m in IMG_ANCHO.finditer(xhtml):
            pm = fitz.Pixmap(z.read(base + m.group(1)))
            dibujos.append((nombre, m.start(), int(m.group(2)), (pm.width, pm.height)))
    return dibujos


def achicados(doc, dibujos: list) -> list:
    """(índice, página, bbox) de los dibujos que salen más angostos que su % de la caja de texto."""
    bordes = [(b[0], b[2]) for p in doc for b in p.get_text("blocks")
              if b[6] == 0 and b[2] - b[0] > 0.6 * p.rect.width]
    caja = max(x1 for _, x1 in bordes) - min(x0 for x0, _ in bordes)
    salida, i = [], 0
    for p in doc:
        for info in p.get_image_info():
            if i < len(dibujos) and (info["width"], info["height"]) == dibujos[i][3]:
                r = fitz.Rect(info["bbox"])
                if r.width < dibujos[i][2] / 100 * caja - 1:
                    salida.append((i, p.number, r))
                i += 1
    return salida


def con_relleno(z: zipfile.ZipFile, dibujos: list, relleno: dict) -> bytes:
    """Copia del EPUB con un bloque vacío de `relleno[i]` pt antes del <figure> del dibujo i.
    MuPDF no respeta break-before ni page-break-before (probado en 1.29): un dibujo que no cabe
    en lo que queda de la página se achica hasta caber; el bloque vacío completa la página y el
    dibujo parte en la siguiente."""
    por_archivo = {}
    for i, alto in relleno.items():
        nombre, pos = dibujos[i][:2]
        por_archivo.setdefault(nombre, []).append((pos, alto))
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as nuevo:
        for item in z.infolist():
            datos = z.read(item)
            if item.filename in por_archivo:
                xhtml = datos.decode("utf-8")
                for pos, alto in sorted(por_archivo[item.filename], reverse=True):
                    fig = xhtml.rindex("<figure", 0, pos)
                    xhtml = xhtml[:fig] + f'<div style="height: {alto:.1f}pt"></div>' + xhtml[fig:]
                datos = xhtml.encode("utf-8")
            # ZipInfo nuevo: writestr reescribe el que recibe y z ya no podría leer esa entrada
            nuevo.writestr(zipfile.ZipInfo(item.filename, item.date_time), datos,
                           compress_type=item.compress_type)
    return buf.getvalue()


def maquetar(epub: Path, hoja: tuple):
    """Diagrama el EPUB y pasa a la página siguiente cada dibujo que MuPDF achicaría, de a uno y
    en orden, porque cada uno corre los que vienen después."""
    ancho, alto = hoja[0] * MM, hoja[1] * MM
    z = zipfile.ZipFile(epub)
    dibujos = dibujos_con_ancho(z)
    relleno, no_caben = {}, set()
    doc = fitz.open(str(epub))
    doc.layout(width=ancho, height=alto, fontsize=LETRA)
    while dibujos:
        pendientes = [a for a in achicados(doc, dibujos) if a[0] not in no_caben]
        if not pendientes:
            break
        i, pag, r = pendientes[0]
        arriba = [b[3] for b in doc[pag].get_text("blocks") if b[6] == 0 and b[3] <= r.y0 + 1]
        if not arriba or relleno.get(i, 0) > alto / 2:
            no_caben.add(i)  # parte arriba de la página y aun así se achica: es más alto que ella
            continue
        # la primera vez, lo que queda hasta el margen inferior; si no alcanza, de a poco más
        relleno[i] = relleno[i] + 3 if i in relleno else alto - 2 * LETRA - max(arriba)
        doc = fitz.open(stream=con_relleno(z, dibujos, relleno), filetype="epub")
        doc.layout(width=ancho, height=alto, fontsize=LETRA)
    if relleno:
        print(f"{epub.name}: {len(relleno)} dibujos pasan a la página siguiente para no achicarse")
    if no_caben:
        print(f"{epub.name}: siguen achicados (no caben en una página): "
              + ", ".join(str(i + 1) for i in sorted(no_caben)))
    return doc


def convertir(epub: Path, hoja: tuple | None = None) -> Path:
    arreglar(epub)
    doc = maquetar(epub, hoja or HOJAS.get(epub.stem, A5))
    pdf = fitz.open("pdf", doc.convert_to_pdf())
    paginas_de_imagen(zipfile.ZipFile(epub), doc, pdf)
    rehacer_enlaces(doc, pdf)
    meta = doc.metadata or {}
    pdf.set_metadata({"title": meta.get("title", ""), "author": meta.get("author", ""),
                      "subject": "Proyecto Fénix", "creator": "Proyecto Fénix"})
    salida = epub.with_suffix(".pdf")
    pdf.save(str(salida), garbage=4, deflate=True)
    print(f"{salida.name}: {pdf.page_count} páginas, {salida.stat().st_size // 1024} KB")
    return salida


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("epubs", nargs="+", type=Path)
    ap.add_argument("--hoja", help="ancho x alto en mm, p. ej. 104x174 (por defecto, HOJAS o A5)")
    args = ap.parse_args()
    hoja = tuple(float(x) for x in args.hoja.lower().split("x")) if args.hoja else None
    for a in args.epubs:
        convertir(a, hoja)
