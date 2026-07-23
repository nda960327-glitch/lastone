const { execSync } = require('child_process');
execSync('git add app.js index.html style.css sw.js', { stdio: 'inherit' });
execSync('git commit -m "fix: resolve dictation layout, O-button lockout, and enhance blue/pink theme color naturalness"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
