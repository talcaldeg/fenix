# Proyecto Fénix

Biblioteca gratuita: lectura espiritual, oración y novelas en EPUB y PDF, en español e
inglés, con por qué leerlo, reseña, citas y libros parecidos. Objetivo: dar a conocer la teología de ser para
Cristo «como otra humanidad» (santa Isabel de la Trinidad; Paul de Jaegher, *One with Jesus*).

Página: https://talcaldeg.github.io/fenix/ (GitHub Pages desde `main`).

- `index.html`: el sitio entero (vistas por `#hash`, modo claro y oscuro, ES/EN). Cada idioma
  muestra solo lo suyo: en español no aparece ningún libro, enlace ni oración en inglés, y al
  revés. Un enlace en otro idioma que el libro lleva `idioma` en `externos`.
- Plan de vida (`plan` de `datos.js`): «Para la oración» solo con fichas de categoría `oracion`
  y «Para la lectura espiritual» solo con `lectura`, para que la sección y la etiqueta coincidan.
- Todo libro lleva `imagen`. escriva.org no publica portadas, así que las obras de san Josemaría
  llevan un cuadro de dominio público como las demás.
- `datos.js`: catálogo y oraciones. Un libro nuevo es una ficha más; sus campos están
  comentados arriba del archivo.
- **Regla dura: una obra, una ficha.** Antes de subir un libro, buscarlo por título y autor en
  `datos.js` y correr `node herramientas/revisar_duplicados.js`. Otra traducción o idioma de una
  obra que ya está va en `versiones` de su ficha (cada sitio muestra la versión de su idioma y
  tiene su página en `libro/<id>/<idioma>/`); una ficha fusionada deja su id en `alias`, que
  redirige el enlace viejo. Dos obras que el revisor confunde se declaran en `distintos`.
  `gen_estaticos.js` corre la revisión y no genera nada si hay un duplicado.
- Antes de enlazar un libro solo para leer en línea, buscar si se descarga en EPUB o PDF en un
  sitio legal y preferir esa descarga (las Cartas de san Josemaría van a opusdei.org).
- **Después de cambiar `datos.js`, correr `node herramientas/gen_estaticos.js`.** El sitio navega
  por `#hash` y arma todo con JavaScript, así que Google no ve cada libro y los rastreadores de
  IA (que no ejecutan JavaScript) no ven nada. El script deja una página estática por libro en
  `libro/<id>/` (en el idioma del libro, con datos estructurados `Book`), `sitemap.xml`,
  `llms.txt` y el JSON-LD de la portada. El `robots.txt` y la señal de contenido para IA
  (`Content-Signal: search=yes,ai-input=yes,ai-train=yes`, igual que verumdata.cl) viven en la
  raíz del repo `talcaldeg.github.io`, que también apunta a este sitemap.
- Editorial: un libro cuya edición hizo Fénix (traducción, revisión, edición digital) lleva
  `editorial: { es, en }` con qué se hizo; aparece en la sección Editorial y con la etiqueta
  «Edición Fénix». Las categorías Teatro, Poesía y Ensayo e historia son para lo que no es
  lectura espiritual ni oración (la Apología de Sócrates va en Ensayo e historia).
- `libros/`: solo obras que se pueden difundir libremente (dominio público o con permiso). Lo
  demás va como `externos` (descarga legal en otro sitio) o `comprar`.
- `herramientas/epub_a_pdf.py`: saca el PDF de un EPUB de `libros/`.
- `editorial/<id>/`: traducciones propias de Fénix en Markdown, un archivo por tramo, con su
  `nota.md` («Nota de esta edición»). Se corrigen ahí y se rearma el libro con
  `herramientas/md_a_epub.py editorial/<id> libros/<archivo>.epub --titulo ... --autor ...`,
  luego `portadas.py ... --epub`, `exlibris.py` y `epub_a_pdf.py`. Licencia de estas traducciones: CC BY-NC-SA 4.0.
- `herramientas/exlibris.py libros/<archivo>.epub`: todo libro de `libros/` lleva como segunda
  página, después de la portada, el exlibris de Fénix (un timbre estampado sobre papel,
  `img/exlibris-es.jpg` o `-en.jpg` según `dc:language`). Es idempotente; después se rehace el PDF.
- `herramientas/portadas.py`: cada libro lleva un cuadro de dominio público (Wikimedia Commons)
  relacionado con su tema, guardado sin marco en `img/cuadros/<nombre>.jpg` (2:3, de ahí se
  regenera todo). Sobre él arma la portada con el marco Fénix (`herramientas/marco.py`): códice
  para Lectura espiritual y Oración, enredadera para lo demás. La deja en
  `img/portadas/<nombre>.jpg` y, con `--epub`, dentro del EPUB, y rehace el PDF. `--todos`
  regenera el catálogo entero. Una versión en otro idioma lleva su propia `imagen` (el título
  va impreso). El sitio muestra la portada con marco en tarjetas y ficha, y el cuadro solo en
  miniaturas y fondos. La portada oficial (URL externa) se deja como está. El crédito va en
  `imagen` de la ficha. Las obras de Project Gutenberg se alojan en `libros/` con esa portada
  (el texto y la licencia de Gutenberg quedan intactos).
- Leídos, favoritos y la puntuación de cada visitante quedan en su navegador (`localStorage`).
  Fénix no publica puntuación propia: solo la del visitante y la valoración moral de Delibris.
- Valoración moral: `delibris` de cada ficha, leída en la página del libro en delibris.org
  (`valor` 1 a 6, 6 = «Sin inconvenientes», y `genero` Literatura o Pensamiento, que fija el
  texto del nivel en `ESCALA_DELIBRIS` de `index.html`). `null` si el libro no está en Delibris.
  La biblioteca se ve en modo lista con esa valoración en cada fila.
- Todos los libros (`#todos`, ficha en `#obra/<id de Open Library>`): catálogo mundial en el
  idioma de la página, consultado en vivo a la API de Open Library (obras con edición en
  español, o en inglés en el sitio EN). La ficha muestra la valoración de Delibris, los derechos
  de autor estimados por la regla chilena (vida del autor + 70 años, con el año de muerte de
  Open Library), y descarga si el libro está en Fénix (mismo título sin subtítulo y algún nombre
  del autor en común) o un botón «Solicitar este libro» (FormSubmit) si no.
- Índice de Delibris: delibris.org no permite consultarse desde otro sitio, así que
  `herramientas/delibris_indice.py` recorre su buscador por género (respetando su pausa de 10 s;
  el recorrido entero tarda unas 13 horas) y deja `delibris/<clave>.json`. Es incremental:
  guarda cada página en `herramientas/.cache_delibris/` (fuera de git) y sigue donde quedó. Para
  sumar las reseñas nuevas: `--refrescar 3`. La clave del trozo se calcula igual en
  `claveDelibris` de `index.html`.
- Citas (`#citas`): todas las `citas` de las fichas en el idioma de la página (las de un libro
  en otro idioma no se muestran), con buscador y categoría; cada una lleva a la ficha de su libro.
  La portada muestra una «Cita del día» que cambia a medianoche y recorre todas antes de repetir.
  No hay que tocar nada para sumarlas: basta con las `citas` de `datos.js`.
- Ficha del libro: «Compartir» abre el menú del sistema en el celular y en el computador copia el
  enlace a la página estática del libro (`libro/<id>/` o `libro/<id>/<idioma>/`, con vista previa);
  «Solicitar una corrección» abre el formulario de errores con ese libro ya elegido.
- Formularios (salvar un libro, error, contacto): FormSubmit, destino en
  `FENIX.contacto.formularios`. El enlace de donación va en `FENIX.contacto.donar`.

Citas y oraciones se cotejan con el texto del libro antes de publicarse; lo teológico pasa por
la skill `auditar-teologia`.
