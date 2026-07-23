const { execSync } = require('child_process');
execSync('git add app.js sw.js', { stdio: 'inherit' });
execSync('git commit -m "fix(ui): implement setTimeout for timer bar reset to fix intermittent disappearance"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
