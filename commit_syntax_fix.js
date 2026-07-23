const { execSync } = require('child_process');
execSync('git add app.js sw.js', { stdio: 'inherit' });
execSync('git commit -m "fix(core): remove syntax error breaking javascript execution"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
