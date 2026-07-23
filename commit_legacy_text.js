const { execSync } = require('child_process');
execSync('git add style.css app.js sw.js', { stdio: 'inherit' });
execSync('git commit -m "style: revert text sizing and wrapping to user requested legacy logic"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
