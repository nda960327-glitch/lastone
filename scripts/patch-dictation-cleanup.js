const fs = require('fs');

function patchFile() {
  let js = fs.readFileSync('app.js', 'utf8');
  js = js.replace(/\r\n/g, '\n');

  // 1. Hide listenZone in dictation mode
  const listenZoneStr = `    const listenZone = document.getElementById('test-listening-zone');
    if (listenZone) {
      listenZone.classList.remove('hidden');
    }`;
    
  const listenZoneReplace = `    const listenZone = document.getElementById('test-listening-zone');
    if (listenZone && !isDictationMode) {
      listenZone.classList.remove('hidden');
    }`;
    
  js = js.replace(listenZoneStr, listenZoneReplace);

  // 2. Hide posHintEl in dictation mode
  const posHintStr = `    posHintEl.textContent = \`품사 \${wordObj.meanings.length}개\`;
    posHintEl.classList.remove('hidden');`;
    
  const posHintReplace = `    posHintEl.textContent = \`품사 \${wordObj.meanings.length}개\`;
    if (!isDictationMode) {
      posHintEl.classList.remove('hidden');
    }`;
    
  js = js.replace(posHintStr, posHintReplace);

  js = js.replace(/\n/g, '\r\n');
  fs.writeFileSync('app.js', js, 'utf8');
}

patchFile();
console.log('Cleaned up dictation UI');
