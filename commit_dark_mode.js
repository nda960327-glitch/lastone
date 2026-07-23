const { execSync } = require('child_process');
execSync('git add style.css sw.js', { stdio: 'inherit' });
execSync('git commit -m "style: restore dark mode default colors and restrict pastel styling to blue mode"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
