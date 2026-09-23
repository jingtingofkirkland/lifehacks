// Auto-generated from the kids-math-addition artifact; do not hand-edit.
// Theme: CSS variables are mapped to the site's shadcn tokens so the page
// follows the main site design (including .dark mode via next-themes).
export const MATH_TOOL_CSS = `
.math-tool{
  color-scheme: light dark;
  --paper: hsl(var(--background));
  --surface: hsl(var(--card));
  --surface-2: hsl(var(--muted));
  --ink: hsl(var(--foreground));
  --muted: hsl(var(--muted-foreground));
  --line: hsl(var(--border));
  --green: #19704d;
  --green-strong: #10573b;
  --green-soft: #dff2e5;
  --orange: #d45b18;
  --orange-soft: #fff0dd;
  --blue: #126b8b;
  --blue-soft: #dff2f8;
  --red: #a83d2d;
  --red-soft: #fde8e3;
  --yellow: #f2c94c;
  --shadow: 0 12px 30px rgba(34, 73, 60, .10);
  --radius-lg: 24px;
  --radius-md: 16px;
  --radius-sm: 10px;
}

    .dark .math-tool{
  --green: #76d6a2;
  --green-strong: #a2e7bd;
  --green-soft: #1d4432;
  --orange: #ff9a5f;
  --orange-soft: #4a2c1d;
  --blue: #77cae6;
  --blue-soft: #173d4a;
  --red: #ff9b89;
  --red-soft: #4d2924;
  --yellow: #f8d76d;
  --shadow: 0 12px 30px rgba(0, 0, 0, .25);
}
    .math-tool{
      margin: 0;
      background: var(--paper);
      color: var(--ink);
      font-family: inherit, system-ui, sans-serif;
      font-size: 18px;
      line-height: 1.5;
    }
    .math-tool button, .math-tool input, .math-tool select{ font: inherit; }
    .math-tool button{ color: inherit; }
    .math-tool .shell{ width: min(1120px, calc(100% - 32px)); margin: 0 auto; padding: 28px 0 64px; }
    .math-tool .hero{
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(280px, .8fr);
      gap: 28px;
      align-items: center;
      margin-bottom: 24px;
    }
    .math-tool .eyebrow{ color: var(--green-strong); font-weight: 800; margin: 0 0 6px; }
    .math-tool h1, .math-tool h2, .math-tool h3{ font-family: "Nunito", system-ui, sans-serif; line-height: 1.08; margin-top: 0; }
    .math-tool h1{ font-size: clamp(2.4rem, 8vw, 4.8rem); letter-spacing: -.045em; margin-bottom: 14px; max-width: 780px; }
    .math-tool h2{ font-size: clamp(1.8rem, 4vw, 2.8rem); letter-spacing: -.025em; margin-bottom: 10px; }
    .math-tool h3{ font-size: 1.35rem; margin-bottom: 8px; }
    .math-tool p{ margin: 0 0 16px; }
    .math-tool .lede{ color: var(--muted); font-size: 1.15rem; max-width: 640px; }
    .math-tool .hero-visual{ background: var(--orange-soft); border-radius: 48% 52% 42% 58% / 56% 42% 58% 44%; padding: 30px; }
    .math-tool .hero-visual svg{ display: block; width: 100%; height: auto; }

    .math-tool .tabbar{
      position: sticky;
      top: 8px;
      z-index: 5;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      padding: 8px;
      background: color-mix(in srgb, var(--surface) 92%, transparent);
      border: 1px solid var(--line);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow);
      margin-bottom: 30px;
    }
    .math-tool .tab{
      min-height: 52px;
      border: 0;
      border-radius: var(--radius-sm);
      background: transparent;
      font-family: inherit;
      font-weight: 800;
      cursor: pointer;
    }
    .math-tool .tab[aria-selected="true"]{ background: var(--green); color: var(--paper); }
    .math-tool .panel{ display: none; }
    .math-tool .panel.active{ display: block; }
    .math-tool .section-intro{ margin-bottom: 24px; }
    .math-tool .section-intro p{ color: var(--muted); max-width: 720px; }

    .math-tool .lesson-path{ display: grid; gap: 22px; }
    .math-tool .lesson-card{
      display: grid;
      grid-template-columns: minmax(260px, .86fr) minmax(0, 1.14fr);
      gap: 26px;
      align-items: center;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      padding: clamp(20px, 4vw, 34px);
      box-shadow: var(--shadow);
    }
    .math-tool .lesson-card:nth-child(even) .visual{ order: 2; }
    .math-tool .step{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--green-strong);
      font-weight: 800;
      font-family: inherit;
      margin-bottom: 10px;
    }
    .math-tool .step-num{ display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: var(--green-soft); }
    .math-tool .visual{ background: var(--surface-2); border-radius: var(--radius-md); padding: 18px; }
    .math-tool .visual svg{ display: block; width: 100%; height: auto; }
    .math-tool .worked{ background: var(--blue-soft); border-radius: var(--radius-sm); padding: 14px 16px; margin-top: 14px; }
    .math-tool .worked strong{ color: var(--blue); }
    .math-tool .prompt{ margin: 14px 0 0; font-weight: 700; color: var(--green-strong); }

    .math-tool .practice-layout{ display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 24px; align-items: start; }
    .math-tool .mode-picker{ display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 18px; }
    .math-tool .pill, .math-tool .primary, .math-tool .secondary, .math-tool .choice{
      border: 2px solid var(--line);
      border-radius: 999px;
      background: var(--surface);
      min-height: 48px;
      padding: 10px 18px;
      font-family: inherit;
      font-weight: 800;
      cursor: pointer;
    }
    .math-tool .pill.active, .math-tool .primary{ background: var(--green); border-color: var(--green); color: var(--paper); }
    .math-tool .primary:hover{ background: var(--green-strong); border-color: var(--green-strong); }
    .math-tool .secondary:hover, .math-tool .choice:hover, .math-tool .pill:hover{ border-color: var(--green); }
    .math-tool .quiz-card{
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      padding: clamp(22px, 5vw, 42px);
      box-shadow: var(--shadow);
    }
    .math-tool .quiz-meta{ display: flex; align-items: center; justify-content: space-between; gap: 12px; color: var(--muted); font-weight: 700; }
    .math-tool .progress-track{ height: 10px; background: var(--surface-2); border-radius: 999px; overflow: hidden; margin: 12px 0 24px; }
    .math-tool .progress-fill{ width: 0%; height: 100%; background: var(--green); transition: width .25s ease; }
    .math-tool .problem{ text-align: center; font-family: inherit; font-size: clamp(3rem, 13vw, 6rem); font-weight: 800; letter-spacing: -.04em; margin: 12px 0 22px; }
    .math-tool .answer-row{ display: flex; gap: 12px; max-width: 480px; margin: 0 auto; }
    .math-tool .answer-row input{
      width: 100%; min-width: 0; height: 60px; border: 2px solid var(--line); border-radius: var(--radius-sm);
      background: var(--paper); color: var(--ink); padding: 8px 14px; text-align: center; font-size: 1.5rem; font-weight: 700;
    }
    .math-tool .answer-row input:focus{ outline: 3px solid color-mix(in srgb, var(--blue) 35%, transparent); border-color: var(--blue); }
    .math-tool .actions{ display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 16px; }
    .math-tool .feedback{ display: none; border-radius: var(--radius-md); padding: 16px 18px; margin-top: 20px; }
    .math-tool .feedback.show{ display: block; }
    .math-tool .feedback.good{ background: var(--green-soft); color: var(--green-strong); }
    .math-tool .feedback.try{ background: var(--red-soft); color: var(--red); }
    .math-tool .feedback.info{ background: var(--blue-soft); color: var(--blue); }
    .math-tool .feedback strong{ display: block; font-family: inherit; font-size: 1.15rem; margin-bottom: 2px; }
    .math-tool .next-wrap{ text-align: center; margin-top: 14px; }
    .math-tool .session-card{ background: var(--surface-2); border-radius: var(--radius-md); padding: 20px; }
    .math-tool .stat{ padding: 12px 0; border-bottom: 1px solid var(--line); }
    .math-tool .stat:last-child{ border-bottom: 0; }
    .math-tool .stat b{ display: block; font-weight: 800; font-size: 1.8rem; line-height: 1; color: var(--green-strong); }
    .math-tool .stat span{ color: var(--muted); font-size: .95rem; }
    .math-tool .session-note{ color: var(--muted); font-size: .9rem; margin-top: 14px; }

    .math-tool .generator{
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      padding: clamp(20px, 4vw, 34px);
      box-shadow: var(--shadow);
    }
    .math-tool .controls{ display: grid; grid-template-columns: 1fr 1fr auto; gap: 16px; align-items: end; margin-bottom: 22px; }
    .math-tool label{ display: grid; gap: 7px; font-family: inherit; font-weight: 800; }
    .math-tool select{
      min-height: 52px; border: 2px solid var(--line); border-radius: var(--radius-sm);
      background: var(--paper); color: var(--ink); padding: 8px 12px;
    }
    .math-tool .toggle-row{ display: flex; align-items: center; gap: 10px; margin: 4px 0 22px; }
    .math-tool .toggle-row input{ width: 24px; height: 24px; accent-color: var(--green); }
    .math-tool .toggle-row label{ display: inline; }
    .math-tool .print-note{ background: var(--orange-soft); color: var(--ink); border-radius: var(--radius-sm); padding: 12px 14px; margin-bottom: 22px; }
    .math-tool .sheet{ background: #fff; color: #15211e; border: 1px solid #cad5d1; padding: 30px; }
    .math-tool .sheet-head{ display: flex; justify-content: space-between; gap: 20px; border-bottom: 2px solid #15211e; padding-bottom: 12px; margin-bottom: 22px; }
    .math-tool .sheet-head h3{ margin: 0; }
    .math-tool .name-line{ white-space: nowrap; }
    .math-tool .problem-grid{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px 44px; counter-reset: item; }
    .math-tool .sheet-problem{ counter-increment: item; display: flex; align-items: flex-end; min-height: 54px; font-weight: 700; font-size: 1.25rem; line-height: 1.3; border-bottom: 1px solid #9da9a5; padding-bottom: 8px; }
    .math-tool .sheet-problem::before{ content: counter(item) "."; width: 38px; color: #53625d; font-weight: 400; }
    .math-tool .sheet-answer{ display: none; margin-left: auto; color: #19704d; }
    .math-tool .sheet.show-answers .sheet-answer{ display: inline; }
    .math-tool .answer-key-label{ display: none; margin: 26px 0 8px; font-weight: 800; }
    .math-tool .sheet.show-answers .answer-key-label{ display: block; }
    .math-tool .future-note{ margin-top: 28px; color: var(--muted); text-align: center; }

   @media (max-width: 760px){
      .math-tool{ font-size: 17px; }
      .math-tool .shell{ width: min(100% - 22px, 680px); padding-top: 18px; }
      .math-tool .hero, .math-tool .lesson-card, .math-tool .practice-layout{ grid-template-columns: 1fr; }
      .math-tool .hero-visual{ max-width: 360px; margin: 0 auto; }
      .math-tool .lesson-card:nth-child(even) .visual{ order: 0; }
      .math-tool .practice-layout{ gap: 16px; }
      .math-tool .session-card{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .math-tool .session-card h3, .math-tool .session-note{ grid-column: 1 / -1; }
      .math-tool .stat{ border-bottom: 0; border-right: 1px solid var(--line); padding: 6px 4px; }
      .math-tool .stat:nth-of-type(3){ border-right: 0; }
      .math-tool .stat b{ font-size: 1.45rem; }
      .math-tool .controls{ grid-template-columns: 1fr 1fr; }
      .math-tool .controls .primary{ grid-column: 1 / -1; }
      .math-tool .sheet{ padding: 20px 16px; }
      .math-tool .problem-grid{ grid-template-columns: 1fr; gap: 16px; }
      .math-tool .sheet-head{ display: block; }
      .math-tool .name-line{ margin-top: 12px; }
    }

   @media (max-width: 430px){
      .math-tool .tab{ padding-inline: 6px; font-size: .96rem; }
      .math-tool .answer-row{ flex-direction: column; }
      .math-tool .answer-row .primary{ width: 100%; }
      .math-tool .controls{ grid-template-columns: 1fr; }
      .math-tool .controls .primary{ grid-column: auto; }
      .math-tool .quiz-meta{ align-items: flex-start; }
    }

   @media (prefers-reduced-motion: reduce){
      .math-tool{ scroll-behavior: auto; }
      .math-tool *, .math-tool *::before, .math-tool *::after{ transition: none !important; }
    }

   @media print{
     @page{ margin: .55in; }
      .math-tool{ background: #fff !important; color: #000 !important; font-size: 12pt; }
      .math-tool .shell{ width: 100%; margin: 0; padding: 0; }
      .math-tool .hero, .math-tool .tabbar, .math-tool .panel:not(#worksheet), .math-tool #worksheet .section-intro, .math-tool .controls, .math-tool .toggle-row, .math-tool .print-note, .math-tool .future-note{ display: none !important; }
      .math-tool #worksheet, .math-tool #worksheet.panel{ display: block !important; }
      .math-tool .generator{ border: 0; box-shadow: none; padding: 0; }
      .math-tool .sheet{ border: 0; padding: 0; }
      .math-tool .problem-grid{ grid-template-columns: repeat(2, 1fr); gap: 18px 42px; }
      .math-tool .sheet-problem{ break-inside: avoid; }
    }
`;

export const MATH_TOOL_HTML = `
<main class="shell">
    <section class="hero" aria-labelledby="hero-title">
      <div>
        <p class="eyebrow">Addition, one clear step at a time</p>
        <h1 id="hero-title">Build addition you can see.</h1>
        <p class="lede">Move from counters to pictures to equations. Then practice without pressure and make a worksheet when you want pencil-and-paper time.</p>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <svg viewBox="0 0 420 300" role="img">
          <path d="M52 193 C115 68 300 35 370 166 C405 230 314 274 202 263 C89 252 21 253 52 193Z" fill="var(--surface)"/>
          <g fill="var(--orange)">
            <circle cx="62" cy="150" r="19"/><circle cx="106" cy="150" r="19"/><circle cx="150" cy="150" r="19"/>
          </g>
          <path d="M191 125v50M166 150h50" stroke="var(--green)" stroke-width="10" stroke-linecap="round"/>
          <g fill="var(--blue)">
            <circle cx="244" cy="150" r="19"/><circle cx="288" cy="150" r="19"/>
          </g>
          <path d="M322 139h43M322 161h43" stroke="var(--ink)" stroke-width="9" stroke-linecap="round"/>
          <text x="390" y="174" fill="var(--green)" text-anchor="middle" font-family="Poppins, sans-serif" font-size="70" font-weight="800">5</text>
        </svg>
      </div>
    </section>

    <nav class="tabbar" aria-label="Addition activities" role="tablist">
      <button class="tab" role="tab" id="tab-learn" aria-controls="learn" aria-selected="true" data-panel="learn">Learn</button>
      <button class="tab" role="tab" id="tab-practice" aria-controls="practice" aria-selected="false" data-panel="practice">Practice</button>
      <button class="tab" role="tab" id="tab-worksheet" aria-controls="worksheet" aria-selected="false" data-panel="worksheet">Worksheet</button>
    </nav>

    <section id="learn" class="panel active" role="tabpanel" aria-labelledby="tab-learn">
      <div class="section-intro">
        <h2>See the idea three ways</h2>
        <p>Start with things you could touch, turn them into a picture, and finish with math symbols. Each view tells the same addition story.</p>
      </div>

      <div class="lesson-path">
        <article class="lesson-card">
          <div class="visual">
            <svg viewBox="0 0 500 260" role="img" aria-label="A ten frame showing seven orange counters and two blue counters, making nine">
              <rect x="35" y="48" width="430" height="170" rx="12" fill="var(--surface)" stroke="var(--ink)" stroke-width="5"/>
              <path d="M121 48v170M207 48v170M293 48v170M379 48v170M35 133h430" stroke="var(--ink)" stroke-width="4"/>
              <g fill="var(--orange)"><circle cx="78" cy="91" r="25"/><circle cx="164" cy="91" r="25"/><circle cx="250" cy="91" r="25"/><circle cx="336" cy="91" r="25"/><circle cx="422" cy="91" r="25"/><circle cx="78" cy="176" r="25"/><circle cx="164" cy="176" r="25"/></g>
              <g fill="var(--blue)"><circle cx="250" cy="176" r="25"/><circle cx="336" cy="176" r="25"/></g>
            </svg>
          </div>
          <div>
            <div class="step"><span class="step-num">1</span> Concrete: join two groups</div>
            <h3>Fill a ten frame</h3>
            <p>Seven orange counters are already in the frame. Add two blue counters. Count every filled space: nine.</p>
            <div class="worked"><strong>Worked example</strong> 7 counters + 2 counters = 9 counters</div>
            <p class="prompt">Tell it back: Why does the last empty box show that the total is 9, not 10?</p>
          </div>
        </article>

        <article class="lesson-card">
          <div class="visual">
            <svg viewBox="0 0 540 250" role="img" aria-label="A number line starting at four and jumping three spaces to seven">
              <defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10Z" fill="var(--orange)"/></marker></defs>
              <path d="M45 165H495" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/>
              <g stroke="var(--ink)" stroke-width="4" text-anchor="middle" font-family="Inter, sans-serif" font-size="26" fill="var(--ink)">
                <path d="M45 150v30M95 150v30M145 150v30M195 150v30M245 150v30M295 150v30M345 150v30M395 150v30M445 150v30M495 150v30"/>
                <text x="45" y="215">0</text><text x="95" y="215">1</text><text x="145" y="215">2</text><text x="195" y="215">3</text><text x="245" y="215">4</text><text x="295" y="215">5</text><text x="345" y="215">6</text><text x="395" y="215">7</text><text x="445" y="215">8</text><text x="495" y="215">9</text>
              </g>
              <path d="M245 143Q268 74 295 143M295 143Q320 74 345 143M345 143Q370 74 395 143" fill="none" stroke="var(--orange)" stroke-width="7" marker-end="url(#arrow)"/>
              <circle cx="245" cy="165" r="11" fill="var(--blue)"/>
            </svg>
          </div>
          <div>
            <div class="step"><span class="step-num">2</span> Pictorial: draw the movement</div>
            <h3>Count on with a number line</h3>
            <p>Start on 4. “Plus 3” means move three jumps to the right: 5, 6, 7.</p>
            <div class="worked"><strong>Worked example</strong> Start at 4 → jump 3 → land on 7, so 4 + 3 = 7.</div>
            <p class="prompt">Tell it back: Why do we begin on 4 instead of making the first jump to 4?</p>
          </div>
        </article>

        <article class="lesson-card">
          <div class="visual">
            <svg viewBox="0 0 540 260" role="img" aria-label="A bar model with parts six and three making a whole of nine">
              <rect x="45" y="72" width="450" height="66" rx="8" fill="var(--green-soft)" stroke="var(--ink)" stroke-width="4"/>
              <line x1="345" y1="72" x2="345" y2="138" stroke="var(--ink)" stroke-width="4"/>
              <g fill="var(--ink)" text-anchor="middle" font-family="Poppins, sans-serif" font-size="30" font-weight="800"><text x="195" y="115">6</text><text x="420" y="115">3</text></g>
              <path d="M45 169v22h450v-22" fill="none" stroke="var(--orange)" stroke-width="5" stroke-linecap="round"/>
              <text x="270" y="234" fill="var(--orange)" text-anchor="middle" font-family="Poppins, sans-serif" font-size="34" font-weight="800">9 altogether</text>
            </svg>
          </div>
          <div>
            <div class="step"><span class="step-num">3</span> Abstract: write the equation</div>
            <h3>Name the parts and the whole</h3>
            <p>The short bars are the parts. Joining 6 and 3 makes the whole bar, 9. The equation is a quick way to record the model.</p>
            <div class="worked"><strong>Worked example</strong> part + part = whole → 6 + 3 = 9</div>
            <p class="prompt">Tell it back: In 6 + 3 = 9, which numbers are parts and which number is the whole?</p>
          </div>
        </article>
      </div>
    </section>

    <section id="practice" class="panel" role="tabpanel" aria-labelledby="tab-practice">
      <div class="section-intro">
        <h2>Practice without pressure</h2>
        <p>Choose open practice or a five-question mastery check. Problems are made fresh as you go, and a mistake becomes a clue—not a penalty.</p>
      </div>
      <div class="mode-picker" aria-label="Practice mode">
        <button class="pill active" data-mode="practice" aria-pressed="true">Open practice</button>
        <button class="pill" data-mode="mastery" aria-pressed="false">5-question mastery check</button>
      </div>
      <div class="practice-layout">
        <div class="quiz-card">
          <div class="quiz-meta"><span id="quiz-mode-label">Open practice</span><span id="quiz-count">Question 1</span></div>
          <div class="progress-track" aria-hidden="true"><div class="progress-fill" id="progress-fill"></div></div>
          <div class="problem" id="problem" aria-live="polite">4 + 3 = ?</div>
          <form id="answer-form">
            <div class="answer-row">
              <label for="answer" style="position:absolute;left:-9999px">Your answer</label>
              <input id="answer" inputmode="numeric" pattern="[0-9]*" autocomplete="off" placeholder="Your answer" />
              <button class="primary" type="submit">Check</button>
            </div>
          </form>
          <div class="actions">
            <button class="secondary" type="button" id="hint-btn">Give me a hint</button>
            <button class="secondary" type="button" id="solution-btn">Show the steps</button>
          </div>
          <div class="feedback" id="feedback" aria-live="polite"></div>
          <div class="next-wrap"><button class="primary" type="button" id="next-btn" hidden>Next question</button></div>
        </div>
        <aside class="session-card" aria-label="This session's progress">
          <h3>This session</h3>
          <div class="stat"><b id="correct-stat">0</b><span>correct</span></div>
          <div class="stat"><b id="streak-stat">0</b><span>in a row</span></div>
          <div class="stat"><b id="mastery-stat">—</b><span>mastery check</span></div>
          <p class="session-note">Progress stays only while this page is open and resets on reload.</p>
        </aside>
      </div>
    </section>

    <section id="worksheet" class="panel" role="tabpanel" aria-labelledby="tab-worksheet">
      <div class="section-intro">
        <h2>Make a pencil-and-paper set</h2>
        <p>Choose a number range and length. Every sheet is generated in your browser with a fresh set of addition problems.</p>
      </div>
      <div class="generator">
        <div class="controls">
          <label>Number range
            <select id="range-select">
              <option value="10">Sums within 10</option>
              <option value="20" selected>Sums within 20</option>
              <option value="100">Sums within 100</option>
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
        <p class="print-note"><strong>Ready for paper?</strong> Use your browser’s print command. The controls will be hidden automatically, and the worksheet will fill the page.</p>
        <div class="sheet" id="sheet">
          <div class="sheet-head">
            <h3>Addition Practice</h3>
            <span class="name-line">Name: ____________________</span>
          </div>
          <div class="problem-grid" id="worksheet-grid"></div>
          <div class="answer-key-label">Answers are shown in green.</div>
        </div>
      </div>
      <p class="future-note">This same learning path can grow next into subtraction, multiplication, division, and fractions.</p>
    </section>
  </main>`;

export const MATH_TOOL_JS = `
    (function () {
      "use strict";

      const TOPICS = {
        addition: {
          symbol: "+",
          makeProblem: function (limit) {
            const a = randomInt(0, limit);
            const b = randomInt(0, limit - a);
            return { a: a, b: b, answer: a + b };
          },
          hint: function (p) {
            const start = Math.max(p.a, p.b);
            const hops = Math.min(p.a, p.b);
            return "Start at " + start + " and count on " + hops + " more.";
          },
          solution: function (p) {
            const start = Math.max(p.a, p.b);
            const hops = Math.min(p.a, p.b);
            if (hops === 0) return "Adding zero keeps the number the same: " + start + " + 0 = " + start + ".";
            const steps = [];
            for (let i = 1; i <= hops; i += 1) steps.push(start + i);
            return "Begin at " + start + ". Count on " + hops + ": " + steps.join(", ") + ". So the total is " + p.answer + ".";
          }
        }
      };

      /** Progress storage contract. All implementations expose load/save/clear. */
      class ProgressStore {
        load() { throw new Error("ProgressStore.load must be implemented"); }
        save(progress) { throw new Error("ProgressStore.save must be implemented"); }
        clear() { throw new Error("ProgressStore.clear must be implemented"); }
      }

      function emptyProgress() {
        return { correct: 0, streak: 0, masteryCorrect: 0, masteryResult: null };
      }

      class MemoryProgressStore extends ProgressStore {
        constructor() { super(); this.clear(); }
        load() { return Object.assign({}, this.progress); }
        save(progress) { this.progress = Object.assign({}, progress); }
        clear() { this.progress = emptyProgress(); }
      }

      class BrowserStorageProgressStore extends ProgressStore {
        constructor(storage, key) {
          super();
          this.storage = storage;
          this.key = key;
        }
        load() {
          try {
            const saved = JSON.parse(this.storage.getItem(this.key));
            return saved ? Object.assign(emptyProgress(), saved) : emptyProgress();
          } catch (error) {
            return emptyProgress();
          }
        }
        save(progress) {
          this.storage.setItem(this.key, JSON.stringify(Object.assign(emptyProgress(), progress)));
        }
        clear() { this.storage.removeItem(this.key); }
      }

      // Inactive publishing options for a future GitHub Pages version.
      // Swap only the single composition line below to enable one of them.
      class LocalStorageProgressStore extends BrowserStorageProgressStore {
        constructor() { super(window.localStorage, "kids-math-addition-progress"); }
      }
      class SessionStorageProgressStore extends BrowserStorageProgressStore {
        constructor() { super(window.sessionStorage, "kids-math-addition-progress"); }
      }

      // Site policy: persist progress in this browser via localStorage.
      const progressStore = new LocalStorageProgressStore();

      const state = {
        topic: "addition",
        mode: "practice",
        problem: null,
        answered: false,
        question: 1,
        firstAttemptOpen: true
      };

      function updateProgress(changes) {
        const next = Object.assign(progressStore.load(), changes);
        progressStore.save(next);
        return next;
      }

      function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      function setPanel(panelId) {
        document.querySelectorAll(".tab").forEach(function (tab) {
          const active = tab.dataset.panel === panelId;
          tab.setAttribute("aria-selected", active ? "true" : "false");
        });
        document.querySelectorAll(".panel").forEach(function (panel) {
          panel.classList.toggle("active", panel.id === panelId);
        });
      }

      document.querySelectorAll(".tab").forEach(function (tab) {
        tab.addEventListener("click", function () { setPanel(tab.dataset.panel); });
      });

      const problemEl = document.getElementById("problem");
      const answerEl = document.getElementById("answer");
      const feedbackEl = document.getElementById("feedback");
      const nextBtn = document.getElementById("next-btn");
      const progressFill = document.getElementById("progress-fill");
      const quizCount = document.getElementById("quiz-count");
      const quizModeLabel = document.getElementById("quiz-mode-label");

      function makeQuizProblem() {
        state.problem = TOPICS[state.topic].makeProblem(state.mode === "practice" ? 20 : 20);
        state.answered = false;
        state.firstAttemptOpen = true;
        problemEl.textContent = state.problem.a + " + " + state.problem.b + " = ?";
        answerEl.value = "";
        answerEl.disabled = false;
        feedbackEl.className = "feedback";
        feedbackEl.textContent = "";
        nextBtn.hidden = true;
        quizModeLabel.textContent = state.mode === "practice" ? "Open practice" : "Mastery check";
        quizCount.textContent = state.mode === "practice" ? "Question " + state.question : "Question " + state.question + " of 5";
        progressFill.style.width = state.mode === "practice" ? "0%" : ((state.question - 1) / 5 * 100) + "%";
        answerEl.focus();
      }

      function showFeedback(kind, title, message) {
        feedbackEl.className = "feedback show " + kind;
        feedbackEl.innerHTML = "<strong>" + title + "</strong>" + message;
      }

      document.getElementById("answer-form").addEventListener("submit", function (event) {
        event.preventDefault();
        if (state.answered) return;
        const value = Number(answerEl.value);
        if (answerEl.value.trim() === "" || !Number.isInteger(value) || value < 0) {
          showFeedback("info", "Try a whole number", "Type a number in the answer box, then check it.");
          return;
        }
        if (value === state.problem.answer) {
          state.answered = true;
          const progress = progressStore.load();
          updateProgress({
            correct: progress.correct + 1,
            streak: progress.streak + 1,
            masteryCorrect: progress.masteryCorrect + (state.mode === "mastery" && state.firstAttemptOpen ? 1 : 0)
          });
          state.firstAttemptOpen = false;
          showFeedback("good", "Yes — you built the total!", state.problem.a + " and " + state.problem.b + " join to make " + state.problem.answer + ".");
          answerEl.disabled = true;
          nextBtn.hidden = false;
          nextBtn.textContent = state.mode === "mastery" && state.question === 5 ? "See my result" : "Next question";
          if (state.mode === "mastery") progressFill.style.width = (state.question / 5 * 100) + "%";
          updateStats();
        } else {
          state.firstAttemptOpen = false;
          updateProgress({ streak: 0 });
          showFeedback("try", "Not yet — let’s make it smaller.", TOPICS[state.topic].hint(state.problem) + " Change your answer and try again.");
          updateStats();
          answerEl.select();
        }
      });

      document.getElementById("hint-btn").addEventListener("click", function () {
        if (state.answered) return;
        showFeedback("info", "A small hint", TOPICS[state.topic].hint(state.problem));
        answerEl.focus();
      });

      document.getElementById("solution-btn").addEventListener("click", function () {
        if (state.answered) return;
        state.answered = true;
        state.firstAttemptOpen = false;
        updateProgress({ streak: 0 });
        showFeedback("info", "Worked solution", TOPICS[state.topic].solution(state.problem));
        answerEl.disabled = true;
        nextBtn.hidden = false;
        nextBtn.textContent = state.mode === "mastery" && state.question === 5 ? "See my result" : "Try the next one";
        if (state.mode === "mastery") progressFill.style.width = (state.question / 5 * 100) + "%";
        updateStats();
      });

      nextBtn.addEventListener("click", function () {
        if (state.mode === "mastery" && state.question === 5) {
          const masteryCorrect = progressStore.load().masteryCorrect;
          updateProgress({ masteryResult: masteryCorrect });
          document.getElementById("mastery-stat").textContent = masteryCorrect + "/5";
          const title = masteryCorrect === 5 ? "Mastery shown!" : "Check complete";
          const message = masteryCorrect === 5
            ? "You solved all five. Explain one strategy aloud to make the learning stick."
            : "You solved " + masteryCorrect + " of 5 on your first try. Review a visual, then try a fresh check whenever you’re ready.";
          problemEl.textContent = masteryCorrect + " / 5";
          answerEl.disabled = true;
          nextBtn.hidden = true;
          showFeedback(masteryCorrect === 5 ? "good" : "info", title, message);
          return;
        }
        state.question += 1;
        makeQuizProblem();
      });

      document.querySelectorAll("[data-mode]").forEach(function (button) {
        button.addEventListener("click", function () {
          state.mode = button.dataset.mode;
          state.question = 1;
          if (state.mode === "mastery") updateProgress({ masteryCorrect: 0 });
          document.querySelectorAll("[data-mode]").forEach(function (b) {
            const active = b === button;
            b.classList.toggle("active", active);
            b.setAttribute("aria-pressed", active ? "true" : "false");
          });
          makeQuizProblem();
        });
      });

      function updateStats() {
        const progress = progressStore.load();
        document.getElementById("correct-stat").textContent = progress.correct;
        document.getElementById("streak-stat").textContent = progress.streak;
        document.getElementById("mastery-stat").textContent = progress.masteryResult === null ? "—" : progress.masteryResult + "/5";
      }

      const worksheetGrid = document.getElementById("worksheet-grid");
      const sheet = document.getElementById("sheet");

      function generateWorksheet() {
        const limit = Number(document.getElementById("range-select").value);
        const count = Number(document.getElementById("count-select").value);
        const seen = new Set();
        const problems = [];
        let tries = 0;
        while (problems.length < count && tries < 500) {
          const p = TOPICS.addition.makeProblem(limit);
          const key = Math.min(p.a, p.b) + ":" + Math.max(p.a, p.b);
          if (!seen.has(key)) {
            seen.add(key);
            problems.push(p);
          }
          tries += 1;
        }
        worksheetGrid.innerHTML = "";
        problems.forEach(function (p) {
          const item = document.createElement("div");
          item.className = "sheet-problem";
          item.innerHTML = "<span>" + p.a + " + " + p.b + " = ______</span><span class=\\"sheet-answer\\">" + p.answer + "</span>";
          worksheetGrid.appendChild(item);
        });
      }

      document.getElementById("generate-btn").addEventListener("click", generateWorksheet);
      document.getElementById("answers-toggle").addEventListener("change", function (event) {
        sheet.classList.toggle("show-answers", event.target.checked);
      });

      updateStats();
      makeQuizProblem();
      generateWorksheet();
    }());
  `;
