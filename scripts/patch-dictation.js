const fs = require('fs');

function patchFile() {
  let js = fs.readFileSync('app.js', 'utf8');

  // Normalize newlines for easier regex/replace
  js = js.replace(/\r\n/g, '\n');

  // 1. Add isDictationMode
  if (!js.includes('let isDictationMode = false;')) {
    js = js.replace('const App = {', 'let isDictationMode = false;\nconst App = {');
  }

  // 2. Add btn-dictation click listener
  const btnStartStr = "  // 테스트 시작\n  document.getElementById('btn-start').onclick = () => {";
  if (!js.includes("document.getElementById('btn-dictation').onclick")) {
    const dictationClick = `  // Dictation 모드 테스트 시작
  document.getElementById('btn-dictation').onclick = () => {
    const textarea = document.getElementById('word-input');
    const words = parseWords(textarea.value);
    if (words.length === 0) {
      alert('단어장을 선택해주세요.');
      return;
    }
    App.words = words;
    isDictationMode = true;
    App.round = 4;
    App.phase = 'TEST';
    App.testPool = App.words.slice(0, 200);
    App.currentTestIndex = 0;
    showView('view-test');
    runTestRound();
  };\n\n`;
    js = js.replace(btnStartStr, dictationClick + btnStartStr);
  }

  // 3. UI Toggling in runTestRound()
  const hideInitialStr = `    document.getElementById('reveal-zone').classList.add('hidden');
    document.getElementById('answer-zone').classList.add('hidden');`;

  const hideInitialReplace = `    if (isDictationMode) {
      document.getElementById('test-word').classList.add('hidden');
      document.querySelector('.ox-buttons').classList.add('hidden');
      document.getElementById('reveal-zone').classList.add('hidden');
      
      document.getElementById('answer-zone').classList.remove('hidden');
      document.getElementById('test-meanings').innerHTML = meaningHTML(wordObj.meanings);
      
      document.getElementById('dictation-zone').classList.remove('hidden');
      
      const btnReplay = document.getElementById('btn-replay-audio');
      if (btnReplay) btnReplay.onclick = () => speak(wordObj.word);
    } else {
      document.getElementById('test-word').classList.remove('hidden');
      const oxBtns = document.querySelector('.ox-buttons');
      if (oxBtns) oxBtns.classList.remove('hidden');
      const dicZone = document.getElementById('dictation-zone');
      if (dicZone) dicZone.classList.add('hidden');
      document.getElementById('reveal-zone').classList.add('hidden');
      document.getElementById('answer-zone').classList.add('hidden');
    }`;
  js = js.replace(hideInitialStr, hideInitialReplace);

  // 4. Timer Logic
  const timerLogicStart = "    startWordTimer(15000, handleWordTimeout);";
  const timerLogicReplace = `    if (!isDictationMode) {
      startWordTimer(15000, handleWordTimeout);
    }`;
  js = js.replace(timerLogicStart, timerLogicReplace);

  // 5 & 6. autoRevealTimeout Logic
  const autoRevealStr = `    let autoRevealTimeout = setTimeout(() => {
      autoRevealTriggered = true;
      const fillEl = document.getElementById('test-timer-fill');
      if (fillEl) fillEl.classList.add('timer-warning');
      
      const btnReveal = document.getElementById('btn-reveal');
      if (btnReveal) btnReveal.click(); // 강제 오픈
    }, dynamicTimeoutMs);

    const revealResult = await waitForRevealOrPrev();
    clearTimeout(autoRevealTimeout);`;

  const autoRevealReplace = `    let autoRevealTimeout = null;
    let revealResult = 'O'; 

    if (!isDictationMode) {
      autoRevealTimeout = setTimeout(() => {
        autoRevealTriggered = true;
        const fillEl = document.getElementById('test-timer-fill');
        if (fillEl) fillEl.classList.add('timer-warning');
        
        const btnReveal = document.getElementById('btn-reveal');
        if (btnReveal) btnReveal.click(); // 강제 오픈
      }, dynamicTimeoutMs);

      revealResult = await waitForRevealOrPrev();
      if (autoRevealTimeout) clearTimeout(autoRevealTimeout);
    }`;
  js = js.replace(autoRevealStr, autoRevealReplace);

  // 7. Hide answer-zone again logic
  const showAnswerZoneStr = `    document.getElementById('reveal-zone').classList.add('hidden');
    document.getElementById('test-meanings').innerHTML = meaningHTML(wordObj.meanings);
    document.getElementById('answer-zone').classList.remove('hidden');`;

  const showAnswerZoneReplace = `    if (!isDictationMode) {
      document.getElementById('reveal-zone').classList.add('hidden');
      document.getElementById('test-meanings').innerHTML = meaningHTML(wordObj.meanings);
      document.getElementById('answer-zone').classList.remove('hidden');
    }`;
  js = js.replace(showAnswerZoneStr, showAnswerZoneReplace);

  // 8. goHomeHandler reset
  const goHomeStr = `      App.words    = [];
      App.testPool = [];`;
  if (!js.includes('isDictationMode = false; // reset')) {
      js = js.replace(goHomeStr, `      isDictationMode = false; // reset\n      App.words    = [];\n      App.testPool = [];`);
  }

  // 9. btn-restart reset
  const restartStr = `  document.getElementById('btn-restart').onclick = () => {
    App.words    = [];`;
  if (!js.includes('isDictationMode = false; // restart')) {
      js = js.replace(restartStr, `  document.getElementById('btn-restart').onclick = () => {\n    isDictationMode = false; // restart\n    App.words    = [];`);
  }

  // Re-apply CRLF for Windows just in case
  js = js.replace(/\n/g, '\r\n');
  fs.writeFileSync('app.js', js, 'utf8');
}

patchFile();
console.log('Patched correctly.');
