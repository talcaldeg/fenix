# Proyecto Fénix

Biblioteca católica gratuita: lectura espiritual, oración y novelas en EPUB y PDF, en español e
inglés, con reseña, citas y libros parecidos. Objetivo: dar a conocer la teología de ser para
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
- `libros/`: solo obras que se pueden difundir libremente (dominio público o con permiso). Lo
  demás va como `externos` (descarga legal en otro sitio) o `comprar`.
- `herramientas/epub_a_pdf.py`: saca el PDF de un EPUB de `libros/`.
- `herramientas/portadas.py`: cada libro lleva un cuadro de dominio público (Wikimedia Commons)
  relacionado con su tema. Lo recorta a `img/portadas/<id>.jpg` para el sitio y, con `--epub`,
  arma la portada con título y autor dentro del EPUB; después se regenera el PDF. El crédito
  va en `imagen` de la ficha. Las obras de Project Gutenberg se alojan en `libros/` con esa
  portada (el texto y la licencia de Gutenberg quedan intactos).
- Leídos, favoritos y la puntuación de cada visitante quedan en su navegador (`localStorage`).
  La puntuación «Fénix» se completa en `nota` de cada ficha.
- Valoración moral: `delibris` de cada ficha, leída en la página del libro en delibris.org
  (`valor` 1 a 6, 6 = «Sin inconvenientes», y `genero` Literatura o Pensamiento, que fija el
  texto del nivel en `ESCALA_DELIBRIS` de `index.html`). `null` si el libro no está en Delibris.
  La biblioteca se ve en modo lista con esa valoración en cada fila.
- Formularios (salvar un libro, error, contacto): FormSubmit, destino en
  `FENIX.contacto.formularios`. El enlace de donación va en `FENIX.contacto.donar`.

Citas y oraciones se cotejan con el texto del libro antes de publicarse; lo teológico pasa por
la skill `auditar-teologia`.
