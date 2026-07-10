const fs = require('fs');

function refactorStyleCSS() {
  let css = fs.readFileSync('style.css', 'utf8');
  
  // 1. Rewrite :root and add themes
  const rootRegex = /:root\s*\{[\s\S]*?--glow-red:[^\}]*\}/;
  const newThemes = `:root, [data-theme="dark"] {
  --bg:          #07071a;
  --bg2:         #0d0d28;
  --glass:       rgba(255, 255, 255, 0.04);
  --glass-h:     rgba(255, 255, 255, 0.07);
  --border:      rgba(255, 255, 255, 0.08);
  --border-h:    rgba(255, 255, 255, 0.18);
  
  --dropdown-bg: rgba(30, 41, 59, 0.95);
  --dropdown-hover: #1e1b4b;
  --input-bg:    rgba(0,0,0,0.3);
  --grad-1:      rgba(79,158,255,.07);
  --grad-2:      rgba(168,85,247,.07);
  --card-shadow: 0 12px 40px rgba(0,0,0,0.5);
  --icon-filter: none;

  --blue:        #4f9eff;
  --purple:      #a855f7;
  --cyan:        #22d3ee;
  --green:       #4ade80;
  --red:         #f87171;
  --amber:       #fbbf24;

  --text1:       #eeeeff;
  --text2:       #8888bb;
  --text3:       #44446a;

  --radius:      18px;
  --radius-sm:   10px;
  --shadow:      var(--card-shadow);
  --glow-blue:   0 0 28px rgba(79,158,255,0.25);
  --glow-green:  0 0 28px rgba(74,222,128,0.3);
  --glow-red:    0 0 28px rgba(248,113,113,0.3);
}

[data-theme="blue-white"] {
  --bg:          #f0f7ff;
  --bg2:         #e0f2fe;
  --glass:       rgba(255, 255, 255, 0.85);
  --glass-h:     rgba(255, 255, 255, 1);
  --border:      rgba(59, 130, 246, 0.15);
  --border-h:    rgba(59, 130, 246, 0.3);
  
  --dropdown-bg: rgba(255, 255, 255, 0.95);
  --dropdown-hover: #eff6ff;
  --input-bg:    rgba(255, 255, 255, 0.7);
  --grad-1:      rgba(59, 130, 246, 0.08);
  --grad-2:      rgba(147, 197, 253, 0.08);
  --card-shadow: 0 8px 30px rgba(59, 130, 246, 0.1);
  --icon-filter: invert(1);

  --text1:       #1e3a8a;
  --text2:       #3b82f6;
  --text3:       #93c5fd;
}

[data-theme="pink-white"] {
  --bg:          #fff1f2;
  --bg2:         #ffe4e6;
  --glass:       rgba(255, 255, 255, 0.85);
  --glass-h:     rgba(255, 255, 255, 1);
  --border:      rgba(244, 63, 94, 0.15);
  --border-h:    rgba(244, 63, 94, 0.3);
  
  --dropdown-bg: rgba(255, 255, 255, 0.95);
  --dropdown-hover: #fff1f2;
  --input-bg:    rgba(255, 255, 255, 0.7);
  --grad-1:      rgba(244, 63, 94, 0.08);
  --grad-2:      rgba(253, 164, 175, 0.08);
  --card-shadow: 0 8px 30px rgba(244, 63, 94, 0.1);
  --icon-filter: invert(1);

  --text1:       #881337;
  --text2:       #f43f5e;
  --text3:       #fda4af;
}

[data-theme="green-white"] {
  --bg:          #f0fdf4;
  --bg2:         #dcfce7;
  --glass:       rgba(255, 255, 255, 0.85);
  --glass-h:     rgba(255, 255, 255, 1);
  --border:      rgba(34, 197, 94, 0.15);
  --border-h:    rgba(34, 197, 94, 0.3);
  
  --dropdown-bg: rgba(255, 255, 255, 0.95);
  --dropdown-hover: #f0fdf4;
  --input-bg:    rgba(255, 255, 255, 0.7);
  --grad-1:      rgba(34, 197, 94, 0.08);
  --grad-2:      rgba(134, 239, 172, 0.08);
  --card-shadow: 0 8px 30px rgba(34, 197, 94, 0.1);
  --icon-filter: invert(1);

  --text1:       #14532d;
  --text2:       #22c55e;
  --text3:       #86efac;
}`;
  
  css = css.replace(rootRegex, newThemes);
  
  // 2. Body background gradient 
  const bodyGradRegex = /background-image:[\s\S]*?transparent 70%\);/;
  const newBodyGrad = `background-image:
    radial-gradient(ellipse 60% 50% at 15% 40%, var(--grad-1) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 85% 60%, var(--grad-2) 0%, transparent 70%);`;
  css = css.replace(bodyGradRegex, newBodyGrad);
  
  // 3. Logo invert class for light mode (because the icon might be white logo, or black logo, we use filter)
  const brandImgRegex = /\.brand-icon-img\s*\{\s*width:[^\}]*\}/;
  const newBrandImg = `.brand-icon-img { width: 50px; height: 50px; border-radius: 12px; object-fit: cover; box-shadow: var(--shadow); filter: var(--icon-filter); }`;
  if (css.match(brandImgRegex)) {
    css = css.replace(brandImgRegex, newBrandImg);
  }
  
  // 4. Update `#app-container` input color background if it's hardcoded
  css = css.replace(/background:\s*rgba\(0,0,0,0\.3\);/g, 'background: var(--input-bg);');
  
  fs.writeFileSync('style.css', css, 'utf8');
}

function refactorIndexHTML() {
  let html = fs.readFileSync('index.html', 'utf8');
  
  // btn-settings style update
  html = html.replace(/color: #fff;/g, 'color: var(--text1);');
  html = html.replace(/background: rgba\(30, 41, 59, 0\.95\);/g, 'background: var(--dropdown-bg);');
  
  // theme selector in settings dropdown
  const themeSelectorUI = `<!-- 테마 선택기 -->
        <h4 style="margin: 16px 0 12px 0; font-size: 14px; color: var(--text2); text-align: left; padding-bottom: 8px; border-bottom: 1px solid var(--border);">테마 (스킨)</h4>
        <div id="theme-selector" style="display: flex; gap: 8px; justify-content: space-between; margin-bottom: 12px; pointer-events: auto;">
          <button class="theme-btn" data-theme="dark" style="width: 28px; height: 28px; border-radius: 50%; background: #07071a; border: 2px solid var(--border); cursor: pointer;" title="다크 모드"></button>
          <button class="theme-btn" data-theme="blue-white" style="width: 28px; height: 28px; border-radius: 50%; background: #f0f7ff; border: 2px solid var(--border); cursor: pointer;" title="블루화이트"></button>
          <button class="theme-btn" data-theme="pink-white" style="width: 28px; height: 28px; border-radius: 50%; background: #fff1f2; border: 2px solid var(--border); cursor: pointer;" title="핑크화이트"></button>
          <button class="theme-btn" data-theme="green-white" style="width: 28px; height: 28px; border-radius: 50%; background: #f0fdf4; border: 2px solid var(--border); cursor: pointer;" title="그린화이트"></button>
        </div>`;
        
  const dropdownTarget = `<!-- 스와이프 모드 토글 -->`;
  html = html.replace(dropdownTarget, themeSelectorUI + '\n        ' + dropdownTarget);
  
  // Ensure all colors use css vars
  html = html.replace(/color:\s*#ffffff/g, 'color: var(--text1)');
  html = html.replace(/color:\s*#f8fafc/g, 'color: var(--text1)');
  
  fs.writeFileSync('index.html', html, 'utf8');
}

function refactorAppJS() {
  let js = fs.readFileSync('app.js', 'utf8');
  
  // Update testWordEl color when fails < 6
  js = js.replace(/testWordEl\.style\.color = '#ffffff';/g, "testWordEl.style.color = 'var(--text1)';");
  
  // Replace #1e1b4b in select dropdowns
  js = js.replace(/#1e1b4b/g, 'var(--dropdown-hover)');
  // Replace #fff for option text
  js = js.replace(/color:#fff/g, 'color:var(--text1)');
  js = js.replace(/color:\s*'#ffffff'/g, "color: 'var(--text1)'");
  
  // Add theme toggle logic in DOMContentLoaded equivalent
  const themeLogic = `
  const themeBtns = document.querySelectorAll('.theme-btn');
  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('vocab_theme', theme);
    themeBtns.forEach(btn => {
      if (btn.dataset.theme === theme) btn.style.borderColor = 'var(--text1)';
      else btn.style.borderColor = 'var(--border)';
    });
  }
  
  const savedTheme = localStorage.getItem('vocab_theme') || 'dark';
  applyTheme(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      applyTheme(btn.dataset.theme);
    });
  });
`;

  // Inject at the end of the Settings Button Toggle Logic
  const settingsEndRegex = /\}\);\n  \}\n\}\)\(\);/;
  if (js.match(settingsEndRegex)) {
    js = js.replace(settingsEndRegex, `});\n  }\n${themeLogic}\n})();`);
  } else {
    // Fallback if regex fails
    js += `\n(function() { ${themeLogic} })();\n`;
  }
  
  fs.writeFileSync('app.js', js, 'utf8');
}

refactorStyleCSS();
refactorIndexHTML();
refactorAppJS();
console.log("Refactoring complete");
