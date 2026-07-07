// =============================================
// VocabMaster — app.js
// =============================================

// ---- 예시 데이터 ----
const EXAMPLE_WORDS = `abandon [v] 포기하다 / [v] 버리다
ability [n] 능력
absolute [adj] 절대적인
absorb [v] 흡수하다
abstract [adj] 추상적인 / [n] 요약
abundant [adj] 풍부한
accept [v] 받아들이다
accompany [v] 동반하다
achieve [v] 달성하다
acquire [v] 습득하다
adapt [v] 적응하다
affect [v] 영향을 미치다
aggressive [adj] 공격적인
allow [v] 허락하다
analyze [v] 분석하다
announce [v] 발표하다
apply [v] 지원하다 / [v] 적용하다
approach [n] 접근법 / [v] 다가가다
appropriate [adj] 적절한
assume [v] 가정하다
benefit [n] 이익 / [v] 혜택을 받다
challenge [n] 도전 / [v] 도전하다
complex [adj] 복잡한 / [n] 복합체
consider [v] 고려하다
define [v] 정의하다`.trim();

// ---- 단어 DB (하드코딩) ----
const WORD_DB = [
  {
    name: '기초 동사',
    words: `go [v] 가다
come [v] 오다
see [v] 보다
look [v] 보다 / [v] 보이다
know [v] 알다
think [v] 생각하다
get [v] 얻다 / [v] 되다
make [v] 만들다
give [v] 주다
take [v] 가져가다 / [v] 취하다
use [v] 사용하다
find [v] 찾다 / [v] 발견하다
tell [v] 말하다
ask [v] 묻다
work [v] 일하다 / [n] 일
seem [v] 보이다
feel [v] 느끼다
try [v] 시도하다
leave [v] 떠나다 / [v] 남기다
call [v] 부르다 / [v] 전화하다
keep [v] 유지하다 / [v] 계속하다
let [v] 허락하다
begin [v] 시작하다
show [v] 보여주다
hear [v] 듣다
play [v] 놀다 / [v] 연주하다
run [v] 달리다 / [v] 운영하다
move [v] 이동하다 / [v] 감동시키다
live [v] 살다
believe [v] 믿다`
  },
  {
    name: '기초 형용사',
    words: `good [adj] 좋은
bad [adj] 나쁜
big [adj] 큰
small [adj] 작은
new [adj] 새로운
old [adj] 오래된 / [adj] 나이 든
great [adj] 훌륭한
high [adj] 높은
low [adj] 낮은
long [adj] 긴
short [adj] 짧은 / [adj] 키가 작은
right [adj] 옳은 / [adj] 오른쪽의
wrong [adj] 틀린
hard [adj] 어려운 / [adj] 단단한
easy [adj] 쉬운
fast [adj] 빠른
slow [adj] 느린
happy [adj] 행복한
sad [adj] 슬픈
beautiful [adj] 아름다운
important [adj] 중요한
different [adj] 다른
real [adj] 진짜의
strong [adj] 강한
free [adj] 자유로운 / [adj] 무료의`
  },
  {
    name: 'TOEIC 핵심',
    words: `accommodate [v] 수용하다 / [v] 적응시키다
acquire [v] 습득하다 / [v] 인수하다
allocate [v] 할당하다
anticipate [v] 예상하다 / [v] 기대하다
assess [v] 평가하다
collaborate [v] 협력하다
commence [v] 시작하다
compensate [v] 보상하다
comply [v] 따르다 / [v] 준수하다
conduct [v] 실시하다 / [n] 행동
consolidate [v] 통합하다 / [v] 강화하다
coordinate [v] 조정하다 / [v] 조율하다
dedicate [v] 헌신하다 / [v] 바치다
delegate [v] 위임하다 / [n] 대표자
distribute [v] 배포하다 / [v] 분배하다
enforce [v] 시행하다 / [v] 강요하다
enhance [v] 향상시키다
establish [v] 설립하다 / [v] 확립하다
evaluate [v] 평가하다
facilitate [v] 촉진하다 / [v] 용이하게 하다
generate [v] 생성하다 / [v] 창출하다
implement [v] 시행하다 / [v] 구현하다
leverage [v] 활용하다 / [n] 영향력
maintain [v] 유지하다 / [v] 주장하다
negotiate [v] 협상하다
optimize [v] 최적화하다
oversee [v] 감독하다
prioritize [v] 우선시하다
procure [v] 조달하다 / [v] 획득하다
regulate [v] 규제하다 / [v] 조절하다
revise [v] 수정하다 / [v] 개정하다
streamline [v] 간소화하다 / [v] 효율화하다
submit [v] 제출하다 / [v] 복종하다
supervise [v] 감독하다
sustain [v] 지속하다 / [v] 유지하다
terminate [v] 종료하다 / [v] 해고하다
utilize [v] 활용하다 / [v] 이용하다
verify [v] 확인하다 / [v] 검증하다`
  },
  {
    name: '학술 어휘',
    words: `abstract [adj] 추상적인 / [n] 초록
ambiguous [adj] 모호한
analyze [v] 분석하다
hypothesis [n] 가설
phenomenon [n] 현상
paradigm [n] 패러다임 / [n] 전형적인 예
empirical [adj] 경험적인 / [adj] 실증적인
coherent [adj] 일관된 / [adj] 논리적인
synthesize [v] 종합하다 / [v] 합성하다
methodology [n] 방법론
quantitative [adj] 정량적인
qualitative [adj] 정성적인
inference [n] 추론 / [n] 결론
implication [n] 함의 / [n] 영향
variable [n] 변수 / [adj] 가변적인
correlation [n] 상관관계
substantial [adj] 상당한 / [adj] 실질적인
controversial [adj] 논란이 많은
comprehensive [adj] 포괄적인 / [adj] 종합적인
theoretical [adj] 이론적인
explicit [adj] 명시적인 / [adj] 노골적인
implicit [adj] 암묵적인 / [adj] 절대적인
preliminary [adj] 예비의 / [n] 예선
subsequent [adj] 이후의 / [adj] 뒤따르는
hierarchical [adj] 계층적인
concurrent [adj] 동시의 / [adj] 병행하는
arbitrary [adj] 임의적인 / [adj] 독단적인
fundamental [adj] 근본적인 / [n] 기본
perspective [n] 관점 / [n] 원근법
ambivalent [adj] 양가적인 / [adj] 모순된 감정의`
  }
];

// ---- 상태 (State) ----
const App = {
  words:      [],   // 전체 단어 객체 배열
  testPool:   [],   // 현재 라운드 테스트 풀 (오답만 남음)
  round:      1,
  phase:      'input',
  studyAbort: null, // AbortController
  paused:     false,
  resumeFn:   null,
};

// =============================================
// 파서 (Parser)
// =============================================
function parseWords(text) {
  const result = [];
  const lines = text.trim().split('\n');

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const firstBracket = line.indexOf('[');
    if (firstBracket === -1) continue;

    const word = line.substring(0, firstBracket).trim();
    if (!word) continue;

    const meaningsPart = line.substring(firstBracket);

    // ' / [' 패턴으로 복수 품사 분리
    const parts = meaningsPart.split(/ \/ (?=\[)/);
    const meanings = [];

    for (const part of parts) {
      const m = part.match(/\[([^\]]+)\]\s*(.+)/);
      if (m) {
        meanings.push({ pos: m[1].trim(), meaning: m[2].trim() });
      }
    }

    if (meanings.length > 0) {
      result.push({ word, meanings, attempts: 0, passed: false });
    }
  }

  return result;
}

// =============================================
// TTS
// =============================================
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'en-US';
  utt.rate = 0.85;
  utt.pitch = 1.0;
  utt.volume = 1.0;
  window.speechSynthesis.speak(utt);
}

// =============================================
// 유틸리티
// =============================================
function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(t);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    }
  });
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function checkPause() {
  if (!App.paused) return Promise.resolve();
  return new Promise(resolve => { App.resumeFn = resolve; });
}

// HTML 이스케이프
function esc(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// 뜻 HTML 생성
function meaningHTML(meanings) {
  return meanings.map(m =>
    `<div class="meaning-line">
       <span class="pos-badge">[${esc(m.pos)}]</span>
       <span>${esc(m.meaning)}</span>
     </div>`
  ).join('');
}

// =============================================
// ① 입력 화면
// =============================================
function initInputView() {
  const textarea = document.getElementById('word-input');
  const countEl  = document.getElementById('word-count');

  function updateCount() {
    const n = parseWords(textarea.value).length;
    countEl.textContent = `${n}개 단어`;
    countEl.style.color = n > 0 ? 'var(--blue)' : 'var(--text2)';
  }

  textarea.addEventListener('input', updateCount);

  // 예시 불러오기
  document.getElementById('btn-load-example').onclick = () => {
    textarea.value = EXAMPLE_WORDS;
    updateCount();
  };

  // DB 목록 로딩 (서버 API)
  loadDBList(textarea);

  // ── 웹용 단어 파일 업로드 및 브라우저 DB(LocalStorage) 저장 ──
  const fileInput = document.getElementById('btn-upload-db-file');
  const triggerBtn = document.getElementById('btn-trigger-upload');

  if (triggerBtn && fileInput) {
    triggerBtn.onclick = () => {
      fileInput.click();
    };

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const title = file.name.replace(/\.txt$/i, '');
      const reader = new FileReader();

      reader.onload = (event) => {
        const text = event.target.result;
        if (!text.trim()) {
          alert('내용이 비어 있는 텍스트 파일입니다.');
          return;
        }

        // 브라우저 저장소에 영구 저장 (Vercel 환경 동작의 핵심)
        localStorage.setItem(`vocab_file_${title}`, text);
        refreshDBList(textarea); // 단어 목록 새로고침
        
        // 업로드 완료 시 알림 및 선택 편의
        alert(`"${title}" 단어장이 목록에 추가되었습니다.`);
        fileInput.value = ''; // 초기화
      };

      reader.readAsText(file, 'UTF-8');
    };
  }

  // 학습 시작
  document.getElementById('btn-start').onclick = () => {
    const words = parseWords(textarea.value);
    if (words.length === 0) {
      alert('단어를 입력해주세요.');
      return;
    }
    App.words    = words;
    App.round    = 1;
    App.testPool = [];
    startStudy([...words]);
  };
}

// 기본 내장 단어 데이터 세트
const DEFAULT_DATABASES = {
  "기초 영단어 Day 1": `abandon [v] 포기하다 / [v] 버리다
ability [n] 능력
absent [adj] 결석한 / [adj] 부재한
accept [v] 받아들이다
accident [n] 사고 / [n] 우연
achieve [v] 달성하다
act [v] 행동하다 / [n] 행위
add [v] 더하다 / [v] 추가하다
admire [v] 감탄하다 / [v] 존경하다
adult [n] 성인 / [adj] 성인의`,
  "기초 영단어 Day 2": `amount [n] 양 / [n] 총액
ancient [adj] 고대의 / [adj] 오래된
angry [adj] 화난
announce [v] 발표하다 / [v] 알리다
another [adj] 또 다른 / [pron] 또 다른 것
answer [v] 대답하다 / [n] 대답
anxious [adj] 불안한 / [adj] 간절히 바라는`
};

// 로컬 저장소 기반 단어 리스트 로드
function loadDBList(textarea) {
  const statusEl = document.getElementById('worddb-status');
  
  // 최초 로드 시 기본 단어 세트 저장소에 등록
  if (!localStorage.getItem('vocab_db_initialized')) {
    for (const [title, content] of Object.entries(DEFAULT_DATABASES)) {
      localStorage.setItem(`vocab_file_${title}`, content);
    }
    localStorage.setItem('vocab_db_initialized', 'true');
  }

  refreshDBList(textarea);
}

// 저장된 단어 목록을 화면에 갱신하여 렌더링
function refreshDBList(textarea) {
  const listEl = document.getElementById('worddb-list');
  const statusEl = document.getElementById('worddb-status');
  listEl.innerHTML = '';
  selectedDBFiles = [];

  // 로컬 저장소에 저장된 모든 단어 파일 키 가져오기
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('vocab_file_')) {
      keys.push(key.replace('vocab_file_', ''));
    }
  }

  // 한글 오름차순 정렬
  keys.sort((a, b) => a.localeCompare(b, 'ko'));

  if (keys.length === 0) {
    if (statusEl) statusEl.textContent = '등록된 단어장이 없습니다. 파일을 추가해 주세요.';
    return;
  }

  if (statusEl) statusEl.textContent = '';

  // 병합 불러오기 버튼 래퍼 생성
  let actionWrapper = document.getElementById('worddb-action-wrapper');
  if (!actionWrapper) {
    actionWrapper = document.createElement('div');
    actionWrapper.id = 'worddb-action-wrapper';
    actionWrapper.className = 'worddb-action-wrapper';
    listEl.parentNode.insertBefore(actionWrapper, listEl.nextSibling);
  }

  actionWrapper.innerHTML = `
    <button id="btn-merge-db" class="btn-ghost" style="border-color: rgba(79,158,255,0.4); color: var(--blue);" disabled>
      선택한 단어장 합쳐서 불러오기 (0개)
    </button>
  `;

  const btnMerge = document.getElementById('btn-merge-db');

  keys.forEach(title => {
    const item = document.createElement('button');
    item.className = 'worddb-item';
    item.innerHTML = `
      <span class="worddb-item-checkbox"></span>
      <span class="worddb-item-name">${esc(title)}</span>
      <span class="worddb-item-delete" title="삭제" style="margin-left: 8px; color: var(--red); font-weight: bold; cursor: pointer;">✕</span>
    `;

    // 체크박스 클릭 토글 이벤트
    item.onclick = (e) => {
      // 삭제 버튼 클릭 시 이벤트 분기
      if (e.target.classList.contains('worddb-item-delete')) {
        e.stopPropagation();
        if (confirm(`"${title}" 단어장을 삭제하시겠습니까?`)) {
          localStorage.removeItem(`vocab_file_${title}`);
          refreshDBList(textarea);
        }
        return;
      }

      const idx = selectedDBFiles.indexOf(title);
      if (idx > -1) {
        selectedDBFiles.splice(idx, 1);
        item.classList.remove('active');
      } else {
        selectedDBFiles.push(title);
        item.classList.add('active');
      }

      if (selectedDBFiles.length > 0) {
        btnMerge.disabled = false;
        btnMerge.textContent = `선택한 단어장 합쳐서 불러오기 (${selectedDBFiles.length}개)`;
        btnMerge.style.background = 'rgba(79,158,255,0.15)';
      } else {
        btnMerge.disabled = true;
        btnMerge.textContent = '선택한 단어장 합쳐서 불러오기 (0개)';
        btnMerge.style.background = 'transparent';
      }
    };

    listEl.appendChild(item);
  });

  // 선택한 단어장 병합 로드
  btnMerge.onclick = () => {
    if (selectedDBFiles.length === 0) return;
    
    let combinedText = '';
    selectedDBFiles.forEach(title => {
      const content = localStorage.getItem(`vocab_file_${title}`);
      if (content) {
        combinedText += content.trim() + '\n';
      }
    });

    textarea.value = combinedText.trim();
    textarea.dispatchEvent(new Event('input'));
    textarea.focus();
  };
}

// =============================================
// ② 학습 화면 (자동재생)
// =============================================
async function startStudy(queue) {
  App.phase  = 'study';
  App.paused = false;

  // AbortController (건너뛰기 버튼용)
  App.studyAbort = new AbortController();
  const { signal } = App.studyAbort;

  showView('view-study');
  document.getElementById('study-round').textContent = App.round;
  document.getElementById('study-total').textContent = queue.length;

  // 일시정지 버튼
  const btnPause = document.getElementById('btn-study-pause');
  const iconEl   = document.getElementById('pause-icon');
  const labelEl  = document.getElementById('pause-label');

  btnPause.onclick = () => {
    if (App.paused) {
      App.paused = false;
      iconEl.textContent  = '⏸';
      labelEl.textContent = '일시정지';
      if (App.resumeFn) { App.resumeFn(); App.resumeFn = null; }
    } else {
      App.paused = true;
      iconEl.textContent  = '▶';
      labelEl.textContent = '계속하기';
    }
  };

  // 건너뛰기 버튼
  document.getElementById('btn-study-skip').onclick = () => {
    App.studyAbort.abort();
  };

  // 자동재생 루프
  try {
    for (let i = 0; i < queue.length; i++) {
      if (signal.aborted) break;
      await checkPause();

      document.getElementById('study-current').textContent = i + 1;
      const pct = ((i + 1) / queue.length * 100).toFixed(1);
      document.getElementById('study-progress-fill').style.width = pct + '%';

      await playWordStudy(queue[i], signal);

      // 단어 간 짧은 공백
      if (!signal.aborted) {
        clearStudyCard();
        await sleep(220, signal);
      }
    }
  } catch (e) {
    if (e.name !== 'AbortError') throw e;
  }

  window.speechSynthesis.cancel();
  clearStudyCard();
  startTest();
}

async function playWordStudy(wordObj, signal) {
  clearStudyCard();

  // ─ Phase 1: 단서 — TTS + 스펠링 동시 노옶 (~1.0s) ─
  speak(wordObj.word);
  document.getElementById('study-listening').classList.remove('hidden');
  const wordEl = document.getElementById('study-word');
  wordEl.textContent = wordObj.word;
  wordEl.classList.add('visible');
  await sleep(1000, signal);

  // ─ Phase 2: 회상 — 스펠링 유지, 뜻 가림 (1.5~2.0s → 1.75s) ─
  document.getElementById('study-listening').classList.add('hidden');
  document.getElementById('study-recall-hint').classList.remove('hidden');
  await sleep(1750, signal);

  // ─ Phase 3: 확인 — 스펠링 + 품사/뜻 동시 노칠, 클릭 대기 ─
  document.getElementById('study-recall-hint').classList.add('hidden');
  const meaningsEl = document.getElementById('study-meanings');
  meaningsEl.innerHTML = meaningHTML(wordObj.meanings);
  meaningsEl.classList.add('visible');
  document.getElementById('study-next-wrap').classList.remove('hidden');
  await waitForClickOrAbort('btn-study-next', signal);
  document.getElementById('study-next-wrap').classList.add('hidden');
}

function clearStudyCard() {
  document.getElementById('study-listening').classList.add('hidden');
  document.getElementById('study-recall-hint').classList.add('hidden');
  document.getElementById('study-next-wrap').classList.add('hidden');
  const w = document.getElementById('study-word');
  w.classList.remove('visible');
  w.textContent = '';
  const m = document.getElementById('study-meanings');
  m.classList.remove('visible');
  m.innerHTML = '';
}

// =============================================
// ③ 테스트 화면
// =============================================
function startTest() {
  App.phase = 'test';

  // 첫 라운드: 전체 단어 셔플 / 이후 라운드: 오답 단어 셔플
  if (App.round === 1) {
    App.testPool = shuffle([...App.words]);
  } else {
    App.testPool = shuffle(App.testPool);
  }

  showView('view-test');
  document.getElementById('test-round').textContent = App.round;

  runTestRound();
}

async function runTestRound() {
  const pool = App.testPool;
  const wrongThisRound = [];
  let correctThisRound = 0;

  for (let i = 0; i < pool.length; i++) {
    const wordObj = pool[i];

    // 진행 상태 업데이트
    document.getElementById('test-current').textContent = i + 1;
    document.getElementById('test-total').textContent   = pool.length;
    const pct = ((i + 1) / pool.length * 100).toFixed(1);
    document.getElementById('test-progress-fill').style.width = pct + '%';

    // 단어 표시
    document.getElementById('test-word').textContent = wordObj.word;

    // 뜻 숨김, 확인 버튼 표시
    document.getElementById('reveal-zone').classList.remove('hidden');
    document.getElementById('answer-zone').classList.add('hidden');

    // 뜻 확인 버튼 대기
    await waitForClick('btn-reveal');

    // 뜻 공개
    document.getElementById('reveal-zone').classList.add('hidden');
    document.getElementById('test-meanings').innerHTML = meaningHTML(wordObj.meanings);
    document.getElementById('answer-zone').classList.remove('hidden');

    // O / X 버튼 활성화
    setOXDisabled(false);

    // O 또는 X 클릭 대기
    const result = await waitForOX();

    // 클릭 후 버튼 비활성화 (더블클릭 방지)
    setOXDisabled(true);

    if (result === 'O') {
      wordObj.passed = true;
      correctThisRound++;
    } else {
      wordObj.attempts++;
      wrongThisRound.push(wordObj);
    }

    await sleep(180);
  }

  // 라운드 완료
  App.testPool = wrongThisRound;
  showRoundResult(correctThisRound, wrongThisRound.length);
}

function setOXDisabled(disabled) {
  document.getElementById('btn-correct').disabled = disabled;
  document.getElementById('btn-wrong').disabled   = disabled;
}

function waitForClick(btnId) {
  return new Promise(resolve => {
    const btn = document.getElementById(btnId);
    function handler() { btn.removeEventListener('click', handler); resolve(); }
    btn.addEventListener('click', handler);
  });
}

// 클릭 또는 abort 중 먹저 발생하는 것을 기다림 (Phase 3 확인 단계용)
function waitForClickOrAbort(btnId, signal) {
  return new Promise((resolve, reject) => {
    const btn = document.getElementById(btnId);
    function onAbort() { cleanup(); reject(new DOMException('Aborted', 'AbortError')); }
    function onClick()  { cleanup(); resolve(); }
    function cleanup() {
      btn.removeEventListener('click', onClick);
      if (signal) signal.removeEventListener('abort', onAbort);
    }
    btn.addEventListener('click', onClick);
    if (signal) signal.addEventListener('abort', onAbort);
  });
}

function waitForOX() {
  return new Promise(resolve => {
    const btnO = document.getElementById('btn-correct');
    const btnX = document.getElementById('btn-wrong');

    function cleanup() {
      btnO.removeEventListener('click', handleO);
      btnX.removeEventListener('click', handleX);
    }
    function handleO() { cleanup(); resolve('O'); }
    function handleX() { cleanup(); resolve('X'); }

    btnO.addEventListener('click', handleO);
    btnX.addEventListener('click', handleX);
  });
}

// =============================================
// ④ 라운드 결과 화면
// =============================================
function showRoundResult(correct, wrong) {
  showView('view-round-result');

  document.getElementById('round-num').textContent     = App.round;
  document.getElementById('round-correct').textContent = correct;
  document.getElementById('round-wrong').textContent   = wrong;

  const emoji = wrong === 0
    ? '🎉'
    : correct >= wrong ? '💪' : '📖';
  document.getElementById('round-result-emoji').textContent = emoji;

  const msg = wrong === 0
    ? '완벽합니다! 모든 단어를 암기했습니다. 최종 성적표를 확인하세요.'
    : `${wrong}개 단어를 다시 학습하고 테스트합니다. 화이팅!`;
  document.getElementById('round-message').textContent = msg;

  const btnNext = document.getElementById('btn-next-round');

  if (wrong === 0) {
    btnNext.textContent = '🏆 성적표 보기';
    btnNext.onclick = showFinalResult;
  } else {
    App.round++;
    btnNext.innerHTML = `Round ${App.round} 시작 →`;
    btnNext.onclick = () => startStudy([...App.testPool]);
  }
}

// =============================================
// ⑤ 최종 결과 화면
// =============================================
function showFinalResult() {
  showView('view-final');

  const all       = App.words;
  const hardWords = all.filter(w => w.attempts >= 3);

  document.getElementById('final-total').textContent  = all.length;
  document.getElementById('final-rounds').textContent = App.round;
  document.getElementById('final-hard').textContent   = hardWords.length;

  // 성적표 토글
  const tableSection = document.getElementById('table-section');
  document.getElementById('btn-toggle-table').onclick = () => {
    tableSection.classList.toggle('hidden');
  };

  // 오답 노트 재시험 버튼 (3회 이상 X)
  const btnRetry = document.getElementById('btn-retry-hard');
  if (hardWords.length > 0) {
    btnRetry.classList.remove('hidden');
    btnRetry.onclick = () => {
      // 오답 단어 초기화 후 재시험
      App.words    = hardWords.map(w => ({ ...w, attempts: 0, passed: false }));
      App.testPool = [];
      App.round    = 1;
      startStudy([...App.words]);
    };
  } else {
    btnRetry.classList.add('hidden');
  }

  // 성적표 테이블 생성 (시도 횟수 내림차순)
  const sorted = [...all].sort((a, b) => b.attempts - a.attempts);
  const tbody  = document.getElementById('result-tbody');

  tbody.innerHTML = sorted.map((w, i) => {
    const tries   = w.attempts + 1; // O를 누르기까지 걸린 총 시도 횟수
    const attCls  = tries >= 4 ? 'att-hard' : tries >= 2 ? 'att-mid' : 'att-easy';
    const meanTxt = w.meanings.map(m => `[${m.pos}] ${m.meaning}`).join(' / ');
    return `<tr>
      <td class="num-cell">${i + 1}</td>
      <td class="word-cell">${esc(w.word)}</td>
      <td>${esc(meanTxt)}</td>
      <td class="att-cell ${attCls}">${tries}회</td>
    </tr>`;
  }).join('');

  // CSV 다운로드
  document.getElementById('btn-download-csv').onclick = () => {
    const rows = [
      ['순위', '단어', '뜻', '시도횟수'],
      ...sorted.map((w, i) => [
        i + 1,
        w.word,
        w.meanings.map(m => `[${m.pos}] ${m.meaning}`).join(' / '),
        w.attempts + 1,
      ])
    ];
    const csv  = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\r\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), { href: url, download: 'vocab_results.csv' });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 처음부터 다시
  document.getElementById('btn-restart').onclick = () => {
    App.words    = [];
    App.testPool = [];
    App.round    = 1;
    // 입력창 초기화
    document.getElementById('word-input').value = '';
    document.getElementById('word-count').textContent = '0개 단어';
    document.getElementById('word-count').style.color = 'var(--text2)';
    showView('view-input');
  };
}

// =============================================
// 초기화
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initInputView();
});
