const fs = require('fs');

// 1. Fix app.js
let appJs = fs.readFileSync('app.js', 'utf8');
appJs = appJs.replace(
  /const wLen = wordObj\.word\.length;[\s\S]*?\} else \{[\s\S]*?\}/,
  `const wLen = wordObj.word.length;
    let vw = Math.min(18, 85 / wLen);
    testWordEl.style.fontSize = \`clamp(1.5rem, \${vw}vw, 5.5rem)\`;`
);
fs.writeFileSync('app.js', appJs, 'utf8');

// 2. Fix index.html
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(
  /<div style="width: 100%; text-align: center; margin: 10px 0; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 0 10px;">\s*<div class="test-word" id="test-word" style="margin: 0; word-break: break-word; flex-shrink: 1;"><\/div>\s*<button id="btn-speak-again" class="speaker-icon-btn hidden" title="🔊 다시 듣기">🔊<\/button>\s*<\/div>/,
  `<div style="position: relative; width: 100%; display: flex; align-items: center; justify-content: center; min-height: 80px; margin: 10px 0; padding: 0 40px; box-sizing: border-box;">
        <div class="test-word" id="test-word" style="margin: 0; word-break: break-word;"></div>
        <button id="btn-speak-again" class="speaker-icon-btn hidden" title="🔊 다시 듣기" style="position: absolute; right: 5px; background: transparent !important; border: none !important; box-shadow: none !important; outline: none !important; padding: 0; color: var(--text-main);">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        </button>
      </div>`
);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed app.js and index.html');
