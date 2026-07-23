const fs = require('fs');

function updateCode() {
  // 1. Update index.html
  let html = fs.readFileSync('index.html', 'utf8');
  html = html.replace(/<!-- 중앙 고정 스탬프 -->[\s\S]*?<\/div>/, '<!-- 글로벌 스탬프 -->\n  <div id="global-stamp"></div>');
  fs.writeFileSync('index.html', html, 'utf8');

  // 2. Update style.css
  let css = fs.readFileSync('style.css', 'utf8');
  const stampCss = `
#global-stamp {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-15deg) scale(0.5);
    font-size: 8rem;
    font-weight: 900;
    border: 8px solid;
    border-radius: 20px;
    padding: 20px 40px;
    opacity: 0; /* 평소엔 절대 안 보임 */
    pointer-events: none; /* 터치 방해 금지 */
    z-index: 9999;
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* 쾅 찍히는 바운스 효과 */
}
.stamp-o { color: rgba(34, 197, 94, 0.9); border-color: rgba(34, 197, 94, 0.9); }
.stamp-x { color: rgba(239, 68, 68, 0.9); border-color: rgba(239, 68, 68, 0.9); }
.stamp-show { opacity: 1 !important; transform: translate(-50%, -50%) rotate(-15deg) scale(1) !important; }
`;
  css += stampCss;
  fs.writeFileSync('style.css', css, 'utf8');

  // 3. Update app.js
  let js = fs.readFileSync('app.js', 'utf8');
  
  const oldTouchendInner = `        const centerStamp = document.getElementById('center-stamp');

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
        }`;
        
  const newTouchendInner = `        const globalStamp = document.getElementById('global-stamp');

        testCard.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
        testCard.style.opacity = '0';

        if (isActuallyO) {
          if (navigator.vibrate) navigator.vibrate(50);
          testCard.style.transform = \`translate(100vw, 0) rotate(15deg)\`;
          
          if (globalStamp) {
            globalStamp.textContent = "O";
            globalStamp.className = "stamp-o stamp-show";
          }
          
          setTimeout(() => {
            if (globalStamp) {
              globalStamp.classList.remove('stamp-show');
            }
            document.getElementById('btn-correct').click();
            testCard.style.opacity = '1';
            resetCard();
          }, 600);
        } else if (isActuallyX) {
          if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
          testCard.style.transform = \`translate(\${deltaX > 0 ? 100 : -100}vw, 0) rotate(\${deltaX > 0 ? 15 : -15}deg)\`;
          
          if (globalStamp) {
            globalStamp.textContent = "X";
            globalStamp.className = "stamp-x stamp-show";
          }
          
          setTimeout(() => {
            if (globalStamp) {
              globalStamp.classList.remove('stamp-show');
            }
            document.getElementById('btn-wrong').click();
            testCard.style.opacity = '1';
            resetCard();
          }, 600);
        }`;

  js = js.replace(oldTouchendInner, newTouchendInner);
  fs.writeFileSync('app.js', js, 'utf8');
}

updateCode();
console.log('Update complete.');
