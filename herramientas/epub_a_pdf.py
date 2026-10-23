# -*- coding: utf-8 -*-
"""Convierte un EPUB de libros/ en PDF (A5) con PyMuPDF, para ofrecer los dos formatos.

    python herramientas/epub_a_pdf.py libros/<archivo>.epub
"""
import sys
from pathlib import Path

import fitz  # PyMuPDF

sys.path.insert(0, str(Path(__file__).resolve().parent))
from anclas import arreglar  # noqa: E402


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


def convertir(epub: Path) -> Path:
    arreglar(epub)
    doc = fitz.open(str(epub))
    doc.layout(width=420, height=595, fontsize=11)  # A5 en puntos
    pdf = fitz.open("pdf", doc.convert_to_pdf())
    rehacer_enlaces(doc, pdf)
    meta = doc.metadata or {}
    pdf.set_metadata({"title": meta.get("title", ""), "author": meta.get("author", ""),
                      "subject": "Proyecto Fénix", "creator": "Proyecto Fénix"})
    salida = epub.with_suffix(".pdf")
    pdf.save(str(salida), garbage=4, deflate=True)
    print(f"{salida.name}: {pdf.page_count} páginas, {salida.stat().st_size // 1024} KB")
    return salida


if __name__ == "__main__":
    for a in sys.argv[1:]:
        convertir(Path(a))
