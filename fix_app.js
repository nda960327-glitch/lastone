const fs = require('fs');

let js = fs.readFileSync('app.js', 'utf8');
const search = `            <td style="padding: 10px 8px; text-align: center; white-space: nowrap;">
              <button class="btn-ghost btn-word-edit" style="padding: 4px 6px; color: #3b82f6; font-size: 13px; border-color: rgba(59,130,246,0.3); margin-right: 4px;">수정</button>
              <button class="btn-ghost btn-word-delete" style="padding: 4px 6px; color: #f43f5e; font-size: 13px; border-color: rgba(244,63,94,0.3);">삭제</button>
            </td>`;
const searchR = search.replace(/\n/g, '\r\n');

const replace = `            <td style="padding: 10px 8px; text-align: center; white-space: nowrap;">
              <div class="manage-btn-container">
                <button class="btn-ghost btn-word-edit" style="padding: 4px 6px; color: #3b82f6; font-size: 13px; border-color: rgba(59,130,246,0.3);">수정</button>
                <button class="btn-ghost btn-word-delete" style="padding: 4px 6px; color: #f43f5e; font-size: 13px; border-color: rgba(244,63,94,0.3);">삭제</button>
              </div>
            </td>`;

if (js.includes(search)) {
  js = js.replace(search, replace);
  console.log('Replaced LF');
} else if (js.includes(searchR)) {
  js = js.replace(searchR, replace.replace(/\n/g, '\r\n'));
  console.log('Replaced CRLF');
} else {
  console.log('Pattern not found');
}

fs.writeFileSync('app.js', js);
