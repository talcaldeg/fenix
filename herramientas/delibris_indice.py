"""Índice de la valoración moral de delibris.org para el catálogo de Fénix.

Recorre el buscador avanzado de Delibris por género (Literatura, Pensamiento, Espiritualidad),
respetando el Crawl-delay de 10 segundos de su robots.txt, y deja el índice partido en
`delibris/<clave>.json` (clave = dos primeras letras del título normalizado), para que el
catálogo cargue solo el trozo que necesita.

Es incremental e idempotente: cada página bajada queda en `herramientas/.cache_delibris/` y no
se vuelve a pedir; si se corta, se relanza y sigue donde iba. Con `--solo-armar` arma los
JSON con lo que haya en caché, sin bajar nada.

    python herramientas/delibris_indice.py            # baja lo que falte y arma
    python herramientas/delibris_indice.py --solo-armar
    python herramientas/delibris_indice.py --refrescar 3   # vuelve a bajar las 3 primeras páginas de cada género (lo más nuevo)
"""
import argparse
import html
import json
import re
import sys
import time
import unicodedata
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CACHE = RAIZ / "herramientas" / ".cache_delibris"
SALIDA = RAIZ / "delibris"
BASE = "https://www.delibris.org/es/advanced-search?field_libro_genere_tid={tid}&combine=&page={p}"
GENEROS = {1395: "Literatura", 1396: "Pensamiento", 34383: "Espiritualidad"}
PAUSA = 10
AGENTE = "FenixBiblioteca/1.0 (+https://talcaldeg.github.io/fenix/)"


def normalizar(s):
    s = unicodedata.normalize("NFKD", s.lower())
    s = "".join(c for c in s if not unicodedata.combining(c))
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


ARTICULOS = re.compile(r"^(el|la|los|las|lo|un|una|unos|unas) ")


def clave(titulo):
    # Sin artículo inicial, para que «El camino» y «La casa» no caigan todos en el mismo trozo.
    # El catálogo (index.html, claveDelibris) calcula la misma clave.
    n = ARTICULOS.sub("", normalizar(titulo)).replace(" ", "")
    return (n[:2] or "__").ljust(2, "_")


def bajar(url, intentos=4):
    for i in range(intentos):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": AGENTE})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read().decode("utf-8", "replace")
        except Exception as e:  # red o 5xx: espera creciente y reintenta
            print(f"  error {e}; reintento {i + 1}", flush=True)
            time.sleep(PAUSA * (i + 2))
    raise RuntimeError(f"no se pudo bajar {url}")


def ultima_pagina(h):
    nums = [int(x) for x in re.findall(r"page=(\d+)", h)]
    return max(nums) if nums else 0


ART = re.compile(r'<article id="node-(\d+)".*?</article>', re.S)


def parsear(h, genero):
    libros = []
    for m in ART.finditer(h):
        a = m.group(0)
        t = re.search(r'<h2><a href="(/es/[^"]+)">(.*?)</a></h2>', a, re.S)
        v = re.search(r'field-libro-valutazione.*?val-(\d)', a, re.S)
        if not t:
            continue
        autores = [html.unescape(x).strip() for x in re.findall(r'href="/es/authors/[^"]+">([^<]+)</a>', a)]
        libros.append({
            "t": html.unescape(re.sub(r"<[^>]+>", "", t.group(2))).strip(),
            "a": autores,
            "v": int(v.group(1)) if v else None,
            "g": genero,
            "u": "https://www.delibris.org" + t.group(1),
        })
    return libros


def recorrer(refrescar=0):
    CACHE.mkdir(parents=True, exist_ok=True)
    for tid, genero in GENEROS.items():
        p, ultima = 0, None
        while ultima is None or p <= ultima:
            f = CACHE / f"{tid}_{p:05d}.html"
            if p < refrescar and f.exists():
                # Lo refrescado va a un archivo aparte: con reseñas nuevas la lista se corre y,
                # si se pisara la página vieja, se perderían los libros que bajaron de página.
                f = CACHE / f"{tid}_{p:05d}_{time.strftime('%Y%m%d')}.html"
            if f.exists():
                h = f.read_text(encoding="utf-8")
            else:
                h = bajar(BASE.format(tid=tid, p=p))
                if '<article id="node-' not in h and p <= (ultima or 0):
                    print(f"  {genero} p{p}: página vacía, se reintenta luego", flush=True)
                    time.sleep(PAUSA)
                    h = bajar(BASE.format(tid=tid, p=p))
                f.write_text(h, encoding="utf-8")
                time.sleep(PAUSA)
            ultima = max(ultima or 0, ultima_pagina(h))
            if p % 25 == 0:
                print(f"{genero}: página {p} de {ultima}", flush=True)
            p += 1


def armar():
    # En orden de nombre, la página refrescada (con fecha) va después de la vieja y la reemplaza.
    vistos, trozos = {}, {}
    for f in sorted(CACHE.glob("*.html")):
        tid = int(f.name.split("_")[0])
        for l in parsear(f.read_text(encoding="utf-8"), GENEROS[tid]):
            if l["v"] is not None:
                vistos[l["u"]] = l
    for l in vistos.values():
        trozos.setdefault(clave(l["t"]), []).append(l)
    SALIDA.mkdir(exist_ok=True)
    for viejo in SALIDA.glob("*.json"):
        viejo.unlink()
    for k, ls in trozos.items():
        ls.sort(key=lambda x: normalizar(x["t"]))
        (SALIDA / f"{k}.json").write_text(json.dumps(ls, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    (SALIDA / "_meta.json").write_text(json.dumps({"libros": len(vistos), "fecha": time.strftime("%Y-%m-%d"), "claves": sorted(trozos)}), encoding="utf-8")
    print(f"índice armado: {len(vistos)} libros en {len(trozos)} trozos", flush=True)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--solo-armar", action="store_true")
    ap.add_argument("--refrescar", type=int, default=0)
    a = ap.parse_args()
    if not a.solo_armar:
        recorrer(a.refrescar)
    armar()
    sys.exit(0)
