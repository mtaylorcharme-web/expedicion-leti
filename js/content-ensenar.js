/* Misión Aya · Enséñale a Chupaya
   Aprender enseñando: Chupaya olvidó todo y hay que explicárselo.
   Cada lección tiene cuatro momentos: armar la explicación, responder su repregunta,
   corregir lo que entendió mal, y escribirlo con palabras propias. */

window.LECCIONES = [
{
  id: "l1", camp: "c1", titulo: "Por qué los europeos salieron a navegar",
  pregunta: "Leí toda la bitácora y se me borró de la cabeza. ¿Por qué los europeos se subieron a esos barcos? ¿Qué andaban buscando?",
  armar: {
    instruccion: "Elige las ideas que SÍ explican por qué salieron a navegar. Cuidado: hay tres que no sirven.",
    bloques: [
      { t: "Europa comerciaba con Asia por rutas larguísimas, como la Ruta de la Seda.", ok: true },
      { t: "En el siglo XV esas rutas se cortaron por el avance del Islam, así que hubo que buscar otro camino.", ok: true },
      { t: "Los europeos querían conocer a los aztecas y a los incas.", ok: false, why: "No sabían que existían. Nadie salió a buscar a los aztecas: se los encontraron sin querer." },
      { t: "Además, las ciudades crecían y apareció la burguesía, que tenía dinero para financiar los viajes.", ok: true },
      { t: "Colón quería demostrar que la Tierra era redonda.", ok: false, why: "Ese es un mito muy repetido. La gente educada de la época ya sabía que la Tierra era redonda. Lo que Colón discutía era su tamaño, no su forma." },
      { t: "Y ya existía la tecnología para hacerlo: la brújula, el astrolabio y sobre todo la carabela.", ok: true },
      { t: "Se les acabó el oro en Europa y por eso salieron a buscar más.", ok: false, why: "El oro sí era una motivación, pero lo que gatilló los viajes fue que las rutas hacia Asia se cortaron, no que se acabara el oro europeo." }
    ]
  },
  repregunta: { q: "Oye, ¿y por qué no siguieron yendo por tierra como siempre?", opts: ["Porque el camino por tierra hacia Asia quedó bloqueado por el avance del Islam", "Porque los caballos se cansaban mucho en viajes largos", "Porque el mar era más entretenido que el desierto"], a: 0, why: "Exacto. Cuando se corta un camino, hay que buscar otro. Por eso apostaron por el océano, que hasta entonces daba miedo." },
  confusion: { dice: "¡Ya entendí! Entonces salieron a navegar solo porque querían oro, ¿cierto?", opts: ["No. Hubo varias causas a la vez: las rutas cortadas, el dinero de la burguesía y la nueva tecnología", "Sí, exactamente, era solo por el oro", "No, fue solo porque inventaron la carabela"], a: 0, why: "Eso es la multicausalidad, y acabas de usarla de verdad: ningún hecho histórico se explica por una sola causa." },
  escribir: {
    pregunta: "Ahora escríbeselo todo junto, con tus palabras, como se lo explicarías a alguien que no sabe nada del tema.",
    modelo: "Los europeos salieron a navegar por varias causas a la vez. Primero, comerciaban mucho con Asia y en el siglo XV sus rutas se cortaron por el avance del Islam, así que tuvieron que buscar otro camino. Segundo, las ciudades crecían y apareció la burguesía, que tenía dinero y financió los viajes para ampliar sus negocios. Y tercero, ya existía la tecnología para cruzar el océano: la brújula, el astrolabio y la carabela.",
    rubrica: ["Mencioné que las rutas comerciales se cortaron", "Mencioné a la burguesía o el dinero para financiar", "Mencioné la tecnología: brújula, astrolabio o carabela", "Dije que fueron varias causas, no una sola"]
  },
  final: "¡Ahora sí! Rutas cortadas, burguesía con plata y carabelas. Tres causas, no una. Ya no se me olvida."
},
{
  id: "l2", camp: "c2", titulo: "Quiénes vivían en América antes de 1492",
  pregunta: "Una duda que me da vueltas: antes de que llegaran los europeos, ¿América estaba vacía? ¿Quién vivía acá?",
  armar: {
    instruccion: "Elige las ideas que SÍ explican quiénes vivían en América. Hay tres que están equivocadas.",
    bloques: [
      { t: "Antes de 1492 América ya estaba llena de gente, con ciudades enormes y culturas muy desarrolladas.", ok: true },
      { t: "Los mayas vivían en Yucatán y Centroamérica, en ciudades-estado separadas, y tenían escritura, calendario y el número cero.", ok: true },
      { t: "Vivían en pequeños grupos que se movían todo el tiempo y no construían nada.", ok: false, why: "Al contrario: Tenochtitlan tenía unos doscientos mil habitantes, más que cualquier ciudad de España en esa época." },
      { t: "Los aztecas estaban en el centro de México, con su capital Tenochtitlan sobre un lago, y dominaban a otros pueblos cobrándoles tributo.", ok: true },
      { t: "Todos hablaban el mismo idioma y formaban un solo gran imperio.", ok: false, why: "Eran pueblos distintos con idiomas propios: los aztecas hablaban náhuatl y los incas quechua." },
      { t: "Los incas vivían en los Andes, en el imperio Tahuantinsuyo con capital en Cuzco, unido por miles de kilómetros de caminos.", ok: true },
      { t: "Usaban caballos para recorrer las montañas y los desiertos.", ok: false, why: "En América no había caballos. Los trajeron los europeos, y esa fue justamente una de sus grandes ventajas militares." }
    ]
  },
  repregunta: { q: "¿Y por qué los aztecas tenían tantos enemigos si eran tan poderosos?", opts: ["Porque dominaban a otros pueblos y les cobraban tributo, y esos pueblos querían liberarse", "Porque eran muy pocos y débiles", "Porque no tenían ejército ni armas"], a: 0, why: "Por eso Cortés pudo aliarse con los totonacas y los tlaxcaltecas. Ese detalle explica media conquista de México." },
  confusion: { dice: "Ah, o sea que mayas, aztecas e incas eran lo mismo pero con nombres distintos, ¿no?", opts: ["No. Vivían en lugares distintos y se organizaban de manera distinta", "Sí, eran exactamente lo mismo", "No, pero los tres vivían en la cordillera de los Andes"], a: 0, why: "Mayas en Yucatán con ciudades-estado, aztecas en México con un imperio y tributos, incas en los Andes con el Tahuantinsuyo. Comparten cosas, pero no son lo mismo." },
  escribir: {
    pregunta: "Explícale a Chupaya en qué se parecían y en qué se diferenciaban las tres civilizaciones.",
    modelo: "Se parecían en que cultivaban maíz, tenían muchos dioses, construyeron templos y pirámides y sabían mucho de astronomía. Se diferenciaban en el lugar y en la organización: los mayas vivían en ciudades-estado separadas en Yucatán, los aztecas formaron un imperio en el centro de México con capital en Tenochtitlan, y los incas el Tahuantinsuyo en los Andes con capital en Cuzco.",
    rubrica: ["Nombré algo en común, como el maíz, los dioses o las pirámides", "Dije dónde vivía cada una de las tres", "Expliqué una diferencia en cómo se organizaban"]
  },
  final: "Mayas en Yucatán, aztecas en el lago, incas en los Andes. ¡Y ninguno tenía caballos! Anotado."
},
{
  id: "l3", camp: "c3", titulo: "Cómo un grupo tan chico conquistó imperios tan grandes",
  pregunta: "Hay algo que no me cuadra. Los españoles eran poquitos y los imperios eran gigantes. ¿Cómo ganaron?",
  armar: {
    instruccion: "Elige las ideas que SÍ explican cómo lo lograron. Tres están equivocadas.",
    bloques: [
      { t: "La Conquista funcionaba como una empresa privada: el capitán y sus socios ponían el dinero, y el rey daba el permiso con una capitulación.", ok: true },
      { t: "Los españoles eran muchísimos más que los pueblos indígenas.", ok: false, why: "Al revés: eran poquísimos. Cortés llegó con unos cientos de hombres frente a un imperio de millones de personas." },
      { t: "Tenían caballos, armas de acero y de pólvora, que los pueblos americanos no conocían.", ok: true },
      { t: "Se aliaron con pueblos enemigos de los aztecas, y en Perú aprovecharon la guerra civil entre Huáscar y Atahualpa.", ok: true },
      { t: "Los pueblos indígenas no pelearon: se rindieron de inmediato.", ok: false, why: "Pelearon, y a veces ganaron. A los españoles los expulsaron de Tenochtitlan en 1520, y la resistencia inca duró hasta 1535." },
      { t: "Las enfermedades como la viruela mataron a gran parte de la población indígena, que no tenía defensas.", ok: true },
      { t: "El rey de España pagó todos los viajes con su propio dinero.", ok: false, why: "El rey daba el permiso, no el dinero. Por eso era una empresa: los socios invertían esperando ganar." }
    ]
  },
  repregunta: { q: "¿Y qué ganaba el rey si no ponía nada de plata?", opts: ["El quinto real, o sea la quinta parte de las riquezas, más los territorios y nuevos súbditos cristianos", "Nada, lo hacía por amistad con los conquistadores", "Se quedaba con la mitad de los caballos"], a: 0, why: "Buen negocio para él: sin arriesgar su dinero se quedaba con un quinto de todo, con las tierras y con más gente convertida a su religión." },
  confusion: { dice: "Entonces los españoles ganaron porque eran más fuertes y más valientes que los indígenas, ¿cierto?", opts: ["No. Ganaron por la tecnología, las alianzas, las divisiones internas y sobre todo las enfermedades", "Sí, eran más fuertes y valientes", "No, ganaron únicamente por las enfermedades"], a: 0, why: "Ojo con esa idea, porque es peligrosa y además es falsa. No se trata de quién era más valiente. Otra vez es multicausalidad, y la causa que más muertes provocó ni siquiera fue militar." },
  escribir: {
    pregunta: "Explícale a Chupaya por qué se dice que la Conquista fue una empresa.",
    modelo: "Porque funcionaba como un negocio. Un capitán y sus socios invertían su dinero, sus armas y sus caballos en la expedición, esperando ganar riquezas, tierras y títulos. El rey solo daba el permiso mediante una capitulación, y a cambio recibía el quinto real y la extensión de la religión católica.",
    rubrica: ["Dije que quienes invertían eran privados, no el rey", "Mencioné qué esperaban ganar: riquezas, tierras o títulos", "Nombré la capitulación o el quinto real"]
  },
  final: "Ya lo tengo: no era un ejército, era un negocio. Y ganaron por las alianzas y la viruela, no por valientes."
},
{
  id: "l4", camp: "c4", titulo: "Cómo cayó Tenochtitlan",
  pregunta: "Me perdí entre tantas fechas. ¿Qué pasó exactamente en Tenochtitlan? ¿Cortés llegó y ganó al tiro?",
  armar: {
    instruccion: "Elige las ideas que SÍ cuentan lo que pasó, en el orden correcto. Tres están equivocadas.",
    bloques: [
      { t: "Cortés zarpó desde Cuba en 1519 y se alió con los totonacas, que estaban cansados de pagar tributo a los aztecas.", ok: true },
      { t: "Moctezuma lo recibió en paz en Tenochtitlan en noviembre de 1519, pero después Cortés lo capturó y lo mandó a matar.", ok: true },
      { t: "Tenochtitlan cayó en el primer ataque, apenas llegaron los españoles en 1519.", ok: false, why: "Cayó en agosto de 1521, después de dos años y de un sitio largo. Nada fue rápido." },
      { t: "Los aztecas se rebelaron y expulsaron a los españoles de la ciudad.", ok: true },
      { t: "Los aztecas nunca pelearon contra los españoles.", ok: false, why: "Pelearon y hasta ganaron una vez: expulsaron a los españoles de Tenochtitlan en 1520." },
      { t: "Después llegó la viruela y arrasó con la población, y en 1521 los españoles volvieron, sitiaron la ciudad y la tomaron.", ok: true },
      { t: "Quien dirigió la conquista de México fue Francisco Pizarro.", ok: false, why: "Pizarro conquistó Perú y se enfrentó a Atahualpa. En México fue Hernán Cortés, frente a Moctezuma." }
    ]
  },
  repregunta: { q: "¿Y por qué los totonacas ayudaron a unos desconocidos que venían del mar?", opts: ["Porque los aztecas los dominaban y les cobraban tributo, y querían liberarse", "Porque les gustaron mucho los caballos", "Porque hablaban el mismo idioma que los españoles"], a: 0, why: "Para muchos pueblos, Cortés parecía la oportunidad de sacarse de encima a los aztecas. No imaginaban lo que venía después." },
  confusion: { dice: "Ya po, entonces Cortés llegó, atacó y ganó altiro, ¿no?", opts: ["No. Duró dos años: primero lo recibieron en paz y en 1520 hasta lo expulsaron de la ciudad", "Sí, fue rapidísimo, en unos días", "No, la conquista de México duró diez años"], a: 0, why: "Entre febrero de 1519 y agosto de 1521. Y en el medio los españoles perdieron una batalla grande y tuvieron que huir de la ciudad." },
  escribir: {
    pregunta: "Cuéntale a Chupaya la caída de Tenochtitlan en orden, con tus palabras.",
    modelo: "Cortés zarpó de Cuba en febrero de 1519 y en julio se alió con los totonacas. En noviembre llegó a Tenochtitlan y Moctezuma lo recibió en paz. En junio de 1520 Cortés lo capturó y lo mandó matar, y los aztecas se rebelaron y expulsaron a los españoles. Después la viruela arrasó la ciudad, y en mayo de 1521 los españoles volvieron a sitiarla hasta que cayó en agosto de 1521.",
    rubrica: ["Empecé por la llegada de Cortés en 1519", "Conté la muerte de Moctezuma y la expulsión de los españoles", "Mencioné la viruela o la epidemia", "Terminé con el sitio y la caída en 1521"]
  },
  final: "1519 llega, 1520 lo echan, 1521 cae. Dos años, no dos días. ¡Gracias, ahora no me pierdo en el tiempo!"
},
{
  id: "l5", camp: "c5", titulo: "Qué cambió en el mundo después de la Conquista",
  pregunta: "Última duda y te dejo tranquila: después de todo esto, ¿qué cambió? ¿Todo siguió igual que antes?",
  armar: {
    instruccion: "Elige las ideas que SÍ explican lo que cambió. Hay tres equivocadas.",
    bloques: [
      { t: "En América murió muchísima gente por las enfermedades, las guerras y el trabajo forzado de la encomienda.", ok: true },
      { t: "Cayeron los imperios azteca e inca, y se impusieron el idioma español y la religión católica.", ok: true },
      { t: "América quedó exactamente igual que antes de 1492.", ok: false, why: "Cambió todo: la población, el idioma, la religión, los animales, las plantas y hasta el paisaje." },
      { t: "Nació el mestizaje y se fundaron ciudades nuevas como Lima y Santiago.", ok: true },
      { t: "Los europeos llevaron la papa y el maíz a América.", ok: false, why: "Al revés. La papa y el maíz son americanos y de aquí viajaron a Europa. Lo que trajeron fue el trigo, la caña de azúcar, la vaca y el caballo." },
      { t: "A Europa llegaron el oro y la plata, y alimentos nuevos como la papa, el maíz, el tomate y el cacao.", ok: true },
      { t: "Nadie en Europa criticó nunca lo que estaba pasando en América.", ok: false, why: "Bartolomé de las Casas escribió un libro entero denunciándolo en 1552, y gracias en parte a él se dictaron las Leyes Nuevas." }
    ]
  },
  repregunta: { q: "¿Y cuál fue la consecuencia más grave para los pueblos de América?", opts: ["La caída enorme de la población, sobre todo por enfermedades como la viruela", "Tener que aprender a montar a caballo", "Que cambió un poco su comida"], a: 0, why: "Murió la mayor parte de la población indígena del continente. De todas las consecuencias, esa es la más grave." },
  confusion: { dice: "Entonces los europeos les llevaron la papa y el maíz a los americanos, ¿cierto?", opts: ["No, al revés: la papa y el maíz son americanos y viajaron desde aquí a Europa", "Sí, se los llevaron ellos en las carabelas", "No, la papa es europea pero el maíz sí es americano"], a: 0, why: "Sin América no habría papas fritas en España ni chocolate en Suiza. Lo que vino de Europa fue el trigo, la caña de azúcar, la vaca y el caballo." },
  escribir: {
    pregunta: "Explícale a Chupaya dos cosas que cambiaron en América y dos que cambiaron en Europa.",
    modelo: "En América murió gran parte de la población indígena por las enfermedades y el trabajo forzado, y se impusieron el idioma español y la religión católica. En Europa llegaron enormes cantidades de oro y plata, que hicieron muy poderosa a España, y alimentos nuevos como la papa, el maíz, el tomate y el cacao, que cambiaron la comida para siempre.",
    rubrica: ["Nombré dos cambios en América", "Nombré dos cambios en Europa", "Mencioné al menos un alimento que viajó de América a Europa"]
  },
  final: "Papas y chocolate para Europa, y para América una pérdida enorme. Nunca más se me olvida para qué lado iba cada cosa."
}
];
