const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

const oldJs = `    if (wordObj.word.length > 10) {
      testWordEl.style.fontSize = 'clamp(1.8rem, 8vw, 3rem)';
    } else {
      testWordEl.style.fontSize = '';
    }`;

const newJs = `    const wLen = Math.max(5, wordObj.word.length);
    let vw = Math.min(26, 160 / wLen);
    testWordEl.style.fontSize = \`clamp(2.5rem, \${vw}vw, 8rem)\`;`;

appJs = appJs.replace(oldJs, newJs);
fs.writeFileSync('app.js', appJs);
console.log('Fixed app.js');
