const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf8');
const oldHtmlPart = `<div style="position: relative; width: 100%; display: flex; align-items: center; justify-content: center; min-height: 80px; margin: 10px 0; padding: 0 40px; box-sizing: border-box;">
        <div class="test-word" id="test-word" style="margin: 0; word-break: break-word;"></div>
        <button id="btn-speak-again" class="speaker-icon-btn hidden" title="🔊 다시 듣기" style="position: absolute; right: 5px; background: transparent !important; border: none !important; box-shadow: none !important; outline: none !important; padding: 0; color: var(--text-main);">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        </button>
      </div>`;

const newHtmlPart = `<div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80px; margin: 10px 0; box-sizing: border-box;">
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
html = html.replace(oldHtmlPart, newHtmlPart);
fs.writeFileSync('index.html', html, 'utf8');

// 2. Update style.css
let css = fs.readFileSync('style.css', 'utf8');
const oldCssPart = `.speaker-icon-btn {
  background: transparent;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  flex-shrink: 0;
  transition: all 0.2s ease;
  color: var(--text-main);
}
.dictation-mode-active .speaker-icon-btn {
  width: 48px;
  height: 48px;
  font-size: 24px;
}
.speaker-icon-btn:hover {
  background: transparent;
  transform: scale(1.1);
}
.speaker-icon-btn:active {
  transform: scale(0.95);
}`;

const newCssPart = `.speaker-icon-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  margin-top: 12px;
  transition: all 0.2s ease;
  color: var(--text-sub);
}
.dictation-mode-active .speaker-icon-btn {
  font-size: 16px;
  padding: 10px 20px;
  margin-top: 24px;
}
.speaker-icon-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
  color: var(--text-main);
}
.speaker-icon-btn:active {
  transform: scale(0.95);
}`;
css = css.replace(oldCssPart, newCssPart);
fs.writeFileSync('style.css', css, 'utf8');

// 3. Update app.js (change 85 to 90)
let appJs = fs.readFileSync('app.js', 'utf8');
appJs = appJs.replace('let vw = Math.min(18, 85 / wLen);', 'let vw = Math.min(18, 90 / wLen);');
fs.writeFileSync('app.js', appJs, 'utf8');

console.log('Fixed speaker layout');
