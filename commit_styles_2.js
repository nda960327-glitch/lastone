const { execSync } = require('child_process');
execSync('git add app.js style.css index.html sw.js', { stdio: 'inherit' });
execSync('git commit -m "style: fix dropdown colors, dictation btn, and manual modal"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
