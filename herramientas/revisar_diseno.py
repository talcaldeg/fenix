"""Guardia de diseño: abre el sitio en un navegador real y falla si un cambio rompió la maqueta.

Por qué: cada cosa que se suma al inicio (el buscador, una línea más) empujaba las cifras del
hero fuera de la primera pantalla sin que nadie lo notara. `sesion.py publicar` corre esto antes
de subir y no publica si falla.

Revisa, en ventanas de escritorio y de celular:
  - inicio: el hero completo (hasta las cifras) cabe en la primera pantalla;
  - todas las vistas y una página de libro: sin scroll horizontal y sin errores de JavaScript;
  - la barra de arriba cabe en una línea en escritorio;
  - cada enlace del menú lleva al principio de su vista, también si ya se está en ella más abajo;
  - la barra del sistema del celular (theme-color) es del color de la cabecera (--cabecera, la madera), en claro y en oscuro.

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
VISTAS = ["inicio", "biblioteca", "todos", "editorial", "oraciones", "citas", "salvar", "contacto"]
LIBRO = "libro/one-with-jesus/"
DONA = "dona/"  # página aparte (gen_estaticos.js), para que al compartirla salga su propia imagen
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
            for vista in VISTAS + [LIBRO, DONA]:
                url = base + vista if vista in (LIBRO, DONA) else f"{base}#{vista}"
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
                # El pie lleva el auspicio de Verum Data con su enlace, en todas las páginas (7-nov-2026).
                aus = pg.evaluate("""() => { const a = document.querySelector('footer a[href="https://verumdata.cl/"]');
                    const i = a && a.querySelector('img'); return {a: !!a, img: !!(i && i.complete && i.naturalWidth > 0)}; }""")
                if not aus["a"]:
                    fallas.append(f"{donde}: falta en el pie el auspicio de Verum Data con enlace a verumdata.cl")
                elif not aus["img"]:
                    fallas.append(f"{donde}: el auspicio de Verum Data no muestra su ícono (img/verum-data.svg)")
                if vista != "inicio":
                    continue
                r = pg.evaluate("""() => {
                    const q = s => document.querySelector(s);
                    return {cifras: q('.hero .cifras').getBoundingClientRect().bottom,
                            barra: q('header').getBoundingClientRect().height,
                            numeros: [...document.querySelectorAll('.hero .cifras b')].map(b => b.textContent.trim()),
                            celdas: [...document.querySelectorAll('#accesos .acceso')].reduce((n, a) => n + (a.classList.contains('ancho') ? 2 : 1), 0),
                            columnas: getComputedStyle(q('#accesos')).gridTemplateColumns.split(' ').length,
                            citaDia: !q('#citaDia').hidden && q('#citaDia').textContent.trim().length > 0,
                            // Línea de investigación: cada obra con su título visible y sin desbordar su tarjeta.
                            obras: [...document.querySelectorAll('#lineaInv .obra')].map(o =>
                                o.querySelector('h3').textContent.trim().length > 0 && o.scrollWidth <= o.clientWidth + 1)};
                }""")
                if r["celdas"] % r["columnas"]:
                    fallas.append(f"{donde}: la grilla de accesos queda con hueco ({r['celdas']} celdas en {r['columnas']} columnas)")
                if not r["citaDia"]:
                    fallas.append(f"{donde}: la cita del día no se ve")
                if len(r["obras"]) < 3 or not all(r["obras"]):
                    fallas.append(f"{donde}: la línea de investigación no muestra bien sus obras {r['obras']}")
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
                        // Desde el 9-nov-2026 la cabecera es de madera (--cabecera), no del color del papel (--bg):
                        // se compara con esa variable y con el color que de verdad pinta el <header>.
                        const cab = getComputedStyle(document.documentElement).getPropertyValue('--cabecera').trim();
                        const h = document.querySelector('header'), c = document.createElement('i');
                        c.style.color = cab; document.body.appendChild(c);
                        const rgbCab = getComputedStyle(c).color; c.remove();
                        return {barra: (m || {}).content || '', bg: cab, pinta: h ? getComputedStyle(h).backgroundColor : '', rgbCab};
                    }""")
                    if not r["bg"] or r["barra"].lower() != r["bg"].lower():
                        fallas.append(f"barra del celular {esquema} {vista} {paso}: theme-color {r['barra'] or 'ausente'} "
                                      f"y la cabecera es {r['bg'] or '(sin --cabecera)'} (se ve un corte de color arriba)")
                    elif r["pinta"] != r["rgbCab"]:
                        fallas.append(f"cabecera {esquema} {vista} {paso}: el <header> pinta {r['pinta']} y no --cabecera ({r['bg']})")
            pg.close()
        # Un enlace del menú lleva al principio de su vista aunque ya se esté en ella, abajo (el hash no
        # cambia y no hay hashchange), o en una sección de la misma vista (#editores -> Editorial).
        # Con el equipo cargado, el desplazamiento suave (scroll-behavior: smooth) tarda segundos y se
        # medía a medio camino (26-oct-2026: «#encuadernadores -> #editorial deja la página en 10056px»,
        # y la página sí llegaba arriba): antes del clic se espera a que la página quede quieta (posición
        # y alto, que crece con las imágenes diferidas), y después se le da hasta 15 s para llegar arriba.
        # Un salto roto igual falla, solo que más tarde. Sin networkidle: con carga a veces no llega nunca.
        def quieta():
            pg.evaluate("delete window.__quieta")
            try:
                pg.wait_for_function("""() => { const y = scrollY + ':' + document.documentElement.scrollHeight,
                                                      t = performance.now(), q = window.__quieta;
                                                if (!q || q.y !== y) { window.__quieta = {y, t}; return false; }
                                                return t - q.t > 500; }""", timeout=15000)
            except Exception:
                pass  # si nunca se aquieta, se mide igual: la falla, si la hay, la dice el salto
        pg = nav.new_page(viewport={"width": 1280, "height": 720})
        pg.goto(f"{base}#inicio")
        pg.wait_for_load_state("networkidle")
        for desde, destino in [(v, v) for v in VISTAS] + [("editores", "editorial"), ("encuadernadores", "editorial")]:
            pg.goto(f"{base}#{desde}")
            pg.wait_for_timeout(300)
            quieta()  # que termine la bajada a #editores o #encuadernadores
            pg.evaluate("window.scrollTo({top: document.documentElement.scrollHeight, behavior: 'instant'})")
            quieta()
            if pg.evaluate("scrollY") < 50:
                continue  # la vista cabe entera: no hay a dónde volver
            # La cabecera incluye la marca (#inicio); una vista sin enlace arriba (Oraciones) no se mide.
            if not pg.evaluate(f"""() => {{ const a = document.querySelector('header a[href="#{destino}"]');
                                          if (a) a.click(); return !!a; }}"""):
                continue
            try:
                pg.wait_for_function("scrollY <= 5", timeout=15000)
            except Exception:
                pass
            y = pg.evaluate("scrollY")
            if y > 5:
                fallas.append(f"menú: desde #{desde} abajo, el enlace a #{destino} deja la página en {round(y)}px y no arriba")
        pg.close()
        # Con la ficha abierta la URL ya es libro/<id>/: el enlace que se comparte y los de la ficha
        # (parecidos, página del libro) no pueden repetir libro/<id>/ (un enlace a WhatsApp salía así).
        pg = nav.new_page(viewport={"width": 390, "height": 844})
        pg.add_init_script("navigator.share = async d => { window.__compartido = d.url; };")
        pg.goto(f"{base}#biblioteca")
        pg.wait_for_load_state("networkidle")
        for paso in ("ficha", "parecido"):
            sel = "#dlgLibro a.parecido" if paso == "parecido" else ".libro, .fila[data-id], .ed[data-id]"
            if not pg.evaluate(f"() => {{ const a = document.querySelector('{sel}'); if (a) a.click(); return !!a; }}"):
                fallas.append(f"compartir: no hay {paso} que abrir")
                break
            pg.wait_for_timeout(500)
            pg.evaluate("document.querySelector('#btnCompartir').click()")
            pg.wait_for_timeout(200)
            urls = pg.evaluate("""() => [location.href, window.__compartido || '',
                ...[...document.querySelectorAll('#dlgLibro a[href*="libro/"]')].map(a => a.href)]""")
            if not urls[1]:
                fallas.append(f"compartir ({paso}): el botón no entregó enlace")
            for u in urls:
                if u.count("/libro/") > 1:
                    fallas.append(f"compartir ({paso}): enlace con la ruta repetida {u}")
        pg.close()
        # Como Netflix (4-nov-2026): lo abierto para leer va a «Seguir leyendo» y lo marcado a «Tus favoritos»
        # en la portada; la ficha abierta desde otra no repite en Parecidos el libro del que se vino.
        pg = nav.new_page(viewport={"width": 390, "height": 844})
        pg.goto(f"{base}#biblioteca")
        pg.wait_for_load_state("networkidle")
        pg.evaluate("document.querySelector('.fila[data-id]').click()")
        pg.wait_for_timeout(500)
        origen = pg.evaluate("document.querySelector('#dlgLibro').dataset.id")
        pg.evaluate("document.querySelector('#dlgLibro a.parecido').click()")
        pg.wait_for_timeout(500)
        if pg.evaluate(f"[...document.querySelectorAll('#dlgLibro a.parecido')].some(a => a.getAttribute('href').includes('/libro/{origen}/'))"):
            fallas.append("parecidos: la ficha repite el libro del que se vino")
        actual = pg.evaluate("document.querySelector('#dlgLibro').dataset.id")
        pg.evaluate("""() => { const a = document.querySelector('#dlgLibro .descargas a[data-archivo]');
            if (a){ a.addEventListener('click', e => e.preventDefault(), { once: true }); a.click(); }
            document.querySelector('#btnFav').click(); document.querySelector('#cerrarFicha').click(); }""")
        pg.wait_for_timeout(500)
        pg.evaluate("location.hash = 'inicio'")
        pg.wait_for_timeout(800)
        mios = pg.evaluate("""[[...document.querySelectorAll('#seguirLeyendo [data-id]')].map(e => e.dataset.id),
            [...document.querySelectorAll('#misFavoritos [data-id]')].map(e => e.dataset.id)]""")
        if actual not in mios[0]:
            fallas.append("portada: el libro abierto para leer no aparece en «Seguir leyendo»")
        if actual not in mios[1]:
            fallas.append("portada: el favorito no aparece en «Tus favoritos»")
        pg.close()
        # Parecidos como Netflix (4-nov-2026): la ficha abierta desde otra parte arriba y trae ← que vuelve a
        # la anterior donde se dejó; ← y × siguen a la vista al bajar (antes se iban con el scroll).
        pg = nav.new_page(viewport={"width": 390, "height": 844})
        pg.goto(f"{base}#biblioteca")
        pg.wait_for_load_state("networkidle")
        pg.evaluate("document.querySelector('.fila[data-id]').click()")
        pg.wait_for_timeout(500)
        titulo_a = pg.evaluate("document.querySelector('#fichaTitulo').textContent")
        pg.evaluate("const d = document.querySelector('#dlgLibro'); d.scrollTop = d.scrollHeight")
        pg.wait_for_timeout(200)
        y_a = pg.evaluate("document.querySelector('#dlgLibro').scrollTop")
        if pg.evaluate("document.querySelector('#cerrarFicha').getBoundingClientRect().top") < 0:
            fallas.append("parecidos: al bajar por la ficha la × se va con el scroll")
        pg.evaluate("document.querySelector('#dlgLibro a.parecido').click()")
        pg.wait_for_timeout(500)
        if pg.evaluate("document.querySelector('#dlgLibro').scrollTop") > 5:
            fallas.append("parecidos: la ficha abierta desde otra no parte arriba")
        if pg.evaluate("(document.querySelector('#volverFicha') || {hidden: true}).hidden"):
            fallas.append("parecidos: la ficha abierta desde otra no muestra ← para volver")
        else:
            pg.evaluate("document.querySelector('#volverFicha').click()")
            pg.wait_for_timeout(600)
            if pg.evaluate("document.querySelector('#fichaTitulo').textContent") != titulo_a:
                fallas.append("parecidos: ← no vuelve al libro anterior")
            elif abs(pg.evaluate("document.querySelector('#dlgLibro').scrollTop") - y_a) > 5:
                fallas.append("parecidos: ← vuelve al libro anterior pero no a donde se dejó")
        pg.close()
        # La página estática del libro (la que se abre desde WhatsApp) también lleva Compartir.
        pg = nav.new_page(viewport={"width": 390, "height": 844})
        pg.add_init_script("navigator.share = async d => { window.__compartido = d.url; };")
        pg.goto(f"{base}libro/ligorio-the-glories-of-mary/")
        pg.wait_for_load_state("networkidle")
        if not pg.evaluate("() => { const b = document.querySelector('#btnCompartir'); if (b) b.click(); return !!b; }"):
            fallas.append("compartir (página del libro): falta el botón Compartir")
        else:
            pg.wait_for_timeout(200)
            if not pg.evaluate("window.__compartido || ''").endswith("/libro/ligorio-the-glories-of-mary/"):
                fallas.append("compartir (página del libro): el botón no entregó el enlace de la página")
        pg.close()
        # Donar: #dona (menú del sitio, enlaces viejos) lleva a la página aparte del idioma, y esa página
        # se comparte con su propia imagen; con #dona como vista, WhatsApp mostraba la tarjeta de la portada.
        pg = nav.new_page(viewport={"width": 390, "height": 844})
        pg.add_init_script("navigator.share = async d => { window.__compartido = d.url; };")
        for desde, destino, img in (("#dona", "dona/", "compartir-dona.jpg"), ("?l=en#dona", "dona/en/", "compartir-dona-en.jpg")):
            pg.goto(base + desde)
            pg.wait_for_load_state("networkidle")
            if not pg.url.endswith("/" + destino):
                fallas.append(f"donar: {desde} lleva a {pg.url} y no a {destino}")
                continue
            r = pg.evaluate("""() => { const b = document.querySelector('#btnCompartir'); if (b) b.click();
                return {boton: !!b, og: (document.querySelector('meta[property="og:image"]') || {}).content || ''}; }""")
            pg.wait_for_timeout(200)
            if not r["og"].endswith("/img/" + img):
                fallas.append(f"donar ({destino}): og:image es {r['og'] or 'ausente'} y no img/{img}")
            if not r["boton"] or not pg.evaluate("window.__compartido || ''").endswith("/" + destino):
                fallas.append(f"donar ({destino}): Compartir no entregó el enlace de la página")
        pg.close()
        # Encuadernar: Compartir entrega la puerta encuadernar/ (con su imagen), y la puerta lleva a la sección.
        pg = nav.new_page(viewport={"width": 390, "height": 844})
        pg.add_init_script("navigator.share = async d => { window.__compartido = d.url; };")
        for idioma, puerta, img in (("", "encuadernar/", "compartir-encuadernar.jpg"), ("?l=en", "encuadernar/en/", "compartir-encuadernar-en.jpg")):
            pg.goto(f"{base}{idioma}#encuadernadores")
            pg.wait_for_load_state("networkidle")
            if not pg.evaluate("() => { const b = document.querySelector('#compartirEnc'); if (b) b.click(); return !!b; }"):
                fallas.append("encuadernar: falta el botón Compartir")
                break
            pg.wait_for_timeout(200)
            if not pg.evaluate("window.__compartido || ''").endswith("/" + puerta):
                fallas.append(f"encuadernar{idioma}: Compartir no entregó {puerta}")
            pg.goto(base + puerta)
            pg.wait_for_load_state("networkidle")
            if "#encuadernadores" not in pg.url:
                fallas.append(f"encuadernar: {puerta} no lleva a la sección (queda en {pg.url})")
            with open(os.path.join(raiz, puerta.replace("/", os.sep), "index.html"), encoding="utf-8") as f:
                if f"/img/{img}\"" not in f.read():
                    fallas.append(f"encuadernar: {puerta} no declara og:image img/{img}")
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
    print(f"Diseño OK ({len(VENTANAS)} ventanas, {len(VISTAS) + 2} páginas).")


if __name__ == "__main__":
    main()
