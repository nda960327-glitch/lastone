const fs = require('fs');

// 1. Update index.html meta viewport
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(
  '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">',
  '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">'
);
fs.writeFileSync('index.html', html, 'utf8');

// 2. Update style.css .test-word
let css = fs.readFileSync('style.css', 'utf8');
css = css.replace(
  /\.test-word \{[\s\S]*?white-space: nowrap;\s*\}/,
  `.test-word {
  font-size: clamp(3rem, 15vw, 5rem);
  font-weight: 900;
  letter-spacing: -.03em;
  text-align: center;
  color: var(--text-main);
  text-shadow: 0 0 15px var(--glow-color, transparent);
  width: 100%;
  box-sizing: border-box;
  padding: 0 5px;
}`
);
fs.writeFileSync('style.css', css, 'utf8');
console.log('Fixed text size and overflow zoom issue.');
