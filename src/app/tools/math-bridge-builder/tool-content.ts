// Merged from the Bridge Builder game; do not hand-edit.
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
  --sky-1: #bfe3fb;
  --sky-2: #eaf6ff;
  --river: #3d9bd6;
  --river-dark: #1f6ea3;
  --grass: #7cc46a;
  --grass-dark: #4f9a44;
  --wood: #c98d4e;
  --wood-dark: #9a6530;
  --gold: #f2c94c;
  --green: #1c8b66;
  --green-dark: #14664b;
  --green-soft: #dff2e5;
  --blue: #126b8b;
  --blue-dark: #0d4f66;
  --blue-soft: #dff2f8;
  --coral: #d6543f;
  --coral-dark: #a83d2d;
  --coral-soft: #fde8e3;
  --yellow: #f2c94c;
  --yellow-soft: #fdf3d7;
  --shadow: 0 12px 30px rgba(34, 73, 60, .10);
  --radius-lg: 24px;
  --radius-md: 16px;
  --radius-sm: 10px;
}
.dark .math-tool{
  --sky-1: #123a52;
  --sky-2: #0d2a3d;
  --river: #2a7ab0;
  --river-dark: #1a5a86;
  --grass: #3f7a3a;
  --grass-dark: #2c5a29;
  --wood: #a5763f;
  --wood-dark: #7a5427;
  --green-soft: #1d4432;
  --blue-soft: #173d4a;
  --coral-soft: #4d2924;
  --yellow-soft: #4a3d17;
  --shadow: 0 12px 30px rgba(0, 0, 0, .25);
}
.math-tool .bridge-shell{ max-width: 880px; margin: 0 auto; padding: 8px 4px 0; }
.math-tool .game-head{ text-align: center; margin: 10px 0 18px; }
.math-tool .game-kicker{
  display: inline-block; font-size: .72rem; font-weight: 800; letter-spacing: .14em;
  text-transform: uppercase; color: var(--blue-dark); background: var(--blue-soft);
  border: 1px solid var(--blue); border-radius: 999px; padding: 4px 14px; margin-bottom: 10px;
}
.dark .math-tool .game-kicker{ color: var(--blue); }
.math-tool .game-head h1{
  margin: 0 0 8px; font-family: "Poppins", system-ui, sans-serif;
  font-size: clamp(1.7rem, 4.5vw, 2.4rem); font-weight: 800;
}
.math-tool .game-head p{ margin: 0 auto; max-width: 34rem; color: var(--muted); font-size: .98rem; line-height: 1.5; }
.math-tool .mode-row{ display: flex; gap: 10px; justify-content: center; margin-bottom: 14px; flex-wrap: wrap; }
.math-tool .mode-btn{
  appearance: none; cursor: pointer; font: inherit; border: 2px solid var(--line);
  background: var(--panel); color: var(--ink); border-radius: 14px; padding: 8px 18px;
  font-weight: 800; font-size: .95rem; display: grid; gap: 2px; min-width: 150px;
}
.math-tool .mode-btn small{ font-weight: 600; font-size: .75rem; color: var(--muted); }
.math-tool .mode-btn[aria-pressed="true"]{ border-color: var(--blue); background: var(--blue-soft); }
.math-tool .stats{ display: flex; gap: 10px; justify-content: center; margin-bottom: 14px; flex-wrap: wrap; }
.math-tool .stat{
  background: var(--panel); border: 1px solid var(--line); border-radius: 14px;
  padding: 8px 18px; font-weight: 700; font-size: .9rem; box-shadow: var(--shadow);
  display: flex; align-items: center; gap: 8px;
}
.math-tool .stat b{ font-size: 1.15rem; font-family: "Poppins", system-ui, sans-serif; }
.math-tool .best-line{ text-align: center; color: var(--muted); font-size: .82rem; margin: -6px 0 12px; }

/* ---------- scene ---------- */
.math-tool .scene{
  position: relative; border-radius: var(--radius-lg); overflow: hidden;
  background: linear-gradient(180deg, var(--sky-1) 0%, var(--sky-2) 46%, var(--river) 46.5%, var(--river-dark) 100%);
  border: 1px solid var(--line); box-shadow: var(--shadow); margin-bottom: 16px;
}
.math-tool .scene-top{ display: flex; justify-content: space-between; align-items: stretch; padding: 14px 14px 0; }
.math-tool .bank{
  flex: 0 0 22%; background: linear-gradient(180deg, var(--grass), var(--grass-dark));
  border-radius: 14px 14px 0 0; padding: 10px 6px; text-align: center; min-height: 118px;
  display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 6px;
}
.math-tool .bank-label{ font-size: .68rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.92); text-shadow: 0 1px 2px rgba(0,0,0,.25); }
.math-tool .waiting{ display: flex; flex-wrap: wrap; gap: 2px 4px; justify-content: center; font-size: 1.5rem; line-height: 1.2; }
.math-tool .home{ font-size: 2.2rem; line-height: 1; }
.math-tool .home-sub{ font-size: .68rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.92); text-shadow: 0 1px 2px rgba(0,0,0,.25); }
.math-tool .river-zone{ flex: 1; padding: 6px 8px 0; display: flex; flex-direction: column; }
.math-tool .plank-row{ display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; align-items: end; padding-top: 26px; }
.math-tool .plank-slot{ position: relative; min-height: 86px; display: flex; align-items: flex-end; justify-content: center; }
.math-tool .plank-slot .slot-outline{
  width: 100%; height: 16px; border: 2px dashed rgba(255,255,255,.75); border-radius: 8px;
  position: absolute; bottom: 8px; left: 0;
}
.math-tool .plank-slot .plank{
  display: none; width: 100%; height: 20px; border-radius: 8px; position: absolute; bottom: 6px; left: 0;
  background: repeating-linear-gradient(90deg, var(--wood) 0 10px, var(--wood-dark) 10px 12px);
  border: 2px solid var(--wood-dark); box-shadow: 0 3px 0 rgba(0,0,0,.18);
}
.math-tool .plank-slot.filled .plank{ display: block; animation: plank-drop .35s ease; }
.math-tool .plank-slot.filled .slot-outline{ display: none; }
.math-tool .plank-slot .animal{
  position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(14px) scale(.6);
  font-size: 1.7rem; opacity: 0; transition: opacity .3s ease, transform .3s ease; line-height: 1;
}
.math-tool .plank-slot.filled .animal{ opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
.math-tool .plank-slot.wobbling .plank{ display: block; opacity: .85; animation: plank-wobble .5s ease 2; }
@keyframes plank-drop{ 0%{ transform: translateY(-26px); opacity: 0; } 100%{ transform: translateY(0); opacity: 1; } }
@keyframes plank-wobble{ 0%,100%{ transform: rotate(0); } 25%{ transform: rotate(-7deg); } 75%{ transform: rotate(7deg); } }

/* pier sign (drawing tip) */
.math-tool .pier-sign{ display: flex; justify-content: center; padding: 2px 0 12px; }
.math-tool .pier-board{
  background: linear-gradient(180deg, var(--wood), var(--wood-dark)); border: 3px solid var(--wood-dark);
  border-radius: 14px; padding: 10px 14px; max-width: 460px; width: 100%;
  box-shadow: 0 6px 0 rgba(0,0,0,.18); color: #fff8ec;
  max-height: 0; opacity: 0; overflow: hidden; padding-top: 0; padding-bottom: 0; border-width: 0;
  transition: max-height .3s ease, opacity .3s ease, padding .3s ease, border-width .3s ease;
}
.math-tool .pier-board.visible{ max-height: 320px; opacity: 1; padding: 10px 14px; border-width: 3px; }
.math-tool .pier-board .tip-draw{ background: rgba(255,255,255,.94); border-radius: 10px; padding: 8px; display: flex; justify-content: center; }
.math-tool .pier-board .tip-caption{ margin: 8px 2px 2px; font-size: .85rem; font-weight: 700; text-align: center; color: #fff8ec; text-shadow: 0 1px 2px rgba(0,0,0,.3); }

/* celebration */
.math-tool .celebration{
  display: none; text-align: center; padding: 14px 12px 18px;
  background: linear-gradient(180deg, rgba(255,255,255,.0), rgba(242,201,76,.28));
}
.math-tool .celebration.show{ display: block; }
.math-tool .celebration h2{ margin: 0 0 6px; font-family: "Poppins", system-ui, sans-serif; font-size: 1.4rem; }
.math-tool .celebration p{ margin: 0 0 12px; color: var(--ink); font-weight: 600; }
.math-tool .celebration .parade{ font-size: 2rem; letter-spacing: 6px; animation: parade-bounce 1s ease infinite; }
@keyframes parade-bounce{ 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(-8px); } }
.math-tool .confetti{ position: absolute; top: -12px; width: 10px; height: 14px; border-radius: 2px; z-index: 5; animation: confetti-fall 2.6s ease-in forwards; pointer-events: none; }
@keyframes confetti-fall{ to{ transform: translateY(420px) rotate(720deg); opacity: 0; } }

/* ---------- problem card ---------- */
.math-tool .problem-card{
  background: var(--panel); border: 1px solid var(--line); border-radius: var(--radius-lg);
  box-shadow: var(--shadow); padding: 20px 18px; margin-bottom: 12px;
}
.math-tool .problem-row{ display: flex; gap: 12px; align-items: flex-start; margin-bottom: 14px; }
.math-tool .problem-text{
  flex: 1; margin: 0; font-size: 1.15rem; line-height: 1.55; font-weight: 600;
}
.math-tool .speak-btn{
  flex: 0 0 auto; appearance: none; cursor: pointer; width: 52px; height: 52px; border-radius: 50%;
  border: 2px solid var(--blue); background: var(--blue-soft); font-size: 1.5rem; line-height: 1;
  display: flex; align-items: center; justify-content: center;
}
.math-tool .speak-btn:hover{ background: var(--blue); }
.math-tool .speak-btn.speaking{ animation: speak-pulse 1s ease infinite; }
@keyframes speak-pulse{ 0%,100%{ transform: scale(1); } 50%{ transform: scale(1.12); } }
.math-tool .answer-row{ display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 12px; }
.math-tool .answer-input{
  font: inherit; font-size: 1.5rem; font-weight: 800; text-align: center; width: 130px;
  padding: 10px 8px; border-radius: 12px; border: 2px solid var(--line);
  background: var(--paper); color: var(--ink);
}
.math-tool .answer-input:focus{ outline: none; border-color: var(--blue); box-shadow: 0 0 0 3px var(--blue-soft); }
.math-tool .primary{
  appearance: none; border: none; cursor: pointer; font: inherit; font-weight: 800; font-size: 1rem;
  color: #fff; background: var(--blue); padding: 12px 26px; border-radius: 12px;
  box-shadow: 0 4px 0 var(--blue-dark); transition: transform .1s ease, box-shadow .1s ease;
}
.math-tool .primary:active{ transform: translateY(3px); box-shadow: 0 1px 0 var(--blue-dark); }
.math-tool .tip-btn{
  appearance: none; border: 2px dashed var(--line); background: transparent; color: var(--muted);
  font: inherit; font-size: .88rem; font-weight: 700; border-radius: 999px; padding: 10px 18px; cursor: pointer;
}
.math-tool .tip-btn:hover{ color: var(--blue-dark); border-color: var(--blue); }
.math-tool .keypad{ display: grid; grid-template-columns: repeat(3, minmax(0, 76px)); gap: 8px; justify-content: start; }
.math-tool .key-btn{
  appearance: none; cursor: pointer; font: inherit; font-weight: 800; font-size: 1.25rem;
  border: 1px solid var(--line); background: var(--panel-2); color: var(--ink);
  border-radius: 12px; padding: 10px 0;
}
.math-tool .key-btn:active{ transform: scale(.94); }
.math-tool .key-btn.fn{ font-size: 1rem; background: var(--yellow-soft); }

/* feedback */
.math-tool .feedback{ min-height: 60px; display: flex; align-items: center; justify-content: center; margin: 6px 0 4px; text-align: center; }
.math-tool .feedback-text{
  font-weight: 700; font-size: 1.02rem; background: var(--panel);
  border: 1px solid var(--line); border-radius: 999px; padding: 8px 20px;
  box-shadow: var(--shadow); transition: background .15s ease; max-width: 100%;
}
.math-tool .feedback.good .feedback-text{ background: var(--green-soft); border-color: var(--green); color: var(--green-dark); }
.dark .math-tool .feedback.good .feedback-text{ color: var(--green); }
.math-tool .feedback.error .feedback-text{ background: var(--coral-soft); border-color: var(--coral); color: var(--coral-dark); }
.dark .math-tool .feedback.error .feedback-text{ color: var(--coral); }
.math-tool .game-controls{ display: flex; gap: 10px; justify-content: center; margin: 4px 0 8px; flex-wrap: wrap; }
.math-tool .ghost-btn{
  appearance: none; cursor: pointer; font: inherit; font-weight: 700; font-size: .9rem;
  border: 1px solid var(--line); background: var(--panel); color: var(--ink);
  border-radius: 12px; padding: 9px 18px;
}
.math-tool .ghost-btn:hover{ border-color: var(--blue); color: var(--blue-dark); }

/* tip drawings */
.math-tool .piles{ display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; }
.math-tool .pile{ text-align: center; }
.math-tool .pile-n{ font-weight: 800; color: #15211e; font-size: .9rem; margin-top: 2px; }
.math-tool .pile-plus{ font-size: 1.4rem; font-weight: 800; color: #9a6530; }
.math-tool .share-row{ display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; align-items: flex-start; }
.math-tool .share-box{ border: 2px dashed #9a6530; border-radius: 10px; padding: 6px; text-align: center; background: rgba(255,255,255,.6); }
.math-tool .share-box .box-n{ font-size: .72rem; font-weight: 800; color: #9a6530; text-transform: uppercase; letter-spacing: .06em; }
.math-tool .compare-rows{ display: grid; gap: 8px; justify-items: center; }

/* ---------- worksheet (mirrors the other math games) ---------- */
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
.math-tool .sheet-problem.story{ font-size: .98rem; font-weight: 600; min-height: 76px; line-height: 1.45; }
.math-tool .sheet-answer{ display: none; margin-left: auto; color: #1c8b66; flex: 0 0 auto; padding-left: 10px; }
.math-tool .sheet.show-answers .sheet-answer{ display: inline; }
.math-tool .answer-key-label{ display: none; margin: 26px 0 8px; font-weight: 800; }
.math-tool .sheet.show-answers .answer-key-label{ display: block; }

@media (max-width: 560px){
  .math-tool .bank{ min-height: 96px; }
  .math-tool .waiting{ font-size: 1.15rem; }
  .math-tool .plank-slot{ min-height: 70px; }
  .math-tool .plank-slot .animal{ font-size: 1.35rem; bottom: 24px; }
  .math-tool .problem-grid{ grid-template-columns: 1fr; }
  .math-tool .problem-text{ font-size: 1.02rem; }
  .math-tool .answer-input{ width: 104px; font-size: 1.3rem; }
  .math-tool .keypad{ grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .math-tool .generator .controls{ flex-direction: column; align-items: stretch; }
  .math-tool .generator .controls > *{ min-width: 0; width: 100%; max-width: 100%; }
  .math-tool .generator .controls select{ width: 100%; }
}
@media print{
  .math-tool .bridge-shell, .math-tool .generator .controls, .math-tool .toggle-row,
  .math-tool .print-note, .math-tool .ws-head{ display: none !important; }
  .math-tool .worksheet-wrap{ border: none; box-shadow: none; padding: 0; margin: 0; }
  .math-tool{ background: #fff !important; color: #000 !important; font-size: 12pt; }
}
@media (prefers-reduced-motion: reduce){
  .math-tool .plank-slot.filled .plank, .math-tool .plank-slot.wobbling .plank,
  .math-tool .celebration .parade, .math-tool .confetti{ animation: none; }
}
`;

export const MATH_TOOL_HTML = `
<main class="bridge-shell">
  <div class="game-head">
    <span class="game-kicker">Kids math game</span>
    <h1>Bridge Builder</h1>
    <p>Read the story problem and solve it. Each correct answer lays a bridge plank — help all six animals cross the river!</p>
  </div>

  <div class="mode-row" role="group" aria-label="Difficulty">
    <button class="mode-btn" type="button" data-mode="basic" aria-pressed="true">Basic<small>Stories within 20</small></button>
    <button class="mode-btn" type="button" data-mode="advanced" aria-pressed="false">Advanced<small>Stories within 100</small></button>
  </div>

  <div class="stats" aria-live="polite">
    <div class="stat">🏆 Score <b id="scoreStat">0</b></div>
    <div class="stat">🔥 Streak <b id="streakStat">0</b></div>
    <div class="stat">🌉 Bridge <b id="bridgeStat">0/6</b></div>
  </div>
  <p class="best-line" id="bestLine"></p>

  <div class="scene" id="scene" aria-label="River scene">
    <div class="scene-top">
      <div class="bank bank-left">
        <span class="bank-label">Waiting</span>
        <div class="waiting" id="waitingRow"></div>
      </div>
      <div class="river-zone">
        <div class="plank-row" id="plankRow"></div>
        <div class="pier-sign">
          <div class="pier-board" id="pierBoard">
            <div class="tip-draw" id="tipDrawing" aria-hidden="true"></div>
            <p class="tip-caption" id="tipCaption"></p>
          </div>
        </div>
      </div>
      <div class="bank bank-right">
        <span class="home" role="img" aria-label="Home">🏠</span>
        <span class="home-sub">Home</span>
      </div>
    </div>
    <div class="celebration" id="celebration">
      <h2>🎉 Bridge complete!</h2>
      <p id="celebText">All the animals are home. Great building!</p>
      <div class="parade" id="parade" aria-hidden="true"></div>
      <p><button class="primary" id="newBridgeBtn" type="button">Build a new bridge</button></p>
    </div>
  </div>

  <div class="problem-card">
    <div class="problem-row">
      <p class="problem-text" id="problemText" data-answer=""></p>
      <button class="speak-btn" id="speakBtn" type="button" aria-label="Read the problem aloud">🔊</button>
    </div>
    <div class="answer-row">
      <input class="answer-input" id="answerInput" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" aria-label="Your answer" placeholder="?" />
      <button class="primary" id="submitBtn" type="button">Check ✓</button>
      <button class="tip-btn" id="tipBtn" type="button">💡 Need a hint?</button>
    </div>
    <div class="keypad" id="keypad" aria-label="Number pad">
      <button class="key-btn" type="button" data-key="1">1</button>
      <button class="key-btn" type="button" data-key="2">2</button>
      <button class="key-btn" type="button" data-key="3">3</button>
      <button class="key-btn" type="button" data-key="4">4</button>
      <button class="key-btn" type="button" data-key="5">5</button>
      <button class="key-btn" type="button" data-key="6">6</button>
      <button class="key-btn" type="button" data-key="7">7</button>
      <button class="key-btn" type="button" data-key="8">8</button>
      <button class="key-btn" type="button" data-key="9">9</button>
      <button class="key-btn fn" type="button" data-key="clear">⌫</button>
      <button class="key-btn" type="button" data-key="0">0</button>
      <button class="key-btn fn" type="button" data-key="go">⏎</button>
    </div>
  </div>

  <div class="feedback" id="feedback"><span class="feedback-text" id="feedbackText">Tap 🔊 to hear the story, then solve it!</span></div>

  <div class="game-controls">
    <button class="ghost-btn" id="skipBtn" type="button">Skip this story ⏭</button>
  </div>

  <div class="worksheet-wrap">
    <div class="ws-head">
      <h2>🖨️ Printable worksheet</h2>
      <p>Story problems on paper — great for the classroom or the fridge door.</p>
    </div>
    <div class="generator">
      <div class="controls">
        <label>Problems
          <select id="ws-count">
            <option value="10" selected>10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </label>
        <button class="primary" id="generate-btn" type="button">Generate</button>
        <button class="ghost-btn" id="print-btn" type="button">Print</button>
      </div>
      <label class="toggle-row"><input type="checkbox" id="answer-key-toggle" /> Show answer key</label>
      <p class="print-note">Tip: use your browser's print dialog to save as PDF.</p>
      <div id="worksheet-grid"></div>
    </div>
  </div>
</main>
`;

export const MATH_TOOL_JS = `
(function () {
  'use strict';

  var PLANKS_NEEDED = 6;
  var ANIMALS = ['\\uD83D\\uDC30', '\\uD83D\\uDC3B', '\\uD83D\\uDC3C', '\\uD83E\\uDD8A', '\\uD83D\\uDC38', '\\uD83D\\uDC35'];
  var STORE_KEY = 'kids-math-bridge-builder-progress';

  var state = {
    mode: 'basic',
    planks: 0,
    score: 0,
    streak: 0,
    wrongs: 0,
    typeIndex: 0,
    problem: null
  };

  var store = loadStore();
  state.mode = store.mode === 'advanced' ? 'advanced' : 'basic';
  state.score = store.score || 0;

  /* ---------------- helpers ---------------- */
  function $(id) { return document.getElementById(id); }
  function ri(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function loadStore() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (raw) { var p = JSON.parse(raw); return { score: p.score || 0, best: p.best || 0, bridges: p.bridges || 0, mode: p.mode || 'basic' }; }
    } catch (e) { /* storage unavailable */ }
    return { score: 0, best: 0, bridges: 0, mode: 'basic' };
  }
  function saveStore() {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* ignore */ }
  }

  /* ---------------- word problems ---------------- */
  /* Each gen() returns { text, answer, draw, caption }.
     draw kinds: piles | take | compare | groups | share */
  var BASIC_TYPES = [
    { // add-to (result unknown)
      gen: function () {
        var a = ri(2, 9), b = ri(2, 9 - 0);
        if (a + b > 18) { b = Math.max(2, 18 - a); }
        var item = pick(['\\uD83C\\uDF4E', '\\uD83C\\uDF50', '\\uD83C\\uDF4A', '\\u2B50']);
        return {
          text: 'There are ' + a + ' ' + item + ' in the basket. Mom puts in ' + b + ' more. How many are there in all?',
          answer: a + b,
          draw: { kind: 'piles', piles: [[a, '#e2574c'], [b, '#4c8de2']] },
          caption: 'Count all the dots together!'
        };
      }
    },
    { // put-together
      gen: function () {
        var a = ri(2, 9), b = ri(2, 9);
        if (a + b > 18) { b = Math.max(2, 18 - a); }
        return {
          text: 'There are ' + a + ' oatmeal cookies \\uD83C\\uDF6A and ' + b + ' chocolate cookies \\uD83C\\uDF6B on the plate. How many cookies in all?',
          answer: a + b,
          draw: { kind: 'piles', piles: [[a, '#c98d4e'], [b, '#6b4a2f']] },
          caption: 'Two piles — count every cookie!'
        };
      }
    },
    { // take-from (result unknown)
      gen: function () {
        var a = ri(7, 18), b = ri(2, a - 3);
        return {
          text: a + ' \\uD83D\\uDC26 birds are sitting in the tree. ' + b + ' fly away. How many birds are left?',
          answer: a - b,
          draw: { kind: 'take', total: a, cross: b, color: '#4c8de2' },
          caption: 'Cross out the birds that flew away, then count what is left!'
        };
      }
    },
    { // take-apart
      gen: function () {
        var a = ri(7, 18), b = ri(2, a - 3);
        return {
          text: 'There are ' + a + ' marbles. ' + b + ' are red \\uD83D\\uDD34 and the rest are blue \\uD83D\\uDD35. How many are blue?',
          answer: a - b,
          draw: { kind: 'piles', piles: [[b, '#e2574c'], [a - b, '#4c8de2']] },
          caption: 'Red and blue together make all the marbles. Count the blue dots!'
        };
      }
    },
    { // compare (difference unknown)
      gen: function () {
        var a = ri(6, 15), b = ri(2, a - 3);
        return {
          text: 'There are ' + a + ' red flowers \\uD83C\\uDF3A and ' + b + ' yellow flowers \\uD83C\\uDF3C by the river. How many more red flowers than yellow flowers?',
          answer: a - b,
          draw: { kind: 'compare', a: a, b: b },
          caption: 'Match them up — count the gold-ringed dots left over!'
        };
      }
    }
  ];

  var ADV_TYPES = [
    { // equal groups (multiplication)
      gen: function () {
        var g = ri(2, 5), n = ri(3, 9);
        return {
          text: 'The bridge has ' + g + ' piers. Each pier needs ' + n + ' planks. How many planks in all?',
          answer: g * n,
          draw: { kind: 'groups', groups: g, per: n },
          caption: 'Count the dots in every pier, then add them up!'
        };
      }
    },
    { // division (sharing)
      gen: function () {
        var d = ri(2, 5), per = ri(3, 9);
        var t = d * per;
        return {
          text: 'The builder has ' + t + ' planks. She shares them equally among ' + d + ' piers. How many planks does each pier get?',
          answer: per,
          draw: { kind: 'share', total: t, boxes: d },
          caption: 'Deal the dots out one by one into each pier!'
        };
      }
    },
    { // two-step
      gen: function () {
        var a = ri(10, 30), b = ri(5, 20), c = ri(3, 12);
        if (a + b - c <= 0) { c = Math.max(1, Math.floor((a + b) / 2)); }
        return {
          text: 'The builder has ' + a + ' planks. She buys ' + b + ' more, then uses ' + c + ' planks. How many planks are left?',
          answer: a + b - c,
          draw: { kind: 'take', total: a + b, cross: c, color: '#c98d4e' },
          caption: 'First add them all, then cross out the used ones!'
        };
      }
    },
    { // compare, bigger numbers
      gen: function () {
        var a = ri(16, 36), b = ri(8, a - 8);
        return {
          text: a + ' ducks \\uD83E\\uDD86 and ' + b + ' frogs \\uD83D\\uDC38 live by the river. How many more ducks than frogs?',
          answer: a - b,
          draw: { kind: 'compare', a: a, b: b },
          caption: 'Match them up — count the gold-ringed dots left over!'
        };
      }
    }
  ];

  /* ---------------- tip drawings (SVG, visuals first) ---------------- */
  function layoutDots(count) {
    var perRow = 10, r = 9, gap = 24, pad = 14;
    var rows = Math.ceil(count / perRow), cols = Math.min(count, perRow);
    var w = pad * 2 + (cols - 1) * gap, h = pad * 2 + (rows - 1) * gap;
    var pts = [];
    for (var i = 0; i < count; i++) {
      pts.push([pad + (i % perRow) * gap, pad + Math.floor(i / perRow) * gap]);
    }
    return { pts: pts, w: w, h: h, r: r };
  }
  function svgWrap(w, h, inner) {
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-hidden="true">' + inner + '</svg>';
  }
  function dotsSVG(count, color, cross) {
    var L = layoutDots(count), s = '';
    for (var i = 0; i < L.pts.length; i++) {
      var p = L.pts[i];
      s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + L.r + '" fill="' + color + '" stroke="rgba(0,0,0,.25)"/>';
      if (cross && i < cross) {
        var x = L.r * 0.7;
        s += '<line x1="' + (p[0] - x) + '" y1="' + (p[1] - x) + '" x2="' + (p[0] + x) + '" y2="' + (p[1] + x) + '" stroke="#d6543f" stroke-width="3" stroke-linecap="round"/>';
        s += '<line x1="' + (p[0] + x) + '" y1="' + (p[1] - x) + '" x2="' + (p[0] - x) + '" y2="' + (p[1] + x) + '" stroke="#d6543f" stroke-width="3" stroke-linecap="round"/>';
      }
    }
    return svgWrap(L.w, L.h, s);
  }
  function pilesSVG(piles) {
    var parts = [];
    for (var i = 0; i < piles.length; i++) {
      if (i > 0) parts.push('<div class="pile-plus">+</div>');
      parts.push('<div class="pile">' + dotsSVG(piles[i][0], piles[i][1], 0) + '<div class="pile-n">' + piles[i][0] + '</div></div>');
    }
    return '<div class="piles">' + parts.join('') + '</div>';
  }
  function boxesSVG(boxCount, perBox, label) {
    var parts = [];
    for (var i = 0; i < boxCount; i++) {
      parts.push('<div class="share-box"><div class="box-n">' + label + ' ' + (i + 1) + '</div>' + dotsSVG(perBox, '#4c8de2', 0) + '</div>');
    }
    return '<div class="share-row">' + parts.join('') + '</div>';
  }
  function compareSVG(a, b) {
    var r = 9, gap = 24, pad = 14, perRow = 10;
    function row(n, color, highlightLast) {
      var rows = Math.ceil(n / perRow), cols = Math.min(n, perRow);
      var w = pad * 2 + (cols - 1) * gap, h = pad * 2 + (rows - 1) * gap, s = '';
      for (var i = 0; i < n; i++) {
        var x = pad + (i % perRow) * gap, y = pad + Math.floor(i / perRow) * gap;
        var hl = highlightLast && i >= n - highlightLast;
        s += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + color + '"' +
          (hl ? ' stroke="#f2c94c" stroke-width="4"' : ' stroke="rgba(0,0,0,.25)"') + '/>';
      }
      return svgWrap(w, h, s);
    }
    return '<div class="compare-rows">' + row(a, '#e2574c', a - b) + row(b, '#4c8de2', 0) + '</div>';
  }
  function renderTip(draw) {
    var html = '';
    if (draw.kind === 'piles') html = pilesSVG(draw.piles);
    else if (draw.kind === 'take') html = dotsSVG(draw.total, draw.color || '#4c8de2', draw.cross);
    else if (draw.kind === 'compare') html = compareSVG(draw.a, draw.b);
    else if (draw.kind === 'groups') html = boxesSVG(draw.groups, draw.per, 'pier');
    else if (draw.kind === 'share') html = boxesSVG(draw.boxes, Math.round(draw.total / draw.boxes), 'pier');
    return html;
  }

  /* ---------------- rendering ---------------- */
  function buildScene() {
    var row = $('plankRow'), html = '';
    for (var i = 0; i < PLANKS_NEEDED; i++) {
      html += '<div class="plank-slot" data-slot="' + i + '"><span class="slot-outline"></span>' +
        '<span class="plank"></span><span class="animal">' + ANIMALS[i] + '</span></div>';
    }
    row.innerHTML = html;
    renderScene();
  }
  function renderScene() {
    var slots = document.querySelectorAll('#plankRow .plank-slot');
    for (var i = 0; i < slots.length; i++) {
      if (i < state.planks) slots[i].classList.add('filled');
      else slots[i].classList.remove('filled');
    }
    var waiting = [];
    for (var j = state.planks; j < ANIMALS.length; j++) waiting.push(ANIMALS[j]);
    $('waitingRow').textContent = waiting.join(' ');
    $('bridgeStat').textContent = state.planks + '/' + PLANKS_NEEDED;
  }
  function updateStats() {
    $('scoreStat').textContent = String(state.score);
    $('streakStat').textContent = String(state.streak);
    $('bestLine').textContent = 'Best streak: ' + (store.best || 0) + '  ·  Bridges built: ' + (store.bridges || 0);
  }
  function setFeedback(msg, kind) {
    var box = $('feedback');
    box.className = 'feedback' + (kind ? ' ' + kind : '');
    $('feedbackText').textContent = msg;
  }
  function showTip() {
    if (!state.problem) return;
    $('tipDrawing').innerHTML = renderTip(state.problem.draw);
    $('tipCaption').textContent = state.problem.caption;
    $('pierBoard').classList.add('visible');
  }
  function hideTip() {
    $('pierBoard').classList.remove('visible');
  }

  /* ---------------- game flow ---------------- */
  function nextProblem() {
    var types = state.mode === 'advanced' ? ADV_TYPES : BASIC_TYPES;
    var type = types[state.typeIndex % types.length];
    state.typeIndex += 1;
    state.problem = type.gen();
    state.wrongs = 0;
    var pt = $('problemText');
    pt.textContent = state.problem.text;
    pt.setAttribute('data-answer', String(state.problem.answer));
    $('answerInput').value = '';
    hideTip();
    setFeedback('Tap \\uD83D\\uDD0A to hear the story, then solve it!', '');
  }
  function newBridge() {
    state.planks = 0;
    state.typeIndex = 0;
    $('celebration').classList.remove('show');
    renderScene();
    nextProblem();
  }
  var GOOD_MSGS = [
    'Great building! A new plank is down! \\uD83E\\uDEB5',
    'Awesome! The bridge is growing! \\uD83C\\uDF09',
    'Perfect! An animal trots across! \\uD83D\\uDC3E',
    'Super work! The bridge keeps growing! \\uD83D\\uDCAA'
  ];
  function onCorrect() {
    state.planks += 1;
    state.score += 1;
    state.streak += 1;
    if (state.streak > (store.best || 0)) store.best = state.streak;
    store.score = state.score;
    saveStore();
    renderScene();
    updateStats();
    setFeedback(pick(GOOD_MSGS), 'good');
    if (state.planks >= PLANKS_NEEDED) {
      celebrate();
    } else {
      setTimeout(nextProblem, 750);
    }
  }
  function onWrong() {
    state.streak = 0;
    state.wrongs += 1;
    saveStore();
    updateStats();
    // wobble the next loose plank
    var slots = document.querySelectorAll('#plankRow .plank-slot');
    var next = slots[state.planks];
    if (next) {
      next.classList.add('wobbling');
      (function (el) { setTimeout(function () { el.classList.remove('wobbling'); }, 1100); })(next);
    }
    showTip();
    if (state.wrongs >= 2) {
      setFeedback('No worries! Count the dots on the wooden sign — you\\u2019ve got this! \\uD83D\\uDCAA', 'error');
    } else {
      setFeedback('Oops \\u2014 the plank wobbles! Look at the drawing, then try again.', 'error');
    }
    $('answerInput').value = '';
    $('answerInput').focus();
  }
  function check() {
    var raw = $('answerInput').value.trim();
    if (!/^\\d+$/.test(raw)) {
      setFeedback('Type a number first! \\uD83D\\uDD22', 'tip');
      return;
    }
    if (!state.problem) return;
    if (parseInt(raw, 10) === state.problem.answer) onCorrect();
    else onWrong();
  }
  function celebrate() {
    store.bridges = (store.bridges || 0) + 1;
    saveStore();
    updateStats();
    $('parade').textContent = ANIMALS.join(' ');
    $('celebText').textContent = 'All six animals are home. Score: ' + state.score + ' — great building!';
    $('celebration').classList.add('show');
    setFeedback('Bridge complete! \\uD83C\\uDF89', 'good');
    confetti();
  }
  function confetti() {
    var scene = $('scene');
    var colors = ['#f2c94c', '#e2574c', '#4c8de2', '#1c8b66', '#b678e2'];
    for (var i = 0; i < 50; i++) {
      var c = document.createElement('span');
      c.className = 'confetti';
      c.style.left = (Math.random() * 100) + '%';
      c.style.background = colors[i % colors.length];
      c.style.animationDelay = (Math.random() * 0.8) + 's';
      scene.appendChild(c);
      (function (el) {
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3600);
      })(c);
    }
  }

  /* ---------------- speech ---------------- */
  function speak() {
    var text = state.problem ? state.problem.text : '';
    if (!text) return;
    try {
      if (typeof window.speechSynthesis === 'undefined' || typeof window.SpeechSynthesisUtterance === 'undefined') {
        setFeedback('Sorry, reading aloud is not available in this browser.', 'tip');
        return;
      }
      window.speechSynthesis.cancel();
      var u = new window.SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.95;
      var btn = $('speakBtn');
      u.onstart = function () { btn.classList.add('speaking'); };
      var done = function () { btn.classList.remove('speaking'); };
      u.onend = done;
      u.onerror = done;
      window.speechSynthesis.speak(u);
    } catch (e) { /* no-op */ }
  }

  /* ---------------- worksheet ---------------- */
  function sheetProblem() {
    var types = state.mode === 'advanced' ? ADV_TYPES : BASIC_TYPES;
    return pick(types).gen();
  }
  function applyAnswerKey() {
    var sheet = $('sheet');
    var on = $('answer-key-toggle').checked;
    if (sheet) sheet.classList.toggle('show-answers', on);
  }
  function generateWorksheet() {
    var count = parseInt($('ws-count').value, 10) || 10;
    var html = '<div class="sheet" id="sheet">' +
      '<div class="sheet-head"><h3>Bridge Builder Worksheet</h3>' +
      '<div class="name-line"><span>Name</span><span class="name-blank"></span>' +
      '<span>Date</span><span class="name-blank"></span>' +
      '<span>Score</span><span class="name-blank" style="flex:0 1 56px;min-width:40px"></span></div></div>' +
      '<div class="problem-grid">';
    for (var i = 0; i < count; i++) {
      var p = sheetProblem();
      html += '<div class="sheet-problem story"><span>' + escapeHtml(p.text) + '</span>' +
        '<span class="sheet-answer">' + p.answer + '</span></div>';
    }
    html += '</div><p class="answer-key-label">Answer key</p></div>';
    $('worksheet-grid').innerHTML = html;
    applyAnswerKey();
  }

  /* ---------------- events & init ---------------- */
  function bindEvents() {
    $('submitBtn').addEventListener('click', check);
    $('answerInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') check();
    });
    $('speakBtn').addEventListener('click', speak);
    $('tipBtn').addEventListener('click', function () {
      showTip();
      setFeedback('Here is a drawing hint on the wooden sign! \\uD83D\\uDCA1', 'tip');
    });
    $('skipBtn').addEventListener('click', nextProblem);
    $('newBridgeBtn').addEventListener('click', newBridge);
    var keypad = $('keypad');
    keypad.addEventListener('click', function (e) {
      var t = e.target;
      while (t && t !== keypad && !t.getAttribute('data-key')) t = t.parentNode;
      if (!t || t === keypad) return;
      var k = t.getAttribute('data-key');
      var input = $('answerInput');
      if (k === 'clear') input.value = input.value.slice(0, -1);
      else if (k === 'go') check();
      else if (/^\\d$/.test(k) && input.value.length < 4) input.value += k;
    });
    var modes = document.querySelectorAll('.mode-btn');
    for (var i = 0; i < modes.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          state.mode = btn.getAttribute('data-mode');
          store.mode = state.mode;
          saveStore();
          syncModes();
          newBridge();
        });
      })(modes[i]);
    }
    $('generate-btn').addEventListener('click', generateWorksheet);
    $('answer-key-toggle').addEventListener('change', applyAnswerKey);
    $('print-btn').addEventListener('click', function () { window.print(); });
  }
  function syncModes() {
    var btns = document.querySelectorAll('.mode-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-pressed', btns[i].getAttribute('data-mode') === state.mode ? 'true' : 'false');
    }
  }

  buildScene();
  bindEvents();
  syncModes();
  updateStats();
  newBridge();
  generateWorksheet();
})();
`;
