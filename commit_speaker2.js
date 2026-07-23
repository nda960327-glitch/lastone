const { execSync } = require('child_process');
execSync('git add app.js index.html sw.js', { stdio: 'inherit' });
execSync('git commit -m "fix: replace emoji with SVG to remove samsung border and fix text wrapping"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
