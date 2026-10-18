# -*- coding: utf-8 -*-
"""Convierte un EPUB de libros/ en PDF (A5) con PyMuPDF, para ofrecer los dos formatos.

    python herramientas/epub_a_pdf.py libros/<archivo>.epub
"""
import sys
from pathlib import Path

import fitz  # PyMuPDF


def convertir(epub: Path) -> Path:
    doc = fitz.open(str(epub))
    doc.layout(width=420, height=595, fontsize=11)  # A5 en puntos
    pdf = fitz.open("pdf", doc.convert_to_pdf())
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
