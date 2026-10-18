# Revisión historia_C (tramos 11 a 15, capítulos VII a IX)

Revisé párrafo por párrafo contra `tramos\` estos archivos: historia_11_cap07_1, historia_12_cap08_1,
historia_13_cap08_2, historia_14_cap09_1 e historia_15_cap09_2. No falta ninguna oración ni ningún párrafo.
Las ilustraciones se omitieron bien.

**Poema de historia_11.** El único poema del tramo («Vivre d'amour, ce n'est pas sur la terre...»)
está dentro de un bloque `[Illustration: D'après une photographie de Janvier 1888 ...]`. Por eso la
omisión es correcta y no se tradujo. El texto corrido no trae más versos.

**Notas 57 (historia_11) y 101 (historia_15).** Las dos llamadas ya estaban en su lugar:
`...nadie me reconociera*[^57]: tenía sed...` y `...es suave y ligero*[^101]: cuando se lo acepta...`.
El aviso de `control.py` es un falso positivo: la expresión `\[\^(\d+)\](?!:)` descarta toda llamada
seguida de dos puntos, y en ambos casos el original pone dos puntos justo después. En Markdown, una
llamada en medio de la línea seguida de «:» sigue siendo una llamada. Las definiciones son las que
empiezan la línea. Conviene cambiar el control para que descarte solo `^\[\^n\]:`. No toqué la
puntuación del original para contentar al control.

## 1. Correcciones de sentido

**historia_11_cap07_1**
- «Dans les rares directions...»: «me reprendían todavía» → «usted me reprendía todavía» (es la priora quien reprende; el impersonal lo diluía).
- «Ce que je venais faire au Carmel»: «*Vengo para salvar almas, y sobre todo para rogar...*» → «*He venido para salvar las almas, y sobre todo para orar...*» (*je suis venue*, declaración del examen canónico).
- «Bien loin de leur cacher...»: «mis superioras... para ellas» → «mis superiores... para ellos» (*supérieurs* en masculino: incluye al superior eclesiástico). También «sus superiores» en el diálogo con la antigua Madre.
- «La petite fleur transplantée...»: «se abrió a la sombra de Su cruz» → «floreció a la sombra de Su cruz» (*s'épanouit*).
- «Céline lui ayant confié...»: «Luego, ofreciéndome su brazo, hicimos...» (gerundio con otro sujeto) → «Luego me ofreció su brazo e hicimos...».
- «Tout le monde s'étonna...»: «encontrando que yo tenía un gusto singular al amar la nieve» → «pues les parecía un gusto bien singular el mío de amar la nieve».
- «Je me rappelle qu'au mois de juin 1888»: «sorprendí a nuestra Maestra diciéndole» (se leía «la pillé diciendo») → «dejé sorprendida a nuestra Maestra al decirle».
- Mismo párrafo: «¡Ah, no dije entonces que podía sufrir más!» → «¡Ah, entonces ya no dije que podía sufrir más!» (*je n'ai pas dit alors*: después de la prueba ya no lo decía; la versión anterior lo situaba en junio de 1888).
- «Mon désir de souffrances...»: «las aguas de la tribulación que yo había llamado con todos mis votos» → «que yo había deseado con toda el alma» (*appeler de tous ses vœux* es una locución; «votos» era un calco que se confundía con los votos religiosos).
- «Pendant mon postulat...»: «Jesús lo sufría con paciencia; porque no gusta de mostrar todo...» → «Jesús lo soportaba con paciencia, porque no Le gusta mostrarlo todo a las almas a la vez».
- «Ma première victoire...»: «Un pequeño vaso... se encontró roto... haberlo dejado abandonado» → «Un pequeño florero... apareció roto... haberlo dejado fuera de su sitio» (*laisser traîner*).

**historia_12_cap08_1**
- «Faut-il vous parler...»: «Lejos de ser consolada, la aridez... fue mi suerte» (anacoluto) → «Lejos de recibir consuelo, tuve por herencia la aridez más absoluta».
- Mismo párrafo: «hacer continuamente gastos y adelantos» (calco de *faire des frais et des avances*) → «tomarse continuamente molestias y dar siempre el primer paso».
- «Vraiment, je suis loin...»: «Debería no alegrarme... sino atribuirla» → «No debería alegrarme... sino atribuirla».
- «Pendant la pieuse veille...»: «engañaba a las superioras» → «a los superiores» (*les supérieurs*).
- Invitación: «la Vuelta de las Bodas» → «la Tornaboda» (*Retour de Noces*, término castellano exacto).
- «Le jour où cette vénérée Mère...»: «me causaba pena, cuando» → «y eso me apenaba, cuando».
- «Je l'étais aussi...»: «los pequeños lienzos destinados a recibir a Jesús» → «los pequeños pañales» (*langes*: la imagen es la del Niño envuelto en pañales).
- Mismo párrafo: «*Sed santos, los que tocáis los vasos del Señor*» → «*Sé santo, tú que tocas los vasos del Señor*» (el original va en singular, dirigido a un diácono; además, la guía excluye el «vosotros»).
- «Jésus, caché lui aussi...»: «logré varios trabajos de pintura» → «me salieron bien varios trabajos de pintura».

**historia_13_cap08_2**
- «Dans cette impuissance...»: «es por encima de todo el Evangelio el que me sustenta... allí saco todo lo que es necesario a» → «por encima de todo, es el Evangelio lo que me sostiene...; de él saco todo lo que necesita mi pobre almita».
- Mismo párrafo: «No es lo más frecuente en las horas de oración cuando brillan» → «Las más de las veces no brillan ante mis ojos en las horas de oración, sino...».
- «O mon Dieu, votre amour méprisé...»: «Te alegrarías de no comprimir las llamas» → «serías feliz de no reprimir ya las llamas».

**historia_14_cap09_1**
- «Tous les bien-aimés de Dieu...»: «*Decid al justo...*» → «*Digan al justo...*» (guía: «ustedes»).
- «Alors j'ai demandé aux Livres saints...»: «los llevaré en Mi seno y los mecerá» → «los meceré» (error de persona).
- «Je vous l'avoue... torcer bellas frases» → «hilvanar bellas frases» (*tourner de belles phrases*; «torcer» decía lo contrario).
- «Le jeudi soir...»: «sentí un flujo subir burbujeando» → «sentí una oleada que subía borboteando» (la hemoptisis).
- «A cinq heures...»: «tenía algo feliz que descubrir» → «iba a enterarme de algo feliz».
- «Je suppose que je suis née...»: «Supongo que he nacido» → «Supongamos que he nacido» (es una hipótesis de comparación, no una suposición sobre sí misma).
- «Aussi, malgré cette épreuve...»: «Así, a pesar» → «Por eso, a pesar» (*aussi* consecutivo).
- Mismo párrafo: «Cuanto más intenso es el sufrimiento, menos aparece a los ojos de las criaturas, más Te hace sonreír» (tres miembros sueltos; se leía como si a más intensidad, menos visible) → «Cuanto más intenso es el sufrimiento y menos aparece a los ojos de las criaturas, ¡más Te hace sonreír, oh Dios mío!».
- «Ah! jamais je n'ai si bien senti...»: «antes creo que me habría arrojado» (*antes* ambiguo, «más bien») → «en otro tiempo, creo, me habría arrojado».
- «Ma Mère, vous êtes la boussole...»: «si a usted le pluguiera» (arcaico) → «si a usted le pareciera bien».

**historia_15_cap09_2**
- «Un jour, pendant la récréation...»: «con tanta calma que mi vecina terminó... antes que yo» (resultado) → «con la lentitud suficiente para que mi vecina doblara la suya antes que yo» (*pour que*: era intencional; ahí está el sentido de la anécdota).
- Mismo párrafo: «obrado por natural» → «obrado por temperamento» (*par nature*).
- «...avec saint Paul»: «ser juzgado... a mí mismo» → «ser juzgada... a mí misma» (Teresa adapta la cita a sí misma: *jugée*).
- «Donner à toutes celles...»: «incluso, cuando se le pide» → «además, cuando se pide»; «le da *por favor*» (se leía «por favor» de cortesía) → «le da *como un favor*» (*par grâce*).
- «Une sainte religieuse...»: «sino que, penetrando hasta el santuario..., se admira su belleza» (cambio de sujeto) → «admira su belleza».
- «Souvent aussi...»: «Y en estas circunstancias» → «Y en esto» (*sur ces entrefaites*).
- «Vous étiez malade...»: «a devolver en su enfermería las llaves» → «a dejar en su enfermería las llaves».
- «...dont le fond était ceci»: «la hermana Teresa del Niño Jesús» → «sor Teresa del Niño Jesús» (*ma sœur Thérèse*, tratamiento).
- «Me souvenant que...»: «saco de esa mina fecunda» (sin complemento) → «me abastezco en esa mina fecunda».

**Correcciones de pura forma:** 33 (11: 9; 12: 9; 13: 1; 14: 9; 15: 5).
- Signos de exclamación que se habían perdido o no cerraban: «¡Con qué profunda alegría repetía: «Ahora estoy aquí para siempre»!», «¡Ah! Como el de Jesús...», «¡*lo vi todo cubierto de nieve*!», «¡*son Tus brazos, oh Jesús*!».
- Diálogo con la antigua Madre (11), pasado a comillas cerradas por intervención.
- «Contigo» con mayúscula (11).
- «Santísima Virgen» según el glosario (4 casos en 11 y 12).
- Separadores `\* \* \* \* \*` de 14 y 15 sin escapar, como en 11, 12 y 16 a 22.
- Galicismos de relieve («es a usted a quien debe», «es en la paz... como saboreo», «es en medio de los sacrificios como», «no es para vivir con mis hermanas por lo que», «no es con la intención... como dejaría», «es a través de este espejo... como contemplo»).
- Calcos menores: «¡Cuántas veces no he hecho la dulce experiencia!», «hacer la comunión» → «recibir la comunión», «hacer toda mi felicidad», «hacer una sonrisa» (×2), «Un cierto día», «O bien todavía», «aciano» → «acianos», «rayos tibios» → «bien cálidos» (*bien chauds*), «conservo con cariño» → «como un tesoro» (*précieusement*), «El mismo Nuestro Señor» → «Nuestro Señor mismo».

## 2. Auditoría teológica

| Pasaje | Dictamen | Fuente (CEC n.º) | Corrección |
|---|---|---|---|
| 14: «aun cuando les parezca cierto que los superiores se equivocan» (obediencia religiosa) | conforme (traducción fiel); se lee mal sin contexto | 915; 1790 y 2242 (no se obedece contra la conciencia ni la ley moral) | ninguna en el texto; nota del editor (ver 3) |
| 12: el sacerdote del retiro asegura que «las faltas no entristecían al buen Dios» | conforme (fiel; *ne faisaient pas de peine*); se lee mal sin contexto | 1855, 1863 (el pecado venial hiere la caridad) | ninguna; nota del editor (ver 3) |
| 13: «no puedo temer el purgatorio... el fuego del amor es más santificante que el del purgatorio» | conforme | 1030-1032, 1472, 1394 | ninguna; nota opcional (ver 3) |
| 12: «que el purgatorio no encerrara ya a un solo cautivo»; «que la prueba de mi padre le sirviera de purgatorio»; Madre Genoveva «fue derecho al cielo» | conforme (deseo y opinión piadosa, en su grado) | 1030-1032, 1472-1473 | ninguna |
| 11: «nunca ha cometido un solo pecado mortal... gratuitamente, sin mérito alguno de su parte» | conforme («mérito» y «gratuitamente» conservados) | 2010, 2003, 1855 | ninguna |
| 11: «haber manchado la blanca vestidura de mi bautismo» | conforme | 1265 | ninguna |
| 11: «sin la luz interior de la gracia» / «la Santísima Virgen me ayudaba a preparar el vestido de mi alma» | conforme | 2003; 969 | «santísima» → «Santísima» (forma) |
| 11: el padre se ofrece («la palabra *víctima*»); «lo recibió como hostia de holocausto» (Sab 3, 6) | conforme | 618, 1508 (participación en la cruz) | ninguna |
| 12: «Jesús, escondido en el fondo de mi pobre corazoncito, obra en mí» | conforme | 260, 2003 | ninguna |
| 12: comunión diaria «sin que la comunidad compartiera mi dicha» | conforme (disciplina de la época) | 1389 | «hacer la comunión» → «recibir» |
| 12: la invitación («juzgar a vivos y muertos», «Mañana, día de la Eternidad») | conforme | 678-682 | «Vuelta de las Bodas» → «Tornaboda» |
| 13: «Jamás Lo he oído hablar; pero sé que está en mí» | conforme | 260 | ninguna |
| 13: «la justicia... tiene en cuenta nuestras debilidades» | conforme | 211, 270 | ninguna |
| 13: ofrenda al Amor misericordioso frente a las víctimas de la justicia; «consume a Tu pequeña hostia» | conforme («Amor misericordioso», «holocausto» y «hostia» según glosario; no se volvió ofrenda a la justicia) | 1368, 2100 | «comprimir» → «reprimir» |
| 13: «este *amor misericordioso*... no deja en mi corazón ningún rastro de pecado» | conforme | 1394, 1472 | ninguna |
| 14: el caminito y el ascensor («es preciso que siga siendo pequeña») | conforme; no se lee como quietismo, porque el texto mantiene el esfuerzo («me esfuerzo por hacer sus obras») | 526, 2001-2003 | «mecerá» → «meceré» |
| 14: «el buen Dios no necesita de nadie... para hacer el bien en la tierra» | conforme | 306-308 | ninguna |
| 14: noche de la fe, tentaciones, «la noche de la nada», «temería blasfemar» | conforme: se tradujo como duda involuntaria resistida con actos de fe, no como pérdida de la fe | 2088, 164, 2731 | ninguna |
| 14: «almas sin fe... que, por el abuso de las gracias, pierden esos preciosos tesoros» | conforme | 162 | ninguna |
| 14: la mesa de los pecadores, «¡Envíanos justificados!» | conforme (reparación e intercesión) | 618, 2634-2635 | ninguna |
| 14: «si, por imposible, Tú mismo debieras ignorarlo» | conforme (hipótesis imposible, marcada como tal) | 303 | ninguna |
| 14: «la vida religiosa, que los teólogos llaman un martirio» | opinable (sentencia espiritual, no doctrina); bien traducido como atribución a «los teólogos» | 916 | ninguna |
| 14 y 15: el mandamiento nuevo; «como Él lo ama» | conforme | 1823, 2074 | ninguna |
| 15: «cuando soy caritativa es Jesús solo quien obra en mí» | conforme (no excluye la cooperación: la frase siguiente habla de unión) | 2011, 521, 1824 | ninguna |
| 15: «Tú no mandas nada imposible... si Tú mismo no las amas *en mí*» | conforme | 2082 (Trento, DH 1536) | «Porque quieres...» → «Precisamente porque quieres..., » (forma) |
| 15: «la caridad cubre la multitud de los pecados» | conforme | 1434 | ninguna |

**Resultado:** 26 pasajes auditados. Quedan 25 `conforme` y 1 `opinable`. Ninguno es `impreciso` ni
`erróneo` en la traducción.

## 3. Propuestas de nota del editor

1. **historia_14, obediencia** («aun cuando les parezca cierto que los superiores se equivocan»).
   Una nota de una línea: Teresa habla de lo opinable y de lo prudencial dentro de la vida
   religiosa. La obediencia nunca obliga a lo que es pecado (CEC 1790, 2242; CIC can. 601). Así no
   se lee como obediencia ciega.
2. **historia_12, «las faltas no entristecían al buen Dios».** Se trata de faltas involuntarias y
   de fragilidad, como aclara la propia Teresa más abajo («las pequeñas indelicadezas
   involuntarias de su hijo»). El pecado deliberado, incluso venial, sí hiere la caridad (CEC 1863).
   La nota es breve y opcional.
3. **historia_13, purgatorio.** Teresa expresa su confianza personal en la purificación por el
   amor. No niega el purgatorio: lo llama «lugar de expiación». Una nota opcional puede remitir a
   CEC 1030-1032 y 1472 (la caridad ferviente purifica ya en esta vida).
4. **historia_12, versos de san Juan de la Cruz.** Teresa cita en francés dos estrofas del
   *Cántico espiritual* («En la interior bodega...» y «Mi alma se ha empleado...») y una glosa
   («El amor es tan poderoso en obras...»). La traducción los vierte desde el francés. Para un
   lector de habla hispana sería mejor poner el texto castellano original del santo, con una nota
   que diga de dónde sale. Antes hay que cotejarlo en una edición fiable. No lo cambié porque desde
   aquí no pude verificar la glosa en la fuente, y la regla es no citar de memoria. La decisión
   debe ser la misma en todo el libro (historia_B menciona versos del santo en 07, e historia_E,
   una cita en 21).
5. **historia_15, «Mi morada está enteramente pacificada».** Es el verso de la *Noche oscura* («estando
   ya mi casa sosegada»), en versión francesa. Va igual que el punto 4.
