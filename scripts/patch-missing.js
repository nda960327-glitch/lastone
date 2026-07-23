const fs = require('fs');
let js = fs.readFileSync('app.js', 'utf8');

if (!js.includes('let isDictationMode = false;')) {
    js = js.replace('// ---- 상태 (State) ----', 'let isDictationMode = false;\n// ---- 상태 (State) ----');
}

const hideBlockStart = `    document.getElementById('test-word').textContent = '';
    const btnSpeak = document.getElementById('btn-speak-again');
    if (btnSpeak) btnSpeak.classList.add('hidden');
    const posHintEl = document.getElementById('test-pos-hint');
    posHintEl.textContent = '';
    posHintEl.classList.add('hidden');
    document.getElementById('test-meanings').innerHTML = '';

    document.getElementById('reveal-zone').classList.add('hidden');
    document.getElementById('answer-zone').classList.add('hidden');`;

const hideBlockReplace = `    document.getElementById('test-word').textContent = '';
    const btnSpeak = document.getElementById('btn-speak-again');
    if (btnSpeak) btnSpeak.classList.add('hidden');
    const posHintEl = document.getElementById('test-pos-hint');
    posHintEl.textContent = '';
    posHintEl.classList.add('hidden');

    if (isDictationMode) {
      document.getElementById('test-word').classList.add('hidden');
      document.querySelector('.ox-buttons').classList.add('hidden');
      document.getElementById('reveal-zone').classList.add('hidden');
      
      document.getElementById('answer-zone').classList.remove('hidden');
      document.getElementById('test-meanings').innerHTML = meaningHTML(wordObj.meanings);
      
      document.getElementById('dictation-zone').classList.remove('hidden');
      
      const btnReplay = document.getElementById('btn-replay-audio');
      if (btnReplay) btnReplay.onclick = () => speak(wordObj.word);
    } else {
      document.getElementById('test-meanings').innerHTML = '';
      document.getElementById('reveal-zone').classList.add('hidden');
      document.getElementById('answer-zone').classList.add('hidden');
      
      document.getElementById('test-word').classList.remove('hidden');
      const oxBtns = document.querySelector('.ox-buttons');
      if (oxBtns) oxBtns.classList.remove('hidden');
      const dicZone = document.getElementById('dictation-zone');
      if (dicZone) dicZone.classList.add('hidden');
    }`;

js = js.replace(hideBlockStart, hideBlockReplace);

const revealHideStart = `    document.getElementById('reveal-zone').classList.add('hidden');
    document.getElementById('test-meanings').innerHTML = meaningHTML(wordObj.meanings);
    document.getElementById('answer-zone').classList.remove('hidden');`;

const revealHideReplace = `    if (!isDictationMode) {
      document.getElementById('reveal-zone').classList.add('hidden');
      document.getElementById('test-meanings').innerHTML = meaningHTML(wordObj.meanings);
      document.getElementById('answer-zone').classList.remove('hidden');
    }`;

js = js.replace(revealHideStart, revealHideReplace);

fs.writeFileSync('app.js', js, 'utf8');
console.log('Fixed missed chunks.');
