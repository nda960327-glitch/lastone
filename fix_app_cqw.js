const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

const oldJs = `    const wLen = Math.max(5, wordObj.word.length);
    let vw = Math.min(26, 160 / wLen);
    testWordEl.style.fontSize = \`clamp(2.5rem, \${vw}vw, 8rem)\`;`;

const newJs = `    const wLen = Math.max(5, wordObj.word.length);
    let cqw = Math.min(26, 160 / wLen);
    testWordEl.style.fontSize = \`clamp(2.5rem, \${cqw}cqw, 20rem)\`;`;

appJs = appJs.replace(oldJs, newJs);
fs.writeFileSync('app.js', appJs);
console.log('Fixed app.js for cqw');
