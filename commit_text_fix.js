const { execSync } = require('child_process');
execSync('git add index.html style.css app.js sw.js', { stdio: 'inherit' });
execSync('git commit -m "style: force single line text and massively increase dynamic font size algorithm"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
