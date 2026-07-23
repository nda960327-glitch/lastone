const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

const oldToggle = `    if (isDictationMode) {
      document.getElementById('test-word').classList.add('hidden');
      const oxC1 = document.getElementById('ox-buttons-container');`;

const newToggle = `    if (isDictationMode) {
      document.getElementById('test-word').classList.add('hidden');
      const dictSpeaker = document.getElementById('btn-dictation-speaker');
      if (dictSpeaker) {
        dictSpeaker.classList.remove('hidden');
        dictSpeaker.onclick = () => speak(wordObj.word);
      }
      const oxC1 = document.getElementById('ox-buttons-container');`;

appJs = appJs.replace(oldToggle, newToggle);

const oldReveal = `    } else {
      document.getElementById('test-word').classList.remove('hidden');
      const oxC2 = document.getElementById('ox-buttons-container');`;

const newReveal = `    } else {
      document.getElementById('test-word').classList.remove('hidden');
      const dictSpeaker = document.getElementById('btn-dictation-speaker');
      if (dictSpeaker) dictSpeaker.classList.add('hidden');
      const oxC2 = document.getElementById('ox-buttons-container');`;

appJs = appJs.replace(oldReveal, newReveal);

const oldHideToggle = `        testWordEl.classList.remove('hidden');
        if (!isDictationMode) {`;

const newHideToggle = `        testWordEl.classList.remove('hidden');
        const dictSpeaker = document.getElementById('btn-dictation-speaker');
        if (dictSpeaker) dictSpeaker.classList.add('hidden');
        if (!isDictationMode) {`;

appJs = appJs.replace(oldHideToggle, newHideToggle);

fs.writeFileSync('app.js', appJs);
console.log('Fixed app.js');
