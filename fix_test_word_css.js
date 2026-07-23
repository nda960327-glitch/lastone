const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

const oldCss = `.test-word {
  font-size: clamp(2.5rem, 12vw, 4rem);
  font-weight: 900;
  text-align: center;
  word-break: keep-all;
  overflow-wrap: break-word;
  line-height: 1.2;
  margin: 20px 0;
  color: var(--text-main);
  text-shadow: 0 0 15px var(--glow-color, transparent);
  width: 100%;
  box-sizing: border-box;
}`;

const newCss = `.test-word {
  font-weight: 900;
  text-align: center;
  white-space: nowrap;
  line-height: 1.1;
  margin: 10px -10px;
  color: var(--text-main);
  text-shadow: 0 0 15px var(--glow-color, transparent);
  box-sizing: border-box;
}`;

css = css.replace(oldCss, newCss);
fs.writeFileSync('style.css', css);
console.log('Fixed style.css');
