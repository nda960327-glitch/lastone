/* ═══════════════════════════════════════════════════════════════════
   DOACore — 🎪 캐릭터 커튼콜 (celebration.js)
   -------------------------------------------------------------------
   학습을 끝내면 곰곰이 · 구름이 · 새싹이가 무대로 나와 공연을 한다.
   공연은 12가지 중 랜덤이고, 레어 공연이 섞여 있으며,
   "몇 번째 공연을 봤는지"를 모아서 보여 준다.
   → 다음엔 무슨 공연이 나올지 궁금해서 또 하게 만드는 장치.

   API
     Celebration.show({ total, correct, wrong, minutes })
     Celebration.praise(ratio)        // 최종 칭찬 멘트 한 줄
     Celebration.roundPraise(c, w)    // 라운드 칭찬 멘트 한 줄
     Celebration.seenCount() / totalActs()
   ═══════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var SEEN_KEY = 'doacore_shows_seen';
  var CHARS = ['bear', 'cloud', 'sprout'];
  var NAMES = { bear: '곰곰이', cloud: '구름이', sprout: '새싹이' };

  // 기본은 파일 경로. 미리보기 페이지에서는 setSpriteResolver 로 갈아끼운다.
  var resolveSprite = function (kind, pose) { return 'assets/kawaii/' + kind + '-' + pose + '.svg'; };
  function sprite(kind, pose) { return resolveSprite(kind, pose); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function sfx(n) { if (global.SFX) global.SFX.play(n); }

  /* ── 🎭 공연 목록 ───────────────────────────────────────────── */
  /* poses: [곰곰이, 구름이, 새싹이] 순서. weight 가 클수록 자주 나온다. */
  var ACTS = [
    { id: 'linedance', tier: 'normal', weight: 10, name: '라인 댄스',
      poses: ['dance', 'dance', 'dance'],
      caption: '셋이 각 잡고 라인 댄스를 춘다. 박자는 아무도 안 맞는다.' },

    { id: 'jump', tier: 'normal', weight: 10, name: '만세 점프',
      poses: ['cheer', 'cheer', 'cheer'],
      caption: '동시에 폴짝! …구름이만 조금 늦게 떴다.' },

    { id: 'heartrain', tier: 'normal', weight: 9, name: '하트 소나기',
      poses: ['love', 'love', 'love'], props: 'hearts',
      caption: '하트를 던진다. 아낌없이 던진다. 좀 과하게 던진다.' },

    { id: 'spin', tier: 'normal', weight: 9, name: '빙글빙글',
      poses: ['happy', 'happy', 'happy'],
      caption: '기뻐서 제자리를 돈다. 어지러운 건 나중 문제다.' },

    { id: 'wave', tier: 'normal', weight: 9, name: '파도타기',
      poses: ['wave', 'wave', 'wave'],
      caption: '셋이서 파도타기. 관객은 당신 한 명뿐이다.' },

    { id: 'trophy', tier: 'normal', weight: 8, name: '시상식',
      poses: ['cheer', 'happy', 'happy'], props: 'trophy',
      caption: '곰곰이가 트로피를 들었다. 사실 아무도 안 줬다.' },

    { id: 'conga', tier: 'normal', weight: 8, name: '기차놀이',
      poses: ['wave', 'wave', 'wave'],
      caption: '칙칙폭폭. 어디로 가는지는 아무도 모른다.' },

    { id: 'bow', tier: 'normal', weight: 8, name: '정중한 인사',
      poses: ['happy', 'happy', 'happy'],
      caption: '90도로 인사한다. 오늘 공부해 줘서 고맙다고.' },

    /* ── 레어 ── */
    { id: 'slip', tier: 'rare', weight: 3, name: '곰곰이 꽈당',
      poses: ['oops', 'shock', 'shock'],
      caption: '곰곰이가 미끄러졌다. 둘은 놀랐다. 곰곰이는 아무렇지 않은 척한다.' },

    { id: 'rain', tier: 'rare', weight: 3, name: '구름이 소나기',
      poses: ['happy', 'shock', 'happy'], props: 'rain',
      caption: '구름이가 감격해서 울었다. 무지개가 떴으니 됐다.' },

    { id: 'giant', tier: 'rare', weight: 3, name: '새싹이 폭풍성장',
      poses: ['shock', 'shock', 'cheer'],
      caption: '새싹이가 갑자기 자랐다. 물을 너무 많이 준 것 같다.' },

    /* ── 초레어 ── */
    { id: 'fusion', tier: 'legend', weight: 1, name: '✨ 삼위일체 합체 ✨',
      poses: ['cheer', 'cheer', 'cheer'], props: 'burst',
      caption: '셋이 하나로 합쳐졌다. 왜 합쳐졌는지는 본인들도 모른다.' },
  ];

  /* ── 💬 칭찬 멘트 ──────────────────────────────────────────── */
  var PRAISE_PERFECT = [
    '한 개도 안 틀렸어요. 이건 그냥 실력입니다.',
    '만점. 더 보탤 말이 없네요.',
    '전부 맞혔어요. 오늘 뇌가 최상급이었습니다.',
    '완벽했어요. 곰곰이가 감동해서 말을 잃었어요.',
    '무결점 클리어! 이 페이지 캡처해 두세요.',
    '틀린 게 없어서 복습할 것도 없어요. 축하합니다.',
    '오늘의 우승자는 당신입니다. 이견 없음.',
    '이 정도면 단어장이 당신을 무서워할 차례예요.',
  ];
  var PRAISE_GREAT = [
    '거의 다 잡았어요. 남은 건 내일의 당신 몫!',
    '훌륭해요. 이 속도면 단어장이 금방 바닥나요.',
    '잘했어요! 흔들리던 단어들이 자리를 잡았어요.',
    '아주 좋아요. 뇌가 오늘 제대로 일했습니다.',
    '기억이 단단해졌어요. 내일이면 더 쉬워질 거예요.',
    '이만하면 대단해요. 새싹이가 박수치고 있어요.',
    '집중력이 좋았어요. 끝까지 흐트러지지 않았네요.',
    '오답이 몇 개 없어요. 그 몇 개가 진짜 보물이에요.',
    '깔끔한 마무리! 오늘 몫은 다 했습니다.',
    '좋은 흐름이에요. 이 감각 그대로 가져가세요.',
  ];
  var PRAISE_GOOD = [
    '끝까지 해낸 게 제일 중요해요. 잘했어요.',
    '어려운 걸 붙잡고 늘어졌네요. 그게 실력이 됩니다.',
    '오늘 넘긴 단어들이 내일은 훨씬 쉬워요.',
    '틀린 만큼 배웠어요. 손해 본 게 하나도 없습니다.',
    '포기 안 한 것만으로 이미 절반은 성공이에요.',
    '구름이가 수고했다고 전해달래요.',
    '이 정도 붙잡았으면 충분히 잘한 거예요.',
    '오답이 많은 날이 사실 제일 많이 느는 날이에요.',
    '뇌가 지금 열심히 정리 중이에요. 잘 하고 있어요.',
    '천천히 가도 괜찮아요. 방향은 정확합니다.',
  ];
  var PRAISE_TOUGH = [
    '오늘은 좀 매웠죠? 그래도 끝까지 앉아 있었어요.',
    '어려운 날이었어요. 그런데 도망 안 갔잖아요.',
    '이 단어들, 원래 다들 여기서 한 번 넘어져요.',
    '오늘 틀린 단어가 내일의 무기가 됩니다.',
    '많이 틀렸다는 건 그만큼 새로운 걸 만났다는 뜻이에요.',
    '곰곰이도 이 단어들은 어렵대요. 진짜예요.',
    '한 번에 되는 사람은 없어요. 내일 또 만나요.',
    '수고했어요. 오늘은 여기까지가 딱 좋아요.',
  ];

  var ROUND_MSG = [
    '좋아요, 이 흐름 그대로!',
    '몸 풀렸어요. 다음 라운드 갑시다.',
    '남은 단어만 잡으면 끝이에요.',
    '점점 줄어들고 있어요. 보이죠?',
    '지금 페이스 아주 좋아요.',
    '틀린 건 이제 표적이 됐어요. 도망 못 가요.',
    '한 라운드 더! 금방 끝나요.',
    '아까보다 확실히 빨라졌어요.',
    '뇌가 슬슬 예열됐어요.',
    '이 구간만 넘기면 확 쉬워져요.',
    '거의 다 왔어요. 조금만 더!',
    '오답이 줄어드는 소리가 들려요.',
    '집중 잘 하고 있어요. 계속 가요.',
    '새싹이가 응원 중이에요. 힘내요!',
    '지금 딱 좋은 리듬이에요.',
  ];

  function praise(ratio) {
    if (ratio >= 1) return pick(PRAISE_PERFECT);
    if (ratio >= 0.85) return pick(PRAISE_GREAT);
    if (ratio >= 0.6) return pick(PRAISE_GOOD);
    return pick(PRAISE_TOUGH);
  }
  function roundPraise(correct, wrong) {
    var head = pick(ROUND_MSG);
    return wrong > 0 ? head + ' (' + wrong + '개 다시 볼게요)' : head;
  }

  /* ── 수집 기록 ─────────────────────────────────────────────── */
  function seenSet() {
    try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]')); }
    catch (e) { return new Set(); }
  }
  function markSeen(id) {
    var s = seenSet(); var fresh = !s.has(id);
    s.add(id);
    try { localStorage.setItem(SEEN_KEY, JSON.stringify([].concat(Array.from(s)))); } catch (e) {}
    return fresh;
  }

  /* 가중치 뽑기 — 아직 못 본 공연에 가산점을 줘서 골고루 보이게 한다 */
  function rollAct() {
    var seen = seenSet();
    var pool = [];
    ACTS.forEach(function (a) {
      var w = a.weight * (seen.has(a.id) ? 1 : 2.2);
      for (var i = 0; i < Math.round(w * 10); i++) pool.push(a);
    });
    return pick(pool);
  }

  /* ── 🎊 색종이 ─────────────────────────────────────────────── */
  function confetti(canvas, ms) {
    var c = canvas.getContext('2d');
    var W, H, parts = [], raf, stop = false;
    var COLORS = ['#FF8FC0', '#6FBDF2', '#6FD48C', '#FFD36F', '#C89BF5', '#FFFFFF'];
    function size() {
      W = canvas.width = canvas.offsetWidth * (global.devicePixelRatio || 1);
      H = canvas.height = canvas.offsetHeight * (global.devicePixelRatio || 1);
    }
    size();
    for (var i = 0; i < 110; i++) {
      parts.push({
        x: Math.random() * W, y: -Math.random() * H,
        w: (6 + Math.random() * 7) * (global.devicePixelRatio || 1),
        h: (9 + Math.random() * 9) * (global.devicePixelRatio || 1),
        vy: (1.6 + Math.random() * 2.6) * (global.devicePixelRatio || 1),
        vx: (Math.random() - 0.5) * 1.6,
        rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.16,
        col: pick(COLORS),
      });
    }
    function frame() {
      if (stop) return;
      c.clearRect(0, 0, W, H);
      parts.forEach(function (p) {
        p.y += p.vy; p.x += p.vx; p.rot += p.vr;
        if (p.y > H + 30) { p.y = -30; p.x = Math.random() * W; }
        c.save(); c.translate(p.x, p.y); c.rotate(p.rot);
        c.fillStyle = p.col; c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        c.restore();
      });
      raf = requestAnimationFrame(frame);
    }
    frame();
    var timer = setTimeout(function () { stop = true; cancelAnimationFrame(raf); }, ms || 9000);
    return function () { stop = true; clearTimeout(timer); cancelAnimationFrame(raf); };
  }

  /* ── 소품 ──────────────────────────────────────────────────── */
  function propsHTML(kind) {
    if (kind === 'hearts') {
      var h = '';
      for (var i = 0; i < 9; i++) {
        h += '<span class="cel-heart" style="left:' + (6 + i * 11) + '%;animation-delay:' +
             (i * 0.22).toFixed(2) + 's">♥</span>';
      }
      return h;
    }
    if (kind === 'rain') {
      var r = '<div class="cel-rainbow"></div>';
      for (var j = 0; j < 16; j++) {
        r += '<span class="cel-drop" style="left:' + (5 + j * 6) + '%;animation-delay:' +
             (Math.random() * 1.1).toFixed(2) + 's"></span>';
      }
      return r;
    }
    if (kind === 'trophy') return '<span class="cel-trophy">🏆</span>';
    if (kind === 'burst') return '<div class="cel-burst"></div>';
    return '';
  }

  /* ── 무대 올리기 ───────────────────────────────────────────── */
  function show(stats) {
    stats = stats || {};
    var act = null;
    if (stats.forceAct) {
      act = ACTS.filter(function (a) { return a.id === stats.forceAct; })[0];
    }
    if (!act) act = rollAct();
    var fresh = markSeen(act.id);
    var seen = seenSet();
    var total = stats.total || 0;
    var correct = stats.correct == null ? total : stats.correct;
    var ratio = total ? Math.max(0, Math.min(1, correct / total)) : 1;

    var old = document.getElementById('cel-overlay');
    if (old) old.remove();

    var el = document.createElement('div');
    el.id = 'cel-overlay';
    el.className = 'cel-overlay cel-act-' + act.id + ' cel-tier-' + act.tier;
    el.innerHTML =
      '<canvas class="cel-confetti"></canvas>' +
      '<div class="cel-inner">' +
        '<div class="cel-title">' + (act.tier === 'legend' ? '🌟 초희귀 공연 🌟'
          : act.tier === 'rare' ? '✨ 희귀 공연 ✨' : '🎪 오늘의 공연') + '</div>' +
        '<div class="cel-actname">' + act.name + (fresh ? ' <em>NEW!</em>' : '') + '</div>' +
        '<div class="cel-stage">' +
          '<div class="cel-props">' + propsHTML(act.props) + '</div>' +
          CHARS.map(function (k, i) {
            return '<img class="cel-char cel-c' + (i + 1) + '" alt="' + NAMES[k] +
                   '" src="' + sprite(k, act.poses[i]) + '">';
          }).join('') +
        '</div>' +
        '<p class="cel-caption">' + act.caption + '</p>' +
        '<p class="cel-praise">' + praise(ratio) + '</p>' +
        '<div class="cel-collect">🎫 본 공연 <b>' + seen.size + '</b> / ' + ACTS.length +
          (seen.size < ACTS.length ? ' <span>— 아직 못 본 공연이 남아 있어요</span>'
                                   : ' <span>— 전부 모았어요! 대단해요 🎉</span>') + '</div>' +
        '<button class="cel-close" type="button">고마워, 계속할게 →</button>' +
      '</div>';

    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('is-on'); });

    var stopConfetti = confetti(el.querySelector('.cel-confetti'), 10000);

    sfx('fanfare');
    setTimeout(function () { sfx('boing'); }, 420);
    setTimeout(function () { sfx('confetti'); }, 900);
    if (act.tier !== 'normal') setTimeout(function () { sfx('twinkle'); }, 1400);

    var closed = false;
    function close() {
      if (closed) return;
      closed = true;
      stopConfetti();
      el.classList.remove('is-on');
      setTimeout(function () {
        el.remove();
        if (typeof stats.onClose === 'function') { try { stats.onClose(); } catch (e) {} }
      }, 320);
    }
    el.querySelector('.cel-close').addEventListener('click', close);
    el.addEventListener('click', function (e) { if (e.target === el) close(); });

    return act;
  }

  global.Celebration = {
    show: show,
    setSpriteResolver: function (fn) { if (typeof fn === 'function') resolveSprite = fn; },
    praise: praise,
    roundPraise: roundPraise,
    acts: ACTS,
    totalActs: function () { return ACTS.length; },
    seenCount: function () { return seenSet().size; },
  };
})(window);
