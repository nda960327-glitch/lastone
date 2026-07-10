const fs = require('fs');

function fixAppJs() {
  let js = fs.readFileSync('app.js', 'utf8');

  // Fix inline colors
  js = js.replace(/color:\s*['"]#ffffff['"]/gi, "color: 'var(--text1)'");
  js = js.replace(/color:\s*['"]#fff(?:fff)?['"]/gi, "color: 'var(--text1)'");
  js = js.replace(/color:\s*['"]white['"]/gi, "color: 'var(--text1)'");

  // Add reset logic
  const resetLogic = `
  const btnResetProgress = document.getElementById('btn-reset-progress');
  if (btnResetProgress) {
    btnResetProgress.addEventListener('click', async (e) => {
      e.stopPropagation();
      const confirmReset = confirm('정말로 모든 학습 기록(진행도, 오답 등)을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
      if (confirmReset) {
        try {
          if (typeof clearProgressIDB === 'function') await clearProgressIDB();
          if (App && App.words) {
            App.words.forEach(w => {
              w.passed = 0;
              w.attempts = 0;
            });
            if (typeof saveWordStatesIDB === 'function') await saveWordStatesIDB();
          }
          App.testPool = [];
          alert('학습 기록이 성공적으로 초기화되었습니다.');
          location.reload();
        } catch (error) {
          console.error('초기화 중 오류 발생:', error);
          alert('초기화 중 오류가 발생했습니다.');
        }
      }
    });
  }
`;

  // Insert reset logic at the end of the IIFE for settings
  if (js.includes('btnSettings.addEventListener') && !js.includes('btn-reset-progress')) {
    js = js.replace(/\}\)\(\);\s*\(function\(\) \{\s*const themeBtns/m, resetLogic + '\n})();\n\n(function() { \n  const themeBtns');
  }

  fs.writeFileSync('app.js', js, 'utf8');
}

fixAppJs();
console.log('Fixed app.js');
