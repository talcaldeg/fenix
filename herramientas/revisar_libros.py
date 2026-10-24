# -*- coding: utf-8 -*-
"""Revisa los EPUB y PDF de libros/ antes de publicarlos: lo que antes se miraba a mano.

    python herramientas/revisar_libros.py libros/<archivo>.epub libros/<archivo>.pdf ...
    python herramientas/revisar_libros.py --desde origin/main   (los que cambiaron; lo usa sesion.py publicar)
    python herramientas/revisar_libros.py --todos               (informe de todo el catálogo)
    python herramientas/revisar_libros.py libros/<archivo>.epub --arreglar   (quita la cursiva de las notas)

De un libro que cambió se revisan sus dos formatos: si se rearmó el EPUB, el PDF tiene que
estar al día. Cada ERROR es un defecto que ya llegó publicado:

- PDF: portada, ex libris y cada imagen de página entera con la proporción de su imagen (2 %;
  MuPDF estiraba la envoltura SVG de la portada entre un 9 % y un 31 %, 24-oct-2026).
- PDF: el índice enlazado y los marcadores no apuntan todos a la página 1 (convert_to_pdf los
  dejaba en la portada, 23-oct-2026).
- PDF: el fondo de las páginas es parejo, salvo portada y ex libris (esquinas a baja resolución).
- EPUB: notas sin cursiva (ReadEra borra el texto en cursiva de la nota) y ex libris como
  segunda página.
- EPUB: el índice que se lee como página tiene diseño de libro (indice.py): enlaces en tinta
  heredada, sin subrayado ni numeración de lista ni color fijo (era una lista web, 24-oct-2026).
- PDF: con ese índice, cada entrada lleva el número de la página a la que lleva su enlace.
- EPUB y PDF: el crédito de la portada de su ficha, si la ficha lo trae (el archivo circula sin
  la ficha; credito_portada.py, 24-oct-2026).

Termina con «Libros listos» o con la lista de errores (código 1).
"""
import argparse
import html
import re
import subprocess
import sys
import unicodedata
import zipfile
from collections import Counter
from pathlib import Path

import fitz  # PyMuPDF

sys.path.insert(0, str(Path(__file__).resolve().parent))
import credito_portada  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
LIBROS = RAIZ / "libros"
DEFORMACION = 0.02
PAGINA_ENTERA = 0.4  # una imagen que ocupa más de esta fracción de la página es «de página entera»
ESCALA_FONDO = 0.1
DIF_FONDO = 12  # por canal, 0-255
EXLIBRIS = "fenix-exlibris.xhtml"
NOTA = re.compile(r'<(\w+)\b[^>]*(?:epub:type="(?:footnote|endnote|rearnote)"|class="(?:[^"]* )?footnote(?: [^"]*)?")[^>]*>')
CURSIVA = re.compile(r"<(?:em|i|cite)\b|font-style:\s*italic")


def elemento(t: str, m) -> str:
    """El elemento completo que abre en m, contando anidados del mismo nombre."""
    tag, prof, i = m.group(1), 1, m.end()
    for c in re.finditer(rf"<(/?){tag}\b[^>]*?(/?)>", t[i:]):
        if c.group(2):
            continue
        prof += -1 if c.group(1) else 1
        if not prof:
            return t[m.start():i + c.end()]
    return t[m.start():]


def sin_cursiva_en_notas(ruta: Path) -> int:
    """--arreglar: quita <em>, <i> y <cite> de las notas del EPUB (lo mismo que hace md_a_epub.py
    al armar). Devuelve cuántas notas cambió; después hay que rehacer el PDF."""
    with zipfile.ZipFile(ruta) as z:
        items = [(i, z.read(i.filename)) for i in z.infolist()]
    n, nuevos = 0, []
    for item, datos in items:
        if item.filename.endswith((".xhtml", ".html", ".htm")):
            t = datos.decode("utf-8")
            partes, pos = [], 0
            for m in NOTA.finditer(t):
                if m.start() < pos:
                    continue
                el = elemento(t, m)
                limpio = re.sub(r"</?(?:em|i|cite)\b[^>]*>", "", el)
                n += limpio != el
                partes += [t[pos:m.start()], limpio]
                pos = m.start() + len(el)
            datos = ("".join(partes) + t[pos:]).encode("utf-8")
        nuevos.append((item, datos))
    if n:
        with zipfile.ZipFile(ruta, "w") as z:
            for item, datos in nuevos:  # mimetype va primero y sin comprimir, como venía
                z.writestr(zipfile.ZipInfo(item.filename, item.date_time), datos,
                           compress_type=zipfile.ZIP_STORED if item.filename == "mimetype" else zipfile.ZIP_DEFLATED)
    return n


def plano(t: str) -> str:
    """Sin etiquetas, espacios ni guiones, y con las ligaduras abiertas: el PDF puede cortar una
    palabra al final de la línea y escribe «Scheﬀer» con la ligadura ff."""
    t = unicodedata.normalize("NFKC", html.unescape(re.sub(r"<[^>]+>", " ", t)))
    return re.sub(r"[\s\-‐­]+", "", t)


def falta_credito(ruta: Path, texto: str, creditos: dict, idioma: str = None):
    """El crédito de la ficha, si no está en el texto; None si está o la ficha no lo trae.
    Sin idioma (PDF) vale cualquiera de los dos."""
    textos = creditos.get(ruta.stem)
    if not textos:
        return None
    buscados = [textos[idioma][1]] if idioma else [t[1] for t in textos.values()]
    return None if any(plano(b) in plano(texto) for b in buscados) else buscados[0]


def nav_del_epub(z: zipfile.ZipFile, opf_ruta: str, opf: str):
    """(ruta del nav.xhtml, su texto) o (None, "")."""
    item = re.search(r'<item\b[^>]*properties="[^"]*\bnav\b[^"]*"[^>]*>', opf)
    if not item:
        return None, ""
    base = opf_ruta.rpartition("/")[0] + "/" if "/" in opf_ruta else ""
    ruta = base + re.search(r'href="([^"]+)"', item.group(0)).group(1)
    return ruta, z.read(ruta).decode("utf-8", "replace") if ruta in z.namelist() else ""


def revisar_nav(z: zipfile.ZipFile, opf_ruta: str, opf: str, hrefs: dict, spine: list) -> list:
    """El índice que se lee como página (nav en el spine) tiene diseño de libro: enlaces en tinta
    heredada y sin subrayado, sin la lista numerada y sin color fijo (modo oscuro). Lo arma
    indice.py; antes era una lista web azul, subrayada y numerada 1-9 (24-oct-2026)."""
    ruta, t = nav_del_epub(z, opf_ruta, opf)
    if not ruta or ruta.rpartition("/")[2] not in [s.rpartition("/")[2] for s in spine]:
        return []
    carpeta = ruta.rpartition("/")[0] + "/" if "/" in ruta else ""
    css = " ".join(z.read(carpeta + h).decode("utf-8", "replace") for h in re.findall(r'<link\b[^>]*href="([^"]+\.css)"', t)
                   if carpeta + h in z.namelist())
    css += " ".join(re.findall(r"<style\b[^>]*>(.*?)</style>", t, re.S))
    reglas = re.findall(r"([^{}]+)\{([^}]*)\}", re.sub(r"/\*.*?\*/", "", css, flags=re.S))
    E = []
    if not re.search(r'<nav\b[^>]*class="[^"]*\bindice\b', t):
        return ["el índice es una lista web (enlaces azules, subrayados y numerados): correr indice.py"]
    def hay(selector, propiedad):
        return any(re.search(selector, s) and re.search(propiedad, c) for s, c in reglas)
    if not hay(r"nav\.indice\s+a\b", r"text-decoration:\s*none"):
        E.append("los enlaces del índice van subrayados")
    if not hay(r"nav\.indice\s+a\b", r"color:\s*(?:inherit|currentColor)"):
        E.append("los enlaces del índice no van en el color del texto (quedan azules)")
    if not hay(r"nav\.indice\s+ol\b", r"list-style:\s*none"):
        E.append("el índice lleva la numeración de la lista (1, 2, 3...)")
    fijos = [s.strip() for s, c in reglas if "indice" in s and re.search(r"(?<!-)color:(?!\s*(?:inherit|currentColor))", c)]
    if fijos:
        E.append(f"el índice fija un color (no sigue el modo oscuro del lector): {', '.join(fijos)[:80]}")
    return E


def revisar_epub(ruta: Path, creditos: dict) -> list:
    E = []
    with zipfile.ZipFile(ruta) as z:
        nombres = z.namelist()
        opf_ruta = re.search(r'full-path="([^"]+)"', z.read("META-INF/container.xml").decode("utf-8")).group(1)
        opf = z.read(opf_ruta).decode("utf-8")
        paginas = " ".join(z.read(x).decode("utf-8", "replace") for x in nombres
                           if x.endswith((".xhtml", ".html", ".htm")) and b"fenix-credito" in z.read(x))
        if (c := falta_credito(ruta, paginas, creditos, credito_portada.idioma_de(opf))):
            E.append(f"sin el crédito de la portada «{c}» (correr credito_portada.py)")
        hrefs = {}
        for item in re.findall(r"<item\b[^>]*>", opf):
            a = dict(re.findall(r'(\w[\w-]*)="([^"]*)"', item))
            hrefs[a.get("id")] = a.get("href")
        spine = [hrefs.get(i, "") for i in re.findall(r'<itemref\b[^>]*idref="([^"]+)"', opf)]
        if len(spine) < 2 or spine[1].rpartition("/")[2] != EXLIBRIS:
            E.append("el ex libris no es la segunda página (correr exlibris.py)")
        n, ej = 0, ""
        for nombre in nombres:
            if not nombre.endswith((".xhtml", ".html", ".htm")):
                continue
            t = z.read(nombre).decode("utf-8", "replace")
            for m in NOTA.finditer(t):
                el = elemento(t, m)
                if CURSIVA.search(el):
                    n += 1
                    ej = ej or re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", el)).strip()[:70]
        css = " ".join(z.read(x).decode("utf-8", "replace") for x in nombres if x.endswith(".css"))
        reglas = [s.strip() for s, cuerpo in re.findall(r"([^{}]+)\{([^}]*)\}", css)
                  if re.search(r"footnote|\.notas\b", s) and re.search(r"font-style:\s*italic", cuerpo)]
        E += revisar_nav(z, opf_ruta, opf, hrefs, spine)
    if n:
        E.append(f"{n} notas con cursiva (ReadEra borra ese texto), p. ej. «{ej}»")
    if reglas:
        E.append(f"el CSS pone en cursiva las notas: {', '.join(reglas)[:80]}")
    return E


def numeros_del_indice(ruta: Path, d) -> list:
    """Si el EPUB hermano trae el índice de indice.py, en el PDF cada entrada del índice lleva a
    la derecha el número de la página a la que lleva su enlace (epub_a_pdf.py los dibuja)."""
    epub = ruta.with_suffix(".epub")
    if not epub.exists():
        return []
    with zipfile.ZipFile(epub) as z:
        opf_ruta = re.search(r'full-path="([^"]+)"', z.read("META-INF/container.xml").decode("utf-8")).group(1)
        opf = z.read(opf_ruta).decode("utf-8")
        nav, t = nav_del_epub(z, opf_ruta, opf)
    id_nav = re.search(r'<item\b[^>]*properties="[^"]*\bnav\b[^>]*>', opf)
    id_nav = re.search(r'\bid="([^"]+)"', id_nav.group(0)).group(1) if id_nav else None
    en_spine = id_nav and re.search(rf'<itemref\b[^>]*idref="{re.escape(id_nav)}"', opf)
    if not nav or not en_spine or not re.search(r'<nav\b[^>]*class="[^"]*\bindice\b', t):
        return []
    titulo = re.search(r"<h1>([^<]+)</h1>", t)
    titulo = titulo.group(1).strip() if titulo else "Índice"
    paginas = [p for p in d.pages(0, min(20, d.page_count))
               if p.get_text().lstrip().startswith(titulo) and p.get_links()]
    if not paginas:
        return [f"no se encontró la página «{titulo}» del índice en el PDF"]
    def de_indice(p) -> bool:
        """Casi todas sus líneas son enlaces (una página de texto con notas tiene pocos)."""
        rects = [l["from"] for l in p.get_links() if l["kind"] == fitz.LINK_GOTO]
        lineas = [fitz.Rect(l["bbox"]) for b in p.get_text("dict")["blocks"] for l in b.get("lines", [])]
        en_enlace = [any(x.y0 < (r.y0 + r.y1) / 2 < x.y1 for x in rects) for r in lineas]  # números y puntos incluidos
        return len(rects) > 2 and sum(en_enlace) >= 0.7 * len(lineas)
    paginas = paginas[:1]
    k = paginas[0].number + 1
    while k < d.page_count and de_indice(d[k]):
        paginas.append(d[k])
        k += 1
    malos, total = [], 0
    for p in paginas:
        palabras = p.get_text("words")
        enlaces = sorted((l for l in p.get_links() if l["kind"] == fitz.LINK_GOTO), key=lambda l: l["from"].y0)
        entradas = []
        for l in enlaces:
            if entradas and entradas[-1][0] == l["page"] and l["from"].y0 - entradas[-1][1].y1 < 5:
                entradas[-1][1] = l["from"]
            else:
                entradas.append([l["page"], l["from"]])
        for destino, r in entradas:
            total += 1
            medio = (r.y0 + r.y1) / 2
            nums = [w for w in palabras if w[0] > r.x1 and w[1] < medio < w[3] and w[4].isdigit()]
            num = int(max(nums, key=lambda w: w[2])[4]) if nums else None
            if num != destino + 1:
                linea = " ".join(w[4] for w in palabras if w[1] < medio < w[3] and w[2] <= r.x1 + 1)[:40]
                malos.append(f"«{linea}» {'sin número' if num is None else f'dice {num}'}, lleva a la {destino + 1}")
    if malos:
        return [f"{len(malos)} de {total} entradas del índice sin su número de página correcto (rehacer con "
                f"epub_a_pdf.py): " + "; ".join(malos[:4])]
    return []


def revisar_pdf(ruta: Path, creditos: dict) -> list:
    E = []
    d = fitz.open(str(ruta))
    if d.page_count < 3:
        return [f"solo {d.page_count} páginas"]
    if (c := falta_credito(ruta, " ".join(d[i].get_text() for i in range(min(6, d.page_count))), creditos)):
        E.append(f"sin el crédito de la portada «{c}» en las primeras páginas (rehacer con epub_a_pdf.py)")
    deformadas = []
    for i, p in enumerate(d):
        area = p.rect.width * p.rect.height
        infos = p.get_image_info()
        if i < 2 and not any(fitz.Rect(x["bbox"]).width * fitz.Rect(x["bbox"]).height > PAGINA_ENTERA * area
                             for x in infos):
            E.append(f"página {i + 1} sin imagen de página entera ({'portada' if i == 0 else 'ex libris'})")
        for x in infos:
            b = fitz.Rect(x["bbox"])
            if b.width * b.height <= PAGINA_ENTERA * area or not x["width"] or not b.height:
                continue
            r = (b.width / b.height) / (x["width"] / x["height"])
            if max(r, 1 / r) - 1 > DEFORMACION:
                deformadas.append((i + 1, r))
    if deformadas:
        quien = {1: "portada", 2: "ex libris"}
        E.append("imágenes deformadas: " + ", ".join(
            f"{quien.get(n, f'página {n}')} estirada {max(r, 1 / r) - 1:.0%} a lo {'ancho' if r > 1 else 'alto'}"
            for n, r in deformadas[:6])
            + (f" y {len(deformadas) - 6} más" if len(deformadas) > 6 else "")
            + " (rehacer con epub_a_pdf.py)")

    toc = d.get_toc()
    if not toc:
        E.append("sin marcadores (índice lateral)")
    elif len(toc) > 1 and all(t[2] == 1 for t in toc):
        E.append(f"los {len(toc)} marcadores apuntan a la página 1")
    destinos = [l.get("page") for p in d for l in p.get_links() if l["kind"] == fitz.LINK_GOTO]
    if len(destinos) > 1 and set(destinos) == {0}:
        E.append(f"los {len(destinos)} enlaces del índice apuntan a la página 1")
    E += numeros_del_indice(ruta, d)

    esquinas = {}
    for p in d.pages(2):
        pm = p.get_pixmap(matrix=fitz.Matrix(ESCALA_FONDO, ESCALA_FONDO))
        cajas = [fitz.Rect(x["bbox"]) * ESCALA_FONDO for x in p.get_image_info()]
        puntos = [(1, 1), (pm.width - 2, 1), (1, pm.height - 2), (pm.width - 2, pm.height - 2)]
        esquinas[p.number] = [pm.pixel(x, y) for x, y in puntos
                              if not any(c.contains(fitz.Point(x + 0.5, y + 0.5)) for c in cajas)]
    moda = Counter(c for cs in esquinas.values() for c in cs).most_common(1)
    if moda:
        fondo = moda[0][0]
        distintas = [n + 1 for n, cs in esquinas.items()
                     if any(max(abs(a - b) for a, b in zip(c, fondo)) > DIF_FONDO for c in cs)]
        if distintas:
            E.append(f"{len(distintas)} páginas con otro color de fondo que {fondo}: "
                     + ", ".join(map(str, distintas[:10])) + ("..." if len(distintas) > 10 else ""))
    return E


def cambiados(desde: str) -> list:
    r = subprocess.run(["git", "diff", "--name-only", "--diff-filter=AMR", f"{desde}...HEAD", "--", "libros"],
                       cwd=RAIZ, capture_output=True, text=True, encoding="utf-8")
    if r.returncode != 0:
        sys.exit(f"git diff falló:\n{r.stderr}")
    tallos = {Path(f).stem for f in r.stdout.split() if f.endswith((".epub", ".pdf"))}
    return [p for s in sorted(tallos) for p in (LIBROS / f"{s}.epub", LIBROS / f"{s}.pdf") if p.exists()]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("archivos", nargs="*", type=Path)
    ap.add_argument("--desde", help="revisar los libros que cambiaron desde esta referencia de git")
    ap.add_argument("--todos", action="store_true", help="todo libros/ (informe; puede tardar)")
    ap.add_argument("--arreglar", action="store_true",
                    help="antes de revisar, quita la cursiva de las notas de los EPUB (después, epub_a_pdf.py)")
    a = ap.parse_args()
    if a.todos:
        archivos = sorted(LIBROS.glob("*.epub")) + sorted(LIBROS.glob("*.pdf"))
    elif a.desde:
        archivos = cambiados(a.desde)
    else:
        archivos = a.archivos
    if not archivos:
        if a.archivos or a.todos or a.desde:
            print("Ningún libro que revisar.")
            return
        ap.error("pasar archivos, --desde o --todos")
    if a.arreglar:
        for ruta in archivos:
            if ruta.suffix == ".epub" and (n := sin_cursiva_en_notas(ruta)):
                print(f"--arreglar {ruta.name}: {n} notas sin cursiva; rehacer su PDF con epub_a_pdf.py")
    errores = 0
    creditos = credito_portada.creditos()
    for ruta in sorted(archivos):
        E = revisar_pdf(ruta, creditos) if ruta.suffix == ".pdf" else revisar_epub(ruta, creditos)
        for e in E:
            print(f"ERROR {ruta.name}: {e}")
        errores += len(E)
    if errores:
        sys.exit(f"{errores} errores en {len(archivos)} archivos.")
    print(f"Libros listos ({len(archivos)} archivos).")


if __name__ == "__main__":
    main()
