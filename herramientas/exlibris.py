# -*- coding: utf-8 -*-
"""Exlibris de Fénix: un timbre de goma estampado sobre papel, como segunda página de cada EPUB.

    python herramientas/exlibris.py libros/*.epub
    python herramientas/exlibris.py --imagenes          (solo rehace img/exlibris-es.jpg y -en.jpg)

- La página va justo después de la portada (primer ítem del spine). El idioma sale de
  `dc:language` del EPUB: «Biblioteca gratuita» o «Free library» al pie.
- Idempotente: si el EPUB ya trae el exlibris, se reemplazan la imagen y su página.
- La página es una envoltura SVG, como la portada (portadas.pagina_portada): así Play Books la
  escala a pantalla completa; con <img> y max-height:100vh quedaba chica.
- Las imágenes salen con semilla fija, así que se rehacen iguales. Después se regenera el PDF con
  herramientas/epub_a_pdf.py.
"""
import io
import math
import re
import sys
import zipfile
from pathlib import Path

import fitz  # PyMuPDF
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parent))
import logo  # noqa: E402
from portadas import pagina_portada  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
FUENTES = Path("C:/Windows/Fonts")
TINTA = np.array([112, 24, 34], float)  # vino de timbre
PAPEL = np.array([243, 235, 218], float)
PIE = {"es": ["Biblioteca gratuita", "talcaldeg.github.io/fenix"],
       "en": ["Free library", "talcaldeg.github.io/fenix"]}
GIRO = {"es": -5, "en": 4}
IMAGEN = "fenix-exlibris.jpg"
PAGINA = "fenix-exlibris.xhtml"


def fuente(n, s):
    return ImageFont.truetype(str(FUENTES / n), s)


def ruido(rng, w, h, escala):
    p = Image.fromarray((rng.random((max(2, h // escala), max(2, w // escala))) * 255).astype(np.uint8))
    return np.asarray(p.resize((w, h), Image.BICUBIC), float) / 255


def ave(lado):
    """El logo (herramientas/logo.py) como máscara: tinta = blanco, cortes de las plumas vacíos."""
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">{logo.marca("#000", "#fff")}</svg>'
    pm = fitz.open(stream=svg.encode(), filetype="svg")[0].get_pixmap(matrix=fitz.Matrix(lado / 64, lado / 64), alpha=True)
    im = Image.open(io.BytesIO(pm.tobytes("png"))).convert("RGBA")
    fondo = Image.new("RGBA", im.size, (255, 255, 255, 255))
    fondo.alpha_composite(im)
    return fondo.convert("L").point(lambda v: 255 - v)


def arco(m, cx, cy, r, texto, f, arriba, espacio):
    """Texto sobre el círculo: arriba se lee en sentido horario, abajo en antihorario."""
    d = ImageDraw.Draw(m)
    anchos = [d.textlength(c, font=f) + espacio for c in texto]
    th = (-math.pi / 2 - sum(anchos) / r / 2) if arriba else (math.pi / 2 + sum(anchos) / r / 2)
    for c, a in zip(texto, anchos):
        th += a / r / 2 if arriba else -a / r / 2
        lado = int(f.size * 1.6)
        ch = Image.new("L", (lado, lado), 0)
        ImageDraw.Draw(ch).text((lado / 2, lado / 2), c, font=f, fill=255, anchor="mm")
        ch = ch.rotate(-(math.degrees(th) + (90 if arriba else -90)), resample=Image.BICUBIC)
        x, y = cx + r * math.cos(th), cy + r * math.sin(th)
        m.paste(255, (int(x - lado / 2), int(y - lado / 2)), ch)
        th += a / r / 2 if arriba else -a / r / 2


def sello():
    w = h = 1000
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    cx, cy, r1, r2 = w // 2, h // 2, 430, 300
    d.ellipse((cx - r1, cy - r1, cx + r1, cy + r1), outline=255, width=16)
    d.ellipse((cx - r1 + 30, cy - r1 + 30, cx + r1 - 30, cy + r1 - 30), outline=255, width=5)
    d.ellipse((cx - r2, cy - r2, cx + r2, cy + r2), outline=255, width=5)
    f = fuente("georgiab.ttf", 74)
    arco(m, cx, cy, 352, "EX LIBRIS", f, True, 14)
    arco(m, cx, cy, 352, "PROYECTO FÉNIX", f, False, 8)
    for ang in (0, math.pi):
        x, y, s = cx + 352 * math.cos(ang), cy + 352 * math.sin(ang), 14
        d.polygon([(x, y - s), (x + s, y), (x, y + s), (x - s, y)], fill=255)
    m.paste(255, (cx - 200, cy - 202), ave(400))
    return m


def entintar(rng, m, giro):
    """Imperfecciones de goma: borde irregular, vacíos y más tinta de un lado."""
    m = m.rotate(giro, resample=Image.BICUBIC, expand=True)
    w, h = m.size
    a = np.asarray(m.filter(ImageFilter.GaussianBlur(2.2)), float) / 255
    borde = ruido(rng, w, h, 3) * 0.5 + ruido(rng, w, h, 9) * 0.5
    a = np.clip((a - (0.32 + 0.3 * (borde - 0.5))) * 6, 0, 1)
    presion = ruido(rng, w, h, 140) * 0.6 + ruido(rng, w, h, 40) * 0.4
    gradiente = np.linspace(1.0, 0.72, w)[None, :] * np.linspace(0.95, 1.0, h)[:, None]
    vacios = (ruido(rng, w, h, 4) * 0.55 + ruido(rng, w, h, 15) * 0.45) < (0.20 + 0.18 * (1 - presion) * (1 - gradiente))
    a = a * np.where(vacios, 0.3, 1.0) * (0.62 + 0.33 * presion) * gradiente
    return np.clip(a, 0, 1)


def papel(rng, w, h):
    base = np.ones((h, w, 3)) * PAPEL
    mancha = (ruido(rng, w, h, 220) - 0.5) * 9 + (ruido(rng, w, h, 60) - 0.5) * 4
    grano = (rng.random((h, w)) - 0.5) * 9
    yy, xx = np.mgrid[0:h, 0:w]
    vin = ((xx / w - 0.5) ** 2 + (yy / h - 0.5) ** 2) * 38
    return np.clip(base + (mancha + grano - vin)[..., None] * np.array([1.0, 1.0, 1.15]), 0, 255)


def imagen(idioma):
    rng = np.random.default_rng(7 if idioma == "es" else 11)
    w, h = 1200, 1800
    pg = papel(rng, w, h)
    a = entintar(rng, sello(), GIRO[idioma])
    lado = int(a.shape[0] * 0.74)
    a = np.asarray(Image.fromarray((a * 255).astype(np.uint8)).resize((lado, lado), Image.LANCZOS), float) / 255
    x, y = (w - lado) // 2 + 18, 380
    zona = pg[y:y + lado, x:x + lado]
    pg[y:y + lado, x:x + lado] = zona * (1 - a[..., None]) + (zona * TINTA / 255) * a[..., None]
    im = Image.fromarray(pg.astype(np.uint8))
    d = ImageDraw.Draw(im)
    for i, linea in enumerate(PIE[idioma]):
        d.text((w / 2, h - 170 + i * 44), linea, font=fuente("georgia.ttf", 30), fill=(120, 104, 90), anchor="mm")
    return im


def imagenes():
    rutas = {}
    for idioma in ("es", "en"):
        ruta = RAIZ / "img" / f"exlibris-{idioma}.jpg"
        imagen(idioma).save(ruta, "JPEG", quality=85, optimize=True, progressive=True)
        rutas[idioma] = ruta
    return rutas


def poner(epub: Path, rutas):
    z = zipfile.ZipFile(epub)
    archivos = {i.filename: z.read(i.filename) for i in z.infolist()}
    z.close()
    opf_ruta = re.search(r'full-path="([^"]+)"', archivos["META-INF/container.xml"].decode("utf-8")).group(1)
    base = opf_ruta.rsplit("/", 1)[0] + "/" if "/" in opf_ruta else ""
    opf = archivos[opf_ruta].decode("utf-8")
    lang = re.search(r"<dc:language[^>]*>\s*([a-z]{2})", opf)
    idioma = "en" if lang and lang.group(1) == "en" else "es"
    archivos[base + IMAGEN] = rutas[idioma].read_bytes()
    # Se reescribe siempre, para que un EPUB con la página vieja (<img>) quede al día.
    archivos[base + PAGINA] = pagina_portada(Image.open(rutas[idioma]).convert("RGB"),
                                             "Ex libris Proyecto Fénix", IMAGEN, "frontmatter")
    if PAGINA not in opf:
        opf = opf.replace("</manifest>", f'<item href="{PAGINA}" id="fenix-exlibris-pag" media-type="application/xhtml+xml" properties="svg"/>\n'
                          f'  <item href="{IMAGEN}" id="fenix-exlibris" media-type="image/jpeg"/>\n  </manifest>', 1)
        # Justo después de la portada, que es el primer ítem del spine.
        opf = re.sub(r"(<spine[^>]*>\s*<itemref [^>]*/>)", r'\1\n    <itemref idref="fenix-exlibris-pag"/>', opf, count=1)
    opf = re.sub(r'(<item [^>]*id="fenix-exlibris-pag" media-type="application/xhtml\+xml")\s*/>',
                 r'\1 properties="svg"/>', opf)
    archivos[opf_ruta] = opf.encode("utf-8")
    with zipfile.ZipFile(epub, "w") as z:
        z.writestr(zipfile.ZipInfo("mimetype"), archivos.pop("mimetype"), compress_type=zipfile.ZIP_STORED)
        for nombre, datos in archivos.items():
            z.writestr(nombre, datos, compress_type=zipfile.ZIP_DEFLATED)
    print(f"{epub.name}: exlibris ({idioma})")


if __name__ == "__main__":
    rutas = imagenes()
    if "--imagenes" not in sys.argv:
        for a in sys.argv[1:]:
            poner(Path(a), rutas)
