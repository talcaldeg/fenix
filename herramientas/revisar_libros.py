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

Termina con «Libros listos» o con la lista de errores (código 1).
"""
import argparse
import re
import subprocess
import sys
import zipfile
from collections import Counter
from pathlib import Path

import fitz  # PyMuPDF

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


def revisar_epub(ruta: Path) -> list:
    E = []
    with zipfile.ZipFile(ruta) as z:
        nombres = z.namelist()
        opf_ruta = re.search(r'full-path="([^"]+)"', z.read("META-INF/container.xml").decode("utf-8")).group(1)
        opf = z.read(opf_ruta).decode("utf-8")
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
    if n:
        E.append(f"{n} notas con cursiva (ReadEra borra ese texto), p. ej. «{ej}»")
    if reglas:
        E.append(f"el CSS pone en cursiva las notas: {', '.join(reglas)[:80]}")
    return E


def revisar_pdf(ruta: Path) -> list:
    E = []
    d = fitz.open(str(ruta))
    if d.page_count < 3:
        return [f"solo {d.page_count} páginas"]
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
    for ruta in sorted(archivos):
        E = revisar_pdf(ruta) if ruta.suffix == ".pdf" else revisar_epub(ruta)
        for e in E:
            print(f"ERROR {ruta.name}: {e}")
        errores += len(E)
    if errores:
        sys.exit(f"{errores} errores en {len(archivos)} archivos.")
    print(f"Libros listos ({len(archivos)} archivos).")


if __name__ == "__main__":
    main()
