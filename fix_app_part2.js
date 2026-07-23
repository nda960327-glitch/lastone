const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

const targetReveal = "    document.getElementById('btn-reveal').classList.remove('hidden');";
const replaceReveal = `    document.getElementById('btn-reveal').classList.remove('hidden');
    
    const swipeHint = document.getElementById('swipe-hint');
    if (swipeHint) {
      if (isSwipeMode) swipeHint.classList.remove('hidden');
      else swipeHint.classList.add('hidden');
    }`;
appJs = appJs.replace(targetReveal, replaceReveal);

const targetHideOX = `      if (isSwipeMode) {
        document.getElementById('ox-buttons-container').classList.add('hidden');
        document.getElementById('ox-buttons-container').style.display = 'none';
      }`;
const replaceHideOX = `      if (isSwipeMode) {
        document.getElementById('ox-buttons-container').classList.add('hidden');
        document.getElementById('ox-buttons-container').style.display = 'none';
        
        const tc = document.getElementById('test-card-el');
        if (i === 0 && tc) {
          tc.classList.add('nudge-anim');
          setTimeout(() => { tc.classList.remove('nudge-anim'); }, 600);
        }
      }`;
appJs = appJs.replace(targetHideOX, replaceHideOX);

fs.writeFileSync('app.js', appJs, 'utf8');
console.log('Successfully updated app.js (part 2).');
