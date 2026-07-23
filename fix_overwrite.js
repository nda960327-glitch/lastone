const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const targetSectionRegex = /\/\/ 강제 잠금 상태거나 이미 채점된 단어면 O 버튼 잠금[\s\S]*?wordObj\._alreadyGraded = true;\n\s+\}\n\n\s+await sleep\(180\);/g;

const replacement = `// 강제 잠금 상태 (이전 단어 수정 시에는 자유롭게 허용)
    if (App.isOButtonLocked && !isAlreadyGraded) {
      document.getElementById('btn-correct').disabled = true;
    }

    let result = 'O';
    if (isDictationMode) {
      result = await waitForDictationOrPrev(wordObj);
    } else {
      result = await waitForOXOrPrev();
    }
    stopWordTimer();
    setOXDisabled(true);

    window.speechSynthesis.cancel();

    // [이전 단어] 처리: O/X 단계에서 이전 단어 클릭
    if (result === 'PREV') {
      if (i > 0) {
        i = i - 2;
      } else {
        i = -1;
      }
      continue;
    }

    // [결과 처리]
    if (!isAlreadyGraded) {
      if (result === 'O') {
        wordObj.passed = true;
        wordObj.userChoice = 'O';
        correctThisRound++;
      } else if (result === 'X' || result === 'SKIP' || result === 'TIMEOUT' || result === 'X_DICTATION') {
        wordObj.userChoice = 'X';
        if (result !== 'X_DICTATION') {
          wordObj.attempts++;
          let failData = JSON.parse(localStorage.getItem('doacore_total_fails')) || {};
          failData[wordObj.word] = (failData[wordObj.word] || 0) + 1;
          localStorage.setItem('doacore_total_fails', JSON.stringify(failData));
          wordObj.totalFails = failData[wordObj.word];
          saveWordStates();
        }
        wordObj.passed = false;
        wrongThisRound.push(wordObj);
      }
      wordObj._alreadyGraded = true;
    } else {
      // 이미 채점된 단어를 수정하는 경우
      if (result === 'O' || result === 'X') {
        if (wordObj.userChoice !== result) {
          let failData = JSON.parse(localStorage.getItem('doacore_total_fails')) || {};
          if (result === 'O' && wordObj.userChoice === 'X') {
            // X -> O 로 수정 (실수로 틀렸다고 한 경우)
            wordObj.totalFails = Math.max(0, (failData[wordObj.word] || 0) - 1);
            failData[wordObj.word] = wordObj.totalFails;
            localStorage.setItem('doacore_total_fails', JSON.stringify(failData));
            
            wordObj.userChoice = 'O';
            wordObj.passed = true;
            correctThisRound++;
            const idx = wrongThisRound.findIndex(w => w.word === wordObj.word);
            if (idx > -1) wrongThisRound.splice(idx, 1);
            saveWordStates();
          } else if (result === 'X' && wordObj.userChoice === 'O') {
            // O -> X 로 수정 (실수로 맞췄다고 한 경우)
            failData[wordObj.word] = (failData[wordObj.word] || 0) + 1;
            localStorage.setItem('doacore_total_fails', JSON.stringify(failData));
            wordObj.totalFails = failData[wordObj.word];
            
            wordObj.userChoice = 'X';
            wordObj.passed = false;
            correctThisRound = Math.max(0, correctThisRound - 1);
            if (!wrongThisRound.find(w => w.word === wordObj.word)) {
              wrongThisRound.push(wordObj);
            }
            saveWordStates();
          }
        }
      }
    }

    await sleep(180);`;

code = code.replace(targetSectionRegex, replacement);

// Also skip the wait for reveal if already graded
const revealBypassRegex = /      \} else \{\r?\n\s+\/\/ 이미 채점된 단어면 타이머 바를 아예 넘기거나 정지 상태유지\r?\n\s+stopWordTimer\(\);\r?\n\s+\}\r?\n\r?\n\s+revealResult = await waitForRevealOrPrev\(\);\r?\n\s+\}/g;

const revealBypassReplacement = `      } else {
        // 이미 채점된 단어면 타이머 바를 아예 넘기거나 정지 상태유지
        stopWordTimer();
        revealResult = 'O'; // 강제로 reveal 통과
      }

      if (!isAlreadyGraded) {
        revealResult = await waitForRevealOrPrev();
      }
    }`;

code = code.replace(revealBypassRegex, revealBypassReplacement);

fs.writeFileSync('app.js', code, 'utf8');
console.log('Update completed');
