const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix speaker icon inline styles
html = html.replace(
  /<button id="btn-speak-again" class="speaker-icon-btn hidden" style="[^"]+" title="🔊 다시 듣기">🔊<\/button>/g,
  '<button id="btn-speak-again" class="speaker-icon-btn hidden" title="🔊 다시 듣기">🔊</button>'
);

// 2. Fix dictation button
html = html.replace(
  /<button id="btn-dictation" class="btn-primary" style="margin-top: 15px; padding: 16px; font-size: 1\.1rem; background: linear-gradient\(135deg, #f43f5e, #e11d48\); box-shadow: 0 4px 15px rgba\(225, 29, 72, 0\.3\); width: 100%;">/g,
  '<button id="btn-dictation" class="btn-dictation-blue" style="margin-top: 15px;">'
);

// 3. Fix modal background
html = html.replace(/background: var\(--bg-card\);/g, 'background: var(--card-bg);');

// 4. Remove color:black from add-word-pos options so they adapt to the theme (or just remove it)
html = html.replace(/<option value="n" style="color:black;">/g, '<option value="n">');
html = html.replace(/<option value="v" style="color:black;">/g, '<option value="v">');
html = html.replace(/<option value="a" style="color:black;">/g, '<option value="a">');
html = html.replace(/<option value="ad" style="color:black;">/g, '<option value="ad">');
html = html.replace(/<option value="prep" style="color:black;">/g, '<option value="prep">');
html = html.replace(/<option value="conj" style="color:black;">/g, '<option value="conj">');
html = html.replace(/<option value="pron" style="color:black;">/g, '<option value="pron">');
html = html.replace(/<option value="int" style="color:black;">/g, '<option value="int">');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed index.html styling issues.');
