const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

// Remove old swipe stamps if they exist
const marker = '/* Swipe Stamps */';
if (css.includes(marker)) {
  css = css.substring(0, css.indexOf(marker));
}

// Append new swipe stamps with nudge animation
css += `
/* Swipe Stamps */
.stamp { position: absolute; top: 40px; padding: 8px 24px; border-radius: 12px; font-size: 36px; font-weight: 900; text-transform: uppercase; opacity: 0; pointer-events: none; z-index: 10; }
.stamp-o { left: 30px; color: #4ade80; border: 8px solid #4ade80; transform: rotate(-25deg); }
.stamp-x { right: 30px; color: #f43f5e; border: 8px solid #f43f5e; transform: rotate(25deg); }

@keyframes nudge {
  0% { transform: translateX(0) rotate(0); }
  25% { transform: translateX(8px) rotate(2deg); }
  50% { transform: translateX(-8px) rotate(-2deg); }
  75% { transform: translateX(8px) rotate(2deg); }
  100% { transform: translateX(0) rotate(0); }
}
.nudge-anim {
  animation: nudge 0.6s ease-in-out;
}
`;

fs.writeFileSync('style.css', css, 'utf8');
console.log('Successfully updated style.css');
