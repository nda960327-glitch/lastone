const { execSync } = require('child_process');
execSync('git add style.css app.js sw.js', { stdio: 'inherit' });
execSync('git commit -m "style: ultimate font scaling logic with strict no-wrap"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
