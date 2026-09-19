/* Misión Aya · El mundo, las selfies y la búsqueda de la Ciudad Aya
   Retratos: obras de dominio público (Wikimedia Commons).
   Coordenadas reales para ubicarse en el mapa y abrir el lugar en Google Earth. */

/* ── Selfies: un personaje histórico por misión ── */
window.PERSONAJES = [
  { id: "marcopolo", mision: "c1m1", aya: "ovaya", nombre: "Marco Polo", cargo: "Viajero veneciano", anio: "1295", lugar: "Venecia, Italia", lat: 45.4408, lon: 12.3155,
    frase: "¡Volví de China con historias que nadie me cree! Seda, especias y ciudades enormes.", dato: "Su libro hizo soñar a media Europa con Asia. Colón llevaba una copia llena de anotaciones suyas." },
  { id: "isabel", mision: "c1m2", aya: "estaya", nombre: "Isabel la Católica", cargo: "Reina de Castilla", anio: "1492", lugar: "Granada, España", lat: 37.1773, lon: -3.5986,
    frase: "Le dimos permiso a ese genovés testarudo. Veremos si encuentra su ruta a las Indias.", dato: "Firmó con Colón las Capitulaciones de Santa Fe en abril de 1492, el contrato que lo empezó todo." },
  { id: "colon", mision: "c1m3", aya: "chupaya", nombre: "Cristóbal Colón", cargo: "Navegante", anio: "1492", lugar: "Palos de la Frontera, España", lat: 37.2306, lon: -6.8931,
    frase: "Navegaré hacia el oeste. Si la Tierra es redonda, llegaré a Asia por el otro lado.", dato: "Murió en 1506 convencido de haber llegado a Asia. Nunca supo que había encontrado un continente." },
  { id: "dagama", mision: "c2m1", aya: "ovaya", nombre: "Vasco da Gama", cargo: "Navegante portugués", anio: "1498", lugar: "Calicut, India", lat: 11.2588, lon: 75.7804,
    frase: "Yo sí llegué a la India, bordeando toda África. Y volví para contarlo.", dato: "Su viaje demostró que sí existía una ruta marítima a Asia. Portugal y España compitieron por el camino." },
  { id: "moctezuma", mision: "c2m2", aya: "estaya", nombre: "Moctezuma", cargo: "Emperador azteca", anio: "1519", lugar: "Tenochtitlan, México", lat: 19.4326, lon: -99.1332,
    frase: "Bienvenidos a Tenochtitlan. Mi ciudad flota sobre el lago y es más grande que cualquiera en España.", dato: "Tenía unos 200 000 habitantes. Cortés lo capturó en 1520 y la ciudad cayó un año después." },
  { id: "atahualpa", mision: "c3m1", aya: "chupaya", nombre: "Atahualpa", cargo: "Sapa Inca", anio: "1532", lugar: "Cajamarca, Perú", lat: -7.1617, lon: -78.5128,
    frase: "Acabo de ganarle la guerra a mi hermano Huáscar. Nada puede salir mal ahora.", dato: "Fue capturado ese mismo día en Cajamarca. Ofreció llenar una sala de oro por su libertad." },
  { id: "cortes", mision: "c3m2", aya: "ovaya", nombre: "Hernán Cortés", cargo: "Capitán de la hueste", anio: "1519", lugar: "Veracruz, México", lat: 19.1738, lon: -96.1342,
    frase: "Quemé los barcos. Ahora solo se puede avanzar hacia Tenochtitlan.", dato: "Se alió con los totonacas y los tlaxcaltecas, enemigos de los aztecas. Sin ellos no habría llegado." },
  { id: "pizarro", mision: "c4m1", aya: "chupaya", nombre: "Francisco Pizarro", cargo: "Capitán de la hueste", anio: "1531", lugar: "Cuzco, Perú", lat: -13.5319, lon: -71.9675,
    frase: "Somos menos de doscientos frente a un imperio. Pero el imperio está peleando consigo mismo.", dato: "Llegó justo durante la guerra civil entre Huáscar y Atahualpa. Ese detalle lo cambió todo." },
  { id: "magallanes", mision: "c4m2", aya: "estaya", nombre: "Magallanes", cargo: "Navegante", anio: "1520", lugar: "Estrecho de Magallanes, Chile", lat: -53.5, lon: -70.5,
    frase: "Encontré el paso entre los dos océanos. Está helado, pero existe.", dato: "Murió en Filipinas. Elcano completó la primera vuelta al mundo en 1522 con un solo barco y 18 hombres." },
  { id: "vespucio", mision: "c4m3", aya: "ovaya", nombre: "Américo Vespucio", cargo: "Navegante y cartógrafo", anio: "1502", lugar: "Costa de Brasil", lat: -12.9777, lon: -38.5016,
    frase: "Esto no es Asia. Es un continente entero que nadie en Europa conocía.", dato: "Por eso el continente se llama América. Fue el primero en decir en voz alta que era un mundo nuevo." },
  { id: "lascasas", mision: "c5m1", aya: "chupaya", nombre: "Bartolomé de las Casas", cargo: "Fraile y defensor", anio: "1552", lugar: "Sevilla, España", lat: 37.3891, lon: -5.9845,
    frase: "Escribí todo lo que vi. Alguien tiene que contarlo, aunque al rey no le guste.", dato: "Su libro ayudó a que en 1542 se dictaran las Leyes Nuevas para limitar la encomienda." },
  { id: "valdivia", mision: "c5m2", aya: "estaya", nombre: "Pedro de Valdivia", cargo: "Conquistador", anio: "1541", lugar: "Santiago, Chile", lat: -33.4489, lon: -70.6693,
    frase: "Fundé esta ciudad al pie de un cerro, junto a un río. La llamé Santiago.", dato: "El cerro Huelén es hoy el Santa Lucía. Así empezó la ciudad donde vives tú." }
];

/* ── Lugares del mundo: para ubicarse y abrir Google Earth ── */
window.LUGARES = [
  { id: "venecia", n: "Venecia", pais: "Italia", lat: 45.4408, lon: 12.3155, anio: 1295, camp: "c1", q: "El puerto más rico de Europa. De aquí salían y llegaban las mercancías de Asia." },
  { id: "constantinopla", n: "Constantinopla", pais: "hoy Estambul, Turquía", lat: 41.0082, lon: 28.9784, anio: 1453, camp: "c1", q: "Su caída cortó el paso terrestre hacia Asia. Europa tuvo que buscar otra ruta." },
  { id: "lisboa", n: "Lisboa", pais: "Portugal", lat: 38.7223, lon: -9.1393, anio: 1488, camp: "c1", q: "Desde aquí Portugal salió a bordear África buscando la India." },
  { id: "palos", n: "Palos de la Frontera", pais: "España", lat: 37.2306, lon: -6.8931, anio: 1492, camp: "c1", q: "El 3 de agosto de 1492 zarparon de aquí las tres naves de Colón." },
  { id: "guanahani", n: "Guanahaní", pais: "Bahamas", lat: 24.05, lon: -74.5, anio: 1492, camp: "c1", q: "La primera isla donde desembarcó Colón, el 12 de octubre de 1492." },
  { id: "calicut", n: "Calicut", pais: "India", lat: 11.2588, lon: 75.7804, anio: 1498, camp: "c1", q: "Vasco da Gama llegó aquí bordeando África. Portugal ganó su ruta a las especias." },
  { id: "yucatan", n: "Chichén Itzá", pais: "México", lat: 20.6843, lon: -88.5678, anio: 900, camp: "c2", q: "Ciudad maya con su pirámide y su observatorio. Los mayas no formaron un imperio." },
  { id: "tenochtitlan", n: "Tenochtitlan", pais: "hoy Ciudad de México", lat: 19.4326, lon: -99.1332, anio: 1325, camp: "c2", q: "Capital azteca sobre un lago, con chinampas y canales. Cayó en agosto de 1521." },
  { id: "cuzco", n: "Cuzco", pais: "Perú", lat: -13.5319, lon: -71.9675, anio: 1200, camp: "c2", q: "Capital del Tahuantinsuyo, el imperio inca, unido por miles de kilómetros de caminos." },
  { id: "machupicchu", n: "Machu Picchu", pais: "Perú", lat: -13.1631, lon: -72.5450, anio: 1450, camp: "c2", q: "Ciudad inca construida en terrazas sobre la montaña. Los españoles nunca la encontraron." },
  { id: "cajamarca", n: "Cajamarca", pais: "Perú", lat: -7.1617, lon: -78.5128, anio: 1532, camp: "c4", q: "Aquí Pizarro capturó a Atahualpa en noviembre de 1532." },
  { id: "veracruz", n: "Veracruz", pais: "México", lat: 19.1738, lon: -96.1342, anio: 1519, camp: "c4", q: "Cortés desembarcó en esta costa en 1519 y se alió con los totonacas." },
  { id: "magallanes", n: "Estrecho de Magallanes", pais: "Chile", lat: -53.5, lon: -70.5, anio: 1520, camp: "c5", q: "El paso entre el Atlántico y el Pacífico, en el extremo sur de América." },
  { id: "santiago", n: "Santiago", pais: "Chile", lat: -33.4489, lon: -70.6693, anio: 1541, camp: "c5", q: "Pedro de Valdivia la fundó en 1541 junto al cerro Huelén, hoy Santa Lucía." }
];

/* ── Los ocho lugares donde podría estar la Ciudad Aya ── */
window.CANDIDATOS = [
  { id: "namche", n: "Namche Bazar", pais: "Nepal", lat: 27.8069, lon: 86.7140, alt: "3440 m", dato: "El pueblo de los sherpas, la última parada antes del Everest." },
  { id: "paro", n: "Paro", pais: "Bután", lat: 27.4305, lon: 89.4133, alt: "2200 m", dato: "Tiene el aeropuerto más difícil del mundo: solo unos pocos pilotos pueden aterrizar ahí." },
  { id: "lhasa", n: "Lhasa", pais: "Tíbet, China", lat: 29.6520, lon: 91.1721, alt: "3656 m", dato: "Ahí está el palacio de Potala, rojo y blanco, con mil habitaciones sobre una colina." },
  { id: "leh", n: "Leh", pais: "Ladakh, India", lat: 34.1526, lon: 77.5771, alt: "3500 m", dato: "Está en un desierto frío de montaña, junto al río Indo, casi sin lluvia en todo el año." },
  { id: "shigatse", n: "Shigatse", pais: "Tíbet, China", lat: 29.2690, lon: 88.8800, alt: "3836 m", dato: "Su monasterio de Tashilhunpo llegó a tener casi cuatro mil monjes." },
  { id: "katmandu", n: "Katmandú", pais: "Nepal", lat: 27.7172, lon: 85.3240, alt: "1400 m", dato: "Capital de Nepal, en un valle lleno de templos y plazas antiguas." },
  { id: "thimphu", n: "Thimphu", pais: "Bután", lat: 27.4728, lon: 89.6390, alt: "2320 m", dato: "Capital de Bután y una de las pocas del mundo sin un solo semáforo." },
  { id: "gilgit", n: "Gilgit", pais: "Pakistán", lat: 35.9208, lon: 74.3080, alt: "1500 m", dato: "Rodeada por el Karakórum, donde está el K2, la segunda montaña más alta del mundo." }
];

/* Cada pista descarta un lugar. Se consiguen al completar selvas, en cualquier asignatura. */
window.PISTAS = [
  { txt: "Me acuerdo clarito: desde mi ventana NO se veía el Everest. Habría sido imposible no mirarlo todos los días.", descarta: "namche", nota: "Namche Bazar es el pueblo desde donde se ve el Everest. No es nuestra ciudad." },
  { txt: "En la Ciudad Aya no había aeropuerto. Nosotros llegábamos y salíamos volando en la nave, sin pista.", descarta: "paro", nota: "Paro tiene el aeropuerto más famoso del Himalaya. Descartado." },
  { txt: "Nunca hubo un palacio gigante rojo y blanco encima de una colina. Me acordaría de algo así.", descarta: "lhasa", nota: "El palacio de Potala está en Lhasa. Tampoco es ahí." },
  { txt: "En mi casa llovía muchísimo. Todo era verde y húmedo, nada de desierto.", descarta: "leh", nota: "Leh está en un desierto frío casi sin lluvia. Fuera." },
  { txt: "No vivíamos al lado de un monasterio enorme lleno de monjes. Éramos un lugar tranquilo.", descarta: "shigatse", nota: "Shigatse tiene el monasterio de Tashilhunpo, con miles de monjes. Descartado." },
  { txt: "Nunca fuimos la capital de ningún país. Éramos chiquititos y nadie nos gobernaba desde ahí.", descarta: "katmandu", nota: "Katmandú es la capital de Nepal. No éramos nosotros." },
  { txt: "Y tampoco éramos capital de un reino con un rey que vivía en el mismo valle.", descarta: "thimphu", nota: "Thimphu es la capital de Bután, donde vive el rey. Descartada." },
  { txt: "Lo último que recuerdo: al mirar al norte no había montañas más altas todavía. Estábamos casi en el techo.", descarta: "gilgit", nota: "Desde Gilgit se ve el Karakórum con el K2. No era nuestro cielo." }
];

/* ── La melodía de la Ciudad Aya: una nota por pista conseguida ── */
window.MELODIA = [523.25, 587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 523.25];

/* ── La ruta del año: expediciones por asignatura ── */
window.EXPEDICIONES = [
  { id: "historia-u3", asignatura: "Historia", nombre: "La expansión europea", estado: "activa", icono: "🏛️", selvas: 5, nota: "Unidad 3 · prueba del 24 de septiembre" },
  { id: "science-u3", asignatura: "Science", nombre: "Body systems", estado: "proxima", icono: "🔬", selvas: 4, nota: "En inglés, como en el Bradford" },
  { id: "math-u3", asignatura: "Math", nombre: "Fractions and decimals", estado: "proxima", icono: "🔢", selvas: 4, nota: "En inglés" },
  { id: "lenguaje-u3", asignatura: "Lenguaje", nombre: "Textos informativos", estado: "proxima", icono: "📖", selvas: 3, nota: "En español" },
  { id: "english-u3", asignatura: "English", nombre: "Storytelling", estado: "proxima", icono: "🎭", selvas: 3, nota: "En inglés" },
  { id: "social-u3", asignatura: "Social Studies", nombre: "Maps and regions", estado: "proxima", icono: "🗺️", selvas: 3, nota: "En inglés" }
];
