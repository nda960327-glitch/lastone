const fs = require('fs');

// ==== 1. app.js: fix setOXDisabled opacity reset ====
let js = fs.readFileSync('app.js', 'utf8');
const oldOX = `function setOXDisabled(disabled) {
  document.getElementById('btn-correct').disabled = disabled;
  document.getElementById('btn-wrong').disabled   = disabled;
}`;
const newOX = `function setOXDisabled(disabled) {
  const btnC = document.getElementById('btn-correct');
  const btnW = document.getElementById('btn-wrong');
  if (btnC) {
    btnC.disabled = disabled;
    btnC.style.opacity = disabled ? '0.5' : '1';
    btnC.style.pointerEvents = disabled ? 'none' : 'auto';
  }
  if (btnW) {
    btnW.disabled = disabled;
    btnW.style.opacity = disabled ? '0.5' : '1';
    btnW.style.pointerEvents = disabled ? 'none' : 'auto';
  }
}`;
if (js.includes(oldOX)) {
  js = js.replace(oldOX, newOX);
  fs.writeFileSync('app.js', js, 'utf8');
}


// ==== 2. index.html: move dictation-zone INSIDE test-card ====
let html = fs.readFileSync('index.html', 'utf8');
// It currently looks like:
/*
        <div class="ox-buttons hidden" id="ox-buttons-container" style="display: none; justify-content: center; gap: 20px; width: 100%;">
          ...
        </div>
      </div>
    </div>


      <!-- Dictation Zone -->
*/
// The '    </div>' before Dictation Zone closes test-card.
const regexMove = /<\/div>\s*<\/div>\s*<\/div>\s*<!-- Dictation Zone -->/;
if (regexMove.test(html)) {
  // We need to move the closing </div> of test-card to AFTER the dictation zone.
  html = html.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<!-- Dictation Zone -->/, '        </div>\n      </div>\n      <!-- Dictation Zone -->');
  // Now we need to add </div> after the dictation zone.
  html = html.replace(/<div id="dictation-feedback"[^>]+><\/div>\s*<\/div>\s*<\/div>/, '<div id="dictation-feedback" style="font-size:16px; font-weight:700; margin-top: 12px; min-height: 24px; text-align: center;"></div>\n        </div>\n      </div>\n    </div>');
  fs.writeFileSync('index.html', html, 'utf8');
} else {
  console.log("Could not find the exact pattern to move dictation-zone");
}

// ==== 3. style.css: Fix O/X colors and lighten blue theme ====
let css = fs.readFileSync('style.css', 'utf8');

// 3a. Blue theme was too dark? Wait, the user said "너무 진한색이 많음"
// The original blue theme had `--bg-color: #F0F4F8;` and `--text-main: #0F172A;`.
// My new blue theme had `--bg-color: #F0F9FF;` and `--text-main: #1E3A8A;`.
// `#1E3A8A` is dark blue. Maybe I should lighten the text a bit, or the user meant the O/X buttons were too dark?
// I will change O/X text colors to be natural.

const oxStylesRegex = /\[data-theme="pink"\] \.btn-ox-new\.btn-o \.ox-mark,[\s\S]*?color: var\(--text-main\) !important;\n\}/g;
// I will just replace the whole block I appended previously.
const oldAppendedStylesRegex = /\/\* ========================================= \*\/[\s\S]*/;
if (oldAppendedStylesRegex.test(css)) {
  css = css.replace(oldAppendedStylesRegex, `/* ========================================= */
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

/* O버튼 (자연스러운 컬러) */
[data-theme="pink"] .btn-ox-new.btn-o,
[data-theme="blue"] .btn-ox-new.btn-o {
  background-color: var(--o-bg) !important;
  border-color: var(--o-bg) !important;
  border-radius: 20px !important;
}
[data-theme="pink"] .btn-ox-new.btn-o .ox-mark,
[data-theme="pink"] .btn-ox-new.btn-o .ox-label {
  color: #7E22CE !important; /* 파스텔 보라 계열 진한색 */
}
[data-theme="blue"] .btn-ox-new.btn-o .ox-mark,
[data-theme="blue"] .btn-ox-new.btn-o .ox-label {
  color: #047857 !important; /* 파스텔 초록 계열 진한색 */
}

/* X버튼 (자연스러운 컬러) */
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
  color: #BE123C !important; /* 파스텔 레드 계열 진한색 */
}
`);
}

// And the user said "블루스킨 이상함 너무 진한색이 많음". 
// I will soften the blue theme's text-main slightly from #1E3A8A to #284795 or similar.
css = css.replace('--text-main: #1E3A8A;', '--text-main: #334155; /* 부드러운 다크 그레이블루 */');

fs.writeFileSync('style.css', css, 'utf8');

console.log('Fixed O button reset, dictation layout, and O/X natural colors.');
