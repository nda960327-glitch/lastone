const fs = require('fs');

const wordsMap = new Map();

function parseFile(filename, category) {
  const text = fs.readFileSync(filename, 'utf8');
  const lines = text.split('\n');
  let currentDay = 1;
  
  for (let line of lines) {
    line = line.replace(/`/g, '').trim();
    if (!line) continue;
    
    // Check for day title like "토플 영단어 day2" or "기초영단어 day5"
    // Also handling uppercase DAY or space variations
    const dayMatch = line.match(/day\s*(\d+)/i);
    if (dayMatch) {
      currentDay = parseInt(dayMatch[1], 10);
      // Skip if it doesn't look like a word definition
      if (!line.includes('[')) continue;
    }
    
    // Parse format: word [pos] meaning [pos] meaning
    const parts = line.split(/(\[[a-zA-Z가-힣R]+\])/);
    if (parts.length < 3) continue;
    
    const word = parts[0].trim();
    
    const posList = [];
    const meaningList = [];
    
    for (let i = 1; i < parts.length; i += 2) {
      const rawPos = parts[i];
      const rawMeaning = parts[i + 1];
      if (!rawPos || !rawMeaning) continue;
      
      const pos = rawPos.replace('[', '').replace(']', '').trim();
      let meaning = rawMeaning.trim();
      if (meaning.startsWith('/')) meaning = meaning.substring(1).trim();
      if (meaning.endsWith('/')) meaning = meaning.slice(0, -1).trim();
      
      if (!posList.includes(pos)) posList.push(pos);
      meaningList.push(meaning);
    }
    
    if (wordsMap.has(word)) {
      const existing = wordsMap.get(word);
      posList.forEach(p => { if(!existing.partOfSpeech.includes(p)) existing.partOfSpeech.push(p); });
      meaningList.forEach(m => {
        if (!existing.meaning.includes(m)) existing.meaning += ', ' + m;
      });
      existing.day = currentDay; // update to latest day found
    } else {
      wordsMap.set(word, {
        word,
        partOfSpeech: posList,
        meaning: meaningList.join(', '),
        totalFails: 0,
        category,
        day: currentDay
      });
    }
  }
}

// Since we want to re-parse from scratch and keep only these, wait, do we keep DEFAULT_DATABASES dump?
// The user says "텍스트에 분명히 'day2', 'day3'라고 적혀있는데 왜 그걸 다 무시하고 한 덩어리로 합쳐버려?"
// This implies they just want me to parse the texts with the day attribute.
// Let's re-parse the default dump as well, assuming it has "day" info, but it doesn't.
// Wait, the prompt implies "네가 파싱 코드를 엉망으로 짜서...". I will just re-run the script that processes the two new files, but wait, the two new files are `토플영단어2~13day.txt` and `기초영단어5~15.txt`. What about day1?
// I will parse `default_db_dump.js` first, setting day 1-4 for basic and day 1 for toefl based on titles, then parse the new files.

const dbs = require('./default_db_dump.js');
for (const [title, text] of Object.entries(dbs)) {
  const category = title.includes('토플') ? 'toefl' : 'basic';
  const lines = text.split('\n');
  
  let currentDay = 1;
  const match = title.match(/Day\s*(\d+)/i);
  if (match) currentDay = parseInt(match[1], 10);
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    const parts = line.split(/(\[[a-zA-Z가-힣R]+\])/);
    if (parts.length < 3) continue;
    const word = parts[0].trim();
    const posList = [];
    const meaningList = [];
    for (let i = 1; i < parts.length; i += 2) {
      const rawPos = parts[i];
      const rawMeaning = parts[i + 1];
      if (!rawPos || !rawMeaning) continue;
      const pos = rawPos.replace('[', '').replace(']', '').trim();
      let meaning = rawMeaning.trim();
      if (meaning.startsWith('/')) meaning = meaning.substring(1).trim();
      if (meaning.endsWith('/')) meaning = meaning.slice(0, -1).trim();
      if (!posList.includes(pos)) posList.push(pos);
      meaningList.push(meaning);
    }
    if (wordsMap.has(word)) {
      const existing = wordsMap.get(word);
      posList.forEach(p => { if(!existing.partOfSpeech.includes(p)) existing.partOfSpeech.push(p); });
      meaningList.forEach(m => {
        if (!existing.meaning.includes(m)) existing.meaning += ', ' + m;
      });
    } else {
      wordsMap.set(word, {
        word,
        partOfSpeech: posList,
        meaning: meaningList.join(', '),
        totalFails: 0,
        category,
        day: currentDay
      });
    }
  }
}

parseFile('토플_영단어_day2-13_day.txt', 'toefl');
parseFile('기초영단어_day5-15_day.txt', 'basic');

// Sort the words array first by category, then by day, then keep original order
// But actually Map iteration order keeps insertion order.
// Let's explicitly sort:
let finalWords = Array.from(wordsMap.values());
// User: "이걸 기준으로 200개씩 잘라서 순서가 뒤죽박죽 섞이지 않게 원본 배열 순서를 유지해"
// Map iteration order is insertion order, so the order will naturally follow day 1, day 2, day 3...
// We'll just sort by category and then by day to be absolutely sure.
finalWords.sort((a, b) => {
  if (a.category !== b.category) return a.category.localeCompare(b.category);
  return a.day - b.day;
});

const jsContent = 'const words = ' + JSON.stringify(finalWords, null, 2) + ';\n';
fs.writeFileSync('wordData.js', jsContent, 'utf8');
console.log('Successfully updated wordData.js with day data. Total words:', finalWords.length);
