/* Misión Aya · Taller de fuentes históricas
   Fuentes reales tomadas del material de clase (Unidad 3) y de documentos de la época.
   Cada fuente se analiza con la guía del colegio: formato, origen, propósito,
   información relevante, y luego postura + respaldo + evidencia. */

window.FUENTES = [
{
  id: "f1", camp: "c1", titulo: "Venecia, la ciudad que vivía del comercio",
  ficha: "Miniatura europea del «Libro de las maravillas», hacia el año 1400",
  img: "assets/fuentes/venecia.jpg", guia: "ovaya",
  intro: "¡Mira lo que encontré en el baúl! Un dibujo antiquísimo de una ciudad llena de canales y barcos. ¿Qué nos dirá sobre por qué Europa quería llegar a Asia?",
  formato: { a: 1, why: "Es una imagen pintada a mano. Las fuentes visuales son dibujos, pinturas, fotografías y mapas." },
  origen: { a: 0, why: "La pintaron alrededor del año 1400, dentro de la misma época que estamos estudiando y por alguien que vivía entonces. Por eso es primaria." },
  proposito: { a: 0, why: "Es la ilustración de un libro de viajes: servía para mostrar cómo era Venecia y su comercio. Quiere informar, no convencerte de algo." },
  relevante: {
    pregunta: "¿Qué nos muestra esta imagen sobre el comercio europeo antes de 1492?",
    modelo: "Muestra que Venecia era una ciudad llena de barcos, mercaderes y mercancías. El comercio se hacía por mar y por los canales, y las ciudades que comerciaban se veían ricas, con palacios y puentes.",
    rubrica: ["Mencioné los barcos o el mar", "Mencioné el comercio o a los mercaderes", "Dije que la ciudad se veía rica o grande"]
  },
  argumento: {
    frase: "«El comercio con Asia no era importante para Europa en el siglo XV».",
    a: 1, why: "Era importantísimo. Justamente por eso, cuando las rutas se cortaron, Europa salió a buscar otro camino por el océano.",
    respaldoModelo: "No estoy de acuerdo, porque el comercio movía ciudades enteras como Venecia. De ahí llegaban las especias y la seda, y era tan importante que cuando se cortaron las rutas Europa buscó un camino nuevo por el mar.",
    rubrica: ["Dije si estaba de acuerdo o en desacuerdo", "Expliqué por qué, con una razón", "Usé algo que se ve en la fuente"],
    evidencias: [
      { t: "En la imagen se ven barcos cargados llegando a la ciudad y gente comerciando.", ok: true, why: "¡Exacto! La evidencia se ve en la fuente misma. Eso es lo que la convierte en evidencia y no en opinión." },
      { t: "Porque el comercio siempre ha sido importante en todas partes.", ok: false, why: "Eso es una idea general tuya. La evidencia tiene que salir de la fuente que estás analizando." },
      { t: "Porque Colón llegó a América en 1492.", ok: false, why: "Es un dato verdadero, pero no aparece en esta fuente ni demuestra lo del comercio." }
    ]
  },
  dato: "Venecia se hizo tan rica con el comercio que llegó a tener su propio imperio marítimo. Marco Polo, el viajero que llegó hasta China, era veneciano."
},
{
  id: "f2", camp: "c1", titulo: "El mapa de la Ruta de la Seda",
  ficha: "Mapa de un libro de Historia actual",
  img: "assets/fuentes/ruta-seda.jpg", guia: "chupaya",
  intro: "¡Con este mapa sí que me perdería! Mira todos esos caminos entre Europa y China. Ayúdame a entender qué nos está contando.",
  formato: { a: 1, why: "Un mapa es una fuente visual: entrega su información a través de una imagen." },
  origen: { a: 1, why: "Este mapa lo dibujó alguien hoy, con lo que sabemos ahora. Nadie del siglo XV lo hizo. Por eso es secundaria." },
  proposito: { a: 0, why: "Es material de estudio: existe para explicarte por dónde pasaban las rutas. Su propósito es informar." },
  relevante: {
    pregunta: "¿Qué nos dice el mapa sobre las rutas entre Europa y Asia?",
    modelo: "Muestra que las rutas eran larguísimas y unían Europa con China y la India, pasando por muchos lugares como Persia y Arabia. Había caminos por tierra y también rutas por mar.",
    rubrica: ["Dije que las rutas eran largas", "Nombré Europa y Asia, China o India", "Mencioné que había rutas por tierra y por mar"]
  },
  argumento: {
    frase: "«A Europa le daba lo mismo perder la Ruta de la Seda».",
    a: 1, why: "Perderla fue un golpe enorme: era el camino de las especias, la seda y muchos productos. Por eso empezaron a buscar rutas nuevas.",
    respaldoModelo: "No estoy de acuerdo. El mapa muestra que esas rutas eran el único camino conocido hacia China y la India. Si se cortaban, Europa se quedaba sin los productos de Asia y tenía que buscar otro camino.",
    rubrica: ["Dije si estaba de acuerdo o en desacuerdo", "Expliqué por qué, con una razón", "Usé algo que se ve en el mapa"],
    evidencias: [
      { t: "El mapa muestra que esas rutas eran el camino conocido para llegar a China y la India.", ok: true, why: "Muy bien: sacaste la evidencia directamente del mapa." },
      { t: "Porque la seda es muy bonita y cara.", ok: false, why: "Es una opinión. La evidencia tiene que estar en la fuente." },
      { t: "Porque los europeos eran muy valientes.", ok: false, why: "Eso es un juicio sobre las personas, no un dato que entregue el mapa." }
    ]
  },
  dato: "La Ruta de la Seda no era un solo camino, sino una red de rutas que funcionó por más de mil quinientos años."
},
{
  id: "f3", camp: "c1", titulo: "El astrolabio",
  ficha: "Texto de una página de un libro de Historia actual",
  img: "assets/fuentes/astrolabio.jpg", guia: "estaya",
  texto: "Astrolabio: antiguo instrumento que permitía calcular la latitud de un lugar, y por tanto, la ubicación de las embarcaciones. Introducido hacia el siglo XII por los árabes en Europa occidental, donde se perfecciona.",
  intro: "♪ Astrolabio, astrolabio, dime dónde estoy ♪ … Perdón, me distraje. Léelo con atención: dice más cosas de las que parece.",
  formato: { a: 0, why: "Lo que estás analizando es el texto que explica qué era el astrolabio. La foto solo acompaña: la información viene de las palabras, así que es una fuente escrita." },
  origen: { a: 1, why: "Lo escribió alguien de hoy para explicarte algo del pasado. Nadie del siglo XV redactó esta definición." },
  proposito: { a: 0, why: "Es una definición de libro de estudio: está para informar." },
  relevante: {
    pregunta: "¿Qué información entrega sobre los avances tecnológicos de los viajes?",
    modelo: "Dice que el astrolabio servía para calcular la latitud y así saber dónde estaban los barcos. Llegó a Europa gracias a los árabes en el siglo XII y ahí se fue perfeccionando.",
    rubrica: ["Dije para qué servía: ubicación o latitud", "Mencioné que lo introdujeron los árabes", "Lo relacioné con poder navegar por el océano"]
  },
  argumento: {
    frase: "«Los europeos inventaron solos toda la tecnología para navegar».",
    a: 1, why: "La tecnología viajaba entre culturas. El astrolabio llegó por los árabes y la brújula venía de China. Europa las perfeccionó, pero no las inventó sola.",
    respaldoModelo: "No estoy de acuerdo, porque la fuente dice que el astrolabio lo introdujeron los árabes en Europa en el siglo XII. Los europeos lo perfeccionaron, pero la idea vino de otra cultura.",
    rubrica: ["Dije si estaba de acuerdo o en desacuerdo", "Expliqué por qué, con una razón", "Usé algo que dice el texto"],
    evidencias: [
      { t: "La fuente dice que el astrolabio fue introducido por los árabes en Europa occidental.", ok: true, why: "Perfecto: está escrito con todas sus letras en la fuente." },
      { t: "La brújula venía de China.", ok: false, why: "Es verdad y lo estudiaste, pero no aparece en esta fuente. La evidencia tiene que salir de la fuente que estás analizando." },
      { t: "Porque los europeos no eran tan inteligentes.", ok: false, why: "Eso no es una evidencia, es un juicio, y además no es cierto." }
    ]
  },
  dato: "El astrolabio se usó durante más de mil años. Hoy los barcos usan GPS, pero hacen lo mismo: responder «¿dónde estoy?»."
},
{
  id: "f4", camp: "c1", titulo: "El mapa de los cuatro viajes de Colón",
  ficha: "Mapa de un libro de Historia actual",
  img: "assets/fuentes/viajes-colon.jpg", guia: "ovaya",
  intro: "¡Cuatro caminos de colores distintos! Cada uno es un viaje de Colón. Mira bien la simbología antes de responder, que ahí está todo.",
  formato: { a: 1, why: "Es un mapa, es decir, una fuente visual." },
  origen: { a: 1, why: "Es un mapa hecho hoy para estudiar los viajes. Los mapas que dibujaron en el siglo XV eran muy distintos y no se parecían a este." },
  proposito: { a: 0, why: "Está en un libro de estudio para que entiendas por dónde navegó Colón: su propósito es informar." },
  relevante: {
    pregunta: "¿Qué nos dice el mapa sobre los viajes de Colón?",
    modelo: "Que Colón hizo cuatro viajes entre 1492 y 1502, todos saliendo desde España y pasando por las islas Canarias para cruzar el océano Atlántico hacia el mar Caribe. Llegó a islas como La Española, Puerto Rico y Trinidad.",
    rubrica: ["Dije que fueron cuatro viajes", "Mencioné que cruzó el océano Atlántico", "Nombré una isla o zona a la que llegó"]
  },
  argumento: {
    frase: "«Colón llegó al territorio que hoy es Estados Unidos».",
    a: 1, why: "Nunca llegó. Sus cuatro viajes se quedaron en el mar Caribe, las Antillas y la costa de Centroamérica y Sudamérica.",
    respaldoModelo: "No estoy de acuerdo. En el mapa todas las rutas terminan en el mar Caribe y las Antillas, y ninguna sube hacia el norte del continente.",
    rubrica: ["Dije si estaba de acuerdo o en desacuerdo", "Expliqué por qué, con una razón", "Usé algo que se ve en el mapa"],
    evidencias: [
      { t: "En el mapa, las cuatro rutas terminan en el mar Caribe y las Antillas, no más al norte.", ok: true, why: "Así se usa un mapa como evidencia: mirando hasta dónde llegan las líneas." },
      { t: "Porque Estados Unidos no existía todavía.", ok: false, why: "Es cierto que el país no existía, pero la pregunta es si llegó a ese territorio. Eso se responde mirando el mapa." },
      { t: "Porque Colón era italiano.", ok: false, why: "Es un dato sobre él, pero no dice nada sobre dónde llegó." }
    ]
  },
  dato: "Ojo de detective: la simbología de este mapa dice «Primer viaje (1942)». ¡Es un error de imprenta, fue en 1492! Hasta los libros se equivocan: por eso conviene revisar siempre más de una fuente."
},
{
  id: "f5", camp: "c2", titulo: "El diario de Colón",
  ficha: "Diario de a bordo de Cristóbal Colón, 12 de octubre de 1492",
  texto: "«Luego que amaneció, vinieron a la playa muchos de estos hombres… Ellos andan todos desnudos como su madre los parió… Ellos deben ser buenos servidores y de buen ingenio, que veo que muy presto dicen todo lo que les decía, y creo que ligeramente se harían cristianos, que me pareció que ninguna secta tenían.»",
  guia: "ovaya",
  intro: "Esto lo escribió Colón el mismísimo día en que llegó a América. Léelo despacio: cuenta mucho más de lo que parece a primera vista.",
  formato: { a: 0, why: "Es un texto escrito por una persona. Las fuentes escritas son diarios, cartas, crónicas y documentos." },
  origen: { a: 0, why: "La escribió Colón el mismo día de los hechos y él estaba ahí. Es el ejemplo más claro de fuente primaria." },
  proposito: { a: 0, why: "Colón llevaba este diario para contarles después a los reyes de España todo lo que iba encontrando. Su propósito es informar." },
  relevante: {
    pregunta: "¿Qué nos dice esta fuente sobre cómo veía Colón a las personas que encontró?",
    modelo: "Colón describe cómo se veían los habitantes de la isla y dice que serían buenos servidores y que se harían cristianos con facilidad. Es decir, desde el primer día pensó en usarlos como trabajadores y en convertirlos a su religión.",
    rubrica: ["Mencioné que los describe por fuera, cómo se veían", "Dije que los ve como servidores o trabajadores", "Mencioné la religión o el cristianismo"]
  },
  argumento: {
    frase: "«Colón vio a los habitantes de América como personas iguales a él».",
    a: 1, why: "Desde la primera página los describe como futuros servidores y futuros cristianos, no como iguales. Esa mirada explica mucho de lo que vino después.",
    respaldoModelo: "No estoy de acuerdo. En su propio diario dice que «deben ser buenos servidores» y que se harían cristianos fácilmente. Los está viendo como personas para trabajar y convertir, no como iguales.",
    rubrica: ["Dije si estaba de acuerdo o en desacuerdo", "Expliqué por qué, con una razón", "Cité o mencioné algo que dice el texto"],
    evidencias: [
      { t: "Escribe que «deben ser buenos servidores», no compañeros ni iguales.", ok: true, why: "Excelente: citaste la fuente. Citar las palabras exactas es la evidencia más fuerte que existe." },
      { t: "Porque Colón era una persona mala.", ok: false, why: "Eso es un juicio sobre él. Un historiador argumenta con lo que dice la fuente, no con lo que opina de la persona." },
      { t: "Porque llegó en tres carabelas.", ok: false, why: "Es un dato del viaje, pero no dice nada sobre cómo veía a las personas." }
    ]
  },
  dato: "Colón murió en 1506 convencido de haber llegado a Asia. Nunca supo que había llegado a un continente que los europeos no conocían."
},
{
  id: "f6", camp: "c3", titulo: "Por qué vine, según un soldado",
  ficha: "Bernal Díaz del Castillo, soldado de Hernán Cortés. Siglo XVI",
  texto: "«Vine a servir a Dios y a Su Majestad, a dar luz a los que estaban en tinieblas, y a hacerme rico, como todos los hombres desean.»",
  guia: "chupaya",
  intro: "Un soldado de Cortés explicando por qué se subió a ese barco. Una sola frase, y adentro están todas sus razones. ¿Las encuentras?",
  formato: { a: 0, why: "Es un texto escrito por él mismo: una fuente escrita." },
  origen: { a: 0, why: "Bernal Díaz fue soldado de Cortés: participó en la Conquista de México y lo escribió él. Fuente primaria." },
  proposito: { a: 2, why: "No está informando de un hecho ni tratando de convencerte: está explicando lo que él pensaba y quería. Cuando alguien cuenta sus propias razones, el propósito es dar su opinión." },
  relevante: {
    pregunta: "¿Qué motivaciones aparecen en esta frase?",
    modelo: "Aparecen tres: servir a Dios, o sea la religión; servir a Su Majestad, es decir al rey; y hacerse rico, las riquezas. Son las mismas tres que resumimos como Dios, oro y gloria.",
    rubrica: ["Nombré la religión o a Dios", "Nombré al rey o a Su Majestad", "Nombré la riqueza o el oro"]
  },
  argumento: {
    frase: "«Los conquistadores venían solo por el oro».",
    a: 1, why: "La multicausalidad también sirve para las personas: casi nunca alguien hace algo por un solo motivo.",
    respaldoModelo: "No estoy de acuerdo. El propio soldado nombra tres razones en una sola frase: servir a Dios, servir al rey y hacerse rico. El oro era una de ellas, pero no la única.",
    rubrica: ["Dije si estaba de acuerdo o en desacuerdo", "Expliqué por qué, con una razón", "Usé lo que dice la frase de la fuente"],
    evidencias: [
      { t: "La frase nombra tres razones distintas: Dios, Su Majestad y hacerse rico.", ok: true, why: "Muy bien: contaste lo que la fuente dice, y eso basta para sostener tu postura." },
      { t: "Porque el oro no alcanzaba para todos.", ok: false, why: "Puede ser cierto, pero no aparece en la fuente ni responde a la frase." },
      { t: "Porque los conquistadores eran muy religiosos.", ok: false, why: "Se acerca, pero es una afirmación tuya. La evidencia es la frase misma, que nombra las tres razones." }
    ]
  },
  dato: "«Dar luz a los que estaban en tinieblas» significaba evangelizar. Para ellos, quien no era cristiano vivía en la oscuridad. Con esa idea justificaban la Conquista."
},
{
  id: "f7", camp: "c4", titulo: "Los que vieron llegar la enfermedad",
  ficha: "Relato de habitantes de Tenochtitlan que vivieron la Conquista, recogido en el siglo XVI",
  texto: "«Se difundió la epidemia: enfermedad de granos. Muchas personas murieron de ella. Ya no podían andar, no más estaban acostadas, tendidas en su cama. No podían moverse, ni podían volver el cuello. Y si acaso se movían, daban de gritos.»",
  guia: "estaya",
  intro: "Esta la contaron quienes estaban adentro de Tenochtitlan cuando todo pasó. Es dura, pero es la otra mitad de la historia y hay que escucharla.",
  formato: { a: 0, why: "Es un relato en palabras, recogido por escrito: fuente escrita." },
  origen: { a: 0, why: "Quienes lo cuentan vivieron la epidemia en Tenochtitlan. Aunque se escribió años después, las voces son de participantes de los hechos, así que se considera primaria." },
  proposito: { a: 1, why: "No busca convencerte de nada ni dar una opinión: está transmitiendo lo que vivieron. Si elegiste «informar» estabas muy cerca, porque las dos se parecen; «comunicar» calza mejor cuando alguien cuenta su propia experiencia." },
  relevante: {
    pregunta: "¿Qué nos dice sobre el impacto de las enfermedades en la Conquista?",
    modelo: "Muestra que la viruela mató a muchísima gente en Tenochtitlan y dejó a los enfermos sin poder levantarse ni moverse. Eso dejó a la ciudad muy debilitada antes del ataque final de los españoles.",
    rubrica: ["Mencioné la enfermedad o la viruela", "Dije que murió mucha gente", "Lo relacioné con que la ciudad quedó débil frente a los españoles"]
  },
  argumento: {
    frase: "«Los españoles ganaron la guerra solo por su fuerza militar».",
    a: 1, why: "Las armas y los caballos ayudaron, pero sin la epidemia y sin las alianzas con pueblos enemigos de los aztecas, un grupo tan pequeño no habría podido.",
    respaldoModelo: "No estoy de acuerdo. La fuente cuenta que la epidemia dejó a la gente tendida en cama, sin poder moverse. Una ciudad así de debilitada no podía defenderse, y eso no lo lograron las armas españolas.",
    rubrica: ["Dije si estaba de acuerdo o en desacuerdo", "Expliqué por qué, con una razón", "Usé algo que cuenta el relato"],
    evidencias: [
      { t: "El relato dice que los enfermos «no podían andar» y estaban tendidos en cama.", ok: true, why: "Muy bien: la cita muestra el efecto de la enfermedad, que es justo lo que querías demostrar." },
      { t: "Porque los españoles tenían caballos y armas de fuego.", ok: false, why: "Eso es verdad, pero apoya la frase en vez de contradecirla. Busca lo que aporta esta fuente." },
      { t: "Porque Tenochtitlan era una ciudad muy grande.", ok: false, why: "Es un dato cierto, pero no explica por qué cayó." }
    ]
  },
  dato: "Se calcula que las enfermedades traídas desde Europa mataron a la mayor parte de la población indígena de América. Nadie tenía defensas, porque esas enfermedades nunca habían llegado al continente."
},
{
  id: "f8", camp: "c5", titulo: "La denuncia de un fraile",
  ficha: "Fray Bartolomé de las Casas, «Brevísima relación de la destrucción de las Indias», 1552",
  texto: "«En estas ovejas mansas… entraron los españoles como lobos y tigres y leones crudelísimos de muchos días hambrientos. Y otra cosa no han hecho de cuarenta años a esta parte… sino despedazarlas, matarlas, angustiarlas, afligirlas, atormentarlas y destruirlas.»",
  guia: "ovaya",
  intro: "Fíjate en las palabras que eligió: ovejas, lobos, tigres. Nadie escribe así por casualidad. ¿Para qué crees que lo hizo?",
  formato: { a: 0, why: "Es un libro escrito por una persona: fuente escrita." },
  origen: { a: 0, why: "Las Casas vivió en América y vio con sus propios ojos lo que denuncia. Es primaria, aunque tenga una postura muy marcada." },
  proposito: { a: 3, why: "Escribió este libro para el rey de España, para convencerlo de cambiar las leyes y proteger a los pueblos indígenas. Por eso usa palabras tan fuertes como «lobos» y «tigres»: una fuente primaria no siempre es neutral." },
  relevante: {
    pregunta: "¿Qué denuncia esta fuente?",
    modelo: "Denuncia que los españoles trataron con enorme violencia a los pueblos indígenas durante cuarenta años: los mataron, los atormentaron y destruyeron sus comunidades.",
    rubrica: ["Mencioné la violencia o los abusos", "Dije quiénes los cometían: los españoles", "Mencioné a los pueblos indígenas como víctimas"]
  },
  argumento: {
    frase: "«En esa época todos los europeos estaban de acuerdo con el trato que recibían los pueblos indígenas».",
    a: 1, why: "Ya en esa misma época había voces que lo denunciaban. Las Casas es la prueba: era español y escribió un libro entero en contra.",
    respaldoModelo: "No estoy de acuerdo. Bartolomé de las Casas era español y fraile, y escribió un libro entero denunciando lo que hacían sus propios compatriotas. Si todos hubieran estado de acuerdo, ese libro no existiría.",
    rubrica: ["Dije si estaba de acuerdo o en desacuerdo", "Expliqué por qué, con una razón", "Usé la fuente misma como prueba"],
    evidencias: [
      { t: "La fuente existe: un español de esa época escribió un libro completo denunciando los abusos.", ok: true, why: "Brillante: a veces la mejor evidencia es la existencia misma de la fuente." },
      { t: "Porque hoy sabemos que eso estuvo mal.", ok: false, why: "Cuidado con mirar el pasado solo con ojos de hoy. Lo potente es mostrar que en esa misma época ya había quien lo denunciaba." },
      { t: "Porque los pueblos indígenas se defendieron.", ok: false, why: "Es cierto que hubo resistencia, pero eso no dice nada sobre lo que pensaban los europeos." }
    ]
  },
  dato: "En parte gracias a Las Casas, la corona española dictó en 1542 las Leyes Nuevas para limitar la encomienda. No se cumplieron del todo, pero fueron un primer intento."
}
];
