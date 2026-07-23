const { execSync } = require('child_process');
execSync('git add app.js index.html style.css sw.js', { stdio: 'inherit' });
execSync('git commit -m "fix: logo filter for all themes, pos text size, and button color in dark theme"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
