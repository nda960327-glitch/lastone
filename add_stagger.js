const fs = require('fs');
let js = fs.readFileSync('app.js', 'utf8');

js = js.replace(/currentWords\.forEach\(\(w, index\) => \{/g, 'currentWords.forEach(w => {'); // Reset if previously messed up
js = js.replace(/currentWords\.forEach\(w => \{/g, 'currentWords.forEach((w, index) => {');

const oldTr = "const tr = document.createElement('tr');\n        tr.style.borderBottom = '1px solid rgba(255,255,255,0.1)';";
const newTr = `const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--box-border)';
        tr.style.animation = 'viewIn 0.35s ease both';
        tr.style.animationDelay = (index * 0.02) + 's';`;

js = js.replace(oldTr, newTr);

fs.writeFileSync('app.js', js, 'utf8');
