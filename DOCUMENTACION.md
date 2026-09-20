# Misión Aya · guía del proyecto

App de estudio para Leti, 5º básico, Colegio Bradford. Sirve para cualquier asignatura y cualquier unidad. Esta guía existe para que agregar una materia nueva no obligue a empezar de cero.

## La historia

Los Ayas (Ovaya, Chupaya y Estaya) son tres monos de calcetín reales, de la casa. Nacieron en la **Ciudad Aya**, en el Himalaya. Su nave falló y cayeron en una selva de otra época. Saltan de rama en rama por selvas de distintos países y siglos buscando el camino de vuelta.

- Cada **selva** es un tema de una unidad. Completarla entrega un **fragmento del mapa** y una **pista** sobre dónde está la Ciudad Aya.
- Hay **ocho lugares candidatos reales** del Himalaya. Cada pista descarta uno. Con una sola asignatura no alcanza: el juego está diseñado para durar todo el año.
- La **melodía de casa** tiene ocho notas y se completa con las pistas.
- **El gran salto** es el simulacro de prueba de cada unidad. Es distinto de la Ciudad Aya, que es la meta del año.

Regla de oro: los personajes nunca son adorno. Ovaya propone y celebra, Chupaya se pierde y hay que rescatarlo, Estaya canta y olvida la letra. Cada mecánica sale de una personalidad.

## Cómo está armado

Sin frameworks ni compilación. HTML, CSS y JavaScript plano. Se abre con doble clic o se sirve como archivos estáticos.

```
index.html                 carga los scripts en orden
css/app.css                todos los estilos
js/config.js               direcciones de los puentes de Netlify
js/characters.js           los tres Ayas: fotos, ánimos y animaciones
js/app.js                  el motor completo: estado, vistas y juegos
js/content-historia-u3.js  CONTENIDO de la unidad activa
js/content-fuentes.js      fuentes históricas para el taller
js/content-ensenar.js      lecciones de "Enséñale a Chupaya"
js/content-mundo.js        personajes, lugares, candidatos, pistas, expediciones
js/content-canciones.js    letras y estilos para generar música
js/content-causas.js       redes causales: qué provocó qué, por selva
js/content-desafio.js      "salto a ciegas": apostar antes de leer (opcional)
js/content-transferencia.js casos reales de su vida para aplicar cada concepto
netlify/functions/         puentes: música (cancion) y memoria (progreso)
assets/                    fotos de los Ayas, retratos históricos, mapa, música
```

El motor es agnóstico del contenido. Para una asignatura nueva se escribe un archivo de contenido nuevo y se enchufa.

## Agregar una unidad nueva

### 1. El archivo de contenido

Copia `js/content-historia-u3.js` y cambia los datos. La forma es:

```js
window.CONTENT = {
  unit: { id, subject, title, subtitle, test: { date, label }, topics: [] },
  camps: [{
    id: "c1", n: 1, name: "Selva del…", topic: "…",
    lugar: "Europa", epoca: "Siglo XV",      // sale en el mapa y en la cabecera
    icon: "⛵", color: "#4FB3C9", guide: "ovaya",
    intro: "lo que dice el guía al entrar",
    notes: [{ title, body }],                 // la bitácora, en páginas
    missions: [{ id: "c1m1", title, char, story, questions: [] }],
    flashcards: [[frente, reverso]]
  }],
  plan: [{ day, label, camps: ["c1"], extra }]
};
```

**Importante:** los `id` de misión deben seguir el patrón `c1m1`, `c1m2`, etc. De ahí cuelgan las selfies y el progreso.

### 2. Tipos de pregunta disponibles

El motor ya sabe corregir siete formatos. No hay que programar nada nuevo:

| `t` | Qué es | Campos |
|---|---|---|
| `mc` | alternativas | `q, opts[], a, why` |
| `fill` | completar con `___` | igual que `mc` |
| `tf` | verdadero o falso | `q, a (bool), why` |
| `order` | ordenar cronología | `q, items[] en orden correcto, why` |
| `match` | emparejar | `q, pairs[[a,b]], why` |
| `classify` | clasificar en grupos | `q, buckets[], items[[texto, índice]], why` |
| `write` | respuesta escrita | `q, modelo, keywords[]` |

Las de tipo `write` aceptan dictado por voz automáticamente.

### 3. Lo que se agrega aparte

- **Fuentes** (`content-fuentes.js`): documentos o imágenes reales con los cinco pasos de la guía del colegio. Campos `formato, origen, proposito, relevante, argumento`.
- **Lecciones de Chupaya** (`content-ensenar.js`): una por selva. Bloques verdaderos y falsos, una repregunta y un malentendido que corregir.
- **Mundo** (`content-mundo.js`): personajes con `mision` apuntando al id de la misión que desbloquea su selfie, y lugares con coordenadas reales para el mapa y Google Earth.
- **Canciones** (`content-canciones.js`): letra con marcas `[Verso]` y `[Coro]`, y un estilo en inglés para el generador.
- **Causas** (`content-causas.js`): una red causal por selva. `hechos` en orden cronológico real, `enlaces` con las uniones verdaderas y su explicación, `trampas` con uniones falsas que un niño de esta edad hace de verdad (sucesión sin causa, flecha invertida, saltarse pasos) y `cierre` con escritura y rúbrica. Es la actividad que enseña multicausalidad, que es lo que evalúa la unidad.
- **Salto a ciegas** (`content-desafio.js`): modalidad **opcional**, no reemplaza nada. Antes de leer la bitácora, Leti apuesta por una hipótesis y después ve qué pasó. Las opciones equivocadas tienen que ser razonables para quien aún no sabe: si una es absurda, no hay hipótesis, hay adivinanza. `nota` apunta al título de la página de la bitácora que lo explica.
- **Aquí y ahora** (`content-transferencia.js`): un caso **real** por selva, de su casa, su colegio o su país, para usar el concepto fuera de la historia. Se entra desde la selva o desde el final de «El hilo de las causas». Cuando `encasa` es verdadero hace falta preguntar o mirar algo fuera de la pantalla, y la actividad se puede dejar pendiente. Su texto queda guardado y reaparece la próxima vez. La rúbrica evalúa cómo pensó, no si acertó: en estos casos no hay una sola respuesta correcta.

### 4. Archivos que hay que enchufar

Agregar el `<script>` en `index.html` y el archivo en la lista de `sw.js`, subiendo el número de versión del caché (`aya-vN`) para que los dispositivos tomen la versión nueva.

## La portada

La vista `home` tiene tres piezas y cada una cumple una función:

- **La portada**: la foto recortada de los tres Ayas va entera, con `object-fit: contain`. Nunca se recorta: es la foto de sus monos reales. Detrás va la foto de la selva, difuminada y atenuada, y encima un dosel de hojas dibujado. Los cinco fragmentos del mapa se ven como casillas.
- **La brújula**: una sola línea que dice qué toca ahora (bitácora, misión concreta o gran salto) y lleva directo ahí. Existe para que nunca haya que adivinar por dónde seguir.
- **La selva**: se dibuja en planos, con árboles hechos como árboles. `troncoSVG` dibuja un polígono que se ensancha hacia la base, con su curva propia, vetas de corteza, un costado en sombra y contrafuertes de raíz; nunca un rectángulo. `ramaSVG` hace ramas que nacen del tronco, se afinan hacia la punta y se bifurcan, con hojas a lo largo. `racimo` apila hojas que se solapan, cada una desde un punto distinto y con su nervadura: un abanico que sale de un solo punto parece una escoba, no follaje. Hay seis troncos lejanos pálidos, tres medios y dos cercanos gruesos, más el dosel arriba, porque se está debajo de la copa.
- **De dónde se cuelgan**: las ramas horizontales están a alturas fijas (`ramasY`, en unidades del SVG) y son lo que sostiene a los Ayas. `anclar()` las convierte a píxeles con la altura real del mapa y estira la cuerda de cada uno (`--cuerda`) hasta la rama que tiene encima, así que ninguno cuelga del aire. Se recalcula al cambiar el tamaño de la ventana y cuando Ovaya viaja. Corre tres veces (inmediato, en el siguiente cuadro y a los 320 ms) porque al primer intento el mapa todavía no tiene altura.
- El mapa son unos 1.600 nodos de SVG. Si alguna vez va lento en tablet, el ahorro está en las hojas: son lo más numeroso.
- **El mapa**: Ovaya cuelga de una liana y se columpia; al tocar otra selva se balancea fuerte y viaja hasta ella. Se sitúa al lado libre del nodo (`ladoDe`) para no tapar el nombre. La selva actual lleva el cartel «Vas aquí» y un latido. Los adornos se quedan en los márgenes a propósito. Al entrar, el mapa se acomoda solo en la rama donde va.

## Dentro de una selva

La vista `camp` no es una lista de actividades: es una ruta con tres grupos, porque once filas idénticas no dicen cuál tocar.

- **La ruta de esta selva**: el salto a ciegas (opcional, va primero a propósito), la bitácora y las misiones, unidas por una liana vertical. El siguiente paso obligatorio lleva la marca «Sigue aquí».
- **Para entenderlo de verdad**: el hilo de las causas, aquí y ahora, enséñale a Chupaya y el taller de fuentes.
- **Para repasar jugando**: tarjetas, salto de lianas, piezas de la nave y la canción.

Arriba va una barra de avance con las misiones completadas y las estrellas. Si se agrega una actividad nueva, hay que decidir a qué grupo pertenece: `camino`, `hondo` o `repaso`.

## Nada se bloquea: se reserva la recompensa

Decisión de diseño importante, tomada pensando en la víspera de una prueba: **ninguna selva, misión, fuente ni el gran salto están bloqueados**. Una puerta cerrada tiene sentido en una aventura, pero si el miércoles quiere reforzar la selva 4 y la app le dice que primero termine la 3, la app está estorbando justo cuando debería ayudar.

Lo que sigue siendo secuencial es la **recompensa**: el fragmento del mapa, el sello y la pista hacia la Ciudad Aya se ganan completando la selva, en el orden que sea. Y el camino sugerido se sigue viendo: la brújula de la portada, el cartel «Vas aquí» y el paso marcado dentro de cada selva.

En el código: `campUnlocked()` y `missionUnlocked()` devuelven siempre verdadero; `campEnOrden(c)` dice hasta dónde llegó siguiendo el camino y solo sirve para marcar («por delante» en el mapa, aviso de Chupaya al entrar). `listaParaSalto` avisa si va con pocas selvas al gran salto, pero no lo impide.

La expectativa vive en lo que todavía no tiene, no en lo que no puede abrir.

## Las tarjetas de memoria

Los botones «La sé» y «Repasar después» aparecen **solo después de dar vuelta la tarjeta**. Antes estaban visibles desde el principio, así que se podía decir «la sé» sin haber visto la respuesta, que es adivinar y no evaluarse. Mientras la tarjeta está por el frente, el pie dice «Piensa la respuesta y toca la tarjeta».

## La bienvenida

La presentación usaba la foto real de la selva **recortada a la fuerza** como fondo, y los Ayas de esa foto salían cortados por arriba y por abajo. Ahora esa foto va difuminada y atenuada como atmósfera, y encima va el Aya recortado, entero, grande y centrado; el último paso muestra a los tres juntos, también completos. Regla del proyecto: las fotos de los Ayas nunca se recortan.

## Enséñale a Chupaya

La memoria de Chupaya es el sentido de la actividad —él olvidó y ella lo llena explicándole—, así que se dibuja como un **frasco que se llena**, con el porcentaje grande al lado y un brinco cada vez que sube. Antes era una barra gris de tres píxeles arriba del todo, donde no la miraba nadie. La portada dice además de qué lección se trata.

## La Ciudad Aya

La búsqueda de casa tiene un **mapa satelital real del Himalaya**: `assets/mapa/himalaya.jpg`, un recorte de la capa Blue Marble de la NASA (GIBS), dominio público, en proyección equirectangular, con límites exactos **20°N a 42°N y 70°E a 100°E**. Los ocho lugares se colocan con una regla de tres sobre esos límites, guardados en `LIMITES_HIMALAYA`. **Si se reemplaza la imagen hay que mantener esos límites o actualizar la constante**, o los puntos dejan de caer donde corresponde; está anotado también en `assets/mapa/FUENTES.txt`.

Katmandú, Namche, Paro y Thimphu están a pocos kilómetros entre sí, así que cada rótulo lleva su lado asignado a mano en `LADO_ROTULO` para que no se pisen.

Cada pista tacha un lugar y eso se ve: el punto se apaga y el nombre queda tachado. Cuando quede uno solo, se enciende en dorado. Tocar un punto resalta su ficha más abajo.

## Repaso

Tiene dos partes. **Repaso de errores**, que es la repetición espaciada de lo que falló, y **Repaso a la medida**, donde elige qué selvas quiere practicar y se arma una ronda de diez preguntas, haya fallado o no. Lo segundo es lo que se usa de verdad la semana de la prueba: poder decir «hoy quiero la Conquista de México» sin depender de haberse equivocado antes.

El bloque a la medida aparece siempre, también cuando no queda ningún error pendiente.

## La bitácora

El encabezado lleva un índice de páginas tocable: dorada la actual, crema las que ya vio, gris las que no. Se puede saltar a cualquiera, que es lo que hace falta al repasar la víspera de la prueba; antes había que pasar una por una. El botón de terminar aparece en cuanto ha visto todas, no solo estando en la última.

## Las selfies

El Aya se asoma dentro del encuadre, entero, con un halo blanco y una sombra que lo separan del cuadro antiguo: sobre un retrato oscuro, sin ese contraste, se confundía con la pintura y solo se le distinguían los brazos. Va inclinado, como quien se mete en la foto. En el álbum se dibuja más pequeño (`--s:46px`) para no comerse la miniatura.

## Cuidado con `.pin`

`.pin` se usaba para dos cosas distintas: la tarjeta donde se escribe el PIN del panel de adultos y los puntos del mapa mundi. Las reglas del mapa ganaban por orden y aplastaban la tarjeta a 26 píxeles, así que la primera pantalla que veían Mariana y Francisco estaba rota. La tarjeta se llama ahora `.clave`. Al agregar clases, conviene revisar que el nombre no exista ya.

## El pasaporte

Los sellos que faltan muestran **su propio símbolo en silueta gris** y una línea que dice cómo se ganan («Analiza una fuente entera», «Supera el gran salto»), más el contador de conseguidos. Antes eran veinte círculos vacíos idénticos con un punto al centro: un hueco no es una meta.

Si se agrega un sello nuevo, hay que sumarle su pista en `comoSeGana(id)`; por defecto devuelve la de completar una selva.

## El taller de fuentes

En la lista, cada fuente muestra **la fuente misma**: las visuales, su propia imagen; las escritas, un papelito con un trozo del documento real. Antes había un emoji genérico igual para todas, que en un taller de análisis de fuentes es justo lo contrario de lo que se quiere enseñar: mirar la fuente.

Si se agrega una fuente nueva con `img`, la miniatura sale sola; si es escrita, se recorta de su campo `texto`.

## Escribir sin quedarse atascada

`medidorEscritura(cont, idTexto, idBoton, minPalabras)` acompaña cualquier campo de escritura: muestra cuántas palabras faltan, se pone verde al llegar, y **deja el botón siempre activo**. Si todavía falta, al tocarlo avisa, tiembla y devuelve el foco al campo, en vez de quedarse apagado sin decir nada. Ya está en «Aquí y ahora»; conviene usarlo en el resto de los campos de escritura.

Un botón deshabilitado sin explicación es de los peores momentos de una interfaz para un niño: escribe, toca, no pasa nada y no sabe por qué.

## El salto a ciegas, por dentro

La pantalla de revelación premia **haber apostado**, no haber acertado: medalla dorada arriba («¡Apostaste sin red!»), la apuesta propia en ámbar cálido —nunca en gris de error— y la explicación como pieza principal, en verde y con más cuerpo de texto. Chupaya celebra igual cuando ella falla.

Si el fallo se pinta apagado al lado de un verde triunfal, el diseño desmiente lo que dice el texto, y el niño aprende lo que ve, no lo que lee.

## El hilo de las causas, por dentro

El paso de unir causas lleva una barra pegada arriba (`.estadohilo`) que dice en todo momento qué toca hacer: «Toca el hecho que fue la causa» y, cuando hay uno elegido, «Ahora toca lo que provocó «…»» con un botón Soltar. Al lado va un tramo por unión y el conteo. Cada tarjeta indica de cuántas flechas ya forma parte.

Antes la instrucción vivía en la burbuja del guía, que se escribía y se olvidaba, y la respuesta aparecía al final de la lista, fuera de pantalla. En una actividad de dos toques el estado tiene que verse siempre.

## La pantalla de misión

La cabecera lleva un tramo por pregunta (`.tramo`): verdes las contestadas, dorado el actual, más el conteo «3 de 8» y las vidas. Una barra lisa al 0 % parecía rota y no decía cuántas faltaban.

Las ayudas de los Ayas van **debajo** de la pregunta, no encima: arriba manda la pregunta, y abajo quedan al alcance del pulgar. Cada una dice qué hace en vez de una sola palabra: «te cubre un fallo», «quita una mala», «lee en voz alta».

## Criterios pedagógicos que hay que respetar

Estas decisiones son deliberadas. Si se cambian, se pierde lo que hace que la app enseñe en vez de solo preguntar.

1. **Producir antes que reconocer.** Elegir la alternativa correcta es el piso, no el techo. Cada unidad necesita escritura abierta con rúbrica.
2. **La rúbrica en vez de "¿te fue bien?".** Después de escribir, Leti marca una lista concreta de ideas clave. Lo que no marca es lo que hay que repasar.
3. **Enseñar para aprender.** Explicarle a Chupaya y corregir su malentendido vale más que diez preguntas de alternativas.
4. **Los distractores son errores reales.** Cada opción falsa debe ser una confusión que un niño de esta edad realmente tiene, no un relleno absurdo.
5. **Las habilidades, no solo los datos.** Si el profesor evalúa analizar fuentes o argumentar, la app tiene que hacer eso, no preguntar su definición.
6. **Mezclar temas.** Estudiar por bloques se siente bien y se olvida rápido.
7. **Sin ranking contra otros niños.** Compite contra sí misma.
8. **Causalidad, no cronología.** Ordenar fechas es el piso. El aprendizaje está en unir qué provocó qué, y en distinguir una sucesión de una causa. Por eso cada red causal incluye trampas deliberadas.
9. **Intentar antes de que te expliquen, como opción.** Fallar una predicción propia hace que la explicación posterior se fije mucho más. Va como modalidad aparte y voluntaria: obligarla a fallar siempre desgasta, poder elegir arriesgarse motiva.
10. **Si solo funciona con Colón, no lo aprendió.** Cada concepto se aplica al menos una vez a un caso real de su vida. Los casos tienen que ser verificables por ella —lo que hay en su cocina, por qué eligieron su colegio—, nunca inventados, y varios la obligan a salir de la pantalla y hablar con alguien.

## Memoria y sincronización

- El avance vive en `localStorage` con la clave `mision-aya-v1`.
- Con un **código de familia** de seis caracteres, el avance se guarda en Netlify Blobs y se une entre celular, tablet y computador. La función `fusionar()` combina sin perder nada: se queda con lo mejor de cada aparato.
- Siempre está disponible **Guardar copia** y **Restaurar copia** en archivo, sin necesitar internet ni cuentas.

## Pruebas y materiales del colegio

En el panel de adultos, pestaña **Pruebas**, se anota el calendario de pruebas y se adjunta el material de clase: texto pegado del profesor, fotos de la guía o del cuaderno, y archivos. La prueba más próxima manda el contador de la portada y el plan de estudio.

Los dos caminos de abajo generan la unidad **completa**, con `extras` incluidos: sin ellos la expedición queda como un cuestionario y pierde justo lo que hace que la app enseñe.

Desde ahí hay dos caminos:

- **Exportar para Claude** descarga un paquete de texto con la asignatura, la fecha, los temas y el material. Se pasa en una conversación y yo devuelvo el archivo de contenido. No necesita cuentas ni claves.
- **Generar expedición** hace lo mismo solo, llamando a la función `/api/generar` de Netlify, que usa la API de Anthropic con la variable `ANTHROPIC_API_KEY`. Lee también las fotos adjuntas. El resultado se guarda en `S.unidades` y queda activo de inmediato.

Las unidades generadas conviven con las de archivo: si `S.unidadActiva` apunta a una generada, el motor la usa en vez de `window.CONTENT`.

**El material de apoyo pertenece a una unidad, no al motor.** Las fuentes, las lecciones de Chupaya, las redes causales, el salto a ciegas, la transferencia y las canciones se resuelven con `material(clave, nombreGlobal)`: una unidad generada usa lo que traiga en su propio `extras`, y los archivos `js/content-*.js` valen solo para la unidad de archivo. Así una expedición de Science nunca muestra la red causal de Historia en su selva `c1`. Si una unidad no trae cierto material, ese paso simplemente no aparece en la selva. Las claves de `extras` son `causas`, `desafio`, `transferencia`, `ensenar`, `fuentes` y `canciones`.

## Puentes de Netlify

Tres funciones, ambas con las claves guardadas en el servidor y nunca en la página.

| Función | Ruta | Variables |
|---|---|---|
| Música | `/api/cancion` | `PROVEEDOR` (mureka, elevenlabs, suno), `MUSICA_API_KEY` |
| Memoria | `/api/progreso` | ninguna; usa Netlify Blobs |
| Generador | `/api/generar` | `ANTHROPIC_API_KEY` |

Si la app vive en GitHub Pages, hay que pegar las direcciones completas del sitio de Netlify en el panel de Mariana y Francisco.

**Suno no tiene API pública.** Lo verifiqué en su sitio y en sus planes. Las canciones se crean a mano copiando la letra y el estilo desde la app, o con otro proveedor que sí tenga API.

## Dónde vive todo

- App en Netlify (la buena, con memoria): `https://mision-aya.netlify.app`
- Código: `github.com/mtaylorcharme-web/expedicion-leti`
- App publicada: `mtaylorcharme-web.github.io/expedicion-leti`
- Panel de Mariana y Francisco: pestaña Papás, PIN inicial 1234

## Ruta del año

En `content-mundo.js`, la lista `EXPEDICIONES` define el plan por asignatura. Historia está activa; Science, Math, Lenguaje, English y Social Studies están marcadas como próximas. Cada una que se complete entrega más pistas hacia la Ciudad Aya.
