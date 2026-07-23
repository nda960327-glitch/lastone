const { execSync } = require('child_process');
execSync('git add style.css sw.js', { stdio: 'inherit' });
execSync('git commit -m "feat(ui): apply pastel glow aesthetics specifically for pink and blue themes"', { stdio: 'inherit' });
execSync('git push origin main', { stdio: 'inherit' });
