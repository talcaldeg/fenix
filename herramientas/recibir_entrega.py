# -*- coding: utf-8 -*-
"""Recibe el paquete de un encuadernador y deja el libro listo para publicar.

    python herramientas/recibir_entrega.py <paquete.zip | carpeta>

1. Descomprime en .entregas/<nombre>/ y corre herramientas/revisar_entrega.py (se detiene si hay
   errores).
2. Arma el EPUB en libros/<id>.epub: vía A, baja el de Project Gutenberg; vías B, C y D, copia
   texto/ a editorial/<id>/ y lo arma con md_a_epub.py.
3. Agrega la ficha al final de `libros` en datos.js, saca el libro de `buscados` y pone la fecha.
4. Portada con el cuadro (portadas.py --epub), exlibris, PDF y revisión de duplicados.

Una versión en otro idioma (`versionDe`) arma el EPUB y el cuadro, e imprime el bloque para pegar
en `versiones` de esa ficha. Lo que queda a mano: auditar-teologia sobre resumen y «por qué
leerlo» si el libro es de fe, gen_estaticos.js y sesion.py publicar.
"""
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
from revisar_entrega import plano, revisar, texto_epub  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
PY = sys.executable
MESES = "ene feb mar abr may jun jul ago sep oct nov dic".split()


def correr(*args):
    print("$", " ".join(str(a) for a in args))
    subprocess.run([str(a) for a in args], check=True, cwd=RAIZ)


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
        url = f"https://www.gutenberg.org/ebooks/{f['gutenberg']}.epub3.images"
        print("Bajando", url)
        req = urllib.request.Request(url, headers={"User-Agent": "Proyecto Fenix"})
        epub.write_bytes(urllib.request.urlopen(req, timeout=120).read())
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


def agregar_a_datos(f: dict, epub: Path):
    ruta = RAIZ / "datos.js"
    t = ruta.read_text(encoding="utf-8")
    fin = t.rfind("\n  ],", 0, t.index("\n  buscados:"))
    t = t[:fin] + ",\n" + ficha_js(f, epub) + t[fin:]
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


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    c = desempacar(Path(sys.argv[1]).resolve())
    E, A, f = revisar(c)
    for a in A:
        print("AVISO:", a)
    if E:
        for e in E:
            print("ERROR:", e)
        sys.exit("La entrega tiene errores: se le devuelve al encuadernador con esta lista.")
    im = asegurar_cuadro(c, f)
    if f.get("versionDe"):
        nombre = f["id"]
        epub = armar_epub(c, f, nombre)
        v = {k: f[k] for k in ("titulo", "autor", "anio", "resumen", "citas", "fuente") if k in f}
        v["imagen"] = {"src": f"img/portadas/{nombre}.jpg", "credito": im["credito"], "url": im["url"]}
        v["archivos"] = {"epub": f"libros/{epub.name}", "pdf": f"libros/{epub.stem}.pdf"}
        v["editorial"] = con_credito(f)
        print(f"\nPegar en `versiones` de {f['versionDe']} (datos.js):\n  {f['idioma']}: {js(v)}")
        print(f"«por qué leerlo» de esta versión, si cambia: {js(f['porque'])}")
        print(f"Después: python herramientas/portadas.py {nombre} --cuadro {c / 'cuadro.jpg'} "
              f"--cx {im.get('cx', 0.5)} --cy {im.get('cy', 0.5)} --epub; exlibris.py {epub.relative_to(RAIZ)}; "
              f"epub_a_pdf.py {epub.relative_to(RAIZ)}")
        return
    epub = armar_epub(c, f, f["id"])
    agregar_a_datos(f, epub)
    correr(PY, "herramientas/portadas.py", f["id"], "--cuadro", c / "cuadro.jpg",
           "--cx", im.get("cx", 0.5), "--cy", im.get("cy", 0.5), "--epub")
    correr(PY, "herramientas/exlibris.py", epub.relative_to(RAIZ))
    correr(PY, "herramientas/epub_a_pdf.py", epub.relative_to(RAIZ))
    correr("node", "herramientas/revisar_duplicados.js")
    print(f"\nListo: {f['titulo']}. Falta: auditar-teologia sobre resumen y porque si es de fe, "
          "node herramientas/gen_estaticos.js y sesion.py publicar.")


if __name__ == "__main__":
    main()
