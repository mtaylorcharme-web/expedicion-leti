/* Misión Aya · El hilo de las causas
   Una red causal por selva. Ordenar hechos es cronología; unirlos con "esto provocó esto"
   es causalidad, que es lo que evalúa la unidad.

   hechos[]   los sucesos, en orden cronológico real (el motor los baraja para el paso 1)
   enlaces[]  las uniones verdaderas: de un hecho a otro, con la explicación
   trampas[]  uniones falsas que un niño de esta edad hace de verdad: pasaron una después
              de la otra, pero una no causó la otra. Enseñan la diferencia.
   cierre     escritura abierta con rúbrica, obliga a nombrar más de una causa
*/

window.CAUSAS = [
{
  id: "ca1", camp: "c1", titulo: "¿Por qué Europa se lanzó al mar?",
  guia: "ovaya",
  intro: "Ordena lo que pasó y después une con flechas qué provocó qué. Ojo: que dos cosas pasen seguidas no significa que una haya causado la otra.",
  pregunta: "¿Por qué los europeos salieron a buscar nuevas rutas en el siglo XV?",
  hechos: [
    { id: "h1", t: "Europa compra seda y especias en Asia por la Ruta de la Seda", fecha: "Siglos XIII-XIV" },
    { id: "h2", t: "Crecen las ciudades y aparece la burguesía, con dinero para invertir", fecha: "Siglo XV" },
    { id: "h3", t: "Los turcos otomanos toman Constantinopla y se corta la ruta a Asia", fecha: "1453" },
    { id: "h4", t: "Se difunden la brújula, el astrolabio y la carabela", fecha: "Siglo XV" },
    { id: "h5", t: "Portugal bordea África buscando llegar al Índico por el mar", fecha: "1415-1488" },
    { id: "h6", t: "Colón navega al oeste y llega a América", fecha: "1492" }
  ],
  enlaces: [
    { de: "h1", a: "h3", por: "Justamente porque esa ruta era tan valiosa, que la cortaran fue un problema enorme. Sin el comercio con Asia, Constantinopla no habría importado tanto." },
    { de: "h3", a: "h5", por: "Cortado el camino por tierra, había que buscar otro por mar. Portugal eligió bordear África." },
    { de: "h3", a: "h6", por: "La misma causa: si no se puede ir al este por tierra, se intenta llegar a Asia navegando al oeste. Colón nunca supo que había un continente en medio." },
    { de: "h4", a: "h5", por: "Sin brújula ni astrolabio no se puede navegar lejos de la costa. La tecnología hizo posible el viaje." },
    { de: "h4", a: "h6", por: "Cruzar el Atlántico abierto solo era pensable con estos instrumentos y con la carabela." },
    { de: "h2", a: "h6", por: "Los viajes costaban muchísimo. Alguien tenía que pagarlos: comerciantes y reyes con dinero nuevo." }
  ],
  trampas: [
    { de: "h1", a: "h2", por: "La burguesía sí nace del comercio, pero no del comercio con Asia en particular. Esa flecha mezcla dos cosas distintas." },
    { de: "h5", a: "h6", por: "Portugal navegó antes que Colón, pero no lo causó. Son dos respuestas paralelas al mismo problema, no una consecuencia de la otra." },
    { de: "h6", a: "h4", por: "Al revés: la tecnología existía antes y por eso el viaje fue posible. Una causa nunca viene después de su efecto." }
  ],
  cierre: {
    q: "Explica con tus palabras por qué Europa buscó nuevas rutas. Nombra al menos tres causas distintas.",
    modelo: "Europa buscó nuevas rutas porque en 1453 los turcos tomaron Constantinopla y cortaron el camino por tierra hacia Asia, de donde venían la seda y las especias. Además había nuevos instrumentos, como la brújula, el astrolabio y la carabela, que permitían navegar lejos de la costa. Y existía una burguesía con dinero para financiar viajes tan caros. Ninguna de estas causas alcanza sola: se juntaron las tres.",
    rubrica: [
      "Nombré la ruta cortada en 1453",
      "Nombré los avances de navegación",
      "Nombré el dinero de la burguesía o los reyes",
      "Dije que fueron varias causas juntas, no una sola"
    ]
  }
},
{
  id: "ca2", camp: "c2", titulo: "¿Por qué crecieron estos imperios?",
  guia: "estaya",
  intro: "Los mayas, aztecas e incas no aparecieron de la nada. Une qué hizo posible qué. Yo me olvido de todo, así que dibújamelo con flechas.",
  pregunta: "¿Qué permitió que en América crecieran ciudades e imperios tan grandes?",
  hechos: [
    { id: "h1", t: "Se domestica el maíz y se aprende a cultivarlo", fecha: "Hace miles de años" },
    { id: "h2", t: "Con agricultura estable, la gente deja de moverse y se queda en un lugar", fecha: "" },
    { id: "h3", t: "Sobra comida, así que no todos tienen que cultivar", fecha: "" },
    { id: "h4", t: "Aparecen sacerdotes, guerreros, astrónomos y constructores", fecha: "" },
    { id: "h5", t: "Se construyen ciudades con templos, calendarios y escritura", fecha: "" },
    { id: "h6", t: "Aztecas e incas cobran tributo a los pueblos que dominan", fecha: "Siglos XIV-XV" }
  ],
  enlaces: [
    { de: "h1", a: "h2", por: "Si la comida crece donde tú la siembras, ya no hay que seguir a los animales. La agricultura fija a la gente en un sitio." },
    { de: "h2", a: "h3", por: "Quedarse permite mejorar la tierra año tras año: terrazas, chinampas, canales. Y entonces sobra." },
    { de: "h3", a: "h4", por: "Esta es la clave de todo. Solo cuando sobra comida alguien puede dedicarse a mirar las estrellas o a construir, en vez de cultivar." },
    { de: "h4", a: "h5", por: "Los calendarios, la escritura y los templos son obra de esa gente especializada." },
    { de: "h6", a: "h5", por: "El tributo de los pueblos dominados pagaba las ciudades. Tenochtitlan se sostenía con lo que llegaba de fuera." }
  ],
  trampas: [
    { de: "h1", a: "h5", por: "El maíz no construye templos por sí solo. Faltan los pasos del medio: quedarse, que sobre comida y que aparezcan especialistas. Saltarse pasos es el error más común." },
    { de: "h5", a: "h1", por: "Las ciudades no causaron el maíz. El maíz vino muchísimo antes. Revisa las fechas." }
  ],
  cierre: {
    q: "Un compañero dice: «Los aztecas construyeron templos porque eran muy religiosos». ¿Qué le falta a esa explicación?",
    modelo: "Ser religiosos explica por qué quisieron construir templos, pero no cómo pudieron hacerlo. Para levantar una ciudad hacía falta que sobrara comida gracias al maíz y a las chinampas, de modo que hubiera gente dedicada solo a construir y no a cultivar. Además, el tributo que cobraban a otros pueblos financiaba las obras. La religión es una causa, pero no la única.",
    rubrica: [
      "Dije que la religión explica el querer, no el poder",
      "Nombré el excedente de comida",
      "Nombré a los especialistas que no cultivaban",
      "Nombré el tributo o el trabajo de otros pueblos"
    ]
  }
},
{
  id: "ca3", camp: "c3", titulo: "¿Por qué ganaron siendo tan pocos?",
  guia: "chupaya",
  intro: "Esta me perdió del todo. Eran cientos contra millones, ¿y ganaron? Tiene que haber más de una razón. Ayúdame a unirlas.",
  pregunta: "¿Por qué unos pocos cientos de españoles vencieron a imperios de millones de personas?",
  hechos: [
    { id: "h1", t: "Los aztecas cobran tributo duro a los pueblos que dominan", fecha: "Siglo XV" },
    { id: "h2", t: "Los españoles traen caballos, acero, arcabuces y perros de guerra", fecha: "1519" },
    { id: "h3", t: "Totonacas y tlaxcaltecas se alían con Cortés contra los aztecas", fecha: "1519" },
    { id: "h4", t: "Llega la viruela, una enfermedad que en América no existía", fecha: "1520" },
    { id: "h5", t: "Muere gran parte de la población indígena, incluidos jefes y guerreros", fecha: "1520-1521" },
    { id: "h6", t: "Huáscar y Atahualpa pelean una guerra civil por el trono inca", fecha: "1528-1532" },
    { id: "h7", t: "Caen Tenochtitlan y luego el imperio inca", fecha: "1521 y 1535" }
  ],
  enlaces: [
    { de: "h1", a: "h3", por: "Aquí está lo que casi nadie ve: esos pueblos ya odiaban a los aztecas. Cortés no los convenció, aprovechó un enojo que ya existía." },
    { de: "h3", a: "h7", por: "La mayoría del ejército que tomó Tenochtitlan era indígena. Sin esas alianzas, Cortés no habría tenido con qué." },
    { de: "h2", a: "h7", por: "Las armas y los caballos dieron ventaja, sobre todo al principio y en campo abierto. Pero fueron una causa entre varias." },
    { de: "h4", a: "h5", por: "Nadie en América tenía defensas contra la viruela, porque nunca la habían enfrentado." },
    { de: "h5", a: "h7", por: "Un imperio que pierde a buena parte de su gente y de sus jefes en meses no puede defenderse igual." },
    { de: "h6", a: "h7", por: "Pizarro llegó justo cuando el imperio inca acababa de partirse en dos por una guerra entre hermanos." }
  ],
  trampas: [
    { de: "h2", a: "h4", por: "La viruela no vino en las armas: vino en el cuerpo de las personas, sin que nadie lo planeara. Llegó con ellos, pero no la causaron sus armas." },
    { de: "h7", a: "h6", por: "Al revés. La guerra civil inca fue antes y por eso ayudó a Pizarro. Mira las fechas: 1528 viene antes que 1535." },
    { de: "h2", a: "h3", por: "Los pueblos no se aliaron por miedo a las armas, sino porque ya estaban en contra de los aztecas. Es un motivo político, no tecnológico." }
  ],
  cierre: {
    q: "Responde a esta frase: «Los españoles ganaron porque tenían mejores armas». ¿Es suficiente esa explicación?",
    modelo: "Las armas ayudaron, pero no alcanzan para explicarlo. Ganaron sobre todo porque miles de indígenas se aliaron con ellos contra los aztecas, que los tenían sometidos con tributos. También porque la viruela mató a una parte enorme de la población, incluidos jefes y guerreros, y porque el imperio inca venía de una guerra civil entre Huáscar y Atahualpa. Decir solo «mejores armas» deja fuera casi todo lo importante.",
    rubrica: [
      "Dije que las armas solas no bastan",
      "Nombré las alianzas con pueblos indígenas",
      "Nombré las enfermedades",
      "Nombré la guerra civil inca o la división interna"
    ]
  }
},
{
  id: "ca4", camp: "c4", titulo: "La cadena de 1519",
  guia: "ovaya",
  intro: "¡Uy, cuántas fechas! Pero no es una lista: cada cosa empujó a la siguiente. Arma la cadena.",
  pregunta: "¿Cómo se encadenaron los hechos entre 1519 y 1521 en México?",
  hechos: [
    { id: "h1", t: "Febrero de 1519: Cortés zarpa de Cuba con once naves", fecha: "1519" },
    { id: "h2", t: "Julio de 1519: los totonacas ofrecen alianza en Veracruz", fecha: "1519" },
    { id: "h3", t: "Septiembre de 1519: los tlaxcaltecas, tras pelear, se suman", fecha: "1519" },
    { id: "h4", t: "Noviembre de 1519: Moctezuma recibe a Cortés en Tenochtitlan", fecha: "1519" },
    { id: "h5", t: "Junio de 1520: la ciudad se rebela y expulsa a los españoles", fecha: "1520" },
    { id: "h6", t: "Los españoles se refugian en Tlaxcala y rearman su ejército", fecha: "1520" },
    { id: "h7", t: "Agosto de 1521: cae Tenochtitlan tras un largo sitio", fecha: "1521" }
  ],
  enlaces: [
    { de: "h2", a: "h3", por: "La primera alianza le dio a Cortés información, comida y guías. Con eso pudo llegar hasta Tlaxcala." },
    { de: "h3", a: "h4", por: "Con miles de aliados tlaxcaltecas detrás, entrar a Tenochtitlan era posible. Solo, jamás habría llegado." },
    { de: "h4", a: "h5", por: "La convivencia terminó mal: la matanza del Templo Mayor y la prisión de Moctezuma hicieron estallar a la ciudad." },
    { de: "h5", a: "h6", por: "Derrotados y en fuga, sobrevivieron solo porque Tlaxcala les abrió la puerta otra vez." },
    { de: "h6", a: "h7", por: "El sitio final lo hizo un ejército rearmado, con muchísimos más aliados indígenas que españoles." }
  ],
  trampas: [
    { de: "h1", a: "h7", por: "Zarpar no causa la caída de una ciudad. Entre medio pasaron dos años y muchísimas cosas. Saltarse la cadena entera es el error clásico." },
    { de: "h4", a: "h7", por: "Cortés entró en 1519 pero la ciudad cayó en 1521, y en medio lo echaron. No fue directo: hubo una derrota primero." }
  ],
  cierre: {
    q: "¿Por qué Tenochtitlan no cayó en 1519, cuando Cortés entró por primera vez?",
    modelo: "Porque entrar no es conquistar. En 1519 Moctezuma lo recibió, pero en junio de 1520 la ciudad se rebeló y los echó. Los españoles sobrevivieron porque Tlaxcala los acogió, y ahí rearmaron un ejército mucho más grande, con miles de aliados indígenas. Recién en agosto de 1521, después de un sitio largo, la ciudad cayó. Fueron dos años y una derrota en medio.",
    rubrica: [
      "Dije que primero lo expulsaron",
      "Nombré el refugio en Tlaxcala",
      "Dije que volvió con muchos más aliados",
      "Usé las fechas correctas: 1519, 1520 y 1521"
    ]
  }
},
{
  id: "ca5", camp: "c5", titulo: "Dos mundos que se cambian el uno al otro",
  guia: "estaya",
  intro: "Aquí las flechas van en las dos direcciones, como una canción con dos voces. Une qué provocó qué a cada lado del océano.",
  pregunta: "¿Qué consecuencias tuvo el encuentro entre América y Europa?",
  hechos: [
    { id: "h1", t: "Llegan a América enfermedades nuevas: viruela, sarampión, tifus", fecha: "Desde 1492" },
    { id: "h2", t: "Muere una parte enorme de la población indígena", fecha: "Siglo XVI" },
    { id: "h3", t: "Se instaura la encomienda y el trabajo forzado en minas", fecha: "Siglo XVI" },
    { id: "h4", t: "Se trae gente esclavizada desde África", fecha: "Siglo XVI" },
    { id: "h5", t: "Llega a Europa la plata de Potosí y de México", fecha: "Desde 1545" },
    { id: "h6", t: "La papa y el maíz americanos se cultivan en Europa", fecha: "Siglos XVI-XVII" },
    { id: "h7", t: "Crece la población europea", fecha: "Siglos XVII-XVIII" },
    { id: "h8", t: "Bartolomé de las Casas denuncia el trato a los indígenas", fecha: "1552" }
  ],
  enlaces: [
    { de: "h1", a: "h2", por: "Sin defensas previas, las enfermedades mataron a muchísima más gente que las guerras." },
    { de: "h2", a: "h4", por: "Aquí está la conexión que suele pasarse por alto: al morir tanta gente, los europeos buscaron mano de obra en África. La trata crece por esa falta." },
    { de: "h3", a: "h2", por: "El trabajo forzado en minas y encomiendas también mató gente, se sumó a las enfermedades." },
    { de: "h3", a: "h8", por: "Las Casas escribe justamente denunciando la encomienda y el maltrato que veía con sus ojos." },
    { de: "h5", a: "h7", por: "La plata americana financió a Europa; fue una de las bases de su crecimiento." },
    { de: "h6", a: "h7", por: "La papa alimenta a mucha gente en poca tierra. Es una de las razones del crecimiento de la población europea." }
  ],
  trampas: [
    { de: "h2", a: "h1", por: "Al revés: las enfermedades causaron las muertes, no las muertes las enfermedades." },
    { de: "h6", a: "h5", por: "La papa y la plata viajaron las dos a Europa, pero una no causó la otra. Ir juntas no es causarse." },
    { de: "h8", a: "h3", por: "Las Casas escribió en 1552 en contra de la encomienda, que ya existía. Su denuncia es consecuencia, no causa." }
  ],
  cierre: {
    q: "Explica por qué aumentó la llegada de personas esclavizadas desde África a América.",
    modelo: "Porque la población indígena había disminuido muchísimo por las enfermedades nuevas, como la viruela, y por el trabajo forzado en encomiendas y minas. Los europeos querían seguir explotando la plata y las plantaciones, pero ya no había suficiente gente para ese trabajo. Entonces trajeron personas esclavizadas desde África. Una consecuencia terrible se encadenó con otra.",
    rubrica: [
      "Nombré la caída de la población indígena",
      "Nombré las enfermedades como causa de esa caída",
      "Nombré el trabajo forzado en minas o encomiendas",
      "Conecté esa falta de gente con la trata de africanos"
    ]
  }
}
];
