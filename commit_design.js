const { execSync } = require('child_process');
execSync('git add style.css sw.js', { stdio: 'inherit' });
execSync('git commit -m "style: fix test-card contrast, unify POS box styles across themes, fix headset bg, and set OX text to white"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
