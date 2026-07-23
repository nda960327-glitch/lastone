const fs = require('fs');
let lines = fs.readFileSync('index.html', 'utf8').split('\n');

// 1. 기존 대형 스피커 (line 181-188 = index 180-187) 삭제
// 해당 라인만 정확히 제거
let toRemove = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('받아쓰기 모드 전용 대형 스피커') ||
      (lines[i].includes('btn-dictation-speaker') && lines[i].includes('pulseSpeaker')) ||
      (lines[i].includes('width="80"') && lines[i].includes('height="80"') && lines[i].includes('stroke="#ffffff"')) ||
      (lines[i].includes('11 5 6 9') && i > 179 && i < 189) ||
      (lines[i].includes('M15.54') && i > 179 && i < 189) ||
      (lines[i].includes('M19.07') && i > 179 && i < 189) ||
      (lines[i].includes('</svg>') && i > 179 && i < 189) ||
      (lines[i].includes('</button>') && i > 179 && i < 189)) {
    toRemove.push(i);
  }
}

console.log('Lines to remove:', toRemove.map(i => i + 1));

// 역순으로 삭제
toRemove.reverse().forEach(i => lines.splice(i, 1));

// 2. "뜻 확인하기" 버튼 바로 위에 새 스피커 삽입
let revealIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('btn-reveal') && lines[i].includes('btn-reveal"')) {
    revealIdx = i;
    break;
  }
}

if (revealIdx >= 0) {
  const speakerLines = [
    '        <!-- 받아쓰기 모드: 다시 듣기 -->',
    '        <button id="btn-dictation-speaker" class="hidden" style="background: transparent; border: none; outline: none; cursor: pointer; padding: 8px 20px; display: flex; align-items: center; gap: 8px; color: var(--text-sub); font-size: 14px; font-weight: 600; margin-bottom: 8px; transition: transform 0.15s;">',
    '          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">',
    '            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>',
    '            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>',
    '            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>',
    '          </svg>',
    '          다시 듣기',
    '        </button>',
  ];
  lines.splice(revealIdx, 0, ...speakerLines);
  console.log('Speaker inserted at line', revealIdx + 1);
} else {
  console.log('ERROR: btn-reveal not found!');
}

fs.writeFileSync('index.html', lines.join('\n'));
console.log('index.html saved!');
