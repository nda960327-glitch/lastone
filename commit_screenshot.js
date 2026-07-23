const { execSync } = require('child_process');
execSync('git add app.js style.css sw.js', { stdio: 'inherit' });
execSync('git commit -m "style: exact match user screenshot UI for blue mode with pastel OX buttons and pill shapes"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
