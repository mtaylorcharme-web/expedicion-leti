/* Misión Aya · Aquí y ahora
   Transferencia: usar la herramienta de pensamiento recién construida en un caso REAL,
   de la vida de Leti, no del siglo XV.

   Si el concepto solo funciona con Colón, no lo aprendió. Un concepto se entiende de
   verdad cuando sirve para pensar algo que no tiene nada que ver con el ejemplo donde
   se aprendió.

   Reglas del contenido:
   - El caso tiene que ser real y verificable por ella: su casa, su colegio, su país,
     su propia vida. Nada inventado ni hipotético.
   - El concepto tiene que ser el mismo que acaba de usar en esa selva.
   - "encasa": cuando hace falta preguntarle a alguien o mirar algo fuera de la app.
     Eso no es un problema, es la gracia: saca el estudio de la pantalla.
   - La rúbrica evalúa el uso del concepto, nunca si la respuesta "es la correcta":
     en estos casos no hay una sola respuesta correcta.
*/

window.TRANSFERENCIA = [
{
  id: "t1", camp: "c1", concepto: "Multicausalidad",
  titulo: "¿Por qué estudias en el Bradford?",
  guia: "ovaya",
  invita: "¡Uy! Se me ocurrió algo. Si la multicausalidad sirve para entender a Colón, tiene que servir para entender tu propia vida. Probemos.",
  caso: "Acabas de explicar que ningún hecho histórico tiene una sola causa. Eso no es una regla de la historia: es una forma de pensar que sirve para cualquier cosa. Vamos a probarla con algo de verdad.",
  consigna: "¿Por qué tú estudias en el Colegio Bradford y no en otro? Pregúntale a Mariana y a Francisco y busca al menos tres causas distintas.",
  encasa: true,
  pistas: [
    "Pregunta por qué lo eligieron a él y no a otro colegio.",
    "Pregunta qué cosas tuvieron que pasar para que fuera posible: dónde vivían, cuánto costaba, si había cupo.",
    "Pregunta si alguien les recomendó el colegio o si conocían a alguien ahí."
  ],
  rubrica: [
    "Encontré al menos tres causas distintas",
    "Alguna causa no depende de mis papás, sino de las circunstancias",
    "Puedo explicar por qué ninguna causa sola alcanza",
    "Se lo pregunté de verdad a Mariana o a Francisco"
  ],
  cierre: "Eso que acabas de hacer se llama análisis multicausal, y es exactamente lo mismo que te van a pedir con los viajes de exploración. La diferencia es que aquí tú conoces a los protagonistas."
},
{
  id: "t2", camp: "c2", concepto: "Excedente y especialización",
  titulo: "¿Por qué hay profesores de arte?",
  guia: "estaya",
  invita: "Yo vivo de componer canciones, o eso me gustaría. ¿Cómo puede alguien vivir de la música y no de cultivar comida? Piénsalo.",
  caso: "Descubriste que en América hubo astrónomos, sacerdotes y constructores solo porque sobraba comida y no todos tenían que cultivar. Esa idea explica muchísimo más que los templos aztecas.",
  consigna: "En tu colegio hay profesores de arte, de música y de educación física. Ninguno produce comida. ¿Por qué es posible que existan esos trabajos? Usa la misma idea del excedente.",
  encasa: false,
  pistas: [
    "¿Quién produce la comida que come tu profesor de música?",
    "¿Qué tendría que pasar para que tu profesora de arte tuviera que dejar de enseñar arte?",
    "Piensa en cuántas personas en Chile trabajan en agricultura hoy, comparado con hace cien años."
  ],
  rubrica: [
    "Dije que otras personas producen los alimentos",
    "Usé la idea de que sobra comida o de que la agricultura rinde más",
    "Nombré algún otro trabajo que solo existe porque otros producen lo básico",
    "Conecté esto con los aztecas, los mayas o los incas"
  ],
  cierre: "La misma idea explica Tenochtitlan y tu horario de clases. Cuando un concepto sirve en los dos lados, es que de verdad lo entendiste."
},
{
  id: "t3", camp: "c3", concepto: "Multicausalidad en lo inesperado",
  titulo: "Cuando gana el que no era favorito",
  guia: "chupaya",
  invita: "A mí siempre me gana alguien más chico y no entiendo cómo. Igual que los españoles, pero al revés. A ver, explícame.",
  caso: "Explicaste que unos pocos cientos vencieron a imperios enteros, y que decir «tenían mejores armas» deja fuera casi todo: las alianzas, las enfermedades, la guerra civil. Casi nunca gana alguien por una sola razón.",
  consigna: "Piensa en algo real que hayas visto tú: un partido donde ganó el equipo que no era favorito, o una competencia donde ganó quien nadie esperaba. Explica por qué pasó nombrando al menos tres causas, no una.",
  encasa: false,
  pistas: [
    "¿Qué le pasaba al equipo o la persona que era favorita? Muchas veces la clave está ahí y no en el que ganó.",
    "¿Hubo algo de circunstancia: el clima, una lesión, el lugar, el cansancio?",
    "¿Alguien ayudó al que ganó, aunque no fuera parte de su equipo?"
  ],
  rubrica: [
    "Es un caso real que vi o que conozco",
    "Nombré al menos tres causas distintas",
    "Al menos una causa tiene que ver con el que perdió, no con el que ganó",
    "Nombré alguna causa de circunstancia, que nadie eligió"
  ],
  cierre: "Fíjate en lo que hiciste: dejaste de buscar al héroe y empezaste a buscar las condiciones. Eso es pensar históricamente, y funciona igual en un partido que en 1521."
},
{
  id: "t4", camp: "c4", concepto: "Proceso, no acontecimiento",
  titulo: "Algo que a ti también te tomó tiempo",
  guia: "ovaya",
  invita: "Tenochtitlan no cayó en un día. ¿Y tú? ¿Algo te ha salido bien al primer intento?",
  caso: "Viste que entre 1519 y 1521 hubo alianzas, una entrada, una expulsión, una huida y recién después el final. Un proceso, no un acontecimiento. En el medio hubo una derrota grande.",
  consigna: "Piensa en algo real que aprendiste a hacer tú y que te tomó tiempo: andar en bicicleta, nadar, un instrumento, un deporte, hablar inglés. Cuenta cómo fue el proceso e incluye el momento en que te salió mal.",
  encasa: false,
  pistas: [
    "¿Cuándo empezaste y cuándo dirías que ya sabías?",
    "¿Cuál fue el peor momento? ¿Quisiste dejarlo?",
    "¿Quién te ayudó a seguir después de ese momento malo?"
  ],
  rubrica: [
    "Es algo real que me pasó a mí",
    "Conté al menos tres momentos distintos, en orden",
    "Incluí un momento en que me salió mal o quise rendirme",
    "Expliqué qué hizo que siguiera después de eso"
  ],
  cierre: "La diferencia entre acontecimiento y proceso deja de ser una definición para memorizar cuando la usas con tu propia historia. Y esa distinción es de las primeras que te van a preguntar."
},
{
  id: "t5", camp: "c5", concepto: "Intercambio y consecuencias",
  titulo: "Lo que hay sobre tu mesa esta noche",
  guia: "estaya",
  invita: "Todo lo que comes viajó desde algún lado. Mira tu plato esta noche y cuéntame qué encuentras.",
  caso: "Descubriste que la papa, el maíz, el tomate y el cacao salieron de América, y que el trigo, la vaca y la caña de azúcar llegaron desde Europa. Ese intercambio no terminó: está en tu cocina.",
  consigna: "Mira lo que hay para comer en tu casa hoy. Anota al menos cuatro alimentos y di cuáles son americanos y cuáles llegaron de fuera. Después responde: ¿cómo sería la comida chilena sin ese intercambio?",
  encasa: true,
  pistas: [
    "Americanos: papa, maíz, tomate, poroto, zapallo, palta, cacao, ají.",
    "Llegaron de fuera: trigo (el pan), arroz, carne de vaca y de pollo, azúcar, cebolla, café.",
    "Piensa en un plato chileno que te guste y quítale todo lo que no es americano. ¿Qué queda?"
  ],
  rubrica: [
    "Miré de verdad lo que hay en mi casa",
    "Anoté al menos cuatro alimentos",
    "Los separé bien entre americanos y de fuera",
    "Expliqué cómo cambiaría la comida chilena sin el intercambio"
  ],
  cierre: "El pastel de choclo tiene maíz americano y carne europea en el mismo plato. Lo que estudiaste no terminó en el siglo XVI: te lo comes hoy."
}
];
