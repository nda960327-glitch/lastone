const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

appJs = appJs.replace(
  `testCard = document.querySelector('.test-card');
    if (testCard) {
      if (isDictationMode) testCard.classList.add('dictation-mode-active');
      else testCard.classList.remove('dictation-mode-active');
    }`,
  `if (testCard) {
      if (isDictationMode) testCard.classList.add('dictation-mode-active');
      else testCard.classList.remove('dictation-mode-active');
    }`
);

fs.writeFileSync('app.js', appJs, 'utf8');
console.log('Fixed TypeError in app.js');
