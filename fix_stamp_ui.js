const fs = require('fs');

function updateHTML() {
  let html = fs.readFileSync('index.html', 'utf8');
  
  // Remove old stamps
  html = html.replace(/<div id="stamp-o" class="stamp stamp-o">[^<]*<\/div>/g, '');
  html = html.replace(/<div id="stamp-x" class="stamp stamp-x">[^<]*<\/div>/g, '');
  
  // Add center stamp if not exists
  if (!html.includes('id="center-stamp"')) {
    const centerStampHTML = `
    <!-- 중앙 고정 스탬프 -->
    <div id="center-stamp" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(1.5); opacity: 0; pointer-events: none; z-index: 9999; transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease-out; font-size: 80px; font-weight: 900; border-radius: 20px; padding: 20px 40px; border: 12px solid; background: rgba(0,0,0,0.3); backdrop-filter: blur(5px);"></div>
`;
    // Insert just inside body or app-container
    const containerRegex = /<div id="app-container" class="app-container">/;
    html = html.replace(containerRegex, containerRegex.source + centerStampHTML);
  }
  
  fs.writeFileSync('index.html', html, 'utf8');
}

function updateCSS() {
  let css = fs.readFileSync('style.css', 'utf8');
  
  // Remove old stamp CSS
  const oldStampCSS = `/* Swipe Stamps */
.stamp { position: absolute; top: 40px; padding: 8px 24px; border-radius: 12px; font-size: 36px; font-weight: 900; text-transform: uppercase; opacity: 0; pointer-events: none; z-index: 10; }
.stamp-o { left: 30px; color: #4ade80; border: 8px solid #4ade80; transform: rotate(-25deg); }
.stamp-x { right: 30px; color: #f43f5e; border: 8px solid #f43f5e; transform: rotate(25deg); }`;
  css = css.replace(oldStampCSS, '');

  fs.writeFileSync('style.css', css, 'utf8');
}

updateHTML();
updateCSS();
console.log('HTML and CSS updated for center stamp.');
