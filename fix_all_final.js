const fs = require('fs');

// === 1. style.css: .test-word 수정 ===
let css = fs.readFileSync('style.css', 'utf8');

const oldCss = `.test-word {
  font-size: clamp(3.5rem, 18vw, 6rem);
  font-weight: 900;
  text-align: center;
  word-break: keep-all;
  overflow-wrap: break-word;
  line-height: 1.2;
  margin: 20px 0;
  color: var(--text-main);
  text-shadow: 0 0 15px var(--glow-color, transparent);
  width: 100%;
  box-sizing: border-box;
}`;

const newCss = `.test-word {
  font-size: clamp(2.5rem, 12vw, 4rem);
  font-weight: 900;
  text-align: center;
  word-break: keep-all;
  overflow-wrap: break-word;
  line-height: 1.2;
  margin: 20px 0;
  color: var(--text-main);
  text-shadow: 0 0 15px var(--glow-color, transparent);
  width: 100%;
  box-sizing: border-box;
}`;

if (css.includes(oldCss)) {
  css = css.replace(oldCss, newCss);
  console.log('[CSS] .test-word replaced OK');
} else {
  console.log('[CSS] WARNING: old .test-word block not found, trying regex');
  css = css.replace(/\.test-word\s*\{[^}]*\}/, newCss);
}

fs.writeFileSync('style.css', css);

// === 2. app.js: 폰트 크기 로직 수정 ===
let appJs = fs.readFileSync('app.js', 'utf8');

const oldJs = `    const wLen = Math.max(5, wordObj.word.length);
    let cqw = Math.min(26, 160 / wLen);
    testWordEl.style.fontSize = \`clamp(2.5rem, \${cqw}cqw, 20rem)\`;`;

const newJs = `    if (wordObj.word.length > 10) {
      testWordEl.style.fontSize = 'clamp(1.8rem, 8vw, 3rem)';
    } else {
      testWordEl.style.fontSize = '';
    }`;

if (appJs.includes(oldJs)) {
  appJs = appJs.replace(oldJs, newJs);
  console.log('[JS] font sizing logic replaced OK');
} else {
  console.log('[JS] WARNING: old font sizing block not found');
}

// === 3. index.html: 받아쓰기 스피커를 "뜻 확인하기" 위에 배치 ===
let html = fs.readFileSync('index.html', 'utf8');

// 기존 대형 스피커 버튼 삭제 (test-word 옆에 있던 것)
html = html.replace(/\s*<!-- 받아쓰기 모드 전용 대형 스피커 -->[\s\S]*?<\/button>\n/,'\n');

// "뜻 확인하기" 버튼 바로 위에 받아쓰기 전용 스피커 삽입
const btnRevealTag = `        <button id="btn-reveal" class="btn-reveal">`;
const speakerBefore = `        <!-- 받아쓰기 모드 전용: 다시 듣기 스피커 (뜻 확인 위) -->
        <button id="btn-dictation-speaker" class="hidden" style="background: transparent; border: none; outline: none; cursor: pointer; padding: 8px 20px; display: flex; align-items: center; gap: 8px; color: var(--text-sub); font-size: 14px; font-weight: 600; margin-bottom: 8px; transition: transform 0.15s;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
          다시 듣기
        </button>
${btnRevealTag}`;

html = html.replace(btnRevealTag, speakerBefore);

fs.writeFileSync('index.html', html);
console.log('[HTML] Speaker moved above btn-reveal OK');

// === 4. app.js: 스피커 onclick 및 visibility 로직 확인/수정 ===
// 이미 이전에 추가한 코드가 있으면 그대로 두고, 없으면 추가
if (!appJs.includes(`document.getElementById('btn-dictation-speaker')`)) {
  console.log('[JS] Adding dictation speaker logic...');
}

// 스피커 show/hide 로직이 제대로 있는지 확인
if (!appJs.includes(`dictSpeaker.classList.remove('hidden')`)) {
  // isDictationMode 블록 안에 스피커 표시 추가
  appJs = appJs.replace(
    `      document.getElementById('test-word').classList.add('hidden');`,
    `      document.getElementById('test-word').classList.add('hidden');
      const dictSpeaker = document.getElementById('btn-dictation-speaker');
      if (dictSpeaker) {
        dictSpeaker.classList.remove('hidden');
        dictSpeaker.onclick = () => speak(wordObj.word);
      }`
  );
  console.log('[JS] Added dictSpeaker show logic');
}

// else 블록 (일반 모드)에서 스피커 숨기기
if (!appJs.includes(`dictSpeaker.classList.add('hidden')`)) {
  appJs = appJs.replace(
    `      document.getElementById('test-word').classList.remove('hidden');`,
    `      document.getElementById('test-word').classList.remove('hidden');
      const dictSpeakerHide = document.getElementById('btn-dictation-speaker');
      if (dictSpeakerHide) dictSpeakerHide.classList.add('hidden');`
  );
  console.log('[JS] Added dictSpeaker hide logic');
}

fs.writeFileSync('app.js', appJs);
console.log('All fixes applied!');
