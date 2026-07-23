const { execSync } = require('child_process');
execSync('git add style.css sw.js', { stdio: 'inherit' });
execSync('git commit -m "style: enlarge dictation speaker icon, fix learning selection contrast, force OX text to white"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
