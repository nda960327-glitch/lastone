const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf8');

// Replace dictation button and title
html = html.replace(
  /<div style="font-size: 14px; font-weight: 700; color: var\(--primary-color\); margin-bottom: 10px; text-align: center;">🎯 최종 점검 \(듣기\)<\/div>\s*<button id="btn-dictation" class="btn-primary"[^>]*>/g,
  `<div class="dictation-section-title" style="font-size: 14px; font-weight: 700; margin-bottom: 10px; text-align: center;">🎯 최종 점검 (듣기)</div>
        <button id="btn-dictation" class="btn-dictation-red">`
);
html = html.replace(/<button id="btn-dictation"[^>]*>/g, '<button id="btn-dictation" class="btn-dictation-red">');

fs.writeFileSync('index.html', html, 'utf8');


// 2. Update style.css
let css = fs.readFileSync('style.css', 'utf8');

// Replace .btn-dictation-blue with .btn-dictation-red
css = css.replace(/\.btn-dictation-blue/g, '.btn-dictation-red');

css = css.replace(
  /\.btn-dictation-red \{[\s\S]*?justify-content: center;\s*gap: 8px;\s*\}/,
  `.btn-dictation-red {
  background: rgba(239, 68, 68, 0.08);
  border: 1.5px solid rgba(239, 68, 68, 0.35);
  color: #ef4444;
  padding: 16px;
  font-size: 1.1rem;
  border-radius: 12px;
  width: 100%;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}`
);

css = css.replace(
  /\.btn-dictation-red:hover \{[\s\S]*?box-shadow:[^;]+;\s*\}/,
  `.btn-dictation-red:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.6);
  color: #fca5a5;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.15);
}`
);

// Light themes dictation override
css = css.replace(
  /\[data-theme="pink"\] \.btn-dictation-red,\s*\[data-theme="blue"\] \.btn-dictation-red,\s*\[data-theme="green"\] \.btn-dictation-red \{[\s\S]*?color:[^;]+!important;\s*\}/,
  `[data-theme="pink"] .btn-dictation-red,
[data-theme="blue"] .btn-dictation-red,
[data-theme="green"] .btn-dictation-red {
  background: rgba(220, 38, 38, 0.08) !important;
  border: 1.5px solid rgba(220, 38, 38, 0.3) !important;
  color: #DC2626 !important;
}`
);

css = css.replace(
  /\[data-theme="pink"\] \.btn-dictation-red:hover,\s*\[data-theme="blue"\] \.btn-dictation-red:hover,\s*\[data-theme="green"\] \.btn-dictation-red:hover \{[\s\S]*?box-shadow:[^;]+!important;\s*\}/,
  `[data-theme="pink"] .btn-dictation-red:hover,
[data-theme="blue"] .btn-dictation-red:hover,
[data-theme="green"] .btn-dictation-red:hover {
  background: rgba(220, 38, 38, 0.15) !important;
  border-color: rgba(220, 38, 38, 0.5) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15) !important;
}`
);

// dictation title color
css += `\n.dictation-section-title { color: #ef4444; }`;
css += `\n[data-theme="pink"] .dictation-section-title, [data-theme="blue"] .dictation-section-title, [data-theme="green"] .dictation-section-title { color: #DC2626; }`;


// 3. Remove speaker icon background
css = css.replace(
  /\.speaker-icon-btn \{[\s\S]*?background:[^;]+;/,
  `.speaker-icon-btn {\n  background: transparent;`
);

fs.writeFileSync('style.css', css, 'utf8');
console.log('UI updates applied successfully.');
