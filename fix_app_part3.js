const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

const targetNudge = `    // 헤드셋(프라이밍) 단계가 끝나고 스펠링 공개될 때 타이머 노출
    if (wrapper && !isDictationMode) {
      wrapper.classList.remove('hidden');
    }`;
const replaceNudge = `    // 헤드셋(프라이밍) 단계가 끝나고 스펠링 공개될 때 타이머 노출
    if (wrapper && !isDictationMode) {
      wrapper.classList.remove('hidden');
    }
    
    // Nudge animation on first card after headset finishes
    if (isSwipeMode && i === 0 && !isAlreadyGraded) {
      const tc = document.getElementById('test-card-el');
      if (tc) {
        tc.classList.add('nudge-anim');
        setTimeout(() => { tc.classList.remove('nudge-anim'); }, 600);
      }
    }`;
appJs = appJs.replace(targetNudge, replaceNudge);

fs.writeFileSync('app.js', appJs, 'utf8');
console.log('Successfully updated app.js (part 3).');
