const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const targetRegex = /\/\/ 그룹 C: 최종 보스전 총정리 \(대그룹\)[\s\S]*?<span class="range-btn-count">최종 보스전 \(마스터 단계\)<\/span>\r?\n\s+`;/;

const replacement = `// 그룹 C-1: 전체 취약점 복습 (2회 이상)
    const btnReviewAllMid = document.createElement('button');
    btnReviewAllMid.id = 'btn-review-all-mid';
    btnReviewAllMid.className = 'btn-range-item btn-review weakness-focus';
    btnReviewAllMid.dataset.start = '0';
    btnReviewAllMid.dataset.end = String(n);
    const sectionKeyReviewAllMid = \`1~\${n} 전체 취약점 복습\`;
    btnReviewAllMid.innerHTML = \`
      <span class="range-btn-label">1~\${n} 전체 취약점 복습 \${getBadgeHTML(sectionKeyReviewAllMid)}</span>
      <span class="range-btn-count">전체 범위 오답 집중 (2회 이상)</span>
    \`;
    btnReviewAllMid.onclick = () => {
      App.currentSection = \`1~\${n} 전체 취약점 복습\`;
      startWeaknessReview(0, n, false);
    };
    reviewGrid.appendChild(btnReviewAllMid);

    // 그룹 C: 최종 보스전 총정리 (대그룹)
    const btnFinal = document.createElement('button');
    btnFinal.className = 'btn-range-item btn-review weakness-focus';
    btnFinal.dataset.start = '0';
    btnFinal.dataset.end = String(n);
    btnFinal.dataset.final = 'true';
    const sectionKeyFinal = \`1~\${n} 최종 취약점 총정리\`;
    btnFinal.innerHTML = \`
      <span class="range-btn-label">1~\${n} 최종 취약점 총정리 \${getBadgeHTML(sectionKeyFinal)}</span>
      <span class="range-btn-count">최종 보스전 (악성 오답 4회 이상)</span>
    \`;`;

code = code.replace(targetRegex, replacement);

fs.writeFileSync('app.js', code, 'utf8');
console.log('Update completed');
