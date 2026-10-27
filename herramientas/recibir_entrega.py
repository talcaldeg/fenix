# -*- coding: utf-8 -*-
"""Recibe el paquete de un encuadernador y deja el libro listo para publicar.

    python herramientas/recibir_entrega.py <paquete.zip | carpeta> [...]
    python herramientas/recibir_entrega.py --gmail "from:jialcalde newer_than:3d"

Recibe varios paquetes de una vez. Con --gmail baja a .entregas/ los .zip de los correos de
talcaldeg@gmail.com que calcen con la búsqueda. Salta los que ya están publicados, no se detiene
si uno falla, calla la salida de los pasos que salen bien y cierra con una línea por libro y
gen_estaticos.js: lo que queda es auditar-teologia y sesion.py publicar.

1. Descomprime en .entregas/<nombre>/ y corre herramientas/revisar_entrega.py (se detiene si hay
   errores).
2. Arma el EPUB en libros/<id>.epub: vía A, baja el de Project Gutenberg; vías B, C y D, copia
   texto/ a editorial/<id>/ y lo arma con md_a_epub.py.
3. Agrega la ficha al final de `libros` en datos.js, saca el libro de `buscados` y pone la fecha.
4. Portada con el cuadro (portadas.py --epub), exlibris, crédito de la portada, PDF y revisión
   de duplicados.

Una versión en otro idioma (`versionDe`) va igual, pero entra a `versiones` de esa ficha. Lo que
queda a mano: auditar-teologia sobre resumen y «por qué leerlo» si el libro es de fe, y
sesion.py publicar.
"""
import argparse
import json
import re
import shutil
import subprocess
import sys
import urllib.request
import zipfile
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from revisar_entrega import epub_gutenberg, plano, revisar, texto_epub  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
PY = sys.executable
MESES = "ene feb mar abr may jun jul ago sep oct nov dic".split()


def correr(*args):
    """Calla lo que sale bien (cada línea leída cuesta tokens); si falla, muestra el final."""
    r = subprocess.run([str(a) for a in args], cwd=RAIZ, capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    if r.returncode:
        cola = "\n".join((r.stdout + r.stderr).strip().splitlines()[-25:])
        raise RuntimeError(f"{' '.join(str(a) for a in args[1:3])} falló:\n{cola}")


def desempacar(origen: Path) -> Path:
    if origen.is_dir():
        return origen
    destino = RAIZ / ".entregas" / origen.stem
    if destino.exists():
        shutil.rmtree(destino)
    with zipfile.ZipFile(origen) as z:
        z.extractall(destino)
    # El zip puede traer la carpeta <id>/ adentro o los archivos sueltos.
    hijos = [p for p in destino.iterdir() if p.is_dir() and p.name != "texto"]
    return hijos[0] if not (destino / "ficha.json").exists() and len(hijos) == 1 else destino


def armar_epub(c: Path, f: dict, nombre: str) -> Path:
    epub = RAIZ / "libros" / f"{nombre}.epub"
    if f.get("gutenberg"):
        shutil.copyfile(epub_gutenberg(f["gutenberg"]), epub)
        base = plano(texto_epub(epub))
        faltan = [x for x in f["citas"] if plano(x) not in base]
        if faltan:
            sys.exit(f"Citas que no están en el EPUB de Gutenberg: {faltan}")
        return epub
    ed = RAIZ / "editorial" / nombre
    if ed.exists():
        shutil.rmtree(ed)
    shutil.copytree(c / "texto", ed)
    e = f["epub"]
    # En la portadilla va el encuadernador si pidió crédito; si no, Proyecto Fénix.
    editor = f.get("credito") or e.get("editor") or "Proyecto Fénix"
    args = [PY, "herramientas/md_a_epub.py", ed, epub, "--titulo", e["titulo"], "--autor", e["autor"],
            "--subtitulo", e["subtitulo"], "--original", e["original"], "--idioma", f["idioma"],
            "--editor", editor, "--derechos", e["derechos"]]
    if not e.get("traduccionFenix"):
        args.append("--sin-traduccion")
    correr(*args)
    return epub


def con_credito(f: dict):
    """El nombre del encuadernador, si lo pidió, va al final de lo que hizo Fénix."""
    ed, quien = f.get("editorial"), f.get("credito")
    if ed and quien:
        ed = {"es": ed["es"].rstrip(".") + f". Edición al cuidado de {quien.rstrip('.')}.",
              "en": ed["en"].rstrip(".") + f". Edited by {quien.rstrip('.')}."}
    return ed


def js(v):
    return json.dumps(v, ensure_ascii=False)


def ficha_js(f: dict, epub: Path) -> str:
    i = f["id"]
    im = f["imagen"]
    citas = ",\n".join(f"        {js(x)}" for x in f["citas"])
    campos = [
        ("id", js(i)), ("titulo", js(f["titulo"])), ("autor", js(f["autor"])), ("anio", js(f["anio"])),
        ("idioma", js(f["idioma"])), ("categoria", js(f["categoria"])), ("recomendado", "false"),
        ("resumen", js(f["resumen"])), ("porque", js(f["porque"])),
        ("imagen", js({"src": f"img/portadas/{i}.jpg", "credito": im["credito"], "url": im["url"]})),
        ("citas", f"[\n{citas}\n      ]"),
        ("archivos", js({"epub": f"libros/{epub.name}", "pdf": f"libros/{epub.stem}.pdf"})),
        ("fuente", js(f["fuente"])), ("delibris", js(f.get("delibris"))),
    ]
    ed = con_credito(f)
    if ed:
        campos.append(("editorial", js(ed)))
    elif f.get("credito"):
        campos.append(("encuadernador", js(f["credito"])))
    campos.append(("parecidos", js(f.get("parecidos") or [])))
    return "    {\n" + ",\n".join(f"      {k}: {v}" for k, v in campos) + "\n    }"


def tramo_ficha(t: str, id_: str):
    """Inicio y fin (el "\\n    }" que la cierra) de la ficha `id_` en datos.js, o None."""
    i = t.find(f'\n      id: "{id_}",')
    if i < 0:
        return None
    return i, t.index("\n    }", i)


def ya_publicado(f: dict) -> bool:
    t = (RAIZ / "datos.js").read_text(encoding="utf-8")
    if not f.get("versionDe"):
        return tramo_ficha(t, f["id"]) is not None
    tr = tramo_ficha(t, f["versionDe"])
    return bool(tr) and re.search(rf'\n        "?{f["idioma"]}"?: ', t[tr[0]:tr[1]]) is not None


def agregar_version(t: str, f: dict, v: dict) -> str:
    tr = tramo_ficha(t, f["versionDe"])
    if not tr:
        raise RuntimeError(f"versionDe {f['versionDe']} no está en datos.js")
    ini, fin = tr
    linea = f"{f['idioma']}: {js(v)}"
    m = re.search(r"\n      versiones: \{", t[ini:fin])
    if m:
        p = ini + m.end()
        return t[:p] + f"\n        {linea}," + t[p:]
    return t[:fin] + f",\n      versiones: {{\n        {linea}\n      }}" + t[fin:]


def agregar_a_datos(f: dict, epub: Path, v: dict | None = None):
    ruta = RAIZ / "datos.js"
    t = ruta.read_text(encoding="utf-8")
    if v is None:
        fin = t.rfind("\n  ],", 0, t.index("\n  buscados:"))
        t = t[:fin] + ",\n" + ficha_js(f, epub) + t[fin:]
    else:
        t = agregar_version(t, f, v)
    hoy = date.today()
    t = re.sub(r'actualizado: "[^"]*"', f'actualizado: "{hoy.day}-{MESES[hoy.month - 1]}-{hoy.year}"', t, count=1)
    # En buscados se saca solo el título de ese idioma (la obra se sigue buscando en el otro); sin
    # títulos, la línea entera. Se compara sin subtítulo, como el sitio («...Thursday: A Nightmare»).
    tit, idioma = plano(f["titulo"].split(":")[0]), f["idioma"]
    lineas = []
    for ln in t.split("\n"):
        m = re.match(r'(\s*\{ titulo: )(\{[^}]*\})(.*)', ln)
        if m:
            ts = json.loads(m.group(2))
            if plano(ts.get(idioma, "").split(":")[0]) == tit:
                del ts[idioma]
                print(f"Sacado de buscados ({idioma}):", f["titulo"])
                if not ts:
                    continue
                ln = m.group(1) + js(ts) + m.group(3)
        lineas.append(ln)
    ruta.write_text("\n".join(lineas), encoding="utf-8")


def asegurar_cuadro(c: Path, f: dict) -> dict:
    """El cuadro es lo único que el encuadernador puede dejar pendiente: se baja de imagen.url o,
    sin cuadro elegido, se detiene antes de tocar datos.js para completarlo en la carpeta."""
    im = f.get("imagen") or {}
    cuadro = c / "cuadro.jpg"
    url = im.get("url") or ""
    if not cuadro.exists() and "commons.wikimedia.org" in url and "File:" in url:
        archivo = url.split("File:", 1)[1].split("#")[0]
        baja = f"https://commons.wikimedia.org/wiki/Special:FilePath/{archivo}?width=1600"
        print("Bajando el cuadro", baja)
        req = urllib.request.Request(baja, headers={"User-Agent": "Proyecto Fenix"})
        cuadro.write_bytes(urllib.request.urlopen(req, timeout=120).read())
    falta = [k for k in ("credito", "url") if not im.get(k)]
    if not cuadro.exists() or falta:
        sys.exit(f"Falta el cuadro de la portada ({', '.join(falta) or 'cuadro.jpg'}): elígelo, "
                 f"completa «imagen» en {c / 'ficha.json'} (y cuadro.jpg) y vuelve a correr con {c}")
    return im


def recibir(c: Path) -> str:
    """Procesa un paquete ya desempacado y devuelve su línea del resumen."""
    previa = json.loads((c / "ficha.json").read_text(encoding="utf-8")) if (c / "ficha.json").exists() else {}
    if previa.get("id") and ya_publicado(previa):
        return f"ya estaba publicado ({previa.get('versionDe') or previa['id']}, {previa.get('idioma')})"
    E, A, f = revisar(c)
    for a in A:
        print("AVISO:", a)
    if E:
        return "DEVOLVER: " + "; ".join(E)
    im = asegurar_cuadro(c, f)
    nombre = f["id"]
    epub = armar_epub(c, f, nombre)
    v = None
    if f.get("versionDe"):
        v = {k: f[k] for k in ("titulo", "autor", "anio", "resumen", "porque", "citas", "fuente") if k in f}
        v["imagen"] = {"src": f"img/portadas/{nombre}.jpg", "credito": im["credito"], "url": im["url"]}
        v["archivos"] = {"epub": f"libros/{epub.name}", "pdf": f"libros/{epub.stem}.pdf"}
        if con_credito(f):
            v["editorial"] = con_credito(f)
    agregar_a_datos(f, epub, v)
    correr(PY, "herramientas/portadas.py", nombre, "--cuadro", c / "cuadro.jpg",
           "--cx", im.get("cx", 0.5), "--cy", im.get("cy", 0.5), "--epub")
    correr(PY, "herramientas/exlibris.py", epub.relative_to(RAIZ))
    correr(PY, "herramientas/credito_portada.py", epub.relative_to(RAIZ))
    # El EPUB de Gutenberg puede traer notas en cursiva (Ligorio, 25-oct-2026).
    correr(PY, "herramientas/revisar_libros.py", "--arreglar", epub.relative_to(RAIZ))
    correr(PY, "herramientas/epub_a_pdf.py", epub.relative_to(RAIZ))
    donde = f"versión {f['idioma']} de {f['versionDe']}" if v else "ficha nueva"
    return f"listo ({donde}): libros/{epub.name}; categoría {f.get('categoria', '-')}"


def bajar_de_gmail(query: str) -> list[Path]:
    # Claude\Gmail, al lado de fenix\ (vale desde la carpeta principal y desde una copia de sesión).
    sys.path.insert(0, str(next(p / "Gmail" for p in RAIZ.parents if (p / "Gmail").is_dir())))
    from gmail_cuentas import abrir  # noqa: E402
    g = abrir("personal")
    df = g.buscar(query + " has:attachment filename:zip", maximo=50)
    destino = RAIZ / ".entregas"
    rutas = []
    for _, fila in df.iterrows():
        rutas += [Path(r) for r in g.descargar_adjuntos(fila["id"], str(destino), r"\.zip$")]
    print(f"{len(rutas)} paquetes de {len(df)} correos.")
    return rutas


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("paquetes", nargs="*", help=".zip o carpeta de cada entrega")
    ap.add_argument("--gmail", help="búsqueda de Gmail (talcaldeg@gmail.com) cuyos .zip se reciben")
    a = ap.parse_args()
    origenes = [Path(p).resolve() for p in a.paquetes] + (bajar_de_gmail(a.gmail) if a.gmail else [])
    if not origenes:
        ap.error("falta un paquete o --gmail")
    # Se desempacan todos antes de revisar: un paquete puede citar a otro del lote en «parecidos».
    carpetas = [desempacar(o) for o in origenes]
    resumen = []
    for c in carpetas:
        print(f"\n== {c.name}")
        try:
            r = recibir(c)
        except (Exception, SystemExit) as e:  # uno que falla no frena a los demás
            r = f"FALLÓ: {e}"
        resumen.append((c.name, r))
    if any(r.startswith("listo") for _, r in resumen):
        correr("node", "herramientas/revisar_duplicados.js")
        correr("node", "herramientas/gen_estaticos.js")
    print("\nResumen:")
    for n, r in resumen:
        print(f"- {n}: {r}")
    print("Falta: auditar-teologia sobre resumen y porque de los de fe, y sesion.py publicar.")


if __name__ == "__main__":
    main()
