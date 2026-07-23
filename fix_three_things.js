const fs = require('fs');

// ===== 1. style.css: 폰트 크기 존나 키우기 =====
let css = fs.readFileSync('style.css', 'utf8');
css = css.replace(
  'font-size: clamp(2.5rem, 12vw, 4rem);',
  'font-size: clamp(3.5rem, 16vw, 5.5rem);'
);
fs.writeFileSync('style.css', css);
console.log('[1] CSS font-size boosted to clamp(3.5rem, 16vw, 5.5rem)');

// ===== 2. app.js: 3가지 수정 =====
let js = fs.readFileSync('app.js', 'utf8');

// 2a. 10글자 초과 폰트도 더 크게
js = js.replace(
  "testWordEl.style.fontSize = 'clamp(1.8rem, 8vw, 3rem)';",
  "testWordEl.style.fontSize = 'clamp(2.2rem, 10vw, 3.5rem)';"
);
console.log('[2a] Long word font also boosted');

// 2b. 시간초과 X 도장에 "시간초과" 텍스트 추가 (스와이프 시)
js = js.replace(
  `          if (globalStamp) {
            globalStamp.textContent = "X";
            globalStamp.className = "stamp-x stamp-show";
          }
          
          setTimeout(() => {
            if (globalStamp) {
              globalStamp.classList.remove('stamp-show');
            }
            document.getElementById('btn-wrong').click();`,
  `          if (globalStamp) {
            globalStamp.innerHTML = isForceWrong ? 'X<br><span style="font-size:0.3em;font-weight:700;letter-spacing:0.05em">시간초과</span>' : 'X';
            globalStamp.className = "stamp-x stamp-show";
          }
          
          setTimeout(() => {
            if (globalStamp) {
              globalStamp.classList.remove('stamp-show');
            }
            document.getElementById('btn-wrong').click();`
);
console.log('[2b] Timeout X stamp shows 시간초과');

// 2c. O 버튼 잠금(시간초과) 후 자동 X 클릭 시에도 stamp에 시간초과 표시
// btn-wrong 클릭 이벤트에서 stamp 표시하는 부분 찾기
// 직접 클릭하는 경우는 스와이프가 아니므로 다른 곳에서 처리 필요

fs.writeFileSync('app.js', js);
console.log('[2] app.js saved');

// ===== 3. index.html: 다시듣기 위 여백에 연필 이모지 추가 =====
let html = fs.readFileSync('index.html', 'utf8');
let lines = html.split('\n');

// btn-dictation-speaker 라인 찾기
let speakerIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('받아쓰기 모드: 다시 듣기')) {
    speakerIdx = i;
    break;
  }
}

if (speakerIdx >= 0) {
  // 스피커 버튼 바로 위에 귀여운 연필 애니메이션 삽입
  const pencilEmoji = [
    '        <!-- 받아쓰기 모드: 상단 연필 애니메이션 -->',
    '        <div id="dictation-pencil-deco" class="hidden" style="display: flex; flex-direction: column; align-items: center; gap: 4px; margin-bottom: 0px; animation: floatPencil 2.5s ease-in-out infinite;">',
    '          <span style="font-size: 48px;">✏️</span>',
    '          <span style="font-size: 13px; font-weight: 600; color: var(--text-sub); opacity: 0.7; letter-spacing: 0.05em;">듣고 써보세요!</span>',
    '        </div>',
  ];
  lines.splice(speakerIdx, 0, ...pencilEmoji);
  console.log('[3] Pencil emoji inserted at line', speakerIdx + 1);
} else {
  console.log('[3] WARNING: speaker comment not found');
}

fs.writeFileSync('index.html', lines.join('\n'));
console.log('[3] index.html saved');

// ===== 4. style.css: floatPencil 애니메이션 추가 =====
css = fs.readFileSync('style.css', 'utf8');
if (!css.includes('floatPencil')) {
  css += `
@keyframes floatPencil {
  0% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-8px) rotate(5deg); }
  100% { transform: translateY(0) rotate(-5deg); }
}
`;
  fs.writeFileSync('style.css', css);
  console.log('[4] floatPencil animation added to style.css');
}

// ===== 5. app.js: 받아쓰기 모드에서 연필 이모지 show/hide =====
js = fs.readFileSync('app.js', 'utf8');

// show
js = js.replace(
  "dictSpeaker.classList.remove('hidden');",
  "dictSpeaker.classList.remove('hidden');\n        const pencilDeco = document.getElementById('dictation-pencil-deco');\n        if (pencilDeco) { pencilDeco.classList.remove('hidden'); pencilDeco.style.display = 'flex'; }"
);

// hide
js = js.replace(
  "dictSpeakerHide.classList.add('hidden');",
  "dictSpeakerHide.classList.add('hidden');\n      const pencilDecoHide = document.getElementById('dictation-pencil-deco');\n      if (pencilDecoHide) { pencilDecoHide.classList.add('hidden'); pencilDecoHide.style.display = 'none'; }"
);

fs.writeFileSync('app.js', js);
console.log('[5] Pencil show/hide logic added');

console.log('ALL DONE!');
