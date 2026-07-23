const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf8');
const oldHtmlPart = `<div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80px; margin: 10px 0; box-sizing: border-box;">
        <div class="test-word" id="test-word" style="margin: 0; word-break: break-word; line-height: 1.1;"></div>
        <button id="btn-speak-again" class="speaker-icon-btn hidden" title="다시 듣기">
          <span>다시 듣기</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        </button>
      </div>`;

const newHtmlPart = `<div style="width: 100%; display: flex; align-items: center; justify-content: center; min-height: 80px; margin: 10px 0;">
        <div class="test-word" id="test-word" style="margin: 0; word-break: break-word; line-height: 1.1;"></div>
      </div>`;
html = html.replace(oldHtmlPart, newHtmlPart);
fs.writeFileSync('index.html', html, 'utf8');

// 2. Update app.js
let appJs = fs.readFileSync('app.js', 'utf8');
appJs = appJs.replace(/const btnSpeak = document\.getElementById\('btn-speak-again'\);\n\s*if \(btnSpeak\) btnSpeak\.classList\.add\('hidden'\);\n/, '');
appJs = appJs.replace(/if \(btnSpeak\) \{\n\s*btnSpeak\.classList\.remove\('hidden'\);\n\s*if \(btnSpeak\) btnSpeak\.onclick = \(\) => speak\(wordObj\.word\);\n\s*\}/, '');
appJs = appJs.replace('let vw = Math.min(18, 90 / wLen);', 'let vw = Math.min(20, 95 / wLen);');
fs.writeFileSync('app.js', appJs, 'utf8');

// 3. Update style.css
let css = fs.readFileSync('style.css', 'utf8');
css = css.replace(/\.speaker-icon-btn \{[\s\S]*?\}\n\.dictation-mode-active \.speaker-icon-btn \{[\s\S]*?\}\n\.speaker-icon-btn:hover \{[\s\S]*?\}\n\.speaker-icon-btn:active \{[\s\S]*?\}/, '');
fs.writeFileSync('style.css', css, 'utf8');

console.log('Removed speaker and adjusted text size.');
