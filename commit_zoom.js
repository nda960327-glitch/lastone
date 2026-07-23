const { execSync } = require('child_process');
execSync('git add index.html style.css', { stdio: 'inherit' });
execSync('git commit -m "fix: prevent overflow zoom out and allow test-word wrapping"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
