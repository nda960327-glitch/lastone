const fs = require('fs');

function fixIndexHtml() {
  let html = fs.readFileSync('index.html', 'utf8');

  // Fix inline colors
  html = html.replace(/color:\s*#ffffff/gi, 'color: var(--text1)');
  html = html.replace(/color:\s*#fff(?![\da-fA-F])/gi, 'color: var(--text1)');
  html = html.replace(/color:\s*white\b/gi, 'color: var(--text1)');

  // Fix borders and backgrounds
  html = html.replace(/border: 1px solid rgba\(255,255,255,0\.2\)/g, 'border: 1px solid var(--border)');
  html = html.replace(/background: rgba\(0,0,0,0\.2\)/g, 'background: var(--input-bg)');
  
  html = html.replace(/border-bottom: 1px solid rgba\(255,255,255,0\.2\)/g, 'border-bottom: 1px solid var(--border-h)');
  html = html.replace(/border-bottom: 1px solid rgba\(255,255,255,0\.1\)/g, 'border-bottom: 1px solid var(--border)');

  // Add reset button to settings menu
  const settingsRegex = /<label for="swipe-toggle-checkbox"[\s\S]*?<\/label>/;
  const match = html.match(settingsRegex);
  if (match && !html.includes('id="btn-reset-progress"')) {
    const resetButtonUI = `
        <!-- 초기화하기 -->
        <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border); text-align: center;">
          <button id="btn-reset-progress" style="width: 100%; padding: 8px; background: transparent; border: 1px solid var(--red); color: var(--red); border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; transition: background 0.2s;">
            🚨 학습 기록 전체 초기화
          </button>
        </div>`;
    html = html.replace(settingsRegex, match[0] + resetButtonUI);
  }

  fs.writeFileSync('index.html', html, 'utf8');
}

fixIndexHtml();
console.log('Fixed index.html');
