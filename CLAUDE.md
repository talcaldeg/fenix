# Proyecto Fénix

Biblioteca gratuita en https://talcaldeg.github.io/fenix/ (GitHub Pages desde `main`). Cómo
agregar un libro y la estructura: `README.md`. Criterios editoriales: memoria `proyecto_fenix`.

**Regla dura:** cada corrección que él haga a un libro se escribe en el mismo turno como criterio
en `proyecto_fenix` (la clase de error, no solo el caso) y se le recomienda auditar los demás
libros publicados por ese mismo error, nombrándolos. Memoria `feedback_correccion_actualiza_memoria`.

## Varias sesiones a la vez (regla dura)

Nunca se edita la carpeta principal `fenix\`: cada sesión trabaja en su propia copia y publica
desde ahí, así no se pisa con las demás.

```bash
python herramientas/sesion.py nueva <tema>                 # crea .sesiones/<tema> e imprime la ruta
python herramientas/sesion.py publicar <tema> -m "mensaje" # commit, rebase sobre main, regenera y sube
python herramientas/sesion.py cerrar <tema>                # al terminar
```

- Todo se edita y se prueba dentro de `.sesiones/<tema>` (rutas absolutas a esa copia).
- `publicar` se pone al día con lo que ya subieron las otras sesiones; si chocan las páginas
  generadas, toma las de `main` y las regenera. Si choca un archivo fuente (`datos.js`,
  `index.html`), se detiene: se resuelve el choque en la copia y se vuelve a publicar.
- No se borra `.git/index.lock` ni se hace `git add -A` en la carpeta principal.
- Vista previa de una copia: `python -m http.server <puerto> -d .sesiones/<tema>`.
