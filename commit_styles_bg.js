const { execSync } = require('child_process');
execSync('git add style.css sw.js', { stdio: 'inherit' });
execSync('git commit -m "fix: darken background and restore gradient button"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
