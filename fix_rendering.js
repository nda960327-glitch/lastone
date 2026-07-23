const fs = require('fs');

// 1. index.html 수정 (UI 컨테이너 분리)
let html = fs.readFileSync('index.html', 'utf8');

// action-area 이전 구조
const oldActionArea = `      <div class="action-area" id="action-area" style="display: flex; flex-direction: column; align-items: center; gap: 15px; margin-top: 10px; width: 100%;">
        <button id="btn-reveal" class="btn-reveal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          뜻 확인하기
        </button>
        <div class="test-meanings hidden" id="test-meanings" style="font-size: 1.5rem; text-align: center;"></div>
        <div class="ox-buttons hidden" id="ox-buttons-container" style="display: none; justify-content: center; gap: 20px;">`;

const newActionArea = `      <!-- 3구역: 힌트 텍스트 (독립적인 요소로 분리) -->
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
        <div class="ox-buttons hidden" id="ox-buttons-container" style="display: none; justify-content: center; gap: 20px; width: 100%;">`;

if (html.includes('<div class="action-area" id="action-area"')) {
  html = html.replace(oldActionArea, newActionArea);
  fs.writeFileSync('index.html', html, 'utf8');
}


// 2. app.js 수정 (타이머 초기화 로직 및 버튼 비활성화 해제)
let js = fs.readFileSync('app.js', 'utf8');

// startWordTimer 타이머 초기화 안전장치
const timerLogicOld = `if (fillEl) {
    fillEl.classList.remove('timer-penalty', 'timer-warning');
    fillEl.style.transition = 'none';
    fillEl.style.width = '100%';
    fillEl.style.background = 'linear-gradient(90deg, #3b82f6, #6366f1)'; // 편안한 파란색 유지

    // 브라우저 렌더링 강제 리플로우 (초기화 즉시 반영)
    void fillEl.offsetWidth;

    // 즉시 남은 시간 동안 서서히 줄어드는 애니메이션 (대기 시간 없음)
    fillEl.style.transition = \`width \${totalMs}ms linear\`;
    fillEl.style.width = '0%';
  }`;

const timerLogicNew = `if (fillEl) {
    fillEl.classList.remove('timer-penalty', 'timer-warning');
    fillEl.style.transition = 'none';
    fillEl.style.width = '100%';
    fillEl.style.background = 'linear-gradient(90deg, #3b82f6, #6366f1)';
    fillEl.style.display = 'block'; // 강제 표시 안전장치

    // 브라우저 렌더링 강제 리플로우 (초기화 즉시 반영)
    void fillEl.offsetWidth;
    
    // 미세한 딜레이를 주어 애니메이션이 씹히는 현상 완벽 방지
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fillEl.style.transition = \`width \${totalMs}ms linear\`;
        fillEl.style.width = '0%';
      });
    });
  }`;

if (js.includes('void fillEl.offsetWidth;')) {
  js = js.replace(timerLogicOld, timerLogicNew);
}

// 힌트 텍스트 보여주기: '뜻 확인하기'를 눌러도 test-pos-hint는 건드리지 않으므로 그대로 유지됨.
// 하지만 loadNextWord 에서 posHintEl를 보여주긴 해야함.

const showHintOld = `if (posHintEl) posHintEl.textContent = \`품사 \${wordObj.meanings.length}개\`;
    if (!isDictationMode) {
if (posHintEl) posHintEl.classList.remove('hidden');
    }`;

const showHintNew = `if (posHintEl) {
      posHintEl.textContent = \`품사 \${wordObj.meanings.length}개\`;
      if (!isDictationMode) posHintEl.classList.remove('hidden');
    }`;
if (js.includes('if (posHintEl) posHintEl.textContent = `품사 ${wordObj.meanings.length}개`;')) {
  js = js.replace(showHintOld, showHintNew);
}


fs.writeFileSync('app.js', js, 'utf8');
console.log('UI structure and rendering bug fixes applied!');
