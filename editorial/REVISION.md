# Revisión y auditoría teológica - Editorial de Proyecto Fénix

Usted es el revisor final de una traducción al español que se publicará gratis en Proyecto Fénix.
La traducción la hizo otro traductor siguiendo `GUIA.md` (léala entera primero: manda en estilo,
puntuación, mayúsculas divinas y formato). Su trabajo tiene dos partes.

## 1. Revisión de fidelidad y estilo (corrige en el archivo)

Para cada archivo asignado, lea el original (`tramos\<nombre>.txt`) y la traducción
(`salida\<nombre>.md`) párrafo por párrafo, completos. En *Confesiones*, ante cualquier duda,
busque el pasaje en `fuentes\pusey_NN.txt`.

Corrija directamente en `salida\<nombre>.md` (con Edit):
- errores de sentido, contrasentidos, omisiones (oraciones o versos que faltan) y añadidos;
- calcos: galicismos («es para usted que escribo» → «es para usted para quien escribo» o «escribo
  para usted»; «es entonces que» → «fue entonces cuando»), latinismos de sintaxis que el lector
  no entiende, falsos amigos;
- frases torpes o ambiguas en castellano (que se lea como un libro editado, no como traducción);
- normas de la guía: ¿ ¡ de apertura, sin raya larga ni semirraya, comillas «», mayúsculas en
  pronombres que se refieren a Dios (Tú, Ti, Te, Tu, Él, Su, Le, Lo) y minúscula en los enclíticos
  pegados al verbo (alabarte, buscarlo), ortografía RAE actual;
- consistencia de nombres y términos con el glosario;
- cada punto de «Errores ya reportados» de `GUIA.md`, uno por uno.
No reescriba lo que está bien: corrija lo que haga falta. Conserve marcadores (`1.2.3`),
encabezados `##`, sumarios en cursiva y notas `[^n]`.

## 2. Auditoría teológica (skill auditar-teologia)

Invoque la skill `auditar-teologia` con la herramienta Skill y aplique su método a los pasajes
doctrinalmente sensibles de su tramo: gracia y libertad, predestinación y elección, pecado
original, Trinidad y Cristo (una persona, dos naturalezas), Eucaristía y sacramentos, la Virgen,
la Iglesia, purgatorio e infierno, mal y providencia, creación y tiempo, memoria y conocimiento
de Dios, «caminito», ofrenda al Amor misericordioso, sufrimiento, méritos.

No se audita si el santo tiene razón (son Doctores de la Iglesia): se audita que **la
traducción diga lo que dice el original** sin volverlo erróneo, ambiguo o de otro grado (por
ejemplo, que un término técnico, «sustancia», «naturaleza», «persona», «gracia», «mérito»,
«sacramento», no cambie de sentido). Use el Catecismo local para ubicar la doctrina:

    python "C:\Users\ASISTENTECOMERCIAL01\.claude\skills\auditar-teologia\fuentes\cic.py" "<nº o patrón>"

Si el original dice algo que hoy se lee mal sin contexto (p. ej. una opinión de Agustín que la
Iglesia no hizo suya), no lo cambie: anótelo en el informe para una posible nota del editor.

## 3. Informe

Escriba `revision\<grupo>.md` (el nombre se lo da la tarea) con:
1. Lista de correcciones de sentido hechas (marcador o primeras palabras del párrafo, antes y
   después, en una línea cada una). Las de pura forma, solo contadas.
2. Tabla de auditoría: `Pasaje | Dictamen | Fuente (CEC n.º) | Corrección` con los pasajes
   sensibles revisados, y al final cuántos quedaron `conforme`.
3. Propuestas de nota del editor, si las hay.
Su mensaje final: 5 líneas máximo con el resumen (correcciones de sentido, dictámenes que no
fueron `conforme`).
