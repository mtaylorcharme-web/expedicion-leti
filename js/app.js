/* Misión Aya · motor de la app (sin dependencias) */
(function () {
  "use strict";
  let C = window.CONTENT; const CH = window.CHARS, monkey = window.monkey;
  function usarUnidad() { try { const u = JSON.parse(localStorage.getItem("mision-aya-v1") || "{}"); if (u.unidadActiva && u.unidades && u.unidades[u.unidadActiva]) C = u.unidades[u.unidadActiva]; } catch (e) { } }
  usarUnidad();
  /* El material de apoyo (fuentes, lecciones, causas, canciones…) pertenece a UNA unidad.
     Si hay una unidad generada activa, se usa el material que ella traiga en "extras";
     el material de los archivos js/content-*.js es solo de la unidad de archivo. Así una
     expedición de Science nunca muestra la red causal de Historia en su selva c1. */
  const material = (clave, nombreGlobal) => (C.extras && C.extras[clave]) || (C === window.CONTENT ? (window[nombreGlobal] || []) : []);
  const FU = () => material("fuentes", "FUENTES");
  const LE = () => material("ensenar", "LECCIONES");
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
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } programarSync(); }
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
  function daysToTest() { const p = (typeof proximaPrueba === "function") && proximaPrueba(); const f = (p && p.fecha) || C.unit.test.date; const t = new Date(f + "T00:00:00"), n = new Date(); n.setHours(0, 0, 0, 0); return Math.round((t - n) / 864e5); }
  function stars(errors) { return errors <= 1 ? 3 : errors <= 3 ? 2 : 1; }
  const starStr = n => "★".repeat(n) + "☆".repeat(3 - n);

  /* ── progreso ── */
  const campDone = c => c.missions.filter(m => S.done[m.id]).length;
  const campStars = c => c.missions.reduce((a, m) => a + (S.done[m.id] ? S.done[m.id].stars : 0), 0);
  /* Nada se bloquea. Una puerta cerrada tiene sentido en una aventura, pero no la
     víspera de una prueba: si el miércoles quiere reforzar la selva 4, la app no
     puede decirle que no. Lo que sigue siendo secuencial es la RECOMPENSA —el
     fragmento del mapa, el sello y la pista hacia la Ciudad Aya se ganan completando—
     y el camino sugerido, que se marca con «Vas aquí». La expectativa vive en lo que
     todavía no tiene, no en lo que no puede abrir. */
  /* Los límites exactos del recorte satelital de assets/mapa/himalaya.jpg. Si se
     cambia la imagen, hay que cambiar estos números: los ocho lugares se colocan
     con ellos. Ver assets/mapa/FUENTES.txt */
  const LIMITES_HIMALAYA = { sur: 20, norte: 42, oeste: 70, este: 100 };
  /* Cuatro de los ocho lugares quedan casi encima (Katmandú, Namche, Paro y Thimphu
     están a pocos kilómetros), así que cada rótulo tiene su lado asignado a mano. */
  const LADO_ROTULO = { gilgit: "arriba", leh: "arriba", lhasa: "arriba", shigatse: "izq", katmandu: "izq", namche: "abajo", paro: "der", thimphu: "arriba" };
  const campUnlocked = () => true;
  const missionUnlocked = () => true;
  /* En orden = hasta dónde llegó siguiendo el camino. Sirve para marcar lo que se
     adelantó, sin impedirlo. */
  const campEnOrden = c => c.n === 1 || campDone(C.camps[c.n - 2]) >= 1;
  /* Abrir todas las selvas fue lo correcto, pero el reto del día no puede preguntar
     de lo que todavía no ha estudiado: sería perder la racha por contenido nuevo.
     Aquí "visitada" es la selva que ya empezó (leyó la bitácora o hizo una misión),
     más la primera, que siempre cuenta. */
  const campVisitada = c => c.n === 1 || !!S.done[c.id + "-notes"] || campDone(c) > 0;
  const totalMissions = C.camps.reduce((a, c) => a + c.missions.length, 0);
  const doneMissions = () => C.camps.reduce((a, c) => a + campDone(c), 0);
  const level = () => Math.floor(S.xp / 250) + 1;

  /* ── navegación ── */
  let view = "home", ctx = {};
  function go(v, c) { pararVoz(true); view = v; ctx = c || {}; render(); himnoSegunVista(v); window.scrollTo({ top: 0 }); }
  function render() { renderTop(); renderNav(); const m = $("#view"); m.innerHTML = ""; m.className = "view fade"; ({ home, camp, notes, mission, flash, boss, review, passport, parent, game, memo, song, daily, fuentes, fuente, ensenar, mundo, ciudad, causas, ciego, aqui })[view](m); }
  function renderTop() {
    const d = daysToTest(); const dl = d > 1 ? `${d} días` : d === 1 ? "¡mañana!" : d === 0 ? "¡hoy!" : "pasó";
    $("#topbar").innerHTML = `<span class="chip streak">🔥 ${S.streak.count} <span class="lbl">día${S.streak.count === 1 ? "" : "s"}</span></span><span class="chip xp">⭐ ${S.xp} <span class="lbl">XP</span></span><span class="chip days">📅 <span class="lbl">Prueba:</span> ${dl}</span><span class="spacer"></span><button class="chip mus ${himno && !himno.paused ? "on" : ""}" data-himno="1" aria-label="Himno de Los Ayas" title="Himno de Los Ayas">🎵</button><button class="avatar" data-go="passport" aria-label="Pasaporte"><img src="assets/chars/ovaya.png" alt="Ovaya"></button>`;
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
    const draw = () => { const st = steps[i]; w.innerHTML = `<div class="wl-stage">${i === steps.length - 1 ? `<img class="trio" src="assets/chars/trio.png" alt="Los Ayas">` : monkey(st.id, st.mood, 150)}</div><div class="bubble wl"><span class="who">${CH[st.id].name}</span><span class="tw">${st.t}</span>${SAYBTN}</div><div class="actions" style="justify-content:center">${i === steps.length - 1 ? `<button class="btn y" data-himno="1">Escuchar el himno 🎵</button>` : ""}<button class="btn ${i === steps.length - 1 ? "" : "g"}" id="nx">${i === steps.length - 1 ? "¡Vamos a casa! 🏔️" : "Siguiente →"}</button></div><div class="dots">${steps.map((_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("")}</div>`; typewrite($(".tw", w)); beep(true); $("#nx", w).addEventListener("click", () => { i++; if (i >= steps.length) { S.welcomed = true; save(); confetti(); jingle("win"); go("home"); } else draw(); }); };
    draw();
  }

  /* ── INICIO ── */
  function home(m) {
    touchDay();
    if (!S.welcomed) return welcome(m);
    const d = daysToTest();
    const cur = C.camps.find(c => campEnOrden(c) && campDone(c) < c.missions.length) || C.camps[C.camps.length - 1];
    const guide = cur.guide;
    const allDone = C.camps.every(c => campDone(c) === c.missions.length);
    const positions = [[22, 8], [66, 20], [24, 33], [68, 46], [26, 59], [64, 73], [40, 90]];
    const mapH = 1000;
    const P = positions.map(([x, y]) => [x * 6, y * mapH / 100]);
    const fragmentos = C.camps.filter(c => campDone(c) === c.missions.length).length;
    const wrap = el("div", { class: "home" });
    const map = el("div", { class: "mapwrap" });
    /* La selva se dibuja en tres planos: troncos lejanos delgados y pálidos, troncos
       medios, y troncos cercanos gruesos y oscuros pegados a los bordes. Las RAMAS
       horizontales van a alturas fijas (ramasY) y son las que sostienen de verdad a
       los Ayas: de ahí cuelgan sus lianas. */
    const ramasY = [92, 214, 336, 458, 580, 702, 824, 946];
    /* ── Los árboles ──────────────────────────────────────────────────────────
       Un tronco de verdad no es una barra: es más ancho abajo que arriba, tiene
       una curva propia, corteza, y raíces que se abren en la base. Las ramas no
       son palos horizontales: nacen del tronco, se afinan hacia la punta y se
       bifurcan. Se dibujan como polígonos porque el trazo del SVG no sabe afinarse. */
    const ALTO_ARB = mapH + 80, Y0 = -40;
    const troncoSVG = (cx, arriba, abajo, curva, color, luz, sombra, op) => {
      const y1 = Y0, y2 = ALTO_ARB + Y0;
      const ta = arriba / 2, tb = abajo / 2;
      const m1 = mapH * .34, m2 = mapH * .7;
      const izqD = `M ${cx - ta} ${y1} C ${cx - ta - curva} ${m1}, ${cx - tb * .82 - curva * .4} ${m2}, ${cx - tb} ${y2}`;
      const derD = `L ${cx + tb} ${y2} C ${cx + tb * .82 + curva * .4} ${m2}, ${cx + ta + curva} ${m1}, ${cx + ta} ${y1} Z`;
      const vetas = [...Array(3)].map((_, k) => {
        const off = (k - 1) * (arriba * .26), an = 1.6 + k * .8;
        return `<path d="M ${cx + off} ${y1} C ${cx + off - curva * .9} ${m1}, ${cx + off - curva * .35} ${m2}, ${cx + off * .85} ${y2}"
          stroke="${k === 1 ? sombra : luz}" stroke-width="${an}" fill="none" opacity="${k === 1 ? .5 : .38}"/>`;
      }).join("");
      /* raíces: la base se abre en dos o tres contrafuertes */
      const raices = [-1, 1, 0].map((d, k) => {
        const anc = tb * (k === 2 ? .5 : .9), h = 60 + k * 26, px = cx + d * tb * .8;
        return `<path d="M ${px - anc * .5} ${y2} C ${px - anc * .5} ${y2 - h}, ${px + d * anc * .8} ${y2 - h * .5}, ${px + d * anc * 1.5} ${y2}" fill="${color}"/>`;
      }).join("");
      return `<g opacity="${op}">${raices}<path d="${izqD} ${derD}" fill="${color}"/>
        <path d="${izqD} L ${cx - tb + abajo * .3} ${y2} C ${cx - tb * .5} ${m2}, ${cx - ta * .3 - curva} ${m1}, ${cx - ta + arriba * .3} ${y1} Z" fill="${luz}" opacity=".45"/>
        ${vetas}
        <path d="${derD.replace("L", "M")}" stroke="${sombra}" stroke-width="${Math.max(3, abajo * .09)}" fill="none" opacity=".5"/></g>`;
    };

    const troncosLejos = [[130, 14, 22, 16], [250, 11, 17, -12], [356, 15, 24, 10], [472, 12, 19, -14], [200, 10, 15, 8], [424, 11, 18, -9]]
      .map(([x, a, b, c], i) => troncoSVG(x, a, b, c, "#456B4A", "#6E8C63", "#2F4A34", .32 + (i % 2) * .07)).join("");
    const troncosMedio = [[110, 26, 44, 18], [306, 22, 38, -15], [468, 28, 48, 13]]
      .map(([x, a, b, c]) => troncoSVG(x, a, b, c, "#5B4330", "#8A6647", "#33220F", .66)).join("");
    const troncosCerca = troncoSVG(44, 58, 96, 14, "#3B2A1C", "#6B4C33", "#241309", 1)
      + troncoSVG(556, 58, 96, -14, "#3B2A1C", "#6B4C33", "#241309", 1);

    /* Hojas: un racimo es un manojo de hojas con nervadura, no óvalos sueltos */
    const hoja = (x, y, largo, giro, tono) =>
      `<g transform="rotate(${giro} ${x} ${y})"><path d="M ${x} ${y} q ${largo * .5} ${-largo * .34} ${largo} 0 q ${-largo * .5} ${largo * .34} ${-largo} 0 Z" fill="${tono}"/>
        <path d="M ${x} ${y} l ${largo} 0" stroke="#1F5A38" stroke-width="1.1" opacity=".45"/></g>`;
    /* Un racimo es una masa de hojas que se solapan, no un abanico que sale de un punto:
       cada hoja arranca de un sitio distinto dentro del racimo y mira hacia otro lado. */
    const racimo = (cx, cy, n, haciaFuera) => {
      const orden = [...Array(n)].map((_, k) => {
        const t = n === 1 ? .5 : k / (n - 1);
        const dx = haciaFuera * (-14 + t * 40) + ((k * 7) % 11) - 5;
        const dy = -16 + Math.sin(t * Math.PI) * -10 + ((k * 13) % 17) - 8;
        const l = 26 + (k % 3) * 10;
        const ang = -38 + t * 76 + ((k * 11) % 13) - 6;
        return { dx, dy, l, ang, k };
      });
      /* primero las de atrás, más oscuras; encima las de delante, más claras */
      return orden.map(o => hoja(cx + o.dx, cy + o.dy, haciaFuera > 0 ? o.l : -o.l, haciaFuera > 0 ? o.ang : -o.ang, "#24603C")).join("")
           + orden.map(o => hoja(cx + o.dx + haciaFuera * 4, cy + o.dy + 5, haciaFuera > 0 ? o.l * .88 : -o.l * .88, haciaFuera > 0 ? o.ang - 6 : -o.ang + 6, o.k % 2 ? "#3FA66B" : "#2E7D4F")).join("");
    };

    /* Cada rama sale del tronco, sube un poco y se afina hasta la punta, con una
       bifurcación y hojas. La parte horizontal queda a la altura exacta de ramasY,
       que es de donde se cuelgan los Ayas. */
    const ramaSVG = (ry, izq, largo) => {
      const xT = izq ? 92 : 508;           // borde del tronco cercano
      const dir = izq ? 1 : -1;
      const xP = xT + dir * largo;          // punta
      const base = 30, punta = 7;
      const yBase = ry + 34, yPunta = ry + 2;
      const arriba = `M ${xT} ${yBase - base / 2} C ${xT + dir * largo * .34} ${ry - 10}, ${xT + dir * largo * .66} ${yPunta - punta / 2 - 3}, ${xP} ${yPunta - punta / 2}`;
      const abajo = `L ${xP} ${yPunta + punta / 2} C ${xT + dir * largo * .66} ${yPunta + punta / 2 + 5}, ${xT + dir * largo * .34} ${ry + 16}, ${xT} ${yBase + base / 2} Z`;
      const xBif = xT + dir * largo * .62, yBif = ry + 8;
      const bifurca = `<path d="M ${xBif} ${yBif} C ${xBif + dir * 40} ${yBif - 26}, ${xBif + dir * 66} ${yBif - 44}, ${xBif + dir * 84} ${yBif - 52}"
        stroke="#3B2A1C" stroke-width="7" fill="none" stroke-linecap="round"/>`;
      return `<g><path d="${arriba} ${abajo}" fill="#3B2A1C"/>
        <path d="${arriba}" stroke="#7C5B3E" stroke-width="4" fill="none" opacity=".65"/>
        ${bifurca}
        ${racimo(xBif + dir * 84, yBif - 52, 5, dir)}
        ${racimo(xP, yPunta, 6, dir)}
        ${racimo(xT + dir * largo * .38, ry + 6, 4, dir)}
        ${[.18, .48, .78].map(t => racimo(xT + dir * largo * t, ry + 22, 2, dir)).join("")}</g>`;
    };
    const ramasSVG = ramasY.map((ry, i) => ramaSVG(ry, i % 2 === 0, 300 + (i % 3) * 56)).join("");

    /* El dosel: estamos debajo de la copa, así que arriba todo es hoja */
    const dosel = [...Array(22)].map((_, i) => {
      const x = (i * 71) % 620 - 10, y = (i % 3) * 22 - 6, r = 44 + (i % 4) * 16;
      return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .58}" fill="${i % 3 ? "#1F5A38" : "#17482C"}" opacity=".95"/>`;
    }).join("");

    /* Lianas sueltas que cuelgan de las ramas y dan sensación de espesura */
    const lianasSueltas = ramasY.flatMap((ry, i) => [0, 1].map(k => {
      const x = (i * 137 + k * 211 + 70) % 500 + 50, largo = 70 + ((i + k) * 53) % 150;
      return `<path d="M ${x} ${ry + 14} q ${k ? 12 : -12} ${largo / 2} 0 ${largo}" stroke="#3E5A26" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>` +
             `<circle cx="${x}" cy="${ry + 14 + largo}" r="7" fill="#4E8A3A" opacity=".8"/>` +
             racimo(x, ry + 14 + largo, 3, k ? 1 : -1);
    })).join("");

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
        <linearGradient id="rayo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6D8" stop-opacity=".38"/><stop offset="1" stop-color="#FFF6D8" stop-opacity="0"/></linearGradient>
        <radialGradient id="sombra" cx=".5" cy=".5" r=".72"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#14331F" stop-opacity=".3"/></radialGradient>
        <filter id="lejos"><feGaussianBlur stdDeviation="7"/></filter>
        <filter id="cerca"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>
      <rect width="600" height="${mapH}" fill="url(#cielo)"/>
      <g filter="url(#lejos)" opacity=".5">${[...Array(18)].map((_, i) => { const x = (i * 163 + 40) % 600, y = (i * 271) % mapH, r = 70 + (i % 3) * 34; return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .62}" fill="${i % 2 ? "#3E8A4C" : "#2F7440"}"/>`; }).join("")}</g>
      ${[...Array(5)].map((_, i) => { const x = 70 + i * 118, y = i * (mapH / 5); return `<path d="M ${x} ${y} l 54 0 l -128 ${mapH * .26} l -44 0 Z" fill="url(#rayo)" opacity=".7"/>`; }).join("")}
      ${[...Array(34)].map((_, i) => { const x = (i * 137) % 600, y = (i * 211) % (mapH * .82), r = 28 + (i % 4) * 12; return `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 3 ? "#5FA95F" : "#4E9A52"}" opacity=".32"/>`; }).join("")}
      ${troncosLejos}
      ${troncosMedio}
      ${troncosCerca}
      ${ramasSVG}
      ${lianasSueltas}
      ${dosel}
      ${lianas}
      ${[...Array(14)].map((_, i) => { const izq = i % 2 === 0; const x = izq ? 22 + (i * 17) % 40 : 522 + (i * 13) % 40, y = (i * 173 + 70) % (mapH * .8); return `<text x="${x}" y="${y}" font-size="30" opacity=".75">${["🌴", "🌿", "🦜", "🌺", "🍃", "🌳"][i % 6]}</text>`; }).join("")}
      <g filter="url(#cerca)" opacity=".85">${[...Array(9)].map((_, i) => { const izq = i % 2 === 0; const x = izq ? -30 + (i * 11) % 40 : 590 + (i * 7) % 30, y = 60 + i * (mapH / 9); const r = 74 + (i % 3) * 26; return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .74}" fill="${i % 2 ? "#1F5A38" : "#2A6B43"}"/><ellipse cx="${x + (izq ? 52 : -52)}" cy="${y + 46}" rx="${r * .6}" ry="${r * .44}" fill="#24603C"/>`; }).join("")}</g>
      <rect width="600" height="${mapH}" fill="url(#sombra)" pointer-events="none"/>
      <path d="M -20 ${mapH * .88} L 90 ${mapH * .79} L 190 ${mapH * .87} L 300 ${mapH * .72} L 420 ${mapH * .85} L 520 ${mapH * .78} L 620 ${mapH * .89} L 620 ${mapH} L -20 ${mapH} Z" fill="url(#nieve)" opacity=".97"/>
      <path d="M 300 ${mapH * .72} L 272 ${mapH * .77} L 328 ${mapH * .77} Z" fill="#fff"/>
      <circle cx="${P[6][0]}" cy="${P[6][1]}" r="92" fill="url(#ciudad)" opacity=".35"/>
      <text x="300" y="${mapH * .845}" font-size="22" font-weight="800" text-anchor="middle" fill="#5B7089" font-family="Nunito,sans-serif">Cordillera del Himalaya</text>
    </svg>`;
    /* Ovaya se cuelga del lado con espacio libre y bien por debajo del nombre de la selva,
       para no taparlo nunca. Los nodos van alternando de lado, así que el signo también. */
    const ladoDe = px => px < 50 ? 1 : -1;
    const moverAya = (lm, px, py) => {
      if (!lm) return;
      lm.classList.add("saltando"); setTimeout(() => lm.classList.remove("saltando"), 1100);
      lm.style.left = `calc(${px}% + ${ladoDe(px) * 108}px)`;
      lm.style.top = `calc(${py}% + 126px)`;
      setTimeout(anclar, 1020);
    };
    C.camps.forEach((c, i) => {
      const [x, y] = positions[i]; const enOrden = campEnOrden(c); const un = true; const full = campDone(c) === c.missions.length;
      const node = el("button", { class: `camp ${enOrden ? "" : "adelante"} ${c === cur && !allDone ? "here" : ""}`, style: `left:${x}%;top:${y}%`, "aria-label": c.name });
      node.innerHTML = `<div class="land" style="background:${c.color}"><span class="n">${c.n}</span>${un ? c.icon : "🔒"}${campDone(c) ? `<span class="stars">${"★".repeat(Math.min(3, Math.round(campStars(c) / c.missions.length)))}${full ? " ✓" : ""}</span>` : ""}</div><span class="name">${esc(c.name)}<small>${un ? esc(c.lugar) + " · " + esc(c.epoca) : "selva desconocida"}</small></span>`;
      node.addEventListener("click", () => { if (!enOrden) toast("Te adelantas por las ramas. Puedes estudiarla igual."); const lm = $(".aya-viajero", map); if (lm) { moverAya(lm, x, y); lm.classList.add("walking"); } beep(true); setTimeout(() => go("camp", { camp: c.id }), 650); });
      map.appendChild(node);
    });
    /* El gran salto es el simulacro de la prueba: bloquearlo justo antes de la prueba
       sería lo contrario de ayudar. Siempre abierto; si va con pocas selvas hechas,
       se le advierte, pero decide ella. */
    const [bx, by] = positions[5]; const listaParaSalto = C.camps.filter(c => campDone(c) >= 1).length >= 3; const bossOpen = true;
    const boss = el("button", { class: `camp boss ${listaParaSalto ? "" : "adelante"}`, style: `left:${bx}%;top:${by}%` });
    boss.innerHTML = `<div class="land">🏆${S.boss ? `<span class="stars">${S.boss.pct}%</span>` : ""}</div><span class="name">El gran salto<small>${listaParaSalto ? "simulacro de la prueba" : "simulacro · aún te faltan selvas"}</small></span>`;
    boss.addEventListener("click", () => { if (!listaParaSalto) toast("Vas con pocas selvas recorridas, pero puedes intentarlo igual."); const lm = $(".aya-viajero", map); if (lm) { moverAya(lm, bx, by); lm.classList.add("walking"); } beep(true); setTimeout(() => go("boss"), 650); });
    map.appendChild(boss);
    const [cx2, cy2] = positions[6]; const nPistas = (S.pistas || []).length; const quedanCand = CANDIDATOS.length - nPistas;
    const ciu = el("button", { class: "camp ciudad", style: `left:${cx2}%;top:${cy2}%` });
    ciu.innerHTML = `<div class="land">${quedanCand === 1 ? "✨" : "🏔️"}</div><span class="name">Ciudad Aya<small>${quedanCand === 1 ? "¡la encontraron!" : `${quedanCand} lugares posibles · ${nPistas}/8 pistas`}</small></span>`;
    ciu.addEventListener("click", () => { beep(true); go("ciudad"); });
    map.appendChild(ciu);
    const idx = allDone ? 5 : C.camps.indexOf(cur); const [lx, ly] = positions[idx];
    map.appendChild(el("div", { class: "aya-viajero", "data-cuelga": "1", style: `left:calc(${lx}% + ${ladoDe(lx) * 108}px);top:calc(${ly}% + 126px)` },
      `<span class="cuerda" aria-hidden="true"></span><img src="assets/chars/ovaya.png" alt="Ovaya"><b>Ovaya</b>`));
    map.insertAdjacentHTML("beforeend", `<img class="map-tree" src="assets/chars/trio-arbol.png" alt="" aria-hidden="true">`);
    map.insertAdjacentHTML("beforeend", `<div class="critter fly" style="top:14%;animation-duration:14s">🦜</div><div class="critter fly" style="top:46%;animation-duration:22s;animation-delay:-9s;font-size:22px">🦋</div><div class="critter walk" style="top:62%;animation-duration:30s;animation-delay:-12s">🐢</div>`);
    /* Chupaya se columpia de verdad (recorre un trecho de rama, porque siempre anda perdido)
       y Estaya cuelga cabeza abajo canturreando. Los dos tienen su liana visible. */
    [["chupaya", 86, 40, "swing", "colgado va"], ["estaya", 10, 74, "hang", "♪ la la la ♪"]].forEach(([id, x, y, md, dice]) => {
      const mm = el("div", { class: `map-monkey vive ${id}`, style: `left:${x}%;top:${y}%`, "data-cuelga": "1" },
        `<span class="cuerda" aria-hidden="true"></span>` + monkey(id, md, 52) + `<span class="globito">${esc(dice)}</span>`);
      map.appendChild(mm);
    });
    /* Estaya compone: le salen notas que suben */
    map.insertAdjacentHTML("beforeend", [...Array(3)].map((_, i) =>
      `<span class="nota-musical" style="left:calc(10% + 6px);top:73%;animation-delay:${i * 2.4}s">${["♪", "♫", "♩"][i]}</span>`).join(""));
    /* La portada: el dosel se dibuja, la foto de los Ayas va entera con object-fit:contain
       y nunca se recorta, y la foto real de la selva queda detrás, suave. */
    const hojasDosel = [...Array(16)].map((_, i) => {
      const x = i * 68 - 20, y = 6 + (i % 3) * 16, r = 26 + (i % 4) * 5, giro = (i % 2 ? 1 : -1) * (12 + i % 7);
      return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .46}" fill="${i % 3 ? "#2E7D4F" : "#1F5A38"}" opacity=".9" transform="rotate(${giro} ${x} ${y})"/>`;
    }).join("");
    const hero = el("div", { class: "hero-jungle" }, `
      <div class="fondo" aria-hidden="true"></div>
      <svg class="dosel" viewBox="0 0 1000 90" preserveAspectRatio="none" aria-hidden="true">${hojasDosel}</svg>
      <div class="txt">
        <div class="eyebrow">De rama en rama, de vuelta a casa</div>
        <h1>Misión Aya</h1>
        <p>Los Ayas buscan la Ciudad Aya, en el Himalaya.</p>
        <div class="fragmentos" aria-label="${fragmentos} de 5 fragmentos del mapa">
          ${[...Array(5)].map((_, i) => `<span class="frag ${i < fragmentos ? "hay" : ""}">${i < fragmentos ? "🗺️" : ""}</span>`).join("")}
          <b>${fragmentos} de 5 fragmentos</b>
        </div>
      </div>
      <img class="trio" src="assets/chars/trio.png" alt="Ovaya, Chupaya y Estaya">`);
    /* La brújula: una sola línea que dice exactamente qué toca ahora. Es lo primero
       que se ve después de la portada, para que nunca haya que adivinar por dónde seguir. */
    const proxima = cur.missions.find(x => !S.done[x.id]);
    const leidas = !!S.done[cur.id + "-notes"];
    const quePasa = allDone ? { que: "El gran salto", dir: "Simulacro completo de la prueba", ir: () => go("boss") }
      : !leidas ? { que: `Selva ${cur.n} · Bitácora`, dir: `Lee las ${cur.notes.length} páginas de ${cur.lugar} antes de saltar`, ir: () => go("notes", { camp: cur.id }) }
      : proxima ? { que: `Selva ${cur.n} · ${proxima.title}`, dir: `Con ${CH[proxima.char].name} · ${proxima.questions.length} desafíos`, ir: () => go("mission", { camp: cur.id, mission: proxima.id }) }
      : { que: `Selva ${cur.n}`, dir: "Te quedan actividades por hacer en esta selva", ir: () => go("camp", { camp: cur.id }) };
    const brujula = el("button", { class: "brujula" }, `<span class="ic">🧭</span><span class="cual"><span class="eyebrow">Sigue por aquí</span><b>${esc(quePasa.que)}</b><small>${esc(quePasa.dir)}</small></span><span class="ve">→</span>`);
    brujula.addEventListener("click", () => { beep(true); quePasa.ir(); });

    const shell = el("div"); shell.appendChild(hero); shell.appendChild(brujula); shell.appendChild(wrap); m.appendChild(shell);
    wrap.appendChild(map);

    const side = el("div", { style: "display:grid;gap:14px" });
    const nextM = cur.missions.find(x => !S.done[x.id]);
    const msg = allDone ? `¡Tenemos los cinco fragmentos del mapa! Ya se ve la Ciudad Aya entre las montañas. Solo falta el último salto.` : campDone(cur) === 0 && !S.done[cur.id + "-notes"] ? cur.intro : nextM ? `Estamos en ${cur.name}, ${cur.lugar}, ${cur.epoca}. Siguiente salto: «${nextM.title}». ${nextM.story}` : cur.intro;
    side.innerHTML = `<div class="card"><div class="today"><div class="char">${monkey(guide, allDone ? "party" : "happy", 96)}</div><div class="bubble"><span class="who">${CH[guide].name}</span><span class="tw">${esc(msg)}</span>${SAYBTN}</div></div><div class="actions" style="justify-content:flex-start"><button class="btn" id="goNext">${allDone ? "Ir a la Ciudad Aya 🏔️" : "¡A saltar! 🐒"}</button><button class="btn ghost" data-go="review">Repaso 🎯</button></div></div>`;
    $("#goNext", side).addEventListener("click", () => allDone ? go("boss") : go("camp", { camp: cur.id }));

    side.appendChild(el("div", { class: "seccion" }, "<span>Para hoy</span>"));
    const dailyDone = S.daily && S.daily.date === todayKey();
    const dc = el("div", { class: "card daily" + (dailyDone ? " done" : "") });
    dc.innerHTML = `<div class="row" style="justify-content:space-between;gap:10px"><div><div class="eyebrow">Reto del día</div><b style="font-family:Fredoka;font-size:18px;font-weight:600">${dailyDone ? "¡Reto de hoy superado! ✅" : "5 preguntas sorpresa · +30 XP"}</b><div class="muted small">${dailyDone ? `Sacaste ${S.daily.score}/5. Mañana hay uno nuevo.` : "De las selvas que ya recorriste. ¡Mantén tu racha!"}</div></div>${dailyDone ? "" : `<button class="btn y sm" id="goDaily">¡Jugar! 🎲</button>`}</div>`;
    if (!dailyDone) $("#goDaily", dc).addEventListener("click", () => go("daily"));
    side.appendChild(dc);
    const fx = FU().filter(f => campUnlocked(C.camps.find(c => c.id === f.camp))); const fxh = fx.filter(fuenteHecha).length;
    const fc = el("div", { class: "card taller" });
    fc.innerHTML = `<div class="row" style="justify-content:space-between;gap:10px"><div><div class="eyebrow" style="color:#7A4BB8">Taller de fuentes</div><b style="font-family:Fredoka;font-size:18px;font-weight:600">La carpa del detective</b><div class="muted small">${fxh} de ${fx.length} fuentes analizadas. Mapas, diarios y cartas reales de la época.</div></div><button class="btn sm" id="goFx" style="background:#8E6BC7;box-shadow:0 3px 0 #6B49A0">Analizar 🔍</button></div>`;
    $("#goFx", fc).addEventListener("click", () => go("fuentes"));
    side.appendChild(fc);
    side.appendChild(el("div", { class: "seccion" }, "<span>Para explorar</span>"));
    const hc = el("div", { class: "card himno" });
    const pintaHimno = () => { const son = himno && !himno.paused; hc.innerHTML = `<div class="row"><button class="btn y" data-himno="1" style="width:56px;height:56px;border-radius:50%;padding:0;font-size:22px">${son ? "⏸" : "▶"}</button><div style="flex:1"><div class="eyebrow" style="color:#A8801A">El himno de la expedición</div><b style="font-family:Fredoka;font-size:19px;font-weight:600">${esc(HIMNO.titulo)}</b><div class="hbar"><b id="hb" style="width:${himno ? (himno.currentTime / (himno.duration || HIMNO.dur)) * 100 : 0}%"></b></div></div><span class="notas-mini">${son ? "♪ ♫ ♪" : ""}</span></div>`; };
    pintaHimno();
    hc.addEventListener("click", () => setTimeout(pintaHimno, 120));
    if (himno) { himno.ontimeupdate = () => { const b = hc.querySelector("#hb"); if (b) b.style.width = (himno.currentTime / (himno.duration || HIMNO.dur)) * 100 + "%"; }; }
    side.appendChild(hc);
    const nPis = (S.pistas || []).length; const cand = CANDIDATOS.length - nPis;
    const cc = el("div", { class: "card busqueda" });
    cc.innerHTML = `<div class="row" style="justify-content:space-between;gap:10px"><div><div class="eyebrow" style="color:#A8801A">La búsqueda de casa</div><b style="font-family:Fredoka;font-size:18px;font-weight:600">${cand === 1 ? "¡Encontraron la Ciudad Aya!" : `Quedan ${cand} lugares posibles`}</b><div class="muted small">${nPis} de 8 pistas y ${nPis} de 8 notas de la melodía.</div></div><button class="btn y sm" id="goCiu">Investigar 🏔️</button></div>`;
    $("#goCiu", cc).addEventListener("click", () => go("ciudad"));
    side.appendChild(cc);
    side.appendChild(el("div", { class: "seccion" }, "<span>La prueba</span>"));
    const cd = el("div", { class: "card" });
    cd.innerHTML = `<div class="eyebrow">${esc(C.unit.subject)} · ${esc(C.unit.title)}</div><div class="countdown" style="margin-top:6px"><div class="big">${d >= 0 ? d : 0}</div><div><b style="font-family:Fredoka;font-size:18px">${d > 1 ? "días para la prueba" : d === 1 ? "día para la prueba" : d === 0 ? "¡La prueba es hoy!" : "La prueba ya pasó"}</b><div class="muted small">${esc(C.unit.test.label)} · ${doneMissions()}/${totalMissions} misiones completadas</div></div></div>`;
    side.appendChild(cd);

    const plan = el("div", { class: "card" }); const t0 = new Date(); t0.setHours(0, 0, 0, 0);
    const start = new Date(C.unit.test.date + "T00:00:00"); start.setDate(start.getDate() - C.plan.length);
    const dn = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
    plan.innerHTML = `<h3 style="font-size:19px;font-weight:600">Ruta de regreso hasta la prueba</h3><div class="plan" style="margin-top:10px">${C.plan.map(p => { const dt = new Date(start); dt.setDate(dt.getDate() + p.day); const isT = dt.getTime() === t0.getTime(), past = dt < t0; const camps = p.camps.map(id => C.camps.find(c => c.id === id)); const ok = camps.every(c => campDone(c) === c.missions.length); return `<div class="d ${isT ? "today" : past ? "past" : ""}"><div class="dn">${dn[dt.getDay()]}<b>${dt.getDate()}</b></div><div><b>${esc(p.label)}</b><div class="muted small">${camps.map(c => c.icon + " " + esc(c.name)).join(", ")} · ${esc(p.extra)}</div></div><div class="st">${ok ? "✅" : isT ? "👉" : ""}</div></div>`; }).join("")}</div>`;
    side.appendChild(plan);
    wrap.appendChild(side);

    /* Ningún Aya cuelga del aire: la cuerda se estira exactamente hasta la rama que
       tiene encima. Las ramas están en unidades del SVG, así que se convierten a
       píxeles con la altura real del mapa. */
    function anclar() {
      const alto = map.clientHeight; if (!alto) return;
      const enPx = ramasY.map(ry => (ry + 14) * alto / mapH);
      map.querySelectorAll("[data-cuelga]").forEach(nodo => {
        const arriba = nodo.offsetTop;
        const rama = enPx.filter(p => p < arriba - 12).pop();
        const largo = Math.max(26, Math.round(arriba - (rama == null ? 0 : rama)));
        nodo.style.setProperty("--cuerda", largo + "px");
      });
    }
    anclar();
    requestAnimationFrame(anclar);
    setTimeout(anclar, 320);
    window.addEventListener("resize", anclar);

    /* El mapa mide mil píxeles: si no se acomoda solo, se entra mirando cielo. */
    requestAnimationFrame(() => {
      const aqui = $(".camp.here", map) || $(".aya-viajero", map);
      if (!aqui) return;
      const suave = !matchMedia("(prefers-reduced-motion: reduce)").matches;
      const y = aqui.getBoundingClientRect().top + window.scrollY - window.innerHeight * .42;
      if (y > 60) window.scrollTo({ top: y, behavior: suave ? "smooth" : "auto" });
    });
  }

  /* ── CAMPAMENTO ── */
  function camp(m) {
    const c = C.camps.find(x => x.id === ctx.camp); const notesDone = !!S.done[c.id + "-notes"];
    const h = el("div");
    h.innerHTML = `<button class="btn ghost sm" data-go="home">← Selva</button>
      <div class="camphead" style="margin-top:12px"><div class="icon" style="background:${c.color}">${c.icon}</div><div><div class="eyebrow">Selva ${c.n} de 5 · ${esc(c.lugar)} · ${esc(c.epoca)}</div><h2 style="font-size:26px;font-weight:600">${esc(c.name)}</h2><div class="muted small">${esc(c.topic)}</div></div></div>
      <div class="avance"><div class="barra"><b style="width:${Math.round(campDone(c) / c.missions.length * 100)}%"></b></div><span>${campDone(c)} de ${c.missions.length} misiones · ${"★".repeat(Math.min(3, Math.round(campStars(c) / Math.max(1, c.missions.length))))}${"☆".repeat(3 - Math.min(3, Math.round(campStars(c) / Math.max(1, c.missions.length))))}</span></div>
      <div class="today card"><div class="char">${monkey(c.guide, "happy", 84)}</div><div class="bubble"><span class="who">${CH[c.guide].name}</span><span class="tw">${esc(c.intro)}</span>${SAYBTN}</div></div>`;
    const steps = el("div");
    /* Tres grupos, no once filas iguales: la ruta obligatoria, lo que hace pensar hondo
       y lo que sirve para repasar jugando. Sin esto la vista es una lista de iguales
       donde no se sabe qué tocar. */
    const camino = el("div", { class: "steps camino" });
    const hondo = el("div", { class: "steps" });
    const repaso = el("div", { class: "steps" });
    if (desafioDe(c.id)) { const D = desafioDe(c.id); const hh = S.ciegos && S.ciegos[D.id];
      const sd = el("button", { class: `step opcional ${hh ? "done" : ""}` });
      sd.innerHTML = `<div class="ic">🙈</div><div><b>El salto a ciegas <span class="etiqueta">modo opcional</span></b><span class="sub">${D.retos.length} apuestas con Chupaya <i class="fuerte">antes</i> de leer la bitácora · 3 min</span><span class="sub" style="color:var(--coral-deep);font-weight:800">Aquí se puede fallar: fallar es el punto</span></div><div class="right">${hh ? hh.mejor + "/" + hh.de : "→"}</div>`;
      sd.addEventListener("click", () => go("ciego", { camp: c.id })); camino.appendChild(sd); }
    const s0 = el("button", { class: `step ${notesDone ? "done" : ""}` }); s0.innerHTML = `<div class="ic">📖</div><div><b>Bitácora de esta selva</b><span class="sub">${c.notes.length} páginas sobre ${esc(c.lugar)}, ${esc(c.epoca)} · léelas antes de saltar · 5 min</span></div><div class="right">${notesDone ? "✅" : "→"}</div>`;
    s0.addEventListener("click", () => go("notes", { camp: c.id })); camino.appendChild(s0);
    c.missions.forEach((ms, i) => {
      const un = missionUnlocked(c, i) && (notesDone || i > 0 || true); const dn = S.done[ms.id];
      const b = el("button", { class: `step ${dn ? "done" : ""} ${un ? "" : "locked"}` });
      b.innerHTML = `<div class="ic">${un ? (dn ? "✅" : "🧭") : "🔒"}</div><div><b>Misión ${i + 1}: ${esc(ms.title)}</b><span class="sub">Con ${CH[ms.char].name} · ${ms.questions.length} desafíos · ${Math.round(ms.questions.length * 1.4)} min</span></div><div class="right">${dn ? starStr(dn.stars) : un ? "→" : ""}</div>`;
      b.addEventListener("click", () => un ? go("mission", { camp: c.id, mission: ms.id }) : toast("Primero completa la misión anterior."));
      camino.appendChild(b);
    });
    if (causasDe(c.id)) { const A = causasDe(c.id); const hh = S.causas && S.causas[A.id];
      const sc = el("button", { class: `step destacado ${hh ? "done" : ""}` });
      sc.innerHTML = `<div class="ic">🧵</div><div><b>El hilo de las causas</b><span class="sub">${esc(A.titulo)} · ordena los hechos y une qué provocó qué</span><span class="sub" style="color:var(--jungle);font-weight:800">Aquí se aprende la multicausalidad</span></div><div class="right">${hh ? "★".repeat(hh.estrellas) : "→"}</div>`;
      sc.addEventListener("click", () => go("causas", { camp: c.id })); hondo.appendChild(sc); }
    if (transferDe(c.id)) { const T = transferDe(c.id); const hh = (S.aqui && S.aqui[T.id]) || null; const listo = hh && hh.texto;
      const sq = el("button", { class: `step aqui ${listo ? "done" : ""}` });
      sq.innerHTML = `<div class="ic">${listo ? "🔁" : hh && hh.pendiente ? "🏠" : "🔁"}</div><div><b>Aquí y ahora <span class="etiqueta verde">caso real</span></b><span class="sub">${esc(T.titulo)} · usa «${esc(T.concepto)}» en tu propia vida</span><span class="sub" style="color:var(--jungle);font-weight:800">${hh && hh.pendiente && !listo ? "Lo dejaste pendiente para hacerlo en casa" : "Si solo funciona con Colón, no lo aprendiste"}</span></div><div class="right">${listo ? hh.marcadas + "/" + hh.de : "→"}</div>`;
      sq.addEventListener("click", () => go("aqui", { camp: c.id })); hondo.appendChild(sq); }
    if (LE().some(l => l.camp === c.id)) { const L = LE().find(l => l.camp === c.id); const hecha = leccionHecha(L);
      const se = el("button", { class: `step destacado ${hecha ? "done" : ""}` });
      se.innerHTML = `<div class="ic">🧠</div><div><b>Enséñale a Chupaya</b><span class="sub">${esc(L.titulo)} · explícaselo y él te repregunta</span><span class="sub" style="color:var(--jungle);font-weight:800">Lo que le explicas se te queda</span></div><div class="right">${hecha ? "★".repeat(S.lecciones[L.id].estrellas) : "→"}</div>`;
      se.addEventListener("click", () => go("ensenar", { camp: c.id })); hondo.appendChild(se); }
    const sf = el("button", { class: "step" }); sf.innerHTML = `<div class="ic">🃏</div><div><b>Tarjetas de memoria</b><span class="sub">${c.flashcards.length} tarjetas para repasar rápido · ideal antes de dormir</span></div><div class="right">→</div>`;
    sf.addEventListener("click", () => go("flash", { camp: c.id })); repaso.appendChild(sf);
    const sg = el("button", { class: "step" }); sg.innerHTML = `<div class="ic">🐒</div><div><b>Salto de lianas</b><span class="sub">Verdadero o falso contra el reloj · cruza esta selva con Chupaya · 2 min</span></div><div class="right">${S.games && S.games["liana-" + c.id] ? "🏆 " + S.games["liana-" + c.id] : "→"}</div>`;
    sg.addEventListener("click", () => go("game", { camp: c.id })); repaso.appendChild(sg);
    const sm = el("button", { class: "step" }); sm.innerHTML = `<div class="ic">🎵</div><div><b>Piezas de la nave</b><span class="sub">Empareja concepto y definición con Estaya y recupera piezas · 3 min</span></div><div class="right">${S.games && S.games["memo-" + c.id] ? "🏆 " + S.games["memo-" + c.id] + " mov." : "→"}</div>`;
    sm.addEventListener("click", () => go("memo", { camp: c.id })); repaso.appendChild(sm);
    const fxc = FU().filter(f => f.camp === c.id);
    if (fxc.length) { const sfx = el("button", { class: "step" }); const hh = fxc.filter(fuenteHecha).length;
      sfx.innerHTML = `<div class="ic">🔍</div><div><b>Taller de fuentes</b><span class="sub">${fxc.length} fuente${fxc.length === 1 ? "" : "s"} real${fxc.length === 1 ? "" : "es"} de este tema · analízalas con la guía de tu clase</span></div><div class="right">${hh === fxc.length ? "✅" : hh ? hh + "/" + fxc.length : "→"}</div>`;
      sfx.addEventListener("click", () => go("fuentes")); hondo.appendChild(sfx); }
    if (cancionDe(c.id)) {
    const ss = el("button", { class: "step" }); ss.innerHTML = `<div class="ic">🎤</div><div><b>La canción de Estaya</b><span class="sub">${esc((cancionDe(c.id) || {}).titulo || "Karaoke")} · escúchala, cántala y completa la letra · 3 min</span></div><div class="right">${S.games && S.games["song-" + c.id] ? "🏆" : "→"}</div>`;
    ss.addEventListener("click", () => go("song", { camp: c.id })); repaso.appendChild(ss); }
    /* La ruta se arma con encabezados y el siguiente paso queda marcado, para que
       nunca haya que deducir cuál tocar. */
    /* Si se adelantó, se le dice con la voz de Chupaya, que para eso se pierde:
       es un aviso, no una puerta. */
    if (!campEnOrden(c)) h.insertAdjacentHTML("beforeend", `<div class="adelantada"><span class="ic">🐒</span><div><b>Te adelantaste por las ramas</b><span>Puedes estudiar esta selva cuando quieras. El fragmento del mapa se gana completándola, en el orden que sea.</span></div></div>`);
    steps.appendChild(el("div", { class: "seccion" }, "<span>La ruta de esta selva</span>"));
    steps.appendChild(camino);
    if (hondo.children.length) { steps.appendChild(el("div", { class: "seccion" }, "<span>Para entenderlo de verdad</span>")); steps.appendChild(hondo); }
    if (repaso.children.length) { steps.appendChild(el("div", { class: "seccion" }, "<span>Para repasar jugando</span>")); steps.appendChild(repaso); }
    const siguiente = [...camino.children].find(n => !n.classList.contains("done") && !n.classList.contains("locked") && !n.classList.contains("opcional"));
    if (siguiente) { siguiente.classList.add("siguiente"); siguiente.insertAdjacentHTML("afterbegin", `<span class="marca">Sigue aquí</span>`); }
    h.appendChild(steps); m.appendChild(h);
  }

  /* ── BITÁCORA (cuaderno por páginas) ── */
  function notes(m) {
    const c = C.camps.find(x => x.id === ctx.camp); let pg = 0; const N = c.notes.length; const maxSeen = { v: 0 };
    const w = el("div", { class: "mission" }); m.appendChild(w);
    const draw = () => { const n = c.notes[pg]; maxSeen.v = Math.max(maxSeen.v, pg);
      w.innerHTML = `<div class="mhead"><button class="close" id="back" aria-label="Volver">✕</button><div class="paginas" id="pgs">${c.notes.map((nn, k) => `<button class="pg ${k === pg ? "aqui" : ""} ${k <= maxSeen.v ? "vista" : ""}" data-pg="${k}" title="${esc(nn.title)}" aria-label="Página ${k + 1}: ${esc(nn.title)}">${k + 1}</button>`).join("")}</div></div>
        <div class="scene"><div class="char">${monkey(c.guide, pg === 0 ? "surprised" : "think", 80)}<span class="nm">${CH[c.guide].name}</span></div><div class="bubble"><span class="who">Bitácora · ${esc(c.topic)}</span><span class="tw">${pg === 0 ? "Lee con calma cada página. Toca 🔊 si quieres que te la lea. Al final vienen las misiones." : ["¡Esto sale en la prueba!", "Fíjate en las palabras en verde.", "Léelo dos veces si hace falta.", "¡Vas muy bien!", "Ya casi terminamos."][pg % 5]}</span>${SAYBTN}</div></div>
        <div class="qcard notebook"><div class="eyebrow">Página ${pg + 1}</div><h2>${esc(n.title)}</h2><div class="nbody">${n.body}</div></div>
        <div class="actions" style="justify-content:space-between"><button class="btn ghost" id="prev" ${pg === 0 ? "disabled" : ""}>← Anterior</button>${pg < N - 1 ? `<button class="btn g" id="next">Siguiente →</button>` : ""}${maxSeen.v >= N - 1 ? `<button class="btn" id="ok">${S.done[c.id + "-notes"] ? "Volver a la selva" : "¡Leí toda la bitácora! +15 XP"}</button>` : ""}</div>`;
      typewrite($(".bubble .tw", w)); const qc = $(".qcard", w); qc.insertAdjacentHTML("afterbegin", SAYBTN);
      $("#back", w).addEventListener("click", () => go("camp", { camp: c.id }));
      /* Ocho páginas en fila obligaban a pasar una por una para repasar la sexta.
         El índice deja saltar a cualquiera y muestra cuáles ya vio. */
      $("#pgs", w).addEventListener("click", e => { const b = e.target.closest(".pg"); if (!b) return; pg = +b.dataset.pg; beep(true); draw(); window.scrollTo({ top: 0 }); });
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
    /* Una barra lisa al 0% parece rota. Un tramo por pregunta dice cuántas van,
       cuántas faltan y en cuál está, de un vistazo. */
    function head() {
      const tramos = qs.map((_, k) => `<span class="tramo ${k < i ? "hecha" : k === i ? "ahora" : ""}"></span>`).join("");
      return `<div class="mhead"><button class="close" id="quit" aria-label="Salir">✕</button>
        <div class="avanceq"><div class="tramos">${tramos}</div><span class="cuenta">${i + 1} de ${qs.length}</span></div>
        <div class="hearts" aria-label="Te quedan ${hearts} vidas">${"❤".repeat(hearts)}${"♡".repeat(5 - hearts)}</div></div>`;
    }
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
      const barraAyudas = `<div class="ayudas" id="ay"><span class="titulo">¿Te echan una mano?</span><div class="tres">${Object.keys(ayudas).map(k => `<button class="ay ${ayudas[k] ? "" : "usada"}" data-aya="${k}" ${ayudas[k] ? "" : "disabled"}>${monkey(k, "happy", 34)}<span><b>${CH[k].name}</b>${{ ovaya: "te cubre un fallo", chupaya: "quita una mala", estaya: "lee en voz alta" }[k]}</span></button>`).join("")}</div></div>`;
      w.innerHTML = head() + `<div class="scene"><div class="char">${monkey(ch, i === 0 ? "surprised" : "think", 92)}<span class="nm">${CH[ch].name}</span></div><div class="bubble"><span class="who">${i === 0 ? esc(cfg.title) : "Desafío " + (i + 1) + " de " + qs.length}</span><span class="tw">${i === 0 && cfg.story ? esc(cfg.story) : pickLine(ch)}</span>${SAYBTN}</div></div><div class="qcard" id="qc"></div>` + barraAyudas;
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

  /* ── EL CANCIONERO DE ESTAYA ── */
  const cancionDe = campId => material("canciones", "CANCIONES").find(x => x.camp === campId);
  const puenteURL = () => {
    if (S.puente) return S.puente;
    if (/github\.io$/i.test(location.hostname)) return null;
    return window.PUENTE_SUNO || "/api/cancion";
  };
  const mp3De = s => (S.musica && S.musica[s.id]) || `assets/musica/${s.id}.mp3`;
  async function generarConSuno({ titulo, estilo, letra }, alAvanzar) {
    const base = puenteURL();
    if (!base) throw new Error("Falta configurar el puente de Suno. Entra al panel de Mariana y Francisco, en Ajustes, y pega ahí la dirección de tu sitio de Netlify.");
    alAvanzar("Enviándole la letra a Suno…");
    const r = await fetch(base, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ titulo, estilo, letra }) });
    const d = await r.json().catch(() => ({}));
    if (d.audio) return d.audio;
    if (!r.ok || !d.taskId) throw new Error(d.mensaje || d.detalle || d.error || "No se pudo empezar la canción.");
    const frases = ["Suno está afinando los instrumentos…", "Estaya está eligiendo el ritmo…", "Grabando la primera estrofa…", "Ensayando el coro…", "Mezclando la canción…", "Ya casi, no te vayas…"];
    for (let i = 0; i < 40; i++) {
      await new Promise(x => setTimeout(x, 5000));
      alAvanzar(frases[Math.min(frases.length - 1, Math.floor(i / 3))] + ` (${(i + 1) * 5}s)`);
      const g = await fetch(`${base}?taskId=${encodeURIComponent(d.taskId)}`);
      const e = await g.json().catch(() => ({}));
      if (e.estado === "listo" && e.audio) return e.audio;
      if (e.estado === "error") throw new Error(e.detalle || "Suno no pudo crear esta canción.");
    }
    throw new Error("Suno está demorando más de lo normal. Prueba de nuevo en un rato.");
  }
  const esEtiqueta = l => /^\[.*\]$/.test(l.trim());
  function copiar(txt, msg) {
    const ok = () => toast(msg || "Copiado");
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok).catch(() => fallback());
    else fallback();
    function fallback() { const ta = document.createElement("textarea"); ta.value = txt; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); ok(); } catch (e) { toast("Copia el texto a mano."); } ta.remove(); }
  }

  function song(m) {
    const c = C.camps.find(x => x.id === ctx.camp);
    const CAN = cancionDe(c.id);
    const w = el("div", { class: "mission" }); m.appendChild(w);
    if (!CAN) { w.innerHTML = `<button class="btn ghost sm" id="back">← ${esc(c.name)}</button><p class="muted" style="margin-top:14px">Esta selva todavía no tiene canción.</p>`; $("#back", w).addEventListener("click", () => go("camp", { camp: c.id })); return; }
    const versos = CAN.letra.filter(l => !esEtiqueta(l));
    let audio = null, hayAudio = null, offset = (S.offsets && S.offsets[CAN.id]) || 0;

    function pantalla() {
      w.innerHTML = `<button class="btn ghost sm" id="back">← ${esc(c.name)}</button>
        <div class="camphead" style="margin-top:12px"><div class="icon" style="background:#8E6BC7">🎤</div><div><div class="eyebrow">Cancionero de Estaya</div><h2 style="font-size:24px;font-weight:600">${esc(CAN.titulo)}</h2><div class="muted small">${esc(c.name)} · ${esc(c.lugar)}</div></div></div>
        <div class="today card" style="margin-top:12px"><div class="char">${monkey("estaya", "happy", 72)}</div><div class="bubble"><span class="who">Estaya</span><span class="tw">Esta canción tiene adentro toda la materia de esta selva. Escúchala, cántala y después te tapo palabras para ver si te la sabes.</span>${SAYBTN}</div></div>
        <div id="reproductor"></div>
        <div class="card" style="margin-top:14px"><div class="row" style="justify-content:space-between"><h3 style="font-size:18px;font-weight:600">Letra</h3><button class="btn ghost sm" id="copiarLetra">Copiar letra</button></div>
          <div class="letra" id="letra">${CAN.letra.map((l, k) => esEtiqueta(l) ? `<div class="tag-letra">${esc(l.replace(/[\[\]]/g, ""))}</div>` : `<div class="verso" data-v="${versos.indexOf(l)}">${esc(l)}</div>`).join("")}</div></div>
        <div class="actions" style="justify-content:center"><button class="btn g" id="jugar">Completa la letra →</button></div>`;
      $("#back", w).addEventListener("click", () => { if (audio) audio.pause(); go("camp", { camp: c.id }); });
      $("#copiarLetra", w).addEventListener("click", () => copiar(CAN.letra.join("\n"), "Letra copiada. Pégala en Suno."));
      $("#jugar", w).addEventListener("click", () => { if (audio) audio.pause(); juego(); });
      montarReproductor();
    }

    function montarReproductor() {
      const cont = $("#reproductor", w);
      cont.innerHTML = `<div class="player card" id="pl"><div class="muted small">Buscando la grabación…</div></div>`;
      const a = new Audio(mp3De(CAN)); a.preload = "metadata";
      a.addEventListener("canplay", () => { hayAudio = true; audio = a; conAudio(cont, a); }, { once: true });
      a.addEventListener("error", () => { if (hayAudio === null) { hayAudio = false; sinAudio(cont); } }, { once: true });
      setTimeout(() => { if (hayAudio === null) { hayAudio = false; sinAudio(cont); } }, 3500);
    }

    function conAudio(cont, a) {
      cont.innerHTML = `<div class="player card">
        <div class="row"><button class="btn" id="pp" style="width:64px;height:64px;border-radius:50%;padding:0;font-size:26px">▶</button>
          <div style="flex:1"><div class="pbar" id="barra"><b style="width:0%"></b></div><div class="row" style="justify-content:space-between;margin-top:6px"><span class="small muted" id="t1">0:00</span><span class="small muted" id="t2">--:--</span></div></div></div>
        <div class="row" style="margin-top:10px;gap:8px"><span class="small muted">Ajustar la letra</span><button class="btn ghost sm" id="menos">−0,5 s</button><button class="btn ghost sm" id="mas">+0,5 s</button><span class="small muted" id="off">${offset.toFixed(1)} s</span></div></div>`;
      const pp = $("#pp", cont), barra = $("#barra b", cont);
      const fmt = s => isFinite(s) ? Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0") : "--:--";
      a.addEventListener("loadedmetadata", () => { $("#t2", cont).textContent = fmt(a.duration); });
      if (a.duration) $("#t2", cont).textContent = fmt(a.duration);
      pp.addEventListener("click", () => { if (a.paused) { a.play(); pp.textContent = "⏸"; setMood($(".today .mk", w), "party"); } else { a.pause(); pp.textContent = "▶"; setMood($(".today .mk", w), "happy"); } });
      a.addEventListener("timeupdate", () => {
        const d = a.duration || 1; barra.style.width = (a.currentTime / d * 100) + "%"; $("#t1", cont).textContent = fmt(a.currentTime);
        const i = Math.min(versos.length - 1, Math.max(0, Math.floor(((a.currentTime + offset) / d) * versos.length)));
        w.querySelectorAll(".verso").forEach(v => v.classList.toggle("on", +v.dataset.v === i));
        const act = w.querySelector(".verso.on"); if (act && !act.dataset.visto) { act.dataset.visto = "1"; act.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
      });
      a.addEventListener("ended", () => { pp.textContent = "▶"; w.querySelectorAll(".verso").forEach(v => v.classList.remove("on")); setMood($(".today .mk", w), "happy"); });
      const guardar = () => { S.offsets = S.offsets || {}; S.offsets[CAN.id] = offset; save(); $("#off", cont).textContent = offset.toFixed(1) + " s"; };
      $("#menos", cont).addEventListener("click", () => { offset -= .5; guardar(); });
      $("#mas", cont).addEventListener("click", () => { offset += .5; guardar(); });
    }

    function sinAudio(cont) {
      /* Esto lo abre Leti, no un adulto: primero lo que ella puede hacer —cantar la
         letra escrita— y las instrucciones de Suno plegadas, que son tarea de sus papás. */
      cont.innerHTML = `<div class="sinmusica card">
          <div class="char">${monkey("estaya", "happy", 76)}</div>
          <div><b>Todavía no tengo la música</b><span>Pero la letra ya está escrita. Puedes cantarla tú y completar los huecos aquí abajo.</span></div>
        </div>
        <details class="receta card"><summary><span class="eyebrow">Para Mariana y Francisco</span><b>Cómo grabar esta canción</b></summary>
        <h3 style="font-size:19px;font-weight:600;margin:2px 0 6px">Crearla en Suno toma dos minutos</h3>
        <ol class="pasos"><li>Abre <b>suno.com</b> con tu cuenta y entra en <b>Create</b>.</li><li>Activa <b>Custom</b> para poder pegar la letra.</li><li>Copia el <b>estilo</b> y pégalo en «Style of Music».</li><li>Copia la <b>letra</b> y pégala en «Lyrics». El título es <b>${esc(CAN.titulo)}</b>.</li><li>Genera, elige la versión que más te guste y descárgala como MP3.</li><li>Guarda el archivo como <b>${CAN.id}.mp3</b> dentro de la carpeta <b>assets/musica</b> de la app.</li></ol>
        <div class="bloque-copia"><div class="row" style="justify-content:space-between"><span class="eyebrow">Estilo para Suno</span><button class="btn ghost sm" id="cEstilo">Copiar</button></div><p>${esc(CAN.estilo)}</p></div>
        <div class="bloque-copia"><div class="row" style="justify-content:space-between"><span class="eyebrow">Letra para Suno</span><button class="btn ghost sm" id="cLetra">Copiar</button></div><p class="mini">${esc(CAN.letra.slice(0, 5).join(" / "))}…</p></div>
        <div class="actions" style="justify-content:flex-start;gap:10px"><button class="btn" id="auto">Crearla ahora con Suno 🎶</button><span class="muted small">usa tu cuenta a través de tu puente en Netlify</span></div>
        <div id="estado"></div>
        </details>`;
      $("#auto", cont).addEventListener("click", async () => {
        const btn = $("#auto", cont), est = $("#estado", cont); btn.disabled = true;
        const pinta = t => { est.innerHTML = `<div class="componiendo"><div class="char">${monkey("estaya", "party", 64)}</div><div><b>Componiendo…</b><span>${esc(t)}</span></div></div>`; };
        pinta("Preparando…");
        try {
          const url = await generarConSuno({ titulo: CAN.titulo, estilo: CAN.estilo, letra: CAN.letra.join("\n") }, pinta);
          if (/^https?:/.test(url)) { S.musica = S.musica || {}; S.musica[CAN.id] = url; save(); }
          jingle("win"); confetti(); toast("🎵 ¡La canción está lista!");
          est.innerHTML = `<div class="componiendo"><div class="char">${monkey("estaya", "party", 64)}</div><div><b>¡Lista!</b><span>Descárgala y guárdala como ${CAN.id}.mp3 en assets/musica para que quede para siempre.</span></div></div><div class="actions" style="justify-content:flex-start"><a class="btn g sm" style="text-decoration:none" href="${url}" download="${CAN.id}.mp3" target="_blank" rel="noopener">Descargar el MP3 ⬇</a></div>`;
          S.musica = S.musica || {}; if (/^data:/.test(url)) { audio = new Audio(url); }
          hayAudio = null; setTimeout(() => { if (/^https?:/.test(url)) montarReproductor(); }, 400);
        } catch (err) {
          btn.disabled = false;
          est.innerHTML = `<div class="voz-problema" style="margin-top:10px"><b>🎵 No se pudo crear la canción</b><p>${esc(err.message)}</p><p class="muted small">Revisa en el panel de Mariana y Francisco que el puente de Suno esté bien configurado, o crea la canción a mano con la receta de arriba.</p></div>`;
        }
      });
      $("#cEstilo", cont).addEventListener("click", () => copiar(CAN.estilo, "Estilo copiado. Pégalo en «Style of Music»."));
      $("#cLetra", cont).addEventListener("click", () => copiar(CAN.letra.join("\n"), "Letra copiada. Pégala en «Lyrics»."));
    }

    function juego() {
      const util = versos.filter(v => v.split(" ").filter(x => x.length > 4).length >= 2);
      const qs = shuffle(util).slice(0, 5).map(l => {
        const pal = l.replace(/[.,;:!¡¿?«»]/g, "").split(" ").filter(x => x.length > 4 && /^[a-záéíóúñü]+$/i.test(x));
        const key = pal[Math.floor(Math.random() * pal.length)] || l.split(" ")[0];
        const otras = shuffle(versos.join(" ").replace(/[.,;:!¡¿?«»]/g, "").split(" ").filter(x => x.length > 4 && /^[a-záéíóúñü]+$/i.test(x) && x.toLowerCase() !== key.toLowerCase())).slice(0, 2);
        return { l, key, opts: shuffle([key, ...otras]) };
      });
      let i = 0, score = 0;
      const paso = () => {
        if (i >= qs.length) {
          const xp = 15 + score * 5; addXP(xp); S.games = S.games || {}; S.games["song-" + c.id] = Math.max(S.games["song-" + c.id] || 0, score);
          if (score === qs.length) stamp("song-" + c.id); save(); confetti(); jingle("win");
          w.innerHTML = `<div class="result">${monkey("estaya", "party", 120)}<h2>${score === qs.length ? "¡Te la sabes entera!" : "¡Buen ritmo!"}</h2><p class="muted">Completaste ${score} de ${qs.length} versos de «${esc(CAN.titulo)}».</p><div class="xp">+${xp} XP</div><div class="actions" style="justify-content:center"><button class="btn ghost" id="otra">Volver a la canción</button><button class="btn g" id="back2">Volver a la selva</button></div></div>`;
          $("#otra", w).addEventListener("click", () => go("song", { camp: c.id }));
          $("#back2", w).addEventListener("click", () => go("camp", { camp: c.id })); return;
        }
        const q = qs[i]; const shown = q.l.replace(new RegExp(q.key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), "______");
        w.innerHTML = `<div class="mhead"><button class="close" id="quit">✕</button><div class="pbar"><b style="width:${i / qs.length * 100}%;background:linear-gradient(90deg,#8E6BC7,#E9A0B4)"></b></div><span class="small muted">${i + 1}/${qs.length}</span></div>
          <div class="scene"><div class="char">${monkey("estaya", "think", 80)}<span class="nm">Estaya</span></div><div class="bubble"><span class="who">Se me olvidó una palabra…</span><span class="tw">♪ ${esc(shown)} ♪</span></div></div>
          <div class="qcard"><h2 style="font-size:19px">¿Qué palabra falta?</h2><div class="opts" id="o"></div></div>`;
        $("#quit", w).addEventListener("click", () => go("camp", { camp: c.id }));
        q.opts.forEach((op, n) => {
          const b = el("button", { class: "opt" }, `<span class="k">${"ABC"[n]}</span><span>${esc(op)}</span>`);
          b.addEventListener("click", () => {
            const ok = op === q.key; if (ok) { score++; beep(true); } else jingle("lose");
            [...$("#o", w).children].forEach((x, j) => { x.disabled = true; if (q.opts[j] === q.key) x.classList.add("ok"); else if (x === b) x.classList.add("bad"); });
            setMood($(".scene .mk", w), ok ? "party" : "sad");
            $(".qcard", w).insertAdjacentHTML("beforeend", fbBox(ok, `♪ ${q.l} ♪`));
            $(".qcard", w).appendChild(contBtn(() => { i++; paso(); }));
          });
          $("#o", w).appendChild(b);
        });
      };
      paso();
    }
    pantalla(); typewrite($(".bubble .tw", w));
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
    const L = LE().find(x => x.camp === c.id);
    let memoria = 0, momento = 0;
    const w = el("div", { class: "mission" }); m.appendChild(w);
    const subir = (n) => { memoria = Math.min(100, memoria + n); const b = $("#mem b", w); if (b) { b.style.height = memoria + "%"; $("#mem .pct", w).textContent = Math.round(memoria) + "%"; const f = $("#mem", w); f.classList.add("sube"); setTimeout(() => f.classList.remove("sube"), 700); } };
    /* La memoria de Chupaya es el sentido de toda la actividad: él olvida y ella lo
       llena explicándole. Como barra gris de tres píxeles no se veía; ahora es un
       frasco que se llena al lado de él. */
    const barra = () => `<div class="memoria" id="mem"><div class="frasco"><b style="height:${memoria}%"></b><span class="burbujas"></span></div><div class="etq"><span class="lbl">Memoria de Chupaya</span><span class="pct">${Math.round(memoria)}%</span><span class="ayuda">Se llena cuando le explicas bien</span></div></div>`;
    const cabeza = () => `<div class="mhead"><button class="close" id="quit" aria-label="Salir">✕</button><div class="pbar"><b style="width:${(momento / 4) * 100}%;background:linear-gradient(90deg,#2E7D4F,#6FD394)"></b></div><span class="small muted" style="min-width:70px;text-align:right">Paso ${Math.min(momento + 1, 4)}/4</span></div>` + barra();
    const salir = () => { if (confirm("¿Dejar a Chupaya a medias? Se perderá el avance de esta lección.")) go("camp", { camp: c.id }); };
    const dice = (texto, mood, clase) => `<div class="scene"><div class="char">${monkey("chupaya", mood || "think", 84)}<span class="nm">Chupaya</span></div><div class="bubble ${clase || ""}"><span class="who">Chupaya pregunta</span><span class="tw">${esc(texto)}</span>${SAYBTN}</div></div>`;

    function intro() {
      w.innerHTML = `<button class="btn ghost sm" id="back">← ${esc(c.name)}</button>` + barra() + `
        <div class="result" style="margin-top:8px"><div class="chars"><span>${monkey("chupaya", "think", 130)}</span></div>
        <div class="eyebrow">${esc(L.titulo)}</div>
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
      const todas = LE().filter(leccionHecha).length;
      if (todas >= 1) stamp("maestra");
      if (todas === LE().length) stamp("maestra-max");
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

  /* ── PRUEBAS Y MATERIALES DEL COLEGIO ── */
  const ASIGNATURAS = ["Historia", "Science", "Math", "Lenguaje", "English", "Social Studies", "Arte", "Música", "Otra"];
  const pruebas = () => (S.pruebas || []).slice().sort((a, b) => (a.fecha || "").localeCompare(b.fecha || ""));
  const diasHasta = f => { if (!f) return null; const t = new Date(f + "T00:00:00"); if (isNaN(t)) return null; const n = new Date(); n.setHours(0, 0, 0, 0); return Math.round((t - n) / 864e5); };
  const proximaPrueba = () => pruebas().find(p => p.fecha && diasHasta(p.fecha) >= 0) || null;
  const idNuevo = () => "p" + Date.now().toString(36) + Math.floor(Math.random() * 999).toString(36);
  const generarURL = () => {
    if (S.puenteGenerar) return S.puenteGenerar;
    if (/github\.io$/i.test(location.hostname)) return null;
    return window.PUENTE_GENERAR || "/api/generar";
  };

  /* Achica las fotos antes de guardarlas, para que quepan en el aparato */
  function achicarImagen(file, maxLado, calidad) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => {
        const im = new Image();
        im.onload = () => {
          const esc = Math.min(1, maxLado / Math.max(im.width, im.height));
          const cv = document.createElement("canvas");
          cv.width = Math.round(im.width * esc); cv.height = Math.round(im.height * esc);
          cv.getContext("2d").drawImage(im, 0, 0, cv.width, cv.height);
          resolve(cv.toDataURL("image/jpeg", calidad || .62));
        };
        im.onerror = reject; im.src = fr.result;
      };
      fr.onerror = reject; fr.readAsDataURL(file);
    });
  }

  function paqueteDePrueba(p) {
    const mats = (p.materiales || []);
    return {
      asignatura: p.asignatura, titulo: p.titulo, fecha: p.fecha, curso: "5º básico",
      colegio: "Colegio Bradford", idioma: p.asignatura === "Lenguaje" ? "español" : "inglés con pistas en español",
      temas: p.temas || [],
      textos: mats.filter(m => m.tipo === "texto").map(m => m.contenido),
      archivos: mats.filter(m => m.tipo === "archivo").map(m => m.nombre),
      imagenes: mats.filter(m => m.tipo === "imagen").length
    };
  }

  function exportarPaquete(p) {
    const paq = paqueteDePrueba(p);
    const txt = `PAQUETE PARA CLAUDE · MISIÓN AYA
=================================
Asignatura: ${paq.asignatura}
Prueba: ${paq.titulo}
Fecha: ${paq.fecha}
Curso: 5º básico, Colegio Bradford (IB). Idioma: ${paq.idioma}

TEMAS QUE ENTRAN
${(paq.temas.length ? paq.temas : ["(sin especificar)"]).map((t, i) => `${i + 1}. ${t}`).join("\n")}

MATERIAL DE CLASE PEGADO
${paq.textos.length ? paq.textos.join("\n\n---\n\n") : "(no hay texto pegado)"}

ARCHIVOS ADJUNTOS EN LA APP
${paq.archivos.length ? paq.archivos.join("\n") : "(ninguno)"}
Fotos de guías o cuadernos adjuntas: ${paq.imagenes}

QUÉ NECESITO
Genera la expedición nueva completa para Misión Aya, con el formato y los criterios
de DOCUMENTACION.md. No basta con las preguntas: hace falta todo esto.

1. La unidad: selvas con lugar y época reales, bitácora por páginas, misiones con los
   siete tipos de pregunta, tarjetas de memoria y plan de estudio.
2. El hilo de las causas (content-causas.js): hechos en orden real, enlaces de causa a
   consecuencia con su explicación, trampas deliberadas (sucesión sin causa, flecha
   invertida, saltarse pasos) y cierre escrito con rúbrica.
3. El salto a ciegas (content-desafio.js): predicciones ANTES de leer, con opciones que
   sean todas razonables para quien aún no sabe, y la revelación de por qué falla la
   intuición más común.
4. Aquí y ahora (content-transferencia.js): un caso REAL de la vida de Leti por selva
   —su casa, su colegio, Chile— para usar el concepto fuera de la asignatura.
5. Enséñale a Chupaya (content-ensenar.js), fuentes reales para el taller, personajes
   históricos o relevantes para las selfies, y la canción de Estaya.

Respeta los diez criterios pedagógicos del proyecto, sobre todo: producir antes que
reconocer, distractores que sean confusiones reales, y nada de ranking.`;
    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `paquete-${(p.asignatura || "materia").toLowerCase().replace(/\s+/g, "-")}-${p.fecha || "sinfecha"}.txt`;
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast("Paquete descargado. Pásamelo en una conversación.");
  }

  async function generarExpedicion(p, avisar) {
    const base = generarURL();
    if (!base) throw new Error("Falta configurar el puente de generación en Ajustes.");
    avisar("Ordenando el material…");
    const imagenes = (p.materiales || []).filter(m => m.tipo === "imagen").slice(0, 6).map(m => m.contenido);
    avisar("Leyendo las guías y armando la expedición… esto tarda un poco.");
    const r = await fetch(base, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paquete: paqueteDePrueba(p), imagenes }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok || !d.contenido) throw new Error(d.mensaje || d.error || "No se pudo generar la expedición.");
    return d.contenido;
  }

  /* Pestaña de pruebas dentro del panel de Mariana y Francisco */
  function vistaPruebas(w) {
    const lista = pruebas();
    const cont = el("div");
    cont.innerHTML = `<div class="card"><div class="row" style="justify-content:space-between"><div><h3 style="font-size:19px;font-weight:600">Calendario de pruebas</h3><p class="muted small" style="margin:2px 0 0">Agrega una prueba, pega el material de clase y con eso se arma la expedición.</p></div><button class="btn g sm" id="nueva">Agregar prueba</button></div>
      <div class="lista-pruebas">${lista.length ? lista.map(p => { const d = diasHasta(p.fecha); const tono = d === null ? "" : d < 0 ? "pasada" : d <= 2 ? "urgente" : d <= 7 ? "pronto" : ""; const nm = (p.materiales || []).length;
        return `<button class="prueba ${tono} ${S.pruebaAbierta === p.id ? "abierta" : ""}" data-prueba="${p.id}"><div class="dias"><b>${d === null ? "·" : d < 0 ? "—" : d}</b><span>${d === null ? "sin fecha" : d < 0 ? "pasó" : d === 1 ? "día" : "días"}</span></div><div class="info"><b>${esc(p.titulo || "Prueba sin título")}</b><span>${esc(p.asignatura)} · ${esc(p.fecha || "sin fecha")}</span><small>${nm} material${nm === 1 ? "" : "es"} · ${(p.temas || []).length} tema${(p.temas || []).length === 1 ? "" : "s"}${p.expedicion ? " · expedición lista ✓" : ""}</small></div><span class="flecha">${S.pruebaAbierta === p.id ? "▾" : "›"}</span></button>
        ${S.pruebaAbierta === p.id ? `<div class="detalle" id="det-${p.id}"></div>` : ""}`; }).join("") : `<p class="muted" style="margin-top:10px">Todavía no hay pruebas anotadas.</p>`}</div></div>`;
    w.appendChild(cont);
    $("#nueva", cont).addEventListener("click", () => {
      const p = { id: idNuevo(), asignatura: "Historia", titulo: "", fecha: "", temas: [], materiales: [] };
      S.pruebas = [...(S.pruebas || []), p]; S.pruebaAbierta = p.id; save(); go("parent");
    });
    cont.querySelectorAll("[data-prueba]").forEach(b => b.addEventListener("click", () => { S.pruebaAbierta = S.pruebaAbierta === b.dataset.prueba ? null : b.dataset.prueba; save(); go("parent"); }));
    const abierta = lista.find(p => p.id === S.pruebaAbierta);
    if (abierta) pintarDetalle($("#det-" + abierta.id, cont), abierta);
  }

  function pintarDetalle(caja, p) {
    if (!caja) return;
    const mats = p.materiales || [];
    caja.innerHTML = `<div class="campos">
        <label>Asignatura<select id="f-asig">${ASIGNATURAS.map(a => `<option ${a === p.asignatura ? "selected" : ""}>${a}</option>`).join("")}</select></label>
        <label>Fecha de la prueba<input type="date" id="f-fecha" value="${esc(p.fecha || "")}"></label>
      </div>
      <label class="campo">Título o unidad<input id="f-tit" value="${esc(p.titulo || "")}" placeholder="Unidad 3: La expansión europea"></label>
      <label class="campo">Temas que entran, uno por línea<textarea id="f-temas" rows="4" placeholder="Los viajes de exploración europea&#10;Culturas americanas pre-Conquista">${esc((p.temas || []).join("\n"))}</textarea></label>
      <div class="mats">
        <div class="row" style="justify-content:space-between"><b style="font-family:Fredoka;font-size:16px;font-weight:600">Material de clase</b><span class="muted small">${mats.length} adjunto${mats.length === 1 ? "" : "s"}</span></div>
        <label class="campo">Pegar texto del profesor, de la guía o del correo<textarea id="f-texto" rows="4" placeholder="Pega aquí lo que mandó el profesor…"></textarea></label>
        <div class="actions" style="justify-content:flex-start;gap:8px;margin-top:6px">
          <button class="btn ghost sm" id="addTexto">Agregar el texto</button>
          <label class="btn ghost sm" style="cursor:pointer">Adjuntar fotos<input type="file" id="addFoto" accept="image/*" multiple hidden></label>
          <label class="btn ghost sm" style="cursor:pointer">Adjuntar archivos<input type="file" id="addArch" multiple hidden></label>
        </div>
        <div class="adjuntos">${mats.map((m, i) => `<div class="adj ${m.tipo}">${m.tipo === "imagen" ? `<img src="${m.contenido}" alt="">` : `<span class="ic">${m.tipo === "texto" ? "📝" : "📎"}</span>`}<div><b>${esc(m.nombre || (m.tipo === "texto" ? "Texto pegado" : "Archivo"))}</b><small>${m.tipo === "texto" ? esc((m.contenido || "").slice(0, 70)) + "…" : esc(m.peso || "")}</small></div><button class="quitar" data-quitar="${i}" aria-label="Quitar">✕</button></div>`).join("") || `<p class="muted small" style="margin:8px 0 0">Sin material todavía. Pega el texto del profesor o adjunta fotos de la guía.</p>`}</div>
      </div>
      <div class="actions" style="justify-content:space-between;flex-wrap:wrap;gap:8px">
        <button class="btn ghost sm" id="borrar">Borrar esta prueba</button>
        <span style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ghost sm" id="exportar">Exportar para Claude</button><button class="btn sm" id="generar">Generar expedición ✨</button></span>
      </div>
      <div id="genEstado"></div>`;
    const guardar = () => {
      p.asignatura = $("#f-asig", caja).value; p.fecha = $("#f-fecha", caja).value; p.titulo = $("#f-tit", caja).value;
      p.temas = $("#f-temas", caja).value.split("\n").map(t => t.trim()).filter(Boolean); save();
    };
    ["f-asig", "f-fecha", "f-tit", "f-temas"].forEach(id => $("#" + id, caja).addEventListener("change", guardar));
    $("#addTexto", caja).addEventListener("click", () => {
      const t = $("#f-texto", caja).value.trim(); if (!t) return toast("Pega primero el texto.");
      guardar(); p.materiales = [...(p.materiales || []), { tipo: "texto", nombre: "Texto pegado", contenido: t }]; save(); go("parent");
    });
    $("#addFoto", caja).addEventListener("change", async e => {
      guardar(); const fs = [...e.target.files].slice(0, 6);
      for (const f of fs) { try { const d = await achicarImagen(f, 900, .6); p.materiales = [...(p.materiales || []), { tipo: "imagen", nombre: f.name, contenido: d }]; } catch (err) { } }
      try { save(); } catch (err) { toast("Las fotos no cupieron en el aparato."); }
      go("parent");
    });
    $("#addArch", caja).addEventListener("change", async e => {
      guardar();
      for (const f of [...e.target.files].slice(0, 8)) {
        const kb = Math.round(f.size / 1024) + " KB";
        if (/\.(txt|md|csv)$/i.test(f.name)) { const t = await f.text(); p.materiales = [...(p.materiales || []), { tipo: "texto", nombre: f.name, contenido: t.slice(0, 20000) }]; }
        else p.materiales = [...(p.materiales || []), { tipo: "archivo", nombre: f.name, peso: kb }];
      }
      save(); go("parent");
    });
    caja.querySelectorAll("[data-quitar]").forEach(b => b.addEventListener("click", ev => { ev.stopPropagation(); p.materiales.splice(+b.dataset.quitar, 1); save(); go("parent"); }));
    $("#borrar", caja).addEventListener("click", () => { if (!confirm("¿Borrar esta prueba y su material?")) return; S.pruebas = S.pruebas.filter(x => x.id !== p.id); S.pruebaAbierta = null; save(); go("parent"); });
    $("#exportar", caja).addEventListener("click", () => { guardar(); exportarPaquete(p); });
    $("#generar", caja).addEventListener("click", async () => {
      guardar();
      if (!p.titulo || !p.fecha) return toast("Ponle título y fecha a la prueba.");
      if (!(p.materiales || []).length && !(p.temas || []).length) return toast("Agrega al menos los temas o algo de material.");
      const est = $("#genEstado", caja), btn = $("#generar", caja); btn.disabled = true;
      const pinta = t => { est.innerHTML = `<div class="componiendo"><div class="char">${monkey("ovaya", "party", 60)}</div><div><b>Armando la expedición…</b><span>${esc(t)}</span></div></div>`; };
      pinta("Empezando…");
      try {
        const contenido = await generarExpedicion(p, pinta);
        S.unidades = S.unidades || {}; S.unidades[contenido.unit.id] = contenido;
        p.expedicion = contenido.unit.id; S.unidadActiva = contenido.unit.id; save();
        confetti(); jingle("win");
        est.innerHTML = `<div class="componiendo"><div class="char">${monkey("ovaya", "party", 60)}</div><div><b>¡Expedición lista!</b><span>${esc(contenido.unit.title)} · ${contenido.camps.length} selvas. Ya está activa en la selva de Leti.</span></div></div>`;
      } catch (err) {
        btn.disabled = false;
        est.innerHTML = `<div class="voz-problema" style="margin-top:10px"><b>✨ No se pudo generar</b><p>${esc(err.message)}</p><p class="muted small">Mientras tanto, usa "Exportar para Claude" y pásame el archivo en una conversación: lo genero yo y te lo dejo listo.</p></div>`;
      }
    });
  }

  /* ── MEMORIA ENTRE DISPOSITIVOS ── */
  const syncURL = () => {
    if (S.puenteProgreso) return S.puenteProgreso;
    if (/github\.io$/i.test(location.hostname)) return null;
    return window.PUENTE_PROGRESO || "/api/progreso";
  };
  function nuevoCodigo() { const L = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; return Array.from({ length: 6 }, () => L[Math.floor(Math.random() * L.length)]).join(""); }
  const mejorDone = (a, b) => { if (!a) return b; if (!b) return a; return { stars: Math.max(a.stars || 0, b.stars || 0), errors: Math.min(a.errors ?? 99, b.errors ?? 99) }; };

  /* Une dos avances sin perder nada de ninguno de los dos aparatos */
  function fusionar(a, b) {
    if (!a) return b; if (!b) return a;
    const nuevo = (a.actualizado || "") >= (b.actualizado || "") ? a : b;
    const r = Object.assign({}, b, a);
    r.xp = Math.max(a.xp || 0, b.xp || 0);
    r.streak = ((a.streak || {}).last || "") >= ((b.streak || {}).last || "") ? a.streak : b.streak;
    r.days = [...new Set([...(a.days || []), ...(b.days || [])])];
    r.stamps = [...new Set([...(a.stamps || []), ...(b.stamps || [])])];
    r.done = {}; for (const k of new Set([...Object.keys(a.done || {}), ...Object.keys(b.done || {})])) r.done[k] = mejorDone((a.done || {})[k], (b.done || {})[k]);
    r.selfies = Object.assign({}, b.selfies, a.selfies);
    r.musica = Object.assign({}, b.musica, a.musica);
    r.pistas = ((a.pistas || []).length >= (b.pistas || []).length) ? a.pistas : b.pistas;
    r.stats = {}; for (const k of new Set([...Object.keys(a.stats || {}), ...Object.keys(b.stats || {})])) { const x = (a.stats || {})[k] || { ok: 0, n: 0 }, y = (b.stats || {})[k] || { ok: 0, n: 0 }; r.stats[k] = { ok: Math.max(x.ok, y.ok), n: Math.max(x.n, y.n) }; }
    r.wrong = Object.assign({}, b.wrong, a.wrong);
    r.games = {}; for (const k of new Set([...Object.keys(a.games || {}), ...Object.keys(b.games || {})])) { const x = (a.games || {})[k], y = (b.games || {})[k]; r.games[k] = /^memo-/.test(k) ? Math.min(x ?? 99, y ?? 99) : Math.max(x || 0, y || 0); }
    r.fuentes = {}; for (const k of new Set([...Object.keys(a.fuentes || {}), ...Object.keys(b.fuentes || {})])) { const x = (a.fuentes || {})[k] || {}, y = (b.fuentes || {})[k] || {}; r.fuentes[k] = { estrellas: Math.max(x.estrellas || 0, y.estrellas || 0), pct: Math.max(x.pct || 0, y.pct || 0) }; }
    r.lecciones = {}; for (const k of new Set([...Object.keys(a.lecciones || {}), ...Object.keys(b.lecciones || {})])) { const x = (a.lecciones || {})[k] || {}, y = (b.lecciones || {})[k] || {}; r.lecciones[k] = { pct: Math.max(x.pct || 0, y.pct || 0), estrellas: Math.max(x.estrellas || 0, y.estrellas || 0) }; }
    r.boss = ((a.boss || {}).pct || 0) >= ((b.boss || {}).pct || 0) ? a.boss : b.boss;
    r.daily = ((a.daily || {}).date || "") >= ((b.daily || {}).date || "") ? a.daily : b.daily;
    ["name", "pin", "sound", "puente", "puenteProgreso", "codigo", "welcomed", "bossLast", "offsets", "himno", "factIdx"].forEach(k => { if (nuevo[k] !== undefined) r[k] = nuevo[k]; });
    r.actualizado = new Date().toISOString();
    return r;
  }

  let syncTimer = null, sincronizando = false, ultimoSync = null;
  function marcarSync(txt, clase) { ultimoSync = txt ? { txt, clase } : null; const n = $("#estadoSync"); if (n) n.innerHTML = txt ? `<span class="sync-estado ${clase || ""}">${esc(txt)}</span>` : ""; }
  async function subirProgreso(silencioso) {
    const base = syncURL(); if (!base || !S.codigo) return;
    try {
      S.actualizado = new Date().toISOString();
      const r = await fetch(base, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ codigo: S.codigo, estado: S }) });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "no se pudo guardar");
      if (!silencioso) marcarSync("Guardado en la nube ✓", "ok");
    } catch (e) { if (!silencioso) marcarSync("No se pudo guardar: " + e.message, "mal"); }
  }
  async function bajarProgreso(silencioso) {
    const base = syncURL(); if (!base || !S.codigo) return false;
    try {
      const r = await fetch(`${base}?codigo=${encodeURIComponent(S.codigo)}`);
      const d = await r.json();
      if (d && d.estado) { S = fusionar(S, d.estado); save(); if (!silencioso) marcarSync("Avance recuperado ✓", "ok"); return true; }
      if (!silencioso) marcarSync("Todavía no hay nada guardado con ese código.", "");
    } catch (e) { if (!silencioso) marcarSync("No se pudo leer: " + e.message, "mal"); }
    return false;
  }
  async function sincronizar(silencioso) {
    if (sincronizando) return; sincronizando = true;
    try { await bajarProgreso(silencioso); await subirProgreso(silencioso); } finally { sincronizando = false; }
  }
  function programarSync() { if (!syncURL() || !S.codigo) return; clearTimeout(syncTimer); syncTimer = setTimeout(() => subirProgreso(true), 6000); }

  /* Copia de seguridad en archivo, sin necesitar internet ni cuentas */
  function exportarProgreso() {
    S.actualizado = new Date().toISOString();
    const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `mision-aya-${todayKey()}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast("Copia guardada en Descargas.");
  }
  function importarProgreso(file, listo) {
    const fr = new FileReader();
    fr.onload = () => { try { const d = JSON.parse(fr.result); S = fusionar(S, d); save(); toast("Avance restaurado."); listo && listo(); } catch (e) { toast("Ese archivo no se pudo leer."); } };
    fr.readAsText(file);
  }

  /* ── HIMNO DE LOS AYAS ── */
  const HIMNO = { src: "assets/musica/himno.mp3", titulo: "LOS AYA", dur: 61 };
  const SIN_MUSICA = ["mission", "song", "flash", "game", "memo", "boss", "daily", "ensenar", "fuente", "review"];
  let himno = null;
  function himnoInit() {
    if (himno) return himno;
    himno = new Audio(HIMNO.src); himno.loop = true; himno.volume = .38; himno.preload = "metadata";
    himno.addEventListener("play", renderTop); himno.addEventListener("pause", renderTop);
    himno.addEventListener("error", () => { himno.__roto = true; });
    return himno;
  }
  function himnoToggle() {
    const a = himnoInit();
    if (a.paused) { a.play().then(() => { S.himno = true; a.__auto = false; save(); }).catch(() => toast("Toca otra vez para escuchar el himno.")); }
    else { a.pause(); S.himno = false; a.__auto = false; save(); }
  }
  function himnoSegunVista(v) {
    if (!himno || himno.__roto) return;
    if (SIN_MUSICA.includes(v)) { if (!himno.paused) { himno.pause(); himno.__auto = true; } }
    else if (himno.paused && himno.__auto && S.himno) { himno.__auto = false; himno.play().catch(() => { }); }
  }
  document.addEventListener("click", e => { if (e.target.closest("[data-himno]")) himnoToggle(); });

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
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600;margin-bottom:8px">Línea de tiempo de la unidad</h3><div class="tline" id="tl">${lugares.map(l => `<button class="tev ${abiertos.includes(l.camp) ? "" : "gris"}" data-id="${l.id}"><span class="n">${lugares.indexOf(l) + 1}</span><b>${l.anio < 0 ? Math.abs(l.anio) + " a.C." : l.anio}</b><span>${esc(l.n)}</span></button>`).join("")}</div></div>`;
    const pines = $("#pines", w);
    lugares.forEach(l => {
      const n = lugares.indexOf(l) + 1;
      const b = el("button", { class: `pin ${abiertos.includes(l.camp) ? "" : "gris"}`, style: `left:${((l.lon + 180) / 360) * 100}%;top:${((90 - l.lat) / 180) * 100}%`, "aria-label": `${n}. ${l.n}`, "data-id": l.id }, `<span class="n">${n}</span>`);
      pines.appendChild(b);
    });
    const mostrar = id => {
      const l = LUGARES.find(x => x.id === id); const c = C.camps.find(x => x.id === l.camp);
      /* Esta vista existe para unir dónde y cuándo: al elegir en el mapa, la línea de
         tiempo se marca y se desplaza sola, y al revés. Antes eran dos listas sueltas. */
      pines.querySelectorAll(".pin").forEach(p => p.classList.toggle("sel", p.dataset.id === id));
      const tl = $("#tl", w);
      if (tl) {
        let elegido = null;
        tl.querySelectorAll(".tev").forEach(t => { const esta = t.dataset.id === id; t.classList.toggle("sel", esta); if (esta) elegido = t; });
        /* scrollIntoView aquí lo cancela el desplazamiento de la ficha que viene después,
           así que la tira se mueve a mano. */
        if (elegido) {
          const destino = Math.max(0, elegido.offsetLeft - (tl.clientWidth - elegido.offsetWidth) / 2);
          /* El desplazamiento suave lo cancela el cambio de la ficha que viene justo
             después, así que se asigna directo. */
          tl.scrollLeft = destino;
        }
      }
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
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600;margin-bottom:4px">Dónde buscar</h3><p class="muted small" style="margin:0 0 10px">Los ocho lugares están en el Himalaya de verdad. Cada pista tacha uno.</p>
        <div class="himalaya" id="hima"><img class="capa" src="assets/mapa/himalaya.jpg" alt="Imagen satelital del Himalaya">
          ${CANDIDATOS.map(c => { const fuera = descartados.includes(c.id); const es = encontrada && !fuera;
            const x = ((c.lon - LIMITES_HIMALAYA.oeste) / (LIMITES_HIMALAYA.este - LIMITES_HIMALAYA.oeste)) * 100;
            const y = ((LIMITES_HIMALAYA.norte - c.lat) / (LIMITES_HIMALAYA.norte - LIMITES_HIMALAYA.sur)) * 100;
            return `<button class="sitio r-${LADO_ROTULO[c.id] || "abajo"} ${fuera ? "fuera" : ""} ${es ? "casa" : ""}" data-sitio="${c.id}" style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%" aria-label="${esc(c.n)}"><span class="punto">${fuera ? "✕" : es ? "★" : ""}</span><span class="rotulo">${esc(c.n)}</span></button>`; }).join("")}
          <span class="credito">Imagen: NASA</span>
        </div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600;margin-bottom:4px">Los ocho lugares posibles</h3><p class="muted small" style="margin:0 0 10px">Todos existen de verdad. Tócalos para verlos en Google Earth.</p>
        <div class="candidatos">${CANDIDATOS.map(c => { const fuera = descartados.includes(c.id); const es = encontrada && !fuera; return `<div class="cand ${fuera ? "fuera" : ""} ${es ? "casa" : ""}" data-cand="${c.id}"><div class="cab"><b>${esc(c.n)}</b><span>${esc(c.pais)} · ${esc(c.alt)}</span></div><p>${esc(c.dato)}</p><a class="btn ghost sm" href="${earthURL(c.lat, c.lon)}" target="_blank" rel="noopener">Google Earth 🌎</a>${fuera ? `<span class="sello-fuera">Descartado</span>` : es ? `<span class="sello-casa">¡Es aquí!</span>` : ""}</div>`; }).join("")}</div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600;margin-bottom:4px">La ruta del año</h3><p class="muted small" style="margin:0 0 10px">Cada expedición trae más pistas. Los Ayas no pueden volver a casa con una sola asignatura.</p>
        <div class="exped">${EXPEDICIONES.map(e => `<div class="exp ${e.estado}"><span class="ic">${e.icono}</span><div><b>${esc(e.asignatura)}</b><span>${esc(e.nombre)}</span><small>${esc(e.nota)}</small></div><span class="est">${e.estado === "activa" ? "En curso" : "Próxima"}</span></div>`).join("")}</div></div>`;
    m.appendChild(w);

    /* La imagen ya es el recorte exacto del Himalaya, así que los lugares se colocan
       con una regla de tres sobre sus límites. Solo queda enlazar cada punto con su
       ficha de más abajo. */
    (function enlazarSitios() {
      const caja = $("#hima", w); if (!caja) return;
      caja.addEventListener("click", e => {
        const b = e.target.closest(".sitio"); if (!b) return;
        const tarjeta = w.querySelector(`.cand[data-cand="${b.dataset.sitio}"]`);
        if (tarjeta) { tarjeta.scrollIntoView({ block: "center", behavior: "smooth" }); tarjeta.classList.add("resalta"); setTimeout(() => tarjeta.classList.remove("resalta"), 1400); }
        beep(true);
      });
    })();
 typewrite($(".bubble .tw", w));
    $("#tocar", w).addEventListener("click", () => { if (n === 0) return toast("Todavía no recuerdan ninguna nota."); sonarMelodia(n); });
  }

  /* ── TALLER DE FUENTES ── */
  const FMT = ["Escrita", "Visual", "Arqueológica", "Audiovisual"];
  const ORG = ["Primaria", "Secundaria"];
  const PRO = ["Informar", "Comunicar", "Dar su opinión", "Convencer"];
  const PASOS = ["Formato", "Origen", "Propósito", "Idea principal", "Argumento"];
  const fuenteHecha = f => !!(S.fuentes && S.fuentes[f.id]);

  function fuentes(m) {
    const hechas = FU().filter(fuenteHecha).length;
    const w = el("div");
    w.innerHTML = `<button class="btn ghost sm" data-go="home">← Selva</button>
      <div class="camphead" style="margin-top:12px"><div class="icon" style="background:#8E6BC7">🔍</div><div><div class="eyebrow">Taller de fuentes</div><h2 style="font-size:26px;font-weight:600">La carpa del detective</h2><div class="muted small">${hechas} de ${FU().length} fuentes analizadas</div></div></div>
      <div class="today card"><div class="char">${monkey("estaya", "think", 76)}</div><div class="bubble"><span class="who">Estaya</span><span class="tw">Aquí guardamos todo lo que encontramos en la selva: mapas, diarios y cartas de verdad. Analiza cada fuente con los cuatro pasos de tu clase y después arma tu argumento.</span>${SAYBTN}</div></div>
      <div class="guiacard"><div class="eyebrow">Los pasos de tu guía</div><ol class="guialist">${PASOS.map(p => `<li>${p}</li>`).join("")}</ol></div>
      <div class="steps" id="lst"></div>`;
    const lst = $("#lst", w);
    FU().forEach(f => {
      const c = C.camps.find(x => x.id === f.camp); const un = campUnlocked(c); const hecha = fuenteHecha(f);
      const b = el("button", { class: `step ${hecha ? "done" : ""} ${un ? "" : "locked"}` });
      /* En un taller de fuentes hay que VER la fuente. Las visuales muestran su propia
         imagen; las escritas, un trocito del documento real en un papelito. Un emoji
         genérico no dice nada y no da ganas de entrar. */
      const mini = !un ? `<div class="ic">🔒</div>`
        : f.img ? `<div class="miniatura"><img src="${f.img}" alt="" loading="lazy">${hecha ? `<span class="visto">✓</span>` : ""}</div>`
        : `<div class="miniatura papel"><span class="recorte">${esc((f.texto || "").replace(/[«»]/g, "").slice(0, 46))}</span>${hecha ? `<span class="visto">✓</span>` : ""}</div>`;
      b.innerHTML = mini + `<div><b>${esc(f.titulo)}</b><span class="sub">${esc(f.ficha)}</span><span class="sub" style="color:${c.color};font-weight:800">${c.icon} ${esc(c.name)}</span></div><div class="right">${hecha ? "★".repeat(S.fuentes[f.id].estrellas) : un ? "→" : ""}</div>`;
      b.addEventListener("click", () => un ? go("fuente", { id: f.id }) : toast(`Esta fuente se abre cuando llegues a ${c.name}.`));
      lst.appendChild(b);
    });
    m.appendChild(w); typewrite($(".bubble .tw", w));
  }

  function fuente(m) {
    const f = FU().find(x => x.id === ctx.id); const c = C.camps.find(x => x.id === f.camp);
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
      const listas = FU().filter(fuenteHecha).length;
      if (listas >= 3) stamp("detective");
      if (listas === FU().length) stamp("detective-max");
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
        <div class="actions juzgar" id="juzgar" hidden style="justify-content:center;margin-top:16px"><button class="btn ghost" id="no">🔁 Repasar después</button><button class="btn g" id="yes">✅ ¡La sé!</button></div>
        <div class="avisoflip" id="avisoflip">Piensa la respuesta y toca la tarjeta</div>`;
      /* Los botones de autoevaluación solo aparecen después de dar vuelta la tarjeta:
         decir «la sé» sin haber visto la respuesta no es evaluarse, es adivinar. */
      $("#fc", w).addEventListener("click", e => {
        const vuelta = e.currentTarget.classList.toggle("flip");
        $("#juzgar", w).hidden = !vuelta;
        $("#avisoflip", w).hidden = vuelta;
        if (vuelta) beep(true);
      });
      $("#quit", w).addEventListener("click", () => go("camp", { camp: c.id }));
      $("#yes", w).addEventListener("click", () => { know++; i++; draw(); });
      $("#no", w).addEventListener("click", () => { cards.push(cards[i]); i++; draw(); });
    };
    draw();
  }

  /* ── RETO DEL DÍA ── */
  function daily(m) {
    const pool = []; C.camps.filter(campVisitada).forEach(c => c.missions.forEach(ms => ms.questions.forEach((q, i) => { if (q.t !== "write") pool.push({ q, key: `${ms.id}:${i}`, camp: c }); })));
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
    if (!keys.length) { w.innerHTML = `<div class="result">${monkey("chupaya", "party", 120)}<h2>¡Nada pendiente!</h2><p class="muted">Aquí aparecen las preguntas que fallaste, para que las domines. Por ahora no hay ninguna. ¡Sigue explorando!</p><div class="actions" style="justify-content:center"><button class="btn g" data-go="home">Ir a la selva</button></div></div>`; }
    if (keys.length) w.innerHTML = `<div class="result">${monkey("chupaya", "think", 110)}<h2>Repaso de errores</h2><p class="muted">Tienes <b>${keys.length}</b> pregunta${keys.length === 1 ? "" : "s"} para dominar. Cada una que respondas bien dos veces desaparece de aquí.</p><div class="actions" style="justify-content:center"><button class="btn" id="start">Repasar ahora</button></div></div>
      <div class="card" style="margin-top:12px"><div class="eyebrow">Pendientes</div><div class="wrongs" style="margin-top:8px">${keys.slice(0, 12).map(k => `<div>${esc(S.wrong[k].q)}</div>`).join("")}${keys.length > 12 ? `<div class="muted small">…y ${keys.length - 12} más</div>` : ""}</div></div>`;
    /* Repaso solo repasaba errores. A días de la prueba hace falta poder elegir un
       tema y practicarlo, aunque no lo hayas fallado nunca. */
    const elegidas = new Set(C.camps.filter(c => campDone(c) > 0).map(c => c.id));
    if (!elegidas.size) C.camps.forEach(c => elegidas.add(c.id));
    const medida = el("div", { class: "card ala-medida" });
    medida.innerHTML = `<div class="eyebrow">Repaso a la medida</div>
      <h3 style="font-size:19px;font-weight:600;margin-bottom:2px">Elige qué quieres practicar</h3>
      <p class="muted small" style="margin:0 0 10px">No hace falta haberlo fallado: puedes repasar cualquier selva cuando quieras.</p>
      <div class="temas">${C.camps.map(c => `<button class="tema ${elegidas.has(c.id) ? "on" : ""}" data-camp="${c.id}"><span class="ic" style="background:${c.color}">${c.icon}</span><span><b>${esc(c.name)}</b><small>${esc(c.topic)}</small></span><span class="tick">✓</span></button>`).join("")}</div>
      <div class="actions"><span class="muted small" id="cuantas"></span><button class="btn g" id="practicar">Practicar →</button></div>`;
    w.appendChild(medida);
    const contar = () => {
      const n = C.camps.filter(c => elegidas.has(c.id)).reduce((a, c) => a + c.missions.reduce((b, ms) => b + ms.questions.filter(q => q.t !== "write").length, 0), 0);
      $("#cuantas", medida).textContent = elegidas.size ? `${Math.min(10, n)} preguntas de ${elegidas.size} selva${elegidas.size === 1 ? "" : "s"}` : "Elige al menos una selva";
      $("#practicar", medida).disabled = !elegidas.size;
    };
    contar();
    $(".temas", medida).addEventListener("click", e => {
      const b = e.target.closest(".tema"); if (!b) return;
      const id = b.dataset.camp;
      elegidas.has(id) ? elegidas.delete(id) : elegidas.add(id);
      b.classList.toggle("on", elegidas.has(id)); beep(true); contar();
    });
    $("#practicar", medida).addEventListener("click", () => {
      const pool = [];
      C.camps.filter(c => elegidas.has(c.id)).forEach(c => c.missions.forEach(ms => ms.questions.forEach((q, i) => { if (q.t !== "write") pool.push({ q, key: ms.id + ":" + i, camp: c }); })));
      if (!pool.length) return toast("Esas selvas todavía no tienen preguntas.");
      const qs = shuffle(pool).slice(0, 10);
      m.innerHTML = "";
      runQuiz(m, { title: "Repaso a la medida", char: "ovaya", story: "Tú eliges qué practicar. ¡Vamos con estas!", topic: "Repaso", camp: qs[0].camp, questions: qs, quit: () => go("review"),
        onDone: errors => { const xp = 20 + (10 - errors) * 3; addXP(xp); save(); return { stars: stars(errors), xp, back: () => go("review") }; } });
    });

    m.appendChild(w);
    const btnStart = $("#start", w);
    if (btnStart) btnStart.addEventListener("click", () => {
      m.innerHTML = ""; const qs = [];
      shuffle(keys).slice(0, 10).forEach(k => { const [mid, idx] = k.split(":"); C.camps.forEach(c => c.missions.forEach(ms => { if (ms.id === mid) qs.push({ q: ms.questions[+idx], key: k, camp: c }); })); });
      runQuiz(m, { title: "Rescate de errores", char: "chupaya", story: "Estas son las preguntas donde me perdí contigo. ¡Esta vez las encontramos!", topic: "Repaso", camp: qs[0].camp, questions: qs, quit: () => go("review"), onDone: errors => { const xp = 20 + (qs.length - errors) * 4; addXP(xp); save(); return { xp, stars: stars(errors), back: () => go("review") }; } });
    });
  }

  /* ── PASAPORTE ── */
  function passport(m) {
    const ST = [["first", "🧭", "Primera misión"], ...C.camps.map(c => [c.id, c.icon, c.name]), ["boss", "🏔️", "Llegaron a casa"], ["streak3", "🔥", "3 días seguidos"], ["daily5", "🎲", "Reto del día perfecto"], ["maestra", "🧠", "Le enseñaste a Chupaya"], ["maestra-max", "🎓", "Maestra de Chupaya"], ["detective", "🔍", "Detective de fuentes"], ["detective-max", "📜", "Todas las fuentes"], ...C.camps.map(c => ["flash-" + c.id, "🃏", "Tarjetas " + c.n]), ...C.camps.map(c => ["liana-" + c.id, "🐒", "Lianas " + c.n]), ...C.camps.map(c => ["memo-" + c.id, "🎵", "Memorice " + c.n])];
    /* Veinte círculos vacíos iguales no invitan a nada. Cada sello muestra su símbolo
       en silueta y dice cómo se consigue: es la diferencia entre un hueco y una meta. */
    const comoSeGana = id => {
      if (id === "first") return "Completa tu primera misión";
      if (id === "boss") return "Supera el gran salto";
      if (id === "streak3") return "Estudia tres días seguidos";
      if (id === "daily5") return "Acierta el reto del día completo";
      if (id === "maestra") return "Explícale una lección a Chupaya";
      if (id === "maestra-max") return "Explícaselas todas";
      if (id === "detective") return "Analiza una fuente entera";
      if (id === "detective-max") return "Analiza las ocho fuentes";
      if (id.startsWith("flash-")) return "Repasa todas las tarjetas de esa selva";
      if (id.startsWith("liana-")) return "Cruza la selva saltando lianas";
      if (id.startsWith("memo-")) return "Junta las piezas de la nave";
      if (id.startsWith("causas-")) return "Explica la causa completa";
      if (id.startsWith("aqui-")) return "Lleva lo aprendido a tu propia vida";
      return "Completa todas las misiones de esa selva";
    };
    if (S.streak.count >= 3) stamp("streak3");
    const dn = ["L", "M", "X", "J", "V", "S", "D"]; const now = new Date(); const mon = new Date(now); mon.setDate(now.getDate() - ((now.getDay() + 6) % 7)); mon.setHours(0, 0, 0, 0);
    const week = [...Array(7)].map((_, i) => { const d = new Date(mon); d.setDate(mon.getDate() + i); const k = localKey(d); return `<span class="${S.days.includes(k) ? "d" : ""} ${k === todayKey() ? "t" : ""}">${dn[i]}</span>`; }).join("");
    const w = el("div");
    w.innerHTML = `<div class="card"><div class="row"><div class="avatar" style="width:72px;height:72px;border-radius:24px"><img src="assets/chars/ovaya.png" alt="Ovaya"></div><div><h2 style="font-size:26px;font-weight:600">Ovaya, explorador nivel ${level()}</h2><div class="muted">${S.xp} XP · ${S.streak.count} día${S.streak.count === 1 ? "" : "s"} seguidos 🔥 · ${doneMissions()}/${totalMissions} misiones</div></div></div>
      <div class="bars" style="margin-top:10px"><div class="r"><span>Nivel ${level()}</span><div class="bar"><b style="width:${((S.xp % 250) / 250) * 100}%;background:var(--jungle)"></b></div><span class="n">${S.xp % 250}/250</span></div></div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600;margin-bottom:8px">Esta semana</h3><div class="week">${week}</div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600;margin-bottom:4px">Sellos de cada selva</h3><p class="muted small" style="margin:0 0 12px">${ST.filter(([id]) => S.stamps.includes(id)).length} de ${ST.length} conseguidos. Toca uno para ver cómo se gana.</p><div class="stamps">${ST.map(([id, ic, t]) => { const ok = S.stamps.includes(id);
        return `<div class="stamp ${ok ? "got" : ""}" title="${ok ? "Conseguido" : esc(comoSeGana(id))}"><div><span class="big">${ic}</span><span class="t">${esc(t)}</span>${ok ? "" : `<span class="como">${esc(comoSeGana(id))}</span>`}</div></div>`; }).join("")}</div></div>
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
    if (!parentOK) { const p = el("div", { class: "clave card" }); p.innerHTML = `<div style="font-size:40px">🔒</div><h2 style="font-size:22px">Panel de Mariana y Francisco</h2><p class="muted small">Escribe el PIN (al inicio es 1234).</p><input id="pin" inputmode="numeric" maxlength="6" autocomplete="off" aria-label="PIN"><button class="btn g" id="ok">Entrar</button>`; m.appendChild(p); const tryPin = () => { if ($("#pin", p).value === S.pin) { parentOK = true; render(); } else { $("#pin", p).value = ""; toast("PIN incorrecto"); } }; $("#ok", p).addEventListener("click", tryPin); $("#pin", p).addEventListener("keydown", e => { if (e.key === "Enter") tryPin(); }); $("#pin", p).focus(); return; }
    const topics = C.camps.map(c => { const s = S.stats[c.topic] || { ok: 0, n: 0 }; return { c, s, pct: s.n ? Math.round(s.ok / s.n * 100) : null }; });
    const totalN = topics.reduce((a, t) => a + t.s.n, 0), totalOK = topics.reduce((a, t) => a + t.s.ok, 0);
    const wrong = Object.values(S.wrong);
    const w = el("div");
    w.innerHTML = `<div class="row" style="justify-content:space-between"><h2 style="font-size:26px;font-weight:600">Panel de Mariana y Francisco</h2><button class="btn ghost sm" id="lock">Cerrar 🔒</button></div>
      <div class="subtabs">${[["progreso", "📊", "Progreso"], ["pruebas", "📅", "Pruebas"], ["ajustes", "⚙️", "Ajustes"]].map(([k, i, n]) => `<button class="subtab ${(S.panelTab || "progreso") === k ? "on" : ""}" data-tab="${k}">${i} ${n}</button>`).join("")}</div>
      <div id="tabProgreso" ${(S.panelTab || "progreso") !== "progreso" ? "hidden" : ""}>
      <div class="kpi" style="margin-top:12px"><div><b>${doneMissions()}/${totalMissions}</b><small>misiones completadas</small></div><div><b>${totalN ? Math.round(totalOK / totalN * 100) : 0}%</b><small>aciertos (${totalN} respuestas)</small></div><div><b>${S.streak.count}</b><small>días seguidos</small></div><div><b>${S.boss ? S.boss.pct + "%" : "—"}</b><small>mejor simulacro</small></div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600">Aciertos por tema de la prueba</h3><div class="bars" style="margin-top:6px">${topics.map(t => `<div class="r"><span>${t.c.n}. ${esc(t.c.topic)}</span><div class="bar"><b style="width:${t.pct || 0}%;background:${t.pct == null ? "#ccc" : t.pct >= 80 ? "var(--ok)" : t.pct >= 60 ? "var(--gold)" : "var(--coral)"}"></b></div><span class="n">${t.pct == null ? "sin datos" : t.pct + "%"}</span></div>`).join("")}</div></div>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600">Para reforzar (${wrong.length})</h3><p class="muted small" style="margin:4px 0 10px">Preguntas falladas que siguen pendientes. Desaparecen cuando se responden bien dos veces en «Repaso».</p><div class="wrongs">${wrong.length ? wrong.map(x => `<div>${esc(x.q)}</div>`).join("") : "<div class='muted' style='border-color:var(--ok)'>Nada pendiente por ahora.</div>"}</div></div>
      </div>
      <div id="tabPruebas" ${(S.panelTab || "progreso") !== "pruebas" ? "hidden" : ""}></div>
      <div id="tabAjustes" ${(S.panelTab || "progreso") !== "ajustes" ? "hidden" : ""}>
      <div class="card" style="margin-top:14px"><h3 style="font-size:18px;font-weight:600">Ajustes</h3>
                <div class="field"><label for="np">Cambiar PIN</label><input id="np" inputmode="numeric" maxlength="6" placeholder="Nuevo PIN (4 a 6 números)"></div>
        <div class="field"><label style="font-weight:800;font-size:14px">Memoria entre dispositivos</label>
          <div class="sync-caja">
            <span class="muted small">Código de Leti. Escribe el mismo en todos los aparatos.</span>
            <div class="row" style="gap:8px;margin-top:6px"><input id="codigoIn" class="codigo-in" value="${esc(S.codigo || "")}" placeholder="ABC123" maxlength="12" autocapitalize="characters" spellcheck="false"><button class="btn ghost sm" id="genCodigo">Generar uno</button></div>
            <p class="muted small" style="margin:8px 0">En el primer aparato genera uno. En los demás, escribe ese mismo código aquí. El avance se une solo, sin perder nada de ninguno.</p>
            <div class="actions" style="justify-content:flex-start;gap:8px;margin:0"><button class="btn g sm" id="sincro">Sincronizar ahora</button><button class="btn y sm" id="enlace">Copiar enlace para otro aparato</button><button class="btn ghost sm" id="exportar">Guardar copia</button><label class="btn ghost sm" style="cursor:pointer">Restaurar copia<input type="file" id="importar" accept="application/json" hidden></label></div>
            <div id="estadoSync">${ultimoSync ? `<span class="sync-estado ${ultimoSync.clase || ""}">${esc(ultimoSync.txt)}</span>` : ""}</div></div></div>
        <div class="field"><label for="pg">Generador de expediciones (dirección de Netlify)</label><input id="pg" value="${esc(S.puenteGenerar || "")}" placeholder="https://tu-sitio.netlify.app/api/generar"><small class="muted">Sin esto, exporta el paquete y yo genero la expedición.</small></div>
        <div class="field"><label for="pu">Memoria en la nube (dirección de Netlify)</label><input id="pp" value="${esc(S.puenteProgreso || "")}" placeholder="https://tu-sitio.netlify.app/api/progreso"><small class="muted">Sin esto, la copia en archivo funciona igual.</small></div>
        <div class="field"><label for="pu">Puente de Suno (para crear canciones automáticamente)</label><input id="pu" value="${esc(S.puente || "")}" placeholder="https://tu-sitio.netlify.app/api/cancion"><small class="muted">Déjalo vacío si la app vive en el mismo Netlify.</small></div>
        <div class="field"><label style="font-weight:800;font-size:14px">Micrófono</label><button class="btn ghost sm" id="probarMic" style="justify-self:start">Probar micrófono 🎤</button><div id="micres"></div></div>
        <div class="field"><label><input type="checkbox" id="snd" ${S.sound ? "checked" : ""} style="width:auto;margin-right:8px">Sonidos activados</label></div>
        <div class="actions" style="justify-content:flex-start"><button class="btn g sm" id="saveS">Guardar ajustes</button><button class="btn ghost sm" id="reset">Reiniciar todo el progreso</button></div>
        </div></div>`;
    m.appendChild(w);
    w.querySelectorAll("[data-tab]").forEach(b => b.addEventListener("click", () => { S.panelTab = b.dataset.tab; save(); go("parent"); }));
    if ((S.panelTab || "progreso") === "pruebas") vistaPruebas($("#tabPruebas", w));
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
    $("#genCodigo", w).addEventListener("click", () => { if (S.codigo && !confirm("¿Generar un código nuevo? Tendrás que escribirlo también en los otros aparatos.")) return; S.codigo = nuevoCodigo(); save(); $("#codigoIn", w).value = S.codigo; marcarSync("Código creado: " + S.codigo + ". Escríbelo igual en los otros aparatos.", "ok"); });
    $("#codigoIn", w).addEventListener("change", async e => {
      const c = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
      e.target.value = c;
      if (c && c.length < 4) return marcarSync("El código necesita al menos 4 caracteres.", "mal");
      S.codigo = c || null; save();
      if (!c) return marcarSync("", "");
      if (!syncURL()) return marcarSync("Código guardado. Para unir aparatos falta la dirección de la memoria en la nube, más abajo.", "");
      marcarSync("Buscando el avance de ese código…", "");
      await sincronizar(false); go("parent");
    });
    $("#enlace", w).addEventListener("click", () => {
      if (!S.codigo) return marcarSync("Primero crea o escribe un código.", "mal");
      const u = new URL(location.href.split("?")[0].split("#")[0]);
      u.searchParams.set("codigo", S.codigo);
      if (S.puenteProgreso || (!/github\.io$/i.test(location.hostname) && window.PUENTE_PROGRESO)) u.searchParams.set("sync", S.puenteProgreso || new URL(window.PUENTE_PROGRESO, location.origin).href);
      if (S.puente) u.searchParams.set("musica", S.puente);
      if (S.puenteGenerar) u.searchParams.set("generar", S.puenteGenerar);
      copiar(u.toString(), "Enlace copiado. Ábrelo en el otro aparato y queda todo configurado.");
    });
    $("#sincro", w).addEventListener("click", async () => { if (!S.codigo) return marcarSync("Primero crea un código.", "mal"); if (!syncURL()) return marcarSync("Falta la dirección de la memoria en la nube.", "mal"); marcarSync("Sincronizando…", ""); await sincronizar(false); render(); });
    $("#exportar", w).addEventListener("click", exportarProgreso);
    $("#importar", w).addEventListener("change", e => { const f = e.target.files[0]; if (f) importarProgreso(f, () => go("parent")); });
    $("#saveS", w).addEventListener("click", () => { const pg = $("#pg", w).value.trim(); S.puenteGenerar = pg || null; const pp = $("#pp", w).value.trim(); S.puenteProgreso = pp || null; const pu = $("#pu", w).value.trim(); S.puente = pu || null; const np = $("#np", w).value.trim(); if (np) { if (/^\d{4,6}$/.test(np)) S.pin = np; else return toast("El PIN debe tener 4 a 6 números."); } S.sound = $("#snd", w).checked; save(); toast("Ajustes guardados"); render(); });
    $("#reset", w).addEventListener("click", () => { if (confirm("¿Borrar TODO el progreso de la Misión Aya? Esta acción no se puede deshacer.")) { const pin = S.pin; S = Object.assign({}, DEF, { pin }); save(); toast("Progreso reiniciado"); go("home"); } });
  }


  /* ── EL HILO DE LAS CAUSAS ── */
  const causasDe = campId => material("causas", "CAUSAS").find(x => x.camp === campId);
  const causasHecha = a => !!(S.causas && S.causas[a.id]);

  function causas(m) {
    const c = C.camps.find(x => x.id === ctx.camp); const A = causasDe(c.id);
    if (!A) return go("camp", { camp: c.id });
    const guia = A.guia || "ovaya";
    const total = A.enlaces.length;
    let paso = 1, errores = 0, hechas = [], sel = null;
    const w = el("div", { class: "mission" }); m.appendChild(w);

    function cabecera(txt, sub) {
      return `<div class="mhead"><button class="close" id="quit" aria-label="Salir">✕</button><div class="pbar"><b id="mp" style="width:${paso === 1 ? 10 : paso === 2 ? 30 + (hechas.length / total) * 55 : 95}%"></b></div><span class="small muted" style="min-width:74px;text-align:right">Paso ${paso} de 3</span></div>
        <div class="today" style="margin-bottom:12px"><div class="char">${monkey(guia, paso === 3 ? "think" : "happy", 72)}</div><div class="bubble"><span class="who">${CH[guia].name}</span><span class="tw">${esc(txt)}</span>${SAYBTN}</div></div>
        ${sub ? `<div class="qcard" style="margin-bottom:12px"><h2 style="font-size:19px">${esc(A.pregunta)}</h2><div class="ctx">${esc(sub)}</div></div>` : ""}`;
    }
    function salir() { $("#quit", w).addEventListener("click", () => go("camp", { camp: c.id })); typewrite($(".bubble .tw", w)); }

    /* paso 1 · ordenar en el tiempo */
    function ordenar() {
      paso = 1;
      w.innerHTML = cabecera(A.intro, "Primero ponlos en orden. Toca un hecho para agregarlo; tócalo arriba para devolverlo.") +
        `<div class="orderwrap"><div class="seq" id="seq"><span class="lab">Tu línea de tiempo</span></div><div class="pool" id="pool"><span class="lab">Hechos</span></div></div>
         <div class="actions"><button class="btn ghost sm" id="reset">Reiniciar</button><button class="btn g" id="check" disabled>Comprobar</button></div>`;
      salir();
      let pool = shuffle(A.hechos), seq = [];
      const draw = () => {
        const P = $("#pool", w), Q = $("#seq", w);
        P.innerHTML = `<span class="lab">Hechos</span>`; Q.innerHTML = `<span class="lab">Tu línea de tiempo</span>`;
        pool.forEach(h => { const b = el("button", { class: "item" }, `<span class="num" style="background:#C9C2AE">+</span><span>${esc(h.t)}</span>`); b.addEventListener("click", () => { pool = pool.filter(x => x !== h); seq.push(h); draw(); }); P.appendChild(b); });
        seq.forEach((h, n) => { const b = el("button", { class: "item" }, `<span class="num">${n + 1}</span><span>${esc(h.t)}</span>`); b.addEventListener("click", () => { seq = seq.filter(x => x !== h); pool.push(h); draw(); }); Q.appendChild(b); });
        $("#check", w).disabled = pool.length > 0;
      };
      draw();
      $("#reset", w).addEventListener("click", () => { pool = shuffle(A.hechos); seq = []; draw(); });
      $("#check", w).addEventListener("click", () => {
        const ok = seq.every((h, n) => h.id === A.hechos[n].id);
        if (!ok) errores++;
        [...$("#seq", w).querySelectorAll(".item")].forEach((b, n) => { b.disabled = true; b.classList.add(seq[n].id === A.hechos[n].id ? "ok" : "bad"); });
        $("#reset", w).remove(); $("#check", w).remove(); beep(ok);
        if (!ok) w.insertAdjacentHTML("beforeend", `<div class="model"><span class="t">El orden real</span><ol style="margin:0;padding-left:20px">${A.hechos.map(h => `<li>${esc(h.t)}${h.fecha ? ` <span class="muted small">(${esc(h.fecha)})</span>` : ""}</li>`).join("")}</ol></div>`);
        w.insertAdjacentHTML("beforeend", `<div class="fb show ${ok ? "ok" : "bad"}"><div style="font-size:26px">${ok ? "🎉" : "💡"}</div><div><span class="t">${ok ? "¡Orden correcto!" : "Mira el orden real"}</span><div class="why">Ahora viene lo importante: el orden no explica nada por sí solo. Toca saber qué provocó qué.</div></div></div>`);
        w.appendChild(contBtn(conectar, "Unir las causas →"));
      });
    }

    /* paso 2 · unir causa y consecuencia */
    function conectar() {
      paso = 2; sel = null;
      w.innerHTML = cabecera("Toca primero la causa y después lo que provocó. Si la flecha no corresponde, te lo digo.", "Encuentra las " + total + " uniones verdaderas. Cuidado: que un hecho venga después de otro no significa que lo haya causado.") +
        /* El estado de la interacción tiene que verse siempre: qué toca hacer ahora,
           qué llevo seleccionado y cuántas uniones van. Antes vivía en una burbuja
           que se escribía y se olvidaba, y el resultado aparecía al final de la lista,
           fuera de pantalla. */
        `<div class="estadohilo" id="estado">
            <div class="fila"><span class="paso" id="instruccion">Toca el hecho que fue la <b>causa</b></span>
              <button class="btn ghost sm" id="soltar" hidden>Soltar</button></div>
            <div class="tramos" id="tramos">${[...Array(total)].map(() => `<span class="tramo"></span>`).join("")}</div>
            <span class="cuenta" id="cnt">0 de ${total} uniones</span>
          </div>
          <div id="exp"></div>
          <div class="causas" id="red"><svg class="hilos" id="hilos" aria-hidden="true"></svg>
          ${A.hechos.map(h => `<button class="hecho" data-h="${h.id}"><span class="fecha">${esc(h.fecha || "·")}</span><span class="txt">${esc(h.t)}</span><span class="cuantas" hidden></span></button>`).join("")}</div>`;
      salir();
      const red = $("#red", w), svg = $("#hilos", w);

      function pintar() {
        const rb = red.getBoundingClientRect();
        svg.setAttribute("viewBox", `0 0 ${rb.width} ${red.scrollHeight}`);
        svg.setAttribute("width", rb.width); svg.setAttribute("height", red.scrollHeight);
        svg.innerHTML = `<defs><marker id="pta" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="var(--jungle)"/></marker></defs>` +
          hechas.map(e => {
            const a = $(`[data-h="${e.de}"]`, red), b = $(`[data-h="${e.a}"]`, red);
            if (!a || !b) return "";
            const ar = a.getBoundingClientRect(), br = b.getBoundingClientRect();
            const y1 = ar.top - rb.top + ar.height / 2, y2 = br.top - rb.top + br.height / 2;
            const x = 16, curva = Math.min(30, 8 + Math.abs(y2 - y1) / 5);
            return `<path d="M${x},${y1} C${x - curva},${y1} ${x - curva},${y2} ${x},${y2}" fill="none" stroke="var(--jungle)" stroke-width="3" stroke-linecap="round" marker-end="url(#pta)"/>`;
          }).join("");
      }
      const repintar = () => requestAnimationFrame(pintar);
      repintar(); window.addEventListener("resize", repintar);

      function explicar(clase, titulo, texto) {
        $("#exp", w).innerHTML = `<div class="fb show ${clase}"><div style="font-size:26px">${clase === "ok" ? "🧵" : "💡"}</div><div><span class="t">${esc(titulo)}</span><div class="why">${esc(texto)}</div></div></div>`;
      }
      function limpiar() { [...red.querySelectorAll(".hecho")].forEach(b => b.classList.remove("sel")); sel = null; pintarEstado(); }
      function pintarEstado() {
        const ins = $("#instruccion", w), soltar = $("#soltar", w);
        if (sel) {
          const h = A.hechos.find(x => x.id === sel);
          ins.innerHTML = `Ahora toca <b>lo que provocó</b> «${esc(h.t.length > 34 ? h.t.slice(0, 32) + "…" : h.t)}»`;
          soltar.hidden = false;
        } else { ins.innerHTML = `Toca el hecho que fue la <b>causa</b>`; soltar.hidden = true; }
        [...$("#tramos", w).children].forEach((t, k) => t.classList.toggle("hecha", k < hechas.length));
        /* cada tarjeta muestra de cuántas uniones ya forma parte */
        A.hechos.forEach(h => {
          const n = hechas.filter(e => e.de === h.id || e.a === h.id).length;
          const b = $(`[data-h="${h.id}"]`, red), c = b && $(".cuantas", b);
          if (c) { c.hidden = !n; c.textContent = n === 1 ? "1 flecha" : n + " flechas"; }
          if (b) b.classList.toggle("unida", !!n);
        });
      }
      pintarEstado();
      $("#soltar", w).addEventListener("click", () => { limpiar(); $("#exp", w).innerHTML = ""; });

      red.addEventListener("click", ev => {
        const b = ev.target.closest(".hecho"); if (!b) return;
        const id = b.dataset.h;
        if (!sel) { limpiar(); sel = id; b.classList.add("sel"); pintarEstado(); $("#exp", w).innerHTML = ""; return; }
        if (sel === id) { limpiar(); $("#exp", w).innerHTML = ""; return; }
        const de = sel, a = id; limpiar();
        if (hechas.some(e => e.de === de && e.a === a)) { explicar("ok", "Esa flecha ya la tienes", "Prueba con otra unión."); return; }
        const bueno = A.enlaces.find(e => e.de === de && e.a === a);
        if (bueno) {
          hechas.push(bueno); beep(true); repintar();
          $("#cnt", w).textContent = `${hechas.length} de ${total} uniones`; pintarEstado();
          $("#mp", w).style.width = (30 + (hechas.length / total) * 55) + "%";
          explicar("ok", "¡Sí, esto provocó aquello!", bueno.por);
          if (hechas.length === total) { jingle("stamp"); setTimeout(escribir, 1400); }
          return;
        }
        const trampa = (A.trampas || []).find(e => e.de === de && e.a === a);
        errores++; beep(false);
        if (trampa) explicar("bad", "Cuidado con esa flecha", trampa.por);
        else {
          const alReves = A.enlaces.find(e => e.de === a && e.a === de);
          explicar("bad", "Esa unión no va", alReves ? "Tienes los dos hechos correctos, pero la flecha está al revés: prueba tocando primero el otro." : "Esos dos hechos no se causan entre sí. Busca cuál explica al otro.");
        }
      });
    }

    /* paso 3 · escribir nombrando más de una causa */
    function escribir() {
      paso = 3;
      w.innerHTML = cabecera("Ahora dímelo con tus palabras. Eso es lo que te van a pedir en la prueba.") +
        `<div class="qcard"><h2>${esc(A.cierre.q)}</h2>
          ${campoVoz("tx", "Escribe aquí con tus palabras… o toca el micrófono")}
          <div class="actions"><button class="btn g" id="listo" disabled>Listo, compara →</button></div></div>`;
      salir();
      const tx = $("#tx", w);
      tx.addEventListener("input", () => { $("#listo", w).disabled = tx.value.trim().length < 10; });
      $("#listo", w).addEventListener("click", () => {
        const mio = (tx.value || "").trim(); cerrarVoz(w);
        w.innerHTML = cabecera("Compara lo tuyo con el modelo y marca honestamente qué incluiste.") +
          `<div class="qcard">
            <div class="model"><span class="t">Lo que escribiste</span><p style="margin:0;white-space:pre-wrap">${mio ? esc(mio) : "<em>No escribiste nada.</em>"}</p></div>
            <div class="model" style="background:#E6F6EC;border-color:var(--ok)"><span class="t" style="color:var(--jungle)">Una buena respuesta</span><p style="margin:0">${esc(A.cierre.modelo)}</p></div>
            <p style="font-weight:800;margin:16px 0 0">¿Qué de esto aparece en lo tuyo?</p>
            <div class="rubrica" id="ru">${A.cierre.rubrica.map((r, k) => `<label><input type="checkbox" data-k="${k}"><span>${esc(r)}</span></label>`).join("")}</div>
            <div class="actions"><button class="btn g" id="fin">Terminar</button></div></div>`;
        salir();
        $("#fin", w).addEventListener("click", () => {
          const cajas = [...$("#ru", w).querySelectorAll("input")];
          const faltantes = cajas.map((i, k) => i.checked ? -1 : k).filter(k => k >= 0);
          fin(cajas.length - faltantes.length, cajas.length, faltantes);
        });
      });
    }

    function fin(marcadas, tot, faltantes) {
      const faltan = tot - marcadas;
      const est = errores <= 2 && faltan === 0 ? 3 : errores <= 5 && faltan <= 1 ? 2 : 1;
      const xp = 30 + marcadas * 8 + (errores <= 2 ? 15 : 0);
      addXP(xp);
      S.causas = S.causas || {};
      const prev = S.causas[A.id];
      S.causas[A.id] = { estrellas: Math.max(est, prev ? prev.estrellas : 0), marcadas: Math.max(marcadas, prev ? prev.marcadas || 0 : 0), fecha: todayKey() };
      stat(c.topic, faltan === 0);
      if (est === 3) stamp("causas-" + c.id);
      save(); confetti(); jingle("win");
      w.innerHTML = `<div class="result">${monkey(guia, "party", 120)}
        <h2>${faltan === 0 ? "¡Explicaste la causa completa!" : "Buen hilo, casi completo"}</h2>
        <p class="muted">Uniste las ${hechas.length} causas y marcaste ${marcadas} de ${tot} ideas clave.</p>
        <div class="xp">+${xp} XP</div><div class="stars">${starStr(est)}</div>
        ${faltan ? `<div class="model" style="text-align:left"><span class="t">Para la prueba, repasa esto</span><ul style="margin:0;padding-left:20px">${faltantes.map(k => `<li>${esc(A.cierre.rubrica[k])}</li>`).join("")}</ul></div>` : ""}
        <div class="actions" style="justify-content:center"><button class="btn ghost" id="again">Repetir</button>${transferDe(c.id) ? `<button class="btn g" id="real">Llevarlo a tu vida 🔁</button>` : `<button class="btn g" id="back">Volver a la selva</button>`}</div></div>`;
      if ($("#real", w)) $("#real", w).addEventListener("click", () => go("aqui", { camp: c.id }));
      if (!$("#back", w)) w.insertAdjacentHTML("beforeend", `<div class="actions" style="justify-content:center;margin-top:10px"><button class="btn ghost sm" id="back">Volver a la selva</button></div>`);
      $("#again", w).addEventListener("click", () => go("causas", { camp: c.id }));
      $("#back", w).addEventListener("click", () => go("camp", { camp: c.id }));
    }

    ordenar();
  }


  /* ── EL SALTO A CIEGAS · modalidad opcional: intentar antes de leer ── */
  const desafioDe = campId => material("desafio", "DESAFIOS").find(x => x.camp === campId);

  function ciego(m) {
    const c = C.camps.find(x => x.id === ctx.camp); const D = desafioDe(c.id);
    if (!D) return go("camp", { camp: c.id });
    let i = 0, aciertos = 0; const elegidas = [];
    const w = el("div", { class: "mission" }); m.appendChild(w);

    function marco(dentro, prog) {
      w.innerHTML = `<div class="mhead"><button class="close" id="quit" aria-label="Salir">✕</button><div class="pbar"><b style="width:${prog}%"></b></div><span class="small muted" style="min-width:74px;text-align:right">${i + 1} de ${D.retos.length}</span></div>${dentro}`;
      $("#quit", w).addEventListener("click", () => go("camp", { camp: c.id }));
      const tw = $(".bubble .tw", w); if (tw) typewrite(tw);
    }
    const burbuja = (txt, mood) => `<div class="today" style="margin-bottom:12px"><div class="char">${monkey("chupaya", mood || "surprised", 72)}</div><div class="bubble"><span class="who">Chupaya</span><span class="tw">${esc(txt)}</span>${SAYBTN}</div></div>`;

    function reto() {
      const r = D.retos[i];
      marco(burbuja(i === 0 ? D.invita : ["¡Otra! No mires, adivina.", "Arriésgate. Yo siempre me arriesgo.", "¿Qué te dice tu instinto?"][i % 3]) +
        `<div class="qcard ciego">
          <div class="ctx">🙈 Todavía no has leído esto. Arriésgate.</div>
          <h2>${esc(r.q)}</h2>
          <div class="opts" id="opts">${r.opciones.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join("")}</div>
        </div>`, (i / D.retos.length) * 100);
      $("#opts", w).addEventListener("click", ev => {
        const b = ev.target.closest(".opt"); if (!b) return;
        elegidas.push(+b.dataset.k); revelar(+b.dataset.k);
      });
    }

    function revelar(k) {
      const r = D.retos[i], ok = k === r.correcta;
      if (ok) aciertos++;
      beep(ok);
      const nota = (c.notes || []).find(n => n.title === r.nota);
      /* Aquí se premia haber apostado, no haber acertado. Si el fallo se pinta en gris
         apagado al lado de un verde triunfal, el diseño desmiente lo que dice el texto. */
      marco(burbuja(ok ? "¡Le achuntaste sin leer! Cuéntame cómo lo supiste." : "¡Te arriesgaste! Eso es lo que vale. Y ahora se te queda grabado.", ok ? "party" : "party") +
        `<div class="qcard ciega-fin">
          <div class="premio"><span class="medalla">🪂</span><div><b>${ok ? "¡Apostaste y acertaste!" : "¡Apostaste sin red!"}</b><small>${ok ? "Ya sabías más de lo que creías." : "Intentar antes de leer es lo que hace que se te fije."}</small></div></div>
          <h2 style="font-size:19px">${esc(r.q)}</h2>
          <div class="apuesta tuya ${ok ? "acierta" : ""}"><span class="lab">🎲 Tu apuesta</span>${esc(r.opciones[k])}</div>
          ${ok ? "" : `<div class="apuesta real"><span class="lab">✔ Lo que pasó de verdad</span>${esc(r.opciones[r.correcta])}</div>`}
          <div class="revelacion"><span class="t">${ok ? "Y además" : "Lo que casi nadie sabe"}</span><p>${esc(r.revelacion)}</p></div>
          ${nota ? `<div class="enlace-nota">📖 Está explicado en la bitácora, en la página «${esc(nota.title)}».</div>` : ""}
        </div>`, ((i + 1) / D.retos.length) * 100);
      w.appendChild(contBtn(() => { i++; i < D.retos.length ? reto() : fin(); }, i + 1 < D.retos.length ? "Siguiente apuesta →" : "Ver cómo me fue →"));
    }

    function fin() {
      const n = D.retos.length;
      const xp = 20 + aciertos * 10;
      addXP(xp);
      S.ciegos = S.ciegos || {};
      const prev = S.ciegos[D.id] || {};
      S.ciegos[D.id] = { veces: (prev.veces || 0) + 1, mejor: Math.max(aciertos, prev.mejor || 0), de: n };
      save(); jingle("win"); if (aciertos) confetti();
      const notas = D.retos.map(r => r.nota).filter((t, k) => (c.notes || []).some(n => n.title === t));
      w.innerHTML = `<div class="result">${monkey("chupaya", "party", 120)}
        <h2>${aciertos === n ? "¡Saltaste con los ojos cerrados y caíste de pie!" : aciertos ? "Apostaste y aprendiste" : "Fallaste todas… y eso sirve"}</h2>
        <p class="muted">Acertaste ${aciertos} de ${n} sin haber leído nada.</p>
        <div class="xp">+${xp} XP</div>
        <div class="model" style="text-align:left"><span class="t">Por qué esto funciona</span><p style="margin:0">${aciertos === n ? "Ya tenías más idea de la que creías. Ahora lee la bitácora para afirmarlo con las palabras exactas que te van a pedir en la prueba." : "Intentar antes de leer, aunque falles, hace que la explicación se fije mucho mejor que si la lees de entrada. Ahora la bitácora te va a sonar distinta: ya sabes qué preguntas responde."}</p></div>
        <div class="actions" style="justify-content:center"><button class="btn ghost" id="again">Repetir</button><button class="btn g" id="leer">Ahora sí, a la bitácora 📖</button></div></div>`;
      $("#again", w).addEventListener("click", () => go("ciego", { camp: c.id }));
      $("#leer", w).addEventListener("click", () => go("notes", { camp: c.id }));
    }

    reto();
  }


  /* Un botón apagado sin explicación es de los peores momentos de una interfaz:
     el niño escribe, no pasa nada y no sabe por qué. Este medidor acompaña mientras
     escribe y el botón queda siempre activo: si falta, lo dice y devuelve el foco. */
  function medidorEscritura(cont, idTexto, idBoton, minPalabras, alSeguir) {
    const tx = $("#" + idTexto, cont), btn = $("#" + idBoton, cont);
    if (!tx || !btn) return;
    btn.disabled = false;
    const medidor = el("div", { class: "medidor" }, `<span class="marca"></span><span class="dicho"></span>`);
    tx.closest(".campo-voz")?.insertAdjacentElement("afterend", medidor) || tx.insertAdjacentElement("afterend", medidor);
    const palabras = () => tx.value.trim().split(/\s+/).filter(Boolean).length;
    function pintar() {
      const n = palabras(), listo = n >= minPalabras;
      medidor.classList.toggle("listo", listo);
      $(".marca", medidor).textContent = listo ? "✓" : Math.max(0, minPalabras - n);
      $(".dicho", medidor).textContent = listo
        ? `Ya puedes seguir. Llevas ${n} palabras.`
        : n === 0 ? `Escribe con tus palabras: con unas ${minPalabras} basta.`
        : `Te faltan unas ${minPalabras - n} palabras.`;
      return listo;
    }
    tx.addEventListener("input", pintar); pintar();
    btn.addEventListener("click", ev => {
      if (pintar()) return alSeguir && alSeguir();
      ev.stopImmediatePropagation(); ev.preventDefault();
      medidor.classList.add("avisa"); setTimeout(() => medidor.classList.remove("avisa"), 700);
      tx.focus(); toast("Escribe un poco más y seguimos.");
    }, true);
  }

  /* ── AQUÍ Y AHORA · transferencia a casos reales ── */
  const transferDe = campId => material("transferencia", "TRANSFERENCIA").find(x => x.camp === campId);

  function aqui(m) {
    const c = C.camps.find(x => x.id === ctx.camp); const T = transferDe(c.id);
    if (!T) return go("camp", { camp: c.id });
    const guia = T.guia || "ovaya";
    const guardado = (S.aqui && S.aqui[T.id]) || {};
    const w = el("div", { class: "mission" }); m.appendChild(w);

    function marco(dentro, prog) {
      w.innerHTML = `<div class="mhead"><button class="close" id="quit" aria-label="Salir">✕</button><div class="pbar"><b style="width:${prog}%"></b></div><span class="small muted" style="min-width:72px;text-align:right">Caso real</span></div>
        <div class="today" style="margin-bottom:12px"><div class="char">${monkey(guia, "think", 72)}</div><div class="bubble"><span class="who">${CH[guia].name}</span><span class="tw">${esc(T.invita)}</span>${SAYBTN}</div></div>${dentro}`;
      $("#quit", w).addEventListener("click", () => go("camp", { camp: c.id }));
      typewrite($(".bubble .tw", w));
    }

    function partir() {
      marco(`<div class="qcard">
          <div class="ctx">🔁 Lo mismo que aprendiste, fuera de la historia</div>
          <h2>${esc(T.titulo)}</h2>
          <div class="puente"><span class="lab">Lo que acabas de aprender</span>${esc(T.caso)}</div>
          <div class="puente ahora"><span class="lab">Ahora úsalo aquí</span>${esc(T.consigna)}</div>
          ${T.encasa ? `<div class="encasa">🏠 Esta necesita que mires o preguntes algo en tu casa. No se puede responder solo desde la pantalla, y de eso se trata.</div>` : ""}
          <div class="actions">${T.encasa ? `<button class="btn ghost" id="luego">Lo haré en casa</button>` : ""}<button class="btn g" id="ya">${T.encasa ? "Ya lo averigüé" : "Empezar"}</button></div>
        </div>${guardado.texto ? `<div class="model"><span class="t">Lo que escribiste la vez pasada</span><p style="margin:0;white-space:pre-wrap">${esc(guardado.texto)}</p></div>` : ""}`, 20);
      if (T.encasa) $("#luego", w).addEventListener("click", () => {
        S.aqui = S.aqui || {}; S.aqui[T.id] = Object.assign({}, guardado, { pendiente: true }); save();
        toast("Anotado. Te espera en la selva cuando lo tengas.");
        setTimeout(() => go("camp", { camp: c.id }), 900);
      });
      $("#ya", w).addEventListener("click", escribir);
    }

    function escribir() {
      marco(`<div class="qcard">
          <h2 style="font-size:20px">${esc(T.consigna)}</h2>
          ${campoVoz("tx", "Escribe aquí lo que averiguaste… o toca el micrófono")}
          <button class="btn ghost sm" id="pistas" style="margin-top:6px">¿Te ayudo a partir?</button>
          <div id="lista" hidden></div>
          <div class="actions"><button class="btn g" id="listo">Listo →</button></div>
        </div>`, 55);
      const tx = $("#tx", w); if (guardado.texto) tx.value = guardado.texto;
      medidorEscritura(w, "tx", "listo", 12);
      $("#pistas", w).addEventListener("click", () => {
        const l = $("#lista", w); l.hidden = false; $("#pistas", w).remove();
        l.innerHTML = `<div class="model"><span class="t">Preguntas que te pueden servir</span><ul style="margin:0;padding-left:20px">${T.pistas.map(p => `<li>${esc(p)}</li>`).join("")}</ul></div>`;
      });
      $("#listo", w).addEventListener("click", () => { cerrarVoz(w); revisarRubrica(tx.value.trim()); });
    }

    function revisarRubrica(mio) {
      marco(`<div class="qcard">
          <div class="model"><span class="t">Lo que escribiste</span><p style="margin:0;white-space:pre-wrap">${esc(mio)}</p></div>
          <p style="font-weight:800;margin:16px 0 0">Aquí no hay una sola respuesta correcta. Lo que importa es cómo lo pensaste:</p>
          <div class="rubrica" id="ru">${T.rubrica.map((r, k) => `<label><input type="checkbox" data-k="${k}"><span>${esc(r)}</span></label>`).join("")}</div>
          <div class="actions"><button class="btn g" id="fin">Terminar</button></div>
        </div>`, 85);
      $("#fin", w).addEventListener("click", () => {
        const cajas = [...$("#ru", w).querySelectorAll("input")];
        const faltan = cajas.map((i, k) => i.checked ? -1 : k).filter(k => k >= 0);
        fin(mio, cajas.length - faltan.length, cajas.length, faltan);
      });
    }

    function fin(mio, marcadas, tot, faltan) {
      const xp = 35 + marcadas * 10;
      addXP(xp);
      S.aqui = S.aqui || {};
      S.aqui[T.id] = { texto: mio, marcadas: Math.max(marcadas, guardado.marcadas || 0), de: tot, pendiente: false, fecha: todayKey() };
      if (marcadas === tot) stamp("aqui-" + c.id);
      save(); confetti(); jingle("win");
      w.innerHTML = `<div class="result">${monkey(guia, "party", 120)}
        <h2>${marcadas === tot ? "¡Lo llevaste a tu vida entera!" : "Buen puente"}</h2>
        <p class="muted">Usaste «${esc(T.concepto)}» fuera de la historia.</p>
        <div class="xp">+${xp} XP</div>
        <div class="model" style="text-align:left"><span class="t">Por qué esto importa</span><p style="margin:0">${esc(T.cierre)}</p></div>
        ${faltan.length ? `<div class="model" style="text-align:left;background:#FFF7E0"><span class="t">Para pensarlo otra vez</span><ul style="margin:0;padding-left:20px">${faltan.map(k => `<li>${esc(T.rubrica[k])}</li>`).join("")}</ul></div>` : ""}
        <div class="actions" style="justify-content:center"><button class="btn ghost" id="again">Mejorarlo</button><button class="btn g" id="back">Volver a la selva</button></div></div>`;
      $("#again", w).addEventListener("click", () => go("aqui", { camp: c.id }));
      $("#back", w).addEventListener("click", () => go("camp", { camp: c.id }));
    }

    partir();
  }

  /* ── arranque ── */
  (function leerEnlace() {
    try {
      const q = new URLSearchParams(location.search);
      if (!q.has("codigo") && !q.has("sync")) return;
      const c = (q.get("codigo") || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
      if (c.length >= 4) S.codigo = c;
      if (q.get("sync")) S.puenteProgreso = q.get("sync");
      if (q.get("musica")) S.puente = q.get("musica");
      if (q.get("generar")) S.puenteGenerar = q.get("generar");
      save();
      history.replaceState(null, "", location.pathname);
      setTimeout(() => toast("📲 Aparato enlazado. Recuperando el avance de Leti…"), 400);
    } catch (e) { }
  })();
  touchDay();
  render();
  if (syncURL() && S.codigo) sincronizar(true).then(() => render());
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => { });
})();
