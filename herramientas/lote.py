"""
Lote de encuadernadores en dos comandos, para que recibirlo cueste ~6 llamadas y no 30.

    python herramientas/lote.py recibir      copia lote-AAAAMMDD + recibir_entrega.py --gmail en ella
    python herramientas/lote.py publicar     publica, IndexNow, enlaces de Search Console y cierra
    (--tema <nombre> para otra copia que la del día)

Entre uno y otro queda solo lo que no se mide: mirar la hoja de contacto y auditar-teologia sobre
el resumen y porque que imprime `recibir`. Los dos tardan más de 2 minutos (gen_estaticos,
PDF, guardia de diseño): Claude los lanza con run_in_background y espera el aviso, sin sondear.

Por qué existe: el 5-nov-2026 un lote de un libro gastó 28 llamadas; 14 fueron el lote mismo
(comandos que pasaron el límite de 2 y 10 minutos y hubo que ir a leer su salida, un publicar sin
-m, la ruta de Search Console armada a mano) y el resto la bienvenida, buscando el hilo y el
correo anterior. `recibir_entrega.py` ya dice quién mandó cada paquete y si es su primera entrega.
"""
import argparse
import datetime
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sesion import RAIZ, cerrar, git, nueva, publicar, ruta_de  # noqa: E402

PY = sys.executable


def nuevos(ruta):
    """Fichas y páginas que este lote agrega: los EPUB y las index.html de libro/ sin seguimiento."""
    st = git("status", "--porcelain", "-uall", "--", "libros", "libro", cwd=ruta).stdout.splitlines()
    sin = [l[3:].strip() for l in st if l.startswith("??")]
    ids = [os.path.basename(p)[:-5] for p in sin if p.startswith("libros/") and p.endswith(".epub")]
    paginas = ["fenix/" + p[: -len("index.html")] for p in sin if p.startswith("libro/") and p.endswith("/index.html")]
    return ids, paginas


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("accion", choices=["recibir", "publicar"])
    ap.add_argument("--tema", default="lote-" + datetime.date.today().strftime("%Y%m%d"))
    a = ap.parse_args()
    os.chdir(RAIZ)  # nunca parado dentro de la copia: Windows no dejaría borrarla al cerrar
    ruta = ruta_de(a.tema)
    if a.accion == "recibir":
        nueva(a.tema)
        sys.exit(subprocess.run([PY, os.path.join("herramientas", "recibir_entrega.py"), "--gmail"], cwd=ruta).returncode)
    if not os.path.isdir(ruta):
        sys.exit(f"No existe la copia {ruta}: correr antes `lote.py recibir`.")
    ids, paginas = nuevos(ruta)
    publicar(a.tema, "Entrega de encuadernadores: " + (", ".join(ids) or "ajustes"))
    subprocess.run(["node", os.path.join("herramientas", "indexnow.js")], cwd=ruta)
    if paginas:
        ingresos = next(p / "ingresos" for p in __import__("pathlib").Path(RAIZ).parents if (p / "ingresos").is_dir())
        print("\nSearch Console (pedir indexación):")
        subprocess.run([PY, str(ingresos / "search_console.py"), "enlaces", *paginas])
    cerrar(a.tema)


if __name__ == "__main__":
    main()
