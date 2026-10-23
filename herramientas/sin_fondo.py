# -*- coding: utf-8 -*-
"""Quita el papel de fondo a dibujos escaneados (los de El principito): PNG con transparencia.

    python herramientas/sin_fondo.py editorial/<id>/dibujos/hd/*.png

- dibujos/hd/ guarda la fuente de cada dibujo (opaca, 1400 px): el recorte del escaneo de 600 ppi
  de la edición de Gallimard de 1984 en Internet Archive
  (archive.org/details/SaintExupryAntoineDeLePetitPrinceGallimard1984), con la trama del offset
  suavizada (desenfoque gaussiano de 1,3 px a 600 ppi) y el lápiz azul de su antiguo dueño quitado.
  Cada una deja su PNG sin fondo en dibujos/, que es lo que cita el .md. Los .jpg de dibujos/ son
  los escaneos de la primera versión.
- El papel no es parejo (amarillea, tiene manchas): se estima por zonas como el tono más claro de
  la vecindad y se divide por él, así el papel queda blanco sin aclarar la tinta.
- Después, «color a alfa» contra blanco (como en GIMP): cada píxel queda con la menor opacidad que,
  sobre blanco, da su mismo color. Sobre la página blanca del PDF se ve igual; sobre el fondo sepia
  u oscuro de un lector ya no aparece el rectángulo.
- Para el EPUB se guarda a 1000 px, con paleta de 128 colores y el grano casi transparente
  (alfa < 24) vuelto transparente del todo: los 47 dibujos pesan unos 3,6 MB, no 60.
"""
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageFilter

ALFA_CERO, ALFA_PLENO = 0.06, 0.16  # bajo 0.06 es papel (grano, JPEG); desde 0.16, tinta tal cual
LADO_MAX = 1400  # px del lado mayor con que se estima el papel
LADO_PNG, COLORES, ALFA_GRANO = 1000, 128, 24  # lo que se guarda: sobra para un lector y el A5


def papel(im: Image.Image) -> np.ndarray:
    # Máximo de la vecindad con cv2.dilate: el MaxFilter de PIL tardaba minutos en 1400 px.
    lado = max(31, (min(im.size) // 8) | 1)
    k = min(lado, 61)
    claro = cv2.dilate(np.asarray(im), np.ones((k, k), np.uint8))
    claro = Image.fromarray(claro).filter(ImageFilter.GaussianBlur(lado))
    return np.maximum(np.asarray(claro, float) / 255, 0.5)


def sin_fondo(im: Image.Image) -> Image.Image:
    im = im.convert("RGB")
    if max(im.size) > LADO_MAX:
        im.thumbnail((LADO_MAX, LADO_MAX), Image.LANCZOS)
    n = np.clip(np.asarray(im, float) / 255 / papel(im), 0, 1)
    alfa = (1 - n).max(axis=2)
    seguro = np.maximum(alfa, 1e-6)[..., None]
    # El color se saca con el alfa exacto, así la tinta sobre blanco queda idéntica al original;
    # solo el velo del papel (alfa bajo) se apaga en rampa, sin tocar los trazos.
    color = np.clip(1 - (1 - n) / seguro, 0, 1)
    rampa = np.clip((alfa - ALFA_CERO) / (ALFA_PLENO - ALFA_CERO), 0, 1)
    rgba = np.dstack([color, alfa * rampa]) * 255
    return Image.fromarray(rgba.round().astype(np.uint8), "RGBA")


def comprimir(im: Image.Image) -> Image.Image:
    im = im.copy()
    im.thumbnail((LADO_PNG, LADO_PNG), Image.LANCZOS)
    im.putalpha(im.getchannel("A").point(lambda v: 0 if v < ALFA_GRANO else v))
    return im.quantize(colors=COLORES, method=Image.Quantize.FASTOCTREE)


if __name__ == "__main__":
    for a in sys.argv[1:]:
        r = Path(a)
        # Una fuente en dibujos/hd/ deja su PNG en dibujos/; un x.jpg suelto, su x.png al lado.
        destino = (r.parent.parent if r.parent.name == "hd" else r.parent) / f"{r.stem}.png"
        comprimir(sin_fondo(Image.open(r))).save(destino, optimize=True)
        print(destino.name, f"{destino.stat().st_size // 1024} KB")
