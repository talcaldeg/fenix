# -*- coding: utf-8 -*-
"""Revisa el paquete de un encuadernador antes de entregarlo (y Fénix, al recibirlo).

    python herramientas/revisar_entrega.py entrega/<id>

Solo usa la biblioteca estándar de Python, para que corra en cualquier equipo. Las reglas del
paquete están en editorial/ENCUADERNAR.md. Termina con «Entrega lista» o con la lista de errores.
"""
import html
import json
import re
import sys
import zipfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CATEGORIAS = {"lectura", "oracion", "novela", "teatro", "poesia", "ensayo"}
GENEROS = {"Literatura", "Pensamiento", "Espiritualidad"}
CAMPOS_EPUB = ("titulo", "autor", "subtitulo", "original", "editor", "traduccionFenix", "derechos")


def ids_fenix():
    """Ids de fichas y alias de datos.js (sin ejecutar JavaScript)."""
    datos = RAIZ / "datos.js"
    if not datos.exists():
        return None
    t = datos.read_text(encoding="utf-8")
    return set(re.findall(r'^\s*id:\s*"([^"]+)"', t, re.M)) | set(re.findall(r'^\s*"([a-z0-9-]+)":\s*\{\s*id:', t, re.M))


def plano(s):
    """Texto comparable: sin marcas de Markdown, comillas unificadas, espacios simples, minúsculas."""
    s = re.sub(r"\[\^[^\]]+\]", "", s)
    s = re.sub(r"[*_#>]", "", s)
    s = re.sub(r"[«»“”\"]", '"', s).replace("’", "'").replace("‘", "'")
    s = re.sub(r"\s*(--|—|–)\s*", "—", s)  # Gutenberg escribe -- en el .txt y — en el EPUB
    return re.sub(r"\s+", " ", s).strip().lower()


def texto_epub(ruta):
    with zipfile.ZipFile(ruta) as z:
        partes = [z.read(n).decode("utf-8", "replace") for n in z.namelist() if n.endswith((".xhtml", ".html", ".htm"))]
    # Las etiquetas de bloque separan palabras; las de línea (versalitas, cursiva) no: «I<span>t is</span>».
    t = re.sub(r"</?(p|div|h\d|li|br|tr|td|blockquote)\b[^>]*>", " ", " ".join(partes))
    return html.unescape(re.sub(r"<[^>]+>", "", t))


def medidas_jpeg(ruta):
    b = ruta.read_bytes()
    if b[:2] != b"\xff\xd8":
        return None
    i = 2
    while i < len(b) - 9:
        if b[i] != 0xFF:
            i += 1
            continue
        m = b[i + 1]
        if m in (0xC0, 0xC1, 0xC2):
            return int.from_bytes(b[i + 7:i + 9], "big"), int.from_bytes(b[i + 5:i + 7], "big")
        i += 2 + int.from_bytes(b[i + 2:i + 4], "big")
    return None


def revisar(carpeta: Path):
    """Devuelve (errores, avisos, ficha)."""
    E, A = [], []
    fj = carpeta / "ficha.json"
    if not fj.exists():
        return [f"falta {fj.name}"], A, None
    try:
        f = json.loads(fj.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        return [f"ficha.json no es JSON válido: {e}"], A, None

    def texto(campo, v):
        if not isinstance(v, str) or not v.strip():
            E.append(f"ficha: «{campo}» vacío")

    def bilingue(campo):
        v = f.get(campo)
        if not isinstance(v, dict):
            E.append(f"ficha: «{campo}» debe ser {{\"es\": ..., \"en\": ...}}")
            return
        for k in ("es", "en"):
            texto(f"{campo}.{k}", v.get(k))
        if re.search(r"[—–]", v.get("es") or ""):
            E.append(f"ficha: «{campo}.es» tiene raya larga o semirraya")

    version = f.get("versionDe")
    gutenberg = f.get("gutenberg")
    ids = ids_fenix()
    fid = f.get("id") or ""
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", fid):
        E.append("ficha: «id» debe ir en minúsculas, sin tildes y con guiones (apellido-titulo)")
    if f.get("idioma") not in ("es", "en"):
        E.append("ficha: «idioma» debe ser es o en")
    for c in ("titulo", "autor", "anio"):
        texto(c, f.get(c))
    for c in ("resumen", "porque"):
        bilingue(c)
    if ids is not None:
        if version and version not in ids:
            E.append(f"ficha: «versionDe» {version} no existe en datos.js")
        if not version and fid in ids:
            E.append(f"ficha: el id {fid} ya existe en datos.js (¿es otra versión? use versionDe)")
    if not version:
        if f.get("categoria") not in CATEGORIAS:
            E.append(f"ficha: «categoria» debe ser una de {sorted(CATEGORIAS)}")
        d = f.get("delibris")
        if d is not None:
            if not isinstance(d, dict) or d.get("valor") not in range(1, 7) or d.get("genero") not in GENEROS or not d.get("url"):
                E.append("ficha: «delibris» debe ser null o {valor 1-6, genero Literatura/Pensamiento/Espiritualidad, url}")
            elif d["valor"] < 5:
                E.append(f"ficha: Delibris lo valora {d['valor']}/6; Fénix solo publica 5 o 6")
        par = f.get("parecidos") or []
        if len(par) < 3:
            A.append("ficha: «parecidos» debería traer tres ids de Fénix")
        if ids is not None:
            # Un lote de entregas puede citarse entre sí: valen los id de las carpetas hermanas.
            lote = {p.name for p in carpeta.resolve().parent.iterdir() if p.is_dir()}
            for p in par:
                if p not in ids and p not in lote:
                    E.append(f"ficha: el parecido {p} no existe en datos.js ni en el lote")

    im = f.get("imagen") or {}
    if not isinstance(im.get("credito"), dict) or not all(im["credito"].get(k) for k in ("es", "en")):
        E.append("ficha: «imagen.credito» necesita es y en")
    if "commons.wikimedia.org" not in (im.get("url") or ""):
        E.append("ficha: «imagen.url» debe ser la página del cuadro en Wikimedia Commons")
    for k in ("cx", "cy"):
        if not isinstance(im.get(k, 0.5), (int, float)) or not 0 <= im.get(k, 0.5) <= 1:
            E.append(f"ficha: «imagen.{k}» va de 0 a 1")
    cuadro = carpeta / "cuadro.jpg"
    if not cuadro.exists():
        E.append("falta cuadro.jpg")
    else:
        m = medidas_jpeg(cuadro)
        if not m:
            E.append("cuadro.jpg no es un JPEG")
        elif m[0] < 1200 and m[1] < 1800:
            A.append(f"cuadro.jpg mide {m[0]}x{m[1]}; mejor desde 1200 px de ancho")
    fu = f.get("fuente") or {}
    if not fu.get("texto") or not fu.get("url"):
        E.append("ficha: «fuente» necesita texto y url")

    citas = f.get("citas") or []
    if not 3 <= len(citas) <= 5:
        E.append(f"ficha: trae {len(citas)} citas; van de 3 a 5")

    informe = carpeta / "INFORME.md"
    if not informe.exists():
        E.append("falta INFORME.md")
    elif len(informe.read_text(encoding="utf-8").splitlines()) > 60:
        A.append("INFORME.md pasa de 60 líneas; resúmelo")

    tdir = carpeta / "texto"
    if gutenberg:
        if not isinstance(gutenberg, int):
            E.append("ficha: «gutenberg» es el número del libro (entero)")
        if tdir.exists():
            A.append("vía A (Gutenberg): la carpeta texto/ sobra")
        return E, A, f

    ep = f.get("epub") or {}
    for k in CAMPOS_EPUB:
        if k not in ep:
            E.append(f"ficha: falta «epub.{k}»")
    bilingue("editorial")
    mds = sorted(p for p in tdir.glob("*.md") if p.name != "nota.md") if tdir.exists() else []
    if not mds:
        E.append("falta texto/ con el libro en Markdown (o «gutenberg» si es la vía A)")
        return E, A, f
    if not (tdir / "nota.md").exists():
        E.append("falta texto/nota.md («Nota de esta edición»)")
    todo = ""
    for p in mds:
        t = p.read_text(encoding="utf-8")
        todo += "\n" + t
        llamadas = set(re.findall(r"\[\^([^\]]+)\](?!:)", t))
        defs = set(re.findall(r"^\[\^([^\]]+)\]:", t, re.M))
        if llamadas - defs:
            E.append(f"{p.name}: notas sin texto {sorted(llamadas - defs)}")
        if f.get("idioma") == "es":
            n = len(re.findall(r"[—–]", t))
            if n:
                E.append(f"{p.name}: {n} rayas largas o semirrayas (en español van «» o comas)")
            n = t.count('"')
            if n:
                A.append(f"{p.name}: {n} comillas rectas (en español van «»)")
        for patron, que in ((r"Project Gutenberg|\*\*\* ?(START|END) OF", "restos de Gutenberg"),
                            (r"\[Illustration|\[Ilustraci", "marcas de ilustración"),
                            (r"^\s*\d{1,4}\s*$", "líneas que son solo un número (¿páginas?)"),
                            (r"\w-\n\w", "palabras cortadas con guion al final de línea")):
            n = len(re.findall(patron, t, re.M))
            if n:
                A.append(f"{p.name}: {n} {que}")
    if not re.search(r"^## ", todo, re.M):
        E.append("texto/: ningún capítulo empieza con «## »")
    base = plano(todo)
    for c in citas:
        if plano(c) not in base:
            E.append(f"cita que no está en el texto: «{c[:70]}...»")
    palabras = len(re.sub(r"[#*>\[\]^]", " ", todo).split())
    A.append(f"texto: {len(mds)} archivos, {palabras} palabras")
    return E, A, f


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    carpeta = Path(sys.argv[1])
    E, A, _ = revisar(carpeta)
    for a in A:
        print("AVISO:", a)
    for e in E:
        print("ERROR:", e)
    if E:
        sys.exit(f"{len(E)} errores: corrígelos y vuelve a revisar.")
    print("Entrega lista.")


if __name__ == "__main__":
    main()
