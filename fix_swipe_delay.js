const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

// Normalize to \n
appJs = appJs.replace(/\r\n/g, '\n');

const targetLogic = `      if (deltaX > threshold) {
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
      }`;

const replaceLogic = `      if (deltaX > threshold) {
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
      }`;

appJs = appJs.replace(targetLogic, replaceLogic);

// Restore CRLF for windows git 
appJs = appJs.replace(/\n/g, '\r\n');
fs.writeFileSync('app.js', appJs, 'utf8');
console.log('Successfully updated app.js for vibration and delay.');
