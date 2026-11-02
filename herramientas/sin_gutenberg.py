# -*- coding: utf-8 -*-
"""Saca de un EPUB de Project Gutenberg su encabezado, su licencia y toda mención a la marca.

    python herramientas/sin_gutenberg.py libros/<archivo>.epub ...

La licencia de Gutenberg permite quitar todas sus referencias: lo que queda es un texto de
dominio público (decisión de Tomás del 2-nov-2026; un libro en español abría con una página
legal en inglés). Qué hace:

- Borra el <header id="pg-header"> y el <footer id="pg-footer">; el archivo que queda vacío sale
  del EPUB, del spine y de los índices (toc.xhtml y toc.ncx).
- En los metadatos cambia el identificador por urn:fenix:<archivo>, saca dc:source y el
  generador, y deja dc:rights en «Dominio público» / «Public domain».
- Agrega al final fenix-colofon.xhtml con los voluntarios que transcribieron el texto (los
  «Credits» del encabezado, sin el nombre de Gutenberg).
- Idempotente: un EPUB ya limpio solo se revisa. Falla si queda alguna mención.

Va antes de portadas.py, exlibris.py y credito_portada.py en un libro nuevo; en uno ya armado
basta rehacer el PDF con epub_a_pdf.py. recibir_entrega.py lo corre solo en la vía A.
"""
import html
import re
import sys
import zipfile
from pathlib import Path

COLOFON = "fenix-colofon.xhtml"
MARCA = re.compile(r"gutenberg", re.I)
CABEZA = re.compile(r'<header\b[^>]*id="pg-header".*?</header>', re.S)
PIE = re.compile(r'<footer\b[^>]*id="pg-footer".*?</footer>', re.S)
TEXTO = {"es": ("Colofón", "Transcripción digital hecha por voluntarios: {}.", "Texto de dominio público."),
         "en": ("Colophon", "Digital transcription by volunteers: {}.", "Public domain text.")}
ANONIMOS = {"es": "voluntarios anónimos", "en": "anonymous volunteers"}


def creditos(cabeza: str, idioma: str) -> str:
    """Los «Credits» del encabezado, sin Gutenberg ni la nota de los escaneos."""
    m = re.search(r"<strong>Credits</strong>:(.*?)</p>", cabeza, re.S)
    if not m:
        return ANONIMOS[idioma]
    c = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", m.group(1)))).strip()
    c = re.sub(r"\s*\((?:This|These) (?:file|book|e?text)[^)]*\)\.?", "", c, flags=re.I)
    c = re.sub(r"^(?:Produced by|This etext was proofread by)\s+", "", c, flags=re.I)
    c = re.sub(r"\s+and compared against a separate copy scanned by\s+", " and ", c, flags=re.I)
    c = re.sub(r"(?:the )?Online Distributed Proofreading Team(?: at)?(?: https?://www\.pgdp\.net)?",
               "Distributed Proofreaders (pgdp.net)", c, flags=re.I)
    c = re.sub(r"\s*an anonymous Project Gutenberg volunteer", " an anonymous volunteer", c, flags=re.I)
    c = re.sub(r"(?<=[^.])\s+(Revised by|HTML version by)", r". \1", c).strip(" .")
    if idioma == "es":
        c = re.sub(r",? and an anonymous volunteer|^an anonymous volunteer", "un voluntario anónimo", c)
        c = re.sub(r"^An Anonymous Volunteer,? and ", "un voluntario anónimo y ", c)
        c = re.sub(r",? and ", " y ", c)
        c = re.sub(r"\.? Revised by ", "; revisión de ", c)
        c = re.sub(r"\.? HTML version by ", "; versión HTML de ", c)
    if not c or c == "-" or MARCA.search(c):
        return ANONIMOS[idioma]
    return c


def pagina_colofon(texto: str, idioma: str) -> str:
    titulo, _, dominio = TEXTO[idioma]
    return ('<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n'
            f'<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" '
            f'xml:lang="{idioma}" lang="{idioma}"><head><meta charset="utf-8"/><title>{titulo}</title></head>'
            '<body epub:type="backmatter"><section epub:type="colophon" style="margin-top:60%;text-align:center">'
            f'<p style="font-size:0.8em;text-indent:0;text-align:center">{html.escape(texto)}</p>'
            f'<p style="font-size:0.8em;text-indent:0;text-align:center">{dominio}</p>'
            '</section></body></html>\n')


def vacio(t: str) -> bool:
    cuerpo = t[t.find("<body"):]
    return not re.sub(r"<[^>]+>|\s", "", cuerpo) and "<img" not in cuerpo and "<svg" not in cuerpo


def limpiar(epub: Path) -> list:
    """Limpia el EPUB en su lugar. Devuelve las menciones que quedan (vacío = limpio)."""
    with zipfile.ZipFile(epub) as z:
        archivos = {i.filename: z.read(i.filename) for i in z.infolist()}
    opf_ruta = re.search(r'full-path="([^"]+)"', archivos["META-INF/container.xml"].decode("utf-8")).group(1)
    base = opf_ruta.rsplit("/", 1)[0] + "/" if "/" in opf_ruta else ""
    opf = archivos[opf_ruta].decode("utf-8")
    lang = re.search(r"<dc:language[^>]*>\s*([a-z]{2})", opf)
    idioma = "en" if lang and lang.group(1) == "en" else "es"
    dc_titulo = re.search(r"<dc:title[^>]*>([^<]*)</dc:title>", opf)
    titulo = dc_titulo.group(1) if dc_titulo else epub.stem

    cabeza, borrados = "", []
    for n in list(archivos):
        if not n.endswith((".xhtml", ".html", ".htm")):
            continue
        t = archivos[n].decode("utf-8")
        if not MARCA.search(t):
            continue
        m = CABEZA.search(t)
        if m:
            cabeza = m.group(0)
        t = PIE.sub("", CABEZA.sub("", t))
        t = re.sub(r'\s*<meta name="generator"[^>]*/>', "", t)
        t = re.sub(r'\s*<link [^>]*type="image/x-cover"[^>]*/>', "", t)
        # Ebookmaker titula cada archivo «The Project Gutenberg eBook of...» o con la licencia.
        t = re.sub(r"<title>[^<]*gutenberg[^<]*</title>", f"<title>{titulo}</title>", t, flags=re.I)
        if vacio(t):
            borrados.append(n[len(base):])
            del archivos[n]
        else:
            archivos[n] = t.encode("utf-8")

    for href in borrados:
        item = re.search(rf'<item\b[^>]*href="{re.escape(href)}"[^>]*/>', opf)
        if item:
            iid = re.search(r'id="([^"]+)"', item.group(0)).group(1)
            opf = opf.replace(item.group(0), "")
            opf = re.sub(rf'\s*<itemref\b[^>]*idref="{re.escape(iid)}"[^>]*/>', "", opf)
    uid = f"urn:fenix:{epub.stem}"
    opf = re.sub(r'(<dc:identifier[^>]*>)[^<]*gutenberg[^<]*(</dc:identifier>)', rf"\g<1>{uid}\g<2>", opf, flags=re.I)
    opf = re.sub(r'\s*<dc:source>[^<]*gutenberg[^<]*</dc:source>', "", opf, flags=re.I)
    opf = re.sub(r'\s*<dc:publisher>[^<]*gutenberg[^<]*</dc:publisher>', "", opf, flags=re.I)
    opf = re.sub(r'(<dc:rights>)[^<]*(</dc:rights>)',
                 rf"\g<1>{'Public domain' if idioma == 'en' else 'Dominio público'}\g<2>", opf)
    opf = re.sub(r'\s*<meta[^>]*name="generator"[^>]*/>', "", opf)
    opf = re.sub(r'\s*<!--[^>]*-->', "", opf)

    # Índices: entradas que llevan a lo borrado o al encabezado y pie de Gutenberg.
    for n in list(archivos):
        if not n.endswith(("toc.xhtml", ".ncx", "nav.xhtml")):
            continue
        t = archivos[n].decode("utf-8")
        malos = "|".join([re.escape(h) for h in borrados] + [r'[^"]*#pg-(?:header|footer)[^"]*'])
        t = re.sub(rf'\s*<li>\s*<a href="(?:{malos})"[^>]*>.*?</a>\s*</li>', "", t, flags=re.S)
        t = re.sub(rf'\s*<navPoint\b[^>]*>\s*<navLabel>\s*<text>[^<]*</text>\s*</navLabel>\s*'
                   rf'<content src="(?:{malos})"/>\s*</navPoint>', "", t, flags=re.S)
        t = re.sub(r'\s*<pageTarget\b(?:(?!</pageTarget>).)*?src="(?:' + malos + r')".*?</pageTarget>', "", t, flags=re.S)
        t = re.sub(r'(<meta name="dtb:uid" content=")[^"]*(")', rf"\g<1>{uid}\g<2>", t)
        t = re.sub(r'\s*<meta name="dtb:generator"[^>]*/>', "", t)
        archivos[n] = t.encode("utf-8")

    if cabeza and COLOFON not in opf:
        titulo, frase, _ = TEXTO[idioma]
        archivos[base + COLOFON] = pagina_colofon(frase.format(creditos(cabeza, idioma)), idioma).encode("utf-8")
        opf = opf.replace("</manifest>", f'<item href="{COLOFON}" id="fenix-colofon" '
                          'media-type="application/xhtml+xml"/>\n  </manifest>', 1)
        opf = opf.replace("</spine>", '  <itemref idref="fenix-colofon"/>\n  </spine>', 1)
    archivos[opf_ruta] = opf.encode("utf-8")

    with zipfile.ZipFile(epub, "w") as z:
        z.writestr(zipfile.ZipInfo("mimetype"), archivos.pop("mimetype"), compress_type=zipfile.ZIP_STORED)
        for n, d in archivos.items():
            z.writestr(n, d, compress_type=zipfile.ZIP_DEFLATED)
    return menciones(epub)


def menciones(epub: Path) -> list:
    """[(archivo, contexto)] de cada mención a Gutenberg que queda en el texto o los metadatos."""
    out = []
    with zipfile.ZipFile(epub) as z:
        for n in z.namelist():
            if n.endswith((".xhtml", ".html", ".htm", ".opf", ".ncx")):
                t = z.read(n).decode("utf-8", "ignore")
                for m in MARCA.finditer(t):
                    out.append((n, re.sub(r"\s+", " ", t[max(0, m.start() - 60):m.end() + 40])))
    return out


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    malos = 0
    for a in sys.argv[1:]:
        ruta = Path(a).resolve()
        quedan = limpiar(ruta)
        print(f"{ruta.name}: " + ("limpio" if not quedan else f"quedan {len(quedan)} menciones"))
        for n, c in quedan[:5]:
            print(f"    {n}: ...{c}...")
        malos += bool(quedan)
    sys.exit(1 if malos else 0)


if __name__ == "__main__":
    main()
