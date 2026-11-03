# -*- coding: utf-8 -*-
"""Arma o rearma un libro de libros/ en una sola llamada y con salida corta.

    python herramientas/agregar_libro.py libros/<archivo>.epub [<otro> ...] [--forzar] [--estaticos]
    python herramientas/agregar_libro.py <archivo>                  (basta el nombre sin extensión)

Encadena, en orden: sin_gutenberg.py, portadas.py <imagen> --epub, exlibris.py,
credito_portada.py, epub_a_pdf.py y revisar_libros.py. Cada paso se salta si el libro ya lo
tiene (idempotente): quitar Gutenberg solo si quedan menciones; portada solo si la del EPUB no es
la de img/portadas/; exlibris solo si su imagen no es la de img/; crédito solo si el OPF no
trae el de la ficha; PDF solo si falta o es más viejo que el EPUB. Rearmar un libro ya
publicado sin cambios no toca ningún archivo. --forzar corre todos los pasos.

- Un paso que falla detiene el libro y muestra solo las últimas líneas de su error.
- La salida es una línea por libro («hecho: ...», «sin cambios» o «FALLÓ»); nunca la de cada paso.
- El libro necesita su ficha en datos.js (con `imagen`) y su cuadro en img/cuadros/ para el
  paso de portada; sin ellos el paso falla y lo dice. Portada oficial (URL): se salta ese paso.
- --estaticos agrega al final `node herramientas/gen_estaticos.js` (una vez, si algo cambió).
- Lo que no entra: md_a_epub.py (lleva argumentos del libro), la ficha, `sesion.py publicar`
  (corre la guardia sobre lo que cambió) e indexnow.js.
"""
import argparse
import html
import io
import re
import subprocess
import sys
import zipfile
from pathlib import Path

from PIL import Image, ImageChops, ImageStat

sys.path.insert(0, str(Path(__file__).resolve().parent))
RAIZ = Path(__file__).resolve().parent.parent
HERR = RAIZ / "herramientas"


class Fallo(Exception):
    pass


def correr(*args) -> str:
    """Corre un paso en un subproceso; si falla, deja solo el final de su salida."""
    p = subprocess.run([sys.executable, "-X", "utf8", *map(str, args)], cwd=RAIZ,
                       capture_output=True, encoding="utf-8", errors="replace")
    if p.returncode:
        cola = (p.stderr.strip() or p.stdout.strip()).splitlines()[-8:]
        raise Fallo("\n".join(cola) or f"código {p.returncode}")
    return p.stdout


def leer(epub: Path) -> dict:
    with zipfile.ZipFile(epub) as z:
        return {n: z.read(n) for n in z.namelist()}


def opf_de(a: dict) -> tuple:
    ruta = re.search(r'full-path="([^"]+)"', a["META-INF/container.xml"].decode("utf-8")).group(1)
    base = ruta.rsplit("/", 1)[0] + "/" if "/" in ruta else ""
    return a[ruta].decode("utf-8"), base


def idioma_de(opf: str) -> str:
    m = re.search(r"<dc:language[^>]*>\s*([a-z]{2})", opf)
    return "en" if m and m.group(1) == "en" else "es"


def tiene_gutenberg(a: dict) -> bool:
    """Restos de Gutenberg, no una cita como fuente (una traducción propia la lleva en su nota)."""
    import sin_gutenberg
    return sin_gutenberg.tiene_restos(a)


def portada_al_dia(a: dict, nombre: str) -> bool:
    opf, base = opf_de(a)
    dentro = a.get(base + "fenix-portada.jpg")
    sitio = RAIZ / "img" / "portadas" / f"{nombre}.jpg"
    if dentro is None or "fenix-portada" not in opf or not sitio.exists():
        return False
    p = Image.open(sitio).convert("RGB")
    q = Image.open(io.BytesIO(dentro)).convert("RGB").resize(p.size, Image.LANCZOS)
    return sum(ImageStat.Stat(ImageChops.difference(p, q)).mean) / 3 < 4


def exlibris_al_dia(a: dict) -> bool:
    opf, base = opf_de(a)
    img = RAIZ / "img" / f"exlibris-{idioma_de(opf)}.jpg"
    return ("fenix-exlibris-pag" in opf and img.exists()
            and a.get(base + "fenix-exlibris.jpg") == img.read_bytes())


def credito_al_dia(a: dict, textos: dict) -> bool:
    opf, _ = opf_de(a)
    _, credito = textos[idioma_de(opf)]
    return html.escape(credito) in opf and 'id="fenix-credito-portada"' in opf


def armar(epub: Path, ficha: dict, creditos: dict, forzar: bool) -> list:
    """Devuelve los pasos que hicieron algo. Lanza Fallo en el primero que falle."""
    hechos = []
    rel = epub.relative_to(RAIZ).as_posix()
    a = leer(epub)

    if forzar or tiene_gutenberg(a):
        correr(HERR / "sin_gutenberg.py", rel)
        hechos.append("gutenberg")
        a = leer(epub)

    if ficha:
        if forzar or not portada_al_dia(a, ficha["nombre"]):
            correr(HERR / "portadas.py", ficha["nombre"], "--epub")
            hechos.append("portada")
            a = leer(epub)
    elif forzar:
        pass  # portada oficial o sin ficha: no se toca

    if forzar or not exlibris_al_dia(a):
        correr(HERR / "exlibris.py", rel)
        hechos.append("exlibris")
        a = leer(epub)

    if epub.stem in creditos and (forzar or not credito_al_dia(a, creditos[epub.stem])):
        correr(HERR / "credito_portada.py", rel)
        hechos.append("credito")

    pdf = epub.with_suffix(".pdf")
    if forzar or hechos or not pdf.exists() or pdf.stat().st_mtime < epub.stat().st_mtime:
        correr(HERR / "epub_a_pdf.py", rel)
        hechos.append("pdf")

    try:
        correr(HERR / "revisar_libros.py", rel, pdf.relative_to(RAIZ).as_posix())
    except Fallo as e:
        raise Fallo("revisar_libros:\n" + str(e))
    return hechos


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("libros", nargs="+")
    ap.add_argument("--forzar", action="store_true", help="correr todos los pasos aunque ya estén hechos")
    ap.add_argument("--estaticos", action="store_true", help="al final, node herramientas/gen_estaticos.js")
    o = ap.parse_args()

    import credito_portada
    import portadas
    fichas = {v["epub"] and Path(v["epub"]).stem: {**v, "nombre": n} for n, v in portadas.catalogo().items() if v["epub"]}
    creditos = credito_portada.creditos()

    malos, cambios = 0, False
    for arg in o.libros:
        p = Path(arg)
        epub = (p if p.suffix == ".epub" else RAIZ / "libros" / f"{p.name}.epub")
        epub = (epub if epub.is_absolute() else Path.cwd() / epub).resolve()
        if not epub.exists():
            epub = (RAIZ / arg).resolve()
        if not epub.exists():
            print(f"FALLÓ {arg}: no existe el EPUB")
            malos += 1
            continue
        try:
            hechos = armar(epub, fichas.get(epub.stem), creditos, o.forzar)
        except Fallo as e:
            print(f"FALLÓ {epub.name}:\n{e}")
            malos += 1
            continue
        cambios |= bool(hechos)
        print(f"{epub.name}: " + (f"hecho ({', '.join(hechos)})" if hechos else "sin cambios"))

    if o.estaticos and cambios and not malos:
        try:
            subprocess.run(["node", "herramientas/gen_estaticos.js"], cwd=RAIZ, check=True,
                           capture_output=True, encoding="utf-8", errors="replace")
            print("gen_estaticos: listo")
        except subprocess.CalledProcessError as e:
            print("FALLÓ gen_estaticos:\n" + "\n".join((e.stderr or e.stdout or "").strip().splitlines()[-8:]))
            malos += 1
    sys.exit(1 if malos else 0)


if __name__ == "__main__":
    main()
