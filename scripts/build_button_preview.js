/* 버튼 리디자인 확인용 카탈로그 페이지를 만든다.
   node scripts/build_button_preview.js → _buttons_preview.html
   (개발 확인용, 배포에는 안 들어감) */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

let css = fs.readFileSync(path.join(ROOT, 'kawaii.css'), 'utf8');

// 캐릭터 SVG 를 data URI 로 인라인 (단독 파일로도 보이게)
for (const kind of ['bear', 'cloud', 'sprout']) {
  for (const pose of ['mini', 'face', 'idle']) {
    const f = path.join(ROOT, 'assets/kawaii', `${kind}-${pose}.svg`);
    if (!fs.existsSync(f)) continue;
    const uri = 'data:image/svg+xml,' + encodeURIComponent(fs.readFileSync(f, 'utf8'));
    css = css.split(`url("assets/kawaii/${kind}-${pose}.svg")`).join(`url("${uri}")`);
  }
}

const THEMES = [
  ['pink',  '🧸 곰곰이'],
  ['blue',  '☁️ 구름이'],
  ['green', '🌱 새싹이'],
  ['dark',  '🌙 미드나잇'],
];

const section = (title, note, body) => `
  <div class="sec">
    <div class="sec-h">${title}</div>
    ${note ? `<div class="sec-n">${note}</div>` : ''}
    <div class="sec-b">${body}</div>
  </div>`;

const demo = `
${section('주 액션 · 보조 · 조용함', '한 화면에 채워진 버튼은 하나만. 나머지는 물러난다.', `
  <button class="btn-primary">다음 Round 시작 →</button>
  <button class="btn-secondary">🏠 홈으로</button>
  <button class="info-pill-btn">💡 이 앱의 효과 및 사용법 읽기</button>
  <button class="btn-primary" disabled>비활성 상태</button>
`)}

${section('탭 (세그먼트)', '선택된 것만 떠오르고 나머지는 배경에 눕는다.', `
  <div class="category-tabs-container" style="display:grid;grid-template-columns:1fr 1fr;">
    <button class="tab-btn active">🔥 토플 영단어</button>
    <button class="tab-btn">🌱 기초 영단어</button>
    <button class="tab-btn">📁 업로드 단어장</button>
    <button class="tab-btn">✍️ 수동 단어장</button>
  </div>
`)}

${section('학습 구간', '왼쪽 강조 바가 hover 시 살아나 "누를 수 있는 것"임을 알린다.', `
  <button class="btn-range-item" style="display:flex;justify-content:space-between;align-items:center;width:100%;">
    <span style="font-weight:700;">1 ~ 20</span>
    <span class="range-btn-count">20개</span>
  </button>
  <button class="btn-range-item" style="display:flex;justify-content:space-between;align-items:center;width:100%;">
    <span style="font-weight:700;">21 ~ 40</span>
    <span class="range-btn-count">20개</span>
  </button>
`)}

${section('뜻 확인 — 학습 화면의 유일한 주 액션', '', `
  <button class="btn-reveal" style="display:inline-flex;align-items:center;gap:8px;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg> 뜻 확인하기
  </button>
`)}

${section('O · X — 가장 많이 누르는 버튼', '색 + 아이콘 모양 + 라벨 3중 구분. 색맹이어도 체크/엑스로 읽힌다.', `
  <div id="ox-buttons-container" style="display:flex;width:100%;">
    <button class="btn-ox-new btn-o">
      <div class="ox-circle circle-o">
        <svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <span class="ox-label">알고 있어요</span>
    </button>
    <button class="btn-ox-new btn-x">
      <div class="ox-circle circle-x">
        <svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </div>
      <span class="ox-label">몰랐어요</span>
    </button>
  </div>
`)}

${section('로그인', '브랜드 색은 그대로, 물리(그림자·눌림)만 통일.', `
  <button class="btn-social btn-social-kakao" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:14px;font-size:14px;">
    <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#191600" d="M12 3C6.9 3 2.8 6.2 2.8 10.2c0 2.6 1.7 4.8 4.3 6.1l-1.1 4 4.3-2.5c.5.1 1.1.1 1.7.1 5.1 0 9.2-3.2 9.2-7.7S17.1 3 12 3z"/></svg>
    카카오로 시작하기
  </button>
  <button class="btn-social btn-social-google" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:14px;font-size:14px;">
    <svg viewBox="0 0 48 48" width="18" height="18"><path fill="#EA4335" d="M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.9-6.9C35.9 2.4 30.5 0 24 0 14.6 0 6.5 5.4 2.6 13.2l8 6.2C12.4 13.7 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M47 24.6c0-1.6-.2-3.1-.4-4.6H24v9h13c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 7.1-10.4 7.1-17.6z"/><path fill="#FBBC05" d="M10.5 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-8-6.2C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.2z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.2 1.5-4.9 2.3-8.2 2.3-6.3 0-11.6-4.2-13.5-9.9l-8 6.2C6.5 42.6 14.6 48 24 48z"/></svg>
    Google로 시작하기
  </button>
`)}
`;

const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DOACore 버튼 리디자인</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Noto+Sans+KR:wght@400;700&family=Jua&display=swap" rel="stylesheet">
<style>
/* 앱 테마 변수 (style.css 에서 필요한 것만 발췌) */
[data-theme="pink"]{--bg-color:#FFEFF6;--text-main:#B23A6E;--text-sub:#C97DA2}
[data-theme="blue"]{--bg-color:#A5D8FF;--text-main:#16457C;--text-sub:#4A7FB5}
[data-theme="green"]{--bg-color:#E8F8E4;--text-main:#1F6B3A;--text-sub:#5C8A6B}
[data-theme="dark"]{--bg-color:#060614;--text-main:#eef0ff;--text-sub:#8f93c4}
${css}
*{box-sizing:border-box}
body{margin:0;font-family:'Noto Sans KR',sans-serif;background:#E9EDF2;padding:0 0 60px}
.bar{position:sticky;top:0;z-index:9;background:#fff;padding:12px 16px;display:flex;gap:6px;
     box-shadow:0 1px 3px rgba(0,0,0,.1);flex-wrap:wrap;align-items:center}
.bar b{font-family:'Jua';font-size:15px;margin-right:6px}
.bar button{font-family:'Jua';font-size:13px;padding:8px 14px;border-radius:999px;border:1px solid #D3DAE3;
            background:#fff;cursor:pointer}
.bar button.on{background:#111827;color:#fff;border-color:#111827}
.stage{max-width:430px;margin:20px auto;padding:22px 18px;border-radius:26px;background:var(--bg-color);
       box-shadow:0 18px 50px -20px rgba(0,0,0,.35)}
.sec{margin-bottom:26px}
.sec-h{font-family:'Jua';font-size:14px;color:var(--text-main);margin-bottom:3px}
.sec-n{font-size:11.5px;color:var(--text-sub);margin-bottom:10px;line-height:1.5}
.sec-b{display:flex;flex-direction:column;gap:10px}
.sec-b>button{width:100%}
</style></head><body>
<div class="bar"><b>테마</b>
  ${THEMES.map(([id, label], i) => `<button data-t="${id}" class="${i === 0 ? 'on' : ''}">${label}</button>`).join('')}
</div>
<div class="stage" id="stage" data-theme="pink">${demo}</div>
<script>
document.querySelectorAll('.bar button').forEach(b=>{
  b.onclick=()=>{
    document.querySelectorAll('.bar button').forEach(x=>x.classList.remove('on'));
    b.classList.add('on');
    document.getElementById('stage').setAttribute('data-theme', b.dataset.t);
  };
});
</script></body></html>`;

fs.writeFileSync(path.join(ROOT, '_buttons_preview.html'), html, 'utf8');
console.log('✅ _buttons_preview.html');
