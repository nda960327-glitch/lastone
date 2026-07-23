const { execSync } = require('child_process');
execSync('git add style.css app.js sw.js', { stdio: 'inherit' });
execSync('git commit -m "style: apply container queries to break limits"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
