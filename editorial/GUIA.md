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

## Pronombres que se refieren a Dios: con mayúscula (norma de Fénix)

Cuando se refieren a Dios, a Cristo o al Espíritu Santo: Tú, Ti, Te, Tu, Tus, Él, Su, Sus, Le, Lo,
Contigo, Suyo/Suya. Ejemplos: «Grande eres, Señor», «nos hiciste para Ti», «Tu misericordia»,
«Él me llamó», «lo que Le agrada». Los enclíticos van en minúscula, pegados al verbo:
«alabarte», «buscarlo», «amarle». Para la Virgen y los santos, minúscula.

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
