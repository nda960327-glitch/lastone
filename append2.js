const fs = require('fs');

const cssToAppend = `
/* Pink theme test word spelling color override (from image) */
[data-theme="pink"] #test-word,
[data-theme="pink"] .test-word {
  color: #B83A64 !important;
}
`;

fs.appendFileSync('style.css', cssToAppend);
