"""Pruebas aisladas del lector, usando el mismo servidor de la guardia de diseño.

No abre servicios externos ni envía notas o correcciones; el EPUB se arma en memoria.
Ejecutar con: python herramientas/revisar_lector_regresiones.py
"""
from io import BytesIO
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import sys

from revisar_diseno import servir


def epub():
    mem = BytesIO()
    with ZipFile(mem, "w", ZIP_DEFLATED) as z:
        z.writestr("mimetype", "application/epub+zip")
        z.writestr("META-INF/container.xml",
                   '<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles>'
                   '<rootfile full-path="OPS/book.opf"/></rootfiles></container>')
        z.writestr("OPS/book.opf", """<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="test">
          <metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="test">lector-regresion</dc:identifier>
          <dc:title>Prueba de lectura</dc:title><dc:creator>Proyecto Fénix</dc:creator><dc:language>es</dc:language></metadata>
          <manifest><item id="n" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
          <item id="a" href="cap.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="a"/></spine>
          </package>""")
        z.writestr("OPS/nav.xhtml", """<html xmlns="http://www.w3.org/1999/xhtml"><body>
          <nav role="doc-toc"><ol><li><a href="cap.xhtml#seccion%fin">Capítulo de prueba</a></li></ol></nav></body></html>""")
        z.writestr("OPS/cap.xhtml", """<html xmlns="http://www.w3.org/1999/xhtml"><body><h1 id="seccion%fin">Capítulo de prueba</h1>
          <p>Una   frase <em>singular</em> con acento: corazón.</p><p>Otra línea.</p>""" +
          "<p>Un párrafo largo para probar que una nota y el progreso sigan disponibles.</p>" * 14 +
          "</body></html>")
    return {"name": "prueba-lector.epub", "mimeType": "application/epub+zip", "buffer": mem.getvalue()}


def verificar(nav, base, w, h):
    ctx = nav.new_context(viewport={"width": w, "height": h}, reduced_motion="reduce")
    pg = ctx.new_page()
    errores, llamadas = [], []
    pg.on("pageerror", lambda err: errores.append(str(err)))
    pg.on("request", lambda req: llamadas.append(req.url) if req.url.split("?")[0].endswith("/lector/catalogo.json") else None)
    ctx.route("**/*", lambda route: route.continue_() if route.request.url.startswith(base) else route.abort())
    try:
        pg.goto(base + "lector/")
        pg.locator("#tituloBiblioteca").wait_for()
        pg.locator("#tabMios").focus()
        pg.keyboard.press("ArrowRight")
        assert pg.locator("#tabFenix").get_attribute("aria-selected") == "true"
        assert pg.evaluate("document.activeElement.id") == "tabFenix"
        assert pg.locator("#secFenix").is_visible()
        pg.wait_for_function("document.querySelectorAll('#catalogo .fila').length > 10")
        total = len(llamadas)
        inp = pg.locator("#buscarCat")
        for q in ("apo", "conf", "marmion", "NOCOINCIDE000", "mar"):
            inp.fill(q)
        pg.wait_for_function(r"""() => {
          const x = document.querySelector('#catalogoCuenta').textContent;
          return /^\d+ libros?$/.test(x) && Number.parseInt(x,10) > 0 &&
            Number.parseInt(x,10) === document.querySelectorAll('#catalogo .fila').length;
        }""")
        inp.fill("NOCOINCIDE000")
        pg.wait_for_function("document.querySelector('#catalogoCuenta').textContent.startsWith('0 ')")
        assert pg.locator("#catalogo .fila").count() == 0
        assert len(llamadas) <= total + 1, "El catálogo volvió a descargarse al escribir."
        assert pg.evaluate("document.documentElement.scrollWidth") <= w + 1
        pg.locator("#tabFenix").focus()
        pg.keyboard.press("Home")
        pg.locator("#archivoEpub").set_input_files(epub())
        pg.locator(".abrir-tarjeta").wait_for()
        pg.locator(".mas").focus()
        pg.keyboard.press("Enter")
        pg.locator("#dlgLibro[open]").wait_for()
        assert pg.locator("#vistaLectura").is_hidden(), "Enter en opciones también abrió el libro."
        pg.keyboard.press("Escape")
        pg.locator("#dlgLibro").wait_for(state="hidden")
        pg.locator(".abrir-tarjeta").press("Space")
        pg.locator("#vistaLectura:not([hidden]) #texto .lx-cap").wait_for()
        assert pg.locator("#barraLectura").evaluate("(e) => e.inert")
        pg.locator("#btnComandos").focus()
        pg.keyboard.press("Enter")
        assert pg.evaluate("document.activeElement.id") == "btnVolver"
        assert not pg.locator("#barraLectura").evaluate("(e) => e.inert")
        pg.locator("#btnBuscar").click()
        field = pg.locator("#buscarTexto")
        field.fill("frase singular con")
        pg.locator("#buscarLista button").first.wait_for()
        pg.locator("#buscarLista button").first.click()
        pg.wait_for_function("document.querySelectorAll('#texto mark.lx-busca').length === 3")
        pg.locator("#btnComandos").focus()
        pg.keyboard.press("Enter")
        pg.locator("#btnIndice").click()
        pg.locator("#indice a").first.click()
        pg.wait_for_function("!document.querySelector('#dlgIndice').open")
        pg.goto(base + "lector/#leer=ausente")
        pg.locator("#vistaBiblio:not([hidden])").wait_for()
        assert not errores, errores
    finally:
        ctx.close()


def main():
    from playwright.sync_api import sync_playwright
    raiz = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parents[1]
    srv = servir(str(raiz))
    base = f"http://127.0.0.1:{srv.server_port}/"
    try:
        with sync_playwright() as p:
            nav = p.chromium.launch()
            for w, h in [(360, 740), (768, 1024), (1366, 768)]:
                verificar(nav, base, w, h)
                print(f"Lector: regresiones OK en {w}x{h}", flush=True)
            nav.close()
    finally:
        srv.shutdown()


if __name__ == "__main__":
    main()
