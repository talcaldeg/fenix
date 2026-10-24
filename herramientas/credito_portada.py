# -*- coding: utf-8 -*-
"""Crédito de la portada dentro del libro: el EPUB y el PDF circulan sin la ficha del sitio.

    python herramientas/credito_portada.py libros/<archivo>.epub ...

- El texto sale de `imagen.credito` (y `imagen.aviso`, si hay) de la ficha en datos.js, igual que
  en la ficha web: «Portada: El Greco, «Cristo con la cruz», c. 1590 (dominio público, Wikimedia
  Commons).» En un EPUB en inglés, «Cover: ...».
- Va al pie de la portadilla (portadilla.xhtml de md_a_epub.py). Un EPUB sin portadilla nuestra
  (Gutenberg) recibe una página propia, fenix-credito.xhtml, después del ex libris.
- En el OPF queda como dc:contributor con rol MARC «cov» (diseño de cubierta).
- Idempotente: si el EPUB ya trae el crédito, se reemplaza. Va después de exlibris.py y antes de
  epub_a_pdf.py; revisar_libros.py falla si un libro con crédito en su ficha no lo trae.
- Portada oficial (src con http): la ficha la acredita con su aviso; el libro no se toca.
"""
import html
import json
import re
import subprocess
import sys
import zipfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PAGINA = "fenix-credito.xhtml"
CLASE = "fenix-credito"
ETIQUETA = {"es": ("Portada", "dominio público, Wikimedia Commons"),
            "en": ("Cover", "public domain, Wikimedia Commons")}
ROL = {"es": "portada", "en": "cover"}
PORTADILLA = re.compile(r'<(section|div)\b[^>]*class="(?:[^"]* )?portadilla(?: [^"]*)?"[^>]*>')
ESTILO = "font-size:0.75em;margin-top:5em;text-indent:0;text-align:center;hyphens:none;-epub-hyphens:none"


def creditos() -> dict:
    """{nombre de archivo sin extensión: {es, en}} de cada ficha y versión con portada propia."""
    js = ("global.window={};require(process.argv[1]);"
          "console.log(JSON.stringify(window.FENIX.libros))")
    libros = json.loads(subprocess.run(["node", "-e", js, str(RAIZ / "datos.js")], check=True,
                                       capture_output=True, encoding="utf-8").stdout)
    out = {}
    for l in libros:
        for v in [l] + list((l.get("versiones") or {}).values()):
            f = {**l, **v}
            im, epub = f.get("imagen") or {}, (v.get("archivos") or {}).get("epub")
            if not epub or not im.get("credito") or im.get("src", "").startswith("http"):
                continue
            textos = {}
            for idioma, (rotulo, dominio) in ETIQUETA.items():
                c = im["credito"].get(idioma) or im["credito"]["es"]
                aviso = (im.get("aviso") or {}).get(idioma) or (im.get("aviso") or {}).get("es") or dominio
                textos[idioma] = (f"{rotulo}: {c} ({aviso}).", c)
            out[Path(epub).stem] = textos
    return out


def idioma_de(opf: str) -> str:
    lang = re.search(r"<dc:language[^>]*>\s*([a-z]{2})", opf)
    return "en" if lang and lang.group(1) == "en" else "es"


def pagina_credito(texto: str, idioma: str) -> str:
    return ('<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html>\n'
            f'<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" '
            f'xml:lang="{idioma}" lang="{idioma}"><head><meta charset="utf-8"/><title>{ETIQUETA[idioma][0]}</title></head>'
            '<body epub:type="frontmatter"><section style="margin-top:60%;text-align:center">'
            f'<p class="{CLASE}" style="font-size:0.8em;text-indent:0;text-align:center">{html.escape(texto)}</p>'
            '</section></body></html>\n')


def poner(epub: Path, textos: dict) -> None:
    z = zipfile.ZipFile(epub)
    infos = z.infolist()
    archivos = {i.filename: z.read(i.filename) for i in infos}
    z.close()
    opf_ruta = re.search(r'full-path="([^"]+)"', archivos["META-INF/container.xml"].decode("utf-8")).group(1)
    base = opf_ruta.rsplit("/", 1)[0] + "/" if "/" in opf_ruta else ""
    opf = archivos[opf_ruta].decode("utf-8")
    idioma = idioma_de(opf)
    texto, credito = textos[idioma]
    parrafo = f'<p class="{CLASE}" style="{ESTILO}">{html.escape(texto)}</p>'

    # Lo que haya puesto una pasada anterior.
    for n in list(archivos):
        if n.endswith((".xhtml", ".html", ".htm")) and CLASE.encode() in archivos[n] and not n.endswith(PAGINA):
            archivos[n] = re.sub(rf'<p class="{CLASE}"[^>]*>.*?</p>', "", archivos[n].decode("utf-8"),
                                 flags=re.S).encode("utf-8")
    opf = re.sub(r'\s*<dc:contributor id="fenix-credito-portada">.*?</dc:contributor>', "", opf, flags=re.S)
    opf = re.sub(r'\s*<meta refines="#fenix-credito-portada"[^>]*>[^<]*</meta>', "", opf)

    porta = next((n for n in archivos if n.endswith((".xhtml", ".html"))
                  and PORTADILLA.search(archivos[n].decode("utf-8", "ignore"))), None)
    if porta:
        # La portadilla es <section> en md_a_epub.py y <div> en ediciones armadas a mano (Kempis).
        t = archivos[porta].decode("utf-8")
        m = PORTADILLA.search(t)
        tag, prof, i = m.group(1), 1, m.end()
        for c in re.finditer(rf"<(/?){tag}\b[^>]*?(/?)>", t[i:]):
            if c.group(2):
                continue
            prof += -1 if c.group(1) else 1
            if not prof:
                fin = i + c.start()
                break
        archivos[porta] = (t[:fin] + parrafo + t[fin:]).encode("utf-8")
    else:
        archivos[base + PAGINA] = pagina_credito(texto, idioma).encode("utf-8")
        if PAGINA not in opf:
            opf = opf.replace("</manifest>", f'<item href="{PAGINA}" id="fenix-credito-pag" '
                              'media-type="application/xhtml+xml"/>\n  </manifest>', 1)
            opf = re.sub(r'(<itemref [^>]*idref="fenix-exlibris-pag"[^>]*/>)',
                         r'\1\n    <itemref idref="fenix-credito-pag"/>', opf, count=1)

    opf = opf.replace("</metadata>", f'  <dc:contributor id="fenix-credito-portada">{html.escape(credito)} ({ROL[idioma]})'
                      '</dc:contributor>\n    <meta refines="#fenix-credito-portada" property="role" scheme="marc:relators">cov</meta>\n  </metadata>', 1)
    archivos[opf_ruta] = opf.encode("utf-8")

    with zipfile.ZipFile(epub, "w") as z:
        z.writestr(zipfile.ZipInfo("mimetype"), archivos.pop("mimetype"), compress_type=zipfile.ZIP_STORED)
        for n, d in archivos.items():
            z.writestr(n, d, compress_type=zipfile.ZIP_DEFLATED)
    print(f"{epub.name}: {texto}" + ("" if porta else " (página propia)"))


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    todos = creditos()
    for a in sys.argv[1:]:
        ruta = Path(a).resolve()
        if ruta.stem not in todos:
            print(f"{ruta.name}: sin crédito en su ficha (o portada oficial), no se toca")
            continue
        poner(ruta, todos[ruta.stem])


if __name__ == "__main__":
    main()
