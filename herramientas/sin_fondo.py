# -*- coding: utf-8 -*-
"""Quita el papel de fondo a dibujos escaneados (los de El principito): PNG con transparencia.

    python herramientas/sin_fondo.py editorial/<id>/dibujos/*.jpg

- Cada x.jpg deja un x.png al lado; el .md tiene que apuntar al .png. El .jpg queda como original.
- El papel no es parejo (amarillea, tiene manchas): se estima por zonas como el tono más claro de
  la vecindad y se divide por él, así el papel queda blanco sin aclarar la tinta.
- Después, «color a alfa» contra blanco (como en GIMP): cada píxel queda con la menor opacidad que,
  sobre blanco, da su mismo color. Sobre la página blanca del PDF se ve igual; sobre el fondo sepia
  u oscuro de un lector ya no aparece el rectángulo.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

UMBRAL = 0.90  # lo normalizado más claro que esto es papel (grano, JPEG)
ALFA_MIN = 0.08


def papel(im: Image.Image) -> np.ndarray:
    lado = max(31, (min(im.size) // 8) | 1)
    claro = im.filter(ImageFilter.MaxFilter(min(lado, 61)))
    claro = claro.filter(ImageFilter.GaussianBlur(lado))
    return np.maximum(np.asarray(claro, float) / 255, 0.5)


def sin_fondo(im: Image.Image) -> Image.Image:
    im = im.convert("RGB")
    n = np.clip(np.asarray(im, float) / 255 / papel(im) / UMBRAL, 0, 1)
    alfa = (1 - n).max(axis=2)
    alfa = np.where(alfa < ALFA_MIN, 0, alfa)
    seguro = np.maximum(alfa, 1e-6)[..., None]
    color = np.clip(1 - (1 - n) / seguro, 0, 1)
    rgba = np.dstack([color, alfa]) * 255
    # 256 colores con alfa: un tercio del peso del PNG completo y no se nota en acuarela.
    return Image.fromarray(rgba.round().astype(np.uint8), "RGBA").quantize(256, method=Image.Quantize.FASTOCTREE)


if __name__ == "__main__":
    for a in sys.argv[1:]:
        r = Path(a)
        sin_fondo(Image.open(r)).save(r.with_suffix(".png"), optimize=True)
        print(f"{r.with_suffix('.png').name}")
