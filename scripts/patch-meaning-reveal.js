const fs = require('fs');

function patchFile() {
  let js = fs.readFileSync('app.js', 'utf8');
  js = js.replace(/\r\n/g, '\n');

  const targetStr = `    if (isDictationMode) {
      document.getElementById('test-word').classList.add('hidden');
      document.querySelector('.ox-buttons').classList.add('hidden');
      document.getElementById('reveal-zone').classList.add('hidden');
      
      document.getElementById('answer-zone').classList.remove('hidden');
      document.getElementById('test-meanings').innerHTML = meaningHTML(wordObj.meanings);
      
      document.getElementById('dictation-zone').classList.remove('hidden');
      
      const btnReplay = document.getElementById('btn-replay-audio');
      if (btnReplay) btnReplay.onclick = () => speak(wordObj.word);
    } else {`;

  const replaceStr = `    if (isDictationMode) {
      document.getElementById('test-word').classList.add('hidden');
      document.querySelector('.ox-buttons').classList.add('hidden');
      
      // 뜻 숨김 상태로 시작
      document.getElementById('reveal-zone').classList.remove('hidden');
      document.getElementById('answer-zone').classList.add('hidden');
      document.getElementById('test-meanings').innerHTML = meaningHTML(wordObj.meanings);
      
      document.getElementById('dictation-zone').classList.remove('hidden');
      
      // 뜻 확인하기 클릭 시 뜻 노출
      const btnReveal = document.getElementById('btn-reveal');
      if (btnReveal) {
        btnReveal.onclick = () => {
          document.getElementById('reveal-zone').classList.add('hidden');
          document.getElementById('answer-zone').classList.remove('hidden');
        };
      }
    } else {`;

  js = js.replace(targetStr, replaceStr);
  js = js.replace(/\n/g, '\r\n');
  fs.writeFileSync('app.js', js, 'utf8');
}

patchFile();
console.log('Patched meaning reveal logic');
