/* Misión Aya · generador de expediciones
   Recibe el material de una prueba y devuelve el contenido de una expedición nueva.
   Variable de entorno en Netlify: ANTHROPIC_API_KEY */

const ORIGENES = (process.env.ORIGENES || "https://mision-aya.netlify.app,https://mtaylorcharme-web.github.io").split(",").map(s => s.trim()).filter(Boolean);
const cors = o => ({ "Access-Control-Allow-Origin": (!o || ORIGENES.some(x => o.startsWith(x))) ? (o || "*") : ORIGENES[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Content-Type": "application/json; charset=utf-8" });

const INSTRUCCIONES = `Eres el generador de contenido de Misión Aya, una app de estudio para una niña de 11 años de 5º básico del Colegio Bradford (Chile, currículo MINEDUC, colegio IB). Las asignaturas van en inglés salvo Lenguaje.

Devuelve SOLO un objeto JSON válido, sin texto antes ni después, con esta forma exacta:

{
 "unit": {"id":"slug-corto","subject":"...","title":"...","subtitle":"...","test":{"date":"AAAA-MM-DD","label":"..."},"topics":["..."]},
 "camps": [{
   "id":"c1","n":1,"name":"Selva de …","topic":"...","lugar":"País o región","epoca":"Época o año",
   "icon":"un emoji","color":"#4FB3C9","guide":"ovaya|chupaya|estaya",
   "intro":"lo que dice el guía al llegar, 2 frases",
   "notes":[{"title":"...","body":"HTML simple con <b> para los conceptos clave"}],
   "missions":[{"id":"c1m1","title":"...","char":"ovaya|chupaya|estaya","story":"...","questions":[...]}],
   "flashcards":[["concepto","explicación"]]
 }],
 "plan": [{"day":0,"label":"Salto 1 · lugar","camps":["c1"],"extra":"Bitácora + 3 saltos"}],
 "extras": {
   "causas": [{
     "id":"ca1","camp":"c1","titulo":"¿Por qué …?","guia":"ovaya|chupaya|estaya",
     "intro":"lo que dice el guía","pregunta":"la pregunta causal de esta selva",
     "hechos":[{"id":"h1","t":"un hecho","fecha":"año o período"}],
     "enlaces":[{"de":"h1","a":"h3","por":"por qué el primero provocó el segundo"}],
     "trampas":[{"de":"h5","a":"h6","por":"por qué esa flecha NO corresponde"}],
     "cierre":{"q":"pregunta abierta","modelo":"respuesta modelo","rubrica":["idea clave 1","idea clave 2"]}
   }],
   "desafio": [{
     "id":"d1","camp":"c1","invita":"lo que dice Chupaya",
     "retos":[{"q":"predicción sobre algo que aún no ha leído","opciones":["a","b","c","d"],"correcta":2,
               "revelacion":"qué pasó de verdad y por qué la intuición más común falla",
               "nota":"título exacto de la página de notes que lo explica"}]
   }],
   "transferencia": [{
     "id":"t1","camp":"c1","concepto":"el concepto de esta selva","titulo":"...","guia":"ovaya",
     "invita":"lo que dice el guía","caso":"recuerda el concepto recién aprendido",
     "consigna":"aplícalo a un caso REAL de su vida","encasa":true,
     "pistas":["preguntas que la ayuden a partir"],
     "rubrica":["cómo pensó, no si acertó"],
     "cierre":"por qué esto importa"
   }],
   "ensenar": [{
     "id":"e1","camp":"c1","titulo":"...",
     "armar":{"pregunta":"...","bloques":[{"t":"afirmación","ok":true}]},
     "repregunta":{"q":"lo que pregunta Chupaya","opts":["..."],"a":0,"why":"..."},
     "confusion":{"dice":"el malentendido de Chupaya","correcto":"..."},
     "escribir":{"pregunta":"...","modelo":"...","rubrica":["..."]}
   }]
 }
}

El bloque "extras" es obligatorio: sin él la expedición queda como un cuestionario y
pierde justo lo que hace que la app enseñe. Una entrada de cada tipo por selva.

Tipos de pregunta permitidos, todos ya soportados por el motor:
- {"t":"mc","q":"...","opts":["a","b","c","d"],"a":0,"why":"por qué"}
- {"t":"fill","q":"frase con ___","opts":[...],"a":0,"why":"..."}
- {"t":"tf","q":"afirmación","a":true,"why":"..."}
- {"t":"order","q":"...","items":["en el orden correcto"],"why":"..."}
- {"t":"match","q":"...","pairs":[["a","b"]],"why":"..."}
- {"t":"classify","q":"...","buckets":["g1","g2"],"items":[["texto",0]],"why":"..."}
- {"t":"write","q":"...","modelo":"respuesta modelo","keywords":["clave1","clave2"]}

Reglas que debes respetar:
1. Entre 3 y 5 selvas, cada una con 2 o 3 misiones de 7 a 8 preguntas, y 8 a 14 tarjetas.
2. Cada selva necesita lugar y época reales, porque Los Ayas viajan por el mundo y por el tiempo.
3. Cada misión debe terminar con al menos una pregunta de tipo "write".
4. Los distractores deben ser confusiones reales de un niño de 11 años, nunca relleno absurdo.
5. El campo "why" explica el porqué, no repite la respuesta.
6. Personajes: Ovaya es curioso y celebra, Chupaya se pierde y hay que rescatarlo, Estaya canta y olvida.
7. Español neutro, trato de tú. Si la asignatura va en inglés, las preguntas van en inglés con la ayuda en español.
8. La bitácora explica con claridad antes de preguntar. Nunca preguntes algo que no esté en la bitácora o en el material.

Reglas de "extras", que son las que hacen que esto enseñe y no solo pregunte:
9. CAUSAS: los "hechos" van en orden cronológico real (el motor los baraja). Los "enlaces" son causa → consecuencia, nunca mera sucesión. Las "trampas" son los tres errores reales de esta edad: dos hechos seguidos que no se causan, la flecha invertida, y saltarse los pasos del medio. Cada "por" explica el error, no lo repite.
10. DESAFIO: son predicciones ANTES de leer. Ninguna opción puede ser absurda: todas deben ser razonables para quien aún no sabe, o deja de ser una hipótesis y pasa a ser una adivinanza. "nota" debe coincidir EXACTO con un "title" de notes de esa selva.
11. TRANSFERENCIA: el caso tiene que ser REAL y verificable por una niña de 11 años en Chile: su casa, su colegio, su ciudad, su propia vida. Nada hipotético ni inventado. Marca "encasa": true cuando haga falta preguntarle a alguien o mirar algo fuera de la pantalla. La rúbrica evalúa cómo pensó, nunca si acertó.
12. ENSENAR: Chupaya entiende mal a propósito y ella lo corrige. El malentendido debe ser uno que un niño de verdad tiene.
13. Si el material de clase no alcanza para alguna parte de "extras", omite esa entrada antes que inventar datos falsos.`;

export default async (req) => {
  const H = cors(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response("", { status: 204, headers: H });
  if (req.method !== "POST" && req.method !== "GET") return new Response(JSON.stringify({ error: "metodo_no_permitido" }), { status: 405, headers: H });
  /* La clave se lee tal cual viene de Netlify y se limpia: al pegarla es muy fácil que
     arrastre un espacio o un salto de línea, y la API la rechaza sin decir por qué. */
  const cruda = process.env.ANTHROPIC_API_KEY || "";
  const key = cruda.trim().replace(/[\r\n\t]/g, "");
  const diagnostico = {
    configurada: !!cruda,
    tenia_espacios: !!cruda && cruda !== key,
    empieza_bien: key.startsWith("sk-ant-"),
    largo_razonable: key.length > 40,
    modelo: "claude-sonnet-5"
  };
  /* Un GET revisa la clave sin gastar una llamada a la API. Nunca devuelve la clave. */
  if (req.method === "GET") {
    /* Con ?prueba=1 hace una llamada mínima para confirmar que la clave sirve de verdad,
       sin generar nada: gasta una fracción de centavo. */
    if (key && new URL(req.url).searchParams.get("prueba")) {
      try {
        const t = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
          body: JSON.stringify({ model: "claude-sonnet-5", max_tokens: 8, messages: [{ role: "user", content: "di ok" }] })
        });
        const dd = await t.json();
        return new Response(JSON.stringify({ diagnostico, prueba: { ok: t.ok, estado: t.status, detalle: t.ok ? "Anthropic aceptó la clave." : (dd?.error?.message || "").slice(0, 200) } }), { status: 200, headers: H });
      } catch (e) { return new Response(JSON.stringify({ diagnostico, prueba: { ok: false, detalle: String(e).slice(0, 120) } }), { status: 200, headers: H }); }
    }
    return new Response(JSON.stringify({ diagnostico }), { status: 200, headers: H });
  }
  if (!key) return new Response(JSON.stringify({ error: "falta_clave", mensaje: "Falta configurar ANTHROPIC_API_KEY en Netlify.", diagnostico }), { status: 500, headers: H });
  try {
    const { paquete, imagenes = [] } = await req.json();
    const contenido = [];
    for (const img of imagenes.slice(0, 6)) {
      const m = /^data:(image\/\w+);base64,(.+)$/.exec(img || "");
      if (m) contenido.push({ type: "image", source: { type: "base64", media_type: m[1], data: m[2] } });
    }
    contenido.push({ type: "text", text: `Genera la expedición con este material del colegio.\n\n${JSON.stringify(paquete, null, 2)}` });

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-5", max_tokens: 32000, system: INSTRUCCIONES, messages: [{ role: "user", content: contenido }] })
    });
    const d = await r.json();
    if (!r.ok) {
      const razon = d?.error?.message || `HTTP ${r.status}`;
      const ayuda = /x-api-key|authentication/i.test(razon)
        ? "Anthropic no acepta la clave. Hay que generar una nueva en console.anthropic.com y pegarla en Netlify, en ANTHROPIC_API_KEY, sin espacios."
        : /credit|balance|quota/i.test(razon) ? "La cuenta de Anthropic no tiene saldo disponible."
        : /model/i.test(razon) ? "Ese modelo no está disponible para esta cuenta."
        : "";
      return new Response(JSON.stringify({ error: "api_rechazo", mensaje: razon, ayuda, diagnostico }), { status: 502, headers: H });
    }
    const txt = (d.content || []).filter(c => c.type === "text").map(c => c.text).join("");
    const i = txt.indexOf("{"), j = txt.lastIndexOf("}");
    if (i < 0 || j < 0) return new Response(JSON.stringify({ error: "sin_json", mensaje: "La respuesta no traía contenido utilizable." }), { status: 502, headers: H });
    let contenidoFinal;
    try { contenidoFinal = JSON.parse(txt.slice(i, j + 1)); }
    catch (e) { return new Response(JSON.stringify({ error: "json_invalido", mensaje: "El contenido generado no se pudo leer." }), { status: 502, headers: H }); }
    if (!contenidoFinal.unit || !Array.isArray(contenidoFinal.camps) || !contenidoFinal.camps.length)
      return new Response(JSON.stringify({ error: "contenido_incompleto", mensaje: "Faltaron selvas en la expedición generada." }), { status: 502, headers: H });
    return new Response(JSON.stringify({ contenido: contenidoFinal }), { status: 200, headers: H });
  } catch (e) {
    return new Response(JSON.stringify({ error: "fallo", mensaje: String(e).slice(0, 200) }), { status: 500, headers: H });
  }
};

export const config = { path: "/api/generar" };
