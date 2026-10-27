// Catálogo de Proyecto Fénix. Para agregar un libro, copie una ficha y complete sus campos.
// - archivos: rutas en libros/ (solo obras que se pueden difundir libremente).
// - externos: descarga legal en otro sitio (Project Gutenberg, etc.); formato "web" = lectura en línea;
//   idioma del enlace si difiere del libro (el sitio en español no muestra nada en inglés y viceversa)
//   (así van las obras protegidas de san Josemaría, que la Fundación Studium publica en escriva.org).
// - comprar: si no hay descarga libre.
// - Una obra es UNA ficha (regla dura). Antes de agregar un libro, buscarlo por título y autor en
//   este archivo y correr `node herramientas/revisar_duplicados.js` (gen_estaticos.js también lo corre
//   y se detiene si hay duplicados). Otra traducción o idioma va en `versiones` de la misma ficha:
//   versiones: { en: { titulo, autor, anio, resumen, citas, archivos, externos, comprar, fuente,
//   imagen, editorial, parecidos } }; solo lo que cambia (editorial: null si esa versión no es de
//   Fénix). Cada sitio muestra la versión de su idioma. Una ficha que se fusiona deja su id en `alias`.
// - delibris: valoración moral de delibris.org, de 1 a 6 (6 = «Sin inconvenientes»); el texto de
//   cada nivel según el género (Literatura o Pensamiento) está en index.html. null = no está en Delibris;
//   antes de dejarlo en null, correr `node herramientas/revisar_delibris.js` (gen_estaticos.js lo corre
//   y se detiene si el índice de Delibris sí lo trae).
// - porque: «Por qué leerlo», { es, en }: 2 o 3 frases propias sobre a quién le sirve y qué gana el lector
//   (no repite el resumen). Lo de fe se audita con auditar-teologia.
// - citas: textuales, cotejadas con el texto del libro.
// - encuadernador: nombre de quien preparó la ficha (vía A de un encuadernador, sin editorial);
//   con editorial, el crédito va dentro de ese texto.
// - editorial: solo si la edición la hizo Proyecto Fénix (traducción, revisión o edición digital);
//   { es, en } dice qué se hizo. El libro aparece entonces en la sección Editorial.
// - imagen: portada en img/portadas/<id>.jpg (cuadro de dominio público), con su crédito y enlace;
//   se arma con herramientas/portadas.py, que también la pone dentro del EPUB.
//   Obra protegida con portada oficial: src es la URL de la imagen en el sitio del titular (no se copia)
//   y aviso reemplaza el «dominio público» del crédito.

window.FENIX = {
  actualizado: "27-oct-2026", // poner la fecha al cambiar el catálogo
  contacto: {
    // Destino de los formularios (FormSubmit). Cambiarlo aquí si se usa otra casilla.
    formularios: "https://formsubmit.co/ajax/talcaldeg@gmail.com",
    // Enlace de donación (Mercado Pago, PayPal, etc.). Vacío = la sección muestra "en preparación".
    donar: "https://ko-fi.com/proyectofenix"
  },
  // Sello «Recomendados por Fénix»: van primero en la portada y en el catálogo, en este orden.
  // Cada sitio muestra solo los de su idioma (One with Jesus no tiene versión en español).
  recomendadosFenix: ["one-with-jesus", "apologia-de-socrates", "saint-exupery-el-principito", "imitacion-de-cristo", "historia-de-un-alma", "confesiones"],

  libros: [
    {
      id: "marmion-vida-del-alma",
      titulo: "Jesucristo, vida del alma",
      autor: "Beato Columba Marmion, O.S.B.",
      anio: "1917",
      idioma: "es",
      categoria: "lectura",
      recomendado: true,
      resumen: {
        es: "Las conferencias del abad de Maredsous sobre el centro de la vida cristiana: Dios nos llama a ser Sus hijos en Cristo. La primera parte expone el plan divino (Cristo modelo, redentor y fuente de toda gracia; la Iglesia, Su Cuerpo; el Espíritu Santo). La segunda muestra cómo esa vida nace en el bautismo, se apoya en la fe y crece por la muerte al pecado, la Eucaristía, la oración, la caridad y la devoción a la Virgen. Una de las grandes síntesis de teología espiritual del siglo XX.",
        en: "The conferences of the abbot of Maredsous on the heart of Christian life: God calls us to be His children in Christ. Part one sets out the divine plan (Christ as model, redeemer and source of all grace; the Church, His Body; the Holy Spirit). Part two shows how this life is born in baptism, rests on faith and grows through death to sin, the Eucharist, prayer, charity and devotion to Our Lady. One of the great syntheses of spiritual theology of the 20th century."
      },
      porque: {"es":"Para quien quiere entender qué significa ser hijo de Dios más allá de la frase hecha. Marmion ordena la vida cristiana desde su centro, que es Cristo, y ayuda a ver cada práctica, la Misa, la oración, el esfuerzo diario, como parte de un solo plan. Se lee con calma, de a una conferencia.","en":"For anyone who wants to understand what it means to be a child of God beyond the stock phrase. Marmion arranges the Christian life around its centre, Christ, and helps the reader see each practice, the Mass, prayer, daily effort, as part of a single plan. It is best read slowly, one conference at a time."},
      imagen: { src: "img/portadas/marmion-vida-del-alma.jpg", credito: { es: "Cristo Pantocrátor, icono del monasterio de Santa Catalina del Sinaí, siglo VI", en: "Christ Pantocrator, icon from Saint Catherine's Monastery, Sinai, 6th century" }, url: "https://commons.wikimedia.org/wiki/File:CHRIST_PANTOCRATOR-SINAI(6th_Century).jpg" },
      citas: [
        "Toda nuestra santidad se reduce a participar, por medio de la gracia, de la filiación divina de Jesucristo, a ser, por la adopción sobrenatural, lo que Cristo es por naturaleza.",
        "«El cristiano es un nuevo Cristo». Esta es la definición del cristiano que ha dado, si no en los mismos términos, al menos en una expresión equivalente, la tradición entera.",
        "Cristo es verdaderamente la vida del alma, porque es la fuente y el dispensador de esa vida.",
        "La oración enciende y mantiene en el alma una como hoguera, en la cual el fuego del amor está, si no siempre en acción, al menos siempre latente."
      ],
      archivos: { epub: "libros/marmion-jesucristo-vida-del-alma.epub", pdf: "libros/marmion-jesucristo-vida-del-alma.pdf" },
      fuente: { texto: "Edición de la Fundación Gratis Date, autorizada por el abad de Maredsous", url: "https://www.gratisdate.org/" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/jesucristo-vida-del-alma-christ-life-soul" },
      parecidos: ["one-with-jesus", "imitacion-de-cristo", "presencia-de-dios"]
    },
    {
      id: "one-with-jesus",
      titulo: "La vida de identificación con Cristo Jesús",
      autor: "Paul de Jaegher, S.J.",
      anio: "1927",
      idioma: "es",
      categoria: "lectura",
      recomendado: true,
      resumen: {
        es: "Un libro breve y luminoso sobre la «vida de identificación» con Cristo: dejar que Jesús, presente en el alma por la gracia, viva y ame en nosotros. El autor insiste en que esta unión se apoya en la presencia real de Dios en el alma en gracia, no en una simple amistad o imitación exterior, y la recorre desde los comienzos hasta su plenitud, con propósitos para la práctica. Termina con la oración para unirse a Jesús que está en la sección de oraciones. Traducción nueva de Proyecto Fénix, publicada con permiso de los jesuitas de Flandes y de los Países Bajos.",
        en: "A short, luminous book on the «life of identification» with Christ: letting Jesus, present in the soul by grace, live and love in us. The author insists that this union rests on God's real indwelling in the soul in grace, not on mere friendship or outward imitation, and follows it from its beginnings to its fullness, with resolutions for practice. It closes with the prayer to unite oneself to Jesus found in the prayers section. A new Proyecto Fénix translation, published with the permission of the Jesuits of Flanders and the Netherlands."
      },
      porque: {"es":"Para quien ya reza y siente que su relación con Cristo se ha quedado en la admiración o en la costumbre. El libro propone algo más hondo: dejar que Él viva en uno. Es corto y se lee en pocas sesiones, pero conviene volver sobre sus páginas con lápiz en mano, porque pide ser meditado.","en":"For the reader who already prays and feels that the bond with Christ has settled into admiration or habit. The book proposes something deeper: letting Him live in us. It is short and can be read in a few sittings, but it rewards a second pass with a pencil in hand, because it asks to be meditated."},
      imagen: { src: "img/portadas/one-with-jesus-es.jpg", credito: { es: "Francisco Ribalta, «Cristo abrazando a san Bernardo», c. 1625", en: "Francisco Ribalta, «Christ Embracing Saint Bernard», c. 1625" }, url: "https://commons.wikimedia.org/wiki/File:Francisco_Ribalta_001.jpg" },
      citas: [
        "Secundando poderosamente la acción de Dios, no tardarán en hacerse otros Cristos.",
        "Que yo, plenamente identificado contigo, llegue a ser para Ti como otra humanidad.",
        "Toda mi vida espiritual puede entonces resumirse en morir a mí mismo, por amor de Jesús, para que Él viva y ame en mí.",
        "Hijo mío, dame tu corazón, para que en ti y por ti, en una vida de unión, yo ame, o más bien amemos juntos, ardientemente al Padre."
      ],
      archivos: { epub: "libros/de-jaegher-la-vida-de-identificacion.epub", pdf: "libros/de-jaegher-la-vida-de-identificacion.pdf" },
      editorial: { es: "Traducción nueva de Proyecto Fénix, hecha desde la traducción inglesa de 1929 (el original francés de 1927 no está digitalizado), con el prefacio, los cuatro capítulos, los propósitos, la conclusión y la oración final, las notas del autor y cuatro notas del editor, revisada en sus pasajes doctrinales contra el Catecismo; preparada con ayuda de inteligencia artificial, con nota de la edición y portada nueva. Se publica gratis con permiso de los jesuitas de Flandes y de los Países Bajos, titulares de los derechos.", en: "A new Proyecto Fénix translation, made from the 1929 English translation (the 1927 French original is not digitized), with the preface, the four chapters, the resolutions, the conclusion and the closing prayer, the author's notes and four editor's notes, reviewed in its doctrinal passages against the Catechism; prepared with the help of artificial intelligence, with an edition note and a new cover. Published free of charge with the permission of the Jesuits of Flanders and the Netherlands, who hold the rights." },
      fuente: { texto: "Traducción de Proyecto Fénix desde One with Jesus (1929), con permiso de los jesuitas de Flandes y de los Países Bajos; gratis y sin fines comerciales", url: "https://archive.org/details/1953PaulDeJaegherSJOneWithJesus600dpi" },
      delibris: null,
      versiones: {
        en: {
          titulo: "One with Jesus: The Life of Identification with Christ",
          autor: "Paul de Jaegher, S.J.",
          anio: "1929",
          imagen: { src: "img/portadas/one-with-jesus.jpg", credito: { es: "Francisco Ribalta, «Cristo abrazando a san Bernardo», c. 1625", en: "Francisco Ribalta, «Christ Embracing Saint Bernard», c. 1625" }, url: "https://commons.wikimedia.org/wiki/File:Francisco_Ribalta_001.jpg" },
          citas: [
            "Powerfully seconding the action of God, it will not be long before they become other Christs.",
            "May I, fully identified with You, become like another humanity to You.",
            "My whole spiritual life may then be summed up in dying to self, through love of Jesus, so that he may live and love in me.",
            "My son, give me your heart, that in you and through you, in a life of union I may love, or rather we may love the Father ardently."
          ],
          archivos: {},
          comprar: [
            { texto: "Barnes & Noble", url: "https://www.barnesandnoble.com/w/one-with-jesus-paul-de-jaegher/1140532926" },
            { texto: "Amazon (ISBN 9781989905890)", url: "https://www.amazon.com/s?k=9781989905890" }
          ],
          fuente: { texto: "English translation of 1929 (Burns Oates); Newman Press reprint, 1953", url: "https://openlibrary.org/books/OL19427278M" },
          editorial: null
        }
      },
      parecidos: ["marmion-vida-del-alma", "imitacion-de-cristo", "presencia-de-dios"]
    },
    {
      id: "tardif-jesus-esta-vivo",
      titulo: "Jesús está vivo",
      autor: "P. Emiliano Tardif, M.S.C., y José H. Prado Flores",
      anio: "1984",
      idioma: "es",
      categoria: "lectura",
      resumen: {
        es: "El testimonio del padre Emiliano Tardif, misionero del Sagrado Corazón en República Dominicana. En 1973 una tuberculosis lo obligó a volver a Canadá y, según cuenta, sanó de forma inesperada después de que un grupo de la Renovación Carismática rezara por él. El libro, escrito con José H. Prado Flores, narra cómo nació de ahí su ministerio de predicación y oración por los enfermos, primero en Nagua y Pimentel, y explica la curación física, la interior y la del espíritu, que pasa por la reconciliación, junto con lo que la sostiene después: los sacramentos, la oración, la Palabra de Dios, la comunidad y el servicio.",
        en: "The testimony of Fr. Emiliano Tardif, a Missionary of the Sacred Heart in the Dominican Republic. In 1973 tuberculosis forced him back to Canada and, by his own account, he was unexpectedly healed after a Charismatic Renewal prayer group prayed over him. The book, written with José H. Prado Flores, tells how his ministry of preaching and praying for the sick grew from there, first in Nagua and Pimentel, and explains physical healing, inner healing and the healing of the spirit through reconciliation, together with what sustains it afterwards: the sacraments, prayer, the Word of God, community and service."
      },
      porque: {"es":"Para quien cree en Dios pero lo siente lejano, o piensa que Jesús ya no actúa hoy como en el Evangelio. Es un relato sencillo, de primera mano, que se lee en una tarde y anima a rezar con más confianza. También sirve a quien acompaña a un enfermo: trae oraciones por la curación física e interior, sin prometer que toda oración la obtenga.","en":"For anyone who believes in God but feels Him distant, or thinks Jesus no longer acts today as He did in the Gospel. It is a simple, first-hand account that can be read in an afternoon and encourages more trusting prayer. It also helps those who care for the sick: it includes prayers for physical and inner healing, without promising that every prayer will obtain it."},
      imagen: { src: "img/portadas/tardif-jesus-esta-vivo.jpg", credito: { es: "Carl Bloch, «Curación del ciego», 1871", en: "Carl Bloch, «Healing of the Blind Man», 1871" }, url: "https://commons.wikimedia.org/wiki/File:Healing_of_the_Blind_Man_by_Jesus_Christ.jpg" },
      citas: [
        "Es imposible dejar de hablar de lo que se ha visto y oído.",
        "Es un grito que se levanta dando esperanza a todos aquellos que se atreven a creer que el Jesús que murió en la cruz ha resucitado y está vivo.",
        "Pero mi confianza estaba en Jesús, que es el mismo, ayer, hoy y siempre.",
        "Siempre que le pedimos perdón al Señor, sea lo que sea, Él nos perdona. Él jamás se escandaliza de nuestros pecados."
      ],
      archivos: {},
      comprar: [
        { texto: "Buscalibre (ISBN 9788428511247)", url: "https://www.buscalibre.cl/libros/search?q=9788428511247" },
        { texto: "Amazon (ISBN 9788428511247)", url: "https://www.amazon.com/s?k=9788428511247" }
      ],
      fuente: { texto: "Imprimatur del arzobispo de Santo Domingo, 1984; edición de San Pablo (obra protegida por derechos de autor)", url: "https://openlibrary.org/works/OL34833242W" },
      delibris: null,
      parecidos: ["marmion-vida-del-alma", "imitacion-de-cristo", "one-with-jesus"]
    },
    {
      id: "imitacion-de-cristo",
      titulo: "Imitación de Cristo o menosprecio del mundo",
      autor: "Tomás de Kempis (trad. fray Luis de Granada)",
      anio: "c. 1418",
      idioma: "es",
      categoria: "lectura",
      recomendado: true,
      resumen: {
        es: "El clásico de la devoción moderna, en cuatro libros: consejos para la vida espiritual, la vida interior, el consuelo interior en diálogo con Cristo y el Santísimo Sacramento. Frases cortas, directas, para leer de a poco y volver a ellas toda la vida. Esta es la traducción de fray Luis de Granada, con su prólogo, transcrita en 2009 de una edición de 1817 con la ortografía modernizada; donde a esa edición le faltaban páginas, se usó la traducción del P. Juan Eusebio Nieremberg, como explica la nota inicial de esta edición.",
        en: "The classic of the devotio moderna, in four books: counsels for the spiritual life, the interior life, inward consolation in dialogue with Christ, and the Blessed Sacrament. Short, direct sentences, to be read slowly and returned to for a lifetime. This is the Spanish translation by Fray Luis de Granada, with his prologue, transcribed in 2009 from an 1817 edition with modernized spelling; where that edition had missing pages, the translation of Fr. Juan Eusebio Nieremberg is used, as the opening note of this edition explains."
      },
      porque: {"es":"Para quien busca un libro de cabecera que no se agote: sus frases cortas caben en cinco minutos y dan para pensar todo el día. Sirve en épocas de cansancio o de dispersión, porque devuelve la atención a lo esencial sin discursos largos. Se abre en cualquier página y siempre dice algo.","en":"For anyone looking for a bedside book that never runs dry: its short sentences fit into five minutes and give enough to think about all day. It helps in seasons of tiredness or distraction, because it brings attention back to the essential without long speeches. It can be opened at any page and always has something to say."},
      imagen: { src: "img/portadas/imitacion-de-cristo.jpg", credito: { es: "El Greco, «Cristo con la cruz», c. 1590", en: "El Greco, «Christ Carrying the Cross», c. 1590" }, url: "https://commons.wikimedia.org/wiki/File:El_Greco_-_Christ_Carrying_the_Cross_-_Google_Art_Project.jpg" },
      citas: [
        "Vanidad de vanidades y todo vanidad, sino amar y servir a sólo Dios.",
        "Ciertamente el día del juicio no nos preguntarán qué leímos, mas qué hicimos; ni cuan bien hablamos, mas cuán honestamente vivimos.",
        "Porque el hombre propone, mas Dios dispone; y no es en mano del hombre su camino.",
        "Estar sin Jesús es grave infierno. Estar con Jesús es dulce paraíso.",
        "Ponte primero a ti en paz, y después podrás apaciguar a los otros."
      ],
      archivos: { epub: "libros/kempis-imitacion-de-cristo-granada.epub", pdf: "libros/kempis-imitacion-de-cristo-granada.pdf" },
      fuente: { texto: "Transcripción de 2009 de la edición de 1817, en Internet Archive (dominio público); sin las notas al pie del transcriptor, con nota y portada de Proyecto Fénix", url: "https://archive.org/details/imitacion-de-cristo-de-fray-luis-de-granada" },
      editorial: { es: "Edición digital de Proyecto Fénix sobre la impresión de 1817, a partir de una transcripción de 2009: sin las notas al pie del transcriptor, con una nota de la edición y portada nueva.", en: "Proyecto Fénix digital edition of the 1817 printing, from a 2009 transcription: without the transcriber's footnotes, with an edition note and a new cover." },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/imitacion-de-cristo" },
      parecidos: ["marmion-vida-del-alma", "escriva-amigos-de-dios", "para-mi-vivir-es-cristo"],
      versiones: {
        en: {
          titulo: "The Imitation of Christ",
          autor: "Thomas à Kempis",
          imagen: { src: "img/portadas/imitacion-de-cristo-en.jpg", credito: { es: "El Greco, «Cristo con la cruz», c. 1590", en: "El Greco, «Christ Carrying the Cross», c. 1590" }, url: "https://commons.wikimedia.org/wiki/File:El_Greco_-_Christ_Carrying_the_Cross_-_Google_Art_Project.jpg" },
          resumen: {
            es: "El clásico de la devoción moderna, en cuatro libros: consejos para la vida espiritual, la vida interior, el consuelo interior en diálogo con Cristo y el Santísimo Sacramento. Frases cortas, directas, para leer de a poco y volver a ellas toda la vida.",
            en: "The classic of the devotio moderna, in four books: counsels for the spiritual life, the interior life, inward consolation in dialogue with Christ, and the Blessed Sacrament. Short, direct sentences, to be read slowly and returned to for a lifetime."
          },
          citas: [
            "Of a surety, at the Day of Judgment it will be demanded of us, not what we have read, but what we have done; not how well we have spoken, but how holily we have lived.",
            "For man proposeth, but God disposeth; and the way of a man is not in himself.",
            "Vanity of vanities, all is vanity, save to love God, and Him only to serve.",
            "To be without Jesus is the nethermost hell, and to be with Jesus is sweet paradise.",
            "First keep thyself in peace, and then shalt thou be able to be a peacemaker towards others."
          ],
          archivos: { epub: "libros/kempis-imitation-of-christ.epub", pdf: "libros/kempis-imitation-of-christ.pdf" },
          fuente: { texto: "Project Gutenberg, libro n.º 1653 (dominio público); portada de Proyecto Fénix", url: "https://www.gutenberg.org/ebooks/1653" },
          editorial: null,
          parecidos: ["confesiones", "marmion-vida-del-alma", "presencia-de-dios"]
        }
      }
    },
    {
      id: "preparacion-para-la-muerte",
      titulo: "Preparación para la muerte",
      autor: "San Alfonso María de Ligorio (trad. Joaquín Roca y Cornet)",
      anio: "1758",
      idioma: "es",
      categoria: "lectura",
      resumen: {
        es: "Treinta y seis meditaciones de san Alfonso María de Ligorio, Doctor de la Iglesia, sobre las verdades eternas: la muerte, el juicio, el infierno y el paraíso, el valor del tiempo y de la gracia, la malicia del pecado y la misericordia de Dios. Cada consideración tiene tres puntos para meditar y termina en «afectos y súplicas», oraciones con que el lector responde a lo meditado. Las últimas tratan los medios para perseverar: la oración, la confianza en la Virgen, el amor de Dios, la comunión y la conformidad con Su voluntad. Traducción de Joaquín Roca y Cornet, en la edición de París de 1867.",
        en: "Thirty-six meditations by Saint Alphonsus Liguori, Doctor of the Church, on the eternal truths: death, judgment, hell and heaven, the value of time and of grace, the malice of sin and the mercy of God. Each consideration has three points for meditation and ends in «affections and prayers», with which the reader answers what was meditated. The last ones deal with the means of perseverance: prayer, trust in the Virgin, the love of God, communion and conformity to His will. Spanish translation by Joaquín Roca y Cornet, in the Paris edition of 1867."
      },
      porque: {"es":"Para quien quiere tomarse en serio la propia muerte sin quedarse en el miedo: san Alfonso pinta con crudeza lo que pasa, pero cada página desemboca en la oración y en la confianza en la misericordia de Dios. Sirve para la meditación diaria, una consideración por día, y es un clásico para el retiro y la Cuaresma. Quien lo lee aprende a mirar el tiempo, el pecado y la gracia con la medida de la eternidad.","en":"For anyone who wants to take their own death seriously without being stuck in fear: Saint Alphonsus paints it starkly, but every page flows into prayer and trust in God's mercy. It suits daily meditation, one consideration a day, and is a classic for retreats and Lent. Its reader learns to weigh time, sin and grace by the measure of eternity."},
      imagen: { src: "img/portadas/preparacion-para-la-muerte.jpg", credito: { es: "Juan de Valdés Leal, «In ictu oculi», 1672", en: "Juan de Valdés Leal, «In ictu oculi», 1672" }, url: "https://commons.wikimedia.org/wiki/File:Valdes_Leal_-_In_Ictu_Oculi.jpg" },
      citas: [
        "Considera que tierra eres, y que en tierra te has de convertir.",
        "Nada hay más precioso que el tiempo, pero de nada se hace menos caso: es lo que más se desprecia en este mundo.",
        "Concluyamos, pues, que quien ruega se salva, y el que no ruega se condena."
      ],
      archivos: { epub: "libros/ligorio-preparacion-para-la-muerte.epub", pdf: "libros/ligorio-preparacion-para-la-muerte.pdf" },
      fuente: { texto: "Edición de París, Garnier Hermanos, 1867, traducción de Joaquín Roca y Cornet, escaneada en Internet Archive (dominio público); edición digital y portada de Proyecto Fénix", url: "https://archive.org/details/PREPARACINPARALAMUERTEOConsideracionesSobreLasVerdadesEternasTilesALosFielesPara" },
      editorial: { es: "Edición digital de Proyecto Fénix sobre la impresión de París de 1867: texto cotejado en dos escaneos, ortografía actualizada sin cambiar palabras, notas del autor al pie y portada nueva.", en: "Proyecto Fénix digital edition of the 1867 Paris printing: text collated from two scans, modernized spelling without changing any words, the author's footnotes and a new cover." },
      delibris: null,
      parecidos: ["imitacion-de-cristo", "marmion-vida-del-alma", "escriva-camino"]
    },
    {
      id: "confesiones",
      titulo: "Confesiones",
      autor: "San Agustín de Hipona",
      anio: "c. 400",
      idioma: "es",
      categoria: "lectura",
      recomendado: false,
      resumen: {
        es: "La historia de una conversión contada como oración: Agustín repasa ante Dios su infancia, su juventud desordenada, su búsqueda entre los maniqueos y los platónicos y el encuentro con la gracia en Milán, hasta su bautismo y la muerte de su madre, santa Mónica. Los últimos libros meditan sobre la memoria, el tiempo y la creación. Traducción nueva de Proyecto Fénix, hecha desde el latín.",
        en: "The story of a conversion told as a prayer: Augustine reviews before God his childhood, his disordered youth, his search among the Manichaeans and the Platonists and his encounter with grace in Milan, up to his baptism and the death of his mother, Saint Monica. The last books meditate on memory, time and creation. A new translation by Proyecto Fénix, made from the Latin."
      },
      porque: {"es":"Para quien se ha sentido lejos de Dios, o dando vueltas buscando algo sin saber qué. Agustín no habla desde la perfección sino desde sus errores, y por eso se le cree. Se lee como una conversación íntima, y deja la sensación de que la inquietud del propio corazón tiene un sentido.","en":"For anyone who has felt far from God, or has gone round in circles looking for something without knowing what. Augustine speaks not from perfection but from his mistakes, and that is why he is believed. It reads like an intimate conversation, and leaves the sense that the restlessness of one's own heart has a meaning."},
      imagen: { src: "img/portadas/confesiones-es.jpg", credito: { es: "Ary Scheffer, «San Agustín y santa Mónica», 1854", en: "Ary Scheffer, «Saints Augustine and Monica», 1854" }, url: "https://commons.wikimedia.org/wiki/File:Saint_Augustine_and_Saint_Monica.jpg" },
      citas: [
        "Nos hiciste para Ti, y nuestro corazón está inquieto hasta que descanse en Ti.",
        "¡Tarde Te amé, Hermosura tan antigua y tan nueva, tarde Te amé! Y he aquí que Tú estabas dentro y yo fuera, y allí Te buscaba.",
        "Mi peso es mi amor; por él soy llevado adondequiera que soy llevado.",
        "Dame castidad y continencia, pero todavía no.",
        "Toma y lee, toma y lee."
      ],
      archivos: { epub: "libros/agustin-confesiones.epub", pdf: "libros/agustin-confesiones.pdf" },
      editorial: { es: "Traducción nueva de Proyecto Fénix desde el latín, de los trece libros, cotejada con la traducción inglesa de Pusey y revisada en sus pasajes doctrinales contra el Catecismo; preparada con ayuda de inteligencia artificial, con nota de la edición y portada nueva.", en: "A new Proyecto Fénix translation from the Latin of all thirteen books, checked against Pusey's English translation and reviewed in its doctrinal passages against the Catechism; prepared with the help of artificial intelligence, with an edition note and a new cover." },
      fuente: { texto: "Traducción de Proyecto Fénix desde el latín (edición de J. J. O'Donnell en The Latin Library), cotejada con la traducción inglesa de E. B. Pusey; licencia CC BY-NC-SA 4.0", url: "https://www.thelatinlibrary.com/augustine.html" },
      delibris: { valor: 6, genero: "Literatura", url: "https://delibris.org/es/confesiones" },
      parecidos: ["historia-de-un-alma", "imitacion-de-cristo", "marmion-vida-del-alma"],
      versiones: {
        en: {
          titulo: "The Confessions of St. Augustine",
          autor: "Saint Augustine of Hippo",
          resumen: {
            es: "La historia de una conversión contada como oración: Agustín repasa ante Dios su infancia, su juventud desordenada, su búsqueda intelectual y el encuentro con la gracia en Milán, y termina meditando sobre la memoria, el tiempo y la creación. Traducción inglesa de E. B. Pusey.",
            en: "The story of a conversion told as a prayer: Augustine reviews before God his childhood, his disordered youth, his intellectual search and his encounter with grace in Milan, and ends by meditating on memory, time and creation. English translation by E. B. Pusey."
          },
          imagen: { src: "img/portadas/confesiones.jpg", credito: { es: "Sandro Botticelli, «San Agustín en su estudio», c. 1480", en: "Sandro Botticelli, «Saint Augustine in His Study», c. 1480" }, url: "https://commons.wikimedia.org/wiki/File:Sandro_Botticelli_-_St_Augustine_-_WGA02709.jpg" },
          citas: [
            "Thou madest us for Thyself, and our heart is restless, until it repose in Thee.",
            "Too late loved I Thee, O Thou Beauty of ancient days, yet ever new! too late I loved Thee! And behold, Thou wert within, and I abroad, and there I searched for Thee.",
            "My weight, is my love; thereby am I borne, whithersoever I am borne.",
            "Give me chastity and continency, only not yet.",
            "Take up and read; Take up and read."
          ],
          archivos: { epub: "libros/agustin-confessions.epub", pdf: "libros/agustin-confessions.pdf" },
          fuente: { texto: "Project Gutenberg, libro n.º 3296 (dominio público); portada de Proyecto Fénix", url: "https://www.gutenberg.org/ebooks/3296" },
          editorial: null,
          parecidos: ["imitacion-de-cristo", "ortodoxia", "presencia-de-dios"]
        }
      }
    },
    {
      id: "historia-de-un-alma",
      titulo: "Historia de un alma",
      autor: "Santa Teresa del Niño Jesús y de la Santa Faz",
      anio: "1898",
      idioma: "es",
      categoria: "lectura",
      recomendado: true,
      resumen: {
        es: "La autobiografía de santa Teresa de Lisieux, carmelita y Doctora de la Iglesia, escrita por obediencia a sus prioras. Cuenta su infancia, su entrada al Carmelo a los quince años y el descubrimiento de su «caminito»: la confianza y el abandono de quien se sabe pequeño ante Dios, y el amor puesto en las cosas ordinarias. El último capítulo narra su enfermedad y su muerte, en 1897. Traducción nueva de Proyecto Fénix, hecha desde el francés de la edición de 1912.",
        en: "The autobiography of Saint Thérèse of Lisieux, Carmelite and Doctor of the Church, written out of obedience to her prioresses. She tells of her childhood, her entry into Carmel at fifteen and her discovery of the «little way»: the trust and self-surrender of one who knows herself small before God, and love placed in ordinary things. The last chapter recounts her illness and death in 1897. A new translation by Proyecto Fénix, made from the French of the 1912 edition."
      },
      porque: {"es":"Para quien piensa que la santidad es cosa de personas extraordinarias y que a él no le toca. Teresa muestra un camino al alcance de cualquiera: hacer bien lo pequeño y confiar. Es un buen libro para días de poca fuerza, y se lee con facilidad porque ella escribe sin adornos.","en":"For anyone who thinks holiness belongs to extraordinary people and not to them. Thérèse shows a path within anyone's reach: doing small things well and trusting. It is a good book for days of little strength, and it reads easily because she writes without ornament."},
      imagen: { src: "img/portadas/historia-de-un-alma.jpg", credito: { es: "Henri Fantin-Latour, «Rosas y lirios», 1888", en: "Henri Fantin-Latour, «Roses and Lilies», 1888" }, url: "https://commons.wikimedia.org/wiki/File:Henri_Fantin-Latour_-_Roses_and_Lilies_MET_DT9200.jpg" },
      citas: [
        "Él no llama a los que son dignos, sino a los que Le place.",
        "El ascensor que debe elevarme hasta el cielo ¡son Tus brazos, oh Jesús! Para eso no necesito crecer; al contrario, es preciso que siga siendo pequeña, que lo sea cada vez más.",
        "¡Mi vocación es el amor! Sí, he hallado mi lugar en el seno de la Iglesia, y ese lugar, oh Dios mío, Tú me lo has dado: en el corazón de la Iglesia, mi Madre, ¡yo seré el amor!",
        "Para mí, la oración es un impulso del corazón, es una simple mirada lanzada hacia el cielo, es un grito de gratitud y de amor tanto en la prueba como en el seno de la alegría.",
        "Quiero pasar mi cielo haciendo el bien sobre la tierra."
      ],
      archivos: { epub: "libros/teresa-historia-de-un-alma.epub", pdf: "libros/teresa-historia-de-un-alma.pdf" },
      editorial: { es: "Traducción nueva de Proyecto Fénix desde el francés de la edición de 1912, con sus notas, revisada en sus pasajes doctrinales contra el Catecismo; preparada con ayuda de inteligencia artificial, con nota de la edición y portada nueva.", en: "A new Proyecto Fénix translation from the French of the 1912 edition, with its notes, reviewed in its doctrinal passages against the Catechism; prepared with the help of artificial intelligence, with an edition note and a new cover." },
      fuente: { texto: "Traducción de Proyecto Fénix desde el francés de la edición de 1912 del Carmelo de Lisieux (Project Gutenberg, libro n.º 36708); licencia CC BY-NC-SA 4.0", url: "https://www.gutenberg.org/ebooks/36708" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://www.delibris.org/es/historia-de-un-alma-0" },
      parecidos: ["confesiones", "marmion-vida-del-alma", "imitacion-de-cristo"]
    },
    {
      id: "diario-santa-faustina",
      titulo: "Diario. La Divina Misericordia en mi alma",
      autor: "Santa Faustina Kowalska",
      anio: "1938",
      idioma: "es",
      categoria: "lectura",
      recomendado: false,
      resumen: {
        es: "Los seis cuadernos que santa Faustina Kowalska, religiosa polaca de la Congregación de las Hermanas de la Madre de Dios de la Misericordia, escribió en Vilna y Cracovia entre 1934 y 1938 por obediencia a sus confesores, el beato Miguel Sopoćko y el padre José Andrasz. Allí cuenta su vida interior y las palabras que recibió de Jesús: el pedido de pintar Su imagen con la firma «Jesús, en Ti confío», de una Fiesta de la Misericordia el domingo después de Pascua y de la confianza como respuesta del alma. Es una revelación privada, que no añade nada a la fe de la Iglesia pero ayuda a vivirla. San Juan Pablo II la canonizó el 30 de abril de 2000 y ese día dispuso que el segundo domingo de Pascua se llame en toda la Iglesia domingo de la Misericordia divina.",
        en: "The six notebooks that Saint Faustina Kowalska, a Polish sister of the Congregation of the Sisters of Our Lady of Mercy, wrote in Vilnius and Kraków between 1934 and 1938 in obedience to her confessors, Blessed Michael Sopoćko and Father Józef Andrasz. In them she tells of her inner life and of the words she received from Jesus: the request to paint His image signed «Jesus, I trust in You», for a Feast of Mercy on the Sunday after Easter, and for trust as the soul's answer. It is a private revelation, which adds nothing to the faith of the Church but helps us live it. Saint John Paul II canonized her on 30 April 2000 and that day decreed that the Second Sunday of Easter be called Divine Mercy Sunday throughout the Church."
      },
      porque: {"es":"Para quien carga con culpas viejas o siente que no merece volver a Dios. El Diario repite, página tras página, que la miseria del hombre no es un obstáculo para la misericordia sino su ocasión, y que lo que se pide de vuelta es confianza. Es largo y no se lee de corrido: rinde más abierto en cualquier parte, de a pocos números.","en":"For anyone weighed down by old guilt or who feels unworthy of returning to God. Page after page the Diary repeats that human misery is no obstacle to mercy but its occasion, and that what is asked in return is trust. It is long and not meant to be read straight through: it gives most when opened anywhere, a few entries at a time."},
      imagen: { src: "img/portadas/diario-santa-faustina.jpg", credito: { es: "Eugeniusz Kazimirowski, «Jesús Misericordioso», 1934, pintado bajo la guía de santa Faustina", en: "Eugeniusz Kazimirowski, «Divine Mercy», 1934, painted under Saint Faustina's guidance" }, url: "https://commons.wikimedia.org/wiki/File:Kazimirowski_Eugeniusz,_Divine_Mercy,_1934.jpg" },
      citas: [
        "Pinta una imagen según el modelo que ves, y firma: Jesús, en Ti confío.",
        "Hija Mía, tu confianza y tu amor impiden Mi justicia y no puedo castigar porque Me lo impides.",
        "Este gran libro es Tu Pasión afrontada por amor hacia mí. De este libro he aprendido cómo amar a Dios y a las almas.",
        "Mi mayor deseo es que las almas Te conozcan, que sepan que eres su eterna felicidad, que crean en Tu bondad y que alaben Tu infinita misericordia."
      ],
      archivos: {},
      externos: [
        { formato: "web", texto: "santafaustina.es (texto completo, de la congregación)", url: "https://www.santafaustina.es/el-diario-2/" }
      ],
      fuente: { texto: "Texto completo que la Congregación de las Hermanas de la Madre de Dios de la Misericordia publica gratis en su sitio; traducción al español © 1993 de los Padres Marianos de Stockbridge (obra protegida por derechos de autor; se enlaza, no se aloja)", url: "https://www.santafaustina.es/el-diario/" },
      delibris: null,
      parecidos: ["historia-de-un-alma", "presencia-de-dios", "imitacion-de-cristo"]
    },
    {
      id: "de-la-eucaristia-a-la-trinidad",
      titulo: "De la Eucaristía a la Trinidad",
      autor: "Marie-Vincent Bernadot, O.P.",
      anio: "1919",
      idioma: "es",
      categoria: "lectura",
      resumen: {
        es: "Un libro breve del dominico Marie-Vincent Bernadot sobre lo que pasa en el alma cuando comulga. Cristo baja de la Trinidad hasta nosotros en la Eucaristía para llevarnos de vuelta con Él hasta la Trinidad: la Comunión nos une a su santa Humanidad y nos da a las tres divinas Personas. Bernadot explica cómo esa unión permanece después de la Comunión, cómo se mantiene en el recogimiento, el trabajo, la tentación, el dolor y la alegría, y cómo crece con actos de deseo y de amor, hasta su fin: ser hijos de Dios en Cristo para alabanza de la Trinidad. Traducción nueva de Proyecto Fénix, hecha desde el francés.",
        en: "A short book by the Dominican Marie-Vincent Bernadot on what happens in the soul at Holy Communion. Christ comes down from the Trinity to us in the Eucharist in order to bring us back with Him to the Trinity: Communion unites us to His sacred Humanity and gives us the three divine Persons. Bernadot explains how this union lasts after Communion, how it is kept in recollection, work, temptation, suffering and joy, and how it grows through acts of desire and love, toward its end: to be children of God in Christ for the praise of the Trinity. A new Proyecto Fénix translation from the French."
      },
      porque: {"es":"Para quien comulga seguido y siente que la Comunión se le volvió rutina, o que se acaba al salir de la iglesia. Bernadot muestra que el encuentro sigue durante el día y enseña a vivirlo en el trabajo, en el cansancio y en las alegrías. Es corto, sereno y muy bueno para leer antes o después de comulgar, o en un rato de adoración.","en":"For anyone who receives Communion often and feels it has become routine, or that it ends on leaving the church. Bernadot shows that the encounter goes on through the day and teaches how to live it in work, in tiredness and in joy. It is short, serene and very good to read before or after Communion, or during a time of adoration."},
      imagen: { src: "img/portadas/de-la-eucaristia-a-la-trinidad.jpg", credito: { es: "Andréi Rubliov, «La Trinidad», c. 1425-1427", en: "Andrei Rublev, «The Trinity», c. 1425-1427" }, url: "https://commons.wikimedia.org/wiki/File:Andrey_Rublev_-_Св._Троица_-_Google_Art_Project.jpg" },
      citas: [
        "Desde las alturas de la Trinidad, el Verbo encarnado desciende al hombre en la Eucaristía para que por la Comunión el hombre ascienda a su fin último, la adorable Trinidad.",
        "Comenzada en el Bautismo, estrechada en la Confirmación, nuestra unión con Cristo se consuma en el momento de la Comunión.",
        "Toda entera la adorable Trinidad habita en el corazón del que comulga.",
        "Para que se perpetúe la unión de nuestra alma con la santa Humanidad de Nuestro Señor y la adorable Trinidad, basta con permanecer en estado de gracia."
      ],
      archivos: { epub: "libros/bernadot-de-la-eucaristia-a-la-trinidad.epub", pdf: "libros/bernadot-de-la-eucaristia-a-la-trinidad.pdf" },
      editorial: { es: "Traducción nueva de Proyecto Fénix desde el francés del texto de 1919, con la oración de santa Catalina de Siena que lo abre, las notas del autor y cinco notas del editor, revisada en sus pasajes doctrinales contra el Catecismo; preparada con ayuda de inteligencia artificial, con nota de la edición y portada nueva.", en: "A new Proyecto Fénix translation from the French text of 1919, with the prayer of Saint Catherine of Siena that opens it, the author's notes and five editor's notes, reviewed in its doctrinal passages against the Catechism; prepared with the help of artificial intelligence, with an edition note and a new cover." },
      fuente: { texto: "Traducción de Proyecto Fénix desde el francés de 1919; licencia CC BY-NC-SA 4.0", url: "https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es" },
      delibris: null,
      parecidos: ["marmion-vida-del-alma", "historia-de-un-alma", "imitacion-de-cristo"]
    },
    {
      id: "presencia-de-dios",
      titulo: "The Practice of the Presence of God",
      autor: "Brother Lawrence of the Resurrection, O.C.D.",
      anio: "1692",
      idioma: "en",
      categoria: "oracion",
      recomendado: true,
      resumen: {
        es: "Conversaciones y cartas de un hermano carmelita que trabajó años en la cocina de su convento. Su enseñanza es sencilla: vivir en la presencia de Dios en medio del trabajo diario, ofreciendo por amor las cosas pequeñas. Muy cercano a la santificación del trabajo ordinario.",
        en: "Conversations and letters of a Carmelite brother who worked for years in his monastery's kitchen. His teaching is simple: live in God's presence in the midst of daily work, offering little things out of love. Very close to the sanctification of ordinary work."
      },
      porque: {"es":"Para quien trabaja todo el día y siente que no le queda tiempo para rezar. El hermano Lorenzo no propone más horas de oración sino otra manera de estar en lo que ya se hace: lavar, cocinar, atender. Son pocas páginas, y se pueden aplicar desde mañana mismo en la rutina.","en":"For anyone who works all day and feels there is no time left to pray. Brother Lawrence does not propose more hours of prayer but another way of being in what one already does: washing, cooking, serving. The book is only a few pages long, and its advice can be put into practice tomorrow, in the ordinary routine."},
      imagen: { src: "img/portadas/presencia-de-dios.jpg", credito: { es: "Diego Velázquez, «Cristo en casa de Marta y María» (detalle), c. 1618", en: "Diego Velázquez, «Christ in the House of Martha and Mary» (detail), c. 1618" }, url: "https://commons.wikimedia.org/wiki/File:Diego_Vel%C3%A1zquez_-_Christ_in_the_House_of_Mary_and_Martha_(detail)_-_WGA24361.jpg" },
      citas: [
        "The time of business does not with me differ from the time of prayer. In the noise and clutter of my kitchen, while several persons are at the same time calling for different things, I possess God in as great tranquillity as if I were upon my knees at the Blessed Supper.",
        "We ought not weary of doing little things for the love of God, who regards not the greatness of the work, but the love with which it is performed.",
        "We need only to recognize God intimately present with us and address ourselves to Him every moment.",
        "It is an habitual, silent, and private conversation of the soul with God.",
        "He was pleased when he could take up a straw from the ground for the love of God, seeking Him only, and nothing else, not even His gifts."
      ],
      archivos: { epub: "libros/lorenzo-practice-of-the-presence-of-god.epub", pdf: "libros/lorenzo-practice-of-the-presence-of-god.pdf" },
      fuente: { texto: "Project Gutenberg, libro n.º 5657 (dominio público); portada de Proyecto Fénix", url: "https://www.gutenberg.org/ebooks/5657" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/la-practica-de-la-presencia-de-dios" },
      parecidos: ["one-with-jesus", "imitacion-de-cristo", "marmion-vida-del-alma"]
    },
    {
      id: "ortodoxia",
      titulo: "Orthodoxy",
      autor: "G. K. Chesterton",
      anio: "1908",
      idioma: "en",
      categoria: "lectura",
      recomendado: false,
      resumen: {
        es: "La «autobiografía intelectual» de Chesterton: cómo, buscando por su cuenta una filosofía que explicara el mundo, descubrió que ya existía y se llamaba cristianismo. Paradojas, humor y una defensa alegre de la fe frente al escepticismo moderno.",
        en: "Chesterton's «intellectual autobiography»: how, while looking on his own for a philosophy that explained the world, he found it already existed and was called Christianity. Paradox, humour and a joyful defence of the faith against modern scepticism."
      },
      porque: {"es":"Para el lector que duda, o que conoce a alguien que duda, y quiere ver la fe defendida con inteligencia y buen humor, sin tono de sermón. Chesterton sorprende en casi cada página con una imagen que obliga a mirar de nuevo lo conocido. Sirve a quien disfruta discutir ideas y también a quien solo quiere pasarlo bien leyendo.","en":"For the reader who doubts, or knows someone who does, and wants to see the faith defended with intelligence and good humour, without a sermonizing tone. Chesterton surprises on almost every page with an image that forces a fresh look at the familiar. It suits those who enjoy arguing about ideas, and also those who simply want a good time reading."},
      imagen: { src: "img/portadas/ortodoxia.jpg", credito: { es: "Rafael, «La disputa del Santísimo Sacramento» (detalle), 1509-1510", en: "Raphael, «The Disputation of the Holy Sacrament» (detail), 1509-1510" }, url: "https://commons.wikimedia.org/wiki/File:%22Disputation_of_the_Holy_Sacrament%22_by_Raphael,_Raphael_Rooms,_Vatican_Museum_(48466326127).jpg" },
      citas: [
        "Angels can fly because they can take themselves lightly.",
        "Tradition means giving votes to the most obscure of all classes, our ancestors. It is the democracy of the dead.",
        "The madman is not the man who has lost his reason. The madman is the man who has lost everything except his reason.",
        "The test of all happiness is gratitude; and I felt grateful, though I hardly knew to whom.",
        "Joy, which was the small publicity of the pagan, is the gigantic secret of the Christian."
      ],
      archivos: { epub: "libros/chesterton-orthodoxy.epub", pdf: "libros/chesterton-orthodoxy.pdf" },
      fuente: { texto: "Project Gutenberg, libro n.º 130 (dominio público); portada de Proyecto Fénix", url: "https://www.gutenberg.org/ebooks/130" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/ortodoxia" },
      parecidos: ["confesiones", "quo-vadis", "imitacion-de-cristo"]
    },
    {
      id: "quo-vadis",
      titulo: "Quo Vadis: A Narrative of the Time of Nero",
      autor: "Henryk Sienkiewicz",
      anio: "1896",
      idioma: "en",
      categoria: "novela",
      recomendado: false,
      resumen: {
        es: "Roma bajo Nerón: el patricio Vinicio se enamora de Ligia, una joven cristiana, y a través de ella conoce a la comunidad perseguida, a san Pedro y a san Pablo. Novela histórica de gran aliento, de un autor que recibió el Nobel de Literatura en 1905. Traducción inglesa de Jeremiah Curtin.",
        en: "Rome under Nero: the patrician Vinicius falls in love with Lygia, a young Christian, and through her comes to know the persecuted community, Saint Peter and Saint Paul. A sweeping historical novel by an author who received the Nobel Prize in Literature in 1905. English translation by Jeremiah Curtin."
      },
      porque: {"es":"Sirve a quien quiere sentir cómo era ser cristiano en tiempos de persecución sin abrir un tratado. La historia de amor de Vinicio y Ligia arrastra al lector, y de paso deja ver el contraste entre una Roma brillante y vacía y una comunidad pequeña que vivía de otra cosa.","en":"This one suits readers who want to feel what it was to be a Christian under persecution without opening a treatise. The love story of Vinicius and Lygia carries you along, and on the way it sets a glittering, hollow Rome beside a small community that lived on something else."},
      imagen: { src: "img/portadas/quo-vadis.jpg", credito: { es: "Annibale Carracci, «Domine, quo vadis?», 1601-1602", en: "Annibale Carracci, «Domine, quo vadis?», 1601-1602" }, url: "https://commons.wikimedia.org/wiki/File:Domine,_quo_vadis.jpg" },
      citas: [
        "Quo vadis, Domine?",
        "If thou desert my people, I am going to Rome to be crucified a second time.",
        "In two hundred or three hundred years the whole world will accept it. People will forget Jupiter, and there will be no God except Christ, and no other temples but Christian.",
        "If ye have reared so many beautiful temples and statues to evil, revengeful, adulterous, and faithless divinities, what would ye not do in honor of one God of truth and mercy?"
      ],
      archivos: { epub: "libros/sienkiewicz-quo-vadis.epub", pdf: "libros/sienkiewicz-quo-vadis.pdf" },
      fuente: { texto: "Project Gutenberg, libro n.º 2853 (dominio público); portada de Proyecto Fénix", url: "https://www.gutenberg.org/ebooks/2853" },
      delibris: { valor: 6, genero: "Literatura", url: "https://delibris.org/es/quo-vadis" },
      parecidos: ["confesiones", "ortodoxia", "imitacion-de-cristo"]
    },

    // ---------- San Josemaría Escrivá: obras protegidas (Fundación Studium), lectura en línea en escriva.org ----------
    {
      id: "escriva-camino",
      titulo: "Camino",
      autor: "San Josemaría Escrivá",
      anio: "1934",
      idioma: "es",
      categoria: "oracion",
      recomendado: true,
      porque: {"es":"Para quien quiere una lectura de pocos minutos al día que lo haga pensar en su vida concreta: el trabajo, la amistad, la sinceridad con uno mismo. Cada punto se puede tomar como tema de oración. Funciona bien leído de a uno o dos, con tiempo para dejarse preguntar.","en":"For anyone who wants a few minutes of reading each day that makes them think about their actual life: work, friendship, honesty with oneself. Each point can be taken as a subject for prayer. It works best read one or two at a time, leaving room to be questioned."},
      imagen: { src: "img/portadas/escriva-camino.jpg", credito: { es: "Meindert Hobbema, «La avenida de Middelharnis», 1689", en: "Meindert Hobbema, «The Avenue at Middelharnis», 1689" }, url: "https://commons.wikimedia.org/wiki/File:Meindert_Hobbema_001.jpg" },
      resumen: {
        es: "999 puntos breves de meditación, repartidos en 46 capítulos, escritos en un tono directo, como de conversación personal con el lector. Apareció en 1934 en Cuenca con el título «Consideraciones espirituales» y tomó su nombre definitivo en la edición de Valencia de 1939. Lleva más de cinco millones de ejemplares en más de cincuenta idiomas.",
        en: "999 short points for meditation, in 46 chapters, written in a direct tone, like a personal conversation with the reader. It first appeared in Cuenca in 1934 as «Consideraciones espirituales» and took its final title in the Valencia edition of 1939. More than five million copies have been printed, in over fifty languages."
      },
      citas: [
        "Que tu vida no sea una vida estéril. Sé útil. Deja poso. Ilumina, con la luminaria de tu fe y de tu amor.",
        "La oración del cristiano nunca es monólogo.",
        "¿Quieres de verdad ser santo? Cumple el pequeño deber de cada momento: haz lo que debes y está en lo que haces.",
        "Todo lo que se hace por Amor adquiere hermosura y se engrandece.",
        "Dios mío, te amo, pero... ¡enséñame a amar!"
      ],
      archivos: {},
      externos: [
        { formato: "web", idioma: "es", texto: "escriva.org", url: "https://escriva.org/es/camino/" },
        { formato: "web", idioma: "en", texto: "escriva.org", url: "https://escriva.org/en/camino/" }
      ],
      comprar: [{ texto: "librerías (escriva.org)", url: "https://escriva.org/es/page/where-to-buy-a-book/" }],
      fuente: { texto: "Texto publicado por la Fundación Studium en escriva.org (obra protegida por derechos de autor)", url: "https://escriva.org/es/camino/" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/camino" },
      parecidos: ["escriva-surco", "escriva-forja", "imitacion-de-cristo"]
    },
    {
      id: "escriva-surco",
      titulo: "Surco",
      autor: "San Josemaría Escrivá",
      anio: "1986",
      idioma: "es",
      categoria: "oracion",
      recomendado: false,
      porque: {"es":"Para quien ya conoce «Camino» y quiere seguir con otro tono, más centrado en cómo se vive lo cotidiano: la lealtad, el trabajo bien hecho, el trato con los demás. Sus puntos breves sirven para empezar la oración cuando no se sabe por dónde, y para revisar la semana con honestidad.","en":"For the reader who already knows «The Way» and wants to continue in a similar voice, more focused on how everyday life is lived: loyalty, work well done, dealing with others. Its short points help to begin prayer when one does not know where to start, and to review the week honestly."},
      imagen: { src: "img/portadas/escriva-surco.jpg", credito: { es: "Jean-François Millet, «El sembrador», 1850", en: "Jean-François Millet, «The Sower», 1850" }, url: "https://commons.wikimedia.org/wiki/File:Jean-Fran%C3%A7ois_Millet_-_The_Sower_-_Google_Art_Project.jpg" },
      resumen: {
        es: "1000 puntos de meditación en 32 capítulos, en la línea de «Camino», con especial atención a las virtudes humanas. Se dirige a la persona entera, «cuerpo y alma, naturaleza y gracia». Primera edición póstuma, de 1986.",
        en: "1000 points for meditation in 32 chapters, in the vein of «The Way», with special attention to the human virtues. It speaks to the whole person, «body and soul, nature and grace». First published posthumously in 1986."
      },
      citas: [
        "Cuanto más generoso seas, por Dios, serás más feliz.",
        "La alegría es una consecuencia de la entrega.",
        "Ante Dios, ninguna ocupación es por sí misma grande ni pequeña. Todo adquiere el valor del Amor con que se realiza.",
        "El heroísmo del trabajo está en «acabar» cada tarea.",
        "Los que nos hemos dedicado a Dios, nada hemos perdido."
      ],
      archivos: {},
      externos: [
        { formato: "web", idioma: "es", texto: "escriva.org", url: "https://escriva.org/es/surco/" },
        { formato: "web", idioma: "en", texto: "escriva.org", url: "https://escriva.org/en/surco/" }
      ],
      comprar: [{ texto: "librerías (escriva.org)", url: "https://escriva.org/es/page/where-to-buy-a-book/" }],
      fuente: { texto: "Texto publicado por la Fundación Studium en escriva.org (obra protegida por derechos de autor)", url: "https://escriva.org/es/surco/" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/surco" },
      parecidos: ["escriva-camino", "escriva-forja", "escriva-amigos-de-dios"]
    },
    {
      id: "escriva-forja",
      titulo: "Forja",
      autor: "San Josemaría Escrivá",
      anio: "1987",
      idioma: "es",
      categoria: "oracion",
      recomendado: false,
      porque: {"es":"Para quien lleva tiempo intentando vivir su fe y siente que avanza lento o que repite las mismas caídas. «Forja» habla de la lucha diaria, del desánimo y de volver a empezar. Se agradece en épocas de cansancio, porque da pie a rezar con sinceridad lo que de verdad pasa por dentro.","en":"For anyone who has been trying to live their faith for some time and feels progress is slow or the same falls keep returning. «The Forge» speaks about daily struggle, discouragement and starting again. It is welcome in tired seasons, because it gives a way to pray honestly about what is really going on inside."},
      imagen: { src: "img/portadas/escriva-forja.jpg", credito: { es: "Joseph Wright of Derby, «Una herrería», 1772", en: "Joseph Wright of Derby, «An Iron Forge», 1772" }, url: "https://commons.wikimedia.org/wiki/File:Joseph_Wright_of_Derby_(1734-1797)_-_An_Iron_Forge_-_T06670_-_Tate.jpg" },
      resumen: {
        es: "1055 puntos de meditación en 13 capítulos, muchos de ellos autobiográficos aunque escritos en tercera persona. Recorre el camino del cristiano hacia la identificación con Cristo. Primera edición de 1987.",
        en: "1055 points for meditation in 13 chapters, many of them autobiographical though written in the third person. It follows the Christian's path towards identification with Christ. First published in 1987."
      },
      citas: [
        "Ojalá pueda decirse que la característica que define tu vida es «amar la Voluntad de Dios».",
        "Hazme santo, mi Dios, aunque sea a palos.",
        "Si has cometido un error, pequeño o grande, ¡vuelve corriendo a Dios!",
        "Si eres fiel, podrás llamarte vencedor. En tu vida, aunque pierdas algunos combates, no conocerás derrotas.",
        "La vida espiritual es un continuo comenzar y recomenzar."
      ],
      archivos: {},
      externos: [
        { formato: "web", idioma: "es", texto: "escriva.org", url: "https://escriva.org/es/forja/" },
        { formato: "web", idioma: "en", texto: "escriva.org", url: "https://escriva.org/en/forja/" }
      ],
      comprar: [{ texto: "librerías (escriva.org)", url: "https://escriva.org/es/page/where-to-buy-a-book/" }],
      fuente: { texto: "Texto publicado por la Fundación Studium en escriva.org (obra protegida por derechos de autor)", url: "https://escriva.org/es/forja/" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/forja" },
      parecidos: ["escriva-camino", "escriva-surco", "one-with-jesus"]
    },
    {
      id: "escriva-es-cristo-que-pasa",
      titulo: "Es Cristo que pasa",
      autor: "San Josemaría Escrivá",
      anio: "1973",
      idioma: "es",
      categoria: "lectura",
      recomendado: false,
      porque: {"es":"Para quien quiere vivir el año litúrgico con más hondura y no solo cumplirlo. Cada homilía acompaña una fiesta y la conecta con el trabajo, la familia y la vida corriente. Se lee mejor de a una, en la semana de la fiesta correspondiente, y deja ideas concretas para esos días.","en":"For anyone who wants to live the liturgical year with more depth and not merely get through it. Each homily accompanies a feast and ties it to work, family and ordinary life. It reads best one at a time, in the week of the corresponding feast, and leaves concrete ideas for those days."},
      imagen: { src: "img/portadas/escriva-es-cristo-que-pasa.jpg", credito: { es: "Duccio di Buoninsegna, «La vocación de Pedro y Andrés», 1308-1311", en: "Duccio di Buoninsegna, «The Calling of the Apostles Peter and Andrew», 1308-1311" }, url: "https://commons.wikimedia.org/wiki/File:Duccio_di_Buoninsegna,_The_Calling_of_the_Apostles_Peter_and_Andrew,_1308-1311,_NGA_282.jpg" },
      resumen: {
        es: "18 homilías pronunciadas en fiestas del año litúrgico. El hilo es la filiación divina, junto con la llamada universal a la santidad, la santificación del trabajo ordinario, la contemplación en medio del mundo y la unidad de vida. Fueron predicadas de viva voz a personas muy diversas, no escritas como tratado. Primera edición de 1973.",
        en: "18 homilies preached on feasts of the liturgical year. The common thread is divine filiation, together with the universal call to holiness, the sanctification of ordinary work, contemplation in the middle of the world and unity of life. They were spoken to very varied listeners, not written as a treatise. First published in 1973."
      },
      citas: [
        "Trabajar así es oración. Estudiar así es oración. Investigar así es oración. No salimos nunca de lo mismo: todo es oración, todo puede y debe llevarnos a Dios, alimentar ese trato continuo con Él, de la mañana a la noche.",
        "Todo trabajo honrado puede ser oración; y todo trabajo, que es oración, es apostolado.",
        "Hemos de amar el mundo, el trabajo, las realidades humanas. Porque el mundo es bueno.",
        "Dios ha querido que seamos cooperadores suyos, ha querido correr el riesgo de nuestra libertad.",
        "Tratad a José y encontraréis a Jesús."
      ],
      archivos: {},
      externos: [
        { formato: "web", idioma: "es", texto: "escriva.org", url: "https://escriva.org/es/es-cristo-que-pasa/" },
        { formato: "web", idioma: "en", texto: "escriva.org", url: "https://escriva.org/en/es-cristo-que-pasa/" }
      ],
      comprar: [{ texto: "librerías (escriva.org)", url: "https://escriva.org/es/page/where-to-buy-a-book/" }],
      fuente: { texto: "Texto publicado por la Fundación Studium en escriva.org (obra protegida por derechos de autor)", url: "https://escriva.org/es/es-cristo-que-pasa/" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/es-cristo-que-pasa" },
      parecidos: ["escriva-amigos-de-dios", "marmion-vida-del-alma", "presencia-de-dios"]
    },
    {
      id: "escriva-amigos-de-dios",
      titulo: "Amigos de Dios",
      autor: "San Josemaría Escrivá",
      anio: "1977",
      idioma: "es",
      categoria: "lectura",
      recomendado: false,
      porque: {"es":"Para quien quiere crecer en las virtudes sin convertirlas en una lista de tareas. Las homilías presentan la lealtad, la sinceridad, la alegría o la laboriosidad como parte del trato con Dios y no como un asunto de simple buena conducta. Es una lectura apropiada para un examen personal tranquilo, una virtud por vez.","en":"For anyone who wants to grow in the virtues without turning them into a to-do list. The homilies present loyalty, sincerity, joy or hard work as part of one's dealing with God and not as a matter of mere good behaviour. It is a fitting read for a calm personal review, one virtue at a time."},
      imagen: { src: "img/portadas/escriva-amigos-de-dios.jpg", credito: { es: "Johannes Vermeer, «Cristo en casa de Marta y María», c. 1655", en: "Johannes Vermeer, «Christ in the House of Martha and Mary», c. 1655" }, url: "https://commons.wikimedia.org/wiki/File:Johannes_(Jan)_Vermeer_-_Christ_in_the_House_of_Martha_and_Mary_-_Google_Art_Project.jpg" },
      resumen: {
        es: "18 homilías que toman las virtudes cristianas como hilo de un «coloquio filial con Dios». Publicado en 1977, es la primera obra póstuma del autor.",
        en: "18 homilies that take the Christian virtues as the thread of a «filial conversation with God». Published in 1977, it was the author's first posthumous work."
      },
      citas: [
        "Estas crisis mundiales son crisis de santos.",
        "El santo no nace: se forja en el continuo juego de la gracia divina y de la correspondencia humana.",
        "La libertad y la entrega no se contradicen; se sostienen mutuamente.",
        "Nadie puede elegir por nosotros: he aquí el grado supremo de dignidad en los hombres: que por sí mismos, y no por otros, se dirijan hacia el bien.",
        "La vida interior consiste en comenzar y recomenzar cada día."
      ],
      archivos: {},
      externos: [
        { formato: "web", idioma: "es", texto: "escriva.org", url: "https://escriva.org/es/amigos-de-dios/" },
        { formato: "web", idioma: "en", texto: "escriva.org", url: "https://escriva.org/en/amigos-de-dios/" }
      ],
      comprar: [{ texto: "librerías (escriva.org)", url: "https://escriva.org/es/page/where-to-buy-a-book/" }],
      fuente: { texto: "Texto publicado por la Fundación Studium en escriva.org (obra protegida por derechos de autor)", url: "https://escriva.org/es/amigos-de-dios/" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/amigos-de-dios" },
      parecidos: ["escriva-es-cristo-que-pasa", "escriva-surco", "presencia-de-dios"]
    },
    {
      id: "escriva-amar-a-la-iglesia",
      titulo: "Amar a la Iglesia",
      autor: "San Josemaría Escrivá",
      anio: "1986",
      idioma: "es",
      categoria: "lectura",
      recomendado: false,
      porque: {"es":"Para quien se siente incómodo, distante o decepcionado con la Iglesia y quiere entender por qué se le puede querer pese a las fallas de sus miembros. También ayuda a los sacerdotes y a quienes rezan por ellos. Son tres textos distintos, cortos, que se pueden leer por separado según el momento.","en":"For anyone who feels uneasy, distant or disappointed with the Church and wants to understand why it can be loved despite the failings of its members. It also helps priests and those who pray for them. They are three distinct, short texts that can be read separately depending on the moment."},
      imagen: { src: "img/portadas/escriva-amar-a-la-iglesia.jpg", credito: { es: "Giovanni Paolo Panini, «Interior de San Pedro de Roma», c. 1754", en: "Giovanni Paolo Panini, «Interior of Saint Peter's, Rome», c. 1754" }, url: "https://commons.wikimedia.org/wiki/File:Giovanni_Paolo_Panini,_Interior_of_Saint_Peter%27s,_Rome,_c._1754,_NGA_50884.jpg" },
      resumen: {
        es: "Reúne las homilías «Lealtad a la Iglesia», «El fin sobrenatural de la Iglesia» y «Sacerdote para la eternidad», con presentación de Jesús Urteaga y dos escritos del beato Álvaro del Portillo.",
        en: "It gathers the homilies «Loyalty to the Church», «The Supernatural Aim of the Church» and «A Priest Forever», with a presentation by Jesús Urteaga and two writings by Blessed Álvaro del Portillo."
      },
      citas: [
        "No concibo que se viva un cariño verdadero a la propia madre, y que se hable de esa madre con despego.",
        "Nuestra Madre es Santa, porque ha nacido pura y continuará sin mácula por la eternidad.",
        "¡Qué luminosa es nuestra fe! Todos somos en Cristo, porque Él es la cabeza del cuerpo de la Iglesia."
      ],
      archivos: {},
      externos: [
        { formato: "web", idioma: "es", texto: "escriva.org", url: "https://escriva.org/es/amar-a-la-iglesia/" },
        { formato: "web", idioma: "en", texto: "escriva.org", url: "https://escriva.org/en/amar-a-la-iglesia/" }
      ],
      comprar: [{ texto: "librerías (escriva.org)", url: "https://escriva.org/es/page/where-to-buy-a-book/" }],
      fuente: { texto: "Texto publicado por la Fundación Studium en escriva.org (obra protegida por derechos de autor)", url: "https://escriva.org/es/amar-a-la-iglesia/" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/amar-la-iglesia-0" },
      parecidos: ["escriva-es-cristo-que-pasa", "escriva-conversaciones", "ortodoxia"]
    },
    {
      id: "escriva-en-dialogo-con-el-senor",
      titulo: "En diálogo con el Señor",
      autor: "San Josemaría Escrivá",
      anio: "2017",
      idioma: "es",
      categoria: "oracion",
      recomendado: false,
      porque: {"es":"Para quien quiere rezar mejor y se queda sin palabras ante Dios. Estos textos nacieron como predicación hablada, y se nota: van pensando en voz alta, con ejemplos y preguntas. Sirven de acompañante para la oración de cada día, leyendo un texto antes y quedándose luego en silencio con lo que haya tocado.","en":"For anyone who wants to pray better and runs out of words before God. These texts began as spoken preaching, and it shows: they think aloud, with examples and questions. They work as a companion for daily prayer, reading one text beforehand and then staying quiet with whatever it has touched."},
      imagen: { src: "img/portadas/escriva-en-dialogo-con-el-senor.jpg", credito: { es: "Henry Ossawa Tanner, «Nicodemo visita a Jesús», 1899", en: "Henry Ossawa Tanner, «Nicodemus Visiting Jesus», 1899" }, url: "https://commons.wikimedia.org/wiki/File:Nicodemus_Visiting_Jesus,_by_Henry_Ossawa_Tanner.jpg" },
      resumen: {
        es: "25 textos de su predicación a miembros del Opus Dei en Roma entre 1954 y 1975, publicados para el público general en 2017. Temas frecuentes: la identificación con Cristo, la filiación divina, el amor a Dios y a la Iglesia, la oración, la humildad y la caridad fraterna. Su fin es ayudar a hacer oración personal.",
        en: "25 texts from his preaching to members of Opus Dei in Rome between 1954 and 1975, published for a general readership in 2017. Recurring themes: identification with Christ, divine filiation, love for God and the Church, prayer, humility and fraternal charity. It is meant to help the reader pray."
      },
      citas: [
        "La oración, hijos, es el fundamento de toda labor sobrenatural.",
        "Para ser santo, hijo, hay que rezar: no tengo otra receta para alcanzar la santidad.",
        "Ante todo, enseguida, la charla con tu Padre Dios, buscando al Señor en el centro de tu alma."
      ],
      archivos: {},
      externos: [{ formato: "web", idioma: "es", texto: "escriva.org", url: "https://escriva.org/es/en-dialogo-con-el-se%C3%B1or/" }],
      comprar: [{ texto: "librerías (escriva.org)", url: "https://escriva.org/es/page/where-to-buy-a-book/" }],
      fuente: { texto: "Texto publicado por la Fundación Studium en escriva.org (obra protegida por derechos de autor)", url: "https://escriva.org/es/en-dialogo-con-el-se%C3%B1or/" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/en-dialogo-con-el-senor" },
      parecidos: ["escriva-forja", "one-with-jesus", "presencia-de-dios"]
    },
    {
      id: "escriva-santo-rosario",
      titulo: "Santo Rosario",
      autor: "San Josemaría Escrivá",
      anio: "1934",
      idioma: "es",
      categoria: "oracion",
      recomendado: false,
      porque: {"es":"Para quien reza el rosario y se distrae, o quiere empezar a rezarlo. Cada misterio trae una escena breve de la vida de Jesús y de María, y con eso tu mente tiene dónde apoyarse. Si piensas que siempre es lo mismo, el prólogo responde que así hablan los que se aman. Puedes leer una consideración antes de cada decena.","en":"For anyone who prays the rosary and gets distracted, or wants to start praying it. Each mystery brings a short scene from the life of Jesus and Mary, and your mind has something to lean on. If you think it is always the same thing, the preface answers that this is how people who love each other talk. You can read one consideration before each decade."},
      imagen: { src: "img/portadas/escriva-santo-rosario.jpg", credito: { es: "Caravaggio, «Virgen del Rosario», c. 1607", en: "Caravaggio, «Madonna of the Rosary», c. 1607" }, url: "https://commons.wikimedia.org/wiki/File:Madonna_of_the_Rosary-Caravaggio_(1607).jpg" },
      resumen: {
        es: "Consideraciones breves sobre los misterios gozosos, dolorosos y gloriosos, y un comentario a la letanía lauretana; desde 2003 incluye un apéndice con los misterios luminosos. Lo escribió de un tirón en 1931, en la acción de gracias después de la Misa, y se publicó en 1934.",
        en: "Short considerations on the joyful, sorrowful and glorious mysteries, and a commentary on the Litany of Loreto; since 2003 it includes an appendix with the luminous mysteries. He wrote it at one sitting in 1931, during his thanksgiving after Mass, and it was published in 1934."
      },
      citas: [
        "Amigo mío: si tienes deseos de ser grande, hazte pequeño.",
        "Ser pequeño exige creer como creen los niños, amar como aman los niños, abandonarse como se abandonan los niños..., rezar como rezan los niños.",
        "¿Siempre lo mismo? ¿Y no se dicen siempre lo mismo los que se aman?",
        "El principio del camino, que tiene por final la completa locura por Jesús, es un confiado amor hacia María Santísima."
      ],
      archivos: {},
      externos: [
        { formato: "web", idioma: "es", texto: "escriva.org", url: "https://escriva.org/es/santo-rosario/" },
        { formato: "web", idioma: "en", texto: "escriva.org", url: "https://escriva.org/en/santo-rosario/" }
      ],
      comprar: [{ texto: "librerías (escriva.org)", url: "https://escriva.org/es/page/where-to-buy-a-book/" }],
      fuente: { texto: "Texto publicado por la Fundación Studium en escriva.org (obra protegida por derechos de autor)", url: "https://escriva.org/es/santo-rosario/" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/santo-rosario" },
      parecidos: ["escriva-via-crucis", "escriva-camino", "imitacion-de-cristo"]
    },
    {
      id: "escriva-via-crucis",
      titulo: "Via Crucis",
      autor: "San Josemaría Escrivá",
      anio: "1981",
      idioma: "es",
      categoria: "oracion",
      recomendado: false,
      porque: {"es":"Para quien quiere acompañar a Jesús en la Pasión de manera personal, en Cuaresma o en un día difícil. Los comentarios son breves y cercanos, y los puntos numerados permiten detenerse en uno solo. Ayuda sobre todo a quien atraviesa un dolor y busca no quedarse solo con él.","en":"For anyone who wants to accompany Jesus in His Passion in a personal way, in Lent or on a hard day. The commentaries are short and close, and the numbered points allow one to dwell on just one. It helps above all those going through pain who do not want to be left alone with it."},
      imagen: { src: "img/portadas/escriva-via-crucis.jpg", credito: { es: "Rafael, «Caída en el camino del Calvario», 1517", en: "Raphael, «Christ Falls on the Way to Calvary», 1517" }, url: "https://commons.wikimedia.org/wiki/File:Raffaello_Sanzio_-_Christ_Falls_on_the_Way_to_Calvary_-_WGA18828.jpg" },
      resumen: {
        es: "Comentarios breves a las catorce estaciones, nacidos de su oración personal. Cada estación trae un relato y unos puntos de meditación numerados. Primera edición de 1981.",
        en: "Short commentaries on the fourteen stations, born of his personal prayer. Each station has a narrative and numbered points for meditation. First published in 1981."
      },
      citas: [
        "Dios es mi Padre, aunque me envíe sufrimiento. Me ama con ternura, aun hiriéndome.",
        "Es verdaderamente suave y amable la Cruz de Jesús. Ahí no cuentan las penas; solo la alegría de saberse corredentores con Él.",
        "Amor con amor se paga. Pero la certeza del cariño la da el sacrificio.",
        "Mi yugo es la libertad, mi yugo es el amor, mi yugo es la unidad, mi yugo es la vida, mi yugo es la eficacia."
      ],
      archivos: {},
      externos: [
        { formato: "web", idioma: "es", texto: "escriva.org", url: "https://escriva.org/es/via-crucis/" },
        { formato: "web", idioma: "en", texto: "escriva.org", url: "https://escriva.org/en/via-crucis/" }
      ],
      comprar: [{ texto: "librerías (escriva.org)", url: "https://escriva.org/es/page/where-to-buy-a-book/" }],
      fuente: { texto: "Texto publicado por la Fundación Studium en escriva.org (obra protegida por derechos de autor)", url: "https://escriva.org/es/via-crucis/" },
      delibris: {"valor":6,"genero":"Espiritualidad","url":"https://www.delibris.org/es/crucis-1"},
      parecidos: ["escriva-santo-rosario", "imitacion-de-cristo", "escriva-forja"]
    },
    {
      id: "escriva-cartas-1",
      titulo: "Cartas I",
      autor: "San Josemaría Escrivá",
      anio: "2020",
      idioma: "es",
      categoria: "lectura",
      recomendado: false,
      porque: {"es":"Para quien quiere conocer el espíritu del Opus Dei en palabras del fundador y no por resúmenes. Las cuatro cartas hablan de la santidad en la vida corriente, el trabajo, la oración en medio del mundo, la libertad y la amistad. Son textos largos y pausados: conviene leer de a una carta, partiendo por la introducción, que cuenta cómo se escribieron y cómo se recibieron.","en":"For anyone who wants to know the spirit of Opus Dei in the founder's own words rather than through summaries. The four letters speak of holiness in ordinary life, work, prayer in the midst of the world, freedom and friendship. They are long, unhurried texts: it is best to read one letter at a time, starting with the introduction, which tells how they were written and received."},
      imagen: { src: "img/portadas/escriva-cartas-1.jpg", credito: { es: "Johannes Vermeer, «Mujer de azul leyendo una carta», c. 1663", en: "Johannes Vermeer, «Woman in Blue Reading a Letter», c. 1663" }, url: "https://commons.wikimedia.org/wiki/File:Johannes_Vermeer_-_Woman_in_Blue_Reading_a_Letter_-_WGA24657.jpg" },
      resumen: {
        es: "Las cuatro primeras «Cartas» largas del fundador a los miembros del Opus Dei, con cuya edición pública se comenzó en septiembre de 2020. Tratan de la vida ordinaria como camino de santidad, la humildad, la misión del cristiano en la vida social y la caridad al transmitir la fe.",
        en: "The founder's first four long «Letters» to the members of Opus Dei, whose public edition began in September 2020. They deal with ordinary life as a path to holiness, humility, the Christian's mission in social life and charity in passing on the faith."
      },
      citas: [
        "Hijos míos, lo extraordinario nuestro es lo ordinario: lo ordinario hecho con perfección.",
        "La santidad no es cosa para privilegiados: que a todos nos llama el Señor, que de todos espera Amor: de todos, estén donde estén; de todos, cualquiera que sea su estado, su profesión o su oficio.",
        "Todos los caminos de la tierra pueden ser ocasión de un encuentro con Cristo.",
        "No te turbe conocerte como eres: así, de barro. No te preocupe."
      ],
      archivos: {},
      // opusdei.org publica cada carta por separado en EPUB y PDF (edición de Luis Cano, © Scriptor y Fundación Studium).
      externos: [
        { formato: "epub", idioma: "es", texto: "Carta 1 · opusdei.org", url: "https://multimedia.opusdei.org/doc/epub/Singuli%20dies20240511170204015700.epub" },
        { formato: "pdf", idioma: "es", texto: "Carta 1 · opusdei.org", url: "https://multimedia.opusdei.org/doc/pdf/Singuli-dies-cristiano%20vida%20corriente-opusdei20240511170226271129.pdf" },
        { formato: "epub", idioma: "es", texto: "Carta 2 · opusdei.org", url: "https://multimedia.opusdei.org/doc/epub/Carta%202%20de%20San%20Josemar%C3%ADa20230816092931794913.epub" },
        { formato: "pdf", idioma: "es", texto: "Carta 2 · opusdei.org", url: "https://multimedia.opusdei.org/doc/pdf/Carta%20Josemaria%20Escriva%20Humildad20221114095438261613.pdf" },
        { formato: "epub", idioma: "es", texto: "Carta 3 · opusdei.org", url: "https://multimedia.opusdei.org/doc/epub/carta3sjme%20-%20Josemaria%20Escriva%20de%20Balaguer20220107144802012927.epub" },
        { formato: "pdf", idioma: "es", texto: "Carta 3 · opusdei.org", url: "https://multimedia.opusdei.org/doc/pdf/Carta%20sanJosemaria%20cristiano%20vida%20social20220117131850319581.pdf" },
        { formato: "epub", idioma: "es", texto: "Carta 4 · opusdei.org", url: "https://multimedia.opusdei.org/doc/epub/Vos_autem20221222115955175662.epub" },
        { formato: "pdf", idioma: "es", texto: "Carta 4 · opusdei.org", url: "https://multimedia.opusdei.org/doc/pdf/San%20Josemaria%20caridad%20transmision%20fe20221222120015808915.pdf" }
      ],
      comprar: [{ texto: "librerías (escriva.org)", url: "https://escriva.org/es/page/where-to-buy-a-book/" }],
      fuente: { texto: "Cada carta en EPUB y PDF en opusdei.org, edición de Luis Cano (© Scriptor y Fundación Studium; obra protegida por derechos de autor)", url: "https://opusdei.org/es-cl/article/santidad-cristianos-vida-corriente/" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/cartas-i-edicion-critico-historica" },
      parecidos: ["escriva-cartas-2", "escriva-carta-29", "escriva-es-cristo-que-pasa"]
    },
    {
      id: "escriva-cartas-2",
      titulo: "Cartas II",
      autor: "San Josemaría Escrivá",
      anio: "2022",
      idioma: "es",
      categoria: "lectura",
      recomendado: false,
      porque: {"es":"Para quien ya leyó las primeras cartas y quiere seguir, y para padres, profesores y educadores que se preguntan qué papel tiene la fe en la formación de los jóvenes. El tono es el de un padre que conversa y no escribe un tratado, así que vuelve sobre los mismos temas: educación, libertad, juventud y servicio a la Iglesia. Mejor leer una carta por vez.","en":"For anyone who has read the first letters and wants to continue, and for parents, teachers and educators who ask what role faith has in forming young people. The tone is that of a father in conversation, not of a treatise, so he returns to the same themes: education, freedom, youth and service to the Church. It is best to read one letter at a time."},
      imagen: { src: "img/portadas/escriva-cartas-2.jpg", credito: { es: "Johannes Vermeer, «Muchacha leyendo una carta junto a la ventana», c. 1657-1659", en: "Johannes Vermeer, «Girl Reading a Letter at an Open Window», c. 1657-1659" }, url: "https://commons.wikimedia.org/wiki/File:Johannes_Vermeer_-_Girl_Reading_a_Letter_by_an_Open_Window_-_Google_Art_Project.jpg" },
      resumen: {
        es: "Cuatro cartas (n.º 5 a 8), fechadas entre 1939 y 1943 y muy reelaboradas en los años sesenta. Tratan de la misión de los laicos en la educación, el carisma del Opus Dei y su misión evangelizadora, la formación cristiana de la juventud y el espíritu de servicio a la Iglesia. Publicadas en 2022.",
        en: "Four letters (nos. 5 to 8), dated between 1939 and 1943 and extensively reworked in the 1960s. They deal with the mission of lay people in education, the charism of Opus Dei and its evangelising mission, the Christian formation of young people and the spirit of service to the Church. Published in 2022."
      },
      citas: [
        "Solo cuando los hombres se acostumbren a decir y a oír la verdad, habrá comprensión y concordia.",
        "El cristiano, que se sabe libre, pierde gustoso la libertad por amor a Jesucristo, para ser servidor de sus hermanos los hombres.",
        "La verdad no puede ser artículo de lujo.",
        "Nadie puede frenar una impaciencia santa, divina, por servir a la Iglesia y a las almas."
      ],
      archivos: {},
      // opusdei.org publica cada carta por separado en EPUB y PDF (edición de Luis Cano, © Scriptor y Fundación Studium).
      externos: [
        { formato: "epub", idioma: "es", texto: "Carta 5 · opusdei.org", url: "https://multimedia.opusdei.org/doc/epub/Carta%20sobre%20la%20misio%CC%81n%20de%20los%20cristianos%20laicos%20en%20la%20educacio%CC%81n20250108113317774604.epub" },
        { formato: "pdf", idioma: "es", texto: "Carta 5 · opusdei.org", url: "https://multimedia.opusdei.org/doc/pdf/Carta%20sobre%20la%20misio%CC%81n%20de%20los%20cristianos%20laicos%20en%20la%20educacio%CC%81n20250108113340502737.pdf" },
        { formato: "epub", idioma: "es", texto: "Carta 6 · opusdei.org", url: "https://multimedia.opusdei.org/doc/epub/Algunos_rasgos_del_espiritu_del_opus_dei20231216102204875211.epub" },
        { formato: "pdf", idioma: "es", texto: "Carta 6 · opusdei.org", url: "https://multimedia.opusdei.org/doc/pdf/Algunos_rasgos_del_espiritu_del_opus_dei20231216102226482656.pdf" },
        { formato: "epub", idioma: "es", texto: "Carta 7 · opusdei.org", url: "https://multimedia.opusdei.org/doc/epub/Quem%20per%20annos-labor-san-rafael-opusdei20241022084726105905.epub" },
        { formato: "pdf", idioma: "es", texto: "Carta 7 · opusdei.org", url: "https://multimedia.opusdei.org/doc/pdf/Quem-per-annos-labor-san-rafael-opusdei20241022084745609234.pdf" },
        { formato: "epub", idioma: "es", texto: "Carta 8 · opusdei.org", url: "https://multimedia.opusdei.org/doc/epub/sobre-el-espiritu-de-servicio-a-la-iglesia20250430190014520448.epub" },
        { formato: "pdf", idioma: "es", texto: "Carta 8 · opusdei.org", url: "https://multimedia.opusdei.org/doc/pdf/sobre-el-espiritu-de-servicio-a-la-iglesia20250430185942125318.pdf" }
      ],
      comprar: [{ texto: "librerías (escriva.org)", url: "https://escriva.org/es/page/where-to-buy-a-book/" }],
      fuente: { texto: "Cada carta en EPUB y PDF en opusdei.org, edición de Luis Cano (© Scriptor y Fundación Studium; obra protegida por derechos de autor)", url: "https://opusdei.org/es-cl/article/carta-san-josemaria-mision-cristianos-educacion/" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/cartas-ii-edicion-critico-historica" },
      parecidos: ["escriva-cartas-1", "escriva-carta-29", "escriva-amar-a-la-iglesia"]
    },
    {
      id: "escriva-carta-29",
      titulo: "Carta n.º 29",
      autor: "San Josemaría Escrivá",
      anio: "1959",
      idioma: "es",
      categoria: "lectura",
      recomendado: false,
      porque: {"es":"Para quien ha oído hablar del Opus Dei y se pregunta cómo encaja en él el matrimonio y la vida de familia. La carta tiene un tono familiar, de padre que conversa, y explica el origen de un apostolado concreto. Es una lectura de contexto histórico y de espíritu, más que de consejos prácticos.","en":"For anyone who has heard of Opus Dei and wonders how marriage and family life fit into it. The letter has a familiar tone, that of a father in conversation, and explains the origin of a particular apostolate. It is a read for historical context and spirit rather than for practical advice."},
      imagen: { src: "img/portadas/escriva-carta-29.jpg", credito: { es: "Gabriël Metsu, «Mujer leyendo una carta», c. 1665", en: "Gabriël Metsu, «Woman Reading a Letter», c. 1665" }, url: "https://commons.wikimedia.org/wiki/File:Woman_Reading_a_Letter_by_Gabri%C3%ABl_Metsu.jpg" },
      resumen: {
        es: "Carta larga, fechada el 9 de enero de 1959, sobre la obra de San Gabriel: el apostolado con personas que, en general, siguen el camino del matrimonio. Pertenece al género de las «Cartas» del fundador sobre el carisma y la historia del Opus Dei, en tono familiar. Su edición crítica apareció en «Studia et Documenta» 17 (2023).",
        en: "A long letter, dated 9 January 1959, on the work of Saint Gabriel: the apostolate with people who are, in general, called to marriage. It belongs to the founder's «Letters» on the charism and history of Opus Dei, written in a familiar tone. Its critical edition appeared in «Studia et Documenta» 17 (2023)."
      },
      citas: [
        "En la vida espiritual no hay nada que inventar; solo cabe luchar por identificarse con Cristo.",
        "Pobre concepto tiene del matrimonio, que es un ideal y una vocación, el que piensa que la alegría se acaba cuando empiezan las dificultades y contratiempos que la vida lleva consigo.",
        "Que os queráis, que os tengáis siempre el amor ilusionado que os tuvisteis cuando erais novios.",
        "El trigo no se siembra a sacos, sino grano a grano."
      ],
      archivos: {},
      externos: [{ formato: "web", idioma: "es", texto: "escriva.org", url: "https://escriva.org/es/carta-29/" }],
      comprar: [{ texto: "librerías (escriva.org)", url: "https://escriva.org/es/page/where-to-buy-a-book/" }],
      fuente: { texto: "Texto publicado por la Fundación Studium en escriva.org (obra protegida por derechos de autor)", url: "https://escriva.org/es/carta-29/" },
      delibris: null,
      parecidos: ["escriva-cartas-1", "escriva-cartas-2", "escriva-es-cristo-que-pasa"]
    },
    {
      id: "escriva-conversaciones",
      titulo: "Conversaciones con Mons. Escrivá de Balaguer",
      autor: "San Josemaría Escrivá",
      anio: "1968",
      idioma: "es",
      categoria: "lectura",
      recomendado: false,
      porque: {"es":"Para quien quiere oír al fundador respondiendo preguntas directas de periodistas, sin el tono de la predicación. Las entrevistas tocan temas que siguen vigentes, como la libertad, el trabajo y el papel de la mujer, y el libro cierra con la homilía «Amar al mundo apasionadamente», que condensa su mensaje. Es una buena puerta de entrada a su pensamiento y se lee entrevista por entrevista.","en":"For anyone who wants to hear the founder answering journalists' direct questions, without the tone of preaching. The interviews touch on subjects that remain current, such as freedom, work and the role of women, and the book closes with the homily \"Passionately Loving the World,\" which condenses his message. It is a good doorway into his thinking and can be read one interview at a time."},
      imagen: { src: "img/portadas/escriva-conversaciones.jpg", credito: { es: "Alberto Durero, «Jesús entre los doctores», 1506", en: "Albrecht Dürer, «Jesus among the Doctors», 1506" }, url: "https://commons.wikimedia.org/wiki/File:Albrecht_D%C3%BCrer_-_Jesus_among_the_Doctors_-_Google_Art_Project.jpg" },
      resumen: {
        es: "Siete entrevistas de 1966 a 1968 (Le Figaro, The New York Times, Time, L'Osservatore della Domenica, Telva, Gaceta Universitaria y Palabra) sobre la Iglesia y el Concilio, las libertades personales, la universidad, la mujer en la sociedad y el Opus Dei. Cierra con la homilía «Amar al mundo apasionadamente», del 8 de octubre de 1967.",
        en: "Seven interviews from 1966 to 1968 (Le Figaro, The New York Times, Time, L'Osservatore della Domenica, Telva, Gaceta Universitaria and Palabra) on the Church and the Council, personal freedoms, the university, women in society and Opus Dei. It ends with the homily «Passionately Loving the World», of 8 October 1967."
      },
      citas: [
        "Hijos míos, allí donde están vuestros hermanos los hombres, allí donde están vuestras aspiraciones, vuestro trabajo, vuestros amores, allí está el sitio de vuestro encuentro cotidiano con Cristo.",
        "El mundo no es malo, porque ha salido de las manos de Dios, porque es criatura suya, porque Yaveh lo miró y vio que era bueno. Somos los hombres los que lo hacemos malo y feo, con nuestros pecados y nuestras infidelidades.",
        "Hay un algo santo, divino, escondido en las situaciones más comunes, que toca a cada uno de vosotros descubrir.",
        "No hay otro camino, hijos míos: o sabemos encontrar en nuestra vida ordinaria al Señor, o no lo encontraremos nunca."
      ],
      archivos: {},
      externos: [
        { formato: "web", idioma: "es", texto: "escriva.org", url: "https://escriva.org/es/conversaciones/" },
        { formato: "web", idioma: "en", texto: "escriva.org", url: "https://escriva.org/en/conversaciones/" }
      ],
      comprar: [{ texto: "librerías (escriva.org)", url: "https://escriva.org/es/page/where-to-buy-a-book/" }],
      fuente: { texto: "Texto publicado por la Fundación Studium en escriva.org (obra protegida por derechos de autor)", url: "https://escriva.org/es/conversaciones/" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/conversaciones-con-mons-escriva-de-balaguer" },
      parecidos: ["escriva-amar-a-la-iglesia", "escriva-discursos-universidad", "ortodoxia"]
    },
    {
      id: "escriva-abadesa-de-las-huelgas",
      titulo: "La Abadesa de las Huelgas",
      autor: "San Josemaría Escrivá",
      anio: "1944",
      idioma: "es",
      categoria: "ensayo",
      recomendado: false,
      porque: {"es":"Para quien conoce a san Josemaría por sus libros de oración y quiere ver otra faceta suya: la del estudioso que trabaja con documentos y razona con rigor jurídico. Sirve también a quien se interesa por la historia de los monasterios en España. Es lectura de consulta, para ir por capítulos y no de corrido.","en":"For readers who know Saint Josemaría from his books on prayer and want to see another side of him: the scholar who works from documents and argues with legal rigour. It also suits anyone interested in the history of monasteries in Spain. It is a book to consult chapter by chapter rather than read straight through."},
      imagen: { src: "img/portadas/escriva-abadesa-de-las-huelgas.jpg", credito: { es: "Alfonso VIII y Leonor, fundadores de Las Huelgas, miniatura medieval", en: "Alfonso VIII and Eleanor, founders of Las Huelgas, medieval miniature" }, url: "https://commons.wikimedia.org/wiki/File:Alfonso_VIII_de_Castilla_y_Leonor.jpg" },
      resumen: {
        es: "Estudio teológico-jurídico, hecho sobre fuentes originales, de la jurisdicción cuasi episcopal que tuvo la abadesa del monasterio de Las Huelgas, en Burgos. Doce capítulos y dos apéndices: la serie cronológica de las abadesas y las reales cédulas de Felipe V. Primera edición de 1944.",
        en: "A theological and juridical study, based on original sources, of the quasi-episcopal jurisdiction held by the abbess of the monastery of Las Huelgas in Burgos. Twelve chapters and two appendices: the chronological list of abbesses and the royal decrees of Philip V. First published in 1944."
      },
      citas: [
        "Aquí te presento, amable lector, a la famosa Abadesa de Las Huelgas.",
        "Pero no te asustes, porque desde ahora te adelanto que, si te decides a recorrer el camino, podrás también permitirte algún esparcimiento a cuenta de las anécdotas que sembré a lo largo de este relato, para tu recreo y tu descanso.",
        "Pero si tomas en cuenta la grandeza varias veces secular del Monasterio que las cobija, alzarás conmigo el corazón a Dios y pedirás al Señor de la mies que envíe más almas a esta ilustre Casa."
      ],
      archivos: {},
      externos: [{ formato: "web", idioma: "es", texto: "escriva.org", url: "https://escriva.org/es/la-abadesa-de-las-huelgas/" }],
      comprar: [{ texto: "librerías (escriva.org)", url: "https://escriva.org/es/page/where-to-buy-a-book/" }],
      fuente: { texto: "Texto publicado por la Fundación Studium en escriva.org (obra protegida por derechos de autor)", url: "https://escriva.org/es/la-abadesa-de-las-huelgas/" },
      delibris: {"valor":6,"genero":"Pensamiento","url":"https://www.delibris.org/es/la-abadesa-de-las-huelgas-edicion-critico-historica"},
      parecidos: ["escriva-discursos-universidad", "escriva-conversaciones", "escriva-cartas-1"]
    },
    {
      id: "escriva-discursos-universidad",
      titulo: "Discursos sobre la Universidad",
      autor: "San Josemaría Escrivá",
      anio: "s. f.",
      idioma: "es",
      categoria: "lectura",
      recomendado: false,
      porque: {"es":"Para estudiantes, profesores y quienes trabajan en una institución de enseñanza, que se preguntan para qué sirve el estudio y cómo se relaciona con la fe. Los discursos tratan la universidad como un lugar de servicio a la sociedad. También interesan a quien quiera conocer la historia de la Universidad de Navarra, contada por su fundador.","en":"For students, teachers and anyone working in an educational institution who asks what study is for and how it relates to faith. The speeches treat the university as a place of service to society. They also interest anyone who wants to know the story of the University of Navarra as told by its founder."},
      imagen: { src: "img/portadas/escriva-discursos-universidad.jpg", credito: { es: "Laurentius de Voltolina, «Una clase en la Universidad de Bolonia», siglo XIV", en: "Laurentius de Voltolina, «A Lecture at the University of Bologna», 14th century" }, url: "https://commons.wikimedia.org/wiki/File:Laurentius_de_Voltolina_001.jpg" },
      resumen: {
        es: "Volumen preparado por la Universidad de Navarra con motivo de la beatificación de su fundador. Reúne sus discursos académicos, la homilía del campus de octubre de 1967 y otras intervenciones públicas sobre la universidad; cierra con los discursos del acto académico del 26 de junio de 1992. Prólogo del beato Álvaro del Portillo.",
        en: "A volume prepared by the University of Navarra on the occasion of its founder's beatification. It gathers his academic speeches, the campus homily of October 1967 and other public statements on the university, and closes with the speeches of the academic ceremony of 26 June 1992. Foreword by Blessed Álvaro del Portillo."
      },
      citas: [
        "La Universidad tiene como su más alta misión el servicio a los hombres, el ser fermento de la sociedad en que vive.",
        "Amamos y respetamos la libertad, y creemos en su valor educativo y pedagógico. Estamos convencidos de que en un clima así se forman almas con libertad interior, y se forjan hombres capaces de vivir responsablemente la doctrina de Cristo.",
        "La Universidad sabe que la necesaria objetividad científica rechaza justamente toda neutralidad ideológica, toda ambigüedad, todo conformismo, toda cobardía: el amor a la verdad compromete la vida y el trabajo entero del científico.",
        "La Universidad no vive de espaldas a ninguna incertidumbre, a ninguna inquietud, a ninguna necesidad de los hombres."
      ],
      archivos: {},
      externos: [{ formato: "web", idioma: "es", texto: "escriva.org", url: "https://escriva.org/es/josemaria-escriva-de-balaguer-y-la-universidad/" }],
      comprar: [{ texto: "librerías (escriva.org)", url: "https://escriva.org/es/page/where-to-buy-a-book/" }],
      fuente: { texto: "Texto publicado por la Fundación Studium en escriva.org (obra protegida por derechos de autor)", url: "https://escriva.org/es/josemaria-escriva-de-balaguer-y-la-universidad/" },
      delibris: null,
      parecidos: ["escriva-conversaciones", "escriva-abadesa-de-las-huelgas", "ortodoxia"]
    },

    // ---------- Libros electrónicos gratuitos de opusdei.org: protegidos, descarga en el sitio oficial ----------
    {
      id: "para-mi-vivir-es-cristo",
      titulo: "Para mí, vivir es Cristo",
      autor: "Rodolfo Valdés (ed.)",
      anio: "2018",
      idioma: "es",
      categoria: "lectura",
      recomendado: true,
      resumen: {
        es: "Ocho artículos de siete autores sobre una idea de san Pablo: ser cristiano es vivir en Cristo, vivir nuestra vida con Él y Su vida en la nuestra. Parten de una carta pastoral de Mons. Fernando Ocáriz, prelado del Opus Dei, del 14 de febrero de 2017, y recorren la esperanza, la oración contemplativa en medio del mundo, la formación de la persona entera y de la afectividad, la libertad interior, la lucha espiritual como respuesta agradecida al don de Dios y el sentido de misión.",
        en: "Eight articles by seven authors on an idea of Saint Paul: to be a Christian is to live in Christ, to live our life with Him and His life in ours. They start from a pastoral letter of Msgr. Fernando Ocáriz, prelate of Opus Dei, dated 14 February 2017, and cover hope, contemplative prayer in the middle of the world, the formation of the whole person and of the affections, interior freedom, spiritual struggle as a grateful response to God's gift, and the sense of mission."
      },
      porque: {"es":"Para quien busca un hilo común entre su oración, su trabajo y sus afectos, y se pregunta cómo formarse como persona entera. Cada artículo se puede leer por separado, según el tema que hoy importe: la esperanza, la libertad interior o la lucha espiritual. Sirve también para grupos de lectura y conversación.","en":"For anyone looking for a common thread between their prayer, their work and their affections, and who asks how to be formed as a whole person. Each article can be read on its own, according to the theme that matters today: hope, interior freedom or spiritual struggle. It also suits reading and discussion groups."},
      imagen: { src: "img/portadas/para-mi-vivir-es-cristo.jpg", credito: { es: "Caravaggio, «La conversión de san Pablo», c. 1600-1601", en: "Caravaggio, «The Conversion of Saint Paul», c. 1600-1601" }, url: "https://commons.wikimedia.org/wiki/File:Conversion_on_the_Way_to_Damascus-Caravaggio_(c.1600-1).jpg" },
      citas: [
        "Ser cristiano es vivir en Cristo, vivir nuestra vida con Él, vivir su vida en la nuestra.",
        "Descubrir el Amor que Dios nos tiene es el motivo más grande que podemos hallar para amar.",
        "El descubrimiento del Amor de Dios es el motor más potente para nuestra vida cristiana.",
        "No forma el hacer, sino el querer: no solo importa lo que hago, sino también lo que quiero cuando lo hago."
      ],
      archivos: {},
      externos: [
        { formato: "epub", texto: "opusdei.org", url: "https://multimedia.opusdei.org/epub/es/para-mi-vivir-es-cristo.epub" },
        { formato: "pdf", texto: "opusdei.org", url: "https://multimedia.opusdei.org/pdf/es/para-mi-vivir-es-cristo.pdf" }
      ],
      fuente: { texto: "Edición gratuita de la Oficina de Información del Opus Dei (obra protegida por derechos de autor)", url: "https://opusdei.org/es-cl/article/libro-electronico-para-mi-vivir-es-cristo/" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/para-mi-vivir-es-cristo" },
      parecidos: ["one-with-jesus", "marmion-vida-del-alma", "escriva-es-cristo-que-pasa"]
    },
    {
      id: "conocerle-y-conocerte",
      titulo: "Conocerle y conocerte",
      autor: "Rubén Herce (ed.)",
      anio: "2022",
      idioma: "es",
      categoria: "oracion",
      recomendado: false,
      resumen: {
        es: "Doce capítulos de doce autores que forman un itinerario de oración personal: rezar con la Palabra de Dios y con los santos, el silencio interior, cómo habla Dios, las dificultades, la unión entre oración y vida, la oración litúrgica y la contemplación en la vida ordinaria. El título viene de «Camino», n. 91, de san Josemaría: orar es, «en dos palabras: conocerle y conocerte».",
        en: "Twelve chapters by twelve authors that form a path of personal prayer: praying with the Word of God and with the saints, interior silence, how God speaks, difficulties, the unity of prayer and life, liturgical prayer and contemplation in ordinary life. The title comes from «The Way», no. 91, by Saint Josemaría: to pray is, «in two words: to know Him and to know yourself»."
      },
      porque: {"es":"Para quien quiere aprender a rezar o rezar mejor y no sabe cómo empezar, o se desanima cuando la oración parece vacía. Cada capítulo toma una dificultad o un aspecto concreto, de modo que se puede leer por orden o buscar el que hoy hace falta. Resulta útil también para acompañar a otros en su oración.","en":"For anyone who wants to learn to pray, or to pray better, and does not know how to begin, or gets discouraged when prayer seems empty. Each chapter takes up a concrete difficulty or aspect, so it can be read in order or one can look for the chapter needed today. It is also useful for accompanying others in their prayer."},
      imagen: { src: "img/portadas/conocerle-y-conocerte.jpg", credito: { es: "Jean-François Millet, «El Ángelus», 1857-1859", en: "Jean-François Millet, «The Angelus», 1857-1859" }, url: "https://commons.wikimedia.org/wiki/File:Jean-Fran%C3%A7ois_Millet_-_The_Angelus_-_Google_Art_Project.jpg" },
      citas: [
        "A Dios le interesa todo lo nuestro, por trivial o insignificante que parezca.",
        "Nuestro empeño por vivir a su lado es siempre menor que el suyo por tenernos cerca.",
        "Así como hacen los niños en brazos de su madre, podemos descansar en él, entregarle nuestro aturdimiento, refugiarnos en su corazón para alcanzar la paz.",
        "En la vida de la gracia, lo decisivo no es lo que hacemos sino lo que obra el Señor.",
        "Por la fe sabemos que el Señor está siempre al otro lado de la línea."
      ],
      archivos: {},
      externos: [
        { formato: "epub", texto: "opusdei.org", url: "https://multimedia.opusdei.org/doc/epub/Conocerle%20y%20conocerte%20-%20Rube%CC%81n%20Herce20220211103944293804.epub" },
        { formato: "pdf", texto: "opusdei.org", url: "https://multimedia.opusdei.org/doc/pdf/Conocerle-y-conocerte-Rube%CC%81n-Herce-OpusDei20220211104056760739.pdf" }
      ],
      fuente: { texto: "Edición gratuita de la Fundación Studium en opusdei.org (obra protegida por derechos de autor)", url: "https://opusdei.org/es-cl/article/conocerle-conocerte-oracion-libro/" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/conocerle-y-conocerte-la-oracion-personal-lugar-de-encuentro-con-el-dios-cercano" },
      parecidos: ["presencia-de-dios", "escriva-camino", "escriva-en-dialogo-con-el-senor"]
    },
    {
      id: "a-la-luz-del-evangelio",
      titulo: "A la luz del Evangelio",
      autor: "Fernando Ocáriz",
      anio: "2020",
      idioma: "es",
      categoria: "oracion",
      recomendado: true,
      resumen: {
        es: "Textos breves del prelado del Opus Dei para meditar el Evangelio en la vida corriente: la llamada de Dios, la oración y el silencio, la Misa como centro y raíz, la filiación divina, el trabajo, la familia, la amistad, la misericordia y la alegría. Nacieron como apuntes para la predicación que el autor fue tomando en un cuaderno desde 1977; les dio una forma breve para que ayuden a la oración y a un trato más directo con Jesucristo. El hilo de fondo es la identificación con Cristo: no solo imitarlo, sino llegar a identificarse con Él.",
        en: "Short texts by the prelate of Opus Dei for meditating on the Gospel in ordinary life: God's call, prayer and silence, the Mass as centre and root, divine filiation, work, family, friendship, mercy and joy. They began as notes for preaching that the author kept in a notebook from 1977; he gave them a brief form so that they help prayer and a more direct dealing with Jesus Christ. The thread running through them is identification with Christ: not only imitating Him, but coming to be identified with Him."
      },
      porque: {"es":"Para quien quiere meditar el Evangelio en la vida corriente, con textos breves que caben en un rato de oración antes de la jornada o después del trabajo. Hablan de temas cercanos, como la familia, la amistad o el trabajo, y siempre llevan la mirada a Jesucristo. Una buena compañía para un hábito diario de oración.","en":"For anyone who wants to meditate on the Gospel in ordinary life, with short texts that fit into a spell of prayer before the day or after work. They speak about familiar matters, such as family, friendship or work, and always turn the gaze to Jesus Christ. A good companion for a daily habit of prayer."},
      imagen: { src: "img/portadas/a-la-luz-del-evangelio.jpg", credito: { es: "Rembrandt, «Los peregrinos de Emaús», 1648", en: "Rembrandt, «The Supper at Emmaus», 1648" }, url: "https://commons.wikimedia.org/wiki/File:Rembrandt_The_Supper_at_Emmaus.jpg" },
      citas: [
        "La vida cristiana no nos lleva a identificarnos con una idea, sino con una persona: con Jesucristo.",
        "El camino de nuestra entrada en la intimidad del Padre, del Hijo y del Espíritu Santo, es seguir a Cristo, pero de tal modo que no solo le imitemos, sino que lleguemos a identificarnos con él.",
        "No puede haber en esta vida una alegría más completa que la del hijo de Dios, porque ningún bien puede compararse a la infinita riqueza de ser familiares de Dios, hijos de Dios; nada de este mundo debería robarle su alegría.",
        "Cuando la propia debilidad, los propios errores y las limitaciones se hagan particularmente presentes, la humildad nos exige considerar, a la vez, nuestra grandeza: nuestra filiación divina, nuestra permanente condición de hijos de Dios.",
        "Estaremos contentos, pase lo que pase, en la medida de nuestra fe en el amor que Dios nos tiene."
      ],
      archivos: {},
      externos: [
        { formato: "epub", texto: "opusdei.org", url: "https://odnmedia.s3.amazonaws.com/files/A-la-luz-del-Evangelio-Fernando-Ocariz20210520-08133320210703-100732.epub" },
        { formato: "pdf", texto: "opusdei.org", url: "https://odnmedia.s3.amazonaws.com/files/A-la-luz-del-Evangelio-Fernando-Ocariz20210520-081449.pdf" }
      ],
      fuente: { texto: "Edición gratuita de la Fundación Studium en opusdei.org (obra protegida por derechos de autor)", url: "https://opusdei.org/es-cl/article/a-la-luz-del-evangelio-fernando-ocariz-libro-palabra/" },
      delibris: {"valor":6,"genero":"Espiritualidad","url":"https://www.delibris.org/es/la-luz-del-evangelio"},
      parecidos: ["conocerle-y-conocerte", "para-mi-vivir-es-cristo", "santos-evangelios-navarra"]
    },
    {
      id: "santos-evangelios-navarra",
      titulo: "Santos Evangelios",
      autor: "Facultad de Teología de la Universidad de Navarra",
      anio: "2017",
      idioma: "es",
      categoria: "lectura",
      recomendado: true,
      resumen: {
        es: "Los cuatro Evangelios en la traducción de la Facultad de Teología de la Universidad de Navarra, hecha desde los textos originales según las orientaciones del Concilio Vaticano II (Dei Verbum, 22): es la misma de su Sagrada Biblia, publicada en papel entre 1997 y 2004. Trae 443 comentarios, notas que se abren con un toque sobre la palabra y dos mapas en color, con prólogo de Mons. Fernando Ocáriz como Gran Canciller. La Facultad y su editorial, EUNSA, la regalaron por los 50 años de la Facultad, en versión española y latinoamericana. La Biblia completa de Navarra se vende aparte.",
        en: "The four Gospels in the translation by the Faculty of Theology of the University of Navarra, made from the original texts following the guidance of the Second Vatican Council (Dei Verbum, 22): the same as its Holy Bible, printed between 1997 and 2004. It includes 443 commentaries, notes that open with a tap on the word and two colour maps, with a foreword by Msgr. Fernando Ocáriz as Grand Chancellor. The Faculty and its publisher, EUNSA, gave it away for the Faculty's 50th anniversary, in Spanish and Latin American versions. The complete Navarre Bible is sold separately."
      },
      porque: {"es":"Para quien quiere leer los Evangelios con una traducción cuidada y con notas que aclaran lo que el texto no explica solo: costumbres, lugares, palabras difíciles. Sirve tanto a quien los abre por primera vez como a quien los reza a diario. Los mapas y los comentarios ayudan a no perderse en el relato.","en":"For anyone who wants to read the Gospels in a careful translation with notes that clarify what the text does not explain by itself: customs, places, difficult words. It suits both those opening them for the first time and those who pray with them daily. The maps and commentaries help the reader keep their bearings in the narrative."},
      imagen: { src: "img/portadas/santos-evangelios-navarra.jpg", credito: { es: "Jacob Jordaens, «Los cuatro evangelistas», c. 1625-1630", en: "Jacob Jordaens, «The Four Evangelists», c. 1625-1630" }, url: "https://commons.wikimedia.org/wiki/File:Four_Evangelists_Jordaens_Louvre_Inv1404.jpg" },
      citas: [
        "Tanto amó Dios al mundo que le entregó a su Hijo Unigénito, para que todo el que cree en él no perezca, sino que tenga vida eterna. (Jn 3, 16)",
        "Venid a mí todos los fatigados y agobiados, y yo os aliviaré. Llevad mi yugo sobre vosotros y aprended de mí que soy manso y humilde de corazón, y encontraréis descanso para vuestras almas. (Mt 11, 28-29)",
        "Yo soy la vid, vosotros los sarmientos. El que permanece en mí y yo en él, ése da mucho fruto, porque sin mí no podéis hacer nada. (Jn 15, 5)",
        "Nadie tiene amor más grande que el de dar uno la vida por sus amigos. (Jn 15, 13)",
        "Buscad primero el Reino de Dios y su justicia, y todas estas cosas se os añadirán. (Mt 6, 33)"
      ],
      archivos: {},
      externos: [
        { formato: "ebook", texto: "Google Play Libros, gratis (edición latinoamericana)", url: "https://play.google.com/store/books/details?id=K8c3DwAAQBAJ" },
        { formato: "ebook", texto: "Apple Books, gratis (edición latinoamericana)", url: "https://itunes.apple.com/es/book/santos-evangelios/id1291470055" },
        { formato: "ebook", texto: "Google Play Libros, gratis (edición española)", url: "https://play.google.com/store/books/details?id=J8c3DwAAQBAJ" }
      ],
      comprar: [{ texto: "Biblia completa de Navarra, edición latinoamericana (Google Play Libros)", url: "https://play.google.com/store/books/details?id=oqgkDQAAQBAJ" }],
      fuente: { texto: "Edición digital gratuita de la Facultad de Teología y EUNSA, Universidad de Navarra (obra protegida por derechos de autor)", url: "https://opusdei.org/es/article/edicion-digital-gratuita-de-los-evangelios-universidad-de-navarra/" },
      delibris: null,
      parecidos: ["a-la-luz-del-evangelio", "imitacion-de-cristo", "para-mi-vivir-es-cristo"]
    },
    {
      id: "the-lord-is-my-joy",
      titulo: "The Lord is my Joy",
      autor: "Paul de Jaegher, S.J.",
      anio: "1948",
      idioma: "en",
      categoria: "lectura",
      recomendado: false,
      resumen: {
        es: "Otra obra de espiritualidad de Paul de Jaegher, el autor de «One with Jesus». La edición inglesa salió en Londres (Burns Oates, 1948) y en Estados Unidos (Newman Press, 1949); en español se publicó como «El Señor es mi alegría» (El Mensajero del Corazón de Jesús, Bilbao, 1954, traducción del P. Luis Ramírez). Sigue protegida por derechos de autor hasta fines de 2028, por eso va como enlace para comprar. La reseña completa se agregará cuando Fénix tenga el texto.",
        en: "Another spiritual work by Paul de Jaegher, the author of «One with Jesus». The English edition came out in London (Burns Oates, 1948) and in the United States (Newman Press, 1949). It remains under copyright until the end of 2028, so it is listed with a link to buy it. A full review will be added once Fénix has the text."
      },
      imagen: { src: "img/portadas/the-lord-is-my-joy.jpg", credito: { es: "Bartolomé Esteban Murillo, «El Buen Pastor», c. 1660", en: "Bartolomé Esteban Murillo, «The Good Shepherd», c. 1660" }, url: "https://commons.wikimedia.org/wiki/File:BuenPastorMurillo1660.jpg" },
      citas: [],
      archivos: {},
      comprar: [
        { texto: "Buscalibre (ISBN 9781258942526)", url: "https://www.buscalibre.cl/libro-the-lord-is-my-joy/9781258942526/p/56466857" },
        { texto: "Amazon (ISBN 9781258942526)", url: "https://www.amazon.com/s?k=9781258942526" }
      ],
      fuente: { texto: "Reimpresión facsimilar de Literary Licensing; De Jaegher murió en 1958", url: "https://openlibrary.org/works/OL3683706W" },
      delibris: null,
      parecidos: ["one-with-jesus", "presencia-de-dios", "imitacion-de-cristo"]
    },
    {
      id: "apologia-de-socrates",
      titulo: "Apología de Sócrates",
      autor: "Platón (trad. Patricio de Azcárate)",
      anio: "c. 390 a. C.",
      idioma: "es",
      categoria: "ensayo",
      recomendado: false,
      resumen: {
        es: "La defensa de Sócrates ante el tribunal de Atenas, el año 399 a. C., acusado de corromper a los jóvenes y de no creer en los dioses de la ciudad. Platón, que estuvo presente, la reconstruye en tres discursos: la defensa, la propuesta de pena tras el veredicto de culpa y las palabras finales después de la condena a muerte. Sócrates prefiere morir antes que dejar de buscar la verdad y de servir a lo que entiende como un mandato divino. Traducción de Patricio de Azcárate (1871), con la ortografía de la época, su argumento y sus notas.",
        en: "Socrates' defence before the court of Athens in 399 BC, accused of corrupting the young and of not believing in the city's gods. Plato, who was present, reconstructs it in three speeches: the defence, the proposal of a penalty after the guilty verdict, and the final words after the death sentence. Socrates prefers to die rather than stop seeking the truth and serving what he understands as a divine command. Spanish translation by Patricio de Azcárate (1871), with the spelling of the time, his introduction and his notes."
      },
      porque: {"es":"Para quien alguna vez se preguntó si vale la pena vivir según la propia conciencia cuando todos presionan en contra. Es corta y se lee en una tarde, pero deja una pregunta que sigue trabajando después: qué examinas tú de tu propia vida. La ortografía de 1871 se vuelve familiar en pocas páginas.","en":"For anyone who has wondered whether it is worth living by one's own conscience when everyone pushes the other way. It is short and can be read in an afternoon, yet it leaves a question that keeps working afterwards: what do you examine in your own life? The older Spanish spelling of this translation stops being an obstacle within a few pages."},
      imagen: { src: "img/portadas/apologia-de-socrates.jpg", credito: { es: "Jacques-Louis David, «La muerte de Sócrates», 1787", en: "Jacques-Louis David, «The Death of Socrates», 1787" }, url: "https://commons.wikimedia.org/wiki/File:David_-_The_Death_of_Socrates.jpg" },
      citas: [
        "El mayor bien del hombre es hablar de la virtud todos los dias de su vida y conversar sobre todas las demás cosas que han sido objeto de mis discursos, ya sea examinándome a mí mismo, ya examinando a los demás, porque una vida sin examen no es vida.",
        "En efecto, ni Anito, ni Melito pueden causarme mal alguno, porque el mal no puede nada contra el hombre de bien.",
        "¡Ah! ¿No es una ignorancia vergonzante creer conocer una cosa que no se conoce?",
        "Lo que sé de cierto es que cometer injusticias y desobedecer al que es mejor y está por cima de nosotros, sea Dios, sea hombre, es lo más criminal y lo más vergonzoso.",
        "Pero ya es tiempo de marcharse, yo a morir, vosotros a vivir. Cuál de nosotros va hacia algo mejor, nadie lo sabe, excepto Dios."
      ],
      archivos: { epub: "libros/platon-apologia-de-socrates.epub", pdf: "libros/platon-apologia-de-socrates.pdf" },
      fuente: { texto: "Obras completas de Platón, tomo I (Madrid, 1871), transcritas en es.wikisource.org (dominio público); edición digital y portada de Proyecto Fénix", url: "https://es.wikisource.org/wiki/Apolog%C3%ADa_de_S%C3%B3crates_(de_Azc%C3%A1rate_tr.)" },
      editorial: { es: "Edición digital de Proyecto Fénix sobre la traducción de Patricio de Azcárate (1871), transcrita en Wikisource: conserva la ortografía de la época, el argumento y las notas del traductor, con portada nueva. La última oración se corrigió según el griego, porque Azcárate la había vuelto pregunta.", en: "Proyecto Fénix digital edition of Patricio de Azcárate's translation (1871), transcribed on Wikisource: it keeps the spelling of the time and the translator's introduction and notes, with a new cover. The last sentence was corrected to follow the Greek, because Azcárate had turned it into a question." },
      delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/apologia-de-socrates"},
      parecidos: ["confesiones", "ortodoxia", "imitacion-de-cristo"],
      versiones: {
        en: {
          titulo: "Apology",
          autor: "Plato (trans. Benjamin Jowett)",
          imagen: { src: "img/portadas/apologia-de-socrates-en.jpg", credito: { es: "Jacques-Louis David, «La muerte de Sócrates», 1787", en: "Jacques-Louis David, «The Death of Socrates», 1787" }, url: "https://commons.wikimedia.org/wiki/File:David_-_The_Death_of_Socrates.jpg" },
          anio: "c. 390 BC",
          resumen: {
            es: "La defensa de Sócrates ante el tribunal de Atenas, el año 399 a. C., acusado de corromper a los jóvenes y de no creer en los dioses de la ciudad. Platón, que estuvo presente, la reconstruye en tres discursos: la defensa, la propuesta de pena tras el veredicto de culpa y las palabras finales después de la condena a muerte. Traducción inglesa de Benjamin Jowett.",
            en: "Socrates' defence before the court of Athens in 399 BC, accused of corrupting the young and of not believing in the city's gods. Plato, who was present, reconstructs it in three speeches: the defence, the proposal of a penalty after the guilty verdict, and the final words after the death sentence. Socrates prefers to die rather than stop seeking the truth and serving what he understands as a divine command. English translation by Benjamin Jowett."
          },
          citas: [
            "The unexamined life is not worth living.",
            "He knows nothing, and thinks that he knows; I neither know nor think that I know.",
            "No evil can happen to a good man, either in life or after death.",
            "I to die, and you to live. Which is better God only knows."
          ],
          archivos: { epub: "libros/platon-apology.epub", pdf: "libros/platon-apology.pdf" },
          fuente: { texto: "Project Gutenberg, libro n.º 1656 (dominio público); portada de Proyecto Fénix", url: "https://www.gutenberg.org/ebooks/1656" },
          editorial: null,
          parecidos: ["ortodoxia", "confesiones", "quo-vadis"]
        }
      }
    },
    {
      id: "orencio-y-eloisa",
      titulo: "Orencio y Eloísa",
      autor: "Benjamín Franzani",
      anio: "2021",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      porque: {"es":"Es un relato corto, para leer de una sentada, pensado para quien quiere una historia de amor sin estridencias, donde el cariño se prueba en la lealtad y no en las palabras. Le sirve al lector joven y a quien viene cansado de novelas largas.","en":"A short tale to read in one sitting, for anyone who wants a love story without noise, where affection is proved by loyalty rather than by speeches. It suits young readers, and anyone tired of long novels who still wants something with heart."},
      imagen: { src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhL8ho_fkfQkc0zjyJuXk7zWCg46XZLFjCLw95nkYpoO31o26bDNtvgCzDale4V5aTEUOZOjuyu1Y309MsBILmiXWD29IW9finGqXUyDcBovYuop_mTNXk0LBL5GnWZ2ou9NwZKRY25In6Zk-RkB7KGKudLSFH3HynzonnSdBGLAWsobNgeN-vB53nmkhN2/s800/image1788018015", credito: { es: "portada oficial del relato", en: "official cover of the story" }, url: "https://www.benjaminfranzani.com/p/el-repertorio-del-juglar-historias.html", aviso: { es: "enlazada desde el sitio del autor", en: "linked from the author's website" } },
      resumen: {
        es: "Siar, ciudad portuaria de un imperio en ruinas, resiste hace cinco años el asedio de un ejército enemigo. En medio de la guerra, el joven jinete Orencio y la criada Eloísa se aman en silencio, sin que él se atreva a pedir su mano mientras la ciudad siga en peligro. Cuando Orencio cae enfermo y llegan dos emisarias de una ciudad aliada con noticias alarmantes, Eloísa se ve envuelta en una trama de espionaje, sospechas injustas y un asalto final. Relato breve de amor, lealtad y entrega, en seis partes, que acompaña a la novela «El Lobo de Plata» (saga «Crónicas de una Espada»).",
        en: "Siar, a besieged port city in a crumbling empire, has withstood five years of enemy siege. Amid the war, the young horseman Orencio and the servant girl Eloísa love each other quietly, he unwilling to ask for her hand while the city remains in danger. When Orencio falls ill and two envoys from an allied city arrive with grave news, Eloísa is drawn into a web of espionage, unjust suspicion and a final assault. A short tale of love, loyalty and self-giving in six parts, a companion to the novel «El Lobo de Plata» («Crónicas de una Espada» saga)."
      },
      citas: [
        "Porque las flores son inútiles para la aspereza de la guerra, por eso es que son ahora más necesarias que nunca.",
        "El derramamiento de sangre, el hambre, la pobreza y las enfermedades son lo suficientemente duros como para quebrarnos a todos. No podemos permitir que nuestro ánimo adquiera esa dureza también, o terminaremos odiándonos unos a otros.",
        "Si yo he de ser un héroe como dices, lo serás tú también, lo seré por ti."
      ],
      archivos: {},
      externos: [
        { formato: "web", texto: "benjaminfranzani.com", url: "https://www.benjaminfranzani.com/p/el-repertorio-del-juglar-historias.html" }
      ],
      fuente: { texto: "Publicado por el autor en su sitio, en «El repertorio del juglar» (obra protegida por derechos de autor; se enlaza, no se aloja)", url: "https://www.benjaminfranzani.com/p/el-repertorio-del-juglar-historias.html" },
      delibris: null,
      parecidos: ["edward-caballero-verde", "quo-vadis", "apologia-de-socrates"]
    },
    {
      id: "edward-caballero-verde",
      titulo: "Edward o el Caballero Verde",
      autor: "Benjamín Franzani",
      anio: "2021",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      porque: {"es":"Para quien extraña las historias de caballeros y quiere una que tome en serio el honor, la amistad y la misericordia, sin cinismo. El lector joven encuentra un modelo de nobleza que no es de cartón, y el adulto, el recordatorio de que perdonar exige más valor que vengarse.","en":"For readers who miss tales of knights and want one that takes honour, friendship and mercy seriously, without cynicism. A young reader finds a kind of nobility that is not made of cardboard, and an adult is reminded that forgiving takes more courage than taking revenge."},
      imagen: { src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh6uv20fuvZ_ECZdcn_kXNoMRc1siQxV0iVkcwaD-eZMSgrPsLCKbPe0ukf0zBKfJfQOdr0A4xkViYgstjkx6gZJWWXJn4LtZQJ8HLu6lsZajDnJpHCmBxyCD_TTY6JoHlVbqM_1jyD4ESSkPJPuh6hMUARkm7ufW2K4POxUMYFrTfPKilCeecpwvVX7lFi/s800/nueva%20Portada%20Edward.png", credito: { es: "portada oficial de la novela", en: "official cover of the novel" }, url: "https://www.benjaminfranzani.com/p/el-repertorio-del-juglar-historias.html", aviso: { es: "enlazada desde el sitio del autor", en: "linked from the author's website" } },
      resumen: {
        es: "Sir Edward de Uterra, armado caballero a los quince años tras velar sus armas en oración, se niega a llevar blasón hasta ganarse un nombre con sus hechos. Parte con su amigo Ulf, escudero y juglar, a las provincias del sur del Imperio de Dáladon, abandonadas a bandoleros y piratas, para servir al corregidor de Urbia contra el bandolero Alcico. Allí conoce a Clara, una joven criada entre piratas que vive para vengarse del regente que vendió a su familia. Novela de caballería y fantasía en 27 capítulos, sobre el honor, la amistad, la protección del débil y la misericordia frente a la venganza; la historia queda abierta para una continuación.",
        en: "Sir Edward of Uterra, knighted at fifteen after keeping vigil over his arms in prayer, refuses to bear a coat of arms until he has earned a name by his deeds. With his friend Ulf, squire and minstrel, he rides to the southern provinces of the Empire of Dáladon, abandoned to brigands and pirates, to serve the magistrate of Urbia against the outlaw Alcico. There he meets Clara, a young woman raised among pirates who lives to avenge herself on the regent who sold her family. A chivalric fantasy novel in 27 chapters about honour, friendship, protecting the weak and mercy over revenge; the story is left open for a sequel."
      },
      citas: [
        "Mis pasos seguirán tus pasos. Iré donde vayas y volveré donde vuelvas.",
        "Como caballero, abrazaría un alto ideal. Sería brazo de la justicia, servidor del emperador y de los reyes. Y del Creador: ejemplo para el pueblo, protector del débil…",
        "Partiré a la aventura, como mi antepasado sir Alfred, y me ganaré un nombre y un honor sirviendo al imperio con mi lanza y mi espada. Cuando me haya hecho un nombre con el que honrar mi sangre, y honraros también a vos, que me armasteis caballero, entonces tendré un blasón que mostrar orgulloso. No antes.",
        "No manches ahora tus manos con sangre… aún estás a tiempo."
      ],
      archivos: {},
      externos: [
        { formato: "web", texto: "benjaminfranzani.com", url: "https://www.benjaminfranzani.com/p/el-repertorio-del-juglar-historias.html" }
      ],
      fuente: { texto: "Publicado por el autor en su sitio, en «El repertorio del juglar»; spin-off de la saga «Crónicas de una Espada» (obra protegida por derechos de autor; se enlaza, no se aloja)", url: "https://www.benjaminfranzani.com/p/el-repertorio-del-juglar-historias.html" },
      delibris: null,
      parecidos: ["orencio-y-eloisa", "quo-vadis"]
    },
    {
      id: "euripides-hipolito",
      titulo: "Hipólito",
      autor: "Eurípides (trad. Eduardo de Mier y Barbery)",
      anio: "428 a. C.",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Tragedia de Eurípides que lleva a escena a Hipólito, un joven cazador que consagra su devoción a Artemisa y rehúye el amor. La diosa Afrodita, ofendida por ese desdén, hace nacer en su madrastra Fedra una pasión que ella trata de ocultar. Un secreto confiado a la nodriza pone en marcha una cadena de acusaciones y de ruegos a los dioses que recae sobre toda la casa de Teseo. La obra reflexiona sobre el pudor, los celos de los dioses y los límites de la voluntad humana frente al destino. Se ofrece en la versión directa del griego de Eduardo de Mier."},
      porque: {"es":"Sirve a quien quiere entender cómo una pasión que se calla termina destruyendo a los inocentes. Se lee en una sentada y deja ver, con una claridad que pocas obras igualan, el daño de la soberbia, del secreto y de la palabra dicha a destiempo.","en":"A good read for anyone who wants to see how a passion kept hidden ends up wrecking the innocent. It fits in a single sitting and shows, with rare clarity, what pride, secrecy and a word spoken at the wrong moment can do to people who deserved better."},
      imagen: {"src": "img/portadas/euripides-hipolito.jpg", "credito": {"es": "Pierre-Narcisse Guérin, «Fedra e Hipólito», 1802", "en": "Pierre-Narcisse Guérin, «Phaedra and Hippolytus», 1802"}, "url": "https://commons.wikimedia.org/wiki/File:Ph%C3%A8dre_et_Hippolyte,_par_Pierre-Narcisse_Gu%C3%A9rin.jpg"},
      citas: [
        "La lengua juró; el alma no ha jurado.",
        "Preciso es, por tanto, confesar que, aun conociendo lo bueno, no lo seguimos, unos por pereza y otros porque posponemos la virtud al deleite.",
        "Cuando el Amor domina a los hombres, ni es buena su fama, ni tampoco merecen alabanza; al contrario, cuando Afrodita se acerca a nosotros con modestia, no hay diosa tan grata.",
        "Solo entre los mortales disfruto de este privilegio; a tu lado estoy siempre, contigo hablo, y escuchas mi voz, aunque no vea tu rostro. Como he empezado, así acabaré mi vida."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg, tomo I (incluye Hipólito)", "url": "https://www.gutenberg.org/ebooks/73500.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg, tomo I (incluye Hipólito)", "url": "https://www.gutenberg.org/ebooks/73500"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 73500: Obras dramáticas de Eurípides, tomo I, versión directa del griego de Eduardo de Mier y Barbery (Madrid, 1909) (dominio público)", "url": "https://www.gutenberg.org/ebooks/73500"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/hipolito"},
      parecidos: ["euripides-andromaca", "euripides-ion", "cervantes-el-trato-de-argel"]
    },
    {
      id: "euripides-andromaca",
      titulo: "Andrómaca",
      autor: "Eurípides (trad. Eduardo de Mier y Barbery)",
      anio: "c. 425 a. C.",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Tragedia de Eurípides ambientada en Ftía, años después de la caída de Troya. Andrómaca, viuda de Héctor, vive como esclava y concubina de Neoptólemo, y por haberle dado un hijo es blanco de los celos de Hermíone, la esposa legítima. Con su hijo en peligro, busca amparo en el santuario de Tetis mientras Hermíone y su padre, Menelao, preparan su ruina. La pieza muestra la fragilidad de los vencidos, el poder de los celos y la fuerza de los lazos familiares. Se ofrece en la versión directa del griego de Eduardo de Mier."},
      porque: {"es":"Le conviene al lector que quiere ver cómo se vive la dignidad cuando todo se ha perdido. Andrómaca enseña a resistir sin odio ni bajeza, y el contraste con los celos y la crueldad de los poderosos deja una lección que sigue vigente en cualquier casa o corte.","en":"Worth reading if you want to see how dignity is lived when everything has been lost. Andromache shows how to endure without hatred or meanness, and the contrast with the jealousy and cruelty of the powerful leaves a lesson that holds in any household or court."},
      imagen: {"src": "img/portadas/euripides-andromaca.jpg", "credito": {"es": "Pierre-Narcisse Guérin, «Andrómaca y Pirro», 1810", "en": "Pierre-Narcisse Guérin, «Andromache and Pyrrhus», 1810"}, "url": "https://commons.wikimedia.org/wiki/File:Gu%C3%A9rin_Andromaque_et_Pyrrhus_1810.jpg"},
      citas: [
        "Ningún mortal puede llamarse feliz hasta su día postrimero y su descenso en los infiernos.",
        "Para todos los hombres, los hijos son tan amados como el vivir.",
        "Los verdaderamente amigos no tienen nada propio: son comunes sus bienes.",
        "¡Oh fama, fama!, a miles de mortales que nada eran concediste gloriosa vida. Felices juzgo a los que disfrutan de renombre merecido."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg, tomo III (incluye Andrómaca)", "url": "https://www.gutenberg.org/ebooks/75775.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg, tomo III (incluye Andrómaca)", "url": "https://www.gutenberg.org/ebooks/75775"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 75775: Obras dramáticas de Eurípides, tomo III, versión directa del griego de Eduardo de Mier y Barbery (Madrid, 1910) (dominio público)", "url": "https://www.gutenberg.org/ebooks/75775"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/andromaca"},
      parecidos: ["euripides-hipolito", "euripides-ion", "cervantes-el-trato-de-argel"]
    },
    {
      id: "euripides-ion",
      titulo: "Ion",
      autor: "Eurípides (trad. Eduardo de Mier y Barbery)",
      anio: "c. 414 a. C.",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Tragedia de Eurípides sobre un joven criado en el templo de Apolo, en Delfos, sin saber quién es su padre. Creúsa, reina de Atenas, y su esposo Juto llegan a consultar al oráculo porque no tienen hijos. De ese encuentro nacen un malentendido, una trama de sospechas y un reconocimiento que cambia el destino de los tres. La obra trata del origen, la herencia y la relación entre los hombres y los dioses. Se ofrece en la versión directa del griego de Eduardo de Mier."},
      porque: {"es":"Una tragedia que termina bien y que, justamente por eso, sorprende. Sirve a quien se pregunta de dónde viene y a quién pertenece, y a quien duda de la bondad de los dioses: la obra pone esas preguntas en boca de personajes muy humanos, sin respuestas fáciles.","en":"A tragedy that ends well and surprises precisely for that reason. It suits readers who wonder where they come from and to whom they belong, or who doubt the goodness of the gods: the play puts those questions in very human mouths and offers no easy answers."},
      imagen: {"src": "img/portadas/euripides-ion.jpg", "credito": {"es": "John Collier, «Sacerdotisa de Delfos», 1891", "en": "John Collier, «Priestess of Delphi», 1891"}, "url": "https://commons.wikimedia.org/wiki/File:Priestess_of_Delphi_by_John_Collier_(1891).jpg"},
      citas: [
        "Febo es el padre que me engendró; yo lo alabaré por haberme criado, y este templo, en donde habita y me dispensa sus dones, hará para mí las veces de padre.",
        "Solo el nombre de esclavo es deshonroso, que en todo lo demás, ningún siervo, siendo bueno, vale menos que los hombres libres.",
        "Prefiero un amigo sencillo y bueno a otro más sagaz si es malo.",
        "Más quisiera vivir contento como simple ciudadano, que ser el primero y gozar en compañía de malos amigos, mientras odio a los buenos temiendo que me asesinen.",
        "Nunca desconfíe el desdichado si honra a los dioses. Al fin, los buenos obtienen justa recompensa, que los malos nunca serán felices."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg, tomo III (incluye Ion)", "url": "https://www.gutenberg.org/ebooks/75775.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg, tomo III (incluye Ion)", "url": "https://www.gutenberg.org/ebooks/75775"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 75775: Obras dramáticas de Eurípides, tomo III, versión directa del griego de Eduardo de Mier y Barbery (Madrid, 1910) (dominio público)", "url": "https://www.gutenberg.org/ebooks/75775"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/ion-0"},
      parecidos: ["euripides-andromaca", "euripides-hipolito", "cervantes-el-trato-de-argel"]
    },
    {
      id: "jenofonte-apologia-de-socrates",
      titulo: "Apología de Sócrates",
      autor: "Jenofonte (trad. Antonio González Garbín)",
      anio: "siglo IV a. C.",
      idioma: "es",
      categoria: "ensayo",
      recomendado: false,
      resumen: {"es": "Breve escrito en el que Jenofonte explica por qué Sócrates, ante el tribunal que lo juzgó en Atenas, habló con serena altivez y no buscó la clemencia de los jueces. El autor reúne lo que le contaron quienes estuvieron presentes para defender la memoria de su maestro. Sócrates aparece tranquilo ante la posibilidad de morir, convencido de que su vida estuvo bien empleada. La edición incluye la introducción y las notas del traductor, Antonio González Garbín."},
      porque: {"es":"Es el mismo juicio que cuenta Platón, visto por otro discípulo: más práctico y anecdótico, con un Sócrates convencido de que obrar con honestidad vale más que salvar la vida. Es breve y sirve a quien quiere comparar testimonios o ver cómo se enfrenta una condena injusta con serenidad. Va bien después de la versión de Platón.","en":"It is the same trial Plato describes, seen by another disciple: more practical and anecdotal, with a Socrates convinced that acting honestly matters more than saving his own life. It is short, and it suits anyone who wants to compare witnesses or see how a man faces an unjust sentence with calm. It reads well after Plato's version."},
      imagen: {"src": "img/portadas/jenofonte-apologia-de-socrates.jpg", "credito": {"es": "Jacques-Louis David, «La muerte de Sócrates», 1787", "en": "Jacques-Louis David, «The Death of Socrates», 1787"}, "url": "https://commons.wikimedia.org/wiki/File:David_-_The_Death_of_Socrates.jpg"},
      citas: [
        "¿Por ventura querríais mejor verme morir con justicia que con inocencia?",
        "Mi conciencia me dice, y es mi más dulce satisfacción, que he vivido de una manera justa y religiosa.",
        "Yo no me creo por eso menos digno de estimación, pues muero inocente. No es el oprobio para mí, sino para los que me condenan.",
        "Preferiré morir antes que mendigar servilmente que se me otorgue la prolongación de una vida cien veces peor que la muerte.",
        "Estoy seguro que el tiempo pasado y los siglos venideros atestiguarán que no he hecho mal a nadie, que a nadie he pervertido, sino que he sido benéfico con mis discípulos, enseñándoles de buen grado lo bueno que he podido."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/La_Apolog%C3%ADa_de_S%C3%B3crates"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=La_Apolog%C3%ADa_de_S%C3%B3crates"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=La_Apolog%C3%ADa_de_S%C3%B3crates"}],
      fuente: {"texto": "Edición de Madrid, 1889 (Imprenta de Iniesta, Biblioteca Andaluza), traducción de Antonio González Garbín, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/La_Apolog%C3%ADa_de_S%C3%B3crates"},
      delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/apologia-de-socrates-0"},
      parecidos: ["acosta-historia-natural-y-moral-de-las-indias", "lope-de-vega-arte-nuevo-de-hacer-comedias", "swift-una-modesta-proposicion"]
    },
    {
      id: "dante-la-divina-comedia",
      titulo: "La Divina Comedia",
      autor: "Dante Alighieri (trad. Manuel Aranda y Sanjuán)",
      anio: "c. 1320",
      idioma: "es",
      categoria: "poesia",
      recomendado: false,
      resumen: {"es": "Poema de Dante en tres partes (Infierno, Purgatorio y Paraíso) que relata un viaje por el más allá. El poeta se encuentra perdido en una selva oscura y recorre, con Virgilio y luego con Beatriz como guías, los reinos del castigo, de la purificación y de la gloria. En el camino conversa con personajes de la historia antigua y de la Florencia de su tiempo. Reúne teología, política, amor y poesía en una de las grandes obras de la literatura europea. Esta edición ofrece la traducción en prosa de Manuel Aranda y Sanjuán, con una introducción de Francesco De Sanctis."},
      porque: {"es":"Para quien siente que va a mitad de camino y no sabe bien hacia dónde. Dante convierte esa perplejidad en un viaje con guías, y la prosa de esta traducción permite seguir la historia sin la dificultad del verso. Conviene leerlo de a pocos cantos, con calma, y volver a él en distintas etapas de la vida.","en":"For anyone who feels halfway through life and unsure where the road leads. Dante turns that bewilderment into a journey with guides, and the prose of this translation lets you follow the story without the difficulty of verse. It is best read a few cantos at a time, unhurriedly, and taken up again at different stages of life."},
      imagen: {"src": "img/portadas/dante-la-divina-comedia.jpg", "credito": {"es": "Domenico di Michelino, «Dante y la Divina Comedia», 1465", "en": "Domenico di Michelino, «Dante and the Divine Comedy», 1465"}, "url": "https://commons.wikimedia.org/wiki/File:Domenico_di_Michelino_Dante_Duomo_Florence_duomofirenze.it.jpg"},
      citas: [
        "A la mitad del viaje de nuestra vida me encontré en una selva obscura, por haberme apartado del camino recto.",
        "¡Oh vosotros los que entráis, abandonad toda esperanza!",
        "No hay mayor dolor que acordarse del tiempo feliz en la miseria",
        "Pensad en vuestro origen; vosotros no habéis nacido para vivir como brutos, sino para alcanzar la virtud y la ciencia.",
        "Pero ya eran movidos mi deseo y mi voluntad, como rueda cuyas partes giran todas igualmente, por el Amor que mueve el Sol y las demás estrellas."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/57303.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/57303"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 57303: edición de la Universidad Nacional de México, 1921 (dominio público)", "url": "https://www.gutenberg.org/ebooks/57303"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-divina-comedia"},
      parecidos: ["juan-de-mena-laberinto-de-fortuna", "ariosto-orlando-furioso", "ercilla-la-araucana"]
    },
    {
      id: "juan-de-mena-laberinto-de-fortuna",
      titulo: "Laberinto de Fortuna",
      autor: "Juan de Mena",
      anio: "1444",
      idioma: "es",
      categoria: "poesia",
      recomendado: false,
      resumen: {"es": "Poema alegórico de Juan de Mena, escrito en el siglo XV y dedicado al rey Juan II de Castilla. En trescientas coplas, el poeta es llevado ante la rueda de la Fortuna y contempla el destino de personajes de la historia y de la Castilla de su tiempo. El recorrido ofrece una reflexión sobre el poder, la suerte y las virtudes y vicios de los hombres. Es una de las obras mayores de la poesía castellana del siglo XV."},
      porque: {"es":"Para quien quiere conocer la poesía castellana anterior al Siglo de Oro y no le asusta un desafío. Es un recorrido por la casa de la Fortuna, con los círculos de los planetas y figuras del pasado y del presente que sirven de ejemplo o de advertencia, escrito para aconsejar a un rey y a sus caballeros. Pide paciencia con una lengua llena de latinismos; ayuda una edición con notas y leerlo copla por copla, atento a cómo la suerte reparte sus golpes entre grandes y pequeños.","en":"For readers who want to know Castilian poetry before the Golden Age and do not mind a challenge. It is a tour through the house of Fortune, with the circles of the planets and figures from past and present who serve as examples or warnings, written to advise a king and his knights. It asks for patience with a language full of Latinisms; an annotated edition helps, and so does reading it stanza by stanza, watching how luck hands out its blows to great and small alike."},
      imagen: {"src": "img/portadas/juan-de-mena-laberinto-de-fortuna.jpg", "credito": {"es": "Edward Burne-Jones, «La rueda de la Fortuna»", "en": "Edward Burne-Jones, «The Wheel of Fortune»"}, "url": "https://commons.wikimedia.org/wiki/File:Edward_Burne-Jones_-_The_Wheel_of_Fortune.jpg"},
      citas: [
        "Tus casos falaçes, Fortuna, cantamos, / estados de gentes que giras e trocas, / tus grandes discordias, tus firmezas pocas, / y los que en tu rueda quexosos fallamos",
        "¡O vida segura la mansa pobreza, / dádiva santa desagradesçida! / Rica se llama, non pobre, la vida / del que se contenta bevir sin riqueza;",
        "e como los rayos las torres mayores / fieren enante que no en las baxuras, / así dan los fados sus desaventuras / más a los grandes que a los menores."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Laberinto_de_fortuna"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Laberinto_de_fortuna"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Laberinto_de_fortuna"}],
      fuente: {"texto": "Texto transcrito en es.wikisource.org, marcado como dominio público (la página no identifica la edición, sin notas ni estudio modernos)", "url": "https://es.wikisource.org/wiki/Laberinto_de_fortuna"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/laberinto-de-fortuna-0"},
      parecidos: ["ariosto-orlando-furioso", "dante-la-divina-comedia", "ercilla-la-araucana"]
    },
    {
      id: "ariosto-orlando-furioso",
      titulo: "Orlando furioso",
      autor: "Ludovico Ariosto (trad. Manuel Aranda y Sanjuán)",
      anio: "1516",
      idioma: "es",
      categoria: "poesia",
      recomendado: false,
      resumen: {"es": "Poema caballeresco de Ariosto que continúa la historia de Orlando enamorado, en tiempos de las guerras de Carlomagno contra los moros. Mezcla duelos, magia, viajes fantásticos y amores, entre ellos el de Orlando por la bella Angélica, que acaba por hacerle perder la razón. Con humor y fantasía, el poeta enlaza decenas de episodios en un mismo gran tapiz. La traducción de Manuel Aranda y Sanjuán, en prosa y anotada, se publicó en Barcelona en dos tomos."},
      porque: {"es":"Para quien busca una lectura de pura aventura y buen humor, sin pretensión de lección. Sirve de entrada a la épica caballeresca, porque la prosa de esta traducción corre sin trabas y se puede leer por episodios sueltos. Deja ver, de paso, cómo la pasión puede nublar hasta al más sensato.","en":"For readers who want pure adventure and good humour, with no lesson attached. It is a friendly way into chivalric epic, since the prose of this translation flows easily and can be read in separate episodes. It also shows, almost in passing, how passion can cloud the judgement of even the most sensible man."},
      imagen: {"src": "img/portadas/ariosto-orlando-furioso.jpg", "credito": {"es": "Gustave Doré, ilustración para «Orlando furioso», 1879", "en": "Gustave Doré, illustration for “Orlando Furioso”, 1879"}, "url": "https://commons.wikimedia.org/wiki/File:Orlando_Furioso_hippogriff_battle.png"},
      citas: [
        "Canto la galantería, las damas, los caballeros, las armas, los amores y las arriesgadas empresas del tiempo en que los moros atravesaron el mar de África",
        "¡Oh extraordinaria bondad de los caballeros antiguos! Ambos eran rivales, de diferentes creencias",
        "A unos se la había hecho perder el amor; a otros el deseo de honores; a otros el afán de atesorar riquezas, que les obligaba a cruzar la vasta extensión de los mares"
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg, tomo I", "url": "https://www.gutenberg.org/ebooks/46201.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg, tomo I", "url": "https://www.gutenberg.org/ebooks/46201"}, {"formato": "epub", "texto": "Project Gutenberg, tomo II", "url": "https://www.gutenberg.org/ebooks/49063.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg, tomo II", "url": "https://www.gutenberg.org/ebooks/49063"}],
      fuente: {"texto": "Project Gutenberg, libros n.º 46201 y 49063: Barcelona, Empresa Editorial La Ilustración, colección «Los grandes poemas» (el tomo II lleva fecha de 1872) (dominio público)", "url": "https://www.gutenberg.org/ebooks/46201"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/orlando-furioso"},
      parecidos: ["juan-de-mena-laberinto-de-fortuna", "ercilla-la-araucana", "cervantes-viaje-al-parnaso"]
    },
    {
      id: "teresa-de-jesus-libro-de-la-vida",
      titulo: "Libro de la Vida",
      autor: "Santa Teresa de Jesús",
      anio: "1565",
      idioma: "es",
      categoria: "lectura",
      recomendado: false,
      resumen: {"es": "Relato autobiográfico que Teresa de Jesús escribió por encargo de sus confesores. Cuenta su infancia, su entrada en el Carmelo, sus años de enfermedad y los altibajos de su vida de oración, y describe con sencillez los grados de la oración mental. También recuerda el nacimiento de su primer convento reformado y el trato con quienes la acompañaron. Está escrito en un castellano llano y directo, lleno de comparaciones tomadas de la vida diaria. Se ofrece en la edición de Espasa-Calpe de 1927."},
      porque: {"es":"Para quien reza poco porque no sabe qué decirle a Dios: Teresa enseña a tratarlo como a un amigo, sin fórmulas. Cuenta sus propias caídas y sus años de aridez sin disimular, lo que consuela a quien se cree el único que tropieza. Se lee de a un capítulo y deja ganas de volver a la oración.","en":"For anyone who prays little because they do not know what to say to God: Teresa teaches how to treat Him as a friend, without formulas. She tells of her own failings and her years of dryness without hiding them, which consoles anyone who thinks they are the only one who stumbles. It reads a chapter at a time and leaves a wish to return to prayer."},
      imagen: {"src": "img/portadas/teresa-de-jesus-libro-de-la-vida.jpg", "credito": {"es": "François Gérard, «Santa Teresa», 1827", "en": "François Gérard, “Saint Teresa”, 1827"}, "url": "https://commons.wikimedia.org/wiki/File:Teresa_of_Ávila.jpg"},
      citas: [
        "No es otra cosa oración mental, a mi parecer, sino tratar de amistad, estando muchas veces tratando a solas con quien sabemos nos ama.",
        "No está el amor de Dios en tener lágrimas, ni estos gustos y ternura, que por la mayor parte los deseamos y consolámonos con ellos, sino en servir con justicia y fortaleza de ánimo y humildad.",
        "Padecer quiero, Señor, pues vos padecistes; cúmplase en mí de todas maneras vuestra voluntad.",
        "Fiad en su bondad, que nunca faltó a sus amigos."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Su_vida_(Santa_Teresa_de_Jes%C3%BAs)"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Su_vida_%28Santa_Teresa_de_Jes%C3%BAs%29"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Su_vida_%28Santa_Teresa_de_Jes%C3%BAs%29"}],
      fuente: {"texto": "Edición de Madrid, 1927 (Espasa-Calpe, Colección Universal), transcrita en es.wikisource.org con ortografía de la época (transcripción pendiente de revisar) (dominio público)", "url": "https://es.wikisource.org/wiki/Su_vida_(Santa_Teresa_de_Jes%C3%BAs)"},
      delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/libro-de-la-vida"},
      parecidos: ["fray-luis-de-leon-de-los-nombres-de-cristo"]
    },
    {
      id: "cervantes-el-trato-de-argel",
      titulo: "El trato de Argel",
      autor: "Miguel de Cervantes",
      anio: "1580",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia de Cervantes en cuatro jornadas, inspirada en los años en que estuvo cautivo en Argel. Muestra la vida de los cristianos esclavos, con sus penas, su fe y sus amores, junto a personajes alegóricos como la Ocasión y la Necesidad. Entre los personajes figura un soldado llamado Saavedra, que recuerda al propio autor. Es una de las primeras obras teatrales de Cervantes. Se ofrece en la edición de Calpe de 1922, con notas."},
      porque: {"es":"Es la ocasión de leer a Cervantes antes de la fama, hablando de lo que vivió en carne propia. Ayuda a quien conoce solo el Quijote a ver de dónde sale su mirada compasiva, y recuerda lo que significaron la fe y la esperanza para un hombre encerrado.","en":"A chance to read Cervantes before his fame, writing about what he lived through himself. It helps anyone who knows only his famous novel see where his compassionate eye comes from, and it recalls what faith and hope meant to a man held in captivity."},
      imagen: {"src": "img/portadas/cervantes-el-trato-de-argel.jpg", "credito": {"es": "Georg Braun y Franz Hogenberg, «Vista de Argel», c. 1575", "en": "Georg Braun and Franz Hogenberg, “View of Algiers”, c. 1575"}, "url": "https://commons.wikimedia.org/wiki/File:Braun_Hogenberg_Algiers.tif"},
      citas: [
        "¡Oh purgatorio en la vida, infierno puesto en el mundo, mal que no tiene segundo, estrecho do no hay salida!",
        "Yo moriré, por lo que al alma toca, antes que hacer lo que mi ama quiere; firme he de estar cual bien fundada roca que en torno el viento, el mar combate y hiere. Que sea mi vida mucha, o que sea poca, importa poco; sólo el que bien muere puede decir que tiene larga vida, y el que mal, una muerte sin medida.",
        "A la triste fortuna alegre cara debe mostrar el pecho generoso: que a cualquier mal buen ánimo repara."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El_trato_de_Argel_(1922)"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El_trato_de_Argel_%281922%29"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El_trato_de_Argel_%281922%29"}],
      fuente: {"texto": "Edición de Madrid, 1922 (Calpe, Colección Universal, «Comedias»), transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/El_trato_de_Argel_(1922)"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-trato-de-argel"},
      parecidos: ["cervantes-don-quijote", "cervantes-novelas-ejemplares", "cervantes-viaje-al-parnaso"]
    },
    {
      id: "fray-luis-de-leon-de-los-nombres-de-cristo",
      titulo: "De los nombres de Cristo",
      autor: "Fray Luis de León",
      anio: "1583",
      idioma: "es",
      categoria: "lectura",
      recomendado: false,
      resumen: {"es": "Obra en prosa, dividida en tres libros, que comenta los nombres con que la Sagrada Escritura designa a Cristo: Pimpollo, Faces de Dios, Camino, Pastor, Monte, Rey de Dios, Esposo, Hijo de Dios, Cordero, Jesús, entre otros. Está escrita como una conversación entre tres amigos que pasan unos días en una huerta junto al Tormes. Fray Luis de León une textos bíblicos, tradición y reflexión propia en un castellano muy cuidado. Es una de las grandes obras de la prosa del siglo XVI y de la lectura espiritual en español."},
      porque: {"es":"Para quien disfruta de la buena prosa y quiere conocer mejor a Cristo desde la Escritura. En la tradición bíblica el nombre dice quién es la persona, y cada nombre de Cristo (Pastor, Camino, Príncipe de paz, Cordero) abre una meditación. Tres amigos conversan en una huerta junto al Tormes, con mucha Biblia y algo de humor. Pide atención: te rinde más leyendo un nombre por vez.","en":"For anyone who enjoys fine prose and wants to know Christ better through Scripture. In the biblical tradition a name says who the person is, and each name of Christ (Shepherd, Way, Prince of Peace, Lamb) opens a meditation. Three friends talk in an orchard by the Tormes, with plenty of Scripture and some humor. It asks for attention: you get more from it reading one name at a time."},
      imagen: {"src": "img/portadas/fray-luis-de-leon-de-los-nombres-de-cristo.jpg", "credito": {"es": "El Greco, «El Salvador», c. 1610-1614", "en": "El Greco, “Christ as Saviour”, c. 1610-1614"}, "url": "https://commons.wikimedia.org/wiki/File:El_Greco_-_Christ_as_Saviour_-_Google_Art_Project.jpg"},
      citas: [
        "Aquel amor es verdaderamente grande y de subidos quilates, que vence grandes dificultades. Aquél ama de veras que rompe por todo, que ningún estorbo le puede hacer que no ame.",
        "Cristo es el camino del cielo, porque, si no es poniendo las pisadas en él y siguiendo su huella, ninguno va al cielo.",
        "Entre las propiedades del buen Pastor, pone Cristo en el Evangelio que llama por su nombre a cada una de sus ovejas; que es decir que conoce lo particular de cada una de ellas, y la rige y llama al bien en la forma particular que más le conviene, no a todas por una forma, sino a cada cual por la suya.",
        "Porque si la paz es carecer de mal que aflige y de deseo que atormenta, y gozar de reposado sosiego, solo Él hace exentas las almas del temer, y las enriquece por tal manera, que no les queda cosa que poder desear."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/De_los_nombres_de_Cristo"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=De_los_nombres_de_Cristo"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=De_los_nombres_de_Cristo"}],
      fuente: {"texto": "Texto en tres tomos transcrito en es.wikisource.org con ortografía modernizada; la página no identifica la edición (dominio público)", "url": "https://es.wikisource.org/wiki/De_los_nombres_de_Cristo"},
      delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/de-los-nombres-de-cristo"},
      parecidos: ["teresa-de-jesus-libro-de-la-vida"]
    },
    {
      id: "lope-de-vega-las-ferias-de-madrid",
      titulo: "Las ferias de Madrid",
      autor: "Lope de Vega",
      anio: "1587",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia de enredos de Lope de Vega ambientada en el bullicio de las ferias de Madrid, con sus buhoneros, caballeros y damas en torno a las tiendas de la calle. Entre compras, galanteos y rondas de noche se cruzan los pretendientes de Violante y las intrigas de su amiga Eufrasia, mientras un ladrón y un alguacil añaden movimiento a la escena. La obra retrata con humor y colorido la vida urbana de la corte, con su habla popular y sus tipos callejeros."},
      porque: {"es":"Una comedia ligera para quien quiere conocer el Madrid vivo del Siglo de Oro, con su ruido, sus tiendas y sus galanteos. No pide nada al lector, solo ganas de reírse un rato del amor y del ingenio con que se enredan los personajes.","en":"A light comedy for anyone who wants to meet the lively Madrid of the Golden Age, with its noise, its shops and its courtships. It asks nothing of the reader except a willingness to smile for a while at love and at the wit of its tangled characters."},
      imagen: {"src": "img/portadas/lope-de-vega-las-ferias-de-madrid.jpg", "credito": {"es": "Juan de la Corte, «La Plaza Mayor de Madrid», siglo XVII", "en": "Juan de la Corte, “The Plaza Mayor of Madrid”, 17th century"}, "url": "https://commons.wikimedia.org/wiki/File:Corte-plaza_mayor.jpg"},
      citas: [
        "¡Callad, hombre sin razón; / que no hay puerta al corazón. / Todo está de guardas lleno! / Dadme que la mujer quiera, / que el guardarla es imposible.",
        "Tanto me quema el amor / como me hiela el temor.",
        "Sabed que es la fragua el dar / donde se apura el amor."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Las_ferias_de_Madrid"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Las_ferias_de_Madrid"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Las_ferias_de_Madrid"}],
      fuente: {"texto": "Texto transcrito en es.wikisource.org con ortografía modernizada; la página no identifica la edición (dominio público)", "url": "https://es.wikisource.org/wiki/Las_ferias_de_Madrid"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/las-ferias-de-madrid"},
      parecidos: ["lope-de-vega-amor-pleito-y-desafio", "lope-de-vega-arte-nuevo-de-hacer-comedias", "lope-de-vega-ay-verdades-que-en-amor"]
    },
    {
      id: "acosta-historia-natural-y-moral-de-las-indias",
      titulo: "Historia natural y moral de las Indias",
      autor: "José de Acosta",
      anio: "1590",
      idioma: "es",
      categoria: "ensayo",
      recomendado: false,
      resumen: {"es": "Obra del jesuita José de Acosta, que vivió años en el Perú, sobre la naturaleza y los pueblos del Nuevo Mundo. Los primeros libros tratan del cielo, el clima, los metales, las plantas y los animales de las Indias, y los demás de la historia, los ritos, el gobierno y las guerras de los indios. Acosta busca explicar las causas de lo que allá parece extraño, y por eso mezcla observación, filosofía natural y relato histórico. Se ofrece en dos tomos, en la reimpresión fiel de la primera edición castellana (Sevilla, 1590)."},
      porque: {"es":"Para quien se interesa por cómo se miró América por primera vez y por cómo un hombre de su tiempo intentaba explicar lo desconocido con razones. Sirve al lector de historia, a quien conoce o quiere conocer el Perú, y a quien disfruta de la curiosidad bien conducida. Se puede leer por libros sueltos, según el tema.","en":"For readers interested in how the Americas were first looked at, and in how a man of his time tried to explain the unknown with reasons. It suits lovers of history, anyone who knows or wants to know Peru, and those who enjoy well-guided curiosity. It can be read book by book, following whichever subject draws you."},
      imagen: {"src": "img/portadas/acosta-historia-natural-y-moral-de-las-indias.jpg", "credito": {"es": "Diego Gutiérrez, «Americae sive quartae orbis partis nova et exactissima descriptio», 1562", "en": "Diego Gutiérrez, «Americae sive quartae orbis partis nova et exactissima descriptio», 1562"}, "url": "https://commons.wikimedia.org/wiki/File:1562_Americ%C3%A6_Guti%C3%A9rrez.JPG"},
      citas: [
        "Así que aunque el mundo nuevo ya no es nuevo, sino viejo, según hay mucho dicho, y escrito de él, todavía me parece que en alguna manera se podrá tener esta Historia por nueva",
        "No se ha de ofender nadie, ni tener en menos los Santos Doctores de la Iglesia, si en algún punto de Filosofía y ciencias naturales sienten diferentemente de lo que está más recibido y aprobado por buena Filosofía; pues todo su estudio fue conocer, y servir y predicar al Criador, y en esto tuvieron grande excelencia.",
        "Harto más ciertamente son de reprehender los sabios de este siglo, y Filósofos vanos, que conociendo y alcanzando el ser y orden de estas criaturas, el curso y movimiento de los Cielos, no llegaron los desventurados a conocer al Criador y Hacedor de todo esto"
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg, tomo I", "url": "https://www.gutenberg.org/ebooks/70219.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg, tomo I", "url": "https://www.gutenberg.org/ebooks/70219"}, {"formato": "epub", "texto": "Project Gutenberg, tomo II", "url": "https://www.gutenberg.org/ebooks/50430.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg, tomo II", "url": "https://www.gutenberg.org/ebooks/50430"}],
      fuente: {"texto": "Project Gutenberg, libros n.º 70219 y 50430: reimpresión fiel de la edición de Sevilla, 1590 (Madrid: Ramón Anglés, 1894) (dominio público)", "url": "https://www.gutenberg.org/ebooks/70219"},
      delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/historia-natural-y-moral-de-las-indias"},
      parecidos: ["lope-de-vega-arte-nuevo-de-hacer-comedias", "swift-una-modesta-proposicion", "moratin-la-derrota-de-los-pedantes"]
    },
    {
      id: "ercilla-la-araucana",
      titulo: "La Araucana",
      autor: "Alonso de Ercilla",
      anio: "1590",
      idioma: "es",
      categoria: "poesia",
      recomendado: false,
      resumen: {"es": "Poema épico de Alonso de Ercilla que narra la guerra de los españoles contra los araucanos en Chile, en la que el propio autor participó como soldado. En treinta y siete cantos reunidos en tres partes describe el país de Arauco, sus costumbres y las campañas de ambos bandos, con una notable admiración por el valor de los araucanos. Es la primera gran obra épica sobre América y un texto fundacional de la literatura chilena. Incluye el privilegio real y el prólogo de la edición antigua."},
      porque: {"es":"Para quien es de Chile o se interesa por su historia y quiere leer cómo se contó por primera vez la tierra de Arauco, y por alguien que estuvo allí. Ayuda a entender de dónde viene parte de nuestra tradición literaria. Los cantos se leen por tandas, y la admiración del autor por el adversario sorprende todavía.","en":"For readers from Chile, or interested in its history, who want to see how the land of Arauco was first told, and by someone who was there. It helps explain where part of Chile's literary tradition comes from. The cantos can be read in batches, and the author's admiration for his adversary is still surprising."},
      imagen: {"src": "img/portadas/ercilla-la-araucana.jpg", "credito": {"es": "Raymond Monvoisin, «Caupolicán prisionero y Fresia», 1859", "en": "Raymond Monvoisin, “Caupolicán Captive and Fresia”, 1859"}, "url": "https://commons.wikimedia.org/wiki/File:Caupolicán_prisionero_y_Fresia_por_Monvoisin_(cropped).jpg"},
      citas: [
        "No las damas, amor, no gentilezas / de caballeros canto enamorados, / ni las muestras, regalos y ternezas / de amorosos afectos y cuidados",
        "Chile, fértil provincia y señalada / en la región antártica famosa, / de remotas naciones respetada / por fuerte, principal y poderosa; / la gente que produce es tan granada, / tan soberbia, gallarda y belicosa, / que no ha sido por rey jamás regida / ni a estranjero dominio sometida.",
        "¿Qué furor es el vuestro, ¡oh araucanos!, / que a perdición os lleva sin sentillo? / ¿Contra vuestras entrañas tenéis manos, / y no contra el tirano en resistillo?",
        "sin pasarles jamás por la memoria / que en siete pies de tierra al fin habían / de venir a caber sus hinchazones, / su gloria vana y vanas pretensiones."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/La_araucana"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=La_araucana"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=La_araucana"}],
      fuente: {"texto": "Texto de las tres partes transcrito en es.wikisource.org, con los preliminares de la edición antigua (dominio público)", "url": "https://es.wikisource.org/wiki/La_araucana"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-araucana"},
      parecidos: ["cervantes-viaje-al-parnaso", "lope-la-gatomaquia", "ariosto-orlando-furioso"]
    },
    {
      id: "shakespeare-la-comedia-de-las-equivocaciones",
      titulo: "La comedia de las equivocaciones",
      autor: "William Shakespeare (trad. José Arnaldo Márquez)",
      anio: "1592",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia de enredo ambientada en Éfeso, donde un mercader de Siracusa es detenido y obligado a contar su historia. Años atrás un naufragio separó a sus dos hijos gemelos, cada uno acompañado de un criado también gemelo, y ahora los cuatro coinciden en la misma ciudad. Las confusiones de identidad se multiplican entre esposas, amigos, deudores y criados, con golpes, malentendidos y escenas de gran enredo. La obra juega con el parecido, la familia perdida y el reencuentro."},
      porque: {"es":"Una de las obras más cortas de Shakespeare y una de las más fáciles de leer, buena para empezar con él. Su mérito es la maquinaria del enredo, que se sigue con una sonrisa, y bajo la risa late una pregunta seria: qué nos hace ser quienes somos.","en":"One of Shakespeare's shortest plays and among the easiest to read, a good place to start with him. Its pleasure lies in the machinery of the mix-ups, which you follow with a smile, and beneath the laughter runs a serious question: what makes us who we are."},
      imagen: {"src": "img/portadas/shakespeare-la-comedia-de-las-equivocaciones.jpg", "credito": {"es": "Henry J. Richter y Job Bauer, «The Two Dromios», 1883-1884", "en": "Henry J. Richter and Job Bauer, «The Two Dromios», 1883-1884"}, "url": "https://commons.wikimedia.org/wiki/File:(Comedy_of_errors)_The_two_dromios._Dromio_of_Ephesus._Methinks_you_are_my_glass_and_not_my_brother_-_Isee_by_you,_I_am_a_sweet-faced_youth._Comedy_of_Errors._Act_V_scene_1_-_estampe_-_Richter_pinxt_;_J._Bauer_Scupt_-_btv1b8437089t.jpg"},
      citas: [
        "Estoy en el mundo como una gota de agua que busca en el Océano otra gota; y no pudiendo encontrar allí su compañera, se pierde ella propia errante e inapercibida. Así yo, desgraciado, para encontrar una madre y un hermano, me pierdo a mí propio buscándolos.",
        "Hemos entrado en el mundo como dos hermanos: entremos aquí mano en mano y no uno delante del otro.",
        "te sería tan fácil dejar caer una gota de agua en el Océano y recogerla en seguida sin mezcla, sin adición, ni disminución alguna, como separarte de mí sin arrastrarme contigo también."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg, volumen 4 (incluye Comedia de equivocaciones)", "url": "https://www.gutenberg.org/ebooks/59686.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg, volumen 4 (incluye Comedia de equivocaciones)", "url": "https://www.gutenberg.org/ebooks/59686"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 59686: Dramas de Guillermo Shakspeare, vol. 4, traducción de José Arnaldo Márquez (Barcelona, 1883) (dominio público)", "url": "https://www.gutenberg.org/ebooks/59686"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-comedia-de-las-equivocaciones"},
      parecidos: ["shakespeare-como-gusteis", "shakespeare-el-mercader-de-venecia", "shakespeare-enrique-iv"]
    },
    {
      id: "shakespeare-romeo-y-julieta",
      titulo: "Romeo y Julieta",
      autor: "William Shakespeare (trad. Marcelino Menéndez y Pelayo)",
      anio: "1595",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Tragedia ambientada en Verona, donde las familias Montesco y Capuleto mantienen un odio antiguo que ensangrienta las calles. Romeo, hijo de los primeros, conoce en una fiesta a Julieta, hija de los segundos, y ambos se enamoran y se casan en secreto con ayuda de fray Lorenzo. Las riñas entre las casas, un destierro y una serie de planes que salen mal van cerrando el camino a los jóvenes. La obra trata del amor, la violencia de los bandos y el precio de la precipitación."},
      porque: {"es":"Se cree conocida de oídas y, al leerla, resulta más dura y más humana de lo que se recuerda. Sirve a los jóvenes y a quienes ya no lo son: muestra cuánto cuestan la prisa, el rencor heredado y las decisiones tomadas sin consejo.","en":"Most people think they know it from hearsay, and reading it turns out to be harsher and more human than remembered. It serves the young and those who no longer are: it shows what haste, inherited grudges and decisions taken without counsel can cost."},
      imagen: {"src": "img/portadas/shakespeare-romeo-y-julieta.jpg", "credito": {"es": "Frank Bernard Dicksee, «Romeo y Julieta», 1884", "en": "Frank Bernard Dicksee, «Romeo and Juliet», 1884"}, "url": "https://commons.wikimedia.org/wiki/File:Frank_Bernard_Dicksee_-_Romeo_and_Juliet,_1884.jpg"},
      citas: [
        "¡Romeo, Romeo! ¿Por qué eres tú Romeo? ¿Por qué no reniegas del nombre de tu padre y de tu madre? Y si no tienes valor para tanto, ámame, y no me tendré por Capuleto.",
        "¿Y qué quiere decir Montesco? No es pie ni mano ni brazo, ni semblante ni pedazo alguno de la naturaleza humana. ¿Por qué no tomas otro nombre? La rosa no dejaría de ser rosa, y de esparcir su aroma, aunque se llamase de otro modo.",
        "Triste es la ausencia y tan dulce la despedida, que no sé cómo arrancarme de los hierros de esta ventana.",
        "Nada violento es duradero: ni el placer ni la pena: ellos mismos se consumen como el fuego y la pólvora al usarse. La excesiva dulcedumbre de la miel empalaga al labio. Ama, pues, con templanza."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg, volumen 1 (incluye Romeo y Julieta)", "url": "https://www.gutenberg.org/ebooks/53207.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg, volumen 1 (incluye Romeo y Julieta)", "url": "https://www.gutenberg.org/ebooks/53207"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 53207: Dramas de Guillermo Shakspeare, vol. 1, traducción de Marcelino Menéndez y Pelayo (Barcelona, 1881) (dominio público)", "url": "https://www.gutenberg.org/ebooks/53207"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/romeo-y-julieta"},
      parecidos: ["shakespeare-como-gusteis", "shakespeare-el-mercader-de-venecia", "shakespeare-enrique-iv"]
    },
    {
      id: "lope-el-remedio-en-su-desdicha",
      titulo: "El remedio en su desdicha",
      autor: "Lope de Vega",
      anio: "1596",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia de Lope de Vega basada en la historia del moro Abindarráez y la bella Jarifa, hija del alcaide de Cartama. Abindarráez, apresado en la frontera por el capitán cristiano Rodrigo de Narváez, obtiene permiso para visitar a su amada con la promesa de volver a su prisión. La obra recoge la cortesía entre enemigos, la palabra dada y el amor que supera la guerra. Se conoce también con el título «El remedio en la desdicha»."},
      porque: {"es":"Una buena lectura para quien busca un ideal de nobleza que no sea ingenuo. Presenta a enemigos que se respetan y a un hombre que cumple su palabra aunque le cueste caro, algo que hoy se agradece encontrar en una página, y más en una tan ágil.","en":"A good read for anyone seeking an ideal of nobility that is not naive. It presents enemies who respect one another and a man who keeps his word even at great cost, something one is glad to find on a page today, especially one this lively."},
      imagen: {"src": "img/portadas/lope-el-remedio-en-su-desdicha.jpg", "credito": {"es": "Ignacio Merino, «El último abencerraje», h. 1870", "en": "Ignacio Merino, «The Last Abencerraje», c. 1870"}, "url": "https://commons.wikimedia.org/wiki/File:El_%C3%BAltimo_abencerraje.jpg"},
      citas: [
        "Ámala, sirve y regala, / con celos no la des pena; / que no hay mujer que sea buena / si ve que piensan que es mala.",
        "Moro, la libertad que yo te he dado me obliga a tu defensa; y sabe el cielo que te he dado tres cosas en un día, que es de ellas cada cual la más preciosa: la libertad, la honra, y hoy la vida.",
        "Rendido estoy a tu nobleza, y veo que mi ignorancia fue mi propio engaño, aunque si amor a todos da disculpa, ¿por qué no la tendrán mi amor y celos?"
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El%20remedio%20en%20su%20desdicha"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El%20remedio%20en%20su%20desdicha"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El%20remedio%20en%20su%20desdicha"}],
      fuente: {"texto": "Transcripción de es.wikisource (dominio público)", "url": "https://es.wikisource.org/wiki/El_remedio_en_su_desdicha"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-remedio-en-la-desdicha"},
      parecidos: ["lope-de-vega-amor-pleito-y-desafio", "lope-de-vega-arte-nuevo-de-hacer-comedias", "lope-de-vega-ay-verdades-que-en-amor"]
    },
    {
      id: "shakespeare-enrique-iv",
      titulo: "Enrique IV",
      autor: "William Shakespeare (trad. Miguel Cané)",
      anio: "1597",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Drama histórico en dos partes sobre el reinado de Enrique IV de Inglaterra, amenazado por la rebelión de los Percy. Su hijo, el príncipe Hal, vive entre tabernas con el caballero Falstaff y sus compañeros, hasta que debe asumir sus responsabilidades frente al reino. La primera parte culmina en la batalla de Shrewsbury y la segunda, en los años finales del rey enfermo. Mezcla escenas de corte y de guerra con el humor de Falstaff, uno de los personajes más recordados del teatro inglés."},
      porque: {"es":"Para quien quiere ver cómo se hace un hombre responsable. El príncipe Hal pasa de la taberna al deber, y Falstaff, con todo su encanto, le sirve de espejo de lo que no conviene ser. Es teatro histórico, pero lo que cuenta es el crecimiento de una persona.","en":"For anyone who wants to watch a responsible man being made. The young prince passes from the tavern to duty, and Falstaff, with all his charm, serves as a mirror of what is better not to become. It is historical drama, but what it really tells is a person growing up."},
      imagen: {"src": "img/portadas/shakespeare-enrique-iv.jpg", "credito": {"es": "Eduard von Grützner, «Falstaff», 1906", "en": "Eduard von Grützner, «Falstaff», 1906"}, "url": "https://commons.wikimedia.org/wiki/File:Eduard_von_Gr%C3%BCtzner_-_Falstaff_(1906).jpg"},
      citas: [
        "¡Inquieta vive la cabeza que lleva una corona!",
        "Sueño, dulce sueño, suave nodriza de la naturaleza, ¿qué espanto te he causado, que no quieres ya cerrar mis párpados y empapar mis sentidos en el olvido?",
        "Quiero imitar al sol, que permite a las nubes ínfimas o impuras, que oculten al mundo su belleza, hasta que le plazca volver a su brillo soberano, reapareciendo al disipar las brumas sombrías y los vapores que parecían ahogarle, para ser más admirado.",
        "Si todo el año fuera fiesta, el placer sería tan fastidioso como el trabajo; pero viniendo aquellas rara vez, son más deseadas y se esperan como un acontecimiento.",
        "¿Puede el honor reponerme una pierna? No. ¿O un brazo? No. ¿O suprimir el dolor de una herida? No. ¿El honor no es diestro en cirugía? No. ¿Qué es el honor? Un soplo."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Enrique%20IV%20%28Can%C3%A9%20tr.%29"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Enrique%20IV%20%28Can%C3%A9%20tr.%29"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Enrique%20IV%20%28Can%C3%A9%20tr.%29"}],
      fuente: {"texto": "Traducción de Miguel Cané (Buenos Aires: La Cultura Argentina, 1918), transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/Enrique_IV_(Cané_tr.)"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/enrique-iv-0"},
      parecidos: ["shakespeare-como-gusteis", "shakespeare-el-mercader-de-venecia", "shakespeare-hamlet"]
    },
    {
      id: "shakespeare-el-mercader-de-venecia",
      titulo: "El mercader de Venecia",
      autor: "William Shakespeare (trad. Marcelino Menéndez y Pelayo)",
      anio: "1598",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Antonio, rico mercader veneciano, pide un préstamo al usurero Shylock para ayudar a su amigo Bassanio a cortejar a la heredera Porcia, y firma un pagaré con una condena singular si no paga a tiempo. Mientras sus naves tardan en volver, la hija de Shylock huye de su casa y Porcia debe resolver con ingenio una prueba dejada por su padre. La obra une comedia amorosa, juicio y reflexión sobre la deuda, la misericordia y el trato entre cristianos y judíos. Su escena del tribunal es de las más célebres de Shakespeare."},
      porque: {"es":"Una comedia incómoda que merece leerse con atención y sin prejuicios. Obliga a pensar en la justicia, la misericordia y el trato a quien es distinto, y deja al lector discutiendo consigo mismo, que es justamente lo que se espera de un clásico.","en":"An uncomfortable comedy that deserves careful reading without prejudice. It forces thought about justice, mercy and the treatment of those who are different, and leaves the reader arguing with himself, which is exactly what one hopes for from a classic."},
      imagen: {"src": "img/portadas/shakespeare-el-mercader-de-venecia.jpg", "credito": {"es": "Maurycy Gottlieb, «Shylock y Jessica», 1876", "en": "Maurycy Gottlieb, «Shylock and Jessica», 1876"}, "url": "https://commons.wikimedia.org/wiki/File:Maurycy_Gottlieb_-_Shylock_e_jessica.jpg"},
      citas: [
        "La clemencia no quiere fuerza: es como la plácida lluvia del cielo que cae sobre un campo y le fecunda: dos veces bendita porque consuela al que la da y al que la recibe.",
        "Hebreo, ya que pides no más que justicia, piensa que si sólo justicia hubiera, no se salvaría ninguno de nosotros. Todos los días, en la oración, pedimos clemencia, pero la misma oración nos enseña a perdonar como deseamos que nos perdonen.",
        "¿Y el judío no tiene ojos, no tiene manos ni órganos ni alma, ni sentidos ni pasiones? ¿No se alimenta de los mismos manjares, no recibe las mismas heridas, no padece las mismas enfermedades y se cura con iguales medicinas, no tiene calor en verano y frío en invierno, lo mismo que el cristiano?",
        "No es oro todo lo que reluce: así dice el refrán antiguo; tú verás si con razón. ¡A cuántos ha engañado en la vida una vana exterioridad!"
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg, volumen 1 (incluye El mercader de Venecia)", "url": "https://www.gutenberg.org/ebooks/53207.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg, volumen 1 (incluye El mercader de Venecia)", "url": "https://www.gutenberg.org/ebooks/53207"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 53207: Dramas de Guillermo Shakspeare, vol. 1, traducción de Marcelino Menéndez y Pelayo (Barcelona, 1881) (dominio público)", "url": "https://www.gutenberg.org/ebooks/53207"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-mercader-de-venecia"},
      parecidos: ["shakespeare-como-gusteis", "shakespeare-enrique-iv", "shakespeare-hamlet"]
    },
    {
      id: "shakespeare-las-alegres-comadres-de-windsor",
      titulo: "Las alegres comadres de Windsor",
      autor: "William Shakespeare (trad. José Arnaldo Márquez)",
      anio: "1598",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia sobre sir John Falstaff, caballero pobre y presumido que decide cortejar a dos vecinas acomodadas de Windsor para sacarles dinero. Las señoras Ford y Page se enteran de la treta y se unen para burlarlo con una serie de trampas. Entretanto, el señor Ford, celoso, se disfraza para vigilar a su esposa, y los pretendientes de la joven Ana Page buscan su mano. Es una comedia de costumbres de una villa inglesa, de ritmo vivo y mucho humor."},
      porque: {"es":"Es la comedia más doméstica de Shakespeare y la más sencilla de disfrutar. Sirve para reírse de la vanidad y de los celos, propios y ajenos, y para comprobar que el ingenio de dos mujeres puede más que la presunción de un caballero muy seguro de sí.","en":"The most down-to-earth of Shakespeare's comedies and the easiest to enjoy. It is good for laughing at vanity and jealousy, our own and other people's, and for seeing that the wit of two women outweighs the conceit of a knight very sure of himself."},
      imagen: {"src": "img/portadas/shakespeare-las-alegres-comadres-de-windsor.jpg", "credito": {"es": "John S. Clifton, «Buck Washing on Datchet Mead», 1849", "en": "John S. Clifton, «Buck Washing on Datchet Mead», 1849"}, "url": "https://commons.wikimedia.org/wiki/File:John_S._Clifton_-_Buck_Washing_on_Datchet_Mead_from_%27The_Merry_Wives_of_Windsor,%27_III,_v_-_Google_Art_Project.jpg"},
      citas: [
        "Haré del mundo una ostra y la abriré con mi espada.",
        "No hay pecado en burlarse de tales libertinos y de su corrupción.",
        "Principio a comprender que me han hecho hacer el papel de asno."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg, volumen 4 (incluye Las alegres comadres de Windsor)", "url": "https://www.gutenberg.org/ebooks/59686.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg, volumen 4 (incluye Las alegres comadres de Windsor)", "url": "https://www.gutenberg.org/ebooks/59686"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 59686: Dramas de Guillermo Shakspeare, vol. 4, traducción de José Arnaldo Márquez (Barcelona, 1883) (dominio público)", "url": "https://www.gutenberg.org/ebooks/59686"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/las-alegres-comadres-de-windsor"},
      parecidos: ["shakespeare-como-gusteis", "shakespeare-el-mercader-de-venecia", "shakespeare-enrique-iv"]
    },
    {
      id: "shakespeare-como-gusteis",
      titulo: "Como gustéis",
      autor: "William Shakespeare (trad. José Arnaldo Márquez)",
      anio: "1599",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia pastoril en la que un duque desterrado vive con sus fieles en el bosque de Arden, mientras su hermano usurpador gobierna la corte. Rosalinda, hija del duque, huye también al bosque con su prima Celia y disfrazada de joven, y allí encuentra a Orlando, que la ama sin reconocerla. Entre enredos amorosos, bufones y reflexiones sobre la vida, la obra contrapone la corte y la naturaleza. De ella procede el célebre pasaje en que el mundo se compara con un escenario."},
      porque: {"es":"Una obra para leer con calma cuando se necesita aire. El bosque de Arden ofrece un descanso de la ambición y del bullicio, y entre bromas deja ideas sobre el amor, la vida sencilla y el papel que cada uno representa ante los demás.","en":"A play to read slowly when you need some air. The forest it describes offers a rest from ambition and bustle, and between the jokes it leaves ideas about love, simple living and the part each of us plays before others."},
      imagen: {"src": "img/portadas/shakespeare-como-gusteis.jpg", "credito": {"es": "James Archer, «Rosalind and Celia»", "en": "James Archer, «Rosalind and Celia»"}, "url": "https://commons.wikimedia.org/wiki/File:Rosalind_and_Celia_James_Archer_(1823%E2%80%931904)_Royal_Scottish_Academy_of_Art_%26_Architecture.jpg"},
      citas: [
        "Todo el mundo es un escenario, y todos, hombres y mujeres, son meros actores. Todos tienen sus entradas y salidas, y cada hombre en su vida representa muchos papeles, siendo los actos siete edades.",
        "Dulces son los frutos de la adversidad que, semejante al feo y venenoso sapo, lleva en la cabeza una preciosa joya.",
        "Esta nuestra vida retirada del bullicio público, descubre idiomas en los árboles, libros en los arroyos, sermones en las piedras, y el bien en todas las cosas.",
        "El necio se cree discreto y el discreto se tiene a sí propio en concepto de necio."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg, volumen 4 (incluye Como gustéis)", "url": "https://www.gutenberg.org/ebooks/59686.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg, volumen 4 (incluye Como gustéis)", "url": "https://www.gutenberg.org/ebooks/59686"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 59686: Dramas de Guillermo Shakspeare, vol. 4, traducción de José Arnaldo Márquez (Barcelona, 1883) (dominio público)", "url": "https://www.gutenberg.org/ebooks/59686"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/como-gusteis"},
      parecidos: ["shakespeare-el-mercader-de-venecia", "shakespeare-enrique-iv", "shakespeare-hamlet"]
    },
    {
      id: "ruiz-de-alarcon-las-paredes-oyen",
      titulo: "Las paredes oyen",
      autor: "Juan Ruiz de Alarcón",
      anio: "1600",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia de enredo madrileña del dramaturgo novohispano Juan Ruiz de Alarcón. Don Mendo, galán presumido y murmurador, corteja a la viuda doña Ana y a su prima doña Lucrecia, y habla mal de ambas. Sus palabras son oídas por quienes no debían, y las damas, los criados y sus rivales se las devuelven en una cadena de equívocos. La obra trata de la maledicencia y de la lealtad entre amigos, y se tiene por una de las mejores comedias del Siglo de Oro."},
      porque: {"es":"Sirve a quien quiere conocer a un dramaturgo menos nombrado que Lope o Calderón, pero de gran finura. Tiene una moraleja que no ha envejecido: el que habla mal de los demás termina pagándolo, y se lee con la sonrisa de quien ya vio algo parecido.","en":"Useful for anyone who wants to meet a playwright less often named than his famous contemporaries, yet very fine. Its moral has not aged: whoever speaks ill of others ends up paying for it, and it reads with the smile of someone who has seen the like before."},
      imagen: {"src": "img/portadas/ruiz-de-alarcon-las-paredes-oyen.jpg", "credito": {"es": "Juan de la Corte, «Fiesta real en la Plaza Mayor de Madrid», siglo XVII", "en": "Juan de la Corte, «Royal Festival in the Plaza Mayor of Madrid», 17th century"}, "url": "https://commons.wikimedia.org/wiki/File:Corte-plaza_mayor.jpg"},
      citas: [
        "¿Hablas tú tan mal de mí sin que contigo te enojes, y enójaste con quien pudo contarme tus sinrazones? Quien te daña es la verdad de las culpas que te ponen; si pecaste, y yo lo supe, ¿qué importa saber de dónde?",
        "Pienso que es exceptuado murmurar del que murmura; dicen que el que hurta al ladrón gana perdones.",
        "Y pues las sé, bien te puedes despedir de mis favores, y a toda ley hablar bien, porque las paredes oyen."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/77445.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/77445"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 77445: edición de Editora Internacional, Buenos Aires, 1924, con ortografía modernizada por el transcriptor (dominio público)", "url": "https://www.gutenberg.org/ebooks/77445"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/las-paredes-oyen"},
      parecidos: ["shakespeare-como-gusteis", "shakespeare-el-mercader-de-venecia", "shakespeare-hamlet"]
    },
    {
      id: "shakespeare-hamlet",
      titulo: "Hamlet",
      autor: "William Shakespeare (trad. Leandro Fernández de Moratín)",
      anio: "1602",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Tragedia del príncipe de Dinamarca, a quien el espectro de su padre revela que fue asesinado por su propio hermano, hoy rey y esposo de la reina viuda. Hamlet duda entre vengar el crimen y asegurarse de la verdad, finge locura y prepara una representación teatral para poner a prueba al rey. Alrededor suyo se mueven Ofelia, Polonio, Laertes y los cortesanos, entre espionajes y traiciones. La obra es un clásico sobre la duda, la culpa, la muerte y el deber. Se ofrece en la traducción de Leandro Fernández de Moratín."},
      porque: {"es":"Es el libro para quien duda: de lo que debe hacer, de lo que es verdad, de lo que vale su propia vida. Leerlo en edad adulta cambia la lectura de juventud, y su monólogo más conocido cobra otro peso cuando uno lo encuentra por fin en su lugar.","en":"The book for anyone who doubts: about what he should do, what is true, what his own life is worth. Reading it as an adult changes the reading of youth, and its best-known soliloquy gains new weight when you finally meet it in its place."},
      imagen: {"src": "img/portadas/shakespeare-hamlet.jpg", "credito": {"es": "Eugène Delacroix, «Hamlet y Horacio en el cementerio», 1839", "en": "Eugène Delacroix, «Hamlet and Horatio in the Graveyard», 1839"}, "url": "https://commons.wikimedia.org/wiki/File:Hamlet_et_Horatio_au_cimeti%C3%A8re_-_Eug%C3%A8ne_Delacroix_-_Mus%C3%A9e_du_Louvre_Peintures_RF_1942.jpg"},
      citas: [
        "Existir o no existir, ésta es la cuestión. ¿Cuál es más digna acción del ánimo: sufrir los tiros penetrantes de la fortuna injusta, u oponer los brazos a este torrente de calamidades, y darles fin con atrevida resistencia?",
        "Ello es, Horacio, que en el cielo y en la tierra hay más de lo que puede soñar tu filosofía.",
        "Hasta en la muerte de un pajarillo interviene una providencia irresistible. Si mi hora es llegada, no hay que esperarla; si no ha de venir ya, señal que es hora; y si ahora no fuese, habrá de ser después: todo consiste en hallarse prevenido para cuando venga.",
        "¡Ay, pobre Yorick...! Yo le conocí, Horacio... Era un hombre sumamente gracioso, de la más fecunda imaginación."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/56454.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/56454"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 56454: Hamlet, traducción de L. Fernández de Moratín (Casa Editorial Maucci) (dominio público)", "url": "https://www.gutenberg.org/ebooks/56454"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/hamlet"},
      parecidos: ["shakespeare-como-gusteis", "shakespeare-el-mercader-de-venecia", "shakespeare-enrique-iv"]
    },
    {
      id: "shakespeare-macbeth",
      titulo: "Macbeth",
      autor: "William Shakespeare (trad. Marcelino Menéndez y Pelayo)",
      anio: "1603",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Tragedia de Shakespeare en cinco actos. Macbeth, un valiente general escocés, recibe de unas brujas una profecía que despierta en él y en su esposa una ambición sin freno. A partir de ahí, la obra sigue cómo la sed de poder lo arrastra a la culpa, la desconfianza y el miedo. Se ofrece en la traducción de Marcelino Menéndez y Pelayo, publicada en Barcelona en 1881."},
      porque: {"es":"Una advertencia tan breve como eficaz sobre lo que la ambición hace al que la consiente. Se lee de un tirón, con ritmo de novela negra, y deja una pregunta incómoda: cuántas pequeñas concesiones bastan para que un hombre honrado ya no se reconozca.","en":"A warning as brief as it is effective about what ambition does to the man who indulges it. It reads in one go, with the pace of a thriller, and leaves an uncomfortable question: how many small concessions does it take before an honest man no longer recognizes himself."},
      imagen: {"src": "img/portadas/shakespeare-macbeth.jpg", "credito": {"es": "Henry Fuseli, «Macbeth, Banquo y las brujas», c. 1793-1794", "en": "Henry Fuseli, “Macbeth, Banquo and the Witches”, c. 1793-1794"}, "url": "https://commons.wikimedia.org/wiki/File:Henry_Fuseli_(1741-1825)_-_Macbeth,_Banquo_and_the_Witches_(from_William_Shakespeare's_'Macbeth',_Act_I,_Scene_iii)_-_486261_-_National_Trust.jpg"},
      citas: [
        "Esa engañosa palabra mañana, mañana, mañana nos va llevando por días al sepulcro, y la falaz lumbre del ayer ilumina al necio hasta que cae en la fosa. ¡Apágate ya, luz de mi vida! ¿Qué es la vida sino una sombra, un histrión que pasa por el teatro, y a quien se olvida después, o la vana y ruidosa fábula de un necio?",
        "La ambición me impele a escalar la cima, ¿pero rodaré por la pendiente opuesta?",
        "¡Horror contra naturaleza! ¡La ambición se devora a sí misma!",
        "No bastaría todo el Océano para lavar la sangre de mis dedos. Ellos bastarían para enrojecerle y mancharle."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Macbeth_(Men%C3%A9ndez_y_Pelayo_tr.)"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Macbeth_%28Men%C3%A9ndez_y_Pelayo_tr.%29"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Macbeth_%28Men%C3%A9ndez_y_Pelayo_tr.%29"}],
      fuente: {"texto": "Traducción de Marcelino Menéndez y Pelayo (Dramas de Guillermo Shakespeare, Barcelona, 1881), transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/Macbeth_(Men%C3%A9ndez_y_Pelayo_tr.)"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/macbeth"},
      parecidos: ["shakespeare-como-gusteis", "shakespeare-el-mercader-de-venecia", "shakespeare-enrique-iv"]
    },
    {
      id: "shakespeare-otelo",
      titulo: "Otelo",
      autor: "William Shakespeare (trad. Marcelino Menéndez y Pelayo)",
      anio: "1604",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Tragedia de Shakespeare en cinco actos. Otelo, general moro al servicio de Venecia, se casa en secreto con Desdémona y parte a defender Chipre de los turcos. Allí su alférez Yago, resentido con él, urde con paciencia un plan para sembrarle la sospecha y los celos. La obra muestra cómo la calumnia bien dirigida puede destruir la confianza y la felicidad de una pareja. Se ofrece en la traducción de Marcelino Menéndez y Pelayo, publicada en Barcelona en 1881."},
      porque: {"es":"Muestra con precisión cómo una sospecha bien sembrada puede más que el amor y la razón. Le sirve a todo el que alguna vez dio crédito a un rumor, y enseña a desconfiar de la voz que dice aconsejar con honradez mientras empuja hacia el daño.","en":"It shows precisely how a well-planted suspicion can outweigh love and reason. It serves anyone who ever gave credit to a rumor, and teaches distrust of the voice that claims to advise honestly while pushing toward harm."},
      imagen: {"src": "img/portadas/shakespeare-otelo.jpg", "credito": {"es": "Théodore Chassériau, «Otelo y Desdémona en Venecia», 1850", "en": "Théodore Chassériau, “Othello and Desdemona in Venice”, 1850"}, "url": "https://commons.wikimedia.org/wiki/File:Othello_et_Desd%C3%A9mone_%C3%A0_Venise_-_Th%C3%A9odore_Chass%C3%A9riau_-_Mus%C3%A9e_du_Louvre_Peintures_RF_3897.jpg"},
      citas: [
        "Señor, temed mucho a los celos, pálido monstruo, burlador del alma que le da abrigo. Feliz el engañado que descubre el engaño y consigue aborrecer a la engañadora, pero ¡ay del infeliz que aún la ama, y duda, y vive entre amor y recelo!",
        "La buena reputación, así en hombre como en mujer, es el tesoro más preciado. Poco roba quien roba mi dinero: antes fue algo, después nada: antes mío, ahora suyo, y puede ser de otros cincuenta. Pero quien me roba la fama, no se enriquece, y a mí me deja pobre.",
        "La voluntad es el hortelano de la vida, y puede criar en ella ortigas y cardos, o hisopos y tomillo: una sola yerba o muchas: enriquecer la tierra o empobrecerla: tenerla de barbecho o abonarla. Para eso es la prudencia, el seso y el libre albedrío.",
        "La sombra más vana, la más ligera sospecha son para un celoso irrecusables pruebas."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Otelo_(Men%C3%A9ndez_y_Pelayo_tr.)"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Otelo_%28Men%C3%A9ndez_y_Pelayo_tr.%29"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Otelo_%28Men%C3%A9ndez_y_Pelayo_tr.%29"}],
      fuente: {"texto": "Traducción de Marcelino Menéndez y Pelayo (Dramas de Guillermo Shakespeare, Barcelona, 1881), transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/Otelo_(Men%C3%A9ndez_y_Pelayo_tr.)"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/otelo"},
      parecidos: ["shakespeare-como-gusteis", "shakespeare-el-mercader-de-venecia", "shakespeare-enrique-iv"]
    },
    {
      id: "cervantes-don-quijote",
      titulo: "Don Quijote de la Mancha",
      autor: "Miguel de Cervantes",
      anio: "1605",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Novela de Cervantes en dos partes sobre un hidalgo manchego que, de tanto leer libros de caballerías, decide hacerse caballero andante. Acompañado de su escudero Sancho Panza, recorre los caminos de España en busca de aventuras que su imaginación transforma en hazañas. Entre la risa y la ternura, el libro confronta los ideales con la realidad y retrata la sociedad de su tiempo. Es una de las obras fundacionales de la novela moderna."},
      porque: {"es":"Es un libro que se lee distinto a los veinte, a los cuarenta y a los setenta: primero hace reír, después empieza a doler un poco ver cuánto cuesta sostener un ideal. Vale la pena hoy porque enseña a mirar con ternura a quien se equivoca por creer demasiado, y a reírse de uno mismo.","en":"This is a book that reads differently at twenty, at forty and at seventy: first it makes you laugh, then it starts to hurt a little to see what it costs to hold on to an ideal. It is worth reading today because it teaches you to look tenderly at someone who errs by believing too much, and to laugh at yourself."},
      imagen: {"src": "img/portadas/cervantes-don-quijote.jpg", "credito": {"es": "Gustave Doré, «La aventura de los molinos de viento», 1863", "en": "Gustave Doré, “Adventure with the Windmills”, 1863"}, "url": "https://commons.wikimedia.org/wiki/File:Adventure_with_the_Windmills.jpg"},
      citas: [
        "En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.",
        "La libertad, Sancho, es uno de los más preciosos dones que a los hombres dieron los cielos; con ella no pueden igualarse los tesoros que encierra la tierra ni el mar encubre; por la libertad, así como por la honra, se puede y debe aventurar la vida.",
        "La verdad adelgaza y no quiebra, y siempre anda sobre la mentira como el aceite sobre el agua.",
        "Yo sé quién soy; y sé que puedo ser no sólo los que he dicho, sino todos los Doce Pares de Francia, y aun todos los Nueve de la Fama.",
        "No hay fortuna en el mundo, ni las cosas que en él suceden, buenas o malas que sean, vienen acaso, sino por particular providencia de los cielos, y de aquí viene lo que suele decirse: que cada uno es artífice de su ventura."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/2000.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/2000"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 2000 (dominio público)", "url": "https://www.gutenberg.org/ebooks/2000"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/don-quijote-de-la-mancha"},
      parecidos: ["cervantes-el-trato-de-argel", "cervantes-novelas-ejemplares", "cervantes-viaje-al-parnaso"]
    },
    {
      id: "lope-de-vega-arte-nuevo-de-hacer-comedias",
      titulo: "El arte nuevo de hacer comedias",
      autor: "Lope de Vega",
      anio: "1608",
      idioma: "es",
      categoria: "ensayo",
      recomendado: false,
      resumen: {"es": "Poema didáctico en verso en el que Lope de Vega explica, ante una academia madrileña, cómo escribir comedias para el público de su tiempo. Defiende la mezcla de lo trágico y lo cómico, la división en tres actos y la variedad de metros según la situación. Con humor y desenfado, discute además las reglas de los antiguos y justifica por qué el teatro nuevo busca agradar al espectador. Es un texto clave para entender el teatro español del Siglo de Oro."},
      porque: {"es":"Para quien escribe, dirige o simplemente va al teatro, y quiere saber qué busca el público y por qué. Es breve y está escrito con gracia, así que se lee de una sentada. Muestra a un autor que defiende su oficio con franqueza y sin solemnidad, y ayuda a ver mejor las comedias del Siglo de Oro.","en":"For anyone who writes, directs or simply goes to the theatre and wants to know what audiences look for and why. It is short and written with charm, so it can be read in one sitting. It shows an author defending his craft frankly and without solemnity, and it helps you see Golden Age plays more clearly."},
      imagen: {"src": "img/portadas/lope-de-vega-arte-nuevo-de-hacer-comedias.jpg", "credito": {"es": "Antoine Watteau, «Los comediantes italianos», c. 1720", "en": "Antoine Watteau, “The Italian Comedians”, c. 1720"}, "url": "https://commons.wikimedia.org/wiki/File:Antoine_Watteau,_The_Italian_Comedians,_probably_1720,_NGA_32687.jpg"},
      citas: [
        "Y cuando he de escribir una comedia, / encierro los preceptos con seis llaves, / saco a Terencio y Plauto de mi estudio / para que no me den voces, que suele / dar gritos la verdad en libros mudos",
        "porque como las paga el vulgo, es justo / hablarle en necio para darle gusto.",
        "Ya tiene la comedia verdadera su fin propuesto como todo género de poema o poesis, y este ha sido imitar las acciones de los hombres, y pintar de aquel siglo las costumbres.",
        "Buen ejemplo nos da naturaleza, / que por tal variedad tiene belleza.",
        "Los casos de la honra son mejores, / porque mueven con fuerza a toda gente, / con ellos las acciones virtuosas, / que la virtud es dondequiera amada"
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El_arte_nuevo_de_hacer_comedias"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El_arte_nuevo_de_hacer_comedias"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El_arte_nuevo_de_hacer_comedias"}],
      fuente: {"texto": "Transcripción de es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/El_arte_nuevo_de_hacer_comedias"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/arte-nuevo-de-hacer-comedias"},
      parecidos: ["lope-de-vega-amor-pleito-y-desafio", "lope-de-vega-ay-verdades-que-en-amor", "lope-de-vega-el-perro-del-hortelano"]
    },
    {
      id: "lope-de-vega-peribanez",
      titulo: "Peribáñez y el comendador de Ocaña",
      autor: "Lope de Vega",
      anio: "1610",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia en tres actos de Lope de Vega. En plena boda del labrador Peribáñez con Casilda, un percance durante los festejos lleva al comendador de Ocaña a fijarse en la novia. El poderoso señor intenta ganarse a la joven y apartar al marido con los medios que su rango le da. La obra enfrenta el honor de un hombre del pueblo con los abusos de la nobleza, hasta un desenlace que llega ante el propio rey."},
      porque: {"es":"Para quien se pregunta qué es la dignidad de un hombre sencillo frente a un poderoso. Lope hace hablar al labrador con una altura que sorprende, y el lector sale con la idea, nada pasada de moda, de que el honor no depende del apellido.","en":"For anyone who wonders what the dignity of a plain man amounts to before a powerful one. The author lets the farmer speak with a stature that surprises, and the reader leaves with the idea, not at all outdated, that honor does not depend on a surname."},
      imagen: {"src": "img/portadas/lope-de-vega-peribanez.jpg", "credito": {"es": "Francisco de Goya, «La boda», 1791-1792", "en": "Francisco de Goya, “The Wedding”, 1791-1792"}, "url": "https://commons.wikimedia.org/wiki/File:Goya_-_La_boda,_1791_-_1792,_P000799.jpg"},
      citas: [
        "Amar y honrar su marido / es letra de este abecé, / siendo buena por la B, / que es todo el bien que te pido.",
        "¡Cosa extraña! ¡Que un labrador tan humilde / estime tanto su fama!",
        "Bien decís; no me acordaba / que las partes se han de oír, / y más cuando son tan flacas.",
        "Con razón todos te llaman / don Enrique el Justiciero."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Perib%C3%A1%C3%B1ez_y_el_comendador_de_Oca%C3%B1a"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Perib%C3%A1%C3%B1ez_y_el_comendador_de_Oca%C3%B1a"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Perib%C3%A1%C3%B1ez_y_el_comendador_de_Oca%C3%B1a"}],
      fuente: {"texto": "Transcripción de es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/Perib%C3%A1%C3%B1ez_y_el_comendador_de_Oca%C3%B1a"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/peribanez-y-el-comendador-de-ocana"},
      parecidos: ["lope-de-vega-amor-pleito-y-desafio", "lope-de-vega-arte-nuevo-de-hacer-comedias", "lope-de-vega-ay-verdades-que-en-amor"]
    },
    {
      id: "lope-de-vega-la-discordia-en-los-casados",
      titulo: "La discordia en los casados",
      autor: "Lope de Vega",
      anio: "1611",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia en tres actos de Lope de Vega ambientada en el ducado de Cleves. La joven duquesa Elena debe decidir sobre su matrimonio con el rey de Frisia, que sus nobles consideran lo más conveniente para el Estado, mientras las ambiciones y las envidias de la corte complican el asunto. En paralelo, unos villanos y criados aportan la parte cómica con sus propios enredos. Está escrita en verso, con el ritmo ágil del teatro del Siglo de Oro."},
      porque: {"es":"Una obra poco frecuentada que ofrece la ocasión de ver a Lope fuera de sus títulos más famosos. Sirve al lector curioso del teatro áureo y a quien se interesa por cómo se mezclan, desde entonces, el cálculo político y los sentimientos en una decisión de matrimonio.","en":"A little-visited play that offers a chance to see the author outside his most famous titles. It suits the reader curious about Golden Age theater and anyone interested in how political calculation and feeling were already mixed in a decision about marriage."},
      imagen: {"src": "img/portadas/lope-de-vega-la-discordia-en-los-casados.jpg", "credito": {"es": "William Hogarth, «Matrimonio a la moda, 2: El tête à tête», c. 1743", "en": "William Hogarth, “Marriage A-la-Mode, 2: The Tête à Tête”, c. 1743"}, "url": "https://commons.wikimedia.org/wiki/File:Marriage_A-la-Mode_2,_The_T%C3%AAte_%C3%A0_T%C3%AAte_-_William_Hogarth.jpg"},
      citas: [
        "Lo que gana me fatiga, / desháceme lo que pierdo, / porque es mi definición / pesarme del bien ajeno.",
        "Mal conoces el furor / que amor ofendido alcanza; / quédese atrás el honor, / porque no hay mayor venganza / que por ofensas de amor.",
        "Mayormente que el honor / pocas firmezas ofrece, / porque es un vidrio traidor / que con quebrarse agradece / querer limpiarle mejor."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/La_discordia_en_los_casados"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=La_discordia_en_los_casados"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=La_discordia_en_los_casados"}],
      fuente: {"texto": "Transcripción de es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/La_discordia_en_los_casados"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-discordia-en-los-casados"},
      parecidos: ["lope-de-vega-amor-pleito-y-desafio", "lope-de-vega-arte-nuevo-de-hacer-comedias", "lope-de-vega-ay-verdades-que-en-amor"]
    },
    {
      id: "cervantes-novelas-ejemplares",
      titulo: "Novelas ejemplares",
      autor: "Miguel de Cervantes",
      anio: "1613",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Colección de novelas cortas de Cervantes, entre ellas La gitanilla, Rinconete y Cortadillo, El licenciado Vidriera y El coloquio de los perros. Reúne historias de amor, de picaresca, de engaño y de ingenio, ambientadas en la España y la Italia de su tiempo. En el prólogo el autor explica que las llamó «ejemplares» porque de cada una puede sacarse algún provecho. Esta edición incluye además la dedicatoria y el prólogo."},
      porque: {"es":"Para quien quiere entrar a Cervantes sin comprometerse con mil páginas. Son relatos breves que se leen de a uno, con picardía, enredos y lengua muy viva, y se pueden elegir según el ánimo del día. Cada uno deja algo en qué pensar, tal como promete su prólogo.","en":"For readers who want to approach Cervantes without committing to a thousand pages. These are short stories to be read one at a time, full of mischief, tangled plots and lively language, and you can pick one to suit the mood of the day. Each leaves something to think about, just as the prologue promises."},
      imagen: {"src": "img/portadas/cervantes-novelas-ejemplares.jpg", "credito": {"es": "Bartolomé Esteban Murillo, «Niños jugando a los dados», c. 1670-1675", "en": "Bartolomé Esteban Murillo, “Boys Playing Dice”, c. 1670-1675"}, "url": "https://commons.wikimedia.org/wiki/File:Niños_jugando_a_los_dados_(Bartolomé_Esteban_Murillo).jpg"},
      citas: [
        "Héles dado el nombre de Ejemplares, y si bien lo miras, no hay ninguna de quien no se pueda sacar un ejemplo provechoso.",
        "Mi intento ha sido poner en la plaza de nuestra república una mesa de trucos, donde cada uno pueda llegar a entretenerse sin daño de barras: digo, sin daño del alma ni del cuerpo, porque los ejercicios honestos y agradables antes aprovechan que dañan.",
        "Yo soy el primero que he novelado en lengua castellana.",
        "Duerme; que todo el tiempo que durmieres, serás igual al que envidias.",
        "Muchas veces suele llover sus misericordias en el tiempo que están más secas las esperanzas."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/61202.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/61202"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 61202 (Colección de Autores Españoles, tomo XXV; dominio público)", "url": "https://www.gutenberg.org/ebooks/61202"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/novelas-ejemplares"},
      parecidos: ["cervantes-don-quijote", "cervantes-el-trato-de-argel", "cervantes-viaje-al-parnaso"]
    },
    {
      id: "lope-de-vega-la-dama-boba",
      titulo: "La dama boba",
      autor: "Lope de Vega",
      anio: "1613",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia en tres actos de Lope de Vega sobre dos hermanas muy distintas: Nise, culta y presumida, y Finea, tenida por simple. Su padre ofrece una dote a cada una, y el amor y el interés mueven a los pretendientes. A medida que avanza la historia, el amor despierta en Finea una inteligencia que nadie había notado. Es una de las comedias más celebradas de Lope por su humor y por su retrato de la educación y de la discreción."},
      porque: {"es":"Una comedia para sonreír, con un fondo que anima: el amor puede despertar en una persona capacidades que nadie, ni ella misma, sospechaba. Resulta útil para quien se siente subestimado y para quien tiende a juzgar a los demás por su fama de torpes.","en":"A comedy for smiling, with an encouraging core: love can awaken in a person abilities that nobody, herself included, suspected. It helps those who feel underestimated and those who tend to judge others by their reputation for being slow."},
      imagen: {"src": "img/portadas/lope-de-vega-la-dama-boba.jpg", "credito": {"es": "Bartolomé Esteban Murillo, «Dos mujeres en una ventana», siglo XVII", "en": "Bartolomé Esteban Murillo, “Two Women at a Window”, 17th century"}, "url": "https://commons.wikimedia.org/wiki/File:Bartolom%C3%A9_Esteban_Perez_Murillo_014FXD.jpg"},
      citas: [
        "Amor, señores, ha sido / aquel ingenio profundo, / que llaman alma del mundo, / y es el dotor que ha tenido / la cátedra de las ciencias; / porque solo con amor / aprende el hombre mejor / sus divinas diferencias.",
        "Amor con fuerza süave / dio al hombre el saber sentir, / dio leyes para vivir / político, honesto y grave. / Amor repúblicas hizo; / que la concordia nació / de amor, con que a ser volvió / lo que la guerra deshizo.",
        "Ya no es menester hacellos / para saber murmurallos; / que se atreve a censurallos / quien no se atreve a entendellos.",
        "Que aquí, para los discretos, / da fin La comedia boba."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/La_dama_boba"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=La_dama_boba"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=La_dama_boba"}],
      fuente: {"texto": "Transcripción de es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/La_dama_boba"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-dama-boba"},
      parecidos: ["lope-de-vega-amor-pleito-y-desafio", "lope-de-vega-arte-nuevo-de-hacer-comedias", "lope-de-vega-ay-verdades-que-en-amor"]
    },
    {
      id: "cervantes-viaje-al-parnaso",
      titulo: "Viaje al Parnaso",
      autor: "Miguel de Cervantes",
      anio: "1614",
      idioma: "es",
      categoria: "poesia",
      recomendado: false,
      resumen: {"es": "Poema alegórico en ocho capítulos en el que Cervantes emprende un viaje imaginario hacia el monte Parnaso para defender la causa de los buenos poetas. En el camino pasa revista, con ironía y afecto, a los poetas de su época y a sus propios méritos y desengaños. El volumen de esta edición incluye también la tragedia La Numancia y la comedia El trato de Argel. Es un retrato personal del mundo literario del Siglo de Oro."},
      porque: {"es":"Para quien ya conoce el Quijote y quiere oír a Cervantes hablar de sí mismo, de sus colegas y de sus desengaños, con ironía y sin amargura. Sirve a quien gusta de la vida literaria de otra época. El tomo trae además dos piezas de teatro, que amplían la mirada sobre su obra.","en":"For readers who already know Don Quixote and want to hear Cervantes speak about himself, his colleagues and his disappointments, with irony and without bitterness. It suits anyone who enjoys the literary life of another age. The volume also includes two plays, which widen the view of his work."},
      imagen: {"src": "img/portadas/cervantes-viaje-al-parnaso.jpg", "credito": {"es": "Rafael Sanzio, «El Parnaso», 1511", "en": "Raphael, “The Parnassus”, 1511"}, "url": "https://commons.wikimedia.org/wiki/File:Raphael_-_The_Parnassus.jpg"},
      citas: [
        "Yo, que siempre trabajo y me desvelo / por parecer que tengo de poeta / la gracia que no quiso darme el cielo",
        "Yo corté con mi ingenio aquel vestido / con que al mundo la hermosa Galatea / salió para librarse del olvido.",
        "Yo he dado en Don Quijote pasatiempo / al pecho melancólico y mohíno / en cualquiera sazón, en todo tiempo.",
        "Yo he abierto en mis Novelas un camino / por do la lengua castellana puede / mostrar con propiedad un desatino.",
        "Nunca voló la pluma humilde mía / por la región satírica, bajeza / que a infames premios y desgracias guía."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/16110.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/16110"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 16110 (edición de Antonio de Sancha, Madrid, 1784; dominio público)", "url": "https://www.gutenberg.org/ebooks/16110"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/viaje-al-parnaso"},
      parecidos: ["cervantes-don-quijote", "cervantes-el-trato-de-argel", "cervantes-novelas-ejemplares"]
    },
    {
      id: "lope-de-vega-el-perro-del-hortelano",
      titulo: "El perro del hortelano",
      autor: "Lope de Vega",
      anio: "1618",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia en tres actos de Lope de Vega ambientada en Nápoles. La condesa Diana, enamorada de su secretario Teodoro, no se atreve a confesarlo por su rango, y tampoco quiere verlo con otra. Entre celos, cartas y enredos de criados, la historia juega con el orgullo, el deseo y las convenciones sociales. El título alude al refrán del perro que ni come ni deja comer."},
      porque: {"es":"Se lee con gusto y con cierto reconocimiento, porque retrata la persona que ni quiere ni deja querer por orgullo. Es una comedia de diálogo vivo, buena para quien teme leer clásicos: todo es cercano, y el que sabe reírse de sí mismo aprende más.","en":"It reads with pleasure and a touch of recognition, because it portrays the person who neither wants nor allows wanting, out of pride. It is a comedy of lively dialogue, good for anyone wary of the classics: everything is close at hand, and whoever can laugh at himself learns more."},
      imagen: {"src": "img/portadas/lope-de-vega-el-perro-del-hortelano.jpg", "credito": {"es": "Francisco de Goya, «El perro» (Pinturas negras), 1820-1823", "en": "Francisco de Goya, “The Dog” (Black Paintings), 1820-1823"}, "url": "https://commons.wikimedia.org/wiki/File:Goya_Dog.jpg"},
      citas: [
        "No dudes, naturalmente / es del hortelano el perro: / ni come ni comer deja, / ni está fuera ni está dentro.",
        "Es el amor común naturaleza; / mas yo tengo mi honor por más tesoro, / que los respetos de quien soy adoro, / y aun el pensarlo tengo por bajeza.",
        "porque quisiera yo que, por lo menos, / Teodoro fuera más, para igualarme, / o yo, para igualarle, fuera menos.",
        "Ni me dejo forzar ni me defiendo; / darme quiero a entender sin decir nada: / entiéndame quien puede; yo me entiendo."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El_perro_del_hortelano"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El_perro_del_hortelano"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El_perro_del_hortelano"}],
      fuente: {"texto": "Transcripción de es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/El_perro_del_hortelano"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-perro-del-hortelano"},
      parecidos: ["lope-de-vega-amor-pleito-y-desafio", "lope-de-vega-arte-nuevo-de-hacer-comedias", "lope-de-vega-ay-verdades-que-en-amor"]
    },
    {
      id: "lope-de-vega-el-vellocino-de-oro",
      titulo: "El vellocino de oro",
      autor: "Lope de Vega",
      anio: "1620",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia mitológica de Lope de Vega, precedida de una loa, sobre la expedición de los argonautas al reino de Colcos. Jasón y sus compañeros, entre ellos Teseo, buscan el vellocino de oro, y en la aventura conocen a la hechicera Medea. La obra mezcla personajes de la mitología, entre ellos el dios Marte, con la música y la vistosidad de una fiesta cortesana. Muestra cómo el teatro del Siglo de Oro recogió los mitos clásicos."},
      porque: {"es":"Una puerta al mundo mitológico tal como lo veía el teatro del Siglo de Oro, con ánimo de espectáculo. Sirve a quien conoce la historia de los argonautas y quiere verla pasar por la mirada de un español del siglo XVII, más pendiente de la fiesta que de la erudición.","en":"A doorway into the mythological world as the Golden Age stage saw it, with an eye to spectacle. It suits readers who know the story of the Argonauts and want to see it through the eyes of a seventeenth-century Spaniard, more attentive to pageantry than to scholarship."},
      imagen: {"src": "img/portadas/lope-de-vega-el-vellocino-de-oro.jpg", "credito": {"es": "John William Waterhouse, «Jasón y Medea», 1907", "en": "John William Waterhouse, “Jason and Medea”, 1907"}, "url": "https://commons.wikimedia.org/wiki/File:Jason_and_Medea_-_John_William_Waterhouse.jpg"},
      citas: [
        "No hay sirena en mar, ni en fuente / ninfa, que no tenga amor. / No hay pez en el mar profundo / que no tenga sentimiento: / amor es un elemento / en que se conserva el mundo.",
        "Contra quien ayuda Dios, / cánsase la envidia necia; / que cuando hubiera fortuna, / Dios gobernará su rueda.",
        "en los reinos reinan / todos los reyes, / en las almas solo / quien los merece"
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El_vellocino_de_oro"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El_vellocino_de_oro"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El_vellocino_de_oro"}],
      fuente: {"texto": "Transcripción de es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/El_vellocino_de_oro"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-vellocino-de-oro-0"},
      parecidos: ["lope-de-vega-amor-pleito-y-desafio", "lope-de-vega-arte-nuevo-de-hacer-comedias", "lope-de-vega-ay-verdades-que-en-amor"]
    },
    {
      id: "tirso-de-molina-el-caballero-de-gracia",
      titulo: "El caballero de Gracia",
      autor: "Tirso de Molina",
      anio: "1620",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia en tres actos de Tirso de Molina sobre Jacobo de Gratis, el Caballero de Gracia, figura de la corte de Felipe II en Madrid. Reacio al matrimonio que su cuñado le propone, se entrega a la caridad y a proyectos piadosos que lo enfrentan con autoridades y con quienes miran con recelo su celo. Con humor, la obra mezcla la vida de la corte, sus enredos y su devoción. Hacia el final promete una segunda parte para seguir contando sus hechos."},
      porque: {"es":"Una comedia distinta para su época: el protagonista no conquista a nadie, sino que se entrega a los pobres y a la oración, y por eso choca con quienes lo rodean. Se basa en la vida real de Jacobo de Gratis, que llegó a sacerdote; Tirso se toma licencias históricas, pero acierta en el humor y en los versos. Léela si buscas una mirada amable y sin sermones sobre la santidad en medio de la ciudad.","en":"A comedy unlike most of its time: the hero wins no one over, but gives himself to the poor and to prayer, and that sets him at odds with those around him. It is based on the real Jacobo de Gratis, who became a priest; Tirso takes historical liberties, but his humour and verse are excellent. Read it if you want a kind, sermon-free look at holiness lived in the middle of the city."},
      imagen: {"src": "img/portadas/tirso-de-molina-el-caballero-de-gracia.jpg", "credito": {"es": "El Greco, «El caballero de la mano en el pecho», c. 1580", "en": "El Greco, “The Nobleman with his Hand on his Chest”, c. 1580"}, "url": "https://commons.wikimedia.org/wiki/File:The_Nobleman_with_his_hand_on_his_chest,_by_El_Greco_(Museo_del_Prado,_Madrid).jpg"},
      citas: [
        "Puesto que de más estima es la virtud que la sangre.",
        "Poco precia, mi Conrado, el oro quien no conoce el hierro y el acero. Quien nunca empobreció no ama el tesoro.",
        "Si de estos extremos dos quieres hallar el remedio, la virtud consiste en medio.",
        "Pues aunque se suba al cielo Amor, porque todo es alas, cuando son de oro las alas cualquiera le alcanza el vuelo."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El_caballero_de_gracia"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El_caballero_de_gracia"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El_caballero_de_gracia"}],
      fuente: {"texto": "Transcripción de es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/El_caballero_de_gracia"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-caballero-de-gracia"},
      parecidos: ["tirso-el-burlador-de-sevilla", "lope-de-vega-el-vellocino-de-oro", "lope-de-vega-amor-pleito-y-desafio"]
    },
    {
      id: "lope-de-vega-amor-pleito-y-desafio",
      titulo: "Amor, pleito y desafío",
      autor: "Lope de Vega",
      anio: "1621",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia en tres actos de Lope de Vega. Don Juan de Padilla ama a doña Beatriz, hija del anciano don Álvaro de Rojas, que lo recibe en su casa con ira y desconfianza. El rey don Alfonso interviene en el asunto, y entre el pleito que se entabla y el desafío que se anuncia, el galán tendrá que defender su honra y su amor. Los criados acompañan y comentan la acción con su gracia."},
      porque: {"es":"Para el lector que disfruta de la comedia de honor con espadas, cartas y un padre testarudo. Se lee rápido, con la gracia de los criados, y muestra cómo el amor y el orgullo de familia chocan en una mesa donde ninguno quiere ceder primero.","en":"For the reader who enjoys a comedy of honor with swords, letters and a stubborn father. It reads quickly, with the charm of the servants, and shows how love and family pride collide at a table where nobody wants to give way first."},
      imagen: {"src": "img/portadas/lope-de-vega-amor-pleito-y-desafio.jpg", "credito": {"es": "Jean-Léon Gérôme, «El duelo tras la mascarada», 1857-1859", "en": "Jean-Léon Gérôme, “The Duel After the Masquerade”, 1857-1859"}, "url": "https://commons.wikimedia.org/wiki/File:Jean-L%C3%A9on_G%C3%A9r%C3%B4me_-_The_Duel_After_the_Masquerade_-_Walters_3751.jpg"},
      citas: [
        "Nunca los reyes largos prólogos emplean en lo que mandan y es justo.",
        "Mas ¡qué locuras el amor concierta! / ¡Qué de doncellas con mentiras casa! / ¡Qué de tormentas son después espumas! / ¡Qué de ansias, hielos, y palabras, plumas!",
        "Mal hayan los celos, / bien hayan las paces.",
        "Aquí, senado, se acaban / Amor, pleito y desafío, / si perdonáis nuestras faltas."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Amor,_pleito_y_desaf%C3%ADo"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Amor%2C_pleito_y_desaf%C3%ADo"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Amor%2C_pleito_y_desaf%C3%ADo"}],
      fuente: {"texto": "Transcripción de es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/Amor,_pleito_y_desaf%C3%ADo"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/amor-pleito-y-desafio"},
      parecidos: ["lope-de-vega-arte-nuevo-de-hacer-comedias", "lope-de-vega-ay-verdades-que-en-amor", "lope-de-vega-el-perro-del-hortelano"]
    },
    {
      id: "calderon-amor-honor-y-poder",
      titulo: "Amor, honor y poder",
      autor: "Pedro Calderón de la Barca",
      anio: "1623",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia en tres jornadas, considerada la primera de Calderón de la Barca que se conoce, y basada en una leyenda inglesa sobre un rey y una dama a la que desea. Estela vive retirada en el campo, lejos de las miradas de la corte, hasta que el rey la ve durante una cacería. Su hermano Enrico y el resto de la familia deben proteger el honor frente al poder del monarca. El título resume los tres impulsos que se enfrentan a lo largo de la obra."},
      porque: {"es":"Sirve para ver a Calderón en sus comienzos, antes de las obras que lo hicieron famoso, con los temas que lo acompañarían toda la vida. Es una lectura útil para quien quiere seguir el trabajo de un autor y entender cuánto pesaban el honor y la lealtad al rey.","en":"It lets you see the author at his beginnings, before the plays that made him famous, with the themes that would stay with him all his life. A useful read for anyone who wants to follow a writer's development and understand how heavily honor and loyalty to the king weighed."},
      imagen: {"src": "img/portadas/calderon-amor-honor-y-poder.jpg", "credito": {"es": "Pedro de Villafranca, «Retrato de Pedro Calderón de la Barca», 1676", "en": "Pedro de Villafranca, “Portrait of Pedro Calderón de la Barca”, 1676"}, "url": "https://commons.wikimedia.org/wiki/File:Villafranca-Retrato_de_Pedro_Calder%C3%B3n_de_la_Barca-BNE.jpg"},
      citas: [
        "¿Para cuándo es la lealtad / sino cuando es menester / saberse un hombre vencer?",
        "Ojos, lengua, deteneos, / basta la ocasión, deseos, / que hay lealtad donde hay nobleza.",
        "La esperanza en el amor / es un dorado veneno, / puñal de hermosuras lleno, / que hiere y mata en rigor.",
        "Esta es la industria contra la fuerza / y el honor contra el poder.",
        "porque a tus plantas puesto, / poder, amor y honor den fin con esto."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Amor,_honor_y_poder"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Amor%2C_honor_y_poder"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Amor%2C_honor_y_poder"}],
      fuente: {"texto": "Edición de 1744 transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/Amor,_honor_y_poder"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/amor-honor-y-poder"},
      parecidos: ["calderon-casa-con-dos-puertas", "calderon-el-alcalde-de-zalamea", "calderon-el-gran-teatro-del-mundo"]
    },
    {
      id: "lope-de-vega-ay-verdades-que-en-amor",
      titulo: "¡Ay, verdades, que en amor!",
      autor: "Lope de Vega",
      anio: "1625",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia de capa y espada en tres actos de Lope de Vega. Don Juan, un galán de lengua ingeniosa, sigue por la calle a Celia, una dama que se oculta bajo el manto, e intenta ganarla con sus argumentos. De ahí nace una cadena de equívocos entre galanes, damas y criados, con los sentimientos reales siempre un paso detrás de lo que se dice. El gracioso Martín aporta el contrapunto cómico."},
      porque: {"es":"Una comedia de ingenio para quien disfruta del juego de palabras. Entre disfraces y malentendidos plantea algo muy actual: lo que decimos para seducir rara vez coincide con lo que sentimos, y las verdades en amor, como dice el título, duelen a quien las oye.","en":"A comedy of wit for anyone who enjoys wordplay. Among disguises and misunderstandings it raises something very current: what we say to charm rarely matches what we feel, and truths spoken in love, as the title hints, sting the one who hears them."},
      imagen: {"src": "img/portadas/lope-de-vega-ay-verdades-que-en-amor.jpg", "credito": {"es": "Diego Velázquez, «La dama del abanico», c. 1635-1640", "en": "Diego Velázquez, “The Lady with a Fan”, c. 1635-1640"}, "url": "https://commons.wikimedia.org/wiki/File:La_dama_del_abanico,_por_Diego_Vel%C3%A1zquez.jpg"},
      citas: [
        "Martín, cuando celos hablan / muy lindas verdades dicen, / que es vino que no las calla.",
        "Es condición del Amor / pesarle de ver alegre / lo que ama, que querría / que siempre triste estuviese.",
        "Temo el tenerle afición, / que una larga sinrazón / el mayor amor enfría.",
        "No soy la Celia que fui, / sino la Celia que ves."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Ay,_verdades,_que_en_amor"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Ay%2C_verdades%2C_que_en_amor"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Ay%2C_verdades%2C_que_en_amor"}],
      fuente: {"texto": "Transcripción de es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/Ay,_verdades,_que_en_amor"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/ay-verdades-que-en-amor"},
      parecidos: ["lope-de-vega-amor-pleito-y-desafio", "lope-de-vega-arte-nuevo-de-hacer-comedias", "lope-de-vega-el-perro-del-hortelano"]
    },
    {
      id: "calderon-el-principe-constante",
      titulo: "El príncipe constante",
      autor: "Pedro Calderón de la Barca",
      anio: "1629",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Drama histórico sobre el infante don Fernando de Portugal, que tras el fracaso de la expedición a Tánger cae prisionero del rey de Fez. Los moros le ofrecen la libertad a cambio de entregar la plaza de Ceuta, y el infante rechaza el trato aun a costa de su propia vida. Entre la corte mora, la lealtad de sus compañeros y la figura de Fénix, la obra pone a prueba qué significa mantenerse constante en la fe y en el deber."},
      porque: {"es":"Para quien quiere ver la fortaleza llevada hasta el final, sin gestos de héroe de cartón. Don Fernando sufre y no cede, y el lector queda pensando qué cosas valen más que la libertad propia, y qué se puede sostener cuando ya no queda nada que perder.","en":"For anyone who wants to see fortitude carried to the end, without cardboard heroics. The prince suffers and does not yield, and the reader is left thinking about what is worth more than one's own freedom, and what can be sustained when there is nothing left to lose."},
      imagen: {"src": "img/portadas/calderon-el-principe-constante.jpg", "credito": {"es": "Wenceslaus Hollar, «Tánger visto desde el este», siglo XVII", "en": "Wenceslaus Hollar, “Tangier from the East”, 17th century"}, "url": "https://commons.wikimedia.org/wiki/File:Wenceslas_Hollar_-_Tangier_from_the_E._(State_2).jpg"},
      citas: [
        "Estas, que fueron pompas y alegría / despertando el albor de la mañana, / a la tarde serán lástima vana / durmiendo en brazos de la noche fría.",
        "A florecer las rosas madrugaron / y para envejecerse florecieron: / cuna y sepulcro en un botón hallaron. / Tales los hombres sus fortunas vieron: / en un día nacieron y espiraron, / que pasados los siglos horas fueron.",
        "que en un ánimo constante / siempre se halla igual semblante / para el bien y el mal."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El_pr%C3%ADncipe_constante"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El_pr%C3%ADncipe_constante"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El_pr%C3%ADncipe_constante"}],
      fuente: {"texto": "Transcripción de es.wikisource.org; la página no identifica la edición (dominio público)", "url": "https://es.wikisource.org/wiki/El_pr%C3%ADncipe_constante"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-principe-constante"},
      parecidos: ["calderon-amor-honor-y-poder", "calderon-casa-con-dos-puertas", "calderon-el-alcalde-de-zalamea"]
    },
    {
      id: "calderon-la-dama-duende",
      titulo: "La dama duende",
      autor: "Pedro Calderón de la Barca",
      anio: "1629",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia de capa y espada ambientada en Madrid. Doña Ángela, una joven viuda a quien sus hermanos mantienen recluida, descubre que una puerta disimulada comunica su cuarto con el de don Manuel, huésped de la casa, y se vale de ella para entrar y salir sin ser vista. Don Manuel y su criado Cosme, a quienes empiezan a aparecer y desaparecer objetos y cartas, creen que los visita un duende. La obra enreda equívocos, celos y ocultamientos con mucho humor."},
      porque: {"es":"Una comedia redonda, entretenida de principio a fin, para quien quiere conocer a Calderón en versión ligera. La ingeniosa Ángela muestra cómo se defiende la libertad dentro de una casa que la encierra, y el humor de Cosme alivia hasta al lector cansado.","en":"A well-rounded comedy, entertaining from start to finish, for anyone who wants to meet the author in a lighter vein. Its clever heroine shows how freedom is defended inside a house that confines her, and the servant's humor eases even a tired reader."},
      imagen: {"src": "img/portadas/calderon-la-dama-duende.jpg", "credito": {"es": "Godfried Schalcken, «Muchacha con una vela», c. 1670-1675", "en": "Godfried Schalcken, “Young Girl with a Candle”, c. 1670-1675"}, "url": "https://commons.wikimedia.org/wiki/File:Godfried_Schalcken_-_Young_Girl_with_a_Candle_-_WGA20944.jpg"},
      citas: [
        "¡Qué gran músico es el miedo!",
        "Las grandes dificultades hasta saberse lo son, que sabido, todo es fácil.",
        "Bien como el sol cuando esparce bellos rayos, que una flor se marchita y otra nace."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/La_dama_duende"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=La_dama_duende"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=La_dama_duende"}],
      fuente: {"texto": "Transcripción de es.wikisource.org; la página no identifica la edición (dominio público)", "url": "https://es.wikisource.org/wiki/La_dama_duende"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-dama-duende"},
      parecidos: ["calderon-amor-honor-y-poder", "calderon-casa-con-dos-puertas", "calderon-el-alcalde-de-zalamea"]
    },
    {
      id: "tirso-el-burlador-de-sevilla",
      titulo: "El burlador de Sevilla",
      autor: "Tirso de Molina",
      anio: "1630",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia que dio origen a la leyenda de don Juan Tenorio, el joven noble que se vale de engaños, disfraces y falsas promesas para seducir a mujeres de toda condición, desde una duquesa napolitana hasta una pescadora y una novia en vísperas de boda. Lo acompañan su criado Catalinón, que lo reprueba sin atreverse a dejarlo, y el rey, los padres y los novios burlados. La obra plantea qué ocurre con quien confía en que siempre habrá tiempo para arrepentirse."},
      porque: {"es":"Es el origen de un mito, y leerlo de primera mano da una sorpresa: el seductor no es un romántico, sino un hombre que juega con la palabra dada y cree que siempre habrá tiempo. Sirve para pensar en la responsabilidad que viene con lo que se promete.","en":"This is the origin of a myth, and reading it first-hand brings a surprise: the seducer is no romantic but a man who plays with his given word and believes there will always be time. It is good for thinking about the responsibility that comes with what we promise."},
      imagen: {"src": "img/portadas/tirso-el-burlador-de-sevilla.jpg", "credito": {"es": "Eugène Delacroix, «El naufragio de don Juan», 1840", "en": "Eugène Delacroix, “The Shipwreck of Don Juan”, 1840"}, "url": "https://commons.wikimedia.org/wiki/File:Don_Juan_by_Eugène_Delacroix.jpg"},
      citas: [
        "¡Qué largo me lo fiáis!",
        "Advierte, mi bien, que hay Dios y que hay muerte.",
        "Los que fingís y engañáis las mujeres de esa suerte, lo pagaréis en la muerte.",
        "Ésta es justicia de Dios: quien tal hace, que tal pague."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El_burlador_de_Sevilla"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El_burlador_de_Sevilla"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El_burlador_de_Sevilla"}],
      fuente: {"texto": "Transcripción de es.wikisource.org; la página no identifica la edición (dominio público)", "url": "https://es.wikisource.org/wiki/El_burlador_de_Sevilla"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-burlador-de-sevilla"},
      parecidos: ["tirso-de-molina-el-caballero-de-gracia", "calderon-el-principe-constante", "calderon-la-dama-duende"]
    },
    {
      id: "lope-el-castigo-sin-venganza",
      titulo: "El castigo sin venganza",
      autor: "Lope de Vega",
      anio: "1631",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Tragedia ambientada en la corte de Ferrara. El duque, tras una vida disipada, se casa con la joven Casandra, y esta y el conde Federico, hijo natural del duque, comienzan a sentir una inclinación que ninguno de los dos debería permitirse. Lope, ya al final de su carrera, construye una obra de honor, culpa y razón de Estado, en la que el duque debe decidir cómo actuar cuando descubre lo que ocurre en su casa."},
      porque: {"es":"Para el lector que busca algo más hondo que una comedia de enredos, y que acepta una historia dura. Lope, ya maduro, pone ante nosotros lo que ocurre cuando el deber público pasa por encima de los afectos, y deja la pregunta sobre dónde acaba la justicia.","en":"For the reader who looks for something deeper than a comedy of intrigue and is ready for a hard story. The author, by then mature, sets before us what happens when public duty overrides affection, and leaves the question of where justice ends."},
      imagen: {"src": "img/portadas/lope-el-castigo-sin-venganza.jpg", "credito": {"es": "Battista Dossi, «Retrato de Alfonso I de Este, duque de Ferrara», h. 1534-1536", "en": "Battista Dossi, “Portrait of Alfonso I d’Este, Duke of Ferrara”, c. 1534-1536"}, "url": "https://commons.wikimedia.org/wiki/File:Portrait_of_Alfonso_I_d'Este,_Duke_of_Ferrara_(1476%E2%80%931534),_by_Battista_Dossi.jpg"},
      citas: [
        "Que aunque parece defensa / de la honra el desagravio, / no deja de ser agravio / cuando se sabe la ofensa.",
        "Señor, no uséis del poder, que amor es gusto y no ha de forzarse.",
        "¿Qué quieres, amor? ¿No ves que Dios a los hijos manda honrar los padres, y el Conde su mandamiento quebranta?"
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El_castigo_sin_venganza"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El_castigo_sin_venganza"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El_castigo_sin_venganza"}, {"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/78160.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/78160"}],
      fuente: {"texto": "Transcripción de es.wikisource.org; la página no identifica la edición (dominio público)", "url": "https://es.wikisource.org/wiki/El_castigo_sin_venganza"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-castigo-sin-venganza"},
      parecidos: ["lope-de-vega-amor-pleito-y-desafio", "lope-de-vega-arte-nuevo-de-hacer-comedias", "lope-de-vega-ay-verdades-que-en-amor"]
    },
    {
      id: "calderon-casa-con-dos-puertas",
      titulo: "Casa con dos puertas, mala es de guardar",
      autor: "Pedro Calderón de la Barca",
      anio: "1632",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia de capa y espada situada en Madrid, donde dos damas, Marcela y Laura, y sus galanes Lisardo y don Félix se ven envueltos en un laberinto de embozos, billetes, celos y equívocos. El título alude a una casa con dos entradas, que facilita los encuentros secretos y complica la vigilancia del honor. Con criados graciosos y un enredo que se tensa acto tras acto, es una de las comedias más celebradas del género."},
      porque: {"es":"Una comedia de ritmo, buena para quien quiere entrar al teatro áureo por su lado más festivo. Se disfruta como un juego de relojería, y deja ver cómo era la vida de las damas y los galanes de una ciudad donde cada puerta, cada billete y cada manto escondían algo.","en":"A comedy with rhythm, good for anyone who wants to enter Golden Age theater through its most festive door. It is enjoyed like clockwork, and it shows what life was like for the ladies and gentlemen of a city where every door, note and veil hid something."},
      imagen: {"src": "img/portadas/calderon-casa-con-dos-puertas.jpg", "credito": {"es": "Pedro Teixeira Albernaz, «Topographia de la Villa de Madrid» (detalle), 1656", "en": "Pedro Teixeira Albernaz, “Topographia de la Villa de Madrid” (detail), 1656"}, "url": "https://commons.wikimedia.org/wiki/File:Teixeira_-_Topographia_de_la_Villa_de_Madrid_1656.jpg"},
      citas: [
        "Si una casa con dos puertas / mala es de guardar, repara / que peor de guardar será / con dos puertas una sala.",
        "pues no soy de los amigos / yo, con quien solo se hablan / las cosas; que precio más / las obras que las palabras.",
        "Que donde hay celos se acaba / todo, porque no hay honor / ni amistad que tanto valga."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Casa_con_dos_puertas,_mala_es_de_guardar"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Casa_con_dos_puertas%2C_mala_es_de_guardar"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Casa_con_dos_puertas%2C_mala_es_de_guardar"}],
      fuente: {"texto": "Transcripción de es.wikisource.org; la página no identifica la edición (dominio público)", "url": "https://es.wikisource.org/wiki/Casa_con_dos_puertas,_mala_es_de_guardar"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/casa-con-dos-puertas-mala-es-de-guardar"},
      parecidos: ["calderon-amor-honor-y-poder", "calderon-el-alcalde-de-zalamea", "calderon-el-gran-teatro-del-mundo"]
    },
    {
      id: "lope-la-gatomaquia",
      titulo: "La gatomaquia",
      autor: "Lope de Vega",
      anio: "1634",
      idioma: "es",
      categoria: "poesia",
      recomendado: false,
      resumen: {"es": "Poema épico burlesco en siete silvas que cuenta, con el tono grave de la épica clásica, los amores y rivalidades de un grupo de gatos. El valiente Marramaquiz pretende a la gata Zapaquilda, que también es cortejada por el rival Micifuf, y la disputa se resuelve entre serenatas, tejados y batallas. Lope parodia la épica italiana y la literatura caballeresca con humor, erudición y mucha gracia."},
      porque: {"es":"Para quien quiere sonreír con la literatura sin que nadie lo apure. Lope toma la solemnidad de la épica y la pone al servicio de unos gatos enamorados, y el contraste hace reír. Es breve, ideal para un descanso entre lecturas más serias o para acercar a un lector joven al verso clásico.","en":"For anyone who wants to smile over a book with no pressure. Lope takes the solemnity of epic and puts it at the service of lovesick cats, and the contrast is funny. It is short, ideal as a break between more serious reading or as a way to introduce a young reader to classical verse."},
      imagen: {"src": "img/portadas/lope-la-gatomaquia.jpg", "credito": {"es": "Francisco de Goya, «Riña de gatos», 1786-1787", "en": "Francisco de Goya, “Cats Fighting”, 1786-1787"}, "url": "https://commons.wikimedia.org/wiki/File:Riña_de_gatos.jpg"},
      citas: [
        "que no hay para olvidar amor remedio / como otro nuevo amor, o tierra en medio.",
        "¡Oh celos!, si entre gatos, / de burlas y de veras, / formáis tales quimeras, / ¿qué haréis entre los hombres / de hidalgo proceder y honrados nombres?",
        "¡Bien haya quien desprecia / esta fábula necia / de honores, pretensiones y lugares, / por estudios o acciones militares!"
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/La_Gatomaquia"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=La_Gatomaquia"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=La_Gatomaquia"}],
      fuente: {"texto": "Transcripción de es.wikisource.org; la página no identifica la edición (dominio público)", "url": "https://es.wikisource.org/wiki/La_Gatomaquia"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-gatomaquia"},
      parecidos: ["lope-de-vega-amor-pleito-y-desafio", "lope-de-vega-arte-nuevo-de-hacer-comedias", "lope-de-vega-ay-verdades-que-en-amor"]
    },
    {
      id: "calderon-el-medico-de-su-honra",
      titulo: "El médico de su honra",
      autor: "Pedro Calderón de la Barca",
      anio: "1635",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Drama de honor ambientado en la Sevilla del rey don Pedro. Don Gutierre, casado con doña Mencía, empieza a sospechar de ella cuando hay indicios de que el infante don Enrique frecuenta su casa, y esa duda lo lleva a tomar decisiones graves, mientras el rey observa y actúa. Calderón examina el código del honor y sus costos, y muestra cómo la sospecha y la reputación pueden más que la verdad."},
      porque: {"es":"Una obra dura que no pide aplauso para su protagonista, sino reflexión. Sirve para entender cómo una sospecha sin pruebas, unida a la presión social, puede conducir a un hombre a un acto terrible, y por qué esa lógica del qué dirán sigue a la vista.","en":"A harsh play that asks for reflection rather than applause for its protagonist. It helps one understand how an unproven suspicion, joined to social pressure, can lead a man to a terrible act, and why that logic of what others will say is still around us."},
      imagen: {"src": "img/portadas/calderon-el-medico-de-su-honra.jpg", "credito": {"es": "Germán Hernández Amores, «Pedro I de Castilla», 1849", "en": "Germán Hernández Amores, “Peter I of Castile”, 1849"}, "url": "https://commons.wikimedia.org/wiki/File:Pedro_I_de_Castilla_(Museo_del_Prado).jpg"},
      citas: [
        "Pues no hay virtud sin experiencia. Perfeto está el oro en el crisol, el imán en el acero, el diamante en el diamante, los metales en el fuego; y así mi honor en sí mismo se acrisola, cuando llego a vencerme.",
        "El honor es reservado lugar, donde el alma asiste; yo no soy rey de las almas.",
        "Médico de mi honra me llamo, pues procuro mi deshonra curar."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El_m%C3%A9dico_de_su_honra"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El_m%C3%A9dico_de_su_honra"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El_m%C3%A9dico_de_su_honra"}],
      fuente: {"texto": "Transcripción de es.wikisource.org; la página no identifica la edición (dominio público)", "url": "https://es.wikisource.org/wiki/El_m%C3%A9dico_de_su_honra"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-medico-de-su-honra"},
      parecidos: ["calderon-amor-honor-y-poder", "calderon-casa-con-dos-puertas", "calderon-el-alcalde-de-zalamea"]
    },
    {
      id: "calderon-el-gran-teatro-del-mundo",
      titulo: "El gran teatro del mundo",
      autor: "Pedro Calderón de la Barca",
      anio: "1636",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Auto sacramental alegórico en que el Autor, que representa a Dios, convoca a los personajes del mundo para representar una comedia en el gran teatro de la vida. El Rey, la Discreción, la Hermosura, el Rico, el Labrador y el Pobre reciben sus papeles y los interpretan según su libertad, bajo la mirada del Mundo y la Ley de Gracia. La obra reflexiona sobre la fugacidad de la vida y el valor de obrar bien, y se acompaña de una loa."},
      porque: {"es":"Un texto corto para quien quiere pensar el sentido de su papel en la vida. Plantea con sencillez que cada uno recibe su parte y responde por cómo la representa, no por si le tocó ser rey o labrador, y esa idea consuela y exige a la vez.","en":"A short text for anyone who wants to think about the meaning of his part in life. It states simply that each person receives a role and answers for how he plays it, not for whether he was cast as king or farmer, and that idea both consoles and demands."},
      imagen: {"src": "img/portadas/calderon-el-gran-teatro-del-mundo.jpg", "credito": {"es": "Peter Paul Rubens, «Victoria de la Eucaristía sobre el paganismo» (boceto), siglo XVII", "en": "Peter Paul Rubens, “Victory of the Eucharist over Paganism” (modello), 17th century"}, "url": "https://commons.wikimedia.org/wiki/File:Victory_of_the_Eucharist_over_Paganism_-_modello.jpg"},
      citas: [
        "Obrar bien, que Dios es Dios.",
        "Con cualquier papel se gana, que toda la vida humana representaciones es. Y la comedia acabada ha de cenar a mi lado el que haya representado, sin haber errado en nada, su parte más acertada; allí igualaré a los dos.",
        "Solo no vestiré al pobre porque es papel de desnudo, porque ninguno después se queje de que no tuvo para hacer bien su papel todo el adorno que pudo, pues el que bien no le hiciere será por defecto suyo, no mío."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El_Gran_Teatro_del_Mundo"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El_Gran_Teatro_del_Mundo"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El_Gran_Teatro_del_Mundo"}],
      fuente: {"texto": "Transcripción de es.wikisource.org; la página no identifica la edición (dominio público)", "url": "https://es.wikisource.org/wiki/El_Gran_Teatro_del_Mundo"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-gran-teatro-del-mundo"},
      parecidos: ["calderon-amor-honor-y-poder", "calderon-casa-con-dos-puertas", "calderon-el-alcalde-de-zalamea"]
    },
    {
      id: "calderon-la-vida-es-sueno",
      titulo: "La vida es sueño",
      autor: "Pedro Calderón de la Barca",
      anio: "1636",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Segismundo, príncipe de Polonia, ha vivido encerrado en una torre desde su nacimiento porque su padre, el rey Basilio, leyó en los astros que sería un tirano. Cuando el rey decide ponerlo a prueba, el joven pasa de la prisión a palacio y de allí a una nueva incertidumbre sobre lo real y lo soñado. Entre la intriga de Rosaura, Astolfo y Estrella, Calderón reflexiona sobre el destino, la libertad y el obrar bien."},
      porque: {"es":"Es la obra para quien alguna vez dudó de si lo que vive es real, o si merece la pena obrar bien aunque todo pase. Segismundo aprende a actuar con juicio ante lo incierto, y esa respuesta, dada hace siglos, sigue sirviendo a quien se siente perdido.","en":"The play for anyone who has ever doubted whether what he lives is real, or whether it is worth doing right when everything passes. The prince learns to act with judgment in the face of uncertainty, and that answer, given centuries ago, still serves those who feel lost."},
      imagen: {"src": "img/portadas/calderon-la-vida-es-sueno.jpg", "credito": {"es": "Caspar David Friedrich, «Mañana en el Riesengebirge», 1810-1811", "en": "Caspar David Friedrich, “Morning in the Riesengebirge”, 1810-1811"}, "url": "https://commons.wikimedia.org/wiki/File:Caspar_David_Friedrich,_Morgen_im_Riesengebirge.jpg"},
      citas: [
        "¿Qué es la vida? Un frenesí. / ¿Qué es la vida? Una ilusión, / una sombra, una ficción, / y el mayor bien es pequeño; / que toda la vida es sueño, / y los sueños sueños son.",
        "Pues el delito mayor / del hombre es haber nacido.",
        "Mas sea verdad o sueño, / obrar bien es lo que importa; / si fuere verdad, por serlo; / si no, por ganar amigos / para cuando despertemos.",
        "Que estoy soñando, y que quiero / obrar bien, pues no se pierde / el hacer bien, aun en sueños.",
        "Sueña el rey que es rey, y vive / con este engaño mandando, / disponiendo y gobernando; / y este aplauso, que recibe / prestado, en el viento escribe; / y en cenizas le convierte / la muerte (¡desdicha fuerte!)"
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg, tomo 1 de Teatro selecto", "url": "https://www.gutenberg.org/ebooks/54436.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg, tomo 1 de Teatro selecto", "url": "https://www.gutenberg.org/ebooks/54436"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 54436 (Teatro selecto, tomo 1, con estudio crítico de Menéndez y Pelayo; dominio público)", "url": "https://www.gutenberg.org/ebooks/54436"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-vida-es-sueno"},
      parecidos: ["calderon-amor-honor-y-poder", "calderon-casa-con-dos-puertas", "calderon-el-alcalde-de-zalamea"]
    },
    {
      id: "calderon-el-magico-prodigioso",
      titulo: "El mágico prodigioso",
      autor: "Pedro Calderón de la Barca",
      anio: "1637",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Drama religioso ambientado en Antioquía. Cipriano, estudioso de la filosofía y de las ciencias ocultas, se enamora de Justina, una joven cristiana, y recurre al Demonio para vencer su resistencia. Mientras los rivales Floro y Lelio y los criados Moscón y Clarín aportan el contrapunto cómico, la obra confronta la ambición del saber, el poder del mal y la fuerza de una voluntad que no cede."},
      porque: {"es":"Sirve a quien quiere ver el drama de la ambición intelectual separada de la humildad. Cipriano busca saberlo todo y se topa con algo que su ciencia no explica, y la obra deja ver cómo un hombre puede ser cambiado por lo que no logra dominar.","en":"Suited to anyone who wants to see the drama of intellectual ambition cut off from humility. The scholar wants to know everything and runs into something his learning cannot explain, and the play shows how a man can be changed by what he fails to master."},
      imagen: {"src": "img/portadas/calderon-el-magico-prodigioso.jpg", "credito": {"es": "Menologio de Basilio II, «San Cipriano y santa Justina», h. 1000", "en": "Menologion of Basil II, “Saints Cyprian and Justina”, c. 1000"}, "url": "https://commons.wikimedia.org/wiki/File:Cyprian_and_Justina_(Menologion_of_Basil_II).jpg"},
      citas: [
        "Pensar que hay un Dios, / suma bondad, suma gracia, / todo vista, todo manos, / infalible, que no engaña, / superior, que no compite, / Dios a quien ninguno iguala, / un principio sin principio,",
        "Lo que ofrecí está en mi mano, / pero lo que tú me ofreces / no está en la tuya, pues hallo / que sobre el libre albedrío / ni hay conjuros ni hay encantos.",
        "Desconfiarme es en vano, / aunque pensé; que aunque es llano / que el pensar es empezar, / no está en mi mano el pensar, / y está el obrar en mi mano.",
        "No fuera libre albedrío / si se dejara forzar."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El_m%C3%A1gico_prodigioso"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El_m%C3%A1gico_prodigioso"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El_m%C3%A1gico_prodigioso"}],
      fuente: {"texto": "Transcripción de es.wikisource.org; la página no identifica la edición (dominio público)", "url": "https://es.wikisource.org/wiki/El_m%C3%A1gico_prodigioso"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-magico-prodigioso"},
      parecidos: ["calderon-amor-honor-y-poder", "calderon-casa-con-dos-puertas", "calderon-el-alcalde-de-zalamea"]
    },
    {
      id: "calderon-no-hay-burlas-con-el-amor",
      titulo: "No hay burlas con el amor",
      autor: "Pedro Calderón de la Barca",
      anio: "1637",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia de enredo en la que don Alonso y don Juan cortejan a las hijas de don Pedro Enríquez, doña Leonor y doña Beatriz, una de ellas aficionada a la erudición y desdeñosa con los galanes. Entre ardides, fingimientos y celos, y con la ayuda del gracioso Moscatel y de la criada Inés, los jóvenes descubren que el amor no admite juegos. La obra es una sátira amable de la afectación y la pedantería."},
      porque: {"es":"Una comedia para sonreír con las vanidades del saber. Muestra a quien presume de despreciar el amor tropezando con él, y es una lectura grata para quien guarda cierta sospecha hacia el que todo lo explica y poco se deja conmover.","en":"A comedy for smiling at the vanities of learning. It shows the person who boasts of scorning love stumbling right into it, and makes pleasant reading for anyone with some suspicion of the one who explains everything and lets himself be moved by little."},
      imagen: {"src": "img/portadas/calderon-no-hay-burlas-con-el-amor.jpg", "credito": {"es": "Peter Paul Rubens, «El jardín del amor», h. 1633", "en": "Peter Paul Rubens, “The Garden of Love”, c. 1633"}, "url": "https://commons.wikimedia.org/wiki/File:El_Jardín_del_Amor_(Rubens).jpg"},
      citas: [
        "Mar es amor en rigor; / luego en placer y en pesar, / si no hay burlas con el mar, / no hay burlas con el amor.",
        "¿qué acción, qué pasión, qué afecto, / decid, si no es amor, es / el que al hombre da valor, / el que le hace liberal, / cuerdo y galán?",
        "como eres (en el abismo / de amor jugando a dos manos, / potente rey de romanos) / mal vencedor de ti mismo"
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/No_hay_burlas_con_el_amor"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=No_hay_burlas_con_el_amor"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=No_hay_burlas_con_el_amor"}],
      fuente: {"texto": "Transcripción de es.wikisource.org; la página no identifica la edición (dominio público)", "url": "https://es.wikisource.org/wiki/No_hay_burlas_con_el_amor"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/no-hay-burlas-con-el-amor"},
      parecidos: ["calderon-amor-honor-y-poder", "calderon-casa-con-dos-puertas", "calderon-el-alcalde-de-zalamea"]
    },
    {
      id: "calderon-el-alcalde-de-zalamea",
      titulo: "El alcalde de Zalamea",
      autor: "Pedro Calderón de la Barca",
      anio: "1640",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Drama ambientado en tiempos de Felipe II. Pedro Crespo, un labrador rico y respetado, es elegido alcalde de Zalamea mientras una compañía de soldados se aloja en el pueblo, y una ofensa a su familia lo enfrenta con el capitán don Álvaro y con la autoridad militar de don Lope de Figueroa. La obra opone el honor de un hombre del pueblo al fuero de los soldados y se pregunta hasta dónde llega la justicia de quien la ejerce."},
      porque: {"es":"Para quien se pregunta qué hacer cuando la autoridad abusa. Pedro Crespo habla con firmeza y sin gritar, y su defensa de la dignidad de la gente común, hecha hace casi cuatrocientos años, sigue leyéndose con un nudo en la garganta.","en":"For anyone who asks what to do when authority abuses its power. The farmer speaks with firmness and without shouting, and his defense of the dignity of ordinary people, made nearly four hundred years ago, can still be read with a lump in the throat."},
      imagen: {"src": "img/portadas/calderon-el-alcalde-de-zalamea.jpg", "credito": {"es": "Diego Velázquez, «La rendición de Breda», 1634-1635", "en": "Diego Velázquez, “The Surrender of Breda”, 1634-1635"}, "url": "https://commons.wikimedia.org/wiki/File:Velázquez_-_de_Breda_o_Las_Lanzas_(Museo_del_Prado,_1634-35)FXD.jpg"},
      citas: [
        "Al Rey la hacienda y la vida se ha de dar; pero el honor es patrimonio del alma, y el alma sólo es de Dios.",
        "¡Cuántos, teniendo en el mundo algún defecto consigo, le han borrado por humildes; y cuántos, que no han tenido defecto, se le han hallado, por estar ellos mal vistos!",
        "Sé cortés sobre manera; sé liberal y partido, que el sombrero y el dinero son los que hacen los amigos.",
        "No hables mal de las mujeres; la más humilde, te digo, que es digna de estimación; porque al fin de ellas nacimos."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El_alcalde_de_Zalamea"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El_alcalde_de_Zalamea"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El_alcalde_de_Zalamea"}],
      fuente: {"texto": "Transcripción de es.wikisource.org; la página no identifica la edición (dominio público)", "url": "https://es.wikisource.org/wiki/El_alcalde_de_Zalamea"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-alcalde-de-zalamea"},
      parecidos: ["calderon-amor-honor-y-poder", "calderon-casa-con-dos-puertas", "calderon-el-gran-teatro-del-mundo"]
    },
    {
      id: "lope-el-caballero-de-olmedo",
      titulo: "El caballero de Olmedo",
      autor: "Lope de Vega",
      anio: "1641",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Tragicomedia sobre el amor de don Alonso, caballero de Olmedo, por doña Inés, a quien conoce en la feria de Medina del Campo. Con la ayuda del criado Tello y de la alcahueta Fabia, don Alonso avanza en su pretensión, mientras el rival don Rodrigo lo observa con envidia y el rey don Juan II preside las fiestas. Lope parte de una antigua copla popular para construir una historia de amor, presagios y honor."},
      porque: {"es":"Una de las historias de amor más delicadas del teatro español, que cambia de tono hacia el final. Sirve a quien quiere sentir cómo una obra alegre se vuelve grave de a poco, con presagios que, vistos al releer, estaban desde el comienzo.","en":"One of the most delicate love stories of Spanish theater, which changes tone toward the end. It serves anyone who wants to feel how a cheerful play slowly turns grave, with omens that, seen on a second reading, were there from the beginning."},
      imagen: {"src": "img/portadas/lope-el-caballero-de-olmedo.jpg", "credito": {"es": "Francisco Prats y Velasco, «El rey Juan II de Castilla», 1848", "en": "Francisco Prats y Velasco, “King John II of Castile”, 1848"}, "url": "https://commons.wikimedia.org/wiki/File:El_rey_Juan_II_de_Castilla_(Museo_del_Prado).jpg"},
      citas: [
        "Que de noche le mataron / al caballero, / la gala de Medina, / la flor de Olmedo.",
        "Amor, no te llame amor / el que no te corresponde, / pues que no hay materia adonde / no imprima forma el favor.",
        "Las penas anticipadas / dicen que matan dos veces, / y a mí sola Inés me mata, / no como pena, que es gloria.",
        "¡Ay, riguroso estado, / ausencia mi enemiga, / que dividiendo el alma / puedes dejar la vida! / ¡Cuán bien por tus efetos / te llaman muerte viva, / pues das vida al deseo / y matas a la vista!"
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El_caballero_de_Olmedo"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El_caballero_de_Olmedo"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El_caballero_de_Olmedo"}],
      fuente: {"texto": "Transcripción de es.wikisource.org; la página no identifica la edición (dominio público)", "url": "https://es.wikisource.org/wiki/El_caballero_de_Olmedo"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-caballero-de-olmedo"},
      parecidos: ["lope-de-vega-amor-pleito-y-desafio", "lope-de-vega-arte-nuevo-de-hacer-comedias", "lope-de-vega-ay-verdades-que-en-amor"]
    },
    {
      id: "velez-de-guevara-el-diablo-cojuelo",
      titulo: "El diablo cojuelo",
      autor: "Luis Vélez de Guevara",
      anio: "1641",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Novela satírica en forma de viaje: el estudiante don Cleofás Pérez Zambullo, que huye de la justicia por los tejados de Madrid, libera de una redoma al Diablo Cojuelo, y este, en agradecimiento, levanta los techos de la ciudad para mostrarle lo que ocurre dentro de las casas. Entre alguaciles, damas, poetas, médicos y enamorados, la obra retrata con ingenio los vicios y costumbres de la corte, y se divide en «trancos» en lugar de capítulos."},
      porque: {"es":"Para el lector con sentido del humor, que disfruta de la sátira ágil y de ver a la gente tal cual es cuando cree que nadie la mira. Es breve, vertiginoso y muy ingenioso en el lenguaje, y deja la sospecha, siempre actual, de que los vicios de la corte cambian poco de siglo en siglo.","en":"For readers with a sense of humour who enjoy quick satire and the sight of people as they really are when they think no one is watching. It is short, dizzying and wonderfully witty in its language, and it leaves the ever-current suspicion that the vices of the powerful change little from one century to the next."},
      imagen: {"src": "img/portadas/velez-de-guevara-el-diablo-cojuelo.jpg", "credito": {"es": "Tony Johannot, ilustración para «Le Diable boiteux», 1840", "en": "Tony Johannot, illustration for “Le Diable boiteux”, 1840"}, "url": "https://commons.wikimedia.org/wiki/File:Le_Diable_boiteux_par_Le_(...)Lesage_Alain-René_btv1b86002074.jpg"},
      citas: [
        "Y como es El Diablo Cojuelo, no lo reparto en capítulos, sino en trancos.",
        "Y levantando a los techos de los edificios, por arte diabólica, lo hojaldrado, se descubrió la carne del pastelón de Madrid",
        "En el mundo todos somos locos, los unos de los otros.",
        "Treguas que dan los cuidados a la vida, siendo común el silencio a las fieras y a los hombres; medida que a todos hace iguales."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/12457.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/12457"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 12457 (edición de Clásicos Castellanos de 1922, con prólogo y notas de Francisco Rodríguez Marín; dominio público)", "url": "https://www.gutenberg.org/ebooks/12457"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-diablo-cojuelo"},
      parecidos: ["cervantes-novelas-ejemplares", "cervantes-don-quijote", "swift-los-viajes-de-gulliver"]
    },
    {
      id: "swift-los-viajes-de-gulliver",
      titulo: "Los viajes de Gulliver",
      autor: "Jonathan Swift (trad. Ramón Máximo Spartal)",
      anio: "1726",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Lemuel Gulliver, cirujano de barco, relata cuatro viajes por tierras imaginarias: Liliput, donde todos son diminutos; Brobdingnag, un país de gigantes; la isla voladora de Laputa y sus vecinos; y la tierra de los houyhnhnms, caballos dotados de razón. Bajo la forma de un diario de viajero, Swift retrata con ironía las costumbres, la política y los vicios de la Europa de su tiempo. La edición de Wikisource reproduce la traducción de Spartal en la impresión de La Nación de 1914."},
      porque: {"es":"Se lee como aventura a cualquier edad, pero con los años se vuelve más afilado: Swift hace ver, desde la mirada de un viajero, lo pequeñas que pueden ser nuestras disputas y lo ridículo del orgullo. Sirve a quien quiere reírse de los poderosos y también un poco de sí mismo.","en":"It reads as an adventure at any age, but with the years it grows sharper: through a traveller's eyes, Swift shows how small our quarrels can be and how ridiculous pride looks. It suits anyone who wants to laugh at the powerful and, a little, at themselves."},
      imagen: {"src": "img/portadas/swift-los-viajes-de-gulliver.jpg", "credito": {"es": "James Gillray, «El rey de Brobdingnag y Gulliver», 1803", "en": "James Gillray, «The King of Brobdingnag and Gulliver», 1803"}, "url": "https://commons.wikimedia.org/wiki/File:The_King_of_Brobdingnag_and_Gulliver.%E2%80%93Vide._Swift%27s_Gulliver_Voyage_to_Brobdingnag.jpg"},
      citas: [
        "Finalmente me propuso esta extraña paradoja, esto es, que si alguno pudiese conseguir la producción de dos espigas de trigo o dos tallos de hierba en el mismo recinto de tierra donde antes se hubiese criado una sola, merecería más bien la estimación del género humano y haría un servicio más esencial a su país que no toda la casta de nuestros sublimes políticos.",
        "La ingratitud es allí un delito enorme, así como nos enseña la historia que en otros tiempos lo era entre algunas naciones virtuosas. Aquel, dicen ellos, que paga con malas obras a su mismo bienhechor, es preciso que sea un enemigo capital de todos los demás hombres.",
        "El uso de la palabra nos ha sido concedido para comunicarnos unos a otros nuestros pensamientos, y para instruirnos de lo que ignoramos.",
        "El mayor número de vuestros compatriotas forman una raza de insectos, la más perniciosa que jamás permitió la Naturaleza que se arrastrasen sobre la superficie de la tierra."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Viajes_de_Gulliver"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Viajes%20de%20Gulliver"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Viajes%20de%20Gulliver"}],
      fuente: {"texto": "Viajes de Gulliver, traducción de Ramón Máximo Spartal, Imprenta de La Nación, Buenos Aires, 1914, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/Viajes_de_Gulliver"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/los-viajes-de-gulliver"},
      parecidos: ["swift-una-modesta-proposicion", "velez-de-guevara-el-diablo-cojuelo", "irving-rip-van-winkle"]
    },
    {
      id: "swift-una-modesta-proposicion",
      titulo: "Una modesta proposición",
      autor: "Jonathan Swift (trad. voluntarios de Wikisource)",
      anio: "1729",
      idioma: "es",
      categoria: "ensayo",
      recomendado: false,
      resumen: {"es": "Breve panfleto satírico en el que un supuesto economista propone, con fría seriedad, una solución al hambre y la miseria de las familias pobres de Irlanda. Swift adopta la voz de un razonador sin entrañas para denunciar, por contraste, la indiferencia de los poderosos y de los propietarios ante la pobreza del país. Es una de las piezas de ironía más célebres de la literatura inglesa y debe leerse como una crítica social y no como una propuesta en serio."},
      porque: {"es":"Para quien se indigna ante la pobreza y desconfía de quienes la explican con cifras frías. Son pocas páginas, y la ironía golpea más fuerte justamente porque el narrador no pestañea. Es un buen ejercicio para aprender a leer una sátira y a notar cuándo un razonamiento impecable parte de una premisa inhumana.","en":"For anyone who is angered by poverty and wary of those who explain it with cold figures. It runs only a few pages, and the irony hits harder precisely because the narrator never blinks. It is good practice in how to read satire and in noticing when flawless reasoning rests on an inhuman premise."},
      imagen: {"src": "img/portadas/swift-una-modesta-proposicion.jpg", "credito": {"es": "George Frederic Watts, «La hambruna irlandesa», 1850", "en": "George Frederic Watts, “The Irish Famine”, 1850"}, "url": "https://commons.wikimedia.org/wiki/File:George_Frederic_Watts_(1817-1904)_-_Irish_Famine_-_COMWG_132_-_Watts_Gallery.jpg"},
      citas: [
        "Es objeto de melancolía para aquellos, que caminan por esta gran ciudad, o viajan por el campo, cuando ven las calles, los caminos y los portales llenos de pordioseras del sexo femenino, seguidas por tres, cuatro o seis niños, todos ellos cubiertos de harapos y molestando a cada pasajero al pedirle una limosna.",
        "Me ha asegurado un sabio americano, que he conocido en Londres, que un niño saludable y bien alimentado es, al año de edad, un alimento de lo más delicioso y nutritivo, ya sea estofado, rostizado, horneado o hervido.",
        "Profeso, en la sinceridad de mi corazón, que no tengo el más mínimo interés personal en promover este necesario trabajo, no teniendo otro motivo que el bien público de mi país, al promover nuestro comercio, dando sustento a los infantes, aliviando a los pobres y proporcionando algún placer a los ricos.",
        "No tengo niños por los que pudiera planear ganar un sólo centavo; el menor de ellos contando con nueve años de edad, y mi esposa habiendo ya superado la edad de concebir."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Una_modesta_proposición"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Una%20modesta%20proposici%C3%B3n"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Una%20modesta%20proposici%C3%B3n"}],
      fuente: {"texto": "Traducción libre publicada en es.wikisource.org (licencia libre CC BY-SA); obra de 1729 en dominio público", "url": "https://es.wikisource.org/wiki/Una_modesta_proposici%C3%B3n"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/una-modesta-proposicion"},
      parecidos: ["swift-los-viajes-de-gulliver", "moratin-la-derrota-de-los-pedantes", "moratin-origenes-teatro-espanol"]
    },
    {
      id: "moratin-la-derrota-de-los-pedantes",
      titulo: "La derrota de los pedantes",
      autor: "Leandro Fernández de Moratín",
      anio: "1789",
      idioma: "es",
      categoria: "ensayo",
      recomendado: false,
      resumen: {"es": "Sátira literaria en prosa en la que Apolo y las Musas, perturbados por el alboroto de los malos poetas y críticos, se ven obligados a poner orden en el Parnaso. Moratín, joven todavía, se burla de los autores presuntuosos, los eruditos de mala fe y la pedantería que ahogaba la literatura de su época. El tono es ligero y burlón, con numerosas alusiones a escritores y polémicas de la España del siglo XVIII."},
      porque: {"es":"Para quien disfruta de la sátira literaria y quiere ver cómo un autor todavía muy joven se ríe de la pedantería. Sirve a estudiantes y aficionados al siglo XVIII español. Es ligera y breve, y recuerda algo que sigue vigente: la tentación de aparentar saber más de lo que se sabe.","en":"For readers who enjoy literary satire and want to see how a still very young author laughs at pedantry. It suits students and enthusiasts of eighteenth-century Spain. It is light and short, and it recalls something that has not gone out of date: the temptation to appear to know more than one does."},
      imagen: {"src": "img/portadas/moratin-la-derrota-de-los-pedantes.jpg", "credito": {"es": "Nicolas Poussin, «Apolo y las Musas (el Parnaso)», c. 1631-1633", "en": "Nicolas Poussin, «Apollo and the Muses (Parnassus)», c. 1631-1633"}, "url": "https://commons.wikimedia.org/wiki/File:Nicolas_Poussin_-_Apollo_and_the_Muses_(Parnassus)_-_WGA18307.jpg"},
      citas: [
        "Esta obra no necesita prólogo: por eso no le tiene. Necesitaba notas; pero el autor no ha querido ponérselas.",
        "Para ser buenos ciudadanos no es menester ser malos poetas.",
        "A todo crítico se le llamará envidioso, a toda prueba calumnia, a toda censura libelo, y a todo raciocinio personalidad.",
        "La falsa sabiduría, más funesta mil veces que la total ignorancia.",
        "La verdad, por más que se presente desaliñada y adusta, la verdad es el lenguaje de un buen ciudadano, y el que no la lleva en la boca como la concibe en el entendimiento, es indigno de vivir entre los hombres."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/La_derrota_de_los_pedantes_(1830)"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=La%20derrota%20de%20los%20pedantes%20%281830%29"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=La%20derrota%20de%20los%20pedantes%20%281830%29"}],
      fuente: {"texto": "Obras de Leandro Fernández de Moratín, tomo IV, Madrid, Aguado, 1830, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/La_derrota_de_los_pedantes_(1830)"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-derrota-de-los-pedantes"},
      parecidos: ["moratin-el-si-de-las-ninas", "moratin-origenes-teatro-espanol", "swift-una-modesta-proposicion"]
    },
    {
      id: "moratin-el-si-de-las-ninas",
      titulo: "El sí de las niñas",
      autor: "Leandro Fernández de Moratín",
      anio: "1806",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "Comedia en tres actos que transcurre en una posada de Alcalá de Henares, donde doña Irene lleva a su hija Francisca para casarla con don Diego, un caballero maduro y acomodado. La joven, obediente, calla un afecto que tiene por otro, y una noche de equívocos y confidencias hace salir la verdad. Moratín defiende que los padres no deben imponer a las hijas un matrimonio sin su libre consentimiento. Es una de las comedias más representadas del teatro español del siglo XIX."},
      porque: {"es":"Una comedia que se lee en una tarde y que trata un asunto de hoy: lo que cuesta a los hijos callar, y lo que pierden los padres que deciden por ellos. Sirve a padres, hijos y a quien tenga que dar una respuesta que otros esperan escuchar de otra manera.","en":"A comedy that reads in an afternoon and deals with a matter of today: what it costs children to stay silent, and what parents lose when they decide for them. It serves parents, children, and anyone who has to give an answer others expect to hear differently."},
      imagen: {"src": "img/portadas/moratin-el-si-de-las-ninas.jpg", "credito": {"es": "Francisco de Goya, «El sí pronuncian y la mano alargan al primero que llega» (Caprichos, n.º 2), 1797-1799", "en": "Francisco de Goya, “They Say Yes and Give Their Hand to the First Comer” (Los Caprichos, no. 2), 1797-1799"}, "url": "https://commons.wikimedia.org/wiki/File:Museo_del_Prado_-_Goya_-_Caprichos_-_No._02_-_El_si_pronuncian_y_la_mano_alargan_al_primero_que_llega.jpg"},
      citas: [
        "Esto resulta del abuso de la autoridad, de la opresión que la juventud padece: estas son las seguridades que dan los padres y los tutores, y esto lo que se debe fiar en el sí de las niñas.",
        "Esto es lo que se llama criar bien a una niña; enseñarla a que desmienta y oculte las pasiones más inocentes con una pérfida disimulación. Las juzgan honestas luego que las ven instruidas en el arte de callar y mentir.",
        "Todo se las permite, menos la sinceridad. Con tal que no digan lo que sienten, con tal que finjan aborrecer lo que más desean, con tal que se presten a pronunciar, cuando se lo manden, un sí perjuro, sacrílego, origen de tantos escándalos, ya están bien criadas."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/50027.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/50027"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 50027 (edición de Barcelona, Librería Mayol, 1875; dominio público)", "url": "https://www.gutenberg.org/ebooks/50027"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-si-de-las-ninas"},
      parecidos: ["moratin-la-derrota-de-los-pedantes", "moratin-origenes-teatro-espanol", "duque-de-rivas-don-alvaro"]
    },
    {
      id: "irving-rip-van-winkle",
      titulo: "Rip Van Winkle",
      autor: "Washington Irving (trad. Carmen Torres Calderón Pinillos)",
      anio: "1819",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Cuento clásico de la literatura estadounidense, presentado como un manuscrito hallado entre los papeles del historiador Diedrich Knickerbocker. Rip Van Winkle, un aldeano holandés de las montañas Catskill, bonachón y poco amigo del trabajo, huye un día de las quejas de su mujer y se interna en el monte. Allí conoce a unos hombres extraños y se queda dormido. Al despertar descubre que el mundo ha cambiado más de lo que imagina."},
      porque: {"es":"Un cuento corto y amable, para una tarde tranquila, sobre alguien que se pierde de su propio tiempo. Le sirve especialmente a quien siente que los años pasan sin que los note, y deja una pregunta serena sobre qué permanece y qué cambia cuando uno se distrae del mundo.","en":"A short, friendly tale for a quiet afternoon, about a man who loses track of his own time. It is especially good for anyone who feels the years slipping by unnoticed, and it leaves a calm question about what stays and what changes when we stop paying attention to the world."},
      imagen: {"src": "img/portadas/irving-rip-van-winkle.jpg", "credito": {"es": "John Quidor, «El regreso de Rip Van Winkle», 1849", "en": "John Quidor, «The Return of Rip Van Winkle», 1849"}, "url": "https://commons.wikimedia.org/wiki/File:John_Quidor,_The_Return_of_Rip_Van_Winkle,_1849,_NGA_1104.jpg"},
      citas: [
        "Rip Van Winkle era, sin embargo, uno de aquellos felices mortales de disposición fácil y bobalicona que toman el mundo descuidadamente, comen con la misma indiferencia pan blanco o pan moreno a condición de evitarse la menor molestia, y preferirían morirse de hambre con un penique a trabajar por una libra.",
        "En realidad, Rip no era político: las transiciones de estados e imperios hacíanle muy poca mella; pero existía cierta clase de despotismo bajo el cual había gemido largo tiempo: el gobierno de las faldas.",
        "Yo no soy yo mismo, soy alguna otra persona; no estoy allá, no; ése es alguien que se ha metido dentro de mi piel."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Rip_Van_Winkle_(traducci%C3%B3n_de_Carmen_Torres_Calder%C3%B3n_Pinillos)"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Rip%20Van%20Winkle%20%28traducci%C3%B3n%20de%20Carmen%20Torres%20Calder%C3%B3n%20Pinillos%29"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Rip%20Van%20Winkle%20%28traducci%C3%B3n%20de%20Carmen%20Torres%20Calder%C3%B3n%20Pinillos%29"}],
      fuente: {"texto": "Traducción de Carmen Torres Calderón Pinillos en Cuentos clásicos del norte, segunda serie (1920), transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/Rip_Van_Winkle_(traducción_de_Carmen_Torres_Calderón_Pinillos)"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/rip-van-winkle-0"},
      parecidos: ["irving-cuentos-de-la-alhambra", "irving-la-leyenda-de-sleepy-hollow", "poe-metzengerstein"]
    },
    {
      id: "irving-la-leyenda-de-sleepy-hollow",
      titulo: "La leyenda del Valle Encantado",
      autor: "Washington Irving (trad. Carmen de Pinillos)",
      anio: "1820",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "En la aldea holandesa de Sleepy Hollow, a orillas del Hudson, el maestro Ichabod Crane, supersticioso y goloso, pretende la mano de la rica Katrina Van Tassel, y debe medirse con el rudo Brom Bones. Las veladas de la aldea se llenan de cuentos de aparecidos, en especial el del jinete sin cabeza que cabalga por el camino. Irving mezcla humor, costumbrismo y el gusto por lo misterioso en uno de los relatos más conocidos de la literatura norteamericana. Se edita aquí en la traducción de Carmen de Pinillos, de 1920."},
      porque: {"es":"Para leer en una noche de invierno, con una lámpara y sin apuro: mezcla el miedo suave del cuento de fogata con una sonrisa ante la vanidad del maestro. Sirve a quien busca un clásico breve y ameno, que recuerda cómo se contaban las historias en la aldea antes de las pantallas.","en":"Best read on a winter night, under a lamp and without hurry: it blends the gentle fear of a fireside tale with a smile at the schoolmaster's vanity. It suits anyone looking for a brief, enjoyable classic that recalls how stories were told in the village before screens."},
      imagen: {"src": "img/portadas/irving-la-leyenda-de-sleepy-hollow.jpg", "credito": {"es": "John Quidor, «El jinete sin cabeza persiguiendo a Ichabod Crane», 1858", "en": "John Quidor, «The Headless Horseman Pursuing Ichabod Crane», 1858"}, "url": "https://commons.wikimedia.org/wiki/File:John_Quidor_-_The_Headless_Horseman_Pursuing_Ichabod_Crane_-_Google_Art_Project.jpg"},
      citas: [
        "Si alguna vez anhelara yo un pacífico retiro donde huir del mundo y de sus distracciones y soñar en tranquila quietud todo el resto de una agitada existencia, nada respondería mejor a tal propósito que este escondido vallecito.",
        "Por más despierta que haya sido una persona antes de penetrar en la región de los sueños, es seguro que se apropiará en poco tiempo la influencia encantada del ambiente, volviéndose fantástica, fingiendo quimeras y viendo aparecidos.",
        "Son como aquellas fajas de agua tranquila que bordean algún tumultuoso arroyo, donde permanecen quietamente al ancla burbujas y pajas meciéndose con suavidad en su improvisado puerto sin ser molestadas por el flujo de la corriente.",
        "Todas las historias de duendes y espectros que había oído al crepúsculo, acudían ahora en tropel a su memoria."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/La_leyenda_del_Valle_Encantado_(traducción_de_Carmen_Torres_Calderón_Pinillos)"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=La%20leyenda%20del%20Valle%20Encantado%20%28traducci%C3%B3n%20de%20Carmen%20Torres%20Calder%C3%B3n%20Pinillos%29"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=La%20leyenda%20del%20Valle%20Encantado%20%28traducci%C3%B3n%20de%20Carmen%20Torres%20Calder%C3%B3n%20Pinillos%29"}],
      fuente: {"texto": "Cuentos clásicos del norte (Segunda serie), traducción de Carmen de Pinillos, 1920, transcrito en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/La_leyenda_del_Valle_Encantado_(traducci%C3%B3n_de_Carmen_Torres_Calder%C3%B3n_Pinillos)"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-leyenda-de-sleepy-hollow"},
      parecidos: ["irving-cuentos-de-la-alhambra", "irving-rip-van-winkle", "poe-metzengerstein"]
    },
    {
      id: "moratin-origenes-teatro-espanol",
      titulo: "Orígenes del teatro español",
      autor: "Leandro Fernández de Moratín",
      anio: "1830",
      idioma: "es",
      categoria: "ensayo",
      recomendado: false,
      resumen: {"es": "Estudio histórico sobre el nacimiento y el desarrollo del teatro en España, desde los primeros ensayos en lengua romance hasta las vísperas de Lope de Vega. Moratín reúne un discurso histórico, un catálogo crítico de piezas dramáticas anteriores a Lope y una selección de obras de autores como Juan del Encina, Lope de Rueda y Juan de Timoneda. Es un texto de referencia para quien quiera conocer cómo se formó la escena que dio lugar al Siglo de Oro."},
      porque: {"es":"Para quien se interesa por el teatro y quiere saber de dónde viene el del Siglo de Oro. Reúne historia, catálogo y textos, de modo que sirve tanto de lectura como de obra de consulta. Conviene a estudiantes de literatura y a aficionados que quieren entender cómo se forma una tradición teatral antes de su época de oro.","en":"For anyone interested in the theatre who wants to know where the drama of the Golden Age came from. It combines history, catalogue and texts, so it works both as reading and as a reference book. It suits literature students and enthusiasts who want to understand how a theatrical tradition forms before its golden age."},
      imagen: {"src": "img/portadas/moratin-origenes-teatro-espanol.jpg", "credito": {"es": "Pieter Balten, «Representación de una farsa en una feria flamenca», c. 1570", "en": "Pieter Balten, “A Performance of a Farce at a Flemish Fair”, c. 1570"}, "url": "https://commons.wikimedia.org/wiki/File:Boerenkermis_met_een_opvoering_van_de_klucht_‘Een_cluyte_van_Plaeyerwater’_Een_opvoering_van_de_klucht_'Een_cluyte_van_Plaeyerwater'_op_een_Vlaamse_kermis.,_SK-A-2554_(cropped).jpg"},
      citas: [
        "Un sevillano, hombre del pueblo, sin maestros, sin estudios, aplicado a ganar la vida en un ejercicio mecánico, hizo en la escena española una innovación plausible, y abrió a los autores dramáticos un nuevo camino que no acertaron a seguir.",
        "Pero si es admirable la fecundidad de su fantasía, que nunca supo sujetar a los preceptos del arte, no es menos de maravillar que improvisando siempre, muchas veces acertó.",
        "El teatro español que, como ya se ha dicho, empezó en el templo, sujetaba a la ficción escénica los misterios de la Religión.",
        "Este idioma conservado en las obras estimables de los sabios que florecieron en aquella edad, fue corrompiéndose con mucha rapidez en boca del pueblo"
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Orígenes_del_teatro_español"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Or%C3%ADgenes%20del%20teatro%20espa%C3%B1ol"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Or%C3%ADgenes%20del%20teatro%20espa%C3%B1ol"}],
      fuente: {"texto": "Obras de D. Leandro Fernández de Moratín dadas a luz por la Real Academia de la Historia (Madrid, Aguado, 1830), transcripción de es.wikisource (dominio público)", "url": "https://es.wikisource.org/wiki/Or%C3%ADgenes_del_teatro_espa%C3%B1ol"},
      delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/origenes-del-teatro-espanol"},
      parecidos: ["moratin-el-si-de-las-ninas", "moratin-la-derrota-de-los-pedantes", "fernan-caballero-el-alcazar-de-sevilla"]
    },
    {
      id: "irving-cuentos-de-la-alhambra",
      titulo: "Cuentos de la Alhambra",
      autor: "Washington Irving (trad. Luis Lamarca)",
      anio: "1832",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Durante una estadía en Granada, un viajero norteamericano se instala en las salas del antiguo palacio nazarí y recoge las leyendas, las historias de moros y cristianos y las costumbres de quienes viven entre sus muros. El libro mezcla la crónica de viaje, el retrato de personajes locales y los relatos fantásticos ligados a cada torre y a cada patio. Es una puerta de entrada clásica a la imagen romántica de la España andaluza."},
      porque: {"es":"Para quien viajará a Granada o quiere conocerla desde lejos. Irving mira con cariño un palacio y a la gente que vive entre sus muros, y las leyendas moriscas que recoge resultan más entretenidas que la crónica del viaje. Esta edición de 1833 es una selección breve, buena para leer en dosis pequeñas, por ejemplo antes de dormir.","en":"For anyone travelling to Granada, or who wants to know it from afar. Irving looks fondly at a palace and the people living within its walls, and the Moorish legends he gathers are more entertaining than the travel account. This 1833 edition is a short selection, good to read in small doses, for example before bed."},
      imagen: {"src": "img/portadas/irving-cuentos-de-la-alhambra.jpg", "credito": {"es": "Gustave Vanaise, «Patio de la Alhambra, Granada», 1887", "en": "Gustave Vanaise, «Courtyard of the Alhambra, Granada», 1887"}, "url": "https://commons.wikimedia.org/wiki/File:Gustave_Vanaise_-_Court_of_the_Lions,_Granada.jpg"},
      citas: [
        "Salido apenas de la infancia, recorrí en las riberas del Hudson una antigua historia de las guerras de Granada, y esta ciudad se hizo el objeto de mis dulces delirios.",
        "¿Me hallo efectivamente, decía, en el palacio de Boabdil? ¿Es aquella Granada tan célebre en los fastos de la caballería, la que distingo desde este elevado balcón? Sí, no es ilusión: recorro a mi placer estos salones orientales, oigo el murmullo de las fuentes, respiro la fragancia de las rosas.",
        "Las tazas de alabastro derraman de continuo una lluvia de líquidos diamantes, y los doce leones arrojan por las narices torrentes de agua cristalina lo mismo que en los días de Boabdil.",
        "Es fama común que el encanto conservará toda su virtud hasta el momento en que la mano se baje de tal modo que llegue a tocar la llave, en cuyo acto se hundirá la Alhambra, y quedarán de manifiesto los tesoros de los reyes moros."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/52262.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/52262"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 52262 (edición de Valencia, 1833; dominio público)", "url": "https://www.gutenberg.org/ebooks/52262"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/cuentos-de-la-alhambra"},
      parecidos: ["irving-la-leyenda-de-sleepy-hollow", "irving-rip-van-winkle", "poe-metzengerstein"]
    },
    {
      id: "poe-metzengerstein",
      titulo: "Metzengerstein",
      autor: "Edgar Allan Poe (trad. anónima)",
      anio: "1832",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "En la Hungría de una creencia antigua sobre el paso de las almas a otros cuerpos, dos familias nobles, los Berlifitzing y los Metzengerstein, arrastran una enemistad hereditaria. Cuando el joven barón Federico hereda el castillo, su carácter licencioso y vengativo lo lleva a una serie de actos violentos. Un misterioso caballo de tapiz que parece cobrar vida marca desde entonces su suerte. Es el primer cuento publicado de Poe, de ambiente gótico y de corte sobrenatural."},
      porque: {"es":"Para quien quiere conocer los comienzos de Poe y asomarse a su mundo en pocas páginas. Es una lectura de ambiente, de esas que se disfrutan de noche, y muestra cómo el rencor heredado pesa sobre quien lo recibe y termina marcando su destino.","en":"For readers who want to see where Poe began and glimpse his world in a few pages. It is a book of atmosphere, the kind best enjoyed at night, and it shows how an inherited grudge weighs on whoever receives it and ends up shaping his fate."},
      imagen: {"src": "img/portadas/poe-metzengerstein.jpg", "credito": {"es": "Harry Clarke, «Metzengerstein», 1923", "en": "Harry Clarke, «Metzengerstein», 1923"}, "url": "https://commons.wikimedia.org/wiki/File:Harry_Clarke_Metzengerstein.jpg"},
      citas: [
        "El horror y la fatalidad se han reconocido en todos los siglos, y por consecuencia, ¿a qué asignar una fecha a la historia que voy a réferir?",
        "Federico apenas tenía diez y ocho años, que si en una ciudad no son mucha edad, en soledad, y soledad tan magnífica como la de aquel antiguo señorío, el péndulo vibra con más profunda y más significativa solemnidad.",
        "Cuánto más intenso es el interés que escita en los sentimientos de la muchedumbre la contemplación de una agonía humana, que la que pueden producir los más espantosos espectáculos de la materia inanimada."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Metzengerstein_(1860)"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Metzengerstein%20%281860%29"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Metzengerstein%20%281860%29"}],
      fuente: {"texto": "«Historias estraordinarias», Madrid: Imprenta de Las Novedades, 1860, transcritas en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/Metzengerstein_(1860)"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/metzengerstein"},
      parecidos: ["poe-el-barril-de-amontillado", "poe-el-escarabajo-de-oro", "poe-el-gato-negro"]
    },
    {
      id: "balzac-eugenia-grandet",
      titulo: "Eugenia Grandet",
      autor: "Honoré de Balzac (trad. Joaquín García Bravo)",
      anio: "1833",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "En una casa sombría de Saumur vive Eugenia, hija de un tonelero enriquecido cuya avaricia gobierna a toda la familia. La llegada de un primo arruinado, venido de París, despierta en ella su primer amor y la lleva a desafiar la autoridad de su padre. La novela retrata con detalle el poder del dinero en la provincia francesa y el costo humano de la codicia. Forma parte de «La comedia humana»."},
      porque: {"es":"Para quien quiere entender cómo el apego al dinero va empobreciendo a una casa entera, aunque no falte nada en la despensa. Es una novela de ritmo sereno y sirve en particular al lector joven, que ve en Eugenia a alguien que aprende, poco a poco, a decidir por sí misma.","en":"For anyone who wants to understand how attachment to money slowly impoverishes a whole household, even when the pantry is full. It is a novel of calm pace, and it suits younger readers especially, who will watch Eugénie learn, little by little, to decide for herself."},
      imagen: {"src": "img/portadas/balzac-eugenia-grandet.jpg", "credito": {"es": "Daniel Hernández, «Eugenia Grandet», siglo XIX", "en": "Daniel Hernández, «Eugénie Grandet», 19th century"}, "url": "https://commons.wikimedia.org/wiki/File:BalzacEugenieGrandet01.jpg"},
      citas: [
        "Los avaros no creen en otra vida, y el presente es el todo para ellos.",
        "El amor es nuestra segunda transformación.",
        "El amor de aquella joven fue el amor solitario, el amor verdadero que persiste, que anima todos los pensamientos y que se convierte, por decirlo así, en la substancia de la vida.",
        "El dinero tenía que comunicar su frialdad a aquella vida celestial y hacer sentir desconfianza por los sentimientos a una mujer que era todo sentimiento."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Eugenia_Grandet"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Eugenia%20Grandet"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Eugenia%20Grandet"}],
      fuente: {"texto": "Edición de Barcelona, 1902, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/Eugenia_Grandet"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/eugenia-grandet"},
      parecidos: ["pushkin-la-dama-de-pique", "irving-cuentos-de-la-alhambra", "poe-metzengerstein"]
    },
    {
      id: "pushkin-la-dama-de-pique",
      titulo: "La dama de pique",
      autor: "Aleksandr Pushkin (trad. Julián Juderías)",
      anio: "1833",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "En San Petersburgo, el oficial Hermann observa cada noche las mesas de juego sin atreverse a apostar. Al oír que una anciana condesa conoce el secreto de tres cartas ganadoras, decide acercarse a ella por medio de su joven protegida. La obsesión por el dinero lo empuja a cruzar límites cada vez más peligrosos. Es un relato breve y tenso, considerado una joya de la prosa rusa."},
      porque: {"es":"Para quien tiene poco tiempo y quiere una lectura que no suelte: en pocas páginas muestra cómo una idea fija va tomando a un hombre. Sirve de introducción amable a la prosa rusa y deja una advertencia discreta sobre la ambición que no sabe detenerse.","en":"For readers short on time who want something that will not let go: in a few pages it shows how a fixed idea gradually takes hold of a man. It is a friendly introduction to Russian prose and leaves a quiet warning about ambition that does not know when to stop."},
      imagen: {"src": "img/portadas/pushkin-la-dama-de-pique.jpg", "credito": {"es": "Nikolái Tyrsa, «Ilustración para La dama de pique», 1936", "en": "Nikolay Tyrsa, «Illustration for The Queen of Spades», 1936"}, "url": "https://commons.wikimedia.org/wiki/File:%D0%A2%D1%8B%D1%80%D1%81%D0%B0_%D0%9F%D0%B8%D0%BA%D0%BE%D0%B2%D0%B0%D1%8F_%D0%B4%D0%B0%D0%BC%D0%B0_1936.jpg"},
      citas: [
        "Así como en la naturaleza física no pueden dos cuerpos ocupar el mismo lugar al mismo tiempo, en la naturaleza moral tan poco puede haber dos ideas fijas. El tres, el siete y el as expulsaron muy pronto de la imaginación de Hermann la tétrica figura de la condesa.",
        "Siendo en el fondo amigo del juego, no tocaba jamás una carta, porque calculaba que su fortuna no le permitía (según decía él) sacrificar lo indispensable a la esperanza de conseguir lo superfluo",
        "Cálculo, moderación y laboriosidad, estas son mis tres cartas; ellas triplicarán, multiplicarán mi capital y me darán la tranquilidad y la independencia."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/La_dama_de_%22pique%22"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=La%20dama%20de%20%22pique%22"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=La%20dama%20de%20%22pique%22"}],
      fuente: {"texto": "«Páginas eslavas», traducción directa del ruso de Julián Juderías, 1912, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/La_dama_de_%22pique%22"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-dama-de-pique"},
      parecidos: ["balzac-eugenia-grandet", "irving-cuentos-de-la-alhambra", "poe-metzengerstein"]
    },
    {
      id: "duque-de-rivas-don-alvaro",
      titulo: "Don Álvaro o La fuerza del sino",
      autor: "Duque de Rivas (Ángel de Saavedra)",
      anio: "1835",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "En la Sevilla del siglo XVIII, un caballero de origen misterioso ama a la hija de un marqués que se opone a la unión. Un accidente en el peor momento desencadena una cadena de desgracias que persigue a los protagonistas por España e Italia. El drama en cinco jornadas, en prosa y verso, rompió con las reglas del teatro neoclásico y abrió el romanticismo español. Su tema central es el destino que parece cerrarse sobre un hombre pese a sus esfuerzos."},
      porque: {"es":"Para quien quiere conocer el Romanticismo español en su forma más intensa. Es un drama de pasiones y destino que se lee con rapidez, y plantea una pregunta que cada generación se repite: cuánto de lo que nos pasa depende de nosotros y cuánto del azar.","en":"For anyone who wants to meet Spanish Romanticism at its most intense. It is a drama of passion and fate that reads quickly, and it raises a question every generation asks again: how much of what happens to us depends on us, and how much on chance."},
      imagen: {"src": "img/portadas/duque-de-rivas-don-alvaro.jpg", "credito": {"es": "Caspar David Friedrich, «Abadía en el robledal», 1809-1810", "en": "Caspar David Friedrich, “The Abbey in the Oakwood”, 1809-1810"}, "url": "https://commons.wikimedia.org/wiki/File:Caspar_David_Friedrich_-_Abtei_im_Eichwald_-_Google_Art_Project.jpg"},
      citas: [
        "Parece, sí, que a medida / que es más dura y más amarga, / más extiende, más alarga / el destino nuestra vida.",
        "¡Qué carga tan insufrible / es el ambiente vital, / para el mezquino mortal / que nace en signo terrible! / ¡Qué eternidad tan horrible / la breve vida!",
        "Caridad, hermano, caridad, que son hijos de Dios."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/59492.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/59492"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 59492 (Madrid, Imprenta de José M. Ducazcal, 1879; dominio público)", "url": "https://www.gutenberg.org/ebooks/59492"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/don-alvaro-o-la-fuerza-del-sino"},
      parecidos: ["zorrilla-don-juan-tenorio", "moratin-el-si-de-las-ninas", "lope-el-caballero-de-olmedo"]
    },
    {
      id: "dickens-los-ladrones-de-londres",
      titulo: "Los ladrones de Londres (Oliver Twist)",
      autor: "Charles Dickens (trad. anónima)",
      anio: "1837",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Oliver Twist nace en un asilo de beneficencia inglés y crece entre el hambre y el maltrato. Tras huir a Londres, cae en manos de una banda de ladrones que dirige un viejo astuto y lo convierte en su aprendiz. Entre la miseria de los barrios bajos y la bondad de unos pocos desconocidos, el niño busca su lugar y su origen. Es una de las grandes novelas de denuncia social del siglo XIX; esta edición es una traducción libre de 1857 hecha a partir del francés."},
      porque: {"es":"Para quien cree que Dickens es solo nostalgia victoriana: aquí hay hambre, frío y niños desamparados, contados con humor y compasión. Recuerda que la caridad de verdad mira a la persona, y por ser una traducción antigua, agrada también a quien disfruta la lengua de otra época.","en":"For anyone who thinks Dickens is only Victorian nostalgia: here there is hunger, cold and abandoned children, told with humour and compassion. It reminds us that real charity looks at the person, and since this is an old translation, it also pleases readers who enjoy the language of another era."},
      imagen: {"src": "img/portadas/dickens-los-ladrones-de-londres.jpg", "credito": {"es": "George Cruikshank, «Fagin en la celda de los condenados», 1838", "en": "George Cruikshank, «Fagin in the Condemned Cell», 1838"}, "url": "https://commons.wikimedia.org/wiki/File:The_Writings_of_Charles_Dickens_v4_p432_(engraving).jpg"},
      citas: [
        "Quisiera más si os place, caballero.",
        "Si hubiera más personas cual vos, habría menos cual yo; esto es muy cierto.",
        "No rehuséis escucharme y dejaos volver al sendero del honor y de la virtud.",
        "Nunca es tarde para el arrepentimiento."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/62201.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/62201"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 62201 (Barcelona, Imprenta de Joaquín Bosch, 1857; dominio público)", "url": "https://www.gutenberg.org/ebooks/62201"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/oliver-twist"},
      parecidos: ["dickens-el-cantico-de-navidad", "balzac-eugenia-grandet", "pushkin-la-dama-de-pique"]
    },
    {
      id: "manzoni-los-novios",
      titulo: "Los novios",
      autor: "Alessandro Manzoni (trad. Juan Nicasio Gallego)",
      anio: "1842",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "En la Lombardía del siglo XVII, dos jóvenes humildes, Renzo y Lucía, están a punto de casarse cuando un señor local, Don Rodrigo, lo impide por capricho y por poder. Separados, deben huir y recorrer un país devastado por la guerra, el hambre y la peste. La novela histórica sigue sus peripecias y las de quienes los ayudan o los persiguen, y es la obra fundacional de la narrativa italiana moderna."},
      porque: {"es":"Para el lector paciente que busca una gran novela de fondo. Acompaña a dos personas corrientes frente a injusticias enormes, la guerra y la peste, y por eso consuela a quien se siente pequeño ante quienes mandan. Se disfruta mejor sin apuro, a lo largo de varias semanas.","en":"For the patient reader looking for a great novel with real depth. It keeps company with two ordinary people facing enormous injustice, war and plague, and so it consoles anyone who feels small before those in power. It is best enjoyed unhurried, over several weeks."},
      imagen: {"src": "img/portadas/manzoni-los-novios.jpg", "credito": {"es": "Francesco Hayez, «El beso», 1859", "en": "Francesco Hayez, “The Kiss”, 1859"}, "url": "https://commons.wikimedia.org/wiki/File:Francesco_Hayez_008.jpg"},
      citas: [
        "Aquel ramal del lago de Como que, torciendo hácia el Sur entre dos cordilleras de montes, forma varios golfos y ensenadas, segun ellos se apartan o se acercan, toma casi de repente curso y figura de rio, estrechándose entre un promontorio al lado derecho y una espaciosa ribera al izquierdo.",
        "Todos tuvieron ánimo, porque el ánimo era necesario, y porque tuvieron confianza.",
        "Si en tantos años de oficio pastoral habéis amado a vuestra grey, no debía faltaros el ánimo, porque el amor es intrépido.",
        "Se ve en suma que había buen sentido; pero que se mantenía oculto por temor del sentido común."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Los_novios"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Los%20novios"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Los%20novios"}],
      fuente: {"texto": "«Los novios. Historia milanesa del siglo XVI», edición de 1880, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/Los_novios"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/los-novios-0"},
      parecidos: ["dickens-el-cantico-de-navidad", "poe-el-escarabajo-de-oro", "poe-el-gato-negro"]
    },
    {
      id: "dickens-el-cantico-de-navidad",
      titulo: "El cántico de Navidad",
      autor: "Charles Dickens (trad. Luis Barthe)",
      anio: "1843",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "En la víspera de Navidad, el viejo Scrooge, avaro y hostil, recibe la visita del espectro de su antiguo socio Marley. Esa noche tres espíritus, el de las Navidades pasadas, presentes y futuras, lo llevan a revisar su vida y las consecuencias de su dureza. La historia, dividida en cinco estrofas, es una de las más queridas de la literatura navideña y habla de la generosidad y la segunda oportunidad."},
      porque: {"es":"Para releer cada diciembre, o para leerlo por primera vez sin las versiones de cine en la cabeza. Es corto, se lee en un par de tardes y recuerda con cariño que nadie está demasiado endurecido para cambiar, ni es demasiado tarde para empezar a dar.","en":"To reread every December, or to read for the first time without the film versions in your head. It is short, it takes a couple of evenings, and it reminds us warmly that no one is too hardened to change, and that it is never too late to start giving."},
      imagen: {"src": "img/portadas/dickens-el-cantico-de-navidad.jpg", "credito": {"es": "John Leech, «El fantasma de Marley», 1843", "en": "John Leech, «Marley's Ghost», 1843"}, "url": "https://commons.wikimedia.org/wiki/File:Marley%27s_Ghost-John_Leech,_1843_(DYK_crop).jpg"},
      citas: [
        "Para empezar: Marley había muerto. Sobre ello no había ni la menor sombra de duda.",
        "La humanidad era mi negocio: el bien general era mi negocio: la caridad, la misericordia, la benevolencia eran mis negocios. Las operaciones del comercio no constituían más que una gota de agua en el vasto mar de mis negocios.",
        "Celebraré la Navidad en el fondo de mi corazón, y me esforzaré en conservar su culto todo el año.",
        "¡Que Dios bendiga a cada uno de nosotros!"
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El_c%C3%A1ntico_de_Navidad"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El%20c%C3%A1ntico%20de%20Navidad"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El%20c%C3%A1ntico%20de%20Navidad"}],
      fuente: {"texto": "Edición de Madrid, Biblioteca Universal, 1883, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/El_c%C3%A1ntico_de_Navidad"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/cuento-de-navidad-0"},
      parecidos: ["dickens-los-ladrones-de-londres", "poe-el-escarabajo-de-oro", "poe-el-gato-negro"]
    },
    {
      id: "poe-el-escarabajo-de-oro",
      titulo: "El escarabajo de oro",
      autor: "Edgar Allan Poe (trad. Manuel Cano y Cueto)",
      anio: "1843",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Un narrador visita a su amigo William Legrand, que vive retirado en una isla de Carolina del Sur con su criado Júpiter y ha sido picado, según dice, por un escarabajo de aspecto singular. Lo que parece una manía se convierte en una expedición para seguir las pistas de un viejo pergamino cifrado. El relato combina aventura, misterio y el descifrado de un criptograma, y es uno de los más leídos de Poe."},
      porque: {"es":"Para quien disfruta de los enigmas: es una aventura con tesoro y clave secreta, donde el lector puede intentar adelantarse al narrador. Sirve como puerta de entrada a Poe para quienes no buscan terror, y es un buen libro para compartir con un lector joven.","en":"For anyone who enjoys puzzles: an adventure with a treasure and a secret code, where the reader can try to get ahead of the narrator. It works as a way into Poe for those who do not want horror, and it is a good book to share with a young reader."},
      imagen: {"src": "img/portadas/poe-el-escarabajo-de-oro.jpg", "credito": {"es": "John Byam Shaw, «El escarabajo de oro», hacia 1909", "en": "John Byam Shaw, «The Gold-Bug», c. 1909"}, "url": "https://commons.wikimedia.org/wiki/File:Poe_gold-bug_byam_shaw.JPG"},
      citas: [
        "Las circunstancias y cierta inclinación me han hecho tomar interés por esta clase de enigmas, y es dudoso realmente que el ingenio humano pudiese crear un enigma de este género del cual el humano ingenio no llegase a una conclusión clara por una aplicación suficiente.",
        "El espíritu se esfuerza en establecer un orden, una relación de causa con efecto, y encontrándose impotente para resolverlo, sufre una especie de parálisis momentánea.",
        "La solución no es ciertamente tan difícil como uno se imaginaría al primer golpe de vista."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El_escarabajo_de_oro_(Cano_y_Cueto_tr.)"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El%20escarabajo%20de%20oro%20%28Cano%20y%20Cueto%20tr.%29"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El%20escarabajo%20de%20oro%20%28Cano%20y%20Cueto%20tr.%29"}],
      fuente: {"texto": "«Historias estraordinarias», Sevilla: Eduardo Perié, 1871, traducción de Manuel Cano y Cueto, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/El_escarabajo_de_oro_(Cano_y_Cueto_tr.)"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-escarabajo-de-oro"},
      parecidos: ["poe-el-barril-de-amontillado", "poe-el-gato-negro", "poe-la-carta-robada"]
    },
    {
      id: "poe-el-gato-negro",
      titulo: "El gato negro",
      autor: "Edgar Allan Poe (trad. Manuel Cano y Cueto)",
      anio: "1843",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Un hombre condenado a muerte cuenta, la víspera de su ejecución, cómo un carácter antes dulce se fue degradando por la bebida. Su afecto por los animales, y en especial por un gato negro llamado Plutón, se transforma en crueldad. A partir de un primer acto de violencia, la culpa y la obsesión lo arrastran a hechos cada vez más graves. Es un clásico del cuento de terror psicológico."},
      porque: {"es":"Para quien quiere ver el terror desde adentro: lo inquietante no está en un fantasma, sino en lo que el hábito del mal hace con una persona común. Es una lectura corta e incómoda, útil para pensar en cómo se empieza a ceder y cuánto cuesta volver atrás.","en":"For readers who want to see horror from the inside: what unsettles here is not a ghost but what the habit of wrongdoing does to an ordinary person. It is a short, uncomfortable read, useful for thinking about how one begins to give way and how hard it is to turn back."},
      imagen: {"src": "img/portadas/poe-el-gato-negro.jpg", "credito": {"es": "John Byam Shaw, «El gato negro», hacia 1909", "en": "John Byam Shaw, «The Black Cat», c. 1909"}, "url": "https://commons.wikimedia.org/wiki/File:Poe_black_cat_byam_shaw.JPG"},
      citas: [
        "¿No tenemos una perpetua inclinación, no obstante la excelencia de nuestro juicio, a violar lo que es Ley, simplemente porque comprendemos que es Ley?",
        "Con todo, tan seguro como existe mi alma, yo creo que la perversidad es uno de los primitivos impulsos del corazón humano",
        "Es ese deseo ardiente, insondable del alma de atormentarse a sí misma, de violentar su propia naturaleza, de hacer el mal por amor al mal",
        "En mi infancia había sido conocido por la docilidad y humanidad de mi carácter."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El_gato_negro_(Cano_y_Cueto_tr.)"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El%20gato%20negro%20%28Cano%20y%20Cueto%20tr.%29"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El%20gato%20negro%20%28Cano%20y%20Cueto%20tr.%29"}],
      fuente: {"texto": "«Historias estraordinarias», Sevilla: Eduardo Perié, 1871, traducción de Manuel Cano y Cueto, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/El_gato_negro_(Cano_y_Cueto_tr.)"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-gato-negro-le-chat-noir"},
      parecidos: ["poe-el-barril-de-amontillado", "poe-el-escarabajo-de-oro", "poe-la-carta-robada"]
    },
    {
      id: "gil-y-carrasco-el-senor-de-bembibre",
      titulo: "El señor de Bembibre",
      autor: "Enrique Gil y Carrasco",
      anio: "1844",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Novela histórica del Romanticismo español, ambientada en el Bierzo a comienzos del siglo XIV. Narra el amor de Álvaro Yáñez, señor de Bembibre, y Beatriz, hija del señor de Arganza, un amor que choca con las ambiciones de las casas nobles. Al fondo corre el destino de los caballeros templarios, a los que Álvaro está ligado. Es famosa por sus descripciones del paisaje leonés."},
      porque: {"es":"Para el lector que aprecia el paisaje y el amor contrariado, a ritmo romántico de otro siglo. Sirve a quien quiere conocer una novela histórica española menos transitada, y acompaña bien a quien lee descansado, con vistas largas y sentimientos intensos.","en":"For readers who value landscape and thwarted love, told at the unhurried pace of another century. It suits anyone who wants to discover a less-travelled Spanish historical novel, and it is good company for relaxed reading, with long views and strong feelings."},
      imagen: {"src": "img/portadas/gil-y-carrasco-el-senor-de-bembibre.jpg", "credito": {"es": "Genaro Pérez Villaamil, «El castillo de Gaucín», siglo XIX", "en": "Genaro Pérez Villaamil, “The Castle of Gaucín”, 19th century"}, "url": "https://commons.wikimedia.org/wiki/File:El_Castillo_de_Gaucin_-_Jenaro_Pérez_Villaamil.jpg"},
      citas: [
        "Mirad que la esperanza es una virtud divina.",
        "El conocimiento recíproco de los caracteres y la consonancia de los sentimientos, son fiadores más seguros de la paz y dicha doméstica que la razón de estado y los cálculos de la conveniencia.",
        "Así estuvieron algunos instantes, como dos puros y cristalinos ríos que mezclan sus aguas.",
        "El que no es agradecido no es bien nacido."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/49413.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/49413"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 49413 (dominio público); edición de Gil-Blas, Madrid, 1920", "url": "https://www.gutenberg.org/ebooks/49413"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-senor-de-bembibre"},
      parecidos: ["dickens-el-cantico-de-navidad", "poe-el-escarabajo-de-oro", "poe-el-gato-negro"]
    },
    {
      id: "zorrilla-don-juan-tenorio",
      titulo: "Don Juan Tenorio",
      autor: "José Zorrilla",
      anio: "1844",
      idioma: "es",
      categoria: "teatro",
      recomendado: false,
      resumen: {"es": "En la Sevilla de Carlos V, don Juan Tenorio y don Luis Mejía apuestan sobre cuál de los dos ha cometido más delitos y seducido a más mujeres. Don Juan se propone además conquistar a doña Inés, novicia de un convento. La segunda parte, cinco años después, lo enfrenta con las consecuencias de su vida. El drama religioso-fantástico en verso se representa en España cada año alrededor del día de Todos los Santos."},
      porque: {"es":"Una obra de lectura amena, popular en España y en América, que se entiende mejor leída que oída de pasada. Su segunda parte la hace distinta: habla del arrepentimiento y de la posibilidad de cambiar, algo que le sirve a quien siente que ya es tarde.","en":"An enjoyable read, popular in Spain and Latin America, better understood when read than heard in passing. Its second part sets it apart: it speaks of repentance and the chance to change, something that helps anyone who feels it is already too late."},
      imagen: {"src": "img/portadas/zorrilla-don-juan-tenorio.jpg", "credito": {"es": "Alexandre-Évariste Fragonard, «Don Juan y la estatua del comendador», c. 1830-1835", "en": "Alexandre-Évariste Fragonard, “Don Juan and the Statue of the Commander”, c. 1830-1835"}, "url": "https://commons.wikimedia.org/wiki/File:113_Alexandre-Evariste_Fragonard,_Don_Juan_et_la_statue_du_commandeur,_vers_1830-35.jpg"},
      citas: [
        "Llamé al cielo y no me oyó, / y pues sus puertas me cierra, / de mis pasos en la tierra / responda el cielo, y no yo.",
        "¡Ah! ¿No es cierto, ángel de amor, / que en esta apartada orilla / más pura la luna brilla / y se respira mejor?",
        "Yo a las cabañas bajé, / yo a los palacios subí, / yo los claustros escalé, / y en todas partes dejé / memoria amarga de mí.",
        "Suéltala, que si es verdad / que un punto de contrición / da a un alma la salvación / de toda una eternidad, / yo, Santo Dios, creo en Ti: / si es mi maldad inaudita, / tu piedad es infinita... / ¡Señor, ten piedad de mí!"
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Don_Juan_Tenorio_(1844)"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Don%20Juan%20Tenorio%20%281844%29"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Don%20Juan%20Tenorio%20%281844%29"}],
      fuente: {"texto": "Edición de Madrid, Imprenta de Repullés, 1844, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/Don_Juan_Tenorio_(1844)"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/don-juan-tenorio"},
      parecidos: ["duque-de-rivas-don-alvaro", "moratin-el-si-de-las-ninas", "lope-el-caballero-de-olmedo"]
    },
    {
      id: "poe-la-carta-robada",
      titulo: "La carta robada",
      autor: "Edgar Allan Poe (trad. Carlos Olivera)",
      anio: "1845",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Cuento de detectives de Poe, el tercero con el aficionado parisino C. Auguste Dupin. El prefecto de policía acude a Dupin porque una carta comprometedora ha sido sustraída de las habitaciones reales y, pese a registros minuciosos, no aparece. Dupin aborda el caso por un camino distinto al de la policía, y el relato es un clásico del enigma resuelto por el razonamiento."},
      porque: {"es":"Para quien disfruta de la lógica antes que de la violencia: el caso se resuelve pensando y mirando lo evidente que otros pasan por alto. Es muy corto, ideal para conocer la novela policial en sus orígenes, y deja una lección sobre ponerse en el lugar del otro.","en":"For anyone who prefers logic to violence: the case is solved by thinking and by noticing the obvious thing others overlook. It is very short, ideal for meeting detective fiction at its origins, and it leaves a lesson about putting yourself in the other person's place."},
      imagen: {"src": "img/portadas/poe-la-carta-robada.jpg", "credito": {"es": "Ilustración para «The Purloined Letter», 1902, autor desconocido", "en": "Illustration for «The Purloined Letter», 1902, unknown artist"}, "url": "https://commons.wikimedia.org/wiki/File:Purloined_Letter_illustration,_1902.jpg"},
      citas: [
        "Cuando deseo saber cuán sabio o cuán estúpido, o cuán bueno o cuán malo es alguno, o cuáles son sus pensamientos en un instante dado, acomodo la expresión de mi rostro, tan cuidadosamente como me es posible, de acuerdo con la expresión del rostro de él, y entonces trato de ver qué pensamientos o sentimientos nacen en mi alma, que igualen o correspondan a la expresión.",
        "Quizá es precisamente la simplicidad lo que desconcierta a Vd.",
        "Así es que perpetuamente yerra por ser demasiado profundo, o demasiado superficial en los asuntos que se le confían, y muchos niños de escuela son mejores razonadores que él.",
        "Es ese monstrum horrendum del hombre de genio sin principios."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/La_carta_robada_(Olivera_tr.)"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=La%20carta%20robada%20%28Olivera%20tr.%29"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=La%20carta%20robada%20%28Olivera%20tr.%29"}],
      fuente: {"texto": "Novelas y cuentos de Edgar Poe, traducción de Carlos Olivera, París, Garnier Hermanos, 1884, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/La_carta_robada_(Olivera_tr.)"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-carta-robada"},
      parecidos: ["poe-el-barril-de-amontillado", "poe-el-escarabajo-de-oro", "poe-el-gato-negro"]
    },
    {
      id: "poe-el-barril-de-amontillado",
      titulo: "El barril de amontillado",
      autor: "Edgar Allan Poe (trad. Manuel Cano y Cueto)",
      anio: "1846",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Cuento breve de Poe narrado por Montresor, quien jura vengarse de las ofensas de Fortunato. Aprovecha el tiempo de carnaval para llevar a su rival, aficionado al vino, hasta las catacumbas de su familia con el pretexto de catar un barril de amontillado. El relato avanza con ironía y tensión creciente hacia una venganza cuidadosamente planeada."},
      porque: {"es":"Para quien quiere leer un cuento redondo de tan breve: en pocas páginas, un narrador calmado y un plan frío bastan para helar. Sirve para ver cuánto puede esconder una voz educada, y para estudiar cómo se construye la tensión sin gastar una palabra de más.","en":"For readers who want a story that is round and complete in very few pages: a calm narrator and a cold plan are enough to chill the blood. It shows how much a polite voice can hide, and how tension is built without wasting a single word."},
      imagen: {"src": "img/portadas/poe-el-barril-de-amontillado.jpg", "credito": {"es": "Harry Clarke, «The Cask of Amontillado», 1919", "en": "Harry Clarke, «The Cask of Amontillado», 1919"}, "url": "https://commons.wikimedia.org/wiki/File:CaskofAmontillado-Clarke.jpg"},
      citas: [
        "Soporté cuanto pude las injusticias de Fortunato; pero cuando estas llegaron hasta el insulto, juré vengarme.",
        "Debía no solo castigar, sino castigar impunemente. Una injuria no se venga cuando el castigo alcanza al desfacedor, ni se venga cuando el vengador no tiene necesidad de hacerse conocer del que ha cometido la injuria.",
        "Continué, según costumbre, sonriéndole siempre, y él no comprendía que mi sonrisa era la fórmula del pensamiento que yo de su inmolación abrigaba."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El_barril_de_amontillado_(Cano_y_Cueto_tr.)"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El%20barril%20de%20amontillado%20%28Cano%20y%20Cueto%20tr.%29"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El%20barril%20de%20amontillado%20%28Cano%20y%20Cueto%20tr.%29"}],
      fuente: {"texto": "Historias extraordinarias, traducción de Manuel Cano y Cueto, Sevilla, Eduardo Perié, 1871, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/El_barril_de_amontillado_(Cano_y_Cueto_tr.)"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-barril-de-amontillado"},
      parecidos: ["poe-el-escarabajo-de-oro", "poe-el-gato-negro", "poe-la-carta-robada"]
    },
    {
      id: "fernan-caballero-la-gaviota",
      titulo: "La gaviota",
      autor: "Fernán Caballero",
      anio: "1849",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Novela de costumbres andaluzas de Fernán Caballero, seudónimo de Cecilia Böhl de Faber. Comienza con la llegada a España, en 1836, de un joven médico alemán, que conoce en Villamar a María, hija de un pescador, apodada la Gaviota. La historia sigue sus vidas entre el pueblo y las clases altas de Sevilla y Madrid, con retratos de tipos y costumbres de la época."},
      porque: {"es":"Para quien gusta de la vida de costumbres y de los retratos de gente de pueblo y de salón. Sirve a quienes quieren conocer una voz femenina de la literatura española del siglo XIX, y a quien desea ver cómo cambia una persona cuando cambia de ambiente.","en":"For readers who like novels of manners and portraits of village folk and drawing-room society. It suits those who want to know a woman's voice in nineteenth-century Spanish literature, and anyone curious about how a person changes when her surroundings change."},
      imagen: {"src": "img/portadas/fernan-caballero-la-gaviota.jpg", "credito": {"es": "Joaquín Sorolla, «Los pescadores con sus redes», 1896", "en": "Joaquín Sorolla, “Fishermen with Their Nets”, 1896"}, "url": "https://commons.wikimedia.org/wiki/File:Joaquín_Sorolla_y_Bastida_-_Los_pescadores_con_sus_redes.jpg"},
      citas: [
        "Mi ciencia, mi buena voluntad, mi juventud y mi confianza en Dios.",
        "las ruinas de un fuerte, obra humana que a nada resiste, a quien servían de base las rocas, obra de Dios, que resiste a todo.",
        "Se engañan mucho los que creen que la modestia y la humildad se ocultan siempre bajo la librea de la pobreza. No: los remiendos y las casuchas abrigan a veces más orgullo que los palacios."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/23600.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/23600"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 23600 (dominio público)", "url": "https://www.gutenberg.org/ebooks/23600"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-gaviota-0"},
      parecidos: ["fernan-caballero-el-alcazar-de-sevilla", "fernan-caballero-lagrimas", "hawthorne-la-letra-escarlata"]
    },
    {
      id: "fernan-caballero-lagrimas",
      titulo: "Lágrimas",
      autor: "Fernán Caballero",
      anio: "1850",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Novela de costumbres contemporáneas de Fernán Caballero. Se abre con una tempestad en alta mar, en cuyo barco agoniza una mujer. La protagonista, apodada Lágrimas, es una joven de los trópicos, modesta y humilde, y la historia vuelve a Villamar, el pueblo que ya conocían los lectores de La gaviota. Allí su sencillez contrasta con los tipos de la sociedad lugareña, que la autora retrata con su mirada de costumbrista. Lleva un prólogo de Antonio Cavanilles."},
      porque: {"es":"Para quien ya conoce «La gaviota» y quiere volver a Villamar, o busca una novela de costumbres con una protagonista sencilla frente a un entorno que la mira desde arriba. Es una lectura tranquila, de pueblo, que valora la humildad sin predicar.","en":"For anyone who already knows «La gaviota» and wants to return to Villamar, or who looks for a novel of manners with a simple heroine facing surroundings that look down on her. A quiet, small-town read that values humility without preaching."},
      imagen: {"src": "img/portadas/fernan-caballero-lagrimas.jpg", "credito": {"es": "Ivan Aivazovsky, «Tempest by Sounion», 1856", "en": "Ivan Aivazovsky, «Tempest by Sounion», 1856"}, "url": "https://commons.wikimedia.org/wiki/File:Ivan_Aivazovsky_-_Tempest_by_Sounion.jpg"},
      citas: [
        "La compasión inactiva es un cuerpo sin alma. Es un deber gastar todas nuestras facultades en ver el modo de proporcionar alivio a los que padecen aunque no lo logremos.",
        "Que la bondad es el suave óleo que debe ungir todos los ejes sobre los que giran nuestras acciones y relaciones con todo el mundo, y hasta con los animales, pobres seres desvalidos que tiraniza el hombre.",
        "Su alma era como el cristal, la empañaba un soplo, la traspasaba un rayo de sol, un choque la hubiese quebrado: almas de ángeles que tienen su mayor mérito en ignorar lo que valen; que no lloran sobre él, sino sobre el dolor, que es herencia común.",
        "Débese ejercer, no por mayor y en teorías; pero al pormenor y en práctica. Débese emplear, no como arma contra los ricos, sino como auxilio para los pobres."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/L%C3%A1grimas_(Fern%C3%A1n_Caballero)"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=L%C3%A1grimas%20%28Fern%C3%A1n%20Caballero%29"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=L%C3%A1grimas%20%28Fern%C3%A1n%20Caballero%29"}],
      fuente: {"texto": "Edición de Madrid, Establecimiento Tipográfico de Mellado, 1862, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/L%C3%A1grimas_(Fern%C3%A1n_Caballero)"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/lagrimas"},
      parecidos: ["fernan-caballero-el-alcazar-de-sevilla", "fernan-caballero-la-gaviota", "hawthorne-la-letra-escarlata"]
    },
    {
      id: "hawthorne-la-letra-escarlata",
      titulo: "La letra escarlata",
      autor: "Nathaniel Hawthorne (trad. Francisco Sellén)",
      anio: "1850",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Novela ambientada en la colonia puritana de Boston, en el siglo XVII. Hester Prynne es condenada por la comunidad a llevar bordada en el pecho una letra «A» escarlata, mientras guarda silencio sobre el padre de su hija. Alrededor de ella se mueven un joven ministro de la iglesia y un anciano médico recién llegado, y la obra explora la culpa, el secreto y el juicio de los demás. Se considera una de las grandes novelas norteamericanas del siglo XIX."},
      porque: {"es":"Para quien ha sentido el peso de ser juzgado por los demás, o de guardar un secreto. Hawthorne muestra qué hace la mirada de la comunidad, y qué hace el silencio, en quienes cargan una culpa. Es una lectura lenta que se queda en la memoria y da para conversar después.","en":"For anyone who has felt the weight of being judged by others, or of keeping a secret. Hawthorne shows what a community's gaze does, and what silence does, to those who carry guilt. A slow read that stays in the memory and gives you plenty to talk about afterwards."},
      imagen: {"src": "img/portadas/hawthorne-la-letra-escarlata.jpg", "credito": {"es": "Hugues Merle, «The Scarlet Letter» (encargado en 1859)", "en": "Hugues Merle, «The Scarlet Letter» (commissioned in 1859)"}, "url": "https://commons.wikimedia.org/wiki/File:Hugues_Merle_-_The_Scarlet_Letter_-_Walters_37172.jpg"},
      citas: [
        "¡Sé sincero! ¡Sé sincero! ¡Sé sincero! Muestra al mundo, sin ambajes, si no lo peor de tu naturaleza, por lo menos algún rasgo del que se pueda inferir lo peor.",
        "Es asunto digno de investigarse saber hasta qué punto el odio y el amor vienen a ser en realidad la misma cosa. Cada uno de estos sentimientos, en su más completo desarrollo, presupone un profundo e íntimo conocimiento del corazón humano.",
        "Había hablado la pura verdad, transformándola sin embargo en la falsedad más completa. Y no obstante esto, por instinto, por educación, por principios, amaba la verdad y aborrecía la mentira como pocos hombres."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/36990.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/36990"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 36990 (dominio público); versión castellana de Francisco Sellén, Nueva York, D. Appleton, 3.ª ed. 1903 (copyright 1894)", "url": "https://www.gutenberg.org/ebooks/36990"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-letra-escarlata"},
      parecidos: ["fernan-caballero-lagrimas", "fernan-caballero-la-gaviota", "poe-el-barril-de-amontillado"]
    },
    {
      id: "george-eliot-silas-marner",
      titulo: "Silas Marner",
      autor: "George Eliot (trad. anónima)",
      anio: "1861",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Silas Marner, un tejedor de pueblo acusado injustamente de un robo, debe abandonar su comunidad y se instala en la aldea de Raveloe, donde vive aislado y dedicado a su telar y a guardar su oro. Dos sucesos inesperados rompen su soledad: el robo de su tesoro y la aparición de una niña huérfana en su casa. La novela retrata la vida rural inglesa y el modo en que el afecto devuelve a un hombre a la comunidad."},
      porque: {"es":"Para quien ha perdido la confianza en la gente y se ha encerrado en su rutina. Es una historia sobria y cálida sobre cómo un cariño inesperado reabre la puerta a una persona endurecida. Se lee sin prisa y se recomienda tanto a jóvenes como a mayores.","en":"For anyone who has lost trust in people and shut themselves into routine. It is a sober, warm story about how unexpected affection reopens the door for a hardened person. It reads without hurry and can be recommended to young and old alike."},
      imagen: {"src": "img/portadas/george-eliot-silas-marner.jpg", "credito": {"es": "Hugh Thomson, ilustración para «Silas Marner»", "en": "Hugh Thomson, illustration for «Silas Marner»"}, "url": "https://commons.wikimedia.org/wiki/File:Silas_marner_0025.jpg"},
      citas: [
        "Antes su corazón era como un cofrecillo cerrado con llave y que contenía un tesoro; pero ahora el cofrecillo estaba vacío, y la cerradura rota.",
        "Sólo hubiese podido decir que la niña le había venido en lugar de su dinero: que su oro se había vuelto una criatura.",
        "Se encariñaba con aquella tierna criatura que le había sido mandada desde las tinieblas adonde se había marchado su oro."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/24823.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/24823"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 24823 (dominio público); edición de la Biblioteca de La Nación, Buenos Aires, 1919", "url": "https://www.gutenberg.org/ebooks/24823"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/silas-marner"},
      parecidos: ["dostoyevski-el-jugador", "fernan-caballero-lagrimas", "hawthorne-la-letra-escarlata"]
    },
    {
      id: "fernan-caballero-el-alcazar-de-sevilla",
      titulo: "El Alcázar de Sevilla",
      autor: "Fernán Caballero (Cecilia Böhl de Faber)",
      anio: "1862",
      idioma: "es",
      categoria: "ensayo",
      recomendado: false,
      resumen: {"es": "Fernán Caballero guía al lector por el Real Alcázar de Sevilla y lo describe de sala en sala: los patios, el salón de Embajadores, las galerías con sus artesonados y mosaicos, y los jardines con sus rincones. Mezcla la descripción con la memoria de los reyes y las épocas que habitaron el palacio, y no oculta su cariño por el lugar. Es un texto breve del siglo XIX, a medio camino entre la crónica de viaje y la evocación literaria de una ciudad. Sirve de recorrido por un monumento y de muestra de la prosa de la autora de «La Gaviota»."},
      porque: {"es":"Para quien viaja a Sevilla, o sueña con hacerlo, y prefiere llegar con una guía escrita con cariño y no con datos secos. Es corta y se lee en una tarde. También sirve para conocer la prosa de Fernán Caballero lejos de la novela, en un tono más personal.","en":"For anyone travelling to Seville, or dreaming of it, who would rather arrive with a guide written with affection than with dry facts. It is short and can be read in an afternoon. It is also a chance to meet the prose of Fernán Caballero away from the novel, in a more personal tone."},
      imagen: {"src": "img/portadas/fernan-caballero-el-alcazar-de-sevilla.jpg", "credito": {"es": "Photoglob Co., «Patio de las Doncellas, Alcázar de Sevilla», c. 1890", "en": "Photoglob Co., «Court of the Maidens, Alcázar of Seville», c. 1890"}, "url": "https://commons.wikimedia.org/wiki/File%3ASevilla._Alc%C3%A1zar._Patio_de_las_Doncellas_LCCN2017660794.jpg"},
      citas: [
        "¡Lo pasado es tan poético! ¡Lo porvenir lo es tan poco! Hay más mérito en amar lo que fue, que en amar lo que será.",
        "Para evitar, Soberano Señor, que si encuentro agradable la salsa, vaya a antojárseme la perdiz.",
        "Se alza de trecho en trecho una de sus torres, como un roble entre las zarzas que lo oprimen, para respirar en ancha atmósfera y no ahogarse mezquinamente.",
        "Hay otra cosa en estos jardines, que sin ser cosa artística ni regia, sin recuerdo histórico y sin ayuda del tiempo ni del hombre, encanta, y admira, y es un ruiseñor que no busca recuerdos ni bellezas, sino verde hojarasca"
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El_Alc%C3%A1zar_de_Sevilla"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El%20Alc%C3%A1zar%20de%20Sevilla"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El%20Alc%C3%A1zar%20de%20Sevilla"}],
      fuente: {"texto": "Transcripción de es.wikisource (dominio público)", "url": "https://es.wikisource.org/wiki/El_Alc%C3%A1zar_de_Sevilla"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-alcazar-de-sevilla"},
      parecidos: ["fernan-caballero-la-gaviota", "fernan-caballero-lagrimas", "mansilla-excursion-a-los-indios-ranqueles"]
    },
    {
      id: "dostoyevski-el-jugador",
      titulo: "El jugador",
      autor: "Fiódor Dostoyevski (trad. Alfonso Nadal)",
      anio: "1866",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Alexei, un joven preceptor ruso, acompaña a la familia de un general arruinado a Ruletenburg, una ciudad balneario alemana. Allí todos esperan la herencia de una anciana pariente, mientras Alexei vive pendiente de Paulina, y la ruleta pasa de entretención a obsesión. Dostoyevski escribió la novela con prisa, en 1866, presionado por sus propias deudas. Esta edición es la traducción de Alfonso Nadal, publicada en Madrid en 1928."},
      porque: {"es":"Para quien quiere entender la obsesión desde dentro, sin sermón: Dostoyevski retrata cómo una afición se vuelve cadena y cómo uno se miente a sí mismo. Es una entrada más breve y ágil que sus novelas grandes, útil para quien teme empezar por Rusia.","en":"For readers who want to understand obsession from the inside, without a sermon: Dostoevsky shows how a pastime turns into a chain and how a person lies to himself. It is a shorter, quicker way in than his big novels, useful for anyone nervous about starting with Russia."},
      imagen: {"src": "img/portadas/dostoyevski-el-jugador.jpg", "credito": {"es": "Edvard Munch, «En la mesa de ruleta en Monte Carlo», 1892", "en": "Edvard Munch, «At the Roulette Table in Monte Carlo», 1892"}, "url": "https://commons.wikimedia.org/wiki/File%3AEdvard_Munch_-_At_the_Roulette_Table_in_Monte_Carlo_-_MM.M.00050_-_Munch_Museum.jpg"},
      citas: [
        "¿Qué soy ahora? Un cero. ¿Qué puedo ser mañana? ¡Mañana puedo resucitar de entre los muertos, comenzar una vida nueva! Puedo descubrir al hombre que hay en mí todavía en tanto que no esté hundido del todo.",
        "Paso días enteros junto al tapete verde observando el juego, sueño con él, me siento embrutecido y me veo cubierto de lodo, como si hubiera caído en una charca.",
        "No sólo ha renunciado usted a la vida, a los intereses personales y sociales, a los deberes de hombre y de ciudadano, a sus amigos... ha renunciado también a sus recuerdos, todo a causa del juego.",
        "Quizás estas sensaciones múltiples, lejos de saciar el alma, no hacen más que irritarla y hacer que exija sensaciones nuevas, cada vez más intensas hasta el agotamiento total."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El_jugador"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El%20jugador"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El%20jugador"}],
      fuente: {"texto": "Edición de Madrid, 1928 (Góngora), traducción de Alfonso Nadal, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/El_jugador"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-jugador-0"},
      parecidos: ["george-eliot-silas-marner", "perez-galdos-el-19-de-marzo-y-el-2-de-mayo", "perez-galdos-la-corte-de-carlos-iv"]
    },
    {
      id: "mansilla-excursion-a-los-indios-ranqueles",
      titulo: "Una excursión a los indios ranqueles",
      autor: "Lucio V. Mansilla",
      anio: "1870",
      idioma: "es",
      categoria: "ensayo",
      recomendado: false,
      resumen: {"es": "En 1870 el coronel Lucio V. Mansilla salió de la frontera de Córdoba hacia las tolderías de los indios ranqueles para tratar un acuerdo de paz. Cuenta el viaje en cartas a su amigo Santiago, con humor, digresiones y una mirada atenta a las costumbres, el idioma y la hospitalidad de los indígenas. Entre parlamentos, fiestas y noches de campamento, retrata al cacique Mariano Rosas y a los hombres que lo rodean. Es una crónica clásica de la frontera argentina del siglo XIX, en dos tomos."},
      porque: {"es":"Para quien quiere conocer la frontera del siglo XIX desde un testigo que conversa, bromea y observa con curiosidad. La forma de cartas hace la lectura amena, y el libro ayuda a comprender un encuentro entre dos mundos con sus matices. Es largo, pero se puede avanzar por episodios.","en":"For readers who want to know the nineteenth-century frontier through a witness who chats, jokes and observes with curiosity. The letter form makes for pleasant reading, and the book helps one grasp an encounter between two worlds in all its nuance. It is long, but it can be read episode by episode."},
      imagen: {"src": "img/portadas/mansilla-excursion-a-los-indios-ranqueles.jpg", "credito": {"es": "Johann Moritz Rugendas, «El regreso de la cautiva», 1838", "en": "Johann Moritz Rugendas, «The Return of the Captive Woman», 1838"}, "url": "https://commons.wikimedia.org/wiki/File%3AEl_Regreso_de_la_Cautiva_-Buenos_Aires,_seg%C3%BAn_Rugendas.tif"},
      citas: [
        "Es indudable que la civilización tiene sus ventajas sobre la barbarie; pero no tantas como aseguran los que se dicen civilizados.",
        "La civilización consiste, si yo me hago una idea exacta de ella, en varias cosas. En usar cuellos de papel, que son los más económicos, botas de charol y guantes de cabritilla. En que haya muchos médicos y muchos enfermos, muchos abogados y muchos pleitos, muchos soldados y muchas guerras, muchos ricos y muchos pobres.",
        "Ni el amor, ni el odio, ni el dolor, ni la alegría, absorben por completo la existencia de ningún mortal. Sólo Dios es imperecedero.",
        "La amistad no se mide, se prueba.",
        "Digan lo que quieran, si la felicidad existe, si la podemos concretar y definir, ella está en los extremos."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg, tomo I", "url": "https://www.gutenberg.org/ebooks/63600.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg, tomo I", "url": "https://www.gutenberg.org/ebooks/63600"}, {"formato": "epub", "texto": "Project Gutenberg, tomo II", "url": "https://www.gutenberg.org/ebooks/63767.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg, tomo II", "url": "https://www.gutenberg.org/ebooks/63767"}],
      fuente: {"texto": "Project Gutenberg, libros n.º 63600 y 63767 (edición de Buenos Aires, 1909; dominio público)", "url": "https://www.gutenberg.org/ebooks/63600"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/una-excursion-los-indios-ranqueles"},
      parecidos: ["fernan-caballero-el-alcazar-de-sevilla", "moratin-origenes-teatro-espanol", "moratin-la-derrota-de-los-pedantes"]
    },
    {
      id: "hernandez-martin-fierro",
      titulo: "Martín Fierro",
      autor: "José Hernández",
      anio: "1872",
      idioma: "es",
      categoria: "poesia",
      recomendado: false,
      resumen: {"es": "Poema narrativo en dos partes, «El gaucho Martín Fierro» (1872) y «La vuelta de Martín Fierro» (1879), sobre la vida de un paisano de la pampa argentina. Martín Fierro, un hombre trabajador, es llevado a la fuerza a servir en la frontera, pierde su hogar y su vida cambia para siempre; lo cuenta cantando al compás de la guitarra. La segunda parte recoge su regreso, sus encuentros y los consejos que deja a sus hijos. Es el poema nacional argentino y un testimonio de las penurias y la cultura del gaucho."},
      porque: {"es":"Para quien quiere conocer una de las voces fundacionales de la poesía de América y entender el alma del paisano de la pampa. Los versos, hechos para cantarse, se leen mejor en voz alta y se recuerdan solos. Los consejos de la segunda parte siguen hablando de la familia y de la amistad.","en":"For readers who want to know one of the founding voices of Latin American poetry and to understand the soul of the countryman of the pampa. The verses, made to be sung, are best read aloud and stay in the memory on their own. The advice in the second part still speaks about family and friendship."},
      imagen: {"src": "img/portadas/hernandez-martin-fierro.jpg", "credito": {"es": "Juan León Pallière, «Idilio criollo», c. 1861", "en": "Juan León Pallière, «Creole Idyll», c. 1861"}, "url": "https://commons.wikimedia.org/wiki/File%3AIdilio_criollo_-_Juan_Le%C3%B3n_Palli%C3%A8re.jpg"},
      citas: [
        "Aquí me pongo a cantar / Al compás de la vigüela, / Que el hombre que lo desvela / Una pena extraordinaria / Como la ave solitaria / Con el cantar se consuela.",
        "Los hermanos sean unidos / porque ésa es la ley primera / tengan unión verdadera / en cualquier tiempo que sea, / porque, si entre ellos pelean, / los devoran los de ajuera.",
        "Muchas cosas pierde el hombre / que a veces las vuelve a hallar; / pero les debo enseñar, / y es gúeno que lo recuerden: / si la vergüenza se pierde, / jamás se vuelve a encontrar.",
        "Ave de pico encorvado / le tiene al robo afición; / pero el hombre de razón / no roba jamás un cobre, / pues no es vergüenza ser pobre / y es vergüenza ser ladrón.",
        "El primer cuidao del hombre / es defender el pellejo. / Lleváte de mi consejo, / fijáte bien en lo que hablo: / el diablo sabe por diablo, / pero más sabe por viejo."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg, El gaucho Martín Fierro", "url": "https://www.gutenberg.org/ebooks/14765.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg, El gaucho Martín Fierro", "url": "https://www.gutenberg.org/ebooks/14765"}, {"formato": "epub", "texto": "Project Gutenberg, La vuelta de Martín Fierro", "url": "https://www.gutenberg.org/ebooks/15066.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg, La vuelta de Martín Fierro", "url": "https://www.gutenberg.org/ebooks/15066"}],
      fuente: {"texto": "Project Gutenberg, libros n.º 14765 y 15066 (dominio público)", "url": "https://www.gutenberg.org/ebooks/14765"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/martin-fierro"},
      parecidos: ["dario-cantos-de-vida-y-esperanza", "lope-la-gatomaquia", "cervantes-viaje-al-parnaso"]
    },
    {
      id: "perez-galdos-el-19-de-marzo-y-el-2-de-mayo",
      titulo: "El 19 de marzo y el 2 de mayo",
      autor: "Benito Pérez Galdós",
      anio: "1873",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Tercer Episodio nacional. En marzo de 1808 Gabriel Araceli trabaja como cajista en la imprenta del «Diario de Madrid» y vive de cerca los sucesos que cambian el país: el motín de Aranjuez contra Godoy y la entrada de los franceses en Madrid. El relato llega hasta el levantamiento popular del 2 de mayo, con figuras como Daoiz, y mezcla la historia con los amores y las preocupaciones del narrador. Galdós cuenta en primera persona cómo un pueblo comienza una guerra."},
      porque: {"es":"Para quien quiere aprender historia de España con el tono de un testigo: Galdós cuenta los días de 1808 con el pulso de un muchacho común, no de un general. Sirve a quien empieza los Episodios nacionales y quiere ver cómo una gran guerra nace desde la calle.","en":"For readers who want to learn Spanish history in the voice of an eyewitness: Galdós tells the days of 1808 through the pulse of an ordinary young man, not a general. It suits anyone starting the Episodios nacionales who wants to see how a great war begins in the street."},
      imagen: {"src": "img/portadas/perez-galdos-el-19-de-marzo-y-el-2-de-mayo.jpg", "credito": {"es": "Francisco de Goya, «El 2 de mayo de 1808 en Madrid (La carga de los mamelucos)», 1814", "en": "Francisco de Goya, «The Second of May 1808 (The Charge of the Mamelukes)», 1814"}, "url": "https://commons.wikimedia.org/wiki/File%3AEl_dos_de_mayo_de_1808_en_Madrid.jpg"},
      citas: [
        "Pasan años y más años: las revoluciones se suceden, hechas en comandita por los grandes hombres y por el vulgo, sin que todo lo demás que existe en medio de estas dos extremidades se tome el trabajo de hacer sentir su existencia.",
        "El hombre es así. Gusta mucho de las caídas, y el día en que un poderoso de la tierra viene al suelo siempre es un día feliz.",
        "Mi vida al principio era tan triste y tan uniforme como aquel oficio, que en sus rudimentos esclaviza la inteligencia sin entretenerla"
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/67189.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/67189"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 67189 (edición de 1907; dominio público)", "url": "https://www.gutenberg.org/ebooks/67189"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/ep-nac-1a-3-el-19-de-marzo-y-el-2-de-mayo"},
      parecidos: ["galdos-batalla-arapiles", "galdos-de-onate-a-la-granja", "galdos-equipaje-rey-jose"]
    },
    {
      id: "perez-galdos-la-corte-de-carlos-iv",
      titulo: "La corte de Carlos IV",
      autor: "Benito Pérez Galdós",
      anio: "1873",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Segundo de los Episodios nacionales. En 1807 Gabriel Araceli vive en Madrid como criado de una actriz del teatro del Príncipe y desde allí asiste a la vida de la capital y a las intrigas de la Corte. El favorito Godoy, el príncipe Fernando y la conspiración de El Escorial forman el telón de fondo de una historia en que también hay amores y enredos personales. Galdós retrata la España de vísperas de la invasión francesa a través de los ojos de un joven que tiene que abrirse paso."},
      porque: {"es":"Sirve a quien quiere entender cómo se llegó a la crisis de 1808 sin abrir un manual de historia. Mirar la Corte desde el piso de un criado enseña que el poder también se ve desde abajo, y Galdós lo cuenta con ritmo de folletín, ameno de leer.","en":"A good pick if you want to understand how Spain slid into the crisis of 1808 without opening a history textbook. Watching the Court from a servant's point of view shows that power looks different from below, and Galdós tells it at the pace of a serial novel, easy and entertaining to read."},
      imagen: {"src": "img/portadas/perez-galdos-la-corte-de-carlos-iv.jpg", "credito": {"es": "Francisco de Goya, «La familia de Carlos IV», 1800-1801", "en": "Francisco de Goya, «The Family of Charles IV», 1800-1801"}, "url": "https://commons.wikimedia.org/wiki/File%3ALa_familia_de_Carlos_IV.jpg"},
      citas: [
        "Pues tú pensando en ser hombre ilustre y poderoso, sin ser noble, ni rico, ni sabio, eres como una tortuga que se empeñara en subir volando al pico más alto de Guadarrama.",
        "Si esa personita le sube a usted, será como si un águila o buitre cogiera por su concha a la tortuga para llevársela por los aires. Sí, te levantará; pero cuando estés arriba, el pájaro no va a estarse toda la vida con tanto peso en las alas, te dirá: «Ahora, niño mío, mantente solo.»",
        "La verdad es que había mucha hipocresía entonces: porque las cosas no se hicieran en público, no dejaban de hacerse, y siendo menos libres las costumbres, no por eso eran mejores.",
        "En cuanto a mí, siempre me han hecho gracia estos tipos de la vanidad humana, que son sin disputa los que más divierten y los que más enseñan."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/67155.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/67155"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 67155 (edición de Madrid, 1886; dominio público)", "url": "https://www.gutenberg.org/ebooks/67155"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-corte-de-carlos-iv"},
      parecidos: ["galdos-batalla-arapiles", "galdos-de-onate-a-la-granja", "galdos-equipaje-rey-jose"]
    },
    {
      id: "perez-galdos-trafalgar",
      titulo: "Trafalgar",
      autor: "Benito Pérez Galdós",
      anio: "1873",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Primer libro de los Episodios nacionales. Gabriel Araceli, un muchacho del barrio gaditano de la Viña, cuenta cómo en 1805 se vio metido en el combate naval de Trafalgar, entre la escuadra franco-española y la de Nelson. A su lado van marinos veteranos, entre ellos el viejo Marcial, cuyas discusiones y recuerdos muestran cómo se vivía la guerra desde abajo. Galdós mezcla la historia de España con la vida de la gente común y abre así la serie con que retrató el siglo XIX."},
      porque: {"es":"Es la puerta de entrada más cómoda a los Episodios nacionales: corto, vivo y contado por un muchacho que no entiende del todo lo que presencia. Ayuda a ver la guerra sin héroes de bronce, con la mirada de la gente común que la sufre.","en":"The easiest way into the Episodios nacionales: short, lively and told by a boy who does not fully grasp what he is witnessing. It helps you see war without bronze heroes, through the eyes of the ordinary people who live through it."},
      imagen: {"src": "img/portadas/perez-galdos-trafalgar.jpg", "credito": {"es": "J. M. W. Turner, «La batalla de Trafalgar, 21 de octubre de 1805», 1822-1824", "en": "J. M. W. Turner, «The Battle of Trafalgar, 21 October 1805», 1822-1824"}, "url": "https://commons.wikimedia.org/wiki/File%3ATurner_-_The_Battle_of_Trafalgar,_21_October_1805,_1822%E2%80%931824,_BHC0565.jpg"},
      citas: [
        "Por primera vez entonces percibí con completa claridad la idea de la patria, y mi corazón respondió a ella con espontáneos sentimientos, nuevos hasta aquel momento en mi alma.",
        "Pensé que también ellos tendrían su patria querida, que ésta les habría confiado la defensa de su honor; me pareció que en aquella tierra, para mí misteriosa, que se llamaba Inglaterra, habían de existir, como en España, muchas gentes honradas",
        "Cercano al sepulcro, y considerándome el más inútil de los hombres, ¡aún haces brotar lágrimas de mis ojos, amor santo de la patria!"
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/16961.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/16961"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 16961 (dominio público)", "url": "https://www.gutenberg.org/ebooks/16961"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/trafalgar-0"},
      parecidos: ["galdos-batalla-arapiles", "galdos-de-onate-a-la-granja", "galdos-equipaje-rey-jose"]
    },
    {
      id: "verne-la-vuelta-al-mundo-en-80-dias",
      titulo: "La vuelta al mundo en ochenta días",
      autor: "Julio Verne (trad. Vicente Guimerá)",
      anio: "1873",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "En 1872, Phileas Fogg, un caballero inglés de hábitos exactos, apuesta con sus compañeros del Reform Club que puede dar la vuelta al mundo en ochenta días. Parte esa misma noche con su criado Picaporte, y el viaje por tren, barco, elefante y trineo se llena de contratiempos, además de un detective que lo sigue creyéndolo un ladrón. La novela es una carrera contra el calendario por la India, Asia y Estados Unidos, y todo depende de la puntualidad. Esta edición es la traducción de Vicente Guimerá, publicada en Madrid en 1885."},
      porque: {"es":"Para quien busca una lectura que se avance sola, de esas que se devoran en un fin de semana. Verne convierte una apuesta en una carrera contra el reloj y, de paso, regala un buen rato de buen humor, ideal para lectores jóvenes o para volver a la aventura de la infancia.","en":"For anyone looking for a book that practically reads itself, the kind you finish in a weekend. Verne turns a bet into a race against the clock and, along the way, offers a good dose of humor. It suits young readers as much as adults who miss the adventures of childhood."},
      imagen: {"src": "img/portadas/verne-la-vuelta-al-mundo-en-80-dias.jpg", "credito": {"es": "Alphonse de Neuville y Léon Benett, ilustración de «La vuelta al mundo en ochenta días», 1872", "en": "Alphonse de Neuville and Léon Benett, illustration for «Around the World in Eighty Days», 1872"}, "url": "https://commons.wikimedia.org/wiki/File%3A'Around_the_World_in_Eighty_Days'_by_Neuville_and_Benett_06.jpg"},
      citas: [
        "Pero, ¿qué había ganado con esa excursión? ¿Qué había traído de su viaje? Nada, se dirá. Nada, enhorabuena, a no ser una linda mujer, que, por inverosímil que parezca, le hizo el más feliz de los hombres. Y en verdad, ¿no se daría por menos que eso la vuelta al mundo?",
        "No existe lo imprevisto.",
        "Un mínimo bien empleado basta para todo.",
        "Sabía que en la vida hay que dedicar mucho al rozamiento, y como el rozamiento entorpece, no se rozaba con nadie."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/La_vuelta_al_mundo_en_ochenta_d%C3%ADas"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=La%20vuelta%20al%20mundo%20en%20ochenta%20d%C3%ADas"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=La%20vuelta%20al%20mundo%20en%20ochenta%20d%C3%ADas"}],
      fuente: {"texto": "Edición de Madrid, 1885 (Sáenz de Jubera), traducción de Vicente Guimerá, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/La_vuelta_al_mundo_en_ochenta_d%C3%ADas"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-vuelta-al-mundo-en-80-dias"},
      parecidos: ["perez-galdos-el-19-de-marzo-y-el-2-de-mayo", "perez-galdos-la-corte-de-carlos-iv", "perez-galdos-trafalgar"]
    },
    {
      id: "perez-galdos-juan-martin-el-empecinado",
      titulo: "Juan Martín el Empecinado",
      autor: "Benito Pérez Galdós",
      anio: "1874",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Noveno de los Episodios nacionales, dedicado a la guerra de guerrillas contra Napoleón. Galdós deja un momento las grandes batallas y las luchas políticas para contar el levantamiento del pueblo en los campos, con partidas que nacen en la tierra y se organizan sin ayuda del Estado. El centro del relato es Juan Martín Díez, el Empecinado, jefe guerrillero popular, y la campaña de 1811 en torno a Guadalajara y Valencia. Es una mirada a esa guerra irregular que sostuvo la resistencia española."},
      porque: {"es":"Muestra que una nación puede resistir desde la base, sin generales ni decretos. Sirve a quien quiere pensar qué mueve a un hombre del campo a levantarse contra un ejército poderoso, y a quien disfruta de un Galdós más rural y menos cortesano.","en":"It shows that a nation can resist from the ground up, without generals or decrees. It suits anyone who wonders what moves a countryman to rise against a powerful army, and readers who enjoy a Galdós who is more rural and less courtly."},
      imagen: {"src": "img/portadas/perez-galdos-juan-martin-el-empecinado.jpg", "credito": {"es": "Francisco de Goya, «Juan Martín Díez, el Empecinado», c. 1814-1815", "en": "Francisco de Goya, «Juan Martín Díez, the Empecinado», c. 1814-1815"}, "url": "https://commons.wikimedia.org/wiki/File%3AJuan_Mart%C3%ADn_D%C3%ADez,_el_Empecinado_by_Goya.jpg"},
      citas: [
        "Hablaremos ahora de las guerrillas, que son la verdadera guerra nacional; del levantamiento del pueblo en los campos; de aquellos ejércitos espontáneos, nacidos en la tierra como la yerba nativa, cuya misteriosa simiente no arrojaron las manos del hombre.",
        "Los guerrilleros constituyen nuestra esencia nacional. Ellos son nuestro cuerpo y nuestra alma; son el espíritu, el genio, la Historia de España; ellos son todo, grandeza y miseria, un conjunto informe de cualidades contrarias, la dignidad dispuesta al heroísmo, la crueldad inclinada al pillaje.",
        "Hay algo más: hay ambición de gloria, de llevar a cabo grandes proezas, de asombrar al mundo con el poder de un solo hombre; hay un ansia horrorosa de que ningún nacido valga más que yo, ni pueda más que yo."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/67705.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/67705"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 67705 (edición de 1908; dominio público)", "url": "https://www.gutenberg.org/ebooks/67705"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/ep-nac-1a-9-juan-martin-el-empecinado"},
      parecidos: ["galdos-batalla-arapiles", "galdos-de-onate-a-la-granja", "galdos-equipaje-rey-jose"]
    },
    {
      id: "perez-galdos-napoleon-en-chamartin",
      titulo: "Napoleón en Chamartín",
      autor: "Benito Pérez Galdós",
      anio: "1874",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Quinto de los Episodios nacionales. A fines de 1808 Napoleón se instala en Chamartín, a las puertas de Madrid, y la ciudad se prepara para resistir o rendirse. Gabriel Araceli sigue allí los pasos de personajes madrileños, entre ellos el conde de Rumblar, y retrata la vida de una capital dividida entre la defensa y el miedo. Galdós combina las escenas históricas, como las jornadas de Somosierra y el cerco de la capital, con las historias personales de sus protagonistas."},
      porque: {"es":"Muy útil para sentir cómo se vive una ciudad que espera al invasor: el miedo, las dudas y las ganas de resistir conviven en las mismas calles. Quien ya leyó los primeros Episodios encontrará aquí un Madrid más tenso y más humano.","en":"Very useful for feeling what it is like to live in a city waiting for the invader: fear, doubt and the will to resist share the same streets. Readers who have already enjoyed the first Episodios will find here a tenser and more human Madrid."},
      imagen: {"src": "img/portadas/perez-galdos-napoleon-en-chamartin.jpg", "credito": {"es": "Antoine-Jean Gros, «Capitulación de Madrid, 4 de diciembre de 1808», 1810", "en": "Antoine-Jean Gros, «Capitulation of Madrid, 4 December 1808», 1810"}, "url": "https://commons.wikimedia.org/wiki/File%3AAntoine-Jean_Gros_-_Capitulation_de_Madrid,_le_4_d%C3%A9cembre_1808.jpg"},
      citas: [
        "Levantábase tarde, y después de dar cuerda a sus relojes, se ponía a disposición del peluquero, quien en poco más de hora y media le arreglaba la cabeza por fuera, que por dentro solo Dios pudiera hacerlo.",
        "Parece, en verdad, mentira que Moratín y Rabadán, que Comella y Meléndez hayan vivido en un mismo siglo. Pero España es así.",
        "¿Tú sabes lo que significa cumplir uno con su deber? ¿Tú sabes lo que significa el honor? Y si sabes todo esto, ¿ignoras lo que es la honra de la patria, que vale más que la propia honra?"
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/67360.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/67360"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 67360 (edición de 1907; dominio público)", "url": "https://www.gutenberg.org/ebooks/67360"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/ep-nac-1a-5-napoleon-en-chamartin"},
      parecidos: ["galdos-batalla-arapiles", "galdos-de-onate-a-la-granja", "galdos-equipaje-rey-jose"]
    },
    {
      id: "galdos-batalla-arapiles",
      titulo: "La batalla de los Arapiles",
      autor: "Benito Pérez Galdós",
      anio: "1875",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Décimo episodio de la primera serie de los Episodios nacionales, narrado por Gabriel Araceli. En 1812 las tropas de Wellington avanzan por Castilla contra el ejército francés hasta chocar con él junto a Salamanca. Mientras tanto Gabriel sigue la pista de Santorcaz y de Inés, las personas que marcan su destino personal. La novela une la crónica de una batalla decisiva de la guerra de la Independencia con la historia íntima de su narrador."},
      porque: {"es":"Para el lector que ya se encariñó con Gabriel Araceli y quiere ver cómo cierra su camino: la batalla importa, pero lo que se queda es el destino de un hombre. Cierra la primera serie con pulso y deja ganas de seguir con Galdós.","en":"For the reader who has grown fond of Gabriel Araceli and wants to see where his path leads: the battle matters, but what stays with you is one man's fate. It closes the first series with energy and leaves you wanting more of Galdós."},
      imagen: {"src": "img/portadas/galdos-batalla-arapiles.jpg", "credito": {"es": "Francisco de Goya, «El duque de Wellington», c. 1812-1814", "en": "Francisco Goya, «The Duke of Wellington», c. 1812-1814"}, "url": "https://commons.wikimedia.org/wiki/File:Goya_-_Duke_of_Wellington_-_NG6322.jpg"},
      citas: [
        "La desesperación no es la principal fuente del valor",
        "Tornando a cargar con aquella constancia imperturbable que, si no es el heroísmo mismo, es lo que más se le parece",
        "Ellos suspenden el ánimo, despiertan la sensibilidad, avivan el valor, infunden entusiasmo por las grandes acciones, engrandecen la gloria y achican el peligro en todos los momentos de la vida.",
        "Retrocede la Historia, cansada de hacer tonterías, y con pueril entusiasmo hojea las páginas de su propio diario, y luego busca la espada en el cajón de los olvidados y sublimes juguetes"
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/67817.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/67817"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 67817 (dominio público). Edición de Madrid, Perlado, Páez y Compañía, 1907", "url": "https://www.gutenberg.org/ebooks/67817"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/ep-nac-1a-10-la-batalla-de-los-arapiles"},
      parecidos: ["galdos-de-onate-a-la-granja", "galdos-equipaje-rey-jose", "galdos-faccioso-mas-frailes-menos"]
    },
    {
      id: "galdos-equipaje-rey-jose",
      titulo: "El equipaje del rey José",
      autor: "Benito Pérez Galdós",
      anio: "1875",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Episodio nacional de la segunda serie. En marzo de 1813, cuando el rey José Bonaparte y su corte se preparan para dejar Madrid, el traslado de su equipaje cruza la vida de varios madrileños y de Salvador Monsalud, el protagonista de la serie. Galdós retrata el ocaso del dominio francés y la incertidumbre de una ciudad que no sabe qué vendrá después. La historia mezcla intriga, humor y afectos con el telón de fondo de la guerra de la Independencia."},
      porque: {"es":"Interesa a quien busca ver la historia desde su lado menos épico: el fin de un régimen visto en maletas, carros y vecinos desconcertados. Es una buena lectura para quien quiere entender cómo se vive un cambio de época sin saber aún qué viene.","en":"It appeals to those who like history from its least epic side: the end of a regime seen through luggage, carts and bewildered neighbors. A good read if you want to grasp what it feels like to live through a change of era without knowing what comes next."},
      imagen: {"src": "img/portadas/galdos-equipaje-rey-jose.jpg", "credito": {"es": "Robert Lefèvre, «José Bonaparte, rey de España», retrato", "en": "Robert Lefèvre, «Joseph Bonaparte, King of Spain», portrait"}, "url": "https://commons.wikimedia.org/wiki/File:Joseph_Bonaparte,_King_of_Spain,_by_Robert_Lefevre_-_Apsley_House_-_London,_UK_-_DSC06657.jpg"},
      citas: [
        "¿Por qué hemos de ver la Historia en los bárbaros fusilazos de algunos millares de hombres que se mueven como máquinas a impulsos de una ambición superior, y no hemos de verla en las ideas y en los sentimientos de ese joven oscuro?",
        "¡Si en la Historia no hubiera más que batallas; si sus únicos actores fueran las personas célebres, cuán pequeña sería! Está en el vivir lento y casi siempre doloroso de la sociedad, en lo que hacen todos y en lo que hace cada uno.",
        "En ella nada es indigno de la narración, así como en la naturaleza no es menos digno de estudio el olvidado insecto que la inconmensurable arquitectura de los mundos.",
        "Está escrito que en ciertos casos, tal vez siempre, el rostro de una mujer tenga mayores dimensiones y ocupe dentro del universo más grande espacio que las inmensidades materiales y morales de la patria."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/69578.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/69578"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 69578 (dominio público). Edición de Madrid, Sucesores de Hernando, 1908", "url": "https://www.gutenberg.org/ebooks/69578"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/ep-nac-2a-1-el-equipaje-del-rey-jose"},
      parecidos: ["galdos-batalla-arapiles", "galdos-de-onate-a-la-granja", "galdos-faccioso-mas-frailes-menos"]
    },
    {
      id: "galdos-memorias-cortesano-1815",
      titulo: "Memorias de un cortesano de 1815",
      autor: "Benito Pérez Galdós",
      anio: "1875",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Episodio nacional de la segunda serie, contado en primera persona por Juan Bragas de Pipaón, un funcionario que sirvió a José Bonaparte y que, tras la restauración de Fernando VII, busca hacerse un lugar en la corte. Pipaón relata con ironía sus trabajos, sus astucias y su ascenso entre las covachuelas y el Consejo de Castilla. A través de su voz, Galdós retrata las intrigas, los favores y las ambiciones de un Madrid que vuelve al absolutismo."},
      porque: {"es":"Un retrato irónico del oportunista que sabe sobrevivir a todos los gobiernos. Se disfruta por su humor seco y sirve para reconocer, hoy como entonces, las artes de quien medra cerca del poder. Buena lectura para quien guste de la sátira bien servida.","en":"An ironic portrait of the opportunist who knows how to survive every government. It is enjoyed for its dry humor and helps you recognize, today as then, the arts of those who climb near power. A fine read for anyone who likes satire well served."},
      imagen: {"src": "img/portadas/galdos-memorias-cortesano-1815.jpg", "credito": {"es": "Francisco de Goya, «Fernando VII con manto real», 1814-1815", "en": "Francisco Goya, «Ferdinand VII in his robes of state», 1814-1815"}, "url": "https://commons.wikimedia.org/wiki/File:Francisco_Goya_-_Portrait_of_Ferdinand_VII_of_Spain_in_his_robes_of_state_(1815)_-_Prado.jpg"},
      citas: [
        "Así es el absolutismo, hijo mío: sus palabras podrán ser bonitas, rosadas, luminosas y movibles; pero sus ideas son fijas, inmutables, pesadas. No mires lo de fuera, sino lo de dentro. Estudia el corazón de los hombres y no atiendas a lo que articulan los labios, que siempre han de pagar tributo a las conveniencias, a la moda, a las preocupaciones.",
        "No insultaba jamás a los vencidos, sin duda por la consideración de que pudieran ser vencedores.",
        "Casi siempre engaña la apariencia en los hombres de estado.",
        "Cuanto puede denigrar a los hombres la bajeza, la adulación, la falsedad, la doblez, la vil codicia, la envidia, la crueldad, todo lo acumuló aquel sexenio en su nefanda empolladura, que ni siquiera supo hacer el mal con talento."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/70868.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/70868"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 70868 (dominio público). Séptima edición, Madrid, Obras de Pérez Galdós, 1903", "url": "https://www.gutenberg.org/ebooks/70868"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/ep-nac-2a-2-memorias-de-un-cortesano-de-1815"},
      parecidos: ["galdos-batalla-arapiles", "galdos-de-onate-a-la-granja", "galdos-equipaje-rey-jose"]
    },
    {
      id: "flaubert-leyenda-san-julian",
      titulo: "La leyenda de San Julián el Hospitalario",
      autor: "Gustave Flaubert (trad. Luis Bello)",
      anio: "1877",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Cuento ambientado en la Edad Media sobre Julián, hijo de unos señores que viven en un castillo entre bosques. Apasionado por la caza desde joven, recibe un día un anuncio que le cambia la vida, y el relato sigue sus esfuerzos por escapar de ese destino y su largo camino de penitencia. Flaubert lo escribió inspirado en una antigua vidriera de la catedral de Ruan, con un estilo de crónica sobria y luminosa."},
      porque: {"es":"Para quien quiere probar a Flaubert en pocas páginas y en tono de leyenda antigua. Es un relato breve que invita a pensar en lo que ocurre cuando se huye de un destino, y se lee de una sentada con mucha atención a su imaginería medieval.","en":"For anyone who wants to try Flaubert in just a few pages and in the tone of an ancient legend. A short tale that invites you to think about what happens when someone runs from a destiny, and it can be read in one sitting, with attention to its medieval imagery."},
      imagen: {"src": "img/portadas/flaubert-leyenda-san-julian.jpg", "credito": {"es": "Atribuido a Franciabigio, «San Julián el Hospitalario encuentra a su esposa tras haber matado a sus padres», c. 1515", "en": "Attributed to Franciabigio, «Saint Julian the Hospitaller Meeting his Wife after Killing his Parents», c. 1515"}, "url": "https://commons.wikimedia.org/wiki/File:Attributed_to_Franciabigio,_Saint_Julian_the_Hospitaller_Meeting_his_Wife_after_Killing_his_Parents.jpg"},
      citas: [
        "El padre y la madre de Julián habitaban en un castillo en medio de los bosques, sobre la pendiente de una colina.",
        "¡Maldito! ¡Maldito! ¡Maldito! ¡Corazón de fiera! ¡Un día asesinarás a tu padre y a tu madre!",
        "El techo se desvaneció, el firmamento se desplegó, y Julián subió hacia los espacios azules cara a cara con Nuestro Señor Jesucristo, que le llevaba al Cielo.",
        "Y ésta es la historia de San Julián el Hospitalario, poco más o menos, tal como puede verse en un vitral de iglesia de mi país."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/La_leyenda_de_San_Julián_el_Hospitalario"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=La%20leyenda%20de%20San%20Juli%C3%A1n%20el%20Hospitalario"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=La%20leyenda%20de%20San%20Juli%C3%A1n%20el%20Hospitalario"}],
      fuente: {"texto": "Tres cuentos (Madrid, Tipográfica Renovación, 1919), traducción de Luis Bello, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/La_leyenda_de_San_Juli%C3%A1n_el_Hospitalario"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-leyenda-de-san-julian"},
      parecidos: ["flaubert-un-corazon-sencillo", "galdos-marianela", "galdos-batalla-arapiles"]
    },
    {
      id: "flaubert-un-corazon-sencillo",
      titulo: "Un corazón sencillo",
      autor: "Gustave Flaubert (trad. Luis Bello)",
      anio: "1877",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Cuento sobre Felicidad, la criada de la señora Aubain en Pont-l'Évêque, una mujer humilde que sirve durante medio siglo con una fidelidad silenciosa. Su vida, hecha de trabajo, de afectos que se le escapan y de una fe sencilla, transcurre en la Normandía del siglo XIX. Flaubert retrata con sobriedad y ternura a un personaje sin historia aparente, y el relato se cuenta entre sus mejores páginas."},
      porque: {"es":"Es un relato breve sobre una criada de provincia que casi nadie nota y que ama sin pedir nada: a los niños de la casa, a su sobrino, a un loro. Sirve a quien siente que su trabajo o su cariño pasan inadvertidos, y a quien quiere ver cómo se escribe con sobriedad. Se lee en una tarde; el final merece ir despacio.","en":"A short story about a provincial servant whom almost nobody notices and who loves without asking for anything: the children of the house, her nephew, a parrot. It speaks to anyone who feels their work or their affection goes unseen, and to anyone who wants to see how restraint is written. You can finish it in an afternoon; the ending deserves to be read slowly."},
      imagen: {"src": "img/portadas/flaubert-un-corazon-sencillo.jpg", "credito": {"es": "Eugène Boudin, «Honfleur, el puerto», c. 1858-1862", "en": "Eugène Boudin, «Honfleur, the Port», c. 1858-1862"}, "url": "https://commons.wikimedia.org/wiki/File:Eug%C3%A8ne_Boudin._Honfleur._Der_Hafen.jpg"},
      citas: [
        "Durante medio siglo, las vecinas acomodadas de Pont-l'Evêque envidiaron a la señora Aubain por su criada Felicidad.",
        "Simientes, mieses, lagares, todas estas cosas domésticas de que habla el Evangelio las tenía ella en su vida; Dios, al pasar, las había santificado, y así quiso con más ternura a los corderos por amor al Cordero, y a las palomas por causa del Espíritu Santo.",
        "Los latidos de su corazón iban retardándose uno a uno, cada vez más vagos, más dulces, como se agota una fuente, como desaparece un eco; y al exhalar el último suspiro creyó ella ver en los cielos, entreabiertos, un papagayo gigantesco volando sobre su cabeza."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Un_corazón_sencillo"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Un%20coraz%C3%B3n%20sencillo"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Un%20coraz%C3%B3n%20sencillo"}],
      fuente: {"texto": "Tres cuentos (Madrid, Tipográfica Renovación, 1919), traducción de Luis Bello, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/Un_coraz%C3%B3n_sencillo"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/un-corazon-sencillo-0"},
      parecidos: ["flaubert-leyenda-san-julian", "galdos-marianela", "galdos-batalla-arapiles"]
    },
    {
      id: "galdos-marianela",
      titulo: "Marianela",
      autor: "Benito Pérez Galdós",
      anio: "1878",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Un viajero se extravía en una región minera del norte de España y conoce a Nela, una muchacha pobre y poco agraciada que sirve de guía a Pablo, un joven ciego de nacimiento. Entre ambos crece un cariño sostenido por la imaginación del muchacho, hasta que llega el médico Teodoro Golfín con la promesa de devolverle la vista. La novela contrapone la belleza, la ciencia y la compasión en una historia de infancia y desencuentros."},
      porque: {"es":"Una de las novelas más queridas de Galdós y una buena puerta para quien aún no lo ha leído. Hace pensar en lo que vemos y en lo que preferimos no ver, y en cómo el cariño puede sostenerse sobre una imagen que luego se pone a prueba.","en":"One of Galdós's best-loved novels and a good entry point for those who have not read him yet. It makes you think about what we see and what we prefer not to see, and about how affection can rest on an image that is later put to the test."},
      imagen: {"src": "img/portadas/galdos-marianela.jpg", "credito": {"es": "John Everett Millais, «La niña ciega», 1854-1856", "en": "John Everett Millais, «The Blind Girl», 1854-1856"}, "url": "https://commons.wikimedia.org/wiki/File:John_Everett_Millais_-_The_Blind_Girl,_1854-56.jpg"},
      citas: [
        "Una palabra cariñosa, un halago, un trato delicado y amante que hicieran olvidar al pequeño su pequeñez, al miserable su miseria, son heroísmos de más precio que el bodrio sobrante de una mala comida.",
        "Hablaba el autor de la belleza, y decía que era el resplandor de la bondad y de la verdad, con otros muchos conceptos ingeniosos y tan bien traídos y pensados, que daba gusto oírlos.",
        "He podido comprender que la parte más maravillosa del universo es esa que me está vedada."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/17340.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/17340"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 17340 (dominio público). Texto de la edición de Madrid, 1878", "url": "https://www.gutenberg.org/ebooks/17340"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/marianela"},
      parecidos: ["galdos-batalla-arapiles", "galdos-de-onate-a-la-granja", "galdos-equipaje-rey-jose"]
    },
    {
      id: "galdos-faccioso-mas-frailes-menos",
      titulo: "Un faccioso más y algunos frailes menos",
      autor: "Benito Pérez Galdós",
      anio: "1879",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Vigésimo episodio de la segunda serie. Comienza en octubre de 1832, con la caída del ministro Calomarde y un país dividido por la sucesión de Fernando VII, y sigue a don Benigno Cordero y a Salvador Monsalud mientras la tensión política desemboca en las primeras partidas carlistas. Galdós mezcla las vidas de sus personajes con los sucesos de la corte y de las provincias. El título anticipa, con ironía, el clima de violencia que se avecina."},
      porque: {"es":"Para quien quiere entender cómo una familia política termina en guerra civil: aquí se ve nacer el conflicto carlista desde la casa y la conversación, antes de los cañones. Resulta aleccionador sobre cómo se rompe un país por pasos pequeños.","en":"For anyone who wants to understand how a political quarrel ends in civil war: here the Carlist conflict is born in homes and conversations, before the cannons. It is instructive about how a country breaks apart through small steps."},
      imagen: {"src": "img/portadas/galdos-faccioso-mas-frailes-menos.jpg", "credito": {"es": "Isidore Magués, «Zumalacárregui», litografía, 1837", "en": "Isidore Magués, «Zumalacárregui», lithograph, 1837"}, "url": "https://commons.wikimedia.org/wiki/File:Zumalac%C3%A1rregui-Magues.jpg"},
      citas: [
        "El alma, el alma, señor mío, es la que está enferma, y al alma se ha de aplicar la medicina. ¿Cuál es esta? Pues es un confortamiento dulce que se consigue mezclando la confianza con la paz y la indulgencia con la piedad.",
        "Renuncia a toda idea de violencia y asesinato. Pensando en un castigo imposible, te envenenas el alma. Renuncia también a la agitación de la política y no conspires, no seas instrumento de ambiciones de príncipes. Retírate a nuestro pueblo, busca en la paz la reparación que necesitas y cúrate con la medicina del olvido.",
        "Parece imposible que basten algunos años para que los ángeles se conviertan en demonios, y los hombres en fieras...",
        "En casa donde no existen ni los vínculos ni los afectos que constituyen la familia, donde la paz deja su puesto a la discordia y los vicios ocupan el lugar de la economía y la sobriedad, no pueden de modo alguno afincar las prosperidades."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/17443.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/17443"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 17443 (dominio público). Texto de la edición de Madrid, 1884", "url": "https://www.gutenberg.org/ebooks/17443"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/ep-nac-2a-10-un-faccioso-mas-y-unos-frailes-menos"},
      parecidos: ["galdos-batalla-arapiles", "galdos-de-onate-a-la-granja", "galdos-equipaje-rey-jose"]
    },
    {
      id: "pereda-pedro-sanchez",
      titulo: "Pedro Sánchez",
      autor: "José María de Pereda",
      anio: "1883",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Novela en primera persona en la que Pedro Sánchez recuerda su vida desde la infancia en un pueblo de la Montaña, en una casa hidalga venida a menos, hasta su aventura en Madrid. Allí intenta abrirse camino entre la política y la vida de la capital, entre ambiciones, amistades y desengaños. Pereda combina el retrato de costumbres de su tierra con la sátira de la sociedad madrileña de su tiempo."},
      porque: {"es":"Para quien disfruta una novela de formación contada en primera persona, con humor y buen ojo para el retrato. Pedro deja su aldea de la Montaña y en Madrid se topa con políticos de dos caras, ambiciones y amistades interesadas; Pereda lo cuenta sin amargura y con gracia. Léela si te interesa la política del siglo XIX, o si alguna vez dejaste tu pueblo para buscar futuro y después miraste atrás.","en":"For readers who enjoy a first-person coming-of-age novel with humour and a sharp eye for character. Pedro leaves his village in the mountains of Cantabria and in Madrid runs into two-faced politicians, ambition and self-interested friendships; Pereda tells it without bitterness and with wit. Read it if you are curious about nineteenth-century politics, or if you ever left your hometown to look for a future and later looked back."},
      imagen: {"src": "img/portadas/pereda-pedro-sanchez.jpg", "credito": {"es": "Carlos de Haes, «Los Picos de Europa», 1876", "en": "Carlos de Haes, “The Picos de Europa”, 1876"}, "url": "https://commons.wikimedia.org/wiki/File:Carlos_de_Haes_-_Los_picos_de_Europa.jpg"},
      citas: [
        "El que hace una pillada política, es un pillo como todos los pillos; quien no es honrado en su vida pública, tampoco puede serlo en su vida privada. ¡Ni que fuera la honra prenda de dos caras, o mueble de varios usos!",
        "Los hombres consecuentes y los escritores concienzudos son los primeros que se mueren de hambre en los tiempos que se usan.",
        "El que no se consuela es porque no quiere.",
        "El hombre, por sí, es tonto a cierta edad de la vida, sean cuales fueren los elementos que le rodeen; o lo que es lo mismo, que los resabios peculiares a la naturaleza humana, pueden corregirse con la educación, pero no desarraigarse."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/74981.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/74981"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 74981 (dominio público). Obras completas, tomo XIII, Madrid, 1904", "url": "https://www.gutenberg.org/ebooks/74981"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/pedro-sanchez-0"},
      parecidos: ["stevenson-isla-del-tesoro", "galdos-faccioso-mas-frailes-menos", "galdos-marianela"]
    },
    {
      id: "stevenson-isla-del-tesoro",
      titulo: "La isla del tesoro",
      autor: "Robert Louis Stevenson (trad. Manuel Caballero)",
      anio: "1883",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Jim Hawkins, hijo del dueño de una posada de la costa inglesa, narra cómo la llegada de un viejo marino lo arrastra a una expedición en busca de un tesoro enterrado en una isla lejana. A bordo del barco lo acompañan el caballero Trelawney, el doctor Livesey y una tripulación en la que no todos son de fiar, entre ellos el cocinero John Silver. Es la novela de aventuras marinas por excelencia, con mapas, piratas y lealtades que cambian de bando."},
      porque: {"es":"Un libro para leer a cualquier edad, y ojalá en voz alta a los más chicos. Stevenson logra que el miedo, la lealtad y la codicia se vean claros desde los ojos de un niño, y lo hace con una prosa tan ágil que se olvida que es un clásico.","en":"A book for any age, ideally read aloud to the little ones. Stevenson makes fear, loyalty and greed clear through a boy's eyes, and does it with prose so quick that you forget you are reading a classic."},
      imagen: {"src": "img/portadas/stevenson-isla-del-tesoro.jpg", "credito": {"es": "N. C. Wyeth, «Captain Bill Bones», 1911", "en": "N. C. Wyeth, «Captain Bill Bones», 1911"}, "url": "https://commons.wikimedia.org/wiki/File:N._C._Wyeth_-_Treasure_Island_-_Captain_Bill_Bones.jpg"},
      citas: [
        "Son quince los que quieren el cofre de aquel muerto, / Son quince ¡yo-ho-hó! son quince ¡viva el rom! / El diablo y la bebida hicieron todo el resto, / El diablo ¡yo-ho-hó! el diablo ¡viva el rom!",
        "Los muertos no muerden, Jim; esa es mi opinión, esa es mi fe, y así sea...",
        "Oigo el sordo mugido de la mar estrellándose en sus escarpadas costas, hasta que me despierto sudoroso sobre mi lecho tan luego como la pesadilla me hace oír la voz aguda y penetrante de Capitán Flint, gritando desesperadamente: «¡Piezas de a ocho! ¡Piezas de a ocho! ¡Piezas de a ocho!»"
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/45438.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/45438"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 45438 (dominio público). Traducción de Manuel Caballero, 1901", "url": "https://www.gutenberg.org/ebooks/45438"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-isla-del-tesoro"},
      parecidos: ["pereda-pedro-sanchez", "galdos-faccioso-mas-frailes-menos", "galdos-marianela"]
    },
    {
      id: "asensi-novelas-cortas",
      titulo: "Novelas cortas",
      autor: "Julia de Asensi",
      anio: "1889",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Colección de trece relatos breves de la escritora madrileña Julia de Asensi, entre ellos «La Noche-Buena», «Sor María», «Cosme y Damián» y «El aeronauta». Son historias de ambiente cotidiano y sentimental, con niños pobres, amores contrariados y vocaciones religiosas, escritas en un tono sencillo y con intención moral. Cada relato se lee por separado."},
      porque: {"es":"Son relatos breves de una escritora española del siglo XIX, con la moraleja a la vista: cumplir lo prometido, obedecer a los padres, entregarse sin esperar nada. Se leen de a uno por noche o en familia. No esperes sutileza; sí finales bien puestos, que dan qué conversar.","en":"These are short tales by a nineteenth-century Spanish woman writer, with the moral in plain sight: keep what you promise, obey your parents, give of yourself without expecting anything back. Read one a night, or share them with the family. Do not expect subtlety; do expect well-placed endings that give you something to talk about."},
      imagen: {"src": "img/portadas/asensi-novelas-cortas.jpg", "credito": {"es": "Antonio Muñoz Degrain (copia), «Coro de religiosas», 1874", "en": "After Antonio Muñoz Degrain, «Coro de religiosas» (Choir of Nuns), 1874"}, "url": "https://commons.wikimedia.org/wiki/File:Coro_de_religiosas_(Museo_del_Prado).jpg"},
      citas: [
        "Es que hay muchas maneras de volar; vuela el insecto, que se detiene en lo más inmundo, y el águila, que se eleva a la mayor altura.",
        "Creo que mi alma vale más que mi cuerpo, puesto que ella me quiso, mientras las demás mujeres que me vieron me desdeñaron.",
        "La vocación no sirve para nada sin la bendición de los padres y la ayuda de la Providencia."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Novelas_cortas_(Asensi)"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Novelas_cortas_%28Asensi%29"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Novelas_cortas_%28Asensi%29"}],
      fuente: {"texto": "Transcripción de es.wikisource (dominio público); edición de 1889", "url": "https://es.wikisource.org/wiki/Novelas_cortas_(Asensi)"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/novelas-cortas-0"},
      parecidos: ["hope-el-prisionero-de-zenda", "pereda-pedro-sanchez", "stevenson-isla-del-tesoro"]
    },
    {
      id: "hope-el-prisionero-de-zenda",
      titulo: "El prisionero de Zenda",
      autor: "Anthony Hope (trad. anónimo)",
      anio: "1894",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Rodolfo Raséndil, un caballero inglés de ánimo holgado, viaja a Ruritania para presenciar la coronación de un pariente lejano, el rey, a quien se parece de modo asombroso. Cuando el monarca cae víctima de una conjura de su hermanastro, Rodolfo se ve obligado a ocupar su lugar ante la corte. La novela mezcla intriga palaciega, duelos y una lealtad puesta a prueba, y dio origen a todo un género de aventuras en reinos imaginarios."},
      porque: {"es":"Para quien busca aventura con capa y espada, pero con humor y buen ritmo. Hace preguntarse qué hace falta para ser digno de un cargo, y se lee con la rapidez de una película de época. Ideal para un fin de semana largo.","en":"For anyone seeking cloak-and-dagger adventure with humor and a good pace. It makes you ask what it takes to be worthy of an office, and it reads as quickly as a period film. Ideal for a long weekend."},
      imagen: {"src": "img/portadas/hope-el-prisionero-de-zenda.jpg", "credito": {"es": "Charles Dana Gibson, «El castillo de Zenda», frontispicio de The Prisoner of Zenda, 1921", "en": "Charles Dana Gibson, «The Castle of Zenda», frontispiece of The Prisoner of Zenda, 1921"}, "url": "https://commons.wikimedia.org/wiki/File:The_Prisoner_of_Zenda_(1921)_frontispiece.jpg"},
      citas: [
        "Es usted más Elsberg que todos ellos. Pero yo he comido el pan del Rey y mi deber es servirle.",
        "Más noble y grande, por ese acto, ha llevado el cumplimiento de su deber para con su país y su regia estirpe hasta el punto de contraer matrimonio con el Rey, conquistando para este el amor de sus súbditos, asegurando la paz y concordia del país a costa de su propio sacrificio.",
        "Doy gracias a Dios por haberme concedido amar a la mujer más noble que existe, a la vez que la más hermosa, y por haber impedido que mi amor llegase a ser un día obstáculo insuperable para el cumplimiento de la altísima misión de Flavia."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/24801.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/24801"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 24801: edición de la Biblioteca de «La Nación», Buenos Aires, 1909, traducción anónima (dominio público)", "url": "https://www.gutenberg.org/ebooks/24801"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-prisionero-de-zenda"},
      parecidos: ["galdos-de-onate-a-la-granja", "asensi-novelas-cortas", "galdos-la-campana-del-maestrazgo"]
    },
    {
      id: "galdos-de-onate-a-la-granja",
      titulo: "De Oñate a La Granja",
      autor: "Benito Pérez Galdós",
      anio: "1898",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Tercer episodio de la tercera serie de los Episodios nacionales. Don Fernando Calpena y don Pedro Hillo pasan sus días de prisión política en pleno conflicto carlista, mientras la novela sigue las intrigas de la corte y los campamentos entre el País Vasco y el palacio de La Granja. Galdós entrelaza las peripecias del joven Calpena con los sucesos de 1836 en un retrato vivo de la guerra civil y de la política del momento."},
      porque: {"es":"Es un buen episodio para el lector que ya conoce a Calpena y quiere ver cómo la guerra se cruza con las intrigas de palacio. Muestra que la política de una época se decide tanto en los campamentos como en los salones.","en":"A good episode for the reader who already knows Calpena and wants to see how war intersects with palace intrigue. It shows that the politics of an age is decided as much in army camps as in drawing rooms."},
      imagen: {"src": "img/portadas/galdos-de-onate-a-la-granja.jpg", "credito": {"es": "Francisco de Paula Van Halen, «Batalla de la primera guerra carlista», antes de 1887", "en": "Francisco de Paula Van Halen, «Battle of the First Carlist War», before 1887"}, "url": "https://commons.wikimedia.org/wiki/File:Bataille_de_la_premi%C3%A8re_guerre_carliste_1833-1840.jpg"},
      citas: [
        "Mejor era dejarle solo con su conciencia, en la cual la verdad iba labrando el hondo surco.",
        "Es la política un terreno movedizo y desigual, y andando por ella, ya se pone el pie en firme, ya se hunde en ciénagas malsanas.",
        "Tal idea fue la verdadera medicina de su grave turbación, y acariciándola y fomentándola en su alma, llegó a soportar resignado la sombría tristeza de la clausura."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/76264.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/76264"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 76264: edición de Madrid, Librería de los Sucesores de Hernando, 1907 (dominio público)", "url": "https://www.gutenberg.org/ebooks/76264"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/ep-nac-3a-3-de-onate-la-granja"},
      parecidos: ["galdos-batalla-arapiles", "galdos-equipaje-rey-jose", "galdos-faccioso-mas-frailes-menos"]
    },
    {
      id: "galdos-la-campana-del-maestrazgo",
      titulo: "La campaña del Maestrazgo",
      autor: "Benito Pérez Galdós",
      anio: "1899",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Quinto episodio de la tercera serie de los Episodios nacionales. La acción parte de la villa aragonesa de Fuentes de Ebro y acompaña a Fernando Calpena por los campos de la guerra carlista, donde Cabrera y sus partidas dominan el Maestrazgo. Galdós combina la crónica de las operaciones militares con los enredos sentimentales y familiares de su joven protagonista."},
      porque: {"es":"Sirve a quien quiere sentir la guerra carlista en el terreno, con sus pueblos y sus caminos, sin perder el hilo de los personajes. Mezcla crónica y novela con equilibrio y deja ver lo que cuesta, a la gente común, una guerra interminable.","en":"It suits those who want to feel the Carlist war on the ground, with its villages and roads, without losing the thread of the characters. It blends chronicle and novel with balance and shows what an endless war costs ordinary people."},
      imagen: {"src": "img/portadas/galdos-la-campana-del-maestrazgo.jpg", "credito": {"es": "W. E. Kilburn, retrato de Ramón Cabrera, 1850", "en": "W. E. Kilburn, portrait of Ramón Cabrera, 1850"}, "url": "https://commons.wikimedia.org/wiki/File:Ram%C3%B3n_Cabrera.jpg"},
      citas: [
        "Dentro del fuero del amor no he cometido vilezas; pero sepan que ese fuero es puro artificio inventado para nuestro uso por los galanteadores, y que no vale ante la ordenanza del decálogo.",
        "Ni por cuantos bienes hay en el mundo, ni por la vida, que es el primero de los bienes, mancillaría yo con una traición el nombre que llevo.",
        "La guerra no es más que el arte de la oportunidad.",
        "El amor viene siempre de Dios."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/78775.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/78775"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 78775: edición de Madrid, Perlado, Páez y Compañía, 1906 (dominio público)", "url": "https://www.gutenberg.org/ebooks/78775"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/ep-nac-3a-5-la-campana-del-maestrazgo"},
      parecidos: ["galdos-batalla-arapiles", "galdos-de-onate-a-la-granja", "galdos-equipaje-rey-jose"]
    },
    {
      id: "galdos-la-estafeta-romantica",
      titulo: "La estafeta romántica",
      autor: "Benito Pérez Galdós",
      anio: "1899",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Sexto episodio de la tercera serie de los Episodios nacionales. La novela se abre y avanza en buena parte mediante cartas entre familias de provincia, que dan noticia de planes matrimoniales y de las vicisitudes de la guerra carlista. Galdós retrata así, con tono íntimo, la vida doméstica y los afectos de una época de inestabilidad política."},
      porque: {"es":"Una lectura distinta dentro de los Episodios: la historia llega por cartas, con voces de familias corrientes. Gusta a quien disfruta del género epistolar y quiere ver la guerra desde la sala de estar, en un tono íntimo y casi doméstico.","en":"A different kind of read within the Episodios: history arrives through letters, in the voices of ordinary families. It pleases those who enjoy the epistolary form and want to see the war from the living room, in an intimate, almost domestic tone."},
      imagen: {"src": "img/portadas/galdos-la-estafeta-romantica.jpg", "credito": {"es": "Gerard ter Borch, «Mujer leyendo una carta», c. 1660-1662", "en": "Gerard ter Borch, «Woman Reading a Letter», c. 1660-1662"}, "url": "https://commons.wikimedia.org/wiki/File:Gerard_ter_Borch_(II)_-_Woman_Reading_a_Letter_-_WGA22139.jpg"},
      citas: [
        "Ya vemos que es romántico el que se mata porque le deja la novia, o se le casa. El mundo está perdido, y España acabará de volverse loca si Dios no ataja estas guerras, que también me van pareciendo a mí algo románticas.",
        "Llegaste al fin, pero llegaste tarde, cosa también vulgarísima y de clavo pasado, pues desde que el mundo es mundo, la humanidad incurre en esa fatalidad vulgarísima de llegar tarde...",
        "Échate a la espalda el amor propio, y búscate algo en que pensar que no sea esto, que no te faltará algún quebradero de cabeza por otro lado. Distráete aunque sea con disgustos nuevos, y el tiempo, con nuevos afanes, de los viejos te curará."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/78963.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/78963"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 78963: edición de Madrid, Librería de los Sucesores de Hernando, 1924 (dominio público)", "url": "https://www.gutenberg.org/ebooks/78963"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/ep-nac-3a-6-la-estafeta-romantica"},
      parecidos: ["galdos-batalla-arapiles", "galdos-de-onate-a-la-granja", "galdos-equipaje-rey-jose"]
    },
    {
      id: "galdos-luchana",
      titulo: "Luchana",
      autor: "Benito Pérez Galdós",
      anio: "1899",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Cuarto episodio de la tercera serie de los Episodios nacionales. Ambientada en 1836, durante el sitio de Bilbao, la novela sigue a Fernando Calpena en medio de la guerra carlista y de las conspiraciones de la corte. Galdós narra el avance del general Espartero hacia Luchana y el socorro de la villa, sin dejar de lado los amores y las intrigas de sus personajes."},
      porque: {"es":"Es el cuarto libro de la tercera serie de los Episodios nacionales: un joven cruza media España para buscar a una mujer y termina en Bilbao, sitiada por los carlistas en 1836. Sirve a quien prefiere aprender historia a través de personas concretas, con el hambre y la espera de un socorro de fondo. Se lee como novela de aventuras; solo ten presente la imagen algo estereotipada que Galdós da de las mujeres devotas.","en":"This is the fourth book of the third series of the Episodios nacionales: a young man crosses half of Spain to find a woman and ends up in Bilbao, besieged by the Carlists in 1836. It suits anyone who prefers to learn history through specific people, with hunger and the wait for relief in the background. It reads like an adventure novel; just keep in mind the somewhat stereotyped way Galdós draws devout women."},
      imagen: {"src": "img/portadas/galdos-luchana.jpg", "credito": {"es": "Anónimo, «Ataque al puente de Luchana», 1845", "en": "Anonymous, «Attack on the Luchana Bridge», 1845"}, "url": "https://commons.wikimedia.org/wiki/File:Ataque_al_Puente_de_Luchana.jpg"},
      citas: [
        "Quiero que venga al bien, a la paz, a mi cariño, con espontaneidad y efusión; no atraído por maestros o empujado por rodrigones. El sistema de la vigilancia, del espionaje, de la previsión, me dio un resultado desastroso: ha sido la derrota del régimen absoluto. He de probar ahora el régimen contrario: la libertad.",
        "Reconozcamos que el soldado español es la virtud misma, pues por un cuarto diario consagra a la patria su existencia, por un cuarto se somete a los rigores de la disciplina, por un cuarto nos custodia y nos defiende hasta dejarse matar. No creo que en ningún país exista abnegación más barata.",
        "Naturalmente, hice todo lo contrario de lo que nuestro sabio Mentor con notoria prudencia me aconsejaba"
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/76572.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/76572"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 76572: edición de Madrid, Perlado, Páez y Compañía, 1906 (dominio público)", "url": "https://www.gutenberg.org/ebooks/76572"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/luchana"},
      parecidos: ["galdos-batalla-arapiles", "galdos-de-onate-a-la-granja", "galdos-equipaje-rey-jose"]
    },
    {
      id: "doyle-el-sabueso-de-los-baskerville",
      titulo: "El sabueso de los Baskerville",
      autor: "Arthur Conan Doyle (trad. Arturo Costa Álvarez)",
      anio: "1902",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Sherlock Holmes y el doctor Watson investigan la muerte de sir Charles Baskerville, ocurrida en los páramos de Devonshire. Según una antigua leyenda familiar, un enorme perro fantasma persigue a los herederos de la casa. Cuando llega el nuevo heredero, sir Henry, Holmes debe separar lo sobrenatural de lo real. La novela mezcla el relato policial con el de terror, con un estilo sencillo y directo."},
      porque: {"es":"Es el caso de Holmes que mejor se lee en una noche de invierno, con luz baja. Entretiene y, de paso, ejercita la mente: invita a separar el miedo de los hechos. Buena puerta para quien nunca ha leído novela policial clásica.","en":"The Holmes case best read on a winter night, with low light. It entertains and exercises the mind at once: it invites you to separate fear from facts. A good door for anyone who has never read classic detective fiction."},
      imagen: {"src": "img/portadas/doyle-el-sabueso-de-los-baskerville.jpg", "credito": {"es": "Sidney Paget, «El perro negro como el carbón», ilustración de 1902", "en": "Sidney Paget, «The coal-black Hound», 1902"}, "url": "https://commons.wikimedia.org/wiki/File:Houn-53_-_The_coal-black_Hound_(Hound_of_Baskervilles).jpg"},
      citas: [
        "Puede ser que usted no sea un astro con luz propia, pero lo cierto es que es buen conductor de la luz. Hay quienes, sin estar dotados de genio precisamente, tienen, sin embargo, notables facultades para estimularlo.",
        "El mundo está lleno de cosas que saltan a la vista, y que nadie, ni por casualidad, observa nunca.",
        "Hasta ahora he limitado mis investigaciones a este mundo. En una esfera muy modesta he combatido al mal; pero tomar por mi cuenta nada menos que el Espíritu del Mal en esencia, esto sería, quizá, una empresa demasiado ambiciosa.",
        "El sabueso primitivo era suficientemente material para destrozarle la garganta a un hombre, y, sin embargo, también era diabólico."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El%20sabueso%20de%20los%20Baskerville%20%28Costa%20%C3%81lvarez%20tr.%29"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El%20sabueso%20de%20los%20Baskerville%20%28Costa%20%C3%81lvarez%20tr.%29"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El%20sabueso%20de%20los%20Baskerville%20%28Costa%20%C3%81lvarez%20tr.%29"}],
      fuente: {"texto": "Traducción de Arturo Costa Álvarez, Buenos Aires, Biblioteca de La Nación, 1909, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/El_sabueso_de_los_Baskerville_(Costa_%C3%81lvarez_tr.)"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-sabueso-de-los-baskerville"},
      parecidos: ["galdos-la-campana-del-maestrazgo", "galdos-la-estafeta-romantica", "galdos-luchana"]
    },
    {
      id: "dario-cantos-de-vida-y-esperanza",
      titulo: "Cantos de vida y esperanza, Los cisnes y otros poemas",
      autor: "Rubén Darío",
      anio: "1905",
      idioma: "es",
      categoria: "poesia",
      recomendado: false,
      resumen: {"es": "Colección de poemas de madurez del poeta nicaragüense, en la que su estilo modernista se une a una reflexión sobre el paso del tiempo, la muerte, la fe y la incertidumbre ante el futuro. Incluye poemas como «Salutación del optimista», «A Roosevelt» y «Lo fatal». El libro expresa también su mirada sobre América y su identidad cultural. El lenguaje es refinado, musical y lleno de símbolos y referencias que van de lo clásico a lo contemporáneo."},
      porque: {"es":"Para quien se acerca al modernismo por un libro de madurez: Darío mira atrás con lucidez, se pregunta por la fe, el tiempo y la muerte, y también toma posición ante el mundo de su época, como en «A Roosevelt», un reclamo por la identidad de los pueblos hispanoamericanos. «Lo fatal» dice en pocos versos el dolor de existir. Se lee de a uno, en voz alta, y la música del verso gana con cada relectura.","en":"For readers approaching modernismo through a book from the poet's maturity: Darío looks back with lucidity, questions faith, time and death, and also takes a stand on the world of his day, as in \"A Roosevelt\", a plea for the identity of the Spanish-American peoples. \"Lo fatal\" says the pain of existing in a few lines. Read one poem at a time, aloud; the music of the verse grows with each rereading."},
      imagen: {"src": "img/portadas/dario-cantos-de-vida-y-esperanza.jpg", "credito": {"es": "Jan Asselijn, «El cisne amenazado», c. 1650", "en": "Jan Asselijn, “The Threatened Swan”, c. 1650"}, "url": "https://commons.wikimedia.org/wiki/File:De_bedreigde_zwaan_Rijksmuseum_SK-A-4.jpeg"},
      citas: [
        "Yo soy aquel que ayer no más decía / el verso azul y la canción profana, / en cuya noche un ruiseñor había / que era alondra de luz por la mañana.",
        "Dichoso el árbol que es apenas sensitivo, / y más la piedra dura porque esa ya no siente, / pues no hay dolor más grande que el dolor de ser vivo, / ni mayor pesadumbre que la vida consciente.",
        "¡Juventud, divino tesoro, / ya te vas para no volver! / Cuando quiero llorar, no lloro... / Y a veces lloro sin querer...",
        "Y, pues contáis con todo, falta una cosa: ¡Dios!"
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/50341.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/50341"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 50341 (dominio público)", "url": "https://www.gutenberg.org/ebooks/50341"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/cantos-de-vida-y-esperanza"},
      parecidos: ["hernandez-martin-fierro", "lope-la-gatomaquia", "cervantes-viaje-al-parnaso"]
    },
    {
      id: "pardo-bazan-la-quimera",
      titulo: "La Quimera",
      autor: "Emilia Pardo Bazán",
      anio: "1905",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Novela de Emilia Pardo Bazán que sigue la vida de un pintor, Silvio Lago, entregado a conseguir el dominio absoluto de su arte. Su talento lo lleva de Galicia a la fama en Madrid y luego a París, y en su camino se cruzan mujeres muy distintas. La narración es la historia de un ideal siempre lejano, la quimera del título. Con ella la autora deja atrás el naturalismo y se acerca a una novela más espiritual."},
      porque: {"es":"Para quien se ha entregado a un ideal, artístico o no, y ha sentido que se aleja a cada paso. Pardo Bazán retrata con lucidez el precio de la ambición y deja una pregunta incómoda sobre qué se persigue en realidad cuando se persigue la perfección.","en":"For anyone who has given themselves to an ideal, artistic or not, and felt it recede with every step. Pardo Bazán portrays the price of ambition with lucidity and leaves an uncomfortable question about what we are really chasing when we chase perfection."},
      imagen: {"src": "img/portadas/pardo-bazan-la-quimera.jpg", "credito": {"es": "Joaquín Sorolla, «Autorretrato», 1900", "en": "Joaquín Sorolla, «Self-portrait», 1900"}, "url": "https://commons.wikimedia.org/wiki/File:(Sorolla_Museum)_-_Joaqu%C3%ADn_Sorolla_Self_portrait_1900.jpg"},
      citas: [
        "Una de las cosas más innobles de la pintura moderna es querer pintar todos los artistas con una misma luz. La luz va dentro de nosotros.",
        "Acuérdese de que la belleza no es sino lo profundo y refinado del sentimiento.",
        "Si bajo la ficción novelesca palpita algún problema superior a los efímeros eventos que tejen el relato; si un instante el soplo divino nos cruza la sien, ¿por qué ocultarlo? ¿No es esto tan verdad como las funciones del organismo?",
        "La vida no es joya de gran valer, aunque a veces encanta."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/49756.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/49756"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 49756 (dominio público)", "url": "https://www.gutenberg.org/ebooks/49756"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-quimera-0"},
      parecidos: ["pardo-bazan-la-sirena-negra", "salgari-el-rey-del-mar", "doyle-el-sabueso-de-los-baskerville"]
    },
    {
      id: "salgari-el-rey-del-mar",
      titulo: "El rey del mar",
      autor: "Emilio Salgari (trad. Rafael Balsa de la Vega)",
      anio: "1906",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Segunda parte de «Los tigres de la Malasia», ambientada en los mares de la Sonda. Yáñez y los últimos tigres de Mompracem, amenazados por sus enemigos, se lanzan a una expedición nocturna y a la persecución del misterioso rey del mar. Entre combates, traiciones y travesías por islas y costas de Borneo, aparecen los secretos de sir Moreland y el hijo de Suyodhana. Es una novela de aventuras marítimas de ritmo rápido, propia del autor de Sandokán."},
      porque: {"es":"Para el lector que busca puro movimiento: abordajes, selvas y travesías sin pausa, al estilo de las novelas de aventuras de antes. Se disfruta mejor leyendo primero la primera parte, y es buena lectura para adolescentes con ganas de acción.","en":"For the reader who wants pure motion: boardings, jungles and voyages without pause, in the style of the adventure novels of old. It is best enjoyed after reading the first part, and it makes good reading for teenagers who crave action."},
      imagen: {"src": "img/portadas/salgari-el-rey-del-mar.jpg", "credito": {"es": "Alberto della Valle, ilustración de «Il Re del Mare», 1913", "en": "Alberto della Valle, illustration for «Il Re del Mare», 1913"}, "url": "https://commons.wikimedia.org/wiki/File:Salgari,_Il_Re_del_Mare,_illustrazione_(p.17),_1913_-_MuFant.jpg"},
      citas: [
        "No, los últimos tigres de Mompracem no habían sido vencidos todavía; pero estaban amenazados de serlo en un breve plazo.",
        "Quizá se haya aplacado su ánima. Que me perdone, pero yo, hombre civilizado, no puedo ser el vengador de los thugs de la India. ¡Señor Yáñez, Tigre de Malasia, están ustedes en libertad, juntamente con todos sus hombres! Yo solo los he vencido, y, por lo tanto, yo solo tengo el derecho de condenarlos o de absolverlos, y los absuelvo.",
        "Caballero, nos llaman piratas, pero sabemos ser generosos; mucho más generosos que otros. Si yo hubiese caído en manos del rajá, a estas horas ya me hubiese fusilado; en cambio, yo, señor, le concedo a usted la vida.",
        "¡Abrid paso al valor desgraciado! ¡Que lleven al comandante a mi camarote!"
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/El%20rey%20del%20mar"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=El%20rey%20del%20mar"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=El%20rey%20del%20mar"}],
      fuente: {"texto": "Traducción de Rafael Balsa de la Vega, publicada antes de 1918, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/El_rey_del_mar"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-rey-del-mar"},
      parecidos: ["pardo-bazan-la-quimera", "pardo-bazan-la-sirena-negra", "lecomte-du-nouy-incertidumbre"]
    },
    {
      id: "pardo-bazan-la-sirena-negra",
      titulo: "La sirena negra",
      autor: "Emilia Pardo Bazán",
      anio: "1908",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Novela psicológica en la que un hombre meditativo se plantea, una noche de invierno en Madrid, el problema de la calidad de la vida. La reflexión lo lleva a una obsesión con la muerte, donde la realidad se mezcla con la fantasía. La obra explora el deseo, la lucha interior y los dilemas de su protagonista, y es considerada un clásico de la narrativa española."},
      porque: {"es":"Sirve a quien, en una noche de insomnio, se ha preguntado por el sentido de su vida. La novela entra en esa inquietud sin respuestas fáciles y deja pensando en cómo la mente puede volverse contra uno mismo. Lectura densa, pero breve y honda.","en":"It suits anyone who, on a sleepless night, has wondered about the meaning of their life. The novel enters that unease without easy answers and leaves you thinking about how the mind can turn against itself. Dense reading, but short and deep."},
      imagen: {"src": "img/portadas/pardo-bazan-la-sirena-negra.jpg", "credito": {"es": "Arnold Böcklin, «La isla de los muertos» (segunda versión), 1880", "en": "Arnold Böcklin, «Isle of the Dead» (second version), 1880"}, "url": "https://commons.wikimedia.org/wiki/File:Arnold_B%C3%B6cklin_-_Die_Toteninsel_II_(Metropolitan_Museum_of_Art).jpg"},
      citas: [
        "Ningún problema, para el que vive, revestirá mayor interés que este de la calidad de la vida.",
        "Majadero: lo que te impresiona, ni es la materia, ni es el alma. Es la forma, la forma engañosa, algo lineal y superficial, que sobrevive a la vida.",
        "La convicción de que la vida es excelente, que nacer es un don, y que hay fuera de nosotros y por encima de nosotros una ley que hemos de acatar y un criterio definido que se nos impone."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/51450.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/51450"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 51450 (dominio público)", "url": "https://www.gutenberg.org/ebooks/51450"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-sirena-negra"},
      parecidos: ["pardo-bazan-la-quimera", "lecomte-du-nouy-incertidumbre", "salgari-el-rey-del-mar"]
    },
    {
      id: "lecomte-du-nouy-incertidumbre",
      titulo: "Incertidumbre",
      autor: "Hermine Lecomte du Noüy (traductor anónimo)",
      anio: "1909",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Novela romántica ambientada en un castillo a orillas del Marne. María Teresa es la hija de un acomodado industrial del vidrio artístico, y Juan, un huérfano leal que llegó a ser la mano derecha de la casa. Juan se considera indigno de ella y calla su amor, mientras ella duda entre un hombre de mundo y otro honrado y trabajador. Es una historia de amores limpios, con ritmo pausado, escrita con delicadeza."},
      porque: {"es":"Para quien gusta de las historias de amor contenidas, donde lo que no se dice pesa más que lo que se dice. Es una lectura tranquila que trata del orgullo, de la humildad y de lo que significa valer, más allá del dinero y la posición.","en":"For anyone who likes restrained love stories, where what is left unsaid weighs more than what is said. A quiet read about pride, humility and what it means to have worth, beyond money and position."},
      imagen: {"src": "img/portadas/lecomte-du-nouy-incertidumbre.jpg", "credito": {"es": "Albert Dubois-Pillet, «Las orillas del Marne al amanecer»", "en": "Albert Dubois-Pillet, «The Banks on the Marne at Dawn»"}, "url": "https://commons.wikimedia.org/wiki/File:Albert_Dubois-Pillet_The_Banks_on_the_Marne_at_Dawn.jpg"},
      citas: [
        "Porque era dichosa y nada atrofía tanto el corazón como la felicidad. Solo la desgracia desarrolla la sensibilidad.",
        "¿No juzga usted que sería odioso que la vida de trabajo sobrellevada por mi padre no sirviera sino a mantener en el lujo y en los placeres a dos personas jóvenes y fuertes, mientras él debería continuar su dura labor, y condenarse a una existencia mediocre o incómoda? Seguramente, usted piensa como yo: seríamos despreciables si aceptásemos tal situación.",
        "Por un fenómeno singular, le impresionaba menos su desinterés que su pasión silenciosa semejante a un culto. Todos los flirts le habían preparado poco para apreciar aquel noble y grande amor que se expresaba con tanta abnegación."
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/26845.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/26845"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 26845 (dominio público); edición de Buenos Aires, Biblioteca de La Nación, 1909", "url": "https://www.gutenberg.org/ebooks/26845"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/incertidumbre"},
      parecidos: ["pardo-bazan-la-sirena-negra", "salgari-el-rey-del-mar", "pardo-bazan-la-quimera"]
    },
    {
      id: "conscience-la-nina-robada",
      titulo: "La niña robada",
      autor: "Hendrik Conscience",
      anio: "1919",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Novela romántica flamenca ambientada en una aldea y su castillo. Elena, una niña criada por la viuda de Bruinsteen, sufre el maltrato de su madrastra mientras un secreto antiguo pesa sobre la familia. Catalina, una campesina fiel, y el joven Federico intentan sacar a la luz la verdad. Es una historia de intrigas, afectos y perdón, escrita con el tono sentimental del siglo XIX."},
      porque: {"es":"Es una novela sencilla y de buen corazón, apropiada para quien quiere una lectura limpia y de ritmo pausado. Muestra cómo la fidelidad de la gente humilde puede ayudar a sacar la verdad a flote, y se presta bien para leer en familia.","en":"A simple, warm-hearted novel, fitting for those who want a clean read at an unhurried pace. It shows how the loyalty of humble people can help bring the truth to light, and it lends itself well to reading with the family."},
      imagen: {"src": "img/portadas/conscience-la-nina-robada.jpg", "credito": {"es": "Jean-François Portaels, «Retrato de Hendrik Conscience», h. 1870", "en": "Jean-François Portaels, «Portrait of Hendrik Conscience», c. 1870"}, "url": "https://commons.wikimedia.org/wiki/File:Hendrik_Conscience.jpg"},
      citas: [
        "Por la felicidad de mi hija sería capaz de afrontar mil muertes crueles, pero me falta valor para esta abdicación de mi conciencia, para este suicidio moral.",
        "Si he vacilado al acercarse esta prueba suprema, era por amor a ti, era por defender el corazón que sigue amándote más allá de la tumba, hasta la apariencia de una mancha.",
        "¡Es mi madre por el alma, por el corazón! ¡Ah, Federico, qué felices deben ser los hijos que tengan una madre así!"
      ],
      archivos: {},
      externos: [{"formato": "epub", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/22975.epub3.images"}, {"formato": "web", "texto": "Project Gutenberg", "url": "https://www.gutenberg.org/ebooks/22975"}],
      fuente: {"texto": "Project Gutenberg, libro n.º 22975 (dominio público); edición de la Biblioteca de La Nación, Buenos Aires, 1919", "url": "https://www.gutenberg.org/ebooks/22975"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-nina-robada"},
      parecidos: ["guiraldes-don-segundo-sombra", "lecomte-du-nouy-incertidumbre", "pardo-bazan-la-sirena-negra"]
    },
    {
      id: "guiraldes-don-segundo-sombra",
      titulo: "Don Segundo Sombra",
      autor: "Ricardo Güiraldes",
      anio: "1926",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Clásico de la literatura gauchesca argentina, narrado por Fabio Cáceres, un muchacho que vive en un pueblo de la pampa. Un día conoce a Don Segundo Sombra, un resero de austera dignidad, y se va con él a recorrer el campo. Lo sigue como ahijado, aprende los oficios y las costumbres del paisano criollo y descubre el valor de la libertad y del trabajo. La novela retrata con nostalgia el paisaje y la vida de la pampa."},
      porque: {"es":"Para quien quiere entender qué es crecer al lado de un maestro: más que lecciones, un ejemplo de sobriedad y de libertad bien llevada. Sus páginas respiran campo y oficio, y interesan a cualquier lector que valore la dignidad de lo austero.","en":"For anyone who wants to understand what it means to grow up beside a master: less lessons than an example of sobriety and freedom well carried. Its pages breathe countryside and craft, and will interest any reader who values the dignity of austerity."},
      imagen: {"src": "img/portadas/guiraldes-don-segundo-sombra.jpg", "credito": {"es": "Prilidiano Pueyrredón, «Un alto en el campo», 1861", "en": "Prilidiano Pueyrredón, «Un alto en el campo», 1861"}, "url": "https://commons.wikimedia.org/wiki/File:Prilidiano_Pueyrredón_-_Un_alto_en_el_campo,_1861.jpg"},
      citas: [
        "Tenían alma de reseros, que es tener alma de horizonte.",
        "Ansina es el destino del hombre. Naides empezaría el camino si le mostraran lo que lo espera.",
        "Galopar es reducir lejanía. Llegar no es, para un resero, más que un pretexto de partir.",
        "Pero por sobre todo y contra todo, don Segundo quería su libertad.",
        "Me fui, como quien se desangra."
      ],
      archivos: {},
      externos: [{"formato": "web", "texto": "Wikisource", "url": "https://es.wikisource.org/wiki/Don_Segundo_Sombra"}, {"formato": "epub", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=epub&lang=es&page=Don%20Segundo%20Sombra"}, {"formato": "pdf", "texto": "Wikisource", "url": "https://ws-export.wmcloud.org/?format=pdf-a4&lang=es&page=Don%20Segundo%20Sombra"}],
      fuente: {"texto": "Edición de Establecimiento Gráfico de Olivieri y Domínguez, Buenos Aires, 1927, transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/Don_Segundo_Sombra"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/don-segundo-sombra"},
      parecidos: ["conscience-la-nina-robada", "lecomte-du-nouy-incertidumbre", "pardo-bazan-la-sirena-negra"]
    },
    {
      id: "austen-emma",
      titulo: "Emma",
      autor: "Jane Austen",
      anio: "1815",
      idioma: "en",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Emma Woodhouse, joven, rica y segura de su buen ojo, se dedica a arreglar casamientos en su pueblo de Highbury. Sus equivocaciones, a veces graciosas y a veces hirientes, la obligan a conocerse mejor. Una comedia de enredos sobre la vanidad, la amistad y el difícil arte de ver con claridad.", "en": "Emma Woodhouse, young, rich and sure of her good eye, spends her time matchmaking in the village of Highbury. Her mistakes, sometimes funny and sometimes hurtful, force her to know herself better. A comedy of errors about vanity, friendship and the hard art of seeing clearly."},
      porque: {"es": "Para quien disfruta una comedia bien armada y quiere, de paso, mirarse al espejo: Emma se parece a cualquiera que cree saber lo que más le conviene a los demás. Muestra con humor el valor de pedir perdón y de agradecer a quien nos corrige con cariño.", "en": "For readers who enjoy a well-built comedy and would like to glance in the mirror along the way: Emma resembles anyone who thinks they know what is best for others. It shows, with humour, the worth of apologizing and of being grateful to those who correct us with affection."},
      imagen: {"src": "img/portadas/austen-emma.jpg", "credito": {"es": "Thomas Gainsborough, «Mrs. Richard Brinsley Sheridan», 1785-1787", "en": "Thomas Gainsborough, «Mrs. Richard Brinsley Sheridan», 1785-1787"}, "url": "https://commons.wikimedia.org/wiki/File:Thomas_Gainsborough,_Mrs._Richard_Brinsley_Sheridan,_1785-1787,_NGA_99.jpg"},
      citas: [
        "It is very difficult for the prosperous to be humble.",
        "If I loved you less, I might be able to talk about it more.",
        "Vanity working on a weak head, produces every sort of mischief.",
        "One half of the world cannot understand the pleasures of the other."
      ],
      archivos: {"epub": "libros/austen-emma.epub", "pdf": "libros/austen-emma.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 158 (dominio público); portada de Proyecto Fénix", "url": "https://www.gutenberg.org/ebooks/158"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/emma"},
      parecidos: ["austen-pride-and-prejudice", "austen-mansfield-park", "austen-northanger-abbey"]
    },
    {
      id: "austen-mansfield-park",
      titulo: "Mansfield Park",
      autor: "Jane Austen",
      anio: "1814",
      idioma: "en",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Fanny Price, una niña pobre, crece en la casa de sus tíos ricos en Mansfield Park, tímida y casi invisible. Cuando llegan los hermanos Crawford, brillantes y encantadores, toda la casa se descompone entre diversiones, coqueteos y teatro de aficionados. Fanny se mantiene firme, y su fidelidad a lo que cree justo acaba por prevalecer.", "en": "Fanny Price, a poor child, grows up in her rich relatives' house at Mansfield Park, shy and nearly invisible. When the brilliant, charming Crawford siblings arrive, the whole household unravels amid amusements, flirtations and amateur theatricals. Fanny holds firm, and her loyalty to what she thinks right in the end prevails."},
      porque: {"es": "Para quien se ha sentido solo por no seguir la corriente. Fanny muestra que la firmeza tranquila vale más que el brillo social, y que las buenas costumbres de una casa pesan más de lo que parece. Es la más moral de las novelas de Austen, y también la más lenta de leer.", "en": "For anyone who has felt alone for not going with the crowd. Fanny shows that quiet firmness is worth more than social shine, and that the good habits of a household weigh more than they seem to. It is the most moral of Austen's novels, and also the slowest to read."},
      imagen: {"src": "img/portadas/austen-mansfield-park.jpg", "credito": {"es": "John Constable, «Wivenhoe Park, Essex», 1816", "en": "John Constable, «Wivenhoe Park, Essex», 1816"}, "url": "https://commons.wikimedia.org/wiki/File:John_Constable_-_Wivenhoe_Park,_Essex_-_Google_Art_Project.jpg"},
      citas: [
        "Let other pens dwell on guilt and misery.",
        "If any one faculty of our nature may be called more wonderful than the rest, I do think it is memory.",
        "I cannot think well of a man who sports with any woman’s feelings",
        "Here’s what may leave all painting and all music behind, and what poetry only can attempt to describe!"
      ],
      archivos: {"epub": "libros/austen-mansfield-park.epub", "pdf": "libros/austen-mansfield-park.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 141 (dominio público); portada de Proyecto Fénix", "url": "https://www.gutenberg.org/ebooks/141"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/mansfield-park"},
      parecidos: ["austen-emma", "austen-persuasion", "austen-northanger-abbey"]
    },
    {
      id: "austen-northanger-abbey",
      titulo: "Northanger Abbey",
      autor: "Jane Austen",
      anio: "1817",
      idioma: "en",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Catherine Morland, lectora ávida de novelas góticas, viaja a Bath y luego a la abadía de Northanger, donde su imaginación ve misterios y crímenes en cada pasillo. La realidad le enseñará a distinguir la fantasía del mundo verdadero. Una parodia cariñosa y divertida, y una defensa de la novela.", "en": "Catherine Morland, an avid reader of Gothic novels, travels to Bath and then to Northanger Abbey, where her imagination sees mysteries and crimes in every corridor. Reality teaches her to tell fantasy from the real world. An affectionate, funny parody, and a defence of the novel."},
      porque: {"es": "Es la más breve y ligera de las novelas de Austen, buena para empezar con ella. Sirve a quien disfruta de los libros y se ríe de sí mismo: Catherine aprende a distinguir lo que lee de lo que vive, sin perder la ingenuidad ni la bondad.", "en": "The shortest and lightest of Austen's novels, a good one to start with. It suits anyone who loves books and can laugh at themselves: Catherine learns to tell what she reads from what she lives, without losing her innocence or her kindness."},
      imagen: {"src": "img/portadas/austen-northanger-abbey.jpg", "credito": {"es": "John Constable, «Castillo de Hadleigh», 1828-1829", "en": "John Constable, «Hadleigh Castle», 1828-1829"}, "url": "https://commons.wikimedia.org/wiki/File:John_Constable_-_Hadleigh_Castle_-_Google_Art_Project.jpg"},
      citas: [
        "The person, be it gentleman or lady, who has not pleasure in a good novel, must be intolerably stupid.",
        "I cannot speak well enough to be unintelligible.",
        "Where people wish to attach, they should always be ignorant.",
        "To torment and to instruct might sometimes be used as synonymous words."
      ],
      archivos: {"epub": "libros/austen-northanger-abbey.epub", "pdf": "libros/austen-northanger-abbey.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 121 (dominio público); portada de Proyecto Fénix", "url": "https://www.gutenberg.org/ebooks/121"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-abadia-de-northanger"},
      parecidos: ["austen-pride-and-prejudice", "austen-emma", "austen-mansfield-park"]
    },
    {
      id: "austen-persuasion",
      titulo: "Persuasion",
      autor: "Jane Austen",
      anio: "1817",
      idioma: "en",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Anne Elliot rechazó siendo muy joven la propuesta del capitán Wentworth, convencida por los consejos de una amiga de la familia. Ocho años después, él regresa de las guerras navales, rico y con fama. Última novela completa de Jane Austen: una historia serena y madura sobre las segundas oportunidades.", "en": "As a very young woman Anne Elliot refused Captain Wentworth's proposal, swayed by the advice of a family friend. Eight years later he returns from the naval wars, rich and renowned. Jane Austen's last completed novel: a quiet, mature story about second chances."},
      porque: {"es": "Es la novela para quien cree que ya perdió su oportunidad. Anne enseña la fidelidad paciente y el valor de decir por fin lo que se siente. Su tono, más sereno que el de otras obras de Austen, la hace muy apropiada para lectores adultos.", "en": "This is the novel for anyone who thinks their chance has passed. Anne shows patient fidelity and the courage to say at last what one feels. Its tone, calmer than in Austen's other works, makes it especially fitting for adult readers."},
      imagen: {"src": "img/portadas/austen-persuasion.jpg", "credito": {"es": "J. M. W. Turner, «Lyme Regis, Dorsetshire», c. 1834", "en": "J. M. W. Turner, “Lyme Regis, Dorsetshire”, c. 1834"}, "url": "https://commons.wikimedia.org/wiki/File:Joseph_Mallord_William_Turner_-_Lyme_Regis,_Dorsetshire,_England_-_Google_Art_Project.jpg"},
      citas: [
        "She had been forced into prudence in her youth, she learned romance as she grew older: the natural sequel of an unnatural beginning.",
        "All the privilege I claim for my own sex (it is not a very enviable one; you need not covet it), is that of loving longest, when existence or when hope is gone.",
        "You pierce my soul. I am half agony, half hope.",
        "there could have been no two hearts so open, no tastes so similar, no feelings so in unison, no countenances so beloved."
      ],
      archivos: {"epub": "libros/austen-persuasion.epub", "pdf": "libros/austen-persuasion.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 105 (dominio público); portada de Proyecto Fénix", "url": "https://www.gutenberg.org/ebooks/105"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/persuasion"},
      parecidos: ["austen-pride-and-prejudice", "austen-sense-and-sensibility", "austen-emma"]
    },
    {
      id: "austen-sense-and-sensibility",
      titulo: "Sense and Sensibility",
      autor: "Jane Austen",
      anio: "1811",
      idioma: "en",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Las hermanas Dashwood, la prudente Elinor y la apasionada Marianne, quedan sin fortuna tras la muerte de su padre y se trasladan a una casa humilde en Devon. Allí sus corazones se ponen a prueba de maneras opuestas: una calla lo que siente, la otra lo muestra todo. Primera novela publicada de Jane Austen.", "en": "The Dashwood sisters, prudent Elinor and passionate Marianne, are left without fortune after their father's death and move to a modest cottage in Devon. There their hearts are tested in opposite ways: one keeps her feelings quiet, the other shows everything. Jane Austen's first published novel."},
      porque: {"es": "Sirve a quien se pregunta cómo querer con hondura sin perder el juicio, y cómo sufrir sin hacer sufrir a los demás. Elinor ofrece un retrato admirable de dominio de sí y de lealtad familiar. Una lectura amable que deja pensando en el valor de la templanza.", "en": "It suits anyone wondering how to love deeply without losing judgment, and how to suffer without making others suffer. Elinor is an admirable portrait of self-command and family loyalty. A gentle read that leaves you thinking about the value of temperance."},
      imagen: {"src": "img/portadas/austen-sense-and-sensibility.jpg", "credito": {"es": "Thomas Lawrence, «Julia, Lady Peel», 1827", "en": "Thomas Lawrence, «Julia, Lady Peel», 1827"}, "url": "https://commons.wikimedia.org/wiki/File:Julia,_Lady_Peel_-_Lawrence_1827.jpg"},
      citas: [
        "The more I know of the world, the more am I convinced that I shall never see a man whom I can really love.",
        "Know your own happiness. You want nothing but patience—or give it a more fascinating name, call it hope.",
        "It is not time or opportunity that is to determine intimacy;—it is disposition alone."
      ],
      archivos: {"epub": "libros/austen-sense-and-sensibility.epub", "pdf": "libros/austen-sense-and-sensibility.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 161 (dominio público); portada de Proyecto Fénix", "url": "https://www.gutenberg.org/ebooks/161"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/sentido-y-sensibilidad"},
      parecidos: ["austen-pride-and-prejudice", "austen-persuasion", "austen-mansfield-park"]
    },
    {
      id: "chesterton-heretics",
      titulo: "Heretics",
      autor: "G. K. Chesterton",
      anio: "1905",
      idioma: "en",
      categoria: "ensayo",
      recomendado: false,
      resumen: {"es": "Una colección de ensayos en que Chesterton examina a los pensadores y escritores célebres de su tiempo (Kipling, Shaw, Wells, Whistler, entre otros) y sostiene que lo más importante de una persona es su visión del universo. Discute las modas del momento con humor y paradojas, y deja ver una filosofía propia que desarrollaría después en «Ortodoxia».", "en": "A collection of essays in which Chesterton examines the celebrated thinkers and writers of his day (Kipling, Shaw, Wells, Whistler and others) and argues that the most important thing about a person is his view of the universe. He takes on the fashions of the moment with humour and paradox, and sketches a philosophy of his own that he would develop later in «Orthodoxy»."},
      porque: {"es": "Para quien disfruta de la polémica de ideas bien escrita y quiere ver cómo se discutía el pensamiento moderno hace más de un siglo. Muchas de las modas que Chesterton critica siguen vivas con otros nombres, así que el libro se lee casi como actualidad. Es también una buena puerta de entrada a su estilo antes de pasar a sus obras mayores.", "en": "For readers who enjoy well-written debate about ideas and want to see how modern thought was argued over more than a century ago. Many of the fashions Chesterton criticizes are still alive under other names, so the book reads almost like current affairs. It is also a good doorway into his style before moving on to his larger works."},
      imagen: {"src": "img/portadas/chesterton-heretics.jpg", "credito": {"es": "James McNeill Whistler, «Arreglo en gris y negro n.º 1» (La madre del artista), 1871", "en": "James McNeill Whistler, «Arrangement in Grey and Black No. 1» (The Artist's Mother), 1871"}, "url": "https://commons.wikimedia.org/wiki/File:Whistlers_Mother_high_res.jpg"},
      citas: [
        "the most practical and important thing about a man is still his view of the universe.",
        "Eternity is the eve of something.",
        "I never look up at the stars without feeling that they are the fires of a schoolboy’s rocket, fixed in their everlasting fall."
      ],
      archivos: {"epub": "libros/chesterton-heretics.epub", "pdf": "libros/chesterton-heretics.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 470 (dominio público); portada de Proyecto Fénix", "url": "https://www.gutenberg.org/ebooks/470"},
      delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/herejes"},
      parecidos: ["ortodoxia", "chesterton-whats-wrong-with-the-world", "chesterton-the-everlasting-man"]
    },
    {
      id: "chesterton-st-francis-of-assisi",
      titulo: "St. Francis of Assisi",
      autor: "G. K. Chesterton",
      anio: "1923",
      idioma: "en",
      categoria: "lectura",
      recomendado: false,
      resumen: {"es": "Una biografía breve y poco convencional de Francisco de Asís, escrita con la mirada de Chesterton: más interesada en comprender por qué Francisco hizo lo que hizo que en acumular datos. El libro presenta su pobreza, su alegría y su relación con la naturaleza como la clave de su vida, y relata su influencia en la Edad Media. Es la visión de un autor católico, sin pretensión de erudición.", "en": "A short and unconventional biography of Francis of Assisi, written through Chesterton's eyes: more interested in understanding why Francis did what he did than in piling up facts. The book presents his poverty, joy and relationship with nature as the key to his life, and tells of his influence on the Middle Ages. It is the view of a Catholic author, with no pretence to scholarship."},
      porque: {"es": "Para quien quiere acercarse a san Francisco sin una biografía académica y prefiere una lectura vivaz, llena de imágenes. Muestra qué veía Chesterton en el santo y por qué le parecía un hombre que miraba el mundo del revés. Sirve a lectores de cualquier edad que busquen un retrato más humano que solemne.", "en": "For those who want to approach Saint Francis without an academic biography and prefer a lively reading full of images. It shows what Chesterton saw in the saint and why he thought of him as a man who looked at the world upside down. It suits readers of any age looking for a portrait that is more human than solemn."},
      imagen: {"src": "img/portadas/chesterton-st-francis-of-assisi.jpg", "credito": {"es": "Giotto, «Estigmatización de san Francisco», h. 1295-1300", "en": "Giotto, «Stigmatization of Saint Francis», c. 1295-1300"}, "url": "https://commons.wikimedia.org/wiki/File:Giotto._Stigmatization_of_St_Francis._1295-1300._314x162cm._Louvre,_Paris.jpg"},
      citas: [
        "Brother Fire, God made you beautiful and strong and useful; I pray you be courteous with me.",
        "any scene such as a landscape can sometimes be more clearly and freshly seen if it is seen upside down.",
        "St. Francis was talking the true language of a troubadour when he said that he also had a most glorious and gracious lady and that her name was Poverty."
      ],
      archivos: {"epub": "libros/chesterton-st-francis-of-assisi.epub", "pdf": "libros/chesterton-st-francis-of-assisi.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 63084 (dominio público); portada de Proyecto Fénix", "url": "https://www.gutenberg.org/ebooks/63084"},
      delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/san-francisco-de-asis-0"},
      parecidos: ["ortodoxia", "chesterton-the-everlasting-man", "chesterton-heretics"]
    },
    {
      id: "chesterton-the-ball-and-the-cross",
      titulo: "The Ball and the Cross",
      autor: "G. K. Chesterton",
      anio: "1909",
      idioma: "en",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Evan MacIan, un highlander católico, y Turnbull, un periodista ateo, acuerdan batirse a duelo por una discusión sobre Dios, y la policía y la opinión pública se lo impiden una y otra vez. Perseguidos por toda Inglaterra, descubren que se respetan más entre sí que a los tibios que los rodean. Una novela de aventuras, y a la vez un debate sobre la fe y la libertad con un duelo de espadas de por medio.", "en": "Evan MacIan, a Catholic Highlander, and Turnbull, an atheist journalist, agree to fight a duel over a quarrel about God, and the police and public opinion keep stopping them. Hunted across England, they discover that they respect each other more than the lukewarm people around them. It is an adventure novel and, at the same time, a debate about faith and freedom with a sword fight in the middle."},
      porque: {"es": "Para quien disfruta de una discusión seria narrada con humor y sin rencor, y para quien sospecha que creer o no creer importa de verdad. Chesterton da a cada bando sus mejores argumentos. Se lee casi de un tirón.", "en": "For anyone who enjoys a serious argument told with humour and without rancour, and who suspects that believing or not believing really matters. Chesterton gives each side its best arguments. It reads almost in one breath."},
      imagen: {"src": "img/portadas/chesterton-the-ball-and-the-cross.jpg", "credito": {"es": "Canaletto, «La catedral de San Pablo», h. 1754", "en": "Canaletto, «St Paul's Cathedral», c. 1754"}, "url": "https://commons.wikimedia.org/wiki/File:Canaletto_-_St._Paul%27s_Cathedral_-_Google_Art_Project.jpg"},
      citas: [
        "Man is a contradiction in terms; he is a beast whose superiority to other beasts consists in having fallen.",
        "I would fight for my friend, but if I lost my friend, I should still be there. I would fight for my country, but if I lost my country, I should still exist.",
        "If a man must not fight for this, may he fight for anything?",
        "It is a monstrous thing, for which men die."
      ],
      archivos: {"epub": "libros/chesterton-the-ball-and-the-cross.epub", "pdf": "libros/chesterton-the-ball-and-the-cross.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 5265 (dominio público); portada de Proyecto Fénix", "url": "https://www.gutenberg.org/ebooks/5265"},
      delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/la-esfera-y-la-cruz"},
      parecidos: ["chesterton-the-man-who-was-thursday", "chesterton-the-napoleon-of-notting-hill", "ortodoxia"]
    },
    {
      id: "chesterton-the-everlasting-man",
      titulo: "The Everlasting Man",
      autor: "G. K. Chesterton",
      anio: "1925",
      idioma: "en",
      categoria: "lectura",
      recomendado: false,
      resumen: {"es": "Chesterton cuenta la historia de la humanidad «desde fuera», como la vería alguien que no diera nada por supuesto: el hombre prehistórico, los mitos paganos, el mundo romano y, al final, el cristianismo. El libro sostiene que la figura de Cristo y la historia de la Iglesia no encajan en el esquema de una religión más entre otras. Es una obra de apologética escrita con ingenio, que expone la tesis del autor sin tratado de por medio.", "en": "Chesterton tells the story of humanity «from the outside», as it might look to someone who took nothing for granted: prehistoric man, pagan myths, the Roman world and, at the end, Christianity. The book argues that the figure of Christ and the history of the Church do not fit the pattern of one religion among others. It is a work of apologetics written with wit, setting out the author's thesis without a formal treatise."},
      porque: {"es": "Para el lector curioso que quiere ver cómo un católico lee la historia universal y por qué cree que el cristianismo es único. También le sirve a quien ha dudado de la fe y busca una defensa hecha con imaginación, no con fórmulas. Se dice que influyó en la conversión de C. S. Lewis, y ayuda a entender por qué tanta gente lo recomienda.", "en": "For the curious reader who wants to see how a Catholic reads world history and why he believes Christianity is unique. It also serves those who have doubted the faith and look for a defence made with imagination rather than formulas. It is said to have influenced C. S. Lewis's conversion, and it helps explain why so many people recommend it."},
      imagen: {"src": "img/portadas/chesterton-the-everlasting-man.jpg", "credito": {"es": "Gerard van Honthorst, «La adoración de los pastores», 1622", "en": "Gerard van Honthorst, «Adoration of the Shepherds», 1622"}, "url": "https://commons.wikimedia.org/wiki/File:Gerard_van_Honthorst_-_Adoration_of_the_Shepherds_(1622).jpg"},
      citas: [
        "Christianity has died many times and risen again; for it had a god who knew the way out of the grave.",
        "Omnipotence and impotence, or divinity and infancy, do definitely make a sort of epigram which a million repetitions cannot turn into a platitude.",
        "Bethlehem is emphatically a place where extremes meet."
      ],
      archivos: {"epub": "libros/chesterton-the-everlasting-man.epub", "pdf": "libros/chesterton-the-everlasting-man.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 65688 (dominio público); portada de Proyecto Fénix", "url": "https://www.gutenberg.org/ebooks/65688"},
      delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/el-hombre-eterno-0"},
      parecidos: ["ortodoxia", "chesterton-st-francis-of-assisi", "chesterton-heretics"]
    },
    {
      id: "chesterton-the-innocence-of-father-brown",
      titulo: "The Innocence of Father Brown",
      autor: "G. K. Chesterton",
      anio: "1911",
      idioma: "en",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Doce relatos en que un sacerdote bajito y distraído, el padre Brown, resuelve crímenes que desconciertan a la policía de Londres y de París. No le sirven las huellas ni los instrumentos: le sirve conocer el corazón humano, porque sabe de qué es capaz un hombre y por qué. Cada caso trae una paradoja y un golpe de ingenio, y detrás, la fe sencilla de quien ha escuchado muchas confesiones.", "en": "Twelve stories in which a short, absent-minded priest, Father Brown, solves crimes that baffle the police of London and Paris. He needs no fingerprints or gadgets: he reads the human heart, because he knows what a man is capable of and why. Every case brings a paradox and a stroke of wit, and behind them the plain faith of someone who has heard a great many confessions."},
      porque: {"es": "Para quien disfruta de un buen misterio y quiere, además, que el detective tenga alma. Los relatos son breves, de ritmo ágil y con final sorprendente, así que sirven tanto para una tarde como para leer de a uno antes de dormir. Chesterton enseña a mirar con humildad lo que parece evidente.", "en": "For anyone who enjoys a good mystery and would like the detective to have a soul as well. The stories are short, brisk and end with a surprise, so they suit an afternoon or one a night before sleep. Chesterton teaches the reader to look with humility at what seems obvious."},
      imagen: {"src": "img/portadas/chesterton-the-innocence-of-father-brown.jpg", "credito": {"es": "John Atkinson Grimshaw, «Blackman Street, Londres», 1885", "en": "John Atkinson Grimshaw, «Blackman Street, London», 1885"}, "url": "https://commons.wikimedia.org/wiki/File:Grimshaw_John_Atkinson_Blackman_Street_London_1885_Oil_On_Canvas.jpg"},
      citas: [
        "The criminal is the creative artist; the detective only the critic",
        "Reason and justice grip the remotest and the loneliest star.",
        "Where does a wise man hide a leaf? In the forest. But what does he do if there is no forest?"
      ],
      archivos: {"epub": "libros/chesterton-the-innocence-of-father-brown.epub", "pdf": "libros/chesterton-the-innocence-of-father-brown.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 204 (dominio público); portada de Proyecto Fénix", "url": "https://www.gutenberg.org/ebooks/204"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-candor-del-padre-brown"},
      parecidos: ["chesterton-the-wisdom-of-father-brown", "chesterton-the-man-who-was-thursday", "ortodoxia"]
    },
    {
      id: "chesterton-the-man-who-was-thursday",
      titulo: "The Man Who Was Thursday: A Nightmare",
      autor: "G. K. Chesterton",
      anio: "1908",
      idioma: "en",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Gabriel Syme, poeta y policía, se infiltra en el consejo secreto de los anarquistas de Europa, cuyos siete miembros llevan por nombre los días de la semana. Lo que empieza como una novela de espías se vuelve una persecución cada vez más extraña, hasta que el presidente, Domingo, y el sentido de todo el enredo salen a la luz. Es una pesadilla que acaba siendo una parábola sobre el orden, el mal y el sufrimiento.", "en": "Gabriel Syme, poet and policeman, infiltrates the secret council of the anarchists of Europe, whose seven members are named after the days of the week. What begins as a spy novel becomes an ever stranger chase, until the president, Sunday, and the meaning of the whole tangle come to light. It is a nightmare that turns out to be a parable about order, evil and suffering."},
      porque: {"es": "Para el lector que busca una aventura vertiginosa con verdadera hondura, y a quien no le importa que el libro lo desconcierte antes de explicarse. Conviene leerlo sin saber el final. Chesterton convierte el vértigo de la duda moderna en una invitación a la gratitud y al valor.", "en": "For the reader who wants a dizzying adventure with real depth, and who does not mind being baffled before the book explains itself. It is best read without knowing the ending. Chesterton turns the vertigo of modern doubt into an invitation to gratitude and courage."},
      imagen: {"src": "img/portadas/chesterton-the-man-who-was-thursday.jpg", "credito": {"es": "James McNeill Whistler, «Nocturno en negro y oro: el cohete que cae», h. 1875", "en": "James McNeill Whistler, «Nocturne in Black and Gold: The Falling Rocket», c. 1875"}, "url": "https://commons.wikimedia.org/wiki/File:Whistler-Nocturne_in_black_and_gold.jpg"},
      citas: [
        "Chaos is dull; because in chaos the train might indeed go anywhere, to Baker Street or to Bagdad. But man is a magician, and his whole magic is in this, that he does say Victoria, and lo! it is Victoria.",
        "Our digestions, for instance, going sacredly and silently right, that is the foundation of all poetry.",
        "His respectability was spontaneous and sudden, a rebellion against rebellion.",
        "“Can ye drink of the cup that I drink of?”"
      ],
      archivos: {"epub": "libros/chesterton-the-man-who-was-thursday.epub", "pdf": "libros/chesterton-the-man-who-was-thursday.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 1695 (dominio público); portada de Proyecto Fénix", "url": "https://www.gutenberg.org/ebooks/1695"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-hombre-que-fue-jueves"},
      parecidos: ["chesterton-the-ball-and-the-cross", "chesterton-the-napoleon-of-notting-hill", "ortodoxia"]
    },
    {
      id: "chesterton-the-napoleon-of-notting-hill",
      titulo: "The Napoleon of Notting Hill",
      autor: "G. K. Chesterton",
      anio: "1904",
      idioma: "en",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "En un Londres futuro y aburrido, un funcionario bromista es elegido rey por azar y, para divertirse, reparte a cada barrio un estandarte y una alabarda medievales. Solo un joven, Adam Wayne, se toma la broma en serio y defiende su calle como si fuera una patria. Una fantasía cómica sobre el patriotismo, el humor y la importancia de amar lo pequeño.", "en": "In a dull future London, a joking civil servant is chosen king by chance and, for fun, gives every borough a medieval banner and halberd. Only one young man, Adam Wayne, takes the joke seriously and defends his street as if it were a homeland. It is a comic fantasy about patriotism, humour and the importance of loving what is small."},
      porque: {"es": "Para el lector que quiere reír y pensar a la vez, y para quien tiene cariño por su barrio, su ciudad o su pueblo. Es una de las obras más ligeras de Chesterton y también una de las más imaginativas. Deja ganas de mirar la propia calle con ojos nuevos.", "en": "For the reader who wants to laugh and think at once, and for anyone fond of their neighbourhood, city or village. It is one of Chesterton's lightest works and also one of his most imaginative. It leaves you wanting to look at your own street with new eyes."},
      imagen: {"src": "img/portadas/chesterton-the-napoleon-of-notting-hill.jpg", "credito": {"es": "Edmund Blair Leighton, «¡Que Dios te acompañe!», 1900", "en": "Edmund Blair Leighton, «God Speed!», 1900"}, "url": "https://commons.wikimedia.org/wiki/File:Leighton-God_Speed!.jpg"},
      citas: [
        "Humour, my friends, is the one sanctity remaining to mankind. It is the one thing you are thoroughly afraid of.",
        "But whatever is touched with it is never again wholly common; whatever is touched with it takes a magic from outside the world.",
        "the patriot never under any circumstances boasts of the largeness of his country, but always, and of necessity, boasts of the smallness of it."
      ],
      archivos: {"epub": "libros/chesterton-the-napoleon-of-notting-hill.epub", "pdf": "libros/chesterton-the-napoleon-of-notting-hill.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 20058 (dominio público); portada de Proyecto Fénix", "url": "https://www.gutenberg.org/ebooks/20058"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-napoleon-de-notting-hill"},
      parecidos: ["chesterton-the-man-who-was-thursday", "chesterton-the-wisdom-of-father-brown", "ortodoxia"]
    },
    {
      id: "chesterton-whats-wrong-with-the-world",
      titulo: "What's Wrong with the World",
      autor: "G. K. Chesterton",
      anio: "1910",
      idioma: "en",
      categoria: "ensayo",
      recomendado: false,
      resumen: {"es": "Chesterton pasa revista a los males sociales de comienzos del siglo XX (la pobreza, la educación, el lugar de la mujer, el hogar) y propone que el remedio no es una ingeniería nueva sino devolver a la gente común la propiedad, la familia y la libertad de su casa. Entre bromas y paradojas defiende al ciudadano corriente frente a los reformadores y a los grandes intereses.", "en": "Chesterton surveys the social ills of the early twentieth century (poverty, education, the place of women, the home) and proposes that the remedy is not some new engineering but giving ordinary people back property, family and the freedom of their own house. Through jokes and paradox he defends the common citizen against reformers and big interests alike."},
      porque: {"es": "Para el lector que se pregunta qué falla en la sociedad y desconfía tanto de las soluciones de moda como del simple pesimismo. Sirve a quien se interesa por la familia, la educación o la propiedad, y quiere ver una defensa de la vida corriente hecha con ingenio. Es un libro de ideas, pero se lee con gusto por su humor.", "en": "For the reader who wonders what is going wrong in society and distrusts both fashionable solutions and plain pessimism. It suits those interested in family, education or property who want to see the ordinary life defended with wit. It is a book of ideas, yet it reads with pleasure because of its humour."},
      imagen: {"src": "img/portadas/chesterton-whats-wrong-with-the-world.jpg", "credito": {"es": "Ford Madox Brown, «El trabajo», 1852-1865", "en": "Ford Madox Brown, «Work», 1852-1865"}, "url": "https://commons.wikimedia.org/wiki/File:Ford_Madox_Brown_-_Work_-_Google_Art_Project.jpg"},
      citas: [
        "The Christian ideal has not been tried and found wanting. It has been found difficult; and left untried.",
        "to the moderately poor the home is the only place of liberty. Nay, it is the only place of anarchy.",
        "Coercion is a kind of encouragement; and anarchy (or what some call liberty) is essentially oppressive, because it is essentially discouraging."
      ],
      archivos: {"epub": "libros/chesterton-whats-wrong-with-the-world.epub", "pdf": "libros/chesterton-whats-wrong-with-the-world.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 1717 (dominio público); portada de Proyecto Fénix", "url": "https://www.gutenberg.org/ebooks/1717"},
      delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/lo-que-esta-mal-en-el-mundo"},
      parecidos: ["ortodoxia", "chesterton-heretics", "chesterton-the-everlasting-man"]
    },
    {
      id: "austen-pride-and-prejudice",
      titulo: "Pride and Prejudice",
      autor: "Jane Austen",
      anio: "1813",
      idioma: "en",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Elizabeth Bennet, viva e independiente, y el reservado señor Darcy empiezan mal: él la desdeña y ella se forma de él un juicio rápido. Entre bailes, cartas y visitas en la campiña inglesa, ambos tendrán que reconocer sus errores. La novela más querida de Jane Austen, con una ironía finísima y una familia inolvidable.", "en": "Lively, independent Elizabeth Bennet and the reserved Mr. Darcy get off to a bad start: he slights her, and she quickly makes up her mind about him. Through balls, letters and visits in the English countryside, each has to admit being wrong. Jane Austen's best-loved novel, with a fine irony and an unforgettable family."},
      porque: {"es": "Para quien quiere una historia de amor que se gana despacio, con inteligencia y sin escenas turbias. Enseña, riéndose, lo caro que cuesta juzgar a las personas por las apariencias, y lo bueno que es corregirse a tiempo. Se lee en una tarde de descanso y se vuelve a leer años después.", "en": "For anyone who wants a love story that is earned slowly, with wit and nothing unseemly. It teaches, with a smile, how costly it is to judge people by appearances, and how good it is to correct yourself in time. It reads in a restful afternoon and rewards a second reading years later."},
      imagen: {"src": "img/portadas/austen-pride-and-prejudice.jpg", "credito": {"es": "Thomas Lawrence, «Sarah Barrett Moulton: Pinkie», 1794", "en": "Thomas Lawrence, «Sarah Barrett Moulton: Pinkie», 1794"}, "url": "https://commons.wikimedia.org/wiki/File:Thomas_Lawrence_-_Sarah_Barrett_Moulton,_Pinkie.jpg"},
      citas: [
        "It is a truth universally acknowledged, that a single man in possession of a good fortune must be in want of a wife.",
        "I could easily forgive his pride, if he had not mortified mine.",
        "Till this moment, I never knew myself.",
        "There is a stubbornness about me that never can bear to be frightened at the will of others.",
        "I declare, after all, there is no enjoyment like reading!"
      ],
      archivos: {"epub": "libros/austen-pride-and-prejudice.epub", "pdf": "libros/austen-pride-and-prejudice.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 1342 (dominio público); portada de Proyecto Fénix", "url": "https://www.gutenberg.org/ebooks/1342"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/orgullo-y-prejuicio"},
      parecidos: ["austen-sense-and-sensibility", "austen-emma", "austen-persuasion"],
      versiones: {
        es: {"titulo": "Orgullo y prejuicio", "autor": "Jane Austen (trad. José Jordán de Urríes y Azara)", "anio": "1813", "resumen": {"es": "La llegada del rico y amable señor Bingley a Netherfield revoluciona a la familia Bennet, que tiene cinco hijas por casar y una madre empeñada en conseguirlo. Isabel, la segunda, viva e ingeniosa, se forma un juicio rápido y adverso del orgulloso señor Darcy, amigo de Bingley, y presta oído a las quejas del encantador Wickham. Una carta inesperada la obliga a revisar todo lo que creía saber. Entre bailes, visitas y cartas, los dos protagonistas aprenden a corregir su orgullo y sus prejuicios.", "en": "The arrival of the rich and amiable Mr. Bingley at Netherfield turns the Bennet household upside down: there are five daughters to marry and a mother set on doing it. Elizabeth, the second, lively and witty, quickly forms a poor opinion of proud Mr. Darcy, Bingley's friend, and listens to the grievances of the charming Wickham. An unexpected letter forces her to rethink everything she believed she knew. Through balls, visits and letters, both learn to correct their pride and their prejudices."}, "citas": ["Es verdad universalmente admitida que un soltero poseedor de buena fortuna tiene que necesitar una mujer.", "con facilidad perdonaría su orgullo si no hubiera mortificado el mío", "Pero la vanidad, no el amor, ha sido mi locura.", "Hasta este momento no me he conocido", "Declaro que no hay placer como la lectura."], "fuente": {"texto": "Traducción de José Jordán de Urríes y Azara, Madrid, Calpe, 1924 (Colección Universal, n.os 958 a 963), transcrita en es.wikisource.org (dominio público)", "url": "https://es.wikisource.org/wiki/Índice:Orgullo_y_prejuicio_-_Tomo_I_(1924).pdf"}, "imagen": {"src": "img/portadas/austen-pride-and-prejudice-es.jpg", "credito": {"es": "Thomas Lawrence, «Elizabeth Farren, más tarde condesa de Derby», 1790", "en": "Thomas Lawrence, «Elizabeth Farren, Later Countess of Derby», 1790"}, "url": "https://commons.wikimedia.org/wiki/File:Portrait_of_Elizabeth_Farren,_by_Thomas_Lawrence.jpg"}, "archivos": {"epub": "libros/austen-pride-and-prejudice-es.epub", "pdf": "libros/austen-pride-and-prejudice-es.pdf"}, "editorial": {"es": "Edición digital de Proyecto Fénix sobre la traducción de José Jordán de Urríes y Azara (Calpe, 1924), con ortografía actualizada y diálogos entre comillas. Edición al cuidado de Juan Ignacio Alcalde G.", "en": "Proyecto Fénix digital edition of José Jordán de Urríes y Azara's Spanish translation (Calpe, 1924), with updated spelling and dialogue set in quotation marks. Edited by Juan Ignacio Alcalde G."}}
      }
    },
    {
      id: "chesterton-the-wisdom-of-father-brown",
      titulo: "The Wisdom of Father Brown",
      autor: "G. K. Chesterton",
      anio: "1914",
      idioma: "en",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Segunda colección de casos del padre Brown: una banda de ladrones en los Alpes italianos, un duelo que nunca se celebra, un asesino que no existe, una antigua maldición de familia. Con su paraguas y su cara de no enterarse de nada, el pequeño sacerdote desmonta cada enigma desde dentro, mostrando que el mal rara vez es tan misterioso como parece y que la razón sana descubre lo que la ciencia pomposa no ve.", "en": "A second collection of Father Brown cases: a gang of thieves in the Italian Alps, a duel that never takes place, a murderer who does not exist, an old family curse. With his umbrella and his air of understanding nothing, the little priest takes each riddle apart from the inside, showing that evil is rarely as mysterious as it looks and that sound reason finds what pompous science misses."},
      porque: {"es": "Para quien ya conoce al padre Brown y quiere más, y para quien empieza por aquí sin perder nada, porque cada relato se lee solo. Hay humor, ironía contra los expertos sin sentido común y una compasión muy poco frecuente en la novela policial. Se disfruta a cualquier edad.", "en": "For readers who already know Father Brown and want more, and for newcomers who lose nothing by starting here, since every story stands alone. There is humour, irony at the expense of experts without common sense, and a compassion rare in detective fiction. It can be enjoyed at any age."},
      imagen: {"src": "img/portadas/chesterton-the-wisdom-of-father-brown.jpg", "credito": {"es": "Léon Cogniet, «La mujer del bandido italiano», h. 1825", "en": "Léon Cogniet, «The Italian Brigand's Wife», c. 1825"}, "url": "https://commons.wikimedia.org/wiki/File:Leon_coignet_The_Italian_Brigand_s_Wife.jpg"},
      citas: [
        "“One is never thinking of the real sorrow,” said the strange priest. “One can only be kind when it comes.”",
        "Even in a minute instance, it is best to look first to the main tendencies of Nature. A particular flower may not be dead in early winter, but the flowers are dying; a particular pebble may never be wetted with the tide, but the tide is coming in.",
        "If God Almighty held the truncheon of the lists, if St Michael blew the trumpet for the swords to cross--even then, if one of them stood ready, the other would not come."
      ],
      archivos: {"epub": "libros/chesterton-the-wisdom-of-father-brown.epub", "pdf": "libros/chesterton-the-wisdom-of-father-brown.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 223 (dominio público); portada de Proyecto Fénix", "url": "https://www.gutenberg.org/ebooks/223"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-sabiduria-del-padre-brown"},
      parecidos: ["chesterton-the-innocence-of-father-brown", "chesterton-the-napoleon-of-notting-hill", "ortodoxia"]
    },
    {
      id: "saint-exupery-el-principito",
      titulo: "El principito",
      autor: "Antoine de Saint-Exupéry",
      anio: "1943",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {
        es: "Un aviador cae con su avión en el desierto del Sahara, a mil millas de cualquier lugar habitado, y al amanecer lo despierta un niño que le pide que le dibuje un cordero. Es un pequeño príncipe que viene de un asteroide apenas más grande que una casa, donde dejó una rosa orgullosa a la que no supo querer. Mientras el aviador intenta reparar el motor, el principito le cuenta su viaje por otros planetas, habitados por un rey sin súbditos, un vanidoso, un bebedor, un hombre de negocios, un farolero y un geógrafo, y su llegada a la Tierra, donde un zorro le enseña qué significa domesticar y por qué su rosa es única. Escrito e ilustrado por el autor en Nueva York, durante la guerra.",
        en: "An airman crashes his plane in the Sahara, a thousand miles from any inhabited place, and at dawn he is woken by a child who asks him to draw a sheep. He is a little prince from an asteroid barely bigger than a house, where he left a proud rose he did not know how to love. While the airman tries to repair his engine, the little prince tells him of his journey through other planets, inhabited by a king with no subjects, a conceited man, a drunkard, a businessman, a lamplighter and a geographer, and of his arrival on Earth, where a fox teaches him what it means to tame and why his rose is unique. Written and illustrated by the author in New York, during the war."
      },
      porque: {"es":"Se lee en una tarde y sirve a cualquier edad: al niño le cuenta una aventura y al adulto le recuerda lo que olvidó al crecer. Es una buena puerta para hablar en familia o con amigos de la amistad, la fidelidad y el tiempo que se le da a quien se quiere. Conviene releerlo cada tantos años, porque cada vez dice algo distinto.","en":"It can be read in an afternoon and suits any age: it tells the child an adventure and reminds the adult of what was forgotten on growing up. It is a good way into a family or friendly conversation about friendship, faithfulness and the time we give to those we love. It is worth rereading every few years, because it says something different each time."},
      imagen: { src: "img/portadas/saint-exupery-el-principito.jpg", credito: { es: "Antoine de Saint-Exupéry, el principito en el asteroide B 612, dibujo de «Le Petit Prince», 1943", en: "Antoine de Saint-Exupéry, the little prince on asteroid B 612, drawing from «Le Petit Prince», 1943" }, url: "https://archive.org/details/SaintExupryAntoineDeLePetitPrinceGallimard1984" },
      citas: [
        "Todas las personas mayores fueron primero niños. (Pero pocas lo recuerdan).",
        "Solo se ve bien con el corazón. Lo esencial es invisible a los ojos.",
        "Es el tiempo que perdiste por tu rosa lo que hace a tu rosa tan importante.",
        "Te vuelves responsable para siempre de lo que has domesticado.",
        "Lo que embellece el desierto es que esconde un pozo en alguna parte..."
      ],
      editorial: { es: "Traducción nueva de Proyecto Fénix, directa del francés de 1943, con los 47 dibujos del autor y una nota de la edición.", en: "New Proyecto Fénix translation, straight from the 1943 French, with the author's 47 drawings and an edition note." },
      archivos: { epub: "libros/saint-exupery-el-principito.epub", pdf: "libros/saint-exupery-el-principito.pdf" },
      fuente: { texto: "Le Petit Prince, Nueva York, 1943 (dominio público en Chile desde 2015); traducción de Proyecto Fénix, CC BY-NC-SA 4.0", url: "https://openlibrary.org/works/OL10263W" },
      delibris: { valor: 6, genero: "Literatura", url: "https://www.delibris.org/es/el-principito" },
      parecidos: ["dickens-el-cantico-de-navidad", "flaubert-un-corazon-sencillo", "irving-cuentos-de-la-alhambra"]
    },
    {
      id: "unamuno-niebla",
      titulo: "Niebla",
      autor: "Miguel de Unamuno",
      anio: "1914",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Augusto Pérez, un joven rico y ocioso que vive sin rumbo tras la muerte de su madre, se enamora de pronto de Eugenia, una pianista que no lo quiere. Mientras la corteja, conversa con su perro Orfeo y con su amigo Víctor sobre el amor, la vida y la existencia, y su enamoramiento le hace sentir por primera vez que existe. Cuando el desengaño lo lleva a pensar en el suicidio, va a consultar al propio Unamuno, que le revela que no es más que un personaje de su novela. Unamuno la llamó «nivola» para marcar su distancia con la novela tradicional.", "en": "Augusto Pérez, a rich and idle young man drifting through life after his mother's death, suddenly falls in love with Eugenia, a piano teacher who does not love him. While courting her, he talks with his dog Orfeo and his friend Víctor about love, life and existence, and his infatuation makes him feel for the first time that he exists. When disappointment leads him to think of suicide, he goes to consult Unamuno himself, who reveals that he is only a character in his novel. Unamuno called it a «nivola» to set it apart from the traditional novel."},
      porque: {"es": "Para lectores que disfrutan de las preguntas grandes: quién soy, si mi vida tiene sentido, qué lugar ocupa Dios. Es una de las cumbres de la novela española del siglo XX, con mucho humor y un final que no se olvida. Conviene leerla con algo de madurez, porque toca la tentación del suicidio y las dudas de fe de su autor.", "en": "For readers who enjoy the big questions: who am I, does my life have meaning, where does God fit in. It is one of the peaks of the twentieth-century Spanish novel, full of humour and with an unforgettable ending. It is best read with some maturity, since it deals with the temptation of suicide and its author's doubts about faith."},
      imagen: {"src": "img/portadas/unamuno-niebla.jpg", "credito": {"es": "Caspar David Friedrich, «El caminante sobre el mar de nubes», 1818", "en": "Caspar David Friedrich, «Wanderer above the Sea of Fog», 1818"}, "url": "https://commons.wikimedia.org/wiki/File:Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg"},
      citas: [
        "Y la vida es esto, la niebla. La vida es una nebulosa.",
        "Gracias al amor siento al alma de bulto, la toco.",
        "El amor es un éxtasis; nos saca de nosotros mismos",
        "¿No es acaso todo esto un sueño de Dios o de quien sea, que se desvanecerá en cuanto Él despierte"
      ],
      archivos: {"epub": "libros/unamuno-niebla.epub", "pdf": "libros/unamuno-niebla.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 49836 (dominio público), sobre la primera edición: Madrid, Renacimiento, 1914", "url": "https://www.gutenberg.org/ebooks/49836"},
      delibris: {"valor": 5, "genero": "Literatura", "url": "https://www.delibris.org/es/niebla"},
      encuadernador: "Juan Ignacio Alcalde G.",
      parecidos: ["pardo-bazan-la-sirena-negra", "pardo-bazan-la-quimera", "cervantes-don-quijote"]
    },
    {
      id: "salgari-los-piratas-de-la-malasia",
      titulo: "Los piratas de la Malasia",
      autor: "Emilio Salgari (trad. R. Blanco Belmonte)",
      anio: "1896",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "El indio Kammamuri naufraga en los mares de la Malasia llevando consigo a Ada, la prometida de su amo Tremal-Naik, que perdió la razón en manos de los thugs. Los recogen los piratas de Mompracem, y Sandokan descubre que Ada es prima de su difunta esposa. Para devolverle a su prometido, condenado a la deportación por el rajá James Brooke, Sandokan y su inseparable Yáñez se internan en Sarawack con disfraces, narcóticos y astucias. Entre prisiones, un barco de forzados amotinado y una batalla final, el Tigre de la Malasia se enfrenta al temible «exterminador de los piratas».", "en": "The Indian Kammamuri is shipwrecked in the seas of Malaysia together with Ada, the fiancée of his master Tremal-Naik, who lost her reason in the hands of the Thugs. They are rescued by the pirates of Mompracem, and Sandokan discovers that Ada is a cousin of his late wife. To give her back her fiancé, sentenced to deportation by Rajah James Brooke, Sandokan and his inseparable Yáñez slip into Sarawak with disguises, narcotics and cunning. Through prisons, a mutiny on a convict ship and a final battle, the Tiger of Malaysia faces the fearsome «exterminator of pirates»."},
      porque: {"es": "Para lectores jóvenes y adultos que buscan aventura sin respiro: islas, selvas, abordajes y fugas imposibles. Debajo de la acción hay una lealtad a toda prueba entre amigos y un héroe que perdona a su enemigo vencido. Es la segunda novela de Sandokán, y se entiende bien aunque no se haya leído la primera.", "en": "For young and adult readers who want breathless adventure: islands, jungles, boardings and impossible escapes. Beneath the action lies an unshakable loyalty between friends and a hero who spares his defeated enemy. It is the second Sandokan novel, and it reads well even without the first."},
      imagen: {"src": "img/portadas/salgari-los-piratas-de-la-malasia.jpg", "credito": {"es": "Giuseppe Garuti (Pipein Gamba), ilustración de «I pirati della Malesia», 1902", "en": "Giuseppe Garuti (Pipein Gamba), illustration for «I pirati della Malesia», 1902"}, "url": "https://commons.wikimedia.org/wiki/File:Salgari,_I_pirati_della_Malesia,_illustrazione_(p._241),_1902_-_MuFant.jpg"},
      citas: [
        "No eres un prisionero, James Brooke: eres libre",
        "Me robaste a mi sobrina, pero me devuelves a una mujer tan amada por mí como la otra. Te perdono, ¡abrázame, sobrino, abrázame!...",
        "James Brooke, algún día volveremos a vernos; mi corazón no me engaña",
        "Los tigres de Mompracem no temen a los sabuesos del rajá"
      ],
      archivos: {"epub": "libros/salgari-los-piratas-de-la-malasia.epub", "pdf": "libros/salgari-los-piratas-de-la-malasia.pdf"},
      fuente: {"texto": "Versión española de R. Blanco Belmonte, Barcelona, Casa Editorial Maucci, c. 1910; escaneo de la Biblioteca Nacional de España en Wikimedia Commons (dominio público)", "url": "https://commons.wikimedia.org/wiki/File:Los_piratas_de_la_Malasia_-_bdh0000213076.pdf"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/los-piratas-de-malasia"},
      editorial: {"es": "Edición digital de Proyecto Fénix sobre la versión española de R. Blanco Belmonte (Maucci, c. 1910), con el texto establecido desde el escaneo, ortografía actualizada y diálogos entre comillas. Edición al cuidado de Juan Ignacio Alcalde G.", "en": "Proyecto Fénix digital edition of R. Blanco Belmonte's Spanish version (Maucci, c. 1910), with the text established from the scan, updated spelling and dialogue set in quotation marks. Edited by Juan Ignacio Alcalde G."},
      parecidos: ["salgari-el-rey-del-mar", "stevenson-isla-del-tesoro", "verne-la-vuelta-al-mundo-en-80-dias"]
    },
    {
      id: "ligorio-the-glories-of-mary",
      titulo: "The Glories of Mary",
      autor: "St. Alphonsus Liguori",
      anio: "1750",
      idioma: "en",
      categoria: "lectura",
      recomendado: false,
      resumen: {"es": "La gran obra mariana de san Alfonso María de Ligorio, Doctor de la Iglesia, publicada por primera vez en 1750. La primera parte comenta la Salve Regina frase por frase: María como Reina de misericordia, nuestra Madre, nuestra vida y nuestra esperanza, abogada de los pecadores, y la dulzura de su nombre. La segunda reúne discursos sobre sus fiestas y sus dolores, y un estudio de sus virtudes. El libro termina con prácticas de devoción, ejemplos y oraciones para cada día de la semana. Esta edición reproduce la traducción inglesa anónima de Nueva York, 1852.", "en": "The great Marian work of Saint Alphonsus Liguori, Doctor of the Church, first published in 1750. The first part comments on the Salve Regina phrase by phrase: Mary as Queen of Mercy, our Mother, our life and our hope, advocate of sinners, and the sweetness of her name. The second gathers discourses on her feasts and her sorrows, and a study of her virtues. The book closes with devotional practices, examples and prayers for each day of the week. This edition reproduces the anonymous English translation printed in New York in 1852."},
      porque: {"es": "Para quien quiere entender a fondo la devoción a la Virgen en la tradición católica: san Alfonso comenta la Salve Regina palabra por palabra y apoya su comentario en la Escritura, los Padres de la Iglesia y los santos. Sirve para el mes de mayo, para preparar las fiestas marianas y como lectura pausada, una sección cada vez. Quien lo lee aprende a rezar la Salve con más atención y se lleva ejemplos y oraciones para volver a ellos.", "en": "For anyone who wants to understand devotion to the Virgin in the Catholic tradition in depth: Saint Alphonsus comments on the Salve Regina word by word and supports his commentary with Scripture, the Fathers of the Church and the saints. It suits the month of May, the preparation of Marian feasts, and slow reading, one section at a time. The reader learns to pray the Salve with more attention and takes away examples and prayers to return to."},
      imagen: {"src": "img/portadas/ligorio-the-glories-of-mary.jpg", "credito": {"es": "Bartolomé Esteban Murillo, «La Inmaculada Concepción de los Venerables», h. 1678", "en": "Bartolomé Esteban Murillo, «The Immaculate Conception of Los Venerables», c. 1678"}, "url": "https://commons.wikimedia.org/wiki/File:Murillo_-_Inmaculada_Concepci%C3%B3n_de_los_Venerables_o_de_Soult_(Museo_del_Prado,_1678).jpg"},
      citas: [
        "Oh, blessed is he who clings with love and confidence to those two anchors of salvation, Jesus and Mary!",
        "Oh, happy those who live under the protection of a mother so loving and so powerful!",
        "Hear, then, our mother who calls us, and says to us: “Whosoever is a little one, let him come to me.”"
      ],
      archivos: {"epub": "libros/ligorio-the-glories-of-mary.epub", "pdf": "libros/ligorio-the-glories-of-mary.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 72411: traducción inglesa anónima, 2.ª edición americana, Nueva York, Edward Dunigan and Brother, 1852 (dominio público); portada de Proyecto Fénix", "url": "https://www.gutenberg.org/ebooks/72411"},
      delibris: {"valor": 6, "genero": "Espiritualidad", "url": "https://www.delibris.org/es/las-glorias-de-maria"},
      parecidos: ["preparacion-para-la-muerte", "escriva-santo-rosario", "presencia-de-dios"]
    },
    {
      id: "benson-lord-of-the-world",
      titulo: "Lord of the World",
      autor: "Robert Hugh Benson",
      anio: "1907",
      idioma: "en",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "A comienzos del siglo XXI, un humanitarismo sin Dios gobierna el mundo: la eutanasia es rutina, la Iglesia está acorralada y Europa, América y Oriente se encaminan a la guerra. Entonces aparece Julian Felsenburgh, un político norteamericano carismático que trae la paz universal y es aclamado como salvador y luego como dios. Frente a él, el joven sacerdote inglés Percy Franklin, cuyo rostro es idéntico al de Felsenburgh, sostiene la fe de una Iglesia cada vez más pequeña. Una novela de anticipación sobre el Anticristo y el fin de los tiempos.", "en": "Early in the twenty-first century a godless humanitarianism rules the world: euthanasia is routine, the Church is cornered, and Europe, America and the East are heading for war. Then Julian Felsenburgh appears, a charismatic American politician who brings universal peace and is hailed as saviour and then as god. Against him, the young English priest Percy Franklin, whose face is identical to Felsenburgh's, upholds the faith of an ever smaller Church. A novel of anticipation about the Antichrist and the end of time."},
      porque: {"es": "Para lectores adultos que quieren pensar el mundo de hoy con la fe: escrita en 1907, anticipa con asombrosa precisión la religión de la humanidad, la eutanasia y la soledad de los creyentes. Joseph Ratzinger la citó en 1992, antes de ser Benedicto XVI, y el papa Francisco la recomendó más de una vez. Su tono es grave y su final, apocalíptico, pero deja una esperanza firme.", "en": "For adult readers who want to think about today's world in the light of faith: written in 1907, it foresees with astonishing accuracy the religion of humanity, euthanasia and the loneliness of believers. Joseph Ratzinger cited it in 1992, before becoming Benedict XVI, and Pope Francis recommended it more than once. Its tone is grave and its ending apocalyptic, but it leaves a firm hope."},
      imagen: {"src": "img/portadas/benson-lord-of-the-world.jpg", "credito": {"es": "Alberto Durero, «Los cuatro jinetes del Apocalipsis», 1498", "en": "Albrecht Dürer, «The Four Horsemen», 1498"}, "url": "https://commons.wikimedia.org/wiki/File:Albrecht_D%C3%BCrer,_The_Four_Horsemen,_1498,_NGA_142352.jpg"},
      citas: [
        "I am perfectly aware that this is a terribly sensational book",
        "Men do recognise at last that a supernatural Religion involves an absolute authority, and that Private Judgment in matters of faith is nothing else than the beginning of disintegration.",
        "It was, in fact, the Catholic idea with the supernatural left out",
        "Then this world passed, and the glory of it."
      ],
      archivos: {"epub": "libros/benson-lord-of-the-world.epub", "pdf": "libros/benson-lord-of-the-world.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 14021 (dominio público)", "url": "https://www.gutenberg.org/ebooks/14021"},
      delibris: {"valor": 5, "genero": "Literatura", "url": "https://www.delibris.org/es/senor-del-mundo"},
      encuadernador: "Juan Ignacio Alcalde G.",
      parecidos: ["chesterton-the-ball-and-the-cross", "chesterton-the-napoleon-of-notting-hill", "quo-vadis"]
    },
    {
      id: "wallace-ben-hur",
      titulo: "Ben-Hur: A Tale of the Christ",
      autor: "Lew Wallace",
      anio: "1880",
      idioma: "en",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Judá Ben-Hur, joven príncipe judío de Jerusalén, es traicionado por su amigo de infancia, el romano Mesala: un accidente le basta para condenarlo a galeras y hacer desaparecer a su madre y a su hermana. Sobrevive al remo, salva la vida de un tribuno en una batalla naval y vuelve a Oriente rico y adoptado como romano, decidido a vengarse, lo que culmina en la célebre carrera de cuadrigas de Antioquía. Mientras busca a los suyos, su historia se cruza una y otra vez con la de Jesús de Nazaret, desde la llegada de los Magos hasta el Calvario.", "en": "Judah Ben-Hur, a young Jewish prince of Jerusalem, is betrayed by his childhood friend, the Roman Messala: one accident is enough to send him to the galleys and make his mother and sister disappear. He survives the oar, saves a tribune's life in a sea battle and returns to the East rich and adopted as a Roman, bent on revenge, which climaxes in the famous chariot race at Antioch. As he searches for his family, his story crosses again and again with that of Jesus of Nazareth, from the coming of the Wise Men to Calvary."},
      porque: {"es": "Es una de las grandes novelas de aventuras, y a la vez una historia de conversión: Ben-Hur aprende que el reino que espera no es de este mundo y que el perdón vale más que la venganza. Sirve a lectores jóvenes y adultos, y a quien quiera acercarse a la vida de Cristo desde la mirada de sus contemporáneos. Su prosa es amplia y algo solemne, pero la acción no da respiro.", "en": "It is one of the great adventure novels and, at the same time, a story of conversion: Ben-Hur learns that the kingdom he awaits is not of this world, and that forgiveness is worth more than revenge. It suits young and adult readers, and anyone who wants to approach the life of Christ through the eyes of his contemporaries. Its prose is broad and somewhat solemn, but the action never lets up."},
      imagen: {"src": "img/portadas/wallace-ben-hur.jpg", "credito": {"es": "Bartolomé Esteban Murillo, «La adoración de los Magos», h. 1655-1660", "en": "Bartolomé Esteban Murillo, «Adoration of the Magi», c. 1655-1660"}, "url": "https://commons.wikimedia.org/wiki/File:Bartolom%C3%A9_Esteban_Murillo_-_Adoration_of_the_Magi_-_Google_Art_Project.jpg"},
      citas: [
        "There is a kingdom on the earth, though it is not of it—a kingdom of wider bounds than the earth",
        "nor shall any man see it until he hath first known his own soul; for the kingdom is not for him, but for his soul.",
        "His habit is to move in mystery, yet sometimes he permits us to think we see and understand him.",
        "Out of that vast tomb Christianity issued to supersede the Cæsars."
      ],
      archivos: {"epub": "libros/wallace-ben-hur.epub", "pdf": "libros/wallace-ben-hur.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 2145 (dominio público)", "url": "https://www.gutenberg.org/ebooks/2145"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/ben-hur"},
      encuadernador: "Juan Ignacio Alcalde G.",
      parecidos: ["quo-vadis", "chesterton-the-ball-and-the-cross", "chesterton-the-innocence-of-father-brown"]
    },
    {
      id: "douay-rheims-bible",
      titulo: "The Holy Bible (Douay-Rheims, Challoner revision)",
      autor: "Douay-Rheims translation, revised by Bishop Richard Challoner",
      anio: "1582-1610; rev. 1749-1752",
      idioma: "en",
      categoria: "lectura",
      recomendado: false,
      resumen: {"es": "La Biblia católica clásica en lengua inglesa, traducida de la Vulgata latina de san Jerónimo y cotejada con los textos hebreo y griego. El Nuevo Testamento se publicó en Reims en 1582 y el Antiguo en Douai en 1609-1610, obra de los católicos ingleses exiliados del Colegio Inglés; el obispo Richard Challoner la revisó entre 1749 y 1752. Contiene los 73 libros del canon católico, con los argumentos de cada capítulo y las notas de Challoner que explican los pasajes difíciles según la doctrina de la Iglesia.", "en": "The classic Catholic Bible in English, translated from St. Jerome's Latin Vulgate and compared with the Hebrew and Greek texts. The New Testament was published at Rheims in 1582 and the Old at Douai in 1609-1610, the work of English Catholic exiles at the English College; Bishop Richard Challoner revised it between 1749 and 1752. It contains the 73 books of the Catholic canon, with the argument of each chapter and Challoner's notes explaining difficult passages according to the teaching of the Church."},
      porque: {"es": "Para leer y rezar la Sagrada Escritura completa en una traducción católica de lengua inglesa venerable, la que usaron generaciones de católicos de habla inglesa hasta el siglo XX. Sus breves notas ayudan a entender el texto sin salir de la página. Su inglés es antiguo y cercano al latín, pero de una dignidad que se presta a la oración.", "en": "For reading and praying the whole of Sacred Scripture in a venerable Catholic English translation, the one used by generations of English-speaking Catholics into the twentieth century. Its brief notes help one understand the text without leaving the page. Its English is old and close to the Latin, but has a dignity well suited to prayer."},
      imagen: {"src": "img/portadas/douay-rheims-bible.jpg", "credito": {"es": "Antonello da Messina, «San Jerónimo en su estudio», h. 1475", "en": "Antonello da Messina, «Saint Jerome in his Study», c. 1475"}, "url": "https://commons.wikimedia.org/wiki/File:Antonello_da_Messina_-_St_Jerome_in_his_study_-_National_Gallery_London.jpg"},
      citas: [
        "In the beginning God created heaven, and earth.",
        "The Lord ruleth me: and I shall want nothing.",
        "In the beginning was the Word: and the Word was with God: and the Word was God.",
        "For God so loved the world, as to give his only begotten Son: that whosoever believeth in him may not perish, but may have life everlasting.",
        "I am the way, and the truth, and the life."
      ],
      archivos: {"epub": "libros/douay-rheims-bible.epub", "pdf": "libros/douay-rheims-bible.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 1581 (dominio público): Douay-Rheims con la revisión de Challoner", "url": "https://www.gutenberg.org/ebooks/1581"},
      delibris: null,
      encuadernador: "Juan Ignacio Alcalde G.",
      parecidos: ["santos-evangelios-navarra", "imitacion-de-cristo", "fray-luis-de-leon-de-los-nombres-de-cristo"]
    },
    {
      id: "newman-loss-and-gain",
      titulo: "Loss and Gain: The Story of a Convert",
      autor: "Saint John Henry Newman",
      anio: "1848",
      idioma: "en",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Charles Reding, hijo de un clérigo anglicano, llega a estudiar a Oxford en plena agitación del Movimiento de Oxford. Entre conversaciones con compañeros, tutores y profesores de todas las tendencias, empieza a preguntarse dónde está la verdadera Iglesia, y sus dudas lo enfrentan a su familia, a sus amigos y a su propio porvenir. La novela sigue paso a paso, con humor y finura, el camino intelectual y espiritual que lo lleva a hacerse católico. Newman la escribió poco después de su propia conversión.", "en": "Charles Reding, son of an Anglican clergyman, goes up to Oxford in the midst of the Oxford Movement. Through conversations with fellow students, tutors and dons of every party, he begins to ask where the true Church is, and his doubts set him against his family, his friends and his own prospects. The novel follows, step by step and with humour and finesse, the intellectual and spiritual path that leads him to become a Catholic. Newman wrote it shortly after his own conversion."},
      porque: {"es": "Para quien busca la verdad con honestidad intelectual y quiere ver cómo razón y fe se encuentran en una vida concreta. Es una ventana a la conversión del propio Newman, contada con ironía sobre las modas religiosas de su tiempo. Los diálogos teológicos piden atención, pero el retrato de un joven que lo arriesga todo por la verdad conmueve a cualquier lector.", "en": "For anyone who seeks the truth with intellectual honesty and wants to see how reason and faith meet in a real life. It is a window onto Newman's own conversion, told with irony about the religious fashions of his day. The theological dialogues ask for attention, but the portrait of a young man who risks everything for the truth moves any reader."},
      imagen: {"src": "img/portadas/newman-loss-and-gain.jpg", "credito": {"es": "William Turner of Oxford, «Oxford desde el río, con Christ Church en primer plano», h. 1820", "en": "William Turner of Oxford, «Oxford from the River with Christ Church in the Foreground», c. 1820"}, "url": "https://commons.wikimedia.org/wiki/File:William_Turner_of_Oxford_-_Oxford_from_the_River_with_Christ_Church_in_the_Foreground_-_Google_Art_Project.jpg"},
      citas: [
        "It is not a mere form of words,--it is a great action, the greatest action that can be on earth.",
        "the Catholic Church is the only true Church. I may be wrong in many things; I cannot be wrong in this.",
        "Too late have I known Thee, O Thou ancient Truth; too late have I found Thee, First and only Fair.",
        "so happy in the Present, that he had no thoughts either for the Past or the Future."
      ],
      archivos: {"epub": "libros/newman-loss-and-gain.epub", "pdf": "libros/newman-loss-and-gain.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 24574 (dominio público), sobre la 8.ª edición: Londres, Burns and Oates, 1881", "url": "https://www.gutenberg.org/ebooks/24574"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/perder-y-ganar"},
      encuadernador: "Juan Ignacio Alcalde G.",
      parecidos: ["chesterton-the-ball-and-the-cross", "quo-vadis", "benson-lord-of-the-world"]
    },
    {
      id: "wiseman-fabiola",
      titulo: "Fabiola, or the Church of the Catacombs",
      autor: "Cardinal Nicholas Wiseman",
      anio: "1854",
      idioma: "en",
      categoria: "novela",
      recomendado: false,
      resumen: {"es": "Roma, año 302, en vísperas de la gran persecución de Diocleciano. Fabiola, una joven patricia rica, culta y orgullosa, desprecia a los cristianos sin conocerlos, mientras a su alrededor viven en secreto la niña Inés, el soldado Sebastián y el joven Pancracio. A través de su amistad con ellos y del encuentro con una esclava ciega, Fabiola descubre la caridad, el perdón y la fe que los lleva a dar la vida. La novela recorre las catacumbas, los tribunales y el anfiteatro, con los mártires romanos como protagonistas.", "en": "Rome, AD 302, on the eve of Diocletian's great persecution. Fabiola, a young patrician, rich, cultured and proud, despises the Christians without knowing them, while around her the girl Agnes, the soldier Sebastian and the youth Pancratius live their faith in secret. Through her friendship with them and her meeting with a blind slave girl, Fabiola discovers the charity, forgiveness and faith that lead them to give their lives. The novel moves through the catacombs, the courts and the amphitheatre, with the Roman martyrs as its heroes."},
      porque: {"es": "Para lectores jóvenes y adultos que quieran conocer cómo vivían y morían los primeros cristianos: Wiseman, gran arqueólogo de las catacumbas, mezcla la novela con la historia y las actas de los mártires. Muestra con fuerza que la caridad cristiana era una novedad en el mundo antiguo. Es lenta en algunos pasajes de erudición, pero sus escenas de martirio y conversión son inolvidables.", "en": "For young and adult readers who want to know how the first Christians lived and died: Wiseman, a great archaeologist of the catacombs, blends fiction with history and the acts of the martyrs. It shows powerfully that Christian charity was something new in the ancient world. Some learned passages are slow, but its scenes of martyrdom and conversion are unforgettable."},
      imagen: {"src": "img/portadas/wiseman-fabiola.jpg", "credito": {"es": "Jean-Jacques Henner, «Fabiola», 1893", "en": "Jean-Jacques Henner, «Fabiola», 1893"}, "url": "https://commons.wikimedia.org/wiki/File:HENNER_Jean-Jacques_Fabiola_Huile_sur_toile.jpg"},
      citas: [
        "May God forgive you, as I freely and fully do; and may He bless you abundantly.",
        "she had never imagined that there was such a thing as disinterested love on earth between strangers; as to charity, it was a word unknown to Greece or Rome.",
        "a poor slave can only do so by finding some one still poorer, and helpless, like me. That thought makes her food by far the sweetest.",
        "what truth can they possess, and what inducements can they have, to die for any of their vain opinions?"
      ],
      archivos: {"epub": "libros/wiseman-fabiola.epub", "pdf": "libros/wiseman-fabiola.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 62254 (dominio público), sobre la edición ilustrada de Benziger Brothers, Nueva York, 1886", "url": "https://www.gutenberg.org/ebooks/62254"},
      delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/fabiola-o-la-iglesia-de-las-catacumbas"},
      encuadernador: "Juan Ignacio Alcalde G.",
      parecidos: ["quo-vadis", "wallace-ben-hur", "chesterton-the-ball-and-the-cross"]
    },
    {
      id: "newman-the-dream-of-gerontius",
      titulo: "The Dream of Gerontius",
      autor: "Saint John Henry Newman",
      anio: "1865",
      idioma: "en",
      categoria: "poesia",
      recomendado: false,
      resumen: {"es": "Poema dramático sobre la muerte de un cristiano y el viaje de su alma. Gerontius agoniza rodeado de amigos que rezan por él y del sacerdote que lo encomienda a Dios; luego despierta, ya sin cuerpo, en manos de su Ángel de la Guarda, que lo conduce ante el juicio entre los gritos de los demonios y los coros de los ángeles. Tras ver un instante a Dios, el alma pide ella misma ir al purgatorio, donde espera en paz su purificación. Esta edición incluye la introducción y las notas de Maurice Francis Egan.", "en": "A dramatic poem on the death of a Christian and the journey of his soul. Gerontius lies dying, surrounded by friends who pray for him and by the priest who commends him to God; then he wakes, now without his body, in the hands of his Guardian Angel, who leads him to judgment amid the cries of demons and the choirs of angels. After a glimpse of God, the soul itself asks to be taken to purgatory, where it awaits its purification in peace. This edition includes Maurice Francis Egan's introduction and notes."},
      porque: {"es": "Es una meditación sobre la muerte, el juicio y el purgatorio llena de esperanza, escrita por un santo y doctor de la Iglesia. Sirve para rezar por los difuntos, para prepararse a la propia muerte y para entender la doctrina católica sobre lo que viene después. Sus himnos, como «Praise to the Holiest», se cantan todavía en las iglesias de habla inglesa.", "en": "It is a meditation on death, judgment and purgatory full of hope, written by a saint and Doctor of the Church. It helps one pray for the dead, prepare for one's own death and understand Catholic teaching on what comes after. Its hymns, such as «Praise to the Holiest», are still sung in English-speaking churches."},
      imagen: {"src": "img/portadas/newman-the-dream-of-gerontius.jpg", "credito": {"es": "El Bosco, «Ascenso al Empíreo», h. 1500-1504", "en": "Hieronymus Bosch, «Ascent of the Blessed», c. 1500-1504"}, "url": "https://commons.wikimedia.org/wiki/File:Hieronymus_Bosch_013.jpg"},
      citas: [
        "Jesu, Maria--I am near to death, / And Thou art calling me; I know it now--",
        "Firmly I believe and truly / God is Three, and God is One; / And I next acknowledge duly / Manhood taken by the Son.",
        "Praise to the Holiest in the height, / And in the depth be praise: / In all His words most wonderful; / Most sure in all His ways!",
        "Take me away, and in the lowest deep / There let me be, / And there in hope the lone night-watches keep, / Told out for me."
      ],
      archivos: {"epub": "libros/newman-the-dream-of-gerontius.epub", "pdf": "libros/newman-the-dream-of-gerontius.pdf"},
      fuente: {"texto": "Project Gutenberg, libro n.º 48927 (dominio público), sobre la edición de Longmans, Green, and Co., Nueva York, 1910, con introducción y notas de Maurice Francis Egan", "url": "https://www.gutenberg.org/ebooks/48927"},
      delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/el-sueno-de-un-anciano"},
      encuadernador: "Juan Ignacio Alcalde G.",
      parecidos: ["newman-loss-and-gain", "imitacion-de-cristo", "fray-luis-de-leon-de-los-nombres-de-cristo"]
    }
  ],

  // Libros que Fénix busca (sección Encuadernadores, #encuadernadores): libres en Chile y en EE.UU.
  // (autor, y traductor si lo hay, muerto antes de 1956; obra anterior a 1931) y bien valorados en
  // Delibris (5 o 6). Una línea por obra (recibir_entrega.py la saca así). titulo: en cada idioma que
  // se pide; sin "en", no aparece en el sitio en inglés. delibris como en las fichas, o null con
  // `estimada` { valor, genero } si Delibris no la reseña. reservado: "dd-mmm-aaaa" cuando alguien la
  // toma (formulario «Fénix - encuadernador»). El sitio oculta sola la que ya está en ese idioma.
  buscados: [
    { titulo: {"es": "Sentido y sensibilidad"}, autor: "Jane Austen", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/sentido-y-sensibilidad"} },
    { titulo: {"es": "Emma"}, autor: "Jane Austen", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/emma"} },
    { titulo: {"es": "Persuasión"}, autor: "Jane Austen", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/persuasion"} },
    { titulo: {"es": "Mansfield Park"}, autor: "Jane Austen", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/mansfield-park"} },
    { titulo: {"es": "La abadía de Northanger"}, autor: "Jane Austen", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-abadia-de-northanger"} },
    { titulo: {"es": "Ortodoxia", "en": "Orthodoxy"}, autor: "G. K. Chesterton", delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/ortodoxia"} },
    { titulo: {"es": "Herejes"}, autor: "G. K. Chesterton", delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/herejes"} },
    { titulo: {"es": "El hombre eterno"}, autor: "G. K. Chesterton", delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/el-hombre-eterno-0"} },
    { titulo: {"es": "San Francisco de Asís"}, autor: "G. K. Chesterton", delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/san-francisco-de-asis-0"} },
    { titulo: {"es": "El candor del padre Brown"}, autor: "G. K. Chesterton", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-candor-del-padre-brown"} },
    { titulo: {"es": "La sabiduría del padre Brown"}, autor: "G. K. Chesterton", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-sabiduria-del-padre-brown"} },
    { titulo: {"es": "El hombre que fue jueves"}, autor: "G. K. Chesterton", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-hombre-que-fue-jueves"} },
    { titulo: {"es": "La esfera y la cruz"}, autor: "G. K. Chesterton", delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/la-esfera-y-la-cruz"} },
    { titulo: {"es": "El Napoleón de Notting Hill"}, autor: "G. K. Chesterton", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-napoleon-de-notting-hill"} },
    { titulo: {"es": "Lo que está mal en el mundo"}, autor: "G. K. Chesterton", delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/lo-que-esta-mal-en-el-mundo"} },
    { titulo: {"es": "Las glorias de María"}, autor: "San Alfonso María de Ligorio", delibris: {"valor": 6, "genero": "Espiritualidad", "url": "https://www.delibris.org/es/las-glorias-de-maria"} },
    { titulo: {"es": "Visitas al Santísimo Sacramento y a María Santísima", "en": "Visits to the Most Blessed Sacrament and to the Blessed Virgin Mary"}, autor: "San Alfonso María de Ligorio", delibris: {"valor": 6, "genero": "Espiritualidad", "url": "https://www.delibris.org/es/visitas-al-santisimo-sacramento-y-maria-santisima-para-todos-los-dias"} },
    { titulo: {"es": "Práctica del amor a Jesucristo", "en": "The Practice of the Love of Jesus Christ"}, autor: "San Alfonso María de Ligorio", delibris: {"valor": 6, "genero": "Espiritualidad", "url": "https://www.delibris.org/es/practica-del-amor-jesucristo"} },
    { titulo: {"es": "Meditaciones sobre la Pasión de Jesucristo", "en": "The Passion and the Death of Jesus Christ"}, autor: "San Alfonso María de Ligorio", delibris: {"valor": 6, "genero": "Espiritualidad", "url": "https://www.delibris.org/es/meditaciones-sobre-la-pasion-de-jesucristo"} },
    { titulo: {"es": "Del gran medio de la oración", "en": "Prayer, the Great Means of Salvation"}, autor: "San Alfonso María de Ligorio", delibris: null, estimada: {"valor": 6, "genero": "Pensamiento"} },
    { titulo: {"es": "Introducción a la vida devota", "en": "Introduction to the Devout Life"}, autor: "San Francisco de Sales", delibris: {"valor": 6, "genero": "Espiritualidad", "url": "https://www.delibris.org/es/introduccion-la-vida-devota"} },
    { titulo: {"es": "Tratado del amor de Dios", "en": "Treatise on the Love of God"}, autor: "San Francisco de Sales", delibris: {"valor": 6, "genero": "Espiritualidad", "url": "https://www.delibris.org/es/tratado-del-amor-de-dios"} },
    { titulo: {"es": "El combate espiritual", "en": "The Spiritual Combat"}, autor: "Lorenzo Scupoli", delibris: {"valor": 6, "genero": "Espiritualidad", "url": "https://www.delibris.org/es/combate-espiritual"} },
    { titulo: {"es": "El abandono en la Providencia divina", "en": "Abandonment to Divine Providence"}, autor: "Jean-Pierre de Caussade", delibris: {"valor": 6, "genero": "Espiritualidad", "url": "https://www.delibris.org/es/el-abandono-de-si-mismo-en-la-providencia-divina"} },
    { titulo: {"es": "Tratado de la verdadera devoción a la Santísima Virgen", "en": "True Devotion to Mary"}, autor: "San Luis María Grignion de Montfort", delibris: {"valor": 6, "genero": "Espiritualidad", "url": "https://www.delibris.org/es/tratado-de-la-verdadera-devocion-la-santisima-virgen"} },
    { titulo: {"es": "Todo por Jesús", "en": "All for Jesus"}, autor: "Frederick William Faber", delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/todo-por-jesus"} },
    { titulo: {"es": "Progreso del alma en la vida espiritual", "en": "Growth in Holiness"}, autor: "Frederick William Faber", delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/progreso-del-alma-en-la-vida-espiritual"} },
    { titulo: {"es": "El alma de todo apostolado", "en": "The Soul of the Apostolate"}, autor: "Jean-Baptiste Chautard", delibris: {"valor": 6, "genero": "Espiritualidad", "url": "https://www.delibris.org/es/el-alma-de-todo-apostolado"} },
    { titulo: {"es": "Apologia pro vita sua", "en": "Apologia pro Vita Sua"}, autor: "San John Henry Newman", delibris: {"valor": 6, "genero": "Espiritualidad", "url": "https://www.delibris.org/es/apologia-pro-vita-sua"} },
    { titulo: {"es": "Perder y ganar"}, autor: "San John Henry Newman", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/perder-y-ganar"} },
    { titulo: {"es": "El sueño de Geroncio"}, autor: "San John Henry Newman", delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/el-sueno-de-un-anciano"} },
    { titulo: {"es": "Señor del mundo"}, autor: "Robert Hugh Benson", delibris: {"valor": 5, "genero": "Literatura", "url": "https://www.delibris.org/es/senor-del-mundo"} },
    { titulo: {"es": "La amistad de Cristo", "en": "The Friendship of Christ"}, autor: "Robert Hugh Benson", delibris: {"valor": 6, "genero": "Espiritualidad", "url": "https://www.delibris.org/es/la-amistad-de-cristo"} },
    { titulo: {"es": "¿Con qué autoridad?", "en": "By What Authority?"}, autor: "Robert Hugh Benson", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/con-que-autoridad"} },
    { titulo: {"es": "Confesiones de un converso", "en": "Confessions of a Convert"}, autor: "Robert Hugh Benson", delibris: {"valor": 6, "genero": "Espiritualidad", "url": "https://www.delibris.org/es/confesiones-de-un-converso"} },
    { titulo: {"es": "Europa y la fe", "en": "Europe and the Faith"}, autor: "Hilaire Belloc", delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/europe-and-faith"} },
    { titulo: {"es": "Fabiola o la Iglesia de las catacumbas"}, autor: "Cardenal Nicholas Wiseman", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/fabiola-o-la-iglesia-de-las-catacumbas"} },
    { titulo: {"es": "Ben-Hur"}, autor: "Lew Wallace", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/ben-hur"} },
    { titulo: {"es": "Jeromín"}, autor: "Luis Coloma", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/jeromin"} },
    { titulo: {"es": "Boy"}, autor: "Luis Coloma", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/boy"} },
    { titulo: {"es": "El jardín secreto"}, autor: "Frances Hodgson Burnett", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-jardin-secreto"} },
    { titulo: {"es": "El pequeño Lord Fauntleroy"}, autor: "Frances Hodgson Burnett", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-pequeno-lord"} },
    { titulo: {"es": "Ética a Nicómaco"}, autor: "Aristóteles", delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/etica-nicomaco"} },
    { titulo: {"es": "Estudio en escarlata"}, autor: "Arthur Conan Doyle", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/estudio-en-escarlata"} },
    { titulo: {"es": "El signo de los cuatro"}, autor: "Arthur Conan Doyle", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-signo-de-los-cuatro"} },
    { titulo: {"es": "Las aventuras de Sherlock Holmes"}, autor: "Arthur Conan Doyle", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/aventuras-de-sherlock-holmes"} },
    { titulo: {"es": "Las memorias de Sherlock Holmes"}, autor: "Arthur Conan Doyle", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/las-memorias-de-sherlock-holmes"} },
    { titulo: {"es": "El regreso de Sherlock Holmes"}, autor: "Arthur Conan Doyle", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-regreso-de-sherlock-holmes"} },
    { titulo: {"es": "El valle del terror"}, autor: "Arthur Conan Doyle", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-valle-del-terror"} },
    { titulo: {"es": "El último saludo de Sherlock Holmes"}, autor: "Arthur Conan Doyle", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-ultimo-saludo-de-sherlock-holmes"} },
    { titulo: {"es": "Peter Pan"}, autor: "J. M. Barrie", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/peter-pan-0"} },
    { titulo: {"es": "Tarzán de los monos"}, autor: "Edgar Rice Burroughs", delibris: {"valor": 5, "genero": "Literatura", "url": "https://www.delibris.org/es/tarzan-de-los-monos"} },
    { titulo: {"es": "El libro de la selva"}, autor: "Rudyard Kipling", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-libro-de-la-selva"} },
    { titulo: {"es": "Sobre el problema de la empatía"}, autor: "Santa Teresa Benedicta de la Cruz (Edith Stein)", delibris: null, estimada: {"valor": 6, "genero": "Pensamiento"} },
    { titulo: {"es": "Ofrenda lírica (Gitanjali)"}, autor: "Rabindranath Tagore", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/ofrenda-lirica"} },
    { titulo: {"es": "La luna nueva"}, autor: "Rabindranath Tagore", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-luna-nueva"} },
    { titulo: {"es": "El jardinero"}, autor: "Rabindranath Tagore", delibris: {"valor": 5, "genero": "Literatura", "url": "https://www.delibris.org/es/el-jardinero"} },
    { titulo: {"es": "La anunciación a María"}, autor: "Paul Claudel", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/la-anunciacion-maria"} },
    { titulo: {"es": "El zapato de raso"}, autor: "Paul Claudel", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/el-zapato-de-raso"} },
    { titulo: {"es": "Cinco grandes odas"}, autor: "Paul Claudel", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/cinco-grandes-odas"} },
    { titulo: {"es": "El rehén"}, autor: "Paul Claudel", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/lotage"} },
    { titulo: {"es": "Conocimiento del Este"}, autor: "Paul Claudel", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/conocimiento-del-este"} },
    { titulo: {"es": "Dublineses"}, autor: "James Joyce", delibris: {"valor": 5, "genero": "Literatura", "url": "https://www.delibris.org/es/dublineses"} },
    { titulo: {"es": "Al faro"}, autor: "Virginia Woolf", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/al-faro"} },
    { titulo: {"es": "El cuarto de Jacob"}, autor: "Virginia Woolf", delibris: {"valor": 5, "genero": "Literatura", "url": "https://www.delibris.org/es/el-cuarto-de-jacob"} },
    { titulo: {"es": "Noche y día"}, autor: "Virginia Woolf", delibris: {"valor": 5, "genero": "Literatura", "url": "https://www.delibris.org/es/noche-y-dia"} },
    { titulo: {"es": "Fouché"}, autor: "Stefan Zweig", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/fouche"} },
    { titulo: {"es": "Tres maestros: Balzac, Dickens, Dostoievski"}, autor: "Stefan Zweig", delibris: {"valor": 6, "genero": "Pensamiento", "url": "https://www.delibris.org/es/tres-maestros-balzac-dickens-dostoievsky"} },
    { titulo: {"es": "Ardiente secreto"}, autor: "Stefan Zweig", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/ardiente-secreto"} },
    { titulo: {"es": "Jeremías"}, autor: "Stefan Zweig", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/jeremias"} },
    { titulo: {"es": "Mendel el de los libros"}, autor: "Stefan Zweig", delibris: {"valor": 6, "genero": "Literatura", "url": "https://www.delibris.org/es/mendel-el-de-los-libros"} },
    { titulo: {"es": "Carta de una desconocida"}, autor: "Stefan Zweig", delibris: {"valor": 5, "genero": "Literatura", "url": "https://www.delibris.org/es/carta-de-una-desconocida"} },
    { titulo: {"es": "Veinticuatro horas en la vida de una mujer"}, autor: "Stefan Zweig", delibris: {"valor": 5, "genero": "Literatura", "url": "https://www.delibris.org/es/veinticuatro-horas-en-la-vida-de-una-mujer-y-otros-relatos"} }
  ],

  // Cola interna de obras con derechos (el sitio no la muestra): via "permiso" = pedirlo al titular
  // por escrito (skill buscar-libros, sección 4) y, con el sí, alojar; via "esperar" = libre en Chile
  // pero no en EE.UU. (GitHub Pages), entra a `buscados` el 1 de enero de `libre`. estado:
  // "por pedir" | "pedido dd-mmm-aaaa" | "concedido" | "negado". Fuente de cada dato en `fuente`.
  pendientesDerechos: [
    { obra: "Novelas de Georgette Heyer (Arabella, Frederica, Venetia, Cotillion y otras)", autor: "Georgette Heyer (m. 1974)", via: "permiso", libre: "2045", titular: "The Estate of Georgette Heyer, representado por Peter Buckman (The Ampersand Agency); en español, Ediciones Palabra", contacto: "office@theampersandagency.co.uk", fuente: "https://theampersandagency.co.uk/contact", estado: "pedido 22-oct-2026" },
    { obra: "The Giver (El dador)", autor: "Lois Lowry (viva)", via: "permiso", libre: null, titular: "Lois Lowry; editorial original HMH (Houghton Mifflin), en español Editorial Everest (trad. Luisa Balseiro)", contacto: "formulario de https://loislowry.com/contact/", fuente: "https://loislowry.com/contact/", estado: "por pedir" },
    { obra: "Obras de José Miguel Ibáñez Langlois (Libro de la Pasión, Por qué sufrir, La Virgen María y otras)", autor: "José Miguel Ibáñez Langlois (vivo)", via: "permiso", libre: null, titular: "el autor; editorial Rialp", contacto: "ediciones@rialp.com, +34 913 260 504", fuente: "https://www.rialp.com/autor/jose-miguel-ibanez-langlois/", estado: "pedido 22-oct-2026" },
    { obra: "Obras de Enrique Monasterio (El Belén que puso Dios, Pensar por libre, Relatos a la sombra de la Cruz, Un safari en mi pasillo)", autor: "Enrique Monasterio", via: "permiso", libre: null, titular: "el autor; El Belén que puso Dios, Ediciones Palabra (descatalogado)", contacto: "monasterix@gmail.com (correo del autor en su blog; Palabra: palabra@palabra.es)", fuente: "https://pensarporlibre.blogspot.com/", estado: "pedido 22-oct-2026" },
    { obra: "Edward o el Caballero Verde y Orencio y Eloísa (hoy fichas con enlace: edward-caballero-verde, orencio-y-eloisa)", autor: "Benjamín Franzani (vivo)", via: "permiso", libre: null, titular: "el autor; editorial Vuelo Ártico", contacto: "info@vueloartico.com (contacto de prensa en su sitio)", fuente: "https://www.benjaminfranzani.com/p/para-resenadores-y-prensa.html", estado: "pedido 22-oct-2026" },
    { obra: "Diario de santa Faustina, «La Divina Misericordia en mi alma»", autor: "Santa Faustina Kowalska (m. 1938)", via: "permiso", libre: "2048", titular: "Congregación de las Hermanas de Nuestra Señora de la Misericordia (Cracovia); edición en español de Marian Press, Stockbridge (trad. Eva Bylicka)", contacto: "misericordia@faustyna.pl (Wydawnictwo Misericordia, editorial de la congregación); la traducción al español es © 1993 de los Padres Marianos de Stockbridge, y la congregación la publica gratis en un lector en línea, no en PDF (santafaustina.es/el-diario-2/; hoy ficha con enlace: diario-santa-faustina)", fuente: "https://www.faustyna.pl/zmbm/kontakt/", estado: "pedido 22-oct-2026" },
    { obra: "The Ordinary Princess", autor: "M. M. Kaye (m. 2004)", via: "permiso", libre: "2075", titular: "The Estate of M. M. Kaye, representado por Georgia Glover (David Higham Associates); editorial actual Penguin", contacto: "reception@davidhigham.co.uk (el formulario de permisos de la agencia es solo para extractos)", fuente: "https://davidhigham.co.uk/authors-dh/m-m-kaye/", estado: "pedido 22-oct-2026" },
    { obra: "Catálogo de la Fundación Gratis Date (74 obras: Iraburu, Rivera, Marmion y otras; EPUB y PDF en gratisdate.org/textos.php), incluido el Marmion que Fénix ya aloja", autor: "José María Iraburu (n. 1935), José Rivera (m. 1991) y otros", via: "permiso", libre: null, titular: "Fundación Gratis Date, Pamplona", contacto: "fundacion@gratisdate.org (el sitio no tiene formulario)", fuente: "https://www.gratisdate.org/fundacion.php: «permite la reproducción total o parcial de sus obras [...] con tres condiciones: 1ª Citación de procedencia. 2ª Aviso previo, que permita autorizar la reproducción. 3ª Exclusión de todo fin de lucro» (leído el 22-oct-2026); basta el aviso y guardar su respuesta", estado: "pedido 23-oct-2026" },
    { obra: "Teología espiritual encarnada (San Pablo, 2005; hoy sin ficha)", autor: "Víctor Manuel Fernández (vivo)", via: "permiso", libre: null, titular: "el autor y San Pablo Argentina", contacto: null, fuente: "https://repositorio.uca.edu.ar/handle/123456789/7028: el repositorio UCA le pone CC BY-NC-SA 4.0 en metadatos, pero el PDF dice «La Biblioteca posee la autorización del autor y de la editorial para su divulgación en línea»: el permiso es para la UCA, no para terceros; por ahora solo enlace a esa descarga", estado: "por pedir" },
    { obra: "El principito", autor: "Antoine de Saint-Exupéry (m. 1944)", via: "esperar", libre: "2039", titular: "libre en Chile desde 2015; en EE.UU. protegido hasta el 31-dic-2038 (publicado en 1943)", contacto: null, fuente: "https://www.delibris.org/es/el-principito", estado: "en espera" },
    { obra: "Rebelión en la granja", autor: "George Orwell (m. 1950)", via: "esperar", libre: "2041", titular: "libre en Chile desde 2021; en EE.UU. protegido hasta el 31-dic-2040 (publicado en 1945)", contacto: null, fuente: "https://www.delibris.org/es/rebelion-en-la-granja", estado: "en espera" }
  ],

  // Ids de fichas que se fusionaron en otra: el enlace viejo (libro/<id>/ o #libro/<id>) lleva a la
  // ficha nueva, en la versión del idioma indicado. Leídos y favoritos guardados con el id viejo se conservan.
  alias: {
    "imitacion-de-cristo-granada": { id: "imitacion-de-cristo", idioma: "es" },
    "confesiones-es": { id: "confesiones", idioma: "es" },
    "apology-of-socrates": { id: "apologia-de-socrates", idioma: "en" }
  },

  // Fichas que herramientas/revisar_duplicados.js confunde pero son obras distintas, con el porqué.
  distintos: [
    { ids: ["apologia-de-socrates", "jenofonte-apologia-de-socrates"], porque: "dos obras: la Apología de Platón y la de Jenofonte" },
    { ids: ["escriva-cartas-1", "escriva-cartas-2"], porque: "volúmenes distintos: cartas 1 a 4 y cartas 5 a 8" },
    { ids: ["escriva-cartas-1", "escriva-carta-29"], porque: "la carta 29 no está en el volumen I" },
    { ids: ["escriva-cartas-2", "escriva-carta-29"], porque: "la carta 29 no está en el volumen II" },
    { ids: ["perez-galdos-la-corte-de-carlos-iv", "galdos-memorias-cortesano-1815"], porque: "dos Episodios nacionales distintos" },
    { ids: ["chesterton-the-everlasting-man", "chesterton-the-man-who-was-thursday"], porque: "dos obras de Chesterton: un ensayo de 1925 y una novela de 1908" },
    { ids: ["chesterton-the-innocence-of-father-brown", "chesterton-the-wisdom-of-father-brown"], porque: "la primera y la segunda colección de relatos del padre Brown" }
  ],

  oraciones: [
    {
      id: "unirse-a-jesus",
      titulo: { es: "Oración para unirse a Jesús", en: "Prayer to Unite Oneself to Jesus" },
      autor: "Paul de Jaegher, S.J. - oración final de «One with Jesus»",
      destacada: true,
      es: [
        "Oh Jesús, mi amante Salvador, tantas veces has dicho que tienes sed de nuestras almas, sed de seguir amando, en nosotros y por medio de nosotros, a Tu Padre celestial, por quien moriste en la Cruz. Anhelas tener millones de vidas, millones de corazones con que seguir amándolo hasta el fin de los tiempos.",
        "Vengo, pues, oh Jesús, a darme y consagrarme enteramente a Ti, con todo lo que tengo y soy. Que desde ahora sea plenamente Tuyo, que no me pertenezca más a mí mismo, sino del todo a Ti; que no exista ya para mi propio gusto, sino para el Tuyo. Haz en mí y por medio de mí todo lo que quieras, y que yo, plenamente identificado Contigo, llegue a ser para Ti como otra humanidad, que Te permita seguir amando apasionadamente a Tu Padre celestial y a Tu Madre santísima.",
        "Que mis ojos, hechos Tus ojos, miren solo lo que Tú quieres ver; que mis labios pronuncien solo Tus palabras: palabras de mansedumbre, de bondad y de caridad amorosa. Que mi mente se llene de Tus pensamientos divinos y que mi corazón, muerto al amor propio, arda con Tu amor ardiente al Padre y con Tu celo incansable por las almas.",
        "Ayúdame, oh divino Maestro, a hacerlo todo Contigo y por Ti. Hazme dócil a Tus inspiraciones divinas, para que en cada momento cumpla perfectamente Tus menores deseos. Ayúdame a olvidarme de mí y lléname hasta el borde de Ti, para que, como el Apóstol de los gentiles, ya no viva yo, sino que vivas Tú solo en mí. En una palabra, sé la vida de mi vida y el alma de mi alma. Que mi único deseo aquí en la tierra sea expresar continuamente Tu amor al Padre, y mi única alegría sea Tu alegría, dándote a Dios, a la Santísima Virgen María y a las almas en cada uno de mis actos. Amén."
      ],
      en: [
        "O Jesus, my loving Saviour, You have so repeatedly said that You are thirsting for our souls, thirsting to continue loving, within us and through us, Your heavenly Father, for whom You died on the Cross. You long to have millions of lives, millions of hearts to go on loving Him with, to the end of time.",
        "I come then, O Jesus, to give and consecrate myself entirely to You, with all I have and am. May I henceforth be Your full property, not belonging any more to myself, but wholly to You, existing no more for my own enjoyment but for Yours. Do in me and through me all You wish to, and may I, fully identified with You, become like another humanity to You, enabling You still to love passionately Your Heavenly Father and Blessed Mother.",
        "May my eyes, becoming Your eyes, look only at what You wish to see, may my lips utter only Your words - words of meekness, kindness and loving charity. May my mind be filled with Your divine thoughts and may my heart, dead to self-love, be aglow with Your ardent love for the Father and Your untiring zeal for souls.",
        "Help me, O divine Master, to do everything with You and for You. Make me obedient to Your divine inspirations, so that I may at each moment fulfill perfectly Your least desires. Help me to forget myself and fill me to the brim with You, that, like the Apostle of the Gentiles, I may not live any more but You alone live in me. In a word, be the life of my life and the soul of my soul. May my one desire here on earth be to express continually Your love to the Father, and my one joy to be Your joy, by giving You to God, to the Blessed Virgin Mary and to souls, through every act of mine. Amen."
      ],
      nota: {
        es: "Texto inglés de la edición de 1953 de la traducción de 1946. La versión en español es una traducción de Proyecto Fénix.",
        en: "English text from the 1953 printing of the 1946 translation. The Spanish version is a Proyecto Fénix translation."
      }
    },
    {
      id: "trinidad",
      titulo: { es: "Oh Dios mío, Trinidad que adoro", en: "O my God, Trinity whom I adore" },
      autor: "Santa Isabel de la Trinidad, 21 de noviembre de 1904",
      destacada: false,
      es: [
        "Dios mío, Trinidad que adoro, ayúdame a olvidarme enteramente de mí mismo para establecerme en ti, inmóvil y apacible como si mi alma estuviera ya en la eternidad; que nada pueda turbar mi paz, ni hacerme salir de ti, mi inmutable, sino que cada minuto me lleve más lejos en la profundidad de tu Misterio. Pacifica mi alma. Haz de ella tu cielo, tu morada amada y el lugar de tu reposo. Que yo no te deje jamás solo en ella, sino que yo esté allí enteramente, totalmente despierta en mi fe, en adoración, entregada sin reservas a tu acción creadora."
      ],
      en: [],
      nota: {
        es: "Fragmento citado en el Catecismo, n. 260. Más adelante, la misma oración pide al Espíritu Santo ser para Cristo «una humanidad de añadidura» (une humanité de surcroît), de donde viene la expresión «otra humanidad».",
        en: "Excerpt quoted in the Catechism, no. 260 (Spanish edition). Later in the same prayer she asks the Holy Spirit that she may be for Christ «an additional humanity» (une humanité de surcroît), the source of the phrase «another humanity»."
      }
    }
  ]
};
