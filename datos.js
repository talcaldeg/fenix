// Catálogo de Proyecto Fénix. Para agregar un libro, copie una ficha y complete sus campos.
// - archivos: rutas en libros/ (solo obras que se pueden difundir libremente).
// - externos: descarga legal en otro sitio (Project Gutenberg, etc.).
// - comprar: si no hay descarga libre.
// - nota: puntuación del equipo de 1 a 5 (null = por calificar).
// - delibris: valoración moral de delibris.org, de 1 a 6 (6 = «Sin inconvenientes»); el texto de
//   cada nivel según el género (Literatura o Pensamiento) está en index.html. null = no está en Delibris.
// - citas: textuales, cotejadas con el texto del libro.

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
        es: "Las conferencias del abad de Maredsous sobre el centro de la vida cristiana: Dios nos llama a ser sus hijos en Cristo. La primera parte expone el plan divino (Cristo modelo, redentor y fuente de toda gracia; la Iglesia, su Cuerpo; el Espíritu Santo). La segunda muestra cómo esa vida nace en el bautismo, se apoya en la fe y crece por la muerte al pecado, la Eucaristía, la oración, la caridad y la devoción a la Virgen. Una de las grandes síntesis de teología espiritual del siglo XX.",
        en: "The conferences of the abbot of Maredsous on the heart of Christian life: God calls us to be His children in Christ. Part one sets out the divine plan (Christ as model, redeemer and source of all grace; the Church, His Body; the Holy Spirit). Part two shows how this life is born in baptism, rests on faith and grows through death to sin, the Eucharist, prayer, charity and devotion to Our Lady. One of the great syntheses of spiritual theology of the 20th century."
      },
      citas: [
        "Toda nuestra santidad se reduce a participar, por medio de la gracia, de la filiación divina de Jesucristo, a ser, por la adopción sobrenatural, lo que Cristo es por naturaleza.",
        "«El cristiano es un nuevo Cristo». Esta es la definición del cristiano que ha dado, si no en los mismos términos, al menos en una expresión equivalente, la tradición entera.",
        "Cristo es verdaderamente la vida del alma, porque es la fuente y el dispensador de esa vida."
      ],
      archivos: { epub: "libros/marmion-jesucristo-vida-del-alma.epub", pdf: "libros/marmion-jesucristo-vida-del-alma.pdf" },
      fuente: { texto: "Edición de la Fundación Gratis Date, autorizada por el abad de Maredsous", url: "https://www.gratisdate.org/" },
      nota: { literaria: null, teologica: null },
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
      nota: { literaria: null, teologica: null },
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
      citas: [
        "At the Day of Judgment it will be demanded of us, not what we have read, but what we have done; not how well we have spoken, but how holily we have lived.",
        "For man proposeth, but God disposeth."
      ],
      archivos: {},
      externos: [{ formato: "epub", texto: "Project Gutenberg", url: "https://www.gutenberg.org/ebooks/1653" }],
      nota: { literaria: null, teologica: null },
      delibris: { valor: 6, genero: "Pensamiento", url: "https://delibris.org/es/imitacion-de-cristo" },
      parecidos: ["confesiones", "marmion-vida-del-alma", "presencia-de-dios"]
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
      citas: [
        "Thou madest us for Thyself, and our heart is restless, until it repose in Thee.",
        "Too late loved I Thee, O Thou Beauty of ancient days, yet ever new! too late I loved Thee!"
      ],
      archivos: {},
      externos: [{ formato: "epub", texto: "Project Gutenberg", url: "https://www.gutenberg.org/ebooks/3296" }],
      nota: { literaria: null, teologica: null },
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
      citas: [
        "The time of business does not with me differ from the time of prayer.",
        "We ought not weary of doing little things for the love of God, who regards not the greatness of the work, but the love with which it is performed."
      ],
      archivos: {},
      externos: [{ formato: "epub", texto: "Project Gutenberg", url: "https://www.gutenberg.org/ebooks/5657" }],
      nota: { literaria: null, teologica: null },
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
      citas: [
        "Angels can fly because they can take themselves lightly.",
        "Tradition means giving votes to the most obscure of all classes, our ancestors. It is the democracy of the dead."
      ],
      archivos: {},
      externos: [{ formato: "epub", texto: "Project Gutenberg", url: "https://www.gutenberg.org/ebooks/130" }],
      nota: { literaria: null, teologica: null },
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
      citas: [
        "“Quo vadis, Domine?”",
        "“If thou desert my people, I am going to Rome to be crucified a second time.”"
      ],
      archivos: {},
      externos: [{ formato: "epub", texto: "Project Gutenberg", url: "https://www.gutenberg.org/ebooks/2853" }],
      nota: { literaria: null, teologica: null },
      delibris: { valor: 6, genero: "Literatura", url: "https://delibris.org/es/quo-vadis" },
      parecidos: ["confesiones", "ortodoxia", "imitacion-de-cristo"]
    }
  ],

  oraciones: [
    {
      id: "unirse-a-jesus",
      titulo: { es: "Oración para unirse a Jesús", en: "Prayer to Unite Oneself to Jesus" },
      autor: "Paul de Jaegher, S.J. - oración final de «One with Jesus»",
      destacada: true,
      es: [
        "Oh Jesús, mi amante Salvador, tantas veces has dicho que tienes sed de nuestras almas, sed de seguir amando, en nosotros y por medio de nosotros, a tu Padre celestial, por quien moriste en la Cruz. Anhelas tener millones de vidas, millones de corazones con que seguir amándolo hasta el fin de los tiempos.",
        "Vengo, pues, oh Jesús, a darme y consagrarme enteramente a ti, con todo lo que tengo y soy. Que desde ahora sea plenamente tuyo, que no me pertenezca más a mí mismo, sino del todo a ti; que no exista ya para mi propio gusto, sino para el tuyo. Haz en mí y por medio de mí todo lo que quieras, y que yo, plenamente identificado contigo, llegue a ser para ti como otra humanidad, que te permita seguir amando apasionadamente a tu Padre celestial y a tu Madre santísima.",
        "Que mis ojos, hechos tus ojos, miren solo lo que tú quieres ver; que mis labios pronuncien solo tus palabras: palabras de mansedumbre, de bondad y de caridad amorosa. Que mi mente se llene de tus pensamientos divinos y que mi corazón, muerto al amor propio, arda con tu amor ardiente al Padre y con tu celo incansable por las almas.",
        "Ayúdame, oh divino Maestro, a hacerlo todo contigo y por ti. Hazme dócil a tus inspiraciones divinas, para que en cada momento cumpla perfectamente tus menores deseos. Ayúdame a olvidarme de mí y lléname hasta el borde de ti, para que, como el Apóstol de los gentiles, ya no viva yo, sino que vivas tú solo en mí. En una palabra, sé la vida de mi vida y el alma de mi alma. Que mi único deseo aquí en la tierra sea expresar continuamente tu amor al Padre, y mi única alegría sea tu alegría, dándote a Dios, a la Santísima Virgen María y a las almas en cada uno de mis actos. Amén."
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
        es: "Fragmento citado en el Catecismo de la Iglesia Católica, n. 260. Más adelante, la misma oración pide al Espíritu Santo ser para Cristo «una humanidad de añadidura» (une humanité de surcroît), de donde viene la expresión «otra humanidad».",
        en: "Excerpt quoted in the Catechism of the Catholic Church, no. 260 (Spanish edition). Later in the same prayer she asks the Holy Spirit that she may be for Christ «an additional humanity» (une humanité de surcroît), the source of the phrase «another humanity»."
      }
    }
  ]
};
