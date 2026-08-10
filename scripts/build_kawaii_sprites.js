/* =====================================================================
   5SECore — 몰랑몰랑 오리지널 캐릭터 스프라이트 생성기
   ---------------------------------------------------------------------
   assets/kawaii/*.svg 를 만들어 낸다.
   캐릭터 3종 x 표정/포즈 10종.

     🧸 영어곰   곰곰이  (핑크 테마)
     ☁️ 영어구름 구름이  (블루 테마)
     🌱 영어새싹 새싹이  (그린 테마)

   ▸ 디자인 규칙 (베이비 스키마)
     - 머리가 몸통보다 훨씬 크다
     - 눈은 크고 낮고 넓게, 흰 하이라이트 두 점
     - 입은 눈 바로 아래 아주 작은 ω
     - 볼터치는 얼굴 바깥쪽에 크고 흐리게
     - 외곽선은 검정이 아니라 테마색을 흐리게 뺀 색, 끝은 전부 둥글게
     - 눈썹은 그리지 않는다 (화나거나 무서워 보인다)
     - 벌린 입은 작고 둥글게 (크면 비명 지르는 것처럼 보인다)

   ▸ 실루엣 트릭
     겹친 도형 덩어리를 "선 두께 2배로 한 번 + 면만 한 번" 두 번 그리면
     안쪽 선은 면에 덮이고 바깥쪽 절반만 남아 통짜 외곽선이 된다.
     → 캐릭터는 반드시 "한 덩어리"로 보이게 (팔·다리가 따로 떠 있으면 기괴함)

   실행: node scripts/build_kawaii_sprites.js
   ===================================================================== */

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets', 'kawaii');
fs.mkdirSync(OUT, { recursive: true });

const SW = 5.5; // 외곽선 두께

/* ── 캐릭터별 팔레트 ───────────────────────────────────────────── */
const PAL = {
  bear: {
    ko: '곰곰이', body: '#FFFCF8', line: '#EFA9C6', ink: '#4A3B45',
    blush: '#FFAECB', inner: '#FFD3E4', belly: '#FFF0F7', shadow: '#F2BFD6',
    spark: '#FF8FC0', tongue: '#FF9BB8',
  },
  cloud: {
    ko: '구름이', body: '#FFFFFF', line: '#8DC3EC', ink: '#3C5170',
    blush: '#FFC0D4', inner: '#DCEEFF', belly: '#EFF8FF', shadow: '#B7DAF6',
    spark: '#6FB6EE', tongue: '#FF9BB8',
  },
  sprout: {
    ko: '새싹이', body: '#FCFFF7', line: '#8FCF9A', ink: '#3F5C46',
    blush: '#FFC0D4', inner: '#CFF2D4', belly: '#F0FBEE', shadow: '#BCE6C3',
    spark: '#5FC377', tongue: '#FF9BB8',
  },
};

/* ── 공용 얼굴 파츠 ────────────────────────────────────────────── */

// 눈 — open / happy(^^) / oops(그렁그렁) / sleep(⌒⌒) / love(♥♥) / shock(o o)
function eyes(c, cx, cy, gap, mood) {
  const L = cx - gap, R = cx + gap;
  const shine = (x) =>
    `<circle cx="${x + 3.4}" cy="${cy - 4}" r="3.1" fill="#fff"/>` +
    `<circle cx="${x - 3.2}" cy="${cy + 4.4}" r="1.7" fill="#fff" opacity=".7"/>`;

  const one = (x) => {
    switch (mood) {
      case 'happy':
        return `<path d="M${x - 12.5} ${cy + 4.5} q12.5 -16 25 0" fill="none" stroke="${c.ink}" stroke-width="5.8" stroke-linecap="round"/>`;
      case 'sleep':
        return `<path d="M${x - 11.5} ${cy - 1} q11.5 10 23 0" fill="none" stroke="${c.ink}" stroke-width="5.2" stroke-linecap="round"/>`;
      case 'love':
        return `<path d="M0 7 C-9 -2 -9 -13 -1.5 -13 C1 -13 2.8 -11.4 4 -9.6 C5.2 -11.4 7 -13 9.5 -13 C17 -13 17 -2 8 7 L4 11 Z" fill="#FF6FA8" transform="translate(${x - 4} ${cy - 1}) scale(.92)"/>`;
      case 'shock':
        return `<circle cx="${x}" cy="${cy}" r="10.5" fill="#fff" stroke="${c.ink}" stroke-width="4"/>` +
               `<circle cx="${x}" cy="${cy}" r="4.6" fill="${c.ink}"/>`;
      case 'oops':
        // 눈썹 없이 — 눈은 그대로 두고 눈물만 그렁그렁 (화나 보이지 않게)
        return `<ellipse cx="${x}" cy="${cy}" rx="9.5" ry="11" fill="${c.ink}"/>` + shine(x) +
               `<ellipse cx="${x}" cy="${cy + 13}" rx="7" ry="8" fill="#9FD1F2" opacity=".9"/>`;
      default:
        return `<ellipse cx="${x}" cy="${cy}" rx="9.5" ry="11" fill="${c.ink}"/>` + shine(x);
    }
  };
  return one(L) + one(R);
}

// 입 — omega(ω) / open(작고 둥글게) / wobble(울먹) / tiny(점) / oh(동그랗게)
function mouth(c, cx, cy, kind) {
  switch (kind) {
    case 'open':
      return `<path d="M${cx - 11} ${cy - 4} q11 18 22 0 z" fill="${c.ink}" stroke="${c.ink}" stroke-width="3.2" stroke-linejoin="round"/>` +
             `<path d="M${cx - 5} ${cy + 7} q5 6 10 0 z" fill="${c.tongue}"/>`;
    case 'wobble':
      return `<path d="M${cx - 12} ${cy + 4} q6 -8 12 0 q6 8 12 0" fill="none" stroke="${c.ink}" stroke-width="4.2" stroke-linecap="round"/>`;
    case 'oh':
      return `<ellipse cx="${cx}" cy="${cy + 1}" rx="7" ry="8.5" fill="${c.ink}"/>`;
    case 'tiny':
      return `<ellipse cx="${cx}" cy="${cy}" rx="4" ry="3.2" fill="${c.ink}"/>`;
    default: // omega
      return `<path d="M${cx - 12} ${cy - 3} q6 8 12 0 q6 8 12 0" fill="none" stroke="${c.ink}" stroke-width="4.2" stroke-linecap="round"/>`;
  }
}

function blush(c, cx, cy, gap, rx = 14, ry = 8.5) {
  return `<ellipse cx="${cx - gap}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c.blush}" opacity=".8"/>` +
         `<ellipse cx="${cx + gap}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c.blush}" opacity=".8"/>`;
}

/* 겹친 도형들을 한 덩어리 실루엣으로 (안쪽 선 없음) */
function silhouette(c, shapes, sw = SW) {
  const s = shapes.join('');
  return `<g fill="${c.body}" stroke="${c.line}" stroke-width="${sw * 2}" stroke-linejoin="round">${s}</g>` +
         `<g fill="${c.body}">${s}</g>`;
}

function svg(w, h, inner, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">${inner}</svg>`;
}

/* ── 장식 ──────────────────────────────────────────────────────── */
const heart = (x, y, s, fill) =>
  `<path d="M0 6 C-8 -2 -8 -12 -1 -12 C1.6 -12 3 -10.6 4 -9 C5 -10.6 6.4 -12 9 -12 C16 -12 16 -2 8 6 L4 10 Z" fill="${fill}" transform="translate(${x - 4 * s} ${y}) scale(${s})"/>`;
const sparkle = (x, y, s, fill, op = 1) =>
  `<path d="M0 -10 Q1.6 -1.6 10 0 Q1.6 1.6 0 10 Q-1.6 1.6 -10 0 Q-1.6 -1.6 0 -10 Z" fill="${fill}" opacity="${op}" transform="translate(${x} ${y}) scale(${s})"/>`;
const note = (x, y, s, fill) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}"><rect x="4" y="-16" width="3.2" height="18" rx="1.6"/><ellipse cx="0" cy="2" rx="6" ry="4.6" transform="rotate(-18)"/><path d="M4 -16 q9 2 9 7 q-4 -4 -9 -3z"/></g>`;
const zzz = (x, y, s, fill) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${fill}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">` +
  `<path d="M0 0 h13 l-13 15 h13"/><path d="M18 -20 h10 l-10 12 h10"/></g>`;

/* 포즈별 팔 각도 — [왼팔 회전, 오른팔 회전, 위로 들었나] */
const ARM = {
  idle:  [-14, 14, false],
  happy: [-42, 42, true],
  oops:  [-8, 8, false],
  cheer: [-52, 52, true],
  wave:  [-10, 62, 'right'],
  dance: [-70, 22, 'tilt'],
  sleep: [-6, 6, false],
  love:  [-34, 34, true],
  shock: [-30, 30, true],
};

function armPose(pose, cx, baseY, rx, ry, spanX) {
  const [aL, aR, up] = ARM[pose] || ARM.idle;
  const yL = up === true ? baseY - 30 : up === 'right' ? baseY : up === 'tilt' ? baseY - 22 : baseY;
  const yR = up === true ? baseY - 30 : up === 'right' ? baseY - 38 : up === 'tilt' ? baseY + 4 : baseY;
  const xL = cx - spanX + (up === true ? 6 : 0);
  const xR = cx + spanX - (up === true ? 6 : 0);
  return [
    `<ellipse cx="${xL}" cy="${yL}" rx="${rx}" ry="${ry}" transform="rotate(${aL} ${xL} ${yL})"/>`,
    `<ellipse cx="${xR}" cy="${yR}" rx="${rx}" ry="${ry}" transform="rotate(${aR} ${xR} ${yR})"/>`,
  ];
}

/* 포즈별 곁들임 */
function props(c, pose, W) {
  switch (pose) {
    case 'happy': return heart(W - 26, 52, 1.25, c.spark);
    case 'cheer': return sparkle(26, 58, 1.5, c.spark) + sparkle(W - 22, 96, 1.1, c.spark, .85) + heart(W - 30, 34, 1.4, '#FF6FA8');
    case 'love':  return heart(28, 60, 1.5, '#FF6FA8') + heart(W - 26, 44, 1.2, '#FF9BC4') + heart(W - 44, 96, .9, '#FFB6D3');
    case 'dance': return note(30, 66, 1.5, c.spark) + note(W - 30, 48, 1.2, c.spark);
    case 'sleep': return zzz(W - 62, 44, 1.2, c.ink);
    case 'shock': return `<path d="M${W - 46} 30 l10 26 -12 2 10 24" fill="none" stroke="#FFC94D" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'oops':  return '';
    default: return '';
  }
}

function faceMood(pose) {
  if (pose === 'cheer' || pose === 'dance') return 'happy';
  if (pose === 'wave') return 'happy';
  return pose;
}
function mouthKind(pose) {
  if (pose === 'oops') return 'wobble';
  if (pose === 'sleep') return 'tiny';
  if (pose === 'shock') return 'oh';
  if (['happy', 'cheer', 'dance', 'wave', 'love'].includes(pose)) return 'open';
  return 'omega';
}

/* =====================================================================
   🧸 영어곰 · 곰곰이
   ===================================================================== */
function bear(pose) {
  const c = PAL.bear, W = 220, H = 240;
  const HX = 110, HY = 94, EY = HY + 12, BY = HY + 27, MY = HY + 31;
  const tilt = pose === 'dance' ? -8 : 0;

  const body = silhouette(c, [
    `<ellipse cx="80" cy="216" rx="19" ry="13"/>`,
    `<ellipse cx="140" cy="216" rx="19" ry="13"/>`,
    ...armPose(pose, 110, 178, 15, 19, 60),
    `<ellipse cx="110" cy="184" rx="46" ry="40"/>`,
  ]);

  const head = silhouette(c, [
    `<circle cx="62" cy="48" r="27"/>`,
    `<circle cx="158" cy="48" r="27"/>`,
    `<ellipse cx="${HX}" cy="${HY}" rx="67" ry="58"/>`,
  ]);
  const ears = `<circle cx="62" cy="51" r="12.5" fill="${c.inner}"/><circle cx="158" cy="51" r="12.5" fill="${c.inner}"/>`;

  const face =
    blush(c, HX, BY, 54) +
    eyes(c, HX, EY, 29, faceMood(pose)) +
    `<ellipse cx="${HX}" cy="${MY - 10}" rx="5.5" ry="4.2" fill="${c.ink}"/>` +
    mouth(c, HX, MY, mouthKind(pose));

  return svg(W, H,
    `<ellipse cx="110" cy="230" rx="62" ry="9" fill="${c.shadow}" opacity=".38"/>` +
    body +
    `<ellipse cx="110" cy="190" rx="25" ry="19" fill="${c.belly}"/>` +
    `<g transform="rotate(${tilt} 110 150)">${head}${ears}${face}</g>` +
    props(c, pose, W),
    `${c.ko} ${pose}`);
}

/* =====================================================================
   ☁️ 영어구름 · 구름이  — 머리·몸이 한 덩어리인 몽실 구름
   ===================================================================== */
function cloud(pose) {
  const c = PAL.cloud, W = 220, H = 240;
  const HX = 110, EY = 116, BY = 132, MY = 136;
  const tilt = pose === 'dance' ? -8 : 0;

  // 발 → 팔 → 구름 몸통을 전부 한 실루엣으로 (따로 떠 있으면 기괴해 보인다)
  const whole = silhouette(c, [
    `<ellipse cx="84" cy="206" rx="19" ry="13"/>`,
    `<ellipse cx="136" cy="206" rx="19" ry="13"/>`,
    ...armPose(pose, 110, 158, 15, 18, 66),
    `<circle cx="66" cy="106" r="38"/>`,
    `<circle cx="110" cy="76" r="46"/>`,
    `<circle cx="156" cy="108" r="36"/>`,
    `<ellipse cx="110" cy="134" rx="72" ry="50"/>`,
  ]);

  const face =
    blush(c, HX, BY, 54) +
    eyes(c, HX, EY, 29, faceMood(pose)) +
    mouth(c, HX, MY, mouthKind(pose));

  return svg(W, H,
    `<ellipse cx="110" cy="218" rx="60" ry="9" fill="${c.shadow}" opacity=".4"/>` +
    `<g transform="rotate(${tilt} 110 150)">${whole}${face}</g>` +
    props(c, pose, W),
    `${c.ko} ${pose}`);
}

/* =====================================================================
   🌱 영어새싹 · 새싹이
   ===================================================================== */
function sprout(pose) {
  const c = PAL.sprout, W = 220, H = 244;
  const HX = 110, HY = 100, EY = HY + 12, BY = HY + 26, MY = HY + 30;
  const tilt = pose === 'dance' ? -8 : 0;

  const body = silhouette(c, [
    `<ellipse cx="82" cy="217" rx="18" ry="12"/>`,
    `<ellipse cx="138" cy="217" rx="18" ry="12"/>`,
    ...armPose(pose, 110, 182, 14, 18, 60),
    `<ellipse cx="110" cy="188" rx="43" ry="37"/>`,
  ]);

  const leaves =
    `<path d="M110 52 L110 20" fill="none" stroke="#5FBE72" stroke-width="7" stroke-linecap="round"/>` +
    `<path d="M110 30 C86 34 70 22 62 6 C90 -2 108 12 110 28 Z" fill="#7FDA95" stroke="#5FBE72" stroke-width="4.5" stroke-linejoin="round"/>` +
    `<path d="M110 36 C134 40 152 30 160 14 C132 6 112 20 110 34 Z" fill="#A9EBB7" stroke="#5FBE72" stroke-width="4.5" stroke-linejoin="round"/>`;

  const head = silhouette(c, [`<ellipse cx="${HX}" cy="${HY}" rx="62" ry="55"/>`]);

  const face =
    blush(c, HX, BY, 50) +
    eyes(c, HX, EY, 28, faceMood(pose)) +
    mouth(c, HX, MY, mouthKind(pose));

  return svg(W, H,
    `<ellipse cx="110" cy="234" rx="60" ry="9" fill="${c.shadow}" opacity=".42"/>` +
    body +
    `<g transform="rotate(${tilt} 110 160)">${leaves}${head}${face}</g>` +
    props(c, pose, W),
    `${c.ko} ${pose}`);
}

/* =====================================================================
   얼굴만 (카드 위 · 아이콘 · 로그인 화면용) — 잘리지 않게 여백 넉넉히
   ===================================================================== */
function face(kind, mood = 'idle') {
  const c = PAL[kind];
  if (kind === 'bear') {
    const HX = 116, HY = 104, EY = 116, BY = 131, MY = 135;
    return svg(232, 180,
      silhouette(c, [
        `<circle cx="68" cy="58" r="27"/>`, `<circle cx="164" cy="58" r="27"/>`,
        `<ellipse cx="${HX}" cy="${HY}" rx="67" ry="58"/>`,
      ]) +
      `<circle cx="68" cy="61" r="12.5" fill="${c.inner}"/><circle cx="164" cy="61" r="12.5" fill="${c.inner}"/>` +
      blush(c, HX, BY, 54) + eyes(c, HX, EY, 29, mood) +
      `<ellipse cx="${HX}" cy="${MY - 10}" rx="5.5" ry="4.2" fill="${c.ink}"/>` +
      mouth(c, HX, MY, mouthKind(mood)),
      `${c.ko} 얼굴`);
  }
  if (kind === 'cloud') {
    const HX = 116, EY = 106, BY = 122, MY = 126;
    return svg(232, 176,
      silhouette(c, [
        `<circle cx="72" cy="96" r="38"/>`, `<circle cx="116" cy="66" r="46"/>`,
        `<circle cx="162" cy="98" r="36"/>`, `<ellipse cx="116" cy="112" rx="70" ry="46"/>`,
      ]) +
      blush(c, HX, BY, 54) + eyes(c, HX, EY, 29, mood) + mouth(c, HX, MY, mouthKind(mood)),
      `${c.ko} 얼굴`);
  }
  const HX = 116, HY = 108, EY = 120, BY = 134, MY = 138;
  return svg(232, 180,
    `<path d="M116 60 L116 28" fill="none" stroke="#5FBE72" stroke-width="7" stroke-linecap="round"/>` +
    `<path d="M116 38 C92 42 76 30 68 14 C96 6 114 20 116 36 Z" fill="#7FDA95" stroke="#5FBE72" stroke-width="4.5" stroke-linejoin="round"/>` +
    `<path d="M116 44 C140 48 158 38 166 22 C138 14 118 28 116 42 Z" fill="#A9EBB7" stroke="#5FBE72" stroke-width="4.5" stroke-linejoin="round"/>` +
    silhouette(c, [`<ellipse cx="${HX}" cy="${HY}" rx="62" ry="55"/>`]) +
    blush(c, HX, BY, 50) + eyes(c, HX, EY, 28, mood) + mouth(c, HX, MY, mouthKind(mood)),
    `${c.ko} 얼굴`);
}

/* =====================================================================
   미니 얼굴 (진행바 · 뱃지 · 배경 패턴용)
   ===================================================================== */
function mini(kind) {
  const c = PAL[kind];
  const f = (shapes, ey) =>
    silhouette(c, shapes, 3) +
    `<ellipse cx="16" cy="${ey + 9}" rx="5.5" ry="3.4" fill="${c.blush}" opacity=".8"/>` +
    `<ellipse cx="64" cy="${ey + 9}" rx="5.5" ry="3.4" fill="${c.blush}" opacity=".8"/>` +
    `<circle cx="27" cy="${ey}" r="3.6" fill="${c.ink}"/><circle cx="53" cy="${ey}" r="3.6" fill="${c.ink}"/>` +
    `<path d="M35 ${ey + 10} q2.5 3.4 5 0 q2.5 3.4 5 0" fill="none" stroke="${c.ink}" stroke-width="1.9" stroke-linecap="round"/>`;

  if (kind === 'bear') {
    return svg(80, 76, f([
      `<circle cx="22" cy="21" r="11"/>`, `<circle cx="58" cy="21" r="11"/>`,
      `<ellipse cx="40" cy="42" rx="27" ry="24"/>`,
    ], 44) + `<circle cx="22" cy="22" r="5" fill="${c.inner}"/><circle cx="58" cy="22" r="5" fill="${c.inner}"/>`, '곰곰이 미니');
  }
  if (kind === 'cloud') {
    return svg(80, 76, f([
      `<circle cx="24" cy="36" r="16"/>`, `<circle cx="42" cy="26" r="18"/>`,
      `<circle cx="60" cy="38" r="14"/>`, `<ellipse cx="42" cy="44" rx="29" ry="17"/>`,
    ], 42), '구름이 미니');
  }
  return svg(80, 80,
    `<path d="M40 26 L40 10" fill="none" stroke="#5FBE72" stroke-width="3.4" stroke-linecap="round"/>` +
    `<path d="M40 15 C30 17 23 12 20 5 C32 2 39 8 40 14 Z" fill="#7FDA95" stroke="#5FBE72" stroke-width="2.2" stroke-linejoin="round"/>` +
    `<path d="M40 18 C50 20 58 15 61 8 C49 5 41 11 40 17 Z" fill="#A9EBB7" stroke="#5FBE72" stroke-width="2.2" stroke-linejoin="round"/>` +
    f([`<ellipse cx="40" cy="48" rx="26" ry="23"/>`], 50), '새싹이 미니');
}

/* ── 굽기 ─────────────────────────────────────────────────────── */
const POSES = ['idle', 'happy', 'oops', 'cheer', 'wave', 'dance', 'sleep', 'love', 'shock'];
const MAKERS = { bear, cloud, sprout };
const files = {};

for (const kind of Object.keys(MAKERS)) {
  for (const p of POSES) files[`${kind}-${p}.svg`] = MAKERS[kind](p);
  files[`${kind}-face.svg`] = face(kind, 'idle');
  files[`${kind}-face-happy.svg`] = face(kind, 'happy');
  files[`${kind}-mini.svg`] = mini(kind);
}

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(OUT, name), content, 'utf8');
}
console.log(`✅ ${Object.keys(files).length} sprites → assets/kawaii/`);
