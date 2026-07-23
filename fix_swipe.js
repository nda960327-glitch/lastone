const fs = require('fs');

let content = fs.readFileSync('app.js', 'utf8');

// Normalize line endings to \n
content = content.replace(/\r\n/g, '\n');

const target = `    testCard.addEventListener('touchstart', (e) => {
      if (!isSwipeMode) return;
      if (e.target.closest('button')) return; // 버튼 터치 시 스와이프 무시
      isDragging = true;
      swipeStartX = e.touches[0].clientX;
      testCard.classList.add('dragging');
    });

    testCard.addEventListener('touchmove', (e) => {
      if (!isSwipeMode || !isDragging) return;
      if (e.target.closest('button')) return; // 혹시라도 이동 중 버튼 위라면 무시
      swipeCurrentX = e.touches[0].clientX;
      const deltaX = swipeCurrentX - swipeStartX;
      const rotateDeg = deltaX * 0.05;
      testCard.style.transform = \`translate(\${deltaX}px, 0) rotate(\${rotateDeg}deg)\`;

      if (deltaX > 20) {
        testCard.style.boxShadow = '0 0 40px rgba(74, 222, 128, 0.4)';
      } else if (deltaX < -20) {
        testCard.style.boxShadow = '0 0 40px rgba(244, 63, 94, 0.4)';
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
      const threshold = 80; // 고정 임계치 80px로 변경

      if (deltaX > threshold) {
        testCard.style.transform = \`translate(1000px, 0) rotate(15deg)\`;
        setTimeout(() => {
          document.getElementById('btn-correct').click();
          testCard.style.transform = '';
          testCard.style.boxShadow = '';
        }, 150);
      } else if (deltaX < -threshold) {
        testCard.style.transform = \`translate(-1000px, 0) rotate(-15deg)\`;
        setTimeout(() => {
          document.getElementById('btn-wrong').click();
          testCard.style.transform = '';
          testCard.style.boxShadow = '';
        }, 150);
      } else {
        testCard.style.transform = '';
        testCard.style.boxShadow = '';
      }
      swipeStartX = 0;
      swipeCurrentX = 0;
    });`;

const replacement = `    testCard.addEventListener('touchstart', (e) => {
      if (!isSwipeMode) return;
      if (e.target.closest('button')) return; // 버튼 터치 시 스와이프 무시
      isDragging = true;
      swipeStartX = e.touches[0].clientX;
      testCard.classList.add('dragging');
      // 사용자가 조작을 시작하면 5초 대기 타이머 해제
      if (typeof stopWordTimer === 'function') stopWordTimer();
    });

    testCard.addEventListener('touchmove', (e) => {
      if (!isSwipeMode || !isDragging) return;
      if (e.target.closest('button')) return; // 혹시라도 이동 중 버튼 위라면 무시
      swipeCurrentX = e.touches[0].clientX;
      const deltaX = swipeCurrentX - swipeStartX;
      const rotateDeg = deltaX * 0.05;
      testCard.style.transform = \`translate(\${deltaX}px, 0) rotate(\${rotateDeg}deg)\`;

      const stampO = document.getElementById('stamp-o');
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
        const stampO = document.getElementById('stamp-o');
        const stampX = document.getElementById('stamp-x');
        if (stampO) stampO.style.opacity = 0;
        if (stampX) stampX.style.opacity = 0;
      }

      if (deltaX > threshold) {
        testCard.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        testCard.style.transform = \`translate(100vw, 0) rotate(15deg)\`;
        testCard.style.opacity = '0';
        setTimeout(() => {
          document.getElementById('btn-correct').click();
          testCard.style.opacity = '1';
          resetCard();
        }, 200);
      } else if (deltaX < -threshold) {
        testCard.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        testCard.style.transform = \`translate(-100vw, 0) rotate(-15deg)\`;
        testCard.style.opacity = '0';
        setTimeout(() => {
          document.getElementById('btn-wrong').click();
          testCard.style.opacity = '1';
          resetCard();
        }, 200);
      } else {
        resetCard();
      }
      swipeStartX = 0;
      swipeCurrentX = 0;
    });`;

if (!content.includes(target)) {
  console.error("Target string not found in app.js");
  process.exit(1);
}

content = content.replace(target, replacement);

// Re-normalize to CRLF
content = content.replace(/\n/g, '\r\n');

fs.writeFileSync('app.js', content, 'utf8');
console.log('Successfully updated app.js');
