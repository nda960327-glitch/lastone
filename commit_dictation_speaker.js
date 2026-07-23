const { execSync } = require('child_process');
execSync('git add index.html style.css app.js sw.js', { stdio: 'inherit' });
execSync('git commit -m "feat: add huge speaker button to dictation mode only"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
