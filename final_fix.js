const fs = require('fs');

function applyFixes() {
  // 1. index.html
  let html = fs.readFileSync('index.html', 'utf8');
  // Remove old stamps
  html = html.replace(/<div id="stamp-o".*?<\/div>/g, '');
  html = html.replace(/<div id="stamp-x".*?<\/div>/g, '');
  // Add center-stamp just after <body>
  if (!html.includes('id="center-stamp"')) {
    html = html.replace('<body>', '<body>\n  <!-- 중앙 고정 스탬프 -->\n  <div id="center-stamp" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1.5); opacity: 0; pointer-events: none; z-index: 9999; transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease-out; font-size: 80px; font-weight: 900; border-radius: 20px; padding: 20px 40px; border: 12px solid; background: rgba(0,0,0,0.3); backdrop-filter: blur(5px);"></div>');
  }
  fs.writeFileSync('index.html', html, 'utf8');

  // 2. style.css
  let css = fs.readFileSync('style.css', 'utf8');
  css = css.replace(/\.stamp \{[\s\S]*?rotate\(25deg\); \}/, '');
  fs.writeFileSync('style.css', css, 'utf8');

  // 3. app.js
  let js = fs.readFileSync('app.js', 'utf8');
  
  // A. add isTimeUp
  if (!js.includes('let isTimeUp = false;')) {
    js = js.replace('let isSwipeMode = false;', 'let isSwipeMode = false;\nlet isTimeUp = false;');
  }

  // B. initialize isTimeUp in runTestRound
  if (!js.includes('isTimeUp = false;')) {
    js = js.replace('for (let i = startIndex; i < pool.length; i++) {', 'for (let i = startIndex; i < pool.length; i++) {\n    isTimeUp = false;');
  }

  // C. Update handleWordTimeout
  const oldTimeout = `function handleWordTimeout() {
  if (App.phase !== 'test') return;
  if (typeof revealResolver === 'function' && revealResolver) {
    const r = revealResolver;
    revealResolver = null;
    r('TIMEOUT');
  } else if (typeof oxResolver === 'function' && oxResolver) {
    const r = oxResolver;
    oxResolver = null;
    r('TIMEOUT');
  }
}`;
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
  }
}`;
  js = js.replace(oldTimeout, newTimeout);

  // D. touchmove
  const oldTouchmove = `      const stampO = document.getElementById('stamp-o');
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
  js = js.replace(oldTouchmove, newTouchmove);

  // E. touchend
  const oldTouchend = `      function resetCard() {
        testCard.style.transition = '';
        testCard.style.transform = '';
        testCard.style.boxShadow = '';
        const stampO = document.getElementById('stamp-o');
        const stampX = document.getElementById('stamp-x');
        if (stampO) stampO.style.opacity = 0;
        if (stampX) stampX.style.opacity = 0;
      }

      if (deltaX > threshold) {
        if (navigator.vibrate) navigator.vibrate(50);
        testCard.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
        testCard.style.transform = \`translate(100vw, 0) rotate(15deg)\`;
        testCard.style.opacity = '0';
        setTimeout(() => {
          document.getElementById('btn-correct').click();
          testCard.style.opacity = '1';
          resetCard();
        }, 600);
      } else if (deltaX < -threshold) {
        if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
        testCard.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
        testCard.style.transform = \`translate(-100vw, 0) rotate(-15deg)\`;
        testCard.style.opacity = '0';
        setTimeout(() => {
          document.getElementById('btn-wrong').click();
          testCard.style.opacity = '1';
          resetCard();
        }, 600);
      } else {
        resetCard();
      }`;
  
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

  js = js.replace(oldTouchend, newTouchend);
  fs.writeFileSync('app.js', js, 'utf8');
}

applyFixes();
console.log('Fixed correctly');
