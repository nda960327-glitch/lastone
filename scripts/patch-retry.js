const fs = require('fs');

function patchFile() {
  let js = fs.readFileSync('app.js', 'utf8');
  js = js.replace(/\r\n/g, '\n');

  // Change logic in showFinalResult
  
  // 1. Array filtering
  const filterStr = `  const hardWords2 = all.filter(w => w.attempts >= 2);
  const hardWords3 = all.filter(w => w.attempts >= 3);`;
  
  const filterReplace = `  const hardWords1 = all.filter(w => w.attempts >= 1);
  const hardWords2 = all.filter(w => w.attempts >= 2);`;
  
  js = js.replace(filterStr, filterReplace);

  // 2. Count updates
  const countStr = `  const elHard2 = document.getElementById('final-hard');
  if (elHard2) elHard2.textContent = hardWords2.length;
  const elHard3 = document.getElementById('final-hard-3');
  if (elHard3) elHard3.textContent = hardWords3.length;`;
  
  const countReplace = `  const elHard1 = document.getElementById('final-hard');
  if (elHard1) elHard1.textContent = hardWords1.length;
  const elHard2 = document.getElementById('final-hard-2');
  if (elHard2) elHard2.textContent = hardWords2.length;`;
  
  js = js.replace(countStr, countReplace);

  // 3. btnRetry2 logic (now for >= 1)
  const retry2Str = `  const btnRetry2 = document.getElementById('btn-retry-hard');
  if (btnRetry2) {
    if (hardWords2.length > 0) {
      btnRetry2.classList.remove('hidden');
      btnRetry2.innerHTML = \`🔁 2회↑ 오답 재시험 (\${hardWords2.length}개)\`;
      btnRetry2.onclick = () => {
        App.words    = hardWords2.map(w => ({ ...w, attempts: 0, passed: false }));`;
        
  const retry2Replace = `  const btnRetry1 = document.getElementById('btn-retry-hard');
  if (btnRetry1) {
    if (hardWords1.length > 0) {
      btnRetry1.classList.remove('hidden');
      btnRetry1.innerHTML = \`🔁 1회↑ 오답 재시험 (\${hardWords1.length}개)\`;
      btnRetry1.onclick = () => {
        App.words    = hardWords1.map(w => ({ ...w, attempts: 0, passed: false }));`;

  js = js.replace(retry2Str, retry2Replace);

  // 4. btnRetry3 logic (now for >= 2)
  const retry3Str = `  const btnRetry3 = document.getElementById('btn-retry-hard-3');
  if (btnRetry3) {
    if (hardWords3.length > 0) {
      btnRetry3.classList.remove('hidden');
      btnRetry3.innerHTML = \`🔥 3회↑ 오답 재시험 (\${hardWords3.length}개)\`;
      btnRetry3.onclick = () => {
        App.words    = hardWords3.map(w => ({ ...w, attempts: 0, passed: false }));`;
        
  const retry3Replace = `  const btnRetry2 = document.getElementById('btn-retry-hard-2');
  if (btnRetry2) {
    if (hardWords2.length > 0) {
      btnRetry2.classList.remove('hidden');
      btnRetry2.innerHTML = \`🔥 2회↑ 오답 재시험 (\${hardWords2.length}개)\`;
      btnRetry2.onclick = () => {
        App.words    = hardWords2.map(w => ({ ...w, attempts: 0, passed: false }));`;

  js = js.replace(retry3Str, retry3Replace);

  js = js.replace(/\n/g, '\r\n');
  fs.writeFileSync('app.js', js, 'utf8');
}

patchFile();
console.log('Patched final result retry buttons');
