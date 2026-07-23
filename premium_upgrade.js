const fs = require('fs');

function upgradeHtml() {
  let html = fs.readFileSync('index.html', 'utf8');
  
  // Add Outfit and Pretendard
  const fontLinks = `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" />`;
  
  html = html.replace(/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">/, fontLinks);
  
  fs.writeFileSync('index.html', html, 'utf8');
}

function upgradeCss() {
  let css = fs.readFileSync('style.css', 'utf8');

  // Change font family
  css = css.replace(/font-family: 'Inter', 'Noto Sans KR', sans-serif;/g, "font-family: 'Outfit', 'Pretendard', sans-serif;\n  letter-spacing: -0.015em;");

  // Upgrade background animation
  const bgAnimCss = `
  background-size: 200% 200%;
  animation: ambientBackground 15s ease infinite alternate;
}

@keyframes ambientBackground {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;
  css = css.replace(/background-image:[\s\S]*?transparent 70%\);/g, match => match + bgAnimCss);

  // Upgrade Glass Card
  css = css.replace(/\.glass-card \{[\s\S]*?\}/g, `.glass-card {
  background: var(--card-bg);
  border: 1px solid var(--box-border);
  border-radius: 24px;
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.02),
    0 10px 15px rgba(0, 0, 0, 0.03),
    0 24px 50px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
}`);

  // Upgrade .btn-primary
  css = css.replace(/\.btn-primary \{[\s\S]*?\}/g, `.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--primary-color), #6366f1);
  color: #ffffff !important;
  padding: 16px 28px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 800;
  box-shadow: 
    0 4px 15px rgba(0,0,0,0.1),
    0 10px 25px rgba(var(--primary-color), 0.3),
    inset 0 1px 0 rgba(255,255,255,0.2);
  letter-spacing: -0.01em;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}`);

  css = css.replace(/\.btn-primary:hover\s*\{[\s\S]*?\}/g, `.btn-primary:hover { 
  transform: translateY(-4px) scale(1.02); 
  box-shadow: 
    0 8px 25px rgba(0,0,0,0.15),
    0 15px 35px rgba(var(--primary-color), 0.4),
    inset 0 1px 0 rgba(255,255,255,0.3);
  filter: brightness(1.1);
}`);
  
  css = css.replace(/\.btn-primary:active\s*\{[\s\S]*?\}/g, `.btn-primary:active { transform: translateY(0) scale(0.98); }`);

  // Upgrade .btn-secondary
  css = css.replace(/\.btn-secondary \{[\s\S]*?\}/g, `.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--card-bg);
  border: 1px solid var(--box-border);
  color: var(--text-main);
  padding: 14px 22px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}`);
  css = css.replace(/\.btn-secondary:hover\s*\{[\s\S]*?\}/g, `.btn-secondary:hover { 
  background: var(--bg-color); 
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.08);
}`);

  // Upgrade test-card-el
  css = css.replace(/#test-card-el \{[\s\S]*?\}/g, `#test-card-el {
  touch-action: pan-y;
  user-select: none;
  border-radius: 28px;
  background: var(--card-bg);
  border: 1px solid var(--box-border);
  box-shadow: 
    0 10px 30px rgba(0,0,0,0.06),
    0 20px 60px rgba(0,0,0,0.04),
    inset 0 1px 0 rgba(255,255,255,0.6);
  padding: 32px 24px;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease;
  position: relative;
  overflow: hidden;
}`);
  
  // Upgrade test-word typography
  css = css.replace(/\.test-word \{[\s\S]*?\}/g, `.test-word {
  font-size: clamp(2.5rem, 10vw, 4rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  text-align: center;
  color: var(--text-main) !important;
  margin-bottom: 8px;
  background: linear-gradient(135deg, var(--text-main) 40%, var(--primary-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}`);

  css = css.replace(/\.test-meanings \{[\s\S]*?\}/g, `.test-meanings {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-main) !important;
  line-height: 1.6;
  text-align: center;
  opacity: 0.9;
}`);

  fs.writeFileSync('style.css', css, 'utf8');
}

upgradeHtml();
upgradeCss();
console.log('Premium CSS applied!');
