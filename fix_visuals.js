const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// 1. test-listening-zone background fix
css = css.replace('.test-listening-zone {\r\n  position: absolute;\r\n  top: 0; left: 0; width: 100%; height: 100%;\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: center;\r\n  align-items: center;\r\n  gap: 16px;\r\n  margin: 0;\r\n  animation: viewIn 0.3s ease;\r\n  z-index: 10;\r\n  border-radius: inherit;\r\n  background: var(--bg2);\r\n}', 
`.test-listening-zone {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin: 0;
  animation: viewIn 0.3s ease;
  z-index: 10;
  border-radius: inherit;
  background: var(--card-bg);
}`);
// Fallback if \r\n fails
css = css.replace('background: var(--bg2);', 'background: var(--card-bg);');


// 2. test-card visibility
css = css.replace(/\[data-theme="pink"\] \.test-card,\r?\n\[data-theme="blue"\] \.test-card \{[^}]+\}/, `[data-theme="pink"] .test-card,
[data-theme="blue"] .test-card,
[data-theme="green"] .test-card {
  background-color: var(--card-bg) !important;
  border-radius: 24px !important;
  box-shadow: 0 10px 40px var(--glow-color, rgba(0,0,0,0.08)) !important;
  border: none !important;
}`);


// 3. POS boxes unified for light themes
css = css.replace(/\[data-theme="blue"\] \.pos-bg-n \{ background-color: #EFF6FF !important; color: #2563EB !important; border-color: #BFDBFE !important; \}/g, `[data-theme="blue"] .pos-bg-n, [data-theme="pink"] .pos-bg-n, [data-theme="green"] .pos-bg-n { background-color: #EFF6FF !important; color: #2563EB !important; border-color: #BFDBFE !important; }`);
css = css.replace(/\[data-theme="blue"\] \.pos-bg-v \{ background-color: #FEF2F2 !important; color: #EF4444 !important; border-color: #FECACA !important; \}/g, `[data-theme="blue"] .pos-bg-v, [data-theme="pink"] .pos-bg-v, [data-theme="green"] .pos-bg-v { background-color: #FEF2F2 !important; color: #EF4444 !important; border-color: #FECACA !important; }`);
css = css.replace(/\[data-theme="blue"\] \.pos-bg-a \{ background-color: #ECFDF5 !important; color: #10B981 !important; border-color: #A7F3D0 !important; \}/g, `[data-theme="blue"] .pos-bg-a, [data-theme="pink"] .pos-bg-a, [data-theme="green"] .pos-bg-a { background-color: #ECFDF5 !important; color: #10B981 !important; border-color: #A7F3D0 !important; }`);
css = css.replace(/\[data-theme="blue"\] \.pos-bg-ad \{ background-color: #F5F3FF !important; color: #8B5CF6 !important; border-color: #DDD6FE !important; \}/g, `[data-theme="blue"] .pos-bg-ad, [data-theme="pink"] .pos-bg-ad, [data-theme="green"] .pos-bg-ad { background-color: #F5F3FF !important; color: #8B5CF6 !important; border-color: #DDD6FE !important; }`);
css = css.replace(/\[data-theme="blue"\] \.pos-bg-default \{ background-color: #F8FAFC !important; color: #475569 !important; border-color: #E2E8F0 !important; \}/g, `[data-theme="blue"] .pos-bg-default, [data-theme="pink"] .pos-bg-default, [data-theme="green"] .pos-bg-default { background-color: #F8FAFC !important; color: #475569 !important; border-color: #E2E8F0 !important; }`);


// 4. OX buttons white text
// Replace the old specific color assignments
css = css.replace(/\[data-theme="pink"\] \.btn-ox-new\.btn-o \.ox-mark,\r?\n\[data-theme="pink"\] \.btn-ox-new\.btn-o \.ox-label \{\r?\n  color: #7E22CE !important; \/\* 파스텔 보라 계열 진한색 \*\/\r?\n\}/, `[data-theme="pink"] .btn-ox-new.btn-o .ox-mark,
[data-theme="pink"] .btn-ox-new.btn-o .ox-label {
  color: #FFFFFF !important;
}`);
css = css.replace(/\[data-theme="blue"\] \.btn-ox-new\.btn-o \.ox-mark,\r?\n\[data-theme="blue"\] \.btn-ox-new\.btn-o \.ox-label \{\r?\n  color: #047857 !important; \/\* 파스텔 초록 계열 진한색 \*\/\r?\n\}/, `[data-theme="blue"] .btn-ox-new.btn-o .ox-mark,
[data-theme="blue"] .btn-ox-new.btn-o .ox-label {
  color: #FFFFFF !important;
}`);
css = css.replace(/\[data-theme="pink"\] \.btn-ox-new\.btn-x \.ox-mark,\r?\n\[data-theme="blue"\] \.btn-ox-new\.btn-x \.ox-mark,\r?\n\[data-theme="pink"\] \.btn-ox-new\.btn-x \.ox-label,\r?\n\[data-theme="blue"\] \.btn-ox-new\.btn-x \.ox-label \{\r?\n  color: #BE123C !important; \/\* 파스텔 레드 계열 진한색 \*\/\r?\n\}/, `[data-theme="pink"] .btn-ox-new.btn-x .ox-mark,
[data-theme="blue"] .btn-ox-new.btn-x .ox-mark,
[data-theme="pink"] .btn-ox-new.btn-x .ox-label,
[data-theme="blue"] .btn-ox-new.btn-x .ox-label {
  color: #FFFFFF !important;
}`);

// If the above precise replaces fail, I will just append an override block at the end.
css += `
/* UI Refinements */
[data-theme="pink"] .test-card,
[data-theme="blue"] .test-card,
[data-theme="green"] .test-card {
  background-color: var(--card-bg) !important;
  border-radius: 24px !important;
  box-shadow: 0 10px 40px var(--glow-color, rgba(0,0,0,0.08)) !important;
  border: none !important;
}
.test-listening-zone {
  background: var(--card-bg) !important;
}
[data-theme="pink"] .btn-ox-new.btn-o .ox-mark,
[data-theme="blue"] .btn-ox-new.btn-o .ox-mark,
[data-theme="pink"] .btn-ox-new.btn-o .ox-label,
[data-theme="blue"] .btn-ox-new.btn-o .ox-label,
[data-theme="pink"] .btn-ox-new.btn-x .ox-mark,
[data-theme="blue"] .btn-ox-new.btn-x .ox-mark,
[data-theme="pink"] .btn-ox-new.btn-x .ox-label,
[data-theme="blue"] .btn-ox-new.btn-x .ox-label {
  color: #FFFFFF !important;
}
[data-theme="green"] .pos-bg-n, [data-theme="pink"] .pos-bg-n { background-color: #EFF6FF !important; color: #2563EB !important; border-color: #BFDBFE !important; }
[data-theme="green"] .pos-bg-v, [data-theme="pink"] .pos-bg-v { background-color: #FEF2F2 !important; color: #EF4444 !important; border-color: #FECACA !important; }
[data-theme="green"] .pos-bg-a, [data-theme="pink"] .pos-bg-a { background-color: #ECFDF5 !important; color: #10B981 !important; border-color: #A7F3D0 !important; }
[data-theme="green"] .pos-bg-ad, [data-theme="pink"] .pos-bg-ad { background-color: #F5F3FF !important; color: #8B5CF6 !important; border-color: #DDD6FE !important; }
[data-theme="green"] .pos-bg-default, [data-theme="pink"] .pos-bg-default { background-color: #F8FAFC !important; color: #475569 !important; border-color: #E2E8F0 !important; }
`;

fs.writeFileSync('style.css', css, 'utf8');

console.log('CSS fixes applied.');
