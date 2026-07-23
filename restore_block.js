const fs = require('fs');
let js = fs.readFileSync('app.js', 'utf8');

const regex = /    if \(listenZone && !isDictationMode\) \{\r?\n      listenZone\.classList\.remove\('hidden'\);\r?\n    \}\r?\n\r?\n    \/\/ 헤드셋\(프라이밍\) 단계가 끝나고 스펠링 공개될 때 타이머 노출/g;

const replacement = `    if (listenZone && !isDictationMode) {
      listenZone.classList.remove('hidden');
    }

    speak(wordObj.word);

    // [이전 단어 꼼수 방지] 이미 정답/오답 처리가 끝난 단어인지 확인
    const isAlreadyGraded = !!wordObj._alreadyGraded;

    // Auditory Priming 대기 (이미 채점된 단어는 대기 없음)
    if (!isDictationMode && !isAlreadyGraded) {
      await sleep(2000);
    }
    if (App.studyAbort || App.testSessionId !== currentSessionId) return;

    if (listenZone) {
      listenZone.classList.add('hidden');
    }

    // 헤드셋(프라이밍) 단계가 끝나고 스펠링 공개될 때 타이머 노출`;

js = js.replace(regex, replacement);

fs.writeFileSync('app.js', js, 'utf8');
console.log('Restored the missing block.');
