const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// Replace existing [data-theme="blue"] completely
const blueRegex = /\[data-theme="blue"\]\s*\{[^}]+\}/;
if (blueRegex.test(css)) {
  css = css.replace(blueRegex, `[data-theme="blue"] {
  --bg-color: #F0F9FF;
  --card-bg: #FFFFFF;
  --text-main: #1E3A8A;
  --glow-color: rgba(59, 130, 246, 0.3);
  --btn-stroke: #BFDBFE;
  --o-bg: #DCFCE7; /* 연초록 파스텔 */
  --x-bg: #FFE4E6; /* 연분홍 파스텔 */
  
  /* 폴백 유지 */
  --text-sub: #475569;
  --primary-color: #2563EB;
  --primary-hover: #1D4ED8;
  --box-border: #DBEAFE;
  --dropdown-bg: #FFFFFF;
  --dropdown-hover: #F0F4F8;
  --input-bg: #F0F4F8;
  --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  --border-h: #2563EB;
}`);
}

// Replace existing [data-theme="pink"] completely
const pinkRegex = /\[data-theme="pink"\]\s*\{[^}]+\}/;
if (pinkRegex.test(css)) {
  css = css.replace(pinkRegex, `[data-theme="pink"] {
  --bg-color: #FFF0F5;
  --card-bg: #FFFFFF;
  --text-main: #9D174D;
  --glow-color: rgba(236, 72, 153, 0.3);
  --btn-stroke: #FBCFE8;
  --o-bg: #F3E8FF; /* 연보라 파스텔 */
  --x-bg: #FFE4E6; /* 연분홍 파스텔 */
  
  /* 폴백 유지 */
  --bg2: #ffe4e6;
  --glass-h: rgba(255, 255, 255, 1);
  --box-border: #fbcfe8;
  --border-h: rgba(244, 63, 94, 0.3);
  --dropdown-bg: rgba(255, 255, 255, 0.95);
  --dropdown-hover: #fff1f2;
  --input-bg: rgba(255, 255, 255, 0.7);
  --grad-1: rgba(244, 63, 94, 0.08);
  --grad-2: rgba(253, 164, 175, 0.08);
  --card-shadow: 0 8px 30px rgba(244, 63, 94, 0.1);
  --icon-filter: invert(1);
  --text-sub: #9ca3af;
  --text3: #fda4af;
  --primary-color: #ec4899;
}`);
}

// Replace text-shadow in .test-word
const testWordShadow = /text-shadow:\s*0\s+2px\s+20px\s+rgba\(168,85,247,0\.4\);/;
if (testWordShadow.test(css)) {
  css = css.replace(testWordShadow, 'text-shadow: 0 0 15px var(--glow-color, transparent);');
} else {
  // If not exactly matched, append to .test-word
  css = css.replace('.test-word {', '.test-word {\n  text-shadow: 0 0 15px var(--glow-color, transparent) !important;');
}

const appendStyles = `
/* ========================================= */
/* 🌸 핑크 & 🌊 블루 파스텔 글로우 모드 전용 UI */
/* ========================================= */

[data-theme="pink"] .test-card,
[data-theme="blue"] .test-card {
  border-radius: 24px !important;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05) !important;
  border: none !important;
}

[data-theme="pink"] .btn-reveal,
[data-theme="blue"] .btn-reveal {
  border-radius: 50px !important;
  background-color: transparent !important;
  border: 2px solid var(--btn-stroke) !important;
  color: var(--text-main) !important;
}

[data-theme="pink"] .btn-ox-new.btn-o,
[data-theme="blue"] .btn-ox-new.btn-o {
  background-color: var(--o-bg) !important;
  border-color: var(--o-bg) !important;
  border-radius: 20px !important;
}
[data-theme="pink"] .btn-ox-new.btn-o .ox-mark,
[data-theme="blue"] .btn-ox-new.btn-o .ox-mark,
[data-theme="pink"] .btn-ox-new.btn-o .ox-label,
[data-theme="blue"] .btn-ox-new.btn-o .ox-label {
  color: var(--text-main) !important;
}

[data-theme="pink"] .btn-ox-new.btn-x,
[data-theme="blue"] .btn-ox-new.btn-x {
  background-color: var(--x-bg) !important;
  border-color: var(--x-bg) !important;
  border-radius: 20px !important;
}
[data-theme="pink"] .btn-ox-new.btn-x .ox-mark,
[data-theme="blue"] .btn-ox-new.btn-x .ox-mark,
[data-theme="pink"] .btn-ox-new.btn-x .ox-label,
[data-theme="blue"] .btn-ox-new.btn-x .ox-label {
  color: var(--text-main) !important;
}
`;

fs.writeFileSync('style.css', css + appendStyles, 'utf8');
console.log('Pastel glow styles injected!');
