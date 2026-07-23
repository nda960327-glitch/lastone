const { execSync } = require('child_process');
execSync('git add app.js sw.js', { stdio: 'inherit' });
execSync('git commit -m "style: massively increase text size ratio again"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
