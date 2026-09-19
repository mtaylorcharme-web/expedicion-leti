/* Personajes de Expedición Leti: Ovaya, Chupaya y Estaya (monos de calcetín) como SVG.
   monkey(id, mood) devuelve un SVG. mood: happy | surprised | think | sad | party */
window.CHARS = {
  ovaya:   { name: "Ovaya",   role: "el curioso",  color: "#E9A0B4", desc: "Curioso, inquieto y juguetón. Se sorprende de todo y le encanta la aventura." },
  chupaya: { name: "Chupaya", role: "el perdido",  color: "#8FB8D8", desc: "Distraído y aventurero. Siempre se pierde… y siempre hay que rescatarlo." },
  estaya:  { name: "Estaya",  role: "el músico",   color: "#7FD3C4", desc: "Hippie, relajado y olvidadizo. Compone canciones para recordar todo." }
};

window.monkey = function (id, mood, size) {
  mood = mood || "happy"; size = size || 120;
  const cream = "#F4E9D2", creamDark = "#E6D7B8", stitch = id === "estaya" ? "#D8453A" : id === "ovaya" ? "#E8A020" : "#2E3F73";
  const eye = id === "ovaya" ? "#E9A0B4" : id === "chupaya" ? "#CFE3EE" : "#A9E2DA";
  const ear = id === "ovaya" ? "#1F2E5C" : id === "chupaya" ? "#2E3F73" : cream;
  let mouth;
  switch (mood) {
    case "surprised": mouth = `<ellipse cx="60" cy="86" rx="6" ry="8" fill="#5A3A2E"/>`; break;
    case "think": mouth = `<path d="M50 88 Q60 86 70 88" stroke="#5A3A2E" stroke-width="3" fill="none" stroke-linecap="round"/>`; break;
    case "sad": mouth = `<path d="M50 91 Q60 82 70 91" stroke="#5A3A2E" stroke-width="3" fill="none" stroke-linecap="round"/>`; break;
    case "party": mouth = `<path d="M46 84 Q60 100 74 84 Z" fill="#5A3A2E"/><path d="M50 86 Q60 92 70 86" fill="#F77"/>`; break;
    default: mouth = `<path d="M48 84 Q60 96 72 84" stroke="#5A3A2E" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }
  const mask = id === "chupaya" ? `<path d="M30 52 Q45 40 60 50 Q75 40 90 52 Q92 66 78 68 Q68 68 60 62 Q52 68 42 68 Q28 66 30 52 Z" fill="#2E3F73"/>` : "";
  const hair = id === "estaya" ? `<g fill="#4A2E22">${[...Array(14)].map((_, i) => `<path d="M${22 + i * 5.5} ${30 + (i % 3) * 3} q-6 30 ${-4 + (i % 2) * 8} 62" stroke="#4A2E22" stroke-width="5" fill="none" stroke-linecap="round"/>`).join("")}</g><path d="M88 46 q10 20 4 46" stroke="#4A2E22" stroke-width="5" fill="none" stroke-linecap="round"/><g>${["#D8453A", "#F2B134", "#3FA66B", "#1F2A1E", "#D8453A", "#F2B134", "#3FA66B"].map((c, i) => `<circle cx="${89 + i * 0.6}" cy="${52 + i * 6}" r="3" fill="${c}"/>`).join("")}</g>` : "";
  const heart = id === "ovaya" ? `<path d="M60 120 l-6 -6 q-4 -5 1 -8 q3 -2 5 2 q2 -4 5 -2 q5 3 1 8 z" fill="#D8202E"/>` : "";
  const hands = id === "chupaya" ? "#111" : "#F4E9D2";
  const stripes = (x, y) => `<g><rect x="${x}" y="${y}" width="16" height="4" fill="#1F2A1E"/><rect x="${x}" y="${y + 7}" width="16" height="4" fill="#1F2A1E"/></g>`;
  const eyes = id === "estaya" ? `<circle cx="47" cy="58" r="8" fill="#5A3A2E"/><circle cx="73" cy="58" r="8" fill="#5A3A2E"/>` : "";
  const eyeStitch = `<circle cx="47" cy="58" r="6.5" fill="${eye}" stroke="#00000033"/><circle cx="73" cy="58" r="6.5" fill="${eye}" stroke="#00000033"/><circle cx="45" cy="56.5" r="1.2" fill="#00000055"/><circle cx="49" cy="59.5" r="1.2" fill="#00000055"/><circle cx="71" cy="56.5" r="1.2" fill="#00000055"/><circle cx="75" cy="59.5" r="1.2" fill="#00000055"/>`;
  const estayaMouth = id === "estaya" ? `<ellipse cx="60" cy="84" rx="20" ry="11" fill="none" stroke="#D8453A" stroke-width="2.5" stroke-dasharray="3 2"/>` : "";
  return `<svg viewBox="0 0 120 160" width="${size}" height="${size * 1.33}" aria-label="${CHARS[id].name}" role="img">
    ${hair}
    <!-- brazos -->
    <path d="M32 112 q-16 10 -22 32" stroke="#C9B58F" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M32 112 q-16 10 -22 32" stroke="${cream}" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M88 112 q16 10 22 32" stroke="#C9B58F" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M88 112 q16 10 22 32" stroke="${cream}" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M32 112 q-16 10 -22 32" stroke="${stitch}" stroke-width="1" fill="none" stroke-dasharray="2 3"/>
    <path d="M88 112 q16 10 22 32" stroke="${stitch}" stroke-width="1" fill="none" stroke-dasharray="2 3"/>
    <circle cx="10" cy="145" r="8" fill="${hands}" stroke="#C9B58F" stroke-width="1.5"/><circle cx="110" cy="145" r="8" fill="${hands}" stroke="#C9B58F" stroke-width="1.5"/>
    ${id !== "chupaya" ? stripes(2, 130) + stripes(102, 130) : ""}
    <!-- cuerpo -->
    <rect x="34" y="98" width="52" height="58" rx="22" fill="${cream}" stroke="#C9B58F" stroke-width="2"/>
    <path d="M60 100 v50" stroke="${stitch}" stroke-width="1" stroke-dasharray="2 3"/>
    ${heart}
    <!-- orejas -->
    <circle cx="26" cy="64" r="10" fill="${ear}" stroke="#C9B58F" stroke-width="1.5"/><circle cx="94" cy="64" r="10" fill="${ear}" stroke="#C9B58F" stroke-width="1.5"/>
    <!-- cabeza -->
    <ellipse cx="60" cy="62" rx="36" ry="38" fill="${cream}" stroke="#C9B58F" stroke-width="2"/>
    ${mask}
    <ellipse cx="60" cy="84" rx="22" ry="14" fill="${creamDark}"/>
    ${estayaMouth}
    ${eyes}${eyeStitch}
    ${mouth}
  </svg>`;
};
