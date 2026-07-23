const fs = require('fs');
const css = fs.readFileSync('style.css', 'utf8');
const lines = css.split('\n');
const startIndex = lines.findIndex(l => l.includes('/* 🧊 블루 테마 */'));
const endIndex = lines.findIndex(l => l.includes('/* 🌿 그린 테마 */'));
console.log(lines.slice(startIndex, endIndex + 10).join('\n'));
