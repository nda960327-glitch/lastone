const { execSync } = require('child_process');
execSync('git add app.js index.html style.css sw.js', { stdio: 'inherit' });
execSync('git commit -m "fix(core): resolve 4 critical bugs (penalty reset, hint display, meaning visibility, dictation mode routing)"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
