"""Llave de firma del APK del Lector Fénix (app/, .github/workflows/apk.yml).

Android solo deja instalar una versión nueva encima de la vieja si viene firmada con la misma llave:
si se pierde, el APK instalado ya no se puede actualizar (hay que desinstalar y perder lo guardado).
Por eso vive en dos lados: como secreto de GitHub (LLAVE_APK_P12, LLAVE_APK_CLAVE), que es lo que usa
la compilación, y de respaldo en este PC, cifrada con DPAPI (solo este usuario de Windows la abre),
fuera de git, en Desktop\\Personal\\Claude\\fenix_llaves\\.

    python herramientas/llave_apk.py crear        # una sola vez: la crea, la respalda y la sube a GitHub
    python herramientas/llave_apk.py subir        # vuelve a subir el respaldo a GitHub (secretos borrados)
    python herramientas/llave_apk.py restaurar <carpeta>   # deja lector.p12 y clave.txt en <carpeta>
    python herramientas/llave_apk.py ver          # huella SHA-256 del certificado, sin mostrar la clave
"""
import base64
import ctypes
import ctypes.wintypes as wt
import json
import os
import secrets
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

REPO = "talcaldeg/fenix"
CARPETA = Path(os.path.expanduser("~")) / "Desktop" / "Personal" / "Claude" / "fenix_llaves"
RESPALDO = CARPETA / "lector-apk.dpapi"


class _Blob(ctypes.Structure):
    _fields_ = [("cbData", wt.DWORD), ("pbData", ctypes.POINTER(ctypes.c_char))]


def _dpapi(datos: bytes, cifrar: bool) -> bytes:
    crypt = ctypes.windll.crypt32
    entrada = _Blob(len(datos), ctypes.cast(ctypes.create_string_buffer(datos, len(datos)), ctypes.POINTER(ctypes.c_char)))
    salida = _Blob()
    fn = crypt.CryptProtectData if cifrar else crypt.CryptUnprotectData
    args = (ctypes.byref(entrada), "Lector Fenix APK" if cifrar else None, None, None, None, 0, ctypes.byref(salida))
    if not fn(*args):
        raise OSError("DPAPI no pudo " + ("cifrar" if cifrar else "descifrar") + " (¿otro usuario de Windows?)")
    try:
        return ctypes.string_at(salida.pbData, salida.cbData)
    finally:
        ctypes.windll.kernel32.LocalFree(salida.pbData)


# OPENSSL_CONF de este PC apunta a un openssl.cnf de PostgreSQL que no existe: se usa el de Git.
_ENV = {**os.environ, "OPENSSL_CONF": r"C:\Program Files\Git\mingw64\etc\ssl\openssl.cnf"}


def _openssl():
    o = shutil.which("openssl") or r"C:\Program Files\Git\mingw64\bin\openssl.exe"
    if not Path(o).exists():
        sys.exit("No encuentro openssl (viene con Git para Windows).")
    return o


def _leer():
    if not RESPALDO.exists():
        sys.exit(f"No hay respaldo en {RESPALDO}.")
    d = json.loads(_dpapi(RESPALDO.read_bytes(), False))
    return base64.b64decode(d["p12"]), d["clave"]


def _subir(p12: bytes, clave: str):
    for nombre, valor in (("LLAVE_APK_P12", base64.b64encode(p12).decode()), ("LLAVE_APK_CLAVE", clave)):
        subprocess.run(["gh", "secret", "set", nombre, "-R", REPO], input=valor.encode(), check=True)
    print(f"Secretos LLAVE_APK_P12 y LLAVE_APK_CLAVE subidos a {REPO}.")


def crear():
    if RESPALDO.exists():
        sys.exit(f"Ya existe {RESPALDO}: no se crea otra (con otra llave, el APK instalado ya no se actualiza).")
    clave = secrets.token_urlsafe(24)
    with tempfile.TemporaryDirectory() as t:
        k, c, p = (os.path.join(t, n) for n in ("k.pem", "c.pem", "lector.p12"))
        ossl = _openssl()
        # 30 años: Android no revisa el vencimiento al instalar, pero así ni se plantea.
        subprocess.run([ossl, "req", "-x509", "-newkey", "rsa:4096", "-sha256", "-days", "10950", "-nodes",
                        "-keyout", k, "-out", c, "-subj", "/CN=Proyecto Fenix/O=Proyecto Fenix/C=CL"],
                       check=True, capture_output=True, env=_ENV)
        subprocess.run([ossl, "pkcs12", "-export", "-inkey", k, "-in", c, "-name", "lector",
                        "-out", p, "-passout", "pass:" + clave], check=True, capture_output=True, env=_ENV)
        p12 = Path(p).read_bytes()
    CARPETA.mkdir(parents=True, exist_ok=True)
    RESPALDO.write_bytes(_dpapi(json.dumps({"p12": base64.b64encode(p12).decode(), "clave": clave}).encode(), True))
    print(f"Llave creada y respaldada (DPAPI) en {RESPALDO}.")
    _subir(p12, clave)
    ver()


def restaurar(carpeta):
    p12, clave = _leer()
    d = Path(carpeta)
    d.mkdir(parents=True, exist_ok=True)
    (d / "lector.p12").write_bytes(p12)
    (d / "clave.txt").write_text(clave, encoding="utf-8")
    print(f"lector.p12 y clave.txt en {d}. Bórrelos al terminar.")


def ver():
    p12, clave = _leer()
    with tempfile.TemporaryDirectory() as t:
        p = os.path.join(t, "x.p12")
        Path(p).write_bytes(p12)
        r = subprocess.run([_openssl(), "pkcs12", "-in", p, "-nokeys", "-clcerts", "-passin", "pass:" + clave],
                           check=True, capture_output=True, env=_ENV)
        f = subprocess.run([_openssl(), "x509", "-noout", "-fingerprint", "-sha256", "-subject", "-enddate"],
                           input=r.stdout, check=True, capture_output=True, env=_ENV)
    print(f.stdout.decode().strip())


if __name__ == "__main__":
    orden = sys.argv[1] if len(sys.argv) > 1 else ""
    if orden == "crear":
        crear()
    elif orden == "subir":
        _subir(*_leer())
    elif orden == "restaurar" and len(sys.argv) > 2:
        restaurar(sys.argv[2])
    elif orden == "ver":
        ver()
    else:
        sys.exit(__doc__)
