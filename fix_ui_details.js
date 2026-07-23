const fs = require('fs');

// ===== 1. style.css: CSS rules =====
let css = fs.readFileSync('style.css', 'utf8');

css = css.replace(
  'font-size: clamp(2rem, 15cqw, 15rem); white-space: nowrap; font-weight:900; letter-spacing:-.03em;',
  'font-size: clamp(4rem, 30cqw, 30rem); word-break: keep-all; overflow-wrap: break-word; font-weight:900; letter-spacing:-.03em; line-height: 1.1;'
);

if (!css.includes('.pencil-icon')) {
  css += `
.pencil-icon {
    display: inline-block;
    transform: scaleX(-1);
}
.manage-btn-container {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
    justify-content: center;
}
.manage-btn-container button {
    min-width: 50px;
    width: 100%;
    margin-right: 0 !important;
}
`;
}
fs.writeFileSync('style.css', css);
console.log('[1] style.css updated');


// ===== 2. index.html: HTML Layout =====
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
  '<span style="font-size: 13px; font-weight: 600; color: var(--text-sub); opacity: 0.7; letter-spacing: 0.05em;">듣고 써보세요!</span>',
  ''
);

html = html.replace(
  '<span style="font-size: 48px;">✏️</span>',
  '<span class="pencil-icon" style="font-size: 48px;">✏️</span>'
);

html = html.replace(
  'id="action-area" style="display: flex; flex-direction: column; align-items: center; gap: 15px; width: 100%;"',
  'id="action-area" style="display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100%;"'
);

html = html.replace(
  'margin-bottom: 8px; transition: transform 0.15s;"',
  'transition: transform 0.15s;"'
);

html = html.replace(
  'id="dictation-zone" class="hidden" style="width: 100%; margin-top: 20px;"',
  'id="dictation-zone" class="hidden" style="width: 100%; margin-top: 6px;"'
);

fs.writeFileSync('index.html', html);
console.log('[2] index.html updated');


// ===== 3. app.js: Manage Td Layout =====
let js = fs.readFileSync('app.js', 'utf8');

const oldTd = `<td style="padding: 10px 8px; text-align: center; white-space: nowrap;">
              <button class="btn-ghost btn-word-edit" style="padding: 4px 6px; color: #3b82f6; font-size: 13px; border-color: rgba(59,130,246,0.3); margin-right: 4px;">수정</button>
              <button class="btn-ghost btn-word-delete" style="padding: 4px 6px; color: #f43f5e; font-size: 13px; border-color: rgba(244,63,94,0.3);">삭제</button>
            </td>`;
const newTd = `<td style="padding: 10px 8px; text-align: center; white-space: nowrap;">
              <div class="manage-btn-container">
                <button class="btn-ghost btn-word-edit" style="padding: 4px 6px; color: #3b82f6; font-size: 13px; border-color: rgba(59,130,246,0.3);">수정</button>
                <button class="btn-ghost btn-word-delete" style="padding: 4px 6px; color: #f43f5e; font-size: 13px; border-color: rgba(244,63,94,0.3);">삭제</button>
              </div>
            </td>`;

if (js.includes(oldTd)) {
  js = js.replace(oldTd, newTd);
} else {
  // Try CRLF
  const oldTdCRLF = oldTd.replace(/\\n/g, '\\r\\n');
  const newTdCRLF = newTd.replace(/\\n/g, '\\r\\n');
  if (js.includes(oldTdCRLF)) {
    js = js.replace(oldTdCRLF, newTdCRLF);
  } else {
    console.log('[3] WARNING: Could not find manage Td in app.js');
  }
}

fs.writeFileSync('app.js', js);
console.log('[3] app.js updated');

console.log('ALL FIXES COMPLETED');
