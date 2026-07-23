const fs = require('fs');
let js = fs.readFileSync('app.js', 'utf8');

const regex = /<td style="padding: 10px 8px;">\$\{w\.meaning\}<\/td>/g;
js = js.replace(regex, `<td style="padding: 10px 8px;">
            <span class="\${isHideMeaningMode ? 'blur-meaning' : ''}" onclick="if(this.classList.contains('blur-meaning')) this.classList.toggle('revealed')">
              \${w.meaning}
            </span>
          </td>`);

fs.writeFileSync('app.js', js, 'utf8');
console.log('Fixed render in app.js');
