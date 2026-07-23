const fs = require('fs');

// 1. Fix app.js
let js = fs.readFileSync('app.js', 'utf8');

const targetStr = `    const testWordEl = document.getElementById('test-word');
    testWordEl.textContent = wordObj.word;
    if ((wordObj.totalFails || 0) >= 6) {
      testWordEl.style.color = '#ef4444';
        const wrapper = document.getElementById('test-word-wrapper');
        if (wrapper) wrapper.style.display = 'none';
    } else {
      testWordEl.style.color = 'var(--text-main)';
        const wrapper = document.getElementById('test-word-wrapper');
        if (wrapper) wrapper.style.display = 'flex';
    }
    if (wordObj.word.length > 10) {
      testWordEl.style.fontSize = 'clamp(3rem, 14vw, 5.5rem)';
    } else {
      testWordEl.style.fontSize = '';
    }`;

const replaceStr = `    const testWordEl = document.getElementById('test-word');
    testWordEl.textContent = wordObj.word;
    
    if ((wordObj.totalFails || 0) >= 6) {
      testWordEl.style.color = '#ef4444';
    } else {
      testWordEl.style.color = 'var(--text-main)';
    }

    const wrapper = document.getElementById('test-word-wrapper');
    if (isDictationMode) {
      if (wrapper) wrapper.style.display = 'none';
    } else {
      if (wrapper) wrapper.style.display = 'flex';
    }

    const wordLength = wordObj.word.length;
    if (wordLength <= 7) {
        testWordEl.style.fontSize = "4.2rem";
    } else if (wordLength <= 11) {
        testWordEl.style.fontSize = "3.0rem";
    } else {
        testWordEl.style.fontSize = "2.0rem";
    }`;

// Try to replace, handling potential CRLF mismatch
const targetStrCRLF = targetStr.replace(/\n/g, '\r\n');
if (js.includes(targetStr)) {
  js = js.replace(targetStr, replaceStr);
} else if (js.includes(targetStrCRLF)) {
  js = js.replace(targetStrCRLF, replaceStr.replace(/\n/g, '\r\n'));
} else {
  console.log("Could not find target string in app.js");
}

fs.writeFileSync('app.js', js);
console.log('app.js updated');

// 2. Fix style.css
let css = fs.readFileSync('style.css', 'utf8');

const targetCss = `.test-word {
  font-size: clamp(4rem, 22vw, 8rem);
  font-weight: 900;
  text-align: center;
  word-break: keep-all;
  overflow-wrap: break-word;
  line-height: 1.2;
  margin: 20px 0;
  color: var(--text-main);
  text-shadow: 0 0 15px var(--glow-color, transparent);
  width: 100%;
  box-sizing: border-box;
}`;

const replaceCss = `.test-word {
  white-space: nowrap !important;
  font-weight: 900;
  text-align: center;
  line-height: 1.2;
  margin: 20px 0;
  color: var(--text-main);
  text-shadow: 0 0 15px var(--glow-color, transparent);
  width: 100%;
  box-sizing: border-box;
}`;

const targetCssCRLF = targetCss.replace(/\n/g, '\r\n');
if (css.includes(targetCss)) {
  css = css.replace(targetCss, replaceCss);
} else if (css.includes(targetCssCRLF)) {
  css = css.replace(targetCssCRLF, replaceCss.replace(/\n/g, '\r\n'));
} else {
  console.log("Could not find target css in style.css");
}

fs.writeFileSync('style.css', css);
console.log('style.css updated');
