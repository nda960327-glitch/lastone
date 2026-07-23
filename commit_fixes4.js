const { execSync } = require('child_process');
execSync('git add app.js sw.js style.css', { stdio: 'inherit' });
execSync('git commit -m "fix: dictation abort state and add tab-btn borders"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
