# -*- coding: utf-8 -*-
"""Envía a Fénix el paquete de un encuadernador, sin subirlo a ningún lado.

    python herramientas/entregar.py entrega/<id>.zip --acepto-licencia [--correo "..."] [--comentario "..."]

El libro, el crédito y el agente van en ficha.json e INFORME.md; el correo es opcional y solo
sirve para avisar cuando el libro esté publicado.

Manda el .zip adjunto, con los datos del formulario de #encuadernadores, por el mismo servicio de
formularios del sitio (FormSubmit, destino en `contacto.formularios` de datos.js). Llega como
correo a Tomás. Solo biblioteca estándar.

Antes de enviar deja ACEPTACION.txt dentro del .zip. Si el .zip pasa del límite del servicio o el
envío falla (hay agentes con la red cerrada a formsubmit.co), abre un correo ya dirigido y la
carpeta del .zip, e imprime el único paso que le queda al usuario: adjuntarlo y enviarlo.
"""
import argparse
import json
import re
import subprocess
import sys
import urllib.request
import uuid
import webbrowser
import zipfile
from datetime import date
from pathlib import Path
from urllib.parse import quote

RAIZ = Path(__file__).resolve().parent.parent
CORREO = "talcaldeg@gmail.com"
SITIO = "https://talcaldeg.github.io/fenix/"
LIMITE_MB = 6  # FormSubmit rechaza adjuntos más grandes (probado el 24-oct-2026: 6,5 MB llega, 8 MB da error 500)


def destino() -> str:
    """El endpoint de los formularios del sitio, en su forma que acepta adjuntos (sin /ajax/)."""
    try:
        m = re.search(r'formularios:\s*"([^"]+)"', (RAIZ / "datos.js").read_text(encoding="utf-8"))
        if m:
            return m.group(1).replace("/ajax/", "/")
    except OSError:
        pass
    return f"https://formsubmit.co/{CORREO}"


def leer_ficha(zip_: Path) -> dict:
    with zipfile.ZipFile(zip_) as z:
        fichas = [n for n in z.namelist() if n.endswith("ficha.json") and n.count("/") <= 1]
        if not fichas:
            sys.exit("El .zip no trae ficha.json: arma el paquete como dice ENCUADERNAR.md (paso 6).")
        return json.loads(z.read(fichas[0]).decode("utf-8"))


def multipart(campos: dict, archivo: Path):
    borde = uuid.uuid4().hex
    partes = []
    for k, v in campos.items():
        partes.append(f'--{borde}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode("utf-8"))
    partes.append((f'--{borde}\r\nContent-Disposition: form-data; name="attachment"; filename="{archivo.name}"\r\n'
                   "Content-Type: application/zip\r\n\r\n").encode("utf-8") + archivo.read_bytes() + b"\r\n")
    partes.append(f"--{borde}--\r\n".encode("utf-8"))
    return b"".join(partes), f"multipart/form-data; boundary={borde}"


def anotar_aceptacion(zip_: Path, correo: str):
    """Deja la aceptación de la licencia dentro del .zip, así el correo del plan B no necesita texto."""
    with zipfile.ZipFile(zip_) as z:
        if "ACEPTACION.txt" in z.namelist():
            return
    with zipfile.ZipFile(zip_, "a") as z:
        z.writestr("ACEPTACION.txt", f"Acepto que Proyecto Fénix publique esta edición gratis con licencia "
                   f"CC BY-NC-SA 4.0 ({date.today().isoformat()}).\nCorreo para avisar: {correo or 'ninguno'}\n")


def abrir_correo(zip_: Path, asunto: str):
    """Plan B lo más corto posible para el usuario: deja abiertos un correo ya dirigido y la carpeta
    del .zip, para que solo lo arrastre y envíe. Si el entorno no tiene ventanas, no pasa nada."""
    try:
        webbrowser.open(f"mailto:{CORREO}?subject={quote(asunto)}")
        if sys.platform.startswith("win"):
            subprocess.Popen(["explorer", "/select,", str(zip_.resolve())])
        else:
            subprocess.Popen(["open" if sys.platform == "darwin" else "xdg-open", str(zip_.resolve().parent)])
    except Exception:  # noqa: BLE001 - abrir ventanas es una ayuda, no un requisito
        pass


def plan_b(motivo: str, zip_: Path, asunto: str):
    abrir_correo(zip_, asunto)
    sys.exit(f"""{motivo}

No se envió, pero queda a un paso para tu usuario (la licencia ya va aceptada dentro del .zip):
dile en un solo mensaje corto que adjunte {zip_.resolve()} en un correo a {CORREO} con asunto
«{asunto}» y lo envíe, sin escribir nada más (intenté dejarle abiertos el correo y la carpeta).
Gmail acepta hasta 25 MB; si pesa más, que lo suba a Google Drive con enlace abierto y lo mande
en {SITIO}#encuadernadores. No intentes otros servicios de envío.""")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("zip", type=Path)
    p.add_argument("--correo", default="", help="opcional: para avisarle cuando esté publicado")
    p.add_argument("--comentario", default="")
    p.add_argument("--acepto-licencia", action="store_true",
                   help="tu usuario acepta que Fénix publique la edición gratis con licencia CC BY-NC-SA 4.0")
    a = p.parse_args()
    if not a.acepto_licencia:
        sys.exit("Falta --acepto-licencia: pregúntale a tu usuario si acepta que Fénix publique esta edición "
                 "gratis y con licencia abierta (CC BY-NC-SA 4.0).")
    if not a.zip.is_file() or a.zip.suffix.lower() != ".zip":
        sys.exit(f"No encuentro el .zip: {a.zip}")
    f = leer_ficha(a.zip)
    anotar_aceptacion(a.zip, a.correo)
    asunto = f"Fénix - encuadernador: entrega de {f.get('titulo') or a.zip.stem}"
    mb = a.zip.stat().st_size / 1e6
    if mb > LIMITE_MB:
        plan_b(f"El .zip pesa {mb:.1f} MB y el envío directo acepta hasta {LIMITE_MB} MB "
               "(lo más pesado suele ser cuadro.jpg: bájalo a 1.600 px de ancho, vuelve a comprimir y "
               "a correr este script antes de pedirle nada a tu usuario).", a.zip, asunto)
    libro = f"{f.get('titulo', '')} - {f.get('autor', '')}"
    campos = {
        "_subject": asunto,
        "_captcha": "false",
        "_template": "table",
        "email": a.correo,
        "via": "enviado por su agente",
        "libro": libro,
        "id": f.get("id", ""),
        "credito": f.get("credito") or "sin nombre en el libro",
        "comentario": a.comentario,
        "licencia": "acepto",
    }
    cuerpo, tipo = multipart(campos, a.zip)
    req = urllib.request.Request(destino(), data=cuerpo, method="POST",
                                 headers={"Content-Type": tipo, "Referer": SITIO, "User-Agent": "Proyecto Fenix"})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            html = r.read().decode("utf-8", "replace")
    except Exception as e:  # noqa: BLE001 - cualquier falla de red o del servicio lleva al plan B
        plan_b(f"El servicio de envío respondió con un error ({e}).", a.zip, asunto)
    if "submitted successfully" not in html:
        plan_b("El servicio de envío no confirmó la recepción.", a.zip, asunto)
    aviso = f"Tomás avisará a {a.correo} cuando esté publicado." if a.correo else "Sin correo, no habrá aviso: el libro aparecerá en el sitio."
    print(f"Enviado: {libro} ({mb:.1f} MB) a Proyecto Fénix. {aviso}")


if __name__ == "__main__":
    main()
