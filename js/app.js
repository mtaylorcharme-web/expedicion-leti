/* Expedición Leti · motor de la app (sin dependencias) */
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
  const KEY = "expedicion-leti-v1";
  const DEF = { name: "Leti", xp: 0, streak: { last: null, count: 0 }, days: [], done: {}, wrong: {}, stats: {}, stamps: [], pin: "1234", boss: null, sound: true, log: [] };
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
  document.addEventListener("click", e => { const b = e.target.closest(".say"); if (!b) return; e.stopPropagation(); const box = b.closest(".bubble, .qcard"); if (!box) return; const txt = [...box.querySelectorAll(".tw, h2, .ctx")].map(x => x.textContent).join(". ") || box.textContent; speak(txt.replace(/🔊/g, "")); });
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
  function go(v, c) { view = v; ctx = c || {}; render(); window.scrollTo({ top: 0 }); }
  function render() { renderTop(); renderNav(); const m = $("#view"); m.innerHTML = ""; m.className = "view fade"; ({ home, camp, notes, mission, flash, boss, review, passport, parent, game, memo, song, daily })[view](m); }
  function renderTop() {
    const d = daysToTest(); const dl = d > 1 ? `${d} días` : d === 1 ? "¡mañana!" : d === 0 ? "¡hoy!" : "pasó";
    $("#topbar").innerHTML = `<span class="chip streak">🔥 ${S.streak.count} <span class="lbl">día${S.streak.count === 1 ? "" : "s"}</span></span><span class="chip xp">⭐ ${S.xp} <span class="lbl">XP</span></span><span class="chip days">📅 <span class="lbl">Prueba:</span> ${dl}</span><span class="spacer"></span><button class="avatar" data-go="passport" aria-label="Pasaporte">${esc(S.name[0] || "L")}</button>`;
  }
  function renderNav() {
    const items = [["home", "🌴", "Selva"], ["review", "🎯", "Repaso"], ["passport", "🛂", "Pasaporte"], ["parent", "👩‍👧", "Mamá"]];
    $("#navbar").innerHTML = `<div class="inner">${items.map(([v, i, l]) => `<button class="${view === v || (v === "home" && ["camp", "notes", "mission", "flash", "boss", "game", "memo", "song"].includes(view)) ? "on" : ""}" data-go="${v}"><span class="ic">${i}</span>${l}</button>`).join("")}</div>`;
  }
  document.addEventListener("click", e => { const b = e.target.closest("[data-go]"); if (b) go(b.dataset.go); });

  /* ── BIENVENIDA (primera vez) ── */
  function welcome(m) {
    const steps = [
      { id: "ovaya", mood: "surprised", t: `¡Hola, ${esc(S.name)}! Soy Ovaya, el más curioso de Los Ayas. ¡Encontré un mapa de una selva llena de secretos de Historia!` },
      { id: "chupaya", mood: "think", t: "Yo soy Chupaya… y ya me perdí. Si respondes bien las preguntas, me vas a encontrar en cada campamento." },
      { id: "estaya", mood: "happy", t: "♪ Y yo soy Estaya ♪. Traigo tarjetas, canciones y juegos para que todo se te quede en la memoria." },
      { id: "ovaya", mood: "party", t: "Cada campamento es un tema de tu prueba. Gana estrellas, sellos y XP. ¿Lista para zarpar?" }
    ];
    let i = 0; const w = el("div", { class: "welcome" }); m.appendChild(w);
    const draw = () => { const st = steps[i]; w.innerHTML = `<div class="wl-stage">${i === steps.length - 1 ? `<img class="trio" src="assets/chars/trio.png" alt="Los Ayas">` : monkey(st.id, st.mood, 150)}</div><div class="bubble wl"><span class="who">${CH[st.id].name}</span><span class="tw">${st.t}</span>${SAYBTN}</div><div class="actions" style="justify-content:center"><button class="btn ${i === steps.length - 1 ? "" : "g"}" id="nx">${i === steps.length - 1 ? "¡Sí, vamos! ⛵" : "Siguiente →"}</button></div><div class="dots">${steps.map((_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("")}</div>`; typewrite($(".tw", w)); beep(true); $("#nx", w).addEventListener("click", () => { i++; if (i >= steps.length) { S.welcomed = true; save(); confetti(); jingle("win"); go("home"); } else draw(); }); };
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
    const positions = [[20, 11], [64, 24], [24, 40], [68, 55], [26, 71], [68, 86]];
    const mapH = 820;
    const pts = positions.map(([x, y]) => [x * 6, y * mapH / 100]);
    const river = (() => { let d = `M -30 ${pts[0][1] - 30} L ${pts[0][0]} ${pts[0][1]}`; for (let k = 1; k < pts.length; k++) { const [x0, y0] = pts[k - 1], [x1, y1] = pts[k]; const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2; d += ` Q ${x0} ${cy} ${cx} ${cy} T ${x1} ${y1}`; } return d + ` L 640 ${pts[5][1] + 60}`; })();
    const wrap = el("div", { class: "home" });
    const map = el("div", { class: "mapwrap" });
    map.innerHTML = `<svg class="jungle" viewBox="0 0 600 ${mapH}" aria-hidden="true">
      <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B7DE99"/><stop offset="1" stop-color="#7DBB6E"/></linearGradient></defs>
      <rect width="600" height="${mapH}" fill="url(#g1)"/>
      ${[...Array(30)].map((_, i) => { const x = (i * 137) % 600, y = (i * 211) % mapH, r = 26 + (i % 4) * 10; return `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? "#5FA95F" : "#4E9A52"}" opacity=".5"/>`; }).join("")}
      ${[...Array(12)].map((_, i) => { const x = (i * 97 + 40) % 600, y = (i * 173 + 90) % mapH; return `<text x="${x}" y="${y}" font-size="30" opacity=".85">${["🌴", "🌿", "🦜", "🌺", "🐒", "🌳"][i % 6]}</text>`; }).join("")}
      <path d="${river}" stroke="#3A97AD" stroke-width="34" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/>
      <path d="${river}" stroke="#4FB3C9" stroke-width="26" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="flow" d="${river}" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="8 12" opacity=".75" stroke-linecap="round"/>
    </svg>`;
    C.camps.forEach((c, i) => {
      const [x, y] = positions[i]; const un = campUnlocked(c); const full = campDone(c) === c.missions.length;
      const node = el("button", { class: `camp ${un ? "" : "locked"} ${c === cur && !allDone ? "here" : ""}`, style: `left:${x}%;top:${y}%`, "aria-label": c.name });
      node.innerHTML = `<div class="land" style="background:${c.color}"><span class="n">${c.n}</span>${un ? c.icon : "🔒"}${campDone(c) ? `<span class="stars">${"★".repeat(Math.min(3, Math.round(campStars(c) / c.missions.length)))}${full ? " ✓" : ""}</span>` : ""}</div><span class="name">${c.name}</span>`;
      node.addEventListener("click", () => { if (!un) return toast("Completa una misión del campamento anterior para abrir este."); const lm = $(".leti-marker", map); if (lm) { lm.style.left = `calc(${x}% + 58px)`; lm.style.top = `calc(${y}% + 8px)`; lm.classList.add("walking"); } beep(true); setTimeout(() => go("camp", { camp: c.id }), 650); });
      map.appendChild(node);
    });
    const [bx, by] = positions[5]; const bossOpen = C.camps.filter(c => campDone(c) >= 1).length >= 3;
    const boss = el("button", { class: `camp boss ${bossOpen ? "" : "locked"}`, style: `left:${bx}%;top:${by}%` });
    boss.innerHTML = `<div class="land">${bossOpen ? "🏆" : "🔒"}${S.boss ? `<span class="stars">${S.boss.pct}%</span>` : ""}</div><span class="name">Templo de la Prueba</span>`;
    boss.addEventListener("click", () => { if (!bossOpen) return toast("Abre al menos 3 campamentos para entrar al Templo de la Prueba."); const lm = $(".leti-marker", map); if (lm) { lm.style.left = `calc(${bx}% + 58px)`; lm.style.top = `calc(${by}% + 8px)`; lm.classList.add("walking"); } beep(true); setTimeout(() => go("boss"), 650); });
    map.appendChild(boss);
    const idx = allDone ? 5 : C.camps.indexOf(cur); const [lx, ly] = positions[idx];
    map.appendChild(el("div", { class: "leti-marker", style: `left:calc(${lx}% + 58px);top:calc(${ly}% + 8px)` }, esc(S.name[0] || "L")));
    map.insertAdjacentHTML("beforeend", `<img class="map-tree" src="assets/chars/trio-arbol.png" alt="" aria-hidden="true">`);
    // animales que cruzan la selva
    map.insertAdjacentHTML("beforeend", `<div class="critter fly" style="top:18%;animation-duration:14s">🦜</div><div class="critter fly" style="top:52%;animation-duration:22s;animation-delay:-9s;font-size:22px">🦋</div><div class="critter walk" style="top:66%;animation-duration:30s;animation-delay:-12s">🐢</div>`);
    // monos columpiándose en lianas del mapa
    [["ovaya", 42, 7, "swing"], ["chupaya", 89, 46, "swing"], ["estaya", 9, 88, "hang"]].forEach(([id, x, y, md]) => {
      if (md === "swing") { const l = el("div", { class: "liana", style: `left:calc(${x}% + 25px);top:0;height:${y}%` }); map.appendChild(l); }
      const mm = el("div", { class: "map-monkey", style: `left:${x}%;top:${y}%` }, monkey(id, md, 52)); map.appendChild(mm);
    });
    const hero = el("div", { class: "hero-jungle" }, `<div class="txt"><div class="eyebrow" style="color:#CFEFD8">Los Ayas te acompañan</div><h1>Expedición ${esc(S.name)}</h1><p>${esc(C.unit.subject)} · ${esc(C.unit.title)} · ${C.unit.test.label.split("·")[1] ? "prueba el" + C.unit.test.label.split("·")[1] : ""}</p></div>`);
    const shell = el("div"); shell.appendChild(hero); shell.appendChild(wrap); m.appendChild(shell);
    wrap.appendChild(map);

    const side = el("div", { style: "display:grid;gap:14px" });
    const nextM = cur.missions.find(x => !S.done[x.id]);
    const msg = allDone ? `¡Recorrimos toda la selva! Ahora toca el Templo de la Prueba y repasar tus errores. ¡Tú puedes!` : campDone(cur) === 0 && !S.done[cur.id + "-notes"] ? cur.intro : nextM ? `Siguiente misión en ${cur.name}: «${nextM.title}». ${nextM.story}` : cur.intro;
    side.innerHTML = `<div class="card"><div class="today"><div class="char">${monkey(guide, allDone ? "party" : "happy", 96)}</div><div class="bubble"><span class="who">${CH[guide].name}</span><span class="tw">${esc(msg)}</span>${SAYBTN}</div></div><div class="actions" style="justify-content:flex-start"><button class="btn" id="goNext">${allDone ? "Ir al Templo 🏆" : "¡Vamos! ⛵"}</button><button class="btn ghost" data-go="review">Repaso 🎯</button></div></div>`;
    $("#goNext", side).addEventListener("click", () => allDone ? go("boss") : go("camp", { camp: cur.id }));

    const dailyDone = S.daily && S.daily.date === todayKey();
    const dc = el("div", { class: "card daily" + (dailyDone ? " done" : "") });
    dc.innerHTML = `<div class="row" style="justify-content:space-between;gap:10px"><div><div class="eyebrow">Reto del día</div><b style="font-family:Fredoka;font-size:18px;font-weight:600">${dailyDone ? "¡Reto de hoy superado! ✅" : "5 preguntas sorpresa · +30 XP"}</b><div class="muted small">${dailyDone ? `Sacaste ${S.daily.score}/5. Mañana hay uno nuevo.` : "De los campamentos que ya abriste. ¡Mantén tu racha!"}</div></div>${dailyDone ? "" : `<button class="btn y sm" id="goDaily">¡Jugar! 🎲</button>`}</div>`;
    if (!dailyDone) $("#goDaily", dc).addEventListener("click", () => go("daily"));
    side.appendChild(dc);
    const cd = el("div", { class: "card" });
    cd.innerHTML = `<div class="eyebrow">${esc(C.unit.subject)} · ${esc(C.unit.title)}</div><div class="countdown" style="margin-top:6px"><div class="big">${d >= 0 ? d : 0}</div><div><b style="font-family:Fredoka;font-size:18px">${d > 1 ? "días para la prueba" : d === 1 ? "día para la prueba" : d === 0 ? "¡La prueba es hoy!" : "La prueba ya pasó"}</b><div class="muted small">${esc(C.unit.test.label)} · ${doneMissions()}/${totalMissions} misiones completadas</div></div></div>`;
    side.appendChild(cd);

    const plan = el("div", { class: "card" }); const t0 = new Date(); t0.setHours(0, 0, 0, 0);
    const start = new Date(C.unit.test.date + "T00:00:00"); start.setDate(start.getDate() - C.plan.length);
    const dn = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
    plan.innerHTML = `<h3 style="font-size:19px;font-weight:600">Plan de expedición hasta la prueba</h3><div class="plan" style="margin-top:10px">${C.plan.map(p => { const dt = new Date(start); dt.setDate(dt.getDate() + p.day); const isT = dt.getTime() === t0.getTime(), past = dt < t0; const camps = p.camps.map(id => C.camps.find(c => c.id === id)); const ok = camps.every(c => campDone(c) === c.missions.length); return `<div class="d ${isT ? "today" : past ? "past" : ""}"><div class="dn">${dn[dt.getDay()]}<b>${dt.getDate()}</b></div><div><b>${esc(p.label)}</b><div class="muted small">${camps.map(c => c.icon + " " + esc(c.name)).join(", ")} · ${esc(p.extra)}</div></div><div class="st">${ok ? "✅" : isT ? "👉" : ""}</div></div>`; }).join("")}</div>`;
    side.appendChild(plan);
    wrap.appendChild(side);
  }

  /* ── CAMPAMENTO ── */
  function camp(m) {
    const c = C.camps.find(x => x.id === ctx.camp); const notesDone = !!S.done[c.id + "-notes"];
    const h = el("div");
    h.innerHTML = `<button class="btn ghost sm" data-go="home">← Selva</button>
      <div class="camphead" style="margin-top:12px"><div class="icon" style="background:${c.color}">${c.icon}</div><div><div class="eyebrow">Campamento ${c.n} · ${esc(c.topic)}</div><h2 style="font-size:26px;font-weight:600">${esc(c.name)}</h2></div></div>
      <div class="today card"><div class="char">${monkey(c.guide, "happy", 84)}</div><div class="bubble"><span class="who">${CH[c.guide].name}</span><span class="tw">${esc(c.intro)}</span>${SAYBTN}</div></div>`;
    const steps = el("div", { class: "steps" });
    const s0 = el("button", { class: `step ${notesDone ? "done" : ""}` }); s0.innerHTML = `<div class="ic">📖</div><div><b>Bitácora del campamento</b><span class="sub">${c.notes.length} páginas para leer antes de las misiones · 5 min</span></div><div class="right">${notesDone ? "✅" : "→"}</div>`;
    s0.addEventListener("click", () => go("notes", { camp: c.id })); steps.appendChild(s0);
    c.missions.forEach((ms, i) => {
      const un = missionUnlocked(c, i) && (notesDone || i > 0 || true); const dn = S.done[ms.id];
      const b = el("button", { class: `step ${dn ? "done" : ""} ${un ? "" : "locked"}` });
      b.innerHTML = `<div class="ic">${un ? (dn ? "✅" : "🧭") : "🔒"}</div><div><b>Misión ${i + 1}: ${esc(ms.title)}</b><span class="sub">Con ${CH[ms.char].name} · ${ms.questions.length} desafíos · ${Math.round(ms.questions.length * 1.4)} min</span></div><div class="right">${dn ? starStr(dn.stars) : un ? "→" : ""}</div>`;
      b.addEventListener("click", () => un ? go("mission", { camp: c.id, mission: ms.id }) : toast("Primero completa la misión anterior."));
      steps.appendChild(b);
    });
    const sf = el("button", { class: "step" }); sf.innerHTML = `<div class="ic">🃏</div><div><b>Tarjetas de memoria</b><span class="sub">${c.flashcards.length} tarjetas para repasar rápido · ideal antes de dormir</span></div><div class="right">→</div>`;
    sf.addEventListener("click", () => go("flash", { camp: c.id })); steps.appendChild(sf);
    const sg = el("button", { class: "step" }); sg.innerHTML = `<div class="ic">🐒</div><div><b>Minijuego: Salto de lianas</b><span class="sub">Verdadero o falso contra el reloj · ayuda a Chupaya a cruzar la selva · 2 min</span></div><div class="right">${S.games && S.games["liana-" + c.id] ? "🏆 " + S.games["liana-" + c.id] : "→"}</div>`;
    sg.addEventListener("click", () => go("game", { camp: c.id })); steps.appendChild(sg);
    const sm = el("button", { class: "step" }); sm.innerHTML = `<div class="ic">🎵</div><div><b>Minijuego: Memorice de Los Ayas</b><span class="sub">Encuentra las parejas concepto y definición con Estaya · 3 min</span></div><div class="right">${S.games && S.games["memo-" + c.id] ? "🏆 " + S.games["memo-" + c.id] + " mov." : "→"}</div>`;
    sm.addEventListener("click", () => go("memo", { camp: c.id })); steps.appendChild(sm);
    const ss = el("button", { class: "step" }); ss.innerHTML = `<div class="ic">🎤</div><div><b>La canción de Estaya</b><span class="sub">Karaoke con los datos clave y "completa la letra" · 3 min</span></div><div class="right">${S.games && S.games["song-" + c.id] ? "🏆" : "→"}</div>`;
    ss.addEventListener("click", () => go("song", { camp: c.id })); steps.appendChild(ss);
    h.appendChild(steps); m.appendChild(h);
  }

  /* ── BITÁCORA ── */
  function notes(m) {
    const c = C.camps.find(x => x.id === ctx.camp);
    const w = el("div", { class: "mission" });
    w.innerHTML = `<button class="btn ghost sm" id="back">← ${esc(c.name)}</button><div class="eyebrow" style="margin-top:12px">Bitácora · ${esc(c.topic)}</div><h2 style="font-size:26px;font-weight:600;margin-bottom:12px">Lo que hay que saber</h2>
      <div class="notes">${c.notes.map(n => `<div class="note"><h3>${esc(n.title)}</h3><p>${n.body}</p></div>`).join("")}</div>
      <div class="actions"><button class="btn g" id="ok">¡Listo, leí la bitácora! +15 XP</button></div>`;
    $("#back", w).addEventListener("click", () => go("camp", { camp: c.id }));
    $("#ok", w).addEventListener("click", () => { if (!S.done[c.id + "-notes"]) { S.done[c.id + "-notes"] = { stars: 0 }; addXP(15); } save(); go("camp", { camp: c.id }); });
    m.appendChild(w);
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
    runQuiz(m, { title: ms.title, char: ms.char, story: ms.story, topic: c.topic, camp: c, questions: ms.questions.map((q, i) => ({ q, key: `${ms.id}:${i}` })), onDone: (errors) => {
      const st = stars(errors); const prev = S.done[ms.id]; const first = !prev;
      S.done[ms.id] = { stars: Math.max(st, prev ? prev.stars : 0), errors };
      const xp = first ? 40 + st * 10 : 15 + st * 5; addXP(xp);
      if (campDone(c) === c.missions.length) stamp(c.id);
      if (doneMissions() === 1) stamp("first");
      save();
      return { xp, stars: st, back: () => go("camp", { camp: c.id }) };
    } });
  }

  function runQuiz(m, cfg) {
    const qs = cfg.questions; let i = 0, errors = 0, hearts = 5; const perTopic = {};
    const w = el("div", { class: "mission" }); m.appendChild(w);
    function head() { return `<div class="mhead"><button class="close" id="quit" aria-label="Salir">✕</button><div class="pbar"><b style="width:${(i / qs.length) * 100}%"></b></div><div class="hearts">${"❤".repeat(hearts)}${"♡".repeat(5 - hearts)}</div></div>`; }
    function next() { i++; if (i >= qs.length) return finish(); show(); }
    function finish() {
      const r = cfg.onDone(errors, perTopic); confetti(); jingle("win");
      const st = r.stars;
      const rescued = cfg.char === "chupaya";
      w.innerHTML = `<div class="result fade"><div class="celebrate">${["🎉", "⭐", "🌟", "🎊", "✨", "🎈"].map((e, k) => `<span style="left:${8 + k * 16}%;animation-delay:${k * .15}s">${e}</span>`).join("")}</div><div class="chars"><span style="animation-delay:0s">${monkey("ovaya", "party", 90)}</span><span style="animation-delay:.3s">${monkey(cfg.char === "ovaya" ? "chupaya" : cfg.char, rescued ? "hang" : "party", 110)}</span><span style="animation-delay:.6s">${monkey("estaya", "party", 90)}</span></div>${rescued ? `<div class="tag" style="background:#DDF3E4;color:var(--jungle-deep);font-size:14px;margin-top:6px">🔎 ¡Encontraste a Chupaya!</div>` : ""}
        <div class="eyebrow">${esc(cfg.topic || "")}</div><h2>${st === 3 ? "¡Misión perfecta!" : st === 2 ? "¡Misión cumplida!" : "¡Lo lograste!"}</h2>
        <div class="stars" aria-label="${st} estrellas">${starStr(st)}</div>
        <div class="xp">+${r.xp} XP</div>
        <p class="muted">${errors === 0 ? "Sin errores. ¡Eres una exploradora experta!" : errors === 1 ? "Solo un error. Lo repasarás en «Repaso»." : `Tuviste ${errors} errores. Aparecerán en «Repaso» para que los domines.`}</p>
        ${chestHTML()}
        <div class="actions" style="justify-content:center"><button class="btn g" id="cont">Continuar</button>${r.retry ? `<button class="btn ghost" id="retry">Repetir</button>` : ""}</div></div>`;
      $("#cont", w).addEventListener("click", r.back);
      if (r.retry) $("#retry", w).addEventListener("click", r.retry);
    }
    function show() {
      const { q, key } = qs[i]; const ch = cfg.char;
      w.innerHTML = head() + `<div class="scene"><div class="char">${monkey(ch, i === 0 ? "surprised" : "think", 92)}<span class="nm">${CH[ch].name}</span></div><div class="bubble"><span class="who">${i === 0 ? esc(cfg.title) : "Desafío " + (i + 1) + " de " + qs.length}</span><span class="tw">${i === 0 && cfg.story ? esc(cfg.story) : pickLine(ch)}</span>${SAYBTN}</div></div><div class="qcard" id="qc"></div>`;
      typewrite($(".bubble .tw", w));
      $("#quit", w).addEventListener("click", () => { if (confirm("¿Salir de la misión? Se perderá el avance de esta misión.")) cfg.quit ? cfg.quit() : go("camp", { camp: cfg.camp.id }); });
      const qc = $("#qc", w);
      const done = ok => {
        const tp = qs[i].topic || cfg.topic; stat(tp, ok); const pt = perTopic[tp] || (perTopic[tp] = { ok: 0, n: 0, camp: qs[i].campId || (cfg.camp && cfg.camp.id) }); pt.n++; if (ok) pt.ok++; markWrong(key, q.q, qs[i].campId || (cfg.camp ? cfg.camp.id : ""), ok);
        if (!ok) { errors++; hearts = Math.max(0, hearts - 1); $(".hearts", w).textContent = "❤".repeat(hearts) + "♡".repeat(5 - hearts); $("#qc", w).classList.add("shake"); }
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
    order.forEach((op, n) => { const b = el("button", { class: "opt" }, `<span class="k">${"ABCD"[n]}</span><span>${esc(op.t)}</span>`); b.addEventListener("click", () => { const ok = op.k === q.a; [...o.children].forEach((x, j) => { x.disabled = true; if (order[j].k === q.a) x.classList.add("ok"); else if (x === b) x.classList.add("bad"); }); qc.insertAdjacentHTML("beforeend", fbBox(ok, q.why)); qc.appendChild(contBtn(next)); done(ok); }); o.appendChild(b); });
  }
  function qTF(qc, q, done, next) {
    qc.innerHTML = `<div class="ctx">¿Verdadero o falso?</div><h2>${esc(q.q)}</h2><div class="opts two" id="o"></div>`;
    const o = $("#o", qc); [["✅ Verdadero", true], ["❌ Falso", false]].forEach(([t, v]) => { const b = el("button", { class: "opt", style: "justify-content:center;font-size:19px" }, `<span>${t}</span>`); b.addEventListener("click", () => { const ok = v === q.a; [...o.children].forEach(x => { x.disabled = true; }); b.classList.add(ok ? "ok" : "bad"); if (!ok) [...o.children].find(x => x !== b).classList.add("ok"); qc.insertAdjacentHTML("beforeend", fbBox(ok, q.why)); qc.appendChild(contBtn(next)); done(ok); }); o.appendChild(b); });
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
    qc.innerHTML = `<div class="ctx">✍️ Respuesta escrita · como en la prueba</div><h2>${esc(q.q)}</h2><textarea class="write" id="tx" placeholder="Escribe aquí tu respuesta con tus palabras…"></textarea><div class="actions"><button class="btn g" id="check" disabled>Ver respuesta modelo</button></div>`;
    const tx = $("#tx", qc); tx.addEventListener("input", () => { $("#check", qc).disabled = tx.value.trim().length < 10; });
    $("#check", qc).addEventListener("click", () => { tx.disabled = true; $("#check", qc).remove(); const txt = tx.value.toLowerCase(); const hits = q.keywords.filter(k => txt.includes(k.toLowerCase())); qc.insertAdjacentHTML("beforeend", `<div class="model"><span class="t">Respuesta modelo</span>${esc(q.model)}<div style="margin-top:8px"><span class="small muted">Ideas clave que mencionaste:</span><br>${q.keywords.map(k => `<span class="kw ${hits.includes(k) ? "hit" : ""}">${hits.includes(k) ? "✓ " : ""}${esc(k.replace(/i$/, "iar/ión").replace(/^captur$/, "capturar").replace(/^religi$/, "religión").replace(/^mestiz$/, "mestizaje").replace(/^inver$/, "invertir").replace(/^privad$/, "privada").replace(/^astronom$/, "astronomía").replace(/^financiar\/ión$/, "financiar"))}</span>`).join("")}</div></div><div class="ctx" style="margin-top:12px">Compara con la respuesta modelo. ¿Cómo te fue?</div><div class="opts two"><button class="opt" id="good" style="justify-content:center">😃 Lo tenía bien</button><button class="opt" id="meh" style="justify-content:center">🤔 Me faltó algo</button></div>`); const fin = ok => { $("#good", qc).disabled = $("#meh", qc).disabled = true; qc.insertAdjacentHTML("beforeend", fbBox(ok, ok ? "¡Escribir con tus palabras es la mejor forma de aprender!" : "No pasa nada: vuelve a leer la respuesta modelo y en el repaso lo intentas de nuevo.")); qc.appendChild(contBtn(next)); done(ok); }; $("#good", qc).addEventListener("click", () => fin(true)); $("#meh", qc).addEventListener("click", () => fin(false)); });
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
    intro.innerHTML = `<button class="btn ghost sm" data-go="home">← Selva</button><div class="result"><div style="font-size:64px">🏆</div><h2>Templo de la Prueba</h2><p class="muted">Un simulacro de 20 preguntas mezcladas de los cinco campamentos, igual que la prueba del jueves. Sin ayuda de la bitácora. Al final verás qué temas repasar.</p>${S.boss ? `<p><b>Tu mejor resultado:</b> ${S.boss.pct}% ${S.boss.pct >= 80 ? "🏅" : ""}</p>` : ""}${S.bossLast ? `<div class="card bars" style="text-align:left;margin-bottom:12px"><div class="eyebrow">Último simulacro · ${S.bossLast.pct}%</div>${C.camps.map(c => { const t = S.bossLast.perTopic[c.topic]; const p = t ? Math.round(t.ok / t.n * 100) : null; return `<div class="r"><span>${c.icon} ${esc(c.topic)}</span><div class="bar"><b style="width:${p || 0}%;background:${p == null ? "#ccc" : p >= 75 ? "var(--ok)" : p >= 50 ? "var(--gold)" : "var(--coral)"}"></b></div><span class="n">${p == null ? "—" : p + "%"}</span></div>`; }).join("")}${(() => { const weak = C.camps.filter(c => { const t = S.bossLast.perTopic[c.topic]; return t && t.ok / t.n < .75; }); return weak.length ? `<div class="alert" style="margin-top:10px"><b>Consejo de Ovaya:</b> repasa ${weak.map(c => `<button class="btn ghost sm" data-camp="${c.id}" style="margin:3px 4px 0 0">${c.icon} ${esc(c.name)}</button>`).join("")}</div>` : `<div class="alert" style="margin-top:10px;background:var(--ok-bg);border-color:var(--ok)"><b>¡Todos los temas sobre 75%!</b> Estás lista para la prueba.</div>`; })()}</div>` : ""}<div class="today card" style="text-align:left"><div class="char">${monkey("ovaya", "surprised", 84)}</div><div class="bubble"><span class="who">Ovaya</span>¡Este es el gran desafío, ${esc(S.name)}! Respira hondo. Si sacas 80% o más, ganas el sello del Templo.</div></div><div class="actions" style="justify-content:center"><button class="btn" id="start">¡Empezar simulacro!</button></div></div>`;
    m.appendChild(intro);
    intro.querySelectorAll("[data-camp]").forEach(b => b.addEventListener("click", () => go("camp", { camp: b.dataset.camp })));
    $("#start", intro).addEventListener("click", () => {
      m.innerHTML = "";
      let pool = []; C.camps.forEach(c => c.missions.forEach(ms => ms.questions.forEach((q, i) => { if (q.t !== "write") pool.push({ q, key: `${ms.id}:${i}`, topic: c.topic, camp: c }); })));
      const per = {}; C.camps.forEach(c => per[c.id] = shuffle(pool.filter(p => p.camp === c)).slice(0, 4)); const qs = shuffle([].concat(...Object.values(per)));
      const topicErr = {};
      runQuiz(m, { title: "Simulacro de la prueba", char: "ovaya", story: "20 preguntas de toda la unidad. ¡Tú puedes!", topic: "Simulacro", camp: C.camps[0], questions: qs.map(p => ({ q: p.q, key: p.key, topic: p.topic, campId: p.camp.id })), quit: () => go("home"), onDone: (errors, perTopic) => {
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
    const ST = [["first", "🧭", "Primera misión"], ...C.camps.map(c => [c.id, c.icon, c.name]), ["boss", "🏆", "Templo conquistado"], ["streak3", "🔥", "3 días seguidos"], ["daily5", "🎲", "Reto del día perfecto"], ...C.camps.map(c => ["flash-" + c.id, "🃏", "Tarjetas " + c.n]), ...C.camps.map(c => ["liana-" + c.id, "🐒", "Lianas " + c.n]), ...C.camps.map(c => ["memo-" + c.id, "🎵", "Memorice " + c.n])];
    if (S.streak.count >= 3) stamp("streak3");
    const dn = ["L", "M", "X", "J", "V", "S", "D"]; const now = new Date(); const mon = new Date(now); mon.setDate(now.getDate() - ((now.getDay() + 6) % 7)); mon.setHours(0, 0, 0, 0);
    const week = [...Array(7)].map((_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); const k = localKey(d); return `<span class="${S.days.includes(k) ? "d" : ""} ${k === todayKey() ? "t" : ""}">${dn[i]}</span>`; }).join("");
    const w = el("div");
    w.innerHTML = `<div class="card"><div class="row"><div class="avatar" style="width:72px;height:72px;font-size:30px;border-radius:24px">${esc(S.name[0] || "L")}</div><div><h2 style="font-size:26px;font-weight:600">${esc(S.name)}, exploradora nivel ${level()}</h2><div class="muted">${S.xp} XP · ${S.streak.count} día${S.streak.count === 1 ? "" : "s"} seguidos 🔥 · ${doneMissions()}/${totalMissions} misiones</div></div></div>
      <div class="bars" style="margin-top:10px"><div class="r"><span>Nivel ${level()}</span><div class="bar"><b style="width:${((S.xp % 250) / 250) * 100}%;background:var(--jungle)"></b></div><span class="n">${S.xp % 250}/250</span></div></div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600;margin-bottom:8px">Esta semana</h3><div class="week">${week}</div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600;margin-bottom:10px">Sellos del pasaporte</h3><div class="stamps">${ST.map(([id, ic, t]) => `<div class="stamp ${S.stamps.includes(id) ? "got" : ""}"><div><span class="big">${S.stamps.includes(id) ? ic : "·"}</span>${esc(t)}</div></div>`).join("")}</div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600;margin-bottom:4px">Álbum de Los Ayas</h3><p class="muted small" style="margin:0 0 10px">Cada campamento completo desbloquea una foto real de la tripulación.</p><div class="album">${[["c1", "Concierto en el piano"], ["c2", "Trepando el árbol"], ["c3", "La casa de Los Ayas"], ["c4", "Paseo en bote"], ["c5", "Colgados en la cocina"], ["boss", "Abrazo de campeones"]].map(([k, t]) => { const un = k === "boss" ? S.stamps.includes("boss") : S.stamps.includes(k); return `<figure class="photo ${un ? "" : "locked"}"><img src="assets/album/${k}.jpg" alt="${esc(t)}" loading="lazy"><figcaption>${un ? esc(t) : "🔒 " + (k === "boss" ? "Templo de la Prueba" : "Campamento " + k.slice(1))}</figcaption></figure>`; }).join("")}</div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600;margin-bottom:10px">Tu tripulación: Los Ayas</h3><img class="trio-wide" src="assets/chars/trio.png" alt="Ovaya, Chupaya y Estaya"><div class="crew">${Object.keys(CH).map(k => `<div class="c">${monkey(k, "happy", 90)}<b>${CH[k].name}</b><p>${esc(CH[k].desc)}</p></div>`).join("")}</div></div>`;
    m.appendChild(w);
  }

  document.addEventListener("click", e => { const f = e.target.closest(".photo:not(.locked)"); if (!f) return; const lb = el("div", { class: "lightbox" }, `<img src="${f.querySelector("img").src}" alt=""><p>${f.querySelector("figcaption").textContent}</p>`); lb.addEventListener("click", () => lb.remove()); document.body.appendChild(lb); });

  /* ── PANEL MAMÁ ── */
  let parentOK = false;
  function parent(m) {
    if (!parentOK) { const p = el("div", { class: "pin card" }); p.innerHTML = `<div style="font-size:40px">🔒</div><h2 style="font-size:22px">Panel para mamá</h2><p class="muted small">Escribe el PIN (al inicio es 1234).</p><input id="pin" inputmode="numeric" maxlength="6" autocomplete="off" aria-label="PIN"><button class="btn g" id="ok">Entrar</button>`; m.appendChild(p); const tryPin = () => { if ($("#pin", p).value === S.pin) { parentOK = true; render(); } else { $("#pin", p).value = ""; toast("PIN incorrecto"); } }; $("#ok", p).addEventListener("click", tryPin); $("#pin", p).addEventListener("keydown", e => { if (e.key === "Enter") tryPin(); }); $("#pin", p).focus(); return; }
    const topics = C.camps.map(c => { const s = S.stats[c.topic] || { ok: 0, n: 0 }; return { c, s, pct: s.n ? Math.round(s.ok / s.n * 100) : null }; });
    const totalN = topics.reduce((a, t) => a + t.s.n, 0), totalOK = topics.reduce((a, t) => a + t.s.ok, 0);
    const wrong = Object.values(S.wrong);
    const w = el("div");
    w.innerHTML = `<div class="row" style="justify-content:space-between"><h2 style="font-size:26px;font-weight:600">Panel de progreso</h2><button class="btn ghost sm" id="lock">Cerrar 🔒</button></div>
      <div class="kpi" style="margin-top:12px"><div><b>${doneMissions()}/${totalMissions}</b><small>misiones completadas</small></div><div><b>${totalN ? Math.round(totalOK / totalN * 100) : 0}%</b><small>aciertos (${totalN} respuestas)</small></div><div><b>${S.streak.count}</b><small>días seguidos</small></div><div><b>${S.boss ? S.boss.pct + "%" : "—"}</b><small>mejor simulacro</small></div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600">Aciertos por tema de la prueba</h3><div class="bars" style="margin-top:6px">${topics.map(t => `<div class="r"><span>${t.c.n}. ${esc(t.c.topic)}</span><div class="bar"><b style="width:${t.pct || 0}%;background:${t.pct == null ? "#ccc" : t.pct >= 80 ? "var(--ok)" : t.pct >= 60 ? "var(--gold)" : "var(--coral)"}"></b></div><span class="n">${t.pct == null ? "sin datos" : t.pct + "%"}</span></div>`).join("")}</div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600">Para reforzar (${wrong.length})</h3><p class="muted small" style="margin:4px 0 10px">Preguntas falladas que siguen pendientes. Desaparecen cuando Leti las responde bien dos veces en «Repaso».</p><div class="wrongs">${wrong.length ? wrong.map(x => `<div>${esc(x.q)}</div>`).join("") : "<div class='muted' style='border-color:var(--ok)'>Nada pendiente por ahora.</div>"}</div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600">Ajustes</h3>
        <div class="field"><label for="nm">Nombre de la exploradora</label><input id="nm" value="${esc(S.name)}"></div>
        <div class="field"><label for="np">Cambiar PIN</label><input id="np" inputmode="numeric" maxlength="6" placeholder="Nuevo PIN (4 a 6 números)"></div>
        <div class="field"><label><input type="checkbox" id="snd" ${S.sound ? "checked" : ""} style="width:auto;margin-right:8px">Sonidos activados</label></div>
        <div class="actions" style="justify-content:flex-start"><button class="btn g sm" id="saveS">Guardar ajustes</button><button class="btn ghost sm" id="reset">Reiniciar todo el progreso</button></div>
        <p class="muted small" style="margin-top:12px">Próximamente: subir fotos, texto o enlaces del colegio para crear nuevas expediciones con inteligencia artificial (requiere clave de API de Anthropic).</p></div>`;
    m.appendChild(w);
    $("#lock", w).addEventListener("click", () => { parentOK = false; go("home"); });
    $("#saveS", w).addEventListener("click", () => { const nm = $("#nm", w).value.trim(); if (nm) S.name = nm; const np = $("#np", w).value.trim(); if (np) { if (/^\d{4,6}$/.test(np)) S.pin = np; else return toast("El PIN debe tener 4 a 6 números."); } S.sound = $("#snd", w).checked; save(); toast("Ajustes guardados"); render(); });
    $("#reset", w).addEventListener("click", () => { if (confirm("¿Borrar TODO el progreso de Leti? Esta acción no se puede deshacer.")) { const pin = S.pin; S = Object.assign({}, DEF, { pin }); save(); toast("Progreso reiniciado"); go("home"); } });
  }

  /* ── arranque ── */
  touchDay();
  render();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => { });
})();
