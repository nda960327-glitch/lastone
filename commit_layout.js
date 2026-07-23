const { execSync } = require('child_process');
execSync('git add index.html style.css app.js sw.js', { stdio: 'inherit' });
execSync('git commit -m "style: move speaker button below text and change to pill shape"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
