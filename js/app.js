/* Misión Aya · motor de la app (sin dependencias) */
(function () {
  "use strict";
  const C = window.CONTENT, CH = window.CHARS, monkey = window.monkey;
  const $ = (s, r) => (r || document).querySelector(s);
  const el = (tag, attrs, html) => { const e = document.createElement(tag); if (attrs) for (const k in attrs) { if (k === "class") e.className = attrs[k]; else if (k.startsWith("on")) e.addEventListener(k.slice(2), attrs[k]); else e.setAttribute(k, attrs[k]); } if (html != null) e.innerHTML = html; return e; };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const localKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const todayKey = () => localKey(new Date());
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ── estado ── */
  const KEY = "mision-aya-v1";
  const DEF = { name: "Ovaya", xp: 0, streak: { last: null, count: 0 }, days: [], done: {}, wrong: {}, stats: {}, stamps: [], pin: "1234", boss: null, sound: true, log: [] };
  let S = load();
  function load() { try { const s = JSON.parse(localStorage.getItem(KEY)); return s ? Object.assign({}, DEF, s) : Object.assign({}, DEF); } catch (e) { return Object.assign({}, DEF); } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
  function touchDay() {
    const t = todayKey();
    if (S.streak.last !== t) {
      const y = new Date(); y.setDate(y.getDate() - 1);
      S.streak.count = (S.streak.last === localKey(y)) ? S.streak.count + 1 : 1;
      S.streak.last = t;
      if (!S.days.includes(t)) S.days.push(t);
      save();
    }
  }
  function addXP(n) { S.xp += n; save(); renderTop(); }
  function stat(topic, ok) { const s = S.stats[topic] || (S.stats[topic] = { ok: 0, n: 0 }); s.n++; if (ok) s.ok++; }
  function markWrong(key, q, camp, ok) { if (ok) { if (S.wrong[key] && --S.wrong[key].n <= 0) delete S.wrong[key]; } else { const w = S.wrong[key] || (S.wrong[key] = { n: 0, q: "", camp: "" }); w.n = Math.min(w.n + 2, 4); w.q = q; w.camp = camp; } }
  function stamp(id) { if (!S.stamps.includes(id)) { S.stamps.push(id); save(); toast("🏅 ¡Nuevo sello en tu pasaporte!"); setTimeout(() => jingle("stamp"), 700); } }

  /* ── utilidades UI ── */
  let toastT; function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2200); }
  const AC = window.AudioContext || window.webkitAudioContext; let actx;
  function beep(ok) { if (!S.sound || !AC) return; try { actx = actx || new AC(); const o = actx.createOscillator(), g = actx.createGain(); o.connect(g); g.connect(actx.destination); o.type = "sine"; const t = actx.currentTime; if (ok) { o.frequency.setValueAtTime(660, t); o.frequency.setValueAtTime(880, t + .09); } else { o.frequency.setValueAtTime(220, t); o.frequency.setValueAtTime(180, t + .12); } g.gain.setValueAtTime(.12, t); g.gain.exponentialRampToValueAtTime(.001, t + .25); o.start(t); o.stop(t + .26); } catch (e) { } }
  function jingle(kind) {
    if (!S.sound || !AC) return; try { actx = actx || new AC(); const t0 = actx.currentTime;
      const seq = kind === "win" ? [[523, 0], [659, .12], [784, .24], [1047, .36], [784, .5], [1047, .62]] : kind === "stamp" ? [[880, 0], [1175, .1], [1568, .2]] : [[392, 0], [330, .15], [262, .3]];
      seq.forEach(([f, dt]) => { const o = actx.createOscillator(), g = actx.createGain(); o.type = kind === "win" ? "triangle" : "sine"; o.frequency.value = f; o.connect(g); g.connect(actx.destination); g.gain.setValueAtTime(.0001, t0 + dt); g.gain.exponentialRampToValueAtTime(.14, t0 + dt + .02); g.gain.exponentialRampToValueAtTime(.0001, t0 + dt + .28); o.start(t0 + dt); o.stop(t0 + dt + .3); });
    } catch (e) { }
  }
  const SAY = { ovaya: ["¡Uy! ¿Qué será eso?", "¡Me encanta explorar contigo!", "¡Mira, mira, una carabela!", "¿Sabías que soy el más curioso de Los Ayas?"], chupaya: ["¿Dónde estoy?", "Creo que me perdí… otra vez.", "¡Ahí estás! Ya me sentía perdido.", "¿Este camino lleva a Tenochtitlan?"], estaya: ["♪ La la la… ¿cómo seguía? ♪", "Tranquila, todo fluye.", "Te compuse una canción… pero la olvidé.", "♪ Colón, Colón, navegó al oeste ♪"] };
  document.addEventListener("click", e => {
    const mk = e.target.closest(".mk"); if (!mk) return;
    const id = mk.dataset.char; const prev = (mk.className.match(/mood-(\w+)/) || [])[1] || "happy";
    setMood(mk, "surprised"); beep(true); toast(`${CH[id].name}: ${SAY[id][Math.floor(Math.random() * SAY[id].length)]}`);
    setTimeout(() => setMood(mk, prev === "sad" ? "happy" : prev), 800);
  });
  /* voz en español (lectura en voz alta) */
  let voiceEs = null;
  function pickVoice() { try { const vs = speechSynthesis.getVoices(); voiceEs = vs.find(v => /es-(CL|MX|419|US)/i.test(v.lang)) || vs.find(v => /^es/i.test(v.lang)) || null; } catch (e) { } }
  if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function speak(text) { if (!("speechSynthesis" in window)) return toast("Este dispositivo no tiene voz disponible."); try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text.replace(/[«»♪✅❌]/g, "")); u.lang = voiceEs ? voiceEs.lang : "es-ES"; if (voiceEs) u.voice = voiceEs; u.rate = .95; u.pitch = 1.05; speechSynthesis.speak(u); } catch (e) { } }
  document.addEventListener("click", e => { const b = e.target.closest(".say"); if (!b) return; e.stopPropagation(); const box = b.closest(".bubble, .qcard"); if (!box) return; const txt = [...box.querySelectorAll(".tw, h2, .ctx, .nbody")].map(x => x.textContent).join(". ") || box.textContent; speak(txt.replace(/🔊/g, "")); });
  function typewrite(elm) { const full = elm.textContent; if (!full || full.length > 240 || matchMedia("(prefers-reduced-motion: reduce)").matches) return; elm.textContent = ""; let i = 0; const t = setInterval(() => { elm.textContent = full.slice(0, ++i); if (i >= full.length) clearInterval(t); }, 18); }
  const SAYBTN = `<button class="say" aria-label="Escuchar" title="Escuchar">🔊</button>`;
  function confetti() {
    const cv = $("#confetti"), ctx = cv.getContext("2d"); cv.width = innerWidth; cv.height = innerHeight;
    const cols = ["#F2603E", "#F2B134", "#3FA66B", "#4FB3C9", "#8E6BC7", "#fff"]; const ps = [];
    for (let i = 0; i < 140; i++) ps.push({ x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * .5, vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 4, r: 4 + Math.random() * 6, c: cols[i % cols.length], a: Math.random() * 6 });
    let f = 0; (function step() { ctx.clearRect(0, 0, cv.width, cv.height); ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.a += .1; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * .6); ctx.restore(); }); if (++f < 150) requestAnimationFrame(step); else ctx.clearRect(0, 0, cv.width, cv.height); })();
  }
  function daysToTest() { const t = new Date(C.unit.test.date + "T00:00:00"), n = new Date(); n.setHours(0, 0, 0, 0); return Math.round((t - n) / 864e5); }
  function stars(errors) { return errors <= 1 ? 3 : errors <= 3 ? 2 : 1; }
  const starStr = n => "★".repeat(n) + "☆".repeat(3 - n);

  /* ── progreso ── */
  const campDone = c => c.missions.filter(m => S.done[m.id]).length;
  const campStars = c => c.missions.reduce((a, m) => a + (S.done[m.id] ? S.done[m.id].stars : 0), 0);
  const campUnlocked = c => c.n === 1 || campDone(C.camps[c.n - 2]) >= 1;
  const missionUnlocked = (c, i) => i === 0 || !!S.done[c.missions[i - 1].id];
  const totalMissions = C.camps.reduce((a, c) => a + c.missions.length, 0);
  const doneMissions = () => C.camps.reduce((a, c) => a + campDone(c), 0);
  const level = () => Math.floor(S.xp / 250) + 1;

  /* ── navegación ── */
  let view = "home", ctx = {};
  function go(v, c) { pararVoz(true); view = v; ctx = c || {}; render(); window.scrollTo({ top: 0 }); }
  function render() { renderTop(); renderNav(); const m = $("#view"); m.innerHTML = ""; m.className = "view fade"; ({ home, camp, notes, mission, flash, boss, review, passport, parent, game, memo, song, daily, fuentes, fuente, ensenar, mundo, ciudad })[view](m); }
  function renderTop() {
    const d = daysToTest(); const dl = d > 1 ? `${d} días` : d === 1 ? "¡mañana!" : d === 0 ? "¡hoy!" : "pasó";
    $("#topbar").innerHTML = `<span class="chip streak">🔥 ${S.streak.count} <span class="lbl">día${S.streak.count === 1 ? "" : "s"}</span></span><span class="chip xp">⭐ ${S.xp} <span class="lbl">XP</span></span><span class="chip days">📅 <span class="lbl">Prueba:</span> ${dl}</span><span class="spacer"></span><button class="avatar" data-go="passport" aria-label="Pasaporte"><img src="assets/chars/ovaya.png" alt="Ovaya"></button>`;
  }
  function renderNav() {
    const items = [["home", "🌴", "Selva"], ["mundo", "🌍", "Mundo"], ["review", "🎯", "Repaso"], ["passport", "🛂", "Pasaporte"], ["parent", "👨‍👩‍👧", "Papás"]];
    $("#navbar").innerHTML = `<div class="inner">${items.map(([v, i, l]) => `<button class="${view === v || (v === "home" && ["camp", "notes", "mission", "flash", "boss", "game", "memo", "song", "fuentes", "fuente", "ensenar", "ciudad"].includes(view)) ? "on" : ""}" data-go="${v}"><span class="ic">${i}</span>${l}</button>`).join("")}</div>`;
  }
  document.addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b) go(b.dataset.go); });

  /* ── BIENVENIDA (primera vez) ── */
  function welcome(m) {
    const steps = [
      { id: "ovaya", mood: "surprised", t: "¡Hola! Somos Los Ayas. Venimos de muy lejos: nacimos en la Ciudad Aya, allá arriba en el Himalaya, entre las montañas más altas del mundo." },
      { id: "chupaya", mood: "think", t: "Hasta que un día nuestra nave falló en pleno vuelo y caímos en una selva. Y no en cualquier selva: caímos en otra época. Yo me perdí primero, como siempre." },
      { id: "estaya", mood: "think", t: "♪ La nave se rompió, el tiempo se enredó ♪. Ahora saltamos de rama en rama, y cada selva nos deja en otro país y en otro siglo." },
      { id: "ovaya", mood: "think", t: "Para volver a casa necesitamos el mapa de regreso, y está partido en cinco fragmentos. Cada selva que logramos entender nos entrega uno." },
      { id: "ovaya", mood: "party", t: "Con los cinco fragmentos veremos otra vez la Ciudad Aya entre las montañas. ¿Nos ayudas a llegar a casa?" }
    ];
    let i = 0; const w = el("div", { class: "welcome" }); m.appendChild(w);
    const draw = () => { const st = steps[i]; w.innerHTML = `<div class="wl-stage">${i === steps.length - 1 ? `<img class="trio" src="assets/chars/trio.png" alt="Los Ayas">` : monkey(st.id, st.mood, 150)}</div><div class="bubble wl"><span class="who">${CH[st.id].name}</span><span class="tw">${st.t}</span>${SAYBTN}</div><div class="actions" style="justify-content:center"><button class="btn ${i === steps.length - 1 ? "" : "g"}" id="nx">${i === steps.length - 1 ? "¡Vamos a casa! 🏔️" : "Siguiente →"}</button></div><div class="dots">${steps.map((_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("")}</div>`; typewrite($(".tw", w)); beep(true); $("#nx", w).addEventListener("click", () => { i++; if (i >= steps.length) { S.welcomed = true; save(); confetti(); jingle("win"); go("home"); } else draw(); }); };
    draw();
  }

  /* ── INICIO ── */
  function home(m) {
    touchDay();
    if (!S.welcomed) return welcome(m);
    const d = daysToTest();
    const cur = C.camps.find(c => campUnlocked(c) && campDone(c) < c.missions.length) || C.camps[C.camps.length - 1];
    const guide = cur.guide;
    const allDone = C.camps.every(c => campDone(c) === c.missions.length);
    const positions = [[22, 8], [66, 20], [24, 33], [68, 46], [26, 59], [64, 73], [40, 90]];
    const mapH = 1000;
    const P = positions.map(([x, y]) => [x * 6, y * mapH / 100]);
    const fragmentos = C.camps.filter(c => campDone(c) === c.missions.length).length;
    const wrap = el("div", { class: "home" });
    const map = el("div", { class: "mapwrap" });
    const ramas = P.slice(0, 6).map(([x, y], i) => {
      const izq = positions[i][0] < 50; const by = y + 48;
      const hojas = [...Array(4)].map((_, k) => { const hx = izq ? 60 + k * ((x - 70) / 4) : x + 30 + k * ((540 - x) / 4); return `<ellipse cx="${hx}" cy="${by - 7}" rx="16" ry="8" fill="#3FA66B" transform="rotate(${izq ? -18 : 18} ${hx} ${by - 7})"/>`; }).join("");
      return izq ? `<rect x="20" y="${by}" width="${x - 8}" height="22" rx="11" fill="#3B2A1C"/><rect x="20" y="${by + 2}" width="${x - 8}" height="8" rx="4" fill="#6B4C33"/>${hojas}`
                 : `<rect x="${x + 8}" y="${by}" width="${572 - x}" height="22" rx="11" fill="#3B2A1C"/><rect x="${x + 8}" y="${by + 2}" width="${572 - x}" height="8" rx="4" fill="#6B4C33"/>${hojas}`;
    }).join("");
    const lianas = P.slice(0, -1).map(([x0, y0], i) => {
      const [x1, y1] = P[i + 1];
      const d = `M ${x0} ${y0 + 56} C ${x0} ${y0 + 190}, ${x1} ${y1 - 190}, ${x1} ${y1 - 44}`;
      return `<path d="${d}" stroke="#2E4A1C" stroke-width="12" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#6B9E43" stroke-width="6" fill="none" stroke-linecap="round"/><path class="flow" d="${d}" stroke="#DFF3BC" stroke-width="4" fill="none" stroke-dasharray="3 18" stroke-linecap="round" opacity=".9"/>`;
    }).join("");
    map.innerHTML = `<svg class="jungle" viewBox="0 0 600 ${mapH}" aria-hidden="true">
      <defs>
        <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CBE8B4"/><stop offset=".55" stop-color="#8CC47A"/><stop offset="1" stop-color="#6FB56A"/></linearGradient>
        <linearGradient id="nieve" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#BBD4E8"/></linearGradient>
        <linearGradient id="ciudad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9A8"/><stop offset="1" stop-color="#F2B134"/></linearGradient>
      </defs>
      <rect width="600" height="${mapH}" fill="url(#cielo)"/>
      ${[...Array(34)].map((_, i) => { const x = (i * 137) % 600, y = (i * 211) % (mapH * .82), r = 28 + (i % 4) * 12; return `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 3 ? "#5FA95F" : "#4E9A52"}" opacity=".32"/>`; }).join("")}
      <rect x="2" y="-20" width="84" height="${mapH * .78}" rx="26" fill="#3B2A1C"/><rect x="14" y="-20" width="30" height="${mapH * .78}" rx="15" fill="#6B4C33"/><rect x="58" y="-20" width="12" height="${mapH * .78}" rx="6" fill="#2E2116" opacity=".7"/>
      <rect x="514" y="-20" width="84" height="${mapH * .78}" rx="26" fill="#3B2A1C"/><rect x="556" y="-20" width="30" height="${mapH * .78}" rx="15" fill="#6B4C33"/><rect x="530" y="-20" width="12" height="${mapH * .78}" rx="6" fill="#2E2116" opacity=".7"/>
      ${ramas}
      ${lianas}
      ${[...Array(14)].map((_, i) => { const x = (i * 97 + 46) % 600, y = (i * 173 + 70) % (mapH * .8); return `<text x="${x}" y="${y}" font-size="30" opacity=".8">${["🌴", "🌿", "🦜", "🌺", "🍃", "🌳"][i % 6]}</text>`; }).join("")}
      <path d="M -20 ${mapH * .88} L 90 ${mapH * .79} L 190 ${mapH * .87} L 300 ${mapH * .72} L 420 ${mapH * .85} L 520 ${mapH * .78} L 620 ${mapH * .89} L 620 ${mapH} L -20 ${mapH} Z" fill="url(#nieve)" opacity=".97"/>
      <path d="M 300 ${mapH * .72} L 272 ${mapH * .77} L 328 ${mapH * .77} Z" fill="#fff"/>
      <circle cx="${P[6][0]}" cy="${P[6][1]}" r="92" fill="url(#ciudad)" opacity=".35"/>
      <text x="300" y="${mapH * .845}" font-size="22" font-weight="800" text-anchor="middle" fill="#5B7089" font-family="Nunito,sans-serif">Cordillera del Himalaya</text>
    </svg>`;
    C.camps.forEach((c, i) => {
      const [x, y] = positions[i]; const un = campUnlocked(c); const full = campDone(c) === c.missions.length;
      const node = el("button", { class: `camp ${un ? "" : "locked"} ${c === cur && !allDone ? "here" : ""}`, style: `left:${x}%;top:${y}%`, "aria-label": c.name });
      node.innerHTML = `<div class="land" style="background:${c.color}"><span class="n">${c.n}</span>${un ? c.icon : "🔒"}${campDone(c) ? `<span class="stars">${"★".repeat(Math.min(3, Math.round(campStars(c) / c.missions.length)))}${full ? " ✓" : ""}</span>` : ""}</div><span class="name">${esc(c.name)}<small>${un ? esc(c.lugar) + " · " + esc(c.epoca) : "selva desconocida"}</small></span>`;
      node.addEventListener("click", () => { if (!un) return toast("Salta primero por la selva anterior para llegar a esta rama."); const lm = $(".leti-marker", map); if (lm) { lm.style.left = `calc(${x}% + 58px)`; lm.style.top = `calc(${y}% + 8px)`; lm.classList.add("walking"); } beep(true); setTimeout(() => go("camp", { camp: c.id }), 650); });
      map.appendChild(node);
    });
    const [bx, by] = positions[5]; const bossOpen = C.camps.filter(c => campDone(c) >= 1).length >= 3;
    const boss = el("button", { class: `camp boss ${bossOpen ? "" : "locked"}`, style: `left:${bx}%;top:${by}%` });
    boss.innerHTML = `<div class="land">${bossOpen ? "🏆" : "🔒"}${S.boss ? `<span class="stars">${S.boss.pct}%</span>` : ""}</div><span class="name">El gran salto<small>${bossOpen ? "simulacro de la prueba" : "abre con 3 selvas"}</small></span>`;
    boss.addEventListener("click", () => { if (!bossOpen) return toast("Los Ayas necesitan al menos 3 selvas recorridas antes del gran salto."); const lm = $(".leti-marker", map); if (lm) { lm.style.left = `calc(${bx}% + 58px)`; lm.style.top = `calc(${by}% + 8px)`; lm.classList.add("walking"); } beep(true); setTimeout(() => go("boss"), 650); });
    map.appendChild(boss);
    const [cx2, cy2] = positions[6]; const nPistas = (S.pistas || []).length; const quedanCand = CANDIDATOS.length - nPistas;
    const ciu = el("button", { class: "camp ciudad", style: `left:${cx2}%;top:${cy2}%` });
    ciu.innerHTML = `<div class="land">${quedanCand === 1 ? "✨" : "🏔️"}</div><span class="name">Ciudad Aya<small>${quedanCand === 1 ? "¡la encontraron!" : `${quedanCand} lugares posibles · ${nPistas}/8 pistas`}</small></span>`;
    ciu.addEventListener("click", () => { beep(true); go("ciudad"); });
    map.appendChild(ciu);
    const idx = allDone ? 5 : C.camps.indexOf(cur); const [lx, ly] = positions[idx];
    map.appendChild(el("div", { class: "leti-marker", style: `left:calc(${lx}% + 58px);top:calc(${ly}% + 8px)` }, `<img src="assets/chars/ovaya.png" alt="Ovaya">`));
    map.insertAdjacentHTML("beforeend", `<img class="map-tree" src="assets/chars/trio-arbol.png" alt="" aria-hidden="true">`);
    map.insertAdjacentHTML("beforeend", `<div class="critter fly" style="top:14%;animation-duration:14s">🦜</div><div class="critter fly" style="top:46%;animation-duration:22s;animation-delay:-9s;font-size:22px">🦋</div><div class="critter walk" style="top:62%;animation-duration:30s;animation-delay:-12s">🐢</div>`);
    [["chupaya", 86, 40, "swing"], ["estaya", 10, 74, "hang"]].forEach(([id, x, y, md]) => {
      if (md === "swing") { const l = el("div", { class: "liana", style: `left:calc(${x}% + 25px);top:0;height:${y}%` }); map.appendChild(l); }
      const mm = el("div", { class: "map-monkey", style: `left:${x}%;top:${y}%` }, monkey(id, md, 52)); map.appendChild(mm);
    });
    const hero = el("div", { class: "hero-jungle" }, `<div class="txt"><div class="eyebrow" style="color:#CFEFD8">De rama en rama, de vuelta a casa</div><h1>Misión Aya</h1><p>Los Ayas buscan la Ciudad Aya, en el Himalaya. Llevan <b>${fragmentos} de 5</b> fragmentos del mapa.</p></div></div>`);
    const shell = el("div"); shell.appendChild(hero); shell.appendChild(wrap); m.appendChild(shell);
    wrap.appendChild(map);

    const side = el("div", { style: "display:grid;gap:14px" });
    const nextM = cur.missions.find(x => !S.done[x.id]);
    const msg = allDone ? `¡Tenemos los cinco fragmentos del mapa! Ya se ve la Ciudad Aya entre las montañas. Solo falta el último salto.` : campDone(cur) === 0 && !S.done[cur.id + "-notes"] ? cur.intro : nextM ? `Estamos en ${cur.name}, ${cur.lugar}, ${cur.epoca}. Siguiente salto: «${nextM.title}». ${nextM.story}` : cur.intro;
    side.innerHTML = `<div class="card"><div class="today"><div class="char">${monkey(guide, allDone ? "party" : "happy", 96)}</div><div class="bubble"><span class="who">${CH[guide].name}</span><span class="tw">${esc(msg)}</span>${SAYBTN}</div></div><div class="actions" style="justify-content:flex-start"><button class="btn" id="goNext">${allDone ? "Ir a la Ciudad Aya 🏔️" : "¡A saltar! 🐒"}</button><button class="btn ghost" data-go="review">Repaso 🎯</button></div></div>`;
    $("#goNext", side).addEventListener("click", () => allDone ? go("boss") : go("camp", { camp: cur.id }));

    const dailyDone = S.daily && S.daily.date === todayKey();
    const dc = el("div", { class: "card daily" + (dailyDone ? " done" : "") });
    dc.innerHTML = `<div class="row" style="justify-content:space-between;gap:10px"><div><div class="eyebrow">Reto del día</div><b style="font-family:Fredoka;font-size:18px;font-weight:600">${dailyDone ? "¡Reto de hoy superado! ✅" : "5 preguntas sorpresa · +30 XP"}</b><div class="muted small">${dailyDone ? `Sacaste ${S.daily.score}/5. Mañana hay uno nuevo.` : "De las selvas que ya recorriste. ¡Mantén tu racha!"}</div></div>${dailyDone ? "" : `<button class="btn y sm" id="goDaily">¡Jugar! 🎲</button>`}</div>`;
    if (!dailyDone) $("#goDaily", dc).addEventListener("click", () => go("daily"));
    side.appendChild(dc);
    const fx = FUENTES.filter(f => campUnlocked(C.camps.find(c => c.id === f.camp))); const fxh = fx.filter(fuenteHecha).length;
    const fc = el("div", { class: "card taller" });
    fc.innerHTML = `<div class="row" style="justify-content:space-between;gap:10px"><div><div class="eyebrow" style="color:#7A4BB8">Taller de fuentes</div><b style="font-family:Fredoka;font-size:18px;font-weight:600">La carpa del detective</b><div class="muted small">${fxh} de ${fx.length} fuentes analizadas. Mapas, diarios y cartas reales de la época.</div></div><button class="btn sm" id="goFx" style="background:#8E6BC7;box-shadow:0 3px 0 #6B49A0">Analizar 🔍</button></div>`;
    $("#goFx", fc).addEventListener("click", () => go("fuentes"));
    side.appendChild(fc);
    const nPis = (S.pistas || []).length; const cand = CANDIDATOS.length - nPis;
    const cc = el("div", { class: "card busqueda" });
    cc.innerHTML = `<div class="row" style="justify-content:space-between;gap:10px"><div><div class="eyebrow" style="color:#A8801A">La búsqueda de casa</div><b style="font-family:Fredoka;font-size:18px;font-weight:600">${cand === 1 ? "¡Encontraron la Ciudad Aya!" : `Quedan ${cand} lugares posibles`}</b><div class="muted small">${nPis} de 8 pistas y ${nPis} de 8 notas de la melodía.</div></div><button class="btn y sm" id="goCiu">Investigar 🏔️</button></div>`;
    $("#goCiu", cc).addEventListener("click", () => go("ciudad"));
    side.appendChild(cc);
    const cd = el("div", { class: "card" });
    cd.innerHTML = `<div class="eyebrow">${esc(C.unit.subject)} · ${esc(C.unit.title)}</div><div class="countdown" style="margin-top:6px"><div class="big">${d >= 0 ? d : 0}</div><div><b style="font-family:Fredoka;font-size:18px">${d > 1 ? "días para la prueba" : d === 1 ? "día para la prueba" : d === 0 ? "¡La prueba es hoy!" : "La prueba ya pasó"}</b><div class="muted small">${esc(C.unit.test.label)} · ${doneMissions()}/${totalMissions} misiones completadas</div></div></div>`;
    side.appendChild(cd);

    const plan = el("div", { class: "card" }); const t0 = new Date(); t0.setHours(0, 0, 0, 0);
    const start = new Date(C.unit.test.date + "T00:00:00"); start.setDate(start.getDate() - C.plan.length);
    const dn = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
    plan.innerHTML = `<h3 style="font-size:19px;font-weight:600">Ruta de regreso hasta la prueba</h3><div class="plan" style="margin-top:10px">${C.plan.map(p => { const dt = new Date(start); dt.setDate(dt.getDate() + p.day); const isT = dt.getTime() === t0.getTime(), past = dt < t0; const camps = p.camps.map(id => C.camps.find(c => c.id === id)); const ok = camps.every(c => campDone(c) === c.missions.length); return `<div class="d ${isT ? "today" : past ? "past" : ""}"><div class="dn">${dn[dt.getDay()]}<b>${dt.getDate()}</b></div><div><b>${esc(p.label)}</b><div class="muted small">${camps.map(c => c.icon + " " + esc(c.name)).join(", ")} · ${esc(p.extra)}</div></div><div class="st">${ok ? "✅" : isT ? "👉" : ""}</div></div>`; }).join("")}</div>`;
    side.appendChild(plan);
    wrap.appendChild(side);
  }

  /* ── CAMPAMENTO ── */
  function camp(m) {
    const c = C.camps.find(x => x.id === ctx.camp); const notesDone = !!S.done[c.id + "-notes"];
    const h = el("div");
    h.innerHTML = `<button class="btn ghost sm" data-go="home">← Selva</button>
      <div class="camphead" style="margin-top:12px"><div class="icon" style="background:${c.color}">${c.icon}</div><div><div class="eyebrow">Selva ${c.n} de 5 · ${esc(c.lugar)} · ${esc(c.epoca)}</div><h2 style="font-size:26px;font-weight:600">${esc(c.name)}</h2><div class="muted small">${esc(c.topic)}</div></div></div>
      <div class="today card"><div class="char">${monkey(c.guide, "happy", 84)}</div><div class="bubble"><span class="who">${CH[c.guide].name}</span><span class="tw">${esc(c.intro)}</span>${SAYBTN}</div></div>`;
    const steps = el("div", { class: "steps" });
    const s0 = el("button", { class: `step ${notesDone ? "done" : ""}` }); s0.innerHTML = `<div class="ic">📖</div><div><b>Bitácora de esta selva</b><span class="sub">${c.notes.length} páginas sobre ${esc(c.lugar)}, ${esc(c.epoca)} · léelas antes de saltar · 5 min</span></div><div class="right">${notesDone ? "✅" : "→"}</div>`;
    s0.addEventListener("click", () => go("notes", { camp: c.id })); steps.appendChild(s0);
    c.missions.forEach((ms, i) => {
      const un = missionUnlocked(c, i) && (notesDone || i > 0 || true); const dn = S.done[ms.id];
      const b = el("button", { class: `step ${dn ? "done" : ""} ${un ? "" : "locked"}` });
      b.innerHTML = `<div class="ic">${un ? (dn ? "✅" : "🧭") : "🔒"}</div><div><b>Misión ${i + 1}: ${esc(ms.title)}</b><span class="sub">Con ${CH[ms.char].name} · ${ms.questions.length} desafíos · ${Math.round(ms.questions.length * 1.4)} min</span></div><div class="right">${dn ? starStr(dn.stars) : un ? "→" : ""}</div>`;
      b.addEventListener("click", () => un ? go("mission", { camp: c.id, mission: ms.id }) : toast("Primero completa la misión anterior."));
      steps.appendChild(b);
    });
    if (LECCIONES.some(l => l.camp === c.id)) { const L = LECCIONES.find(l => l.camp === c.id); const hecha = leccionHecha(L);
      const se = el("button", { class: `step destacado ${hecha ? "done" : ""}` });
      se.innerHTML = `<div class="ic">🧠</div><div><b>Enséñale a Chupaya</b><span class="sub">${esc(L.titulo)} · explícaselo y él te repregunta</span><span class="sub" style="color:var(--jungle);font-weight:800">Lo que le explicas se te queda</span></div><div class="right">${hecha ? "★".repeat(S.lecciones[L.id].estrellas) : "→"}</div>`;
      se.addEventListener("click", () => go("ensenar", { camp: c.id })); steps.appendChild(se); }
    const sf = el("button", { class: "step" }); sf.innerHTML = `<div class="ic">🃏</div><div><b>Tarjetas de memoria</b><span class="sub">${c.flashcards.length} tarjetas para repasar rápido · ideal antes de dormir</span></div><div class="right">→</div>`;
    sf.addEventListener("click", () => go("flash", { camp: c.id })); steps.appendChild(sf);
    const sg = el("button", { class: "step" }); sg.innerHTML = `<div class="ic">🐒</div><div><b>Salto de lianas</b><span class="sub">Verdadero o falso contra el reloj · cruza esta selva con Chupaya · 2 min</span></div><div class="right">${S.games && S.games["liana-" + c.id] ? "🏆 " + S.games["liana-" + c.id] : "→"}</div>`;
    sg.addEventListener("click", () => go("game", { camp: c.id })); steps.appendChild(sg);
    const sm = el("button", { class: "step" }); sm.innerHTML = `<div class="ic">🎵</div><div><b>Piezas de la nave</b><span class="sub">Empareja concepto y definición con Estaya y recupera piezas · 3 min</span></div><div class="right">${S.games && S.games["memo-" + c.id] ? "🏆 " + S.games["memo-" + c.id] + " mov." : "→"}</div>`;
    sm.addEventListener("click", () => go("memo", { camp: c.id })); steps.appendChild(sm);
    const fxc = FUENTES.filter(f => f.camp === c.id);
    if (fxc.length) { const sfx = el("button", { class: "step" }); const hh = fxc.filter(fuenteHecha).length;
      sfx.innerHTML = `<div class="ic">🔍</div><div><b>Taller de fuentes</b><span class="sub">${fxc.length} fuente${fxc.length === 1 ? "" : "s"} real${fxc.length === 1 ? "" : "es"} de este tema · analízalas con la guía de tu clase</span></div><div class="right">${hh === fxc.length ? "✅" : hh ? hh + "/" + fxc.length : "→"}</div>`;
      sfx.addEventListener("click", () => go("fuentes")); steps.appendChild(sfx); }
    const ss = el("button", { class: "step" }); ss.innerHTML = `<div class="ic">🎤</div><div><b>La canción de Estaya</b><span class="sub">Karaoke con los datos clave y "completa la letra" · 3 min</span></div><div class="right">${S.games && S.games["song-" + c.id] ? "🏆" : "→"}</div>`;
    ss.addEventListener("click", () => go("song", { camp: c.id })); steps.appendChild(ss);
    h.appendChild(steps); m.appendChild(h);
  }

  /* ── BITÁCORA (cuaderno por páginas) ── */
  function notes(m) {
    const c = C.camps.find(x => x.id === ctx.camp); let pg = 0; const N = c.notes.length; const maxSeen = { v: 0 };
    const w = el("div", { class: "mission" }); m.appendChild(w);
    const draw = () => { const n = c.notes[pg]; maxSeen.v = Math.max(maxSeen.v, pg);
      w.innerHTML = `<div class="mhead"><button class="close" id="back" aria-label="Volver">✕</button><div class="pbar"><b style="width:${((pg + 1) / N) * 100}%;background:linear-gradient(90deg,var(--gold),#F7C95C)"></b></div><span class="small muted" style="min-width:60px;text-align:right">Pág. ${pg + 1}/${N}</span></div>
        <div class="scene"><div class="char">${monkey(c.guide, pg === 0 ? "surprised" : "think", 80)}<span class="nm">${CH[c.guide].name}</span></div><div class="bubble"><span class="who">Bitácora · ${esc(c.topic)}</span><span class="tw">${pg === 0 ? "Lee con calma cada página. Toca 🔊 si quieres que te la lea. Al final vienen las misiones." : ["¡Esto sale en la prueba!", "Fíjate en las palabras en verde.", "Léelo dos veces si hace falta.", "¡Vas muy bien!", "Ya casi terminamos."][pg % 5]}</span>${SAYBTN}</div></div>
        <div class="qcard notebook"><div class="eyebrow">Página ${pg + 1}</div><h2>${esc(n.title)}</h2><div class="nbody">${n.body}</div></div>
        <div class="actions" style="justify-content:space-between"><button class="btn ghost" id="prev" ${pg === 0 ? "disabled" : ""}>← Anterior</button>${pg < N - 1 ? `<button class="btn g" id="next">Siguiente →</button>` : `<button class="btn" id="ok">¡Leí toda la bitácora! +15 XP</button>`}</div>`;
      typewrite($(".bubble .tw", w)); const qc = $(".qcard", w); qc.insertAdjacentHTML("afterbegin", SAYBTN);
      $("#back", w).addEventListener("click", () => go("camp", { camp: c.id }));
      $("#prev", w).addEventListener("click", () => { pg--; draw(); });
      const nx = $("#next", w); if (nx) nx.addEventListener("click", () => { pg++; beep(true); draw(); window.scrollTo({ top: 0 }); });
      const ok = $("#ok", w); if (ok) ok.addEventListener("click", () => { if (!S.done[c.id + "-notes"]) { S.done[c.id + "-notes"] = { stars: 0 }; addXP(15); jingle("stamp"); } save(); go("camp", { camp: c.id }); }); };
    draw();
  }

  const FACTS = [
    "Colón murió creyendo que había llegado a Asia. Nunca supo que había encontrado un continente nuevo.",
    "Tenochtitlan tenía unos 200 000 habitantes en 1519: era más grande que cualquier ciudad de España en esa época.",
    "Los incas no tenían escritura ni rueda, pero construyeron más de 30 000 km de caminos por los Andes.",
    "Los mayas inventaron el número cero de forma independiente, siglos antes de que llegara a Europa.",
    "La carabela era tan pequeña que la Niña, uno de los barcos de Colón, medía menos que una cancha de básquetbol.",
    "Atahualpa ofreció llenar una habitación de oro y dos de plata a cambio de su libertad. Pizarro lo aceptó… y no cumplió.",
    "La palabra «chocolate» viene del náhuatl, el idioma de los aztecas. Ellos lo tomaban amargo y con ají.",
    "Antes de 1492 en Europa no existían las papas, el tomate ni el maíz. ¡Ni pizza con tomate ni papas fritas!",
    "Los conquistadores traían perros de guerra enormes que aterrorizaban a los pueblos indígenas, que nunca habían visto perros tan grandes.",
    "La vuelta al mundo de Magallanes y Elcano (1519–1522) partió con 5 barcos y unos 240 hombres; regresó 1 barco con 18.",
    "El nombre «América» viene de Amerigo Vespucci, el navegante que dijo que estas tierras eran un continente nuevo.",
    "En Chile, Pedro de Valdivia fundó Santiago en 1541 en el cerro Huelén, que hoy conocemos como cerro Santa Lucía."
  ];
  function chestHTML() { const f = FACTS[(S.factIdx = ((S.factIdx || 0) + 1) % FACTS.length)]; save(); return `<div class="chest" id="chest"><button class="chest-btn" id="openChest" aria-label="Abrir cofre">🧰</button><div class="chest-body" hidden><div class="eyebrow">Dato curioso de Ovaya</div><p>${esc(f)}</p></div></div>`; }
  document.addEventListener("click", e => { const b = e.target.closest("#openChest"); if (!b) return; const ch = b.closest(".chest"); b.textContent = "🎁"; b.classList.add("open"); jingle("stamp"); setTimeout(() => { b.hidden = true; ch.querySelector(".chest-body").hidden = false; ch.classList.add("opened"); }, 500); });

  /* ── MISIÓN (motor de preguntas) ── */
  function mission(m) {
    const c = C.camps.find(x => x.id === ctx.camp); const ms = c.missions.find(x => x.id === ctx.mission);
    runQuiz(m, { title: ms.title, char: ms.char, story: ms.story, topic: c.topic, camp: c, questions: ms.questions.map((q, i) => ({ q, key: `${ms.id}:${i}` })), onDone: (errors, pt, ayudasUsadas) => {
      const st = stars(errors); const prev = S.done[ms.id]; const first = !prev;
      S.done[ms.id] = { stars: Math.max(st, prev ? prev.stars : 0), errors };
      let xp = (first ? 40 + st * 10 : 15 + st * 5) - (ayudasUsadas || 0) * 5; xp = Math.max(10, xp); addXP(xp);
      let extra = "";
      const per = personajeDe(ms.id);
      if (per) { const nueva = !selfieHecha(per); if (nueva) { S.selfies = S.selfies || {}; S.selfies[per.id] = todayKey(); setTimeout(obturador, 500); }
        extra = `<div class="selfie-wrap">${selfieHTML(per, nueva)}<div class="globo">«${esc(per.frase)}»</div><div class="muted small" style="margin-top:6px">${nueva ? "📸 ¡Selfie nueva para tu álbum!" : "Ya tenías esta selfie."} ${esc(per.dato)}</div><a class="btn ghost sm" style="text-decoration:none;margin-top:8px" href="${earthURL(per.lat, per.lon)}" target="_blank" rel="noopener">Ver ${esc(per.lugar.split(",")[0])} en Google Earth 🌎</a></div>`; }
      if (campDone(c) === c.missions.length) { stamp(c.id);
        const nf = C.camps.filter(x => campDone(x) === x.missions.length).length;
        S.pistas = S.pistas || []; if (S.pistas.length < PISTAS.length) { S.pistas.push(S.pistas.length); setTimeout(() => { toast("💭 ¡Nueva pista sobre la Ciudad Aya!"); sonarMelodia(S.pistas.length); }, 2600); }
        setTimeout(() => toast("🧭 ¡Fragmento del mapa conseguido! " + nf + " de 5"), 1400); }
      if (doneMissions() === 1) stamp("first");
      save();
      return { xp, stars: st, extra, back: () => go("camp", { camp: c.id }) };
    } });
  }

  function runQuiz(m, cfg) {
    const qs = cfg.questions; let i = 0, errors = 0, hearts = 5; const perTopic = {};
    const ayudas = { ovaya: true, chupaya: true, estaya: true }; let escudo = false, ayudasUsadas = 0;
    const w = el("div", { class: "mission" }); m.appendChild(w);
    function head() { return `<div class="mhead"><button class="close" id="quit" aria-label="Salir">✕</button><div class="pbar"><b style="width:${(i / qs.length) * 100}%"></b></div><div class="hearts">${"❤".repeat(hearts)}${"♡".repeat(5 - hearts)}</div></div>`; }
    function next() { i++; if (i >= qs.length) return finish(); show(); }
    function finish() {
      const r = cfg.onDone(errors, perTopic, ayudasUsadas); confetti(); jingle("win");
      const st = r.stars;
      const rescued = cfg.char === "chupaya";
      w.innerHTML = `<div class="result fade"><div class="celebrate">${["🎉", "⭐", "🌟", "🎊", "✨", "🎈"].map((e, k) => `<span style="left:${8 + k * 16}%;animation-delay:${k * .15}s">${e}</span>`).join("")}</div><div class="chars"><span style="animation-delay:0s">${monkey("ovaya", "party", 90)}</span><span style="animation-delay:.3s">${monkey(cfg.char === "ovaya" ? "chupaya" : cfg.char, rescued ? "hang" : "party", 110)}</span><span style="animation-delay:.6s">${monkey("estaya", "party", 90)}</span></div>${rescued ? `<div class="tag" style="background:#DDF3E4;color:var(--jungle-deep);font-size:14px;margin-top:6px">🔎 ¡Encontraste a Chupaya!</div>` : ""}
        <div class="eyebrow">${esc(cfg.topic || "")}</div><h2>${st === 3 ? "¡Misión perfecta!" : st === 2 ? "¡Misión cumplida!" : "¡Lo lograste!"}</h2>
        <div class="stars" aria-label="${st} estrellas">${starStr(st)}</div>
        <div class="xp">+${r.xp} XP</div>
        <p class="muted">${errors === 0 ? "Sin errores. ¡Ovaya está orgulloso de ti!" : errors === 1 ? "Solo un error. Lo repasarás en «Repaso»." : `Tuviste ${errors} errores. Aparecerán en «Repaso» para que los domines.`}</p>
        ${r.extra || ""}
        ${chestHTML()}
        <div class="actions" style="justify-content:center"><button class="btn g" id="cont">Continuar</button>${r.retry ? `<button class="btn ghost" id="retry">Repetir</button>` : ""}</div></div>`;
      $("#cont", w).addEventListener("click", r.back);
      if (r.retry) $("#retry", w).addEventListener("click", r.retry);
    }
    function show() {
      const { q, key } = qs[i]; const ch = cfg.char;
      w.innerHTML = head() + `<div class="ayudas" id="ay">${Object.keys(ayudas).map(k => `<button class="ay ${ayudas[k] ? "" : "usada"}" data-aya="${k}" ${ayudas[k] ? "" : "disabled"}>${monkey(k, "happy", 34)}<span><b>${CH[k].name}</b>${{ ovaya: "Escudo", chupaya: "Descarta", estaya: "Lee" }[k]}</span></button>`).join("")}</div><div class="scene"><div class="char">${monkey(ch, i === 0 ? "surprised" : "think", 92)}<span class="nm">${CH[ch].name}</span></div><div class="bubble"><span class="who">${i === 0 ? esc(cfg.title) : "Desafío " + (i + 1) + " de " + qs.length}</span><span class="tw">${i === 0 && cfg.story ? esc(cfg.story) : pickLine(ch)}</span>${SAYBTN}</div></div><div class="qcard" id="qc"></div>`;
      typewrite($(".bubble .tw", w));
      $("#quit", w).addEventListener("click", () => { if (confirm("¿Salir de la misión? Se perderá el avance de esta misión.")) cfg.quit ? cfg.quit() : go("camp", { camp: cfg.camp.id }); });
      $("#ay", w).addEventListener("click", e => {
        const b = e.target.closest(".ay"); if (!b || b.disabled) return; const k = b.dataset.aya; if (!ayudas[k]) return;
        if (k === "chupaya") { const malas = [...w.querySelectorAll(".opt:not([data-ok]):not(.descartada)")].filter(x => !x.disabled); if (!malas.length) return toast("Aquí Chupaya no puede ayudarte."); const q1 = malas[Math.floor(Math.random() * malas.length)]; q1.classList.add("descartada"); q1.disabled = true; toast("Chupaya: «por ahí no es, te lo juro»."); }
        else if (k === "estaya") { const qc = $("#qc", w) || $(".qcard", w); speak([...qc.querySelectorAll("h2, .opt")].map(x => x.textContent).join(". ")); toast("Estaya te lo lee en voz alta."); }
        else { escudo = true; toast("Ovaya te presta su escudo: el próximo error no te quita corazón."); }
        ayudas[k] = false; ayudasUsadas++; b.disabled = true; b.classList.add("usada"); beep(true);
      });
      const qc = $("#qc", w);
      const done = ok => {
        const tp = qs[i].topic || cfg.topic; stat(tp, ok); const pt = perTopic[tp] || (perTopic[tp] = { ok: 0, n: 0, camp: qs[i].campId || (cfg.camp && cfg.camp.id) }); pt.n++; if (ok) pt.ok++; markWrong(key, q.q, qs[i].campId || (cfg.camp ? cfg.camp.id : ""), ok);
        if (!ok) { errors++; if (escudo) { escudo = false; toast("🛡️ El escudo de Ovaya te salvó el corazón."); } else { hearts = Math.max(0, hearts - 1); $(".hearts", w).textContent = "❤".repeat(hearts) + "♡".repeat(5 - hearts); } $("#qc", w).classList.add("shake"); }
        if (ok) beep(true); else jingle("lose"); setMood($(".char .mk", w), ok ? "party" : "sad"); save();
      };
      ({ mc: qMC, fill: qMC, tf: qTF, order: qOrder, match: qMatch, classify: qClassify, write: qWrite })[q.t](qc, q, done, next);
      qc.insertAdjacentHTML("afterbegin", SAYBTN);
    }
    show();
  }
  const LINES = { ovaya: ["¡Uy, esta me da curiosidad! ¿Tú qué crees?", "¡Mira, mira! ¿Qué responderías?", "Yo me sorprendo con todo. ¡Sorpréndeme con tu respuesta!", "¡Vamos, exploradora!"], chupaya: ["Creo que me perdí otra vez… ¿me ayudas con esta?", "¿Esto es por aquí o por allá? ¡Tú sabes!", "Si respondes bien, encuentro el camino.", "¡Ups! No recuerdo nada. ¡Ayuda!"], estaya: ["Esto va con ritmo, ¿eh? Piénsalo tranquila.", "Se me olvidó la letra… ¿cómo era?", "Cierra los ojos, respira… ¿cuál es?", "Relájate y responde, todo fluye."] };
  const pickLine = ch => esc(LINES[ch][Math.floor(Math.random() * LINES[ch].length)]);
  function fbBox(ok, why) { return `<div class="fb show ${ok ? "ok" : "bad"}"><div style="font-size:26px">${ok ? "🎉" : "💡"}</div><div><span class="t">${ok ? ["¡Correcto!", "¡Exacto!", "¡Muy bien!", "¡Perfecto!"][Math.floor(Math.random() * 4)] : "Casi. Mira la explicación:"}</span><div class="why">${esc(why)}</div></div></div>`; }
  function contBtn(next, label) { const a = el("div", { class: "actions" }); const b = el("button", { class: "btn g" }, label || "Continuar →"); b.addEventListener("click", next); a.appendChild(b); return a; }

  function qMC(qc, q, done, next) {
    const isFill = q.t === "fill";
    qc.innerHTML = `<h2>${isFill ? esc(q.q).replace("___", "<span style='color:var(--coral)'>______</span>") : esc(q.q)}</h2>${isFill ? `<div class="ctx">Elige la palabra que completa la frase.</div>` : ""}<div class="opts ${isFill ? "two" : ""}" id="o"></div>`;
    const o = $("#o", qc); const order = shuffle(q.opts.map((t, k) => ({ t, k })));
    order.forEach((op, n) => { const b = el("button", { class: "opt" }, `<span class="k">${"ABCD"[n]}</span><span>${esc(op.t)}</span>`); if (op.k === q.a) b.dataset.ok = "1"; b.addEventListener("click", () => { const ok = op.k === q.a; [...o.children].forEach((x, j) => { x.disabled = true; if (order[j].k === q.a) x.classList.add("ok"); else if (x === b) x.classList.add("bad"); }); qc.insertAdjacentHTML("beforeend", fbBox(ok, q.why)); qc.appendChild(contBtn(next)); done(ok); }); o.appendChild(b); });
  }
  function qTF(qc, q, done, next) {
    qc.innerHTML = `<div class="ctx">¿Verdadero o falso?</div><h2>${esc(q.q)}</h2><div class="opts two" id="o"></div>`;
    const o = $("#o", qc); [["✅ Verdadero", true], ["❌ Falso", false]].forEach(([t, v]) => { const b = el("button", { class: "opt", style: "justify-content:center;font-size:19px" }, `<span>${t}</span>`); if (v === q.a) b.dataset.ok = "1"; b.addEventListener("click", () => { const ok = v === q.a; [...o.children].forEach(x => { x.disabled = true; }); b.classList.add(ok ? "ok" : "bad"); if (!ok) [...o.children].find(x => x !== b).classList.add("ok"); qc.insertAdjacentHTML("beforeend", fbBox(ok, q.why)); qc.appendChild(contBtn(next)); done(ok); }); o.appendChild(b); });
  }
  function qOrder(qc, q, done, next) {
    qc.innerHTML = `<h2>${esc(q.q)}</h2><div class="ctx">Toca los elementos en orden. Toca uno de la lista de abajo para devolverlo.</div><div class="orderwrap"><div class="seq" id="seq"><span class="lab">Tu orden</span></div><div class="pool" id="pool"><span class="lab">Elementos</span></div></div><div class="actions"><button class="btn ghost sm" id="reset">Reiniciar</button><button class="btn g" id="check" disabled>Comprobar</button></div>`;
    let pool = shuffle(q.items), seq = [];
    const draw = () => { const P = $("#pool", qc), Q = $("#seq", qc); P.innerHTML = `<span class="lab">Elementos</span>`; Q.innerHTML = `<span class="lab">Tu orden</span>`; pool.forEach(t => { const b = el("button", { class: "item" }, `<span class="num" style="background:#C9C2AE">+</span><span>${esc(t)}</span>`); b.addEventListener("click", () => { pool = pool.filter(x => x !== t); seq.push(t); draw(); }); P.appendChild(b); }); seq.forEach((t, n) => { const b = el("button", { class: "item" }, `<span class="num">${n + 1}</span><span>${esc(t)}</span>`); b.addEventListener("click", () => { seq = seq.filter(x => x !== t); pool.push(t); draw(); }); Q.appendChild(b); }); $("#check", qc).disabled = pool.length > 0; };
    draw();
    $("#reset", qc).addEventListener("click", () => { pool = shuffle(q.items); seq = []; draw(); });
    $("#check", qc).addEventListener("click", () => { const ok = seq.every((t, n) => t === q.items[n]); [...$("#seq", qc).querySelectorAll(".item")].forEach((b, n) => { b.disabled = true; b.classList.add(seq[n] === q.items[n] ? "ok" : "bad"); }); $("#reset", qc).remove(); $("#check", qc).remove(); if (!ok) qc.insertAdjacentHTML("beforeend", `<div class="model"><span class="t">Orden correcto</span><ol style="margin:0;padding-left:20px">${q.items.map(t => `<li>${esc(t)}</li>`).join("")}</ol></div>`); qc.insertAdjacentHTML("beforeend", fbBox(ok, q.why)); qc.appendChild(contBtn(next)); done(ok); });
  }
  function qMatch(qc, q, done, next) {
    qc.innerHTML = `<h2>${esc(q.q)}</h2><div class="ctx">Toca un elemento de la izquierda y luego su pareja de la derecha.</div><div class="matchwrap"><div class="mcol" id="L"></div><div class="mcol" id="R"></div></div><div class="actions"><button class="btn g" id="check" disabled>Comprobar</button></div>`;
    const cols = ["#F2603E", "#F2B134", "#3FA66B", "#4FB3C9", "#8E6BC7", "#E9A0B4"]; const L = $("#L", qc), R = $("#R", qc);
    const left = q.pairs.map((p, k) => ({ t: p[0], k })), right = shuffle(q.pairs.map((p, k) => ({ t: p[1], k })));
    let selL = null; const pairs = {};
    const draw = () => { L.innerHTML = ""; R.innerHTML = ""; left.forEach(it => { const b = el("button", { class: `mitem ${selL === it.k ? "sel" : ""} ${pairs[it.k] != null ? "paired" : ""}` }, esc(it.t) + (pairs[it.k] != null ? `<span class="dot" style="background:${cols[it.k]}"></span>` : "")); b.addEventListener("click", () => { selL = it.k; draw(); }); L.appendChild(b); }); right.forEach(it => { const lk = Object.keys(pairs).find(k => pairs[k] === it.k); const b = el("button", { class: `mitem ${lk != null ? "paired" : ""}` }, esc(it.t) + (lk != null ? `<span class="dot" style="background:${cols[lk]}"></span>` : "")); b.addEventListener("click", () => { if (selL == null) return toast("Primero elige uno de la izquierda."); for (const k in pairs) if (pairs[k] === it.k) delete pairs[k]; pairs[selL] = it.k; selL = null; draw(); }); R.appendChild(b); }); $("#check", qc).disabled = Object.keys(pairs).length < left.length; };
    draw();
    $("#check", qc).addEventListener("click", () => { let bad = 0; [...L.children].forEach((b, n) => { b.disabled = true; const ok = pairs[n] === n; b.classList.add(ok ? "ok" : "bad"); if (!ok) bad++; }); [...R.children].forEach(b => b.disabled = true); const ok = bad === 0; $("#check", qc).remove(); if (!ok) qc.insertAdjacentHTML("beforeend", `<div class="model"><span class="t">Parejas correctas</span>${q.pairs.map(p => `<div>• <b>${esc(p[0])}</b> → ${esc(p[1])}</div>`).join("")}</div>`); qc.insertAdjacentHTML("beforeend", fbBox(ok, q.why)); qc.appendChild(contBtn(next)); done(ok); });
  }
  function qClassify(qc, q, done, next) {
    const items = shuffle(q.items); let n = 0, bad = 0;
    qc.innerHTML = `<h2>${esc(q.q)}</h2><div class="clswrap"><div class="clsitem" id="it"></div><div class="buckets" id="bk"></div><div class="clsprog" id="pg"></div></div>`;
    const draw = () => { if (n >= items.length) { const ok = bad === 0; qc.insertAdjacentHTML("beforeend", fbBox(ok, (bad ? `Tuviste ${bad} de ${items.length} mal. ` : "") + q.why)); qc.appendChild(contBtn(next)); done(ok); return; } $("#it", qc).textContent = items[n][0]; $("#pg", qc).textContent = `${n + 1} de ${items.length}`; const bk = $("#bk", qc); bk.innerHTML = ""; q.buckets.forEach((b, k) => { const btn = el("button", { class: "bucket" }, esc(b)); btn.addEventListener("click", () => { const ok = items[n][1] === k; if (!ok) bad++; beep(ok); btn.classList.add(ok ? "ok" : "bad"); if (!ok) bk.children[items[n][1]].classList.add("ok"); [...bk.children].forEach(x => x.disabled = true); setTimeout(() => { n++; draw(); }, ok ? 450 : 1300); }); bk.appendChild(btn); }); };
    draw();
  }
  function qWrite(qc, q, done, next) {
    qc.innerHTML = `<div class="ctx">✍️ Respuesta escrita · como en la prueba</div><h2>${esc(q.q)}</h2>${campoVoz("tx", "Escribe aquí tu respuesta con tus palabras…")}<div class="actions"><button class="btn g" id="check" disabled>Ver respuesta modelo</button></div>`;
    const tx = $("#tx", qc); tx.addEventListener("input", () => { $("#check", qc).disabled = tx.value.trim().length < 10; });
    $("#check", qc).addEventListener("click", () => { tx.disabled = true; cerrarVoz(qc); $("#check", qc).remove(); const txt = tx.value.toLowerCase(); const hits = q.keywords.filter(k => txt.includes(k.toLowerCase())); qc.insertAdjacentHTML("beforeend", `<div class="model"><span class="t">Respuesta modelo</span>${esc(q.model)}<div style="margin-top:8px"><span class="small muted">Ideas clave que mencionaste:</span><br>${q.keywords.map(k => `<span class="kw ${hits.includes(k) ? "hit" : ""}">${hits.includes(k) ? "✓ " : ""}${esc(k.replace(/i$/, "iar/ión").replace(/^captur$/, "capturar").replace(/^religi$/, "religión").replace(/^mestiz$/, "mestizaje").replace(/^inver$/, "invertir").replace(/^privad$/, "privada").replace(/^astronom$/, "astronomía").replace(/^financiar\/ión$/, "financiar"))}</span>`).join("")}</div></div><div class="ctx" style="margin-top:12px">Compara con la respuesta modelo. ¿Cómo te fue?</div><div class="opts two"><button class="opt" id="good" style="justify-content:center">😃 Lo tenía bien</button><button class="opt" id="meh" style="justify-content:center">🤔 Me faltó algo</button></div>`); const fin = ok => { $("#good", qc).disabled = $("#meh", qc).disabled = true; qc.insertAdjacentHTML("beforeend", fbBox(ok, ok ? "¡Escribir con tus palabras es la mejor forma de aprender!" : "No pasa nada: vuelve a leer la respuesta modelo y en el repaso lo intentas de nuevo.")); qc.appendChild(contBtn(next)); done(ok); }; $("#good", qc).addEventListener("click", () => fin(true)); $("#meh", qc).addEventListener("click", () => fin(false)); });
  }

  /* ── MINIJUEGO: salto de lianas ── */
  function game(m) {
    const c = C.camps.find(x => x.id === ctx.camp);
    const other = C.camps.filter(x => x !== c).flatMap(x => x.flashcards);
    let items = [];
    c.flashcards.forEach(([f, b]) => { const truth = Math.random() < .55; const back = truth ? b : (shuffle(c.flashcards.filter(x => x[0] !== f)).concat(shuffle(other))[0] || [null, b])[1]; items.push({ txt: `${f}: ${back}`, a: truth }); });
    c.missions.forEach(ms => ms.questions.forEach(q => { if (q.t === "tf") items.push({ txt: q.q, a: q.a }); }));
    items = shuffle(items).slice(0, 10);
    let i = 0, score = 0, timer = null, tleft = 0; const LIMIT = 7;
    const w = el("div", { class: "mission liana-game" }); m.appendChild(w);
    const intro = () => { w.innerHTML = `<button class="btn ghost sm" id="back">← ${esc(c.name)}</button><div class="result"><div class="today" style="text-align:left"><div class="char">${monkey("chupaya", "swing", 90)}</div><div class="bubble"><span class="who">Chupaya</span>¡Ayúdame a cruzar la selva! Te diré ${items.length} cosas sobre ${esc(c.topic.toLowerCase())}. Si es verdad toca ✅, si es mentira toca ❌. ¡Tienes ${LIMIT} segundos por liana!</div></div><div class="actions" style="justify-content:center;margin-top:18px"><button class="btn" id="start">¡A saltar! 🐒</button></div></div>`; $("#back", w).addEventListener("click", () => go("camp", { camp: c.id })); $("#start", w).addEventListener("click", () => { i = 0; score = 0; step(); }); };
    const finish = () => { clearInterval(timer); const xp = 10 + score * 3; addXP(xp); S.games = S.games || {}; S.games["liana-" + c.id] = Math.max(S.games["liana-" + c.id] || 0, score); if (score === items.length) stamp("liana-" + c.id); save(); confetti(); jingle("win"); w.innerHTML = `<div class="result">${monkey("chupaya", "party", 120)}<h2>${score === items.length ? "¡Cruzaste la selva entera!" : score >= items.length * .7 ? "¡Casi al otro lado!" : "¡Buen intento!"}</h2><p class="muted">Chupaya saltó ${score} de ${items.length} lianas.</p><div class="xp">+${xp} XP</div><div class="actions" style="justify-content:center"><button class="btn ghost" id="again">Otra vez</button><button class="btn g" id="back">Volver</button></div></div>`; $("#again", w).addEventListener("click", () => go("game", { camp: c.id })); $("#back", w).addEventListener("click", () => go("camp", { camp: c.id })); };
    const step = () => {
      if (i >= items.length) return finish();
      const it = items[i]; tleft = LIMIT;
      w.innerHTML = `<div class="mhead"><button class="close" id="quit" aria-label="Salir">✕</button><div class="pbar" id="tb"><b style="width:100%;background:linear-gradient(90deg,var(--gold),var(--coral))"></b></div><span class="small muted" style="min-width:60px;text-align:right">${i + 1}/${items.length} · ⭐${score}</span></div>
        <div class="lianas"><div class="sky"></div>${items.map((_, k) => `<div class="lstick" style="left:${8 + k * (84 / (items.length - 1))}%"></div>`).join("")}<div class="jumper" style="left:${8 + i * (84 / (items.length - 1))}%">${monkey("chupaya", "swing", 64)}</div></div>
        <div class="qcard"><div class="ctx">¿Verdadero o falso?</div><h2 style="font-size:21px">${esc(it.txt)}</h2><div class="opts two"><button class="opt" id="t" style="justify-content:center;font-size:20px">✅ Verdadero</button><button class="opt" id="f" style="justify-content:center;font-size:20px">❌ Falso</button></div></div>`;
      $("#quit", w).addEventListener("click", () => { clearInterval(timer); go("camp", { camp: c.id }); });
      const answer = v => { clearInterval(timer); const ok = v === it.a; if (ok) { score++; beep(true); } else jingle("lose"); ["t", "f"].forEach(id => { const b = $("#" + id, w); b.disabled = true; if ((id === "t") === it.a) b.classList.add("ok"); else if ((id === "t") === v) b.classList.add("bad"); }); const j = $(".jumper .mk", w); setMood(j, ok ? "party" : "sad"); if (v === null) toast("⏰ ¡Se acabó el tiempo!"); setTimeout(() => { i++; step(); }, ok ? 650 : 1500); };
      $("#t", w).addEventListener("click", () => answer(true)); $("#f", w).addEventListener("click", () => answer(false));
      timer = setInterval(() => { tleft -= .1; const b = $("#tb b", w); if (b) b.style.width = Math.max(0, tleft / LIMIT * 100) + "%"; if (tleft <= 0) answer(null); }, 100);
    };
    intro();
  }

  /* ── MINIJUEGO: memorice ── */
  function memo(m) {
    const c = C.camps.find(x => x.id === ctx.camp);
    const short = t => { let x = t.split(/[.;]/)[0]; if (x.length > 64) x = x.slice(0, 62).replace(/\s\S*$/, "") + "…"; return x; };
    const pairs = shuffle(c.flashcards.filter(f => f[0].length <= 28)).slice(0, 6);
    let cards = shuffle(pairs.flatMap((p, k) => [{ k, t: p[0], kind: "a" }, { k, t: short(p[1]), kind: "b" }]));
    let open = [], found = 0, moves = 0, lock = false;
    const w = el("div", { class: "mission" }); m.appendChild(w);
    w.innerHTML = `<div class="mhead"><button class="close" id="quit" aria-label="Salir">✕</button><div class="pbar"><b id="mp" style="width:0%"></b></div><span class="small muted" id="mv" style="min-width:70px;text-align:right">0 mov.</span></div>
      <div class="today" style="margin-bottom:12px"><div class="char">${monkey("estaya", "happy", 72)}</div><div class="bubble"><span class="who">Estaya</span><span class="tw">Da vuelta dos cartas: un concepto y su definición hacen pareja. ¡Con menos movimientos, más XP!</span>${SAYBTN}</div></div>
      <div class="memo" id="grid">${cards.map((cd, i) => `<button class="mcard ${cd.kind}" data-i="${i}"><span class="in"><span class="f">🐒</span><span class="b">${esc(cd.t)}</span></span></button>`).join("")}</div>`;
    typewrite($(".bubble .tw", w));
    $("#quit", w).addEventListener("click", () => go("camp", { camp: c.id }));
    $("#grid", w).addEventListener("click", e => {
      const b = e.target.closest(".mcard"); if (!b || lock || b.classList.contains("flip") || b.classList.contains("done")) return;
      b.classList.add("flip"); beep(true); open.push(b);
      if (open.length === 2) { moves++; $("#mv", w).textContent = moves + " mov."; const [x, y] = open; const cx = cards[+x.dataset.i], cy = cards[+y.dataset.i];
        if (cx.k === cy.k && cx.kind !== cy.kind) { found++; open = []; x.classList.add("done"); y.classList.add("done"); jingle("stamp"); $("#mp", w).style.width = (found / pairs.length * 100) + "%"; if (found === pairs.length) setTimeout(finish, 600); }
        else { lock = true; setTimeout(() => { x.classList.remove("flip"); y.classList.remove("flip"); open = []; lock = false; }, 900); } }
    });
    function finish() { const xp = Math.max(12, 40 - (moves - pairs.length) * 3); addXP(xp); S.games = S.games || {}; S.games["memo-" + c.id] = Math.min(S.games["memo-" + c.id] || 99, moves); if (moves <= pairs.length + 3) stamp("memo-" + c.id); save(); confetti(); jingle("win");
      w.innerHTML = `<div class="result">${monkey("estaya", "party", 120)}<h2>${moves <= pairs.length + 2 ? "¡Memoria de elefante!" : "¡Parejas completas!"}</h2><p class="muted">Encontraste las ${pairs.length} parejas en ${moves} movimientos.</p><div class="xp">+${xp} XP</div><div class="actions" style="justify-content:center"><button class="btn ghost" id="again">Otra vez</button><button class="btn g" id="back">Volver</button></div></div>`;
      $("#again", w).addEventListener("click", () => go("memo", { camp: c.id })); $("#back", w).addEventListener("click", () => go("camp", { camp: c.id })); }
  }

  /* ── CANCIÓN DE ESTAYA (karaoke) ── */
  let beatTimer = null;
  function beat(on) { clearInterval(beatTimer); if (!on || !S.sound || !AC) return; try { actx = actx || new AC(); let n = 0; beatTimer = setInterval(() => { const t = actx.currentTime; const o = actx.createOscillator(), g = actx.createGain(); o.connect(g); g.connect(actx.destination); const strong = n % 4 === 0; o.frequency.setValueAtTime(strong ? 160 : 110, t); o.frequency.exponentialRampToValueAtTime(50, t + .12); g.gain.setValueAtTime(strong ? .25 : .12, t); g.gain.exponentialRampToValueAtTime(.001, t + .15); o.start(t); o.stop(t + .16); n++; }, 480); } catch (e) { } }
  function song(m) {
    const c = C.camps.find(x => x.id === ctx.camp);
    const short = t => { let x = t.split(/[.;]/)[0]; if (x.length > 70) x = x.slice(0, 68).replace(/\s\S*$/, "") + "…"; return x; };
    const lines = shuffle(c.flashcards).slice(0, 6).map(([f, b]) => `${f}: ${short(b)}`);
    const w = el("div", { class: "mission" }); m.appendChild(w); let li = 0, playing = false;
    const draw = () => { w.innerHTML = `<div class="mhead"><button class="close" id="quit" aria-label="Salir">✕</button><div class="pbar"><b id="sp" style="width:0%;background:linear-gradient(90deg,#8E6BC7,#E9A0B4)"></b></div><span class="small muted" style="min-width:60px;text-align:right">🎵</span></div>
      <div class="today" style="margin-bottom:12px"><div class="char">${monkey("estaya", "happy", 76)}</div><div class="bubble"><span class="who">Estaya</span><span class="tw">Compuse una canción con lo más importante de ${esc(c.name)}. Escúchala, síguela y después… ¡completa la letra!</span>${SAYBTN}</div></div>
      <div class="lyrics" id="ly">${lines.map((l, k) => `<div class="line" data-k="${k}">♪ ${esc(l)}</div>`).join("")}</div>
      <div class="actions" style="justify-content:center"><button class="btn" id="play">▶ Cantar</button><button class="btn g" id="fill">Completar la letra →</button></div>`;
      $("#quit", w).addEventListener("click", () => { stop(); go("camp", { camp: c.id }); });
      $("#play", w).addEventListener("click", () => playing ? stop() : play());
      $("#fill", w).addEventListener("click", () => { stop(); fillGame(); }); };
    const stop = () => { playing = false; beat(false); try { speechSynthesis.cancel(); } catch (e) { } const b = $("#play", w); if (b) b.textContent = "▶ Cantar"; };
    const play = () => { playing = true; li = 0; beat(true); $("#play", w).textContent = "⏸ Pausar"; const mk = $(".today .mk", w); setMood(mk, "party"); next(); };
    const next = () => { if (!playing) return; if (li >= lines.length) { stop(); setMood($(".today .mk", w), "happy"); toast("🎶 ¡Fin de la canción! Ahora completa la letra."); return; } [...w.querySelectorAll(".line")].forEach((x, k) => x.classList.toggle("on", k === li)); $("#sp", w).style.width = ((li + 1) / lines.length * 100) + "%"; const txt = lines[li]; li++;
      if ("speechSynthesis" in window) { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(txt); u.lang = voiceEs ? voiceEs.lang : "es-ES"; if (voiceEs) u.voice = voiceEs; u.rate = .9; u.pitch = 1.25; u.onend = () => setTimeout(next, 350); u.onerror = () => setTimeout(next, 1800); speechSynthesis.speak(u); } catch (e) { setTimeout(next, 2200); } } else setTimeout(next, 2200); };
    const fillGame = () => { const qs = shuffle(lines).slice(0, 4).map(l => { const words = l.split(": ")[1].split(" ").filter(x => x.length > 4 && /^[a-záéíóúñ]+$/i.test(x)); const key = words[Math.floor(Math.random() * words.length)] || l.split(": ")[0]; const wrong = shuffle(C.camps.flatMap(x => x.flashcards).flatMap(f => f[1].split(" ")).filter(x => x.length > 4 && /^[a-záéíóúñ]+$/i.test(x) && x.toLowerCase() !== key.toLowerCase())).slice(0, 2); return { l, key, opts: shuffle([key, ...wrong]) }; }); let i = 0, score = 0;
      const step = () => { if (i >= qs.length) { const xp = 15 + score * 5; addXP(xp); S.games = S.games || {}; S.games["song-" + c.id] = Math.max(S.games["song-" + c.id] || 0, score); if (score === qs.length) stamp("song-" + c.id); save(); confetti(); jingle("win"); w.innerHTML = `<div class="result">${monkey("estaya", "party", 120)}<h2>${score === qs.length ? "¡Te la sabes entera!" : "¡Buen ritmo!"}</h2><p class="muted">Completaste ${score} de ${qs.length} versos.</p><div class="xp">+${xp} XP</div><div class="actions" style="justify-content:center"><button class="btn ghost" id="again">Cantar otra vez</button><button class="btn g" id="back">Volver</button></div></div>`; $("#again", w).addEventListener("click", () => go("song", { camp: c.id })); $("#back", w).addEventListener("click", () => go("camp", { camp: c.id })); return; }
        const q = qs[i]; const shown = q.l.replace(new RegExp(q.key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), "______");
        w.innerHTML = `<div class="mhead"><button class="close" id="quit">✕</button><div class="pbar"><b style="width:${i / qs.length * 100}%"></b></div><span class="small muted">${i + 1}/${qs.length}</span></div><div class="scene"><div class="char">${monkey("estaya", "think", 80)}<span class="nm">Estaya</span></div><div class="bubble"><span class="who">Se me olvidó una palabra…</span><span class="tw">♪ ${esc(shown)} ♪</span></div></div><div class="qcard"><h2 style="font-size:19px">¿Qué palabra falta?</h2><div class="opts" id="o"></div></div>`;
        $("#quit", w).addEventListener("click", () => go("camp", { camp: c.id }));
        q.opts.forEach((op, n) => { const b = el("button", { class: "opt" }, `<span class="k">${"ABC"[n]}</span><span>${esc(op)}</span>`); b.addEventListener("click", () => { const ok = op === q.key; if (ok) { score++; beep(true); } else jingle("lose"); [...$("#o", w).children].forEach((x, j) => { x.disabled = true; if (q.opts[j] === q.key) x.classList.add("ok"); else if (x === b) x.classList.add("bad"); }); setMood($(".scene .mk", w), ok ? "party" : "sad"); $(".qcard", w).insertAdjacentHTML("beforeend", fbBox(ok, `♪ ${q.l} ♪`)); $(".qcard", w).appendChild(contBtn(() => { i++; step(); })); }); $("#o", w).appendChild(b); }); };
      step(); };
    draw();
  }

  /* ── RESPONDER HABLANDO (dictado por voz) ── */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const EN_MARCO = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
  const SEGURO = location.protocol === "https:" || ["localhost", "127.0.0.1"].includes(location.hostname);
  const UA = navigator.userAgent;
  const ES_SAFARI = /Safari/i.test(UA) && !/Chrome|Chromium|CriOS|FxiOS|Edg|OPR/i.test(UA);
  const NAV = /CriOS|Chrome|Chromium/i.test(UA) ? "Chrome" : /FxiOS|Firefox/i.test(UA) ? "Firefox" : /Edg/i.test(UA) ? "Edge" : ES_SAFARI ? "Safari" : "otro";

  const campoVoz = (id, ph) => `<div class="campo-voz">
      <textarea class="write" id="${id}" placeholder="${esc(ph)}"></textarea>
      <div class="voz-barra"><button class="mic" data-target="${id}"><span class="mic-ic">🎤</span><span class="mic-txt">Responder hablando</span></button><span class="voz-hint">o escríbelo con el teclado</span></div>
    </div>`;

  function problemaVoz() {
    if (!SR) return { t: "Este navegador no entiende la voz", d: `Estás usando ${NAV}, que no tiene reconocimiento de voz. Abre la app en Google Chrome y el micrófono va a funcionar.` };
    if (!SEGURO) return { t: "La dirección no es segura", d: "El micrófono solo funciona en direcciones que empiezan con https." };
    return null;
  }
  function panelProblema(barra, p, reintentar) {
    const card = el("div", { class: "voz-problema" }, `<b>🎤 ${esc(p.t)}</b><p>${esc(p.d)}</p>${reintentar ? `<button class="btn ghost sm" data-reintentar="1">Reintentar</button>` : ""}`);
    barra.replaceWith(card);
    if (reintentar) card.querySelector("[data-reintentar]").addEventListener("click", () => { card.replaceWith(barra); });
  }

  let rec = null, recBtn = null, recTa = null, recBase = "", recFinal = "", recSigue = false, recReinicios = 0, recIdioma = "es-CL";
  function limpiaVoz() {
    if (recBtn) { recBtn.classList.remove("grabando"); const t = recBtn.querySelector(".mic-txt"); if (t) t.textContent = "Responder hablando"; }
    if (recTa) recTa.classList.remove("escuchando");
    recBtn = null; recTa = null; recSigue = false;
  }
  function pararVoz(inmediato) {
    if (!rec) return; const r = rec; recSigue = false;
    if (inmediato) { try { r.abort(); } catch (e) { } rec = null; limpiaVoz(); return; }
    try { r.stop(); } catch (e) { try { r.abort(); } catch (e2) { } }
    setTimeout(() => { if (rec === r) { rec = null; limpiaVoz(); } }, 1500);
  }
  const cerrarVoz = cont => { pararVoz(true); const vb = $(".voz-barra", cont); if (vb) vb.remove(); };
  function pulir(t) { t = t.replace(/\s+/g, " ").trim(); if (!t) return t; t = t[0].toUpperCase() + t.slice(1); if (!/[.!?…]$/.test(t)) t += "."; return t; }

  function arrancarVoz(b, ta) {
    const r = new SR();
    r.lang = recIdioma; r.continuous = !ES_SAFARI; r.interimResults = true; r.maxAlternatives = 1;
    rec = r; recBtn = b; recTa = ta; recSigue = true;
    recBase = ta.value.trim() ? ta.value.trim() + " " : ""; recFinal = ""; recReinicios = 0;
    b.classList.add("grabando"); b.querySelector(".mic-txt").textContent = "Escuchando… toca para terminar";
    ta.classList.add("escuchando");
    r.onresult = ev => {
      let interim = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const t = ev.results[i][0].transcript;
        if (ev.results[i].isFinal) recFinal += t + " "; else interim += t;
      }
      ta.value = recBase + recFinal + interim;
      ta.dispatchEvent(new Event("input")); ta.scrollTop = ta.scrollHeight;
    };
    r.onerror = ev => {
      if (ev.error === "language-not-supported" && recIdioma !== "es-ES") { recIdioma = "es-ES"; recSigue = false; setTimeout(() => arrancarVoz(b, ta), 150); return; }
      recSigue = false;
      if (ev.error === "not-allowed" || ev.error === "service-not-allowed") toast(EN_MARCO ? "Abre la app en su propia pestaña para usar el micrófono." : "Permite el micrófono en el navegador para poder hablar.");
      else if (ev.error === "no-speech") toast("No te escuché. Toca el micrófono y habla de nuevo.");
      else if (ev.error === "audio-capture") toast("No encuentro ningún micrófono en este dispositivo.");
      else if (ev.error === "network") toast("El dictado necesita internet.");
      else if (ev.error !== "aborted") toast("Hubo un problema con el micrófono.");
    };
    r.onend = () => {
      if (recSigue && recReinicios < 40 && recTa) { recReinicios++; try { r.start(); return; } catch (e) { } }
      if (recTa && recFinal) { recTa.value = pulir(recBase + recFinal); recTa.dispatchEvent(new Event("input")); }
      rec = null; limpiaVoz();
    };
    try { r.start(); beep(true); toast("Habla con calma. Toca otra vez cuando termines."); }
    catch (err) { rec = null; limpiaVoz(); toast("No se pudo iniciar el micrófono. Intenta otra vez."); }
  }

  document.addEventListener("click", async e => {
    const b = e.target.closest(".mic"); if (!b) return;
    const ta = document.getElementById(b.dataset.target); if (!ta || ta.disabled) return;
    if (rec) { const mismo = recBtn === b; pararVoz(); if (mismo) return; }
    const p = problemaVoz();
    if (p) return panelProblema(b.closest(".voz-barra"), p, false);
    b.querySelector(".mic-txt").textContent = "Pidiendo permiso…";
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const st = await navigator.mediaDevices.getUserMedia({ audio: true });
        st.getTracks().forEach(t => t.stop());
      }
    } catch (err) {
      b.querySelector(".mic-txt").textContent = "Responder hablando";
      const nombre = err && err.name || "";
      if (nombre === "NotFoundError" || nombre === "DevicesNotFoundError") return panelProblema(b.closest(".voz-barra"), { t: "No encuentro el micrófono", d: "Este dispositivo no tiene micrófono disponible, o está siendo usado por otra aplicación." }, true);
      if (EN_MARCO) return panelProblema(b.closest(".voz-barra"), { t: "La app está dentro de un marco", d: "Para hablar, abre la app en su propia pestaña con el enlace https://mtaylorcharme-web.github.io/expedicion-leti/ y vuelve a intentarlo." }, true);
      return panelProblema(b.closest(".voz-barra"), { t: "El navegador bloqueó el micrófono", d: NAV === "Safari" ? "En Safari, entra al menú Safari, luego Ajustes para este sitio web, y cambia Micrófono a Permitir." : "Toca el candado o el icono de cámara en la barra de direcciones y permite el micrófono para este sitio." }, true);
    }
    arrancarVoz(b, ta);
  });

  /* Diagnóstico del micrófono, para el panel de Mariana y Francisco */
  async function diagnosticoVoz() {
    let permiso = "no se puede consultar";
    try { if (navigator.permissions) { const st = await navigator.permissions.query({ name: "microphone" }); permiso = st.state === "granted" ? "concedido" : st.state === "denied" ? "denegado" : "lo va a preguntar"; } } catch (e) { }
    let micros = "no se puede consultar";
    try { if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) { const ds = await navigator.mediaDevices.enumerateDevices(); micros = ds.filter(d => d.kind === "audioinput").length + " encontrado(s)"; } } catch (e) { }
    return [
      ["Navegador", NAV],
      ["Reconocimiento de voz", SR ? "disponible" : "NO disponible en este navegador"],
      ["Dirección segura (https)", SEGURO ? "sí" : "NO"],
      ["Dentro de un marco", EN_MARCO ? "SÍ (aquí el micrófono se bloquea)" : "no"],
      ["Permiso del micrófono", permiso],
      ["Micrófonos del dispositivo", micros]
    ];
  }

  /* ── ENSÉÑALE A CHUPAYA (aprender enseñando) ── */
  const leccionHecha = l => !!(S.lecciones && S.lecciones[l.id]);

  function ensenar(m) {
    const c = C.camps.find(x => x.id === ctx.camp);
    const L = LECCIONES.find(x => x.camp === c.id);
    let memoria = 0, momento = 0;
    const w = el("div", { class: "mission" }); m.appendChild(w);
    const subir = (n) => { memoria = Math.min(100, memoria + n); const b = $("#mem b", w); if (b) { b.style.width = memoria + "%"; $("#mem .pct", w).textContent = Math.round(memoria) + "%"; } };
    const barra = () => `<div class="memoria" id="mem"><span class="lbl">🧠 Memoria de Chupaya</span><div class="mbar"><b style="width:${memoria}%"></b></div><span class="pct">${Math.round(memoria)}%</span></div>`;
    const cabeza = () => `<div class="mhead"><button class="close" id="quit" aria-label="Salir">✕</button><div class="pbar"><b style="width:${(momento / 4) * 100}%;background:linear-gradient(90deg,#2E7D4F,#6FD394)"></b></div><span class="small muted" style="min-width:70px;text-align:right">Paso ${Math.min(momento + 1, 4)}/4</span></div>` + barra();
    const salir = () => { if (confirm("¿Dejar a Chupaya a medias? Se perderá el avance de esta lección.")) go("camp", { camp: c.id }); };
    const dice = (texto, mood, clase) => `<div class="scene"><div class="char">${monkey("chupaya", mood || "think", 84)}<span class="nm">Chupaya</span></div><div class="bubble ${clase || ""}"><span class="who">Chupaya pregunta</span><span class="tw">${esc(texto)}</span>${SAYBTN}</div></div>`;

    function intro() {
      w.innerHTML = `<button class="btn ghost sm" id="back">← ${esc(c.name)}</button>` + barra() + `
        <div class="result" style="margin-top:8px"><div class="chars"><span>${monkey("chupaya", "think", 130)}</span></div>
        <h2>Chupaya se olvidó de todo</h2>
        <p class="muted">Explicárselo a alguien es la mejor forma de aprenderlo tú. Si él entiende, es porque tú entendiste.</p>
        <div class="bubble wl" style="text-align:left;margin-top:12px"><span class="who">Chupaya</span><span class="tw">${esc(L.pregunta)}</span>${SAYBTN}</div>
        <div class="actions" style="justify-content:center;margin-top:16px"><button class="btn" id="go">Explicarle 🐒</button></div></div>`;
      typewrite($(".bubble .tw", w));
      $("#back", w).addEventListener("click", () => go("camp", { camp: c.id }));
      $("#go", w).addEventListener("click", armar);
    }

    function armar() {
      momento = 0;
      const ops = L.armar.bloques.map((b, i) => ({ ...b, i }));
      const sel = new Set();
      w.innerHTML = cabeza() + dice(L.pregunta, "think") + `<div class="qcard"><div class="ctx">${esc(L.armar.instruccion)}</div><h2 style="font-size:20px">Arma tu explicación</h2><div class="bloques" id="bl"></div><div class="actions"><button class="btn g" id="ok" disabled>Explicárselo a Chupaya</button></div></div>`;
      $("#quit", w).addEventListener("click", salir);
      const cont = $("#bl", w);
      shuffle(ops).forEach(op => {
        const b = el("button", { class: "bloque" }, `<span class="tick">+</span><span>${esc(op.t)}</span>`);
        b.addEventListener("click", () => { const t = b.querySelector(".tick"); if (sel.has(op.i)) { sel.delete(op.i); b.classList.remove("sel"); t.textContent = "+"; } else { sel.add(op.i); b.classList.add("sel"); t.textContent = "\u2713"; beep(true); } $("#ok", w).disabled = sel.size === 0; });
        cont.appendChild(b);
      });
      $("#ok", w).addEventListener("click", () => {
        const buenos = L.armar.bloques.filter(b => b.ok).length;
        let bien = 0, mal = 0;
        const hijos = [...cont.children];
        hijos.forEach(b => {
          const txt = b.querySelector("span:last-child").textContent;
          const dat = L.armar.bloques.find(x => x.t === txt);
          b.disabled = true;
          const elegido = b.classList.contains("sel");
          if (dat.ok && elegido) { b.classList.add("ok"); bien++; }
          else if (!dat.ok && elegido) { b.classList.add("bad"); mal++; b.insertAdjacentHTML("beforeend", `<span class="nota">${esc(dat.why)}</span>`); }
          else if (dat.ok && !elegido) { b.classList.add("falta"); b.insertAdjacentHTML("beforeend", `<span class="nota">Esta también servía.</span>`); }
        });
        const parrafo = L.armar.bloques.filter(x => x.ok && [...sel].some(i => L.armar.bloques[i] === x)).map(x => x.t).join(" ");
        $("#ok", w).remove();
        const perfecto = bien === buenos && mal === 0;
        subir(Math.max(0, 25 * (bien / buenos) - 5 * mal));
        if (perfecto) { beep(true); } else jingle("lose");
        $(".qcard", w).insertAdjacentHTML("beforeend", parrafo ? `<div class="explicacion"><span class="t">Le explicaste a Chupaya</span><p>${esc(parrafo)}</p></div>` : "");
        $(".qcard", w).insertAdjacentHTML("beforeend", fbBox(perfecto, perfecto ? "Explicación completa y sin errores. Chupaya está entendiendo." : `Elegiste ${bien} de ${buenos} ideas correctas${mal ? ` y ${mal} que no servía${mal > 1 ? "n" : ""}` : ""}. Lee las notas en rojo y en amarillo.`));
        $(".qcard", w).appendChild(contBtn(() => { momento = 1; repregunta(); }, "Chupaya quiere preguntarte algo →"));
        $(".char .mk", w) && setMood($(".char .mk", w), perfecto ? "happy" : "think");
      });
    }

    function eleccionSimple(datos, textoChupaya, mood, clase, titulo, luego, etiqueta) {
      w.innerHTML = cabeza() + dice(textoChupaya, mood, clase) + `<div class="qcard"><div class="ctx">${esc(titulo)}</div><h2 style="font-size:20px">${esc(datos.q || "¿Qué le respondes?")}</h2><div class="opts" id="o"></div></div>`;
      $("#quit", w).addEventListener("click", salir);
      typewrite($(".bubble .tw", w));
      const orden = shuffle(datos.opts.map((t, k) => ({ t, k })));
      orden.forEach((op, n) => {
        const b = el("button", { class: "opt" }, `<span class="k">${"ABC"[n]}</span><span>${esc(op.t)}</span>`);
        b.addEventListener("click", () => {
          const ok = op.k === datos.a;
          [...$("#o", w).children].forEach((x, j) => { x.disabled = true; if (orden[j].k === datos.a) x.classList.add("ok"); else if (x === b) x.classList.add("bad"); });
          if (ok) { subir(25); beep(true); } else jingle("lose");
          setMood($(".char .mk", w), ok ? "party" : "sad");
          $(".qcard", w).insertAdjacentHTML("beforeend", fbBox(ok, datos.why));
          $(".qcard", w).appendChild(contBtn(luego, etiqueta));
        });
        $("#o", w).appendChild(b);
      });
    }

    const repregunta = () => eleccionSimple(L.repregunta, L.repregunta.q, "think", "", "Chupaya te repregunta. Responderle bien es la prueba de que entendiste.", () => { momento = 2; confusion(); }, "Seguir →");

    function confusion() {
      const d = { q: "¿Qué le respondes?", opts: L.confusion.opts, a: L.confusion.a, why: L.confusion.why };
      eleccionSimple(d, L.confusion.dice, "happy", "mal", "¡Cuidado! Chupaya entendió mal. Corrígelo.", () => { momento = 3; escribir(); }, "Último paso →");
      const b = $(".bubble .who", w); if (b) b.textContent = "Chupaya cree que entendió";
    }

    function escribir() {
      w.innerHTML = cabeza() + dice("Ahora dímelo todo junto, con tus palabras, así lo anoto en mi cuaderno.", "happy") + `<div class="qcard"><div class="ctx">${esc(L.escribir.pregunta)}</div><h2 style="font-size:20px">Escríbeselo con tus palabras</h2>${campoVoz("tx", "Chupaya, esto pasó así…")}<div class="actions"><button class="btn g" id="ver" disabled>Comparar con la respuesta modelo</button></div></div>`;
      $("#quit", w).addEventListener("click", salir);
      const tx = $("#tx", w);
      tx.addEventListener("input", () => { $("#ver", w).disabled = tx.value.trim().length < 20; });
      $("#ver", w).addEventListener("click", () => {
        tx.disabled = true; cerrarVoz(w); $("#ver", w).remove();
        $(".qcard", w).insertAdjacentHTML("beforeend", `<div class="model"><span class="t">Respuesta modelo</span>${esc(L.escribir.modelo)}</div>
          <div class="ctx" style="margin-top:14px">Compara con lo tuyo y marca lo que sí pusiste. Sé honesta: lo que no marques es justo lo que hay que repasar.</div>
          <div class="rubrica" id="ru">${L.escribir.rubrica.map((r, k) => `<label><input type="checkbox" data-k="${k}"><span>${esc(r)}</span></label>`).join("")}</div>
          <div class="actions"><button class="btn g" id="listo">Listo</button></div>`);
        $("#listo", w).addEventListener("click", () => {
          const marcadas = [...$("#ru", w).querySelectorAll("input")].filter(i => i.checked).length;
          const tot = L.escribir.rubrica.length;
          subir(25 * (marcadas / tot));
          $("#ru", w).querySelectorAll("input").forEach(i => i.disabled = true); $("#listo", w).remove();
          const msg = marcadas === tot ? "Explicación completa. Chupaya lo anotó todo." : marcadas === 0 ? "Vuelve a leer la respuesta modelo: ahí están las ideas que hay que decir." : `Pusiste ${marcadas} de ${tot} ideas clave. Las que faltaron son las que conviene repasar.`;
          $(".qcard", w).insertAdjacentHTML("beforeend", fbBox(marcadas >= Math.ceil(tot / 2), msg));
          $(".qcard", w).appendChild(contBtn(fin, "Ver cómo quedó Chupaya →"));
        });
      });
    }

    function fin() {
      const pct = Math.round(memoria);
      const estrellas = pct >= 90 ? 3 : pct >= 65 ? 2 : 1;
      S.lecciones = S.lecciones || {};
      const prev = S.lecciones[L.id]; const primera = !prev;
      S.lecciones[L.id] = { pct: Math.max(pct, prev ? prev.pct : 0), estrellas: Math.max(estrellas, prev ? prev.estrellas : 0) };
      const xp = primera ? 40 + estrellas * 10 : 15 + estrellas * 4; addXP(xp);
      const todas = LECCIONES.filter(leccionHecha).length;
      if (todas >= 1) stamp("maestra");
      if (todas === LECCIONES.length) stamp("maestra-max");
      save(); confetti(); jingle("win");
      w.innerHTML = `<div class="result"><div class="celebrate">${["🧠", "🎉", "⭐", "📓", "✨"].map((e, k) => `<span style="left:${10 + k * 19}%;animation-delay:${k * .15}s">${e}</span>`).join("")}</div>
        <div class="chars"><span>${monkey("chupaya", pct >= 65 ? "party" : "think", 130)}</span></div>
        <h2>${pct >= 90 ? "¡Chupaya lo entendió todo!" : pct >= 65 ? "¡Chupaya entendió casi todo!" : "Chupaya entendió a medias"}</h2>
        ${barra()}
        <div class="stars" aria-label="${estrellas} estrellas">${starStr(estrellas)}</div><div class="xp">+${xp} XP</div>
        <div class="bubble wl" style="text-align:left;margin-top:14px"><span class="who">Chupaya</span>${esc(pct >= 65 ? L.final : "Creo que me falta un poquito… ¿me lo explicas otra vez?")}</div>
        <div class="actions" style="justify-content:center"><button class="btn ghost" id="otra">Explicárselo de nuevo</button><button class="btn g" id="volver">Volver a la selva</button></div></div>`;
      $("#otra", w).addEventListener("click", () => go("ensenar", { camp: c.id }));
      $("#volver", w).addEventListener("click", () => go("camp", { camp: c.id }));
    }

    intro();
  }

  /* ── SELFIES CON PERSONAJES HISTÓRICOS ── */
  const personajeDe = mid => PERSONAJES.find(p => p.mision === mid);
  const selfieHecha = p => !!(S.selfies && S.selfies[p.id]);
  const earthURL = (lat, lon) => `https://earth.google.com/web/@${lat},${lon},1200a,18000d,35y,0h,45t,0r`;
  function obturador() {
    if (!S.sound || !AC) return; try { actx = actx || new AC(); const t = actx.currentTime;
      [0, .07].forEach((dt, k) => { const o = actx.createOscillator(), g = actx.createGain(); o.type = "square"; o.frequency.setValueAtTime(k ? 1600 : 2400, t + dt); o.connect(g); g.connect(actx.destination); g.gain.setValueAtTime(.09, t + dt); g.gain.exponentialRampToValueAtTime(.001, t + dt + .05); o.start(t + dt); o.stop(t + dt + .06); });
    } catch (e) { }
  }
  const selfieHTML = (p, nueva) => `<figure class="selfie ${nueva ? "nueva" : ""}" data-selfie="${p.id}">
      <div class="foto"><img class="retrato" src="assets/historia/${p.id}.jpg" alt="${esc(p.nombre)}">
        <span class="aya">${monkey(p.aya, "party", 78)}</span><span class="destello"></span></div>
      <figcaption><b>${esc(CHARS[p.aya].name)} y ${esc(p.nombre)}</b><span>${esc(p.lugar)} · ${esc(p.anio)}</span></figcaption>
    </figure>`;

  /* ── EL MUNDO: dónde y cuándo pasó todo ── */
  function mundo(m) {
    const abiertos = C.camps.filter(campUnlocked).map(c => c.id);
    const lugares = LUGARES.slice().sort((a, b) => a.anio - b.anio);
    const w = el("div");
    w.innerHTML = `<div class="camphead"><div class="icon" style="background:#4FB3C9">🌍</div><div><div class="eyebrow">Ubícate en el mundo</div><h2 style="font-size:26px;font-weight:600">Dónde y cuándo pasó</h2><div class="muted small">Toca un punto del mapa para ver qué ocurrió ahí y abrirlo en Google Earth.</div></div></div>
      <div class="mundo-mapa"><img src="assets/mapa/mundi.jpg" alt="Mapa del mundo"><div class="pines" id="pines"></div></div>
      <div id="ficha"></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600;margin-bottom:8px">Línea de tiempo de la unidad</h3><div class="tline" id="tl">${lugares.map(l => `<button class="tev ${abiertos.includes(l.camp) ? "" : "gris"}" data-id="${l.id}"><b>${l.anio < 0 ? Math.abs(l.anio) + " a.C." : l.anio}</b><span>${esc(l.n)}</span></button>`).join("")}</div></div>`;
    const pines = $("#pines", w);
    lugares.forEach(l => {
      const b = el("button", { class: `pin ${abiertos.includes(l.camp) ? "" : "gris"}`, style: `left:${((l.lon + 180) / 360) * 100}%;top:${((90 - l.lat) / 180) * 100}%`, "aria-label": l.n, "data-id": l.id });
      pines.appendChild(b);
    });
    const mostrar = id => {
      const l = LUGARES.find(x => x.id === id); const c = C.camps.find(x => x.id === l.camp);
      pines.querySelectorAll(".pin").forEach(p => p.classList.toggle("sel", p.dataset.id === id));
      $("#ficha", w).innerHTML = `<div class="card ficha-lugar fade"><div class="row" style="justify-content:space-between;align-items:flex-start;gap:10px"><div><div class="eyebrow">${esc(l.pais)} · ${l.anio < 0 ? Math.abs(l.anio) + " a.C." : "año " + l.anio}</div><h3 style="font-size:22px;font-weight:600">${esc(l.n)}</h3></div><span class="tag" style="background:${c.color}22;color:${c.color}">${c.icon} ${esc(c.name)}</span></div>
        <p style="margin:8px 0 0;font-size:16px">${esc(l.q)}</p>
        <div class="actions" style="justify-content:flex-start"><a class="btn sm" style="text-decoration:none;background:#4FB3C9;box-shadow:0 3px 0 #2E8AA0" href="${earthURL(l.lat, l.lon)}" target="_blank" rel="noopener">Ver en Google Earth 🌎</a><span class="muted small">${l.lat.toFixed(2)}°, ${l.lon.toFixed(2)}°</span></div></div>`;
      $(".ficha-lugar", w).scrollIntoView({ block: "nearest", behavior: "smooth" });
    };
    w.addEventListener("click", e => { const b = e.target.closest("[data-id]"); if (b) { beep(true); mostrar(b.dataset.id); } });
    m.appendChild(w); mostrar(lugares[0].id);
  }

  /* ── LA CIUDAD AYA: descartar lugares hasta dar con casa ── */
  const pistasGanadas = () => (S.pistas || []).length;
  function sonarMelodia(n) {
    if (!S.sound || !AC) return; try { actx = actx || new AC(); const t0 = actx.currentTime;
      MELODIA.slice(0, n).forEach((f, k) => { const o = actx.createOscillator(), g = actx.createGain(); o.type = "triangle"; o.frequency.value = f; o.connect(g); g.connect(actx.destination); const t = t0 + k * .28; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.16, t + .03); g.gain.exponentialRampToValueAtTime(.0001, t + .26); o.start(t); o.stop(t + .28); });
    } catch (e) { }
  }
  function ciudad(m) {
    const n = pistasGanadas();
    const descartados = PISTAS.slice(0, n).map(p => p.descarta);
    const quedan = CANDIDATOS.filter(c => !descartados.includes(c.id));
    const encontrada = quedan.length === 1;
    const w = el("div");
    w.innerHTML = `<button class="btn ghost sm" data-go="home">← Selva</button>
      <div class="camphead" style="margin-top:12px"><div class="icon" style="background:linear-gradient(180deg,#FFE9A8,#F2B134)">🏔️</div><div><div class="eyebrow">La búsqueda de casa</div><h2 style="font-size:26px;font-weight:600">¿Dónde está la Ciudad Aya?</h2><div class="muted small">${encontrada ? "Solo queda un lugar posible." : `Quedan ${quedan.length} lugares posibles. Cada selva que completes trae una pista nueva.`}</div></div></div>
      <div class="today card"><div class="char">${monkey("ovaya", encontrada ? "party" : "think", 76)}</div><div class="bubble"><span class="who">Ovaya</span><span class="tw">${encontrada ? `¡Es ahí! ${esc(quedan[0].n)}, en ${esc(quedan[0].pais)}. Todos los demás lugares quedaron descartados. ¡Vamos a casa!` : "No me acuerdo dónde queda mi ciudad, pero sí me acuerdo de cosas que NO eran. Con cada pista tachamos un lugar del mapa."}</span>${SAYBTN}</div></div>
      <div class="melodia card"><div class="row" style="justify-content:space-between"><div><div class="eyebrow">La melodía de casa</div><div class="muted small">${n} de ${MELODIA.length} notas recordadas</div></div><button class="btn y sm" id="tocar">Escuchar 🎵</button></div><div class="notas">${MELODIA.map((_, k) => `<span class="${k < n ? "on" : ""}"></span>`).join("")}</div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600">Pistas que recuerdan Los Ayas</h3><div class="pistas">${n === 0 ? `<p class="muted small">Todavía ninguna. Completa una selva entera para conseguir la primera.</p>` : PISTAS.slice(0, n).map(p => `<div class="pista"><span class="ic">💭</span><div><p>«${esc(p.txt)}»</p><small>${esc(p.nota)}</small></div></div>`).join("")}</div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600;margin-bottom:4px">Los ocho lugares posibles</h3><p class="muted small" style="margin:0 0 10px">Todos existen de verdad. Tócalos para verlos en Google Earth.</p>
        <div class="candidatos">${CANDIDATOS.map(c => { const fuera = descartados.includes(c.id); const es = encontrada && !fuera; return `<div class="cand ${fuera ? "fuera" : ""} ${es ? "casa" : ""}"><div class="cab"><b>${esc(c.n)}</b><span>${esc(c.pais)} · ${esc(c.alt)}</span></div><p>${esc(c.dato)}</p><a class="btn ghost sm" href="${earthURL(c.lat, c.lon)}" target="_blank" rel="noopener">Google Earth 🌎</a>${fuera ? `<span class="sello-fuera">Descartado</span>` : es ? `<span class="sello-casa">¡Es aquí!</span>` : ""}</div>`; }).join("")}</div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600;margin-bottom:4px">La ruta del año</h3><p class="muted small" style="margin:0 0 10px">Cada expedición trae más pistas. Los Ayas no pueden volver a casa con una sola asignatura.</p>
        <div class="exped">${EXPEDICIONES.map(e => `<div class="exp ${e.estado}"><span class="ic">${e.icono}</span><div><b>${esc(e.asignatura)}</b><span>${esc(e.nombre)}</span><small>${esc(e.nota)}</small></div><span class="est">${e.estado === "activa" ? "En curso" : "Próxima"}</span></div>`).join("")}</div></div>`;
    m.appendChild(w); typewrite($(".bubble .tw", w));
    $("#tocar", w).addEventListener("click", () => { if (n === 0) return toast("Todavía no recuerdan ninguna nota."); sonarMelodia(n); });
  }

  /* ── TALLER DE FUENTES ── */
  const FMT = ["Escrita", "Visual", "Arqueológica", "Audiovisual"];
  const ORG = ["Primaria", "Secundaria"];
  const PRO = ["Informar", "Comunicar", "Dar su opinión", "Convencer"];
  const PASOS = ["Formato", "Origen", "Propósito", "Idea principal", "Argumento"];
  const fuenteHecha = f => !!(S.fuentes && S.fuentes[f.id]);

  function fuentes(m) {
    const hechas = FUENTES.filter(fuenteHecha).length;
    const w = el("div");
    w.innerHTML = `<button class="btn ghost sm" data-go="home">← Selva</button>
      <div class="camphead" style="margin-top:12px"><div class="icon" style="background:#8E6BC7">🔍</div><div><div class="eyebrow">Taller de fuentes</div><h2 style="font-size:26px;font-weight:600">La carpa del detective</h2><div class="muted small">${hechas} de ${FUENTES.length} fuentes analizadas</div></div></div>
      <div class="today card"><div class="char">${monkey("estaya", "think", 76)}</div><div class="bubble"><span class="who">Estaya</span><span class="tw">Aquí guardamos todo lo que encontramos en la selva: mapas, diarios y cartas de verdad. Analiza cada fuente con los cuatro pasos de tu clase y después arma tu argumento.</span>${SAYBTN}</div></div>
      <div class="guiacard"><div class="eyebrow">Los pasos de tu guía</div><ol class="guialist">${PASOS.map(p => `<li>${p}</li>`).join("")}</ol></div>
      <div class="steps" id="lst"></div>`;
    const lst = $("#lst", w);
    FUENTES.forEach(f => {
      const c = C.camps.find(x => x.id === f.camp); const un = campUnlocked(c); const hecha = fuenteHecha(f);
      const b = el("button", { class: `step ${hecha ? "done" : ""} ${un ? "" : "locked"}` });
      b.innerHTML = `<div class="ic">${un ? (hecha ? "✅" : (f.img ? "🖼️" : "📜")) : "🔒"}</div><div><b>${esc(f.titulo)}</b><span class="sub">${esc(f.ficha)}</span><span class="sub" style="color:${c.color};font-weight:800">${c.icon} ${esc(c.name)}</span></div><div class="right">${hecha ? "★".repeat(S.fuentes[f.id].estrellas) : un ? "→" : ""}</div>`;
      b.addEventListener("click", () => un ? go("fuente", { id: f.id }) : toast(`Esta fuente se abre cuando llegues a ${c.name}.`));
      lst.appendChild(b);
    });
    m.appendChild(w); typewrite($(".bubble .tw", w));
  }

  function fuente(m) {
    const f = FUENTES.find(x => x.id === ctx.id); const c = C.camps.find(x => x.id === f.camp);
    let paso = 0, aciertos = 0, total = 0;
    const w = el("div", { class: "mission" }); m.appendChild(w);
    const cabeza = () => `<div class="mhead"><button class="close" id="quit" aria-label="Salir">✕</button><div class="pbar"><b style="width:${(paso / PASOS.length) * 100}%;background:linear-gradient(90deg,#8E6BC7,#B695E0)"></b></div><span class="small muted" style="min-width:74px;text-align:right">Paso ${Math.min(paso + 1, PASOS.length)}/${PASOS.length}</span></div>
      <div class="stepper">${PASOS.map((p, k) => `<span class="${k < paso ? "ok" : k === paso ? "on" : ""}">${k < paso ? "✓" : k + 1}<i>${p}</i></span>`).join("")}</div>`;
    const tarjeta = () => `<figure class="fuente-card"><figcaption class="ficha"><span class="eyebrow">Fuente</span>${esc(f.ficha)}</figcaption>${f.img ? `<img src="${f.img}" alt="${esc(f.titulo)}" class="fuente-img">` : ""}${f.texto ? `<blockquote class="fuente-texto">${esc(f.texto)}</blockquote>` : ""}${SAYBTN}</figure>`;

    function eleccion(titulo, ayuda, opciones, datos, luego) {
      w.innerHTML = cabeza() + tarjeta() + `<div class="qcard"><div class="ctx">${esc(ayuda)}</div><h2>${esc(titulo)}</h2><div class="opts ${opciones.length > 2 ? "two" : ""}" id="o"></div></div>`;
      $("#quit", w).addEventListener("click", salir);
      const o = $("#o", w);
      opciones.forEach((op, k) => {
        const b = el("button", { class: "opt" }, `<span class="k">${"ABCD"[k]}</span><span>${esc(op)}</span>`);
        b.addEventListener("click", () => {
          const ok = k === datos.a; total++; if (ok) { aciertos++; beep(true); } else jingle("lose");
          [...o.children].forEach((x, j) => { x.disabled = true; if (j === datos.a) x.classList.add("ok"); else if (x === b) x.classList.add("bad"); });
          $(".qcard", w).insertAdjacentHTML("beforeend", fbBox(ok, datos.why));
          $(".qcard", w).appendChild(contBtn(() => { paso++; luego(); }));
        });
        o.appendChild(b);
      });
    }

    function escritura(titulo, ayuda, datos, luego) {
      w.innerHTML = cabeza() + tarjeta() + `<div class="qcard"><div class="ctx">${esc(ayuda)}</div><h2>${esc(titulo)}</h2>${campoVoz("tx", "Escribe aquí con tus propias palabras…")}<div class="actions"><button class="btn g" id="ver" disabled>Comparar con la respuesta modelo</button></div></div>`;
      $("#quit", w).addEventListener("click", salir);
      const tx = $("#tx", w);
      tx.addEventListener("input", () => { $("#ver", w).disabled = tx.value.trim().length < 15; });
      $("#ver", w).addEventListener("click", () => {
        tx.disabled = true; cerrarVoz(w); $("#ver", w).remove();
        $(".qcard", w).insertAdjacentHTML("beforeend", `<div class="model"><span class="t">Respuesta modelo</span>${esc(datos.modelo)}</div>
          <div class="ctx" style="margin-top:14px">Ahora compara y marca lo que sí pusiste en tu respuesta. Sé honesta: así sabes qué te falta.</div>
          <div class="rubrica" id="ru">${datos.rubrica.map((r, k) => `<label><input type="checkbox" data-k="${k}"><span>${esc(r)}</span></label>`).join("")}</div>
          <div class="actions"><button class="btn g" id="listo">Listo</button></div>`);
        $("#listo", w).addEventListener("click", () => {
          const marcadas = [...$("#ru", w).querySelectorAll("input")].filter(i => i.checked).length;
          total += datos.rubrica.length; aciertos += marcadas;
          const msg = marcadas === datos.rubrica.length ? "¡Completísima! Tu respuesta tiene todas las ideas clave." : marcadas === 0 ? "Vuelve a leer la respuesta modelo y fíjate en qué ideas te faltaron. Eso es justo lo que hay que practicar." : `Pusiste ${marcadas} de ${datos.rubrica.length} ideas clave. Las que no marcaste son las que conviene repasar.`;
          $("#ru", w).querySelectorAll("input").forEach(i => i.disabled = true); $("#listo", w).remove();
          $(".qcard", w).insertAdjacentHTML("beforeend", fbBox(marcadas >= Math.ceil(datos.rubrica.length / 2), msg));
          if (marcadas === datos.rubrica.length) { beep(true); } 
          $(".qcard", w).appendChild(contBtn(() => { paso++; luego(); }));
        });
      });
    }

    const salir = () => { if (confirm("¿Salir del análisis? Se perderá el avance de esta fuente.")) go("fuentes"); };

    const paso1 = () => eleccion("¿Qué formato tiene esta fuente?", "Paso 1 de tu guía: el formato es de qué está hecha la fuente.", FMT, f.formato, paso2);
    const paso2 = () => eleccion("¿Es una fuente primaria o secundaria?", "Paso 2: fíjate en cuándo se hizo y quién la hizo.", ORG, f.origen, paso3);
    const paso3 = () => eleccion("¿Cuál es el propósito de esta fuente?", "Paso 3: ¿para qué la creó su autor?", PRO, f.proposito, paso4);
    const paso4 = () => escritura(f.relevante.pregunta, "Paso 4: la información relevante es la idea principal que la fuente aporta sobre el tema.", f.relevante, paso5);

    function paso5() {
      const A = f.argumento;
      w.innerHTML = cabeza() + tarjeta() + `<div class="qcard"><div class="ctx">Paso 5: ahora argumenta. Primero tu postura, o sea la opinión que vas a defender.</div><h2 style="font-size:20px">${esc(A.frase)}</h2><div class="opts two" id="o"><button class="opt" style="justify-content:center">👍 Estoy de acuerdo</button><button class="opt" style="justify-content:center">👎 Estoy en desacuerdo</button></div></div>`;
      $("#quit", w).addEventListener("click", salir);
      [...$("#o", w).children].forEach((b, k) => b.addEventListener("click", () => {
        const ok = k === A.a; total++; if (ok) { aciertos++; beep(true); } else jingle("lose");
        [...$("#o", w).children].forEach((x, j) => { x.disabled = true; if (j === A.a) x.classList.add("ok"); else if (x === b) x.classList.add("bad"); });
        $(".qcard", w).insertAdjacentHTML("beforeend", fbBox(ok, A.why));
        $(".qcard", w).appendChild(contBtn(respaldo, "Ahora el respaldo →"));
      }));
    }

    function respaldo() {
      escritura("Escribe tu respaldo", "El respaldo es la explicación de tu postura: por qué piensas eso.", { modelo: f.argumento.respaldoModelo, rubrica: f.argumento.rubrica }, evidencia);
      paso = 4;
    }

    function evidencia() {
      const A = f.argumento; const ops = shuffle(A.evidencias);
      w.innerHTML = cabeza() + tarjeta() + `<div class="qcard"><div class="ctx">Último paso: la evidencia son datos concretos que salen de la fuente y apoyan tu opinión.</div><h2 style="font-size:20px">¿Cuál de estas sirve como evidencia?</h2><div class="opts" id="o"></div></div>`;
      $("#quit", w).addEventListener("click", salir);
      ops.forEach((op, k) => {
        const b = el("button", { class: "opt" }, `<span class="k">${"ABC"[k]}</span><span>${esc(op.t)}</span>`);
        b.addEventListener("click", () => {
          total++; if (op.ok) { aciertos++; beep(true); } else jingle("lose");
          [...$("#o", w).children].forEach((x, j) => { x.disabled = true; if (ops[j].ok) x.classList.add("ok"); else if (x === b) x.classList.add("bad"); });
          $(".qcard", w).insertAdjacentHTML("beforeend", fbBox(op.ok, op.why));
          $(".qcard", w).appendChild(contBtn(fin));
        });
        $("#o", w).appendChild(b);
      });
    }

    function fin() {
      const pct = Math.round(aciertos / total * 100);
      const estrellas = pct >= 85 ? 3 : pct >= 60 ? 2 : 1;
      S.fuentes = S.fuentes || {};
      const prev = S.fuentes[f.id]; const primera = !prev;
      S.fuentes[f.id] = { estrellas: Math.max(estrellas, prev ? prev.estrellas : 0), pct };
      const xp = primera ? 35 + estrellas * 10 : 12 + estrellas * 4; addXP(xp);
      const listas = FUENTES.filter(fuenteHecha).length;
      if (listas >= 3) stamp("detective");
      if (listas === FUENTES.length) stamp("detective-max");
      save(); confetti(); jingle("win");
      w.innerHTML = `<div class="result"><div class="celebrate">${["🔍", "📜", "⭐", "🗺️", "✨"].map((e, k) => `<span style="left:${10 + k * 19}%;animation-delay:${k * .15}s">${e}</span>`).join("")}</div>
        <div class="chars"><span>${monkey(f.guia, "party", 110)}</span></div>
        <div class="eyebrow">${esc(f.ficha)}</div><h2>${estrellas === 3 ? "¡Análisis de historiador!" : estrellas === 2 ? "¡Buen análisis!" : "¡Fuente analizada!"}</h2>
        <div class="stars" aria-label="${estrellas} estrellas">${starStr(estrellas)}</div><div class="xp">+${xp} XP</div>
        <p class="muted">Acertaste ${aciertos} de ${total} en los cinco pasos de la guía.</p>
        <div class="chest" id="chest"><button class="chest-btn" id="openChest" aria-label="Abrir cofre">🧰</button><div class="chest-body" hidden><div class="eyebrow">Dato del detective</div><p>${esc(f.dato)}</p></div></div>
        <div class="actions" style="justify-content:center"><button class="btn ghost" id="otra">Otra fuente</button><button class="btn g" id="volver">Volver a la selva</button></div></div>`;
      $("#otra", w).addEventListener("click", () => go("fuentes"));
      $("#volver", w).addEventListener("click", () => go("home"));
    }

    paso1();
  }

  /* ── TARJETAS ── */
  function flash(m) {
    const c = C.camps.find(x => x.id === ctx.camp); let cards = shuffle(c.flashcards), i = 0, know = 0;
    const w = el("div", { class: "flash" }); m.appendChild(w);
    const draw = () => {
      if (i >= cards.length) { const xp = 10 + know * 2; addXP(xp); if (know === cards.length) stamp("flash-" + c.id); w.innerHTML = `<div class="result">${monkey("estaya", "party", 120)}<h2>¡Tarjetas listas!</h2><p>Sabías ${know} de ${cards.length}.</p><div class="xp">+${xp} XP</div><div class="actions" style="justify-content:center"><button class="btn ghost" id="again">Otra vuelta</button><button class="btn g" id="back">Volver</button></div></div>`; $("#again", w).addEventListener("click", () => { cards = shuffle(c.flashcards); i = 0; know = 0; draw(); }); $("#back", w).addEventListener("click", () => go("camp", { camp: c.id })); return; }
      const [f, b] = cards[i];
      w.innerHTML = `<div class="mhead"><button class="close" id="quit">✕</button><div class="pbar"><b style="width:${(i / cards.length) * 100}%"></b></div><span class="small muted">${i + 1}/${cards.length}</span></div>
        <div class="today" style="margin-bottom:12px"><div class="char">${monkey("estaya", "happy", 80)}</div><div class="bubble"><span class="who">Estaya</span>Lee la tarjeta, piensa la respuesta y tócala para darla vuelta. ¡Como una canción que ya sabes!</div></div>
        <div class="fcard" id="fc"><div class="in"><div class="f">${esc(f)}<span class="hint">Toca para ver</span></div><div class="b">${esc(b)}</div></div></div>
        <div class="actions" style="justify-content:center;margin-top:16px"><button class="btn ghost" id="no">🔁 Repasar después</button><button class="btn g" id="yes">✅ ¡La sé!</button></div>`;
      $("#fc", w).addEventListener("click", e => e.currentTarget.classList.toggle("flip"));
      $("#quit", w).addEventListener("click", () => go("camp", { camp: c.id }));
      $("#yes", w).addEventListener("click", () => { know++; i++; draw(); });
      $("#no", w).addEventListener("click", () => { cards.push(cards[i]); i++; draw(); });
    };
    draw();
  }

  /* ── RETO DEL DÍA ── */
  function daily(m) {
    const pool = []; C.camps.filter(campUnlocked).forEach(c => c.missions.forEach(ms => ms.questions.forEach((q, i) => { if (q.t !== "write") pool.push({ q, key: `${ms.id}:${i}`, camp: c }); })));
    const qs = shuffle(pool).slice(0, 5);
    runQuiz(m, { title: "Reto del día", char: "ovaya", story: "¡Cinco preguntas sorpresa de la selva! Si las respondes hoy, tu racha sigue viva. ¡Vamos!", topic: "Reto del día", camp: qs[0].camp, questions: qs, quit: () => go("home"), onDone: errors => { const score = qs.length - errors; const xp = 30 + score * 4; addXP(xp); S.daily = { date: todayKey(), score }; if (score === 5) stamp("daily5"); save(); return { xp, stars: stars(errors), back: () => go("home") }; } });
  }

  /* ── SIMULACRO (jefe) ── */
  function boss(m) {
    const intro = el("div", { class: "mission" });
    intro.innerHTML = `<button class="btn ghost sm" data-go="home">← Selva</button><div class="result"><div style="font-size:64px">🏔️</div><h2>Ciudad Aya</h2><p class="muted">El último salto. Veinte preguntas de las cinco selvas, igual que la prueba del jueves y sin ayuda de la bitácora. Si Los Ayas recuerdan todo lo que vivieron, el mapa los lleva a casa. Al final verás qué te conviene repasar.</p>${S.boss ? `<p><b>Tu mejor resultado:</b> ${S.boss.pct}% ${S.boss.pct >= 80 ? "🏅" : ""}</p>` : ""}${S.bossLast ? `<div class="card bars" style="text-align:left;margin-bottom:12px"><div class="eyebrow">Último simulacro · ${S.bossLast.pct}%</div>${C.camps.map(c => { const t = S.bossLast.perTopic[c.topic]; const p = t ? Math.round(t.ok / t.n * 100) : null; return `<div class="r"><span>${c.icon} ${esc(c.topic)}</span><div class="bar"><b style="width:${p || 0}%;background:${p == null ? "#ccc" : p >= 75 ? "var(--ok)" : p >= 50 ? "var(--gold)" : "var(--coral)"}"></b></div><span class="n">${p == null ? "—" : p + "%"}</span></div>`; }).join("")}${(() => { const weak = C.camps.filter(c => { const t = S.bossLast.perTopic[c.topic]; return t && t.ok / t.n < .75; }); return weak.length ? `<div class="alert" style="margin-top:10px"><b>Consejo de Ovaya:</b> repasa ${weak.map(c => `<button class="btn ghost sm" data-camp="${c.id}" style="margin:3px 4px 0 0">${c.icon} ${esc(c.name)}</button>`).join("")}</div>` : `<div class="alert" style="margin-top:10px;background:var(--ok-bg);border-color:var(--ok)"><b>¡Todos los temas sobre 75%!</b> Estás lista para la prueba.</div>`; })()}</div>` : ""}<div class="today card" style="text-align:left"><div class="char">${monkey("ovaya", "surprised", 84)}</div><div class="bubble"><span class="who">Ovaya</span>Este es el salto más largo de todos, y va sin red. Respira hondo: con 80% o más, el mapa nos abre el camino a la Ciudad Aya.</div></div><div class="actions" style="justify-content:center"><button class="btn" id="start">¡Saltar a casa! 🏔️</button></div></div>`;
    m.appendChild(intro);
    intro.querySelectorAll("[data-camp]").forEach(b => b.addEventListener("click", () => go("camp", { camp: b.dataset.camp })));
    $("#start", intro).addEventListener("click", () => {
      m.innerHTML = "";
      let pool = []; C.camps.forEach(c => c.missions.forEach(ms => ms.questions.forEach((q, i) => { if (q.t !== "write") pool.push({ q, key: `${ms.id}:${i}`, topic: c.topic, camp: c }); })));
      const per = {}; C.camps.forEach(c => per[c.id] = shuffle(pool.filter(p => p.camp === c)).slice(0, 4)); const qs = shuffle([].concat(...Object.values(per)));
      const topicErr = {};
      runQuiz(m, { title: "El salto a la Ciudad Aya", char: "ovaya", story: "Veinte preguntas de las cinco selvas. Todo lo que aprendimos, en un solo salto. ¡Tú puedes!", topic: "Simulacro", camp: C.camps[0], questions: qs.map(p => ({ q: p.q, key: p.key, topic: p.topic, campId: p.camp.id })), quit: () => go("home"), onDone: (errors, perTopic) => {
          const pct = Math.round(((qs.length - errors) / qs.length) * 100);
          if (!S.boss || pct > S.boss.pct) S.boss = { pct, date: todayKey() };
          S.bossLast = { pct, perTopic, date: todayKey() };
          if (pct >= 80) stamp("boss"); const xp = 60 + Math.round(pct / 2); addXP(xp); save();
          return { xp, stars: pct >= 90 ? 3 : pct >= 70 ? 2 : 1, back: () => go("boss"), retry: () => go("boss") };
        } });
    });
  }

  /* ── REPASO ── */
  function review(m) {
    const keys = Object.keys(S.wrong);
    const w = el("div", { class: "mission" });
    if (!keys.length) { w.innerHTML = `<div class="result">${monkey("chupaya", "party", 120)}<h2>¡Nada pendiente!</h2><p class="muted">Aquí aparecen las preguntas que fallaste, para que las domines. Por ahora no hay ninguna. ¡Sigue explorando!</p><div class="actions" style="justify-content:center"><button class="btn g" data-go="home">Ir a la selva</button></div></div>`; m.appendChild(w); return; }
    w.innerHTML = `<div class="result">${monkey("chupaya", "think", 110)}<h2>Repaso de errores</h2><p class="muted">Tienes <b>${keys.length}</b> pregunta${keys.length === 1 ? "" : "s"} para dominar. Cada una que respondas bien dos veces desaparece de aquí.</p><div class="actions" style="justify-content:center"><button class="btn" id="start">Repasar ahora</button></div></div>
      <div class="card" style="margin-top:12px"><div class="eyebrow">Pendientes</div><div class="wrongs" style="margin-top:8px">${keys.slice(0, 12).map(k => `<div>${esc(S.wrong[k].q)}</div>`).join("")}${keys.length > 12 ? `<div class="muted small">…y ${keys.length - 12} más</div>` : ""}</div></div>`;
    m.appendChild(w);
    $("#start", w).addEventListener("click", () => {
      m.innerHTML = ""; const qs = [];
      shuffle(keys).slice(0, 10).forEach(k => { const [mid, idx] = k.split(":"); C.camps.forEach(c => c.missions.forEach(ms => { if (ms.id === mid) qs.push({ q: ms.questions[+idx], key: k, camp: c }); })); });
      runQuiz(m, { title: "Rescate de errores", char: "chupaya", story: "Estas son las preguntas donde me perdí contigo. ¡Esta vez las encontramos!", topic: "Repaso", camp: qs[0].camp, questions: qs, quit: () => go("review"), onDone: errors => { const xp = 20 + (qs.length - errors) * 4; addXP(xp); save(); return { xp, stars: stars(errors), back: () => go("review") }; } });
    });
  }

  /* ── PASAPORTE ── */
  function passport(m) {
    const ST = [["first", "🧭", "Primera misión"], ...C.camps.map(c => [c.id, c.icon, c.name]), ["boss", "🏔️", "Llegaron a casa"], ["streak3", "🔥", "3 días seguidos"], ["daily5", "🎲", "Reto del día perfecto"], ["maestra", "🧠", "Le enseñaste a Chupaya"], ["maestra-max", "🎓", "Maestra de Chupaya"], ["detective", "🔍", "Detective de fuentes"], ["detective-max", "📜", "Todas las fuentes"], ...C.camps.map(c => ["flash-" + c.id, "🃏", "Tarjetas " + c.n]), ...C.camps.map(c => ["liana-" + c.id, "🐒", "Lianas " + c.n]), ...C.camps.map(c => ["memo-" + c.id, "🎵", "Memorice " + c.n])];
    if (S.streak.count >= 3) stamp("streak3");
    const dn = ["L", "M", "X", "J", "V", "S", "D"]; const now = new Date(); const mon = new Date(now); mon.setDate(now.getDate() - ((now.getDay() + 6) % 7)); mon.setHours(0, 0, 0, 0);
    const week = [...Array(7)].map((_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); const k = localKey(d); return `<span class="${S.days.includes(k) ? "d" : ""} ${k === todayKey() ? "t" : ""}">${dn[i]}</span>`; }).join("");
    const w = el("div");
    w.innerHTML = `<div class="card"><div class="row"><div class="avatar" style="width:72px;height:72px;border-radius:24px"><img src="assets/chars/ovaya.png" alt="Ovaya"></div><div><h2 style="font-size:26px;font-weight:600">Ovaya, explorador nivel ${level()}</h2><div class="muted">${S.xp} XP · ${S.streak.count} día${S.streak.count === 1 ? "" : "s"} seguidos 🔥 · ${doneMissions()}/${totalMissions} misiones</div></div></div>
      <div class="bars" style="margin-top:10px"><div class="r"><span>Nivel ${level()}</span><div class="bar"><b style="width:${((S.xp % 250) / 250) * 100}%;background:var(--jungle)"></b></div><span class="n">${S.xp % 250}/250</span></div></div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600;margin-bottom:8px">Esta semana</h3><div class="week">${week}</div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600;margin-bottom:10px">Sellos de cada selva</h3><div class="stamps">${ST.map(([id, ic, t]) => `<div class="stamp ${S.stamps.includes(id) ? "got" : ""}"><div><span class="big">${S.stamps.includes(id) ? ic : "·"}</span>${esc(t)}</div></div>`).join("")}</div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600;margin-bottom:4px">Álbum de selfies</h3><p class="muted small" style="margin:0 0 10px">${PERSONAJES.filter(selfieHecha).length} de ${PERSONAJES.length}. Se consigue una en cada misión completada.</p>
        <div class="selfies">${PERSONAJES.map(p => selfieHecha(p) ? selfieHTML(p, false) : `<figure class="selfie vacia"><div class="foto"><span class="q">?</span></div><figcaption><b>Por descubrir</b><span>${esc(p.anio)}</span></figcaption></figure>`).join("")}</div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600;margin-bottom:4px">Álbum de Los Ayas</h3><p class="muted small" style="margin:0 0 10px">Cada campamento completo desbloquea una foto real de la tripulación.</p><div class="album">${[["c1", "Concierto en el piano"], ["c2", "Trepando el árbol"], ["c3", "La casa de Los Ayas"], ["c4", "Paseo en bote"], ["c5", "Colgados en la cocina"], ["boss", "Abrazo de campeones"]].map(([k, t]) => { const un = k === "boss" ? S.stamps.includes("boss") : S.stamps.includes(k); return `<figure class="photo ${un ? "" : "locked"}"><img src="assets/album/${k}.jpg" alt="${esc(t)}" loading="lazy"><figcaption>${un ? esc(t) : "🔒 " + (k === "boss" ? "Templo de la Prueba" : "Campamento " + k.slice(1))}</figcaption></figure>`; }).join("")}</div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600;margin-bottom:10px">Tu tripulación: Los Ayas</h3><img class="trio-wide" src="assets/chars/trio.png" alt="Ovaya, Chupaya y Estaya"><div class="crew">${Object.keys(CH).map(k => `<div class="c">${monkey(k, "happy", 90)}<b>${CH[k].name}</b><p>${esc(CH[k].desc)}</p></div>`).join("")}</div></div>`;
    m.appendChild(w);
  }

  document.addEventListener("click", e => { const fi = e.target.closest(".fuente-img"); if (fi) { const lb = el("div", { class: "lightbox" }, `<img src="${fi.src}" alt=""><p>${esc(fi.alt)}</p>`); lb.addEventListener("click", () => lb.remove()); document.body.appendChild(lb); return; }
    const f = e.target.closest(".photo:not(.locked)"); if (!f) return; const lb = el("div", { class: "lightbox" }, `<img src="${f.querySelector("img").src}" alt=""><p>${f.querySelector("figcaption").textContent}</p>`); lb.addEventListener("click", () => lb.remove()); document.body.appendChild(lb); });

  /* ── PANEL MAMÁ ── */
  let parentOK = false;
  function parent(m) {
    if (!parentOK) { const p = el("div", { class: "pin card" }); p.innerHTML = `<div style="font-size:40px">🔒</div><h2 style="font-size:22px">Panel de Mariana y Francisco</h2><p class="muted small">Escribe el PIN (al inicio es 1234).</p><input id="pin" inputmode="numeric" maxlength="6" autocomplete="off" aria-label="PIN"><button class="btn g" id="ok">Entrar</button>`; m.appendChild(p); const tryPin = () => { if ($("#pin", p).value === S.pin) { parentOK = true; render(); } else { $("#pin", p).value = ""; toast("PIN incorrecto"); } }; $("#ok", p).addEventListener("click", tryPin); $("#pin", p).addEventListener("keydown", e => { if (e.key === "Enter") tryPin(); }); $("#pin", p).focus(); return; }
    const topics = C.camps.map(c => { const s = S.stats[c.topic] || { ok: 0, n: 0 }; return { c, s, pct: s.n ? Math.round(s.ok / s.n * 100) : null }; });
    const totalN = topics.reduce((a, t) => a + t.s.n, 0), totalOK = topics.reduce((a, t) => a + t.s.ok, 0);
    const wrong = Object.values(S.wrong);
    const w = el("div");
    w.innerHTML = `<div class="row" style="justify-content:space-between"><h2 style="font-size:26px;font-weight:600">Panel de Mariana y Francisco</h2><button class="btn ghost sm" id="lock">Cerrar 🔒</button></div>
      <div class="kpi" style="margin-top:12px"><div><b>${doneMissions()}/${totalMissions}</b><small>misiones completadas</small></div><div><b>${totalN ? Math.round(totalOK / totalN * 100) : 0}%</b><small>aciertos (${totalN} respuestas)</small></div><div><b>${S.streak.count}</b><small>días seguidos</small></div><div><b>${S.boss ? S.boss.pct + "%" : "—"}</b><small>mejor simulacro</small></div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600">Aciertos por tema de la prueba</h3><div class="bars" style="margin-top:6px">${topics.map(t => `<div class="r"><span>${t.c.n}. ${esc(t.c.topic)}</span><div class="bar"><b style="width:${t.pct || 0}%;background:${t.pct == null ? "#ccc" : t.pct >= 80 ? "var(--ok)" : t.pct >= 60 ? "var(--gold)" : "var(--coral)"}"></b></div><span class="n">${t.pct == null ? "sin datos" : t.pct + "%"}</span></div>`).join("")}</div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600">Para reforzar (${wrong.length})</h3><p class="muted small" style="margin:4px 0 10px">Preguntas falladas que siguen pendientes. Desaparecen cuando se responden bien dos veces en «Repaso».</p><div class="wrongs">${wrong.length ? wrong.map(x => `<div>${esc(x.q)}</div>`).join("") : "<div class='muted' style='border-color:var(--ok)'>Nada pendiente por ahora.</div>"}</div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600">Ajustes</h3>
                <div class="field"><label for="np">Cambiar PIN</label><input id="np" inputmode="numeric" maxlength="6" placeholder="Nuevo PIN (4 a 6 números)"></div>
        <div class="field"><label style="font-weight:800;font-size:14px">Micrófono</label><button class="btn ghost sm" id="probarMic" style="justify-self:start">Probar micrófono 🎤</button><div id="micres"></div></div>
        <div class="field"><label><input type="checkbox" id="snd" ${S.sound ? "checked" : ""} style="width:auto;margin-right:8px">Sonidos activados</label></div>
        <div class="actions" style="justify-content:flex-start"><button class="btn g sm" id="saveS">Guardar ajustes</button><button class="btn ghost sm" id="reset">Reiniciar todo el progreso</button></div>
        <p class="muted small" style="margin-top:12px">Próximamente: subir fotos, texto o enlaces del colegio para crear nuevas expediciones con inteligencia artificial (requiere clave de API de Anthropic).</p></div>`;
    m.appendChild(w);
    $("#lock", w).addEventListener("click", () => { parentOK = false; go("home"); });
    $("#probarMic", w).addEventListener("click", async () => {
      const cont = $("#micres", w); cont.innerHTML = `<div class="muted small" style="margin-top:8px">Revisando…</div>`;
      const filas = await diagnosticoVoz();
      cont.innerHTML = `<div class="micdiag">${filas.map(([k, v]) => `<div><span>${esc(k)}</span><b class="${/NO|denegado|bloque|SÍ \(/.test(v) ? "mal" : ""}">${esc(v)}</b></div>`).join("")}<button class="btn g sm" id="micPrueba" style="margin-top:10px">Grabar una frase de prueba</button><div id="micsalida"></div></div>`;
      $("#micPrueba", cont).addEventListener("click", () => {
        const sal = $("#micsalida", cont);
        const p = problemaVoz();
        if (p) { sal.innerHTML = `<div class="voz-problema" style="margin-top:10px"><b>🎤 ${esc(p.t)}</b><p>${esc(p.d)}</p></div>`; return; }
        sal.innerHTML = `<div class="campo-voz"><textarea class="write" id="txmic" placeholder="Toca el micrófono y di una frase…"></textarea><div class="voz-barra"><button class="mic" data-target="txmic"><span class="mic-ic">🎤</span><span class="mic-txt">Responder hablando</span></button><span class="voz-hint">debería aparecer escrito lo que digas</span></div></div>`;
      });
    });
    $("#saveS", w).addEventListener("click", () => { const np = $("#np", w).value.trim(); if (np) { if (/^\d{4,6}$/.test(np)) S.pin = np; else return toast("El PIN debe tener 4 a 6 números."); } S.sound = $("#snd", w).checked; save(); toast("Ajustes guardados"); render(); });
    $("#reset", w).addEventListener("click", () => { if (confirm("¿Borrar TODO el progreso de la Misión Aya? Esta acción no se puede deshacer.")) { const pin = S.pin; S = Object.assign({}, DEF, { pin }); save(); toast("Progreso reiniciado"); go("home"); } });
  }

  /* ── arranque ── */
  touchDay();
  render();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => { });
})();
