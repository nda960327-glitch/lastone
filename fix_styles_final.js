const fs = require('fs');

// 1. Fix app.js: posHintEl
let js = fs.readFileSync('app.js', 'utf8');
js = js.replace(/posHintEl\.textContent = `품사 \$\{wordObj\.meanings\.length\}개`;/g, 
  'posHintEl.innerHTML = `품사 <span style="font-size: 1.3em; color: var(--primary-color); font-weight: 900;">${wordObj.meanings.length}</span>개`;');
fs.writeFileSync('app.js', js, 'utf8');

// 2. Fix index.html: 🎯 최종 점검 (듣기)
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/color: #f43f5e; margin-bottom: 10px; text-align: center;">🎯 최종 점검 \(듣기\)/g, 
  'color: var(--primary-color); margin-bottom: 10px; text-align: center;">🎯 최종 점검 (듣기)');
fs.writeFileSync('index.html', html, 'utf8');

// 3. Fix style.css: Logo filter & primary color & pos hint size
let css = fs.readFileSync('style.css', 'utf8');

// Add primary colors to dark theme
css = css.replace(/--icon-filter: none;/g, '--icon-filter: none;\n  --primary-color: #4f9eff;\n  --primary-hover: #3b82f6;');

// Update blue theme filter
if (!css.includes('--icon-filter') || !css.match(/\[data-theme="blue"\][^}]*--icon-filter/)) {
  css = css.replace(/--card-shadow: 0 4px 6px -1px rgba\(0, 0, 0, 0\.05\);/g, 
    '--card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);\n  --icon-filter: invert(1) hue-rotate(60deg);');
}

// Update pink theme filter
css = css.replace(/--icon-filter: invert\(1\);/g, '--icon-filter: invert(1) hue-rotate(130deg);'); // First match is pink? wait, green also has it.
// Let's replace specifically in the block.
css = css.replace(/(\[data-theme="pink"\][\s\S]*?)--icon-filter: invert\(1\);/g, '$1--icon-filter: invert(1) hue-rotate(130deg);');
css = css.replace(/(\[data-theme="green"\][\s\S]*?)--icon-filter: invert\(1\);/g, '$1--icon-filter: invert(1) hue-rotate(-60deg);');

// Increase pos hint size
css += `
/* Make POS hint text slightly larger */
#test-pos-hint {
  font-size: 17px !important;
}
`;

fs.writeFileSync('style.css', css, 'utf8');
console.log('All styling and JS fixes applied.');
