const fs = require('fs');
let js = fs.readFileSync('app.js', 'utf8');

const regex = /if \(document\.getElementById\('btn-dictation'\)\) document\.getElementById\('btn-dictation'\)\.onclick = \(\) => \{\s*const textarea = document\.getElementById\('word-input'\);\s*const words = getFilteredWords\(\);\s*if \(words\.length === 0\) \{\s*alert\('단어장을 선택해주세요\.'\);\s*return;\s*\}\s*App\.currentSection = 'dictation';/g;

const replacement = `if (document.getElementById('btn-dictation')) document.getElementById('btn-dictation').onclick = () => {
    const textarea = document.getElementById('word-input');
    const words = getFilteredWords();
    if (words.length === 0) {
      alert('단어장을 선택해주세요.');
      return;
    }
    App.studyAbort = false;
    App.isOButtonLocked = false;
    App.isPenaltyTime = false;
    App.currentSection = 'dictation';`;

js = js.replace(regex, replacement);

fs.writeFileSync('app.js', js, 'utf8');
console.log('Fixed btn-dictation in app.js.');
