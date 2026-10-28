# -*- coding: utf-8 -*-
"""Edición bilingüe de cotejo de una traducción propia: cada párrafo en español seguido del original.

    python herramientas/bilingue.py <id> --original <texto.txt> --idioma en \\
        --tramo 00_prefacio.md:40-155 --tramo 01_capitulo_1.md:190-563 ... \\
        --fuente "*One with Jesus* (Newman Press, 1953)" [--cabecera "One With Jesus"]

- <id> es la carpeta de editorial/<id>/. Cada --tramo dice qué líneas del texto original (1 en
  adelante, ambas incluidas) corresponden a ese archivo .md.
- El original es un .txt de OCR (Internet Archive u otro). Se le sacan cabezas de página, números
  de página, llamadas y notas al pie (letra menor: líneas de más de --ancho-pie caracteres) y se
  unen los párrafos cortados por el salto de página.
- Los párrafos se alinean por largo, como Gale-Church: 1-1, 1-2, 1-3, 2-1 y sueltos; el original
  que queda suelto va con el párrafo anterior.
- Parte del EPUB publicado (portada, ex libris, crédito), le cambia los capítulos por los
  bilingües (el original en <p class="orig" lang="..">, letra menor y línea al margen), suma
  «Edición bilingüe español-<idioma>» a la portadilla y una línea a la nota de la edición, y saca
  el PDF con epub_a_pdf.py.
- La salida es de uso personal y nunca va al repo: fenix_fuentes/<nombre>_bilingue_es-<idioma>
  .epub y .pdf, más un _pares.tsv con cada par alineado para revisar los dudosos.
"""
import argparse
import math
import re
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

AQUI = Path(__file__).resolve().parent
COPIA = AQUI.parent  # la copia de trabajo (o la carpeta principal)
RAIZ = COPIA.parent.parent if COPIA.parent.name == ".sesiones" else COPIA
FUENTES = RAIZ.parent / "fenix_fuentes"

# idioma: (adjetivo, nombre en la portadilla, largo del español sobre el del original)
IDIOMAS = {
    "en": ("inglés", "español-inglés", 1.12),
    "fr": ("francés", "español-francés", 1.0),
    "it": ("italiano", "español-italiano", 1.0),
    "de": ("alemán", "español-alemán", 1.0),
    "la": ("latino", "español-latín", 1.2),
}
MARCA = "ORIG§ "
MAYUS = "A-ZÀ-ÖØ-Þ"
PIE = rf"^(\d{{1,2}}\s?\S|[x•\*<†]\s?\S|M(?=[{MAYUS}“])|a(?=[{MAYUS}])|[“\"«]\s?[{MAYUS}])"


def limpiar(lineas, a, b, cabecera, ancho_pie):
    """Párrafos del original entre las líneas a y b, sin cabezas, notas al pie ni llamadas."""
    paras, cur, anchos, ancho = [], [], [], []
    for crudo in lineas[a - 1:b] + [""]:
        l = re.sub(r"\s+", " ", crudo).strip()
        if l:
            cur.append(l)
            ancho.append(len(l))
        elif cur:
            paras.append(cur)
            anchos.append(ancho)
            cur, ancho = [], []
    # Las notas al pie van en letra menor: sus líneas son más anchas que las del cuerpo.
    pie_ancho = {k for k, w in enumerate(anchos)
                 if sum(x >= ancho_pie for x in (w[:-1] or w)) * 2 >= len(w[:-1] or w)}

    def es_cabeza(p):
        largo = sum(len(x) for x in p)
        if largo < 60 and ((cabecera and re.search(cabecera, p[0], re.I))
                           or re.fullmatch(r"[\divxlc\s\.]+", p[0], re.I)):
            return True
        # títulos y cabezas de página: cortos, sin puntuación final y terminados en palabra con mayúscula
        return largo < 130 and not re.search(r"[.?!:;\"”’)]$", p[-1]) and \
            re.search(rf"(^|\s)[{MAYUS}0-9]\S*$", p[-1]) is not None and not re.match(r"\d+\.\s", p[0])

    pie = set()
    for k, p in enumerate(paras):
        if not es_cabeza(p) and k + 1 < len(paras) and es_cabeza(paras[k + 1]):
            j = k
            while j >= 0 and not es_cabeza(paras[j]) and re.match(PIE, paras[j][0]) and \
                    re.search(r"[.?!\"”’»)/]$", paras[j][-1]):
                pie.add(j)
                j -= 1
    out = []
    for k, p in enumerate(paras):
        if es_cabeza(p) or k in pie or k in pie_ancho or \
                (re.match(PIE, p[0]) and len(p) == 1 and re.search(r"\)\.$", p[0])):
            continue
        txt = ""
        for l in p:
            if txt.endswith("-") and l[:1].islower():
                txt = txt[:-1] + l
            else:
                txt = (txt + " " + l).strip()
        out.append(txt)
    # unir párrafos cortados por un salto de página (sin «»»: el OCR deja «5»» de basura al pie)
    unidos = []
    for t in out:
        if unidos and not re.search(r"[.?!:\"”’)]\s*\d?$", unidos[-1]) and t[:1].islower():
            unidos[-1] = unidos[-1].rstrip("-") + ("" if unidos[-1].endswith("-") else " ") + t
        else:
            unidos.append(t)
    limpio = []
    for t in unidos:
        t = re.sub(r"(?<=[a-zß-ÿ\.,;:!?”\"’»)])\d{1,2}(?=\s|$)", "", t)  # llamadas de nota
        t = t.replace("*", "")
        t = re.sub(r"(\s+\d)+$", "", t)  # llamadas sueltas al final
        t = re.sub(r"\s+([.,;:!?)])", r"\1", t)
        limpio.append(t.strip())
    return [t for t in limpio if t]


def bloques_es(txt):
    """Bloques del .md (sin las definiciones de notas) y el tramo de notas, aparte."""
    cuerpo = re.split(r"(?m)^\[\^\w+\]:", txt, maxsplit=1)[0]
    bs = [b.strip("\n") for b in re.split(r"\n\s*\n", cuerpo) if b.strip()]
    return bs, txt[len(cuerpo):]


def largo_es(b):
    return len(re.sub(r"\[\^\w+\]|[>*_]", "", b))


def alinear(es, orig, razon):
    """Programación dinámica tipo Gale-Church sobre largos: es[i] (párrafos) contra orig[j]."""
    n, m = len(es), len(orig)
    INF = 1e18
    D = [[INF] * (m + 1) for _ in range(n + 1)]
    P = [[None] * (m + 1) for _ in range(n + 1)]
    D[0][0] = 0
    le = [largo_es(x) for x in es]
    lo = [len(x) for x in orig]

    def costo(a, b):
        return abs(math.log((a + 20) / (razon * b + 20))) * 10

    for i in range(n + 1):
        for j in range(m + 1):
            if D[i][j] == INF:
                continue
            movs = []
            if i < n and j < m:
                movs.append((1, 1, costo(le[i], lo[j])))
            if i < n and j + 1 < m:
                movs.append((1, 2, costo(le[i], lo[j] + lo[j + 1]) + 4))
            if i < n and j + 2 < m:
                movs.append((1, 3, costo(le[i], lo[j] + lo[j + 1] + lo[j + 2]) + 9))
            if i + 1 < n and j < m:
                movs.append((2, 1, costo(le[i] + le[i + 1], lo[j]) + 4))
            if i < n:
                movs.append((1, 0, 6 + le[i] / 200))
            if j < m:
                movs.append((0, 1, 6 + lo[j] / 200))
            for di, dj, k in movs:
                if D[i][j] + k < D[i + di][j + dj]:
                    D[i + di][j + dj] = D[i][j] + k
                    P[i + di][j + dj] = (di, dj)
    i, j, pasos = n, m, []
    while i or j:
        di, dj = P[i][j]
        pasos.append((i - di, di, j - dj, dj))
        i, j = i - di, j - dj
    return pasos[::-1]


def armar_md(editorial, lineas, tramos, args, md):
    """Escribe en md/ los .md con el original después de cada párrafo y devuelve las filas del informe."""
    adjetivo, _, razon = IDIOMAS[args.idioma]
    razon = args.razon or razon
    informe = ["archivo\tpaso\tespañol\toriginal"]
    for nombre, a, b in tramos:
        bs, notas = bloques_es((editorial / nombre).read_text(encoding="utf-8"))
        orig = limpiar(lineas, a, b, args.cabecera, args.ancho_pie)
        cuerpo = [k for k, x in enumerate(bs) if not x.startswith("#")]
        es = [bs[k] for k in cuerpo]
        pasos = alinear(es, orig, razon)
        despues, sueltos, ultimo = {}, 0, -1  # índice de bloque -> textos del original
        for i0, di, j0, dj in pasos:
            textos = orig[j0:j0 + dj]
            if di == 0:
                sueltos += 1
                if ultimo >= 0:
                    despues.setdefault(cuerpo[ultimo], []).extend(textos)
                continue
            ultimo = i0 + di - 1
            if textos:
                despues.setdefault(cuerpo[ultimo], []).extend(textos)
            informe.append(f"{nombre}\t{di}-{dj}\t{es[i0][:90]}\t{textos[0][:90] if textos else '-'}")
        out = []
        for k, x in enumerate(bs):
            out.append(x)
            if k in despues:
                out.append(MARCA + " ".join(despues[k]))
        (md / nombre).write_text("\n\n".join(out) + "\n\n" + notas, encoding="utf-8")
        print(f"{nombre}: es={len(es)} original={len(orig)} pasos={len(pasos)} sueltos={sueltos}")
    nota = (editorial / "nota.md").read_text(encoding="utf-8").rstrip()
    (md / "nota.md").write_text(
        nota + "\n\nEsta es una versión bilingüe, de uso personal, para cotejar la traducción: cada "
        f"párrafo en español va seguido del texto {adjetivo} de {args.fuente}, en letra menor y con una "
        f"línea al margen. El {adjetivo} viene {args.procedencia}, sin sus notas al pie, y puede traer "
        "erratas de lectura.\n", encoding="utf-8")
    return informe


def meta_opf(epub):
    """Título y autor del OPF del EPUB publicado."""
    with zipfile.ZipFile(epub) as z:
        opf = next(n for n in z.namelist() if n.endswith(".opf"))
        txt = z.read(opf).decode("utf-8")
    campo = lambda c: re.sub(r"\s+", " ", re.search(rf"<dc:{c}[^>]*>(.*?)</dc:{c}>", txt, re.S).group(1)).strip()
    return campo("title"), campo("creator")


def armar_epub(publicado, md, salida, idioma):
    """El EPUB publicado con los capítulos bilingües, la portadilla y el estilo del original."""
    _, rotulo, _ = IDIOMAS[idioma]
    titulo, autor = meta_opf(publicado)
    tmp = md.parent / "bilingue_tmp.epub"
    subprocess.run([sys.executable, str(AQUI / "md_a_epub.py"), str(md), str(tmp), "--titulo", titulo,
                    "--autor", autor, "--subtitulo", f"Edición bilingüe {rotulo}"],
                   check=True, stdout=subprocess.DEVNULL)
    css = ("\np.orig { font-size: 0.86em; color: #4a4a4a; border-left: 2px solid #b9b9b9; "
           "padding-left: 0.6em; margin: 0.3em 0 1em 0; text-indent: 0; font-style: normal; }\n")
    with zipfile.ZipFile(tmp) as nuevo, zipfile.ZipFile(publicado) as pub, zipfile.ZipFile(salida, "w") as z:
        nombres = set(nuevo.namelist())
        faltan = [n for n in nombres if n.endswith(".xhtml") and n not in pub.namelist()]
        if faltan:
            sys.exit(f"Capítulos del bilingüe que no están en el publicado: {faltan}")
        for info in pub.infolist():
            n, datos = info.filename, pub.read(info.filename)
            if n.endswith("portadilla.xhtml"):
                datos = re.sub(r'(<p class="t3">[^<]*</p>)', rf'\1<p class="t3">Edición bilingüe {rotulo}</p>',
                               datos.decode("utf-8"), count=1).encode("utf-8")
            elif n.endswith(".xhtml") and n in nombres:
                texto = nuevo.read(n).decode("utf-8")
                if MARCA in texto or "nota" in n.lower():
                    datos = texto.replace("<p>" + MARCA, f'<p class="orig" lang="{idioma}">').encode("utf-8")
            elif n.endswith("estilo.css"):
                datos += css.encode("utf-8")
            z.writestr(info, datos, compress_type=zipfile.ZIP_STORED if n == "mimetype" else zipfile.ZIP_DEFLATED)
    with zipfile.ZipFile(salida) as z:
        xs = [z.read(n).decode("utf-8", "ignore") for n in z.namelist() if n.endswith(".xhtml")]
    if any(MARCA.strip() in x for x in xs):
        sys.exit("Quedaron párrafos del original sin convertir.")
    return sum(x.count('class="orig"') for x in xs)


def tramo(s):
    m = re.fullmatch(r"(.+\.md):(\d+)-(\d+)", s)
    if not m:
        raise argparse.ArgumentTypeError(f"--tramo es archivo.md:desde-hasta, no {s!r}")
    return m.group(1), int(m.group(2)), int(m.group(3))


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("id", help="carpeta de editorial/<id>/")
    ap.add_argument("--original", type=Path, required=True, help="texto original (.txt de OCR)")
    ap.add_argument("--idioma", choices=list(IDIOMAS), required=True)
    ap.add_argument("--tramo", type=tramo, action="append", required=True,
                    help="archivo.md:desde-hasta, líneas del original para ese archivo; uno por archivo")
    ap.add_argument("--fuente", required=True, help='edición del original, p. ej. "*One with Jesus* (Newman Press, 1953)"')
    ap.add_argument("--procedencia", default="del OCR de Internet Archive", help="de dónde viene el texto")
    ap.add_argument("--cabecera", default="", help="regex de la cabeza de página del original (su título)")
    ap.add_argument("--ancho-pie", type=int, default=72, help="desde cuántos caracteres una línea es de nota al pie")
    ap.add_argument("--razon", type=float, help="largo del español sobre el del original (por defecto, el del idioma)")
    ap.add_argument("--epub", type=Path, help="EPUB publicado (por defecto, libros/*-<id>.epub)")
    ap.add_argument("--nombre", help="prefijo de la salida (por defecto, el EPUB sin -<id>)")
    args = ap.parse_args()

    editorial = COPIA / "editorial" / args.id
    if not editorial.is_dir():
        sys.exit(f"No existe {editorial}")
    faltan = sorted({p.name for p in editorial.glob("*.md") if p.name != "nota.md"} - {t[0] for t in args.tramo})
    if faltan:
        sys.exit(f"Archivos de {editorial.name} sin --tramo: {faltan}")
    publicado = args.epub or next(iter(sorted((COPIA / "libros").glob(f"*-{args.id}.epub"))), None)
    if not publicado or not publicado.is_file():
        sys.exit("No encontré el EPUB publicado: páselo con --epub")
    publicado = publicado.resolve()
    nombre = args.nombre or publicado.stem.removesuffix("-" + args.id)
    lineas = args.original.read_text(encoding="utf-8").splitlines()

    FUENTES.mkdir(exist_ok=True)
    base = FUENTES / f"{nombre}_bilingue_es-{args.idioma}"
    with tempfile.TemporaryDirectory() as tmp:
        md = Path(tmp) / "md"
        md.mkdir()
        informe = armar_md(editorial, lineas, args.tramo, args, md)
        pares = armar_epub(publicado, md, base.with_suffix(".epub"), args.idioma)
    base.with_name(base.name + "_pares.tsv").write_text("\n".join(informe) + "\n", encoding="utf-8-sig")
    subprocess.run([sys.executable, str(AQUI / "epub_a_pdf.py"), str(base.with_suffix(".epub"))], check=True)
    print(f"{pares} párrafos del original -> {base}.epub y .pdf")


if __name__ == "__main__":
    main()
