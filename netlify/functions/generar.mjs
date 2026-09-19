/* Misión Aya · generador de expediciones
   Recibe el material de una prueba y devuelve el contenido de una expedición nueva.
   Variable de entorno en Netlify: ANTHROPIC_API_KEY */

const ORIGENES = (process.env.ORIGENES || "https://mtaylorcharme-web.github.io").split(",").map(s => s.trim()).filter(Boolean);
const cors = o => ({ "Access-Control-Allow-Origin": (!o || ORIGENES.some(x => o.startsWith(x))) ? (o || "*") : ORIGENES[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "POST,OPTIONS", "Content-Type": "application/json; charset=utf-8" });

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
 "plan": [{"day":0,"label":"Salto 1 · lugar","camps":["c1"],"extra":"Bitácora + 3 saltos"}]
}

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
8. La bitácora explica con claridad antes de preguntar. Nunca preguntes algo que no esté en la bitácora o en el material.`;

export default async (req) => {
  const H = cors(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response("", { status: 204, headers: H });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "metodo_no_permitido" }), { status: 405, headers: H });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: "falta_clave", mensaje: "Falta configurar ANTHROPIC_API_KEY en Netlify." }), { status: 500, headers: H });
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
      body: JSON.stringify({ model: "claude-sonnet-5", max_tokens: 16000, system: INSTRUCCIONES, messages: [{ role: "user", content: contenido }] })
    });
    const d = await r.json();
    if (!r.ok) return new Response(JSON.stringify({ error: "api_rechazo", mensaje: d?.error?.message || `HTTP ${r.status}` }), { status: 502, headers: H });
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
