const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// 1. Add isTimeUp global
if (!appJs.includes('let isTimeUp = false;')) {
  appJs = appJs.replace('let isSwipeMode = false;', 'let isSwipeMode = false;\nlet isTimeUp = false;');
}

// 2. Init isTimeUp = false in runTestRound loop
const runTestLoopStartRegex = /  for \(let i = startIndex; i < pool\.length; i\+\+\) \{/;
appJs = appJs.replace(runTestLoopStartRegex, `  for (let i = startIndex; i < pool.length; i++) {
    isTimeUp = false;`);

// 3. Update handleWordTimeout
const timeoutRegex = /function handleWordTimeout\(\) \{\s*if \(App\.phase !== 'test'\) return;\s*(if \(typeof revealResolver === 'function'[\s\S]*?r\('TIMEOUT'\);\s*\})/m;
const newTimeout = `function handleWordTimeout() {
  if (App.phase !== 'test') return;
  
  if (isSwipeMode) {
    isTimeUp = true;
    return;
  }

  if (typeof revealResolver === 'function' && revealResolver) {
    const r = revealResolver;
    revealResolver = null;
    r('TIMEOUT');
  } else if (typeof oxResolver === 'function' && oxResolver) {
    const r = oxResolver;
    oxResolver = null;
    r('TIMEOUT');
  }`;
appJs = appJs.replace(timeoutRegex, newTimeout);

// 4. Update touchmove (remove inner stamps)
const touchmoveTarget = `      const stampO = document.getElementById('stamp-o');
      const stampX = document.getElementById('stamp-x');
      const opacity = Math.min(Math.abs(deltaX) / 80, 1);

      if (deltaX > 0) {
        if (stampO) stampO.style.opacity = opacity;
        if (stampX) stampX.style.opacity = 0;
        testCard.style.boxShadow = \`0 0 40px rgba(74, 222, 128, \${opacity * 0.4})\`;
      } else if (deltaX < 0) {
        if (stampO) stampO.style.opacity = 0;
        if (stampX) stampX.style.opacity = opacity;
        testCard.style.boxShadow = \`0 0 40px rgba(244, 63, 94, \${opacity * 0.4})\`;
      } else {
        if (stampO) stampO.style.opacity = 0;
        if (stampX) stampX.style.opacity = 0;
        testCard.style.boxShadow = '';
      }`;

const newTouchmove = `      const opacity = Math.min(Math.abs(deltaX) / 80, 1);

      if (deltaX > 0) {
        testCard.style.boxShadow = \`0 0 40px rgba(74, 222, 128, \${opacity * 0.4})\`;
      } else if (deltaX < 0) {
        testCard.style.boxShadow = \`0 0 40px rgba(244, 63, 94, \${opacity * 0.4})\`;
      } else {
        testCard.style.boxShadow = '';
      }`;
appJs = appJs.replace(touchmoveTarget, newTouchmove);


// 5. Update touchend
const touchendTargetRegex = /      function resetCard\(\) \{[\s\S]*?resetCard\(\);\n      \}/;
const newTouchend = `      function resetCard() {
        testCard.style.transition = '';
        testCard.style.transform = '';
        testCard.style.boxShadow = '';
      }

      if (deltaX > threshold || deltaX < -threshold) {
        const isForceWrong = isTimeUp;
        const isActuallyO = deltaX > threshold && !isForceWrong;
        const isActuallyX = deltaX < -threshold || isForceWrong;
        const centerStamp = document.getElementById('center-stamp');

        testCard.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
        testCard.style.opacity = '0';

        if (isActuallyO) {
          if (navigator.vibrate) navigator.vibrate(50);
          testCard.style.transform = \`translate(100vw, 0) rotate(15deg)\`;
          
          if (centerStamp) {
            centerStamp.textContent = 'O 안다';
            centerStamp.style.color = 'var(--green)';
            centerStamp.style.borderColor = 'var(--green)';
            centerStamp.style.opacity = '1';
            centerStamp.style.transform = 'translate(-50%, -50%) scale(1)';
          }
          
          setTimeout(() => {
            if (centerStamp) {
              centerStamp.style.opacity = '0';
              centerStamp.style.transform = 'translate(-50%, -50%) scale(1.5)';
            }
            document.getElementById('btn-correct').click();
            testCard.style.opacity = '1';
            resetCard();
          }, 600);
        } else if (isActuallyX) {
          if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
          testCard.style.transform = \`translate(\${deltaX > 0 ? 100 : -100}vw, 0) rotate(\${deltaX > 0 ? 15 : -15}deg)\`;
          
          if (centerStamp) {
            centerStamp.textContent = isForceWrong ? 'X 시간초과' : 'X 모름';
            centerStamp.style.color = 'var(--red)';
            centerStamp.style.borderColor = 'var(--red)';
            centerStamp.style.opacity = '1';
            centerStamp.style.transform = 'translate(-50%, -50%) scale(1)';
          }
          
          setTimeout(() => {
            if (centerStamp) {
              centerStamp.style.opacity = '0';
              centerStamp.style.transform = 'translate(-50%, -50%) scale(1.5)';
            }
            document.getElementById('btn-wrong').click();
            testCard.style.opacity = '1';
            resetCard();
          }, 600);
        }
      } else {
        resetCard();
      }`;

appJs = appJs.replace(touchendTargetRegex, newTouchend);

fs.writeFileSync('app.js', appJs, 'utf8');
console.log('Successfully updated app.js logic.');
