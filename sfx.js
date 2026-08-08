/* ═══════════════════════════════════════════════════════════════════
   DOACore — 몰랑 효과음 엔진 (sfx.js)
   -------------------------------------------------------------------
   오디오 파일 없이 Web Audio API로 그때그때 합성한다.
     · 용량 0KB, 오프라인에서도 그대로 동작
     · 저작권 걱정 없음
     · 볼륨/톤을 코드로 바로 조절 가능

   쓰는 법
     SFX.play('tap')            // 아무 데서나
     SFX.setEnabled(false)      // 끄기 (localStorage 저장)
     SFX.isEnabled()

   버튼 클릭음은 document 레벨에서 자동으로 붙으므로
   화면을 새로 그려도 따로 손댈 필요가 없다.
   ═══════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var KEY = 'doacore_sfx_on';
  var ctx = null;
  var master = null;
  var enabled = localStorage.getItem(KEY) !== '0';
  var lastAt = 0;

  function ensure() {
    if (ctx) return ctx;
    var AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    } catch (e) { ctx = null; }
    return ctx;
  }

  /* ── 기본 목소리 하나 ────────────────────────────────────────── */
  // freq: Hz | at: 시작 지연(초) | dur: 길이(초) | type: 파형 | vol | slideTo: 끝 주파수
  function tone(o) {
    var c = ensure(); if (!c) return;
    var t0 = c.currentTime + (o.at || 0);
    var dur = o.dur || 0.12;
    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.freq, t0);
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t0 + dur);

    var peak = (o.vol == null ? 0.3 : o.vol);
    var atk = o.atk == null ? 0.008 : o.atk;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(g); g.connect(master);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  }

  /* ── 바람소리(노이즈) ───────────────────────────────────────── */
  function noise(o) {
    var c = ensure(); if (!c) return;
    var t0 = c.currentTime + (o.at || 0);
    var dur = o.dur || 0.2;
    var buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    var src = c.createBufferSource(); src.buffer = buf;
    var bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(o.from || 900, t0);
    bp.frequency.exponentialRampToValueAtTime(o.to || 2400, t0 + dur);
    bp.Q.value = 1.2;
    var g = c.createGain();
    g.gain.setValueAtTime(o.vol == null ? 0.16 : o.vol, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bp); bp.connect(g); g.connect(master);
    src.start(t0); src.stop(t0 + dur);
  }

  // 음이름 → Hz (A4 = 440)
  var NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function hz(name) {
    var m = /^([A-G])(#?)(\d)$/.exec(name);
    if (!m) return 440;
    var n = NOTE[m[1]] + (m[2] ? 1 : 0) + (parseInt(m[3], 10) + 1) * 12;
    return 440 * Math.pow(2, (n - 69) / 12);
  }
  // 멜로디 한 줄
  function melody(notes, opt) {
    opt = opt || {};
    var step = opt.step || 0.09;
    notes.forEach(function (n, i) {
      if (!n) return;
      tone({
        freq: hz(n), at: (opt.at || 0) + i * step, dur: opt.dur || step * 1.7,
        type: opt.type || 'triangle', vol: opt.vol == null ? 0.26 : opt.vol,
      });
    });
  }

  /* ── 효과음 목록 ────────────────────────────────────────────── */
  var BANK = {
    // 어디든 눌렀을 때 — 아주 짧고 부드러운 "톡"
    tap: function () {
      tone({ freq: 620, slideTo: 880, dur: 0.07, type: 'sine', vol: 0.2 });
    },
    // 주요 버튼 — 조금 더 통통한 "뽕"
    pop: function () {
      tone({ freq: 480, slideTo: 900, dur: 0.11, type: 'sine', vol: 0.3 });
      tone({ freq: 960, dur: 0.06, at: 0.03, type: 'sine', vol: 0.12 });
    },
    // 토글 켜기 / 끄기
    on:  function () { melody(['E5', 'A5'], { step: 0.07, vol: 0.22 }); },
    off: function () { melody(['A5', 'E5'], { step: 0.07, vol: 0.18 }); },
    // 화면 넘김
    swipe: function () { noise({ dur: 0.18, from: 700, to: 2600, vol: 0.1 }); },
    // 모달
    open:  function () { melody(['C5', 'F5'], { step: 0.06, vol: 0.18 }); },
    close: function () { melody(['F5', 'C5'], { step: 0.06, vol: 0.15 }); },
    // ⭕ 정답 — 밝게 올라가는 3음
    yes: function () {
      melody(['E5', 'G5', 'C6'], { step: 0.075, dur: 0.16, type: 'triangle', vol: 0.28 });
      tone({ freq: 2100, at: 0.16, dur: 0.12, type: 'sine', vol: 0.07 });
    },
    // ❌ 오답 — 혼내는 느낌 없이 "아쉽다" 정도로만
    no: function () {
      melody(['A4', 'F4'], { step: 0.1, dur: 0.2, type: 'sine', vol: 0.2 });
    },
    // 시간 초과
    timeup: function () {
      melody(['D5', 'C5', 'A4'], { step: 0.085, dur: 0.18, type: 'sine', vol: 0.2 });
    },
    // 라운드 클리어
    round: function () {
      melody(['C5', 'E5', 'G5', 'C6'], { step: 0.1, dur: 0.24, type: 'triangle', vol: 0.26 });
      tone({ freq: 1600, at: 0.4, dur: 0.3, type: 'sine', vol: 0.08 });
    },
    // 최종 완료 팡파레
    fanfare: function () {
      melody(['C5', 'C5', 'C5', 'C5'], { step: 0.11, dur: 0.1, type: 'square', vol: 0.13 });
      melody(['G5', 'C6', 'E6', 'G6'], { at: 0.44, step: 0.13, dur: 0.3, type: 'triangle', vol: 0.28 });
      melody(['E6', 'G6', 'C7'], { at: 1.0, step: 0.1, dur: 0.5, type: 'triangle', vol: 0.24 });
      for (var i = 0; i < 6; i++) {
        tone({ freq: 1800 + Math.random() * 1600, at: 1.1 + i * 0.09, dur: 0.22, type: 'sine', vol: 0.07 });
      }
    },
    // 폭죽
    confetti: function () {
      noise({ dur: 0.35, from: 400, to: 3200, vol: 0.14 });
      tone({ freq: 300, slideTo: 1400, dur: 0.2, type: 'sawtooth', vol: 0.09 });
    },
    // 캐릭터 등장
    boing: function () {
      tone({ freq: 220, slideTo: 700, dur: 0.16, type: 'sine', vol: 0.26 });
      tone({ freq: 700, slideTo: 380, dur: 0.14, at: 0.15, type: 'sine', vol: 0.2 });
    },
    // 레어 연출 등장 알림
    twinkle: function () {
      melody(['G5', 'B5', 'D6', 'G6', 'B6'], { step: 0.055, dur: 0.35, type: 'sine', vol: 0.16 });
    },
    // 숫자 카운트
    tick: function () { tone({ freq: 1400, dur: 0.035, type: 'square', vol: 0.07 }); },
  };

  /* ── 공개 API ───────────────────────────────────────────────── */
  var SFX = {
    play: function (name) {
      if (!enabled) return;
      var fn = BANK[name];
      if (!fn) return;
      var c = ensure(); if (!c) return;
      if (c.state === 'suspended') { try { c.resume(); } catch (e) {} }
      try { fn(); } catch (e) { /* 소리 때문에 앱이 멈추면 안 된다 */ }
    },
    isEnabled: function () { return enabled; },
    setEnabled: function (v) {
      enabled = !!v;
      localStorage.setItem(KEY, enabled ? '1' : '0');
      if (enabled) SFX.play('on');
    },
    toggle: function () { SFX.setEnabled(!enabled); return enabled; },
  };
  global.SFX = SFX;

  /* ── 버튼 클릭음 자동 부착 ──────────────────────────────────── */
  // 화면이 동적으로 다시 그려져도 계속 동작하도록 document에 위임한다.
  var LOUD = {           // 소리를 따로 지정할 요소
    'btn-correct': 'yes',
    'btn-wrong': 'no',
    'btn-reveal': 'pop',
    'btn-next-round': 'pop',
    'btn-next-word': 'swipe',
    'btn-prev-word': 'swipe',
    'btn-login-skip': 'pop',
    'btn-login-google-main': 'pop',
    'btn-dictation': 'pop',
    'btn-review-wrong-words': 'pop',
    'btn-settings': 'open',
    'btn-pause-study': 'on',
  };
  var CLOSERS = /close|cancel|ok$|-ok$|skip/i;

  function pick(el) {
    if (el.id && LOUD[el.id]) return LOUD[el.id];
    if (el.classList.contains('btn-range-item')) return 'pop';
    if (el.classList.contains('tab-btn')) return 'tap';
    if (el.classList.contains('theme-btn')) return 'twinkle';
    if (el.classList.contains('btn-primary')) return 'pop';
    if (el.id && CLOSERS.test(el.id)) return 'close';
    if (el.type === 'checkbox') return el.checked ? 'off' : 'on'; // 값이 바뀌기 전이라 반대
    return 'tap';
  }

  document.addEventListener('pointerdown', function (e) {
    var el = e.target.closest(
      'button, .tab-btn, .btn-range-item, .theme-btn, [role="button"], label.swipe-toggle-label, input[type="checkbox"]'
    );
    if (!el) return;
    var now = Date.now();
    if (now - lastAt < 45) return; // 연타 시 소리 뭉침 방지
    lastAt = now;
    SFX.play(pick(el));
  }, true);

  // 첫 터치에서 오디오 잠금 해제 (모바일 자동재생 정책)
  function unlock() {
    var c = ensure();
    if (c && c.state === 'suspended') { try { c.resume(); } catch (e) {} }
    document.removeEventListener('pointerdown', unlock, true);
    document.removeEventListener('keydown', unlock, true);
  }
  document.addEventListener('pointerdown', unlock, true);
  document.addEventListener('keydown', unlock, true);
})(window);
