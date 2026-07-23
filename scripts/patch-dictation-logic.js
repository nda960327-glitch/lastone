const fs = require('fs');

function patchFile() {
  let js = fs.readFileSync('app.js', 'utf8');
  js = js.replace(/\r\n/g, '\n');

  // 1. Add waitForDictationOrPrev function
  const dictationFunc = `
function waitForDictationOrPrev(wordObj) {
  return new Promise(resolve => {
    oxResolver = resolve; // Reusing oxResolver for PREV button support
    
    const inputEl = document.getElementById('dictation-input');
    const feedbackEl = document.getElementById('dictation-feedback');
    const submitBtn = document.getElementById('btn-dictation-submit');
    const btnPrev = document.getElementById('btn-prev-word');
    
    if (btnPrev) {
      btnPrev.onclick = () => {
        if (oxResolver) { oxResolver('PREV'); oxResolver = null; }
      };
    }

    inputEl.value = '';
    inputEl.style.borderColor = 'rgba(255,255,255,0.2)';
    feedbackEl.textContent = '';
    feedbackEl.style.color = '';
    inputEl.focus();

    let failedOnce = false;

    const checkAnswer = () => {
      const val = inputEl.value.trim().toLowerCase();
      const ans = wordObj.word.trim().toLowerCase();
      
      if (val === ans) {
        inputEl.style.borderColor = '#10b981'; // Green
        feedbackEl.textContent = '정답!';
        feedbackEl.style.color = '#10b981';
        setTimeout(() => {
          if (oxResolver) {
            oxResolver(failedOnce ? 'X_DICTATION' : 'O');
            oxResolver = null;
          }
        }, 300);
      } else {
        // 오답 강제 제어 (Lock)
        if (!failedOnce) {
          failedOnce = true;
          wordObj.attempts = (wordObj.attempts || 0) + 1;
          wordObj.streak = 0;
          if (typeof saveProgress === 'function') saveProgress();
        }
        
        // Error sound
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play().catch(e=>console.log(e));
        
        inputEl.style.borderColor = '#ef4444'; // Red
        feedbackEl.innerHTML = \`정답: <span style="color:#ef4444;">\${wordObj.word}</span>\`;
        feedbackEl.style.color = '#fff';
      }
    };

    inputEl.onkeydown = (e) => {
      if (e.key === 'Enter') {
        checkAnswer();
      }
    };
    
    if (submitBtn) {
      submitBtn.onclick = checkAnswer;
    }
  });
}
`;

  if (!js.includes('function waitForDictationOrPrev')) {
    js = js.replace('function waitForOXOrPrev() {', dictationFunc + '\nfunction waitForOXOrPrev() {');
  }

  // 2. Replace result waiting logic in runTestRound
  const waitStr = `    const result = await waitForOXOrPrev();
    stopWordTimer();
    setOXDisabled(true);`;

  const waitReplace = `    let result = 'O';
    if (isDictationMode) {
      result = await waitForDictationOrPrev(wordObj);
    } else {
      result = await waitForOXOrPrev();
    }
    stopWordTimer();
    setOXDisabled(true);`;
    
  js = js.replace(waitStr, waitReplace);

  // 3. Update result handling to include X_DICTATION
  const resultHandlingStr = `    } else if (result === 'X' || result === 'SKIP' || result === 'TIMEOUT') {
      wordObj.attempts++;
      wordObj.streak = 0; // 강등
      wrongThisRound.push(wordObj);
    }`;

  const resultHandlingReplace = `    } else if (result === 'X' || result === 'SKIP' || result === 'TIMEOUT' || result === 'X_DICTATION') {
      if (result !== 'X_DICTATION') {
        wordObj.attempts++;
        wordObj.streak = 0; // 강등
      }
      wrongThisRound.push(wordObj);
    }`;

  js = js.replace(resultHandlingStr, resultHandlingReplace);

  js = js.replace(/\n/g, '\r\n');
  fs.writeFileSync('app.js', js, 'utf8');
}

patchFile();
console.log('Patched app.js with dictation logic');
