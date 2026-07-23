const fs = require('fs');
let js = fs.readFileSync('app.js', 'utf8');

// 1. Add App.testSessionId = Date.now(); wherever App.studyAbort = false; is called.
js = js.replace(/App\.studyAbort = false;/g, 'App.studyAbort = false; App.testSessionId = Date.now();');

// 2. Insert const currentSessionId = App.testSessionId; at the top of runTestRound
js = js.replace(/async function runTestRound\(startIndex = 0\) \{/g, 'async function runTestRound(startIndex = 0) {\n  const currentSessionId = App.testSessionId;');

// 3. Replace existing App.studyAbort checks inside runTestRound
js = js.replace(/if \(App\.studyAbort\) return;/g, 'if (App.studyAbort || App.testSessionId !== currentSessionId) return;');

// 4. Also replace the check after isPassed
js = js.replace(/if \(result === 'ABORT' \|\| App\.studyAbort\) return;/g, 'if (result === "ABORT" || App.studyAbort || App.testSessionId !== currentSessionId) return;');

// 5. Add the check right after await sleep(2000);
js = js.replace(/await sleep\(2000\);\n\s*\}/g, 'await sleep(2000);\n    }\n    if (App.studyAbort || App.testSessionId !== currentSessionId) return;');

fs.writeFileSync('app.js', js, 'utf8');
console.log('Fixed race condition with testSessionId.');
