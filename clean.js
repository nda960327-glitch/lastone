const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

// Step 4 old block
css = css.replace(/\/\* Step 4: 새로운 O\/X 버튼 디자인[\s\S]*?\.btn-ox-new\.btn-x \.ox-label \{ color: #DC2626; \}/, '');

// Global white text block
css = css.replace(/\/\* Force OX Button Text to White globally \*\/[\s\S]*?\}/g, '');

// UI refinements with pink/blue colors
css = css.replace(/\[data-theme="pink"\] \.btn-ox-new[\s\S]*?color: #FFFFFF !important;\s*\}/g, '');
css = css.replace(/\[data-theme="blue"\] \.btn-ox-new[\s\S]*?color: #FFFFFF !important;\s*\}/g, '');
css = css.replace(/\[data-theme="green"\] \.btn-ox-new[\s\S]*?color: #FFFFFF !important;\s*\}/g, '');

// Old O버튼 (자연스러운 컬러)
css = css.replace(/\/\* O버튼 \(자연스러운 컬러\) \*\/[\s\S]*?\/\* UI Refinements \*\//g, '/* UI Refinements */');

fs.writeFileSync('style.css', css);
