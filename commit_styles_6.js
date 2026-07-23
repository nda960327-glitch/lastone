const { execSync } = require('child_process');
execSync('git add app.js', { stdio: 'inherit' });
execSync('git commit -m "fix: remove TypeError caused by reassigning const testCard"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
