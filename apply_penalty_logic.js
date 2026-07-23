const fs = require('fs');

function updateCss() {
  let css = fs.readFileSync('style.css', 'utf8');

  const newCss = `
/* =============================================
   PENALTY TIMER UI
   ============================================= */
@keyframes blinkPenalty {
  0%, 100% { background-color: #EF4444; opacity: 1; }
  50% { background-color: #DC2626; opacity: 0.6; }
}

.timer-penalty {
  background: #EF4444 !important;
  animation: blinkPenalty 0.2s infinite !important;
}
`;
  if (!css.includes('blinkPenalty')) {
    css += '\n' + newCss;
    fs.writeFileSync('style.css', css, 'utf8');
  }
}

function updateAppJs() {
  let js = fs.readFileSync('app.js', 'utf8');

  // 1. App 객체에 isPenaltyTime 추가
  if (!js.includes('isPenaltyTime: false')) {
    js = js.replace(/isOButtonLocked: false,/, 'isOButtonLocked: false,\n  isPenaltyTime: false,');
  }

  // 2. startWordTimer 함수에서 timer-penalty 클래스 제거 로직 추가
  js = js.replace(/if \(fillEl\) \{[\s\S]*?fillEl\.style\.transition = 'none';/, `if (fillEl) {
    fillEl.classList.remove('timer-penalty', 'timer-warning');
    fillEl.style.transition = 'none';`);

  // 3. loadNextWord 내부의 totalMs, disableOMs 로직 수정 및 App.isPenaltyTime 리셋
  const timeLogicRegex = /let totalMs = 8000;[\s\S]*?disableOMs = 5000;[\s\S]*?\}/;
  const newTimeLogic = `let totalMs = 10000;
        let disableOMs = 5000;
        const mLen = wordObj.meanings ? wordObj.meanings.length : 1;
        if (mLen === 1) {
          totalMs = 7000;
        } else if (mLen === 2) {
          totalMs = 9000;
        } else {
          totalMs = 10000;
        }`;
  js = js.replace(timeLogicRegex, newTimeLogic);

  // App.isPenaltyTime 리셋을 loadNextWord 시작이나 startWordTimer 전에 추가
  js = js.replace(/App\.isOButtonLocked = false;/, `App.isOButtonLocked = false;\n            App.isPenaltyTime = false;`);

  // 4. startWordTimer 호출 콜백에서 isPenaltyTime = true 처리 및 timer-penalty 추가
  const disableOCallbackRegex = /\/\/ O 버튼 비활성화 타임아웃[\s\S]*?App\.isOButtonLocked = true;[\s\S]*?const btnCorrect = document\.getElementById\('btn-correct'\);[\s\S]*?if \(btnCorrect\) btnCorrect\.disabled = true;/;
  const newDisableOCallback = `// O 버튼 비활성화 및 페널티 타임 돌입
            App.isOButtonLocked = true;
            App.isPenaltyTime = true;
            const btnCorrect = document.getElementById('btn-correct');
            if (btnCorrect) {
              btnCorrect.disabled = true;
              btnCorrect.style.opacity = '0.5';
              btnCorrect.style.pointerEvents = 'none';
            }
            const fillEl = document.getElementById('test-timer-fill');
            if (fillEl) fillEl.classList.add('timer-penalty');`;
  js = js.replace(disableOCallbackRegex, newDisableOCallback);

  // 5. onTimeout 콜백에서 타임오버 처리 (processAnswer 호출 수정)
  const timeoutRegex = /\/\/ 전체 타임아웃[\s\S]*?if \(typeof revealResolver === 'function' && revealResolver\) \{[\s\S]*?revealResolver\('timeout'\);[\s\S]*?\} else \{[\s\S]*?processAnswer\(false, true\);[\s\S]*?\}/;
  const newTimeout = `// 전체 타임아웃
            if (typeof revealResolver === 'function' && revealResolver) {
              revealResolver('timeout');
            } else {
              // 타임오버 시 유저 액션 없이도 강제로 빨간 도장 찍고 넘김
              const testCard = document.querySelector('.test-card');
              const globalStamp = document.getElementById('global-stamp');
              if (globalStamp && testCard) {
                globalStamp.textContent = "X";
                globalStamp.style.color = "var(--btn-x-bg)";
                globalStamp.style.textShadow = "0 0 20px rgba(239,68,68,0.5)";
                globalStamp.classList.add('show');
                if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
                testCard.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
                testCard.style.transform = 'translate(-100vw, 0) rotate(-15deg)';
                testCard.style.opacity = '0';
                setTimeout(() => {
                  globalStamp.classList.remove('show');
                  processAnswer(false, true); // true indicates timeUp
                }, 400);
              } else {
                processAnswer(false, true);
              }
            }`;
  js = js.replace(timeoutRegex, newTimeout);

  // 6. 터치 스와이프 로직에서 isPenaltyTime이면 O 처리 불가 로직
  // We need to find the handleTouchEnd function logic.
  // The relevant part is calculating isActuallyO and isActuallyX
  // isActuallyO = deltaX > threshold && !isForceWrong;
  // isActuallyX = deltaX < -threshold || isForceWrong;
  // Wait, in my previous attempt I didn't see the exact code. Let's do a reliable replace.
  
  const touchLogicRegex = /const isForceWrong = isTimeUp;[\s\S]*?const isActuallyO = deltaX > threshold && !isForceWrong;[\s\S]*?const isActuallyX = deltaX < -threshold \|\| isForceWrong;/;
  const newTouchLogic = `// 페널티 타임이거나 isTimeUp이면 강제 오답(X) 처리
        const isForceWrong = isTimeUp || App.isPenaltyTime;
        // O 방향으로 밀어도 페널티 타임이면 isActuallyO는 false가 됨
        const isActuallyO = deltaX > threshold && !isForceWrong;
        // 반대로 페널티 타임일 때 O 방향으로 밀면 강제로 X 처리를 해줌 (isActuallyX가 true가 되도록)
        const isActuallyX = deltaX < -threshold || (deltaX > threshold && isForceWrong) || isForceWrong;`;
  
  if (js.includes('const isForceWrong = isTimeUp;')) {
    js = js.replace(touchLogicRegex, newTouchLogic);
  } else {
    console.log("Could not find touch logic to replace. Using fallback.");
    // Fallback: Just replace isForceWrong
    js = js.replace(/const isForceWrong = isTimeUp;/g, `const isForceWrong = isTimeUp || App.isPenaltyTime;
        if (deltaX > threshold && App.isPenaltyTime) {
          // If trying to swipe O during penalty, override
          deltaX = -threshold - 1; // Force left swipe behavior
        }`);
  }

  // btn-correct 초기화 시 opacity 원래대로
  js = js.replace(/if \(btnCorrect\) btnCorrect\.disabled = false;/g, `if (btnCorrect) { btnCorrect.disabled = false; btnCorrect.style.opacity = '1'; btnCorrect.style.pointerEvents = 'auto'; }`);

  fs.writeFileSync('app.js', js, 'utf8');
}

updateCss();
updateAppJs();
console.log('Dynamic Timeline and Penalty System applied!');
