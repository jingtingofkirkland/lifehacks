// Merged from the Merge Racer game artifact; do not hand-edit.
// Theme: CSS is scoped under .math-tool and mapped to the site's shadcn
// tokens so the page follows the main site design (dark mode via the
// .dark class from next-themes). Progress persists in localStorage.
export const MATH_TOOL_CSS = `

    .math-tool{
      color-scheme: light dark;
      --ink: hsl(var(--foreground));
      --muted: hsl(var(--muted-foreground));
      --paper: hsl(var(--background));
      --panel: hsl(var(--card));
      --line: hsl(var(--border));
      --road: #314540;
      --road-deep: #233530;
      --lane: #f4d54c;
      --green: #1c8b66;
      --green-dark: #11684d;
      --mint: #dff4e7;
      --coral: #f06449;
      --coral-dark: #c74431;
      --yellow: #f6c945;
      --blue: #4f8cc9;
      --shadow: 0 14px 35px rgba(24, 65, 53, .12);
      --soft-shadow: 0 5px 0 rgba(26, 74, 61, .13);
      background: var(--paper);
      color: var(--ink);
      font-family: "Inter", system-ui, sans-serif;
      font-size: 17px;
      line-height: 1.5;
      -webkit-tap-highlight-color: transparent;
    }

    .math-tool .dark .math-tool{
      --ink: #edf8f2;
      --muted: #b7c9c1;
      --paper: hsl(var(--background));
      --panel: hsl(var(--card));
      --line: hsl(var(--border));
      --road: #263a35;
      --road-deep: #172925;
      --lane: #f3cf45;
      --green: #49bb91;
      --green-dark: #2e9a74;
      --mint: #25483b;
      --coral: #ff7a5d;
      --coral-dark: #db5b43;
      --yellow: #f2cb50;
      --blue: #71a9de;
      --shadow: 0 16px 38px rgba(0, 0, 0, .28);
      --soft-shadow: 0 5px 0 rgba(0, 0, 0, .25);
    }

    .math-tool *, .math-tool *::before, .math-tool *::after { box-sizing: border-box; }
    .math-tool body{
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(circle at 10% 5%, color-mix(in srgb, var(--yellow) 16%, transparent) 0 120px, transparent 121px),
        var(--paper);
      color: var(--ink);
      font-family: "Inter", system-ui, sans-serif;
      -webkit-tap-highlight-color: transparent;
    }
    .math-tool button{ font: inherit; }
    .math-tool button:focus-visible{ outline: 4px solid color-mix(in srgb, var(--blue) 55%, transparent); outline-offset: 3px; }

    .math-tool .app{
      width: min(1180px, 100%);
      margin: 0 auto;
      padding: max(18px, env(safe-area-inset-top)) clamp(14px, 3vw, 34px) max(28px, env(safe-area-inset-bottom));
    }

    .math-tool .topbar{
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 18px;
    }
    .math-tool .mode-switch{
      display: inline-flex;
      gap: 4px;
      padding: 4px;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 14px;
      box-shadow: var(--soft-shadow);
    }
    .math-tool .mode-btn{
      border: 0;
      color: var(--muted);
      background: transparent;
      padding: 9px 14px;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 800;
      min-height: 42px;
    }
    .math-tool .mode-btn.active{ background: var(--green); color: #fff; }
    .math-tool .stats{ display: flex; align-items: center; gap: 8px; }
    .math-tool .stat{
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 12px;
      min-height: 42px;
      padding: 8px 12px;
      display: flex;
      align-items: baseline;
      gap: 5px;
      box-shadow: 0 3px 0 color-mix(in srgb, var(--line) 75%, transparent);
    }
    .math-tool .stat strong{ font-family: "Poppins", system-ui, sans-serif; font-size: 1.15rem; }
    .math-tool .stat span{ color: var(--muted); font-size: .76rem; font-weight: 800; }
    .math-tool .sound-btn{
      border: 1px solid var(--line);
      background: var(--panel);
      color: var(--ink);
      border-radius: 12px;
      width: 42px;
      height: 42px;
      display: grid;
      place-items: center;
      cursor: pointer;
      box-shadow: 0 3px 0 color-mix(in srgb, var(--line) 75%, transparent);
    }
    .math-tool .sound-btn svg{ width: 21px; height: 21px; fill: currentColor; }

    .math-tool .game-grid{
      display: grid;
      grid-template-columns: minmax(0, 1.18fr) minmax(360px, .82fr);
      gap: clamp(16px, 2.5vw, 28px);
      align-items: start;
    }

    .math-tool .track-card, .math-tool .garage{
      background: var(--panel);
      border: 1px solid var(--line);
      box-shadow: var(--shadow);
    }
    .math-tool .track-card{ border-radius: 24px 24px 14px 14px; overflow: hidden; }
    .math-tool .prompt{
      padding: clamp(18px, 3vw, 30px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
    }
    .math-tool .prompt-copy h1{
      margin: 0;
      font-family: "Poppins", system-ui, sans-serif;
      font-size: clamp(1.45rem, 3.5vw, 2.5rem);
      line-height: 1.06;
      letter-spacing: -.025em;
    }
    .math-tool .prompt-copy p{ margin: 7px 0 0; color: var(--muted); font-weight: 700; }
    .math-tool .target{
      flex: 0 0 auto;
      width: clamp(82px, 12vw, 112px);
      aspect-ratio: 1;
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: var(--yellow);
      border: 5px solid var(--ink);
      color: #1d2d28;
      font-family: "Poppins", system-ui, sans-serif;
      font-size: clamp(2.4rem, 6vw, 4.2rem);
      font-weight: 700;
      transform: rotate(2deg);
      box-shadow: 6px 7px 0 var(--ink);
    }

    .math-tool .track{
      height: clamp(220px, 32vw, 300px);
      position: relative;
      overflow: hidden;
      background:
        linear-gradient(90deg, transparent 49%, rgba(255,255,255,.1) 50%, transparent 51%) 0 0 / 80px 100%,
        var(--road);
      border-top: 10px solid var(--coral);
      border-bottom: 10px solid var(--coral);
    }
    .math-tool .track::before, .math-tool .track::after{
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      height: 8px;
      background: repeating-linear-gradient(90deg, #fff 0 24px, transparent 24px 48px);
      opacity: .9;
    }
    .math-tool .track::before{ top: 9px; }
    .math-tool .track::after{ bottom: 9px; }
    .math-tool .finish{
      position: absolute;
      right: 8%;
      inset-block: 0;
      width: 32px;
      background-color: #fff;
      background-image:
        linear-gradient(45deg, #17211f 25%, transparent 25%, transparent 75%, #17211f 75%),
        linear-gradient(45deg, #17211f 25%, transparent 25%, transparent 75%, #17211f 75%);
      background-size: 20px 20px;
      background-position: 0 0, 10px 10px;
      box-shadow: 0 0 0 2px rgba(255,255,255,.5);
    }
    .math-tool .distance-markers{ position: absolute; inset: 0; pointer-events: none; }
    .math-tool .distance-markers span{
      position: absolute;
      top: 50%;
      width: 30px;
      height: 3px;
      background: var(--lane);
      transform: translateY(-50%);
      border-radius: 2px;
      opacity: .9;
    }
    .math-tool .racer-wrap{
      position: absolute;
      left: 2%;
      top: 50%;
      width: clamp(110px, 21vw, 190px);
      transform: translateY(-48%);
      z-index: 3;
      transition: left 650ms cubic-bezier(.16,.83,.36,1.25);
      filter: drop-shadow(0 15px 10px rgba(0,0,0,.34));
    }
    .math-tool .racer-wrap img{ display: block; width: 100%; height: auto; transform: rotate(-1deg); }
    .math-tool .racer-wrap.boost{ animation: boost .65s ease both; }
    @keyframes boost {
      25% { transform: translateY(-48%) translateX(-10px) rotate(-1deg); }
      60% { transform: translateY(-48%) translateX(12px) rotate(1deg); }
    }
    /* Idle "driving" feel: the racer bobs while the lane dashes scroll by. */
    .math-tool .racer-wrap img{ animation: idleBob 1.8s ease-in-out infinite; }
    @keyframes idleBob{
      0%, 100%{ transform: rotate(-1deg) translateY(0); }
      50%{ transform: rotate(-1deg) translateY(-5px); }
    }
    .math-tool .track::before, .math-tool .track::after{ animation: dashScroll 1.1s linear infinite; }
    @keyframes dashScroll{
      from{ background-position-x: 0; }
      to{ background-position-x: -48px; }
    }
    .math-tool .speed-line{
      position: absolute;
      height: 3px;
      border-radius: 99px;
      background: #fff;
      opacity: 0;
      right: 70%;
      z-index: 1;
    }
    .math-tool .track.correct .speed-line{ animation: zip .7s ease-out; }
    @keyframes zip {
      0% { opacity: 0; transform: translateX(0) scaleX(.2); }
      30% { opacity: .75; }
      100% { opacity: 0; transform: translateX(210px) scaleX(1.4); }
    }
    .math-tool .track-status{
      position: absolute;
      left: 50%;
      bottom: 20px;
      transform: translateX(-50%);
      background: color-mix(in srgb, var(--road-deep) 84%, transparent);
      color: #fff;
      padding: 8px 13px;
      border-radius: 10px;
      font-weight: 800;
      font-size: .87rem;
      white-space: nowrap;
    }

    .math-tool .progress-strip{
      padding: 14px 18px 16px;
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 10px;
      font-size: .8rem;
      font-weight: 800;
      color: var(--muted);
    }
    .math-tool .progress-bar{ height: 11px; background: var(--mint); border-radius: 99px; overflow: hidden; border: 1px solid var(--line); }
    .math-tool .progress-fill{ width: 0; height: 100%; border-radius: inherit; background: var(--green); transition: width .5s ease; }

    .math-tool .garage{ border-radius: 14px 24px 24px 14px; padding: clamp(18px, 2.5vw, 26px); }
    .math-tool .garage-head{ display: flex; justify-content: space-between; align-items: start; gap: 12px; margin-bottom: 16px; }
    .math-tool .garage h2{ font: 700 clamp(1.15rem, 2vw, 1.45rem)/1.1 "Poppins", system-ui, sans-serif; margin: 0; }
    .math-tool .garage-head p{ margin: 5px 0 0; color: var(--muted); font-weight: 700; font-size: .9rem; }
    .math-tool .reset-btn{
      border: 0;
      background: transparent;
      color: var(--green-dark);
      font-weight: 800;
      padding: 8px;
      border-radius: 9px;
      cursor: pointer;
    }

    .math-tool .merge-bay{
      min-height: 72px;
      border-radius: 14px;
      background: var(--mint);
      border: 2px dashed color-mix(in srgb, var(--green) 62%, var(--line));
      display: grid;
      grid-template-columns: 1fr auto 1fr auto 1fr;
      align-items: center;
      gap: 7px;
      padding: 9px 11px;
      margin-bottom: 15px;
    }
    .math-tool .slot{
      min-width: 0;
      height: 50px;
      border-radius: 10px;
      background: color-mix(in srgb, var(--panel) 73%, transparent);
      display: grid;
      place-items: center;
      font: 700 1.6rem/1 "Poppins", system-ui, sans-serif;
      color: var(--ink);
      border: 1px solid color-mix(in srgb, var(--green) 35%, transparent);
    }
    .math-tool .slot.empty::after{ content: "?"; color: var(--muted); opacity: .55; }
    .math-tool .operator{ font: 700 1.25rem/1 "Poppins", system-ui, sans-serif; color: var(--green-dark); }
    .math-tool .sum-slot{ background: var(--yellow); color: #1d2d28; border-color: transparent; }

    .math-tool .cars{
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }
    .math-tool .number-car{
      position: relative;
      min-height: 88px;
      border: 0;
      border-radius: 16px 16px 12px 12px;
      background: var(--blue);
      color: #fff;
      box-shadow: 0 6px 0 color-mix(in srgb, var(--blue) 72%, #000);
      cursor: pointer;
      font: 700 clamp(1.65rem, 4vw, 2.15rem)/1 "Poppins", system-ui, sans-serif;
      transition: transform .14s ease, filter .14s ease, opacity .2s ease;
      touch-action: manipulation;
      overflow: hidden;
    }
    .math-tool .number-car:nth-child(2n){ background: var(--coral); box-shadow: 0 6px 0 var(--coral-dark); }
    .math-tool .number-car:nth-child(3n){ background: var(--green); box-shadow: 0 6px 0 var(--green-dark); }
    .math-tool .number-car::before{
      content: "";
      position: absolute;
      inset: auto 12% 9px;
      height: 12px;
      background: rgba(19, 40, 34, .5);
      border-radius: 12px 12px 5px 5px;
      box-shadow: -14px 5px 0 -2px #14231f, 14px 5px 0 -2px #14231f;
    }
    .math-tool .number-car:hover{ filter: brightness(1.06); }
    .math-tool .number-car:active{ transform: translateY(4px); box-shadow: none; }
    .math-tool .number-car.selected{ transform: translateY(-4px); outline: 4px solid var(--yellow); outline-offset: 2px; }
    .math-tool .number-car.used{ opacity: .32; pointer-events: none; }

    .math-tool .feedback{
      min-height: 52px;
      margin-top: 18px;
      border-radius: 12px;
      padding: 12px 14px;
      display: flex;
      gap: 10px;
      align-items: center;
      background: color-mix(in srgb, var(--mint) 70%, var(--panel));
      color: var(--ink);
      font-weight: 800;
      line-height: 1.25;
    }
    .math-tool .feedback-dot{ width: 12px; height: 12px; flex: 0 0 auto; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 4px color-mix(in srgb, var(--green) 20%, transparent); }
    .math-tool .feedback.error{ background: color-mix(in srgb, var(--coral) 13%, var(--panel)); }
    .math-tool .feedback.error .feedback-dot{ background: var(--coral); box-shadow: 0 0 0 4px color-mix(in srgb, var(--coral) 20%, transparent); }
    .math-tool .feedback.tip{ background: color-mix(in srgb, var(--yellow) 30%, var(--panel)); }
    .math-tool .feedback.tip .feedback-dot{ background: var(--yellow); }
    .math-tool .tip-btn{
      width: 100%;
      margin-top: 12px;
      min-height: 48px;
      border: 2px solid var(--green);
      border-radius: 12px;
      background: transparent;
      color: var(--green-dark);
      font-weight: 900;
      cursor: pointer;
    }
    .math-tool .tip-btn:hover{ background: var(--mint); }

    .math-tool .finish-card[hidden]{ display: none; }
    .math-tool .finish-card{
      position: fixed;
      inset: 0;
      z-index: 20;
      display: grid;
      place-items: center;
      padding: 20px;
      background: rgba(7, 22, 17, .68);
      opacity: 0;
      pointer-events: none;
      transition: opacity .2s ease;
    }
    .math-tool .finish-card.show{ opacity: 1; pointer-events: auto; }
    .math-tool .finish-dialog{
      width: min(420px, 100%);
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 26px;
      padding: 30px;
      text-align: center;
      box-shadow: 0 25px 70px rgba(0,0,0,.35);
      transform: translateY(12px);
      transition: transform .2s ease;
    }
    .math-tool .finish-card.show .finish-dialog{ transform: translateY(0); }
    .math-tool .trophy{
      width: 88px;
      height: 88px;
      margin: 0 auto 16px;
      border-radius: 50%;
      background: var(--yellow);
      color: #24352f;
      display: grid;
      place-items: center;
      font: 700 2.7rem/1 "Poppins", system-ui, sans-serif;
      border: 4px solid #24352f;
      box-shadow: 5px 6px 0 #24352f;
    }
    .math-tool .finish-dialog h2{ margin: 0; font: 700 2rem/1.05 "Poppins", system-ui, sans-serif; }
    .math-tool .finish-dialog p{ color: var(--muted); font-weight: 700; margin: 10px 0 22px; }
    .math-tool .race-again{
      width: 100%;
      border: 0;
      background: var(--green);
      color: #fff;
      border-radius: 13px;
      min-height: 52px;
      font-weight: 900;
      cursor: pointer;
      box-shadow: 0 5px 0 var(--green-dark);
    }

    .math-tool .confetti{ position: fixed; width: 9px; height: 16px; pointer-events: none; z-index: 30; border-radius: 2px; animation: fall 1s ease-out forwards; }
    @keyframes fall { to { transform: translate(var(--dx), 210px) rotate(540deg); opacity: 0; } }
    .math-tool .shake{ animation: shake .32s ease; }
    @keyframes shake { 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }

    .math-tool .sr-only{ position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

    @media (max-width: 820px) {
      .math-tool .app{ padding-inline: 12px; }
      .math-tool .game-grid{ grid-template-columns: 1fr; }
      .math-tool .garage{ border-radius: 14px 14px 22px 22px; }
      .math-tool .track-card{ border-radius: 22px 22px 14px 14px; }
      .math-tool .track{ height: 220px; }
      .math-tool .stats .stat:nth-child(2){ display: none; }
      .math-tool .racer-wrap{ width: 125px; }
    }
    @media (max-width: 500px) {
      .math-tool .topbar{ align-items: stretch; }
      .math-tool .mode-switch{ flex: 1; }
      .math-tool .mode-btn{ flex: 1; padding-inline: 8px; }
      .math-tool .stat{ padding-inline: 10px; }
      .math-tool .prompt{ align-items: center; padding: 18px; }
      .math-tool .prompt-copy p{ font-size: .84rem; }
      .math-tool .target{ width: 78px; border-width: 4px; box-shadow: 4px 5px 0 var(--ink); }
      .math-tool .track{ height: 190px; }
      .math-tool .track-status{ bottom: 13px; }
      .math-tool .garage{ padding: 17px 14px 20px; }
      .math-tool .cars{ gap: 9px; }
      .math-tool .number-car{ min-height: 77px; }
      .math-tool .merge-bay{ grid-template-columns: minmax(46px,1fr) auto minmax(46px,1fr) auto minmax(50px,1fr); padding-inline: 8px; }
    }
    @media (max-width: 370px) {
      .math-tool .topbar{ flex-wrap: wrap; }
      .math-tool .mode-switch{ order: 1; width: 100%; }
      .math-tool .stats{ width: 100%; justify-content: flex-end; }
      .math-tool .prompt-copy h1{ font-size: 1.3rem; }
      .math-tool .prompt-copy p{ max-width: 160px; }
      .math-tool .target{ width: 68px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .math-tool *, .math-tool *::before, .math-tool *::after{ animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .01ms !important; }
    }
  
    .math-tool .worksheet-wrap{ width: min(1180px, 100%); margin: 36px auto 0; padding: 0 clamp(14px, 3vw, 34px); }
    .math-tool .ws-head h2{ font-family: "Poppins", system-ui, sans-serif; font-size: clamp(1.5rem, 3vw, 2.2rem); letter-spacing: -.02em; margin: 0 0 8px; }
    .math-tool .ws-head p{ color: var(--muted); font-weight: 700; margin: 0 0 20px; }
    .math-tool .generator{ background: var(--panel); border: 1px solid var(--line); border-radius: 20px; padding: clamp(18px, 2.5vw, 26px); box-shadow: var(--shadow); }
    .math-tool .controls{ display: grid; grid-template-columns: 1fr 1fr auto; gap: 16px; align-items: end; margin-bottom: 18px; }
    .math-tool .controls label{ display: grid; gap: 7px; font-weight: 800; }
    .math-tool .controls select{ min-height: 52px; border: 2px solid var(--line); border-radius: 10px; background: var(--paper); color: var(--ink); padding: 8px 12px; font: inherit; }
    .math-tool .primary{ min-height: 52px; border: 0; border-radius: 12px; background: var(--green); color: #fff; font-weight: 900; padding: 10px 22px; cursor: pointer; box-shadow: 0 4px 0 var(--green-dark); }
    .math-tool .primary:active{ transform: translateY(3px); box-shadow: none; }
    .math-tool .toggle-row{ display: flex; align-items: center; gap: 10px; margin: 4px 0 18px; font-weight: 800; }
    .math-tool .toggle-row input{ width: 24px; height: 24px; accent-color: var(--green); }
    .math-tool .print-note{ background: color-mix(in srgb, var(--yellow) 30%, var(--panel)); color: var(--ink); border-radius: 10px; padding: 12px 14px; margin: 0 0 20px; font-weight: 700; }
    .math-tool .sheet{ background: #fff; color: #15211e; border: 1px solid #cad5d1; border-radius: 6px; padding: 30px; }
    .math-tool .sheet-head{ display: flex; justify-content: space-between; gap: 20px; border-bottom: 2px solid #15211e; padding-bottom: 12px; margin-bottom: 22px; }
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
    @media (max-width: 760px){
      .math-tool .controls{ grid-template-columns: 1fr 1fr; }
      .math-tool .controls .primary{ grid-column: 1 / -1; }
      .math-tool .sheet{ padding: 20px 16px; }
      .math-tool .problem-grid{ grid-template-columns: 1fr; gap: 16px; }
      .math-tool .sheet-head{ display: block; }
      .math-tool .name-line{ margin-top: 12px; }
    }
    @media (max-width: 560px){
      .math-tool .controls{ grid-template-columns: 1fr; }
      .math-tool .controls .primary{ grid-column: auto; }
      .math-tool .controls label, .math-tool .controls select, .math-tool .controls .primary{ min-width: 0; width: 100%; max-width: 100%; }
    }
    @media print{
      @page{ margin: .55in; }
      .math-tool{ background: #fff !important; color: #000 !important; }
      .math-tool .app, .math-tool .finish-card, .math-tool .ws-head, .math-tool .controls, .math-tool .toggle-row, .math-tool .print-note{ display: none !important; }
      .math-tool .worksheet-wrap{ width: 100%; margin: 0; padding: 0; }
      .math-tool .generator{ border: 0; box-shadow: none; padding: 0; }
      .math-tool .sheet{ border: 0; padding: 0; }
      .math-tool .problem-grid{ grid-template-columns: repeat(2, 1fr); gap: 18px 42px; }
      .math-tool .sheet-problem{ break-inside: avoid; }
    }

`;

export const MATH_TOOL_HTML = `

  <main class="app">
    <div class="topbar" aria-label="Race settings and score">
      <div class="mode-switch" role="group" aria-label="Difficulty">
        <button class="mode-btn active" data-mode="basic" aria-pressed="true">Basic · to 20</button>
        <button class="mode-btn" data-mode="advanced" aria-pressed="false">Advanced · to 100</button>
      </div>
      <div class="stats">
        <div class="stat" aria-label="Current lap"><strong id="lapStat">1</strong><span>/ 8</span></div>
        <div class="stat"><strong id="streakStat">0</strong><span>streak</span></div>
        <button class="sound-btn" id="soundBtn" aria-label="Turn sound off" aria-pressed="true" title="Sound on">
          <svg id="soundIcon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zm-2.5-8.7v2.1a7 7 0 0 1 0 13.2v2.1a9 9 0 0 0 0-17.4z"/></svg>
        </button>
      </div>
    </div>

    <div class="game-grid">
      <section class="track-card" aria-labelledby="challengeTitle">
        <div class="prompt">
          <div class="prompt-copy">
            <h1 id="challengeTitle">Build the target.</h1>
            <p id="challengeSub">Pick two cars that add to the number.</p>
          </div>
          <div class="target" id="targetNumber" aria-label="Target number">10</div>
        </div>

        <div class="track" id="track" aria-label="Race track showing your progress">
          <div class="finish" aria-hidden="true"></div>
          <div class="distance-markers" aria-hidden="true">
            <span style="left:18%"></span><span style="left:36%"></span><span style="left:54%"></span><span style="left:72%"></span>
          </div>
          <span class="speed-line" style="top:29%; width:64px"></span>
          <span class="speed-line" style="top:41%; width:95px; animation-delay:.08s"></span>
          <span class="speed-line" style="top:62%; width:78px; animation-delay:.03s"></span>
          <div class="racer-wrap" id="racer"><img src="data:image/webp;base64,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" alt="White race car moving toward the finish line"></div>
          <div class="track-status" id="trackStatus">8 correct merges to finish</div>
        </div>

        <div class="progress-strip">
          <span>START</span>
          <div class="progress-bar" aria-label="Race progress"><div class="progress-fill" id="progressFill"></div></div>
          <span>FINISH</span>
        </div>
      </section>

      <section class="garage" aria-labelledby="garageTitle">
        <div class="garage-head">
          <div>
            <h2 id="garageTitle">Merge bay</h2>
            <p>Tap any two number cars.</p>
          </div>
          <button class="reset-btn" id="resetPick" type="button">Clear</button>
        </div>

        <div class="merge-bay" id="mergeBay" aria-live="polite">
          <div class="slot empty" id="slotA" aria-label="First number not selected"></div>
          <span class="operator">+</span>
          <div class="slot empty" id="slotB" aria-label="Second number not selected"></div>
          <span class="operator">=</span>
          <div class="slot sum-slot" id="sumSlot" aria-label="Target sum">?</div>
        </div>

        <div class="cars" id="cars" aria-label="Choose two number cars"></div>

        <div class="feedback" id="feedback" role="status" aria-live="polite">
          <span class="feedback-dot" aria-hidden="true"></span>
          <span id="feedbackText">Find a pair, then watch your racer fly.</span>
        </div>
        <button class="tip-btn" id="tipBtn" type="button">Show me a racing tip</button>
      </section>
    </div>
  </main>

  <div class="finish-card" id="finishCard" role="dialog" aria-modal="true" aria-labelledby="finishTitle" hidden>
    <div class="finish-dialog">
      <div class="trophy" aria-hidden="true">1</div>
      <h2 id="finishTitle">You won the race!</h2>
      <p id="finishSummary">Eight smart merges. That was fast thinking.</p>
      <button class="race-again" id="raceAgain" type="button">Race again</button>
    </div>
  </div>

  <section class="worksheet-wrap" id="worksheet" aria-labelledby="worksheetTitle">
    <div class="ws-head">
      <h2 id="worksheetTitle">Take it to paper</h2>
      <p>Print a fresh worksheet anytime. The race stays in the game; the practice goes on the fridge.</p>
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
      <p class="print-note"><strong>Ready for paper?</strong> Use your browser&rsquo;s print command. The controls will be hidden automatically, and the worksheet will fill the page.</p>
      <div class="sheet" id="sheet">
        <div class="sheet-head">
          <h3>Addition Practice</h3>
          <span class="name-line"><span>Name:</span><span class="name-blank" aria-hidden="true"></span></span>
        </div>
        <div class="problem-grid" id="worksheet-grid"></div>
        <div class="answer-key-label">Answers are shown in green.</div>
      </div>
    </div>
  </section>

`;

export const MATH_TOOL_JS = `

    (function () {
      'use strict';

      var TOTAL_LAPS = 8;
      var state = {
        mode: 'basic', target: 10, values: [], selected: [], score: 0,
        streak: 0, mistakes: 0, locked: false, sound: true
      };

      var els = {
        target: document.getElementById('targetNumber'),
        cars: document.getElementById('cars'),
        slotA: document.getElementById('slotA'),
        slotB: document.getElementById('slotB'),
        sum: document.getElementById('sumSlot'),
        feedback: document.getElementById('feedback'),
        feedbackText: document.getElementById('feedbackText'),
        lap: document.getElementById('lapStat'),
        streak: document.getElementById('streakStat'),
        progress: document.getElementById('progressFill'),
        racer: document.getElementById('racer'),
        track: document.getElementById('track'),
        trackStatus: document.getElementById('trackStatus'),
        finish: document.getElementById('finishCard'),
        finishSummary: document.getElementById('finishSummary'),
        soundBtn: document.getElementById('soundBtn'),
        soundIcon: document.getElementById('soundIcon'),
        challengeSub: document.getElementById('challengeSub')
      };


      /** Progress storage contract. All implementations expose load/save/clear. */
      class ProgressStore {
        load() { throw new Error("ProgressStore.load must be implemented"); }
        save(progress) { throw new Error("ProgressStore.save must be implemented"); }
        clear() { throw new Error("ProgressStore.clear must be implemented"); }
      }

      function emptyProgress() {
        return { correct: 0, streak: 0, bestStreak: 0, racesWon: 0 };
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

      class LocalStorageProgressStore extends BrowserStorageProgressStore {
        constructor() { super(window.localStorage, "kids-math-addition-progress"); }
      }

      // Site policy: persist progress in this browser via localStorage.
      const progressStore = new LocalStorageProgressStore();

      var audioCtx = null;
      function tone(freq, duration, delay) {
        if (!state.sound) return;
        try {
          audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
          if (audioCtx.state === 'suspended') audioCtx.resume();
          var osc = audioCtx.createOscillator();
          var gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.0001, audioCtx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + delay + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + duration);
          osc.connect(gain); gain.connect(audioCtx.destination);
          osc.start(audioCtx.currentTime + delay);
          osc.stop(audioCtx.currentTime + delay + duration + .02);
        } catch (e) { /* sound is optional */ }
      }
      function goodSound() { tone(440, .15, 0); tone(660, .2, .12); tone(880, .25, .26); }
      function softSound() { tone(220, .14, 0); tone(185, .18, .1); }
      function pickSound() { tone(330, .08, 0); }

      function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
      function shuffle(items) {
        for (var i = items.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var t = items[i]; items[i] = items[j]; items[j] = t;
        }
        return items;
      }
      function uniquePush(arr, value, max) {
        value = Math.max(0, Math.min(max, value));
        if (arr.indexOf(value) === -1) arr.push(value);
      }

      function makeRound() {
        var advanced = state.mode === 'advanced';
        var target = advanced ? rand(32, 96) : rand(7, 20);
        var minA = advanced ? 11 : 0;
        var a = rand(minA, target - minA);
        var b = target - a;
        var max = advanced ? 89 : 20;
        var vals = [a, b];
        while (vals.length < 6) {
          var v = advanced ? rand(8, Math.min(89, target + 22)) : rand(0, 20);
          uniquePush(vals, v, max);
        }
        state.target = target;
        state.values = shuffle(vals);
        state.selected = [];
        state.mistakes = 0;
        state.locked = false;
        renderRound();
      }

      function renderRound() {
        els.target.textContent = state.target;
        els.target.setAttribute('aria-label', 'Target number ' + state.target);
        els.cars.innerHTML = '';
        state.values.forEach(function (value, index) {
          var button = document.createElement('button');
          button.className = 'number-car';
          button.type = 'button';
          button.textContent = value;
          button.dataset.index = index;
          button.setAttribute('aria-label', 'Number car ' + value);
          button.setAttribute('aria-pressed', 'false');
          button.addEventListener('click', function () { selectCar(index); });
          els.cars.appendChild(button);
        });
        updateSlots();
        setFeedback('Find a pair, then watch your racer fly.', 'normal');
      }

      function selectCar(index) {
        if (state.locked) return;
        var found = state.selected.indexOf(index);
        if (found !== -1) {
          state.selected.splice(found, 1);
          pickSound();
          updateSlots();
          return;
        }
        if (state.selected.length >= 2) return;
        state.selected.push(index);
        pickSound();
        updateSlots();
        if (state.selected.length === 2) checkPair();
      }

      function updateSlots() {
        var buttons = els.cars.querySelectorAll('.number-car');
        buttons.forEach(function (button, index) {
          var active = state.selected.indexOf(index) !== -1;
          button.classList.toggle('selected', active);
          button.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        var a = state.selected.length > 0 ? state.values[state.selected[0]] : null;
        var b = state.selected.length > 1 ? state.values[state.selected[1]] : null;
        setSlot(els.slotA, a, 'First');
        setSlot(els.slotB, b, 'Second');
        if (a !== null && b !== null) {
          els.sum.textContent = a + b;
          els.sum.setAttribute('aria-label', 'Your sum ' + (a + b));
        } else {
          els.sum.textContent = state.target;
          els.sum.setAttribute('aria-label', 'Target sum ' + state.target);
        }
      }

      function setSlot(el, value, label) {
        el.classList.toggle('empty', value === null);
        if (value === null) {
          el.textContent = '';
          el.setAttribute('aria-label', label + ' number not selected');
        } else {
          el.textContent = value;
          el.setAttribute('aria-label', label + ' number ' + value);
        }
      }

      function checkPair() {
        state.locked = true;
        var a = state.values[state.selected[0]];
        var b = state.values[state.selected[1]];
        if (a + b === state.target) {
          state.score += 1;
          state.streak += 1;
          var won = progressStore.load();
          progressStore.save({
            correct: won.correct + 1,
            streak: state.streak,
            bestStreak: Math.max(won.bestStreak || 0, state.streak),
            racesWon: won.racesWon || 0
          });
          els.streak.textContent = state.streak;
          goodSound();
          setFeedback(a + ' + ' + b + ' = ' + state.target + '. Turbo merge!', 'success');
          animateProgress();
          burstConfetti();
          setTimeout(function () {
            if (state.score >= TOTAL_LAPS) finishRace();
            else makeRound();
          }, 1250);
        } else {
          state.streak = 0;
          state.mistakes += 1;
          var kept = progressStore.load();
          kept.streak = 0;
          progressStore.save(kept);
          els.streak.textContent = 0;
          softSound();
          setFeedback(a + ' + ' + b + ' = ' + (a + b) + '. Close — try a different pair.', 'error');
          document.getElementById('mergeBay').classList.add('shake');
          setTimeout(function () {
            document.getElementById('mergeBay').classList.remove('shake');
            state.selected = [];
            state.locked = false;
            updateSlots();
            if (state.mistakes >= 2) showTip();
          }, 650);
        }
      }

      function animateProgress() {
        var pct = (state.score / TOTAL_LAPS) * 100;
        els.progress.style.width = pct + '%';
        els.racer.style.left = (2 + pct * .7) + '%';
        els.racer.classList.remove('boost');
        els.track.classList.remove('correct');
        void els.racer.offsetWidth;
        els.racer.classList.add('boost');
        els.track.classList.add('correct');
        els.lap.textContent = Math.min(TOTAL_LAPS, state.score + 1);
        var remain = TOTAL_LAPS - state.score;
        els.trackStatus.textContent = remain === 0 ? 'Finish line!' : remain + (remain === 1 ? ' merge' : ' merges') + ' to finish';
      }

      function setFeedback(text, kind) {
        els.feedbackText.textContent = text;
        els.feedback.className = 'feedback';
        if (kind === 'error') els.feedback.classList.add('error');
        if (kind === 'tip') els.feedback.classList.add('tip');
      }

      function showTip() {
        var answerIndex = -1;
        var pair = null;
        for (var i = 0; i < state.values.length; i++) {
          for (var j = i + 1; j < state.values.length; j++) {
            if (state.values[i] + state.values[j] === state.target) {
              answerIndex = i; pair = [state.values[i], state.values[j]]; break;
            }
          }
          if (answerIndex !== -1) break;
        }
        if (!pair) return;
        var first = pair[0];
        var message;
        if (state.mode === 'basic' && state.target >= 10 && first < 10) {
          var toTen = 10 - first;
          message = 'Pit-stop tip: ' + first + ' needs ' + toTen + ' to make 10. Then count the rest to ' + state.target + '.';
        } else if (state.mode === 'advanced') {
          var tens = Math.floor(first / 10) * 10;
          message = 'Pit-stop tip: split ' + first + ' into ' + tens + ' and ' + (first - tens) + '. Add the tens first, then the ones.';
        } else {
          message = 'Pit-stop tip: start at ' + first + ' and count up to ' + state.target + '. How many jumps did you make?';
        }
        setFeedback(message, 'tip');
      }

      function burstConfetti() {
        var colors = ['#f06449', '#f6c945', '#1c8b66', '#4f8cc9', '#ffffff'];
        for (var i = 0; i < 22; i++) {
          var piece = document.createElement('i');
          piece.className = 'confetti';
          piece.style.left = (40 + Math.random() * 25) + 'vw';
          piece.style.top = (20 + Math.random() * 20) + 'vh';
          piece.style.background = colors[i % colors.length];
          piece.style.setProperty('--dx', (Math.random() * 260 - 130) + 'px');
          piece.style.animationDelay = (Math.random() * .16) + 's';
          document.body.appendChild(piece);
          setTimeout((function (node) { return function () { node.remove(); }; })(piece), 1400);
        }
      }

      function finishRace() {
        els.finishSummary.textContent = 'Eight smart merges' + (state.streak >= 4 ? ' and a ' + state.streak + '-answer streak.' : '. That was fast thinking.');
        els.finish.hidden = false;
        var done = progressStore.load();
        done.racesWon = (done.racesWon || 0) + 1;
        progressStore.save(done);
        var raf = window.requestAnimationFrame || function (fn) { return setTimeout(fn, 0); };
        raf(function () {
          els.finish.classList.add('show');
          document.getElementById('raceAgain').focus();
        });
      }

      function resetRace() {
        state.score = 0;
        state.streak = 0;
        state.mistakes = 0;
        els.streak.textContent = 0;
        els.lap.textContent = 1;
        els.progress.style.width = '0%';
        els.racer.style.left = '2%';
        els.trackStatus.textContent = '8 correct merges to finish';
        els.finish.classList.remove('show');
        els.finish.hidden = true;
        makeRound();
      }

      document.querySelectorAll('.mode-btn').forEach(function (button) {
        button.addEventListener('click', function () {
          state.mode = button.dataset.mode;
          document.querySelectorAll('.mode-btn').forEach(function (b) {
            var active = b === button;
            b.classList.toggle('active', active);
            b.setAttribute('aria-pressed', active ? 'true' : 'false');
          });
          els.challengeSub.textContent = state.mode === 'basic'
            ? 'Pick two cars that add to the number.'
            : 'Add tens and ones to hit the number.';
          resetRace();
        });
      });

      document.getElementById('resetPick').addEventListener('click', function () {
        if (state.locked) return;
        state.selected = [];
        updateSlots();
        setFeedback('Cleared. Choose a new pair.', 'normal');
      });
      document.getElementById('tipBtn').addEventListener('click', showTip);
      document.getElementById('raceAgain').addEventListener('click', resetRace);
      els.soundBtn.addEventListener('click', function () {
        state.sound = !state.sound;
        els.soundBtn.setAttribute('aria-pressed', state.sound ? 'true' : 'false');
        els.soundBtn.setAttribute('aria-label', state.sound ? 'Turn sound off' : 'Turn sound on');
        els.soundBtn.title = state.sound ? 'Sound on' : 'Sound off';
        els.soundIcon.innerHTML = state.sound
          ? '<path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zm-2.5-8.7v2.1a7 7 0 0 1 0 13.2v2.1a9 9 0 0 0 0-17.4z"/>'
          : '<path d="M4 9v6h4l5 4V5L8 9H4zm12.6 3 2.7-2.7-1.4-1.4-2.7 2.7-2.7-2.7-1.4 1.4 2.7 2.7-2.7 2.7 1.4 1.4 2.7-2.7 2.7 2.7 1.4-1.4-2.7-2.7z"/>';
        if (state.sound) pickSound();
      });


      /* ---- Printable worksheet ---- */
      var worksheetGrid = document.getElementById("worksheet-grid");
      var sheet = document.getElementById("sheet");

      function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      function generateWorksheet() {
        var limit = Number(document.getElementById("range-select").value);
        var count = Number(document.getElementById("count-select").value);
        var seen = {};
        var out = "";
        var made = 0;
        var tries = 0;
        while (made < count && tries < 600) {
          tries += 1;
          var a = randomInt(0, limit);
          var b = randomInt(0, limit - a);
          var key = Math.min(a, b) + ":" + Math.max(a, b);
          if (seen[key]) continue;
          seen[key] = true;
          made += 1;
          out += '<div class="sheet-problem"><span>' + a + " + " + b + ' = ______</span><span class="sheet-answer">' + (a + b) + "</span></div>";
        }
        worksheetGrid.innerHTML = out;
      }

      document.getElementById("generate-btn").addEventListener("click", generateWorksheet);
      document.getElementById("answers-toggle").addEventListener("change", function (event) {
        sheet.classList.toggle("show-answers", event.target.checked);
      });

      generateWorksheet();

      makeRound();
    })();
  
`;
