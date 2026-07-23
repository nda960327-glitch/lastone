const { execSync } = require('child_process');
execSync('git add index.html', { stdio: 'inherit' });
execSync('git commit -m "fix(ui): separate pos hint and action area in index.html"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
