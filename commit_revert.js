const { execSync } = require('child_process');
execSync('git commit -a -m "revert: rollback premium UI changes"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
