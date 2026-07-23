const { execSync } = require('child_process');
execSync('git add sw.js', { stdio: 'inherit' });
execSync('git commit -m "fix: bump cache to v156 for TypeError fix"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
