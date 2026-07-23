const { execSync } = require('child_process');
execSync('git add index.html style.css app.js sw.js', { stdio: 'inherit' });
execSync('git commit -m "style: remove speaker completely and maximize text space"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
