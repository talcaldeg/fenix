"""Íconos y pantalla de inicio del APK a partir de los íconos del sitio (img/icono-*.png).

Se corre a mano solo si cambia el ícono de Fénix; deja los PNG en app/android/app/src/main/res.
    python app/iconos.py
"""
from pathlib import Path

from PIL import Image, ImageDraw

RAIZ = Path(__file__).resolve().parent.parent
RES = RAIZ / "app" / "android" / "app" / "src" / "main" / "res"
MASK = Image.open(RAIZ / "img" / "icono-maskable-512.png").convert("RGBA")
FONDO_SPLASH = (0x16, 0x11, 0x0F, 255)

# Densidades de Android: ícono de 48 dp y capa del ícono adaptable de 108 dp.
DENSIDADES = {"mdpi": 1, "hdpi": 1.5, "xhdpi": 2, "xxhdpi": 3, "xxxhdpi": 4}


def color_fondo():
    return MASK.getpixel((4, 4))


def iconos():
    fondo = color_fondo()
    for nombre, f in DENSIDADES.items():
        d = RES / f"mipmap-{nombre}"
        lado = round(48 * f)
        cuadrado = MASK.resize((lado, lado), Image.LANCZOS)
        cuadrado.save(d / "ic_launcher.png")
        # Redondo: el mismo, recortado en círculo.
        circ = Image.new("L", (lado * 4, lado * 4), 0)
        ImageDraw.Draw(circ).ellipse((0, 0, lado * 4 - 1, lado * 4 - 1), fill=255)
        redondo = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
        redondo.paste(cuadrado, (0, 0), circ.resize((lado, lado), Image.LANCZOS))
        redondo.save(d / "ic_launcher_round.png")
        # Capa del ícono adaptable: 108 dp, de los que se ven ~72 dp; la zona segura del maskable (80 %)
        # cabe en esos 72 dp si el maskable ocupa 90 dp.
        capa = round(108 * f)
        fg = Image.new("RGBA", (capa, capa), fondo)
        interior = round(90 * f)
        fg.paste(MASK.resize((interior, interior), Image.LANCZOS), ((capa - interior) // 2,) * 2)
        fg.save(d / "ic_launcher_foreground.png")
    (RES / "values" / "ic_launcher_background.xml").write_text(
        '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n'
        f'    <color name="ic_launcher_background">#{fondo[0]:02X}{fondo[1]:02X}{fondo[2]:02X}</color>\n'
        "</resources>\n", encoding="utf-8")


def splash():
    for png in RES.glob("drawable*/splash.png"):
        w, h = Image.open(png).size
        im = Image.new("RGBA", (w, h), FONDO_SPLASH)
        lado = round(min(w, h) * 0.28)
        im.paste(MASK.resize((lado, lado), Image.LANCZOS), ((w - lado) // 2, (h - lado) // 2))
        im.convert("RGB").save(png)


if __name__ == "__main__":
    iconos()
    splash()
    print("Íconos y splash listos en", RES)
