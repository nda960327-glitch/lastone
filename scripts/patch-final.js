const fs = require('fs');

function patchHTML() {
  let html = fs.readFileSync('index.html', 'utf8');
  
  const targetHTML = `<div class="final-hero">
      <div class="trophy-anim">🏆</div>
      <h2>학습 완료!</h2>
      <p class="final-sub">모든 단어를 암기했습니다</p>
    </div>

    <div class="final-summary glass-card">
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-val" id="final-total">0</div>
          <div class="summary-key">총 단어</div>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-item">
          <div class="summary-val" id="final-rounds">0</div>
          <div class="summary-key">총 라운드</div>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-item">
          <div class="summary-val danger" id="final-hard">0</div>
          <div class="summary-key">1회↑ 오답</div>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-item">
          <div class="summary-val" style="color: #f59e0b;" id="final-hard-2">0</div>
          <div class="summary-key">2회↑ 오답</div>
        </div>
      </div>
    </div>

    <div class="final-actions">
      <button id="btn-toggle-table" class="btn-secondary">📋 성적표 닫기</button>
      <button id="btn-retry-hard" class="btn-primary hidden" style="background: linear-gradient(135deg, #f43f5e, #e11d48); box-shadow: 0 4px 20px rgba(244, 63, 94, 0.35);">🔁 1회↑ 오답 재시험</button>
      <button id="btn-retry-hard-2" class="btn-primary hidden" style="background: linear-gradient(135deg, #f59e0b, #d97706); box-shadow: 0 4px 20px rgba(245, 158, 11, 0.35);">🔥 2회↑ 오답 재시험</button>
    </div>`;

  const replaceHTML = `<div class="final-hero" style="margin-bottom: 30px;">
      <div class="trophy-anim" style="font-size: 60px;">🎉</div>
      <h2 style="color: #10b981;">정말 수고하셨습니다!</h2>
      <p class="final-sub" style="font-size: 16px; margin-top: 10px; line-height: 1.5;">
        포기하지 않고 끝까지 해낸 당신이 자랑스럽습니다.<br>
        오늘도 훌륭하게 성장을 이뤄내셨어요! 👏
      </p>
    </div>

    <div class="final-actions" style="justify-content: center; margin-bottom: 20px;">
      <button id="btn-toggle-table" class="btn-secondary" style="display: none;">📋 성적표 닫기</button>
    </div>`;

  html = html.replace(targetHTML, replaceHTML);
  fs.writeFileSync('index.html', html, 'utf8');
}

function patchJS() {
  let js = fs.readFileSync('app.js', 'utf8');
  js = js.replace(/\\r\\n/g, '\\n');

  const startIdx = js.indexOf('function showFinalResult() {');
  let endIdx = startIdx;
  let braceCount = 0;
  for (let i = startIdx; i < js.length; i++) {
    if (js[i] === '{') braceCount++;
    if (js[i] === '}') braceCount--;
    if (braceCount === 0 && i > startIdx) {
      endIdx = i;
      break;
    }
  }

  const replaceJS = `function showFinalResult() {
  // ── 최종 완료 시 단어 상태 영구 저장 ──
  saveWordStates();
  clearProgress();
  showView('view-final');

  const all = App.words;
  const wrongWords = all.filter(w => w.attempts > 0);

  const tableSection = document.getElementById('table-section');
  if (tableSection) tableSection.classList.remove('hidden');

  document.getElementById('btn-download-csv').onclick = () => {
    let csv = '\\ufeff번호,단어,뜻,오답 시도 횟수\\n';
    wrongWords.forEach((w, idx) => {
      const meaningsStr = w.meanings.map(m => \`[\${m.pos}] \${m.meaning}\`).join(' / ');
      csv += \`\${idx + 1},"\${w.word}","\${meaningsStr}",\${w.attempts}\\n\`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`VocabMaster_오답성적표.csv\`;
    a.click();
  };

  const tbody = document.getElementById('result-tbody');
  tbody.innerHTML = '';
  
  if (wrongWords.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = \`<td colspan="4" style="text-align:center; padding: 30px; font-weight:bold; color:#10b981; font-size: 18px;">🎉 오답이 한 개도 없습니다. 완벽합니다! 🎉</td>\`;
    tbody.appendChild(tr);
  } else {
    const sorted = [...wrongWords].sort((a, b) => b.attempts - a.attempts);
    sorted.forEach((w, idx) => {
      const tr = document.createElement('tr');
      if (w.attempts >= 3) {
        tr.style.background = 'rgba(245, 158, 11, 0.15)';
      } else if (w.attempts === 2) {
        tr.style.background = 'rgba(239, 68, 68, 0.08)';
      }
      const meaningsStr = w.meanings.map(m => \`<span class="pos-badge \${getPosClass(m.pos)}">[\${esc(m.pos)}]</span> \${esc(m.meaning)}\`).join('<br>');
      tr.innerHTML = \`
        <td>\${idx + 1}</td>
        <td style="font-weight: 700;">\${esc(w.word)}</td>
        <td style="text-align: left;">\${meaningsStr}</td>
        <td style="font-weight: bold; color: \${w.attempts >= 3 ? '#f59e0b' : w.attempts === 2 ? 'var(--red)' : 'var(--text1)'}">\${w.attempts}회</td>
      \`;
      tbody.appendChild(tr);
    });
  }

  document.getElementById('btn-restart').onclick = () => {
    isDictationMode = false; // restart
    App.words    = [];
    App.testPool = [];
    App.round    = 1;
    document.getElementById('word-input').value = '';
    const wc = document.getElementById('word-count');
    if (wc) {
      wc.textContent = '0개 단어';
      wc.style.color = 'var(--text2)';
    }
    showView('view-input');
  };
}`;

  js = js.substring(0, startIdx) + replaceJS + js.substring(endIdx + 1);
  js = js.replace(/\\n/g, '\\r\\n');
  fs.writeFileSync('app.js', js, 'utf8');
}

patchHTML();
patchJS();
console.log('Patched UI and JS to remove retest and show praise');
