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

### 4. Archivos que hay que enchufar

Agregar el `<script>` en `index.html` y el archivo en la lista de `sw.js`, subiendo el número de versión del caché (`aya-vN`) para que los dispositivos tomen la versión nueva.

## Criterios pedagógicos que hay que respetar

Estas decisiones son deliberadas. Si se cambian, se pierde lo que hace que la app enseñe en vez de solo preguntar.

1. **Producir antes que reconocer.** Elegir la alternativa correcta es el piso, no el techo. Cada unidad necesita escritura abierta con rúbrica.
2. **La rúbrica en vez de "¿te fue bien?".** Después de escribir, Leti marca una lista concreta de ideas clave. Lo que no marca es lo que hay que repasar.
3. **Enseñar para aprender.** Explicarle a Chupaya y corregir su malentendido vale más que diez preguntas de alternativas.
4. **Los distractores son errores reales.** Cada opción falsa debe ser una confusión que un niño de esta edad realmente tiene, no un relleno absurdo.
5. **Las habilidades, no solo los datos.** Si el profesor evalúa analizar fuentes o argumentar, la app tiene que hacer eso, no preguntar su definición.
6. **Mezclar temas.** Estudiar por bloques se siente bien y se olvida rápido.
7. **Sin ranking contra otros niños.** Compite contra sí misma.

## Memoria y sincronización

- El avance vive en `localStorage` con la clave `mision-aya-v1`.
- Con un **código de familia** de seis caracteres, el avance se guarda en Netlify Blobs y se une entre celular, tablet y computador. La función `fusionar()` combina sin perder nada: se queda con lo mejor de cada aparato.
- Siempre está disponible **Guardar copia** y **Restaurar copia** en archivo, sin necesitar internet ni cuentas.

## Pruebas y materiales del colegio

En el panel de adultos, pestaña **Pruebas**, se anota el calendario de pruebas y se adjunta el material de clase: texto pegado del profesor, fotos de la guía o del cuaderno, y archivos. La prueba más próxima manda el contador de la portada y el plan de estudio.

Desde ahí hay dos caminos:

- **Exportar para Claude** descarga un paquete de texto con la asignatura, la fecha, los temas y el material. Se pasa en una conversación y yo devuelvo el archivo de contenido. No necesita cuentas ni claves.
- **Generar expedición** hace lo mismo solo, llamando a la función `/api/generar` de Netlify, que usa la API de Anthropic con la variable `ANTHROPIC_API_KEY`. Lee también las fotos adjuntas. El resultado se guarda en `S.unidades` y queda activo de inmediato.

Las unidades generadas conviven con las de archivo: si `S.unidadActiva` apunta a una generada, el motor la usa en vez de `window.CONTENT`.

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

- App en Netlify (la buena, con memoria): `https://elaborate-lebkuchen-daa190.netlify.app`
- Código: `github.com/mtaylorcharme-web/expedicion-leti`
- App publicada: `mtaylorcharme-web.github.io/expedicion-leti`
- Panel de Mariana y Francisco: pestaña Papás, PIN inicial 1234

## Ruta del año

En `content-mundo.js`, la lista `EXPEDICIONES` define el plan por asignatura. Historia está activa; Science, Math, Lenguaje, English y Social Studies están marcadas como próximas. Cada una que se complete entrega más pistas hacia la Ciudad Aya.
