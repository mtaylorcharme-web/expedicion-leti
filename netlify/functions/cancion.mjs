/* Misión Aya · puente hacia el generador de música
   La clave vive aquí, en el servidor de Netlify, y nunca llega al navegador.

   Variables de entorno en Netlify:
     PROVEEDOR      mureka | elevenlabs | suno      (por defecto: mureka)
     MUSICA_API_KEY la clave del proveedor elegido  (obligatoria)
     MUSICA_API_BASE  opcional, si el proveedor usa otra dirección
     ORIGENES       opcional, sitios autorizados separados por comas
*/

const PROVEEDOR = (process.env.PROVEEDOR || "mureka").toLowerCase();
const KEY = process.env.MUSICA_API_KEY || process.env.SUNO_API_KEY;
const ORIGENES = (process.env.ORIGENES || "https://mtaylorcharme-web.github.io").split(",").map(s => s.trim()).filter(Boolean);

const BASES = { mureka: "https://api.mureka.ai", elevenlabs: "https://api.elevenlabs.io", suno: "https://api.sunoapi.org" };
const BASE = (process.env.MUSICA_API_BASE || process.env.SUNO_API_BASE || BASES[PROVEEDOR] || BASES.mureka).replace(/\/+$/, "");

const cors = origin => {
  const ok = !origin || ORIGENES.some(o => origin === o || origin.startsWith(o));
  return { "Access-Control-Allow-Origin": ok ? (origin || "*") : ORIGENES[0], "Access-Control-Allow-Headers": "content-type", "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Content-Type": "application/json; charset=utf-8" };
};
const json = (o, s, h) => new Response(JSON.stringify(o), { status: s || 200, headers: h });

/* Busca la primera URL de audio en cualquier forma de respuesta */
function buscarAudio(x, visto = new Set()) {
  if (!x || typeof x !== "object" || visto.has(x)) return null;
  visto.add(x);
  for (const [k, v] of Object.entries(x)) {
    if (typeof v === "string" && /^https?:\/\/\S+\.(mp3|m4a|wav|flac)(\?|$)/i.test(v)) return v;
    if (typeof v === "string" && /(audio|url|mp3)/i.test(k) && /^https?:\/\//.test(v)) return v;
  }
  for (const v of Object.values(x)) if (typeof v === "object") { const r = buscarAudio(v, visto); if (r) return r; }
  return null;
}
function estadoDe(x) {
  const s = JSON.stringify(x || {});
  if (/"(status|state)"\s*:\s*"?(succeeded|success|SUCCESS|complete|completed|finished)"?/i.test(s)) return "listo";
  if (/"(status|state)"\s*:\s*"?(failed|FAILED|error|cancelled|timeouted)"?/i.test(s)) return "error";
  return "trabajando";
}

async function crear({ titulo, estilo, letra }) {
  if (PROVEEDOR === "elevenlabs") {
    const r = await fetch(`${BASE}/v1/music`, {
      method: "POST",
      headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: `${estilo}. Title: ${titulo}. Sing exactly these Spanish lyrics:\n${letra}`, music_length_ms: 150000 })
    });
    if (!r.ok) { const t = await r.text().catch(() => ""); return { error: `HTTP ${r.status} ${t.slice(0, 160)}` }; }
    const buf = Buffer.from(await r.arrayBuffer());
    return { audio: `data:audio/mpeg;base64,${buf.toString("base64")}` };
  }
  if (PROVEEDOR === "mureka") {
    const r = await fetch(`${BASE}/v1/song/generate`, {
      method: "POST", headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ lyrics: letra, model: "auto", prompt: estilo })
    });
    const d = await r.json().catch(() => ({}));
    const id = d.id || d.task_id || d.data?.task_id;
    if (!r.ok || !id) return { error: d.message || d.error?.message || `HTTP ${r.status}` };
    return { taskId: String(id) };
  }
  const r = await fetch(`${BASE}/api/v1/generate`, {
    method: "POST", headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ customMode: true, instrumental: false, model: process.env.SUNO_MODEL || "V4_5", title: titulo, style: estilo, prompt: letra, callBackUrl: "https://example.com/sin-callback" })
  });
  const d = await r.json().catch(() => ({}));
  const id = d?.data?.taskId || d?.taskId || d?.id;
  if (!r.ok || !id) return { error: d?.msg || d?.message || `HTTP ${r.status}` };
  return { taskId: String(id) };
}

async function consultar(taskId) {
  const url = PROVEEDOR === "mureka" ? `${BASE}/v1/song/query/${encodeURIComponent(taskId)}`
    : `${BASE}/api/v1/generate/record-info?taskId=${encodeURIComponent(taskId)}`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${KEY}` } });
  const d = await r.json().catch(() => ({}));
  const audio = buscarAudio(d);
  return { estado: audio ? "listo" : estadoDe(d), audio, detalle: d?.message || d?.msg };
}

export default async (req) => {
  const H = cors(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response("", { status: 204, headers: H });
  if (!KEY) return json({ error: "falta_clave", mensaje: "Falta configurar MUSICA_API_KEY en Netlify." }, 500, H);
  try {
    if (req.method === "POST") {
      const b = await req.json();
      const letra = String(b.letra || "").slice(0, 4000);
      if (!letra.trim()) return json({ error: "sin_letra" }, 400, H);
      const r = await crear({ titulo: String(b.titulo || "Canción").slice(0, 80), estilo: String(b.estilo || "cheerful pop for kids, Spanish lyrics").slice(0, 400), letra });
      if (r.error) return json({ error: "proveedor_rechazo", mensaje: `${PROVEEDOR}: ${r.error}` }, 502, H);
      return json(r, 200, H);
    }
    if (req.method === "GET") {
      const taskId = new URL(req.url).searchParams.get("taskId");
      if (!taskId) return json({ error: "sin_taskId" }, 400, H);
      return json(await consultar(taskId), 200, H);
    }
    return json({ error: "metodo_no_permitido" }, 405, H);
  } catch (e) {
    return json({ error: "fallo_puente", mensaje: String(e).slice(0, 200) }, 500, H);
  }
};

export const config = { path: "/api/cancion" };
