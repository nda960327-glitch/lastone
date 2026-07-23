const fs = require('fs');

function patchFile() {
  let js = fs.readFileSync('app.js', 'utf8');
  js = js.replace(/\r\n/g, '\n');

  const targetStr = `    let failedOnce = false;

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
      }`;

  const replaceStr = `    let failedCount = 0;

    const checkAnswer = () => {
      const val = inputEl.value.trim().toLowerCase();
      const ans = wordObj.word.trim().toLowerCase();
      
      if (val === ans) {
        inputEl.style.borderColor = '#10b981'; // Green
        feedbackEl.textContent = '정답!';
        feedbackEl.style.color = '#10b981';
        setTimeout(() => {
          if (oxResolver) {
            oxResolver(failedCount > 0 ? 'X_DICTATION' : 'O');
            oxResolver = null;
          }
        }, 300);
      } else {
        // 오답 강제 제어 (Lock)
        if (failedCount === 0) {
          wordObj.attempts = (wordObj.attempts || 0) + 1;
          wordObj.streak = 0;
          if (typeof saveProgress === 'function') saveProgress();
        }
        
        failedCount++;
        
        // Error sound
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play().catch(e=>console.log(e));
        
        inputEl.style.borderColor = '#ef4444'; // Red
        if (failedCount === 1) {
          feedbackEl.innerHTML = '틀렸습니다. 다시 한 번 시도해 보세요!';
          feedbackEl.style.color = '#ef4444';
          inputEl.value = ''; // 1회 틀렸을 때 입력창 비워주기
        } else {
          feedbackEl.innerHTML = \`정답: <span style="color:#ef4444;">\${wordObj.word}</span>\`;
          feedbackEl.style.color = '#fff';
        }
      }`;

  js = js.replace(targetStr, replaceStr);
  js = js.replace(/\n/g, '\r\n');
  fs.writeFileSync('app.js', js, 'utf8');
}

patchFile();
console.log('Patched failed count logic');
