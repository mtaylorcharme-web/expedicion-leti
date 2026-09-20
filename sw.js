/* Expedición Leti · caché para uso sin conexión */
const CACHE = "aya-v22";
const FILES = ["./", "./index.html", "./css/app.css", "./js/app.js", "./js/config.js", "./js/characters.js", "./js/content-historia-u3.js", "./js/content-fuentes.js", "./js/content-ensenar.js", "./js/content-mundo.js", "./js/content-canciones.js", "./js/content-causas.js", "./js/content-desafio.js", "./js/content-transferencia.js", "./assets/mapa/mundi.jpg", "./assets/musica/himno.mp3", "./assets/fuentes/venecia.jpg", "./assets/fuentes/ruta-seda.jpg", "./assets/fuentes/astrolabio.jpg", "./assets/fuentes/viajes-colon.jpg", "./manifest.webmanifest", "./assets/icon.svg", "./assets/chars/ovaya.png", "./assets/chars/chupaya.png", "./assets/chars/estaya.png", "./assets/chars/estaya-colgando.png", "./assets/escena-selva.jpg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); return r; }).catch(() => caches.match(e.request)));
});
