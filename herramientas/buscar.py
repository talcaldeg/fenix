# -*- coding: utf-8 -*-
"""¿Ya está en Fénix? Responde sin que el agente tenga que leer datos.js (~550 kB) entero.

    python herramientas/buscar.py "<título>" ["<autor>"]

Busca el título (sin subtítulo, artículo, tildes ni mayúsculas) en las fichas de `libros`, en sus
`versiones` y en `buscados` (con `reservado` si alguien lo tomó), y la valoración moral en el índice
de Delibris de Fénix (`delibris/`, o el del sitio si no se bajó). Con autor, exige que comparta un
apellido. Solo usa la biblioteca estándar de Python.
"""
import json
import re
import sys
import unicodedata
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SITIO = "https://talcaldeg.github.io/fenix"


def norm(s):
    s = unicodedata.normalize("NFD", str(s or "").lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def corto(s):
    """Mismas reglas que index.html y revisar_delibris.js: sin subtítulo ni artículo inicial."""
    s = norm(re.split(r"[:.(\[]", str(s or ""))[0])
    return re.sub(r"^(el|la|los|las|lo|un|una|unos|unas|the|a|an) ", "", s)


def palabras(autor):
    return {w for w in norm(autor).split() if len(w) >= 4}


def cruza(a, b):
    return not a or not b or bool(palabras(a) & palabras(b))


def leer(rel):
    p = RAIZ / rel
    if p.exists():
        return p.read_text(encoding="utf-8")
    try:
        req = urllib.request.Request(f"{SITIO}/{rel}", headers={"User-Agent": "Proyecto Fenix"})
        return urllib.request.urlopen(req, timeout=60).read().decode("utf-8")
    except Exception:  # noqa: BLE001
        return None


def main():
    if len(sys.argv) not in (2, 3):
        sys.exit(__doc__)
    tit, autor = corto(sys.argv[1]), (sys.argv[2] if len(sys.argv) == 3 else "")
    t = leer("datos.js")
    if t is None:
        sys.exit("No encontré datos.js (ni local ni en el sitio).")
    corte = t.index("\n  buscados:")
    hallado = False
    titulos = {sys.argv[1]}  # para Delibris, que reseña con el título en español

    # Fichas: cada `titulo:` de libros (también dentro de versiones) con el id de su ficha.
    fid, idioma, aut = None, None, ""
    for ln in t[:corte].split("\n"):
        m = re.match(r'\s*"?(id|idioma|autor|titulo)"?:\s*"((?:[^"\\]|\\.)*)"', ln)
        v = re.match(r'\s*(es|en):\s*\{', ln)
        if v:
            idioma = v.group(1)
        if not m:
            continue
        k, val = m.group(1), json.loads(f'"{m.group(2)}"')
        if k == "id" and ln.startswith("      id:"):
            fid, aut = val, ""
        elif k == "idioma":
            idioma = val
        elif k == "autor":
            aut = val
        elif k == "titulo" and corto(val) == tit and cruza(autor, aut or autor):
            print(f"EN FÉNIX: «{val}», ficha {fid}, idioma {idioma}")
            hallado = True

    # Buscados: una línea por obra.
    for ln in t[corte:].split("\n"):
        m = re.match(r'\s*\{ titulo: (\{[^}]*\}), autor: "([^"]*)"(.*)', ln)
        if not m:
            continue
        ts = json.loads(m.group(1))
        idiomas = [k for k, v in ts.items() if corto(v) == tit]
        if idiomas and cruza(autor, m.group(2)):
            titulos |= set(ts.values())
            r = re.search(r'reservado: "([^"]+)"', m.group(3))
            print(f"BUSCADO en {', '.join(idiomas)}: «{ts[idiomas[0]]}» de {m.group(2)}"
                  + (f"; RESERVADO el {r.group(1)} (otra persona lo tomó)" if r else "; libre para tomarlo"))
            hallado = True

    # Delibris: índice propio por las dos primeras letras del título sin artículo.
    for titulo in sorted(titulos):
        clave = (re.sub(r"^(el|la|los|las|lo|un|una|unos|unas) ", "", norm(titulo)).replace(" ", "")[:2] or "__").ljust(2, "_")
        trozo = leer(f"delibris/{clave}.json")
        if trozo is None:
            print("DELIBRIS: no pude leer el índice; búscalo en https://www.delibris.org/es/")
        for o in json.loads(trozo) if trozo else []:
            if corto(o["t"]) == corto(titulo) and cruza(autor, " ".join(o["a"])):
                print(f"DELIBRIS: «{o['t']}» de {'; '.join(o['a'])}: {o['v']}/6, {o['g']}, {o['u']}")
                hallado = True

    if not hallado:
        print("No está en Fénix ni en buscados, y el índice de Delibris no lo trae con ese título"
              " (en Delibris va el título en español).")


if __name__ == "__main__":
    main()
