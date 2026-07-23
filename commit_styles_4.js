const { execSync } = require('child_process');
execSync('git add app.js', { stdio: 'inherit' });
execSync('git commit -m "fix: resolve duplicate const declaration syntax error in app.js"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
