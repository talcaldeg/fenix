# -*- coding: utf-8 -*-
"""Saca las primeras páginas de cada EPUB de libros/ para «Hojear» el libro en línea.

Deja muestras/<archivo>.json con el HTML limpio del comienzo del libro (desde el primer
capítulo: sin portada, exlibris, portadilla, índice, nota de la edición ni el encabezado de
Project Gutenberg). Corta en el primer cambio de capítulo después de MINIMO palabras, o al pasar
MAXIMO. gen_estaticos.js lo corre solo y arma con esto libro/<id>/muestra/, una página liviana que
se lee en el navegador sin descargar el libro.

    python herramientas/muestras.py            # solo los EPUB nuevos o cambiados
    python herramientas/muestras.py --todas    # rehace todas

Es idempotente: cada JSON guarda el hash de su EPUB y no se reescribe si no cambió.
"""
import hashlib
import html
import json
import posixpath
import shutil
import re
import sys
import zipfile
from pathlib import Path

import io

import lxml.html
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
LIBROS = RAIZ / "libros"
SALIDA = RAIZ / "muestras"
MINIMO, MAXIMO = 2000, 4000
VERSION = 2  # subirla si cambia la extracción, para que se rehagan todas
# Imágenes de la muestra (los dibujos de El principito, los grabados de Gutenberg): WebP de hasta
# ANCHO_IMG px en muestras/img/<archivo>/, con loading="lazy" para que no pesen al abrir la página.
# En el HTML van con la marca RAIZ_IMG, que gen_estaticos.js cambia por la ruta relativa a la raíz.
ANCHO_IMG, RAIZ_IMG = 700, "@@RAIZ@@"

BLOQUES = {"p", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "pre", "ul", "ol", "hr", "figure"}
TITULOS = {"h1", "h2", "h3", "h4", "h5", "h6"}
EN_LINEA = {"em", "i", "strong", "b", "sup", "sub", "small", "cite", "abbr", "q"}
FUERA = {"table", "svg", "figcaption", "script", "style", "nav", "head", "aside", "audio", "video"}
# Secciones que se saltan enteras (hasta el título siguiente): índice, nota de la edición, nota del transcriptor.
SALTAR = re.compile(r"^(contents|table of contents|índice|indice|contenido|contenidos|sumario|nota de esta edición|transcriber.?s note)$", re.I)
# Libros cuyo comienzo es un prefacio largo de otro (editor, traductor, biógrafo): la muestra parte
# en este título, para que se lea al autor. Clave: nombre del EPUB sin extensión.
INICIO = {
    "austen-pride-and-prejudice": r"^Chapter I\.$",
    "platon-apology": r"^APOLOGY$",
    "kempis-imitacion-de-cristo-granada": r"^Libro primero$",
    "ligorio-preparacion-para-la-muerte": r"^Consideración I\.",
    "marmion-jesucristo-vida-del-alma": r"^PRIMERA PARTE$",
}
NOTA_REF = re.compile(r"^\s*[\[(]?\s*(\d+|[*†‡]+|[ivxlc]+)\s*[\])]?\s*$", re.I)
ILUSTRACION = re.compile(r"^\s*\[?\s*(illustration|ilustración|ilustracion)\b", re.I)


def texto(el):
    return " ".join(el.text_content().split())


def es_ref_nota(el):
    """Llamada a nota al pie (<a>1</a>, <sup>[2]</sup>): en la muestra no hay notas."""
    tag = el.tag if isinstance(el.tag, str) else ""
    if tag not in ("a", "sup"):
        return False
    t = texto(el)
    return bool(t) and bool(NOTA_REF.match(t)) and (tag == "sup" or el.get("href", "").find("#") >= 0)


class Imagenes:
    """Pasa las imágenes del EPUB que entran en la muestra a WebP liviano y entrega su <img>."""

    def __init__(self, z, stem):
        self.z, self.dir, self.doc, self.hechas = z, SALIDA / "img" / stem, "", {}

    def img(self, el):
        src = el.get("src") or el.get("{http://www.w3.org/1999/xlink}href") or ""
        ruta = posixpath.normpath(posixpath.join(posixpath.dirname(self.doc), src))
        if ruta not in self.hechas:
            try:
                im = Image.open(io.BytesIO(self.z.read(ruta)))
            except (KeyError, OSError):
                self.hechas[ruta] = ""
                return ""
            im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
            if im.width > ANCHO_IMG:
                im = im.resize((ANCHO_IMG, round(im.height * ANCHO_IMG / im.width)), Image.LANCZOS)
            nombre = re.sub(r"[^a-z0-9-]+", "-", posixpath.splitext(posixpath.basename(ruta))[0].lower()) + ".webp"
            self.dir.mkdir(parents=True, exist_ok=True)
            im.save(self.dir / nombre, "WEBP", quality=80, method=6)
            url = f"{RAIZ_IMG}muestras/img/{self.dir.name}/{nombre}"
            # El ancho relativo a la caja de texto (style="width: N%" de md_a_epub) pasa tal cual.
            ancho = re.search(r"width:\s*(\d+%)", el.get("style") or "")
            ancho = f' style="width:{ancho.group(1)}"' if ancho else ""
            self.hechas[ruta] = (f'<img src="{html.escape(url)}"{ancho} alt="{html.escape(el.get("alt") or "")}" '
                                 f'width="{im.width}" height="{im.height}" loading="lazy" decoding="async">')
        return self.hechas[ruta]


IMAGENES = None  # la de el libro que se está extrayendo


def limpio(el):
    """HTML del contenido de el, solo con marcas de texto (cursiva, negrita, saltos) e imágenes."""
    partes = [html.escape(el.text or "", quote=False)]
    for h in el:
        tag = h.tag if isinstance(h.tag, str) else ""
        if tag and tag not in FUERA and not es_ref_nota(h):
            tag = tag.split("}")[-1].lower()
            if tag == "br":
                partes.append("<br>")
            elif tag in ("img", "image"):
                partes.append(IMAGENES.img(h))
            elif tag in EN_LINEA:
                partes.append(f"<{tag}>{limpio(h)}</{tag}>")
            elif tag in ("p", "div") and el.tag in ("blockquote", "li"):
                partes.append(f"<p>{limpio(h)}</p>")
            elif tag == "span" and re.search(r"titulo|subtitle|subtitulo", h.get("class") or ""):
                partes.append(f"<br>{limpio(h)}")  # «Capítulo I» y su título van en líneas separadas
            else:
                partes.append(limpio(h))
        partes.append(html.escape(h.tail or "", quote=False))
    return re.sub(r"^(\s*<br>)+|(<br>\s*)+$", "", re.sub(r"\s+", " ", "".join(partes)).strip()).strip()


def bloques(el):
    """Recorre el documento y entrega (etiqueta, elemento) por cada bloque de texto."""
    for h in el:
        if not isinstance(h.tag, str):
            continue
        tag = h.tag.split("}")[-1].lower()
        ident = (h.get("id") or "") + " " + (h.get("class") or "")
        if tag in FUERA or re.search(r"pg-header|pg-footer|pg-boilerplate|pgheader|pgfooter|\btoc\b", ident):
            continue
        if tag == "img":
            yield "figure", h
        elif tag in BLOQUES:
            yield tag, h
        elif tag == "div" and not any(isinstance(d.tag, str) and d.tag.split("}")[-1].lower() in BLOQUES | {"div", "section"} for d in h.iter() if d is not h):
            yield "p", h
        else:
            yield from bloques(h)


def documentos(z):
    """Los documentos del libro en orden de lectura, sin portada, exlibris ni preliminares de Fénix."""
    opf = next(n for n in z.namelist() if n.endswith(".opf"))
    t = z.read(opf).decode("utf-8", "replace")
    manifiesto = {}
    for it in re.findall(r"<item\b[^>]*>", t):
        i, h = re.search(r'\bid="([^"]+)"', it), re.search(r'\bhref="([^"]+)"', it)
        if i and h:
            manifiesto[i.group(1)] = (h.group(1), "nav" in (re.search(r'properties="([^"]*)"', it) or [None, ""])[1])
    for idref in re.findall(r'<itemref\b[^>]*idref="([^"]+)"', t):
        href, es_nav = manifiesto[idref]
        if es_nav or posixpath.basename(href).startswith(("fenix-", "wrap0000")):
            continue
        ruta = posixpath.normpath(posixpath.join(posixpath.dirname(opf), href))
        doc = lxml.html.fromstring(z.read(ruta))
        cuerpo = doc.find(".//body")
        if cuerpo is None:
            cuerpo = doc
        if re.search(r"\b(cover|frontmatter|toc|titlepage)\b", cuerpo.get("{http://www.idpf.org/2007/ops}type") or cuerpo.get("epub:type") or ""):
            continue
        yield cuerpo, ruta


def extraer(epub):
    global IMAGENES
    salida, palabras, saltando, completo = [], 0, False, True
    # Lo que va antes del primer título (notas de transcripción, leyendas de grabados) no es el libro.
    inicio = re.compile(INICIO.get(epub.stem, r"."))
    empezo = False
    with zipfile.ZipFile(epub) as z:
        IMAGENES = Imagenes(z, epub.stem)
        if IMAGENES.dir.exists():
            shutil.rmtree(IMAGENES.dir)
        for cuerpo, IMAGENES.doc in documentos(z):
            for tag, el in bloques(cuerpo):
                t = texto(el)
                con_img = el.find(".//img") is not None or el.tag == "img"
                if tag in TITULOS and t:
                    empezo = empezo or bool(inicio.search(t))
                    saltando = bool(SALTAR.match(t.strip(" .:")))
                    if saltando:
                        continue
                    if palabras >= MINIMO:
                        completo = False
                        break
                if not empezo or saltando or not t and tag != "hr" and not con_img or ILUSTRACION.match(t) and not con_img:
                    continue
                if palabras >= MAXIMO:
                    completo = False
                    break
                if tag == "hr":
                    salida.append((tag, "<hr>"))
                    continue
                if tag == "figure" or con_img and len(t.split()) < 40:
                    # Imagen con su leyenda (figcaption, o el texto corto del div de Gutenberg).
                    imgs = "".join(IMAGENES.img(i) for i in el.iter("img"))
                    cap = el.find(".//figcaption")
                    leyenda = limpio(cap) if cap is not None else (re.sub(r"<img[^>]*>", "", limpio(el)).strip() if t else "")
                    if imgs:
                        salida.append(("figure", f"<figure>{imgs}{f'<figcaption>{leyenda}</figcaption>' if leyenda else ''}</figure>"))
                    continue
                contenido = limpio(el)
                if tag in ("ul", "ol"):
                    contenido = "".join(f"<li>{limpio(li)}</li>" for li in el if isinstance(li.tag, str))
                salida.append((tag, f"<{tag}>{contenido}</{tag}>"))
                if tag not in TITULOS:
                    palabras += len(t.split())
            else:
                continue
            break
    # Sin títulos ni separadores sueltos al final; los títulos parten en h2 (el h1 es el del libro).
    while salida and (salida[-1][0] in TITULOS or salida[-1][0] == "hr"):
        salida.pop()
    while salida and salida[0][0] == "hr":
        salida.pop(0)
    niveles = sorted({int(tg[1]) for tg, _ in salida if tg in TITULOS})
    corrimiento = 2 - niveles[0] if niveles else 0

    def nivel(m):
        n = min(6, int(m.group(2)) + corrimiento)
        return f"<{m.group(1)}h{n}>"
    cuerpo = "\n".join(re.sub(r"<(/?)h([1-6])>", nivel, h) for _, h in salida)
    return {"html": cuerpo, "palabras": palabras, "completo": completo}


def main():
    todas = "--todas" in sys.argv
    SALIDA.mkdir(exist_ok=True)
    epubs = sorted(LIBROS.glob("*.epub"))
    for epub in epubs:
        destino = SALIDA / (epub.stem + ".json")
        firma = f"{VERSION}:" + hashlib.sha1(epub.read_bytes()).hexdigest()
        if not todas and destino.exists():
            try:
                if json.loads(destino.read_text(encoding="utf-8")).get("firma") == firma:
                    continue
            except ValueError:
                pass
        m = extraer(epub)
        if m["palabras"] < 300:
            print(f"AVISO {epub.name}: la muestra tiene solo {m['palabras']} palabras; revisar el EPUB")
        destino.write_text(json.dumps({"firma": firma, **m}, ensure_ascii=False, indent=0) + "\n", encoding="utf-8")
        print(f"muestras/{destino.name}: {m['palabras']} palabras")
    vigentes = {e.stem for e in epubs}
    for j in SALIDA.glob("*.json"):
        if j.stem not in vigentes:
            j.unlink()
            print(f"borrada muestras/{j.name}")
    for d in (SALIDA / "img").glob("*") if (SALIDA / "img").exists() else []:
        if d.stem not in vigentes:
            shutil.rmtree(d)
            print(f"borrada muestras/img/{d.name}")


if __name__ == "__main__":
    main()
