# -*- coding: utf-8 -*-
"""Revisa el paquete de un encuadernador antes de entregarlo (y Fénix, al recibirlo).

    python herramientas/revisar_entrega.py entrega/<id> [--arreglar]

--arreglar corrige primero lo mecánico (tildes de la ortografía antigua) y después revisa.
Todo arreglo que Fénix tuvo que hacer al recibir un paquete se vuelve aquí un ERROR, y si es
mecánico, parte de --arreglar: así lo paga el agente del encuadernador y no Fénix.

Solo usa la biblioteca estándar de Python, para que corra en cualquier equipo. Las reglas del
paquete están en editorial/ENCUADERNAR.md. Termina con «Entrega lista» o con la lista de errores.
"""
import html
import json
import re
import sys
import urllib.request
import zipfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CATEGORIAS = {"lectura", "oracion", "novela", "teatro", "poesia", "ensayo"}
GENEROS = {"Literatura", "Pensamiento", "Espiritualidad"}
CAMPOS_EPUB = ("titulo", "autor", "subtitulo", "original", "editor", "traduccionFenix", "derechos")
# Tildes que la RAE ya no pone (fué, sólo, éste, acercóse). Son mecánicas: --arreglar las quita.
ANTIGUAS = re.compile(
    r"(?<!\w)(fué|fuí|dió|vió|sólo|éste|ésta|éstos|éstas|ése|ésa|ésos|ésas|aquél|aquélla|aquéllos|aquéllas"
    r"|\w+(?:ió|ó)(?:se|le|les|lo|la|los|las|me|te|nos))(?!\w)")
SIN_TILDE = str.maketrans("áéíóúÁÉÍÓÚ", "aeiouAEIOU")


def arreglar(carpeta: Path):
    """Quita las tildes antiguas del texto (solo en español) y de las citas de la ficha; en inglés,
    pasa a «Saint» el autor que llegó como «San»/«Santa»."""
    fp = carpeta / "ficha.json"
    f = json.loads(fp.read_text(encoding="utf-8"))
    if f.get("idioma") != "es":
        autor = re.sub(r"^Sant[ao]? ", "Saint ", f.get("autor") or "")
        if autor != f.get("autor"):
            f["autor"] = autor
            fp.write_text(json.dumps(f, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            print("--arreglar: autor ->", autor)
        return
    quitar = lambda s: ANTIGUAS.sub(lambda m: m.group(0).translate(SIN_TILDE), s)  # noqa: E731
    n = 0
    # nota.md queda fuera: ahí se citan las formas antiguas como ejemplo («fué» por «fue»).
    for p in sorted(p for p in (carpeta / "texto").glob("*.md") if p.name != "nota.md"):
        t = p.read_text(encoding="utf-8")
        n += len(ANTIGUAS.findall(t))
        if ANTIGUAS.search(t):
            p.write_text(quitar(t), encoding="utf-8")
    citas = [quitar(c) for c in f.get("citas", [])]
    if citas != f.get("citas", []):
        f["citas"] = citas
        fp.write_text(json.dumps(f, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"--arreglar: {n} tildes antiguas quitadas")


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
    s = re.sub(r"\s/\s", " ", s)  # un verso citado en una línea: «... in the height, / And in ...»
    # Llamadas de nota y números de verso que el EPUB intercala: «lowest deep[33] 860 there» (Geroncio).
    s = re.sub(r"\[\d+\]|(?<!\S)\d+(?!\S)", " ", s)
    return re.sub(r"\s+", " ", s).strip().lower()


def epub_gutenberg(numero: int) -> Path:
    """El EPUB de Gutenberg, bajado una vez por recepción (revisar y armar usan el mismo) y con
    reintentos: Fabiola (33 MB) se cortó a la mitad el 27-oct-2026."""
    ruta = Path(__file__).resolve().parent.parent / ".entregas" / "_gutenberg" / f"{numero}.epub"
    if ruta.exists() and zipfile.is_zipfile(ruta):
        return ruta
    ruta.parent.mkdir(parents=True, exist_ok=True)
    url = f"https://www.gutenberg.org/ebooks/{numero}.epub3.images"
    for intento in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Proyecto Fenix"})
            ruta.write_bytes(urllib.request.urlopen(req, timeout=300).read())
            if zipfile.is_zipfile(ruta):
                return ruta
        except OSError as e:
            if intento == 2:
                raise
            print(f"Reintento {intento + 1} de {url} ({e})")
    raise OSError(f"{url} no trajo un EPUB válido")


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

    # El autor va en el idioma del libro: la lista de buscados lo trae en español y en inglés se
    # copió «San John Henry Newman» a la portada (27-oct-2026). --arreglar lo pasa a «Saint».
    if f.get("idioma") == "en" and re.match(r"Sant[ao]? ", f.get("autor") or ""):
        E.append(f"ficha: autor «{f['autor']}» en español en un libro en inglés (Saint ...); se arregla con --arreglar")

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
            # recibir_entrega deja cada zip en .entregas/<zip>/<id>/: valen también los primos.
            padre = carpeta.resolve().parent
            lote = {p.name for d in (padre, *padre.parent.iterdir()) if d.is_dir()
                    for p in d.iterdir() if p.is_dir()}
            for p in par:
                if p not in ids and p not in lote:
                    E.append(f"ficha: el parecido {p} no existe en datos.js ni en el lote")

    # El cuadro depende de llegar a Wikimedia Commons, que algunos agentes tienen bloqueado: lo que
    # falte no frena la entrega, queda como pendiente y lo completa recibir_entrega.py.
    im = f.get("imagen") or {}
    if not isinstance(im.get("credito"), dict) or not all(im["credito"].get(k) for k in ("es", "en")):
        A.append("pendiente para Fénix: «imagen.credito» (es y en)")
    if "commons.wikimedia.org" not in (im.get("url") or ""):
        A.append("pendiente para Fénix: «imagen.url», la página del cuadro en Wikimedia Commons")
    for k in ("cx", "cy"):
        if not isinstance(im.get(k, 0.5), (int, float)) or not 0 <= im.get(k, 0.5) <= 1:
            E.append(f"ficha: «imagen.{k}» va de 0 a 1")
    cuadro = carpeta / "cuadro.jpg"
    if not cuadro.exists():
        A.append("pendiente para Fénix: cuadro.jpg")
    else:
        m = medidas_jpeg(cuadro)
        if not m:
            A.append("pendiente para Fénix: cuadro.jpg no es un JPEG")
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
        # Las citas se cotejan con el EPUB que bajará Fénix, no con el HTML que leyó el agente
        # (Ligorio, 25-oct-2026: una comilla de cierre fuera de lugar frenó la recepción).
        if isinstance(gutenberg, int):
            try:
                base = plano(texto_epub(epub_gutenberg(gutenberg)))
                for c in citas:
                    if plano(c) not in base:
                        E.append(f"cita que no está en el EPUB de Gutenberg: «{c[:70]}...»")
            except OSError as e:
                A.append(f"no se pudo bajar el EPUB de Gutenberg ({e}); las citas no se cotejaron:"
                         " cópialas del EPUB, no del HTML")
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
    antiguas = []
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
            n = len(re.findall(r"“[^”«»\n]*»|«[^»“”\n]*”", t))
            if n:
                A.append(f"{p.name}: {n} citas que abren con un tipo de comilla y cierran con otro (“...» o «...”)")
            antiguas += ANTIGUAS.findall(t)
        for patron, que in ((r"Project Gutenberg|\*\*\* ?(START|END) OF", "restos de Gutenberg"),
                            (r"\[Illustration|\[Ilustraci", "marcas de ilustración"),
                            (r"^\s*\d{1,4}\s*$", "líneas que son solo un número (¿páginas?)"),
                            (r"\w-\n\w", "palabras cortadas con guion al final de línea")):
            n = len(re.findall(patron, t, re.M))
            if n:
                A.append(f"{p.name}: {n} {que}")
    if antiguas:
        E.append(f"texto: {len(antiguas)} tildes de la ortografía antigua ({', '.join(sorted(set(antiguas))[:5])}...);"
                 " hoy: fue, dio, solo, este, volviose. Se quitan solas con --arreglar")
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
    args = [a for a in sys.argv[1:] if a != "--arreglar"]
    if len(args) != 1:
        sys.exit(__doc__)
    carpeta = Path(args[0])
    if "--arreglar" in sys.argv and (carpeta / "ficha.json").exists():
        arreglar(carpeta)
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
