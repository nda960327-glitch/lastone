const dbs = require('./default_db_dump.js');
const fs = require('fs');

const wordsMap = new Map();

for (const [title, text] of Object.entries(dbs)) {
  const category = title.includes('토플') ? 'toefl' : 'basic';
  const lines = text.split('\n');
  for (let line of lines) {
    line = line.trim();
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

const wordsArray = Array.from(wordsMap.values());
const jsContent = 'const words = ' + JSON.stringify(wordsArray, null, 2) + ';\n';
fs.writeFileSync('wordData.js', jsContent, 'utf8');
console.log('Migrated ' + wordsArray.length + ' words to wordData.js');
