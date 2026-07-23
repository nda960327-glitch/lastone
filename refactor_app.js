const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// 1. Add currentCategory and getFilteredWords at the top
const newVars = `
let currentCategory = 'toefl';

function getFilteredWords() {
  if (typeof words === 'undefined') return []; // Fallback if wordData.js fails to load
  let filtered = words.filter(w => w.category === currentCategory);
  let failData = JSON.parse(localStorage.getItem('doacore_total_fails')) || {};
  return filtered.map((w, i) => {
    return {
      originalIndex: i,
      word: w.word,
      partOfSpeech: w.partOfSpeech,
      meaning: w.meaning,
      meanings: w.partOfSpeech.map(pos => ({ pos: pos, meaning: w.meaning })),
      passed: false,
      attempts: 0,
      totalFails: failData[w.word] || 0
    };
  });
}
`;

code = code.replace(/let isDictationMode = false;/, 'let isDictationMode = false;' + newVars);

// 2. Replace parseWords usages
code = code.replace(/function parseWords\(text\) \{[\s\S]*?return list;\r?\n\}/, 'function parseWords() { return getFilteredWords(); }');
code = code.replace(/const words = parseWords\(textarea\.value\);/g, 'const words = getFilteredWords();');
code = code.replace(/const rawWords = parseWords\(textarea\.value\);/g, 'const rawWords = getFilteredWords();');
code = code.replace(/const allWords = parseWords\(document\.getElementById\('word-input'\)\.value\);/g, 'const allWords = getFilteredWords();');
code = code.replace(/parseWords\(textarea\.value\)/g, 'getFilteredWords()');

// 3. Inject tab switching logic into initInputView
const updateCountInjection = `
  const tabToefl = document.getElementById('tab-toefl');
  const tabBasic = document.getElementById('tab-basic');
  if (tabToefl && tabBasic) {
    tabToefl.addEventListener('click', () => {
      currentCategory = 'toefl';
      tabToefl.classList.add('active');
      tabBasic.classList.remove('active');
      App.currentDBName = 'toefl';
      updateCount();
    });
    tabBasic.addEventListener('click', () => {
      currentCategory = 'basic';
      tabBasic.classList.add('active');
      tabToefl.classList.remove('active');
      App.currentDBName = 'basic';
      updateCount();
    });
  }
  App.currentDBName = currentCategory;
  updateCount();
`;

code = code.replace(/textarea\.addEventListener\('input', updateCount\);/, updateCountInjection);

// 4. Update the test meanings logic to use the new HTML format if possible, but our fallback mapping works.
// Actually, let's update meaningHTML to use partOfSpeech and meaning directly for a cleaner UI if present.
const newMeaningHTML = `
function meaningHTML(meanings, wordObj) {
  if (wordObj && wordObj.partOfSpeech && wordObj.meaning) {
    const posBadges = wordObj.partOfSpeech.map(p => \`<span class="pos-badge \${p}">[\${p}]</span>\`).join('');
    return \`<div class="meaning-card \${wordObj.partOfSpeech[0]}">\${posBadges}<span class="meaning-text">\${wordObj.meaning}</span></div>\`;
  }
  return meanings.map(m => \`
    <div class="meaning-card \${getPosClass(m.pos)}">
      <span class="pos-badge \${getPosClass(m.pos)}">[\${esc(m.pos)}]</span>
      <span class="meaning-text">\${esc(m.meaning)}</span>
    </div>
  \`).join('');
}
`;

code = code.replace(/function meaningHTML\(meanings\) \{[\s\S]*?\}\r?\n/, newMeaningHTML);

// Fix meaningHTML calls to pass wordObj
code = code.replace(/meaningHTML\(wordObj\.meanings\)/g, 'meaningHTML(wordObj.meanings, wordObj)');

// 5. Disable loadDBList and refreshDBList since we no longer use dropdowns
code = code.replace(/function loadDBList\(textarea\) \{[\s\S]*?function refreshDBList\(textarea\) \{[\s\S]*?\}\r?\n\r?\n\s+\/\/\/+/g, 'function loadDBList() {}\nfunction refreshDBList() {}\n//');

fs.writeFileSync('app.js', code, 'utf8');
console.log('App logic updated.');
