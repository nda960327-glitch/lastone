const fs = require('fs');

let code = fs.readFileSync('app.js', 'utf8');

// 1. Add currentDay
if (!code.includes('let currentDay = null;')) {
  code = code.replace(/let currentCategory = 'toefl';/, "let currentCategory = 'toefl';\nlet currentDay = null;");
}

// 2. Add populateDaySelector
const populateDaySelectorCode = `
function populateDaySelector() {
  const daySelector = document.getElementById('day-selector');
  if (!daySelector) return;
  if (typeof words === 'undefined') return;
  
  const days = new Set();
  words.forEach(w => {
    if (w.category === currentCategory && w.day != null) {
      days.add(w.day);
    }
  });
  
  daySelector.innerHTML = '';
  const sortedDays = Array.from(days).sort((a, b) => a - b);
  
  if (sortedDays.length === 0) {
    daySelector.innerHTML = '<option value="">Day 없음</option>';
    currentDay = null;
    return;
  }
  
  sortedDays.forEach(day => {
    const opt = document.createElement('option');
    opt.value = day;
    opt.textContent = \`Day \${day}\`;
    opt.style.background = '#1e1b4b';
    opt.style.color = '#fff';
    daySelector.appendChild(opt);
  });
  
  currentDay = sortedDays[0];
  daySelector.value = currentDay;
}
`;

if (!code.includes('function populateDaySelector()')) {
  code = code.replace(/function getFilteredWords\(\) \{/, populateDaySelectorCode + '\nfunction getFilteredWords() {');
}

// 3. Update getFilteredWords to use currentDay
code = code.replace(/let filtered = words\.filter\(w => w\.category === currentCategory\);/, 
  "let filtered = words.filter(w => w.category === currentCategory && (currentDay === null || w.day === currentDay));");

// 4. Update initInputView
const newTabLogic = `const tabToefl = document.getElementById('tab-toefl');
  const tabBasic = document.getElementById('tab-basic');
  const daySelector = document.getElementById('day-selector');
  
  function updateDictationBtnText() {
    const dictText = document.getElementById('dictation-btn-text');
    if (dictText && currentDay !== null) {
      const catName = currentCategory === 'toefl' ? '토플 영단어' : '기초 영단어';
      dictText.textContent = \`🎧 [\${catName} \${currentDay} Day] 전체 스펠링 듣고 쓰기\`;
    }
  }

  // Bind day selector change
  if (daySelector) {
    daySelector.addEventListener('change', (e) => {
      currentDay = parseInt(e.target.value, 10);
      App.currentDBName = \`\${currentCategory}_day\${currentDay}\`;
      updateDictationBtnText();
      updateCount();
    });
  }

  if (tabToefl && tabBasic) {
    tabToefl.addEventListener('click', () => {
      currentCategory = 'toefl';
      tabToefl.classList.add('active');
      tabBasic.classList.remove('active');
      populateDaySelector();
      App.currentDBName = \`\${currentCategory}_day\${currentDay}\`;
      updateDictationBtnText();
      updateCount();
    });
    tabBasic.addEventListener('click', () => {
      currentCategory = 'basic';
      tabBasic.classList.add('active');
      tabToefl.classList.remove('active');
      populateDaySelector();
      App.currentDBName = \`\${currentCategory}_day\${currentDay}\`;
      updateDictationBtnText();
      updateCount();
    });
  }
  
  // Initial population
  populateDaySelector();
  App.currentDBName = \`\${currentCategory}_day\${currentDay}\`;
  updateDictationBtnText();
  updateCount();`;

code = code.replace(/const tabToefl = document\.getElementById\('tab-toefl'\);[\s\S]*?App\.currentDBName = currentCategory;\s*updateCount\(\);/, newTabLogic);

fs.writeFileSync('app.js', code, 'utf8');
console.log('Patched app.js for Day filtering');
