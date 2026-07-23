const fs = require('fs');

function processCss() {
  let css = fs.readFileSync('style.css', 'utf8');

  const newCss = `
/* =============================================
   SCREENSHOT UI OVERRIDES
   ============================================= */
.btn-pill {
  padding: 8px 16px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}
.btn-pill-outline {
  background: var(--card-bg) !important;
  border: 1px solid var(--box-border) !important;
  color: var(--text-main) !important;
}
.btn-pill-blue {
  background: #E0E7FF !important;
  color: #3730A3 !important;
  border: none !important;
}

.progress-container {
  height: 4px;
  background: var(--box-border);
  border-radius: 4px;
  margin: 16px 0 24px 0;
  overflow: hidden;
  width: 100%;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3B82F6, #8B5CF6);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.test-word {
  font-size: clamp(2.5rem, 12vw, 4.5rem) !important;
  font-weight: 900 !important;
  color: #1E3A8A !important;
  text-align: center;
  margin: 40px 0;
  letter-spacing: -0.02em;
}

.btn-ox-new {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  border-radius: 20px;
  border: 1px solid var(--box-border);
  transition: all 0.2s ease;
  cursor: pointer;
}
.btn-ox-new:active { transform: scale(0.96); }
.btn-ox-new.btn-o { background-color: #EFF6FF !important; border-color: #BFDBFE !important; }
.btn-ox-new.btn-o .ox-mark { color: #3B82F6; font-size: 48px; font-weight: 900; line-height: 1; }
.btn-ox-new.btn-o .ox-label { color: #64748B; font-size: 14px; margin-top: 8px; font-weight: 500; }

.btn-ox-new.btn-x { background-color: #FEF2F2 !important; border-color: #FECACA !important; }
.btn-ox-new.btn-x .ox-mark { color: #EF4444; font-size: 48px; font-weight: 900; line-height: 1; }
.btn-ox-new.btn-x .ox-label { color: #F87171; font-size: 14px; margin-top: 8px; font-weight: 500; }

.meaning-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 12px;
  margin-bottom: 8px;
  border: 1px solid var(--box-border);
  font-size: 16px;
  font-weight: 500;
}
.pos-bg-n { background-color: #EFF6FF !important; color: #2563EB !important; border-color: #BFDBFE !important; }
.pos-bg-v { background-color: #FEF2F2 !important; color: #EF4444 !important; border-color: #FECACA !important; }
.pos-bg-a { background-color: #ECFDF5 !important; color: #10B981 !important; border-color: #A7F3D0 !important; }
.pos-bg-ad { background-color: #F5F3FF !important; color: #8B5CF6 !important; border-color: #DDD6FE !important; }
.pos-bg-default { background-color: #F8FAFC !important; color: #475569 !important; border-color: #E2E8F0 !important; }

.pos-badge {
  font-weight: 800;
  flex-shrink: 0;
}
.meaning-text {
  color: inherit !important;
}

#test-meanings {
  margin-bottom: 24px;
}

.nav-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
}
`;

  if(!css.includes('SCREENSHOT UI OVERRIDES')) {
    css += '\n' + newCss;
    fs.writeFileSync('style.css', css, 'utf8');
  }
}

function processAppJs() {
  let js = fs.readFileSync('app.js', 'utf8');

  // Modify ox-buttons-container HTML
  js = js.replace(/<div id="ox-buttons-container"[\s\S]*?<\/div>/, `<div id="ox-buttons-container" class="ox-buttons-container hidden" style="display:none; width:100%; justify-content:center; gap:16px;">
          <button id="btn-correct" class="btn-ox-new btn-o">
            <span class="ox-mark">O</span>
            <span class="ox-label">알고 있어요</span>
          </button>
          <button id="btn-wrong" class="btn-ox-new btn-x">
            <span class="ox-mark">X</span>
            <span class="ox-label">몰랐어요</span>
          </button>
        </div>`);

  // Modify meaningHTML to apply color to entire row
  js = js.replace(/<div class="meaning-row pos-bg-\$\{pClass \|\| 'default'\}">/g, `<div class="meaning-row pos-bg-\${pClass || 'default'}">`);

  // We need to overwrite the meaningHTML entirely to make sure it matches the screenshot exactly
  const meaningRegex = /function meaningHTML\(meanings, wordObj\) \{[\s\S]*?return posBadges;[\s\S]*?\}/;
  const newMeaningHTML = `function meaningHTML(meanings, wordObj) {
  try {
    if (wordObj && wordObj.partOfSpeech && wordObj.meaning) {
      const parts = wordObj.meaning.split('/').map(s => s.trim());
      if (wordObj.partOfSpeech.length === parts.length) {
        return wordObj.partOfSpeech.map((p, i) => {
          const pClass = p.toLowerCase().replace(/[^a-z]/g,'');
          return \`
          <div class="meaning-row pos-bg-\${pClass || 'default'}">
            <span class="pos-badge">[\${p}]</span>
            <span class="meaning-text">\${parts[i]}</span>
          </div>
        \`}).join('');
      } else {
        const pClass = wordObj.partOfSpeech[0] ? wordObj.partOfSpeech[0].toLowerCase().replace(/[^a-z]/g,'') : 'default';
        return \`<div class="meaning-row pos-bg-\${pClass}">
          <span class="pos-badge">[\${wordObj.partOfSpeech.join(', ')}]</span>
          <span class="meaning-text">\${wordObj.meaning}</span>
        </div>\`;
      }
    }
    return \`<div class="meaning-row pos-bg-default"><span class="meaning-text">\${meanings}</span></div>\`;
  } catch(e) {
    return \`<div class="meaning-row pos-bg-default"><span class="meaning-text">\${meanings}</span></div>\`;
  }
}`;
  js = js.replace(meaningRegex, newMeaningHTML);

  // Overwrite the header of test section
  const headerRegex = /<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">[\s\S]*?<\/div>/;
  const newHeader = `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <button id="btn-back-home" class="btn-pill btn-pill-outline">🏠 홈으로</button>
          <div class="btn-pill btn-pill-blue">Round \${App.round} · 테스트</div>
          <div class="count-text" style="color: #3B82F6; font-weight: 600;">\${App.currentTestIndex + 1} / \${App.testPool.length}</div>
        </div>
        <div class="progress-container"><div class="progress-bar" style="width: \${((App.currentTestIndex) / App.testPool.length) * 100}%"></div></div>`;
  js = js.replace(headerRegex, newHeader);

  // Overwrite btn-reveal button
  js = js.replace(/<button id="btn-reveal"[^>]*>뜻 확인하기<\/button>/, `<div style="text-align: center; margin-top: 24px;"><button id="btn-reveal" class="btn-pill btn-pill-outline" style="padding: 16px 32px; color: #3B82F6; border-color: #BFDBFE;">👁️ 뜻 확인하기</button></div>`);

  // Overwrite prev/next buttons
  js = js.replace(/<button id="btn-prev"[^>]*>이전 단어<\/button>[\s\S]*?<button id="btn-next"[^>]*>다음 단어<\/button>/, `<button id="btn-prev" class="btn-pill btn-pill-outline" style="padding: 14px 24px;">◀ 이전 단어</button>
          <button id="btn-next" class="btn-pill btn-pill-outline" style="padding: 14px 24px;">다음 단어 ▶</button>`);

  fs.writeFileSync('app.js', js, 'utf8');
}

processCss();
processAppJs();
console.log('Screenshot UI applied!');
