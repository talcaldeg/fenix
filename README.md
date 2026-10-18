# Proyecto Fénix

Biblioteca católica gratuita: lectura espiritual, oración y novelas en EPUB y PDF, en español e
inglés, con reseña, citas y libros parecidos. Objetivo: dar a conocer la teología de ser para
Cristo «como otra humanidad» (santa Isabel de la Trinidad; Paul de Jaegher, *One with Jesus*).

Página: https://talcaldeg.github.io/fenix/ (GitHub Pages desde `main`).

- `index.html`: el sitio entero (vistas por `#hash`, modo claro y oscuro, ES/EN).
- `datos.js`: catálogo y oraciones. Un libro nuevo es una ficha más; sus campos están
  comentados arriba del archivo.
- `libros/`: solo obras que se pueden difundir libremente (dominio público o con permiso). Lo
  demás va como `externos` (descarga legal en otro sitio) o `comprar`.
- `herramientas/epub_a_pdf.py`: saca el PDF de un EPUB de `libros/`.
- Leídos, favoritos y la puntuación de cada visitante quedan en su navegador (`localStorage`).
  La puntuación «Fénix» se completa en `nota` de cada ficha.
- Formularios (salvar un libro, error, contacto): FormSubmit, destino en
  `FENIX.contacto.formularios`. El enlace de donación va en `FENIX.contacto.donar`.

Citas y oraciones se cotejan con el texto del libro antes de publicarse; lo teológico pasa por
la skill `auditar-teologia`.
