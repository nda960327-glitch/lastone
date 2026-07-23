const fs = require('fs');

// ==== 1. app.js 수정 ====
let js = fs.readFileSync('app.js', 'utf8');

// Step 1: isPenaltyTime = false
if (js.includes('stopWordTimer();\n    const wordObj = pool[i];')) {
  js = js.replace('stopWordTimer();\n    const wordObj = pool[i];', 'stopWordTimer();\n    App.isPenaltyTime = false;\n    const wordObj = pool[i];');
}

// Step 2: hide hint-text
const showHintCode = `if (posHintEl) posHintEl.classList.remove('hidden');`;
if (js.includes(showHintCode)) {
  js = js.replace(showHintCode, `if (posHintEl) { posHintEl.classList.remove('hidden'); posHintEl.style.display = 'block'; }`);
}

const hideHintCode = `document.getElementById('test-meanings').classList.remove('hidden');`;
const hideHintNew = `document.getElementById('test-meanings').classList.remove('hidden');
      const hintEl = document.querySelector('.hint-text');
      if (hintEl) hintEl.style.display = 'none';`;
if (js.includes(hideHintCode) && !js.includes('hintEl.style.display = \'none\'')) {
  js = js.replace(hideHintCode, hideHintNew);
}

fs.writeFileSync('app.js', js, 'utf8');


// ==== 2. style.css 수정 ====
let css = fs.readFileSync('style.css', 'utf8');
const meaningRowOld = `.meaning-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 12px;
  margin-bottom: 8px;
  border: 1px solid var(--box-border);
  font-size: 16px;
  font-weight: 500;
}`;
const meaningRowNew = `.meaning-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 12px;
  margin-bottom: 8px;
  border: 1px solid var(--box-border);
  font-size: 16px;
  font-weight: 500;
  background-color: var(--card-bg) !important;
  color: var(--text-main) !important;
}`;
if (css.includes(meaningRowOld)) {
  css = css.replace(meaningRowOld, meaningRowNew);
  fs.writeFileSync('style.css', css, 'utf8');
}


// ==== 3. index.html 수정 ====
let html = fs.readFileSync('index.html', 'utf8');
const dictationZoneHTML = `
      <!-- Dictation Zone -->
      <div id="dictation-zone" class="hidden" style="display:flex; flex-direction:column; align-items:center; gap:16px; width:100%; margin-top: 16px;">
        <div style="position: relative; width: 100%; max-width: 360px;">
          <input type="text" id="dictation-input" placeholder="스펠링을 입력하고 Enter를 누르세요" autocomplete="off" style="width:100%; padding:18px 24px; font-size:20px; font-weight: 500; text-align:center; border-radius:16px; border:2px solid rgba(255,255,255,0.15); background:rgba(0,0,0,0.3); color: var(--text-main); outline:none; transition: all 0.3s ease; box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);" />
          <div id="dictation-feedback" style="font-size:16px; font-weight:700; margin-top: 12px; min-height: 24px; text-align: center;"></div>
        </div>
      </div>
    </div>

    <!-- 이전/다음 단어 버튼 -->`;

if (!html.includes('id="dictation-zone"')) {
  // Find where to insert it. The end of view-test is right before "이전/다음 단어 버튼"
  if (html.includes('    </div>\n\n    <!-- 이전/다음 단어 버튼 -->')) {
    html = html.replace('    </div>\n\n    <!-- 이전/다음 단어 버튼 -->', dictationZoneHTML);
    fs.writeFileSync('index.html', html, 'utf8');
  } else if (html.includes('    <!-- 이전/다음 단어 버튼 -->')) {
    html = html.replace('    <!-- 이전/다음 단어 버튼 -->', dictationZoneHTML.replace('    </div>\n\n', ''));
    fs.writeFileSync('index.html', html, 'utf8');
  }
}

console.log('Critical fixes applied successfully.');
