/* Misión Aya · memoria compartida entre dispositivos
   Guarda el avance en Netlify Blobs, identificado por un código de familia.
   No hay datos personales: solo el progreso del juego. */
import { getStore } from "@netlify/blobs";

const ORIGENES = (process.env.ORIGENES || "https://mtaylorcharme-web.github.io").split(",").map(s => s.trim()).filter(Boolean);
const cors = origin => ({
  "Access-Control-Allow-Origin": (!origin || ORIGENES.some(o => origin.startsWith(o))) ? (origin || "*") : ORIGENES[0],
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Content-Type": "application/json; charset=utf-8"
});
const limpio = c => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);

export default async (req) => {
  const H = cors(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response("", { status: 204, headers: H });
  try {
    const store = getStore("progreso-aya");
    if (req.method === "GET") {
      const codigo = limpio(new URL(req.url).searchParams.get("codigo"));
      if (codigo.length < 4) return new Response(JSON.stringify({ error: "codigo_invalido" }), { status: 400, headers: H });
      const dato = await store.get(codigo, { type: "json" });
      return new Response(JSON.stringify({ estado: dato || null }), { status: 200, headers: H });
    }
    if (req.method === "POST") {
      const b = await req.json();
      const codigo = limpio(b.codigo);
      if (codigo.length < 4) return new Response(JSON.stringify({ error: "codigo_invalido" }), { status: 400, headers: H });
      if (!b.estado || typeof b.estado !== "object") return new Response(JSON.stringify({ error: "sin_estado" }), { status: 400, headers: H });
      const texto = JSON.stringify(b.estado);
      if (texto.length > 400000) return new Response(JSON.stringify({ error: "demasiado_grande" }), { status: 413, headers: H });
      await store.setJSON(codigo, b.estado);
      return new Response(JSON.stringify({ ok: true, guardado: new Date().toISOString() }), { status: 200, headers: H });
    }
    return new Response(JSON.stringify({ error: "metodo_no_permitido" }), { status: 405, headers: H });
  } catch (e) {
    return new Response(JSON.stringify({ error: "fallo", mensaje: String(e).slice(0, 200) }), { status: 500, headers: H });
  }
};

export const config = { path: "/api/progreso" };
