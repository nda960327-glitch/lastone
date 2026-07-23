const { execSync } = require('child_process');
execSync('git add index.html style.css sw.js', { stdio: 'inherit' });
execSync('git commit -m "style: change dictation button to red theme and remove speaker background"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
