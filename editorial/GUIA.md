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
11. **Fuente dada por buena sin buscar en cartas y sermones** (Bernadot, san Francisco de Sales;
    reporte de Tomás del 28-oct). Antes de escribir que una cita no se ubicó, se busca también en
    las cartas, sermones y opúsculos del autor, no solo en sus tratados: la frase de los ángeles
    que envidiarían los sufrimientos estaba en una carta de 1620 (Obras de Annecy, t. XIX). Lo que
    diga un buscador o una IA sobre la obra («Tratado, libro V») no vale sin el texto de esa obra.
12. **Firma repetida** (Bernadot, «(Faber.)»; reporte del 28-oct). Si la nota al pie ya da el
    autor de la cita, la firma entre paréntesis que el autor dejó tras las comillas se quita del
    texto.
13. **Nota sin hallazgo dicha como certeza** (Bernadot, nota 107; reporte del 28-oct). Lo que no
    se encontró se dice así: «no la hemos hallado con estas palabras en los escritos de X», nunca
    «no está» o «no existe».
14. **Nota doctrinal de más** (Bernadot, nota 57 sobre el abandono de Cristo; él la sacó el
    28-oct). Una «N. del E.» que aclara doctrina no se pone si el pasaje cita la Escritura o a un
    Padre y se entiende en su contexto; las que se agreguen se le muestran antes de publicar.
15. **Palabras poco conocidas** (De Jaegher, cap. I, «opúsculos» y «abstruso»; reporte del
    28-oct). Si el original usa un cultismo y hay una palabra común que dice lo mismo, va la
    común: «opúsculos» → «obras breves», «abstruso» → «complicado». Ni diminutivo que suene
    menor («librito», rechazado) ni palabra con carga peyorativa («panfleto» es propaganda o
    libelo; «folleto», unas pocas hojas). Los términos de teología no entran acá (error 5).
16. **Alusión sin nota** (De Jaegher, cap. I, «como santa Catalina de Siena, retirarnos dentro de
    nosotros mismos»; reporte del 29-oct). Lo que el autor atribuye a un santo o a un autor sin
    comillas (un episodio, una enseñanza, «como san X», «según X») también lleva nota «cf.» con la
    obra y el lugar donde consta, verificados en su texto: aquí, Raimundo de Capua, *Legenda
    maior*, I, 4. Antes de dar un libro por listo, se buscan los nombres propios de santos y
    autores en el cuerpo, no solo las comillas.

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

## Hombre vivo (Chesterton, *Manalive*, 1912, desde el inglés)

Original: Project Gutenberg n.º 1718, partido en tramos en
`fenix_fuentes/manalive/tramos/NN_pXcY.txt`; la salida va en `editorial/chesterton-manalive/NN_pXcY.md`
(mismo nombre). Es una novela cómica y filosófica: la prosa de Chesterton vive de la paradoja, la
imagen inesperada y el ritmo; que el chiste y la paradoja funcionen en castellano sin dejar de
ser fieles. Las frases muy largas con incisos se pueden ordenar, nunca recortar.

- Encabezados: el tramo que abre una parte empieza con `## Primera parte. Los enigmas de Innocent Smith`
  (o `## Segunda parte. Las explicaciones de Innocent Smith`) y, en párrafo aparte, el capítulo.
  Capítulos: `## I. Cómo llegó el gran viento a Beacon House`, `## II. El equipaje de un optimista`,
  `## III. La bandera de Beacon`, `## IV. El jardín del dios`, `## V. El bromista alegórico`; segunda
  parte: `## I. El ojo de la muerte, o la acusación de asesinato`, `## II. Los dos coadjutores, o la
  acusación de robo`, `## III. El camino redondo, o la acusación de abandono`, `## IV. Las bodas
  locas, o la acusación de poligamia`, `## V. Cómo se fue el gran viento de Beacon House`. Un tramo
  que es la segunda mitad de un capítulo (sufijo `b`) no lleva encabezado.
- Nombres sin traducir: Innocent Smith, Michael Moon, Arthur Inglewood, Rosamund Hunt, Mary Gray,
  Diana Duke, la señora Duke, el doctor Herbert Warner, Cyrus Pym, Moses Gould, Beacon House,
  Croydon, Highbury, Hampstead y demás lugares. Mr./Mrs./Miss → señor, señora, señorita; Dr. →
  doctor. El «High Court of Beacon» → el Alto Tribunal de Beacon. «curate» (clérigo anglicano) →
  coadjutor. «Man alive!» → «¡Hombre vivo!» (da título al libro: siempre igual).
- Tratamiento: «usted» entre adultos por defecto; «tú» entre amigos de juventud o íntimos
  (Michael y Arthur; Smith con ellos), entre enamorados y esposos, y a niños. Plural: «ustedes».
  Una vez fijado entre dos personajes no cambia, salvo que el original marque el paso a la
  intimidad.
- Cyrus Pym habla un inglés norteamericano pomposo y Moses Gould uno popular de Londres: se
  marca con el léxico y la sintaxis (afectación en Pym, desparpajo en Gould), nunca con faltas de
  ortografía ni dialecto fonético.
- Las cartas y documentos que se leen en el juicio (segunda parte) van como párrafos normales
  entre comillas, o en bloque `> ` si el original los aparta como texto largo.
- Referencias literarias y bíblicas: se traducen del inglés que trae el libro; versos citados, en
  verso libre castellano que conserve el sentido y la imagen, cada verso en su línea dentro de `> `.
- Cursiva del original (`_texto_`) → `*texto*`. Las rayas largas del original (incisos y frases
  cortadas) pasan a comas, paréntesis o puntos suspensivos.

## Ortodoxia (Chesterton, *Orthodoxy*, 1908, desde el inglés)

Original: Project Gutenberg n.º 130, partido en tramos en `fenix_fuentes/ortodoxia/tramos/NN_cX.txt`;
la salida va en `editorial/chesterton-orthodoxy-es/NN_cX.md` (mismo nombre). Es un ensayo de
apologética en primera persona, conversador y lleno de paradojas: que cada paradoja y cada imagen
funcionen en castellano sin dejar de ser fieles. Las frases muy largas se pueden ordenar, nunca
recortar.

- Encabezados: `## Prefacio`, `## I. Introducción en defensa de todo lo demás`, `## II. El
  maníaco`, `## III. El suicidio del pensamiento`, `## IV. La ética del país de los elfos`,
  `## V. La bandera del mundo`, `## VI. Las paradojas del cristianismo`, `## VII. La revolución
  eterna`, `## VIII. El romance de la ortodoxia`, `## IX. La autoridad y el aventurero`. Un
  tramo que es la segunda mitad de un capítulo (sufijo `b`) no lleva encabezado. La firma del
  prefacio («Gilbert K. Chesterton.») queda como párrafo propio al final.
- Tratamiento: el «you» genérico va impersonal o con «uno»; si interpela al lector, «usted»;
  plural, «ustedes». A Dios y a Cristo, «tú», con la regla de mayúsculas de arriba.
- Nombres propios como en castellano se conocen: Tolstói, Nietzsche, Bernard Shaw, H. G. Wells,
  Ibsen, Haeckel, Swinburne, Walt Whitman, Juana de Arco, san Francisco, Tomás Becket; los que no
  tienen forma castellana, sin traducir. Mr. → el señor (Mr. McCabe → el señor McCabe).
- Glosario: orthodoxy → ortodoxia; Elfland → el país de los elfos; fairyland → el país de las
  hadas; fairy tales → cuentos de hadas; the Doctrine of Conditional Joy → la Doctrina de la
  Alegría Condicional; the Church → la Iglesia; Christendom → la cristiandad; creed → credo;
  the Fall → la Caída; original sin → pecado original; the Incarnation → la Encarnación;
  free will → libre albedrío; materialist → materialista; determinist → determinista;
  rationalist → racionalista; progress → progreso; sanity → cordura; madman / maniac → loco /
  maníaco; mystic → místico; romance (aventura, novela) → según el contexto, «aventura» o
  «romance», nunca «romance» en el sentido de amorío; patriotism → patriotismo; the
  cosmos → el cosmos; Mr. Blatchford → el señor Blatchford.
- Citas bíblicas: se traducen del inglés que trae el libro, en cursiva si él las destaca;
  referencias al estilo castellano si las da.
- Versos citados: en verso libre castellano que conserve el sentido y la imagen, cada verso en su
  línea dentro de `> `. Las citas en prosa van entre comillas «...» en el párrafo. No se agregan
  notas al pie en la traducción: el revisor las pone después, verificadas.
- Cursiva del original (`_texto_`) → `*texto*`; las mayúsculas de énfasis del original
  (palabras enteras en mayúscula al abrir un capítulo) van en minúscula normal. Las rayas largas
  del original pasan a comas, paréntesis o puntos suspensivos.

## El jardín secreto (Burnett, *The Secret Garden*, 1911, desde el inglés)

Original: Project Gutenberg n.º 113, partido en tramos en
`fenix_fuentes/jardin-secreto/tramos/NN_cX.txt`; la salida va en
`editorial/burnett-secret-garden-es/NN_cX.md` (mismo nombre). Es una novela para niños y
grandes, de prosa sencilla y cálida: frases claras, sin cultismos (error 15), que un niño de
diez años pueda leer en voz alta. Las rayas largas del original pasan a comas, paréntesis o
puntos suspensivos; cursiva (`_texto_`) → `*texto*`.

- Encabezados: un tramo con varios capítulos lleva el encabezado de cada uno donde empieza,
  `## I. No queda nadie`. Títulos fijos: I. No queda nadie; II. La señorita Mary, siempre
  contraria; III. Al otro lado del páramo; IV. Martha; V. El llanto en el pasillo;
  VI. «¡Había alguien llorando, sí que había!»; VII. La llave del jardín; VIII. El petirrojo que
  mostró el camino; IX. La casa más extraña en que haya vivido nadie; X. Dickon; XI. El nido del
  zorzal charlo; XII. «¿Podría tener un pedacito de tierra?»; XIII. «Soy Colin»; XIV. Un joven
  rajá; XV. Haciendo nidos; XVI. «¡No quiero!», dijo Mary; XVII. Una pataleta; XVIII. «No hay
  que perder ni un rato»; XIX. «¡Ha llegado!»; XX. «¡Viviré para siempre, y siempre, y
  siempre!»; XXI. Ben Weatherstaff; XXII. Cuando se puso el sol; XXIII. Magia; XXIV. «Que se
  rían»; XXV. La cortina; XXVI. «¡Es la madre!»; XXVII. En el jardín.
- Nombres sin traducir: Mary Lennox, Colin Craven, Archibald Craven (el señor Craven), el
  doctor Craven, la señora Medlock, Martha, Dickon, Susan Sowerby (la señora Sowerby), Ben
  Weatherstaff, John, Pitcher, Misselthwaite (la mansión de Misselthwaite), Thwaite, Yorkshire,
  la India. Mr./Mrs./Miss → señor, señora, señorita; Master Colin → el señorito Colin.
  Ayah → el aya (Aya, con mayúscula, cuando la nombran así); Mem Sahib → Mem Sahib; Rajah →
  rajá.
- Glosario: moor → páramo; heather → brezo; gorse → aulaga; broom → retama; robin → petirrojo;
  missel thrush → zorzal charlo; crocus → azafrán; snowdrop → campanilla de invierno;
  daffodil y narcissus → narciso; jonquil → junquillo; daffydowndilly (palabra de campo de
  Martha y Dickon) → trompón, siempre, para no chocar con narcissus en la misma lista;
  wutherin' / wuthering (el viento) → «ulular», entre comillas donde el original la marca;
  bulb → bulbo; seeds → semillas; trowel → pala de jardín; spade → pala;
  rake → rastrillo; fork (de jardín) → horquilla; the Magic → la Magia (con mayúscula cuando
  Colin la nombra así); scientific experiment → experimento científico; tantrum → pataleta;
  hunchback / a lump on his back → jorobado / un bulto en la espalda; nurse → enfermera
  (cuando cuida a Colin) o niñera (a un niño sano).
- La rima infantil, siempre igual: «Señorita Mary, siempre contraria, / ¿cómo crece tu jardín? /
  Con campanillas de plata y conchitas de mar, / y caléndulas todas en fila». «Contrary»
  aplicado a Mary → «contraria» en todo el libro.
- El himno del capítulo XXVI, en bloque `> `: «Alaben a Dios, de quien mana todo bien; /
  alábenlo, criaturas de la tierra; / alábenlo en lo alto, ejércitos del cielo; / alaben al
  Padre, al Hijo y al Espíritu Santo. / Amén.» Cuando lo citan después: «Alaben a Dios, de quien
  mana todo bien». Mayúsculas de Dios con la regla de arriba.
- **El habla de Yorkshire** (Martha, Dickon, Ben Weatherstaff, la señora Sowerby, y Mary y Colin
  cuando juegan a hablarla) es parte de la trama: el libro hace notar que Martha tutea a Mary y
  más adelante los niños la aprenden como señal de cariño. Se marca así, igual en todos los
  tramos:
  1. **Tuteo**: quien habla de Yorkshire (tha, thee, thy) trata de «tú» a todos, también a
     Mary, a Colin y a los mayores. Quien habla inglés corriente sigue el tratamiento normal.
  2. **Léxico y sintaxis de campo**, sin regionalismos de un país: «nada de nada», «algo»,
     «no has de», «tienes que», «es lo que digo yo», «allá arriba en el páramo», diminutivos
     cariñosos, frases cortas y repetidas, «no, pues», «sí que sí».
  3. **Solo estas tres formas fonéticas**, nunca otras: «pa'» (para), «na'» (nada) y «'tá»
     (está), y con mesura (no más de una o dos por parlamento).
  4. «wick» (vivo, en Dickon) se deja como *wick* en cursiva cuando el texto lo explica o lo
     usa como palabra suya; si no, «vivo». Yorkshire, «nowt», «summat», «munnot» no se dejan en
     inglés: se traducen.
- Tratamiento fuera del habla de Yorkshire: la señora Medlock y las demás criadas que hablan
  inglés corriente, y la enfermera de Colin, tratan de «usted» a Mary y a Colin («señorita Mary»,
  «señorito Colin»), y Martha también cuando le habla a Colin en inglés corriente («sir»); los
  niños tratan de «usted» a los mayores; los mayores tutean a los niños; Mary y Colin se tutean
  entre sí. Plural: «ustedes». Mary tutea a Martha (la trata como a una criada, y después como
  amiga) y a Dickon.
- Animales de Dickon: Captain → Capitán (el zorro), Soot → Hollín (el cuervo), Jump → Salto
  (el poni), Nut y Shell → Nuez y Cáscara (las ardillas); «caw-caw» → *cra, cra*. Delphiniums → espuelas de caballero (delfinios cuando
  Colin deletrea la palabra científica).
- Diálogo con verbo de decir después: coma tras el cierre de comillas, también tras ? o ! (RAE):
  «¿Vienes?», preguntó; «¡Ay!», dijo Martha. Sin verbo de decir, punto: «¿Vienes?». Ella...
  El punto final va siempre fuera de la comilla de cierre, también al final del párrafo:
  «La mía es negra». / «¿Vienes?».
- Notas al pie: no se agregan; el revisor las pone después, si hacen falta.
