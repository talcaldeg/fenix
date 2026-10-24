"""Guardia de diseño: abre el sitio en un navegador real y falla si un cambio rompió la maqueta.

Por qué: cada cosa que se suma al inicio (el buscador, una línea más) empujaba las cifras del
hero fuera de la primera pantalla sin que nadie lo notara. `sesion.py publicar` corre esto antes
de subir y no publica si falla.

Revisa, en ventanas de escritorio y de celular:
  - inicio: el hero completo (hasta las cifras) cabe en la primera pantalla;
  - todas las vistas y una página de libro: sin scroll horizontal y sin errores de JavaScript;
  - la barra de arriba cabe en una línea en escritorio;
  - la barra del sistema del celular (theme-color) es del color de la cabecera, en claro y en oscuro.

Uso: python herramientas/revisar_diseno.py [carpeta]   (por defecto, la carpeta del repo)
     --capturas <carpeta>  guarda una captura del inicio por ventana, para mirarlas
"""
import argparse
import functools
import http.server
import os
import sys
import threading

# Ventanas reales: notebook con barra de favoritos (1366x600, 1536x650), escritorio y celular.
VENTANAS = [(1366, 600), (1536, 650), (1280, 720), (1920, 950), (1024, 600), (390, 844), (360, 740)]
VISTAS = ["inicio", "biblioteca", "todos", "editorial", "oraciones", "citas", "salvar", "dona", "contacto"]
LIBRO = "libro/one-with-jesus/"
ALTO_BARRA = 80  # px: más que esto es que el menú se partió en dos líneas


def servir(raiz):
    class H(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(H, directory=raiz))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def revisar(raiz, capturas=None):
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        sys.exit("Falta playwright (pip install playwright && playwright install chromium).")
    srv = servir(raiz)
    base = f"http://127.0.0.1:{srv.server_port}/"
    fallas = []
    with sync_playwright() as p:
        nav = p.chromium.launch()
        for w, h in VENTANAS:
            pg = nav.new_page(viewport={"width": w, "height": h})
            errores = []
            pg.on("pageerror", lambda e: errores.append(str(e)))
            for vista in VISTAS + [LIBRO]:
                url = base + LIBRO if vista == LIBRO else f"{base}#{vista}"
                errores.clear()
                pg.goto(url)
                pg.wait_for_load_state("networkidle")
                pg.wait_for_timeout(300)
                donde = f"{w}x{h} {vista}"
                ancho = pg.evaluate("document.documentElement.scrollWidth")
                if ancho > w + 1:
                    fallas.append(f"{donde}: scroll horizontal ({ancho}px en {w}px)")
                for e in errores:
                    fallas.append(f"{donde}: error de JavaScript: {e}")
                if vista != "inicio":
                    continue
                r = pg.evaluate("""() => {
                    const q = s => document.querySelector(s);
                    return {cifras: q('.hero .cifras').getBoundingClientRect().bottom,
                            barra: q('header').getBoundingClientRect().height,
                            numeros: [...document.querySelectorAll('.hero .cifras b')].map(b => b.textContent.trim()),
                            celdas: [...document.querySelectorAll('#accesos .acceso')].reduce((n, a) => n + (a.classList.contains('ancho') ? 2 : 1), 0),
                            columnas: getComputedStyle(q('#accesos')).gridTemplateColumns.split(' ').length,
                            citaDia: !q('#citaDia').hidden && q('#citaDia').textContent.trim().length > 0};
                }""")
                if r["celdas"] % r["columnas"]:
                    fallas.append(f"{donde}: la grilla de accesos queda con hueco ({r['celdas']} celdas en {r['columnas']} columnas)")
                if not r["citaDia"]:
                    fallas.append(f"{donde}: la cita del día no se ve")
                if r["cifras"] > h:
                    fallas.append(f"{donde}: las cifras del hero quedan bajo la primera pantalla "
                                  f"(terminan en {round(r['cifras'])}px, la ventana mide {h}px)")
                if not all(r["numeros"]):
                    fallas.append(f"{donde}: cifras del hero vacías {r['numeros']}")
                if w > 760 and r["barra"] > ALTO_BARRA:
                    fallas.append(f"{donde}: la barra de arriba mide {round(r['barra'])}px (el menú no cabe en una línea)")
                if capturas:
                    pg.screenshot(path=os.path.join(capturas, f"inicio_{w}x{h}.png"))
            pg.close()
        # La barra del sistema del celular (y de la app instalada) se pinta con el theme-color: si no es el
        # fondo de la cabecera, arriba se ve un corte de color. Se mira en claro, en oscuro y tras el botón ◐.
        for esquema in ("light", "dark"):
            pg = nav.new_page(viewport={"width": 390, "height": 844}, color_scheme=esquema)
            for vista in ("inicio", LIBRO):
                pg.goto(base + LIBRO if vista == LIBRO else f"{base}#{vista}")
                pg.wait_for_load_state("networkidle")
                pasos = [esquema] + (["◐"] if vista == "inicio" else [])
                for paso in pasos:
                    if paso == "◐":
                        pg.evaluate("document.querySelector('#btnTema').click()")  # en el celular va dentro del menú
                        pg.wait_for_timeout(100)
                    r = pg.evaluate("""() => {
                        const m = [...document.querySelectorAll('meta[name="theme-color"]')]
                            .find(x => !x.media || matchMedia(x.media).matches);
                        return {barra: (m || {}).content || '', bg: getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()};
                    }""")
                    if r["barra"].lower() != r["bg"].lower():
                        fallas.append(f"barra del celular {esquema} {vista} {paso}: theme-color {r['barra'] or 'ausente'} "
                                      f"y la cabecera es {r['bg']} (se ve un corte de color arriba)")
            pg.close()
        nav.close()
    srv.shutdown()
    return fallas


def main():
    a = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("raiz", nargs="?", default=os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    a.add_argument("--capturas")
    args = a.parse_args()
    fallas = revisar(args.raiz, args.capturas)
    if fallas:
        print("Diseño roto:\n  " + "\n  ".join(fallas))
        sys.exit(1)
    print(f"Diseño OK ({len(VENTANAS)} ventanas, {len(VISTAS) + 1} páginas).")


if __name__ == "__main__":
    main()
