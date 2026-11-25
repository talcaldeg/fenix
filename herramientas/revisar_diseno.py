"""Guardia de diseño: abre el sitio en un navegador real y falla si un cambio rompió la maqueta.

Por qué: cada cosa que se suma al inicio (el buscador, una línea más) empujaba las cifras del
hero fuera de la primera pantalla sin que nadie lo notara. `sesion.py publicar` corre esto antes
de subir y no publica si falla.

Revisa, en ventanas de escritorio y de celular:
  - inicio: el hero completo (hasta las cifras) cabe en la primera pantalla;
  - todas las vistas y una página de libro: sin scroll horizontal y sin errores de JavaScript;
  - la barra de arriba cabe en una línea en escritorio;
  - cada enlace del menú lleva al principio de su vista, también si ya se está en ella más abajo;
  - una sola letra: todo texto en EB Garamond (var(--letra)), salvo el código; ni el CSS fuente la mezcla;
  - la barra del sistema del celular (theme-color) es del color de la cabecera (--cabecera, la madera), en claro y en oscuro;
  - el lector (lector/): sin errores ni scroll horizontal, y un libro agregado se abre sin conexión, también
    en frío (sin la caché del navegador, solo con lo que guardó el lector);
  - el lector por páginas, en 390x844 y 360x740 con pantalla táctil: sin scroll; tocar el borde derecho o
    izquierdo y deslizar pasan la página; el centro muestra y oculta los controles; con letra más grande y
    con el teléfono girado sigue a la vista la frase que se leía; la última página lleva al capítulo siguiente.

Uso: python herramientas/revisar_diseno.py [carpeta]   (por defecto, la carpeta del repo)
     --capturas <carpeta>  guarda una captura del inicio por ventana y el RECORRIDO (inicio, Biblioteca,
                           Todos, Editorial, Citas, una ficha, una página de libro y su muestra, más el pie)
                           en claro y oscuro, en computador y celular; mirarlas con lib/hoja_contacto.py
"""
import argparse
import datetime
import functools
import http.server
import json
import os
import re
import sys
import threading

# Ventanas reales: notebook con barra de favoritos (1366x600, 1536x650), escritorio y celular.
VENTANAS = [(1366, 600), (1536, 650), (1280, 720), (1920, 950), (1024, 600), (390, 844), (360, 740)]
VISTAS = ["inicio", "biblioteca", "todos", "editorial", "oraciones", "citas", "salvar", "contacto"]
LIBRO = "libro/one-with-jesus/"
DONA = "dona/"  # página aparte (gen_estaticos.js), para que al compartirla salga su propia imagen
CATEGORIA = "categoria/lectura/"  # sección (gen_estaticos.js): enlaces internos a cada ficha
LECTURAS = {
    "libro/becquer-rimas/": (76, "Volverán las oscuras golondrinas"),
    "libro/platon-criton/": (2, "Sócrates, nada tengo que decir."),
}
ESTATICAS = (LIBRO, DONA, CATEGORIA, *LECTURAS)
ALTO_BARRA = 80  # px: más que esto es que el menú se partió en dos líneas


def servir(raiz):
    class H(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(H, directory=raiz))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


# Recorrido para mirar a ojo (--capturas): cada página que se pide revisar tras un cambio de diseño, en claro y
# oscuro, en computador y celular (9-nov-2026). Se capturan las primeras pantallas (hasta ALTO_CAPTURA) para que
# las repisas y el pie entren sin llevar a la hoja de contacto la página entera.
RECORRIDO = [("inicio", "#inicio"), ("biblioteca", "#biblioteca"), ("todos", "#todos"), ("editorial", "#editorial"),
             ("citas", "#citas"), ("ficha", "#biblioteca"), ("libro", LIBRO), ("muestra", LIBRO + "muestra/"),
             ("seccion", CATEGORIA)]
ALTO_CAPTURA = 2400


def capturar(nav, base, carpeta):
    os.makedirs(carpeta, exist_ok=True)
    for esquema in ("light", "dark"):
        for w, h in ((1366, 768), (390, 844)):
            pg = nav.new_page(viewport={"width": w, "height": h}, color_scheme=esquema)
            for nombre, ruta in RECORRIDO:
                pg.goto(base + ruta)
                pg.wait_for_load_state("networkidle")
                # Las portadas cargan diferidas: se baja y se vuelve para que estén todas.
                # behavior 'instant': con scroll-behavior: smooth la captura salía a medio subir, con la cabecera
                # fija pintada en el medio de la página.
                pg.evaluate("window.scrollTo({top: %d, behavior: 'instant'})" % ALTO_CAPTURA)
                pg.wait_for_timeout(500)
                pg.evaluate("window.scrollTo({top: 0, behavior: 'instant'})")
                if nombre == "ficha":
                    pg.evaluate("document.querySelector('.libro, .fila[data-id]').click()")
                    pg.wait_for_timeout(700)
                pg.wait_for_timeout(400)
                alto = min(ALTO_CAPTURA, pg.evaluate("document.documentElement.scrollHeight"))
                completa = nombre != "ficha"
                pg.screenshot(path=os.path.join(carpeta, f"{nombre}_{'pc' if w > 760 else 'cel'}_{esquema}.png"),
                              full_page=completa, clip={"x": 0, "y": 0, "width": w, "height": alto if completa else h})
            # El pie (zócalo de madera) queda fuera del primer tramo: una captura aparte del final del inicio.
            pg.goto(base + "#inicio")
            pg.wait_for_load_state("networkidle")
            pg.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
            pg.wait_for_timeout(500)
            pg.screenshot(path=os.path.join(carpeta, f"pie_{'pc' if w > 760 else 'cel'}_{esquema}.png"))
            pg.close()


# Una sola letra en el CSS fuente (20-nov-2026): toda declaración de letra usa var(--letra) (o inherit); solo el código
# va en monoespaciada. Atrapa también reglas que hoy no se ven (una vista sin abrir, un aviso que sale a veces).
LETRA_AJENA = re.compile(r'font(?:-family)?\s*:[^;}"`]*?(system-ui|sans-serif|Georgia|Arial|Helvetica|Roboto|"Segoe UI")')


def letras_fuente(raiz):
    fallas = []
    for rel in ("index.html", os.path.join("herramientas", "gen_estaticos.js")):
        with open(os.path.join(raiz, rel), encoding="utf-8") as f:
            for n, linea in enumerate(f, 1):
                if LETRA_AJENA.search(linea) and "monospace" not in linea and "--letra:" not in linea:
                    fallas.append(f"{rel}:{n}: letra fuera de var(--letra): {linea.strip()[:90]}")
    return fallas


def revisar(raiz, capturas=None):
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        sys.exit("Falta playwright (pip install playwright && playwright install chromium).")
    srv = servir(raiz)
    base = f"http://127.0.0.1:{srv.server_port}/"
    fallas = letras_fuente(raiz)
    with sync_playwright() as p:
        nav = p.chromium.launch()
        if capturas:
            capturar(nav, base, capturas)
        for w, h in VENTANAS:
            pg = nav.new_page(viewport={"width": w, "height": h})
            errores = []
            pg.on("pageerror", lambda e: errores.append(str(e)))
            for vista in VISTAS + list(ESTATICAS):
                url = base + vista if vista in ESTATICAS else f"{base}#{vista}"
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
                # Una sola letra (20-nov-2026): todo texto visible va en EB Garamond (var(--letra)); solo el código
                # (pre, code) va en monoespaciada. Antes convivían 49 reglas en system-ui con la Garamond.
                if w == VENTANAS[0][0] or w < 760:
                    ajenas = pg.evaluate("""() => [...document.querySelectorAll('body *')].filter(e => e.offsetParent
                            && !e.closest('pre, code, svg') && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())
                            && !getComputedStyle(e).fontFamily.startsWith('"EB Garamond"'))
                        .map(e => `${e.tagName.toLowerCase()}.${e.className} (${getComputedStyle(e).fontFamily.split(',')[0]})`)""")
                    for x in sorted(set(ajenas))[:5]:
                        fallas.append(f"{donde}: texto fuera de var(--letra): {x}")
                # El pie lleva el auspicio de Verum Data con su enlace, en todas las páginas (7-nov-2026).
                aus = pg.evaluate("""() => { const a = document.querySelector('footer a[href="https://verumdata.cl/"]');
                    const i = a && a.querySelector('img'); return {a: !!a, img: !!(i && i.complete && i.naturalWidth > 0)}; }""")
                if not aus["a"]:
                    fallas.append(f"{donde}: falta en el pie el auspicio de Verum Data con enlace a verumdata.cl")
                elif not aus["img"]:
                    fallas.append(f"{donde}: el auspicio de Verum Data no muestra su ícono (img/verum-data.svg)")
                # El pie enlaza la cuenta de Instagram de Fénix en todas las páginas, con su ícono (20-nov-2026).
                if not pg.evaluate("""() => [...document.querySelectorAll('footer a[href*="instagram.com/proyectofenixcl"]')]
                        .some(a => a.offsetParent && (s => s && s.getBoundingClientRect().width >= 12)(a.querySelector('svg')))"""):
                    fallas.append(f"{donde}: falta en el pie el enlace visible a Instagram (proyectofenixcl) con su ícono")
                # El pie va en columnas (marca, Biblioteca, Proyecto) con franja de base, igual en todas las páginas
                # (20-nov-2026, «muy básico»): no vuelve a ser una lista de líneas sueltas.
                if not pg.evaluate("""() => { const f = document.querySelector('footer');
                        return !!f && f.querySelectorAll('.pie-tit').length >= 2 && !!f.querySelector('.pie-logo img')
                            && !!f.querySelector('.pie-base') && f.querySelectorAll('.pie-col a').length >= 6; }"""):
                    fallas.append(f"{donde}: el pie no tiene sus columnas (marca, Biblioteca, Proyecto) ni la franja de base")
                # Ningún enlace ni botón del pie se ve subrayado en reposo (20-nov-2026: «Instalar como app» y Verum lo estaban).
                sub = pg.evaluate("""() => [...document.querySelectorAll('footer a, footer button')]
                        .filter(e => getComputedStyle(e).textDecorationLine.includes('underline')).map(e => e.textContent.trim())""")
                if sub:
                    fallas.append(f"{donde}: enlaces subrayados en el pie: {', '.join(sub)}")
                # Madera (9-nov-2026, «la madera está medio falsa»): la cabecera y el pie pintan la tabla de nogal de
                # herramientas/madera.py, y la imagen carga también desde las páginas de libro (su ruta lleva la base).
                mad = pg.evaluate("""() => { const cargo = performance.getEntriesByType('resource')
                        .some(e => e.name.includes('img/madera/nogal.webp') && (e.responseStatus || 200) < 400);
                    const usa = s => /nogal\\.webp/.test(getComputedStyle(document.querySelector(s)).backgroundImage);
                    return {cargo, cab: usa('header'), pie: usa('footer')}; }""")
                if not (mad["cab"] and mad["pie"]):
                    fallas.append(f"{donde}: la cabecera o el pie no usan la madera (img/madera/nogal.webp)")
                elif not mad["cargo"]:
                    fallas.append(f"{donde}: img/madera/nogal.webp no cargó (ruta rota)")
                # Los botones redondos de la cabecera (idioma, tema, lupa) son píldoras en todas las páginas; en las de
                # libro, «English» es un enlace del menú y heredaba el radio de 8 px (9-nov-2026).
                radios = pg.evaluate("""() => [...document.querySelectorAll('header .pildora')]
                    .map(e => (e.textContent.trim() || e.id) + ':' + parseFloat(getComputedStyle(e).borderTopLeftRadius))""")
                cuadrados = [r for r in radios if float(r.rsplit(":", 1)[1]) < 15]
                if cuadrados:
                    fallas.append(f"{donde}: botones de la cabecera que no son píldora: {cuadrados}")
                # Enlaces internos para Google (14-nov-2026: fichas rastreadas sin indexar, ninguna página las enlazaba
                # en HTML): la ficha enlaza su sección y «Más en <sección>», la sección lista sus libros y el pie de la
                # portada lleva las secciones visibles.
                if vista == LIBRO:
                    r = pg.evaluate("""() => ({cat: !!document.querySelector('.cabeza .meta a[href*="categoria/"]'),
                        mas: document.querySelectorAll('ul.mas-cat a[href*="libro/"]').length})""")
                    if not r["cat"] or r["mas"] < 3:
                        fallas.append(f"{donde}: la ficha no enlaza su sección o trae menos de 3 libros en «Más en» ({r})")
                if vista in LECTURAS:
                    secciones, cita = LECTURAS[vista]
                    texto = pg.locator("#texto-completo")
                    enlace = pg.locator('a[href="#texto-completo"]')
                    if texto.count() != 1 or not texto.is_visible() or enlace.count() != 1 or not enlace.is_visible():
                        fallas.append(f"{donde}: falta el texto completo o su enlace visible")
                    elif texto.locator("h3").count() != secciones or cita not in texto.inner_text():
                        fallas.append(f"{donde}: texto completo truncado")
                    if pg.locator('meta[name="robots"][content*="noindex"]').count():
                        fallas.append(f"{donde}: texto completo excluido del índice")
                if vista == CATEGORIA:
                    n = pg.evaluate("document.querySelectorAll('main ul.lista a.tt[href*=\"libro/\"]').length")
                    if n < 3:
                        fallas.append(f"{donde}: la sección lista {n} libros")
                if vista == "inicio":
                    n = pg.evaluate("[...document.querySelectorAll('footer a[href^=\"categoria/\"]')].filter(a => a.offsetParent).length")
                    if n < 3:
                        fallas.append(f"{donde}: el pie de la portada muestra {n} enlaces a secciones")
                if vista != "inicio":
                    continue
                # Una tabla por fila: el tramo de repisa de cada libro sigue la veta del vecino (--rx distinto).
                rx = pg.evaluate("""() => [...document.querySelectorAll('.grilla > .libro')].filter(l => l.offsetParent)
                    .slice(0, 4).map(l => l.style.getPropertyValue('--rx') + ' ' + l.style.getPropertyValue('--ry'))""")
                if len(rx) > 1 and len(set(rx)) < len(rx):
                    fallas.append(f"{donde}: las repisas repiten el mismo recorte de madera bajo cada libro (--rx --ry {rx})")
                r = pg.evaluate("""() => {
                    const q = s => document.querySelector(s);
                    return {cifras: q('.hero .cifras').getBoundingClientRect().bottom,
                            barra: q('header').getBoundingClientRect().height,
                            numeros: [...document.querySelectorAll('.hero .cifras b')].map(b => b.textContent.trim()),
                            celdas: [...document.querySelectorAll('#accesos .acceso')].reduce((n, a) => n + (a.classList.contains('ancho') ? 2 : 1), 0),
                            columnas: getComputedStyle(q('#accesos')).gridTemplateColumns.split(' ').length,
                            citaDia: !q('#citaDia').hidden && q('#citaDia').textContent.trim().length > 0,
                            // Campaña de Catapultame: mientras no pase su data-hasta, se ve entera y su botón cabe.
                            campana: (() => { const c = q('#campana'); if (!c) return 'fuera';
                                const b = c.querySelector('a.btn'); return c.offsetHeight > 0 && b && b.href.includes('catapultame.com')
                                    && c.scrollWidth <= c.clientWidth + 1 ? 'ok' : 'mal'; })(),
                            // Línea de investigación: cada obra con su título visible y sin desbordar su tarjeta.
                            obras: [...document.querySelectorAll('#lineaInv .obra')].map(o =>
                                o.querySelector('h3').textContent.trim().length > 0 && o.scrollWidth <= o.clientWidth + 1)};
                }""")
                if r["celdas"] % r["columnas"]:
                    fallas.append(f"{donde}: la grilla de accesos queda con hueco ({r['celdas']} celdas en {r['columnas']} columnas)")
                if not r["citaDia"]:
                    fallas.append(f"{donde}: la cita del día no se ve")
                if r["campana"] == "mal":
                    fallas.append(f"{donde}: la banda de la campaña de Catapultame no se ve bien o su botón no enlaza a la campaña")
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
        # Editorial primero (él, 20-nov-2026): en la biblioteca, y en toda la web, los libros de la
        # editorial Fénix (`editorial` en datos.js) van antes que cualquier otro.
        for sufijo in ("", "?l=en"):
            pg = nav.new_page(viewport={"width": 1280, "height": 900})
            pg.goto(f"{base}{sufijo}#biblioteca")
            pg.wait_for_load_state("networkidle")
            # La marca sale de la etiqueta «Editorial Fénix» de cada fila: `editorial` puede venir de la versión del idioma.
            r = pg.evaluate("""() => { const marca = [...document.querySelectorAll('#catalogo .fila[data-id]')].map(e => !!e.querySelector('.ed-fenix'));
                const n = marca.filter(Boolean).length;
                return { n, ok: marca.slice(0, n).every(Boolean) }; }""")
            if r["n"] and not r["ok"]:
                fallas.append(f"biblioteca{sufijo}: los libros de la editorial Fénix no van todos al principio")
            # Lista o cuadros (él, 23-nov-2026): el botón «Cuadros» pasa las mismas filas, en el mismo
            # orden, a tarjetas con portada; «Lista» las devuelve.
            r = pg.evaluate("""() => { const ids = s => [...document.querySelectorAll('#catalogo ' + s)].map(e => e.dataset.id);
                const filas = ids('.fila[data-id]');
                document.querySelector('#vistaBib [data-vista="cuadros"]').click();
                const cuadros = ids('.grilla > .libro[data-id]');
                const portadas = document.querySelectorAll('#catalogo .grilla > .libro .portada').length;
                document.querySelector('#vistaBib [data-vista="lista"]').click();
                return { filas: filas.join(), cuadros: cuadros.join(), portadas, n: cuadros.length,
                         vuelta: ids('.fila[data-id]').join() === filas.join() }; }""")
            if not r["n"] or r["cuadros"] != r["filas"] or r["portadas"] != r["n"] or not r["vuelta"]:
                fallas.append(f"biblioteca{sufijo}: la vista en cuadros no muestra los mismos libros con portada, o no vuelve a lista")
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
        # Libro de audios (medita.cc, 17-nov-2026): el botón dice «Escuchar en línea», no «Leer», y la
        # ficha enumera las once meditaciones, cada una con su audio; en la página estática y en index.html.
        pg = nav.new_page(viewport={"width": 390, "height": 844})
        revisa_audio = """() => { const d = document.querySelector('#dlgLibro[open]') || document;
            const b = [...d.querySelectorAll('a.btn')].map(a => a.textContent);
            return b.some(t => t.startsWith('Escuchar en línea')) && !b.some(t => t.startsWith('Leer en línea'))
                && d.querySelectorAll('ol.audios li a[href$=".mp3"]').length === 11; }"""
        for url, donde in (("libro/sada-trabajar-para-la-eternidad/", "página del libro"), ("?abrir=sada-trabajar-para-la-eternidad", "ficha de index.html")):
            pg.goto(base + url)
            pg.wait_for_load_state("networkidle")
            pg.wait_for_timeout(300)
            if not pg.evaluate(revisa_audio):
                fallas.append(f"audios ({donde}): falta «Escuchar en línea» o la lista de las 11 meditaciones")
        # Exclusiva de Fénix (17-nov-2026): bajo el hero en español, con botón que abre la ficha; oculta en inglés.
        for esquema in ("light", "dark"):
            pg2 = nav.new_page(viewport={"width": 360, "height": 740}, color_scheme=esquema)
            pg2.goto(base)
            pg2.wait_for_load_state("networkidle")
            pg2.wait_for_timeout(300)
            if not pg2.evaluate("() => { const c = document.querySelector('#exclusivo'); return !!c && !c.hidden && c.offsetHeight > 0 && !!c.querySelector('a.btn.prim.destacado-abrir') && c.scrollWidth <= c.clientWidth + 1; }"):
                fallas.append(f"exclusiva ({esquema}): falta o se ve mal el bloque «Exclusiva de Fénix» en el inicio")
            # Él, 20-nov-2026: en la portada tiene que quedar claro que el libro es de medita.cc.
            if not pg2.evaluate("() => { const c = document.querySelector('#exclusivo'); return !!c && !!c.querySelector('a[href^=\"https://medita.cc\"]') && /medita\\.cc/.test(c.querySelector('.eyebrow')?.textContent || ''); }"):
                fallas.append(f"exclusiva ({esquema}): el bloque no dice que las meditaciones son de medita.cc (antetítulo y enlace)")
            # Él, 20-nov-2026: fondo de papel verjurado (claro) o cuero (oscuro) y resplandor del fénix bajo el hero.
            if not pg2.evaluate("() => { const b = getComputedStyle(document.body).backgroundImage; const r = document.querySelector('#v-inicio > .resplandor'); return b.includes('svg') && b.includes('radial-gradient') && !!r && getComputedStyle(r, '::before').backgroundImage.includes('radial-gradient'); }"):
                fallas.append(f"fondo ({esquema}): falta la textura de papel o cuero, o el resplandor del fénix bajo el hero")
            # Él, 20-nov-2026: la etiqueta «Solo en Fénix» heredó el estilo del bloque .exclusivo y salió
            # como un botón enorme, separado del libro. Toda etiqueta de tarjeta es una píldora baja.
            grandes = pg2.evaluate("() => [...document.querySelectorAll('.libro .etq')].filter(e => e.offsetHeight > 30 || e.offsetWidth > 220).map(e => e.textContent.trim()).slice(0, 3)")
            if grandes:
                fallas.append(f"etiquetas ({esquema}): etiqueta de tarjeta desproporcionada: {grandes}")
            # Auditoría de color, 20-nov-2026: el hero era un negro frío (#0f0d10) en una paleta cálida, y de noche
            # EPUB, «Recomendado» y «Edición Fénix» iban los tres en dorado. Hero cálido (rojo > azul) y cada
            # etiqueta de su color.
            if not pg2.evaluate("() => { const m = getComputedStyle(document.querySelector('.hero')).backgroundColor.match(/\\d+/g).map(Number); return m[0] > m[2]; }"):
                fallas.append(f"hero ({esquema}): el fondo del hero es frío; va en negro cálido como el resto de la paleta")
            pg2.goto(base + "#biblioteca")  # las filas de la biblioteca traen las tres etiquetas
            pg2.wait_for_load_state("networkidle")
            pg2.wait_for_timeout(300)
            colores = pg2.evaluate("""() => { const c = s => { const e = document.querySelector(s); return e ? getComputedStyle(e) : null; };
                const ep = c('.etq.epub'), se = c('.etq.sello'), ed = c('.etq.ed-fenix');
                return ep && se && ed ? [ep.backgroundColor, se.color, ed.color] : null; }""")
            if not colores:
                fallas.append(f"etiquetas ({esquema}): la biblioteca no muestra EPUB, «Recomendado» y «Edición Fénix»")
            elif len(set(colores)) < 3:
                fallas.append(f"etiquetas ({esquema}): EPUB, «Recomendado» y «Edición Fénix» comparten color: {colores}")
            pg2.goto(base + "?l=en")
            pg2.wait_for_load_state("networkidle")
            pg2.wait_for_timeout(300)
            if not pg2.evaluate("document.querySelector('#exclusivo').hidden"):
                fallas.append("exclusiva: el bloque aparece en inglés y el libro es solo en español")
            pg2.close()
        pg.close()
        # Preventa impresa (9-nov-2026): mientras la campaña siga (data-hasta de la banda #campana), la ficha
        # estática de los cuatro libros de la Colección Fénix, en español y en inglés, y la ficha de index.html
        # avisan con enlace a Catapultame; otro libro no lleva el aviso. Se mira en claro y en oscuro.
        with open(os.path.join(raiz, "index.html"), encoding="utf-8") as f:
            m = re.search(r'id="campana" data-hasta="([^"]+)" data-libros="([^"]+)"', f.read())
        if not m:
            fallas.append("preventa: la banda #campana no trae data-hasta y data-libros (corre gen_estaticos.js)")
        elif datetime.datetime.now(datetime.timezone.utc) < datetime.datetime.fromisoformat(m.group(1).replace("Z", "+00:00")):
            revisa = """() => { const c = document.querySelector('#preventa, #dlgLibro .preventa'); if (!c) return 'falta';
                const a = c.querySelector('a.btn'); return c.offsetHeight > 0 && a && a.href.includes('catapultame.com')
                    && c.scrollWidth <= c.clientWidth + 1 ? 'ok' : 'mal'; }"""
            for esquema in ("light", "dark"):
                pg = nav.new_page(viewport={"width": 360, "height": 740}, color_scheme=esquema)
                for lid in m.group(2).split(","):
                    for sub in ("", "en/"):
                        if sub and not os.path.exists(os.path.join(raiz, "libro", lid, "en", "index.html")):
                            continue
                        pg.goto(f"{base}libro/{lid}/{sub}")
                        pg.wait_for_load_state("networkidle")
                        if (r := pg.evaluate(revisa)) != "ok":
                            fallas.append(f"preventa ({esquema}): libro/{lid}/{sub} {'no avisa' if r == 'falta' else 'avisa mal o sin enlace a Catapultame'}")
                        if capturas and lid == "confesiones":
                            pg.screenshot(path=os.path.join(capturas, f"preventa_{lid}_{sub.strip('/') or 'es'}_{esquema}.png"))
                    for idioma in ("", "l=en&"):
                        pg.goto(f"{base}?{idioma}abrir={lid}")
                        pg.wait_for_load_state("networkidle")
                        pg.wait_for_timeout(300)
                        if (r := pg.evaluate(revisa)) != "ok":
                            fallas.append(f"preventa ({esquema}): la ficha de {lid} en index.html{' (en)' if idioma else ''} {'no avisa' if r == 'falta' else 'avisa mal'}")
                        if capturas and lid == "historia-de-un-alma":
                            pg.screenshot(path=os.path.join(capturas, f"preventa_ficha_{lid}_{'en' if idioma else 'es'}_{esquema}.png"))
                pg.goto(base + LIBRO)
                pg.wait_for_load_state("networkidle")
                if pg.evaluate("!!document.querySelector('#preventa')"):
                    fallas.append(f"preventa: {LIBRO} avisa la preventa y no va en la Colección Fénix")
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
        fallas += revisar_lector(nav, base, raiz)
        nav.close()
    srv.shutdown()
    return fallas


PORTADA_Y_NOTAS = """async () => {
  const fallas = [], espera = ms => new Promise(r => setTimeout(r, ms)), cap = () => document.querySelector('#texto .lx-cap');
  for (let k = 0; k < 60 && !document.querySelector('#capAnterior').disabled; k++) { document.querySelector('#capAnterior').click(); await espera(500); }
  await espera(600);
  const c0 = cap();
  if (c0 && c0.querySelectorAll('img, image').length === 1 && !c0.textContent.trim() && !document.querySelector('#vistaLectura').dataset.portada)
    fallas.push('la portada no pinta la pantalla entera de su color');
  for (let k = 0; k < 15; k++) {
    if (document.querySelector('#texto .lx-pie-nota')) break;
    if (document.querySelector('#capSiguiente').disabled) return fallas;
    document.querySelector('#capSiguiente').click(); await espera(700);
  }
  const tx = document.querySelector('#texto'), cajas = [...tx.querySelectorAll('.lx-pie')];
  if (!cajas.length) return fallas;
  const paso = parseFloat(getComputedStyle(tx).columnGap) + parseFloat(getComputedStyle(tx).width) / (parseInt(getComputedStyle(tx).columnCount) || 1);
  const col = el => Math.floor((el.getBoundingClientRect().left - tx.getBoundingClientRect().left + 2) / paso);
  for (const c of cajas) {
    if (Math.abs(c.getBoundingClientRect().bottom - tx.getBoundingClientRect().bottom) > 3) { fallas.push('una caja de notas no llega al pie de la página'); break; }
    for (const n of c.querySelectorAll('.lx-pie-nota')) {
      const num = n.querySelector('.lx-pie-num').textContent;
      // Puede haber otro enlace con el mismo número (índice, otra numeración): basta una llamada en esa página.
      const ok = [...tx.querySelectorAll('.lx-cap a[data-ir]')].some(a => !a.closest('.lx-pie') && a.textContent.trim() === num && col(a) === col(c));
      if (!ok) fallas.push(`la nota ${num} no está en la página de su llamada (columna ${col(c)})`);
      if (/^\\s*\\d+\\s*[.:]/.test(n.textContent)) fallas.push(`la nota ${num} parte con un punto`);
    }
  }
  return fallas.slice(0, 5);
}"""


def revisar_lector(nav, base, raiz):
    """El lector (lector/, 21-nov-2026): sin errores ni scroll horizontal en las 7 ventanas, y lo que él
    pidió como regla: que funcione sin conexión. Se agrega el primer libro del catálogo desde la ficha
    (#fenix=), se corta la red, se recarga y se abre de nuevo; ningún error de JavaScript en el camino."""
    fallas = []
    for w, h in VENTANAS:
        pg = nav.new_page(viewport={"width": w, "height": h})
        errores = []
        pg.on("pageerror", lambda e: errores.append(str(e)))
        pg.goto(base + "lector/")
        pg.wait_for_load_state("networkidle")
        ancho = pg.evaluate("document.documentElement.scrollWidth")
        if ancho > w + 1:
            fallas.append(f"{w}x{h} lector: scroll horizontal ({ancho}px en {w}px)")
        # El APK de Android se baja desde aquí (app/, 21-nov-2026): botón a la vista y diálogo con la descarga y los pasos.
        app = pg.evaluate("""() => { const b = document.querySelector('#btnApp');
            if (!b || !b.offsetParent) return 'no se ve';
            if (b.getBoundingClientRect().right > innerWidth + 1) return 'se sale de la pantalla';
            b.click(); const d = document.querySelector('#dlgApp');
            // El APK con la versión en el nombre (lector-fenix-1.N.apk, 23-nov-2026) o, sin red, el de nombre fijo.
            const a = d.querySelector('a.apk');
            const ok = d.open && !!a && /^https:\\/\\/github\\.com\\/talcaldeg\\/fenix\\/releases\\/(latest\\/download\\/lector-fenix|download\\/lector-v\\d+\\/lector-fenix(-1\\.\\d+)?)\\.apk$/.test(a.href) && d.querySelectorAll('ol li').length >= 3;
            d.close(); return ok ? '' : 'el diálogo no trae la descarga o los pasos'; }""")
        if app:
            fallas.append(f"{w}x{h} lector: botón «Descargar app para Android»: {app}")
        # Tocar un botón en Android no deja el recuadro celeste (él, 23-nov-2026).
        toque = pg.evaluate("""() => getComputedStyle(document.querySelector('#tabMios')).webkitTapHighlightColor""")
        if toque and toque not in ("transparent", "rgba(0, 0, 0, 0)"):
            fallas.append(f"{w}x{h} lector: los botones muestran el recuadro de toque de Android ({toque})")
        fallas += [f"{w}x{h} lector: error de JavaScript: {e}" for e in errores]
        pg.close()
    with open(os.path.join(raiz, "lector", "catalogo.json"), encoding="utf-8") as f:
        libros_cat = json.load(f)["libros"]
    # Libro fijo para la prueba (busca «dios»): el primero del catálogo cambia con cada libro nuevo, y uno
    # sin esa palabra (Belloc, 24-nov-2026) daba un falso «el buscador no encuentra».
    libro = next((x for x in libros_cat if x.get("id") == "marmion-vida-del-alma"), libros_cat[0])
    ctx = nav.new_context(viewport={"width": 390, "height": 844})
    pg = ctx.new_page()
    errores = []
    pg.on("pageerror", lambda e: errores.append(str(e)))
    try:
        pg.goto(f"{base}lector/#fenix={libro['id']}&l={libro['idioma']}")
        pg.wait_for_selector("#vistaLectura:not([hidden]) #texto .lx-cap", timeout=30000)
        # Que el service worker haya guardado el lector antes de cortar la red (ready solo no bastó:
        # en publicar falló una vez cortando la red antes de tiempo).
        pg.wait_for_function("async () => { await navigator.serviceWorker.ready; return !!(await caches.match(location.origin + location.pathname)); }",
                             timeout=60000, polling=500)
        # En frío: sin la caché HTTP del navegador (dura 10 minutos en GitHub Pages y escondía una falla),
        # queda solo lo que guardó el service worker y los libros de IndexedDB.
        ctx.new_cdp_session(pg).send("Network.clearBrowserCache")
        ctx.set_offline(True)
        pg.goto(base + "lector/")
        pg.wait_for_selector("#estante .tarjeta", timeout=15000)
        pg.click("#estante .tarjeta")
        pg.wait_for_selector("#vistaLectura:not([hidden]) #texto .lx-cap", timeout=15000)
        if len(pg.inner_text("#texto")) < 50:
            fallas.append("lector sin conexión: el libro abre vacío")
    except Exception as e:
        fallas.append(f"lector sin conexión: no abre ({str(e).splitlines()[0]})")
    fallas += [f"lector sin conexión: error de JavaScript: {e}" for e in errores]
    ctx.close()
    for w, h in [(390, 844), (360, 740)]:
        fallas += revisar_paginas(nav, base, libro, w, h)
    return fallas


# ¿Se ve en la página el comienzo del ancla (la frase que se leía)? Busca su texto y mide su primer carácter.
ANCLA_VISIBLE = """() => {
  const a = lectorEstado().ancla, cita = (a.cita || '').trim().slice(0, 30), cap = document.querySelector('#texto .lx-cap');
  const nodos = [], w = document.createTreeWalker(cap, NodeFilter.SHOW_TEXT); let t = '';
  while (w.nextNode()) { nodos.push([w.currentNode, t.length]); t += w.currentNode.data; }
  const k = t.indexOf(cita); if (k < 0) return 'no está en el capítulo: ' + cita;
  const [n, ini] = nodos.filter(x => x[1] <= k).pop(), rg = document.createRange();
  rg.setStart(n, k - ini); rg.setEnd(n, Math.min(n.data.length, k - ini + 1));
  const r = rg.getClientRects()[0], m = document.querySelector('#marco').getBoundingClientRect();
  return r && r.left >= m.left - 1 && r.right <= m.right + 1 && r.top >= m.top - 1 && r.bottom <= m.bottom + 1 ? '' : 'fuera de la página: ' + cita;
}"""


def revisar_paginas(nav, base, libro, w, h):
    """El lector por páginas (21-nov-2026, él: «leer en el celular como ReadEra, pasando páginas»)."""
    fallas, errores = [], []
    rot = f"lector {w}x{h}"
    ctx = nav.new_context(viewport={"width": w, "height": h}, is_mobile=True, has_touch=True)
    pg = ctx.new_page()
    pg.on("pageerror", lambda e: errores.append(str(e)))
    # Sin pantalla completa: el navegador de prueba no deja cambiar el tamaño de una ventana en pantalla completa.
    pg.add_init_script("if (!localStorage.getItem('lector.ajustes')) localStorage.setItem('lector.ajustes', JSON.stringify({pantalla: 'no'}))")
    est = lambda: pg.evaluate("lectorEstado()")
    cdp = ctx.new_cdp_session(pg)

    def deslizar(x0, x1):
        pt = lambda x: [{"x": x, "y": h / 2}]
        cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": pt(x0)})
        for k in range(1, 9):
            cdp.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": pt(x0 + (x1 - x0) * k / 8)})
        cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
        pg.wait_for_timeout(450)

    def tocar(fx):
        pg.touchscreen.tap(w * fx, h / 2)
        pg.wait_for_timeout(450)

    try:
        pg.goto(f"{base}lector/#fenix={libro['id']}&l={libro['idioma']}")
        pg.wait_for_selector("#vistaLectura:not([hidden]) #texto .lx-cap", timeout=30000)
        pg.wait_for_timeout(800)
        # Un capítulo con al menos tres páginas y sin enlaces donde se toca (un toque sobre un enlace, como
        # en el índice del libro, lo sigue y no pasa la página).
        sin_enlaces = f"[0.1, 0.5, 0.9].every(f => {{ const e = document.elementFromPoint({w} * f, {h} / 2); return !e || !e.closest('a, mark'); }})"
        for _ in range(12):
            if est()["paginas"] >= 3 and pg.evaluate(sin_enlaces):
                break
            pg.evaluate("document.querySelector('#capSiguiente').click()")
            pg.wait_for_timeout(600)
        if est()["paginas"] < 3 or not pg.evaluate(sin_enlaces):
            return [f"{rot}: ningún capítulo de los primeros sirve para probar (tres páginas sin enlaces al medio)"]
        alto, ancho = pg.evaluate("[document.documentElement.scrollHeight - innerHeight, document.documentElement.scrollWidth - innerWidth]")
        if alto > 1 or ancho > 1:
            fallas.append(f"{rot}: la lectura tiene scroll ({alto}px vertical, {ancho}px horizontal)")
        p0 = est()["pag"]
        tocar(0.9)
        if est()["pag"] != p0 + 1:
            fallas.append(f"{rot}: tocar el borde derecho no pasa la página")
        tocar(0.1)
        if est()["pag"] != p0:
            fallas.append(f"{rot}: tocar el borde izquierdo no vuelve la página")
        deslizar(w * 0.8, w * 0.2)
        if est()["pag"] != p0 + 1:
            fallas.append(f"{rot}: deslizar hacia la izquierda no pasa la página")
        deslizar(w * 0.2, w * 0.8)
        if est()["pag"] != p0:
            fallas.append(f"{rot}: deslizar hacia la derecha no vuelve la página")
        tocar(0.5)
        if not pg.evaluate("document.querySelector('#vistaLectura').hasAttribute('data-controles')"):
            fallas.append(f"{rot}: tocar al centro no muestra los controles")
        tocar(0.5)
        if pg.evaluate("document.querySelector('#vistaLectura').hasAttribute('data-controles')"):
            fallas.append(f"{rot}: tocar al centro no oculta los controles")
        tocar(0.9)
        pg.wait_for_timeout(800)
        # Letra más grande y teléfono girado: la frase que se leía sigue en la página.
        pg.evaluate("document.querySelector('#btnAjustes').click()")
        for _ in range(3):
            pg.click("#ajustes [data-paso='1']")
        pg.keyboard.press("Escape")
        pg.wait_for_timeout(900)
        if (r := pg.evaluate(ANCLA_VISIBLE)):
            fallas.append(f"{rot}: con letra más grande se pierde la página ({r})")
        pg.set_viewport_size({"width": h, "height": w})
        pg.wait_for_timeout(900)
        if (r := pg.evaluate(ANCLA_VISIBLE)):
            fallas.append(f"{rot}: con el teléfono girado se pierde la página ({r})")
        pg.set_viewport_size({"width": w, "height": h})
        pg.wait_for_timeout(900)
        if (r := pg.evaluate(ANCLA_VISIBLE)):
            fallas.append(f"{rot}: al volver a enderezar el teléfono se pierde la página ({r})")
        # Última página → primera del capítulo siguiente, y de vuelta.
        for _ in range(80):
            if est()["pag"] >= est()["paginas"] - 1:
                break
            tocar(0.9)
        e = est()
        tocar(0.9)
        pg.wait_for_timeout(600)
        e2 = est()
        if (e2["i"], e2["pag"]) != (e["i"] + 1, 0):
            fallas.append(f"{rot}: la última página no lleva al comienzo del capítulo siguiente")
        tocar(0.1)
        pg.wait_for_timeout(600)
        e3 = est()
        if (e3["i"], e3["pag"]) != (e["i"], e3["paginas"] - 1):
            fallas.append(f"{rot}: volver desde el comienzo de un capítulo no lleva a la última página del anterior")
        # La línea de abajo recorre el libro entero, no el capítulo (él, 23-nov-2026): soltarla en el 90 %
        # lleva a un capítulo posterior.
        antes = est()["i"]
        pg.evaluate("(() => { const d = document.querySelector('#deslizador'); d.value = 900; d.dispatchEvent(new Event('input')); d.dispatchEvent(new Event('change')); })()")
        pg.wait_for_timeout(900)
        if pg.evaluate("document.querySelector('#deslizador').max") != "1000" or est()["i"] <= antes:
            fallas.append(f"{rot}: la línea para moverse no recorre el libro entero")
        # Buscar en el libro (él, 23-nov-2026): una palabra del primer capítulo con texto aparece y su
        # resultado lleva a ese capítulo con la palabra marcada.
        pg.evaluate("document.querySelector('#btnBuscar').click()")
        pg.fill("#buscarTexto", "dios")
        pg.wait_for_timeout(1500)
        n = pg.evaluate("document.querySelectorAll('#buscarLista button').length")
        if not n:
            fallas.append(f"{rot}: el buscador no encuentra «dios» en el libro")
        else:
            pg.evaluate("document.querySelector('#buscarLista button').click()")
            pg.wait_for_timeout(900)
            if not pg.evaluate("!!document.querySelector('#texto mark.lx-busca')"):
                fallas.append(f"{rot}: el resultado de la búsqueda no lleva a la palabra marcada")
        # Portada y notas al pie (él, 24-nov-2026): la portada pinta la pantalla entera de su color, y cada
        # nota va al pie de la página de su llamada, abajo, sin el «. » que dejaba el número quitado.
        r = pg.evaluate(PORTADA_Y_NOTAS)
        fallas += [f"{rot}: {x}" for x in r]
    except Exception as ex:
        fallas.append(f"{rot}: la prueba de páginas no terminó ({str(ex).splitlines()[0]})")
    fallas += [f"{rot}: error de JavaScript: {x}" for x in errores]
    ctx.close()
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
    print(f"Diseño OK ({len(VENTANAS)} ventanas, {len(VISTAS) + len(ESTATICAS)} páginas).")


if __name__ == "__main__":
    main()
