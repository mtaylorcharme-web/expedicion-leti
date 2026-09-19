/* Personajes de Expedición Leti: Ovaya, Chupaya y Estaya (Los Ayas), fotos recortadas con animaciones.
   monkey(id, mood, size) devuelve HTML. mood: happy | surprised | think | sad | party | swing | hang */
window.CHARS = {
  ovaya:   { name: "Ovaya",   role: "el curioso", color: "#E9A0B4", img: "assets/chars/ovaya.png",   desc: "Curioso, inquieto y juguetón. Se sorprende de todo y le encanta la aventura." },
  chupaya: { name: "Chupaya", role: "el perdido", color: "#8FB8D8", img: "assets/chars/chupaya.png", desc: "Distraído y aventurero. Siempre se pierde… y siempre hay que rescatarlo." },
  estaya:  { name: "Estaya",  role: "el músico",  color: "#7FD3C4", img: "assets/chars/estaya.png",  desc: "Hippie, relajado y olvidadizo. Compone canciones para recordar todo." }
};
window.MOOD_BADGE = { surprised: "❗", think: "🤔", sad: "💧", party: "🎉", swing: "", hang: "", happy: "" };
window.monkey = function (id, mood, size) {
  mood = mood || "happy"; size = size || 120;
  const c = CHARS[id]; const src = (mood === "hang" && id === "estaya") ? "assets/chars/estaya-colgando.png" : c.img;
  const badge = MOOD_BADGE[mood] ? `<span class="mk-badge">${MOOD_BADGE[mood]}</span>` : "";
  return `<div class="mk mk-${id} mood-${mood}" style="--s:${size}px" data-char="${id}"><img src="${src}" alt="${c.name}" draggable="false">${badge}</div>`;
};
/* Cambia el ánimo de un personaje ya dibujado (reinicia la animación) */
window.setMood = function (el, mood) {
  if (!el) return; el.className = el.className.replace(/mood-\w+/, "mood-" + mood);
  let b = el.querySelector(".mk-badge"); if (MOOD_BADGE[mood]) { if (!b) { b = document.createElement("span"); b.className = "mk-badge"; el.appendChild(b); } b.textContent = MOOD_BADGE[mood]; } else if (b) b.remove();
  void el.offsetWidth;
};
