# -*- coding: utf-8 -*-
"""Envía a Fénix el paquete de un encuadernador, sin subirlo a ningún lado.

    python herramientas/entregar.py entrega/<id>.zip --acepto-licencia
        [--nombre "..."] [--correo "..."] [--agente "Claude Code"] [--comentario "..."]

Nombre y correo son opcionales: se puede entregar sin identificarse (el correo solo sirve para
avisar cuando el libro esté publicado).

Manda el .zip adjunto, con los datos del formulario de #encuadernadores, por el mismo servicio de
formularios del sitio (FormSubmit, destino en `contacto.formularios` de datos.js). Llega como
correo a Tomás. Solo biblioteca estándar.

Si el .zip pasa del límite del servicio o el envío falla, imprime la alternativa: mandarlo por
correo a talcaldeg@gmail.com o subirlo a Drive y enviar el enlace en el formulario.
"""
import argparse
import json
import re
import sys
import urllib.request
import uuid
import zipfile
from pathlib import Path

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


def plan_b(motivo: str):
    sys.exit(f"""{motivo}

No se envió. Dos formas de entregarlo:
1. Por correo: adjunta el .zip en un correo a {CORREO} (asunto «Fénix - encuadernador»), con tu
   nombre, el libro y si quieres aparecer en él. Gmail acepta hasta 25 MB.
2. Si pesa más: súbelo a Google Drive, Dropbox o WeTransfer, con enlace que cualquiera pueda
   abrir, y manda el enlace en {SITIO}#encuadernadores (opción «Entrego el libro terminado»).""")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("zip", type=Path)
    p.add_argument("--nombre", default="", help="opcional")
    p.add_argument("--correo", default="", help="opcional: para avisarle cuando esté publicado")
    p.add_argument("--agente", default="")
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
    mb = a.zip.stat().st_size / 1e6
    if mb > LIMITE_MB:
        plan_b(f"El .zip pesa {mb:.1f} MB y el envío directo acepta hasta {LIMITE_MB} MB "
               "(lo más pesado suele ser cuadro.jpg: bájalo a 1.600 px de ancho y vuelve a comprimir).")
    libro = f"{f.get('titulo', '')} - {f.get('autor', '')}"
    campos = {
        "_subject": f"Fénix - encuadernador: entrega de {f.get('titulo') or a.zip.stem}",
        "_captcha": "false",
        "_template": "table",
        "nombre": a.nombre or "(anónimo)",
        "email": a.correo,
        "tipo": "Entrego el libro terminado (enviado por su agente)",
        "libro": libro,
        "id": f.get("id", ""),
        "agente": a.agente,
        "credito": f.get("credito") or "No, prefiere que no aparezca",
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
        plan_b(f"El servicio de envío respondió con un error ({e}).")
    if "submitted successfully" not in html:
        plan_b("El servicio de envío no confirmó la recepción.")
    aviso = f"Tomás avisará a {a.correo} cuando esté publicado." if a.correo else "Sin correo, no habrá aviso: el libro aparecerá en el sitio."
    print(f"Enviado: {libro} ({mb:.1f} MB) a Proyecto Fénix. {aviso}")


if __name__ == "__main__":
    main()
