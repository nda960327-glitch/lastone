const fs = require('fs');

let js = fs.readFileSync('app.js', 'utf8');

const oldSetOX = `function setOXDisabled(disabled) {
  document.getElementById('btn-correct').disabled = disabled;
  document.getElementById('btn-wrong').disabled   = disabled;
}`;

const newSetOX = `function setOXDisabled(disabled) {
  const btnCorrect = document.getElementById('btn-correct');
  const btnWrong = document.getElementById('btn-wrong');
  if (btnCorrect) {
    btnCorrect.disabled = disabled;
    if (!disabled) {
      btnCorrect.style.opacity = '1';
      btnCorrect.style.pointerEvents = 'auto';
    }
  }
  if (btnWrong) {
    btnWrong.disabled = disabled;
  }
}`;

if (js.includes('function setOXDisabled')) {
  js = js.replace(oldSetOX, newSetOX);
  fs.writeFileSync('app.js', js, 'utf8');
  console.log('setOXDisabled updated');
} else {
  console.log('setOXDisabled not found');
}
