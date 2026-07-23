const fs = require('fs');

function rewriteStyleCss() {
  let css = fs.readFileSync('style.css', 'utf8');

  // 1. Regex replace variables globally to match user request
  css = css.replace(/--bg:(?!\s*(?:color|2))/g, '--bg-color:');
  css = css.replace(/var\(--bg\)/g, 'var(--bg-color)');
  
  css = css.replace(/--glass:(?!\s*h)/g, '--card-bg:');
  css = css.replace(/var\(--glass\)/g, 'var(--card-bg)');
  
  css = css.replace(/--text1:/g, '--text-main:');
  css = css.replace(/var\(--text1\)/g, 'var(--text-main)');
  
  css = css.replace(/--text2:/g, '--text-sub:');
  css = css.replace(/var\(--text2\)/g, 'var(--text-sub)');
  
  css = css.replace(/--border:(?!\s*h)/g, '--box-border:');
  css = css.replace(/var\(--border\)/g, 'var(--box-border)');

  // Rename theme selectors
  css = css.replace(/\[data-theme="blue-white"\]/g, '[data-theme="blue"]');
  css = css.replace(/\[data-theme="pink-white"\]/g, '[data-theme="pink"]');
  css = css.replace(/\[data-theme="green-white"\]/g, '[data-theme="green"]');

  // We need to inject the user's specific colors into these themes.
  // We'll replace the block for each theme.
  
  // Blue theme
  const blueRegex = /\[data-theme="blue"\] \{([\s\S]*?)\}/;
  css = css.replace(blueRegex, `[data-theme="blue"] {
  --bg-color: #f0f9ff;
  --bg2: #e0f2fe;
  --card-bg: #ffffff;
  --glass-h: rgba(255, 255, 255, 1);
  --box-border: #bfdbfe;
  --border-h: rgba(59, 130, 246, 0.3);
  
  --dropdown-bg: rgba(255, 255, 255, 0.95);
  --dropdown-hover: #eff6ff;
  --input-bg: rgba(255, 255, 255, 0.7);
  --grad-1: rgba(59, 130, 246, 0.08);
  --grad-2: rgba(147, 197, 253, 0.08);
  --card-shadow: 0 8px 30px rgba(59, 130, 246, 0.1);
  --icon-filter: invert(1);

  --text-main: #1e3a8a;
  --text-sub: #64748b;
  --text3: #93c5fd;
  --primary-color: #3b82f6;
}`);

  // Pink theme
  const pinkRegex = /\[data-theme="pink"\] \{([\s\S]*?)\}/;
  css = css.replace(pinkRegex, `[data-theme="pink"] {
  --bg-color: #fdf2f8;
  --bg2: #ffe4e6;
  --card-bg: #ffffff;
  --glass-h: rgba(255, 255, 255, 1);
  --box-border: #fbcfe8;
  --border-h: rgba(244, 63, 94, 0.3);
  
  --dropdown-bg: rgba(255, 255, 255, 0.95);
  --dropdown-hover: #fff1f2;
  --input-bg: rgba(255, 255, 255, 0.7);
  --grad-1: rgba(244, 63, 94, 0.08);
  --grad-2: rgba(253, 164, 175, 0.08);
  --card-shadow: 0 8px 30px rgba(244, 63, 94, 0.1);
  --icon-filter: invert(1);

  --text-main: #831843;
  --text-sub: #9ca3af;
  --text3: #fda4af;
  --primary-color: #ec4899;
}`);

  // Green theme
  const greenRegex = /\[data-theme="green"\] \{([\s\S]*?)\}/;
  css = css.replace(greenRegex, `[data-theme="green"] {
  --bg-color: #f0fdf4;
  --bg2: #dcfce7;
  --card-bg: #ffffff;
  --glass-h: rgba(255, 255, 255, 1);
  --box-border: #bbf7d0;
  --border-h: rgba(34, 197, 94, 0.3);
  
  --dropdown-bg: rgba(255, 255, 255, 0.95);
  --dropdown-hover: #f0fdf4;
  --input-bg: rgba(255, 255, 255, 0.7);
  --grad-1: rgba(34, 197, 94, 0.08);
  --grad-2: rgba(134, 239, 172, 0.08);
  --card-shadow: 0 8px 30px rgba(34, 197, 94, 0.1);
  --icon-filter: invert(1);

  --text-main: #14532d;
  --text-sub: #6b7280;
  --text3: #86efac;
  --primary-color: #22c55e;
}`);

  // Inject OX root vars
  if (!css.includes('--btn-o-bg')) {
    css = css.replace(/:root, \[data-theme="dark"\] \{/, `:root {
    --btn-o-bg: #22c55e;
    --btn-o-text: #ffffff;
    --btn-x-bg: #ef4444;
    --btn-x-text: #ffffff;
}
:root, [data-theme="dark"] {`);
  }

  // Update OX buttons strictly
  const oxCss = `
#btn-correct { background: var(--btn-o-bg) !important; color: var(--btn-o-text) !important; border: none; }
#btn-correct:hover { opacity: 0.9; }
#btn-wrong { background: var(--btn-x-bg) !important; color: var(--btn-x-text) !important; border: none; }
#btn-wrong:hover { opacity: 0.9; }
`;
  css += oxCss;

  // Make meanings clearly use text-main
  css += `
.test-meanings { color: var(--text-main) !important; }
.test-word { color: var(--text-main) !important; }
`;

  fs.writeFileSync('style.css', css, 'utf8');
}

function updateHtml() {
  let html = fs.readFileSync('index.html', 'utf8');
  html = html.replace(/data-theme="blue-white"/g, 'data-theme="blue"');
  html = html.replace(/data-theme="pink-white"/g, 'data-theme="pink"');
  html = html.replace(/data-theme="green-white"/g, 'data-theme="green"');
  
  // Replace vars
  html = html.replace(/var\(--text1\)/g, 'var(--text-main)');
  html = html.replace(/var\(--text2\)/g, 'var(--text-sub)');
  html = html.replace(/var\(--border\)/g, 'var(--box-border)');
  html = html.replace(/var\(--bg\)/g, 'var(--bg-color)');

  fs.writeFileSync('index.html', html, 'utf8');
}

function updateAppJs() {
  let js = fs.readFileSync('app.js', 'utf8');
  js = js.replace(/var\(--text1\)/g, 'var(--text-main)');
  js = js.replace(/var\(--text2\)/g, 'var(--text-sub)');
  js = js.replace(/var\(--border\)/g, 'var(--box-border)');
  js = js.replace(/var\(--bg\)/g, 'var(--bg-color)');
  
  // Make sure savedTheme uses new names
  js = js.replace(/let savedTheme = localStorage.getItem\('doacore_theme'\) \|\| 'dark';/, 
    `let savedTheme = localStorage.getItem('doacore_theme') || 'dark';
  if(savedTheme === 'blue-white') savedTheme = 'blue';
  if(savedTheme === 'pink-white') savedTheme = 'pink';
  if(savedTheme === 'green-white') savedTheme = 'green';`);

  fs.writeFileSync('app.js', js, 'utf8');
}

rewriteStyleCss();
updateHtml();
updateAppJs();
console.log('Successfully completed theme rewrite!');
