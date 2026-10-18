# -*- coding: utf-8 -*-
"""Arma un EPUB 3 desde la traducción en Markdown de la Editorial (carpeta editorial/<id>/).

    python herramientas/md_a_epub.py editorial/<id> libros/<archivo>.epub --titulo "..." --autor "..."

- Lee, en orden de nombre, los .md de la carpeta (menos nota.md). Cada `## ` abre un capítulo; el
  texto de un archivo sin encabezado sigue el capítulo anterior (tramos de un mismo capítulo).
- nota.md (si existe) va como «Nota de esta edición», después del índice.
- Notas `[^n]` con su `[^n]: texto` al final del tramo: se renumeran por capítulo y van al pie
  del capítulo. Párrafo en cursiva justo después del título: sumario del capítulo.
- Marcadores `libro.capítulo.párrafo` en su propia línea (Confesiones): el cambio de capítulo
  pone su número romano como subtítulo; el marcador no se imprime.
- Después: herramientas/portadas.py <id> ... --epub para la portada y herramientas/epub_a_pdf.py.
"""
import argparse
import html
import re
import uuid
import zipfile
from pathlib import Path

CSS = """@charset "utf-8";
body { font-family: Georgia, serif; line-height: 1.5; margin: 0 4%; }
h1, h2, h3 { font-weight: normal; text-align: center; break-after: avoid; page-break-after: avoid; }
h1 { font-size: 1.6em; margin: 2.5em 0 0.6em; }
h2 { font-size: 1.3em; margin: 2em 0 0.4em; letter-spacing: 0.04em; }
h3 { font-size: 1em; margin: 1.6em 0 0.6em; letter-spacing: 0.08em; }
p { margin: 0; text-indent: 1.4em; text-align: justify; hyphens: auto; -webkit-hyphens: auto; }
h1 + p, h2 + p, h3 + p, p.subtitulo + p, p.separador + p, p.verso + p { text-indent: 0; }
p.subtitulo { text-align: center; text-indent: 0; font-style: italic; margin: 0 1em 2em; }
p.separador { text-align: center; text-indent: 0; margin: 1em 0; letter-spacing: 0.5em; }
p.verso { text-indent: 0; text-align: left; margin: 0.8em 2em; }
sup { font-size: 0.7em; line-height: 0; }
a.ref { text-decoration: none; }
aside.notas { margin-top: 2.5em; border-top: 1px solid #999; padding-top: 0.6em; font-size: 0.85em; }
aside.notas p { text-indent: 0; margin: 0 0 0.4em; }
.portadilla { text-align: center; margin-top: 18%; }
.portadilla p { text-align: center; text-indent: 0; }
.portadilla .t1 { font-size: 1.7em; line-height: 1.3; margin-bottom: 0.4em; }
.portadilla .t2 { font-size: 1.1em; margin-bottom: 2.5em; }
.portadilla .t3 { font-style: italic; margin-bottom: 0.3em; }
.nota p { text-indent: 0; margin: 0 0 0.9em; }
"""
ROMANOS = [(1000, "M"), (900, "CM"), (500, "D"), (400, "CD"), (100, "C"), (90, "XC"), (50, "L"),
           (40, "XL"), (10, "X"), (9, "IX"), (5, "V"), (4, "IV"), (1, "I")]


def romano(n):
    s = ""
    for v, r in ROMANOS:
        while n >= v:
            s, n = s + r, n - v
    return s


def enlinea(t):
    t = html.escape(t, quote=False)
    t = re.sub(r"\\([*_\[\]])", r"\1", t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<em>\1</em>", t)
    return t


def pagina(titulo, cuerpo, tipo="bodymatter"):
    return ('<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n'
            '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" '
            'xml:lang="es" lang="es">\n<head><meta charset="utf-8"/>'
            f'<title>{html.escape(titulo)}</title><link rel="stylesheet" type="text/css" href="estilo.css"/>'
            f'</head>\n<body epub:type="{tipo}">\n{cuerpo}\n</body></html>\n')


def bloques(texto):
    """Separa párrafos, quitando cercos de código (se tratan como verso)."""
    texto = texto.replace("\r\n", "\n")
    texto = re.sub(r"(?ms)^```[^\n]*\n(.*?)^```\s*$", lambda m: "\n\n" + m.group(1).strip() + "\n\n", texto)
    return [b.strip("\n") for b in re.split(r"\n\s*\n", texto) if b.strip()]


class Capitulo:
    def __init__(self, titulo):
        self.titulo = titulo
        self.html = []
        self.notas = {}   # número original -> texto
        self.orden = []   # números originales en orden de llamada
        self.cap_actual = None


def leer(carpeta: Path):
    caps = []
    for md in sorted(carpeta.glob("*.md")):
        if md.name == "nota.md":
            continue
        txt = md.read_text(encoding="utf-8")
        defs = {}
        for m in re.finditer(r"(?ms)^\[\^(\d+)\]:\s*(.*?)(?=^\[\^\d+\]:|\Z)", txt):
            defs[m.group(1)] = " ".join(m.group(2).split())
        txt = re.sub(r"(?ms)^\[\^\d+\]:.*", "", txt, count=1) if defs else txt
        recien_titulo = False
        for b in bloques(txt):
            if b.startswith("## "):
                caps.append(Capitulo(b[3:].strip()))
                recien_titulo = True
                continue
            if not caps:
                caps.append(Capitulo(""))
            c = caps[-1]
            c.notas.update(defs)
            if re.fullmatch(r"\d+\.\d+\.\d+", b.strip()):
                _, cap, _ = b.strip().split(".")
                if cap != c.cap_actual:
                    c.cap_actual = cap
                    c.html.append(f"<h3>{romano(int(cap))}</h3>")
                continue
            if re.fullmatch(r"[\\*\s]+", b) or re.fullmatch(r"[-_*]{3,}", b.strip()):
                c.html.append('<p class="separador">* * *</p>')
                continue
            def llamada(m):
                n = m.group(1)
                if n not in c.orden:
                    c.orden.append(n)
                k = c.orden.index(n) + 1
                return f'<a class="ref" epub:type="noteref" href="#n{k}" id="r{k}"><sup>{k}</sup></a>'
            lineas = b.split("\n")
            cuerpo = "<br/>".join(enlinea(l.strip()) for l in lineas)
            cuerpo = re.sub(r"\[\^(\d+)\]", llamada, cuerpo)
            if recien_titulo and re.fullmatch(r"\*[^*].*\*", b.strip()):
                c.html.append(f'<p class="subtitulo">{enlinea(b.strip()[1:-1])}</p>')
            elif len(lineas) > 1:
                c.html.append(f'<p class="verso">{cuerpo}</p>')
            else:
                c.html.append(f"<p>{cuerpo}</p>")
            recien_titulo = False
    return caps


def armar(carpeta: Path, salida: Path, titulo: str, autor: str, subtitulo: str, original: str):
    caps = leer(carpeta)
    archivos = {"mimetype": b"application/epub+zip",
                "META-INF/container.xml": ('<?xml version="1.0" encoding="utf-8"?>\n<container version="1.0" '
                                           'xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles>'
                                           '<rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>'
                                           '</rootfiles></container>\n').encode("utf-8"),
                "OEBPS/estilo.css": CSS.encode("utf-8")}
    spine, toc = [], []

    porta = (f'<section class="portadilla" epub:type="titlepage"><p class="t1">{html.escape(titulo)}</p>'
             f'<p class="t2">{html.escape(autor)}</p><p class="t3">{html.escape(subtitulo)}</p>'
             '<p>Proyecto Fénix</p></section>')
    archivos["OEBPS/portadilla.xhtml"] = pagina(titulo, porta, "frontmatter").encode("utf-8")
    spine += ["portadilla", "nav"]

    nota = carpeta / "nota.md"
    if nota.exists():
        partes = [f"<p>{enlinea(b)}</p>" for b in bloques(nota.read_text(encoding="utf-8")) if not b.startswith("#")]
        archivos["OEBPS/nota.xhtml"] = pagina("Nota de esta edición", '<section class="nota" epub:type="foreword">'
                                              "<h1>Nota de esta edición</h1>" + "".join(partes) + "</section>",
                                              "frontmatter").encode("utf-8")
        spine.append("nota")
        toc.append(("nota.xhtml", "Nota de esta edición"))

    for i, c in enumerate(caps, 1):
        nombre = f"c{i:02d}"
        cuerpo = f"<section><h2>{enlinea(c.titulo)}</h2>\n" + "\n".join(c.html)
        if c.orden:
            cuerpo += '\n<aside class="notas" epub:type="footnotes">' + "".join(
                f'<p id="n{k}" epub:type="footnote"><a href="#r{k}">{k}</a>. {enlinea(c.notas.get(n, ""))}</p>'
                for k, n in enumerate(c.orden, 1)) + "</aside>"
            faltan = [n for n in c.orden if n not in c.notas]
            if faltan:
                print(f"AVISO {c.titulo}: notas sin texto {faltan}")
        cuerpo += "</section>"
        archivos[f"OEBPS/{nombre}.xhtml"] = pagina(re.sub(r"\*", "", c.titulo), cuerpo).encode("utf-8")
        spine.append(nombre)
        toc.append((f"{nombre}.xhtml", re.sub(r"\*", "", c.titulo)))

    lis = "".join(f'<li><a href="{h}">{html.escape(t)}</a></li>' for h, t in toc)
    archivos["OEBPS/nav.xhtml"] = pagina("Índice", f'<nav epub:type="toc" id="toc"><h1>Índice</h1><ol>{lis}</ol></nav>',
                                         "frontmatter").encode("utf-8")
    uid = f"urn:uuid:{uuid.uuid5(uuid.NAMESPACE_URL, 'fenix/' + salida.stem)}"
    puntos = "".join(f'<navPoint id="p{i}" playOrder="{i}"><navLabel><text>{html.escape(t)}</text></navLabel>'
                     f'<content src="{h}"/></navPoint>' for i, (h, t) in enumerate(toc, 1))
    archivos["OEBPS/toc.ncx"] = ('<?xml version="1.0" encoding="utf-8"?>\n<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" '
                                 f'version="2005-1"><head><meta name="dtb:uid" content="{uid}"/></head>'
                                 f'<docTitle><text>{html.escape(titulo)}</text></docTitle><navMap>{puntos}</navMap></ncx>\n').encode("utf-8")
    items = ['<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
             '<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>',
             '<item id="css" href="estilo.css" media-type="text/css"/>']
    items += [f'<item id="{s}" href="{s}.xhtml" media-type="application/xhtml+xml"/>' for s in spine if s != "nav"]
    refs = "".join(f'<itemref idref="{s}"/>' for s in spine)
    opf = ('<?xml version="1.0" encoding="utf-8"?>\n<package xmlns="http://www.idpf.org/2007/opf" version="3.0" '
           'unique-identifier="uid" xml:lang="es">\n  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">\n'
           f'    <dc:identifier id="uid">{uid}</dc:identifier>\n    <dc:title>{html.escape(titulo)}</dc:title>\n'
           f'    <dc:creator>{html.escape(autor)}</dc:creator>\n'
           '    <dc:contributor>Proyecto Fénix (traducción)</dc:contributor>\n    <dc:language>es</dc:language>\n'
           f'    <dc:publisher>Proyecto Fénix</dc:publisher>\n    <dc:source>{html.escape(original)}</dc:source>\n'
           '    <dc:rights>Traducción de Proyecto Fénix, CC BY-NC-SA 4.0</dc:rights>\n'
           '    <meta property="dcterms:modified">2026-10-18T00:00:00Z</meta>\n  </metadata>\n'
           f'  <manifest>\n    {chr(10).join(items)}\n  </manifest>\n  <spine toc="ncx">{refs}</spine>\n</package>\n')
    archivos["OEBPS/content.opf"] = opf.encode("utf-8")

    salida.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(salida, "w") as z:
        z.writestr(zipfile.ZipInfo("mimetype"), archivos.pop("mimetype"), compress_type=zipfile.ZIP_STORED)
        for n, d in archivos.items():
            z.writestr(n, d, compress_type=zipfile.ZIP_DEFLATED)
    palabras = sum(len(re.sub(r"<[^>]+>", " ", "".join(c.html)).split()) for c in caps)
    print(f"{salida}: {len(caps)} capítulos, {palabras} palabras")


if __name__ == "__main__":
    a = argparse.ArgumentParser()
    a.add_argument("carpeta", type=Path)
    a.add_argument("salida", type=Path)
    a.add_argument("--titulo", required=True)
    a.add_argument("--autor", required=True)
    a.add_argument("--subtitulo", default="Traducción de Proyecto Fénix")
    a.add_argument("--original", default="")
    o = a.parse_args()
    armar(o.carpeta, o.salida, o.titulo, o.autor, o.subtitulo, o.original)
