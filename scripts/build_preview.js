/* 캐릭터 + 커튼콜 공연을 한 파일로 묶어 미리보기용 HTML을 만든다.
   node scripts/build_preview.js  →  _kawaii_preview.html
   (개발 확인용. 배포에는 들어가지 않는다.) */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const KINDS = ['bear', 'cloud', 'sprout'];
const POSES = ['idle','happy','oops','cheer','wave','dance','sleep','love','shock','face','face-happy','mini'];

const data = {};
for (const k of KINDS) for (const p of POSES) {
  const f = path.join(ROOT, 'assets/kawaii', `${k}-${p}.svg`);
  data[`${k}-${p}`] = 'data:image/svg+xml,' + encodeURIComponent(fs.readFileSync(f, 'utf8'));
}

const css = fs.readFileSync(path.join(ROOT, 'kawaii.css'), 'utf8');
const cel = fs.readFileSync(path.join(ROOT, 'celebration.js'), 'utf8');

const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>DOACore 캐릭터 & 커튼콜 미리보기</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Jua&display=swap" rel="stylesheet">
<style>
${css}
body{margin:0;background:#EEF3F8;font-family:'Noto Sans KR',sans-serif;padding:16px 12px 60px}
h1{font-family:'Jua';font-size:20px;margin:0 0 4px}
h2{font-family:'Jua';font-size:15px;margin:26px 0 8px;color:#556}
.note{font-size:12.5px;color:#778;margin:0 0 8px;line-height:1.6}
.sheet{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px}
.cellw{border-radius:16px;padding:6px;text-align:center}
.cellw img{width:100%;height:104px;object-fit:contain;display:block}
.cellw span{font-size:10.5px;color:#667}
.bg-bear{background:#FFEFF6}.bg-cloud{background:#CDE8FB}.bg-sprout{background:#E8F8E4}
.acts{display:flex;flex-wrap:wrap;gap:6px}
.acts button{font-family:'Jua';font-size:12.5px;padding:8px 12px;border-radius:999px;border:2px solid #C9D5E2;background:#fff;cursor:pointer}
.acts button.rare{border-color:#D8B6EE;color:#8E4EC0}
.acts button.legend{border-color:#FFC46F;color:#C1751A}
</style></head><body data-theme="pink">
<h1>🧸 캐릭터 시트 &amp; 🎪 커튼콜 미리보기</h1>
<p class="note">아래 공연 버튼을 누르면 실제 앱에서 나오는 축하 화면이 그대로 뜹니다. (소리는 앱에서만)</p>

<h2>🎪 공연 12종 — 눌러서 확인</h2>
<div class="acts" id="acts"></div>

${KINDS.map(k => `<h2>${k === 'bear' ? '🧸 영어곰 곰곰이' : k === 'cloud' ? '☁️ 영어구름 구름이' : '🌱 영어새싹 새싹이'}</h2>
<div class="sheet">${POSES.map(p => `<div class="cellw bg-${k}"><img data-key="${k}-${p}"><span>${p}</span></div>`).join('')}</div>`).join('')}

<script>const SPRITES=${JSON.stringify(data)};
document.querySelectorAll('img[data-key]').forEach(i=>i.src=SPRITES[i.dataset.key]);
</script>
<script>${cel}</script>
<script>
// 미리보기에서는 스프라이트를 data URI 로 바꿔치기
Celebration.setSpriteResolver(function(kind,pose){ return SPRITES[kind+'-'+pose]; });
(function(){
  var box=document.getElementById('acts');
  Celebration.acts.forEach(function(a){
    var b=document.createElement('button');
    b.className=a.tier==='legend'?'legend':a.tier==='rare'?'rare':'';
    b.textContent=(a.tier==='legend'?'🌟 ':a.tier==='rare'?'✨ ':'')+a.name;
    b.onclick=function(){ Celebration.show({total:20,correct:18,forceAct:a.id}); };
    box.appendChild(b);
  });
})();
</script></body></html>`;

fs.writeFileSync(path.join(ROOT, '_kawaii_preview.html'), html, 'utf8');
console.log('✅ _kawaii_preview.html');
