/* Misión Aya · Historia 5º básico · Unidad 3: La expansión europea (s. XV–XVI)
   Contenido alineado a la prueba del jueves 24 de septiembre (Colegio Bradford) y al currículo MINEDUC.
   Tipos de pregunta: mc (alternativas), tf (verdadero/falso), order (ordenar), match (emparejar),
   fill (completar), classify (clasificar), write (respuesta escrita con autocorrección). */

window.CONTENT = {
  unit: {
    id: "historia-u3",
    subject: "Historia",
    title: "La expansión europea",
    subtitle: "Siglos XV y XVI · Unidad 3",
    test: { date: "2026-09-24", label: "Prueba de Historia · jueves 24 de septiembre" },
    topics: [
      "Los viajes de exploración europea (causas)",
      "Culturas americanas pre-Conquista",
      "La empresa de Conquista europea",
      "Procesos de Conquista de México y Perú",
      "Impacto de la Conquista en América y Europa"
    ]
  },

  camps: [
  /* ───────────────────────── CAMPAMENTO 1 ───────────────────────── */
  {
    id: "c1", n: 1, name: "Selva del Puerto", lugar:"Europa", epoca:"Siglo XV", topic: "Los viajes de exploración europea", icon: "⛵", color: "#4FB3C9",
    guide: "ovaya",
    intro: "La nave nos dejó en esta selva y por el puerto se ven carabelas. ¡Estamos en Europa, en el siglo XV! Si entendemos POR QUÉ estos señores se lanzaron al océano, el mapa nos dará un fragmento. ¡A la bitácora!",
    notes: [
      { title: "Acontecimiento vs. proceso", body: "Un <b>acontecimiento</b> es un hecho puntual, que ocurre en un momento (por ejemplo, la llegada de Colón a América el 12 de octubre de 1492). Un <b>proceso histórico</b> es un conjunto de hechos relacionados que se desarrollan durante un tiempo largo (por ejemplo, la expansión europea de los siglos XV y XVI)." },
      { title: "Multicausalidad", body: "<b>Ningún acontecimiento o proceso histórico se explica por una sola causa.</b> La multicausalidad es la existencia de diversas causas que explican un mismo hecho. Los viajes de exploración tuvieron tres grandes causas: rutas comerciales, desarrollo económico y avances tecnológicos." },
      { title: "Causa 1 · Rutas comerciales", body: "Europa comerciaba mucho con Asia (India, China) por rutas muy extensas, como la <b>Ruta de la Seda</b>. En el siglo XV esas rutas fueron <b>cortadas por el avance del Islam</b> (los turcos otomanos tomaron Constantinopla en 1453). Europa tuvo que buscar <b>otras rutas hacia Asia</b> para conseguir especias, seda y otros productos." },
      { title: "Causa 2 · Desarrollo económico", body: "Hacia el siglo XV las ciudades europeas crecían económica y demográficamente (más gente, más comercio). Apareció la <b>burguesía</b>: comerciantes, banqueros y mercaderes. Este grupo <b>empujó y financió</b> los viajes de exploración para expandir sus negocios." },
      { title: "Causa 3 · Avances tecnológicos", body: "Nueva tecnología de navegación: la <b>brújula</b> (de origen chino, señala el norte con una aguja imantada), el <b>astrolabio</b> y el <b>cuadrante</b> (miden la altura de los astros para saber la latitud) y los <b>portulanos</b> (mapas de costas). Y la <b>carabela</b>: el primer barco europeo capaz de adentrarse en el océano y cruzar el Atlántico; usaba la fuerza del viento y tenía gran capacidad de carga." },
      { title: "Portugal y España", body: "<b>Portugal</b> navegó bordeando las costas de África para llegar a la India (Bartolomé Díaz dobló el cabo de Buena Esperanza en 1488 y Vasco da Gama llegó a la India en 1498). <b>España</b> buscó otra ruta: <b>Colón</b>, en nombre de los Reyes Católicos, navegó hacia el <b>oeste</b> para llegar a la India y el 12 de octubre de 1492 llegó a América sin saberlo. Hizo <b>cuatro viajes</b>: 1492, 1493, 1498 y 1502." },
      { title: "Fuentes históricas", body: "Una <b>fuente histórica</b> es un registro del pasado que nos entrega información de lo que pasó y cómo pasó. Se analizan por: <b>Formato</b> (escrita, visual, arqueológica, audiovisual). <b>Origen</b>: <b>primaria</b> si fue hecha en la época estudiada por un participante de los hechos; <b>secundaria</b> si fue hecha después y por alguien que no participó. <b>Propósito</b>: informar, comunicar, dar su opinión o convencer. <b>Información relevante</b>: la idea principal que entrega sobre el tema." },
      { title: "Argumentar con fuentes", body: "Para argumentar usamos tres partes: <b>Postura</b> (la opinión que defiendo), <b>Respaldo</b> (la explicación de mi opinión) y <b>Evidencia</b> (datos concretos de la fuente que apoyan mi opinión)." }
    ],
    missions: [
      { id: "c1m1", title: "¿Por qué zarpar?", char: "ovaya", story: "Ovaya encontró un cofre con tres llaves. Cada llave es una causa de los viajes. ¡Ayúdalo a descubrirlas!",
        questions: [
          { t: "mc", q: "¿Qué significa multicausalidad en Historia?", opts: ["Que un hecho tiene una sola causa muy importante", "Que existen diversas causas que explican un mismo acontecimiento o proceso", "Que las causas siempre son económicas", "Que los hechos no tienen causas"], a: 1, why: "Ningún acontecimiento o proceso histórico puede ser explicado por una sola causa." },
          { t: "mc", q: "En el siglo XV, ¿por qué Europa tuvo que buscar nuevas rutas hacia Asia?", opts: ["Porque Asia dejó de producir seda", "Porque sus rutas comerciales fueron cortadas por el avance del Islam", "Porque descubrieron América", "Porque los reyes prohibieron el comercio"], a: 1, why: "Las rutas comerciales hacia India y China fueron cortadas por el avance del Islam; Europa necesitaba otro camino." },
          { t: "mc", q: "¿Quiénes formaban la burguesía?", opts: ["Reyes y príncipes", "Sacerdotes y monjes", "Comerciantes, banqueros y mercaderes", "Campesinos y pescadores"], a: 2, why: "La burguesía era el grupo de comerciantes, banqueros y mercaderes que financió los viajes para expandir sus negocios." },
          { t: "tf", q: "La carabela fue el primer barco europeo capaz de adentrarse en el océano.", a: true, why: "Usaba la fuerza del viento y tenía gran capacidad de carga. Con ella se pudo cruzar el Atlántico." },
          { t: "classify", q: "Clasifica cada elemento en la causa que corresponde.", buckets: ["Rutas comerciales", "Desarrollo económico", "Avances tecnológicos"], items: [["Ruta de la Seda cortada", 0], ["Burguesía financia viajes", 1], ["Brújula y astrolabio", 2], ["Buscar otro camino a Asia", 0], ["Ciudades crecen en población", 1], ["La carabela", 2]], why: "Las tres causas: rutas comerciales cortadas, una burguesía con dinero para financiar, y tecnología para navegar el océano." },
          { t: "fill", q: "El ___ es un instrumento de origen chino que señala el norte con una aguja imantada.", opts: ["astrolabio", "cuadrante", "brújula", "portulano"], a: 2, why: "La brújula permite orientarse con los puntos cardinales." },
          { t: "mc", q: "¿Cuál de estos es un PROCESO histórico y no un acontecimiento?", opts: ["La llegada de Colón a América el 12 de octubre de 1492", "La expansión europea de los siglos XV y XVI", "La caída de Constantinopla en 1453", "La muerte de Moctezuma en 1520"], a: 1, why: "Un proceso dura un tiempo largo y reúne muchos hechos; un acontecimiento ocurre en un momento puntual." },
          { t: "write", q: "Explica con tus palabras por qué la burguesía es una causa de los viajes de exploración.", model: "La burguesía (comerciantes, banqueros y mercaderes) tenía dinero y quería expandir sus negocios. Por eso empujó y financió los viajes de exploración para encontrar nuevas rutas y productos.", keywords: ["dinero", "financi", "negocio", "comerciante"] }
        ] },
      { id: "c1m2", title: "Instrumentos del navegante", char: "chupaya", story: "¡Chupaya se perdió en alta mar! Sin brújula no sabe hacia dónde ir. Enséñale a usar los instrumentos y lo traeremos de vuelta.",
        questions: [
          { t: "match", q: "Une cada instrumento con lo que hace.", pairs: [["Brújula", "Señala el norte con una aguja imantada"], ["Astrolabio", "Mide la altura de los astros para saber la latitud"], ["Portulano", "Mapa que muestra costas y puertos"], ["Carabela", "Barco veloz capaz de cruzar el océano"]], why: "Cada instrumento resolvió un problema distinto: orientarse, ubicarse, conocer las costas y navegar lejos." },
          { t: "mc", q: "¿Por qué la carabela fue tan importante para la expansión europea?", opts: ["Porque era el barco más grande del mundo", "Porque podía adentrarse en el océano, usando el viento y con gran capacidad de carga", "Porque tenía motor", "Porque solo la usaban los reyes"], a: 1, why: "Antes de la carabela, los barcos europeos navegaban cerca de la costa. La carabela permitió cruzar el Atlántico." },
          { t: "tf", q: "Los avances tecnológicos fueron la única causa de los viajes de exploración.", a: false, why: "¡Multicausalidad! También influyeron las rutas comerciales cortadas y el desarrollo económico con la burguesía." },
          { t: "order", q: "Ordena estos hechos del más antiguo al más reciente.", items: ["Las rutas comerciales hacia Asia son cortadas por el avance del Islam", "La burguesía financia viajes de exploración", "Colón llega a América (1492)", "Vasco da Gama llega a la India bordeando África (1498)"], why: "Primero se cortan las rutas, luego se financian viajes, después Colón llega a América en 1492 y Vasco da Gama a la India en 1498." },
          { t: "mc", q: "¿Qué ruta siguió Portugal para llegar a la India?", opts: ["Cruzando el Atlántico hacia el oeste", "Bordeando las costas de África", "Por tierra, cruzando Asia", "Por el Polo Norte"], a: 1, why: "Portugal navegó las costas de África (Bartolomé Díaz, Vasco da Gama). España, en cambio, apostó por el oeste con Colón." },
          { t: "fill", q: "Colón navegó hacia el ___ en nombre de los reyes españoles para encontrar una nueva ruta a la India.", opts: ["norte", "sur", "este", "oeste"], a: 3, why: "Colón creía que navegando al oeste llegaría a Asia. Se encontró con América." },
          { t: "mc", q: "¿Cuántos viajes hizo Cristóbal Colón a América?", opts: ["Uno", "Dos", "Tres", "Cuatro"], a: 3, why: "Cuatro viajes: 1492, 1493, 1498 y 1502." },
          { t: "write", q: "Chupaya te pregunta: «¿Qué le diría un explorador del siglo XV a un burgués para que financie su viaje?» Escribe dos razones.", model: "Le diría que las rutas hacia Asia están cortadas y que encontrar una nueva ruta traería especias y riquezas para su negocio; y que ahora existen la carabela, la brújula y el astrolabio, que hacen posible cruzar el océano.", keywords: ["ruta", "riqueza", "carabela", "especia", "negocio"] }
        ] },
      { id: "c1m3", title: "Detectives del pasado", char: "estaya", story: "Estaya encontró un diario viejísimo en una cueva. «¿Será de Colón? ¿Cómo lo sabemos?» Para investigar hay que analizar fuentes históricas.",
        questions: [
          { t: "mc", q: "¿Qué es una fuente histórica?", opts: ["Un lugar donde nace un río antiguo", "Un registro del pasado que nos entrega información de lo que pasó y cómo pasó", "Un libro escrito por un historiador de hoy solamente", "Un mapa del tesoro"], a: 1, why: "Las fuentes pueden ser textos, imágenes, objetos o videos que registran el pasado." },
          { t: "classify", q: "Clasifica cada fuente según su ORIGEN.", buckets: ["Primaria", "Secundaria"], items: [["Diario de a bordo de Colón (1492)", 0], ["Libro de Historia de 5º básico (2026)", 1], ["Carta de Hernán Cortés al rey (1520)", 0], ["Documental sobre los incas (2015)", 1], ["Mapa dibujado por un navegante en 1500", 0]], why: "Primaria: hecha en la época y por un participante. Secundaria: hecha después, por alguien que no participó." },
          { t: "classify", q: "Clasifica cada fuente según su FORMATO.", buckets: ["Escrita", "Visual", "Arqueológica", "Audiovisual"], items: [["Carta de un explorador", 0], ["Pintura de la llegada de Colón", 1], ["Vasija inca encontrada en una excavación", 2], ["Documental de televisión", 3], ["Crónica de un fraile", 0], ["Ruinas de Tenochtitlan", 2]], why: "Formato = de qué está hecha la fuente: texto, imagen, objeto o video." },
          { t: "mc", q: "Un cronista escribe un texto para que el rey le dé más dinero para su expedición. ¿Cuál es el propósito principal de esa fuente?", opts: ["Informar", "Convencer", "Comunicar una noticia", "Entretener"], a: 1, why: "Cuando el autor quiere que alguien haga o piense algo, el propósito es convencer." },
          { t: "match", q: "Une cada parte de una argumentación con su definición.", pairs: [["Postura", "La opinión que se busca defender"], ["Respaldo", "La explicación de la opinión"], ["Evidencia", "Datos concretos de la fuente que apoyan mi opinión"]], why: "Postura, respaldo y evidencia: así se argumenta con fuentes." },
          { t: "tf", q: "Una fuente secundaria es aquella escrita en el tiempo histórico que se estudia y por un participante de los hechos.", a: false, why: "Esa es la definición de fuente PRIMARIA. La secundaria se escribe después y por alguien que no participó." },
          { t: "mc", q: "Lee esta fuente: «Vine a servir a Dios y a Su Majestad, a dar luz a los que estaban en tinieblas, y a hacerme rico, como todos los hombres desean» (Bernal Díaz del Castillo, soldado de Cortés, siglo XVI). ¿Qué información relevante entrega sobre las motivaciones de los conquistadores?", opts: ["Que solo querían evangelizar", "Que tenían varias motivaciones: religión, servir al rey y riqueza", "Que no querían nada", "Que buscaban ciencia"], a: 1, why: "La fuente muestra multicausalidad en las motivaciones: Dios, el rey y el oro." },
          { t: "write", q: "«Colón solo buscaba riquezas al llegar a América». Escribe tu POSTURA y un RESPALDO (puedes usar lo que sabes sobre las causas de los viajes).", model: "Postura: No estoy de acuerdo. Respaldo: Colón buscaba una nueva ruta hacia la India porque las rutas comerciales estaban cortadas; además navegaba en nombre de los reyes de España, que querían expandir su poder y la religión católica. La riqueza era una causa, pero no la única.", keywords: ["ruta", "reyes", "religi", "no solo", "única"] }
        ] }
    ],
    flashcards: [
      ["Multicausalidad", "Diversas causas explican un mismo acontecimiento o proceso histórico. Ninguno se explica por una sola causa."],
      ["Causa 1: Rutas comerciales", "Rutas hacia Asia cortadas por el avance del Islam (s. XV). Europa busca nuevas rutas."],
      ["Causa 2: Desarrollo económico", "Ciudades crecen; aparece la burguesía (comerciantes, banqueros, mercaderes) que financia los viajes."],
      ["Causa 3: Avances tecnológicos", "Brújula, astrolabio, cuadrante, portulanos y la carabela."],
      ["Carabela", "Primer barco europeo capaz de adentrarse en el océano. Usaba el viento y tenía gran capacidad de carga."],
      ["Ruta de Portugal", "Bordeando África: Bartolomé Díaz (1488, cabo de Buena Esperanza) y Vasco da Gama (1498, India)."],
      ["Ruta de España", "Colón navega al oeste en nombre de los Reyes Católicos. Llega a América el 12 de octubre de 1492. Cuatro viajes: 1492, 1493, 1498, 1502."],
      ["Fuente histórica", "Registro del pasado que entrega información de lo que pasó y cómo pasó."],
      ["Fuente primaria", "Hecha en la época estudiada y por un participante de los hechos."],
      ["Fuente secundaria", "Hecha después de los hechos, por alguien que no participó."],
      ["Formatos de fuente", "Escrita, visual, arqueológica, audiovisual."],
      ["Propósito de una fuente", "Informar, comunicar, dar su opinión o convencer."],
      ["Argumentación", "Postura (opinión) + Respaldo (explicación) + Evidencia (datos de la fuente)."],
      ["Acontecimiento vs. proceso", "Acontecimiento: hecho puntual. Proceso: conjunto de hechos durante un tiempo largo."]
    ]
  },

  /* ───────────────────────── CAMPAMENTO 2 ───────────────────────── */
  {
    id: "c2", n: 2, name: "Selva de los Tres Templos", lugar:"América", epoca:"Antes de 1492", topic: "Culturas americanas pre-Conquista", icon: "🏛️", color: "#F2B134",
    guide: "estaya",
    intro: "Escucha… ¿oyes tambores? Saltamos a otra selva y a otra época: estamos en América, antes de 1492. Acá viven millones de personas con ciudades enormes y calendarios. Te presento a mayas, aztecas e incas.",
    notes: [
      { title: "América antes de 1492", body: "Cuando llegaron los europeos, América ya estaba habitada por muchos pueblos con distintas formas de vida. Tres grandes civilizaciones destacaban: los <b>mayas</b>, los <b>aztecas</b> (o mexicas) y los <b>incas</b>. Además había muchos otros pueblos, como los que vivían en Chile (atacameños, diaguitas, mapuches, entre otros)." },
      { title: "Los mayas", body: "Vivieron en la <b>península de Yucatán</b> y Centroamérica (actuales México, Guatemala, Belice, Honduras). No formaron un imperio: se organizaban en <b>ciudades-estado</b> independientes (como Tikal y Chichén Itzá). Destacaron por su <b>escritura</b> de glifos, su <b>calendario</b> muy preciso, sus <b>matemáticas con el cero</b>, la astronomía y las <b>pirámides</b>. Cultivaban maíz. Su mayor esplendor fue antes de la llegada de los españoles." },
      { title: "Los aztecas (mexicas)", body: "Vivieron en el <b>centro de México</b>. Fundaron su capital, <b>Tenochtitlan</b>, en 1325 sobre un islote del <b>lago Texcoco</b>; era una de las ciudades más grandes del mundo, con canales y <b>chinampas</b> (islas artificiales para cultivar). Formaron un <b>imperio</b> que dominaba a muchos pueblos y les cobraba <b>tributos</b>; por eso tenían enemigos (como los totonacas y tlaxcaltecas). Eran guerreros y adoraban a dioses como Huitzilopochtli. Su emperador en 1519 era <b>Moctezuma</b>." },
      { title: "Los incas", body: "Vivieron en la <b>cordillera de los Andes</b>. Su imperio se llamaba <b>Tahuantinsuyo</b> («las cuatro regiones») y su capital era <b>Cuzco</b> (actual Perú). Llegó a abarcar desde Colombia hasta el centro de Chile. Su gobernante era el <b>Sapa Inca</b>. Construyeron una gran red de <b>caminos</b> (Qhapaq Ñan), <b>terrazas</b> de cultivo en las montañas y ciudades como <b>Machu Picchu</b>. Registraban información con <b>quipus</b> (cuerdas con nudos) y hablaban <b>quechua</b>. Trabajaban en comunidad (ayllu) y por turnos para el Estado (mita). En 1532 estaban en guerra civil entre los hermanos <b>Huáscar y Atahualpa</b>." },
      { title: "Lo que tenían en común", body: "Las tres civilizaciones tenían <b>agricultura</b> avanzada (el maíz era básico), <b>ciudades</b> con templos y pirámides, religiones <b>politeístas</b> (muchos dioses), gobernantes poderosos y grandes conocimientos de astronomía. Ninguna conocía el <b>caballo</b>, el <b>hierro</b> ni la <b>pólvora</b>, y eso importó mucho en la Conquista." }
    ],
    missions: [
      { id: "c2m1", title: "Tres imperios, tres lugares", char: "estaya", story: "Estaya compuso una canción con tres estrofas, una por cultura, pero mezcló todo. Ayúdalo a poner cada cosa en su lugar.",
        questions: [
          { t: "match", q: "Une cada civilización con el lugar donde vivió.", pairs: [["Mayas", "Península de Yucatán y Centroamérica"], ["Aztecas", "Centro de México, lago Texcoco"], ["Incas", "Cordillera de los Andes"]], why: "Mayas al sur de México y Centroamérica, aztecas en el centro de México e incas a lo largo de los Andes." },
          { t: "mc", q: "¿Cuál era la capital del Imperio azteca?", opts: ["Cuzco", "Tenochtitlan", "Chichén Itzá", "Machu Picchu"], a: 1, why: "Tenochtitlan fue fundada en 1325 sobre un islote del lago Texcoco." },
          { t: "mc", q: "¿Cómo se llamaba el imperio de los incas?", opts: ["Tahuantinsuyo", "Mesoamérica", "Yucatán", "Texcoco"], a: 0, why: "Tahuantinsuyo significa «las cuatro regiones». Su capital era Cuzco." },
          { t: "tf", q: "Los mayas formaron un gran imperio unido bajo un solo emperador.", a: false, why: "Los mayas se organizaban en ciudades-estado independientes. Los que formaron imperios fueron aztecas e incas." },
          { t: "classify", q: "¿A qué civilización pertenece cada elemento?", buckets: ["Mayas", "Aztecas", "Incas"], items: [["Quipus", 2], ["Chinampas", 1], ["Calendario y matemáticas con el cero", 0], ["Cuzco", 2], ["Moctezuma", 1], ["Ciudades-estado como Tikal", 0], ["Caminos por los Andes", 2], ["Tributos de pueblos dominados", 1]], why: "Quipus, Cuzco y caminos: incas. Chinampas, Moctezuma y tributos: aztecas. Calendario, cero y ciudades-estado: mayas." },
          { t: "fill", q: "Los aztecas cultivaban en ___, islas artificiales construidas sobre el lago Texcoco.", opts: ["terrazas", "chinampas", "quipus", "pirámides"], a: 1, why: "Las chinampas permitían cultivar en el lago. Los incas, en cambio, usaban terrazas en las montañas." },
          { t: "mc", q: "¿Quién gobernaba a los incas?", opts: ["El Sapa Inca", "Moctezuma", "El cacique de Tikal", "Un consejo de ciudades"], a: 0, why: "El Sapa Inca era el gobernante máximo; en 1532 Huáscar y Atahualpa se disputaban ese puesto." },
          { t: "write", q: "Nombra dos logros o conocimientos de los mayas.", model: "Los mayas tenían una escritura de glifos, un calendario muy preciso, matemáticas con el número cero, conocimientos de astronomía y construyeron pirámides.", keywords: ["calendario", "escritura", "cero", "astronom", "pirámide"] }
        ] },
      { id: "c2m2", title: "El rescate en Tenochtitlan", char: "chupaya", story: "Chupaya se perdió entre los canales de Tenochtitlan. Para encontrarlo, responde las preguntas de los guardianes de cada cultura.",
        questions: [
          { t: "mc", q: "¿Por qué los aztecas tenían enemigos entre otros pueblos de México?", opts: ["Porque no tenían ejército", "Porque dominaban a otros pueblos y les cobraban tributos", "Porque vivían en el mar", "Porque hablaban quechua"], a: 1, why: "Pueblos como los totonacas y tlaxcaltecas estaban dominados por los aztecas. Esto lo aprovechó Cortés." },
          { t: "mc", q: "¿Qué eran los quipus?", opts: ["Caminos de piedra", "Barcos de totora", "Cuerdas con nudos para registrar información", "Templos incas"], a: 2, why: "Los incas no tenían escritura como la nuestra; usaban quipus para llevar cuentas y registros." },
          { t: "tf", q: "Los incas construyeron una gran red de caminos que unía su imperio a lo largo de los Andes.", a: true, why: "El Qhapaq Ñan tenía miles de kilómetros y llegaba hasta el centro de Chile." },
          { t: "mc", q: "En 1532, cuando llegó Pizarro, ¿qué estaba pasando en el Imperio inca?", opts: ["Una fiesta del sol", "Una guerra civil entre Huáscar y Atahualpa", "La construcción de Cuzco", "No pasaba nada especial"], a: 1, why: "La guerra civil entre los dos hermanos debilitó al imperio y facilitó la conquista." },
          { t: "classify", q: "¿Verdadero para las TRES civilizaciones o solo para ALGUNA?", buckets: ["Las tres", "Solo alguna"], items: [["Cultivaban maíz", 0], ["Tenían muchos dioses (politeístas)", 0], ["Vivían en la cordillera de los Andes", 1], ["No conocían el caballo ni el hierro", 0], ["Se organizaban en ciudades-estado", 1], ["Construyeron templos y pirámides", 0]], why: "Andes y ciudades-estado son características de una sola cultura (incas y mayas). Lo demás lo compartían." },
          { t: "order", q: "Ordena de norte a sur los territorios de estas civilizaciones.", items: ["Aztecas (centro de México)", "Mayas (Yucatán y Centroamérica)", "Incas (Andes, desde Colombia hasta Chile)"], why: "Los aztecas estaban más al norte, luego los mayas en Yucatán y Centroamérica, y los incas en Sudamérica." },
          { t: "fill", q: "El idioma de los incas era el ___.", opts: ["náhuatl", "maya", "quechua", "español"], a: 2, why: "El quechua todavía se habla hoy en Perú, Bolivia y otros países. Los aztecas hablaban náhuatl." },
          { t: "write", q: "Chupaya pregunta: ¿por qué crees que estas civilizaciones no conocían el caballo? ¿Por qué eso importó después?", model: "El caballo no existía en América; lo trajeron los europeos. Cuando llegaron los españoles a caballo y con armas de hierro y pólvora, tenían una gran ventaja militar sobre pueblos que peleaban a pie con armas de piedra y madera.", keywords: ["no existía", "trajeron", "ventaja", "hierro", "armas"] }
        ] }
    ],
    flashcards: [
      ["Mayas: lugar", "Península de Yucatán y Centroamérica (México, Guatemala, Belice, Honduras)."],
      ["Mayas: organización", "Ciudades-estado independientes (Tikal, Chichén Itzá). No formaron un imperio."],
      ["Mayas: logros", "Escritura de glifos, calendario, matemáticas con el cero, astronomía, pirámides."],
      ["Aztecas: lugar y capital", "Centro de México. Capital Tenochtitlan (1325), en el lago Texcoco."],
      ["Aztecas: organización", "Imperio que dominaba pueblos y cobraba tributos. Emperador Moctezuma (1519). Chinampas para cultivar."],
      ["Incas: lugar y capital", "Cordillera de los Andes. Imperio Tahuantinsuyo, capital Cuzco."],
      ["Incas: logros", "Red de caminos (Qhapaq Ñan), terrazas de cultivo, Machu Picchu, quipus, quechua."],
      ["Incas: gobierno", "Sapa Inca. En 1532, guerra civil entre Huáscar y Atahualpa."],
      ["Lo común a las tres", "Agricultura (maíz), ciudades y templos, politeísmo, astronomía. No conocían caballo, hierro ni pólvora."]
    ]
  },

  /* ───────────────────────── CAMPAMENTO 3 ───────────────────────── */
  {
    id: "c3", n: 3, name: "Selva de la Hueste", lugar:"España y el Caribe", epoca:"Siglo XVI", topic: "La empresa de Conquista europea", icon: "📜", color: "#C97B4A",
    guide: "ovaya",
    intro: "Esta rama nos dejó entre España y el Caribe, en pleno siglo XVI. ¡Mira! Un contrato con sello real: una capitulación. Acá la Conquista funcionaba como una empresa. ¿Quién ponía el dinero? ¡Investiguemos!",
    notes: [
      { title: "La Conquista como empresa", body: "La conquista de América <b>no la hizo un ejército del rey</b>. Fue una <b>empresa privada</b>: un capitán conseguía dinero de socios (burgueses, comerciantes, él mismo) para armar una expedición, con la esperanza de ganar riquezas, tierras y títulos." },
      { title: "La capitulación", body: "Era el <b>contrato entre la Corona (el rey) y el capitán</b>. El rey daba <b>permiso</b> para conquistar un territorio y prometía <b>títulos</b> (como adelantado o gobernador) y parte de las riquezas. A cambio, el conquistador debía entregar al rey el <b>quinto real</b> (la quinta parte de lo obtenido) y extender la <b>religión católica</b>." },
      { title: "La hueste", body: "Era el <b>grupo armado</b> que acompañaba al capitán. No eran soldados profesionales: eran hombres que <b>invertían</b> sus armas, caballos o dinero y recibían una parte del botín según lo aportado. Quien traía caballo recibía más." },
      { title: "Motivaciones", body: "Se resumen en <b>«Dios, oro y gloria»</b>: evangelizar (extender el cristianismo), obtener <b>riquezas</b> (oro, plata, tierras, mano de obra) y ganar <b>fama y títulos</b>. ¡Multicausalidad otra vez!" },
      { title: "¿Por qué pocos vencieron a tantos?", body: "Los españoles eran pocos, pero tenían: <b>caballos</b>, <b>armas de acero</b>, <b>arcabuces y cañones</b> (pólvora), <b>perros de guerra</b>; hicieron <b>alianzas</b> con pueblos enemigos de aztecas e incas; aprovecharon las <b>divisiones internas</b> (guerra civil inca); y las <b>enfermedades</b> como la viruela mataron a muchísimos indígenas que no tenían defensas." }
    ],
    missions: [
      { id: "c3m1", title: "El contrato del rey", char: "ovaya", story: "Ovaya quiere organizar su propia expedición. ¡Pero primero necesita entender cómo se financiaba y qué prometía el rey!",
        questions: [
          { t: "mc", q: "¿Quién financiaba principalmente las expediciones de conquista?", opts: ["El ejército del rey de España", "Capitanes y socios privados que invertían su dinero", "La Iglesia católica", "Los pueblos indígenas"], a: 1, why: "La Conquista fue una empresa privada; el rey daba permiso, no pagaba." },
          { t: "mc", q: "¿Qué era una capitulación?", opts: ["Una batalla", "El contrato entre la Corona y el capitán conquistador", "Un barco", "Un impuesto indígena"], a: 1, why: "En la capitulación el rey daba permiso y prometía títulos; el conquistador se comprometía a entregar el quinto real y a evangelizar." },
          { t: "fill", q: "El ___ era la quinta parte de las riquezas que el conquistador debía entregar al rey.", opts: ["tributo", "quinto real", "botín", "adelantado"], a: 1, why: "Quinto = 1/5. El resto se repartía entre el capitán y la hueste." },
          { t: "mc", q: "¿Qué era la hueste?", opts: ["Un ejército profesional pagado por el rey", "Un grupo armado de hombres que invertían sus armas y caballos a cambio de parte del botín", "Un grupo de sacerdotes", "Un tipo de barco"], a: 1, why: "Cada miembro recibía según lo que aportaba: quien traía caballo ganaba más." },
          { t: "classify", q: "Clasifica cada motivación de los conquistadores.", buckets: ["Dios (religión)", "Oro (riquezas)", "Gloria (fama y títulos)"], items: [["Evangelizar a los indígenas", 0], ["Conseguir oro y plata", 1], ["Ser nombrado gobernador", 2], ["Obtener tierras", 1], ["Extender el cristianismo", 0], ["Ganar fama como conquistador", 2]], why: "«Dios, oro y gloria»: tres motivaciones que actuaban juntas." },
          { t: "tf", q: "La Conquista fue realizada por un gran ejército profesional enviado por el rey de España.", a: false, why: "Fue una empresa privada con huestes financiadas por el capitán y sus socios." },
          { t: "match", q: "Une cada concepto con su definición.", pairs: [["Capitulación", "Contrato entre el rey y el conquistador"], ["Hueste", "Grupo armado que acompañaba al capitán"], ["Quinto real", "Parte de las riquezas para el rey"], ["Adelantado", "Título que el rey daba al conquistador"]], why: "Vocabulario clave de la empresa de conquista." },
          { t: "write", q: "Explica por qué se dice que la Conquista fue una «empresa».", model: "Porque funcionaba como un negocio: un capitán y sus socios invertían dinero, armas y caballos en una expedición esperando ganar riquezas, tierras y títulos. El rey solo daba permiso mediante una capitulación y recibía el quinto real.", keywords: ["inver", "negocio", "privad", "ganar", "quinto"] }
        ] },
      { id: "c3m2", title: "Pocos contra muchos", char: "chupaya", story: "Chupaya se escondió en el campamento de la hueste y ahora no encuentra la salida. Descubre las ventajas que tuvieron los españoles para rescatarlo.",
        questions: [
          { t: "mc", q: "¿Cuál de estas NO fue una ventaja de los españoles en la Conquista?", opts: ["Caballos y armas de acero", "Alianzas con pueblos indígenas", "Tener más soldados que los aztecas", "Enfermedades que afectaron a los indígenas"], a: 2, why: "Los españoles eran muy pocos. Vencieron por tecnología, alianzas, divisiones internas y enfermedades." },
          { t: "mc", q: "¿Por qué las enfermedades europeas fueron tan mortales en América?", opts: ["Porque los indígenas no tenían médicos", "Porque los indígenas no tenían defensas contra enfermedades desconocidas como la viruela", "Porque hacía mucho calor", "Porque los españoles las repartían a propósito en todas partes"], a: 1, why: "La viruela y otras enfermedades nunca habían llegado a América. Murieron millones de personas." },
          { t: "tf", q: "Cortés se alió con pueblos dominados por los aztecas, como los totonacas.", a: true, why: "Esos pueblos querían liberarse de los tributos aztecas y se unieron a Cortés (julio de 1519)." },
          { t: "classify", q: "¿Ventaja de los españoles o debilidad de los imperios americanos?", buckets: ["Ventaja española", "Debilidad americana"], items: [["Arcabuces y cañones", 0], ["Guerra civil entre Huáscar y Atahualpa", 1], ["Caballos", 0], ["Pueblos dominados que odiaban a los aztecas", 1], ["Armas de acero", 0], ["Sin defensas contra la viruela", 1]], why: "La Conquista se explica por ambas cosas a la vez: fuerza española y divisiones americanas." },
          { t: "fill", q: "Las motivaciones de los conquistadores se resumen en «Dios, ___ y gloria».", opts: ["plata", "oro", "rey", "tierra"], a: 1, why: "Dios (evangelizar), oro (riquezas) y gloria (fama y títulos)." },
          { t: "mc", q: "¿Qué recibía el rey a cambio de dar permiso para conquistar?", opts: ["Nada", "El quinto real y la extensión de la religión católica en las nuevas tierras", "Todos los caballos", "La mitad de los soldados"], a: 1, why: "La capitulación beneficiaba a ambos: el rey ganaba territorios, riquezas y súbditos cristianos." },
          { t: "order", q: "Ordena los pasos de una empresa de conquista.", items: ["El capitán firma una capitulación con el rey", "Reúne socios y una hueste con armas y caballos", "Viaja y conquista el territorio", "Se reparte el botín y se entrega el quinto real"], why: "Permiso, financiamiento, conquista y reparto: así funcionaba la empresa." },
          { t: "write", q: "Chupaya pregunta: «Si los españoles eran tan pocos, ¿cómo vencieron?». Escribe al menos tres razones.", model: "Tenían caballos, armas de acero y de pólvora; hicieron alianzas con pueblos enemigos de los aztecas e incas; aprovecharon divisiones internas como la guerra civil inca; y las enfermedades como la viruela mataron a gran parte de la población indígena.", keywords: ["caballo", "alianza", "enfermedad", "viruela", "acero", "guerra civil", "pólvora"] }
        ] }
    ],
    flashcards: [
      ["Empresa de conquista", "La Conquista fue privada: capitanes y socios invertían; el rey solo daba permiso."],
      ["Capitulación", "Contrato entre la Corona y el capitán: permiso para conquistar, títulos y reparto de riquezas."],
      ["Hueste", "Grupo armado que acompañaba al capitán; cada uno aportaba armas o caballos y recibía parte del botín."],
      ["Quinto real", "La quinta parte de las riquezas, que se entregaba al rey."],
      ["Motivaciones", "«Dios, oro y gloria»: evangelizar, riquezas y fama/títulos."],
      ["Ventajas españolas", "Caballos, armas de acero, arcabuces y cañones, perros de guerra."],
      ["Alianzas y divisiones", "Alianza con pueblos dominados (totonacas, tlaxcaltecas); guerra civil inca (Huáscar vs. Atahualpa)."],
      ["Enfermedades", "Viruela y otras: los indígenas no tenían defensas; murieron millones."]
    ]
  },

  /* ───────────────────────── CAMPAMENTO 4 ───────────────────────── */
  {
    id: "c4", n: 4, name: "Selva de las Cascadas", lugar:"México y Perú", epoca:"1519 a 1535", topic: "Conquista de México y Perú", icon: "⏳", color: "#8E6BC7",
    guide: "chupaya",
    intro: "¡Esta selva está rota por dentro! Las cascadas mezclan los años: caigo en 1519 y salgo en 1535. Estamos en México y Perú, y si no ordeno lo que pasó, nunca vamos a salir de aquí.",
    notes: [
      { title: "Conquista de México (1519–1521)", body: "Protagonistas: <b>Hernán Cortés</b> (español) y <b>Moctezuma</b> (emperador azteca).<br>• <b>Febrero 1519</b>: Cortés zarpa desde Cuba.<br>• <b>Julio 1519</b>: Cortés se alía con los <b>totonacas</b>, pueblo dominado por los aztecas.<br>• <b>Agosto 1519</b>: Cortés y sus aliados inician la marcha hacia <b>Tenochtitlan</b>.<br>• <b>Noviembre 1519</b>: Moctezuma recibe pacíficamente a Cortés.<br>• <b>Junio 1520</b>: Cortés captura y asesina a Moctezuma. Los españoles son atacados y <b>expulsados</b> de Tenochtitlan (la «Noche Triste»).<br>• La población de Tenochtitlan es arrasada por <b>enfermedades</b> traídas por los españoles (viruela).<br>• <b>Mayo 1521</b>: los españoles vuelven a <b>sitiar</b> la ciudad.<br>• <b>Agosto 1521</b>: Tenochtitlan <b>cae</b> y es ocupada por Cortés." },
      { title: "Conquista del Perú (1531–1535)", body: "Protagonistas: <b>Francisco Pizarro</b> (español) y <b>Atahualpa</b> (Inca).<br>• <b>1528</b>: estalla la <b>guerra civil</b> incaica entre Huáscar y Atahualpa.<br>• <b>Enero 1531</b>: Pizarro inicia su expedición hacia Perú.<br>• <b>Mayo 1532</b>: Pizarro se entera de la existencia de los incas y de Atahualpa.<br>• <b>Junio 1532</b>: Atahualpa cita a Pizarro a una reunión en <b>Cajamarca</b>.<br>• <b>Noviembre 1532</b>: Pizarro se encuentra con Atahualpa en Cajamarca y lo captura.<br>• Atahualpa es <b>asesinado</b> (en la línea de tiempo de la clase aparece «15 de noviembre»; ocurrió después de su captura y de pagar un rescate en oro).<br>• <b>Agosto 1533</b>: Pizarro y su hueste parten a <b>Cuzco</b>, capital del imperio.<br>• <b>Noviembre 1533</b>: los españoles llegan a Cuzco y <b>saquean</b> la ciudad.<br>• <b>Enero 1535</b>: Pizarro derrota la última resistencia inca y controla el imperio." },
      { title: "Parecidos entre las dos conquistas", body: "En ambas, un capitán con pocos hombres <b>capturó al gobernante</b> (Moctezuma, Atahualpa), aprovechó <b>divisiones</b> (pueblos enemigos de los aztecas; guerra civil inca), contó con <b>caballos y armas superiores</b> y con el efecto de las <b>enfermedades</b>. Ambas terminaron con la <b>caída de la capital</b> (Tenochtitlan 1521, Cuzco 1533)." },
      { title: "Dos perspectivas", body: "El mismo proceso se vive distinto según quién lo cuenta. Para un <b>español</b>: una hazaña, riquezas, servicio al rey y a Dios. Para un <b>indígena</b>: invasión, muerte del gobernante, enfermedades, pérdida de la libertad y de la ciudad. En la prueba pueden pedirte escribir desde una de estas perspectivas." }
    ],
    missions: [
      { id: "c4m1", title: "Cortés y Moctezuma", char: "chupaya", story: "Primera parada: México, 1519. Chupaya dejó pistas en cada fecha. Ordénalas y lo encontrarás en Tenochtitlan.",
        questions: [
          { t: "mc", q: "¿Quién dirigió la conquista de México?", opts: ["Francisco Pizarro", "Hernán Cortés", "Cristóbal Colón", "Pedro de Valdivia"], a: 1, why: "Cortés zarpó desde Cuba en febrero de 1519." },
          { t: "mc", q: "¿Quién era Moctezuma?", opts: ["El Sapa Inca", "El emperador de los aztecas", "Un aliado de Cortés", "El rey de España"], a: 1, why: "Moctezuma recibió pacíficamente a Cortés en noviembre de 1519 y fue capturado y asesinado en junio de 1520." },
          { t: "order", q: "Ordena cronológicamente la conquista de México (parte 1).", items: ["Cortés zarpa desde Cuba (febrero 1519)", "Cortés se alía con los totonacas (julio 1519)", "Cortés y sus aliados marchan hacia Tenochtitlan (agosto 1519)", "Moctezuma recibe pacíficamente a Cortés (noviembre 1519)"], why: "Febrero, julio, agosto y noviembre de 1519: zarpar, aliarse, marchar y llegar." },
          { t: "order", q: "Ordena cronológicamente la conquista de México (parte 2).", items: ["Cortés captura y asesina a Moctezuma (junio 1520)", "Los españoles son atacados y expulsados de Tenochtitlan", "La población de Tenochtitlan es arrasada por enfermedades", "Los españoles vuelven a sitiar la ciudad (mayo 1521)", "Tenochtitlan cae y es ocupada por Cortés (agosto 1521)"], why: "Muerte de Moctezuma, expulsión, enfermedad, sitio y caída de la ciudad." },
          { t: "mc", q: "¿Quiénes eran los totonacas?", opts: ["Un pueblo dominado por los aztecas que se alió con Cortés", "Los soldados de Cortés", "Los sacerdotes aztecas", "Un pueblo de los Andes"], a: 0, why: "Alianza clave de julio de 1519: los totonacas querían liberarse del dominio azteca." },
          { t: "fill", q: "Tenochtitlan cae y es ocupada por Cortés en agosto de ___.", opts: ["1519", "1520", "1521", "1532"], a: 2, why: "La conquista de México duró de 1519 a 1521." },
          { t: "tf", q: "Después de ser expulsados de Tenochtitlan, los españoles nunca regresaron.", a: false, why: "Volvieron en mayo de 1521 a sitiar la ciudad, que cayó en agosto de 1521." },
          { t: "mc", q: "¿Qué pasó con la población de Tenochtitlan entre la expulsión de los españoles y el sitio de 1521?", opts: ["Creció mucho", "Fue arrasada por enfermedades traídas por los españoles", "Se mudó a Cuzco", "Se alió con Pizarro"], a: 1, why: "La viruela debilitó a la ciudad antes del ataque final." }
        ] },
      { id: "c4m2", title: "Pizarro y Atahualpa", char: "chupaya", story: "Segunda parada: los Andes, 1532. Chupaya está en algún lugar entre Cajamarca y Cuzco. Sigue las fechas.",
        questions: [
          { t: "mc", q: "¿Quién dirigió la conquista del Perú?", opts: ["Hernán Cortés", "Francisco Pizarro", "Diego de Almagro", "Vasco da Gama"], a: 1, why: "Pizarro inició su expedición hacia Perú en enero de 1531." },
          { t: "mc", q: "¿Qué estaba ocurriendo en el Imperio inca desde 1528?", opts: ["Una guerra civil entre Huáscar y Atahualpa", "Una alianza con los aztecas", "La construcción de Machu Picchu", "Una gran sequía"], a: 0, why: "La guerra civil incaica debilitó al imperio justo antes de la llegada de Pizarro." },
          { t: "order", q: "Ordena cronológicamente la conquista del Perú (parte 1).", items: ["Estalla la guerra civil incaica entre Huáscar y Atahualpa (1528)", "Pizarro inicia su expedición hacia Perú (enero 1531)", "Pizarro se entera de la existencia de los incas y de Atahualpa (mayo 1532)", "Atahualpa cita a Pizarro a una reunión en Cajamarca (junio 1532)", "Pizarro se encuentra con Atahualpa en Cajamarca (noviembre 1532)"], why: "1528, enero 1531, mayo 1532, junio 1532 y noviembre 1532." },
          { t: "order", q: "Ordena cronológicamente la conquista del Perú (parte 2).", items: ["Pizarro captura a Atahualpa en Cajamarca (noviembre 1532)", "Atahualpa es asesinado", "Pizarro y su hueste parten a Cuzco (agosto 1533)", "Los españoles llegan a Cuzco y saquean la ciudad (noviembre 1533)", "Pizarro derrota la última resistencia inca y controla el imperio (enero 1535)"], why: "Captura, muerte de Atahualpa, marcha a Cuzco, saqueo y control del imperio." },
          { t: "fill", q: "La capital del Imperio inca, saqueada por los españoles en noviembre de 1533, era ___.", opts: ["Cajamarca", "Cuzco", "Tenochtitlan", "Lima"], a: 1, why: "Cuzco era la capital del Tahuantinsuyo." },
          { t: "mc", q: "¿Dónde se encontraron Pizarro y Atahualpa?", opts: ["En Cuzco", "En Cajamarca", "En Tenochtitlan", "En Cuba"], a: 1, why: "En Cajamarca, en noviembre de 1532, Pizarro capturó a Atahualpa." },
          { t: "tf", q: "Pizarro controló el Imperio inca en enero de 1535, tras derrotar la última resistencia.", a: true, why: "Ese es el último evento de la línea de tiempo trabajada en clase." },
          { t: "mc", q: "¿En qué se parecen las conquistas de México y Perú?", opts: ["En ambas el capitán capturó al gobernante y aprovechó divisiones internas", "En ambas los españoles tenían más soldados que los indígenas", "En ambas no hubo enfermedades", "En ambas los indígenas ganaron"], a: 0, why: "Cortés capturó a Moctezuma; Pizarro a Atahualpa. Ambos usaron alianzas o divisiones internas." }
        ] },
      { id: "c4m3", title: "Dos miradas", char: "estaya", story: "Estaya quiere escribir una canción con dos voces: la de un español y la de un indígena. ¿Cómo vivió cada uno la Conquista?",
        questions: [
          { t: "classify", q: "¿Desde qué perspectiva se dice cada frase?", buckets: ["Español", "Indígena"], items: [["«Ganamos riquezas y tierras para el rey»", 0], ["«Llegaron hombres con animales gigantes y armas de fuego»", 1], ["«Nuestro emperador fue capturado»", 1], ["«Con la ayuda de los totonacas marchamos a Tenochtitlan»", 0], ["«Una enfermedad desconocida mató a mi familia»", 1], ["«Servimos a Dios llevando la fe a nuevas tierras»", 0]], why: "La misma historia se cuenta distinto según quién la vive." },
          { t: "match", q: "Une a cada personaje con su descripción.", pairs: [["Hernán Cortés", "Conquistador de México"], ["Moctezuma", "Emperador azteca"], ["Francisco Pizarro", "Conquistador del Perú"], ["Atahualpa", "Inca capturado en Cajamarca"], ["Huáscar", "Hermano y rival de Atahualpa"]], why: "Los cinco nombres clave de la Conquista de México y Perú." },
          { t: "mc", q: "Una carta escrita por Cortés al rey de España en 1520 contando la conquista es una fuente…", opts: ["Secundaria y visual", "Primaria y escrita", "Secundaria y escrita", "Primaria y arqueológica"], a: 1, why: "Primaria: escrita en la época y por un participante. Escrita: es un texto." },
          { t: "mc", q: "¿Cuál es el propósito más probable de la carta de Cortés al rey?", opts: ["Entretener", "Informar y convencer al rey de que su conquista fue valiosa", "Enseñar matemáticas", "Pedir disculpas a los aztecas"], a: 1, why: "Cortés necesitaba el apoyo del rey; sus cartas informan y buscan convencer." },
          { t: "write", q: "Escribe tres líneas de una carta desde la perspectiva de un INDÍGENA de Tenochtitlan contando la llegada de Cortés.", model: "Llegaron hombres extraños con barbas, sobre animales enormes y con armas que hacían ruido y fuego. Nuestro emperador Moctezuma los recibió en paz, pero lo capturaron. Después llegó una enfermedad que nadie conocía y muchos de los nuestros murieron.", keywords: ["Moctezuma", "enfermedad", "caballo", "animal", "captur", "llegaron"] },
          { t: "write", q: "Ahora escribe tres líneas desde la perspectiva de un ESPAÑOL de la hueste de Pizarro.", model: "Partimos en 1531 hacia el sur, en busca del imperio de oro del que hablaban todos. En Cajamarca capturamos al Inca Atahualpa y recibimos un enorme rescate. Luego marchamos a Cuzco y tomamos la ciudad en nombre del rey y de Dios.", keywords: ["Atahualpa", "Cajamarca", "Cuzco", "oro", "rey", "captur"] }
        ] }
    ],
    flashcards: [
      ["Conquista de México: quiénes", "Hernán Cortés (español) vs. Moctezuma (emperador azteca). 1519–1521."],
      ["Feb 1519", "Cortés zarpa desde Cuba."],
      ["Jul 1519", "Cortés se alía con los totonacas, pueblo dominado por los aztecas."],
      ["Ago 1519", "Cortés y sus aliados inician la marcha hacia Tenochtitlan."],
      ["Nov 1519", "Moctezuma recibe pacíficamente a Cortés."],
      ["Jun 1520", "Cortés captura y asesina a Moctezuma. Los españoles son expulsados de Tenochtitlan."],
      ["Enfermedades", "La población de Tenochtitlan es arrasada por enfermedades traídas por los españoles."],
      ["May 1521", "Los españoles vuelven a sitiar Tenochtitlan."],
      ["Ago 1521", "Tenochtitlan cae y es ocupada por Cortés."],
      ["Conquista del Perú: quiénes", "Francisco Pizarro (español) vs. Atahualpa (Inca). 1531–1535."],
      ["1528", "Guerra civil incaica entre Huáscar y Atahualpa."],
      ["Ene 1531", "Pizarro inicia su expedición hacia Perú."],
      ["May 1532", "Pizarro se entera de la existencia de los incas y de Atahualpa."],
      ["Jun 1532", "Atahualpa cita a Pizarro a una reunión en Cajamarca."],
      ["Nov 1532", "Pizarro se encuentra con Atahualpa en Cajamarca y lo captura. Luego Atahualpa es asesinado."],
      ["Ago 1533", "Pizarro y su hueste parten a Cuzco, capital del imperio."],
      ["Nov 1533", "Los españoles llegan a Cuzco y saquean la ciudad."],
      ["Ene 1535", "Pizarro derrota la última resistencia inca y controla el imperio."]
    ]
  },

  /* ───────────────────────── CAMPAMENTO 5 ───────────────────────── */
  {
    id: "c5", n: 5, name: "Selva de los Dos Mundos", lugar:"Dos continentes", epoca:"Siglos XVI y XVII", topic: "Impacto de la Conquista en América y Europa", icon: "🌎", color: "#3FA66B",
    guide: "ovaya",
    intro: "Desde esta rama tan alta se ven los dos mundos a la vez, América y Europa, y ya pasó más de un siglo. Después de la Conquista ninguno volvió a ser igual. Este es el último fragmento antes de casa.",
    notes: [
      { title: "Impacto en América (1)", body: "• <b>Caída de la población</b>: millones de indígenas murieron por <b>enfermedades</b> (viruela, sarampión), guerras y trabajo forzado. Fue la consecuencia más grave.<br>• <b>Fin de los imperios</b> azteca e inca y pérdida de la libertad de los pueblos.<br>• <b>Trabajo forzado</b>: la <b>encomienda</b>, en que un español recibía indígenas para que trabajaran para él a cambio de «protegerlos» y evangelizarlos." },
      { title: "Impacto en América (2)", body: "• <b>Nueva religión</b>: la evangelización impuso el cristianismo; muchas creencias se mezclaron (sincretismo).<br>• <b>Nuevo idioma</b>: el español (y el portugués en Brasil).<br>• <b>Mestizaje</b>: nacieron hijos de españoles e indígenas (mestizos); más tarde llegaron africanos esclavizados.<br>• <b>Nuevas ciudades</b> al estilo europeo (Lima, Santiago) y nuevos <b>animales y plantas</b>: caballo, vaca, cerdo, oveja, trigo, caña de azúcar." },
      { title: "Impacto en Europa", body: "• <b>Riquezas</b>: llegó enorme cantidad de <b>oro y plata</b>; España se convirtió en la potencia más poderosa, aunque también subieron los precios.<br>• <b>Nuevos productos</b>: papa, maíz, tomate, cacao (chocolate), tabaco, ají, porotos; cambiaron la alimentación europea.<br>• <b>Nuevos conocimientos</b>: se comprobó que existía un <b>nuevo continente</b> y que la Tierra se podía rodear (Magallanes-Elcano, 1519–1522); mapas nuevos.<br>• <b>Comercio mundial</b>: el Atlántico se llenó de rutas entre Europa, América y África.<br>• <b>Debate</b>: algunos, como el fraile <b>Bartolomé de las Casas</b>, denunciaron los abusos y defendieron los derechos de los indígenas." },
      { title: "Intercambio de dos mundos", body: "<b>De Europa a América</b>: caballo, vaca, cerdo, oveja, trigo, caña de azúcar, hierro, enfermedades, idioma y religión.<br><b>De América a Europa</b>: papa, maíz, tomate, cacao, tabaco, ají, porotos, zapallo, oro y plata. Y también <b>Chile</b> entró en este proceso: Diego de Almagro llegó en 1536 y Pedro de Valdivia fundó Santiago en 1541." }
    ],
    missions: [
      { id: "c5m1", title: "Lo que cambió en América", char: "ovaya", story: "Ovaya se sorprende de todo: «¿Antes no había caballos? ¿Ni vacas? ¿Ni trigo?». Cuéntale qué cambió en América.",
        questions: [
          { t: "mc", q: "¿Cuál fue la consecuencia más grave de la Conquista para los pueblos indígenas?", opts: ["Aprender español", "La enorme caída de la población por enfermedades, guerras y trabajo forzado", "Conocer el caballo", "Cambiar de calendario"], a: 1, why: "Millones de personas murieron, sobre todo por enfermedades como la viruela." },
          { t: "mc", q: "¿Qué era la encomienda?", opts: ["Un regalo del rey a los indígenas", "Un sistema en que un español recibía indígenas para que trabajaran para él, a cambio de protegerlos y evangelizarlos", "Una carta enviada por barco", "Un tipo de pirámide"], a: 1, why: "En la práctica fue trabajo forzado y causa de muchos abusos." },
          { t: "fill", q: "El ___ es la mezcla entre españoles e indígenas (y luego africanos) que dio origen a gran parte de la población de América.", opts: ["sincretismo", "mestizaje", "tributo", "quinto real"], a: 1, why: "Mestizaje: hijos de personas de distintos orígenes. Sincretismo es la mezcla de creencias." },
          { t: "classify", q: "Clasifica las consecuencias de la Conquista en América.", buckets: ["Población y trabajo", "Cultura y religión", "Animales y plantas"], items: [["Muerte por viruela", 0], ["Evangelización", 1], ["Llegada del caballo y la vaca", 2], ["Encomienda", 0], ["Idioma español", 1], ["Cultivo de trigo y caña de azúcar", 2]], why: "Los cambios fueron demográficos, culturales y también del paisaje y la alimentación." },
          { t: "tf", q: "Antes de la Conquista, en América ya existían caballos, vacas y trigo.", a: false, why: "Todos llegaron con los europeos. En América había maíz, papa, tomate, cacao y llamas, entre otros." },
          { t: "mc", q: "¿Qué pasó con los imperios azteca e inca después de la Conquista?", opts: ["Siguieron gobernando igual", "Desaparecieron y sus territorios pasaron a la Corona española", "Se unieron en un solo imperio", "Se mudaron a Europa"], a: 1, why: "Cayeron Tenochtitlan (1521) y Cuzco (1533); los territorios se organizaron como colonias de España." },
          { t: "mc", q: "¿Qué es el sincretismo religioso?", opts: ["Prohibir todas las religiones", "La mezcla de creencias indígenas con el cristianismo", "Construir iglesias de piedra", "Traducir la Biblia al quechua"], a: 1, why: "Muchas fiestas y creencias de hoy mezclan tradiciones indígenas y católicas." },
          { t: "write", q: "Explica dos consecuencias de la Conquista para América.", model: "Primero, la población indígena cayó enormemente por las enfermedades traídas por los europeos, las guerras y el trabajo forzado (encomienda). Segundo, cambió la cultura: se impusieron el idioma español y la religión católica, y surgió el mestizaje.", keywords: ["enfermedad", "población", "español", "religi", "mestiz", "encomienda"] }
        ] },
      { id: "c5m2", title: "Lo que cambió en Europa", char: "estaya", story: "Estaya dice que sin América no existiría el chocolate. ¿Tendrá razón? Descubre lo que la Conquista cambió en Europa.",
        questions: [
          { t: "classify", q: "¿De dónde a dónde viajó cada producto?", buckets: ["De América a Europa", "De Europa a América"], items: [["Papa", 0], ["Caballo", 1], ["Cacao (chocolate)", 0], ["Trigo", 1], ["Tomate", 0], ["Vaca", 1], ["Maíz", 0], ["Caña de azúcar", 1]], why: "América dio papa, maíz, tomate y cacao; Europa trajo caballo, vaca, trigo y caña de azúcar." },
          { t: "mc", q: "¿Qué efecto tuvo en Europa la llegada de oro y plata de América?", opts: ["Ninguno", "España se convirtió en una gran potencia, y los precios subieron", "Europa dejó de comerciar", "Se acabó la burguesía"], a: 1, why: "Las riquezas americanas financiaron el poder de España en el siglo XVI." },
          { t: "tf", q: "Con la Conquista los europeos comprobaron que existía un continente que no conocían.", a: true, why: "América no aparecía en los mapas europeos; se dibujaron mapas nuevos del mundo." },
          { t: "mc", q: "¿Quién denunció los abusos contra los indígenas y defendió sus derechos?", opts: ["Hernán Cortés", "Francisco Pizarro", "El fraile Bartolomé de las Casas", "Moctezuma"], a: 2, why: "De las Casas escribió sobre los abusos y logró leyes para proteger a los indígenas." },
          { t: "mc", q: "¿Qué expedición demostró que se podía dar la vuelta al mundo (1519–1522)?", opts: ["La de Colón", "La de Magallanes y Elcano", "La de Vasco da Gama", "La de Cortés"], a: 1, why: "Magallanes partió en 1519; murió en el camino y Elcano completó la vuelta en 1522." },
          { t: "match", q: "Une cada cambio con el continente donde ocurrió.", pairs: [["Caída de la población indígena", "América"], ["Llegada de grandes cantidades de plata", "Europa"], ["Imposición del idioma español", "América"], ["Nuevos alimentos como la papa y el tomate", "Europa"], ["Fundación de ciudades como Lima y Santiago", "América"]], why: "Cada lado del océano cambió de forma distinta." },
          { t: "fill", q: "En 1541 Pedro de Valdivia fundó la ciudad de ___, iniciando la conquista de Chile.", opts: ["Lima", "Santiago", "Cuzco", "Valparaíso"], a: 1, why: "Diego de Almagro había llegado antes a Chile, en 1536, sin fundar ciudades." },
          { t: "write", q: "Estaya pregunta: «¿Por qué se dice que la Conquista cambió la comida de todo el mundo?». Responde con ejemplos.", model: "Porque productos americanos como la papa, el maíz, el tomate y el cacao llegaron a Europa y luego a todo el mundo, y productos europeos como el trigo, la caña de azúcar, la vaca y el cerdo llegaron a América. Hoy comemos mezclas de ambos mundos.", keywords: ["papa", "maíz", "tomate", "cacao", "trigo", "vaca"] }
        ] }
    ],
    flashcards: [
      ["Impacto en América: población", "Caída enorme por enfermedades (viruela), guerras y trabajo forzado."],
      ["Encomienda", "Un español recibía indígenas para que trabajaran para él, a cambio de protegerlos y evangelizarlos."],
      ["Impacto en América: cultura", "Idioma español, religión católica (evangelización), sincretismo, mestizaje."],
      ["Impacto en América: paisaje", "Nuevas ciudades (Lima, Santiago) y nuevos animales y plantas: caballo, vaca, trigo, caña de azúcar."],
      ["Impacto en Europa: riquezas", "Oro y plata; España se vuelve potencia; suben los precios."],
      ["Impacto en Europa: productos", "Papa, maíz, tomate, cacao, tabaco, ají, porotos."],
      ["Impacto en Europa: conocimiento", "Nuevo continente, vuelta al mundo (Magallanes-Elcano 1519–1522), nuevos mapas, comercio mundial."],
      ["Bartolomé de las Casas", "Fraile que denunció los abusos y defendió los derechos de los indígenas."],
      ["Conquista de Chile", "Almagro llega en 1536; Valdivia funda Santiago en 1541."]
    ]
  }
  ],

  /* Plan de repaso hasta la prueba (se calcula con la fecha real en la app) */
  plan: [
    { day: 0, label: "Salto 1 · Europa", camps: ["c1"], extra: "Bitácora + 3 saltos" },
    { day: 1, label: "Salto 2 · América", camps: ["c2"], extra: "Tarjetas de la selva 1" },
    { day: 2, label: "Salto 3 · El Caribe", camps: ["c3"], extra: "Repaso de errores" },
    { day: 3, label: "Salto 4 · México y Perú", camps: ["c4"], extra: "Tarjetas de fechas" },
    { day: 4, label: "Salto 5 · Ciudad Aya", camps: ["c5"], extra: "Último salto a casa" }
  ]
};
