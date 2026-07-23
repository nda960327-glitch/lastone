const fs = require('fs');

// ============ 1. style.css 수정 ============
let css = fs.readFileSync('style.css', 'utf8');
// 기존 .test-word의 font-size만 정확히 교체
css = css.replace(
  'font-size: clamp(3.5rem, 18vw, 6rem);',
  'font-size: clamp(2.5rem, 12vw, 4rem);'
);
fs.writeFileSync('style.css', css);
console.log('[1] style.css .test-word font-size fixed');

// ============ 2. app.js - 폰트 크기 로직 교체 ============
let js = fs.readFileSync('app.js', 'utf8');

// 3줄짜리 cqw 로직을 사용자가 요청한 로직으로 교체
js = js.replace(
  `    const wLen = Math.max(5, wordObj.word.length);\r\n    let cqw = Math.min(26, 160 / wLen);\r\n    testWordEl.style.fontSize = \`clamp(2.5rem, \${cqw}cqw, 20rem)\`;`,
  `    if (wordObj.word.length > 10) {\r\n      testWordEl.style.fontSize = 'clamp(1.8rem, 8vw, 3rem)';\r\n    } else {\r\n      testWordEl.style.fontSize = '';\r\n    }`
);

// LF 버전도 시도
js = js.replace(
  `    const wLen = Math.max(5, wordObj.word.length);\n    let cqw = Math.min(26, 160 / wLen);\n    testWordEl.style.fontSize = \`clamp(2.5rem, \${cqw}cqw, 20rem)\`;`,
  `    if (wordObj.word.length > 10) {\n      testWordEl.style.fontSize = 'clamp(1.8rem, 8vw, 3rem)';\n    } else {\n      testWordEl.style.fontSize = '';\n    }`
);

console.log('[2] app.js font logic replaced');

// ============ 3. index.html - 스피커를 뜻확인하기 위로 이동 ============
let html = fs.readFileSync('index.html', 'utf8');

// 기존 btn-dictation-speaker 블록 통째로 제거
html = html.replace(/\s*<!-- 받아쓰기 모드 전용 대형 스피커 -->[\s\S]*?<\/button>\n/, '\n');

// "뜻 확인하기" 버튼 바로 위에 깔끔한 스피커 버튼 삽입
const target = '        <button id="btn-reveal" class="btn-reveal">';
const speakerBtn = `        <!-- 받아쓰기 모드: 다시 듣기 -->
        <button id="btn-dictation-speaker" class="hidden" style="background: transparent; border: none; outline: none; cursor: pointer; padding: 8px 20px; display: flex; align-items: center; gap: 8px; color: var(--text-sub); font-size: 14px; font-weight: 600; margin-bottom: 8px; transition: transform 0.15s;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
          다시 듣기
        </button>
`;
html = html.replace(target, speakerBtn + target);
fs.writeFileSync('index.html', html);
console.log('[3] index.html speaker moved above btn-reveal');

// ============ 4. app.js - 받아쓰기 모드 스피커 show/hide 로직 ============
// isDictationMode 블록에서 스피커 보이기
if (!js.includes("dictSpeaker.classList.remove('hidden')")) {
  js = js.replace(
    "      document.getElementById('test-word').classList.add('hidden');",
    "      document.getElementById('test-word').classList.add('hidden');\n      const dictSpeaker = document.getElementById('btn-dictation-speaker');\n      if (dictSpeaker) {\n        dictSpeaker.classList.remove('hidden');\n        dictSpeaker.onclick = () => speak(wordObj.word);\n      }"
  );
  console.log('[4a] dictSpeaker show logic added');
}

// else 블록(일반 모드)에서 스피커 숨기기
if (!js.includes("dictSpeakerHide.classList.add('hidden')")) {
  js = js.replace(
    "      document.getElementById('test-word').classList.remove('hidden');",
    "      document.getElementById('test-word').classList.remove('hidden');\n      const dictSpeakerHide = document.getElementById('btn-dictation-speaker');\n      if (dictSpeakerHide) dictSpeakerHide.classList.add('hidden');"
  );
  console.log('[4b] dictSpeaker hide logic added');
}

fs.writeFileSync('app.js', js);
console.log('ALL DONE!');
