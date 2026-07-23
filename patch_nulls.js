const fs = require('fs');

let code = fs.readFileSync('app.js', 'utf8');

const variables = [
  'btn', 'btnAllNew', 'btnReviewAllMid', 'btnFinal', 'btnToggleAdd', 
  'btnShowGuide', 'btnUploadDirect', 'deleteBtn', 'btnReveal', 'btnSpeak', 
  'btnPrev', 'submitBtn', 'btnNext', 'btnInstall', 'btnInstallPwa', 
  'btnClose', 'btnShowInfo', 'btnInfoClose', 'btnInfoOk', 'btnShowDev', 
  'btnDevClose', 'btnDevOk'
];

for (const v of variables) {
  const regex = new RegExp('(^|\\n)(\\s*)(' + v + '\\.onclick\\s*=)', 'g');
  code = code.replace(regex, function(match, n, space, expr) {
    return n + space + 'if (' + v + ') ' + expr;
  });
}

code = code.replace(/(document\.getElementById\('([^']+)'\))\.onclick\s*=/g, function(match, getEl, id) {
  return 'if (' + getEl + ') ' + getEl + '.onclick =';
});

code = code.replace(/(document\.getElementById\('([^']+)'\))\.addEventListener/g, function(match, getEl, id) {
  return 'if (' + getEl + ') ' + getEl + '.addEventListener';
});

fs.writeFileSync('app.js', code, 'utf8');
console.log('Patched app.js to prevent null pointer exceptions.');
