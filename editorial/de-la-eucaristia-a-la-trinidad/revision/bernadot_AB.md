# Revisión final - Bernadot, grupo AB (tramos bernadot_A y bernadot_B)

Se leyeron enteros los dos originales y las dos traducciones, párrafo por párrafo. Las correcciones quedaron en `salida\bernadot_A.md` y `salida\bernadot_B.md`.

## 1. Correcciones de sentido

**Tramo A**

- «Mais, avant de déborder» (Col 1, 15): «el primogénito de toda criatura» → «el primogénito *antes de* toda criatura», como dice el francés de Bernadot.
- Mismo párrafo: «la vida que inunda Su corazón y Su alma, y sumerge todas Sus potencias» (con la coma, el sujeto parecía Jesús) → «la vida que inunda Su corazón y Su alma y anega todas Sus potencias» (el sujeto es la vida).
- «La communion verse donc» (Ángela de Foligno): «hacer morir la pared humana» → «hacer morir la palabra humana». «paroi» es una errata de OCR por «parole»: en la traducción de Hello del *Libro de las visiones*, cap. 42, se lee «une beauté à faire mourir la parole humaine».
- «C'est dans l'Esprit-Saint, ô Père»: «Él es Tu Don» → «Él es el Don de Ustedes», porque el *votre* se dirige al Padre y al Hijo a la vez (el párrafo sigue en plural).
- Mismo párrafo: «Acaba de entregármelo todo» → «Termina de entregármelo todo», y «Es por Él que acaba de realizarse Tu oración suprema» → «Por Él termina de cumplirse Tu oración suprema». *Achever de* significa «llevar a término»; «acaba de» se leía como un pasado inmediato.
- «Ne semble-t-il pas» (san Agustín): «cree y come» → «crece y come». El francés «crois» viene de *croître*: Agustín escribe *cresce et manducabis me* (*Confesiones* VII, 10).
- Jn 17, 21 (nota 31): la errata del original «vous êtes en mot» ya estaba resuelta como «estás en mí». Se dejó así.
- «Comme le Père qui m'a envoyé est vivant» (Jn 6, 58): «es viviente» → «vive».
- Nota 25: «Sal 30, 8» → «Sal 30, 6». El versículo *In manus tuas* es el 30, 6 de la Vulgata; el original trae una errata de referencia.
- «Éternellement, le Père énonce»: «igual a Él mismo» → «igual a sí mismo», porque es reflexivo.

**Tramo B**

- «Il montre cette Humanité»: «Muestra esa Humanidad que tomó, y que mereció para nosotros» se podía leer como «Cristo mereció la Humanidad». Quedó «Muestra la Humanidad que asumió, la cual mereció por nosotros, y Sus llagas».
- «par l'instrument de son Humanité glorifiée»: «por medio de» → «por el instrumento de». Se recupera el término técnico de la Humanidad como instrumento de la divinidad.
- Sal 4, 7: «como un sello» → «como un signo», como dice el francés (*signe*).
- Trento, «Comme la tête commande aux membres»: «Sesión VI, can. 16» → «cap. 16». El texto citado es el capítulo 16 del decreto sobre la justificación (DS 1546), no el canon 16, que trata de la perseverancia. Es una errata de referencia del original.
- «Christus vita vestra»: «Cristo es su vida… el motor de su vida» (el «su» era ambiguo) → «Cristo es la vida de ustedes… el motor de la vida de ustedes».
- «Il est bon de remarquer»: «la transformación sobrenatural del alma, que aumenta la presencia» (parecía que el alma aumenta la presencia) → «… del alma, que ella [la comunión] aumenta la presencia de las tres divinas Personas».
- «Amour unique, car» (*opera ad extra*): «actúan necesariamente como una sola» → «como uno solo». Es el masculino del original («comme un seul»), es decir, un solo principio (CEC 258). Además, «pues,» → «porque,», para que no se lea «pues» consecutivo.
- «La grâce qui m'arrive… s'écoulant»: «escurriéndose» → «derramándose».
- «Catherine, l'âme en recueille la grâce»: «recoge su gracia» → «recoge de él la gracia» (la del sacramento).
- Jn 6, 57 (nota 48): «vivirá por Mí» → «vivirá por mí». Va en minúscula porque es primera persona de Cristo.
- «Yahvé est mon pasteur» (Sal 22): se conserva «Yahvé» porque el francés lo trae (Bernadot cita a Crampon), según la corrección del coordinador.

**De pura forma:** 19 cambios en total, 12 en A y 7 en B.

- Galicismos y torpezas: «de concierto con», «rehacer», «remonte a», «bien obligado», «es de Él como nuestros», «Él es, Él», «Era menester», «hacer amplio lugar», «a morada fija», «se reencuentra», «declaran» → «manifiestan», «los mil arroyos» → «los otros mil arroyos».
- Unificación de mayúsculas:
  - el «Se» reflexivo pasó a minúscula (5 casos en A, para alinearse con B-F y con la lista de la guía);
  - el posesivo de la santa Humanidad pasó a «Su/Sus» (5 casos en B);
  - en B, «Los precipita… Su vida» (Padre e Hijo) se igualó con el «Los consuma» de A.

**Comprobaciones:**

- Las notas cuadran 1 a 1: A tiene de 1 a 34 y B de 35 a 58, sin la 54, que es correcto. No hay llamadas sin nota ni notas sin llamada.
- Se dejaron intactos la nota 35 (himno) y la nota 38 (Hb 7, 25).
- No quedan rayas largas ni comillas rectas.
- La guardia `revisar_entregable.py` marca solo [mayuscula] tras dos puntos. Son las definiciones de nota `[^N]:` y citas directas sin comillas («Hoy Te he engendrado…», «Señor Jesús», «Jamás irán a mi Padre…»), donde la mayúscula es correcta. Son falsos positivos.

## 2. Auditoría teológica (skill auditar-teologia)

| Pasaje | Dictamen | Fuente (CEC n.º) | Corrección |
|---|---|---|---|
| B, Sal 22 («Yahvé es mi pastor») | conforme | (norma de traducción) | Se conserva porque el francés de Bernadot dice «Yahvé» (Crampon). |
| B, «Muestra esa Humanidad que tomó, y que mereció» | impreciso → corregido | 616, 2011 | «la Humanidad que asumió, la cual mereció por nosotros». |
| B, «por medio de Su Humanidad glorificada» (*instrument*) | impreciso → corregido | 515, 1116 | «por el instrumento de Su Humanidad glorificada». |
| B, *opera ad extra*: «actúan como una sola» | impreciso → corregido | 258 | «como uno solo» (un solo principio). |
| B, «que aumenta la presencia» (sujeto ambiguo) | impreciso → corregido | 1391-1392, 260 | El sujeto ahora es la comunión. |
| A, Agustín «cree y come» | impreciso → corregido | (*Conf.* VII, 10) | «crece y come». |
| A, «Él es Tu Don» (el Espíritu, Don de solo uno) | impreciso → corregido | 245-248, 733 | «el Don de Ustedes»: Don del Padre y del Hijo. |
| A, unión eucarística «como Su santa Humanidad está unida al Verbo» (Crisóstomo) | conforme | 464-469, 1391 | Analogía, no identidad. El texto sigue: «la vida de Jesús y la nuestra siguen siendo distintas, como Su naturaleza y nuestra naturaleza». |
| A, «el Padre engendra allí a Su Hijo, el Padre y el Hijo producen allí al Espíritu Santo» | conforme | 260, 254-255 | Se mantiene, con la propuesta de nota del editor del n.º 1. |
| A, «la comunión… nos Lo da inmediatamente… como la visión» | conforme | 1024, 1402 | El texto marca la diferencia: «por la visión… en la fe». |
| A, «la purificación del purgatorio prepara a la visión» | conforme | 1030-1031 | |
| A, «somos templos… por la gracia la Trinidad entera es huésped del alma» | conforme | 260, 1997 | |
| A, bautismo, confirmación y Eucaristía (santo Tomás, *ST* III, q. 79, a. 1, ad 1) | conforme | 1285, 1303, 1322, 1394 | |
| A, Eucaristía «en el cual los demás reciben su consumación» | conforme | 1374 (cita *ST* III, q. 73, a. 3) | |
| B, «en cuanto las especies se consumen… deja de estar en él según el estado eucarístico» | conforme | 1377 | |
| B, «si ella no permanece por Su sustancia» (no hay presencia sustancial tras las especies) | conforme | 1374, 1377 | «sustancia» conserva su grado técnico. |
| B, «sería un error equiparar la presencia ordinaria… con Su presencia en la Hostia» | conforme | 1374 | |
| B, «la santa Humanidad ha recibido comunicación de este poder divino» | conforme | 515, 470 | Instrumento unido, no un poder propio de la naturaleza humana. |
| B, Trento, influjo de Cristo en los justos | conforme | 2011, 2008 (DS 1546) | Referencia corregida a cap. 16. |
| B, la gracia «penetra la esencia misma de mi alma» y «transformarla en Dios» | conforme | 1999, 1997, 460 | |
| B, «la Trinidad no comienza a habitar en el momento de la comunión… nueva misión invisible» | conforme | 260, 1997 | |
| B, «la vida de la gracia… y la de la gloria… sustancialmente una misma cosa» | conforme | 1997, 1024 | La gracia como germen de la gloria. Es sentencia teológica común (santo Tomás). |
| B, circuminsesión, «El Padre no sería Dios si permaneciera en sí mismo» | conforme | 255, 221 | Retórica de Bernadot; ver la propuesta de nota del editor del n.º 2. |
| B, apropiaciones en santa Catalina (memoria al Padre…) | conforme | 258 | El texto dice «se atribuye». |
| B, «el Creador que, después de haberla engendrado» | conforme | | Fiel al original («engendrée»). Ver la propuesta de nota del editor del n.º 3. |
| B, Newman, «Entra en mi corazón personal y sustancialmente» | conforme | 1374 | Oración, fiel al original. |

**Resultado:** 19 de 26 quedaron `conforme`. Hay 7 `impreciso`, todos de traducción y corregidos en el archivo, y ningún `erróneo`.

## 3. Propuestas de nota del editor

1. **A, sección 3** («el Padre engendra allí a Su Hijo»). Bernadot habla de las procesiones eternas que se hacen presentes en el alma por la inhabitación, no de una generación nueva del Verbo en el alma. Una nota breve evitaría una lectura literal (CEC 260).
2. **B, «El Padre no sería Dios si permaneciera en sí mismo»** y **«El Hijo no sería Dios si no irrumpiera en Su Padre»**. Es lenguaje oratorio sobre la vida trinitaria, que es necesaria y no un movimiento que Dios "necesite" hacia afuera. Conviene una nota que lo aclare, porque se puede leer como si Dios dependiera de algo.
3. **B, «el Creador que, después de haberla engendrado»**. Bernadot aplica «engendrar» a la criatura, que en sentido propio es creada; el sentido es la regeneración por la gracia. Se sugiere una nota opcional.
4. **A, nota 33**. Se puede precisar la referencia: *Confesiones* VII, 10, 16.
5. **A y B, numeración de san Juan**. Las referencias de Jn 6 (6, 57-58; 6, 54) siguen la Vulgata, igual que los salmos. Conviene una nota general del editor al inicio del libro.
