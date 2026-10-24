"""Cada sesión de Claude trabaja Fénix en su propia copia (worktree de git) y publica desde ahí.

Por qué: varias sesiones editando la misma carpeta se pisan (una regenera las páginas con el
generador a medio cambiar de otra, el respaldo automático mete todo en un mismo commit y los
commits terminan mezclando trabajo ajeno). Con una copia por sesión, cada una ve solo lo suyo
y se integra en `main` al publicar, encima de lo que ya publicaron las demás.

Uso (desde cualquier carpeta):
  python herramientas/sesion.py nueva <tema>       crea .sesiones/<tema> desde origin/main e imprime la ruta
  python herramientas/sesion.py publicar <tema> -m "mensaje"
                                                   commitea lo pendiente, se pone al día con main,
                                                   revisa los libros que cambiaron (revisar_libros.py),
                                                   regenera las páginas, corre la guardia de diseño
                                                   (revisar_diseno.py) y sube a main (GitHub Pages)
  python herramientas/sesion.py cerrar <tema>      borra la copia y su rama (solo si ya se publicó)
  python herramientas/sesion.py lista              copias abiertas y si tienen algo sin publicar

Las copias viven en .sesiones/ dentro del repo (ignorada por git y fuera del alcance del
respaldo automático, que solo mira las carpetas de primer nivel de Desktop\\Personal\\Claude).
"""
import argparse
import os
import subprocess
import sys

_AQUI = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# La carpeta principal, aunque el script se corra desde una copia: el padre del .git común.
RAIZ = os.path.dirname(os.path.abspath(os.path.join(_AQUI, subprocess.run(
    ["git", "rev-parse", "--git-common-dir"], cwd=_AQUI, capture_output=True, text=True).stdout.strip())))
SESIONES = os.path.join(RAIZ, ".sesiones")
# Salidas de herramientas/gen_estaticos.js: si chocan al integrar, se toma la de main y se regeneran.
GENERADOS = ("libro/", "sitemap.xml", "llms.txt", "sw.js")


def git(*args, cwd, check=True):
    r = subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True, encoding="utf-8")
    if check and r.returncode != 0:
        sys.exit(f"git {' '.join(args)} falló:\n{r.stdout}{r.stderr}")
    return r


def ruta_de(tema):
    return os.path.join(SESIONES, tema)


def nueva(tema):
    ruta = ruta_de(tema)
    if os.path.exists(ruta):
        print(ruta)
        return
    git("fetch", "-q", "origin", cwd=RAIZ)
    git("worktree", "add", "-q", "-b", f"sesion/{tema}", ruta, "origin/main", cwd=RAIZ)
    print(ruta)


def generar(ruta):
    r = subprocess.run(["node", os.path.join("herramientas", "gen_estaticos.js")], cwd=ruta,
                       capture_output=True, text=True, encoding="utf-8")
    if r.returncode != 0:
        sys.exit(f"gen_estaticos.js falló:\n{r.stdout}{r.stderr}")
    print(r.stdout.strip())


def revisar_diseno(ruta):
    """Si el sitio quedó con la maqueta rota (hero que no cabe, scroll horizontal, error de JS), no se sube."""
    r = subprocess.run([sys.executable, os.path.join("herramientas", "revisar_diseno.py"), ruta], cwd=ruta,
                       capture_output=True, text=True, encoding="utf-8")
    if r.returncode != 0:
        sys.exit(f"{r.stdout}{r.stderr}\nNo se publicó: arreglar el diseño en {ruta} y volver a publicar.")
    print(r.stdout.strip())


def revisar_libros(ruta):
    """Solo los libros que esta sesión cambió respecto de main: si alguno quedó con la portada
    deformada, el índice en la página 1 o notas en cursiva, no se sube."""
    r = subprocess.run([sys.executable, os.path.join("herramientas", "revisar_libros.py"), "--desde", "origin/main"],
                       cwd=ruta, capture_output=True, text=True, encoding="utf-8")
    if r.returncode != 0:
        sys.exit(f"{r.stdout}{r.stderr}\nNo se publicó: rehacer esos libros en {ruta} y volver a publicar.")
    print(r.stdout.strip())


def integrar(ruta):
    """Rebase sobre origin/main. Choques en archivos generados: se toma main y se regenera después."""
    git("fetch", "-q", "origin", cwd=ruta)
    r = git("rebase", "origin/main", cwd=ruta, check=False)
    while r.returncode != 0:
        choques = git("diff", "--name-only", "--diff-filter=U", cwd=ruta).stdout.split()
        if not choques:
            git("rebase", "--abort", cwd=ruta, check=False)
            sys.exit(f"El rebase falló sin choques de archivo:\n{r.stdout}{r.stderr}")
        propios = [f for f in choques if not f.startswith(GENERADOS)]
        if propios:
            git("rebase", "--abort", cwd=ruta, check=False)
            sys.exit("Choque con lo que otra sesión ya publicó en: " + ", ".join(propios)
                     + f"\nResolverlo a mano en {ruta} (git rebase origin/main) y volver a publicar.")
        for f in choques:  # en un rebase, --ours es main
            git("checkout", "--ours", "--", f, cwd=ruta)
            git("add", "--", f, cwd=ruta)
        env = dict(os.environ, GIT_EDITOR="true")
        r = subprocess.run(["git", "rebase", "--continue"], cwd=ruta, capture_output=True, text=True,
                           encoding="utf-8", env=env)


def publicar(tema, mensaje):
    ruta = ruta_de(tema)
    if not os.path.isdir(ruta):
        sys.exit(f"No existe la copia {ruta}")
    if git("status", "--porcelain", cwd=ruta).stdout.strip():
        if not mensaje:
            sys.exit("Hay cambios sin commitear: pasar -m \"mensaje\".")
        git("add", "-A", cwd=ruta)
        if git("diff", "--cached", "--quiet", cwd=ruta, check=False).returncode != 0:
            git("commit", "-q", "-m", mensaje + "\n\nCo-Authored-By: Claude <noreply@anthropic.com>", cwd=ruta)
    for intento in range(3):
        integrar(ruta)
        revisar_libros(ruta)
        generar(ruta)
        revisar_diseno(ruta)
        # El generador escribe LF y la copia tiene CRLF: puede "cambiar" sin cambiar el contenido en git.
        git("add", "-A", cwd=ruta)
        if git("diff", "--cached", "--quiet", cwd=ruta, check=False).returncode != 0:
            git("commit", "-q", "-m", "Regenera las páginas estáticas", cwd=ruta)
        if git("rev-list", "--count", "origin/main..HEAD", cwd=ruta).stdout.strip() == "0":
            print("Nada nuevo que publicar.")
            break
        r = git("push", "-q", "origin", "HEAD:main", cwd=ruta, check=False)
        if r.returncode == 0:
            print("Publicado en main:", git("log", "--oneline", "-1", cwd=ruta).stdout.strip())
            break
        print(f"main cambió mientras tanto; se reintenta ({intento + 1}/3)")
    else:
        sys.exit("No se pudo publicar tras 3 intentos.")
    poner_al_dia_principal()


def poner_al_dia_principal():
    """La carpeta principal (la que usa el respaldo y la vista previa) se adelanta si está limpia."""
    git("fetch", "-q", "origin", cwd=RAIZ)
    if git("status", "--porcelain", "--untracked-files=no", cwd=RAIZ).stdout.strip():
        print("Aviso: la carpeta principal tiene cambios sin commitear de alguien; no se tocó.")
        return
    if git("merge", "-q", "--ff-only", "origin/main", cwd=RAIZ, check=False).returncode != 0:
        if git("rebase", "-q", "origin/main", cwd=RAIZ, check=False).returncode != 0:
            git("rebase", "--abort", cwd=RAIZ, check=False)
            print("Aviso: la carpeta principal no se pudo adelantar a origin/main; revisarla.")


def cerrar(tema):
    ruta = ruta_de(tema)
    git("fetch", "-q", "origin", cwd=RAIZ)
    if os.path.isdir(ruta):
        if git("status", "--porcelain", cwd=ruta).stdout.strip():
            sys.exit("La copia tiene cambios sin commitear; publicar o descartar antes de cerrar.")
        if git("rev-list", "--count", "origin/main..HEAD", cwd=ruta).stdout.strip() != "0":
            sys.exit("La copia tiene commits sin publicar; publicar antes de cerrar.")
        git("worktree", "remove", ruta, cwd=RAIZ)
    git("branch", "-q", "-D", f"sesion/{tema}", cwd=RAIZ, check=False)
    git("worktree", "prune", cwd=RAIZ)
    print("Cerrada", tema)


def lista():
    if not os.path.isdir(SESIONES):
        print("Sin copias abiertas.")
        return
    git("fetch", "-q", "origin", cwd=RAIZ)
    for tema in sorted(os.listdir(SESIONES)):
        ruta = ruta_de(tema)
        sucio = bool(git("status", "--porcelain", cwd=ruta, check=False).stdout.strip())
        sin = git("rev-list", "--count", "origin/main..HEAD", cwd=ruta, check=False).stdout.strip()
        print(f"{tema}: {sin} commit(s) sin publicar{', cambios sin commitear' if sucio else ''}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("accion", choices=["nueva", "publicar", "cerrar", "lista"])
    p.add_argument("tema", nargs="?")
    p.add_argument("-m", "--mensaje")
    a = p.parse_args()
    if a.accion != "lista" and not a.tema:
        p.error("falta el tema")
    {"nueva": lambda: nueva(a.tema), "publicar": lambda: publicar(a.tema, a.mensaje),
     "cerrar": lambda: cerrar(a.tema), "lista": lista}[a.accion]()


if __name__ == "__main__":
    main()
