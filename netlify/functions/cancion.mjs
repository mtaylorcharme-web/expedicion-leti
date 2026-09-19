/* Misión Aya · puente hacia Suno
   La clave vive aquí, en el servidor de Netlify, y nunca viaja al navegador.
   Variables de entorno que hay que configurar en Netlify:
     SUNO_API_KEY   (obligatoria)  la clave de tu proveedor de Suno
     SUNO_API_BASE  (opcional)     por defecto https://api.sunoapi.org
     SUNO_MODEL     (opcional)     por defecto V4_5
     ORIGENES       (opcional)     lista separada por comas de sitios autorizados
*/

const BASE = (process.env.SUNO_API_BASE || "https://api.sunoapi.org").replace(/\/+$/, "");
const MODEL = process.env.SUNO_MODEL || "V4_5";
const ORIGENES = (process.env.ORIGENES || "https://mtaylorcharme-web.github.io").split(",").map(s => s.trim()).filter(Boolean);

const cors = origin => {
  const ok = !origin || ORIGENES.some(o => origin === o || origin.startsWith(o));
  return {
    "Access-Control-Allow-Origin": ok ? (origin || "*") : ORIGENES[0],
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Content-Type": "application/json; charset=utf-8"
  };
};

/* Busca la primera URL de audio dentro de cualquier forma de respuesta */
function buscarAudio(x, visto = new Set()) {
  if (!x || typeof x !== "object" || visto.has(x)) return null;
  visto.add(x);
  for (const [k, v] of Object.entries(x)) {
    if (typeof v === "string" && /^https?:\/\/\S+\.(mp3|m4a|wav)(\?|$)/i.test(v)) return v;
    if (typeof v === "string" && /audio/i.test(k) && /^https?:\/\//.test(v)) return v;
  }
  for (const v of Object.values(x)) {
    if (typeof v === "object") { const r = buscarAudio(v, visto); if (r) return r; }
  }
  return null;
}
function buscarEstado(x) {
  const s = JSON.stringify(x || {});
  if (/"(status|state)"\s*:\s*"?(SUCCESS|complete|completed|succeeded)"?/i.test(s)) return "listo";
  if (/"(status|state)"\s*:\s*"?(FAILED|error|CREATE_TASK_FAILED|GENERATE_AUDIO_FAILED|SENSITIVE_WORD_ERROR)"?/i.test(s)) return "error";
  return "trabajando";
}

export default async (req) => {
  const origin = req.headers.get("origin");
  const H = cors(origin);
  if (req.method === "OPTIONS") return new Response("", { status: 204, headers: H });

  const key = process.env.SUNO_API_KEY;
  if (!key) return new Response(JSON.stringify({ error: "falta_clave", mensaje: "Falta configurar SUNO_API_KEY en Netlify." }), { status: 500, headers: H });

  try {
    if (req.method === "POST") {
      const b = await req.json();
      const titulo = String(b.titulo || "Canción de Estaya").slice(0, 80);
      const estilo = String(b.estilo || "cheerful pop for kids, Spanish lyrics").slice(0, 400);
      const letra = String(b.letra || "").slice(0, 4000);
      if (!letra.trim()) return new Response(JSON.stringify({ error: "sin_letra" }), { status: 400, headers: H });

      const r = await fetch(`${BASE}/api/v1/generate`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ customMode: true, instrumental: false, model: MODEL, title: titulo, style: estilo, prompt: letra, callBackUrl: "https://example.com/sin-callback" })
      });
      const data = await r.json().catch(() => ({}));
      const taskId = data?.data?.taskId || data?.taskId || data?.data?.task_id || data?.id;
      if (!r.ok || !taskId) return new Response(JSON.stringify({ error: "suno_rechazo", detalle: data?.msg || data?.message || `HTTP ${r.status}` }), { status: 502, headers: H });
      return new Response(JSON.stringify({ taskId }), { status: 200, headers: H });
    }

    if (req.method === "GET") {
      const taskId = new URL(req.url).searchParams.get("taskId");
      if (!taskId) return new Response(JSON.stringify({ error: "sin_taskId" }), { status: 400, headers: H });
      const r = await fetch(`${BASE}/api/v1/generate/record-info?taskId=${encodeURIComponent(taskId)}`, { headers: { "Authorization": `Bearer ${key}` } });
      const data = await r.json().catch(() => ({}));
      const audio = buscarAudio(data);
      const estado = audio ? "listo" : buscarEstado(data);
      return new Response(JSON.stringify({ estado, audio, detalle: estado === "error" ? (data?.msg || data?.data?.errorMessage || "la generación falló") : undefined }), { status: 200, headers: H });
    }

    return new Response(JSON.stringify({ error: "metodo_no_permitido" }), { status: 405, headers: H });
  } catch (e) {
    return new Response(JSON.stringify({ error: "fallo_puente", detalle: String(e).slice(0, 200) }), { status: 500, headers: H });
  }
};

export const config = { path: "/api/cancion" };
