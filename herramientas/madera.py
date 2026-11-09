"""Textura de nogal para la cabecera, las repisas y el pie (img/madera/nogal.webp).

Por qué: la veta de 9-nov-2026 era ruido de feTurbulence estirado, que se lee como manchas borrosas
y no como madera («la madera está medio falsa», Tomás, 9-nov-2026). Esto dibuja una tabla de nogal
cortada a lo largo: anillos de crecimiento ondulados (madera tardía oscura y temprana clara, con
espaciado que varía), poros alargados en el sentido de la veta, cambios suaves de tono a lo largo de
la tabla y una franja de figura más ancha. El ruido sale de filtrar ruido blanco en frecuencia, así
que la textura empalma sola por los cuatro lados (sin costura al repetirse).

Uso: python herramientas/madera.py            (escribe img/madera/nogal.webp)
     python herramientas/madera.py --ver <png> (además, una muestra a tamaño real)
"""
import argparse
import os

import numpy as np
from PIL import Image

ANCHO, ALTO = 2400, 400   # se muestra a la mitad (1200x200 CSS px): nítida en pantallas 2x y sin repetirse
                          # a la vista en una cabecera de notebook
SEMILLA = 1862


def ruido(rng, fx, fy):
    """Ruido periódico suave: ruido blanco filtrado con una gaussiana anisótropa (fx, fy en ciclos por imagen)."""
    b = rng.standard_normal((ALTO, ANCHO))
    f = np.fft.fft2(b)
    ky = np.fft.fftfreq(ALTO) * ALTO
    kx = np.fft.fftfreq(ANCHO) * ANCHO
    kx, ky = np.meshgrid(kx, ky)
    f *= np.exp(-((kx / fx) ** 2 + (ky / fy) ** 2))
    r = np.real(np.fft.ifft2(f))
    return (r - r.mean()) / (r.std() + 1e-9)


def nogal():
    rng = np.random.default_rng(SEMILLA)
    y, x = np.mgrid[0:ALTO, 0:ANCHO].astype(float)
    # Ondulación de la veta: lenta a lo largo (x) y algo más viva de través (y).
    # Sin ruido fino en la ondulación: con él, los anillos salían como curvas de nivel de un mapa.
    # Casi sin variación de través (fy bajo): si la onda cambia mucho en y, los anillos se doblan en
    # óvalos y U, que parecen nudos de dibujo animado y no veta de tabla.
    onda = 26 * ruido(rng, 2.5, 0.5) + 4 * ruido(rng, 8, 1.5) + 1.2 * ruido(rng, 25, 4)
    # Anillos: espaciado de ~17 px (8 px en pantalla) que se abre y se cierra a lo largo de la tabla.
    espaciado = 17 * (1 + 0.30 * ruido(rng, 2, 1.5))
    t = (y + onda) / espaciado
    fase = t - np.floor(t)
    # Cada anillo con su intensidad (años buenos y malos): unos se marcan, otros casi no.
    n = np.floor(t)
    fuerza = 0.35 + 0.65 * (np.sin(n * 12.9898) * 43758.5453 % 1)
    # Madera temprana clara que oscurece de a poco y un borde tardío fino.
    anillo = (np.clip((fase - 0.60) / 0.36, 0, 1) ** 2 * 0.6 + 0.7 * np.exp(-((fase - 0.965) / 0.03) ** 2)) * fuerza
    # La tabla repite la textura cada ALTO px: los anillos tienen que cerrar justo en el borde.
    # Como espaciado varía, t no es periódico en y; se mezcla con su copia corrida para que empalme.
    borde = np.clip(np.minimum(y, ALTO - 1 - y) / 40, 0, 1)
    anillo = anillo * borde + np.roll(anillo, ALTO // 2, axis=0) * (1 - borde)
    # Poros: rayitas oscuras finas y largas en el sentido de la veta.
    poros = ruido(rng, 45, 300)
    poros = np.clip((poros - 1.4) / 1.2, 0, 1) * 0.45
    # Tono de la tabla: zonas más claras y más oscuras, y fibra fina.
    tono = 0.08 * ruido(rng, 2, 1.5) + 0.05 * ruido(rng, 6, 110) + 0.03 * ruido(rng, 120, 300)
    lum = 1 - 0.42 * np.clip(anillo, 0, 1.2) - poros + tono
    # Color: nogal (de la madera temprana a la tardía).
    claro = np.array([128, 86, 54], float)
    oscuro = np.array([52, 30, 17], float)
    k = np.clip(lum, 0, 1.1)[..., None]
    rgb = oscuro + (claro - oscuro) * k
    return Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB")


def main():
    a = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    a.add_argument("--ver")
    args = a.parse_args()
    raiz = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    destino = os.path.join(raiz, "img", "madera", "nogal.webp")
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    im = nogal()
    im.save(destino, "WEBP", quality=78, method=6)
    print(f"{destino}: {os.path.getsize(destino) // 1024} kB")
    if args.ver:
        # Dos repeticiones por lado: si hay costura, se ve en la cruz del medio.
        m = Image.new("RGB", (ANCHO * 2, ALTO * 2))
        for i in range(2):
            for j in range(2):
                m.paste(im, (i * ANCHO, j * ALTO))
        m.resize((ANCHO, ALTO)).save(args.ver)


if __name__ == "__main__":
    main()
