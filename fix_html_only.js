const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Step 1: 기존 btn-dictation-speaker 블록 제거 (line 181-188)
// 정확한 문자열로 제거
const oldSpeaker = `        <!-- 받아쓰기 모드 전용 대형 스피커 -->
        <button id="btn-dictation-speaker" class="hidden" style="background: transparent; border: none; outline: none; cursor: pointer; padding: 10px; transition: transform 0.2s; animation: pulseSpeaker 2s infinite;">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 10px rgba(255,255,255,0.4));">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        </button>`;

html = html.replace(oldSpeaker, '');
console.log('Removed old speaker');

// Step 2: "뜻 확인하기" 버튼 앞에 새 스피커 삽입
const revealBtn = `        <button id="btn-reveal" class="btn-reveal">`;
const newSpeaker = `        <!-- 받아쓰기 모드: 다시 듣기 -->
        <button id="btn-dictation-speaker" class="hidden" style="background: transparent; border: none; outline: none; cursor: pointer; padding: 8px 20px; display: flex; align-items: center; gap: 8px; color: var(--text-sub); font-size: 14px; font-weight: 600; margin-bottom: 8px; transition: transform 0.15s;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
          다시 듣기
        </button>
`;

html = html.replace(revealBtn, newSpeaker + revealBtn);
console.log('Added new speaker above btn-reveal');

fs.writeFileSync('index.html', html);
console.log('index.html saved!');
