const fs = require('fs');

function fixCSS() {
  let css = fs.readFileSync('style.css', 'utf8');

  // Replace text colors
  css = css.replace(/color:\s*#ffffff/gi, 'color: var(--text1)');
  css = css.replace(/color:\s*#fff(?![\da-fA-F])/gi, 'color: var(--text1)');
  css = css.replace(/color:\s*white\b/gi, 'color: var(--text1)');

  // Fix SVG fill color in #btn-sound
  css = css.replace(/fill:\s*#fff(?![\da-fA-F])/gi, 'fill: var(--text1)');
  css = css.replace(/fill:\s*#ffffff/gi, 'fill: var(--text1)');
  css = css.replace(/fill:\s*white\b/gi, 'fill: var(--text1)');

  // Fix toggle switch slider
  css = css.replace(/background-color: white;/gi, 'background-color: var(--text1);');

  // Fix input border
  css = css.replace(/border-bottom:\s*2px solid #fff(?![\da-fA-F])/gi, 'border-bottom: 2px solid var(--text2)');

  // Fix backgrounds with hardcoded white gradients that might be problematic
  css = css.replace(/background:linear-gradient\(135deg, #fff 60%, #b8d0ff 100%\);/g, 'background:linear-gradient(135deg, var(--bg) 60%, var(--border-h) 100%);');
  css = css.replace(/background: linear-gradient\(135deg, #fff 40%, #a8c4ff 100%\);/g, 'background:linear-gradient(135deg, var(--bg) 40%, var(--border-h) 100%);');

  fs.writeFileSync('style.css', css, 'utf8');
}

fixCSS();
console.log('Fixed style.css');
