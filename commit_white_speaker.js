const { execSync } = require('child_process');
execSync('git add app.js style.css index.html sw.js', { stdio: 'inherit' });
execSync('git commit -m "fix: make speaker white and fix JS visibility toggle"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
