const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
  '<div class="round-pill">Round <span id="test-round">1</span> · 테스트</div>',
  '<div class="round-pill">Round <span id="test-round">1</span> · v179</div>'
);

fs.writeFileSync('index.html', html);
console.log('Added v179 version string.');
