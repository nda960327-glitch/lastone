const fs = require('fs');

const basicLines = fs.readFileSync('기초영단어 day1~15day.txt', 'utf8').split('\n');
const toeflLines = fs.readFileSync('토플영단어day1~13day.txt', 'utf8').split('\n');

const words = [];
let currentCategory = '';
let currentDay = -1;

function processLine(line) {
  line = line.replace(/\r/g, '').trim();
  if (!line) return;

  const basicMatch = line.match(/기초\s*영단어\s*day\s*(\d+)/i);
  if (basicMatch) {
    currentCategory = 'basic';
    currentDay = parseInt(basicMatch[1], 10);
    return;
  }

  const toeflMatch = line.match(/토플\s*영단어\s*day\s*(\d+)/i);
  if (toeflMatch) {
    currentCategory = 'toefl';
    currentDay = parseInt(toeflMatch[1], 10);
    return;
  }

  // 보다 유연한 정규식: 단어 [품사] 뜻
  const wordMatch = line.match(/^(.+?)\s*\[([^\]]+)\]\s*(.+)$/);
  if (wordMatch && currentCategory && currentDay > 0) {
    words.push({
      word: wordMatch[1].trim(),
      partOfSpeech: wordMatch[2].split(',').map(s => s.trim()),
      meaning: wordMatch[3].trim(),
      totalFails: 0,
      category: currentCategory,
      day: currentDay
    });
  }
}

basicLines.forEach(processLine);
currentCategory = '';
currentDay = -1;
toeflLines.forEach(processLine);

let out = 'let _staticWords = ' + JSON.stringify(words, null, 2) + ';\n';
out += 'let _customWords = [];\n';
out += 'try { _customWords = JSON.parse(localStorage.getItem("doacore_custom_words") || "[]"); } catch(e) {}\n';
out += 'const words = _staticWords.concat(_customWords);\n\n';

out += `(function verifyCounts() {
  const counts = { basic: {}, toefl: {} };
  words.forEach(w => {
    if (!counts[w.category]) counts[w.category] = {};
    counts[w.category][w.day] = (counts[w.category][w.day] || 0) + 1;
  });

  const expectedBasic = { 1:200, 2:200, 3:200, 4:200, 5:200, 6:200, 7:200, 8:200, 9:200, 10:200, 11:200, 12:200, 13:200, 14:200, 15:156 };
  const expectedToefl = { 1:200, 2:200, 3:200, 4:200, 5:200, 6:200, 7:200, 8:200, 9:200, 10:200, 11:200, 12:200, 13:246 };

  let errorMsgs = [];
  Object.keys(expectedBasic).forEach(day => {
    const d = parseInt(day);
    if (counts['basic'][d] !== expectedBasic[d]) {
      errorMsgs.push('[기초 영단어] Day ' + d + ' 개수 불일치: 예상 ' + expectedBasic[d] + ', 실제 ' + (counts['basic'][d]||0));
    }
  });
  Object.keys(expectedToefl).forEach(day => {
    const d = parseInt(day);
    if (counts['toefl'][d] !== expectedToefl[d]) {
      errorMsgs.push('[토플 영단어] Day ' + d + ' 개수 불일치: 예상 ' + expectedToefl[d] + ', 실제 ' + (counts['toefl'][d]||0));
    }
  });

  if (errorMsgs.length > 0) {
    console.warn("⚠️ 데이터 무결성 검증 실패 (단어 누락/순서 꼬임):\\n" + errorMsgs.join('\\n'));
  } else {
    console.log("✅ 모든 단어 파싱 검증 완료! (개수 및 순서 정상)");
  }
})();
`;

fs.writeFileSync('wordData.js', out, 'utf8');
console.log('wordData.js generated successfully with ' + words.length + ' words.');
