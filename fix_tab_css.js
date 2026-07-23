const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');
css += `
/* Tab Button Light Theme Fixes */
[data-theme="pink"] .tab-btn,
[data-theme="blue"] .tab-btn,
[data-theme="green"] .tab-btn {
  border: 1px solid var(--box-border);
  background: var(--card-bg);
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);
}
[data-theme="pink"] .tab-btn:hover,
[data-theme="blue"] .tab-btn:hover,
[data-theme="green"] .tab-btn:hover {
  background: var(--bg-color);
}
`;
fs.writeFileSync('style.css', css, 'utf8');
console.log('Tab button CSS appended.');
