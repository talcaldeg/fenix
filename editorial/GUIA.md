# Guía de traducción - Editorial de Proyecto Fénix

Se traducen al español dos clásicos de dominio público para una biblioteca gratuita:
*Historia de un alma* (santa Teresa de Lisieux, desde el francés de la edición de 1912) y las
*Confesiones* (san Agustín, desde el latín, cotejando con la traducción inglesa de E. B. Pusey).
La traducción es propia de Fénix: no se copia ninguna traducción española existente.

## Fidelidad

- Traducción **completa**: cada oración del original tiene su traducción. No se resume, no se
  omite, no se añade, no se explica. Un párrafo del original es un párrafo de la traducción.
- Se traduce del original (francés o latín). En las *Confesiones*, Pusey sirve solo para
  resolver dudas de sentido; no se calcan sus arcaísmos ni su sintaxis.
- Citas bíblicas: se traducen desde el texto que trae el original (la Vulgata o la versión
  latina que cita Agustín; el francés que cita Teresa). Nunca se copia una Biblia moderna.

## Registro

- Español culto actual, neutro, que se lea bien en Chile y en toda Latinoamérica. Ni arcaizante
  ni coloquial; sin voseo; plural de segunda persona: «ustedes».
- Teresa escribe a su Madre priora: «usted», «Madre mía», «Madre querida». Habla a Jesús y a Dios
  de «tú». Conserve su voz: frescura, diminutivos donde ella los usa, exclamaciones.
- Agustín habla a Dios de «tú» todo el libro. Prosa de oración: ritmo, paralelismos, preguntas
  retóricas; respételos, pero que la frase castellana sea natural.

## Pronombres que se refieren a Dios: el uso de opusdei.org (norma de Fénix desde el 20-oct-2026)

Con mayúscula solo los tónicos Él, Tú y Ti. En minúscula los posesivos (su, sus, tu, tus, suyo),
los átonos (le, lo, te), los enclíticos (alabarte, buscarlo), contigo y sí mismo. Ejemplos:
«nos hiciste para Ti», «tu misericordia», «Él me llamó», «lo que le agrada». Con mayúscula
también los sacramentos (Bautismo, Comunión), la Cruz, el Corazón, el Cuerpo y la Sangre del
Señor y el Cielo; dentro de los versículos de la Escritura esos sustantivos van en minúscula.
Para la Virgen y los santos, minúscula. Los libros publicados antes de esa fecha pueden traer
la regla vieja (Su, Le): no se copia de ellos.

## Ortografía y puntuación (obligatorias)

- Ortografía de la RAE actual: «solo» y los demostrativos sin tilde; «guion»; tildes y ñ siempre.
- **Nunca raya larga (—) ni semirraya (–).** Incisos con comas o paréntesis. Diálogos y citas con
  comillas angulares «...»; dentro de ellas, “...”. El guion corto (-) solo en palabras compuestas
  y rangos (Ex 33, 18-19).
- Después de dos puntos, minúscula si sigue en la misma línea.
- Signos de apertura ¿ ¡ siempre.
- Referencias bíblicas al estilo castellano: Mc 3, 13; Ex 33, 18-19; Rm 9, 15-16; Sal 88, 2.

## Formato de salida (Markdown, UTF-8)

- Cursiva del original (`_texto_` en Gutenberg, o lo que el original destaca): `*texto*`.
- **Historia de un alma**: el encabezado «CHAPITRE IER» pasa a `## Capítulo I`; la línea de
  sumario que le sigue (temas separados por «--») va como un párrafo en cursiva, con los temas
  separados por punto: `*La muerte de su madre. Los Buissonnets. Amor paterno.*`. «Acte
  d'offrande...» pasa a `## Acto de ofrenda de mí misma como víctima de holocausto al Amor
  misericordioso de Dios` (o la traducción literal de su título completo).
- Llamadas de nota `[8]` → `[^8]`, en el mismo lugar. El bloque «---- NOTAS ----» se traduce al
  final del archivo como `[^8]: texto de la nota.`; las referencias bíblicas de las notas se pasan
  al estilo castellano («Marci, III, 13» → «Mc 3, 13»).
- **Confesiones**: «AUGUSTINI CONFESSIONUM LIBER PRIMUS» → `## Libro primero` (segundo, tercero...
  decimotercero). Cada marcador de párrafo (líneas como `1.1.1`, libro.capítulo.párrafo) se
  conserva tal cual en su propia línea, sin cambio: sirve para cotejar y para armar el libro.
- Ilustraciones u otros restos de Gutenberg (`[Illustration]`, números de página): se omiten.
- El archivo contiene solo la traducción. Ningún comentario del traductor dentro.

## Errores ya reportados (no repetir en ningún libro)

Cada error que un lector o Tomás reporta en un libro publicado se agrega acá, con el libro de
origen, para que no se repita en los siguientes. El revisor (`REVISION.md`) los comprueba uno por
uno.

1. **Comas que el original no lleva** (Bernadot, cap. I). No se encadenan incisos con comas si el
   original no las pone: «au communiant détaché des créatures et de soi-même qui se livre sans
   réserve» no es «al que comulga, desprendido de las criaturas y de sí mismo, que se entrega sin
   reserva,», sino «al que comulga desprendido de las criaturas y de sí mismo y que se entrega sin
   reserva,».
2. **Citas sin fuente** (Bernadot). Una oración o cita firmada solo con el autor («M. Olier»,
   «Santa Gertrudis») o una nota del autor que dice solo el nombre («Bossuet.») lleva nota al pie
   «N. del E.» con la obra exacta y su ubicación, verificada en un texto de esa obra. Vale para
   toda cita, también la que va entre comillas dentro del párrafo con solo «dice san X» (Bernadot
   dejó 33 así; reporte de Tomás del 24-oct). Una conversación seguida (un diálogo, una anécdota)
   lleva una sola nota al final. Si Bernadot parafrasea, «cf.»; si no se halla, no se inventa: la
   nota dice «el autor no indica la obra y no se ha podido ubicar en los textos consultados».
   Antes de dar un libro por listo, ninguna cita «...» ni bloque `> ` queda sin nota.
3. **Subtítulos que vienen como párrafo** (Bernadot, cap. I). La fuente digital a veces trae un
   subtítulo como párrafo corto («Jésus est en nous comme homme.» / «Jésus vient en nous comme
   Dieu.»). Todo párrafo de una línea se revisa: si anuncia la parte que sigue, va como
   encabezado del nivel que le toca, sin punto final.
4. **Calcos de giros** (Bernadot, cap. II). Un giro francés no se traduce palabra por palabra si
   en castellano no existe: «dans son dedans le plus intime» → «en su interior más íntimo», no
   «en su dentro más íntimo».
5. **Términos técnicos sin explicar** (Bernadot, cap. II). Un término de teología que el lector
   común no conoce (circuminsesión, espiración, apropiación, misiones invisibles) se define en una
   «N. del E.» en su primera aparición en el texto, con el Catecismo.
6. **Notas del editor categóricas** (Bernadot, nota 20 del cap. II). La «N. del E.» explica qué
   quiere decir el autor y lo apoya en el Catecismo; no lo corrige ni zanja («es lenguaje
   oratorio»). Si una lectura puede confundir, se dice cuál es la buena sin desautorizarlo.
7. **Saltos de párrafo de la fuente** (Bernadot, cap. II). Si una cita completa la oración
   anterior («Y con san Juan:»), va en el mismo párrafo aunque la fuente digital la corte.
8. **Cursiva en las notas al pie** (Bernadot, nota 23 del cap. II). Un lector de Android que
   muestra las notas al pie de cada página borraba el texto en cursiva («San Agustín, .»).
   `md_a_epub.py` ya saca la cursiva de las notas; no hace falta evitarla en el Markdown.
9. **Firma de la cita como párrafo suelto** (Bernadot, cap. III, «Sal 118» y «Beata Ángela de
   Foligno»). Una oración, salmo o texto ajeno que el autor transcribe entero va como cita en
   bloque (cada línea con `> `, una línea `>` sola entre párrafos, sin comillas), y su firma
   (autor, salmo, obra) no queda como párrafo aparte: va como nota al pie al final de la cita,
   antes del punto final. Si ya tenía «N. del E.» con la obra, la nota queda «Firma. N. del E.:
   obra».
10. **Autor castellano retraducido** (Bernadot, santa Teresa y san Juan de la Cruz; reporte de
    Tomás del 24-oct). Si el autor citado escribió en castellano, la cita no se traduce del
    francés del libro: se pone su texto original, copiado del texto de esa obra (Cántico y Llama
    en su segunda redacción), sin cambiarle palabras ni orden. Si el inciso «dice san X» rompería
    la frase original, va fuera de las comillas («San Juan de la Cruz añade que «...»»). Una
    palabra de época que hoy no se entiende («una higa») se aclara en la misma nota.

## Glosario

Historia de un alma: le bon Dieu → el buen Dios; Jésus → Jesús; ma Mère → Madre mía; la petite
voie → el caminito; petite fleur → florecilla; l'abandon → el abandono; l'Amour miséricordieux →
el Amor misericordioso; holocauste → holocausto; le Carmel → el Carmelo; Sainte Face → Santa Faz;
Mère Agnès de Jésus → Madre Inés de Jesús; Mère Marie de Gonzague → Madre María de Gonzaga; Pauline
→ Paulina; Marie → María; Léonie → Leonia; Céline → Celina; Thérèse → Teresa; Les Buissonnets,
Lisieux, Alençon, Bayeux → sin traducir; Léon XIII → León XIII; Notre-Seigneur → Nuestro Señor;
la Sainte Vierge → la Santísima Virgen; prise d'habit → toma de hábito; profession → profesión;
ascenseur → ascensor; un ciel → un cielo; l'exil → el destierro.

Confesiones: deus → Dios; dominus → Señor; Verbum → el Verbo; gratia → gracia; caritas → caridad;
concupiscentia → concupiscencia; continentia → continencia; Manichaei → maniqueos; Ambrosius →
Ambrosio; Monnica → Mónica; Mediolanium → Milán; Carthago → Cartago; Thagaste → Tagaste; filius
unicus/unigenitus → Hijo único/unigénito; sacramentum → sacramento (o misterio, según el
contexto); fides → fe; animus/anima → alma (mens → mente); memoria → memoria; tempus → tiempo.
Frases célebres, sin parafrasear: «nos hiciste para Ti, y nuestro corazón está inquieto hasta que
descanse en Ti»; «¡Tarde Te amé, Hermosura tan antigua y tan nueva, tarde Te amé!»; «toma y lee».

## Al terminar

Escriba cada tramo en `salida/<mismo nombre>.md`. Relea su salida contra el original una vez:
oraciones faltantes, rayas largas, pronombres divinos sin mayúscula, comillas rectas.
Su mensaje final (máx. 10 líneas): tramos hechos, conteo de palabras de cada uno y las dudas de
sentido que quedaron (cita corta del original y cómo la resolvió).

## De la Eucaristía a la Trinidad (Bernadot, desde el francés)

Tratado espiritual del dominico Marie-Vincent Bernadot (1919). Las reglas de arriba (fidelidad,
registro, mayúsculas divinas, ortografía, puntuación) rigen igual; esto es lo propio del libro.

- **Tratamiento.** Bernadot habla a Dios, a Cristo y al Espíritu Santo de «vous», a la francesa:
  en castellano va de «tú», con la regla de mayúsculas de arriba: «Padre santo, inclínate sobre tu
  pequeña criatura». Cristo hablando a sus discípulos (vous plural): «ustedes». Al lector, si lo
  interpela en singular, «tú». La oración de santa Gertrudis a la Trinidad, también de «tú».
- **Encabezados.** `## Avant-propos` → `## Prólogo`; `## I. L'union eucharistique` → `## I. La
  unión eucarística` (y así II, III, IV). `###` y `####` se conservan con su numeración. Una
  línea suelta que hace de título sin `#` («Le mystère du Christ») va como `### El misterio de
  Cristo`. El epígrafe del Prólogo («Je suis la Voie : marchez en Moi...») va en cursiva, un
  verso por párrafo, y «Je sois la Vérité» es errata del original por «Je suis».
- **Notas.** Las llamadas `[^N]` se conservan en su lugar y con su número. El bloque
  «---- NOTES ----» se traduce al final del archivo como `[^N]: texto.` Referencias bíblicas al
  modo castellano, sin cambiar la numeración del original (los salmos van con la numeración de la
  Vulgata que trae Bernadot: «Ps XXXIX, 8» → «Sal 39, 8»): Col 1, 15; Jn 15, 5; 1 Co 12, 13;
  Ef 3, 8; Flp 1, 21; Hb 7, 25; Ct 5, 1; Lm 2, 13 (Thren.); Ne 8, 10 (Nehem.); Si 24, 26.
  «Ibid.» queda «Ibid.». Obras: *Suma teológica*, III, q. 79, a. 1, ad 1; *El diálogo* (santa
  Catalina de Siena); *Comentario a la carta a los Colosenses*; *Sobre la unión con Dios*
  (*De l'union avec Dieu*); *Máximas espirituales* (san Juan de la Cruz); Concilio de Florencia.
- **Citas bíblicas** en cursiva, como las trae él: se traducen de su francés (que sigue la
  Vulgata), no de una Biblia castellana.
- **Glosario.** communion → comunión (el sacramento: la Comunión, con mayúscula solo si el
  original la pone); communier → comulgar (o «entrar en comunión», si no es el sacramento);
  le communiant → el que comulga; la sainte Humanité (de Jésus) → la santa Humanidad; les Trois
  divines Personnes → las tres divinas Personas; la très sainte Trinité → la santísima Trinidad;
  l'adorable Trinité → la adorable Trinidad; le Verbe → el Verbo; l'Esprit-Saint → el Espíritu
  Santo; le Christ Jésus → Cristo Jesús; Notre-Seigneur → Nuestro Señor; le
  Bien-Aimé → el Amado; vie divine / surnaturelle → vida divina / sobrenatural; grâce
  sanctifiante → gracia santificante; demeurer → permanecer; union → unión; vie d'union → vida
  de unión; habitation (de la Trinité) → inhabitación; circumincession → circuminsesión;
  missions divines invisibles → misiones divinas invisibles; fils adoptifs → hijos adoptivos;
  recueillement → recogimiento; désolations de l'âme → desolaciones del alma; actes de désir /
  d'amour → actos de deseo / de amor; les espèces (sacramentelles) → las especies; le
  Saint-Sacrement → el Santísimo Sacramento; la louange de gloire → la alabanza de gloria;
  complaisances → complacencias; l'âme fidèle → el alma fiel; le chef (du corps) → la cabeza;
  les membres → los miembros; mérites → méritos; le Sacré-Cœur → el Sagrado Corazón.
- Términos técnicos sin cambiar de grado: «nature», «personne», «substance», «grâce»,
  «participation», «mérite», «présence réelle» se traducen por su equivalente exacto.
