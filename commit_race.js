const { execSync } = require('child_process');
execSync('git add app.js sw.js', { stdio: 'inherit' });
execSync('git commit -m "fix: resolve race condition breaking dictation mode after aborting test"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
