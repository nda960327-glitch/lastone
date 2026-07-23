const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

// 1. Darken Blue background slightly
css = css.replace(/--bg-color: #F0F9FF;/g, '--bg-color: #E2F2FE;');

// 2. Darken Green background slightly
css = css.replace(/--bg-color: #f0fdf4;/g, '--bg-color: #E0F9E8;');

// 3. Darken Pink background slightly (optional, but good for consistency)
css = css.replace(/--bg-color: #FFF0F5;/g, '--bg-color: #FFE6EE;');

// 4. Fix .btn-primary issue
const overrideRegex = /\.btn-primary\s*\{\s*background:\s*var\(--primary-color\)\s*!important;\s*color:\s*var\(--card-bg\)\s*!important;\s*border:\s*none;\s*\}\s*\n\.btn-primary:hover\s*\{\s*background:\s*var\(--primary-hover\)\s*!important;\s*\}/g;
css = css.replace(overrideRegex, '');

css += `
/* Restored: Dynamic primary button styles per theme */
:root .btn-primary, [data-theme="dark"] .btn-primary {
  background: linear-gradient(135deg, var(--blue), var(--purple)) !important;
  color: #ffffff !important;
}
[data-theme="pink"] .btn-primary,
[data-theme="blue"] .btn-primary,
[data-theme="green"] .btn-primary {
  background: var(--primary-color) !important;
  color: #ffffff !important;
  border: none !important;
}
[data-theme="pink"] .btn-primary:hover,
[data-theme="blue"] .btn-primary:hover,
[data-theme="green"] .btn-primary:hover {
  background: var(--primary-hover) !important;
}
`;

fs.writeFileSync('style.css', css, 'utf8');
console.log('Backgrounds darkened and btn-primary fixed.');
