const fs = require('fs');

function fixAppJs() {
  const lines = fs.readFileSync('app.js', 'utf8').split('\n');
  const start = lines.findIndex(l => l.includes('if (testCard) {'));
  const end = lines.findIndex((l, i) => i > start && l.includes('// Settings Button Toggle Logic'));
  
  if (start === -1 || end === -1) {
    console.error('Could not find bounds');
    return;
  }

  const replacement = `  if (testCard) {
    testCard.addEventListener('touchstart', (e) => {
      if (!isSwipeMode) return;
      if (e.target.closest('button')) return; 
      isDragging = true;
      swipeStartX = e.touches[0].clientX;
      testCard.classList.add('dragging');
      if (typeof stopWordTimer === 'function') stopWordTimer();
    });

    testCard.addEventListener('touchmove', (e) => {
      if (!isSwipeMode || !isDragging) return;
      if (e.target.closest('button')) return; 
      swipeCurrentX = e.touches[0].clientX;
      const deltaX = swipeCurrentX - swipeStartX;
      const rotateDeg = deltaX * 0.05;
      testCard.style.transform = \`translate(\${deltaX}px, 0) rotate(\${rotateDeg}deg)\`;

      const opacity = Math.min(Math.abs(deltaX) / 80, 1);

      if (deltaX > 0) {
        testCard.style.boxShadow = \`0 0 40px rgba(74, 222, 128, \${opacity * 0.4})\`;
      } else if (deltaX < 0) {
        testCard.style.boxShadow = \`0 0 40px rgba(244, 63, 94, \${opacity * 0.4})\`;
      } else {
        testCard.style.boxShadow = '';
      }
    });

    testCard.addEventListener('touchend', (e) => {
      if (!isSwipeMode || !isDragging) return;
      if (e.target.closest('button')) return;
      isDragging = false;
      testCard.classList.remove('dragging');

      const deltaX = swipeCurrentX - swipeStartX;
      const threshold = 80;

      function resetCard() {
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
      }
      swipeStartX = 0;
      swipeCurrentX = 0;
    });
  }

`;
  
  lines.splice(start, end - start, replacement);
  fs.writeFileSync('app.js', lines.join('\n'), 'utf8');
}

function fixIndexHtml() {
  const html = fs.readFileSync('index.html', 'utf8');
  let newHtml = html;
  
  newHtml = newHtml.replace(/<div class="stamp stamp-o" id="stamp-o">O 안다<\/div>/g, '');
  newHtml = newHtml.replace(/<div class="stamp stamp-x" id="stamp-x">X 모름<\/div>/g, '');
  
  if (!newHtml.includes('id="center-stamp"')) {
    newHtml = newHtml.replace('<body>', '<body>\n  <!-- 중앙 고정 스탬프 -->\n  <div id="center-stamp" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1.5); opacity: 0; pointer-events: none; z-index: 9999; transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease-out; font-size: 80px; font-weight: 900; border-radius: 20px; padding: 20px 40px; border: 12px solid; background: rgba(0,0,0,0.3); backdrop-filter: blur(5px);"></div>');
  }
  
  fs.writeFileSync('index.html', newHtml, 'utf8');
}

fixAppJs();
fixIndexHtml();
console.log('Fixed app.js and index.html');
