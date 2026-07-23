const fs = require('fs');

// 1. Load existing words
let content = fs.readFileSync('wordData.js', 'utf8');
content = content.replace('const words =', 'module.exports =');
fs.writeFileSync('temp_wordData.js', content, 'utf8');
const existingWords = require('./temp_wordData.js');

const wordsMap = new Map();
existingWords.forEach(w => wordsMap.set(w.word, w));

function parseFile(filename, category) {
  const text = fs.readFileSync(filename, 'utf8');
  const lines = text.split('\n');
  for (let line of lines) {
    line = line.replace(/`/g, '').trim(); // Remove backticks and trim
    if (!line) continue;
    
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
      // Optionally overwrite category if requested, but let's keep it or update if it matches
    } else {
      wordsMap.set(word, {
        word,
        partOfSpeech: posList,
        meaning: meaningList.join(', '),
        totalFails: 0,
        category
      });
    }
  }
}

parseFile('토플_영단어_day2-13_day.txt', 'toefl');
parseFile('기초영단어_day5-15_day.txt', 'basic');

const finalWords = Array.from(wordsMap.values());
const jsContent = 'const words = ' + JSON.stringify(finalWords, null, 2) + ';\n';
fs.writeFileSync('wordData.js', jsContent, 'utf8');

fs.unlinkSync('temp_wordData.js');

console.log('Successfully updated wordData.js. Total words:', finalWords.length);
