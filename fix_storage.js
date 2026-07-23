const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// 1. handleTestAnswer replacements
const failLogic = `let failData = JSON.parse(localStorage.getItem('doacore_total_fails')) || {};
        failData[wordObj.word] = (failData[wordObj.word] || 0) + 1;
        localStorage.setItem('doacore_total_fails', JSON.stringify(failData));
        wordObj.totalFails = failData[wordObj.word];`;
code = code.replace(/wordObj\.totalFails = \(wordObj\.totalFails \|\| 0\) \+ 1;/g, failLogic);

// 2. parseWords replacement
// Find the end of parseWords function
code = code.replace(/  return list;\r?\n\}/g, `  let failData = JSON.parse(localStorage.getItem('doacore_total_fails')) || {};
  list.forEach(w => {
    w.totalFails = failData[w.word] || 0;
  });
  return list;\n}`);

// 3. goHomeHandler replacement (two places where showView('view-input') is called)
const homeSync = `let failData = JSON.parse(localStorage.getItem('doacore_total_fails')) || {};
      if (App.allWords) {
        App.allWords.forEach(w => {
          w.totalFails = failData[w.word] || 0;
        });
      }
      showView('view-input');`;
code = code.replace(/showView\('view-input'\);/g, homeSync);

// 4. startWeaknessReview replacement
const reviewLog = `console.log("로컬스토리지 오답 데이터:", localStorage.getItem('doacore_total_fails'));
  rangeWords.forEach`;
code = code.replace(/rangeWords\.forEach/g, reviewLog);

// 5. Clean up saveWordStates
code = code.replace(/states\[wordKey\] = \{ passed: w\.passed, attempts: w\.attempts, totalFails: w\.totalFails \|\| 0 \};/g, 'states[wordKey] = { passed: w.passed, attempts: w.attempts };');

// 6. Clean up loadWordStates
code = code.replace(/w\.passed = states\[wordKey\]\.passed;\r?\n\s+w\.attempts = states\[wordKey\]\.attempts;\r?\n\s+w\.totalFails = states\[wordKey\]\.totalFails \|\| 0;/g, 'w.passed = states[wordKey].passed;\n        w.attempts = states[wordKey].attempts;');

fs.writeFileSync('app.js', code, 'utf8');
console.log('Update completed');
