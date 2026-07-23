const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

appJs = appJs.replace(/\r\n/g, '\n');

// 1. Settings logic
const target1 = "document.addEventListener('DOMContentLoaded', () => {";
const replace1 = `document.addEventListener('DOMContentLoaded', () => {
  const btnSettings = document.getElementById('btn-settings');
  const settingsDropdown = document.getElementById('settings-dropdown');
  if (btnSettings && settingsDropdown) {
    btnSettings.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsDropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
      if (!settingsDropdown.contains(e.target) && e.target !== btnSettings) {
        settingsDropdown.classList.add('hidden');
      }
    });
  }`;
appJs = appJs.replace(target1, replace1);

// 2. Nudge on first card
const target2 = `      if (isSwipeMode) {
        document.getElementById('ox-buttons-container').classList.add('hidden');
        document.getElementById('ox-buttons-container').style.display = 'none';
      }`;
const replace2 = `      if (isSwipeMode) {
        document.getElementById('ox-buttons-container').classList.add('hidden');
        document.getElementById('ox-buttons-container').style.display = 'none';
        
        const tc = document.getElementById('test-card-el');
        if (i === 0 && tc) {
          tc.classList.add('nudge-anim');
          setTimeout(() => { tc.classList.remove('nudge-anim'); }, 600);
        }
      }`;
appJs = appJs.replace(target2, replace2);

// 3. Hint visibility
const target3 = `    if (!isDictationMode) {
      document.getElementById('btn-reveal').classList.remove('hidden');`;
const replace3 = `    if (!isDictationMode) {
      document.getElementById('btn-reveal').classList.remove('hidden');
      
      const swipeHint = document.getElementById('swipe-hint');
      if (swipeHint) {
        if (isSwipeMode) swipeHint.classList.remove('hidden');
        else swipeHint.classList.add('hidden');
      }`;
appJs = appJs.replace(target3, replace3);

appJs = appJs.replace(/\n/g, '\r\n');
fs.writeFileSync('app.js', appJs, 'utf8');
console.log('Successfully updated app.js with settings and nudge logic.');
