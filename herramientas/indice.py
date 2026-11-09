# -*- coding: utf-8 -*-
"""Índice (nav.xhtml) con diseño de libro, no de página web.

    python herramientas/indice.py libros/<archivo>.epub ...   (rehace el índice de un EPUB armado)

md_a_epub.py lo arma así desde el comienzo; este script rehace el de un EPUB que vino de otra
parte (Kempis de Granada, Platón), conservando sus enlaces y su anidado. Después, epub_a_pdf.py.

- Enlaces en color de tinta heredado (sirve en el modo oscuro del lector), sin azul ni subrayado.
- Sin la numeración 1, 2, 3 de la lista: duplicaba «Capítulo I».
- «Capítulo I. Título»: el rótulo en versalitas, chico, y el título en la línea de abajo.
  «I. Título»: el número romano en sangría francesa. «Capítulo I» o «I» solos: una línea.
- Preliminares (lo que va antes del primer capítulo numerado) y finales (lo que sigue al último)
  separados del cuerpo por un espacio, sin rótulo.
- En el PDF, epub_a_pdf.py agrega el número de página con puntos guía (en el EPUB no hay
  páginas fijas); el margen derecho de cada entrada les deja lugar.
"""
import html
import re
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

CSS = """@charset "utf-8";
/* Índice con diseño de libro (herramientas/indice.py). El título «Índice» usa el h1 del libro. */
/* El título, como el h1 de md_a_epub.py, aunque el libro venga de otra parte con su propio h1. */
nav.indice > h1 { font-size: 1.6em; font-weight: normal; text-align: center; margin: 2.5em 0 1.4em; }
nav.indice ol { list-style: none; margin: 0; padding: 0; }
nav.indice li { margin: 0.45em 0 0; padding: 0 2.4em 0 0; line-height: 1.3; text-indent: 0; text-align: left;
  hyphens: none; -webkit-hyphens: none; }
nav.indice a { color: inherit; text-decoration: none; }
nav.indice li > a { display: block; break-inside: avoid; page-break-inside: avoid; }
nav.indice li.rotulado > a { display: block; break-inside: avoid; page-break-inside: avoid; }
nav.indice li.rotulado > a > .titulo { display: block; }
nav.indice li.inicio { margin-top: 1.6em; }
nav.indice li.rotulado { margin-top: 0.85em; }
nav.indice li.rotulado.inicio, nav.indice li.parte.rotulado { margin-top: 1.6em; }
nav.indice li.rotulado > a > .rotulo { display: block; font-variant: small-caps; font-size: 0.85em; letter-spacing: 0.06em;
  margin-bottom: 0.1em; }
nav.indice .oculto { display: none; }
/* «XIII  Título»: número en mayúsculas chicas y sangría francesa (MuPDF no tiene inline-block ni
   float para una columna de números). */
nav.indice li.numerado { padding-left: 2.2em; text-indent: -2.2em; }
nav.indice .num { font-size: 0.8em; letter-spacing: 0.06em; }
/* El CSS del libro puede tener su propio .num o .titulo (Marmion: .num es el «Capítulo 1» centrado
   en bloque, gris y con 3em arriba); en el índice se anulan. */
nav.indice .num { display: inline; margin: 0; text-align: inherit; color: inherit; text-transform: none; }
nav.indice li:not(.rotulado) .titulo { display: inline; margin: 0; font-size: 1em; text-align: inherit; }
nav.indice ol ol { margin: 0.3em 0 0 1.2em; }
nav.indice ol ol li { margin-top: 0.3em; }
/* Parte: rótulo espaciado y título algo mayor; sus capítulos sin sangría, con aire entre ellos. */
nav.indice li.parte > a > .rotulo { letter-spacing: 0.14em; }
nav.indice li.parte > a > .titulo { font-size: 1.12em; }
nav.indice li.parte > ol { margin-left: 0; }
nav.indice li.parte > ol > li { margin-top: 0.9em; }
/* Secciones de un capítulo: un punto más chicas y con interlínea corta, para que el capítulo mande. */
nav.indice li.seccion { font-size: 0.9em; line-height: 1.25; margin-top: 0.25em; }
"""
TITULO = {"es": "Índice", "en": "Contents"}
ROTULO = re.compile(
    r"^((?:Capítulo|Consideración|Libro|Parte|Punto|Tratado|Chapter|Book|Part)\s+(?:(?:[IVXLCDM]+|\d+)(?:-[A-Z])?|[a-záéíóúñ]+)"
    r"|(?:Primera|Segunda|Tercera|Cuarta|Quinta|Sexta|First|Second|Third|Fourth|Fifth)\s+(?:[Pp]arte|[Pp]art))"
    r"(?:\s*[.:]\s+|\s+[-–·]\s+|$)(.*)$", re.S)
NUMERAL = re.compile(r"^([IVXLCDM]+|\d+)(?:\.\s+(.+))?$", re.S)
PARTE = re.compile(r"^(?:Libro|Parte|Book|Part)\b|\s(?:parte|part)$", re.I)
XHTML = "http://www.w3.org/1999/xhtml"
EPUB = "http://www.idpf.org/2007/ops"


def clasificar(texto: str):
    """(tipo, rótulo o número, título): rotulo, numero o simple."""
    texto = " ".join(texto.split())
    m = ROTULO.match(texto)
    if m and m.group(2):
        return "rotulo", m.group(1), m.group(2)
    if m:
        return "solo", m.group(1), ""
    m = NUMERAL.match(texto)
    if m and m.group(2):
        return "numero", m.group(1), m.group(2)
    if m:
        return "solo", m.group(1), ""
    return "simple", "", texto


def entrada_html(texto: str, esc=html.escape) -> tuple:
    """(clases del <li>, contenido del <a>). El separador oculto deja «Capítulo I. Título» en el
    menú de los lectores que leen el texto del enlace sin CSS."""
    tipo, rot, tit = clasificar(texto)
    clases = []
    if PARTE.search(rot or tit) and tipo != "simple":
        clases.append("parte")
    if tipo == "rotulo":
        clases.append("rotulado")
        return clases, (f'<span class="rotulo">{esc(rot)}<span class="oculto">. </span></span>'
                        f'<span class="titulo">{esc(tit)}</span>')
    if tipo == "numero":
        clases.append("numerado")
        return clases, (f'<span class="num">{esc(rot)}<span class="oculto">.</span></span> '
                        f'<span class="titulo">{esc(tit)}</span>')
    return clases, esc(rot or tit)


def es_cuerpo(texto: str) -> bool:
    return clasificar(texto)[0] != "simple"


def nav_xhtml(entradas: list, idioma: str = "es", hojas=("estilo.css",), epub_type: str = "frontmatter") -> str:
    """entradas: [(href, texto, [hijas como (href, texto, [...])])]. Las de primer nivel se reparten
    en preliminares, cuerpo y finales según si llevan número."""
    numeradas = [i for i, e in enumerate(entradas) if es_cuerpo(e[1])]
    ini, fin = (numeradas[0], numeradas[-1]) if numeradas else (0, len(entradas) - 1)

    def lis(lista, nivel, padre_parte=False):
        partes = []
        for i, (href, texto, hijas) in enumerate(lista):
            clases, contenido = entrada_html(texto)
            if nivel > 0 and not padre_parte:
                clases.append("seccion")
            if nivel == 0:
                grupo = "preliminar" if i < ini else "final" if i > fin else "cuerpo"
                clases.insert(0, grupo)
                if (i == ini and ini > 0) or (i == fin + 1):
                    clases.append("inicio")
            sub = f"<ol>{lis(hijas, nivel + 1, 'parte' in clases)}</ol>" if hijas else ""
            partes.append(f'<li class="{" ".join(clases)}"><a href="{html.escape(href)}">{contenido}</a>{sub}</li>')
        return "".join(partes)

    titulo = TITULO.get(idioma, TITULO["es"])
    enlaces = "".join(f'<link rel="stylesheet" type="text/css" href="{h}"/>' for h in (*hojas, "indice.css"))
    tipo = f' epub:type="{epub_type}"' if epub_type else ""
    return ('<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n'
            '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" '
            f'xml:lang="{idioma}" lang="{idioma}">\n<head><meta charset="utf-8"/><title>{titulo}</title>{enlaces}</head>\n'
            f'<body{tipo}>\n<nav epub:type="toc" id="toc" class="indice"><h1>{titulo}</h1>'
            f'<ol>{lis(entradas, 0)}</ol></nav>\n</body></html>\n')


def leer_nav(t: str) -> tuple:
    """(entradas, idioma, hojas de estilo propias) del nav.xhtml de un EPUB."""
    raiz = ET.fromstring(t.encode("utf-8"))
    idioma = (raiz.get("lang") or raiz.get("{http://www.w3.org/XML/1998/namespace}lang") or "es")[:2]
    hojas = [l.get("href") for l in raiz.iter(f"{{{XHTML}}}link")
             if l.get("rel") == "stylesheet" and l.get("href") != "indice.css"]
    nav = next(n for n in raiz.iter(f"{{{XHTML}}}nav") if n.get(f"{{{EPUB}}}type") == "toc")

    def lista(ol):
        salida = []
        for li in ol.findall(f"{{{XHTML}}}li"):
            a = li.find(f"{{{XHTML}}}a")
            if a is None:
                continue
            # el texto sin el separador oculto: «Capítulo I» + «Título» vuelve a «Capítulo I. Título»
            for s in a.iter(f"{{{XHTML}}}span"):
                if s.get("class") == "oculto":
                    s.text = ". "
            sub = li.find(f"{{{XHTML}}}ol")
            salida.append((a.get("href"), "".join(a.itertext()), lista(sub) if sub is not None else []))
        return salida

    tipo = raiz.find(f"{{{XHTML}}}body").get(f"{{{EPUB}}}type", "")
    return lista(nav.find(f"{{{XHTML}}}ol")), idioma, hojas, tipo


def es_pagina_de_indice(t: str) -> bool:
    """Página que es solo un índice: marcada como tal y con casi todo su texto en enlaces. Lo
    segundo importa: Gutenberg pone el índice (div.toc) al comienzo del archivo que trae el libro
    entero, y esa página no se puede sacar."""
    if not (re.search(r'<(?:section|div|nav)\b[^>]*class="[^"]*\b(?:indice|toc|contents)\b', t)
            or re.search(r"<title>\s*(?:Índice|Contents|Table of Contents)\s*</title>", t)):
        return False
    cuerpo = re.sub(r"(?s).*?<body\b[^>]*>|</body>.*", "", t)
    total = len(re.sub(r"\s+", "", html.unescape(re.sub(r"<[^>]+>", "", cuerpo))))
    enlaces = len(re.sub(r"\s+", "", html.unescape(re.sub(r"<[^>]+>", "", "".join(
        re.findall(r"(?s)<a\b[^>]*>(.*?)</a>", cuerpo))))))
    return total > 0 and enlaces / total > 0.8


def absorber_indice_suelto(datos: dict, opf: str, base: str, item_nav: str, entradas: list) -> tuple:
    """Si el libro trae su propia página de índice (una lista de enlaces en el spine) y el nav no
    se lee como página, el nav toma su lugar en el spine y la página suelta sale del libro: así el
    índice que se ve es el de diseño de libro y el PDF le pone números de página. Del nav salen
    también las entradas «Portada» e «Índice», que en un índice impreso no van. Marmion traía
    una página web subrayada en azul, sin números, que la guardia no veía (9-nov-2026)."""
    id_nav = re.search(r'\bid="([^"]+)"', item_nav).group(1)
    items = {}
    for it in re.findall(r"<item\b[^>]*>", opf):
        a = dict(re.findall(r'(\w[\w-]*)="([^"]*)"', it))
        items[a.get("id")] = (a.get("href", ""), it)
    spine = re.findall(r'<itemref\b[^>]*idref="([^"]+)"', opf)
    suelto = None
    if id_nav not in spine:
        for i in spine:
            href = items.get(i, ("", ""))[0]
            t = datos.get(base + href, b"").decode("utf-8", "replace")
            if es_pagina_de_indice(t):
                suelto = i
                break
    if not suelto:
        return opf, entradas
    href_suelto = items[suelto][0]
    opf = re.sub(rf'<itemref\b[^>]*idref="{re.escape(suelto)}"[^>]*>', f'<itemref idref="{id_nav}"/>', opf, 1)
    opf = opf.replace(items[suelto][1], "", 1)
    datos.pop(base + href_suelto, None)
    nav_href = re.search(r'href="([^"]+)"', item_nav).group(1)
    for nombre in list(datos):  # enlaces «volver al índice» de otras páginas
        if nombre.endswith((".xhtml", ".html", ".ncx")) and href_suelto.encode() in datos[nombre]:
            datos[nombre] = datos[nombre].replace(f'"{href_suelto}'.encode(), f'"{nav_href}'.encode())
    sobran = {href_suelto, nav_href}
    portada = re.compile(r"^\s*(?:Portada|Cover)\s*$", re.I)
    entradas = [e for e in entradas if e[0].split("#")[0] not in sobran and not portada.match(e[1])]
    return opf, entradas


def rehacer(epub: Path) -> bool:
    """Rehace el nav.xhtml del EPUB y agrega indice.css. False si ya estaba igual."""
    with zipfile.ZipFile(epub) as z:
        items = [(i, z.read(i.filename)) for i in z.infolist()]
    datos = dict((i.filename, d) for i, d in items)
    opf_ruta = re.search(r'full-path="([^"]+)"', datos["META-INF/container.xml"].decode("utf-8")).group(1)
    base = opf_ruta.rpartition("/")[0] + "/" if "/" in opf_ruta else ""
    opf = datos[opf_ruta].decode("utf-8")
    item_nav = re.search(r'<item\b[^>]*properties="[^"]*\bnav\b[^"]*"[^>]*>', opf).group(0)
    nav_ruta = base + re.search(r'href="([^"]+)"', item_nav).group(1)
    carpeta_nav = nav_ruta.rpartition("/")[0] + "/" if "/" in nav_ruta else ""
    entradas, idioma, hojas, tipo = leer_nav(datos[nav_ruta].decode("utf-8"))
    opf, entradas = absorber_indice_suelto(datos, opf, base, item_nav, entradas)
    datos[opf_ruta] = opf.encode("utf-8")
    nuevo_nav = nav_xhtml(entradas, idioma, hojas, tipo).encode("utf-8")
    css_ruta = carpeta_nav + "indice.css"
    if datos[nav_ruta] == nuevo_nav and datos.get(css_ruta) == CSS.encode("utf-8"):
        return False
    datos[nav_ruta] = nuevo_nav
    datos[css_ruta] = CSS.encode("utf-8")
    if "indice.css" not in opf:
        href = (carpeta_nav[len(base):] if carpeta_nav.startswith(base) else carpeta_nav) + "indice.css"
        opf = opf.replace("</manifest>", f'<item id="indice-css" href="{href}" media-type="text/css"/>\n</manifest>', 1)
        datos[opf_ruta] = opf.encode("utf-8")
    with zipfile.ZipFile(epub, "w") as z:
        z.writestr(zipfile.ZipInfo("mimetype"), datos.pop("mimetype"), compress_type=zipfile.ZIP_STORED)
        for nombre, d in datos.items():
            z.writestr(nombre, d, compress_type=zipfile.ZIP_DEFLATED)
    return True


if __name__ == "__main__":
    for a in sys.argv[1:]:
        print(f"{Path(a).name}: {'índice rehecho' if rehacer(Path(a)) else 'índice ya al día'}")
