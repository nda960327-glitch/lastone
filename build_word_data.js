const fs = require('fs');

let basicRaw = fs.readFileSync('기초영단어 day1~15day.txt', 'utf8');
let toeflRaw = fs.readFileSync('토플영단어day1~13day.txt', 'utf8');

// 1. 혹시 모를 줄바꿈 찌꺼기 복구 (정규식 전처리)
// 만약 'word \n [pos]' 형태로 끊어졌을 경우를 대비 (유저 요청 반영)
basicRaw = basicRaw.replace(/\n\s*\[\s*/g, " [");
toeflRaw = toeflRaw.replace(/\n\s*\[\s*/g, " [");

const basicLines = basicRaw.split('\n');
const toeflLines = toeflRaw.split('\n');

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

  // 단어가 word [pos] meaning 형태일 때
  const wordMatch = line.match(/^(.+?)\s*\[([^\]]+)\]\s*(.+)$/);
  if (wordMatch && currentCategory && currentDay > 0) {
    const rawWord = wordMatch[1].trim();
    const rawPos = wordMatch[2].split(',').map(s => s.trim());
    const rawMeaning = wordMatch[3].trim();

    // 이전 단어와 같으면 병합 처리
    const lastWord = words.length > 0 ? words[words.length - 1] : null;
    if (lastWord && lastWord.word === rawWord && lastWord.category === currentCategory && lastWord.day === currentDay) {
      lastWord.partOfSpeech.push(...rawPos);
      lastWord.meaning += ` / ${rawMeaning}`;
    } else {
      words.push({
        word: rawWord,
        partOfSpeech: rawPos,
        meaning: rawMeaning,
        totalFails: 0,
        category: currentCategory,
        day: currentDay
      });
    }
  }
}

basicLines.forEach(processLine);
currentCategory = '';
currentDay = -1;
toeflLines.forEach(processLine);

// 데이터 무결성 검증 (Data Integrity Check)
const counts = { basic: {}, toefl: {} };
words.forEach(w => {
  if (!counts[w.category]) counts[w.category] = {};
  counts[w.category][w.day] = (counts[w.category][w.day] || 0) + 1;
});

console.log("========== [데이터 파싱 검증 결과] ==========");
const expectedBasic = { 1:200, 2:200, 3:200, 4:200, 5:200, 6:200, 7:200, 8:200, 9:200, 10:200, 11:200, 12:200, 13:200, 14:200, 15:156 };
const expectedToefl = { 1:200, 2:200, 3:200, 4:200, 5:200, 6:200, 7:200, 8:200, 9:200, 10:200, 11:200, 12:200, 13:246 };

let allPassed = true;
console.log(">> 기초영단어");
for (let d = 1; d <= 15; d++) {
  const cnt = counts.basic[d] || 0;
  const exp = expectedBasic[d];
  if (cnt === exp) {
    console.log(`   Day ${d}: ${cnt}개 (O)`);
  } else {
    console.error(`   Day ${d}: ${cnt}개 (X) - 예상 ${exp}개`);
    allPassed = false;
  }
}

console.log("\n>> 토플영단어");
for (let d = 1; d <= 13; d++) {
  const cnt = counts.toefl[d] || 0;
  const exp = expectedToefl[d];
  if (cnt === exp) {
    console.log(`   Day ${d}: ${cnt}개 (O)`);
  } else {
    console.error(`   Day ${d}: ${cnt}개 (X) - 예상 ${exp}개`);
    allPassed = false;
  }
}

if (!allPassed) {
  console.error("\n[경고] 일부 Day의 단어 개수가 일치하지 않습니다. 정규식이나 원본 파일을 확인하세요.");
} else {
  console.log("\n[성공] 모든 Day의 단어 개수가 정확히 일치합니다!");
}
console.log("=============================================\n");

let out = 'let _staticWords = ' + JSON.stringify(words, null, 2) + ';\n';
out += 'let _customWords = [];\n';
out += 'try { _customWords = JSON.parse(localStorage.getItem("doacore_custom_words") || "[]"); } catch(e) {}\n';
out += 'const words = _staticWords.concat(_customWords);\n';

fs.writeFileSync('wordData.js', out, 'utf8');
console.log('wordData.js generated successfully with ' + words.length + ' base words.');