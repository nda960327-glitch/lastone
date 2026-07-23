const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<div class="action-area" id="action-area"[\s\S]*?id="test-meanings"[\s\S]*?id="ox-buttons-container"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const newHTML = `<!-- 3구역: 힌트 텍스트 (독립적인 요소로 분리) -->
      <div id="test-pos-hint" class="hint-text hidden" style="text-align: center; font-size: 15px; font-weight: 700; color: var(--text-sub); margin: 5px 0 15px 0;"></div>

      <!-- 4구역: 액션 구역 -->
      <div class="action-area" id="action-area" style="display: flex; flex-direction: column; align-items: center; gap: 15px; width: 100%;">
        <button id="btn-reveal" class="btn-reveal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          뜻 확인하기
        </button>
        <div class="test-meanings hidden" id="test-meanings" style="font-size: 1.5rem; text-align: center; width: 100%;"></div>
        <div class="ox-buttons hidden" id="ox-buttons-container" style="display: none; justify-content: center; gap: 20px; width: 100%;">
          <button id="btn-correct" class="btn-o">
            <span class="ox-label">O</span>
            <span class="ox-sub">알고 있어요</span>
          </button>
          <button id="btn-wrong" class="btn-x">
            <span class="ox-label">X</span>
            <span class="ox-sub">몰랐어요</span>
          </button>
        </div>
      </div>`;

if (html.match(regex)) {
  html = html.replace(regex, newHTML);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('index.html updated successfully');
} else {
  console.log('regex not found in index.html');
}
