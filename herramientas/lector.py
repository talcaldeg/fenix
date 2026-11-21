"""Lo que deja el lector del sitio (lector/) para que Claude lo lea desde el PC.

    python herramientas/lector.py correcciones [--dias 30]   correcciones enviadas desde el lector
    python herramientas/lector.py nube                       libros, avance, marcadores y notas en Drive

correcciones: el lector manda cada corrección por FormSubmit a talcaldeg@gmail.com con el asunto
«Fénix - corrección desde el lector: <título>», y trae el id de la ficha, el XHTML del capítulo, el texto
marcado con su contexto y la corrección propuesta. Este comando las lista y ubica el texto marcado en
el EPUB publicado (libros/) y, si es edición propia, en el Markdown de editorial/<id>/, que es donde se
corrige (después se rearma el libro: skill fenix, sección 2.3). Cuando el lector baje la versión
corregida, la página, los marcadores y las notas del lector siguen en su lugar.

nube: el lector guarda en el Drive de quien lo conecte la carpeta «Fénix - Lector» con lector.json
(los EPUB propios van al lado). Se lee con Drive/drive_cuentas.py, cuenta personal.
"""
import argparse
import glob
import json
import os
import re
import sys
import zipfile

sys.stdout.reconfigure(encoding="utf-8")
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Desde una copia de sesión (fenix/.sesiones/<tema>) la carpeta Claude queda tres niveles arriba.
CLAUDE = os.path.dirname(os.path.dirname(os.path.dirname(RAIZ))) if ".sesiones" in RAIZ else os.path.dirname(RAIZ)
ASUNTO = "corrección desde el lector"


def _norm(s):
    return re.sub(r"\s+", " ", s or "").strip()


def _campos(cuerpo):
    """El correo de FormSubmit (plantilla table) trae el nombre del campo solo en su línea y el valor en
    las siguientes, hasta el próximo nombre; termina en «Submitted at». Se toman los campos conocidos."""
    nombres = {"libro", "autor", "id_fenix", "identificador_epub", "version_sha", "capitulo", "archivo_xhtml",
               "texto_marcado", "contexto", "correccion", "nota_id", "origen"}
    datos, actual = {}, None
    for linea in cuerpo.splitlines():
        t = linea.strip()
        if t.startswith("Submitted at"):
            break
        if t in nombres:
            actual = t
            datos[actual] = ""
        elif actual and t:
            datos[actual] += " " + t
    return {k: _norm(v) for k, v in datos.items()}


def _ubicar(datos):
    """Dónde está el texto marcado: EPUB publicado (archivo y línea del XHTML) y fuente de editorial/."""
    texto = datos.get("texto_marcado", "")
    if not texto:
        return []
    corto = texto[:80]
    lugares = []
    fid = (datos.get("id_fenix") or "").split(" ")[0]
    for epub in sorted(glob.glob(os.path.join(RAIZ, "libros", "*.epub"))):
        if fid and fid not in os.path.basename(epub) and not datos.get("libro"):
            continue
        try:
            z = zipfile.ZipFile(epub)
        except zipfile.BadZipFile:
            continue
        objetivo = datos.get("archivo_xhtml", "")
        for n in z.namelist():
            if objetivo and n != objetivo:
                continue
            if not n.endswith((".xhtml", ".html")):
                continue
            plano = _norm(re.sub(r"<[^>]+>", "", z.read(n).decode("utf-8", "replace")))
            if corto in plano:
                lugares.append(f"EPUB: libros/{os.path.basename(epub)} > {n}")
        if lugares:
            break
    for md in glob.glob(os.path.join(RAIZ, "editorial", fid or "-", "*.md")) if fid else []:
        with open(md, encoding="utf-8") as f:
            for i, linea in enumerate(f, 1):
                if corto[:50] in _norm(linea):
                    lugares.append(f"Fuente: {os.path.relpath(md, RAIZ)}:{i}")
    return lugares


def correcciones(dias):
    sys.path.insert(0, os.path.join(CLAUDE, "Gmail"))
    from gmail_cuentas import abrir
    g = abrir("personal")
    df = g.buscar(f'subject:"{ASUNTO}" newer_than:{dias}d', maximo=100)
    if df.empty:
        print(f"Sin correcciones del lector en {dias} días (asunto «{ASUNTO}»).")
        return
    print(f"{len(df)} correcciones del lector en {dias} días, la más nueva primero:\n")
    for _, fila in df.iterrows():
        d = _campos(g.leer(fila["id"]))
        print(f"- {fila['fecha']:%d-%m-%Y %H:%M} · {d.get('libro', fila['asunto'])} · {d.get('capitulo', '')}")
        print(f"  ficha: {d.get('id_fenix', '?')} · versión {d.get('version_sha', '?')} · {d.get('archivo_xhtml', '')}")
        print(f"  marcado: «{d.get('texto_marcado', '')}»")
        print(f"  contexto: {d.get('contexto', '')[:300]}")
        print(f"  corrección: {d.get('correccion', '')}")
        for lugar in _ubicar(d) or ["(no se ubicó el texto en libros/: ¿ya se corrigió?)"]:
            print(f"  {lugar}")
        print()


def nube():
    sys.path.insert(0, os.path.join(CLAUDE, "Drive"))
    from drive_cuentas import abrir
    d = abrir("personal")
    carpetas = d.buscar("name = 'Fénix - Lector' and mimeType = 'application/vnd.google-apps.folder' and trashed = false", 5)
    if carpetas.empty:
        print("No hay carpeta «Fénix - Lector» en el Drive personal: el lector todavía no se conectó a la nube.")
        return
    archivos = d.listar(carpetas.iloc[0]["id"])
    js = archivos[archivos["nombre"] == "lector.json"]
    if js.empty:
        print("La carpeta existe pero sin lector.json.")
        return
    datos = json.loads(d.leer(js.iloc[0]["id"], maximo_caracteres=5_000_000))
    print(f"lector.json del {datos.get('generado', '?')}: {len(datos.get('libros', {}))} libros\n")
    estados = datos.get("estado", {})
    for lid, l in sorted(datos.get("libros", {}).items(), key=lambda x: -(x[1].get("leido") or 0)):
        e = estados.get(lid, {})
        notas = [n for n in e.get("notas", []) if not n.get("borrado")]
        marc = [m for m in e.get("marcadores", []) if not m.get("borrado")]
        print(f"- {l.get('titulo')} ({l.get('autor')}) · {round((l.get('avance') or 0) * 100)} % · "
              f"{len(marc)} marcadores · {len(notas)} notas{' · bilingüe' if l.get('bilingue') else ''}")
        pos = e.get("pos") or {}
        if pos.get("cita"):
            print(f"  va en: «{pos['cita'][:90]}» ({pos.get('href', '')})")
        for n in notas:
            tipo = {"sub": "subrayado", "nota": "nota", "corr": "corrección"}.get(n.get("tipo"), n.get("tipo"))
            extra = f" -> {n['texto']}" if n.get("texto") else ""
            print(f"  [{tipo}] «{_norm(n.get('exacto'))[:100]}»{extra}")


def main():
    a = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = a.add_subparsers(dest="cmd", required=True)
    c = sub.add_parser("correcciones")
    c.add_argument("--dias", type=int, default=30)
    sub.add_parser("nube")
    args = a.parse_args()
    if args.cmd == "correcciones":
        correcciones(args.dias)
    else:
        nube()


if __name__ == "__main__":
    main()
