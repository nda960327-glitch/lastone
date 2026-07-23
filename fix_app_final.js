const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');
appJs = appJs.replace(/\r\n/g, '\n');

// 1. Append Settings Toggle Logic
appJs += `

// Settings Button Toggle Logic
(function() {
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
  }
})();
`;

// 2. Add Nudge Animation to first card right after word textContent is set
const targetNudge = `    if (wrapper && !isDictationMode) {
      wrapper.classList.remove('hidden');
    }
    const testWordEl = document.getElementById('test-word');`;
    
const replaceNudge = `    if (wrapper && !isDictationMode) {
      wrapper.classList.remove('hidden');
    }
    
    // Nudge animation on first card after headset finishes
    if (isSwipeMode && i === 0 && !isAlreadyGraded) {
      const tc = document.getElementById('test-card-el');
      if (tc) {
        tc.classList.add('nudge-anim');
        setTimeout(() => { tc.classList.remove('nudge-anim'); }, 600);
      }
    }
    
    const testWordEl = document.getElementById('test-word');`;
appJs = appJs.replace(targetNudge, replaceNudge);

appJs = appJs.replace(/\n/g, '\r\n');
fs.writeFileSync('app.js', appJs, 'utf8');
console.log('Successfully updated app.js (final fix).');
