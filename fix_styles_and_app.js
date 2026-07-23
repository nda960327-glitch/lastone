const fs = require('fs');

// 1. Update app.js
let appJs = fs.readFileSync('app.js', 'utf8');
appJs = appJs.replace(
  /if \(isDictationMode\) \{/,
  `const testCard = document.querySelector('.test-card');
    if (testCard) {
      if (isDictationMode) testCard.classList.add('dictation-mode-active');
      else testCard.classList.remove('dictation-mode-active');
    }
    if (isDictationMode) {`
);
fs.writeFileSync('app.js', appJs, 'utf8');

// 2. Update style.css
let css = fs.readFileSync('style.css', 'utf8');

// Revert .speaker-icon-btn and add .dictation-mode-active override
css = css.replace(/\.speaker-icon-btn \{[\s\S]*?\}/, `.speaker-icon-btn {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  flex-shrink: 0;
  transition: all 0.2s ease;
  color: var(--text-main);
}
.dictation-mode-active .speaker-icon-btn {
  width: 48px;
  height: 48px;
  font-size: 24px;
}`);

// Add justify-content: center to .btn-primary
css = css.replace(/\.btn-primary \{/, `.btn-primary {\n  justify-content: center;\n  text-align: center;`);

// Update .final-cheer
css = css.replace(/background: rgba\(74, 222, 128, 0\.1\);/, `background: rgba(34, 197, 94, 0.15);`);
css = css.replace(/border: 1px solid rgba\(74, 222, 128, 0\.3\);/, `border: 1px solid rgba(34, 197, 94, 0.4);`);

// Update blue and green theme background colors
css = css.replace(/\[data-theme="blue"\] \{\s*--bg-color: #[a-fA-F0-9]+;/, `[data-theme="blue"] {\n  --bg-color: #D4EAFA;`);
css = css.replace(/\[data-theme="green"\] \{\s*--bg-color: #[a-fA-F0-9]+;/, `[data-theme="green"] {\n  --bg-color: #D1FAE5;`);

fs.writeFileSync('style.css', css, 'utf8');
console.log('Styles and app.js updated successfully.');
