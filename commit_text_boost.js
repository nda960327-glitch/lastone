const { execSync } = require('child_process');
execSync('git add style.css sw.js', { stdio: 'inherit' });
execSync('git commit -m "style: remove duplicate CSS and increase short word font size to 18vw"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
