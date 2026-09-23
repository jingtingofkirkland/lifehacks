// Merged from the Bubble Pop game; do not hand-edit.
// Theme: CSS is scoped under .math-tool and mapped to the site's shadcn
// tokens so the page follows the main site design (dark mode via the
// .dark class from next-themes). Progress persists in localStorage.
export const MATH_TOOL_CSS = `
.math-tool{
  color-scheme: light dark;
  --paper: hsl(var(--background));
  --panel: hsl(var(--card));
  --panel-2: hsl(var(--muted));
  --ink: hsl(var(--foreground));
  --muted: hsl(var(--muted-foreground));
  --line: hsl(var(--border));
  --sky-1: #bfe6fb;
  --sky-2: #e8f6ff;
  --bubble: rgba(255,255,255,.72);
  --bubble-ring: #7cc4ef;
  --blue: #1f7fc1;
  --blue-dark: #146294;
  --blue-soft: #dff0fd;
  --green: #1c8b66;
  --green-dark: #11684d;
  --green-soft: #dff4e7;
  --coral: #f06449;
  --coral-dark: #c74431;
  --coral-soft: #ffe9e2;
  --yellow: #f6c945;
  --yellow-soft: #fff4d6;
  --purple: #7c6bd9;
  --shadow: 0 14px 35px rgba(31, 110, 160, .14);
  color: var(--ink);
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  font-size: 17px;
  line-height: 1.5;
  -webkit-tap-highlight-color: transparent;
}
.dark .math-tool{
  --sky-1: #12344d;
  --sky-2: #0d2438;
  --bubble: rgba(20, 46, 68, .72);
  --bubble-ring: #3f8fc4;
  --blue: #6db9ec;
  --blue-dark: #4a9fd8;
  --blue-soft: #16394f;
  --green: #4fc493;
  --green-dark: #35a377;
  --green-soft: #1d4433;
  --coral: #ff8468;
  --coral-dark: #e06a4f;
  --coral-soft: #4c2b24;
  --yellow: #f2cb50;
  --yellow-soft: #4a3d1c;
  --purple: #a394f0;
  --shadow: 0 16px 38px rgba(0, 0, 0, .30);
}
.math-tool *, .math-tool *::before, .math-tool *::after{ box-sizing: border-box; }

.math-tool .bubble-shell{ max-width: 880px; margin: 0 auto; padding: 8px 4px 0; }

.math-tool .game-head{ text-align: center; margin: 6px 0 14px; }
.math-tool .game-kicker{
  display: inline-block; font-size: .78rem; font-weight: 800; letter-spacing: .14em;
  text-transform: uppercase; color: var(--blue-dark); background: var(--blue-soft);
  border: 1px solid var(--line); padding: 4px 14px; border-radius: 999px; margin-bottom: 10px;
}
.math-tool .game-head h1{
  margin: 0 0 6px; font-family: "Poppins", system-ui, sans-serif;
  font-size: clamp(1.7rem, 4.5vw, 2.4rem); line-height: 1.15; letter-spacing: -.01em;
}
.math-tool .game-head p{ margin: 0; color: var(--muted); font-size: 1rem; }

.math-tool .mode-row{
  display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin: 14px 0 4px;
}
.math-tool .mode-btn{
  appearance: none; border: 2px solid var(--line); background: var(--panel);
  color: var(--ink); font: inherit; font-weight: 700; font-size: .95rem;
  padding: 10px 20px; border-radius: 999px; cursor: pointer;
  transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease, background .12s ease;
}
.math-tool .mode-btn small{ display: block; font-weight: 500; font-size: .75rem; color: var(--muted); }
.math-tool .mode-btn[aria-pressed="true"]{
  border-color: var(--blue); background: var(--blue-soft); color: var(--blue-dark);
  box-shadow: var(--shadow);
}
.math-tool .mode-btn:active{ transform: scale(.96); }

.math-tool .stats{
  display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin: 12px 0 4px;
}
.math-tool .stat{
  min-width: 96px; text-align: center; background: var(--panel);
  border: 1px solid var(--line); border-radius: 16px; padding: 8px 14px;
  box-shadow: var(--shadow);
}
.math-tool .stat b{ display: block; font-size: 1.5rem; line-height: 1.1; font-family: "Poppins", system-ui, sans-serif; }
.math-tool .stat span{ font-size: .75rem; color: var(--muted); font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
.math-tool .stat.streak b{ color: var(--coral-dark); }

.math-tool .equation-card{
  margin: 16px auto 6px; text-align: center; background: var(--panel);
  border: 1px solid var(--line); border-radius: 24px; padding: 18px 12px 14px;
  box-shadow: var(--shadow); position: relative; overflow: hidden;
}
.math-tool .equation-card::before{
  content: ""; position: absolute; inset: 0 0 auto 0; height: 6px;
  background: linear-gradient(90deg, var(--blue), var(--purple), var(--yellow));
}
.math-tool .equation-label{ font-size: .8rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
.math-tool .equation{
  font-family: "Poppins", system-ui, sans-serif; font-weight: 800;
  font-size: clamp(2rem, 7vw, 3rem); letter-spacing: .02em;
}
.math-tool .equation .missing{
  display: inline-block; min-width: 1.6em; color: var(--blue-dark);
  background: var(--blue-soft); border: 2px dashed var(--blue);
  border-radius: 14px; padding: 0 .25em; margin: 0 .1em;
}
.math-tool .equation-hint{ margin: 6px 0 0; color: var(--muted); font-size: .9rem; }

.math-tool .bubble-field{
  position: relative; height: 320px; margin: 10px 0 4px; border-radius: 24px;
  background: linear-gradient(180deg, var(--sky-2), var(--sky-1));
  border: 1px solid var(--line); overflow: hidden; box-shadow: var(--shadow);
}
.math-tool .bubble{
  position: absolute; width: 84px; height: 84px; border-radius: 50%;
  background: radial-gradient(circle at 32% 28%, rgba(255,255,255,.95), var(--bubble) 55%, rgba(255,255,255,.25));
  border: 2px solid var(--bubble-ring);
  box-shadow: inset -6px -8px 14px rgba(124,196,239,.35), 0 8px 18px rgba(31,127,193,.25);
  display: flex; align-items: center; justify-content: center;
  font-family: "Poppins", system-ui, sans-serif; font-weight: 800; font-size: 1.7rem; color: var(--ink);
  cursor: pointer; user-select: none; -webkit-user-select: none;
  animation: math-bubble-float 4.5s ease-in-out infinite;
  transition: transform .12s ease;
  touch-action: manipulation;
}
.math-tool .bubble::after{
  content: ""; position: absolute; left: 18%; top: 12%; width: 26%; height: 18%;
  border-radius: 50%; background: rgba(255,255,255,.75); transform: rotate(-24deg);
}
.math-tool .bubble:hover{ transform: scale(1.06); }
.math-tool .bubble:active{ transform: scale(.93); }
.math-tool .bubble.popped{ animation: math-bubble-pop .35s ease forwards; pointer-events: none; }
.math-tool .bubble.wobble{ animation: math-bubble-wobble .55s ease; }
.math-tool .bubble.hint-glow{
  border-color: var(--yellow);
  box-shadow: 0 0 0 5px var(--yellow-soft), 0 0 26px var(--yellow);
}
@keyframes math-bubble-float{
  0%, 100%{ margin-top: 0; }
  50%{ margin-top: -16px; }
}
@keyframes math-bubble-pop{
  0%{ transform: scale(1); opacity: 1; }
  45%{ transform: scale(1.25); opacity: 1; }
  100%{ transform: scale(0); opacity: 0; }
}
@keyframes math-bubble-wobble{
  0%, 100%{ transform: translateX(0); }
  20%{ transform: translateX(-10px) rotate(-6deg); }
  40%{ transform: translateX(9px) rotate(5deg); }
  60%{ transform: translateX(-6px) rotate(-3deg); }
  80%{ transform: translateX(4px) rotate(2deg); }
}
.math-tool .bubble-tip{
  position: absolute; left: 50%; bottom: calc(100% + 8px); transform: translateX(-50%) scale(.9);
  width: 190px; background: var(--panel); border: 2px solid var(--yellow); border-radius: 14px;
  box-shadow: var(--shadow); padding: 8px; opacity: 0; pointer-events: none;
  transition: opacity .18s ease, transform .18s ease; z-index: 5;
}
.math-tool .bubble-tip.visible{ opacity: 1; transform: translateX(-50%) scale(1); }
.math-tool .tf{ display: grid; grid-template-columns: repeat(5, 1fr); gap: 3px; margin-bottom: 4px; }
.math-tool .tf .dot{
  width: 100%; aspect-ratio: 1; border-radius: 50%;
  background: var(--panel-2); border: 1px solid var(--line);
}
.math-tool .tf .dot.on{ background: var(--blue); border-color: var(--blue-dark); }
.math-tool .tf .dot.need{ background: var(--yellow); border-color: var(--yellow); box-shadow: 0 0 6px var(--yellow); }
.math-tool .tf .dot.take{ background: var(--coral); border-color: var(--coral-dark); }
.math-tool .bubble-tip .tip-words{ font-size: .72rem; line-height: 1.35; color: var(--muted); font-weight: 600; }

.math-tool .feedback{
  min-height: 64px; display: flex; align-items: center; justify-content: center;
  gap: 10px; margin: 8px 0; text-align: center;
}
.math-tool .feedback-text{
  font-weight: 700; font-size: 1.05rem; background: var(--panel);
  border: 1px solid var(--line); border-radius: 999px; padding: 8px 20px;
  box-shadow: var(--shadow); transition: background .15s ease;
}
.math-tool .feedback.good .feedback-text{ background: var(--green-soft); border-color: var(--green); color: var(--green-dark); }
.math-tool .feedback.error .feedback-text{ background: var(--coral-soft); border-color: var(--coral); color: var(--coral-dark); }
.math-tool .feedback.tip .feedback-text{ background: var(--yellow-soft); border-color: var(--yellow); color: inherit; }
.math-tool .tip-btn{
  appearance: none; border: 2px dashed var(--line); background: transparent; color: var(--muted);
  font: inherit; font-size: .85rem; font-weight: 700; border-radius: 999px; padding: 8px 16px; cursor: pointer;
}
.math-tool .tip-btn:hover{ color: var(--blue-dark); border-color: var(--blue); }

.math-tool .worksheet-wrap{
  margin: 26px 0 10px; background: var(--panel); border: 1px solid var(--line);
  border-radius: 24px; padding: 22px 18px; box-shadow: var(--shadow);
}
.math-tool .ws-head h2{ margin: 0 0 4px; font-family: "Poppins", system-ui, sans-serif; font-size: 1.35rem; }
.math-tool .ws-head p{ margin: 0 0 14px; color: var(--muted); font-size: .92rem; }
.math-tool .generator .controls{
  display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end; margin-bottom: 10px;
}
.math-tool .generator label{ font-size: .85rem; font-weight: 600; color: var(--muted); display: grid; gap: 4px; }
.math-tool .generator select{
  font: inherit; font-size: .95rem; padding: 8px 12px; border-radius: 10px;
  border: 1px solid var(--line); background: var(--paper); color: var(--ink);
}
.math-tool .primary{
  appearance: none; border: none; cursor: pointer; font: inherit; font-weight: 800; font-size: .95rem;
  color: #fff; background: var(--blue); padding: 10px 22px; border-radius: 12px;
  box-shadow: 0 4px 0 var(--blue-dark); transition: transform .1s ease, box-shadow .1s ease;
}
.math-tool .primary:active{ transform: translateY(3px); box-shadow: 0 1px 0 var(--blue-dark); }
.math-tool .toggle-row{ display: flex; align-items: center; gap: 8px; margin: 6px 0; font-size: .92rem; }
.math-tool .toggle-row input{ width: 18px; height: 18px; accent-color: var(--blue); }
.math-tool .print-note{ font-size: .85rem; color: var(--muted); margin: 8px 0 16px; }
.math-tool .sheet{
  background: #fff; color: #15211e; border: 2px solid #15211e; border-radius: 6px; padding: 26px 28px;
}
.math-tool .sheet-head{ display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; border-bottom: 2px solid #15211e; padding-bottom: 12px; margin-bottom: 22px; }
.math-tool .sheet-head h3{ margin: 0; font-family: "Poppins", system-ui, sans-serif; font-size: 1.4rem; }
.math-tool .name-line{ display: flex; align-items: flex-end; gap: 8px; min-width: 0; }
.math-tool .sheet-head .name-line{ flex: 0 1 300px; }
.math-tool .name-blank{ flex: 1 1 160px; min-width: 60px; border-bottom: 2px solid currentColor; height: 1.1em; }
.math-tool .problem-grid{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px 44px; counter-reset: item; }
.math-tool .sheet-problem{ counter-increment: item; display: flex; align-items: flex-end; min-height: 54px; font-weight: 700; font-size: 1.25rem; line-height: 1.3; border-bottom: 1px solid #9da9a5; padding-bottom: 8px; }
.math-tool .sheet-problem::before{ content: counter(item) "."; width: 38px; color: #53625d; font-weight: 400; }
.math-tool .sheet-answer{ display: none; margin-left: auto; color: #1c8b66; }
.math-tool .sheet.show-answers .sheet-answer{ display: inline; }
.math-tool .answer-key-label{ display: none; margin: 26px 0 8px; font-weight: 800; }
.math-tool .sheet.show-answers .answer-key-label{ display: block; }

@media (max-width: 560px){
  .math-tool .bubble{ width: 72px; height: 72px; font-size: 1.45rem; }
  .math-tool .bubble-field{ height: 300px; }
  .math-tool .problem-grid{ grid-template-columns: 1fr; }
  .math-tool .bubble-tip{ width: 160px; }
  .math-tool .generator .controls{ flex-direction: column; align-items: stretch; }
  .math-tool .generator .controls > *{ min-width: 0; width: 100%; max-width: 100%; }
  .math-tool .generator .controls select{ width: 100%; }
  .math-tool .sheet{ padding: 20px 16px; }
  .math-tool .sheet-head{ display: block; }
  .math-tool .sheet-head h3{ margin-bottom: 12px; }
}
@media print{
  .math-tool .bubble-shell, .math-tool .generator .controls, .math-tool .toggle-row,
  .math-tool .print-note, .math-tool .ws-head{ display: none !important; }
  .math-tool .worksheet-wrap{ border: none; box-shadow: none; padding: 0; margin: 0; }
  .math-tool{ background: #fff !important; color: #000 !important; font-size: 12pt; }
}
@media (prefers-reduced-motion: reduce){
  .math-tool .bubble{ animation: none; }
}
`;

export const MATH_TOOL_HTML = `
<main class="bubble-shell">
  <div class="game-head">
    <span class="game-kicker">Kids math game</span>
    <h1>Bubble Pop</h1>
    <p>An equation is missing a number. Pop the bubble with the missing piece!</p>
  </div>

  <div class="mode-row" role="group" aria-label="Difficulty">
    <button class="mode-btn" type="button" data-mode="basic" aria-pressed="true">Basic<small>Missing numbers within 20</small></button>
    <button class="mode-btn" type="button" data-mode="advanced" aria-pressed="false">Advanced<small>Missing numbers within 100</small></button>
  </div>

  <div class="stats" aria-live="polite">
    <div class="stat"><b id="scoreStat">0</b><span>Score</span></div>
    <div class="stat streak"><b id="streakStat">0</b><span>Streak</span></div>
    <div class="stat"><b id="bestStat">0</b><span>Best streak</span></div>
  </div>

  <div class="equation-card">
    <div class="equation-label">Find the missing number</div>
    <div class="equation" id="equation" aria-live="polite"></div>
    <p class="equation-hint">Tap a bubble to answer. Wrong taps never hurt your score.</p>
  </div>

  <div class="bubble-field" id="bubbleField" aria-label="Floating number bubbles"></div>

  <div class="feedback" id="feedback">
    <span class="feedback-text" id="feedbackText">Pop the right bubble to start!</span>
    <button class="tip-btn" type="button" id="tipBtn">Show me a tip</button>
  </div>

  <section class="worksheet-wrap" id="worksheet" aria-labelledby="worksheetTitle">
    <div class="ws-head">
      <h2 id="worksheetTitle">Take it to paper</h2>
      <p>Print missing-number practice anytime. The popping stays in the game; the practice goes on the fridge.</p>
    </div>
    <div class="generator">
      <div class="controls">
        <label>Number range
          <select id="range-select">
            <option value="10">Within 10</option>
            <option value="20" selected>Within 20</option>
            <option value="100">Within 100</option>
          </select>
        </label>
        <label>Question count
          <select id="count-select">
            <option value="6">6 questions</option>
            <option value="10" selected>10 questions</option>
            <option value="15">15 questions</option>
            <option value="20">20 questions</option>
          </select>
        </label>
        <button class="primary" type="button" id="generate-btn">Make new sheet</button>
      </div>
      <div class="toggle-row">
        <input type="checkbox" id="answers-toggle" />
        <label for="answers-toggle">Show answer key</label>
      </div>
      <p class="print-note"><strong>Ready for paper?</strong> Use your browser&rsquo;s print command. The controls will be hidden automatically, and the worksheet will fill the page.</p>
      <div class="sheet" id="sheet">
        <div class="sheet-head">
          <h3>Missing-Number Practice</h3>
          <span class="name-line"><span>Name:</span><span class="name-blank" aria-hidden="true"></span></span>
        </div>
        <div class="problem-grid" id="worksheet-grid"></div>
        <div class="answer-key-label">Answers are shown in green.</div>
      </div>
    </div>
  </section>
</main>`;

export const MATH_TOOL_JS = `
(function () {
  'use strict';

  /* ---------- storage (site policy: localStorage; artifact default: memory) ---------- */
  function MemoryProgressStore() {
    var data = null;
    this.load = function () { return data; };
    this.save = function (d) { data = d; };
  }
  function LocalStorageProgressStore() {
    var KEY = 'kids-math-bubble-pop-progress';
    this.load = function () {
      try {
        var raw = window.localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) { return null; }
    };
    this.save = function (d) {
      try { window.localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
    };
  }
  // Site policy: persist progress in this browser via localStorage.
  const progressStore = new LocalStorageProgressStore();

  /* ---------- state ---------- */
  var state = {
    mode: 'basic', score: 0, correct: 0, streak: 0, best: 0,
    wrongStreak: 0, locked: false, sound: true,
    round: null, warmupRounds: 0
  };

  var els = {};
  ['equation', 'bubbleField', 'feedback', 'feedbackText', 'tipBtn',
   'scoreStat', 'streakStat', 'bestStat', 'sheet', 'worksheet-grid',
   'generate-btn', 'answers-toggle', 'range-select', 'count-select'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  /* ---------- tiny sound ---------- */
  var audioCtx = null;
  function blip(freq, dur, type) {
    if (!state.sound) return;
    try {
      if (!window.AudioContext && !window.webkitAudioContext) return;
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      var o = audioCtx.createOscillator();
      var g = audioCtx.createGain();
      o.type = type || 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.12, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + dur);
    } catch (e) {}
  }

  /* ---------- round generation ---------- */
  // Round types: the missing piece moves around the equation.
  function makeEquation(limit) {
    var kinds = ['addR', 'addL', 'subR', 'subL'];
    var kind = kinds[randomInt(0, kinds.length - 1)];
    var a, b, c;
    if (kind === 'addR' || kind === 'addL') {
      c = randomInt(4, limit);
      a = randomInt(1, c - 1);
      b = c - a;
      if (kind === 'addR') return { kind: kind, text: [a, '+', '?', '=', c], answer: b, known: a, total: c };
      return { kind: kind, text: ['?', '+', b, '=', c], answer: a, known: b, total: c };
    }
    c = randomInt(5, limit);
    a = randomInt(1, c - 1);
    b = c - a;
    if (kind === 'subR') return { kind: kind, text: [c, '-', '?', '=', a], answer: b, known: a, total: c };
    return { kind: kind, text: ['?', '-', b, '=', a], answer: c, known: a, sub: b, total: c };
  }

  function makeCandidates(answer, count, limit) {
    var set = {};
    set[answer] = true;
    var pool = [answer - 2, answer - 1, answer + 1, answer + 2,
                answer - 10, answer + 10, answer + 3, Math.max(0, answer - 3)];
    shuffle(pool);
    var out = [answer];
    for (var i = 0; i < pool.length && out.length < count; i += 1) {
      var v = pool[i];
      if (v < 0 || v > limit + 10 || set[v]) continue;
      set[v] = true;
      out.push(v);
    }
    var guard = 0;
    while (out.length < count && guard < 200) {
      guard += 1;
      var v2 = randomInt(0, Math.min(limit, 99));
      if (!set[v2]) { set[v2] = true; out.push(v2); }
    }
    return shuffle(out);
  }

  function renderEquation(eq) {
    var html = '';
    eq.text.forEach(function (tok) {
      if (tok === '?') html += '<span class="missing">?</span>';
      else html += '<span>' + tok + '</span>';
    });
    els.equation.innerHTML = html;
  }

  function makeRound() {
    state.locked = false;
    var advanced = state.mode === 'advanced';
    var limit = advanced ? 100 : (state.warmupRounds < 3 ? 10 : 20);
    var eq = makeEquation(limit);
    var count = advanced ? 6 : 5;
    var cands = makeCandidates(eq.answer, count, limit);
    state.round = { eq: eq, values: cands, limit: limit };
    if (!advanced) state.warmupRounds += 1;
    renderEquation(eq);
    renderBubbles(cands, advanced);
    setFeedback('', 'Pop the bubble with the missing number!');
  }

  function renderBubbles(values, advanced) {
    var field = els.bubbleField;
    field.innerHTML = '';
    var W = 84, H = 84;
    values.forEach(function (v, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'bubble';
      b.setAttribute('data-value', String(v));
      b.setAttribute('aria-label', 'Bubble with number ' + v);
      b.textContent = String(v);
      // Scatter without heavy overlap: grid-ish slots with jitter.
      var cols = 3;
      var col = i % cols;
      var row = Math.floor(i / cols);
      var left = 6 + col * 30 + randomInt(-4, 4);
      var top = 8 + row * 42 + randomInt(-6, 6);
      b.style.left = left + '%';
      b.style.top = top + 'px';
      var speed = advanced ? (2.2 + Math.random() * 1.6) : (3.6 + Math.random() * 2.2);
      b.style.animationDuration = speed.toFixed(2) + 's';
      b.style.animationDelay = (-Math.random() * speed).toFixed(2) + 's';
      b.addEventListener('click', function () { onBubbleTap(b); });
      field.appendChild(b);
    });
  }

  /* ---------- feedback + tips ---------- */
  function setFeedback(kind, text) {
    els.feedback.className = 'feedback' + (kind ? ' ' + kind : '');
    els.feedbackText.textContent = text;
  }

  function tenFrame(dots, cls, perFrame) {
    perFrame = perFrame || 10;
    var html = '<div class="tf" aria-hidden="true">';
    for (var f = 0; f * perFrame < dots.total; f += 1) {
      for (var i = 0; i < perFrame; i += 1) {
        var idx = f * perFrame + i;
        var c = 'dot';
        if (idx < dots.onCount) c += ' on';
        else if (idx < dots[cls + 'Count']) c += ' ' + cls;
        html += '<span class="' + c + '"></span>';
      }
    }
    return html + '</div>';
  }

  // Build the visual + one-line strategy tip for the current round.
  function buildTip() {
    var eq = state.round.eq;
    var tipHtml, words;
    if (eq.kind === 'addR' || eq.kind === 'addL') {
      // a + ? = c : fill \`known\`, count up \`answer\` more.
      tipHtml = tenFrame({ total: Math.max(10, eq.total), onCount: eq.known, needCount: eq.known + eq.answer }, 'need');
      words = 'Start at ' + eq.known + ', count up ' + eq.answer + ' more to reach ' + eq.total + '.';
    } else if (eq.kind === 'subR') {
      // c - ? = a : take away down to 10 first, then the rest.
      tipHtml = tenFrame({ total: eq.total, onCount: eq.total - eq.answer, takeCount: eq.total }, 'take');
      if (eq.total <= 10) {
        words = 'Count back ' + eq.answer + ' from ' + eq.total + '.';
      } else {
        var toTen = eq.total - 10;
        var rest = eq.answer - toTen;
        words = eq.total + ' - ' + toTen + ' = 10, then - ' + rest + ' more.';
      }
    } else {
      // ? - b = a : missing start means add.
      tipHtml = tenFrame({ total: Math.max(10, eq.answer), onCount: eq.known, needCount: eq.known + eq.sub }, 'need');
      words = 'Missing the start? Add: ' + eq.known + ' + ' + eq.sub + ' = ' + eq.answer + '.';
    }
    return { html: tipHtml, words: words };
  }

  function showTip() {
    if (!state.round) return;
    var tip = buildTip();
    var bubbles = els.bubbleField.querySelectorAll('.bubble');
    var target = null;
    for (var i = 0; i < bubbles.length; i += 1) {
      if (Number(bubbles[i].getAttribute('data-value')) === state.round.eq.answer) {
        target = bubbles[i];
        break;
      }
    }
    if (target) {
      target.classList.add('hint-glow');
      var card = document.createElement('div');
      card.className = 'bubble-tip';
      card.innerHTML = tip.html + '<div class="tip-words">' + tip.words + '</div>';
      target.appendChild(card);
      setTimeout(function () { card.classList.add('visible'); }, 30);
      setTimeout(function () {
        card.classList.remove('visible');
        target.classList.remove('hint-glow');
        setTimeout(function () { if (card.parentNode) card.parentNode.removeChild(card); }, 250);
      }, 1400);
    }
    setFeedback('tip', 'Bubble hint: ' + tip.words);
  }

  /* ---------- gameplay ---------- */
  function onBubbleTap(bubble) {
    if (state.locked || !state.round) return;
    var val = Number(bubble.getAttribute('data-value'));
    if (val === state.round.eq.answer) {
      state.locked = true;
      bubble.classList.add('popped');
      state.score += 1;
      state.correct += 1;
      state.streak += 1;
      state.wrongStreak = 0;
      if (state.streak > state.best) state.best = state.streak;
      updateStats();
      saveProgress();
      blip(660, 0.12, 'sine');
      setTimeout(function () { blip(880, 0.14, 'sine'); }, 90);
      var cheer = state.streak >= 3 ? 'Pop! Streak x' + state.streak + ' - on fire!' : 'Pop! +1';
      setFeedback('good', cheer);
      setTimeout(makeRound, 700);
    } else {
      bubble.classList.remove('wobble');
      // Force reflow so the wobble replays on repeated taps.
      void bubble.offsetWidth;
      bubble.classList.add('wobble');
      state.streak = 0;
      state.wrongStreak += 1;
      updateStats();
      blip(220, 0.15, 'triangle');
      if (state.wrongStreak >= 2) {
        state.wrongStreak = 0;
        showTip();
      } else {
        setFeedback('error', 'Not that one - try again!');
      }
      setTimeout(function () { bubble.classList.remove('wobble'); }, 600);
    }
  }

  function updateStats() {
    els.scoreStat.textContent = String(state.score);
    els.streakStat.textContent = String(state.streak);
    els.bestStat.textContent = String(state.best);
  }

  function saveProgress() {
    progressStore.save({
      score: state.score, correct: state.correct,
      streak: state.streak, best: state.best, mode: state.mode
    });
  }

  function loadProgress() {
    var saved = progressStore.load();
    if (saved && typeof saved === 'object') {
      state.score = saved.score || 0;
      state.correct = saved.correct || 0;
      state.best = saved.best || 0;
      if (saved.mode === 'advanced' || saved.mode === 'basic') state.mode = saved.mode;
    }
  }

  /* ---------- mode switching ---------- */
  function setMode(mode) {
    if (state.mode === mode) return;
    state.mode = mode;
    state.streak = 0;
    state.wrongStreak = 0;
    state.warmupRounds = 0;
    var btns = document.querySelectorAll('.mode-btn');
    for (var i = 0; i < btns.length; i += 1) {
      btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-mode') === mode ? 'true' : 'false');
    }
    updateStats();
    saveProgress();
    makeRound();
  }

  /* ---------- worksheet ---------- */
  function makeWorksheetEquation(limit) {
    var eq = makeEquation(limit);
    var parts = eq.text.map(function (tok) {
      return tok === '?' ? '____' : String(tok);
    });
    return { problem: parts.join(' '), answer: String(eq.answer) };
  }

  function generateWorksheet() {
    var limit = Number(els['range-select'].value);
    var count = Number(els['count-select'].value);
    var seen = {};
    var out = '';
    var made = 0;
    var tries = 0;
    while (made < count && tries < 600) {
      tries += 1;
      var w = makeWorksheetEquation(limit);
      if (seen[w.problem]) continue;
      seen[w.problem] = true;
      made += 1;
      out += '<div class="sheet-problem"><span>' + w.problem + '</span><span class="sheet-answer">' + w.answer + '</span></div>';
    }
    els['worksheet-grid'].innerHTML = out;
  }

  /* ---------- wiring ---------- */
  document.querySelectorAll('.mode-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { setMode(btn.getAttribute('data-mode')); });
  });
  els.tipBtn.addEventListener('click', showTip);
  els['generate-btn'].addEventListener('click', generateWorksheet);
  els['answers-toggle'].addEventListener('change', function (event) {
    els.sheet.classList.toggle('show-answers', event.target.checked);
  });

  loadProgress();
  // Reflect a restored advanced mode on the buttons.
  (function () {
    var btns = document.querySelectorAll('.mode-btn');
    for (var i = 0; i < btns.length; i += 1) {
      btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-mode') === state.mode ? 'true' : 'false');
    }
  })();
  updateStats();
  generateWorksheet();
  makeRound();
})();
`;
