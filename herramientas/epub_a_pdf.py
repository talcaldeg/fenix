# -*- coding: utf-8 -*-
"""Convierte un EPUB de libros/ en PDF con PyMuPDF, para ofrecer los dos formatos.

    python herramientas/epub_a_pdf.py libros/<archivo>.epub [--hoja 104x174]

La hoja es A5 salvo para los libros de HOJAS, que copian la página de su original; --hoja (en
milímetros) manda sobre las dos. Si MuPDF achica un dibujo con {width=N%} porque no cabe en lo
que queda de la página, ese dibujo pasa a la página siguiente, y un título (o rótulo del índice) que
quedaría solo al pie de una página, también (solo en el PDF, el EPUB no cambia).
En el índice de indice.py dibuja el número de página de cada entrada, con puntos guía.
"""
import argparse
import html
import io
import re
import sys
import zipfile
from pathlib import Path

import fitz  # PyMuPDF

sys.path.insert(0, str(Path(__file__).resolve().parent))
from anclas import arreglar  # noqa: E402

MM = 72 / 25.4
A5 = (148, 210)  # mm
# Hoja del original, en mm. Con el margen de página de MuPDF (2em) y el 4 % del cuerpo, en
# 104 mm de ancho la caja de texto queda en el 78 % del ancho, como en el original.
HOJAS = {
    "saint-exupery-el-principito": (104, 174),  # Gallimard 1984, alto/ancho 1,68
}

IMG_ANCHO = re.compile(r'<img src="([^"]+)" style="width: (\d+)%"')
LETRA = 11  # pt; MuPDF deja 2em de margen de página


def rehacer_enlaces(doc, pdf) -> None:
    """convert_to_pdf deja todo enlace interno apuntando a la página 1 (la portada) y no copia
    el índice lateral: se reponen desde el EPUB ya diagramado, que tiene las mismas páginas."""
    for i in range(pdf.page_count):
        pag = pdf[i]
        for l in pag.get_links():
            if l["kind"] == fitz.LINK_GOTO:
                pag.delete_link(l)
        for l in doc[i].get_links():
            if l["kind"] == fitz.LINK_GOTO and l.get("page", -1) >= 0:
                pag.insert_link({"kind": fitz.LINK_GOTO, "from": l["from"],
                                 "page": l["page"], "to": l["to"]})
    pdf.set_toc(doc.get_toc())


def spine(z: zipfile.ZipFile) -> tuple:
    """(carpeta del OPF, rutas de los xhtml en el orden del spine)."""
    opf = next(n for n in z.namelist() if n.endswith(".opf"))
    base = opf.rpartition("/")[0] + "/" if "/" in opf else ""
    texto = z.read(opf).decode("utf-8")
    hrefs = {}  # portadas.py y exlibris.py escriben sus <item> con otro orden de atributos
    for item in re.findall(r"<item\b[^>]*>", texto):
        attrs = dict(re.findall(r'(\w[\w-]*)="([^"]*)"', item))
        hrefs[attrs.get("id")] = attrs.get("href")
    return base, [base + hrefs[i] for i in re.findall(r'<itemref idref="([^"]+)"', texto)]


def paginas_de_imagen(z: zipfile.ZipFile, doc, pdf) -> None:
    """La portada y el ex libris van en una envoltura SVG con preserveAspectRatio="meet", pero
    MuPDF la rasteriza en 816 x 1056 (carta) y estira eso a la caja de la página: la imagen sale
    deformada (un 9 % en A5, un 31 % en la hoja de El principito). Esas páginas se rehacen: el
    color de fondo de la envoltura de canto a canto y la imagen entera, sin deformar, al centro."""
    base, xhtmls = spine(z)
    for i in range(doc.page_count):
        cap, sub = doc.location_from_page_number(i)
        if sub or cap >= len(xhtmls):
            continue
        xhtml = z.read(xhtmls[cap]).decode("utf-8")
        img = re.search(r'<image\b[^>]*xlink:href="([^"]+)"', xhtml)
        if "<svg" not in xhtml or not img or re.search(r"<p\b", xhtml):
            continue
        fondo = re.search(r'<rect\b[^>]*fill="#([0-9a-fA-F]{6})"', xhtml)
        color = tuple(int(fondo.group(1)[k:k + 2], 16) / 255 for k in (0, 2, 4)) if fondo else (1, 1, 1)
        datos = z.read(xhtmls[cap].rpartition("/")[0] + "/" + img.group(1) if "/" in xhtmls[cap]
                       else img.group(1))
        pm = fitz.Pixmap(datos)
        r = pdf[i].rect
        esc = min(r.width / pm.width, r.height / pm.height)
        w, h = pm.width * esc, pm.height * esc
        pdf.delete_page(i)
        pag = pdf.new_page(i, width=r.width, height=r.height)
        pag.draw_rect(r, color=None, fill=color)
        pag.insert_image(fitz.Rect((r.width - w) / 2, (r.height - h) / 2,
                                   (r.width + w) / 2, (r.height + h) / 2), stream=datos)


def paginas_del_indice(z: zipfile.ZipFile, doc) -> list:
    """Números (desde 0) de las páginas que diagrama el nav.xhtml, si está en el spine."""
    base, xhtmls = spine(z)
    opf = z.read(next(n for n in z.namelist() if n.endswith(".opf"))).decode("utf-8")
    item = re.search(r'<item\b[^>]*properties="[^"]*\bnav\b[^"]*"[^>]*>', opf)
    if not item:
        return []
    nav = base + re.search(r'href="([^"]+)"', item.group(0)).group(1)
    if nav not in xhtmls:
        return []
    k = xhtmls.index(nav)
    return [i for i in range(doc.page_count) if doc.location_from_page_number(i)[0] == k]


def numerar_indice(z: zipfile.ZipFile, doc, pdf) -> int:
    """Número de página con puntos guía en cada entrada del índice, alineado a la derecha de la
    caja de texto (indice.py le deja ese margen). Se dibuja sobre el PDF ya diagramado, así que no
    cambia la paginación; el número es el de la página del PDF a la que lleva el enlace. Los puntos
    caen en una grilla fija para que queden en columna de una línea a otra."""
    paginas = paginas_del_indice(z, doc)
    if not paginas:
        return 0
    letra = None
    for x in pdf[paginas[0]].get_fonts():
        buf = pdf.extract_font(x[0])[3]
        if buf:
            f = fitz.Font(fontbuffer=buf)
            if all(f.has_glyph(ord(c)) for c in "0123456789."):
                letra = f
                break
    letra = letra or fitz.Font("tiro")
    n = 0
    por_pagina = {}
    for i in paginas:
        # MuPDF da un enlace por línea: las líneas seguidas con el mismo destino son una entrada
        # (el rótulo y su título); de cada entrada vale la última. El mismo destino es la misma
        # página y el mismo punto: un capítulo y su primera sección caen en la misma página, pero
        # son dos entradas (Marmion, 9-nov-2026: «Hijo de Irlanda» quedaba sin número).
        entradas = []  # [destino, punto, rect de su última línea]
        enlaces = sorted((l for l in doc[i].get_links() if l["kind"] == fitz.LINK_GOTO and l.get("page", -1) >= 0),
                         key=lambda l: l["from"].y0)
        for l in enlaces:
            r = l["from"]
            punto = round(l["to"].y) if l.get("to") is not None else None
            if entradas and entradas[-1][:2] == [l["page"], punto] and r.y0 - entradas[-1][2].y1 < 0.45 * LETRA:
                entradas[-1][2] = r
            else:
                entradas.append([l["page"], punto, r])
        por_pagina[i] = entradas
    # Una entrada que sigue en la página siguiente lleva el número donde termina, no en la
    # primera parte (MuPDF no respeta break-inside: avoid; Marmion, 9-nov-2026).
    for i in paginas:
        sig = por_pagina.get(i + 1)
        if por_pagina[i] and sig and por_pagina[i][-1][:2] == sig[0][:2]:
            por_pagina[i].pop()
    for i in paginas:
        entradas = por_pagina[i]
        lineas = [l for b in doc[i].get_text("dict")["blocks"] for l in b.get("lines", [])]
        margen = min(l["bbox"][0] for l in lineas)
        derecha = doc[i].rect.width - margen
        tw = fitz.TextWriter(pdf[i].rect)
        for destino, _, r in entradas:
            linea = max((l for l in lineas if fitz.Rect(l["bbox"]).intersects(r)),
                        key=lambda l: l["bbox"][3], default=None)
            if not linea:
                continue
            tam = max(s["size"] for s in linea["spans"])
            y = linea["spans"][-1]["origin"][1]
            num = str(destino + 1)
            x_num = derecha - letra.text_length(num, tam)
            paso = tam * 0.55
            x = (int((linea["bbox"][2] + tam * 0.6 - margen) / paso) + 1) * paso + margen
            while x + letra.text_length(".", tam) < x_num - tam * 0.5:
                tw.append((x, y), ".", font=letra, fontsize=tam)
                x += paso
            tw.append((x_num, y), num, font=letra, fontsize=tam)
            n += 1
        tw.write_text(pdf[i])
    return n


def dibujos_con_ancho(z: zipfile.ZipFile) -> list:
    """(xhtml, posición del <img>, ancho pedido, tamaño en píxeles), en el orden del spine."""
    base, xhtmls = spine(z)
    dibujos = []
    for nombre in xhtmls:
        xhtml = z.read(nombre).decode("utf-8")
        for m in IMG_ANCHO.finditer(xhtml):
            pm = fitz.Pixmap(z.read(base + m.group(1)))
            dibujos.append((nombre, m.start(), int(m.group(2)), (pm.width, pm.height)))
    return dibujos


def achicados(doc, dibujos: list) -> list:
    """(índice, página, bbox) de los dibujos que salen más angostos que su % de la caja de texto."""
    bordes = [(b[0], b[2]) for p in doc for b in p.get_text("blocks")
              if b[6] == 0 and b[2] - b[0] > 0.6 * p.rect.width]
    caja = max(x1 for _, x1 in bordes) - min(x0 for x0, _ in bordes)
    salida, i = [], 0
    for p in doc:
        for info in p.get_image_info():
            if i < len(dibujos) and (info["width"], info["height"]) == dibujos[i][3]:
                r = fitz.Rect(info["bbox"])
                if r.width < dibujos[i][2] / 100 * caja - 1:
                    salida.append((i, p.number, r))
                i += 1
    return salida


INTERLINEADO = 1.5  # el de estilo.css (body); la viuda de fin de capítulo lo aprieta solo en ese capítulo


def con_relleno(z: zipfile.ZipFile, relleno: dict, apretados: dict | None = None) -> bytes:
    """Copia del EPUB con un bloque vacío de `alto` pt en cada (xhtml, posición) de `relleno`
    (valor: (alto, etiqueta), «div» o, dentro de la lista del índice, «li»). MuPDF no respeta
    break-before, break-after ni break-inside (probado en 1.29): un dibujo que no cabe en lo que
    queda de la página se achica hasta caber, y un título puede quedar solo al pie; el bloque
    vacío completa la página y lo que sigue parte en la siguiente."""
    por_archivo = {}
    for (nombre, pos), (alto, etiqueta) in relleno.items():
        por_archivo.setdefault(nombre, []).append((pos, alto, etiqueta))
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as nuevo:
        for item in z.infolist():
            datos = z.read(item)
            if item.filename in por_archivo or (apretados and item.filename in apretados):
                xhtml = datos.decode("utf-8")
                for pos, alto, etiqueta in sorted(por_archivo.get(item.filename, []), reverse=True):
                    estilo = f"height: {alto:.1f}pt" + ("; margin: 0; padding: 0" if etiqueta == "li" else "")
                    xhtml = xhtml[:pos] + f'<{etiqueta} style="{estilo}"></{etiqueta}>' + xhtml[pos:]
                if apretados and item.filename in apretados:
                    xhtml = re.sub(r"<body\b", f'<body style="line-height: {INTERLINEADO * apretados[item.filename]:.3f}"',
                                   xhtml, count=1)
                datos = xhtml.encode("utf-8")
            # ZipInfo nuevo: writestr reescribe el que recibe y z ya no podría leer esa entrada
            nuevo.writestr(zipfile.ZipInfo(item.filename, item.date_time), datos,
                           compress_type=item.compress_type)
    return buf.getvalue()


TITULO = re.compile(r"<(h[1-6])\b[^>]*>(.*?)</\1>", re.S)


def sin_espacios(texto: str) -> str:
    return re.sub(r"[\s­​]+", "", texto).casefold()


def titulos_del_libro(z: zipfile.ZipFile) -> dict:
    """{índice en el spine: [(posición del <hN>, texto sin espacios ni mayúsculas)]}, sin el índice."""
    base, xhtmls = spine(z)
    salida = {}
    for k, nombre in enumerate(xhtmls):
        if nombre.endswith("nav.xhtml"):
            continue
        xhtml = z.read(nombre).decode("utf-8")
        lista = []
        for m in TITULO.finditer(xhtml):
            texto = sin_espacios(html.unescape(re.sub(r"<[^>]+>", " ", m.group(2))))
            if texto:
                lista.append((m.start(), texto))
        if lista:
            salida[k] = lista
    return salida


def titulos_huerfanos(z: zipfile.ZipFile, doc, titulos: dict, desde: int = 0):
    """Primer título (o grupo de títulos seguidos, como «Libro IV» y «I») que queda al pie de una
    página con menos de dos líneas de su texto debajo, mientras el capítulo sigue en la página
    siguiente. (página, (xhtml, posición del primer título del grupo), y de su primera línea), o
    None. Cada título se ubica por su texto, en orden dentro de su capítulo; si no se encuentra
    (letra con versalitas que MuPDF no deja leer), se salta."""
    base, xhtmls = spine(z)
    por_capitulo = {}
    for i in range(desde, doc.page_count):
        k = doc.location_from_page_number(i)[0]
        if k in titulos:
            por_capitulo.setdefault(k, []).append(i)
    for k, paginas in sorted(por_capitulo.items()):
        lineas = []  # (página, y0, y1, texto) en orden de lectura; un dibujo cuenta como línea
        for i in paginas:
            for b in doc[i].get_text("dict")["blocks"]:
                if b["type"] == 1:
                    lineas.append((i, b["bbox"][1], b["bbox"][3], None))
                for l in b.get("lines", []):
                    t = sin_espacios("".join(s["text"] for s in l["spans"]))
                    if t:
                        lineas.append((i, l["bbox"][1], l["bbox"][3], t))
        ubicados = []  # (pos, primera línea, última línea)
        cursor = 0
        for pos, texto in titulos[k]:
            for j in range(cursor, len(lineas)):
                t = lineas[j][3]
                if not t or not texto.startswith(t):
                    continue
                acc, fin = t, j
                while acc != texto and fin + 1 < len(lineas) and lineas[fin + 1][3] \
                        and texto.startswith(acc + lineas[fin + 1][3]):
                    fin += 1
                    acc += lineas[fin][3]
                if acc == texto:
                    ubicados.append((pos, j, fin))
                    cursor = fin + 1
                    break
        for n, (pos, ini, fin) in enumerate(ubicados):
            pag = lineas[fin][0]
            debajo = sum(1 for l in lineas[fin + 1:] if l[0] == pag)
            if debajo >= 2 or fin + 1 + debajo >= len(lineas):
                continue  # tiene texto debajo, o el capítulo termina en esta página
            # sube por los títulos pegados encima en la misma página
            while n > 0 and ubicados[n - 1][2] == ini - 1 and lineas[ubicados[n - 1][2]][0] == pag:
                n -= 1
                pos, ini = ubicados[n][0], ubicados[n][1]
            if lineas[ini][0] != pag or ini == 0 or lineas[ini - 1][0] != pag:
                continue  # el grupo ya abre la página: más arriba no puede ir
            return pag, (xhtmls[k], pos), lineas[ini][1]
    return None


def viuda_de_capitulo(z: zipfile.ZipFile, doc, descartados: set):
    """Primer capítulo (xhtml del spine, sin el índice) de dos o más páginas cuya última página trae
    una sola línea de texto (una palabra suelta de un párrafo largo, p. ej.), o None. Cada capítulo
    parte en página nueva, así que esa línea deja una hoja casi en blanco."""
    base, xhtmls = spine(z)
    por_capitulo = {}
    for i in range(doc.page_count):
        por_capitulo.setdefault(doc.location_from_page_number(i)[0], []).append(i)
    for k, paginas in sorted(por_capitulo.items()):
        if len(paginas) < 2 or xhtmls[k] in descartados or xhtmls[k].endswith("nav.xhtml"):
            continue
        pag = doc[paginas[-1]]
        lineas = [l for b in pag.get_text("dict")["blocks"] for l in b.get("lines", [])
                  if "".join(s["text"] for s in l["spans"]).strip()]
        if len(lineas) <= 1 and not pag.get_images():
            return xhtmls[k]
    return None


def entradas_del_indice(z: zipfile.ZipFile, doc) -> list:
    """Entradas del índice en orden: [página, destino, punto, rect de su primera línea, partida],
    donde partida dice si sigue en la página siguiente."""
    entradas = []
    for i in paginas_del_indice(z, doc):
        enlaces = sorted((l for l in doc[i].get_links() if l["kind"] == fitz.LINK_GOTO and l.get("page", -1) >= 0),
                         key=lambda l: l["from"].y0)
        propias = []
        for l in enlaces:
            punto = round(l["to"].y) if l.get("to") is not None else None
            if propias and propias[-1][1:3] == [l["page"], punto] and l["from"].y0 - propias[-1][5] < 0.45 * LETRA:
                propias[-1][5] = l["from"].y1
            else:
                propias.append([i, l["page"], punto, l["from"], False, l["from"].y1])
        if entradas and propias and entradas[-1][0] == i - 1 and entradas[-1][1:3] == propias[0][1:3]:
            entradas[-1][4] = True
            propias.pop(0)
        entradas += propias
    return entradas


def indice_huerfano(z: zipfile.ZipFile, doc, desde: int = 0):
    """Primera entrada del índice partida entre dos páginas (el rótulo «Segunda parte» al pie y su
    título arriba de la siguiente) o parte con capítulos que queda última de su página. (página,
    (nav, posición de su <li>), y de su primera línea), o None."""
    base, xhtmls = spine(z)
    nav = next((n for n in xhtmls if n.endswith("nav.xhtml")), None)
    if not nav:
        return None
    xhtml = z.read(nav).decode("utf-8")
    lis = [(m.start(), m.group(1)) for m in re.finditer(r'<li class="([^"]*)"', xhtml)]
    entradas = entradas_del_indice(z, doc)
    if len(entradas) != len(lis):
        return None  # no calzan una a una: mejor no mover nada
    paginas = {e[0] for e in entradas}
    for n, (pag, _, _, r, partida, _) in enumerate(entradas):
        ultima = n + 1 == len(entradas) or entradas[n + 1][0] != pag
        con_hijas = "parte" in lis[n][1].split() and n + 1 < len(lis) and "seccion" not in lis[n + 1][1] \
            and xhtml.find("<ol>", lis[n][0], lis[n + 1][0]) != -1
        primera = n == 0 or entradas[n - 1][0] != pag
        if pag >= desde and (partida or (ultima and con_hijas and pag + 1 in paginas)) and not primera:
            return pag, (nav, lis[n][0]), r.y0
    return None


def maquetar(epub: Path, hoja: tuple):
    """Diagrama el EPUB y arregla, de a uno y en orden de página (cada arreglo corre lo que viene
    después), dos defectos de MuPDF: el dibujo que achicaría por no caber en lo que queda de la
    página y el título que dejaría solo al pie (en el texto o en el índice). En los dos casos un
    bloque vacío completa la página y el dibujo o el título parte en la siguiente."""
    ancho, alto = hoja[0] * MM, hoja[1] * MM
    pie = alto - 2 * LETRA
    z = zipfile.ZipFile(epub)
    dibujos = dibujos_con_ancho(z)
    titulos = titulos_del_libro(z)
    relleno, no_caben, titulos_movidos = {}, set(), set()
    apretados, sin_remedio = {}, set()
    doc = fitz.open(str(epub))
    doc.layout(width=ancho, height=alto, fontsize=LETRA)
    desde = 0
    for _ in range(500):
        problemas = []
        pendientes = [a for a in achicados(doc, dibujos) if a[0] not in no_caben] if dibujos else []
        if pendientes:
            i, pag, r = pendientes[0]
            nombre, pos = dibujos[i][:2]
            clave = (nombre, z.read(nombre).decode("utf-8").rindex("<figure", 0, pos))
            arriba = [b[3] for b in doc[pag].get_text("blocks") if b[6] == 0 and b[3] <= r.y0 + 1]
            if not arriba or relleno.get(clave, (0,))[0] > alto / 2:
                no_caben.add(i)  # parte arriba de la página y aun así se achica: es más alto que ella
                continue
            problemas.append((pag, clave, "div", pie - max(arriba)))
        for buscar, etiqueta in ((indice_huerfano, "li"), (lambda z, d, s: titulos_huerfanos(z, d, titulos, s), "div")):
            h = buscar(z, doc, desde)
            if h and relleno.get(h[1], (0,))[0] > alto / 2:
                desde = h[0] + 1  # ni con media página de relleno se mueve: se deja como está
                h = None
            if h:
                problemas.append((h[0], h[1], etiqueta, pie - h[2] + 2))
        if not problemas:
            viuda = viuda_de_capitulo(z, doc, sin_remedio)
            if viuda is None:
                break
            # MuPDF no tiene control de viudas: se aprieta el interlineado de ese capítulo, de a 1 %, hasta que la línea suba
            f = round(apretados.get(viuda, 1.0) - 0.01, 2)
            if f < 0.90:
                sin_remedio.add(viuda)  # ni con 10 % menos de interlineado sube: se deja como está
                continue
            apretados[viuda] = f
            doc = fitz.open(stream=con_relleno(z, relleno, apretados), filetype="epub")
            doc.layout(width=ancho, height=alto, fontsize=LETRA)
            continue
        pag, clave, etiqueta, inicial = min(problemas, key=lambda p: p[0])
        desde = max(desde, pag)
        if problemas.index(min(problemas, key=lambda p: p[0])) > 0 or not pendientes:
            titulos_movidos.add(clave)
        # la primera vez, lo que queda hasta el margen inferior; si no alcanza, de a poco más
        relleno[clave] = (relleno[clave][0] + 3 if clave in relleno else inicial, etiqueta)
        doc = fitz.open(stream=con_relleno(z, relleno, apretados), filetype="epub")
        doc.layout(width=ancho, height=alto, fontsize=LETRA)
    if apretados:
        print(f"{epub.name}: {len(apretados)} capítulos con interlineado apretado para que no quede una línea sola en la última página"
              + (f" (sin remedio: {len(sin_remedio)})" if sin_remedio else ""))
    n_dib = len(relleno) - len(titulos_movidos)
    if n_dib:
        print(f"{epub.name}: {n_dib} dibujos pasan a la página siguiente para no achicarse")
    if titulos_movidos:
        print(f"{epub.name}: {len(titulos_movidos)} títulos pasan a la página siguiente para no quedar solos al pie")
    if no_caben:
        print(f"{epub.name}: siguen achicados (no caben en una página): "
              + ", ".join(str(i + 1) for i in sorted(no_caben)))
    return doc


def convertir(epub: Path, hoja: tuple | None = None) -> Path:
    arreglar(epub)
    doc = maquetar(epub, hoja or HOJAS.get(epub.stem, A5))
    pdf = fitz.open("pdf", doc.convert_to_pdf())
    paginas_de_imagen(zipfile.ZipFile(epub), doc, pdf)
    rehacer_enlaces(doc, pdf)
    numerar_indice(zipfile.ZipFile(epub), doc, pdf)
    meta = doc.metadata or {}
    pdf.set_metadata({"title": meta.get("title", ""), "author": meta.get("author", ""),
                      "subject": "Proyecto Fénix", "creator": "Proyecto Fénix"})
    salida = epub.with_suffix(".pdf")
    pdf.save(str(salida), garbage=4, deflate=True)
    print(f"{salida.name}: {pdf.page_count} páginas, {salida.stat().st_size // 1024} KB")
    return salida


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("epubs", nargs="+", type=Path)
    ap.add_argument("--hoja", help="ancho x alto en mm, p. ej. 104x174 (por defecto, HOJAS o A5)")
    args = ap.parse_args()
    hoja = tuple(float(x) for x in args.hoja.lower().split("x")) if args.hoja else None
    for a in args.epubs:
        convertir(a, hoja)
