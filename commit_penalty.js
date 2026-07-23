const { execSync } = require('child_process');
execSync('git add app.js style.css sw.js', { stdio: 'inherit' });
execSync('git commit -m "feat(core): dynamic timer based on meaning count and penalty UI logic"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
