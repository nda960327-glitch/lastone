const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');

// Find the second declaration of `const testCard` and remove the `const ` part.
// The code looks like this:
// const testCard = document.querySelector('.test-card');
// if (testCard) {
//   if (isDictationMode) testCard.classList.add('dictation-mode-active');
//   else testCard.classList.remove('dictation-mode-active');
// }
// if (isDictationMode) {

let lines = appJs.split('\n');
let replaced = false;

for (let i = 1450; i < 1500; i++) {
  if (lines[i] && lines[i].includes('const testCard = document.querySelector(\'.test-card\');')) {
    lines[i] = lines[i].replace('const testCard', 'testCard');
    replaced = true;
    break;
  }
}

if (replaced) {
  fs.writeFileSync('app.js', lines.join('\n'), 'utf8');
  console.log('Fixed syntax error by removing duplicate declaration.');
} else {
  console.log('Could not find the duplicate declaration to replace.');
}
