const fs = require('fs');
const appJs = fs.readFileSync('app.js', 'utf8');
const regex = /getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const ids = new Set();
while ((match = regex.exec(appJs)) !== null) {
  ids.add(match[1]);
}
console.log(Array.from(ids).join(', '));
