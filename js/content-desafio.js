/* Misión Aya · El salto a ciegas
   Modalidad OPCIONAL: intentar antes de leer.

   Es Chupaya quien la propone, porque él salta sin mirar. Leti se arriesga con una
   hipótesis sobre algo que todavía no ha estudiado, se compromete con ella, y recién
   después lee la explicación. Equivocarse aquí no resta: es lo que hace que la
   explicación posterior se fije. Se llama fracaso productivo.

   Reglas del contenido:
   - Ninguna opción puede ser absurda. Todas tienen que ser razonables para alguien
     que aún no sabe. Si una es obviamente tonta, no hay hipótesis, hay adivinanza.
   - "revelacion" explica lo que pasó de verdad Y por qué la intuición más común falla.
   - "nota" es el título de la página de la bitácora donde está la explicación completa.
*/

window.DESAFIOS = [
{
  id: "d1", camp: "c1",
  invita: "Yo salto sin mirar y a veces me va bien. ¿Te atreves a adivinar antes de leer? No importa fallar: así se te queda mejor cuando lo leas.",
  retos: [
    {
      q: "Estamos en Europa, año 1450. Los europeos compran seda y especias que vienen de Asia por tierra. De pronto esa ruta se corta. ¿Qué crees que hicieron?",
      opciones: [
        "Dejaron de comprar esos productos",
        "Pelearon para recuperar la ruta por tierra",
        "Buscaron llegar a Asia por el mar",
        "Empezaron a producir esas cosas en Europa"
      ],
      correcta: 2,
      revelacion: "Buscaron llegar por mar. Lo interesante es por qué las otras no funcionaron: las especias no crecen en el clima europeo, recuperar la ruta militarmente era imposible frente al imperio otomano, y dejar de comprarlas no era opción porque la seda y las especias movían enormes cantidades de dinero. El mar quedó como la única salida.",
      nota: "Causa 1 · Rutas comerciales"
    },
    {
      q: "Navegar lejos de la costa era peligrosísimo: sin ver tierra, no sabes dónde estás. ¿Qué crees que permitió por fin cruzar el océano abierto?",
      opciones: [
        "Barcos mucho más grandes y pesados",
        "Instrumentos para orientarse sin ver tierra",
        "Tripulaciones mucho más numerosas",
        "Mapas completos del océano"
      ],
      correcta: 1,
      revelacion: "Los instrumentos: la brújula, el astrolabio y el cuadrante. Fíjate en la trampa de la última opción: no existían mapas del océano, justamente porque nadie lo había cruzado. Y la carabela no era el barco más grande, sino uno pequeño y ágil, capaz de aprovechar el viento.",
      nota: "Causa 3 · Avances tecnológicos"
    },
    {
      q: "Un viaje así costaba una fortuna. ¿Quién crees que lo pagaba?",
      opciones: [
        "Los propios marineros",
        "La Iglesia",
        "Los reyes y comerciantes ricos",
        "Los pueblos de donde salían los barcos"
      ],
      correcta: 2,
      revelacion: "Los reyes y la burguesía: comerciantes y banqueros con dinero nuevo, que invertían esperando ganar mucho más. Los marineros no tenían con qué; iban buscando su parte del negocio, no poniéndolo.",
      nota: "Causa 2 · Desarrollo económico"
    }
  ]
},
{
  id: "d2", camp: "c2",
  invita: "Antes de que lleguemos a los templos, dime qué te imaginas tú. Yo me imagino cualquier cosa y a veces acierto.",
  retos: [
    {
      q: "En América, antes de 1492, había ciudades enormes con templos, calendarios y astronomía. ¿Qué crees que hizo posible construirlas?",
      opciones: [
        "Que tenían animales de carga muy fuertes",
        "Que sobraba comida y no todos debían cultivar",
        "Que usaban herramientas de hierro",
        "Que eran muchísimos más habitantes que en Europa"
      ],
      correcta: 1,
      revelacion: "Que sobraba comida gracias al maíz, las chinampas y las terrazas. Las otras tres son justamente lo que NO tenían: no había caballos ni bueyes, no conocían el hierro, y no eran más que Europa. Todo se hizo con excedente agrícola y organización.",
      nota: "El maíz y la agricultura"
    },
    {
      q: "Los mayas tenían escritura, calendario y el concepto del cero. ¿Cómo crees que estaban organizados políticamente?",
      opciones: [
        "Un solo imperio grande con un emperador",
        "Muchas ciudades-estado independientes",
        "Tribus pequeñas que se movían de un lugar a otro",
        "Una república con representantes elegidos"
      ],
      correcta: 1,
      revelacion: "Ciudades-estado independientes, cada una con su gobernante, a veces aliadas y a veces en guerra. Es el error más común: suponer que si una cultura es avanzada tiene que ser un imperio unificado. Los aztecas e incas sí formaron imperios; los mayas, no.",
      nota: "Los mayas"
    },
    {
      q: "El imperio inca se extendía por miles de kilómetros de montañas. Sin rueda, sin caballos y sin escritura como la nuestra, ¿cómo crees que lo controlaban?",
      opciones: [
        "Con caminos y mensajeros que corrían por relevos",
        "Con barcos por los ríos",
        "Dejando que cada región se gobernara sola",
        "Con un ejército permanente en cada pueblo"
      ],
      correcta: 0,
      revelacion: "Con el Camino del Inca y los chasquis, mensajeros que corrían por relevos, más los quipus de cuerdas con nudos para llevar las cuentas. Un sistema de comunicación impresionante, hecho sin rueda ni escritura alfabética.",
      nota: "Los incas"
    }
  ]
},
{
  id: "d3", camp: "c3",
  invita: "Esta selva me da miedo. Arriésgate tú primero y después leemos si acertaste.",
  retos: [
    {
      q: "¿Quién crees que pagaba las expediciones de conquista en América?",
      opciones: [
        "El rey de España, con dinero del reino",
        "El capitán y sus socios, con dinero propio",
        "La Iglesia católica",
        "Los soldados, cada uno lo suyo"
      ],
      correcta: 1,
      revelacion: "Aquí casi todos se equivocan, y por buena razón: parece lógico que el rey mandara su ejército. Pero no. Era una empresa privada: el capitán y sus socios ponían el dinero esperando recuperarlo con el botín. El rey solo daba el permiso, la capitulación, y cobraba después el quinto real. Ni siquiera había sueldo.",
      nota: "La empresa de Conquista"
    },
    {
      q: "Unos cientos de españoles contra imperios de millones. ¿Cuál crees que fue el factor MÁS decisivo?",
      opciones: [
        "Las armas de fuego y los caballos",
        "Que miles de indígenas se aliaron con ellos",
        "Que eran mejores estrategas",
        "Que los indígenas los creyeron dioses"
      ],
      correcta: 1,
      revelacion: "Las alianzas. La mayor parte del ejército que tomó Tenochtitlan era indígena: pueblos que odiaban el tributo azteca y vieron la oportunidad de sacárselo de encima. Las armas ayudaron, pero sin esos miles de aliados no habrían tenido con qué. Y lo de creerlos dioses es sobre todo un relato escrito después.",
      nota: "Por qué ganaron"
    },
    {
      q: "¿Qué crees que mató a más gente en América durante el siglo XVI?",
      opciones: [
        "Las batallas de la conquista",
        "El hambre",
        "Las enfermedades traídas de Europa",
        "El trabajo en las minas"
      ],
      correcta: 2,
      revelacion: "Las enfermedades, de lejos. Viruela, sarampión y tifus no existían en América, así que nadie tenía defensas. Mataron a una parte enorme de la población, muchísimo más que las batallas. Nadie lo planeó: viajaban en el cuerpo de las personas.",
      nota: "Las enfermedades"
    }
  ]
},
{
  id: "d4", camp: "c4",
  invita: "Aquí hay puras fechas y yo las confundo todas. Adivina tú primero, después vemos qué pasó de verdad.",
  retos: [
    {
      q: "Cortés llegó a Tenochtitlan en noviembre de 1519. ¿Cuánto crees que pasó hasta que la ciudad cayó?",
      opciones: [
        "Unos días",
        "Unos meses",
        "Casi dos años",
        "Más de diez años"
      ],
      correcta: 2,
      revelacion: "Casi dos años, hasta agosto de 1521. Y en el medio pasó algo que casi nadie recuerda: en junio de 1520 la ciudad se rebeló y los expulsó. Tuvieron que huir, refugiarse en Tlaxcala y volver con un ejército mucho más grande. Entrar no es conquistar.",
      nota: "La caída de Tenochtitlan"
    },
    {
      q: "Pizarro llegó al imperio inca con menos de doscientos hombres. ¿Qué estaba pasando en ese imperio justo entonces?",
      opciones: [
        "Vivía su momento de mayor esplendor",
        "Terminaba una guerra civil entre dos hermanos",
        "Estaba en guerra contra los mayas",
        "Se estaba quedando sin comida"
      ],
      correcta: 1,
      revelacion: "Acababa de terminar la guerra civil entre Huáscar y Atahualpa por el trono. Pizarro llegó al peor momento posible para los incas: un imperio partido en dos, con un bando recién derrotado que no tenía ningún interés en defender al otro.",
      nota: "La conquista del Perú"
    }
  ]
},
{
  id: "d5", camp: "c5",
  invita: "Última selva. Dime qué crees que pasó cuando los dos mundos se juntaron, y después leemos.",
  retos: [
    {
      q: "De América salieron hacia Europa la papa, el maíz, el tomate y el cacao. ¿Qué efecto crees que tuvo eso en Europa?",
      opciones: [
        "Casi ninguno, eran comidas raras",
        "Creció la población, porque había más alimento",
        "Se encarecieron los alimentos",
        "Solo los ricos pudieron comerlos"
      ],
      correcta: 1,
      revelacion: "Creció la población. La papa en particular alimenta a mucha gente en poca tierra y resiste climas fríos, así que se volvió básica para la gente pobre del norte de Europa. Un producto americano cambió la vida cotidiana europea durante siglos.",
      nota: "El intercambio"
    },
    {
      q: "La población indígena disminuyó muchísimo en el siglo XVI. ¿Qué crees que hicieron entonces los europeos para conseguir gente que trabajara en minas y plantaciones?",
      opciones: [
        "Trajeron campesinos desde Europa",
        "Trajeron personas esclavizadas desde África",
        "Usaron máquinas",
        "Redujeron la producción"
      ],
      correcta: 1,
      revelacion: "Trajeron personas esclavizadas desde África, por millones y durante siglos. Es una de las consecuencias más terribles de todo este proceso, y se encadena directamente con la anterior: una catástrofe provocó otra.",
      nota: "Consecuencias en América"
    },
    {
      q: "¿Crees que en la época alguien en España se opuso al trato que recibían los indígenas?",
      opciones: [
        "No, nadie lo cuestionó en ese tiempo",
        "Sí, hubo religiosos que lo denunciaron",
        "Solo mucho después, en el siglo XIX",
        "Solo lo criticaron otros países"
      ],
      correcta: 1,
      revelacion: "Sí. Bartolomé de las Casas, fraile dominico, lo denunció por escrito ante el propio rey en 1552. Es importante saberlo: en su propia época ya había personas que sabían que aquello estaba mal y lo dijeron. No todos pensaban igual.",
      nota: "Las voces que se opusieron"
    }
  ]
}
];
