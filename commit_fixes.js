const { execSync } = require('child_process');
execSync('git add index.html app.js sw.js', { stdio: 'inherit' });
execSync('git commit -m "fix(ui): separate action area, fix timer animation resetting, fix pointer-events bug on OX buttons"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
