# -*- coding: utf-8 -*-
"""Arregla los enlaces del índice que caen al final del capítulo anterior.

Los EPUB de Gutenberg dejan a veces el ancla de un capítulo (`<a id="chap19"/>`) al final del
archivo anterior, sin texto después: el índice lleva una página antes del capítulo, en el lector
de EPUB y en el PDF. Cada enlace a un ancla así pasa a apuntar al inicio del archivo siguiente
del spine. Lo corre epub_a_pdf.py antes de sacar el PDF; no toca un EPUB que no lo necesita.

    python herramientas/anclas.py libros/<archivo>.epub
"""
import posixpath
import re
import sys
import zipfile
from pathlib import Path


def arreglar(epub: Path) -> int:
    z = zipfile.ZipFile(epub)
    archivos = {i.filename: z.read(i.filename) for i in z.infolist()}
    z.close()
    opf_ruta = re.search(r'full-path="([^"]+)"', archivos["META-INF/container.xml"].decode("utf-8")).group(1)
    base = posixpath.dirname(opf_ruta)
    opf = archivos[opf_ruta].decode("utf-8")
    items = {m.group(1): m.group(2) for m in re.finditer(r'<item\b(?=[^>]*\bid="([^"]+)")(?=[^>]*\bhref="([^"]+)")', opf)}
    spine = [posixpath.join(base, items[i]) for i in re.findall(r'<itemref\b[^>]*\bidref="([^"]+)"', opf) if i in items]

    # Anclas sin texto después en su archivo -> archivo siguiente del spine; anclas vacías antes
    # de un título con id (separadas por un espacio que empuja el título a la página siguiente)
    # -> ese título.
    destino = {}
    for k, n in enumerate(spine):
        t = archivos.get(n, b"").decode("utf-8", "replace")
        for m in re.finditer(r'\sid="([^"]+)"', t):
            resto = t[t.index(">", m.end()) + 1:]
            if not re.sub(r"<[^>]+>", "", resto).strip():
                if k + 1 < len(spine):
                    destino[(n, m.group(1))] = spine[k + 1]
                continue
            h = re.search(r'<h[1-6]\b[^>]*\bid="([^"]+)"', resto)
            if h and h.group(1) != m.group(1) and not re.sub(r"<!--.*?-->|<[^>]+>", "", resto[:h.start()], flags=re.S).strip():
                destino[(n, m.group(1))] = f"{n}#{h.group(1)}"
    if not destino:
        return 0

    cambios = 0
    for n in list(archivos):
        if not n.endswith((".xhtml", ".html", ".htm", ".ncx")):
            continue
        t = archivos[n].decode("utf-8")
        carpeta = posixpath.dirname(n)

        def cambiar(m):
            nonlocal cambios
            archivo, ancla = m.group(2), m.group(3)
            nuevo = destino.get((posixpath.normpath(posixpath.join(carpeta, archivo)) if archivo else n, ancla))
            if not nuevo:
                return m.group(0)
            cambios += 1
            return f'{m.group(1)}="{posixpath.relpath(nuevo, carpeta)}"'

        nuevo = re.sub(r'\b(href|src)="([^"#:]*)#([^"]+)"', cambiar, t)
        if nuevo != t:
            archivos[n] = nuevo.encode("utf-8")
    if cambios:
        with zipfile.ZipFile(epub, "w") as z:
            z.writestr(zipfile.ZipInfo("mimetype"), archivos.pop("mimetype"), compress_type=zipfile.ZIP_STORED)
            for nombre, datos in archivos.items():
                z.writestr(nombre, datos, compress_type=zipfile.ZIP_DEFLATED)
        print(f"{epub.name}: {cambios} enlaces llevados al inicio de su capítulo")
    return cambios


if __name__ == "__main__":
    for a in sys.argv[1:]:
        arreglar(Path(a))
