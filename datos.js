// Catálogo de Proyecto Fénix. Para agregar un libro, copie una ficha y complete sus campos.
// - archivos: rutas en libros/ (solo obras que se pueden difundir libremente).
// - externos: descarga legal en otro sitio (Project Gutenberg, etc.); formato "web" = lectura en línea;
//   idioma del enlace si difiere del libro (el sitio en español no muestra nada en inglés y viceversa)
//   (así van las obras protegidas de san Josemaría, que la Fundación Studium publica en escriva.org).
// - comprar: si no hay descarga libre.
// - delibris: valoración moral de delibris.org, de 1 a 6 (6 = «Sin inconvenientes»); el texto de
//   cada nivel según el género (Literatura o Pensamiento) está en index.html. null = no está en Delibris.
// - citas: textuales, cotejadas con el texto del libro.
// - imagen: portada en img/portadas/<id>.jpg (cuadro de dominio público), con su crédito y enlace;
//   se arma con herramientas/portadas.py, que también la pone dentro del EPUB.
//   Obra protegida con portada oficial: src es la URL de la imagen en el sitio del titular (no se copia)
//   y aviso reemplaza el «dominio público» del crédito.

window.FENIX = {
  actualizado: "17-oct-2026", // poner la fecha al cambiar el catálogo
  contacto: {
    // Destino de los formularios (FormSubmit). Cambiarlo aquí si se usa otra casilla.
    formularios: "https://formsubmit.co/ajax/talcaldeg@gmail.com",
    // Enlace de donación (Mercado Pago, PayPal, etc.). Vacío = la sección muestra "en preparación".
    donar: ""
  },

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
      imagen: { src: "img/portadas/marmion-vida-del-alma.jpg", credito: { es: "Cristo Pantocrátor, icono del monasterio de Santa Catalina del Sinaí, siglo VI", en: "Christ Pantocrator, icon from Saint Catherine's Monastery, Sinai, 6th century" }, url: "https://commons.wikimedia.org/wiki/File:CHRIST_PANTOCRATOR-SINAI(6th_Century).jpg" },
      citas: [
        "Toda nuestra santidad se reduce a participar, por medio de la gracia, de la filiación divina de Jesucristo, a ser, por la adopción sobrenatural, lo que Cristo es por naturaleza.",
        "«El cristiano es un nuevo Cristo». Esta es la definición del cristiano que ha dado, si no en los mismos términos, al menos en una expresión equivalente, la tradición entera.",
        "Cristo es verdaderamente la vida del alma, porque es la fuente y el dispensador de esa vida."
      ],
      archivos: { epub: "libros/marmion-jesucristo-vida-del-alma.epub", pdf: "libros/marmion-jesucristo-vida-del-alma.pdf" },
      fuente: { texto: "Edición de la Fundación Gratis Date, autorizada por el abad de Maredsous", url: "https://www.gratisdate.org/" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/jesucristo-vida-del-alma-christ-life-soul" },
      parecidos: ["one-with-jesus", "imitacion-de-cristo", "presencia-de-dios"]
    },
    {
      id: "one-with-jesus",
      titulo: "One with Jesus: The Life of Identification with Christ",
      autor: "Paul de Jaegher, S.J.",
      anio: "1929",
      idioma: "en",
      categoria: "lectura",
      recomendado: true,
      resumen: {
        es: "Un libro breve y luminoso sobre la «vida de identificación» con Cristo: dejar que Jesús, presente en el alma por la gracia, viva y ame en nosotros. El autor insiste en que esta unión se apoya en la presencia real de Dios en el alma en gracia, no en una simple amistad o imitación exterior, y la recorre desde los comienzos hasta su plenitud. Termina con la oración para unirse a Jesús que está en la sección de oraciones.",
        en: "A short, luminous book on the «life of identification» with Christ: letting Jesus, present in the soul by grace, live and love in us. The author insists that this union rests on God's real indwelling in the soul in grace, not on mere friendship or outward imitation, and follows it from its beginnings to its fullness. It closes with the prayer to unite oneself to Jesus found in the prayers section."
      },
      imagen: { src: "img/portadas/one-with-jesus.jpg", credito: { es: "Francisco Ribalta, «Cristo abrazando a san Bernardo», c. 1625", en: "Francisco Ribalta, «Christ Embracing Saint Bernard», c. 1625" }, url: "https://commons.wikimedia.org/wiki/File:Francisco_Ribalta_001.jpg" },
      citas: [
        "Powerfully seconding the action of God, it will not be long before they become other Christs.",
        "May I, fully identified with You, become like another humanity to You."
      ],
      archivos: {},
      comprar: [
        { texto: "Barnes & Noble", url: "https://www.barnesandnoble.com/w/one-with-jesus-paul-de-jaegher/1140532926" },
        { texto: "Amazon (ISBN 9781989905890)", url: "https://www.amazon.com/s?k=9781989905890" }
      ],
      fuente: { texto: "Original francés de 1929; traducción inglesa de 1946", url: "https://openlibrary.org/books/OL19427278M" },
      delibris: null,
      parecidos: ["marmion-vida-del-alma", "imitacion-de-cristo", "presencia-de-dios"]
    },
    {
      id: "imitacion-de-cristo",
      titulo: "The Imitation of Christ",
      autor: "Tomás de Kempis",
      anio: "c. 1418",
      idioma: "en",
      categoria: "lectura",
      recomendado: true,
      resumen: {
        es: "El clásico de la devoción moderna, en cuatro libros: consejos para la vida espiritual, la vida interior, el consuelo interior en diálogo con Cristo y el Santísimo Sacramento. Frases cortas, directas, para leer de a poco y volver a ellas toda la vida.",
        en: "The classic of the devotio moderna, in four books: counsels for the spiritual life, the interior life, inward consolation in dialogue with Christ, and the Blessed Sacrament. Short, direct sentences, to be read slowly and returned to for a lifetime."
      },
      imagen: { src: "img/portadas/imitacion-de-cristo.jpg", credito: { es: "El Greco, «Cristo con la cruz», c. 1590", en: "El Greco, «Christ Carrying the Cross», c. 1590" }, url: "https://commons.wikimedia.org/wiki/File:El_Greco_-_Christ_Carrying_the_Cross_-_Google_Art_Project.jpg" },
      citas: [
        "At the Day of Judgment it will be demanded of us, not what we have read, but what we have done; not how well we have spoken, but how holily we have lived.",
        "For man proposeth, but God disposeth."
      ],
      archivos: { epub: "libros/kempis-imitation-of-christ.epub", pdf: "libros/kempis-imitation-of-christ.pdf" },
      fuente: { texto: "Project Gutenberg, libro n.º 1653 (dominio público); portada de Proyecto Fénix", url: "https://www.gutenberg.org/ebooks/1653" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/imitacion-de-cristo" },
      parecidos: ["confesiones", "marmion-vida-del-alma", "presencia-de-dios"]
    },
    {
      id: "imitacion-de-cristo-granada",
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
      imagen: { src: "img/portadas/imitacion-de-cristo.jpg", credito: { es: "El Greco, «Cristo con la cruz», c. 1590", en: "El Greco, «Christ Carrying the Cross», c. 1590" }, url: "https://commons.wikimedia.org/wiki/File:El_Greco_-_Christ_Carrying_the_Cross_-_Google_Art_Project.jpg" },
      citas: [
        "Por cierto las palabras subidas no hacen santo ni justo, mas la virtuosa vida hace al hombre amable a Dios.",
        "Ciertamente el día del juicio no nos preguntarán qué leímos, mas qué hicimos; ni cuan bien hablamos, mas cuán honestamente vivimos."
      ],
      archivos: { epub: "libros/kempis-imitacion-de-cristo-granada.epub", pdf: "libros/kempis-imitacion-de-cristo-granada.pdf" },
      fuente: { texto: "Transcripción de 2009 de la edición de 1817, en Internet Archive (dominio público); sin las notas al pie del transcriptor, con nota y portada de Proyecto Fénix", url: "https://archive.org/details/imitacion-de-cristo-de-fray-luis-de-granada" },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/imitacion-de-cristo" },
      parecidos: ["marmion-vida-del-alma", "escriva-amigos-de-dios", "para-mi-vivir-es-cristo"]
    },
    {
      id: "confesiones",
      titulo: "The Confessions of St. Augustine",
      autor: "San Agustín de Hipona",
      anio: "c. 400",
      idioma: "en",
      categoria: "lectura",
      recomendado: false,
      resumen: {
        es: "La historia de una conversión contada como oración: Agustín repasa ante Dios su infancia, su juventud desordenada, su búsqueda intelectual y el encuentro con la gracia en Milán, y termina meditando sobre la memoria, el tiempo y la creación. Traducción inglesa de E. B. Pusey.",
        en: "The story of a conversion told as a prayer: Augustine reviews before God his childhood, his disordered youth, his intellectual search and his encounter with grace in Milan, and ends by meditating on memory, time and creation. English translation by E. B. Pusey."
      },
      imagen: { src: "img/portadas/confesiones.jpg", credito: { es: "Sandro Botticelli, «San Agustín en su estudio», c. 1480", en: "Sandro Botticelli, «Saint Augustine in His Study», c. 1480" }, url: "https://commons.wikimedia.org/wiki/File:Sandro_Botticelli_-_St_Augustine_-_WGA02709.jpg" },
      citas: [
        "Thou madest us for Thyself, and our heart is restless, until it repose in Thee.",
        "Too late loved I Thee, O Thou Beauty of ancient days, yet ever new! too late I loved Thee!"
      ],
      archivos: { epub: "libros/agustin-confessions.epub", pdf: "libros/agustin-confessions.pdf" },
      fuente: { texto: "Project Gutenberg, libro n.º 3296 (dominio público); portada de Proyecto Fénix", url: "https://www.gutenberg.org/ebooks/3296" },
      delibris: { valor: 6, genero: "Literatura", url: "https://delibris.org/es/confesiones" },
      parecidos: ["imitacion-de-cristo", "ortodoxia", "presencia-de-dios"]
    },
    {
      id: "presencia-de-dios",
      titulo: "The Practice of the Presence of God",
      autor: "Hermano Lorenzo de la Resurrección, O.C.D.",
      anio: "1692",
      idioma: "en",
      categoria: "oracion",
      recomendado: true,
      resumen: {
        es: "Conversaciones y cartas de un hermano carmelita que trabajó años en la cocina de su convento. Su enseñanza es sencilla: vivir en la presencia de Dios en medio del trabajo diario, ofreciendo por amor las cosas pequeñas. Muy cercano a la santificación del trabajo ordinario.",
        en: "Conversations and letters of a Carmelite brother who worked for years in his monastery's kitchen. His teaching is simple: live in God's presence in the midst of daily work, offering little things out of love. Very close to the sanctification of ordinary work."
      },
      imagen: { src: "img/portadas/presencia-de-dios.jpg", credito: { es: "Diego Velázquez, «Cristo en casa de Marta y María» (detalle), c. 1618", en: "Diego Velázquez, «Christ in the House of Martha and Mary» (detail), c. 1618" }, url: "https://commons.wikimedia.org/wiki/File:Diego_Vel%C3%A1zquez_-_Christ_in_the_House_of_Mary_and_Martha_(detail)_-_WGA24361.jpg" },
      citas: [
        "The time of business does not with me differ from the time of prayer.",
        "We ought not weary of doing little things for the love of God, who regards not the greatness of the work, but the love with which it is performed."
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
      imagen: { src: "img/portadas/ortodoxia.jpg", credito: { es: "Rafael, «La disputa del Santísimo Sacramento» (detalle), 1509-1510", en: "Raphael, «The Disputation of the Holy Sacrament» (detail), 1509-1510" }, url: "https://commons.wikimedia.org/wiki/File:%22Disputation_of_the_Holy_Sacrament%22_by_Raphael,_Raphael_Rooms,_Vatican_Museum_(48466326127).jpg" },
      citas: [
        "Angels can fly because they can take themselves lightly.",
        "Tradition means giving votes to the most obscure of all classes, our ancestors. It is the democracy of the dead."
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
      imagen: { src: "img/portadas/quo-vadis.jpg", credito: { es: "Annibale Carracci, «Domine, quo vadis?», 1601-1602", en: "Annibale Carracci, «Domine, quo vadis?», 1601-1602" }, url: "https://commons.wikimedia.org/wiki/File:Domine,_quo_vadis.jpg" },
      citas: [
        "“Quo vadis, Domine?”",
        "“If thou desert my people, I am going to Rome to be crucified a second time.”"
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
      imagen: { src: "img/portadas/escriva-camino.jpg", credito: { es: "Fritz von Uhde, «Camino de Emaús», c. 1896", en: "Fritz von Uhde, «The Road to Emmaus», c. 1896" }, url: "https://commons.wikimedia.org/wiki/File:Der_Gang_nach_Emmaus,_1896..jpg" },
      resumen: {
        es: "999 puntos breves de meditación, repartidos en 46 capítulos, escritos en un tono directo, como de conversación personal con el lector. Apareció en 1934 en Cuenca con el título «Consideraciones espirituales» y tomó su nombre definitivo en la edición de Valencia de 1939. Lleva más de cinco millones de ejemplares en más de cincuenta idiomas.",
        en: "999 short points for meditation, in 46 chapters, written in a direct tone, like a personal conversation with the reader. It first appeared in Cuenca in 1934 as «Consideraciones espirituales» and took its final title in the Valencia edition of 1939. More than five million copies have been printed, in over fifty languages."
      },
      citas: ["La oración del cristiano nunca es monólogo."],
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
      imagen: { src: "img/portadas/escriva-surco.jpg", credito: { es: "Jean-François Millet, «El sembrador», 1850", en: "Jean-François Millet, «The Sower», 1850" }, url: "https://commons.wikimedia.org/wiki/File:Jean-Fran%C3%A7ois_Millet_-_The_Sower_-_Google_Art_Project.jpg" },
      resumen: {
        es: "1000 puntos de meditación en 32 capítulos, en la línea de «Camino», con especial atención a las virtudes humanas. Se dirige a la persona entera, «cuerpo y alma, naturaleza y gracia». Primera edición póstuma, de 1986.",
        en: "1000 points for meditation in 32 chapters, in the vein of «The Way», with special attention to the human virtues. It speaks to the whole person, «body and soul, nature and grace». First published posthumously in 1986."
      },
      citas: ["Cuanto más generoso seas, por Dios, serás más feliz."],
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
      imagen: { src: "img/portadas/escriva-forja.jpg", credito: { es: "Joseph Wright of Derby, «Una herrería», 1772", en: "Joseph Wright of Derby, «An Iron Forge», 1772" }, url: "https://commons.wikimedia.org/wiki/File:Joseph_Wright_of_Derby_(1734-1797)_-_An_Iron_Forge_-_T06670_-_Tate.jpg" },
      resumen: {
        es: "1055 puntos de meditación en 13 capítulos, muchos de ellos autobiográficos aunque escritos en tercera persona. Recorre el camino del cristiano hacia la identificación con Cristo. Primera edición de 1987.",
        en: "1055 points for meditation in 13 chapters, many of them autobiographical though written in the third person. It follows the Christian's path towards identification with Christ. First published in 1987."
      },
      citas: ["Ojalá pueda decirse que la característica que define tu vida es «amar la Voluntad de Dios»."],
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
      imagen: { src: "img/portadas/escriva-es-cristo-que-pasa.jpg", credito: { es: "Duccio di Buoninsegna, «La vocación de Pedro y Andrés», 1308-1311", en: "Duccio di Buoninsegna, «The Calling of the Apostles Peter and Andrew», 1308-1311" }, url: "https://commons.wikimedia.org/wiki/File:Duccio_di_Buoninsegna,_The_Calling_of_the_Apostles_Peter_and_Andrew,_1308-1311,_NGA_282.jpg" },
      resumen: {
        es: "18 homilías pronunciadas en fiestas del año litúrgico. El hilo es la filiación divina, junto con la llamada universal a la santidad, la santificación del trabajo ordinario, la contemplación en medio del mundo y la unidad de vida. Fueron predicadas de viva voz a personas muy diversas, no escritas como tratado. Primera edición de 1973.",
        en: "18 homilies preached on feasts of the liturgical year. The common thread is divine filiation, together with the universal call to holiness, the sanctification of ordinary work, contemplation in the middle of the world and unity of life. They were spoken to very varied listeners, not written as a treatise. First published in 1973."
      },
      citas: ["Trabajar así es oración. Estudiar así es oración. Investigar así es oración."],
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
      imagen: { src: "img/portadas/escriva-amigos-de-dios.jpg", credito: { es: "Johannes Vermeer, «Cristo en casa de Marta y María», c. 1655", en: "Johannes Vermeer, «Christ in the House of Martha and Mary», c. 1655" }, url: "https://commons.wikimedia.org/wiki/File:Johannes_(Jan)_Vermeer_-_Christ_in_the_House_of_Martha_and_Mary_-_Google_Art_Project.jpg" },
      resumen: {
        es: "18 homilías que toman las virtudes cristianas como hilo de un «coloquio filial con Dios». Publicado en 1977, es la primera obra póstuma del autor.",
        en: "18 homilies that take the Christian virtues as the thread of a «filial conversation with God». Published in 1977, it was the author's first posthumous work."
      },
      citas: ["Estas crisis mundiales son crisis de santos."],
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
      imagen: { src: "img/portadas/escriva-amar-a-la-iglesia.jpg", credito: { es: "Giovanni Paolo Panini, «Interior de San Pedro de Roma», c. 1754", en: "Giovanni Paolo Panini, «Interior of Saint Peter's, Rome», c. 1754" }, url: "https://commons.wikimedia.org/wiki/File:Giovanni_Paolo_Panini,_Interior_of_Saint_Peter%27s,_Rome,_c._1754,_NGA_50884.jpg" },
      resumen: {
        es: "Reúne las homilías «Lealtad a la Iglesia», «El fin sobrenatural de la Iglesia» y «Sacerdote para la eternidad», con presentación de Jesús Urteaga y dos escritos del beato Álvaro del Portillo.",
        en: "It gathers the homilies «Loyalty to the Church», «The Supernatural Aim of the Church» and «A Priest Forever», with a presentation by Jesús Urteaga and two writings by Blessed Álvaro del Portillo."
      },
      citas: ["Nuestra Madre es Santa, porque ha nacido pura y continuará sin mácula por la eternidad."],
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
      imagen: { src: "img/portadas/escriva-en-dialogo-con-el-senor.jpg", credito: { es: "Henry Ossawa Tanner, «Nicodemo visita a Jesús», 1899", en: "Henry Ossawa Tanner, «Nicodemus Visiting Jesus», 1899" }, url: "https://commons.wikimedia.org/wiki/File:Nicodemus_Visiting_Jesus,_by_Henry_Ossawa_Tanner.jpg" },
      resumen: {
        es: "25 textos de su predicación a miembros del Opus Dei en Roma entre 1954 y 1975, publicados para el público general en 2017. Temas frecuentes: la identificación con Cristo, la filiación divina, el amor a Dios y a la Iglesia, la oración, la humildad y la caridad fraterna. Su fin es ayudar a hacer oración personal.",
        en: "25 texts from his preaching to members of Opus Dei in Rome between 1954 and 1975, published for a general readership in 2017. Recurring themes: identification with Christ, divine filiation, love for God and the Church, prayer, humility and fraternal charity. It is meant to help the reader pray."
      },
      citas: ["¡Qué alegría tan grande sentirse metidos en Dios! ¡Endiosados!"],
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
      imagen: { src: "img/portadas/escriva-santo-rosario.jpg", credito: { es: "Caravaggio, «Virgen del Rosario», c. 1607", en: "Caravaggio, «Madonna of the Rosary», c. 1607" }, url: "https://commons.wikimedia.org/wiki/File:Madonna_of_the_Rosary-Caravaggio_(1607).jpg" },
      resumen: {
        es: "Consideraciones breves sobre los misterios gozosos, dolorosos y gloriosos, y un comentario a la letanía lauretana; desde 2003 incluye un apéndice con los misterios luminosos. Lo escribió de un tirón en 1931, en la acción de gracias después de la Misa, y se publicó en 1934.",
        en: "Short considerations on the joyful, sorrowful and glorious mysteries, and a commentary on the Litany of Loreto; since 2003 it includes an appendix with the luminous mysteries. He wrote it at one sitting in 1931, during his thanksgiving after Mass, and it was published in 1934."
      },
      citas: ["No olvides, amigo mío, que somos niños."],
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
      imagen: { src: "img/portadas/escriva-via-crucis.jpg", credito: { es: "Rafael, «Caída en el camino del Calvario», 1517", en: "Raphael, «Christ Falls on the Way to Calvary», 1517" }, url: "https://commons.wikimedia.org/wiki/File:Raffaello_Sanzio_-_Christ_Falls_on_the_Way_to_Calvary_-_WGA18828.jpg" },
      resumen: {
        es: "Comentarios breves a las catorce estaciones, nacidos de su oración personal. Cada estación trae un relato y unos puntos de meditación numerados. Primera edición de 1981.",
        en: "Short commentaries on the fourteen stations, born of his personal prayer. Each station has a narrative and numbered points for meditation. First published in 1981."
      },
      citas: ["Dios es mi Padre, aunque me envíe sufrimiento."],
      archivos: {},
      externos: [
        { formato: "web", idioma: "es", texto: "escriva.org", url: "https://escriva.org/es/via-crucis/" },
        { formato: "web", idioma: "en", texto: "escriva.org", url: "https://escriva.org/en/via-crucis/" }
      ],
      comprar: [{ texto: "librerías (escriva.org)", url: "https://escriva.org/es/page/where-to-buy-a-book/" }],
      fuente: { texto: "Texto publicado por la Fundación Studium en escriva.org (obra protegida por derechos de autor)", url: "https://escriva.org/es/via-crucis/" },
      delibris: null,
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
      imagen: { src: "img/portadas/escriva-cartas-1.jpg", credito: { es: "Johannes Vermeer, «Mujer de azul leyendo una carta», c. 1663", en: "Johannes Vermeer, «Woman in Blue Reading a Letter», c. 1663" }, url: "https://commons.wikimedia.org/wiki/File:Johannes_Vermeer_-_Woman_in_Blue_Reading_a_Letter_-_WGA24657.jpg" },
      resumen: {
        es: "Las cuatro primeras «Cartas» largas del fundador a los miembros del Opus Dei, con cuya edición pública se comenzó en septiembre de 2020. Tratan de la vida ordinaria como camino de santidad, la humildad, la misión del cristiano en la vida social y la caridad al transmitir la fe.",
        en: "The founder's first four long «Letters» to the members of Opus Dei, whose public edition began in September 2020. They deal with ordinary life as a path to holiness, humility, the Christian's mission in social life and charity in passing on the faith."
      },
      citas: ["Hijos míos, lo extraordinario nuestro es lo ordinario: lo ordinario hecho con perfección."],
      archivos: {},
      externos: [{ formato: "web", idioma: "es", texto: "escriva.org", url: "https://escriva.org/es/cartas-1/" }],
      comprar: [{ texto: "librerías (escriva.org)", url: "https://escriva.org/es/page/where-to-buy-a-book/" }],
      fuente: { texto: "Texto publicado por la Fundación Studium en escriva.org (obra protegida por derechos de autor)", url: "https://escriva.org/es/cartas-1/" },
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
      imagen: { src: "img/portadas/escriva-cartas-2.jpg", credito: { es: "Johannes Vermeer, «Muchacha leyendo una carta junto a la ventana», c. 1657-1659", en: "Johannes Vermeer, «Girl Reading a Letter at an Open Window», c. 1657-1659" }, url: "https://commons.wikimedia.org/wiki/File:Johannes_Vermeer_-_Girl_Reading_a_Letter_by_an_Open_Window_-_Google_Art_Project.jpg" },
      resumen: {
        es: "Cuatro cartas (n.º 5 a 8), fechadas entre 1939 y 1943 y muy reelaboradas en los años sesenta. Tratan de la misión de los laicos en la educación, el carisma del Opus Dei y su misión evangelizadora, la formación cristiana de la juventud y el espíritu de servicio a la Iglesia. Publicadas en 2022.",
        en: "Four letters (nos. 5 to 8), dated between 1939 and 1943 and extensively reworked in the 1960s. They deal with the mission of lay people in education, the charism of Opus Dei and its evangelising mission, the Christian formation of young people and the spirit of service to the Church. Published in 2022."
      },
      citas: ["Solo cuando los hombres se acostumbren a decir y a oír la verdad, habrá comprensión y concordia."],
      archivos: {},
      externos: [{ formato: "web", idioma: "es", texto: "escriva.org", url: "https://escriva.org/es/cartas-2/" }],
      comprar: [{ texto: "librerías (escriva.org)", url: "https://escriva.org/es/page/where-to-buy-a-book/" }],
      fuente: { texto: "Texto publicado por la Fundación Studium en escriva.org (obra protegida por derechos de autor)", url: "https://escriva.org/es/cartas-2/" },
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
      imagen: { src: "img/portadas/escriva-carta-29.jpg", credito: { es: "Gabriël Metsu, «Mujer leyendo una carta», c. 1665", en: "Gabriël Metsu, «Woman Reading a Letter», c. 1665" }, url: "https://commons.wikimedia.org/wiki/File:Woman_Reading_a_Letter_by_Gabri%C3%ABl_Metsu.jpg" },
      resumen: {
        es: "Carta larga, fechada el 9 de enero de 1959, sobre la obra de San Gabriel: el apostolado con personas que, en general, siguen el camino del matrimonio. Pertenece al género de las «Cartas» del fundador sobre el carisma y la historia del Opus Dei, en tono familiar. Su edición crítica apareció en «Studia et Documenta» 17 (2023).",
        en: "A long letter, dated 9 January 1959, on the work of Saint Gabriel: the apostolate with people who are, in general, called to marriage. It belongs to the founder's «Letters» on the charism and history of Opus Dei, written in a familiar tone. Its critical edition appeared in «Studia et Documenta» 17 (2023)."
      },
      citas: ["En la vida espiritual no hay nada que inventar."],
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
      imagen: { src: "img/portadas/escriva-conversaciones.jpg", credito: { es: "Alberto Durero, «Jesús entre los doctores», 1506", en: "Albrecht Dürer, «Jesus among the Doctors», 1506" }, url: "https://commons.wikimedia.org/wiki/File:Albrecht_D%C3%BCrer_-_Jesus_among_the_Doctors_-_Google_Art_Project.jpg" },
      resumen: {
        es: "Siete entrevistas de 1966 a 1968 (Le Figaro, The New York Times, Time, L'Osservatore della Domenica, Telva, Gaceta Universitaria y Palabra) sobre la Iglesia y el Concilio, las libertades personales, la universidad, la mujer en la sociedad y el Opus Dei. Cierra con la homilía «Amar al mundo apasionadamente», del 8 de octubre de 1967.",
        en: "Seven interviews from 1966 to 1968 (Le Figaro, The New York Times, Time, L'Osservatore della Domenica, Telva, Gaceta Universitaria and Palabra) on the Church and the Council, personal freedoms, the university, women in society and Opus Dei. It ends with the homily «Passionately Loving the World», of 8 October 1967."
      },
      citas: ["El mundo no es malo, porque ha salido de las manos de Dios."],
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
      categoria: "lectura",
      recomendado: false,
      imagen: { src: "img/portadas/escriva-abadesa-de-las-huelgas.jpg", credito: { es: "Alfonso VIII y Leonor, fundadores de Las Huelgas, miniatura medieval", en: "Alfonso VIII and Eleanor, founders of Las Huelgas, medieval miniature" }, url: "https://commons.wikimedia.org/wiki/File:Alfonso_VIII_de_Castilla_y_Leonor.jpg" },
      resumen: {
        es: "Estudio teológico-jurídico, hecho sobre fuentes originales, de la jurisdicción cuasi episcopal que tuvo la abadesa del monasterio de Las Huelgas, en Burgos. Doce capítulos y dos apéndices: la serie cronológica de las abadesas y las reales cédulas de Felipe V. Primera edición de 1944.",
        en: "A theological and juridical study, based on original sources, of the quasi-episcopal jurisdiction held by the abbess of the monastery of Las Huelgas in Burgos. Twelve chapters and two appendices: the chronological list of abbesses and the royal decrees of Philip V. First published in 1944."
      },
      citas: ["Aquí te presento, amable lector, a la famosa Abadesa de Las Huelgas."],
      archivos: {},
      externos: [{ formato: "web", idioma: "es", texto: "escriva.org", url: "https://escriva.org/es/la-abadesa-de-las-huelgas/" }],
      comprar: [{ texto: "librerías (escriva.org)", url: "https://escriva.org/es/page/where-to-buy-a-book/" }],
      fuente: { texto: "Texto publicado por la Fundación Studium en escriva.org (obra protegida por derechos de autor)", url: "https://escriva.org/es/la-abadesa-de-las-huelgas/" },
      delibris: null,
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
      imagen: { src: "img/portadas/escriva-discursos-universidad.jpg", credito: { es: "Laurentius de Voltolina, «Una clase en la Universidad de Bolonia», siglo XIV", en: "Laurentius de Voltolina, «A Lecture at the University of Bologna», 14th century" }, url: "https://commons.wikimedia.org/wiki/File:Laurentius_de_Voltolina_001.jpg" },
      resumen: {
        es: "Volumen preparado por la Universidad de Navarra con motivo de la beatificación de su fundador. Reúne sus discursos académicos, la homilía del campus de octubre de 1967 y otras intervenciones públicas sobre la universidad; cierra con los discursos del acto académico del 26 de junio de 1992. Prólogo del beato Álvaro del Portillo.",
        en: "A volume prepared by the University of Navarra on the occasion of its founder's beatification. It gathers his academic speeches, the campus homily of October 1967 and other public statements on the university, and closes with the speeches of the academic ceremony of 26 June 1992. Foreword by Blessed Álvaro del Portillo."
      },
      citas: ["Siete lustros han pasado ya desde que abandoné las aulas de la Universidad de Zaragoza y las tierras de Aragón en que nací."],
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
      imagen: { src: "img/portadas/para-mi-vivir-es-cristo.jpg", credito: { es: "Caravaggio, «La conversión de san Pablo», c. 1600-1601", en: "Caravaggio, «The Conversion of Saint Paul», c. 1600-1601" }, url: "https://commons.wikimedia.org/wiki/File:Conversion_on_the_Way_to_Damascus-Caravaggio_(c.1600-1).jpg" },
      citas: ["Ser cristiano es vivir en Cristo, vivir nuestra vida con Él, vivir su vida en la nuestra."],
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
      imagen: { src: "img/portadas/conocerle-y-conocerte.jpg", credito: { es: "Jean-François Millet, «El Ángelus», 1857-1859", en: "Jean-François Millet, «The Angelus», 1857-1859" }, url: "https://commons.wikimedia.org/wiki/File:Jean-Fran%C3%A7ois_Millet_-_The_Angelus_-_Google_Art_Project.jpg" },
      citas: [
        "La oración cultiva una relación con Dios Padre, con Dios Hijo y con Dios Espíritu Santo, y nos identifica así con Cristo.",
        "Saberme hijo de Dios es fundamental para entrar en oración."
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
      categoria: "lectura",
      recomendado: false,
      resumen: {
        es: "La defensa de Sócrates ante el tribunal de Atenas, el año 399 a. C., acusado de corromper a los jóvenes y de no creer en los dioses de la ciudad. Platón, que estuvo presente, la reconstruye en tres discursos: la defensa, la propuesta de pena tras el veredicto de culpa y las palabras finales después de la condena a muerte. Sócrates prefiere morir antes que dejar de buscar la verdad y de servir a lo que entiende como un mandato divino. Traducción de Patricio de Azcárate (1871), con la ortografía de la época, su argumento y sus notas.",
        en: "Socrates' defence before the court of Athens in 399 BC, accused of corrupting the young and of not believing in the city's gods. Plato, who was present, reconstructs it in three speeches: the defence, the proposal of a penalty after the guilty verdict, and the final words after the death sentence. Socrates prefers to die rather than stop seeking the truth and serving what he understands as a divine command. Spanish translation by Patricio de Azcárate (1871), with the spelling of the time, his introduction and his notes."
      },
      imagen: { src: "img/portadas/apologia-de-socrates.jpg", credito: { es: "Jacques-Louis David, «La muerte de Sócrates», 1787", en: "Jacques-Louis David, «The Death of Socrates», 1787" }, url: "https://commons.wikimedia.org/wiki/File:David_-_The_Death_of_Socrates.jpg" },
      citas: [
        "El mayor bien del hombre es hablar de la virtud todos los dias de su vida y conversar sobre todas las demás cosas que han sido objeto de mis discursos, ya sea examinándome á mí mismo, ya examinando á los demás, porque una vida sin exámen no es vida.",
        "Pero ya es tiempo de que nos retiremos de aquí, yo para morir, vosotros para vivir. ¿Entre vosotros y yo, quién lleva la mejor parte? Esto es lo que nadie sabe, excepto Dios."
      ],
      archivos: { epub: "libros/platon-apologia-de-socrates.epub", pdf: "libros/platon-apologia-de-socrates.pdf" },
      fuente: { texto: "Obras completas de Platón, tomo I (Madrid, 1871), transcritas en es.wikisource.org (dominio público); edición digital y portada de Proyecto Fénix", url: "https://es.wikisource.org/wiki/Apolog%C3%ADa_de_S%C3%B3crates_(de_Azc%C3%A1rate_tr.)" },
      delibris: null,
      parecidos: ["marmion-vida-del-alma", "imitacion-de-cristo-granada", "escriva-amigos-de-dios"]
    },
    {
      id: "apology-of-socrates",
      titulo: "Apology",
      autor: "Plato (trans. Benjamin Jowett)",
      anio: "c. 390 BC",
      idioma: "en",
      categoria: "lectura",
      recomendado: false,
      resumen: {
        es: "La defensa de Sócrates ante el tribunal de Atenas, el año 399 a. C., acusado de corromper a los jóvenes y de no creer en los dioses de la ciudad. Platón, que estuvo presente, la reconstruye en tres discursos: la defensa, la propuesta de pena tras el veredicto de culpa y las palabras finales después de la condena a muerte. Traducción inglesa de Benjamin Jowett.",
        en: "Socrates' defence before the court of Athens in 399 BC, accused of corrupting the young and of not believing in the city's gods. Plato, who was present, reconstructs it in three speeches: the defence, the proposal of a penalty after the guilty verdict, and the final words after the death sentence. Socrates prefers to die rather than stop seeking the truth and serving what he understands as a divine command. English translation by Benjamin Jowett."
      },
      imagen: { src: "img/portadas/apologia-de-socrates.jpg", credito: { es: "Jacques-Louis David, «La muerte de Sócrates», 1787", en: "Jacques-Louis David, «The Death of Socrates», 1787" }, url: "https://commons.wikimedia.org/wiki/File:David_-_The_Death_of_Socrates.jpg" },
      citas: [
        "The unexamined life is not worth living.",
        "The hour of departure has arrived, and we go our ways—I to die, and you to live. Which is better God only knows."
      ],
      archivos: { epub: "libros/platon-apology.epub", pdf: "libros/platon-apology.pdf" },
      fuente: { texto: "Project Gutenberg, libro n.º 1656 (dominio público); portada de Proyecto Fénix", url: "https://www.gutenberg.org/ebooks/1656" },
      delibris: null,
      parecidos: ["ortodoxia", "confesiones", "quo-vadis"]
    },
    {
      id: "orencio-y-eloisa",
      titulo: "Orencio y Eloísa",
      autor: "Benjamín Franzani",
      anio: "2021",
      idioma: "es",
      categoria: "novela",
      recomendado: false,
      imagen: { src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhL8ho_fkfQkc0zjyJuXk7zWCg46XZLFjCLw95nkYpoO31o26bDNtvgCzDale4V5aTEUOZOjuyu1Y309MsBILmiXWD29IW9finGqXUyDcBovYuop_mTNXk0LBL5GnWZ2ou9NwZKRY25In6Zk-RkB7KGKudLSFH3HynzonnSdBGLAWsobNgeN-vB53nmkhN2/s800/image1788018015", credito: { es: "portada oficial del relato", en: "official cover of the story" }, url: "https://www.benjaminfranzani.com/p/el-repertorio-del-juglar-historias.html", aviso: { es: "enlazada desde el sitio del autor", en: "linked from the author's website" } },
      resumen: {
        es: "Siar, ciudad portuaria de un imperio en ruinas, resiste hace cinco años el asedio de un ejército enemigo. En medio de la guerra, el joven jinete Orencio y la criada Eloísa se aman en silencio, sin que él se atreva a pedir su mano mientras la ciudad siga en peligro. Cuando Orencio cae enfermo y llegan dos emisarias de una ciudad aliada con noticias alarmantes, Eloísa se ve envuelta en una trama de espionaje, sospechas injustas y un asalto final. Relato breve de amor, lealtad y entrega, en seis partes, que acompaña a la novela «El Lobo de Plata» (saga «Crónicas de una Espada»).",
        en: "Siar, a besieged port city in a crumbling empire, has withstood five years of enemy siege. Amid the war, the young horseman Orencio and the servant girl Eloísa love each other quietly, he unwilling to ask for her hand while the city remains in danger. When Orencio falls ill and two envoys from an allied city arrive with grave news, Eloísa is drawn into a web of espionage, unjust suspicion and a final assault. A short tale of love, loyalty and self-giving in six parts, a companion to the novel «El Lobo de Plata» («Crónicas de una Espada» saga)."
      },
      citas: [
        "Porque las flores son inútiles para la aspereza de la guerra, por eso es que son ahora más necesarias que nunca.",
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
      imagen: { src: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh6uv20fuvZ_ECZdcn_kXNoMRc1siQxV0iVkcwaD-eZMSgrPsLCKbPe0ukf0zBKfJfQOdr0A4xkViYgstjkx6gZJWWXJn4LtZQJ8HLu6lsZajDnJpHCmBxyCD_TTY6JoHlVbqM_1jyD4ESSkPJPuh6hMUARkm7ufW2K4POxUMYFrTfPKilCeecpwvVX7lFi/s800/nueva%20Portada%20Edward.png", credito: { es: "portada oficial de la novela", en: "official cover of the novel" }, url: "https://www.benjaminfranzani.com/p/el-repertorio-del-juglar-historias.html", aviso: { es: "enlazada desde el sitio del autor", en: "linked from the author's website" } },
      resumen: {
        es: "Sir Edward de Uterra, armado caballero a los quince años tras velar sus armas en oración, se niega a llevar blasón hasta ganarse un nombre con sus hechos. Parte con su amigo Ulf, escudero y juglar, a las provincias del sur del Imperio de Dáladon, abandonadas a bandoleros y piratas, para servir al corregidor de Urbia contra el bandolero Alcico. Allí conoce a Clara, una joven criada entre piratas que vive para vengarse del regente que vendió a su familia. Novela de caballería y fantasía en 27 capítulos, sobre el honor, la amistad, la protección del débil y la misericordia frente a la venganza; la historia queda abierta para una continuación.",
        en: "Sir Edward of Uterra, knighted at fifteen after keeping vigil over his arms in prayer, refuses to bear a coat of arms until he has earned a name by his deeds. With his friend Ulf, squire and minstrel, he rides to the southern provinces of the Empire of Dáladon, abandoned to brigands and pirates, to serve the magistrate of Urbia against the outlaw Alcico. There he meets Clara, a young woman raised among pirates who lives to avenge herself on the regent who sold her family. A chivalric fantasy novel in 27 chapters about honour, friendship, protecting the weak and mercy over revenge; the story is left open for a sequel."
      },
      citas: [
        "Mis pasos seguirán tus pasos. Iré donde vayas y volveré donde vuelvas.",
        "No puedo garantizar que no habrá represalias, pero sí que contarán con mi escudo, y con el de mis hombres.",
        "No manches ahora tus manos con sangre… aún estás a tiempo."
      ],
      archivos: {},
      externos: [
        { formato: "web", texto: "benjaminfranzani.com", url: "https://www.benjaminfranzani.com/p/el-repertorio-del-juglar-historias.html" }
      ],
      fuente: { texto: "Publicado por el autor en su sitio, en «El repertorio del juglar»; spin-off de la saga «Crónicas de una Espada» (obra protegida por derechos de autor; se enlaza, no se aloja)", url: "https://www.benjaminfranzani.com/p/el-repertorio-del-juglar-historias.html" },
      delibris: null,
      parecidos: ["orencio-y-eloisa", "quo-vadis"]
    }
  ],

  // Plan de vida: libros para el rato de oración (categoria "oracion") y para la lectura espiritual
  // (categoria "lectura"), ids de `libros`. Cada sitio muestra solo los de su idioma.
  plan: {
    oracion: ["escriva-camino", "escriva-surco", "escriva-forja", "conocerle-y-conocerte", "presencia-de-dios"],
    lectura: ["marmion-vida-del-alma", "escriva-es-cristo-que-pasa", "escriva-amigos-de-dios", "imitacion-de-cristo", "imitacion-de-cristo-granada", "one-with-jesus", "confesiones", "ortodoxia"]
  },

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
