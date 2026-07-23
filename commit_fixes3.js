const { execSync } = require('child_process');
execSync('git add app.js sw.js', { stdio: 'inherit' });
execSync('git commit -m "fix: definitively fix O button locking out, and hide pos-hint when meanings are revealed"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
