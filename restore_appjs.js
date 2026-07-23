const fs = require('fs');

let js = fs.readFileSync('app.js', 'utf8');

const regex = /window\.speechSynthesis\.cancel\(\);\s*\}\s*else\s*\{\s*oxC3\.style\.display = 'flex';/;

if (regex.test(js)) {
  const restored = `window.speechSynthesis.cancel();
      continue;
    }

    if (!isDictationMode) {
      document.getElementById('btn-reveal').classList.add('hidden');
      document.getElementById('test-meanings').innerHTML = meaningHTML(wordObj.meanings, wordObj);
      document.getElementById('test-meanings').classList.remove('hidden');
      const hintEl = document.getElementById('test-pos-hint');
      if (hintEl) hintEl.style.display = 'none';
      const oxC3 = document.getElementById('ox-buttons-container');
      if (oxC3) { 
        if (isSwipeMode) {
          oxC3.style.display = 'none';
          oxC3.classList.add('hidden');
        } else {
          oxC3.style.display = 'flex';`;
  
  js = js.replace(regex, restored);
  fs.writeFileSync('app.js', js, 'utf8');
  console.log('Successfully restored the deleted code block!');
} else {
  console.log('Could not find the target code to restore!');
}
