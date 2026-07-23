const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

// Hook up the button click event
if (!appJs.includes(`document.getElementById('btn-dictation-speaker').addEventListener('click', () => {`)) {
  const oldEvent = `  document.getElementById('btn-reveal').addEventListener('click', () => {`;
  const newEvent = `  const btnDictationSpeaker = document.getElementById('btn-dictation-speaker');
  if (btnDictationSpeaker) {
    btnDictationSpeaker.addEventListener('click', () => {
      const currentWordObj = dbWords[wordOrder[currentIndex]];
      if (currentWordObj) {
        speak(currentWordObj.word);
      }
    });
  }

  document.getElementById('btn-reveal').addEventListener('click', () => {`;
  appJs = appJs.replace(oldEvent, newEvent);
}

// Toggle visibility based on isDictationMode
const oldToggle = `    if (isDictationMode) {
      document.getElementById('test-word').classList.add('hidden');
      const oxC1 = document.getElementById('ox-buttons-container');`;

const newToggle = `    if (isDictationMode) {
      document.getElementById('test-word').classList.add('hidden');
      const dictSpeaker = document.getElementById('btn-dictation-speaker');
      if (dictSpeaker) dictSpeaker.classList.remove('hidden');
      
      const oxC1 = document.getElementById('ox-buttons-container');`;

appJs = appJs.replace(oldToggle, newToggle);

const oldHideToggle = `        testWordEl.classList.remove('hidden');
        if (!isDictationMode) {`;

const newHideToggle = `        testWordEl.classList.remove('hidden');
        const dictSpeaker = document.getElementById('btn-dictation-speaker');
        if (dictSpeaker) dictSpeaker.classList.add('hidden');
        if (!isDictationMode) {`;

appJs = appJs.replace(oldHideToggle, newHideToggle);

fs.writeFileSync('app.js', appJs);
console.log('Fixed app.js for dictation speaker');
