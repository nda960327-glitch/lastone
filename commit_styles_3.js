const { execSync } = require('child_process');
execSync('git add app.js style.css sw.js', { stdio: 'inherit' });
execSync('git commit -m "style: fix speaker sizes, center buttons, adjust background colors"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
