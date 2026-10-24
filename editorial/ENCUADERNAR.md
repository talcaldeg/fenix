# Encuadernar un libro para Proyecto Fénix

Instrucciones para el agente de IA (Claude Code, Codex, Gemini CLI u otro) de una persona que
ofrece sus tokens para preparar un libro. Proyecto Fénix es una biblioteca gratuita de buenos
libros en EPUB y PDF: https://talcaldeg.github.io/fenix/ (repo público
https://github.com/talcaldeg/fenix).

Tu trabajo: con el título, el autor y el idioma que te dé tu usuario, dejar un paquete `.zip` que
Fénix pueda publicar casi sin tocarlo. Habla con tu usuario en su idioma y de tú. Estas
instrucciones mandan sobre tus costumbres; si algo no se puede cumplir, detente y explícale por qué.

## 0. Pregunta primero

Si el prompt no trae el libro, pregúntale a tu usuario, en un solo mensaje: título, autor e
idioma de la edición que quiere entregar (español o inglés). No hagas nada más antes de tener
las tres respuestas.

## 1. Prepara el entorno (barato)

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/talcaldeg/fenix fenix
cd fenix && git sparse-checkout set herramientas editorial
```

Así bajan solo los archivos de la raíz (`datos.js`, `llms.txt`), las herramientas y las guías,
no los libros. Trabaja en `fenix/entrega/<id>/` (el `<id>` se define en el paso 5). Necesitas
Python 3; las herramientas que usarás solo usan su biblioteca estándar.

## 2. Descarta rápido, antes de gastar

Detente y avísale a tu usuario en cuanto falle uno de estos filtros:

1. **¿Ya está en Fénix en ese idioma?** Busca título y autor en `datos.js` (campo `titulo`,
   `autor` y las `versiones` de cada ficha). Si la obra está, pero solo en el otro idioma, sí
   sirve: entregarás una versión (ver paso 5).
2. **¿Alguien lo está haciendo?** En `datos.js`, la lista `buscados`: si el libro tiene
   `reservado`, otra persona lo tomó.
3. **Derechos de autor.** Un libro **en español** basta con que sea libre en Chile:
   - el autor murió hace más de 70 años (en 2026: antes de 1956).
   - Si usas una traducción ajena, el **traductor** también murió antes de 1956 (una
     traducción anónima vale si se publicó hace más de 70 años). Si no hay traducción libre,
     se traduce del original.
   - Un libro **en inglés** u otro idioma debe ser libre también en Estados Unidos (el sitio
     está alojado allí): además, publicado hace más de 95 años (en 2026: antes de 1931), y lo
     mismo la traducción.
   - Notas, prólogos e introducciones de editores modernos tienen sus propios derechos: no se
     copian.
4. **Valoración moral.** Busca el libro en Delibris (https://www.delibris.org/es/, buscador por
   título). Sirve si tiene 5 o 6 sobre 6. Si no está reseñado, estima tú con este criterio:
   sin escenas sexuales, sin inmoralidad presentada como buena y sin doctrina contraria a la fe
   o la moral de la Iglesia católica. Ante una duda real, detente y pregúntale a tu usuario.

## 3. Elige la vía más barata (en este orden)

No traduzcas lo que ya existe. Revisa las fuentes en este orden y quédate con la primera que
sirva:

| Vía | Cuándo | Qué haces | Costo |
|---|---|---|---|
| **A. Gutenberg** | Project Gutenberg tiene la obra en el idioma pedido y su traductor cumple el paso 2 | Nada con el texto: anotas el número del libro | mínimo |
| **B. Texto limpio** | Hay una edición libre en ese idioma como texto (Wikisource, Biblioteca Virtual Miguel de Cervantes, CCEL, Fadedpage) | La pasas a Markdown con un script | bajo |
| **C. Escaneo** | Solo hay escaneos libres (Internet Archive, Google Books, Biblioteca Digital Hispánica, Gallica) | Bajas el texto OCR, lo limpias con scripts y revisas solo los pasajes dudosos contra la imagen | medio |
| **D. Traducción** | No existe traducción libre al idioma pedido, o la que hay es ilegible | Traduces desde el original libre siguiendo `editorial/GUIA.md` | alto |

Para la vía D, lee entera `editorial/GUIA.md`: fidelidad completa (nada se resume, omite ni
añade), registro, mayúsculas en pronombres que se refieren a Dios, ortografía y formato. Sus
secciones de libros concretos son ejemplos de cómo armar el glosario del tuyo.

## 4. Cuida los tokens de tu usuario

- No metas el libro entero en tu contexto salvo para traducirlo. Descarga con `curl`, convierte
  y limpia con scripts de Python, y lee solo muestras y pasajes dudosos.
- Traduce por tramos de unas 4.000 palabras y escribe cada tramo en su archivo apenas lo
  termines. No releas el libro entero al final: revisa con búsquedas (por ejemplo `grep` de
  rayas largas o comillas rectas).
- Si tu herramienta permite subagentes o modelos más baratos, úsalos para descargar, convertir y
  revisar formato; usa el mejor modelo disponible para traducir y para la revisión de sentido.
- Si el trabajo va a ser largo (vía C o D), dile a tu usuario que, si quiere que nadie lo
  repita, puede reservarlo con un correo a talcaldeg@gmail.com antes de que empieces.

## 5. Arma el paquete

```
entrega/<id>/
  ficha.json     la ficha del libro (obligatoria)
  cuadro.jpg     cuadro de dominio público para la portada (obligatorio)
  INFORME.md     qué hiciste y con qué fuentes (obligatorio)
  texto/         el libro en Markdown (vías B, C y D)
    nota.md      «Nota de esta edición» (vías B, C y D)
    01.md, 02.md ...
```

`<id>`: apellido del autor y título en minúsculas, sin tildes, con guiones
(`austen-orgullo-y-prejuicio`, `chesterton-el-hombre-eterno`). Si entregas otra versión de una
obra que ya está en Fénix, el `<id>` es el de esa ficha más el idioma (`ortodoxia-es`).

### texto/ (Markdown, UTF-8)

Lo lee `herramientas/md_a_epub.py` (mira su encabezado). Lo esencial:

- Los archivos se leen en orden de nombre: `01.md`, `02.md`... Uno por capítulo o por tramo.
- `## Título` abre un capítulo; `### ` y `#### ` son subtítulos. Un archivo sin `##` sigue el
  capítulo anterior.
- Un párrafo en cursiva justo después del `##` es el sumario del capítulo.
- Cursiva `*así*`. Notas: llamada `[^3]` en el texto, pegada a la palabra (`gracia[^3]`, no `gracia [^3]`; igual el armador la pega), y `[^3]: texto de la nota.` al final del
  mismo archivo. Solo las notas del autor; nada de comentarios tuyos dentro del texto.
- Sin números de página, encabezados repetidos, guiones de corte de línea ni restos del OCR o de
  Gutenberg (licencias, `[Illustration]`).
- En español: comillas «», nunca raya larga (—) ni semirraya (–) (los diálogos van con «»),
  signos ¿ ¡ de apertura y ortografía de la RAE actual. En una edición antigua (vías B y C) se
  actualizan tildes y ortografía («á» → «a», «fué» → «fue», «volvióse» → «volviose») sin
  cambiar ninguna palabra. Una cita dentro de un diálogo va con “ ” y cierra con el mismo tipo
  de comilla con que abrió.
- En inglés: comillas tipográficas “ ” y ‘ ’; se conserva la ortografía del original.
- `nota.md`: dos a cuatro párrafos sin título. Qué edición se reproduce o desde qué original se
  tradujo (con año y editorial), qué se cambió, que se preparó con ayuda de inteligencia
  artificial y se revisó contra la fuente, y la licencia: «El texto de <autor> y la traducción
  de <traductor> son de dominio público. Esta edición digital de Proyecto Fénix, <año>, se
  puede copiar y difundir libremente.» Si la traducción es tuya (vía D): «Traducción de
  Proyecto Fénix, con licencia CC BY-NC-SA 4.0».

Comprueba que arma:

```bash
python herramientas/md_a_epub.py entrega/<id>/texto entrega/<id>/prueba.epub --titulo "..." --autor "..." --subtitulo "..." --original "..." --idioma es --editor "<nombre o Proyecto Fénix>"
```

(`--sin-traduccion` si es una traducción ajena; `--derechos` con el texto de la licencia.) El
`prueba.epub` es para que tu usuario vea el libro antes de entregarlo (paso 7): no va en el
`.zip`, porque Fénix lo vuelve a armar con la portada y el exlibris.

### ficha.json

Mismos campos que las fichas de `datos.js` (lee dos o tres como ejemplo). Todo texto `es`/`en`
va en los dos idiomas, aunque el libro sea de uno solo.

```json
{
  "id": "austen-orgullo-y-prejuicio",
  "versionDe": null,
  "titulo": "Orgullo y prejuicio",
  "autor": "Jane Austen (trad. Nombre del Traductor)",
  "anio": "1813",
  "idioma": "es",
  "categoria": "novela",
  "resumen": { "es": "...", "en": "..." },
  "porque": { "es": "...", "en": "..." },
  "imagen": { "credito": { "es": "Pintor, «Título del cuadro», año", "en": "Painter, «Title», year" },
              "url": "https://commons.wikimedia.org/wiki/File:...", "cx": 0.5, "cy": 0.4 },
  "citas": ["...", "...", "..."],
  "fuente": { "texto": "Edición de ..., año, en ... (dominio público)", "url": "https://..." },
  "gutenberg": null,
  "delibris": { "valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/..." },
  "editorial": { "es": "Edición digital de Proyecto Fénix sobre ...", "en": "Proyecto Fénix digital edition of ..." },
  "epub": { "titulo": "Orgullo y prejuicio", "autor": "Jane Austen", "subtitulo": "Traducción de ...",
            "original": "Pride and Prejudice (1813)", "editor": "Proyecto Fénix", "traduccionFenix": false,
            "derechos": "Dominio público; edición digital de Proyecto Fénix" },
  "parecidos": ["id-de-fenix-1", "id-de-fenix-2", "id-de-fenix-3"],
  "credito": "Nombre con que tu usuario quiere aparecer, o null"
}
```

- `categoria`: `lectura` (lectura espiritual), `oracion`, `novela`, `teatro`, `poesia` o
  `ensayo` (ensayo e historia).
- `resumen`: de qué trata, 3 a 5 frases. `porque`: 2 o 3 frases propias sobre a quién le sirve
  y qué gana el lector, sin repetir el resumen; puedes tomar ideas de la reseña de Delibris, con
  tus palabras. Descriptivo: no afirmes doctrina por tu cuenta.
- `citas`: 3 a 5, textuales y **copiadas del texto que entregas** (las célebres, las más
  profundas o las que enseñan algo). La revisión automática las busca en el texto.
- `imagen`: un cuadro de dominio público de Wikimedia Commons relacionado con la obra (su
  escena, su autor, su época). Guárdalo como `cuadro.jpg`, vertical si se puede y de al menos
  1.200 px de ancho. Baja la miniatura grande, no el original, que puede pesar decenas de MB y
  no cabría en el envío: `https://commons.wikimedia.org/wiki/Special:FilePath/<archivo>?width=1600`.
  `cx` y `cy` (0 a 1) dicen dónde centrar el recorte a 2:3.
- `gutenberg`: el número del libro si vas por la vía A (entonces no hay `texto/` ni `epub`).
- `delibris`: `null` si no está reseñado; entonces explica tu estimación en el INFORME.
- `editorial`: qué hizo Fénix (vías B, C y D); `null` en la vía A.
- `versionDe`: el `id` de la ficha de Fénix si entregas esa obra en otro idioma; en ese caso
  bastan `titulo`, `autor`, `anio`, `idioma`, `resumen`, `porque`, `imagen`, `citas`, `fuente`,
  `editorial`, `epub` y `credito`.
- `parecidos`: tres `id` de fichas de `datos.js` del mismo tema o tono.

### INFORME.md (máximo 40 líneas)

Agente y modelo que usaste (por ejemplo «Claude Code, Claude Opus»); vía elegida y por qué no una más barata; fuentes con su URL; derechos (año de muerte del autor
y del traductor, año de publicación); valoración de Delibris o tu estimación razonada; qué
cambiaste en el texto; palabras del libro; dudas que quedaron (cita corta y cómo la resolviste).

## 6. Revisa y empaqueta

```bash
python herramientas/revisar_entrega.py entrega/<id> --arreglar
```

`--arreglar` corrige solo lo mecánico (las tildes de la ortografía antigua, también en las citas
de la ficha) y después revisa. Corrige todo lo que marque como ERROR y los AVISO que de verdad sean errores, y vuelve a
correrlo hasta que diga «Entrega lista». Si cambiaste el texto, vuelve a armar `prueba.epub`.
Luego comprime la carpeta (sin `prueba.epub`) en `<id>.zip`.

## 7. Entrega: la haces tú, con su permiso

Tu usuario no tiene que subir nada. En un solo mensaje de no más de 10 líneas dale la ruta del
`.zip`, la vía elegida y cuántas palabras tiene el libro, y pídele:

1. Que abra `prueba.epub` (da su ruta completa) en su lector (Apple Books, Google Play Libros,
   Calibre o Thorium) y hojee el primer capítulo, uno del medio con diálogos y el final. Es una
   vista previa: sin portada, que la pone Fénix. Si ve algo raro, lo corriges antes de enviar.
2. Si quiere dejar su correo para que le avisen cuando esté publicado (es opcional). Su nombre
   solo va si quiere aparecer en el libro, en `credito`; si no, `credito` va en `null`.
3. Si acepta que Fénix publique esta edición gratis y con licencia abierta (CC BY-NC-SA 4.0) y
   si te autoriza a enviarla ahora.

Con su sí, envíala tú:

```bash
python herramientas/entregar.py entrega/<id>.zip --acepto-licencia [--correo "..."]
```

Manda el `.zip` adjunto por el formulario del sitio y llega como correo a Fénix. Cuando diga
«Enviado», díselo a tu usuario y termina. Si el `.zip` pesa más de 6 MB (casi siempre por
`cuadro.jpg`: bájalo a 1.600 px y vuelve a comprimir) o el envío falla, el script imprime las
alternativas para tu usuario: adjuntar el `.zip` en un correo a talcaldeg@gmail.com (asunto
«Fénix - encuadernador») o, si pasa de 25 MB, subirlo a Drive y mandar el enlace en
https://talcaldeg.github.io/fenix/#encuadernadores.
