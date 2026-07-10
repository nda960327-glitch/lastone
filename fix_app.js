const fs = require('fs');

let content = fs.readFileSync('app.js', 'utf8');

// Normalize line endings to \n
content = content.replace(/\r\n/g, '\n');

const target1 = "      if (oxC3) { oxC3.style.display = 'flex'; oxC3.classList.remove('hidden'); }";
const replace1 = "      if (oxC3) { \n        if (isSwipeMode) {\n          oxC3.style.display = 'none';\n          oxC3.classList.add('hidden');\n        } else {\n          oxC3.style.display = 'flex'; \n          oxC3.classList.remove('hidden');\n        }\n      }";

content = content.replace(target1, replace1);

const target2 = "    swipeToggle.addEventListener('change', (e) => {\n      isSwipeMode = e.target.checked;\n      if (!isSwipeMode && testCard) {\n        testCard.style.transform = '';\n        testCard.style.boxShadow = '';\n        testCard.classList.remove('dragging');\n      }\n    });";
const replace2 = "    swipeToggle.addEventListener('change', (e) => {\n      isSwipeMode = e.target.checked;\n      if (!isSwipeMode && testCard) {\n        testCard.style.transform = '';\n        testCard.style.boxShadow = '';\n        testCard.classList.remove('dragging');\n      }\n\n      const oxC = document.getElementById('ox-buttons-container');\n      const btnReveal = document.getElementById('btn-reveal');\n      if (oxC && btnReveal) {\n        if (isSwipeMode) {\n          oxC.style.display = 'none';\n          oxC.classList.add('hidden');\n        } else {\n          if (btnReveal.classList.contains('hidden') && document.getElementById('test-meanings') && !document.getElementById('test-meanings').classList.contains('hidden')) {\n            oxC.style.display = 'flex';\n            oxC.classList.remove('hidden');\n          }\n        }\n      }\n    });";

content = content.replace(target2, replace2);

// Re-normalize to original CRLF just in case
content = content.replace(/\n/g, '\r\n');

fs.writeFileSync('app.js', content, 'utf8');
