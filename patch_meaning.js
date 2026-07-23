const fs = require('fs');

let code = fs.readFileSync('app.js', 'utf8');

// Replace meaningHTML
const oldFnMatch = code.match(/function meaningHTML\(meanings, wordObj\) \{[\s\S]*?\n\}/);
if (oldFnMatch) {
  const newFn = `function meaningHTML(meanings, wordObj) {
  try {
    if (wordObj && wordObj.partOfSpeech && wordObj.meaning) {
      const parts = wordObj.meaning.split('/').map(s => s.trim());
      if (wordObj.partOfSpeech.length === parts.length) {
        return wordObj.partOfSpeech.map((p, i) => \`
          <div class="meaning-card" style="display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px;">
            <span class="pos-badge pos-\${p.toLowerCase().replace(/[^a-z]/g,'')}">[\${p}]</span>
            <span class="meaning-text">\${parts[i]}</span>
          </div>
        \`).join('');
      } else {
        const posBadges = wordObj.partOfSpeech.map(p => \`<span class="pos-badge pos-\${p.toLowerCase().replace(/[^a-z]/g,'')}">[\${p}]</span>\`).join('');
        return \`
          <div class="meaning-card" style="display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px;">
            \${posBadges}
            <span class="meaning-text">\${wordObj.meaning}</span>
          </div>
        \`;
      }
    }
    return meanings.map(m => \`
      <div class="meaning-card" style="display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px;">
        <span class="pos-badge pos-\${m.pos.toLowerCase().replace(/[^a-z]/g,'')}">[\${m.pos}]</span>
        <span class="meaning-text">\${m.meaning}</span>
      </div>
    \`).join('');
  } catch(e) {
    console.error('meaningHTML rendering error:', e);
    return '<div class="meaning-card">Error rendering meaning</div>';
  }
}`;
  code = code.replace(oldFnMatch[0], newFn);
  console.log('Successfully replaced meaningHTML.');
} else {
  console.log('Failed to find meaningHTML.');
}

// Hoist home button bindings to the top of DOMContentLoaded
const homeBtnLogic = `  const goHomeHandler = () => {
    if (confirm('테스트를 중단하고 홈으로 돌아가시겠습니까?')) {
      if (App.studyAbort) App.studyAbort.abort();
      if (oxResolver) { oxResolver('PREV'); oxResolver = null; }
      isDictationMode = false; // reset
      App.words    = [];
      App.testPool = [];
      App.round    = 1;
      const wi = document.getElementById('word-input');
      if (wi) wi.dispatchEvent(new Event('input'));
      let failData = JSON.parse(localStorage.getItem('doacore_total_fails')) || {};
      if (App.allWords) {
        App.allWords.forEach(w => {
          w.totalFails = failData[w.word] || 0;
        });
      }
      showView('view-input');
    }
  };
  const btnHomeTest = document.getElementById('btn-home-test');
  if (btnHomeTest) btnHomeTest.onclick = goHomeHandler;
  const btnHomeResult = document.getElementById('btn-home-result');
  if (btnHomeResult) btnHomeResult.onclick = goHomeHandler;`;

if (code.includes('const btnHomeTest = document.getElementById(\'btn-home-test\');')) {
  // Remove the old bindings from the bottom
  code = code.replace(/const goHomeHandler = \(\) => \{[\s\S]*?if \(btnHomeResult\) btnHomeResult\.onclick = goHomeHandler;/g, '');
  
  // Insert at the top of DOMContentLoaded
  code = code.replace(/document\.addEventListener\('DOMContentLoaded', \(\) => \{/, "document.addEventListener('DOMContentLoaded', () => {\n" + homeBtnLogic);
  console.log('Successfully hoisted home button bindings.');
} else {
  console.log('Failed to hoist home button bindings.');
}

fs.writeFileSync('app.js', code, 'utf8');
