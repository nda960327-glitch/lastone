const fs = require('fs');

function patchFile() {
  let js = fs.readFileSync('app.js', 'utf8');
  js = js.replace(/\r\n/g, '\n');

  // Replace showFinalResult entirely
  const startIdx = js.indexOf('function showFinalResult() {');
  const endIdx = js.indexOf('function updateFinalTable', startIdx) === -1 
      ? js.indexOf('\n}\n', startIdx) + 2 
      : js.indexOf('function updateFinalTable', startIdx) - 1; 
      
  // Wait, I don't know the exact end index securely if there are nested braces.
  // It's safer to use regex or string replacement for the body.
}

patchFile();
