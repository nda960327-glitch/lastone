const fs = require('fs');

function fixCSS() {
  let css = fs.readFileSync('style.css', 'utf8');

  // Fix logo text gradient
  css = css.replace(/background:linear-gradient\(135deg, var\(--bg\) 40%, var\(--border-h\) 100%\);/g, 'background:linear-gradient(135deg, var(--text1) 40%, var(--border-h) 100%);');
  css = css.replace(/background:linear-gradient\(135deg, var\(--bg\) 60%, var\(--border-h\) 100%\);/g, 'background:linear-gradient(135deg, var(--text1) 60%, var(--border-h) 100%);');

  // Add blur classes for hiding meanings
  if (!css.includes('.blur-meaning')) {
    css += `
/* 뜻 숨기기 기능 */
.blur-meaning {
  filter: blur(5px);
  opacity: 0.3;
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
}
.blur-meaning.revealed {
  filter: blur(0px);
  opacity: 1;
}
`;
  }

  fs.writeFileSync('style.css', css, 'utf8');
}

function fixIndexHtml() {
  let html = fs.readFileSync('index.html', 'utf8');

  // Add hide meaning toggle in db-modal
  const dbSearchInput = '<input type="text" id="db-search"';
  if (html.includes(dbSearchInput) && !html.includes('id="hide-meaning-toggle"')) {
    const hideToggleHtml = `
      <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
        <label for="hide-meaning-toggle" style="display: flex; align-items: center; cursor: pointer; color: var(--text1); font-size: 14px; font-weight: 700; gap: 10px;">
          <div class="toggle-switch">
            <input type="checkbox" id="hide-meaning-toggle">
            <span class="slider round"></span>
          </div>
          <span>👁️ 뜻 숨기기 모드</span>
        </label>
      </div>`;
    html = html.replace(dbSearchInput, hideToggleHtml + '\n      ' + dbSearchInput);
  }

  fs.writeFileSync('index.html', html, 'utf8');
}

function fixAppJs() {
  let js = fs.readFileSync('app.js', 'utf8');

  // Update clear logic
  js = js.replace(/if \(typeof clearProgressIDB === 'function'\) await clearProgressIDB\(\);[\s\S]*?App\.testPool = \[\];/m, 'localStorage.clear();');

  // Implement hide meaning mode state
  if (!js.includes('let isHideMeaningMode = false;')) {
    js = js.replace('let isSwipeMode = false;', 'let isSwipeMode = false;\nlet isHideMeaningMode = false;');
  }

  // Bind event listener to hide meaning toggle
  const toggleListener = `
  const hideMeaningToggle = document.getElementById('hide-meaning-toggle');
  if (hideMeaningToggle) {
    hideMeaningToggle.addEventListener('change', (e) => {
      isHideMeaningMode = e.target.checked;
      renderDBList(); // 테이블 재렌더링
    });
  }
`;
  if (!js.includes('hide-meaning-toggle') && js.includes("const swipeToggle = document.getElementById('swipe-toggle-checkbox');")) {
     js = js.replace("const swipeToggle = document.getElementById('swipe-toggle-checkbox');", toggleListener + "\n  const swipeToggle = document.getElementById('swipe-toggle-checkbox');");
  }

  // Update renderDBList to apply blur class
  const oldTrRender = `        <tr style="border-bottom: 1px solid var(--border-h);">
          <td style="padding: 10px 8px;">\${w.word}</td>
          <td style="padding: 10px 8px; color: var(--text2);">\${w.part ? '['+w.part+']' : ''}</td>
          <td style="padding: 10px 8px;">\${w.meaning}</td>
        </tr>`;
  const newTrRender = `        <tr style="border-bottom: 1px solid var(--border-h);">
          <td style="padding: 10px 8px;">\${w.word}</td>
          <td style="padding: 10px 8px; color: var(--text2);">\${w.part ? '['+w.part+']' : ''}</td>
          <td style="padding: 10px 8px;">
            <span class="\${isHideMeaningMode ? 'blur-meaning' : ''}" onclick="if(this.classList.contains('blur-meaning')) this.classList.toggle('revealed')">
              \${w.meaning}
            </span>
          </td>
        </tr>`;
  js = js.replace(oldTrRender, newTrRender);
  // Also check if there's a second place for rendering TRs (like custom manual)
  // Or if we can just safely replace
  if (js.indexOf(oldTrRender) > -1) {
      js = js.replace(oldTrRender, newTrRender);
  } else {
      // Maybe the spacing is different. Let's use regex
      const regexOldTr = /<td style="padding: 10px 8px;">\$\{w\.meaning\}<\/td>/g;
      js = js.replace(regexOldTr, `<td style="padding: 10px 8px;">\n            <span class="\${isHideMeaningMode ? 'blur-meaning' : ''}" onclick="if(this.classList.contains('blur-meaning')) this.classList.toggle('revealed')">\n              \${w.meaning}\n            </span>\n          </td>`);
  }
  
  fs.writeFileSync('app.js', js, 'utf8');
}

fixCSS();
fixIndexHtml();
fixAppJs();
console.log('Fixed CSS, HTML, and JS');
