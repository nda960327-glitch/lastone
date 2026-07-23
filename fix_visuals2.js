const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// 1. Make speaker icon larger
css += `
/* Speaker Icon Enhancement */
#btn-speak-again {
  font-size: 2.4rem !important;
  min-width: 64px !important;
  width: 64px !important;
  height: 64px !important;
  border-radius: 50% !important;
  box-shadow: 0 8px 20px var(--glow-color, rgba(0,0,0,0.15)) !important;
  border: 2px solid var(--box-border) !important;
  background-color: var(--card-bg) !important;
  color: var(--text-main) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
#btn-speak-again:hover {
  transform: scale(1.1) !important;
}
`;

// 2. Fix readability of learning selection section for light themes
css += `
/* Light Theme Range Selection Box Fixes */
[data-theme="pink"] .btn-range-item,
[data-theme="blue"] .btn-range-item,
[data-theme="green"] .btn-range-item {
  background: var(--card-bg);
  border: 1px solid var(--box-border);
  box-shadow: 0 4px 6px rgba(0,0,0,0.03);
  color: var(--text-main);
}
[data-theme="pink"] .btn-range-item:hover,
[data-theme="blue"] .btn-range-item:hover,
[data-theme="green"] .btn-range-item:hover {
  background: var(--bg-color);
  border-color: var(--text-main);
}
[data-theme="pink"] .btn-review.weakness-focus,
[data-theme="blue"] .btn-review.weakness-focus,
[data-theme="green"] .btn-review.weakness-focus {
  background: #FFFBEB !important;
  border: 1.5px solid #FCD34D !important;
  color: #B45309 !important;
}
[data-theme="pink"] .btn-review.weakness-focus:hover,
[data-theme="blue"] .btn-review.weakness-focus:hover,
[data-theme="green"] .btn-review.weakness-focus:hover {
  background: #FEF3C7 !important;
  border-color: #F59E0B !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(245, 158, 11, 0.15);
}
`;

// 3. Make ALL OX button text white globally
css = css.replace(/\.btn-ox-new\.btn-o \.ox-mark \{ color: #4ade80;/g, '.btn-ox-new.btn-o .ox-mark { color: #FFFFFF;');
css = css.replace(/\.btn-ox-new\.btn-o \.ox-label \{ color: #a7f3d0;/g, '.btn-ox-new.btn-o .ox-label { color: #FFFFFF;');
css = css.replace(/\.btn-ox-new\.btn-x \.ox-mark \{ color: #f87171;/g, '.btn-ox-new.btn-x .ox-mark { color: #FFFFFF;');
css = css.replace(/\.btn-ox-new\.btn-x \.ox-label \{ color: #fecaca;/g, '.btn-ox-new.btn-x .ox-label { color: #FFFFFF;');

// And forcefully append important rules for all themes just in case
css += `
/* Force OX Button Text to White globally */
.btn-ox-new .ox-mark,
.btn-ox-new .ox-label,
[data-theme="blue"] .btn-ox-new.btn-o .ox-mark,
[data-theme="blue"] .btn-ox-new.btn-o .ox-label,
[data-theme="blue"] .btn-ox-new.btn-x .ox-mark,
[data-theme="blue"] .btn-ox-new.btn-x .ox-label,
[data-theme="pink"] .btn-ox-new.btn-o .ox-mark,
[data-theme="pink"] .btn-ox-new.btn-o .ox-label,
[data-theme="pink"] .btn-ox-new.btn-x .ox-mark,
[data-theme="pink"] .btn-ox-new.btn-x .ox-label,
[data-theme="green"] .btn-ox-new.btn-o .ox-mark,
[data-theme="green"] .btn-ox-new.btn-o .ox-label,
[data-theme="green"] .btn-ox-new.btn-x .ox-mark,
[data-theme="green"] .btn-ox-new.btn-x .ox-label {
  color: #FFFFFF !important;
}
`;

// Also fix the subtext in the weakness button in JS which might use a different class
css += `
/* Weakness Focus Subtext Readability */
[data-theme="pink"] .btn-review.weakness-focus .range-btn-count,
[data-theme="blue"] .btn-review.weakness-focus .range-btn-count,
[data-theme="green"] .btn-review.weakness-focus .range-btn-count {
  color: #D97706 !important;
  font-weight: 700 !important;
}
[data-theme="pink"] .btn-range-item .range-btn-count,
[data-theme="blue"] .btn-range-item .range-btn-count,
[data-theme="green"] .btn-range-item .range-btn-count {
  color: var(--text-sub) !important;
  font-weight: 500;
}
`;

fs.writeFileSync('style.css', css, 'utf8');
console.log('CSS fixes applied.');
