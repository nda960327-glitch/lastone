const fs = require('fs');
const css = fs.readFileSync('style.css', 'utf8');
const lines = css.split('\n');
const startIndex = lines.findIndex(l => l.includes('[data-theme="blue"] {'));
console.log(lines.slice(startIndex, startIndex + 30).join('\n'));
