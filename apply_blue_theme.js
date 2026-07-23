const fs = require('fs');

function applyUserBlueTheme() {
  let css = fs.readFileSync('style.css', 'utf8');

  // Replace existing blue theme block to avoid conflicts
  const blueRegex = /\[data-theme="blue"\] \{([\s\S]*?)\}/;
  const newBlueTheme = `[data-theme="blue"] {
  /* 배경 & 카드 */
  --bg-color: #F0F4F8; /* 아주 연한 블루그레이 (눈이 편안함) */
  --card-bg: #FFFFFF;  /* 카드는 완전한 흰색으로 분리감 확보 */
  
  /* 텍스트 (흰색 절대 금지, 진한 색으로 강제) */
  --text-main: #0F172A; /* 거의 검은색에 가까운 진한 네이비 (메인 단어, 뜻) */
  --text-sub: #475569;  /* 중간 톤의 슬레이트 블루 (품사, 보조 설명) */
  
  /* 포인트 컬러 (버튼, 테두리 등) */
  --primary-color: #2563EB; /* 쨍하고 세련된 블루 */
  --primary-hover: #1D4ED8; /* 버튼 눌렀을 때 색상 */
  --box-border: #DBEAFE;    /* 박스 테두리 (연한 파란색) */

  /* 🔴🟢 O/X 버튼 및 스탬프 (어떤 테마든 무조건 고정) */
  --btn-o-bg: #10B981;   /* 명확한 에메랄드 그린 */
  --btn-x-bg: #EF4444;   /* 명확한 레드 */
  --text-white: #FFFFFF; /* O/X 버튼 안의 글씨는 무조건 흰색 */
  
  /* 기존 변수들 폴백 */
  --dropdown-bg: #FFFFFF;
  --dropdown-hover: #F0F4F8;
  --input-bg: #F0F4F8;
  --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  --border-h: #2563EB;
}`;
  
  if(blueRegex.test(css)) {
    css = css.replace(blueRegex, newBlueTheme);
  } else {
    css += '\n' + newBlueTheme;
  }

  // Append user's exact forced rules, adapted for our actual DOM classes
  const overrideCss = `
/* =============================================
   USER FORCED STYLE OVERRIDES
   ============================================= */

/* 배경 및 기본 글씨색 강제 변경 */
body {
  background-color: var(--bg-color) !important;
  color: var(--text-main) !important;
}

/* 단어 카드 및 리스트 박스 */
.glass-card, .word-card, .list-box, .dropdown-box, .dropdown-content {
  background-color: var(--card-bg) !important;
  border: 2px solid var(--box-border) !important;
  color: var(--text-main) !important;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important; /* 부드러운 그림자 */
}

/* 메인 영단어 및 뜻 텍스트 (절대 안 보이면 안됨) */
.test-word, .test-meanings, .word-text, .meaning-text, .word-list-title, th, td {
  color: var(--text-main) !important;
}

/* 품사 및 기타 보조 텍스트 */
.test-pos-hint, .pos-badge, .sub-text, .stat-label, .result-table .num-cell {
  color: var(--text-sub) !important;
}

/* O/X 버튼 강제 색상 */
#btn-correct, .btn-o { 
  background-color: var(--btn-o-bg) !important; 
  color: var(--text-white) !important; 
  border: none !important; 
}
#btn-wrong, .btn-x { 
  background-color: var(--btn-x-bg) !important; 
  color: var(--text-white) !important; 
  border: none !important; 
}

/* 버튼 hover 컬러 반영 */
.btn-primary { background: var(--primary-color) !important; color: var(--card-bg) !important; border: none; }
.btn-primary:hover { background: var(--primary-hover) !important; }
`;

  // Remove previous user forced overrides if any to prevent duplicates
  const overrideStart = css.indexOf('/* USER FORCED STYLE OVERRIDES');
  if (overrideStart !== -1) {
    css = css.substring(0, overrideStart);
  }

  css += overrideCss;

  fs.writeFileSync('style.css', css, 'utf8');
}

applyUserBlueTheme();
console.log('Blue theme applied successfully!');
