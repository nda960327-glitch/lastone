const fs = require('fs');

// ===== 1. index.html: Modal Table Width and Wrapper Margin =====
let html = fs.readFileSync('index.html', 'utf8');

// Modal table th width adjustment
html = html.replace(
  '<th style="padding: 10px 8px; font-weight: 600; width: 25%;">단어</th>',
  '<th style="padding: 10px 8px; font-weight: 600; width: 20%;">단어</th>'
);
html = html.replace(
  '<th style="padding: 10px 8px; font-weight: 600; width: 45%;">뜻</th>',
  '<th style="padding: 10px 8px; font-weight: 600; width: 55%;">뜻</th>'
);

// Wrapper margin/min-height adjustment for .test-word
html = html.replace(
  '<div style="width: 100%; display: flex; align-items: center; justify-content: center; min-height: 80px; margin: 10px 0;">',
  '<div id="test-word-wrapper" style="width: 100%; display: flex; align-items: center; justify-content: center;">'
);

fs.writeFileSync('index.html', html);
console.log('[1] index.html updated');

// ===== 2. style.css: .test-word size =====
let css = fs.readFileSync('style.css', 'utf8');

css = css.replace(
  'font-size: clamp(3.5rem, 16vw, 5.5rem);',
  'font-size: clamp(4rem, 22vw, 8rem);'
);

fs.writeFileSync('style.css', css);
console.log('[2] style.css updated');

// ===== 3. app.js: Dictation mode hidden wrapper =====
let js = fs.readFileSync('app.js', 'utf8');

js = js.replace(
  "testWordEl.style.fontSize = 'clamp(2.2rem, 10vw, 3.5rem)';",
  "testWordEl.style.fontSize = 'clamp(3rem, 14vw, 5.5rem)';"
);

// We need to hide test-word-wrapper in dictation mode!
if (!js.includes("wrapper.style.display = 'none';")) {
  js = js.replace(
    "testWordEl.style.color = '#ef4444';",
    "testWordEl.style.color = '#ef4444';\n        const wrapper = document.getElementById('test-word-wrapper');\n        if (wrapper) wrapper.style.display = 'none';"
  );
  js = js.replace(
    "testWordEl.style.color = 'var(--text-main)';",
    "testWordEl.style.color = 'var(--text-main)';\n        const wrapper = document.getElementById('test-word-wrapper');\n        if (wrapper) wrapper.style.display = 'flex';"
  );
}

fs.writeFileSync('app.js', js);
console.log('[3] app.js updated');
