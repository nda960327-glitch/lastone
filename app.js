// =============================================
// VocabMaster — app.js
// =============================================

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyAeLZog0wbtVULUAq2RfyHwiADqQtOfXig",
  authDomain: "doacore.firebaseapp.com",
  projectId: "doacore",
  storageBucket: "doacore.firebasestorage.app",
  messagingSenderId: "760005417553",
  appId: "1:760005417553:web:5a38511bc12fd4b531b670",
  measurementId: "G-PGN0N4686E"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  // Enable offline persistence
  firebase.firestore().enablePersistence().catch(function(err) {
    if (err.code == 'failed-precondition') {
      console.warn("Multiple tabs open, persistence can only be enabled in one tab at a a time.");
    } else if (err.code == 'unimplemented') {
      console.warn("The current browser does not support all of the features required to enable persistence");
    }
  });
}
const db = typeof firebase !== 'undefined' ? firebase.firestore() : null;
const auth = typeof firebase !== 'undefined' ? firebase.auth() : null;

// Global Auth State
let currentUser = null;
let currentAcademyId = null; // null means not assigned yet

// Sync Helper
function setProgressSync(key, value) {
  localStorage.setItem(key, value);
  if (currentUser && db) {
    db.collection('users').doc(currentUser.uid).collection('progress').doc(key).set({
      value: value,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(err => console.error("Sync up failed", err));
  }
}

function recordStudyTime() {
  if (App.sessionStartTime) {
    const elapsedSeconds = Math.floor((Date.now() - App.sessionStartTime) / 1000);
    console.log('[TIME] sessionStartTime:', App.sessionStartTime, 'elapsed:', elapsedSeconds, 'DBName:', App.currentDBName, 'Section:', App.currentSection);
    if (elapsedSeconds > 0 && App.currentDBName && App.currentSection) {
      const key = `${App.currentDBName}_${App.currentSection}`;
      
      let studyTime = {};
      try { studyTime = JSON.parse(localStorage.getItem('vocab_study_time') || '{}'); } catch(e){}
      studyTime[key] = (studyTime[key] || 0) + elapsedSeconds;
      console.log('[TIME] Saving key:', key, 'total seconds:', studyTime[key]);
      setProgressSync('vocab_study_time', JSON.stringify(studyTime));
    }
    App.sessionStartTime = null; // 리셋
  } else {
    console.log('[TIME] recordStudyTime called but sessionStartTime is null');
  }
}

// ---- 예시 데이터 (기초 영단어 day1 전체) ----
const EXAMPLE_WORDS = `skill [n] 기술
cash [n] 현금
replace [v] 대체하다, 바꾸다
further [a] 그 이상의, 여분의 / [ad] 더 멀리, 게다가
engage [v] 종사하다 ; 고용하다 ; 약혼하다, 약속하다
invent [v] 발명하다
throw [v] 던지다
overhear [v] 우연히 듣다, 엿듣다
flood [n] 홍수, 범람, 쇄도 / [v] 범람하다, 침수하다
universe [n] 우주, 전세계
subject [n] 주제 ; 실험대상 ; 신하 / [v] 드러내다, 노출시키다 / [a] ~하기 쉬운, 영향을 받는
background [n] 배경
marble [n] 대리석
sleep [v] 자다
arrest [v] 체포하다, 검거하다 / [n] 체포
locate [v] 놓다 , 위치하다 ; 찾아내다
important [a] 중요한
pull [v] 잡아당기다, 끌다; 뽑다 / [n] 끌기, 끌어당기기
candle [n] 양초, 촛불
lantern [n] 랜턴
beer [n] 맥주
happy [a] 행복한, 기쁜
none [pron] 아무도 ~않다 / [a] 아무도 ~않다 / [ad] 아무도 ~않다
drown [v] 물에 빠지다, 익사하다
especially [ad] 특별히
grab [v] 붙잡다
dull [a] 흐릿한 ; 무딘, 둔한 ; 따분한
expect [v] 기대하다, 예기하다
sharp [a] 날카로운 ; 급격한
state [n] 상태 ; 나라, 국가 / [v] 진술하다, 주장하다
clever [a] 영리한, 현명한
heat [n]열, 더위 / [v] 가열하다, 데우다
handshake [n] 악수
musician [n] 음악가
interest [n] 흥미, 이익 ; 이자 / [v] 관심을 갖게 하다
complain [v] 불평하다 ; 한탄하다
instrument [n] 기계, 기구
frog [n] 개구리
reason [n] 이유, 원인, 이성 / [v] 추론하다, 사고하다
peaceful [a] 평온한, 조용한
possible [a] 가능한
toward [prep] ~쪽으로, ~를 향하여
angry [a] 성난, 노한
danger [n] 위험
section [n] 부분, 구역, 분할
bottom [n] 바닥, 아래, 밑바닥 / [v] 근거를 두다.
pick [v] 고르다, 선택하다, 줍다 / [n] 선택권
beast [n] 짐승
beach [n] 해안
method [n] 방법, 방식, 체계
hurt [v] 다치게 하다 / [n] 부상
library [n] 도서관
earning [n] 소득
battle [n] 전투 / [v] 싸우다
chance [n] 우연 ; 가능성 ; 기회
evil [a] 나쁜, 사악한
but [ad] 단지, 다만 / [prep] ~을 제외하고 / [conj] 그러나
revival [n] 재생, 회복, 부활
ground [n] 기초, 근거 ; 지면, 땅, 운동장 / [v] 근거를 두다
towel [n] 수건, 타월
step [n] 걸음 ; 정도, 수준 / [v] 걷다
system [n] 체계, 조직 ; 방식
precious [a] 귀중한, 값어치 있는
purpose [n] 목적, 용도
surprise [v] 놀라게 하다 / [n] 놀람, 놀라운 일
stay [v] 머무르다, 체류하다 ; 유지하다
mankind [n] 인류, 인간
problem [n] 문제, 과제, 고민
comb [n] 빗 / [v] 빗질하다 ; 찾다
monk [n] 승려
entire [a] 전체의
past [a] 과거의 / [prep] ~을 지나서 / [n] 과거
hop [n] 깡충 뛰기 / [v] 한발로 뛰다
fact [n] 사실
symbol [n] 상징
track [v] 추적하다 / [n] 지나간 자취, 흔적
fortunately [ad] 운좋게, 다행히
activity [n] 활동, 활기
math [n] 수학
resource [n] 자원, 수단
greeting [n] 인사, 환영
site [n] 위치, 장소
fun [n] 재미, 즐거움 / [a] 즐거운
quarter [n] 4분의 1 ; 부분 ; 구역 ; 거주지
snake [n] 뱀 / [v] (뱀처럼) 구불구불 가다
merry [a] 명랑한, 즐거운
throat [n] 목구멍
salt [n] 소금
telephone [n] 전화
temperature [n] 온도, 열
turn [n] 차례, 전환 / [v] 변하다, 달라지다 ; 방향을 바꾸다
religious [a] 종교적인 ; 독실한
explain [v] 설명하다, 해명하다
collect [v] 모으다, 수집하다
deserve [v] ~받을 만하다, ~할 가치가 있다
prepare [v] 준비하다, 각오하다
shadow [n] 그림자 / [v] 그늘지게 하다 ; 뒤를 따라가다
sink [v] 아래로 가라앉다
laundry [n] 세탁물
flute [n] 플룻, 피리
envelope [n] 봉투 / [v] 감싸다, 뒤덮다
independent [a] 독립적인, 자주의 ; 독자적인
surface [n] 표면 / [v] (어둠 속이나 숨어 있던 곳에서) 나오다 ,모습을 드러내다
powder [n] 가루, 화약
rainbow [n] 무지개
spade [n] 삽
umbrella [n] 우산 / [a] 포괄적인
license [n] 면허
raise [n] 인상, 증가 / [v] 기르다, 사육하다 ; 올리다 ; 야기하다
damage [n] 손해, 피해 / [v] 손해를 입히다
gesture [n] 몸짓
couple [n] 한쌍
taste [n] 맛, 취향 / [v] 맛보다
folk [n] 사람들 / [a] 민속의, 전통의
luck [n] 행운
greedy [a] 욕심 많은
clean [a] 청결한, 깨끗한 ; 살균의, 위생적인 / [v] 깨끗하게 하다
crash [n] 굉음, 추락, 충돌 / [v] 충돌하다
leap [v] 껑충 뛰다, 뛰어넘다 / [n] 도약, 점프
though [conj] ~임에도 불구하고 / [ad] 그러나
store [n] 가게, 저장 / [v] 따로 떼어두다, 저장하다
bathroom [n] 욕실
foolish [a] 어리석은, 바보 같은
republic [n] 공화국
daughter [n] 딸
dictionary [n] 사전
sheet [n] 시트, 종이 한장 ; 평평한 지역
without [prep] ~없이, 제외하고
weather [n] 날씨, 기후 / [v] (어려움 등을) 견디다 ; 풍화하다
semester [n] 학기
fear [n] 두려움, 공포 / [v] 두려워하다
afraid [a] 두려운
sick [a] 병든 ; 싫증난
president [n] 대통령, 장(長)
cloudy [a] 구름이 낀
furniture [n] 가구
ostrich [n] 타조
culture [n] 문화 / [v] 배양하다
certain [a] 특정한 ; 자신하는 , 확실한
treat [v] 대접하다, 다루다
weak [a] 약한, 허약한
howl [v] 울부짖다
stadium [n] 경기장
french [n] 프랑스 사람, 프랑스어
below [prep] ~보다 아래에 / [ad] ~보다 아래에
torch [n] 횃불 / [v] 방화하다
area [n] 범위, 영역 ; 지역
fare [n] 운임 ; 승객
wealth [n] 부, 재산 ; 풍부
democracy [n] 민주주의, 민주정치, 자치
trick [n] 장난 ; 속임수 ; 묘기, 재주 / [v] 속이다
goal [n] 목적, 목표, 골
foreign [a] 외국의, 익숙치 않은
astonish [v] 놀라게 하다
harmful [a] 해로운
voyage [n] 항해, 항행 / [v] 항해하다
dig [v] 파다
brown [a] 갈색의 / [n] 갈색
invite [v] 초대하다
photographer [n] 사진사
rate [v] 평가하다 , 등급을 매기다 / [n] 속도 ; 비율 ; 가격, 요금
own [v] 소유하다 / [a] 자기자신의, 고유한
iceberg [n] 빙산
delight [n] 황홀경, 기쁨 / [v] 기쁘게 하다
rat [n] 쥐, 들쥐
promise [n] 약속 / [v] 약속하다
art [n] 예술, 미술 ; 기술
castle [n] 성
sophomore [n] 2학년생
memory [n] 기억, 추억
return [v] 돌아오다; 돌려주다, 반납하다, 되돌아가다 / [n] 돌아옴, 귀환; 반납
correctly [ad] 적당하게, 알맞게
scare [n] 공포 / [v] 두려워하게 하다, 깜짝 놀라게 하다
pleasant [a] 기분 좋은, 유쾌한
handsome [a] 잘생긴, 멋진
disappoint [v] 좌절시키다
joy [n] 기쁨
date [n] 날짜 ; 약속 / [v] ~의 연대를 추정하다
puzzle [n] 수수께끼, 당황 / [v] 당혹하게 하다
badly [ad] 나쁘게, 심하게 ; 서투르게
route [n] 길, 노선, 항로
weight [n] 무게 ; 중요성
energy [n] 힘, 활기
fault [n] 결점, 흠 ; 단층 (지질학)
hero [n] 영웅
tail [n] 꼬리, 끝 / [v] 첨부하다 ; 미행하다
devil [n] 악마
neighbor [n] 이웃사람
vacation [n] 휴가
tooth [n] 이
rope [n] 밧줄
merchant [n] 상인
force [n] 힘, 세력 / [v] 강제하다, 강요하다
price [n] 가격, 가치
follow [v] 뒤따르다 ; ~의 결과로 일어나다
canal [n] 운하
occur [v] 일어나다, 생기다
grave [n] 무덤 / [a] 중대한, 근엄한 ; 엄숙한
mail [n] 우편물 / [v] 발송하다
coal [n] 석탄`.trim();

// ---- 상태 (State) ----
let isDictationMode = false;
let alwaysShowDictationMeaning = localStorage.getItem('dictation_meaning_visible') === 'true';
let currentCategory = localStorage.getItem('saved_category') || 'toefl';
let savedDayStr = localStorage.getItem('saved_day');
let currentDay = (savedDayStr && savedDayStr !== 'null') ? (isNaN(savedDayStr) ? savedDayStr : parseInt(savedDayStr, 10)) : null;

let currentAudio = null;

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
  }
});


function parseWordText(rawText, categoryName, defaultDay) {
  if (!rawText) return [];
  rawText = rawText.replace(/\n\s*\[\s*/g, " [");
  const lines = rawText.split('\n');
  const parsedWords = [];
  lines.forEach(line => {
    line = line.replace(/\r/g, '').trim();
    if (!line) return;
    const wordMatch = line.match(/^(.+?)\s*\[([^\]]+)\]\s*(.+)$/);
    if (wordMatch) {
      const rawWord = wordMatch[1].trim();
      const rawPos = wordMatch[2].split(',').map(s => s.trim());
      const rawMeaning = wordMatch[3].trim();
      const lastWord = parsedWords.length > 0 ? parsedWords[parsedWords.length - 1] : null;
      if (lastWord && lastWord.word === rawWord) {
        lastWord.partOfSpeech.push(...rawPos);
        lastWord.meaning += ` / ${rawMeaning}`;
      } else {
        parsedWords.push({
          word: rawWord,
          partOfSpeech: rawPos,
          meaning: rawMeaning,
          totalFails: 0,
          category: categoryName,
          day: defaultDay
        });
      }
    } else {
      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        const rawWord = parts[0];
        const rawMeaning = parts.slice(1).join(' ');
        parsedWords.push({
          word: rawWord,
          partOfSpeech: ['n'],
          meaning: rawMeaning,
          totalFails: 0,
          category: categoryName,
          day: defaultDay
        });
      }
    }
  });
  return parsedWords;
}

function parseMultiDayText(rawText) {
  if (!rawText) return { "Day 1": "" };
  const lines = rawText.split('\n');
  const days = {};
  let currentDayKey = "Day 1";
  days[currentDayKey] = [];
  let hasHeaders = false;

  lines.forEach(line => {
    const trimmed = line.replace(/\r/g, '').trim();
    const headerMatch = trimmed.match(/^(?:#|---|\[|\b)?\s*Day\s*(\d+|[A-Za-z0-9_-]+)\s*(?:---|\]|:)?$/i);
    if (headerMatch) {
      hasHeaders = true;
      const dayNum = headerMatch[1];
      currentDayKey = `Day ${dayNum}`;
      if (!days[currentDayKey]) days[currentDayKey] = [];
    } else {
      days[currentDayKey].push(line);
    }
  });

  if (!hasHeaders) {
    return { "Day 1": rawText };
  }

  const result = {};
  for (const [k, lineArr] of Object.entries(days)) {
    const content = lineArr.join('\n').trim();
    if (content || Object.keys(days).length === 1) {
      result[k] = content;
    }
  }
  return Object.keys(result).length > 0 ? result : { "Day 1": rawText };
}

function getAcademyWordData(slotId) {
  if (!currentAcademyId) return null;
  try {
    const raw = localStorage.getItem(`academy_wb_${currentAcademyId}_${slotId}`);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data) return null;
    if (!data.days && data.content) {
      data.days = parseMultiDayText(data.content);
    }
    return data;
  } catch(e) {
    return null;
  }
}

function updateCategoryTabTitles() {
  const tabToefl = document.getElementById('tab-toefl');
  const tabBasic = document.getElementById('tab-basic');
  if (!tabToefl || !tabBasic) return;

  if (currentAcademyId) {
    const wb1 = getAcademyWordData('slot_1');
    const wb2 = getAcademyWordData('slot_2');

    const hasWb1 = wb1 && wb1.title && wb1.days && Object.values(wb1.days).some(txt => txt && txt.trim());
    const hasWb2 = wb2 && wb2.title && wb2.days && Object.values(wb2.days).some(txt => txt && txt.trim());

    tabToefl.textContent = hasWb1 ? `🔥 ${wb1.title}` : `🔥 1번 단어장 (미등록)`;
    tabBasic.textContent = hasWb2 ? `🌱 ${wb2.title}` : `🌱 2번 단어장 (미등록)`;
  } else {
    tabToefl.textContent = `🔥 토플 영단어`;
    tabBasic.textContent = `🌱 기초 영단어`;
  }

  populateDaySelector();
}

function populateDaySelector() {
  const daySelector = document.getElementById('day-selector');
  if (!daySelector) return;
  if (typeof words === 'undefined') return;

  let filteredSource = words;
  if (currentAcademyId) {
    if (currentCategory === 'toefl') {
      const wb1 = getAcademyWordData('slot_1');
      if (wb1 && wb1.days && Object.keys(wb1.days).length > 0) {
        filteredSource = [];
        for (const [dayName, content] of Object.entries(wb1.days)) {
          const parsed = parseWordText(content, 'toefl', dayName);
          filteredSource.push(...parsed);
        }
      } else {
        filteredSource = [];
      }
    } else if (currentCategory === 'basic') {
      const wb2 = getAcademyWordData('slot_2');
      if (wb2 && wb2.days && Object.keys(wb2.days).length > 0) {
        filteredSource = [];
        for (const [dayName, content] of Object.entries(wb2.days)) {
          const parsed = parseWordText(content, 'basic', dayName);
          filteredSource.push(...parsed);
        }
      } else {
        filteredSource = [];
      }
    }
  }

  const days = new Set();
  filteredSource.forEach(w => {
    if (w.category === currentCategory && w.day != null) {
      days.add(w.day);
    }
  });
  
  daySelector.innerHTML = '';
  const sortedDays = Array.from(days).sort((a, b) => {
    const numA = parseInt(String(a).replace(/[^0-9]/g, ''), 10);
    const numB = parseInt(String(b).replace(/[^0-9]/g, ''), 10);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return String(a).localeCompare(String(b), 'ko');
  });
  
  if (sortedDays.length === 0) {
    daySelector.innerHTML = '<option value="" style="background:#1e1b4b;color:#fff;">(등록된 단어장 없음)</option>';
    currentDay = null;
    return;
  }

  sortedDays.forEach(day => {
    let titlePrefix = '';
    if (currentCategory === 'toefl') {
      const wb1 = getAcademyWordData('slot_1');
      titlePrefix = (currentAcademyId && wb1 && wb1.title) ? `${wb1.title} - ` : '🔥 토플 영단어 - ';
    } else if (currentCategory === 'basic') {
      const wb2 = getAcademyWordData('slot_2');
      titlePrefix = (currentAcademyId && wb2 && wb2.title) ? `${wb2.title} - ` : '🌱 기초 영단어 - ';
    } else if (currentCategory === 'custom-upload') {
      titlePrefix = '📁 업로드 단어장 - ';
    }
    
    const opt = document.createElement('option');
    opt.value = day;
    const dayLabel = isNaN(day) && String(day).startsWith('Day') ? day : `Day ${day}`;
    opt.textContent = titlePrefix + dayLabel;
    opt.style.background = '#1e1b4b';
    opt.style.color = '#ffffff';
    daySelector.appendChild(opt);
  });
  
  const savedDayStr = localStorage.getItem('saved_day');
  const parsedSavedDay = (savedDayStr && savedDayStr !== 'null') ? (isNaN(savedDayStr) ? savedDayStr : (String(savedDayStr).startsWith('Day') ? savedDayStr : parseInt(savedDayStr, 10))) : null;
  
  if (parsedSavedDay !== null && sortedDays.includes(parsedSavedDay)) {
    currentDay = parsedSavedDay;
  } else {
    currentDay = sortedDays[0];
  }
  daySelector.value = currentDay;
  setProgressSync('saved_day', currentDay);
}

function getFilteredWords() {
  if (typeof words === 'undefined') return []; // Fallback if wordData.js fails to load
  let filteredSource = words;

  if (currentAcademyId) {
    if (currentCategory === 'toefl') {
      const wb1 = getAcademyWordData('slot_1');
      if (wb1 && wb1.days && Object.keys(wb1.days).length > 0) {
        filteredSource = [];
        for (const [dayName, content] of Object.entries(wb1.days)) {
          const parsed = parseWordText(content, 'toefl', dayName);
          filteredSource.push(...parsed);
        }
      } else {
        filteredSource = [];
      }
    } else if (currentCategory === 'basic') {
      const wb2 = getAcademyWordData('slot_2');
      if (wb2 && wb2.days && Object.keys(wb2.days).length > 0) {
        filteredSource = [];
        for (const [dayName, content] of Object.entries(wb2.days)) {
          const parsed = parseWordText(content, 'basic', dayName);
          filteredSource.push(...parsed);
        }
      } else {
        filteredSource = [];
      }
    }
  }

  let filtered = filteredSource.filter(w => w.category === currentCategory && (currentDay === null || String(w.day) === String(currentDay)));
  let failData = JSON.parse(localStorage.getItem('doacore_total_fails')) || {};
  return filtered.map((w, i) => {
    const meaningParts = w.meaning.split('/').map(s => s.trim());
    let meanings;
    if (w.partOfSpeech.length === 1) {
      meanings = [{ pos: w.partOfSpeech[0], meaning: w.meaning }];
    } else if (meaningParts.length === w.partOfSpeech.length) {
      meanings = w.partOfSpeech.map((pos, idx) => ({ pos, meaning: meaningParts[idx] }));
    } else {
      meanings = [{ pos: w.partOfSpeech[0], meaning: w.meaning }];
    }
    return {
      originalIndex: i,
      word: w.word,
      partOfSpeech: w.partOfSpeech,
      meaning: w.meaning,
      meanings,
      passed: false,
      attempts: 0,
      totalFails: failData[w.word] || 0
    };
  });
}

const App = {
  allWords:          [],
  words:             [],   // 전체 단어 객체 배열
  testPool:          [],   // 현재 라운드 테스트 풀 (오답만 남음)
  round:             1,
  phase:             'input',
  studyAbort:        null, // AbortController
  paused:            false,
  resumeFn:          null,
  currentTestIndex:  0,    // 복원용: 현재 라운드에서 진행 중인 단어 인덱스
  currentDBName:     '',   // 현재 선택된 단어장 이름 (영구 저장 키로 사용)
  currentSection:    '',   // 현재 학습 중인 구간 (진척도 저장용)
};

// =============================================
// 단어 상태 영구 저장 (localStorage) — 세션 간 passed/attempts 유지
// =============================================

// =============================================
// 섹션별 학습 진척도 (Progress) 저장
// =============================================
function recordProgress(status) {
  if (!App.currentDBName || !App.currentSection) return;
  const key = `${App.currentDBName}_${App.currentSection}`;
  try {
    let progress = JSON.parse(localStorage.getItem('vocab_progress') || '{}');
    progress[key] = status;
    setProgressSync('vocab_progress', JSON.stringify(progress));
  } catch(e) {
    console.warn('진척도 저장 실패:', e);
  }
}

// 저장 키: vocab_word_states_{단어장이름}
function getWordStatesKey() {
  return App.currentDBName ? `vocab_word_states_${App.currentDBName}` : '';
}

// 현재 App.words의 passed/attempts 상태를 localStorage에 영구 저장
function saveWordStates() {
  const key = getWordStatesKey();
  if (!key || App.words.length === 0) return;
  const states = {};
  App.words.forEach((w) => {
    // 단어+고유 인덱스 키로 사용하여 부분 추출 시에도 일관된 키 유지
    const wordKey = `${w.originalIndex}_${w.word}`;
    states[wordKey] = { passed: w.passed, attempts: w.attempts };
  });
  setProgressSync(key, JSON.stringify(states));
}

// localStorage에서 단어 상태를 복원하여 words 배열에 적용
function loadWordStates(words) {
  const key = getWordStatesKey();
  if (!key) return words;
  const raw = localStorage.getItem(key);
  if (!raw) return words;
  try {
    const states = JSON.parse(raw);
    words.forEach((w) => {
      const wordKey = `${w.originalIndex}_${w.word}`;
      if (states[wordKey]) {
        w.passed = states[wordKey].passed;
        w.attempts = states[wordKey].attempts;
      }
    });
  } catch (e) {
    console.warn('단어 상태 복원 실패:', e);
  }
  return words;
}

// =============================================
// 유틸리티
// =============================================
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fisher-Yates 셔플 알고리즘
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 단어 입력 파싱
function parseWords() { return getFilteredWords(); }

// 뷰 전환
function showView(viewId) {
  if (viewId !== 'view-test' && typeof stopWordTimer === 'function') {
    stopWordTimer();
  }
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(viewId).classList.add('active');
  App.phase = viewId.replace('view-', '');
}

// HTML 이스케이프
function esc(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// 품사별 색상 구분을 위한 CSS 클래스 반환
function getPosClass(pos) {
  const p = pos.toLowerCase().replace(/\./g, '').trim();
  if (['n', 'noun', '명', '명사'].includes(p)) return 'pos-n';
  if (['v', 'verb', '동', '동사'].includes(p)) return 'pos-v';
  if (['a', 'adj', 'adjective', '형', '형용사'].includes(p)) return 'pos-a';
  if (['ad', 'adv', 'adverb', '부', '부사'].includes(p)) return 'pos-ad';
  if (['prep', 'preposition', '전', '전치사'].includes(p)) return 'pos-prep';
  if (['conj', 'conjunction', '접', '접속사'].includes(p)) return 'pos-conj';
  if (['phr', 'phrase', 'idiom', '숙어', '구', '관용구'].includes(p)) return 'pos-phr';
  return 'pos-default';
}

// 뜻 HTML 생성

function meaningHTML(meanings, wordObj) {
  try {
    if (wordObj && wordObj.partOfSpeech && wordObj.meaning) {
      const parts = wordObj.meaning.split('/').map(s => s.trim());
      if (wordObj.partOfSpeech.length === parts.length) {
        return wordObj.partOfSpeech.map((p, i) => {
          const pClass = p.toLowerCase().replace(/[^a-z]/g,'');
          return `
          <div class="meaning-row pos-bg-${pClass || 'default'}">
            <span class="pos-badge pos-${pClass}">[${p}]</span>
            <span class="meaning-text">${parts[i]}</span>
          </div>
        `}).join('');
      } else {
        const pClass = wordObj.partOfSpeech[0] ? wordObj.partOfSpeech[0].toLowerCase().replace(/[^a-z]/g,'') : 'default';
        const posBadges = wordObj.partOfSpeech.map(p => `<span class="pos-badge pos-${p.toLowerCase().replace(/[^a-z]/g,'')}">[${p}]</span>`).join('');
        return `
          <div class="meaning-row pos-bg-${pClass}">
            ${posBadges}
            <span class="meaning-text">${wordObj.meaning}</span>
          </div>
        `;
      }
    }
    return meanings.map(m => {
      const pClass = m.pos.toLowerCase().replace(/[^a-z]/g,'');
      return `
      <div class="meaning-row pos-bg-${pClass || 'default'}">
        <span class="pos-badge pos-${pClass}">[${m.pos}]</span>
        <span class="meaning-text">${m.meaning}</span>
      </div>
    `}).join('');
  } catch(e) {
    console.error('meaningHTML rendering error:', e);
    return '<div class="meaning-card">Error rendering meaning</div>';
  }
}


// =============================================
// ① 입력 화면
// =============================================
function initInputView() {
  const textarea = document.getElementById('word-input');

  function updateCount() {
    const words = getFilteredWords();
    renderRangeButtons(words);
  }

  
  const tabToefl = document.getElementById('tab-toefl');
  const tabBasic = document.getElementById('tab-basic');
  const tabCustomUpload = document.getElementById('tab-custom-upload');
  const tabCustomManual = document.getElementById('tab-custom-manual');
  const daySelector = document.getElementById('day-selector');
  const daySelectorContainer = document.getElementById('day-selector-container');
  
  function updateDictationBtnText() {
    const dictText = document.getElementById('dictation-btn-text');
    if (dictText) {
      dictText.textContent = `🎧 전체 단어 스펠링 듣고 쓰기`;
    }
  }

  if (daySelector) {
    daySelector.addEventListener('change', (e) => {
      if (!e.target.value) return;
      const val = e.target.value;
      currentDay = isNaN(val) ? val : parseInt(val, 10);
      setProgressSync('saved_day', currentDay);
      App.currentDBName = `${currentCategory}_day${currentDay}`;
      updateDictationBtnText();
      updateCount();
    });
  }

  function switchTab(catName) {
    currentCategory = catName;
    setProgressSync('saved_category', catName);
    [tabToefl, tabBasic, tabCustomUpload, tabCustomManual].forEach(t => {
      if (t) {
        t.classList.remove('active');
      }
    });
    
    let activeTab = null;
    if (catName === 'toefl') activeTab = tabToefl;
    else if (catName === 'basic') activeTab = tabBasic;
    else if (catName === 'custom-upload') activeTab = tabCustomUpload;
    else if (catName === 'custom-manual') activeTab = tabCustomManual;

    if (activeTab) {
      activeTab.classList.add('active');
    }

    if (catName === 'toefl' || catName === 'basic' || catName === 'custom-upload') {
      if (daySelectorContainer) daySelectorContainer.style.display = '';
      populateDaySelector();
    } else {
      if (daySelectorContainer) daySelectorContainer.style.display = 'none';
      currentDay = null;
    }

    const dropdownContainer = document.getElementById('dropdown-add-voca-container');
    const manualDirectBtn = document.getElementById('btn-add-word-manual-direct');
    if (catName === 'toefl' || catName === 'basic') {
      if (dropdownContainer) dropdownContainer.style.display = 'none';
      if (manualDirectBtn) manualDirectBtn.classList.add('hidden');
    } else if (catName === 'custom-upload') {
      if (dropdownContainer) dropdownContainer.style.display = 'inline-block';
      if (manualDirectBtn) manualDirectBtn.classList.add('hidden');
    } else if (catName === 'custom-manual') {
      if (dropdownContainer) dropdownContainer.style.display = 'none';
      if (manualDirectBtn) manualDirectBtn.classList.remove('hidden');
    }
    
    App.currentDBName = `${currentCategory}${currentDay ? '_day'+currentDay : ''}`;
    updateDictationBtnText();
    updateCount();
  }

  if (tabToefl) tabToefl.addEventListener('click', () => switchTab('toefl'));
  if (tabBasic) tabBasic.addEventListener('click', () => switchTab('basic'));
  if (tabCustomUpload) tabCustomUpload.addEventListener('click', () => switchTab('custom-upload'));
  if (tabCustomManual) tabCustomManual.addEventListener('click', () => switchTab('custom-manual'));
  
  App.refreshInputView = () => switchTab(currentCategory);
  
  window.addEventListener('focus', () => {
    if (App.phase === 'input' && App.refreshInputView) {
      App.refreshInputView();
    }
  });

  App.refreshInputView();


  // ── 동적 학습 구간 렌더링 (소그룹 + 중그룹 취약점 + 대그룹 총정리) ──
  function renderRangeButtons(words) {
    const panel = document.getElementById('range-select-panel');
    const listContainer = document.getElementById('range-buttons-list');
    if (!panel || !listContainer) return;

    const n = words.length;

    // 단어가 없으면 안내 메시지 표시 (학원 소속 학생인 경우)
    if (n === 0) {
      if (currentAcademyId && (currentCategory === 'toefl' || currentCategory === 'basic')) {
        panel.classList.remove('hidden');
        const totalTimeBar = document.getElementById('total-study-time-bar');
        if (totalTimeBar) totalTimeBar.innerHTML = '';
        listContainer.innerHTML = `
          <div class="glass-card" style="padding: 32px 16px; text-align: center; color: var(--text-sub); width: 100%; grid-column: 1 / -1;">
            <div style="font-size: 40px; margin-bottom: 12px;">📭</div>
            <div style="font-size: 17px; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">등록된 학원 단어장이 없습니다</div>
            <div style="font-size: 13px; color: var(--text-sub);">학원 관리자에게 단어장 등록을 요청해주세요.</div>
          </div>
        `;
      } else {
        panel.classList.add('hidden');
      }
      return;
    }

    panel.classList.remove('hidden');
    listContainer.innerHTML = '';

    // ── 총 학습시간 계산 및 표시 ──
    const totalTimeBar = document.getElementById('total-study-time-bar');
    if (totalTimeBar && App.currentDBName) {
      let studyTime = {};
      try { studyTime = JSON.parse(localStorage.getItem('vocab_study_time') || '{}'); } catch(e){}
      // 현재 DBName에 해당하는 모든 키의 시간 합산
      const totalSec = Object.entries(studyTime)
        .filter(([k]) => k.startsWith(App.currentDBName + '_'))
        .reduce((sum, [, v]) => sum + (v || 0), 0);
      if (totalSec > 0) {
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        let timeStr = '';
        if (h > 0) timeStr = `${h}시간 ${m}분 ${s}초`;
        else if (m > 0) timeStr = `${m}분 ${s}초`;
        else timeStr = `${s}초`;
        totalTimeBar.innerHTML = `
          <div class="total-study-time-display">
            <span class="total-time-label">⏱️ 총 학습시간</span>
            <span class="total-time-value">${timeStr}</span>
          </div>`;
      } else {
        totalTimeBar.innerHTML = '';
      }
    }

    const SMALL = 20;  // 소그룹 단위
    const MID   = 40;  // 중그룹 단위

    function getBadgeHTML(sectionKey) {
      if (!App.currentDBName) return '';
      const key = `${App.currentDBName}_${sectionKey}`;
      
      let badgeHTML = '';
      
      let progress = {};
      try { progress = JSON.parse(localStorage.getItem('vocab_progress') || '{}'); } catch(e){}
      const status = progress[key];
      if (status === 'in_progress') badgeHTML += `<span class="progress-badge in-progress">진행중 🏃‍♂️</span>`;
      else if (status === 'completed') badgeHTML += `<span class="progress-badge completed">완벽 👑</span>`;

      let studyTime = {};
      try { studyTime = JSON.parse(localStorage.getItem('vocab_study_time') || '{}'); } catch(e){}
      const totalSeconds = studyTime[key] || 0;
      console.log('[BADGE] key:', key, 'totalSeconds:', totalSeconds, 'status:', status);
      if (totalSeconds > 0) {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        const timeStr = m > 0 ? `${m}분 ${s}초` : `${s}초`;
        badgeHTML += `<span class="progress-badge time-badge">⏱️ ${timeStr}</span>`;
      }

      return badgeHTML;
    }

    // ── 섹션 1: 📖 소그룹 새 학습 (20단어 단위) ──
    const titleNew = document.createElement('div');
    titleNew.className = 'range-section-title new-learn';
    titleNew.textContent = '📖 소그룹 새 학습';
    listContainer.appendChild(titleNew);

    const newGrid = document.createElement('div');
    newGrid.className = 'range-buttons-grid';
    listContainer.appendChild(newGrid);

    for (let i = 0; i < n; i += SMALL) {
      const start = i + 1;
      const end = Math.min(i + SMALL, n);
      const count = end - i;

      const btn = document.createElement('button');
      const sectionKey = `${start}~${end}`;
      const badgeHTML = getBadgeHTML(sectionKey);
      btn.className = 'btn-range-item';
      btn.style.cssText = 'min-height: 64px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 12px 6px; text-align: center; box-sizing: border-box;';
      btn.innerHTML = `
        <div style="display: flex; align-items: baseline; justify-content: center; gap: 4px; width: 100%;">
          <span class="range-btn-label" style="font-size: 15px; font-weight: 700;">${start} ~ ${end}</span>
          <span style="font-size: 11px; color: var(--text-sub); opacity: 0.8; font-weight: 500;">(${count}개)</span>
        </div>
        ${badgeHTML ? `<div style="display: flex; gap: 4px; align-items: center; justify-content: center; margin-top: 4px; flex-wrap: wrap;">${badgeHTML}</div>` : ''}
      `;
      if (btn) btn.onclick = () => {
        App.currentSection = `${start}~${end}`;
        const slicedWords = words.slice(i, end);
        App.words = slicedWords;
        App.round = 1;
        App.testPool = [];
        startTest();
      };
      newGrid.appendChild(btn);
    }

    const btnAllNew = document.createElement('button');
    const sectionKeyAll = `1~${n} 전체 단어 새 학습`;
    const badgeAll = getBadgeHTML(sectionKeyAll);
    btnAllNew.className = 'btn-range-item';
    btnAllNew.style.cssText = 'min-height: 64px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 12px 6px; text-align: center; box-sizing: border-box;';
    btnAllNew.innerHTML = `
      <div style="display: flex; align-items: baseline; justify-content: center; gap: 4px; width: 100%;">
        <span class="range-btn-label" style="font-size: 14px; font-weight: 700;">1 ~ ${n} 전체 새 학습</span>
      </div>
      ${badgeAll ? `<div style="display: flex; gap: 4px; align-items: center; justify-content: center; margin-top: 4px; flex-wrap: wrap;">${badgeAll}</div>` : '<div style="font-size: 11px; color: var(--text-sub); margin-top: 2px;">전체 범위</div>'}
    `;
    if (btnAllNew) btnAllNew.onclick = () => {
      App.currentSection = `1~${n} 전체 단어 새 학습`;
      App.words = words.slice();
      App.round = 1;
      App.testPool = [];
      startTest();
    };
    newGrid.appendChild(btnAllNew);

    // ── 섹션 2: 🔥 취약점 집중 복습 (40단어 중그룹 + 전체 대그룹) ──
    const titleReview = document.createElement('div');
    titleReview.className = 'range-section-title weakness-review';
    titleReview.textContent = '🔥 취약점 집중 복습';
    listContainer.appendChild(titleReview);

    const reviewGrid = document.createElement('div');
    reviewGrid.className = 'range-buttons-grid';
    listContainer.appendChild(reviewGrid);

    // 중그룹 (40단위 묶음)
    for (let i = 0; i < n; i += MID) {
      const start = i + 1;
      const end = Math.min(i + MID, n);
      // 마지막 구간이 너무 작으면(20개 미만) 이전 구간에 합산되므로 생략
      if (end - i < SMALL && i > 0) continue;

      const btn = document.createElement('button');
      btn.className = 'btn-range-item btn-review weakness-focus';
      btn.dataset.start = String(i);
      btn.dataset.end = String(end);
      const sectionKeyReview = `${start}~${end} 취약점 복습`;
      const badgeReview = getBadgeHTML(sectionKeyReview);
      btn.style.cssText = 'min-height: 64px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 12px 6px; text-align: center; box-sizing: border-box;';
      btn.innerHTML = `
        <div style="display: flex; align-items: baseline; justify-content: center; gap: 4px; width: 100%;">
          <span class="range-btn-label" style="font-size: 15px; font-weight: 700;">${start} ~ ${end}</span>
        </div>
        ${badgeReview ? `<div style="display: flex; gap: 4px; align-items: center; justify-content: center; margin-top: 4px; flex-wrap: wrap;">${badgeReview}</div>` : ''}
      `;
      if (btn) btn.onclick = () => {
        App.currentSection = `${start}~${end} 취약점 복습`;
        startWeaknessReview(i, end, false);
      };
      reviewGrid.appendChild(btn);
    }

    // 그룹 C-1: 전체 취약점 복습 (2회 이상)
    const btnReviewAllMid = document.createElement('button');
    btnReviewAllMid.id = 'btn-review-all-mid';
    btnReviewAllMid.className = 'btn-range-item btn-review weakness-focus';
    btnReviewAllMid.dataset.start = '0';
    btnReviewAllMid.dataset.end = String(n);
    const sectionKeyReviewAllMid = `1~${n} 전체 취약점 복습`;
    const badgeAllMid = getBadgeHTML(sectionKeyReviewAllMid);
    btnReviewAllMid.style.cssText = 'min-height: 64px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 12px 6px; text-align: center; box-sizing: border-box;';
    btnReviewAllMid.innerHTML = `
      <div style="display: flex; align-items: baseline; justify-content: center; gap: 4px; width: 100%;">
        <span class="range-btn-label" style="font-size: 14px; font-weight: 700;">1 ~ ${n} (전체)</span>
      </div>
      ${badgeAllMid ? `<div style="display: flex; gap: 4px; align-items: center; justify-content: center; margin-top: 4px; flex-wrap: wrap;">${badgeAllMid}</div>` : '<div style="font-size: 11px; color: rgba(251, 191, 36, 0.7); margin-top: 2px;">오답 2회 이상</div>'}
    `;
    if (btnReviewAllMid) btnReviewAllMid.onclick = () => {
      App.currentSection = `1~${n} 전체 취약점 복습`;
      startWeaknessReview(0, n, false);
    };
    reviewGrid.appendChild(btnReviewAllMid);

    // 그룹 C: 최종 보스전 총정리 (대그룹)
    const btnFinal = document.createElement('button');
    btnFinal.className = 'btn-range-item btn-review weakness-focus';
    btnFinal.dataset.start = '0';
    btnFinal.dataset.end = String(n);
    btnFinal.dataset.final = 'true';
    const sectionKeyFinal = `1~${n} 최종 취약점 총정리`;
    const badgeFinal = getBadgeHTML(sectionKeyFinal);
    btnFinal.style.cssText = 'min-height: 64px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 12px 6px; text-align: center; box-sizing: border-box;';
    btnFinal.innerHTML = `
      <div style="display: flex; align-items: baseline; justify-content: center; gap: 4px; width: 100%;">
        <span class="range-btn-label" style="font-size: 14px; font-weight: 700;">1 ~ ${n} (보스전)</span>
      </div>
      ${badgeFinal ? `<div style="display: flex; gap: 4px; align-items: center; justify-content: center; margin-top: 4px; flex-wrap: wrap;">${badgeFinal}</div>` : '<div style="font-size: 11px; color: rgba(251, 191, 36, 0.7); margin-top: 2px;">악성 오답 4회 이상</div>'}
    `;
    if (btnFinal) btnFinal.onclick = () => {
      App.currentSection = `1~${n} 최종 취약점 총정리`;
      startWeaknessReview(0, n, true);
    };
    reviewGrid.appendChild(btnFinal);

    // Dictation 버튼 뱃지 및 표시 구간 업데이트
    const dictationBtn = document.getElementById('btn-dictation');
    if (dictationBtn) {
      const dictBadge = getBadgeHTML('dictation');
      dictationBtn.innerHTML = `<span id="dictation-btn-text">🎧 전체 단어 스펠링 듣고 쓰기 ${dictBadge}</span>`;
    }
  }

  // DB 목록 로딩 (드롭다운 연동)
  loadDBList(textarea);

  // ── 웹용 단어 파일 업로드 및 브라우저 DB(LocalStorage) 저장 ──
  const fileInput = document.getElementById('btn-upload-db-file');
  const btnToggleAdd = document.getElementById('btn-toggle-add');
  const dropdownAddMenu = document.getElementById('dropdown-add-menu');
  const btnUploadDirect = document.getElementById('btn-upload-direct');
  const btnShowGuide = document.getElementById('btn-show-guide');
  const modalFormatGuide = document.getElementById('modal-format-guide');
  const btnFormatGuideClose = document.getElementById('btn-format-guide-close');
  const btnFormatGuideOk = document.getElementById('btn-format-guide-ok');

  if (btnToggleAdd && dropdownAddMenu) {
    if (btnToggleAdd) btnToggleAdd.onclick = (e) => {
      e.stopPropagation();
      dropdownAddMenu.classList.toggle('hidden');
    };
    document.addEventListener('click', (e) => {
      if (!dropdownAddMenu.contains(e.target) && e.target !== btnToggleAdd) {
        dropdownAddMenu.classList.add('hidden');
      }
    });
  }

  if (btnShowGuide && modalFormatGuide) {
    if (btnShowGuide) btnShowGuide.onclick = () => {
      if (dropdownAddMenu) dropdownAddMenu.classList.add('hidden');
      modalFormatGuide.classList.remove('hidden');
    };
    const closeModal = () => modalFormatGuide.classList.add('hidden');
    if (btnFormatGuideClose) btnFormatGuideClose.onclick = closeModal;
    if (btnFormatGuideOk) btnFormatGuideOk.onclick = closeModal;
  }

  if (btnUploadDirect) {
    btnUploadDirect.onclick = () => {
      const fileInput = document.getElementById('btn-upload-db-file');
      if (fileInput) fileInput.click();
    };
  }

  const btnAddManual = document.getElementById('btn-add-word-manual');
  const modalAddWord = document.getElementById('modal-add-word');
  const btnAddWordCancel = document.getElementById('btn-add-word-cancel');
  const btnAddWordSubmit = document.getElementById('btn-add-word-submit');
  
  if (btnAddManual && modalAddWord) {
    if (btnAddManual) {
      btnAddManual.onclick = () => {
        if (dropdownAddMenu) dropdownAddMenu.classList.add('hidden');
        modalAddWord.classList.remove('hidden');
      };
    }
    const manualDirectBtn = document.getElementById('btn-add-word-manual-direct');
    if (manualDirectBtn) {
      manualDirectBtn.onclick = () => {
        if (dropdownAddMenu) dropdownAddMenu.classList.add('hidden');
        modalAddWord.classList.remove('hidden');
      };
    }
    
    btnAddWordCancel.onclick = () => {
      modalAddWord.classList.add('hidden');
    };
    
    btnAddWordSubmit.onclick = () => {
      const en = document.getElementById('add-word-en').value.trim();
      const pos = document.getElementById('add-word-pos').value;
      const ko = document.getElementById('add-word-ko').value.trim();
      
      if (!en || !ko) {
        alert("단어와 뜻을 모두 입력해주세요.");
        return;
      }
      
      const newWord = {
        word: en,
        partOfSpeech: [pos],
        meaning: ko,
        totalFails: 0,
        category: 'custom-manual',
        day: null
      };
      
      try {
        const customWords = JSON.parse(localStorage.getItem('doacore_custom_words') || '[]');
        customWords.push(newWord);
        setProgressSync('doacore_custom_words', JSON.stringify(customWords));
        
        words.push(newWord);
        App.allWords = words.slice();
        alert(`"${en}" 단어가 수동으로 등록되었습니다!`);
        modalAddWord.classList.add('hidden');
        
        document.getElementById('add-word-en').value = '';
        document.getElementById('add-word-ko').value = '';
        
        if (currentCategory === 'custom-manual') updateCount();
      } catch(e) {
        console.error("수동 단어 추가 에러:", e);
      }
    };
  }

  const fileInputEl = document.getElementById('btn-upload-db-file');
  if (fileInputEl) {
    fileInputEl.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        let rawText = evt.target.result;
        rawText = rawText.replace(/\n\s*\[\s*/g, " [");
        const lines = rawText.split('\n');
        const newWords = [];
        lines.forEach(line => {
          line = line.replace(/\r/g, '').trim();
          if (!line) return;
          const wordMatch = line.match(/^(.+?)\s*\[([^\]]+)\]\s*(.+)$/);
          if (wordMatch) {
            const rawWord = wordMatch[1].trim();
            const rawPos = wordMatch[2].split(',').map(s => s.trim());
            const rawMeaning = wordMatch[3].trim();
            const lastWord = newWords.length > 0 ? newWords[newWords.length - 1] : null;
            if (lastWord && lastWord.word === rawWord) {
              lastWord.partOfSpeech.push(...rawPos);
              lastWord.meaning += ` / ${rawMeaning}`;
            } else {
              newWords.push({
                word: rawWord,
                partOfSpeech: rawPos,
                meaning: rawMeaning,
                totalFails: 0,
                category: 'custom-upload',
                day: file.name.replace('.txt', '')
              });
            }
          }
        });

        if (newWords.length === 0) {
          alert('단어를 하나도 찾지 못했습니다. 파일 양식을 확인해주세요. (예: apple [n] 사과)');
          e.target.value = '';
          return;
        }

        try {
          const uploadWords = JSON.parse(localStorage.getItem('doacore_upload_words') || '[]');
          uploadWords.push(...newWords);
          setProgressSync('doacore_upload_words', JSON.stringify(uploadWords));
          words.push(...newWords);
          App.allWords = words.slice();
          alert(`파일에서 ${newWords.length}개의 단어가 성공적으로 '내가 추가한 단어장'에 추가되었습니다!`);
          
          if (currentCategory === 'custom-upload') updateCount();
        } catch(err) {
          console.error("파일 업로드 단어 추가 에러:", err);
        }
        e.target.value = '';
      };
      reader.readAsText(file);
    });
  }

  if (btnUploadDirect && fileInput) {
    if (btnUploadDirect) btnUploadDirect.onclick = () => {
      if (dropdownAddMenu) dropdownAddMenu.classList.add('hidden');
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

        localStorage.setItem(`vocab_file_${title}`, text);
        refreshDBList(textarea);
        
        alert(`"${title}" 단어장이 목록에 추가되었습니다.`);
        fileInput.value = '';
      };

      reader.readAsText(file, 'UTF-8');
    };
  }

  // Dictation 모드 테스트 시작
  if (document.getElementById('btn-dictation')) document.getElementById('btn-dictation').onclick = () => {
    const textarea = document.getElementById('word-input');
    const words = getFilteredWords();
    if (words.length === 0) {
      alert('단어장을 선택해주세요.');
      return;
    }
    App.studyAbort = false; App.testSessionId = Date.now();
    App.isOButtonLocked = false;
    App.isPenaltyTime = false;
    App.currentSection = 'dictation';
    recordProgress('in_progress');
    App.words = words;
    isDictationMode = true;
    App.round = 4;
    App.phase = 'TEST';
    App.testPool = App.words.slice();
    App.currentTestIndex = 0;
    showView('view-test');
    runTestRound();
  };

  // 단어장 전체 미리보기 로직
  const btnViewAllWords = document.getElementById('btn-view-all-words');
  const modalWordList = document.getElementById('modal-word-list');
  const btnWordListClose = document.getElementById('btn-word-list-close');
  const btnWordListOk = document.getElementById('btn-word-list-ok');
  const wordListTitle = document.getElementById('word-list-title');
  const wordListTbody = document.getElementById('word-list-tbody');

  if (btnViewAllWords) {
    btnViewAllWords.addEventListener('click', () => {
      const currentWords = getFilteredWords();
      if (currentWords.length === 0) {
        alert('단어가 존재하지 않습니다.');
        return;
      }
      
      const isCustom = currentCategory === 'custom-upload' || currentCategory === 'custom-manual';
      const thManage = document.getElementById('th-manage');
      const btnDeleteAll = document.getElementById('btn-word-list-delete-all');
      
      if (isCustom) {
        if (thManage) thManage.classList.remove('hidden');
        if (btnDeleteAll) btnDeleteAll.classList.remove('hidden');
      } else {
        if (thManage) thManage.classList.add('hidden');
        if (btnDeleteAll) btnDeleteAll.classList.add('hidden');
      }

      let titlePrefix = '전체';
      if (currentCategory === 'toefl') titlePrefix = '🔥 토플 영단어';
      else if (currentCategory === 'basic') titlePrefix = '🌱 기초 영단어';
      else if (currentCategory === 'custom-upload') titlePrefix = '📁 업로드 단어장';
      else if (currentCategory === 'custom-manual') titlePrefix = '✍️ 수동 단어장';

      let dayText = currentDay != null ? (isNaN(currentDay) ? currentDay : `Day ${currentDay}`) : '';
      
      const updateTitle = () => {
        wordListTitle.textContent = `📋 ${titlePrefix} ${dayText} 미리보기 (${wordListTbody.children.length}개)`;
      };
      
      wordListTbody.innerHTML = '';
      currentWords.forEach(w => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
        
        let manageTd = '';
        if (isCustom) {
          manageTd = `
            <td style="padding: 10px 8px; text-align: center; white-space: nowrap;">
              <div class="manage-btn-container">
                <button class="btn-ghost btn-word-edit" style="padding: 4px 6px; color: #3b82f6; font-size: 13px; border-color: rgba(59,130,246,0.3);">수정</button>
                <button class="btn-ghost btn-word-delete" style="padding: 4px 6px; color: #f43f5e; font-size: 13px; border-color: rgba(244,63,94,0.3);">삭제</button>
              </div>
            </td>
          `;
        }

        tr.innerHTML = `
          <td style="padding: 10px 8px; font-weight: 600; color: #a78bfa; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer;" title="전체 단어 보기" onclick="this.style.whiteSpace = this.style.whiteSpace === 'nowrap' ? 'normal' : 'nowrap';">${w.word}</td>
          <td style="padding: 10px 2px; color: var(--text-sub); font-size: 13px; text-align: center;">[${w.partOfSpeech.join(', ')}]</td>
          <td style="padding: 10px 8px;">
            <span class="${isHideMeaningMode ? 'blur-meaning' : ''}" onclick="if(this.classList.contains('blur-meaning')) this.classList.toggle('revealed')">
              ${w.meaning}
            </span>
          </td>
          ${manageTd}
        `;
        
        if (isCustom) {
          const btnEdit = tr.querySelector('.btn-word-edit');
          const btnDel = tr.querySelector('.btn-word-delete');
          
          btnEdit.onclick = () => {
            const currentFormat = `${w.word} [${w.partOfSpeech.join(', ')}] ${w.meaning}`;
            const newText = prompt('단어를 수정하세요 (양식: 단어 [품사] 뜻)', currentFormat);
            if (!newText || newText === currentFormat) return;
            
            const wordMatch = newText.match(/^(.+?)\s*\[([^\]]+)\]\s*(.+)$/);
            if (!wordMatch) { alert('양식이 올바르지 않습니다. (예: apple [n] 사과)'); return; }
            
            const oldWord = w.word;
            w.word = wordMatch[1].trim();
            w.partOfSpeech = wordMatch[2].split(',').map(s=>s.trim());
            w.meaning = wordMatch[3].trim();
            
            // Save to localStorage
            let targetKey = currentCategory === 'custom-upload' ? 'doacore_upload_words' : 'doacore_custom_words';
            let savedWords = JSON.parse(localStorage.getItem(targetKey) || '[]');
            const idx = savedWords.findIndex(sw => sw.word === oldWord && sw.category === currentCategory && (currentCategory === 'custom-upload' ? sw.day === currentDay : true));
            if (idx > -1) {
              savedWords[idx] = w;
              localStorage.setItem(targetKey, JSON.stringify(savedWords));
            }
            
            // Update UI
            tr.children[0].textContent = w.word;
            tr.children[1].textContent = `[${w.partOfSpeech.join(', ')}]`;
            tr.children[2].textContent = w.meaning;
            
            updateCount();
          };
          
          btnDel.onclick = () => {
            if (!confirm(`"${w.word}" 단어를 삭제하시겠습니까?`)) return;
            
            let targetKey = currentCategory === 'custom-upload' ? 'doacore_upload_words' : 'doacore_custom_words';
            let savedWords = JSON.parse(localStorage.getItem(targetKey) || '[]');
            
            const idx = savedWords.findIndex(sw => sw.word === w.word && sw.category === currentCategory && (currentCategory === 'custom-upload' ? sw.day === currentDay : true));
            if (idx > -1) {
              savedWords.splice(idx, 1);
              localStorage.setItem(targetKey, JSON.stringify(savedWords));
            }
            
            const wordsIdx = words.findIndex(sw => sw.word === w.word && sw.category === currentCategory && (currentCategory === 'custom-upload' ? sw.day === currentDay : true));
            if (wordsIdx > -1) words.splice(wordsIdx, 1);
            App.allWords = words.slice();
            
            tr.remove();
            updateTitle();
            updateCount();
            
            if (wordListTbody.children.length === 0) {
              if (currentCategory === 'custom-upload') populateDaySelector();
              modalWordList.classList.add('hidden');
            }
          };
        }
        
        wordListTbody.appendChild(tr);
      });
      
      updateTitle();
      
      if (btnDeleteAll) {
        btnDeleteAll.onclick = () => {
          if (!confirm('정말 이 단어장 목록 전체를 삭제하시겠습니까?')) return;
          
          let targetKey = currentCategory === 'custom-upload' ? 'doacore_upload_words' : 'doacore_custom_words';
          let savedWords = JSON.parse(localStorage.getItem(targetKey) || '[]');
          
          if (currentCategory === 'custom-upload') {
            savedWords = savedWords.filter(sw => sw.day !== currentDay);
          } else {
            savedWords = []; // custom-manual 모두 삭제
          }
          localStorage.setItem(targetKey, JSON.stringify(savedWords));
          
          words = words.filter(sw => {
             if (sw.category === currentCategory) {
               if (currentCategory === 'custom-upload' && sw.day === currentDay) return false;
               if (currentCategory === 'custom-manual') return false;
             }
             return true;
          });
          App.allWords = words.slice();
          
          modalWordList.classList.add('hidden');
          if (currentCategory === 'custom-upload') populateDaySelector();
          updateCount();
        };
      }
      
      modalWordList.classList.remove('hidden');
    });
  }

  const closeWordList = () => { if (modalWordList) modalWordList.classList.add('hidden'); };
  if (btnWordListClose) btnWordListClose.addEventListener('click', closeWordList);
  if (btnWordListOk) btnWordListOk.addEventListener('click', closeWordList);

}

// 기본 내장 단어 데이터 세트 (Day 1 ~ Day 4, 토플 Day 1)


// 로컬 저장소 기반 단어 리스트 로드 및 구버전 데이터 강제 마이그레이션
const DEFAULT_DATABASES = {};
async function loadDBList(textarea) {
  const statusEl = document.getElementById('worddb-status');
  
  // 마이그레이션 버전 5 키를 검사하여 신규 데이터셋(Day 1 ~ Day 4, 토플 Day 1) 강제 동기화
  const isMigrated = localStorage.getItem('vocab_db_version_5');
  if (!isMigrated) {
    localStorage.removeItem('vocab_db_initialized');
    localStorage.removeItem('vocab_file_기초 영단어 Day 1');
    localStorage.removeItem('vocab_file_기초 영단어 Day 2');
    localStorage.removeItem('vocab_file_기초 영단어 Day 3');
    localStorage.removeItem('vocab_file_기초 영단어 Day 4');
    localStorage.removeItem('vocab_file_토플 영단어 Day 1');
    localStorage.setItem('vocab_db_version_5', 'true');
  }

  // 최초 로드 시 기본 단어 세트 저장소에 등록
  if (!localStorage.getItem('vocab_db_initialized')) {
    for (const [title, content] of Object.entries(DEFAULT_DATABASES)) {
      localStorage.setItem(`vocab_file_${title}`, content);
    }
    localStorage.setItem('vocab_db_initialized', 'true');
  }

  // 학원 단어장 로드
  if (currentUser && currentAcademyId && db) {
    if (statusEl) {
      statusEl.innerHTML = `ℹ️ <b>학원 단어장 동기화 중...</b>`;
      statusEl.style.color = '#3b82f6';
    }
    const cacheKey = `academy_vocab_fetched_${currentAcademyId}`;
    if (!localStorage.getItem(cacheKey)) {
      try {
        const qs = await db.collection('academies').doc(currentAcademyId).collection('vocabularies').get();
        if (!qs.empty) {
          qs.forEach(doc => {
            localStorage.setItem(`vocab_file_${doc.id}`, doc.data().content);
          });
        }
        localStorage.setItem(cacheKey, 'true');
      } catch(err) {
        console.error('Failed to fetch academy vocabs', err);
      }
    }
  }

  if (statusEl) {
    statusEl.innerHTML = currentAcademyId ? `ℹ️ <b>${userAcademyDisplay?.textContent?.split(': ')[1] || '학원'} 단어장</b>` : 'ℹ️ <b>웹 보관함 단어장</b>';
    statusEl.style.color = 'var(--text-sub)';
  }

  refreshDBList(textarea);
}

function refreshDBList(textarea) {
  const selectBasic = document.getElementById('select-basic-db');
  const selectTofl  = document.getElementById('select-tofl-db');
  const selectUser  = document.getElementById('select-user-db');
  const userSection = document.getElementById('user-db-section');
  const deleteBtn   = document.getElementById('btn-delete-user-db');

  if (!selectBasic || !selectTofl) return;

  const BUILTIN_KEYS = new Set(Object.keys(DEFAULT_DATABASES));

  selectBasic.innerHTML = '<option value="" style="background:var(--dropdown-hover);color:var(--text-main);">선택하기...</option>';
  selectTofl.innerHTML  = '<option value="" style="background:var(--dropdown-hover);color:var(--text-main);">선택하기...</option>';
  if (selectUser) selectUser.innerHTML = '<option value="" style="background:var(--dropdown-hover);color:var(--text-main);">선택하기...</option>';

  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('vocab_file_')) {
      keys.push(key.replace('vocab_file_', ''));
    }
  }
  keys.sort((a, b) => a.localeCompare(b, 'ko'));

  let hasUserDB = false;

  keys.forEach(title => {
    const opt = document.createElement('option');
    opt.value = title;
    opt.textContent = title;

    if (title.startsWith('토플')) {
      selectTofl.appendChild(opt);
    } else if (BUILTIN_KEYS.has(title)) {
      selectBasic.appendChild(opt);
    } else {
      // 사용자가 직접 추가한 단어장
      if (selectUser) selectUser.appendChild(opt);
      hasUserDB = true;
    }
  });

  // "내 단어장" 섹션 표시 여부
  if (userSection) {
    userSection.style.display = hasUserDB ? 'block' : 'none';
  }

  // 공통 선택 핸들러 — 한 드롭다운 선택 시 나머지 초기화
  function onSelectChange(e, others) {
    const selectedTitle = e.target.value;
    others.forEach(sel => { if (sel) sel.value = ''; });

    // 삭제 버튼: 내 단어장 드롭다운에서 선택했을 때만 표시
    if (deleteBtn) {
      const isUserSelect = (e.target === selectUser);
      deleteBtn.style.display = (isUserSelect && selectedTitle) ? 'block' : 'none';
    }

    const rangeTitleEl = document.querySelector('.range-title');
    const rangePanel = document.getElementById('range-select-panel');

    if (!selectedTitle) {
      if (rangeTitleEl) rangeTitleEl.textContent = '🧠 학습 구간 선택';
      if (rangePanel) rangePanel.classList.add('hidden');
      textarea.value = '';
      textarea.dispatchEvent(new Event('input'));
      return;
    }

    if (rangeTitleEl) {
      rangeTitleEl.textContent = `🧠 [${selectedTitle}] 학습 구간`;
    }

    // ── 단어장 이름을 App에 저장 (영구 저장 키로 사용) ──
    App.currentDBName = selectedTitle;
    const content = localStorage.getItem(`vocab_file_${selectedTitle}`);
    if (content) {
      textarea.value = content.trim();
      textarea.dispatchEvent(new Event('input'));
    }
  }

  selectBasic.onchange = (e) => onSelectChange(e, [selectTofl, selectUser]);
  selectTofl.onchange  = (e) => onSelectChange(e, [selectBasic, selectUser]);
  if (selectUser) {
    selectUser.onchange = (e) => onSelectChange(e, [selectBasic, selectTofl]);
  }

  // 삭제 버튼 핸들러
  if (deleteBtn) {
    if (deleteBtn) deleteBtn.onclick = () => {
      const selectedTitle = selectUser ? selectUser.value : '';
      if (!selectedTitle) return;
      if (confirm(`"${selectedTitle}" 단어장을 삭제하시겠습니까?`)) {
        localStorage.removeItem(`vocab_file_${selectedTitle}`);
        if (selectUser) selectUser.value = '';
        deleteBtn.style.display = 'none';
        textarea.value = '';
        textarea.dispatchEvent(new Event('input'));
        refreshDBList(textarea);
      }
    };
  }
}

// =============================================
// ② 학습 화면 (자동재생 루프)
// =============================================
async function startTest() {
  localStorage.setItem('skipAcademyModal', 'true');
  App.studyAbort = false; App.testSessionId = Date.now();
  if (!App.sessionStartTime) {
    App.sessionStartTime = Date.now();
  }
  recordProgress('in_progress');
  const textarea = document.getElementById('word-input');
  const rawWords = getFilteredWords();
  
  if (App.words.length === 0 && rawWords.length > 0) {
    App.words = rawWords;
  }
  
  if (App.words.length === 0) {
    alert('단어가 존재하지 않습니다.');
    return;
  }

  // ── localStorage에서 영구 저장된 단어 상태 복원 및 임시 플래그 리셋 ──
  if (App.round === 1) {
    loadWordStates(App.words);
    App.words.forEach(w => w.passed = false);
  }

  // ▶ Round 1은 전체 단어 셔플, Round 2+는 이전 라운드의 오답만 사용
  if (App.round === 1) {
    App.testPool = shuffle([...App.words]);
  } else {
    // 오답은 이미 App.testPool에 세팅되어 있음
    App.testPool = shuffle([...App.testPool]);
    // ⭐️ 라운드 전환 시 _alreadyGraded 플래그 리셋 ⭐️
    App.testPool.forEach(w => w._alreadyGraded = false);
  }
  App.currentTestIndex = 0;

  showView('view-test');
  document.getElementById('test-round').textContent = App.round;
  
  runTestRound();
}

// ── 취약점 집중 복습 시작 ──
async function startWeaknessReview(startIdx, endIdx, isFinalBoss = false) {
  App.studyAbort = false; App.testSessionId = Date.now();
  recordProgress('in_progress');
  // 1. 해당 구간의 전체 단어 로드
  const allWords = getFilteredWords();
  // localStorage에서 영구 상태 복원
  loadWordStates(allWords);
  const rangeWords = allWords.slice(startIdx, endIdx);

  // 2. 임시 플래그(passed) 무시 및 오답 필터링
  // passed === true 상태와 무관하게 오로지 totalFails 이력으로만 필터링합니다.
  console.log("로컬스토리지 오답 데이터:", localStorage.getItem('doacore_total_fails'));
  rangeWords.forEach(w => w.passed = false);
  const weakWords = rangeWords.filter(w => {
    if (isFinalBoss) {
      // 대그룹 총정리: 누적 오답 4회 이상 단어
      return (w.totalFails || 0) >= 4;
    } else {
      // 중그룹 복습: 누적 오답 2회 이상 단어
      return (w.totalFails || 0) >= 2;
    }
  });

  // 3. 방어 로직: 취약 단어 0개일 경우 처리
  if (weakWords.length === 0) {
    alert('🎉 대단합니다! 복습할 취약 단어가 없습니다.');
    return;
  }

  // 4. 테스트 화면 진입 전 상태 초기화
  stopWordTimer();
  window.speechSynthesis.cancel();

  // 5. 기존 테스트 루프 재사용
  App.words = rangeWords;         // 전체 구간 참조 유지
  App.testPool = shuffle([...weakWords]);  // 취약 단어만 테스트 풀에
  App.round = 1;
  App.currentTestIndex = 0;

  // 6. 테스트 화면 전환 및 루프 시작
  showView('view-test');
  document.getElementById('test-round').textContent = App.round;
  runTestRound();
}

let activeTimerInterval = null;
let activeWarningTimeout = null;
let activeDisableTimeout = null;

function startWordTimer(totalMs, disableOMs, onDisableO, onTimeout) {
  stopWordTimer();

  const wrapper = document.getElementById('timer-bar-wrapper');
  const fillEl = document.getElementById('test-timer-fill');
  const textEl = document.getElementById('timer-seconds-text');

  if (wrapper) wrapper.classList.remove('hidden');
  if (textEl) {
    textEl.style.display = 'none'; // 숫자 카운트다운 텍스트 숨김
  }

  if (fillEl) {
    fillEl.classList.remove('timer-penalty', 'penalty-timer', 'timer-warning');
    fillEl.style.transition = 'none';
    fillEl.style.width = '100%';
    fillEl.style.background = 'linear-gradient(90deg, #3b82f6, #6366f1)'; // 편안한 파란색 유지
    fillEl.style.display = 'block'; // 강제 표시 안전장치

    // 브라우저 렌더링 강제 리플로우 (초기화 즉시 반영)
    void fillEl.offsetWidth;

    // 미세한 딜레이(10ms) 후 애니메이션 다시 시작
    setTimeout(() => {
      fillEl.style.transition = `width ${totalMs}ms linear`;
      fillEl.style.width = '0%';
    }, 10);
  }

  // O 버튼 잠금 처리 타이머
  if (disableOMs > 0) {
    activeDisableTimeout = setTimeout(() => {
      if (onDisableO) onDisableO();
    }, disableOMs);
  }

  // 남은 시간이 2초 이하로 떨어지는 시점에 경고 표시
  const warningMs = Math.max(0, totalMs - 2000);
  activeWarningTimeout = setTimeout(() => {
    if (fillEl) fillEl.classList.add('timer-warning');
  }, warningMs);

  activeTimerInterval = setTimeout(() => {
    stopWordTimer();
    if (onTimeout) onTimeout();
  }, totalMs);
}

function stopWordTimer() {
  if (activeTimerInterval) {
    clearTimeout(activeTimerInterval);
    activeTimerInterval = null;
  }
  if (activeWarningTimeout) {
    clearTimeout(activeWarningTimeout);
    activeWarningTimeout = null;
  }
  if (activeDisableTimeout) {
    clearTimeout(activeDisableTimeout);
    activeDisableTimeout = null;
  }
  const wrapper = document.getElementById('timer-bar-wrapper');
  const fillEl = document.getElementById('test-timer-fill');
  if (wrapper) wrapper.classList.add('hidden');
  if (fillEl) {
    fillEl.style.transition = 'none';
    fillEl.classList.remove('timer-warning', 'timer-penalty', 'penalty-timer');
  }
}

function handleWordTimeout() {
  if (App.phase !== 'test') return;
  
  if (isSwipeMode) {
    isTimeUp = true;
    return;
  }

  if (typeof revealResolver === 'function' && revealResolver) {
    const r = revealResolver;
    revealResolver = null;
    r('TIMEOUT');
  } else if (typeof oxResolver === 'function' && oxResolver) {
    const r = oxResolver;
    oxResolver = null;
    r('TIMEOUT');
  } else if (typeof oxResolver === 'function' && oxResolver) {
    const r = oxResolver;
    oxResolver = null;
    r('TIMEOUT');
  }
}

async function runTestRound(startIndex = 0) {
  const currentSessionId = App.testSessionId;
  const pool = App.testPool;
  const wrongThisRound = [];
  let correctThisRound = 0;

  if (startIndex > 0) {
    for (let j = 0; j < startIndex; j++) {
      const wordObj = pool[j];
      if (wordObj.passed) {
        correctThisRound++;
      } else {
        wrongThisRound.push(wordObj);
      }
    }
  }

  for (let i = startIndex; i < pool.length; i++) {
    isTimeUp = false;
    if (App.studyAbort || App.testSessionId !== currentSessionId) return;
    stopWordTimer();
    const wordObj = pool[i];
    App.currentTestIndex = i;
    saveProgress();

    document.getElementById('test-current').textContent = i + 1;
    document.getElementById('test-total').textContent   = pool.length;
    const pct = ((i + 1) / pool.length * 100).toFixed(1);
    document.getElementById('test-progress-fill').style.width = pct + '%';

    const btnPrev = document.getElementById('btn-prev-word');
    if (btnPrev) btnPrev.disabled = false;

    document.getElementById('test-word').textContent = '';
    const btnSpeak = document.getElementById('btn-speak-again');
    if (btnSpeak) btnSpeak.classList.add('hidden');
    const posHintEl = document.getElementById('test-pos-hint');
if (posHintEl) posHintEl.textContent = '';
if (posHintEl) posHintEl.classList.add('hidden');
    document.getElementById('test-meanings').innerHTML = '';

    // Boss Mode 시각 효과 렌더링 분기
    const testCard = document.querySelector('.test-card');
    let bossBadge = document.getElementById('boss-mode-badge');
    if ((wordObj.attempts || 0) >= 4) {
      if (testCard) testCard.classList.add('boss-mode');
      if (!bossBadge) {
        bossBadge = document.createElement('span');
        bossBadge.id = 'boss-mode-badge';
        bossBadge.className = 'boss-badge';
        bossBadge.textContent = '💀 극상위 오답';
        if (testCard) testCard.insertBefore(bossBadge, testCard.firstChild);
      }
      if (bossBadge) bossBadge.style.display = isDictationMode ? 'none' : 'block';
    } else {
      if (testCard) testCard.classList.remove('boss-mode');
      if (bossBadge) bossBadge.remove();
    }


    // ⭐️ [버그 픽스] 타이머 바 상태 완벽 초기화 & 증발 방지 (듣기 단계에선 무조건 숨김)
    const wrapper = document.getElementById('timer-bar-wrapper');
    const fillEl = document.getElementById('test-timer-fill');
    if (wrapper) {
      wrapper.classList.add('hidden'); // 헤드셋 단계에선 무조건 숨김
      if (fillEl) {
        fillEl.style.transition = 'none';
        fillEl.style.width = '100%';
        fillEl.classList.remove('timer-warning');
      }
    }

    if (testCard) {
      if (isDictationMode) testCard.classList.add('dictation-mode-active');
      else testCard.classList.remove('dictation-mode-active');
    }
    if (isDictationMode) {
      document.getElementById('test-word').classList.add('hidden');
      const dictSpeaker = document.getElementById('btn-dictation-speaker');
      if (dictSpeaker) {
        dictSpeaker.classList.remove('hidden');
        const pencilDeco = document.getElementById('dictation-pencil-deco');
        if (pencilDeco) { pencilDeco.classList.remove('hidden'); pencilDeco.style.display = 'flex'; }
        dictSpeaker.onclick = () => speak(wordObj.word);
      }
      const oxC1 = document.getElementById('ox-buttons-container');
      if (oxC1) { oxC1.style.display = 'none'; oxC1.classList.add('hidden'); }
      
      // 뜻 숨김 상태로 시작
      document.getElementById('btn-reveal').classList.remove('hidden');
    
    const swipeHint = document.getElementById('swipe-hint');
    if (swipeHint) {
      if (isSwipeMode) swipeHint.classList.remove('hidden');
      else swipeHint.classList.add('hidden');
    }
      document.getElementById('test-meanings').classList.add('hidden');
      document.getElementById('test-meanings').innerHTML = meaningHTML(wordObj.meanings, wordObj);
      
      document.getElementById('dictation-zone').classList.remove('hidden');
      
      if (alwaysShowDictationMeaning) {
        document.getElementById('btn-reveal').classList.add('hidden');
        document.getElementById('test-meanings').classList.remove('hidden');
      } else {
        document.getElementById('btn-reveal').classList.remove('hidden');
        document.getElementById('test-meanings').classList.add('hidden');
      }

      // 뜻 확인하기 클릭 시 뜻 노출
      const btnReveal = document.getElementById('btn-reveal');
      if (btnReveal) {
        if (btnReveal) btnReveal.onclick = () => {
          document.getElementById('btn-reveal').classList.add('hidden');
          document.getElementById('test-meanings').classList.remove('hidden');
      const hintEl = document.querySelector('.hint-text');
      if (hintEl) hintEl.style.display = 'none';
        };
      }
    } else {
      document.getElementById('test-word').classList.remove('hidden');
      const dictSpeakerHide = document.getElementById('btn-dictation-speaker');
      if (dictSpeakerHide) dictSpeakerHide.classList.add('hidden');
      const pencilDecoHide = document.getElementById('dictation-pencil-deco');
      if (pencilDecoHide) { pencilDecoHide.classList.add('hidden'); pencilDecoHide.style.display = 'none'; }
      const oxC2 = document.getElementById('ox-buttons-container');
      if (oxC2) { oxC2.style.display = 'none'; oxC2.classList.add('hidden'); }
      const dicZone = document.getElementById('dictation-zone');
      if (dicZone) dicZone.classList.add('hidden');
      document.getElementById('btn-reveal').classList.add('hidden');
      document.getElementById('test-meanings').classList.add('hidden');
    }

    const listenZone = document.getElementById('test-listening-zone');
    if (listenZone && !isDictationMode) {
      listenZone.classList.remove('hidden');
    }

    // 자동으로 2번 읽기 (2초 간격)
    if (window.doubleSpeakTimeout) clearTimeout(window.doubleSpeakTimeout);
    speak(wordObj.word);
    window.doubleSpeakTimeout = setTimeout(() => {
      speak(wordObj.word);
    }, 2000);

    // 단어 클릭 시 다시 한 번 듣기 기능 추가
    const wordEl = document.getElementById('test-word');
    if (wordEl) {
      wordEl.style.cursor = 'pointer';
      wordEl.onclick = () => {
        if (window.doubleSpeakTimeout) clearTimeout(window.doubleSpeakTimeout);
        speak(wordObj.word);
      };
    }

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

    // 헤드셋(프라이밍) 단계가 끝나고 스펠링 공개될 때 타이머 노출
    if (wrapper && !isDictationMode) {
      wrapper.classList.remove('hidden');
    }
    
    // Nudge animation on first card after headset finishes
    if (isSwipeMode && i === 0 && !isAlreadyGraded) {
      const tc = document.getElementById('test-card-el');
      if (tc) {
        tc.classList.add('nudge-anim');
        setTimeout(() => { tc.classList.remove('nudge-anim'); }, 600);
      }
    }
    
    const testWordEl = document.getElementById('test-word');
    testWordEl.textContent = wordObj.word;
    
    if ((wordObj.totalFails || 0) >= 6) {
      testWordEl.style.color = '#ef4444';
    } else {
      testWordEl.style.color = 'var(--text-main)';
    }

    const wordWrapper = document.getElementById('test-word-wrapper');
    if (isDictationMode) {
      if (wordWrapper) wordWrapper.style.display = 'none';
    } else {
      if (wordWrapper) wordWrapper.style.display = 'flex';
    }

    const wordLength = wordObj.word.length;
    if (wordLength <= 5) {
        testWordEl.style.setProperty('font-size', 'min(19vw, 120px)', 'important');
    } else if (wordLength <= 7) {
        testWordEl.style.setProperty('font-size', 'min(16vw, 105px)', 'important');
    } else if (wordLength <= 9) {
        testWordEl.style.setProperty('font-size', 'min(14vw, 90px)', 'important');
    } else if (wordLength <= 11) {
        testWordEl.style.setProperty('font-size', 'min(11.5vw, 70px)', 'important');
    } else if (wordLength <= 14) {
        testWordEl.style.setProperty('font-size', 'min(10vw, 65px)', 'important');
    } else {
        testWordEl.style.setProperty('font-size', 'min(8.5vw, 55px)', 'important');
    }
    if (btnSpeak) {
      btnSpeak.classList.remove('hidden');
      if (btnSpeak) btnSpeak.onclick = () => speak(wordObj.word);
    }
if (posHintEl) posHintEl.innerHTML = `품사 <span style="font-size: 1.3em; color: var(--primary-color); font-weight: 900;">${wordObj.meanings.length}</span>개`;
    if (!isDictationMode) {
if (posHintEl) { posHintEl.classList.remove('hidden'); posHintEl.style.display = 'block'; }
    }
    if (!(isDictationMode && alwaysShowDictationMeaning)) {
      document.getElementById('btn-reveal').classList.remove('hidden');
    }

    let revealResult = 'O'; 
    App.isOButtonLocked = false;
            App.isPenaltyTime = false; // 글로벌 잠금 플래그

    if (!isDictationMode) {
      if (!isAlreadyGraded) {
        // 다이내믹 타이머 설정
        let totalMs = 10000;
        let disableOMs = 5000;
        const mLen = wordObj.meanings ? wordObj.meanings.length : 1;
        if (mLen === 1) {
          totalMs = 7000;
        } else if (mLen === 2) {
          totalMs = 9000;
        } else {
          totalMs = 10000;
        }

        startWordTimer(
          totalMs, 
          disableOMs, 
          () => {
            // O 버튼 비활성화 및 페널티 타임 돌입
            App.isOButtonLocked = true;
            App.isPenaltyTime = true;
            const btnCorrect = document.getElementById('btn-correct');
            if (btnCorrect) {
              btnCorrect.disabled = true;
              btnCorrect.style.opacity = '0.5';
              btnCorrect.style.pointerEvents = 'none';
            }
            const fillEl = document.getElementById('test-timer-fill');
            if (fillEl) {
              fillEl.style.background = ''; // inline style 제거해서 css가 먹히도록
              fillEl.classList.add('penalty-timer');
            }

            // [수정] 강제 오픈: O버튼이 비활성화되는 정확히 그 시점에 강제로 뜻 노출
            const btnReveal = document.getElementById('btn-reveal');
            // 이미 열려있지 않은 경우에만 클릭
            if (btnReveal && !btnReveal.classList.contains('hidden')) {
              btnReveal.click();
            }
          },
          () => {
            // 전체 타임아웃
            if (typeof revealResolver === 'function' && revealResolver) {
              const r = revealResolver; revealResolver = null; r('TIMEOUT');
            } else if (typeof oxResolver === 'function' && oxResolver) {
              const r = oxResolver; oxResolver = null; r('TIMEOUT');
            }
          }
        );
      } else {
        // 이미 채점된 단어면 타이머 바를 아예 숨기거나 정지 상태로 둠
        stopWordTimer();
        revealResult = 'O'; // 강제로 reveal 통과
      }

      if (!isAlreadyGraded) {
        revealResult = await waitForRevealOrPrev();
      }
    }

    // [이전 단어] 처리: reveal 단계에서 이전 단어 클릭
    if (revealResult === 'PREV') {
      stopWordTimer();
      if (i > 0) {
        i = i - 2;
      } else {
        i = -1; // so it loops back to 0
      }
      window.speechSynthesis.cancel();
      continue;
    }

    // 타임아웃 시 강제 오답(X) 처리 및 자동 넘김
    if (revealResult === 'SKIP' || revealResult === 'TIMEOUT') {
      stopWordTimer();
      if (!isAlreadyGraded) {
        wordObj.attempts++;
        let failData = JSON.parse(localStorage.getItem('doacore_total_fails')) || {};
        failData[wordObj.word] = (failData[wordObj.word] || 0) + 1;
        setProgressSync('doacore_total_fails', JSON.stringify(failData));
        wordObj.totalFails = failData[wordObj.word];
        wordObj.passed = false;
        wordObj._alreadyGraded = true;
        saveWordStates();
        wrongThisRound.push(wordObj);
      }
      window.speechSynthesis.cancel();
      continue;
    }

    if (!isDictationMode) {
      document.getElementById('btn-reveal').classList.add('hidden');
      document.getElementById('test-meanings').innerHTML = meaningHTML(wordObj.meanings, wordObj);
      document.getElementById('test-meanings').classList.remove('hidden');
      const hintEl = document.getElementById('test-pos-hint');
      if (hintEl) hintEl.style.display = 'none';
      const oxC3 = document.getElementById('ox-buttons-container');
      if (oxC3) { 
        if (isSwipeMode) {
          oxC3.style.display = 'none';
          oxC3.classList.add('hidden');
        } else {
          oxC3.style.display = 'flex'; 
          oxC3.classList.remove('hidden');
        }
      }
    }

    setOXDisabled(false);

    // 강제 잠금 상태 (이전 단어 수정 시에는 자유롭게 허용)
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
    if (result === "ABORT" || App.studyAbort || App.testSessionId !== currentSessionId) return;

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
          setProgressSync('doacore_total_fails', JSON.stringify(failData));
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
            setProgressSync('doacore_total_fails', JSON.stringify(failData));
            
            wordObj.userChoice = 'O';
            wordObj.passed = true;
            correctThisRound++;
            const idx = wrongThisRound.findIndex(w => w.word === wordObj.word);
            if (idx > -1) wrongThisRound.splice(idx, 1);
            saveWordStates();
          } else if (result === 'X' && wordObj.userChoice === 'O') {
            // O -> X 로 수정 (실수로 맞췄다고 한 경우)
            failData[wordObj.word] = (failData[wordObj.word] || 0) + 1;
            setProgressSync('doacore_total_fails', JSON.stringify(failData));
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

    await sleep(180);
  }

  App.testPool = wrongThisRound;
  App.currentTestIndex = 0;
  saveProgress();
  showRoundResult(correctThisRound, wrongThisRound.length);
}

let oxResolver = null;

function waitForDictationOrPrev(wordObj) {
  return new Promise(resolve => {
    oxResolver = resolve; // Reusing oxResolver for PREV button support
    
    const inputEl = document.getElementById('dictation-input');
    const feedbackEl = document.getElementById('dictation-feedback');
    const submitBtn = document.getElementById('btn-dictation-submit');
    const btnPrev = document.getElementById('btn-prev-word');
    
    if (btnPrev) {
      if (btnPrev) btnPrev.onclick = () => {
        if (oxResolver) { oxResolver('PREV'); oxResolver = null; }
      };
    }

    inputEl.value = '';
    inputEl.style.borderColor = 'rgba(255,255,255,0.2)';
    feedbackEl.textContent = '';
    feedbackEl.style.color = '';
    inputEl.focus();

    let failedCount = 0;

    const checkAnswer = () => {
      const val = inputEl.value.trim().toLowerCase();
      const ans = wordObj.word.trim().toLowerCase();
      
      if (val === ans) {
        window.speechSynthesis.cancel(); // TTS 즉시 중단
        inputEl.style.borderColor = '#10b981'; // Green
        feedbackEl.textContent = '정답!';
        feedbackEl.style.color = '#10b981';
        setTimeout(() => {
          if (oxResolver) {
            oxResolver(failedCount > 0 ? 'X_DICTATION' : 'O');
            oxResolver = null;
          }
        }, 150);
      } else {
        // 오답 강제 제어 (Lock)
        if (failedCount === 0) {
          wordObj.attempts = (wordObj.attempts || 0) + 1;
          saveWordStates();
          if (typeof saveProgress === 'function') saveProgress();
        }
        
        failedCount++;
        
        // Error sound
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        currentAudio = audio;
        audio.play().catch(e=>console.log(e));
        
        inputEl.style.borderColor = '#ef4444'; // Red
        if (failedCount === 1) {
          feedbackEl.innerHTML = '틀렸습니다. 다시 한 번 시도해 보세요!';
          feedbackEl.style.color = '#ef4444';
          inputEl.value = ''; // 1회 틀렸을 때 입력창 비워주기
        } else {
          feedbackEl.innerHTML = `정답: <span style="color:#ef4444;">${wordObj.word}</span>`;
          feedbackEl.style.color = '#fff';
        }
      }
    };

    inputEl.onkeydown = (e) => {
      if (e.key === 'Enter') {
        checkAnswer();
      }
    };
    
    if (submitBtn) {
      if (submitBtn) submitBtn.onclick = checkAnswer;
    }
  });
}

function waitForOXOrPrev() {
  return new Promise(resolve => {
    oxResolver = resolve;
    const startTime = Date.now();
    
    const btnPrev = document.getElementById('btn-prev-word');
    if (btnPrev) {
      if (btnPrev) btnPrev.onclick = () => {
        if (oxResolver) { oxResolver('PREV'); oxResolver = null; }
      };
    }

    const btnNext = document.getElementById('btn-next-word');
    if (btnNext) {
      if (btnNext) btnNext.onclick = () => {
        if (oxResolver) { oxResolver('SKIP'); oxResolver = null; }
      };
    }

    if (document.getElementById('btn-correct')) document.getElementById('btn-correct').onclick = () => {
      if (Date.now() - startTime < 300) return; // 고스트 클릭/더블탭 방지
      if (oxResolver) { oxResolver('O'); oxResolver = null; }
    };
    if (document.getElementById('btn-wrong')) document.getElementById('btn-wrong').onclick = () => {
      if (Date.now() - startTime < 300) return; // 고스트 클릭/더블탭 방지
      if (oxResolver) { oxResolver('X'); oxResolver = null; }
    };
  });
}

let revealResolver = null;
function waitForRevealOrPrev() {
  return new Promise(resolve => {
    revealResolver = resolve;
    
    const btnPrev = document.getElementById('btn-prev-word');
    if (btnPrev) {
      if (btnPrev) btnPrev.onclick = () => {
        if (revealResolver) { revealResolver('PREV'); revealResolver = null; }
      };
    }

    const btnNext = document.getElementById('btn-next-word');
    if (btnNext) {
      if (btnNext) btnNext.onclick = () => {
        if (revealResolver) { revealResolver('SKIP'); revealResolver = null; }
      };
    }

    if (document.getElementById('btn-reveal')) document.getElementById('btn-reveal').onclick = () => {
      if (revealResolver) { revealResolver('REVEAL'); revealResolver = null; }
    };
  });
}

function setOXDisabled(disabled) {
  const btnC = document.getElementById('btn-correct');
  const btnW = document.getElementById('btn-wrong');
  if (btnC) {
    btnC.disabled = disabled;
    btnC.style.opacity = disabled ? '0.5' : '1';
    btnC.style.pointerEvents = disabled ? 'none' : 'auto';
  }
  if (btnW) {
    btnW.disabled = disabled;
    btnW.style.opacity = disabled ? '0.5' : '1';
    btnW.style.pointerEvents = disabled ? 'none' : 'auto';
  }
}

let currentUtterance = null; // 가비지 컬렉션(GC)으로 인한 음성 멈춤 방지 전역 참조

function speak(text) {
  try {
    if ('speechSynthesis' in window) {
      let delay = 50;
      // 이전 음성이 재생 중이거나 대기 중일 때만 cancel 수행 (cancel이 잦으면 안드로이드에서 앞부분이 씹힘)
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
        delay = 250; // cancel 직후 안드로이드 TTS 엔진 재시동 시간을 벌어주기 위해 딜레이 증가
      }
      
      window.speechSynthesis.resume(); // Chrome/Edge 일시정지 상태 멈춤 버그 해제
      
      // 안드로이드 및 느린 기기에서 맨 앞 발음이 잘리는 것을 방지하기 위해 보이지 않는 공백 패딩 추가
      const paddedText = "  " + text;
      
      currentUtterance = new SpeechSynthesisUtterance(paddedText);
      currentUtterance.lang = 'en-US';
      currentUtterance.rate = 0.85;
      currentUtterance.onerror = (e) => console.warn('TTS error:', e);
      currentUtterance.onend = () => { currentUtterance = null; };
      
      // cancel() 직후 speak() 호출 시 발생하는 레이스 컨디션 및 엔진 준비 시간 확보
      setTimeout(() => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.speak(currentUtterance);
          window.speechSynthesis.resume();
        }
      }, delay);
    }
  } catch(e) {
    console.warn('TTS error:', e);
  }
}

// =============================================
// ④ 라운드 결과 화면
// =============================================
function showRoundResult(correct, wrong) {
  // ── 라운드 종료 시 단어 상태 영구 저장 ──
  saveWordStates();

  // X가 0개이거나 딕테이션 모드이면 최종 성적표로 (딕테이션은 재시험 없음)
  if (wrong === 0 || isDictationMode) {
    showFinalResult();
    return;
  }

  // 오답이 남았으면 라운드 결과 화면 표시
  showView('view-result');
  document.getElementById('round-correct').textContent = correct;
  document.getElementById('round-wrong').textContent   = wrong;

  const emoji = correct >= wrong ? '💪' : '📖';
  document.getElementById('round-result-emoji').textContent = emoji;
  document.getElementById('round-message').textContent = `${wrong}개 단어를 다시 테스트합니다. 화이팅!`;

  App.round++;
  const btnNext = document.getElementById('btn-next-round');
  btnNext.innerHTML = `Round ${App.round} 시작 →`;
  if (btnNext) btnNext.onclick = () => {
    startTest();
  };
}

// =============================================
// ⑤ 최종 결과 화면
// =============================================
function showFinalResult() {
  // ── 최종 완료 시 단어 상태 영구 저장 ──
  saveWordStates();
  recordProgress('completed');
  recordStudyTime();
  clearProgress();
  showView('view-final');

  const all = App.words;
  const wrongWords = all.filter(w => w.attempts > 0);

  const tableSection = document.getElementById('table-section');
  if (tableSection) tableSection.classList.remove('hidden');

  if (document.getElementById('btn-download-csv')) document.getElementById('btn-download-csv').onclick = () => {
    let csv = '\ufeff번호,단어,뜻,오답 시도 횟수\n';
    wrongWords.forEach((w, idx) => {
      const meaningsStr = w.meanings.map(m => `[${m.pos}] ${m.meaning}`).join(' / ');
      csv += `${idx + 1},"${w.word}","${meaningsStr}",${w.attempts}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DOACore_오답성적표.csv`;
    a.click();
  };

  const btnRestartDictation = document.getElementById('btn-restart-dictation');
  if (btnRestartDictation) {
    if (isDictationMode) {
      btnRestartDictation.classList.remove('hidden');
      btnRestartDictation.onclick = () => {
        App.currentTestIndex = 0;
        App.round = 4;
        App.phase = 'TEST';
        App.testPool = App.words.slice();
        App.testPool.forEach(w => {
            w.attempts = 0;
            w._alreadyGraded = false;
        });
        showView('view-test');
        runTestRound();
      };
    } else {
      btnRestartDictation.classList.add('hidden');
    }
  }

  const tbody = document.getElementById('result-tbody');
  tbody.innerHTML = '';
  
  if (wrongWords.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="4" style="text-align:center; padding: 30px; font-weight:bold; color:#10b981; font-size: 18px;">🎉 오답이 한 개도 없습니다. 완벽합니다! 🎉</td>`;
    tbody.appendChild(tr);

    // 오답 0개로 완벽 종료 시 1.8초 후 자동으로 홈 이동 & 새로고침
    setTimeout(() => {
      localStorage.setItem('skipAcademyModal', 'true');
      window.location.reload();
    }, 1800);
  } else {
    const sorted = [...wrongWords].sort((a, b) => b.attempts - a.attempts);
    sorted.forEach((w, idx) => {
      const tr = document.createElement('tr');
      if (w.attempts >= 3) {
        tr.style.background = 'rgba(245, 158, 11, 0.15)';
      } else if (w.attempts === 2) {
        tr.style.background = 'rgba(239, 68, 68, 0.08)';
      }
      const meaningsStr = w.meanings.map(m => `[${esc(m.pos)}] ${esc(m.meaning)}`).join('<br>');
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td style="font-weight: 700;">${esc(w.word)}</td>
        <td style="text-align: left;">${meaningsStr}</td>
        <td style="font-weight: bold; color: ${w.attempts >= 3 ? '#f59e0b' : w.attempts === 2 ? 'var(--red)' : 'var(--text-main)'}">${w.attempts}회</td>
      `;
      tbody.appendChild(tr);
    });
  }

  if (document.getElementById('btn-restart')) document.getElementById('btn-restart').onclick = () => {
    isDictationMode = false; // restart
    App.words    = [];
    App.testPool = [];
    App.round    = 1;
    localStorage.setItem('skipAcademyModal', 'true');
    window.location.reload();
  };
}

function saveProgress() {
  const data = {
    words: App.words,
    testPool: App.testPool,
    round: App.round,
    phase: App.phase,
    currentTestIndex: App.currentTestIndex
  };
  setProgressSync('vocab_trainer_progress', JSON.stringify(data));
}

function clearProgress() {
  localStorage.removeItem('vocab_trainer_progress');
}

function restoreProgress(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    App.words = data.words || [];
    App.testPool = data.testPool || [];
    App.round = data.round || 1;
    App.phase = data.phase || 'input';
    App.currentTestIndex = data.currentTestIndex || 0;

    if (App.testPool.length > 0) {
      showView('view-test');
      document.getElementById('test-round').textContent = App.round;
      
      const pool = App.testPool;
      const i = App.currentTestIndex;
      document.getElementById('test-current').textContent = i + 1;
      document.getElementById('test-total').textContent   = pool.length;
      const pct = ((i + 1) / pool.length * 100).toFixed(1);
      document.getElementById('test-progress-fill').style.width = pct + '%';
      
      runTestRound(i);
    }
  } catch (e) {
    console.error('테스트 상태 복원 실패:', e);
    clearProgress();
  }
}



// =============================================
// 초기화
// =============================================

  const goHomeHandler = () => {
    if (confirm('테스트를 중단하고 홈으로 돌아가시겠습니까?')) {
      recordStudyTime(); // ⏱️ 중단 시에도 시간 누적 저장
      App.studyAbort = true;
      if (oxResolver) { oxResolver('ABORT'); oxResolver = null; }
      stopWordTimer();
      window.speechSynthesis.cancel();
      if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
      isDictationMode = false; // reset
      App.words    = [];
      App.testPool = [];
      App.round    = 1;
      localStorage.setItem('skipAcademyModal', 'true');
      window.location.reload();
    }
  };
  const btnHomeTest = document.getElementById('btn-home-test');
  if (btnHomeTest) btnHomeTest.onclick = goHomeHandler;
  const btnHomeResult = document.getElementById('btn-home-result');
  if (btnHomeResult) btnHomeResult.onclick = goHomeHandler;
  const btnRestart = document.getElementById('btn-restart');
  if (btnRestart) {
    btnRestart.onclick = () => {
      localStorage.setItem('skipAcademyModal', 'true');
      window.location.reload();
    };
  }
  initInputView();

  // ── 전체화면 진입 (상태바/배터리/시계 숨기기) ──
  // 브라우저에서 접속 시 첫 터치/클릭으로 Fullscreen API 호출
  function tryFullscreen() {
    const el = document.documentElement;
    const rfs = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (rfs && !document.fullscreenElement && !document.webkitFullscreenElement) {
      rfs.call(el).catch(() => {});
    }
    document.removeEventListener('click', tryFullscreen);
    document.removeEventListener('touchstart', tryFullscreen);
  }
  // PWA standalone 모드가 아닐 때만 (PWA는 manifest display:fullscreen으로 자동 처리)
  if (!window.matchMedia('(display-mode: fullscreen)').matches &&
      !window.matchMedia('(display-mode: standalone)').matches &&
      !window.navigator.standalone) {
    document.addEventListener('click', tryFullscreen, { once: true });
    document.addEventListener('touchstart', tryFullscreen, { once: true });
  }

  const saved = localStorage.getItem('vocab_trainer_progress');
  if (saved) {
    setTimeout(() => {
      if (confirm('이전에 테스트 중이던 기록이 있습니다.\n이어서 마저 진행하시겠습니까?')) {
        restoreProgress(saved);
      } else {
        clearProgress();
      }
    }, 300);
  }

  let deferredPrompt;
  const installModal = document.getElementById('pwa-install-modal');
  const btnInstall = document.getElementById('btn-pwa-install');
  const btnClose = document.getElementById('btn-pwa-close');
  const btnInstallPwa = document.getElementById('btn-install-pwa');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    if (btnInstallPwa) btnInstallPwa.style.display = 'inline-block';

    if (!localStorage.getItem('pwa_install_rejected')) {
      setTimeout(() => {
        if (installModal) installModal.classList.remove('hidden');
      }, 2000);
    }
  });

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA 설치 선택 결과: ${outcome}`);
    if (installModal) installModal.classList.add('hidden');
    if (btnInstallPwa) btnInstallPwa.style.display = 'none';
    deferredPrompt = null;
  };

  if (btnInstall) {
    if (btnInstall) btnInstall.onclick = handleInstallClick;
  }
  
  if (btnInstallPwa) {
    if (btnInstallPwa) btnInstallPwa.onclick = handleInstallClick;
  }

  if (btnClose) {
    if (btnClose) btnClose.onclick = () => {
      if (installModal) installModal.classList.add('hidden');
      localStorage.setItem('pwa_install_rejected', 'true');
    };
  }

  const infoModal = document.getElementById('info-modal');
  const btnShowInfo = document.getElementById('btn-show-info');
  const btnInfoClose = document.getElementById('btn-info-close');
  const btnInfoOk = document.getElementById('btn-info-ok');

  if (btnShowInfo && infoModal) {
    if (btnShowInfo) btnShowInfo.onclick = () => {
      infoModal.classList.remove('hidden');
    };
  }

  if (btnInfoClose && infoModal) {
    if (btnInfoClose) btnInfoClose.onclick = () => {
      infoModal.classList.add('hidden');
    };
  }

  if (btnInfoOk && infoModal) {
    if (btnInfoOk) btnInfoOk.onclick = () => {
      infoModal.classList.add('hidden');
    };
  }

  const devModal = document.getElementById('modal-developer-story');
  const btnShowDev = document.getElementById('btn-developer-story');
  const btnDevClose = document.getElementById('btn-developer-story-close');
  const btnDevOk = document.getElementById('btn-developer-story-ok');

  if (btnShowDev && devModal) {
    if (btnShowDev) btnShowDev.onclick = () => devModal.classList.remove('hidden');
  }
  if (btnDevClose && devModal) {
    if (btnDevClose) btnDevClose.onclick = () => devModal.classList.add('hidden');
  }
  if (btnDevOk && devModal) {
    if (btnDevOk) btnDevOk.onclick = () => devModal.classList.add('hidden');
  }

  // 홈으로 이동 버튼 핸들러
  

//  Swipe Logic 
const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth <= 768;
let savedSwipe = localStorage.getItem('isSwipeMode');
let isSwipeMode = savedSwipe !== null ? savedSwipe === 'true' : false;
let isHideMeaningMode = false;
let isTimeUp = false;
let swipeStartX = 0;
let swipeStartY = 0;
let swipeCurrentX = 0;
let swipeCurrentY = 0;
let isDragging = false;
let isVerticalScroll = false;


  
  const hideMeaningToggle = document.getElementById('hide-meaning-toggle');
  if (hideMeaningToggle) {
    hideMeaningToggle.addEventListener('change', (e) => {
      isHideMeaningMode = e.target.checked;
      const btnViewAllWords = document.getElementById('btn-view-all-words');
      if (btnViewAllWords) btnViewAllWords.click();
    });
  }

  const swipeToggle = document.getElementById('swipe-toggle-checkbox');
  const swipeToggleTest = document.getElementById('swipe-toggle-checkbox-test');
  const testCard = document.getElementById('test-card-el');

  function updateSwipeMode(checked) {
    isSwipeMode = checked;
    localStorage.setItem('isSwipeMode', isSwipeMode);
    
    if (swipeToggle) swipeToggle.checked = isSwipeMode;
    if (swipeToggleTest) swipeToggleTest.checked = isSwipeMode;

    if (!isSwipeMode && testCard) {
      testCard.style.transform = '';
      testCard.style.boxShadow = '';
      testCard.classList.remove('dragging');
    }

    const swipeHint = document.getElementById('swipe-hint');
    if (swipeHint) {
      if (isSwipeMode && App.phase === 'test') {
        swipeHint.classList.remove('hidden');
      } else {
        swipeHint.classList.add('hidden');
      }
    }
    
    const oxC = document.getElementById('ox-buttons-container');
    const btnReveal = document.getElementById('btn-reveal');
    if (oxC && btnReveal) {
      if (isSwipeMode) {
        oxC.style.display = 'none';
        oxC.classList.add('hidden');
      } else {
        if (btnReveal.classList.contains('hidden') && document.getElementById('test-meanings') && !document.getElementById('test-meanings').classList.contains('hidden')) {
          oxC.style.display = 'flex';
          oxC.classList.remove('hidden');
        }
      }
    }
  }

  if (swipeToggle) {
    swipeToggle.checked = isSwipeMode;
    swipeToggle.addEventListener('change', (e) => updateSwipeMode(e.target.checked));
  }
  if (swipeToggleTest) {
    swipeToggleTest.checked = isSwipeMode;
    swipeToggleTest.addEventListener('change', (e) => updateSwipeMode(e.target.checked));
  }

  if (testCard) {
    testCard.addEventListener('touchstart', (e) => {
      if (isDictationMode || !isSwipeMode) return;
      if (e.target.closest('button')) return; 
      isDragging = true;
      isVerticalScroll = false;
      swipeStartX = e.touches[0].clientX;
      swipeCurrentX = swipeStartX;
      swipeStartY = e.touches[0].clientY;
      swipeCurrentY = swipeStartY;
      testCard.classList.add('dragging');
      if (typeof stopWordTimer === 'function') stopWordTimer();
    });

    testCard.addEventListener('touchmove', (e) => {
      if (isDictationMode || !isSwipeMode || !isDragging || isVerticalScroll) return;
      if (e.target.closest('button')) return; 
      swipeCurrentX = e.touches[0].clientX;
      swipeCurrentY = e.touches[0].clientY;
      const deltaX = swipeCurrentX - swipeStartX;
      const deltaY = swipeCurrentY - swipeStartY;

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
        isVerticalScroll = true;
        testCard.style.transition = '';
        testCard.style.transform = '';
        testCard.style.boxShadow = '';
        return;
      }

      const rotateDeg = deltaX * 0.05;
      testCard.style.transform = `translate(${deltaX}px, 0) rotate(${rotateDeg}deg)`;

      const opacity = Math.min(Math.abs(deltaX) / 80, 1);

      if (deltaX > 0) {
        testCard.style.boxShadow = `0 0 40px rgba(74, 222, 128, ${opacity * 0.4})`;
      } else if (deltaX < 0) {
        testCard.style.boxShadow = `0 0 40px rgba(244, 63, 94, ${opacity * 0.4})`;
      } else {
        testCard.style.boxShadow = '';
      }
    });

    testCard.addEventListener('touchend', (e) => {
      if (isDictationMode || !isSwipeMode || !isDragging) return;
      if (e.target.closest('button')) return;
      isDragging = false;
      testCard.classList.remove('dragging');

      function resetCard() {
        testCard.style.transition = '';
        testCard.style.transform = '';
        testCard.style.boxShadow = '';
      }

      if (isVerticalScroll) {
        resetCard();
        swipeStartX = 0;
        swipeCurrentX = 0;
        swipeStartY = 0;
        swipeCurrentY = 0;
        return;
      }

      const deltaX = swipeCurrentX - swipeStartX;
      const threshold = 110;

      if (deltaX > threshold || deltaX < -threshold) {
        // 페널티 타임이거나 isTimeUp이면 강제 오답(X) 처리
        const isForceWrong = isTimeUp || App.isPenaltyTime;
        // O 방향으로 밀어도 페널티 타임이면 isActuallyO는 false가 됨
        const isActuallyO = deltaX > threshold && !isForceWrong;
        // 반대로 페널티 타임일 때 O 방향으로 밀면 강제로 X 처리를 해줌 (isActuallyX가 true가 되도록)
        const isActuallyX = deltaX < -threshold || (deltaX > threshold && isForceWrong) || isForceWrong;
        const globalStamp = document.getElementById('global-stamp');

        testCard.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
        testCard.style.opacity = '0';

        if (isActuallyO) {
          if (navigator.vibrate) navigator.vibrate(50);
          testCard.style.transform = `translate(100vw, 0) rotate(15deg)`;
          
          if (globalStamp) {
            globalStamp.textContent = "O";
            globalStamp.className = "stamp-o stamp-show";
          }
          
          setTimeout(() => {
            if (globalStamp) {
              globalStamp.classList.remove('stamp-show');
            }
            document.getElementById('btn-correct').click();
            testCard.style.opacity = '1';
            resetCard();
          }, 600);
        } else if (isActuallyX) {
          if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
          testCard.style.transform = `translate(${deltaX > 0 ? 100 : -100}vw, 0) rotate(${deltaX > 0 ? 15 : -15}deg)`;
          
          if (globalStamp) {
            globalStamp.textContent = "X";
            globalStamp.className = "stamp-x stamp-show";
          }
          
          setTimeout(() => {
            if (globalStamp) {
              globalStamp.classList.remove('stamp-show');
            }
            document.getElementById('btn-wrong').click();
            testCard.style.opacity = '1';
            resetCard();
          }, 600);
        }
      } else {
        resetCard();
      }
      swipeStartX = 0;
      swipeCurrentX = 0;
      swipeStartY = 0;
      swipeCurrentY = 0;
    });
  }


// Settings Button Toggle Logic
(function() {
  const btnSettings = document.getElementById('btn-settings');
  const settingsDropdown = document.getElementById('settings-dropdown');
  if (btnSettings && settingsDropdown) {
    btnSettings.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsDropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
      if (!settingsDropdown.contains(e.target) && e.target !== btnSettings) {
        settingsDropdown.classList.add('hidden');
      }
    });
  }

  // 기존 전체 앱 초기화 (데이터 완전 삭제)
  const btnResetProgress = document.getElementById('btn-reset-progress');
  if (btnResetProgress) {
    btnResetProgress.addEventListener('click', async (e) => {
      e.stopPropagation();
      const confirmReset = confirm('정말로 모든 데이터(단어 목록, 오답 기록, 학습 진도 등)를 완전히 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.');
      if (confirmReset) {
        try {
          localStorage.clear();
          alert('앱 전체 데이터가 성공적으로 초기화되었습니다.');
          location.reload();
        } catch (error) {
          console.error('초기화 중 오류 발생:', error);
          alert('초기화 중 오류가 발생했습니다.');
        }
      }
    });
  }

  // 새로 추가된 학습 기록 부분 초기화
  const btnResetStudy = document.getElementById('btn-reset-study');
  const modalResetStudy = document.getElementById('modal-reset-study');
  const btnResetStudyClose = document.getElementById('btn-reset-study-close');
  const btnResetStudyCat = document.getElementById('btn-reset-study-category');
  const btnResetStudyAll = document.getElementById('btn-reset-study-all');
  const selectResetStudyCat = document.getElementById('reset-study-category');
  const selectResetStudyDay = document.getElementById('reset-study-day');

  if (btnResetStudy && modalResetStudy) {
    btnResetStudy.addEventListener('click', (e) => {
      e.stopPropagation();
      populateDaysForReset();
      modalResetStudy.classList.remove('hidden');
    });

    if (btnResetStudyClose) {
      btnResetStudyClose.addEventListener('click', () => {
        modalResetStudy.classList.add('hidden');
      });
    }

    if (selectResetStudyCat && selectResetStudyDay) {
      selectResetStudyCat.addEventListener('change', populateDaysForReset);
    }

    function populateResetCategoryOptions() {
      if (!selectResetStudyCat) return;
      selectResetStudyCat.innerHTML = '';

      if (currentAcademyId) {
        const wb1TitleStr = (document.getElementById('admin-wb1-title')?.value || '1번 단어장').trim();
        const wb2TitleStr = (document.getElementById('admin-wb2-title')?.value || '2번 단어장').trim();

        const opt1 = document.createElement('option');
        opt1.value = 'academy-slot_1';
        opt1.textContent = `🏫 ${currentAcademyName || '학원'} 1번: ${wb1TitleStr}`;
        selectResetStudyCat.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = 'academy-slot_2';
        opt2.textContent = `🏫 ${currentAcademyName || '학원'} 2번: ${wb2TitleStr}`;
        selectResetStudyCat.appendChild(opt2);
      }

      const defaultCats = [
        { value: 'basic', text: '🌱 기초 영단어' },
        { value: 'toefl', text: '🔥 토플 영단어' },
        { value: 'custom-upload', text: '📁 업로드 단어장' },
        { value: 'custom-manual', text: '✍️ 수동 단어장' }
      ];

      defaultCats.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.value;
        opt.textContent = c.text;
        selectResetStudyCat.appendChild(opt);
      });

      populateDaysForReset();
    }

    function populateDaysForReset() {
      if (!selectResetStudyCat || !selectResetStudyDay) return;
      const cat = selectResetStudyCat.value;
      selectResetStudyDay.innerHTML = '<option value="all">해당 카테고리 전체 초기화</option>';
      
      const days = new Set();
      if (typeof words !== 'undefined') {
        words.forEach(w => {
          if (w.category === cat && w.day != null) {
            days.add(w.day);
          }
        });
      }
      
      const sortedDays = Array.from(days).sort((a, b) => isNaN(a) || isNaN(b) ? String(a).localeCompare(String(b)) : a - b);
      
      sortedDays.forEach(day => {
        const opt = document.createElement('option');
        opt.value = day;
        opt.textContent = isNaN(day) ? `'${day}' 단어장만 초기화` : `Day ${day} 단어장만 초기화`;
        selectResetStudyDay.appendChild(opt);
      });
    }

    async function clearStudyRecordForCategory(category, day = null) {
      const dbName = day ? `${category}_day${day}` : category;
      
      // 1. vocab_progress 에서 제거
      let progress = JSON.parse(localStorage.getItem('vocab_progress')) || {};
      Object.keys(progress).forEach(key => {
        if (day ? key.startsWith(dbName + '_') : key.startsWith(category)) {
          delete progress[key];
        }
      });
      setProgressSync('vocab_progress', JSON.stringify(progress));
      
      let studyTime = JSON.parse(localStorage.getItem('vocab_study_time')) || {};
      let studyTimeUpdated = false;
      Object.keys(studyTime).forEach(key => {
        if (day ? key.startsWith(dbName + '_') : key.startsWith(category)) {
          delete studyTime[key];
          studyTimeUpdated = true;
        }
      });
      if (studyTimeUpdated) {
        setProgressSync('vocab_study_time', JSON.stringify(studyTime));
      }

      // 2. vocab_word_states_ 키 제거
      const keysToRemove = [];
      for(let i=0; i<localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (day ? key === `vocab_word_states_${dbName}` : key.startsWith(`vocab_word_states_${category}`))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));

      // 3. doacore_total_fails 에서 제거
      let failData = JSON.parse(localStorage.getItem('doacore_total_fails')) || {};
      Object.keys(failData).forEach(key => {
        if (day ? key.startsWith(dbName + '_') : key.startsWith(category + '_')) {
          delete failData[key];
        }
      });
      setProgressSync('doacore_total_fails', JSON.stringify(failData));

      // 4. IndexedDB wordStates 제거
      try {
        const dbInstance = await openDB();
        const tx = dbInstance.transaction('wordStates', 'readwrite');
        const store = tx.objectStore('wordStates');
        if (day) {
          store.delete(dbName);
        } else {
          const req = store.getAllKeys();
          req.onsuccess = () => {
            (req.result || []).forEach(k => {
              if (k.startsWith(category)) store.delete(k);
            });
          };
        }
      } catch(e){}

      // 5. Firestore user progress sync 제거
      if (currentUser && db) {
        try {
          if (day) {
            await db.collection('users').doc(currentUser.uid).collection('progress').doc(`vocab_word_states_${dbName}`).delete();
          } else {
            const pqs = await db.collection('users').doc(currentUser.uid).collection('progress').get();
            pqs.forEach(doc => {
              if (doc.id.includes(category)) {
                doc.ref.delete();
              }
            });
          }
        } catch(e){}
      }
    }

    if (btnResetStudyCat && selectResetStudyCat) {
      btnResetStudyCat.addEventListener('click', async () => {
        const cat = selectResetStudyCat.value;
        const catText = selectResetStudyCat.options[selectResetStudyCat.selectedIndex].text;
        const day = selectResetStudyDay ? selectResetStudyDay.value : 'all';
        
        let confirmMsg = `'${catText}'의 전체 학습 기록만 초기화하시겠습니까?\n(단어 목록은 유지됩니다)`;
        if (day !== 'all') {
          const dayLabel = isNaN(day) ? `'${day}'` : `Day ${day}`;
          confirmMsg = `'${catText}'의 ${dayLabel} 학습 기록만 초기화하시겠습니까?\n(단어 목록은 유지됩니다)`;
        }

        if (confirm(confirmMsg)) {
          await clearStudyRecordForCategory(cat, day === 'all' ? null : day);
          alert('학습 기록이 성공적으로 초기화되었습니다.');
          modalResetStudy.classList.add('hidden');
          location.reload();
        }
      });
    }

    if (btnResetStudyAll) {
      btnResetStudyAll.addEventListener('click', async () => {
        if (confirm('모든 카테고리(학원 단어장 포함)의 학습 기록이 초기화됩니다. 단어 목록 자체는 유지됩니다.\n계속하시겠습니까?')) {
          const cats = ['toefl', 'basic', 'custom-upload', 'custom-manual', 'academy-slot_1', 'academy-slot_2'];
          for (const c of cats) {
            await clearStudyRecordForCategory(c);
          }
          localStorage.removeItem('vocab_trainer_progress');
          await clearProgressIDB();
          alert('모든 학습 기록이 초기화되었습니다.');
          modalResetStudy.classList.add('hidden');
          location.reload();
        }
      });
    }
  }

})();

(function() { 
  const themeBtns = document.querySelectorAll('.theme-btn');
  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('vocab_theme', theme);
    themeBtns.forEach(btn => {
      if (btn.dataset.theme === theme) btn.style.borderColor = 'var(--text-main)';
      else btn.style.borderColor = 'var(--box-border)';
    });
    
    // O/X 버튼 테마 분기 처리 (Step 3 & 4)
    const oxContainer = document.getElementById('ox-buttons-container');
    if (oxContainer) {
      if (theme === 'blue' || theme === 'pink' || theme === 'green') {
        oxContainer.innerHTML = `
          <button id="btn-correct" class="btn-ox-new btn-o">
            <div class="ox-circle circle-o">
              <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span class="ox-label">알고 있어요</span>
          </button>
          <button id="btn-wrong" class="btn-ox-new btn-x">
            <div class="ox-circle circle-x">
              <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
            <span class="ox-label">몰랐어요</span>
          </button>
        `;
      } else {
        // 기존 코드 100% 그대로 유지 (기타 테마)
        oxContainer.innerHTML = `
          <button id="btn-correct" class="btn-o">
            <span class="ox-label">O</span>
            <span class="ox-sub">알고 있어요</span>
          </button>
          <button id="btn-wrong" class="btn-x">
            <span class="ox-label">X</span>
            <span class="ox-sub">몰랐어요</span>
          </button>
        `;
      }
    }
  }
  
  const savedTheme = localStorage.getItem('vocab_theme') || 'dark';
  applyTheme(savedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      applyTheme(btn.dataset.theme);
    });
  });

  const toggleDictationMeaning = document.getElementById('toggle-dictation-meaning');
  if (toggleDictationMeaning) {
    toggleDictationMeaning.checked = alwaysShowDictationMeaning;
    toggleDictationMeaning.addEventListener('change', (e) => {
      alwaysShowDictationMeaning = e.target.checked;
      localStorage.setItem('dictation_meaning_visible', alwaysShowDictationMeaning);
      if (isDictationMode && App.phase === 'TEST') {
        const btnReveal = document.getElementById('btn-reveal');
        const testMeanings = document.getElementById('test-meanings');
        if (alwaysShowDictationMeaning) {
          if (btnReveal) btnReveal.classList.add('hidden');
          if (testMeanings) testMeanings.classList.remove('hidden');
        } else {
          if (testMeanings) testMeanings.classList.add('hidden');
          if (btnReveal) btnReveal.classList.remove('hidden');
        }
      }
    });
  }

  const btnReviewWrongWords = document.getElementById('btn-review-wrong-words');
  const modalWrongWords = document.getElementById('modal-wrong-words');
  const btnWrongWordsClose = document.getElementById('btn-wrong-words-close');
  const btnWrongWordsOk = document.getElementById('btn-wrong-words-ok');
  const wrongWordsTbody = document.getElementById('wrong-words-tbody');
  const wrongWordsEmpty = document.getElementById('wrong-words-empty');

  if (btnReviewWrongWords) {
    btnReviewWrongWords.onclick = () => {
      const filteredWords = getFilteredWords();
      if (filteredWords.length === 0) {
        alert('단어장을 먼저 선택해주세요.');
        return;
      }
      
      const wrongList = filteredWords
        .filter(w => w.totalFails > 0)
        .sort((a, b) => b.totalFails - a.totalFails);

      wrongWordsTbody.innerHTML = '';
      if (wrongList.length === 0) {
        wrongWordsEmpty.classList.remove('hidden');
        wrongWordsTbody.parentElement.style.display = 'none';
      } else {
        wrongWordsEmpty.classList.add('hidden');
        wrongWordsTbody.parentElement.style.display = 'table';
        wrongList.forEach(w => {
          const tr = document.createElement('tr');
          tr.style.borderBottom = '1px solid var(--border-h)';
          
          const tdWord = document.createElement('td');
          tdWord.style.padding = '12px 8px';
          tdWord.style.fontWeight = '700';
          tdWord.style.color = 'var(--text-main)';
          tdWord.textContent = w.word;

          const tdFails = document.createElement('td');
          tdFails.style.padding = '12px 2px';
          tdFails.style.textAlign = 'center';
          tdFails.style.fontWeight = 'bold';
          tdFails.style.color = '#f43f5e';
          tdFails.textContent = `${w.totalFails}번`;

          const tdMeaning = document.createElement('td');
          tdMeaning.style.padding = '12px 8px';
          tdMeaning.style.color = 'var(--text-sub)';
          tdMeaning.innerHTML = w.meanings.map(m => `<span style="color:var(--text-sub); margin-right:4px;">[${m.pos}]</span>${m.meaning}`).join('<br>');

          tr.appendChild(tdWord);
          tr.appendChild(tdFails);
          tr.appendChild(tdMeaning);
          wrongWordsTbody.appendChild(tr);
        });
      }

      modalWrongWords.classList.remove('hidden');
    };
  }

  if (btnWrongWordsClose) btnWrongWordsClose.onclick = () => modalWrongWords.classList.add('hidden');
  if (btnWrongWordsOk) btnWrongWordsOk.onclick = () => modalWrongWords.classList.add('hidden');

  // =============================================
  // Firebase Auth & Academy Logic
  // =============================================
  const btnLoginGoogle = document.getElementById('btn-login-google');
  const btnLoginGoogleMain = document.getElementById('btn-login-google-main');
  const btnLogout = document.getElementById('btn-logout');
  const authContainer = document.getElementById('auth-container');
  const userProfileUI = document.getElementById('user-profile-ui');
  const userAvatar = document.getElementById('user-avatar');
  const userNameDisplay = document.getElementById('user-name-display');
  const userAcademyDisplay = document.getElementById('user-academy-display');
  
  const academyInviteModal = document.getElementById('academy-invite-modal');
  const btnAcademySubmit = document.getElementById('btn-academy-submit');
  const academyInviteInput = document.getElementById('academy-invite-input');
  const academyErrorMsg = document.getElementById('academy-error-msg');

  if (auth) {
    // 1. Handle redirect result if redirected back from Google Login
    auth.getRedirectResult().then((result) => {
      if (result && result.user) {
        console.log("Redirect login successful:", result.user);
      }
    }).catch((err) => {
      console.warn("getRedirectResult error:", err);
    });

    // 2. Auth State Changed listener
    auth.onAuthStateChanged(async (user) => {
      currentUser = user;
      if (user) {
        // 🚀 Logged in: IMMEDIATELY switch to view-input (0ms delay)
        showView('view-input');
        loadDBList();

        const settingsDropdown = document.getElementById('settings-dropdown');
        if (settingsDropdown) settingsDropdown.classList.add('hidden');

        if (btnLoginGoogle) btnLoginGoogle.style.display = 'none';
        if (btnLoginGoogleMain) btnLoginGoogleMain.style.display = 'none';
        if (userProfileUI) userProfileUI.classList.remove('hidden');
        if (userAvatar) userAvatar.src = user.photoURL || '';
        if (userNameDisplay) userNameDisplay.textContent = user.displayName || 'User';
        
        // 유저 기본 정보(이름, 이메일)를 Firestore에 저장
        if (db) {
          db.collection('users').doc(user.uid).set({
            displayName: user.displayName || '이름 없음',
            email: user.email || ''
          }, { merge: true }).catch(err => console.error("Profile sync error", err));
        }

        // 비동기로 유저 프로필 및 학원 소속 동기화 진행
        try {
          await fetchUserProfile(user.uid);
        } catch (e) {
          console.error("fetchUserProfile failed:", e);
        }
      } else {
        // Logged out
        showView('view-login');
        currentAcademyId = null;
        if (btnLoginGoogle) btnLoginGoogle.style.display = 'flex';
        if (btnLoginGoogleMain) btnLoginGoogleMain.style.display = 'flex';
        if (userProfileUI) userProfileUI.classList.add('hidden');
        if (academyInviteModal) academyInviteModal.classList.add('hidden');
      }
    });

    const handleGoogleLogin = async () => {
      const mainText = btnLoginGoogleMain ? btnLoginGoogleMain.innerHTML : '';
      const subText  = btnLoginGoogle ? btnLoginGoogle.innerHTML : '';

      if (btnLoginGoogleMain) {
        btnLoginGoogleMain.innerHTML = '⏳ 로그인 진행 중...';
        btnLoginGoogleMain.disabled = true;
      }
      if (btnLoginGoogle) {
        btnLoginGoogle.innerHTML = '⏳ 로그인 진행 중...';
        btnLoginGoogle.disabled = true;
      }

      const resetBtn = () => {
        if (btnLoginGoogleMain) {
          btnLoginGoogleMain.innerHTML = mainText;
          btnLoginGoogleMain.disabled = false;
        }
        if (btnLoginGoogle) {
          btnLoginGoogle.innerHTML = subText;
          btnLoginGoogle.disabled = false;
        }
      };

      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
          await auth.signInWithPopup(provider);
          resetBtn();
        } catch (popupErr) {
          console.warn("signInWithPopup error:", popupErr);
          
          if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
            try {
              const client = google.accounts.oauth2.initTokenClient({
                client_id: firebaseConfig.clientId || '760005417553-5iq38rttennaadqp91g0eaq98m3qk24t.apps.googleusercontent.com',
                scope: 'email profile',
                callback: async (tokenResponse) => {
                  resetBtn();
                  if (tokenResponse.access_token) {
                    const credential = firebase.auth.GoogleAuthProvider.credential(null, tokenResponse.access_token);
                    try {
                      await auth.signInWithCredential(credential);
                    } catch (cErr) {
                      alert("로그인 처리 실패: " + cErr.message);
                    }
                  }
                },
                error_callback: () => { resetBtn(); }
              });
              client.requestAccessToken();
              setTimeout(resetBtn, 4000);
            } catch (gisErr) {
              console.error("GIS initTokenClient failed:", gisErr);
              resetBtn();
              await auth.signInWithRedirect(provider);
            }
          } else {
            resetBtn();
            await auth.signInWithRedirect(provider);
          }
        }
      } catch (err) {
        console.error("handleGoogleLogin error:", err);
        alert("로그인 중 오류가 발생했습니다: " + (err.message || err));
        resetBtn();
      }
    };

    if (btnLoginGoogle) btnLoginGoogle.onclick = () => { localStorage.removeItem('skipAcademyModal'); handleGoogleLogin(); };
    if (btnLoginGoogleMain) btnLoginGoogleMain.onclick = () => { localStorage.removeItem('skipAcademyModal'); handleGoogleLogin(); };

    const btnLoginSkip = document.getElementById('btn-login-skip');
    if (btnLoginSkip) {
      btnLoginSkip.onclick = () => {
        currentAcademyId = null;
        currentAcademyName = null;
        const userAcademyDisplay = document.getElementById('user-academy-display');
        if (userAcademyDisplay) userAcademyDisplay.textContent = "소속: ⚡ 맛보기 모드 (비로그인)";
        applyAcademyBranding(null);
        updateCategoryTabTitles();
        showView('view-input');
        loadDBList();
      };
    }

    if (btnLogout) {
      btnLogout.onclick = () => {
        if (confirm("로그아웃 하시겠습니까?")) {
          auth.signOut().then(() => {
            currentAcademyId = null;
            currentAcademyName = null;
            applyAcademyBranding(null);
            showView('view-login');
          });
        }
      };
    }

    const btnDeleteAccount = document.getElementById('btn-delete-account');
    if (btnDeleteAccount) {
      btnDeleteAccount.onclick = async () => {
        if (!currentUser) return;
        if (confirm("정말로 회원 탈퇴를 하시겠습니까?\n모든 학습 기록과 단어장 데이터가 삭제되며 복구할 수 없습니다.")) {
          try {
            if (db) {
              try {
                // Firestore 문서 삭제 시도 (규칙에 의해 거부될 수 있음)
                await db.collection('users').doc(currentUser.uid).delete();
              } catch (fsErr) {
                console.warn('Firestore doc delete failed, trying update instead:', fsErr);
                try {
                  // 삭제 권한이 없다면 학원 정보만 초기화
                  await db.collection('users').doc(currentUser.uid).update({
                    academyId: null,
                    academyName: null,
                    deleted: true
                  });
                } catch (updateErr) {
                  console.warn('Firestore doc update failed:', updateErr);
                }
              }
            }
            await currentUser.delete();
            alert("회원 탈퇴가 완료되었습니다.");
            showView('view-login');
          } catch (err) {
            console.error(err);
            if (err.code === 'auth/requires-recent-login') {
              alert("보안을 위해 로그아웃 후 다시 로그인하여 탈퇴를 진행해주세요.");
            } else {
              alert("탈퇴 중 오류가 발생했습니다: " + err.message);
            }
          }
        }
      };
    }

    const userPhoneInput = document.getElementById('user-phone-input');
    if (userPhoneInput) {
      userPhoneInput.oninput = (e) => {
        let val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length > 11) val = val.substring(0, 11);
        let formatted = '';
        if (val.length < 4) {
          formatted = val;
        } else if (val.length < 8) {
          formatted = `${val.substring(0, 3)}-${val.substring(3)}`;
        } else {
          formatted = `${val.substring(0, 3)}-${val.substring(3, 7)}-${val.substring(7)}`;
        }
        e.target.value = formatted;
      };
    }

    if (btnAcademySubmit) {
      btnAcademySubmit.onclick = async () => {
        const code = academyInviteInput.value.trim();
        const phoneNum = (document.getElementById('user-phone-input')?.value || '').trim();
        const phoneRegex = /^01[016789]-\d{3,4}-\d{4}$/;

        if (!phoneNum || !phoneRegex.test(phoneNum)) {
          if (academyErrorMsg) academyErrorMsg.textContent = "⚠️ 올바른 휴대폰 번호(010-XXXX-XXXX)를 입력해주세요.";
          return;
        }
        if (!code) {
          if (academyErrorMsg) academyErrorMsg.textContent = "초대 코드를 입력해 주세요.";
          return;
        }

        btnAcademySubmit.disabled = true;
        if (academyErrorMsg) academyErrorMsg.textContent = "확인 중...";
        try {
          if (code.startsWith('admin_')) {
            await enterAdminMode(code);
            btnAcademySubmit.disabled = false;
            return;
          }
          
          const qs = await db.collection('academies').where('inviteCode', '==', code).limit(1).get();
          if (qs.empty) {
            if (academyErrorMsg) academyErrorMsg.textContent = "유효하지 않은 초대 코드입니다.";
          } else {
            const academyDoc = qs.docs[0];
            const academyId = academyDoc.id;
            const academyName = academyDoc.data().name;
            
            const updateObj = {
              academyId: academyId,
              academyName: academyName,
              phoneNumber: phoneNum,
              deleted: false,
              joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
              updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await db.collection('users').doc(currentUser.uid).set(updateObj, { merge: true });
            
            academyInviteModal.classList.add('hidden');
            alert(`🎉 ${academyName}에 성공적으로 등록되었습니다!`);
            await fetchUserProfile(currentUser.uid);
          }
        } catch (err) {
          console.error(err);
          if (academyErrorMsg) academyErrorMsg.textContent = "오류가 발생했습니다.";
        }
        btnAcademySubmit.disabled = false;
      };
    }

    const btnOpenAcademyModal = document.getElementById('btn-open-academy-modal');
    if (btnOpenAcademyModal) {
      btnOpenAcademyModal.onclick = async () => {
        if (currentAcademyId) {
          // 학원 탈퇴 모달 확인 흐름
          const confirmLeave = confirm("⚠️ 정말 소속 학원에서 탈퇴하시겠습니까?\n\n탈퇴 시 학원 전용 단어장을 더 이상 이용할 수 없게 되며, 기본 단어장 모드로 전환됩니다. (언제든지 초대 코드로 재등록 가능합니다)");
          if (confirmLeave) {
            try {
              if (currentUser && db) {
                await db.collection('users').doc(currentUser.uid).set({
                  academyId: firebase.firestore.FieldValue.delete(),
                  academyName: firebase.firestore.FieldValue.delete()
                }, { merge: true });
              }
              currentAcademyId = null;
              localStorage.setItem('skipAcademyModal', 'true');
              alert("소속 학원에서 정상적으로 탈퇴되었습니다. 기본 단어장으로 전환합니다.");
              window.location.reload();
            } catch (err) {
              alert("학원 탈퇴 처리 중 오류가 발생했습니다: " + err.message);
            }
          }
        } else {
          // 학원 등록 모달 열기
          const settingsModal = document.getElementById('modal-settings');
          if (settingsModal) settingsModal.classList.add('hidden');
          if (academyInviteInput) academyInviteInput.value = '';
          if (academyErrorMsg) academyErrorMsg.textContent = '';
          if (academyInviteModal) academyInviteModal.classList.remove('hidden');
        }
      };
    }

    const btnAcademySkip = document.getElementById('btn-academy-skip');
    if (btnAcademySkip) {
      btnAcademySkip.onclick = async () => {
        const phoneNum = (document.getElementById('user-phone-input')?.value || '').trim();
        if (phoneNum && currentUser && db) {
          try {
            await db.collection('users').doc(currentUser.uid).set({
              phoneNumber: phoneNum
            }, { merge: true });
          } catch(e){}
        }
        localStorage.setItem('skipAcademyModal', 'true');
        academyInviteModal.classList.add('hidden');
        currentAcademyId = null;
        if (userAcademyDisplay) userAcademyDisplay.textContent = "소속: 미등록(기본 단어장)";
        showView('view-input');
        loadDBList();
      };
    }
  }

  // =============================================
  // Admin Logic
  // =============================================
  const setupLongPress = (element) => {
    if (!element) return;
    let pressTimer;
    const startPress = (e) => {
      if (e.type === 'touchstart') e.preventDefault();
      pressTimer = window.setTimeout(() => {
        let code = prompt('관리자 코드를 입력하세요:');
        if (code) {
          code = code.trim();
          enterAdminMode(code);
        }
      }, 1500);
    };
    const cancelPress = () => {
      clearTimeout(pressTimer);
    };
    element.addEventListener('mousedown', startPress);
    element.addEventListener('touchstart', startPress, {passive: false});
    element.addEventListener('mouseup', cancelPress);
    element.addEventListener('mouseleave', cancelPress);
    element.addEventListener('touchend', cancelPress);
  };

  setupLongPress(document.getElementById('login-logo-container'));
  setupLongPress(document.getElementById('btn-main-logo'));
  
  // 곰돌이 로고(핑크 테마)에도 적용
  const bearLogos = document.querySelectorAll('.bear-logo');
  bearLogos.forEach(logo => setupLongPress(logo));

  // =============================================
  // AI Prompt Copy Helper
  // =============================================
  const AI_PROMPT_TEMPLATE = `너는 영단어 변환 및 정리 전문가야.
내가 아래에 입력하는 임의의 영단어/뜻/Day 자료를 DOACore 단어장 전용 포맷으로 정확하게 변환해줘.

■ 변환 포맷 규칙:
1. Day 구분은 반드시 '# Day 1', '# Day 2' 처럼 작성할 것. (Day 번호는 유지하거나 1부터 순서대로 부여)
2. 각 단어 줄은 반드시 '단어 [품사] 뜻' 형식으로 작성할 것.
   예시:
   apple [n] 사과
   abandon [v] 버리다, 포기하다
   beautiful [a] 아름다운
   quickly [ad] 빠르게

3. 품사 기호 안내:
   [n] : 명사
   [v] : 동사
   [a] : 형용사
   [ad] : 부사
   [prep] : 전치사
   [conj] : 접속사
   [phr] : 숙어/구/관용구

4. 다른 설명이나 인사말, 마크다운 코드 블록 등은 모두 제거하고, 오직 변환된 단어 목록 텍스트만 출력할 것.

[아래에 변환할 단어 목록을 입력하세요]`;

  const openAiPromptModal = () => {
    const modal = document.getElementById('ai-prompt-modal');
    const textEl = document.getElementById('ai-prompt-text');
    if (textEl) textEl.value = AI_PROMPT_TEMPLATE;
    if (modal) modal.classList.remove('hidden');
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(AI_PROMPT_TEMPLATE).then(() => {
        alert("📋 ChatGPT/AI용 단어 변환 프롬프트가 클립보드에 복사되었습니다!\n\nChatGPT나 Claude에 붙여넣어 단어 자료를 DOACore 포맷으로 쉽게 변환해보세요.");
      }).catch(() => {});
    }
  };

  document.querySelectorAll('.btn-admin-copy-prompt').forEach(btn => {
    btn.onclick = openAiPromptModal;
  });

  const btnAiPromptClose = document.getElementById('btn-ai-prompt-close');
  const btnAiPromptModalOk = document.getElementById('btn-ai-prompt-modal-ok');
  const btnAiPromptCopyModal = document.getElementById('btn-ai-prompt-copy-modal');
  const aiPromptModal = document.getElementById('ai-prompt-modal');

  if (btnAiPromptClose) {
    btnAiPromptClose.onclick = () => {
      if (aiPromptModal) aiPromptModal.classList.add('hidden');
    };
  }
  if (btnAiPromptModalOk) {
    btnAiPromptModalOk.onclick = () => {
      if (aiPromptModal) aiPromptModal.classList.add('hidden');
    };
  }
  if (btnAiPromptCopyModal) {
    btnAiPromptCopyModal.onclick = () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(AI_PROMPT_TEMPLATE).then(() => {
          alert("📋 프롬프트가 클립보드에 복사되었습니다!");
        });
      } else {
        const textEl = document.getElementById('ai-prompt-text');
        if (textEl) {
          textEl.select();
          document.execCommand('copy');
          alert("📋 프롬프트가 클립보드에 복사되었습니다!");
        }
      }
    };
  }

  function applyAcademyBranding(brandData) {
    const headerTitle = document.getElementById('header-brand-title');
    const headerSub = document.getElementById('header-brand-sub');
    const headerImg = document.getElementById('btn-main-logo');
    const headerBear = document.getElementById('header-bear-logo');

    if (!brandData || (!brandData.brandName && !brandData.name)) {
      if (headerTitle) headerTitle.textContent = "DOACore";
      if (headerSub) headerSub.textContent = "DOACore: 인지공학 기반 영단어 각인 엔진";
      if (headerImg) { headerImg.src = "icon.jpg"; headerImg.style.display = "block"; }
      if (headerBear) headerBear.style.display = "none";
      return;
    }

    const name = brandData.brandName || brandData.name;
    const logo = (brandData.brandLogo || '').trim();
    const sub = brandData.brandSub || `${name}: 인지공학 기반 영단어 각인 엔진`;

    if (headerTitle) headerTitle.textContent = name;
    if (headerSub) headerSub.textContent = sub;

    // URL이 유효하게 입력된 경우 해당 커스텀 이미지 URL 사용
    if (logo && (logo.startsWith('http://') || logo.startsWith('https://') || logo.startsWith('/') || logo.startsWith('data:'))) {
      if (headerImg) { headerImg.src = logo; headerImg.style.display = "block"; }
      if (headerBear) headerBear.style.display = "none";
    } else {
      // 로고 URL이 없는 경우 보내주신 전용 브랜드 로고(icon.jpg) 적용
      if (headerImg) { headerImg.src = "icon.jpg"; headerImg.style.display = "block"; }
      if (headerBear) headerBear.style.display = "none";
    }
  }

  // =============================================
  // 👑 Super Admin (최고관리자) Logic
  // =============================================
  function getSuperAdminCode() {
    return localStorage.getItem('vocab_super_admin_code') || 'admin_nodoa327';
  }

  async function syncSuperAdminCode() {
    if (!db) return;
    try {
      const doc = await db.collection('config').doc('superadminDoc').get();
      if (doc.exists && doc.data().superAdminCode) {
        localStorage.setItem('vocab_super_admin_code', doc.data().superAdminCode);
      }
    } catch(e){}
  }
  syncSuperAdminCode();

  async function enterSuperAdminMode() {
    if (!db) { alert("데이터베이스 연결 안됨"); return; }

    showView('view-superadmin');

    // Populate current super admin code in input
    const saSuperCodeInput = document.getElementById('sa-super-code-input');
    if (saSuperCodeInput) {
      saSuperCodeInput.value = getSuperAdminCode();
    }

    const btnSaveSuperCode = document.getElementById('btn-sa-save-super-code');
    if (btnSaveSuperCode) {
      btnSaveSuperCode.onclick = async () => {
        const newCode = (document.getElementById('sa-super-code-input')?.value || '').trim();
        if (!newCode) { alert('최고관리자 코드를 입력해 주세요.'); return; }
        btnSaveSuperCode.disabled = true;
        try {
          localStorage.setItem('vocab_super_admin_code', newCode);
          if (db) {
            await db.collection('config').doc('superadminDoc').set({
              superAdminCode: newCode,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
          }
          alert(`🎉 최고관리자 접속 코드가 '${newCode}'(으)로 성공적으로 변경되었습니다!\n다음부터는 이 코드로 최고관리자 페이지에 접속하실 수 있습니다.`);
        } catch(err) {
          console.error(err);
          alert(`🎉 최고관리자 코드 변경 완료! (${newCode})`);
        } finally {
          btnSaveSuperCode.disabled = false;
        }
      };
    }

    const saAcademyList = document.getElementById('sa-academy-list');
    const saTotalAcademies = document.getElementById('sa-total-academies');
    const saTotalStudents = document.getElementById('sa-total-students');

    // 나가기 버튼
    const btnExit = document.getElementById('btn-superadmin-exit');
    if (btnExit) {
      btnExit.onclick = () => {
        showView('view-login');
      };
    }

    // 학원 목록 로드
    async function loadSuperAdminData() {
      if (saAcademyList) saAcademyList.innerHTML = '<div style="color:var(--text-sub); text-align:center; padding:20px;">로딩 중...</div>';
      try {
        const academyQs = await db.collection('academies').get();
        const academies = [];
        academyQs.forEach(doc => academies.push({ id: doc.id, ...doc.data() }));
        
        if (saTotalAcademies) saTotalAcademies.textContent = academies.length;

        // 전체 학생 수 계산
        const studentQs = await db.collection('users').where('academyId', '!=', null).get();
        let totalStudents = 0;
        const studentsByAcademy = {};
        studentQs.forEach(doc => {
          const data = doc.data();
          if (data.academyId && !data.deleted) {
            totalStudents++;
            studentsByAcademy[data.academyId] = (studentsByAcademy[data.academyId] || 0) + 1;
          }
        });
        if (saTotalStudents) saTotalStudents.textContent = totalStudents;

        // 학원 카드 렌더링
        if (saAcademyList) saAcademyList.innerHTML = '';
        if (academies.length === 0) {
          if (saAcademyList) saAcademyList.innerHTML = '<div style="color:var(--text-sub); text-align:center; padding:20px;">등록된 학원이 없습니다.</div>';
          return;
        }

        const esc = (s) => {
          const d = document.createElement('div');
          d.textContent = s;
          return d.innerHTML;
        };

        academies.forEach(aca => {
          const studentCount = studentsByAcademy[aca.id] || 0;
          const createdStr = aca.createdAt?.toDate ? aca.createdAt.toDate().toLocaleDateString('ko-KR') : '미상';

          const card = document.createElement('div');
          card.className = 'glass-card';
          card.style.cssText = 'padding: 16px; position: relative;';
          card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div style="flex: 1; margin-right: 12px;">
                <div style="font-size: 11px; color: var(--text-sub); margin-bottom: 3px; font-weight: 600;">🏫 학원 이름</div>
                <input type="text" class="sa-name-input" value="${esc(aca.name || '')}" style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); color: #ffffff; font-size: 14px; font-weight: 700; width: 100%; border-radius: 6px; padding: 6px 10px; outline: none;" />
                <div style="font-size: 11.5px; color: var(--text-sub); margin-top: 4px;">등록일: ${createdStr} · 학생 ${studentCount}명</div>
              </div>
              <div style="display: flex; gap: 6px; flex-shrink: 0; align-items: flex-start; margin-top: 18px;">
                <button class="sa-btn-enter" style="background: rgba(99,102,241,0.2); border: 1px solid rgba(99,102,241,0.5); color: #818cf8; padding: 6px 10px; border-radius: 6px; font-size: 11px; cursor: pointer; font-weight: 600;">🔑 학원관리 접속</button>
                <button class="sa-btn-delete" style="background: rgba(239,68,68,0.2); border: 1px solid rgba(239,68,68,0.5); color: #f87171; padding: 6px 10px; border-radius: 6px; font-size: 11px; cursor: pointer; font-weight: 600;">🗑️ 삭제</button>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="background: rgba(0,0,0,0.2); padding: 8px 10px; border-radius: 6px;">
                <div style="font-size: 10px; color: var(--text-sub); margin-bottom: 2px;">🔑 관리자 코드</div>
                <div style="font-size: 13px; font-weight: 600; color: #a5b4fc; font-family: monospace; display: flex; align-items: center; gap: 6px;">
                  <input type="text" class="sa-admin-code-input" value="${esc(aca.adminCode || '')}" style="background: transparent; border: none; color: #a5b4fc; font-size: 13px; font-family: monospace; width: 100%; outline: none; font-weight: 600;" />
                </div>
              </div>
              <div style="background: rgba(0,0,0,0.2); padding: 8px 10px; border-radius: 6px;">
                <div style="font-size: 10px; color: var(--text-sub); margin-bottom: 2px;">🎟️ 학생 등록 코드</div>
                <div style="font-size: 13px; font-weight: 600; color: #4ade80; font-family: monospace; display: flex; align-items: center; gap: 6px;">
                  <input type="text" class="sa-invite-code-input" value="${esc(aca.inviteCode || '')}" style="background: transparent; border: none; color: #4ade80; font-size: 13px; font-family: monospace; width: 100%; outline: none; font-weight: 600;" />
                </div>
              </div>
            </div>
            <div style="margin-top: 10px; display: flex; gap: 8px;">
              <button class="sa-btn-save-codes" style="flex:1; background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.4); color: #4ade80; padding: 8px; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 600;">💾 학원정보 & 코드 변경 저장</button>
            </div>
          `;

          // 학원관리 접속 버튼
          card.querySelector('.sa-btn-enter').onclick = () => {
            enterAdminMode(aca.adminCode);
          };

          // 삭제 버튼
          card.querySelector('.sa-btn-delete').onclick = async () => {
            if (!confirm(`⚠️ 정말 [${aca.name}] 학원을 완전히 삭제하시겠습니까?\n\n• 해당 학원의 모든 단어장이 삭제됩니다.\n• 소속 학생 ${studentCount}명의 학원 연결이 해제됩니다.\n• 이 작업은 되돌릴 수 없습니다.`)) return;
            if (!confirm(`🚨 최종 확인: [${aca.name}] 학원을 정말로 삭제합니까?`)) return;

            try {
              // 소속 학생들의 학원 연결 해제
              const studentsQs = await db.collection('users').where('academyId', '==', aca.id).get();
              const batch = db.batch();
              studentsQs.forEach(doc => {
                batch.update(doc.ref, { academyId: null, academyName: null });
              });

              // 단어장 서브컬렉션 삭제
              const wbQs = await db.collection('academies').doc(aca.id).collection('wordBooks').get();
              wbQs.forEach(doc => batch.delete(doc.ref));

              // 학원 문서 삭제
              batch.delete(db.collection('academies').doc(aca.id));
              await batch.commit();

              alert(`🗑️ [${aca.name}] 학원이 성공적으로 삭제되었습니다.`);
              loadSuperAdminData();
            } catch (err) {
              console.error(err);
              alert('학원 삭제 중 오류가 발생했습니다: ' + err.message);
            }
          };

          // 코드 및 학원이름 변경 저장 버튼
          card.querySelector('.sa-btn-save-codes').onclick = async () => {
            const newName = card.querySelector('.sa-name-input').value.trim();
            const newAdminCode = card.querySelector('.sa-admin-code-input').value.trim();
            const newInviteCode = card.querySelector('.sa-invite-code-input').value.trim();
            
            if (!newName) { alert('학원 이름을 입력해주세요.'); return; }
            if (!newAdminCode) { alert('관리자 코드를 입력해주세요.'); return; }
            if (!newInviteCode) { alert('학생 등록 코드를 입력해주세요.'); return; }

            const btnSave = card.querySelector('.sa-btn-save-codes');
            btnSave.disabled = true;
            try {
              await db.collection('academies').doc(aca.id).update({
                name: newName,
                adminCode: newAdminCode,
                inviteCode: newInviteCode
              });

              if (newName !== aca.name) {
                const studentsQs = await db.collection('users').where('academyId', '==', aca.id).get();
                if (!studentsQs.empty) {
                  const batch = db.batch();
                  studentsQs.forEach(doc => {
                    batch.update(doc.ref, { academyName: newName });
                  });
                  await batch.commit();
                }
              }

              alert(`✅ [${newName}] 학원 정보 및 코드가 성공적으로 변경되었습니다.\n\n학원 이름: ${newName}\n관리자 코드: ${newAdminCode}\n학생 등록 코드: ${newInviteCode}`);
              loadSuperAdminData();
            } catch (err) {
              console.error(err);
              alert('학원 정보 변경 실패: ' + err.message);
            } finally {
              btnSave.disabled = false;
            }
          };

          if (saAcademyList) saAcademyList.appendChild(card);
        });
      } catch (err) {
        console.error(err);
        if (saAcademyList) saAcademyList.innerHTML = '<div style="color:#f87171; text-align:center; padding:20px;">학원 목록을 불러오지 못했습니다.</div>';
      }
    }

    // 신규 학원 등록
    const btnCreateAcademy = document.getElementById('btn-sa-create-academy');
    if (btnCreateAcademy) {
      btnCreateAcademy.onclick = async () => {
        const name = document.getElementById('sa-new-academy-name')?.value.trim();
        const adminCode = document.getElementById('sa-new-admin-code')?.value.trim();
        const inviteCode = document.getElementById('sa-new-invite-code')?.value.trim();

        if (!name) { alert('학원 이름을 입력해주세요.'); return; }
        if (!adminCode) { alert('관리자 코드를 입력해주세요.'); return; }
        if (!inviteCode) { alert('학생 등록 코드를 입력해주세요.'); return; }

        // 관리자 코드 중복 확인
        const existingQs = await db.collection('academies').where('adminCode', '==', adminCode).limit(1).get();
        if (!existingQs.empty) {
          alert(`⚠️ 관리자 코드 '${adminCode}'는 이미 다른 학원에서 사용 중입니다.\n다른 코드를 입력해주세요.`);
          return;
        }

        btnCreateAcademy.disabled = true;
        try {
          await db.collection('academies').add({
            name,
            adminCode,
            inviteCode,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          alert(`🎉 [${name}] 학원이 성공적으로 등록되었습니다!\n\n관리자 코드: ${adminCode}\n학생 등록 코드: ${inviteCode}`);

          // 입력란 초기화
          document.getElementById('sa-new-academy-name').value = '';
          document.getElementById('sa-new-admin-code').value = '';
          document.getElementById('sa-new-invite-code').value = '';

          loadSuperAdminData();
        } catch (err) {
          console.error(err);
          alert('학원 등록 실패: ' + err.message);
        } finally {
          btnCreateAcademy.disabled = false;
        }
      };
    }

    // 초기 로드
    loadSuperAdminData();
  }

  async function enterAdminMode(rawAdminCode) {
    const adminCode = (rawAdminCode || '').trim();
    if (!db) {
      alert("데이터베이스 연결 안됨");
      return;
    }
    if (!currentUser) {
      alert("먼저 구글 로그인을 진행해주세요!");
      return;
    }

    // 👑 최고관리자 코드 감지 (가변 맞춤형 코드 및 기본 admin_nodoa327 대조)
    const activeSuperAdminCode = getSuperAdminCode();
    if (adminCode === activeSuperAdminCode || adminCode === 'admin_nodoa327') {
      enterSuperAdminMode();
      return;
    }

    try {
      const qs = await db.collection('academies').where('adminCode', '==', adminCode).limit(1).get();
      if (qs.empty) {
        if (adminCode === 'admin_asher') {
          // 편의를 위해 처음 로그인 시 데이터베이스에 자동으로 학원 정보를 생성해 줍니다.
          await db.collection('academies').add({
            name: "아셀 학원",
            adminCode: "admin_asher",
            inviteCode: "asher2026",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
          alert("최초 1회: 데이터베이스에 '아셀 학원(admin_asher)' 정보가 자동 생성되었습니다! 확인을 누르고 다시 한 번 코드를 입력해주세요.");
          return;
        }
        alert("유효하지 않은 관리자 코드입니다.");
        return;
      }
      const academyDoc = qs.docs[0];
      const academyId = academyDoc.id;
      const acaData = academyDoc.data();
      const academyName = acaData.name;
      const currentInviteCode = acaData.inviteCode || '';
      
      document.getElementById('admin-academy-name').textContent = academyName;
      document.getElementById('admin-invite-code').value = currentInviteCode;
      
      const adminBrandName = document.getElementById('admin-brand-name');
      const adminBrandLogo = document.getElementById('admin-brand-logo');
      const adminBrandSub = document.getElementById('admin-brand-sub');

      if (adminBrandName) adminBrandName.value = acaData.brandName || acaData.name || '';
      if (adminBrandLogo) adminBrandLogo.value = acaData.brandLogo || '🧸';
      if (adminBrandSub) adminBrandSub.value = acaData.brandSub || '';

      const btnSaveBrand = document.getElementById('btn-save-academy-brand');
      if (btnSaveBrand) {
        btnSaveBrand.onclick = async () => {
          const brandName = (document.getElementById('admin-brand-name')?.value || '').trim();
          const brandLogo = (document.getElementById('admin-brand-logo')?.value || '').trim();
          const brandSub = (document.getElementById('admin-brand-sub')?.value || '').trim();
          if (!brandName) { alert('학원 이름을 입력해 주세요.'); return; }
          btnSaveBrand.disabled = true;
          try {
            await db.collection('academies').doc(academyId).update({
              brandName,
              brandLogo,
              brandSub
            });
            applyAcademyBranding({ name: brandName, brandName, brandLogo, brandSub });
            alert('🎉 학원 브랜드 및 로고 설정이 성공적으로 저장되었습니다!\n학생 화면에 즉시 적용됩니다.');
          } catch (err) {
            console.error(err);
            alert('브랜드 정보 저장 실패: ' + err.message);
          } finally {
            btnSaveBrand.disabled = false;
          }
        };
      }

      const btnUpdateInviteCode = document.getElementById('btn-update-invite-code');
      btnUpdateInviteCode.onclick = async () => {
        const newCode = document.getElementById('admin-invite-code').value.trim();
        if (!newCode) {
          alert('학생 등록 코드를 입력해주세요.');
          return;
        }
        if (confirm(`학생 등록 코드를 '${newCode}'(으)로 변경하시겠습니까?`)) {
          btnUpdateInviteCode.disabled = true;
          try {
            await db.collection('academies').doc(academyId).update({
              inviteCode: newCode
            });
            alert('학생 등록 코드가 성공적으로 변경되었습니다.');
          } catch (err) {
            console.error(err);
            alert('학생 등록 코드 변경 중 오류가 발생했습니다: ' + err.message);
          } finally {
            btnUpdateInviteCode.disabled = false;
          }
        }
      };

      if (academyInviteModal) academyInviteModal.classList.add('hidden');
      showView('view-admin');
      
      let wb1Days = { "Day 1": "" };
      let wb1CurrentDay = "Day 1";
      let wb2Days = { "Day 1": "" };
      let wb2CurrentDay = "Day 1";
      
      function updateAdminWordBookStatus(slotId, title, daysObj) {
        const statusEl = document.getElementById(slotId === 'slot_1' ? 'admin-wb1-status' : 'admin-wb2-status');
        if (!statusEl) return;
        let totalWords = 0;
        if (daysObj && typeof daysObj === 'object') {
          Object.values(daysObj).forEach(txt => { totalWords += parseWordText(txt, 'temp', 'temp').length; });
        }
        if (title && totalWords > 0) {
          const dayCount = Object.keys(daysObj).length;
          statusEl.innerHTML = `✅ 서버 등록 완료 (${dayCount}개 Day, 총 ${totalWords}개 단어)`;
          statusEl.style.background = 'rgba(16, 185, 129, 0.15)';
          statusEl.style.color = '#10b981';
          statusEl.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        } else {
          statusEl.innerHTML = `⚪ 서버 미등록`;
          statusEl.style.background = 'rgba(156, 163, 175, 0.15)';
          statusEl.style.color = '#9ca3af';
          statusEl.style.borderColor = 'rgba(156, 163, 175, 0.4)';
        }
      }

      function renderWbDays(slotId) {
        const isSlot1 = (slotId === 'slot_1');
        const days = isSlot1 ? wb1Days : wb2Days;
        const textEl = document.getElementById(isSlot1 ? 'admin-wb1-content' : 'admin-wb2-content');
        if (textEl && days) {
          let parts = [];
          Object.keys(days).sort((a, b) => {
            const numA = parseInt(a.replace(/[^0-9]/g, ''), 10);
            const numB = parseInt(b.replace(/[^0-9]/g, ''), 10);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.localeCompare(b, 'ko');
          }).forEach(k => {
            if (days[k]) parts.push(`# ${k}\n${days[k].trim()}`);
          });
          if (parts.length > 0) {
            textEl.value = parts.join('\n\n');
          }
        }
      }

      async function loadAdminWordBooks() {
        try {
          const wbQs = await db.collection('academies').doc(academyId).collection('wordBooks').get();
          const wb1Title = document.getElementById('admin-wb1-title');
          const wb2Title = document.getElementById('admin-wb2-title');
          if (wb1Title) wb1Title.value = '';
          if (wb2Title) wb2Title.value = '';

          wb1Days = { "Day 1": "" };
          wb2Days = { "Day 1": "" };

          wbQs.forEach(doc => {
            const data = doc.data();
            if (doc.id === 'slot_1') {
              if (wb1Title) wb1Title.value = data.title || '';
              if (data.days) {
                wb1Days = data.days;
              } else if (data.content) {
                wb1Days = parseMultiDayText(data.content);
              }
              updateAdminWordBookStatus('slot_1', data.title, wb1Days);
            } else if (doc.id === 'slot_2') {
              if (wb2Title) wb2Title.value = data.title || '';
              if (data.days) {
                wb2Days = data.days;
              } else if (data.content) {
                wb2Days = parseMultiDayText(data.content);
              }
              updateAdminWordBookStatus('slot_2', data.title, wb2Days);
            }
          });

          renderWbDays('slot_1');
          renderWbDays('slot_2');
        } catch (e) {
          console.error("Admin wordbooks load error", e);
        }
      }

  // =============================================
  // Upload Progress Modal Helper
  // =============================================
  function showUploadLoading(title, desc, percent = 30) {
    const modal = document.getElementById('upload-loading-modal');
    const titleEl = document.getElementById('upload-loading-title');
    const descEl = document.getElementById('upload-loading-desc');
    const barEl = document.getElementById('upload-progress-bar');
    const percentEl = document.getElementById('upload-loading-percent');

    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.innerHTML = desc;
    if (barEl) barEl.style.width = `${percent}%`;
    if (percentEl) percentEl.textContent = `진행률: ${percent}%`;
    if (modal) modal.classList.remove('hidden');
  }

  function updateUploadLoading(percent, desc) {
    const barEl = document.getElementById('upload-progress-bar');
    const percentEl = document.getElementById('upload-loading-percent');
    const descEl = document.getElementById('upload-loading-desc');

    if (barEl) barEl.style.width = `${percent}%`;
    if (percentEl) percentEl.textContent = `진행률: ${percent}%`;
    if (desc && descEl) descEl.innerHTML = desc;
  }

  function hideUploadLoading() {
    const modal = document.getElementById('upload-loading-modal');
    if (modal) modal.classList.add('hidden');
  }

      function bindAdminFilePicker(btnId, fileId, slotId) {
        const btn = document.getElementById(btnId);
        const fileInput = document.getElementById(fileId);
        const textEl = document.getElementById(slotId === 'slot_1' ? 'admin-wb1-content' : 'admin-wb2-content');
        if (btn && fileInput) {
          btn.onclick = () => fileInput.click();
          fileInput.onchange = async (e) => {
            const files = Array.from(e.target.files);
            if (!files || files.length === 0) return;

            const totalSizeKb = Math.round(files.reduce((acc, f) => acc + f.size, 0) / 1024);
            showUploadLoading("⏳ 단어장 파일 분석 중...", `대용량 파일 (${totalSizeKb} KB)을 읽고 단어를 추출하는 중입니다.`, 25);

            setTimeout(async () => {
              try {
                updateUploadLoading(55, `⚡ 단어 데이터 파싱 및 분할 중...`);

                let combinedText = '';
                if (files.length === 1) {
                  const file = files[0];
                  combinedText = await file.text();
                } else {
                  let parts = [];
                  for (const file of files) {
                    const text = await file.text();
                    const match = file.name.match(/Day\s*(\d+)/i);
                    let dayKey = file.name.replace(/\.[^/.]+$/, "");
                    if (match) {
                      dayKey = `Day ${match[1]}`;
                    }
                    parts.push(`# ${dayKey}\n${text.trim()}`);
                  }
                  combinedText = parts.join('\n\n');
                }

                updateUploadLoading(85, `📝 화면에 단어 데이터 채우는 중...`);
                if (textEl) textEl.value = combinedText;

                const parsed = parseMultiDayText(combinedText);
                let totalWords = 0;
                if (Object.keys(parsed).length > 0) {
                  Object.values(parsed).forEach(txt => { totalWords += parseWordText(txt, 'temp', 'temp').length; });
                  if (slotId === 'slot_1') wb1Days = parsed;
                  else wb2Days = parsed;
                } else {
                  totalWords = parseWordText(combinedText, 'temp', 'temp').length;
                  if (slotId === 'slot_1') wb1Days = { "Day 1": combinedText };
                  else wb2Days = { "Day 1": combinedText };
                }

                updateUploadLoading(100, `✅ 총 ${totalWords.toLocaleString()}개 단어 로드 완료!`);

                setTimeout(() => {
                  hideUploadLoading();
                }, 400);

              } catch (err) {
                console.error(err);
                hideUploadLoading();
                alert("파일 읽기 오류: " + err.message);
              }
            }, 60);
          };
        }
      }

      bindAdminFilePicker('btn-admin-wb1-file', 'admin-wb1-file', 'slot_1');
      bindAdminFilePicker('btn-admin-wb2-file', 'admin-wb2-file', 'slot_2');

      async function saveAdminWordBook(slotId, titleId, btnId) {
        const title = (document.getElementById(titleId)?.value || '').trim();
        const contentEl = document.getElementById(slotId === 'slot_1' ? 'admin-wb1-content' : 'admin-wb2-content');
        const rawText = (contentEl?.value || '').trim();

        if (!title) { alert('단어장 대표 이름을 입력해주세요.'); return; }
        if (!rawText) { alert('단어장 내용(단어 목록)을 입력해주세요.'); return; }

        let days = parseMultiDayText(rawText);
        if (Object.keys(days).length === 0) {
          days = { "Day 1": rawText };
        }

        let totalWords = 0;
        Object.values(days).forEach(txt => { totalWords += parseWordText(txt, 'temp', 'temp').length; });

        if (!title) { alert('단어장 대표 이름을 입력해주세요.'); return; }
        if (totalWords === 0) { alert('단어장 내용(단어 목록)을 입력해주세요.'); return; }

        if (confirm(`'${title}' 단어장 (총 ${Object.keys(days).length}개 Day, ${totalWords.toLocaleString()}개 단어)을 서버에 등록하시겠습니까?\n학원 소속 학생들의 화면에 즉시 적용됩니다.`)) {
          const btn = document.getElementById(btnId);
          if (btn) btn.disabled = true;

          showUploadLoading("☁️ 서버에 단어장 업로드 중...", `'${title}' (${totalWords.toLocaleString()}개 단어) 데이터를 서버로 전송하고 있습니다.`, 30);

          setTimeout(async () => {
            try {
              updateUploadLoading(70, "☁️ Firestore 데이터베이스에 암호화 저장 중...");
              await db.collection('academies').doc(academyId).collection('wordBooks').doc(slotId).set({
                title,
                days,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
              });
              updateAdminWordBookStatus(slotId, title, days);

              updateUploadLoading(100, "🎉 서버 저장 완료!");
              setTimeout(() => {
                hideUploadLoading();
                alert(`🎉 ${slotId === 'slot_1' ? '1번' : '2번'} 단어장 ('${title}')이 서버에 성공적으로 등록되었습니다!`);
              }, 400);
            } catch (err) {
              console.error(err);
              hideUploadLoading();
              if (err.message && (err.message.includes('permission') || err.message.includes('Permissions'))) {
                alert("⚠️ Firebase Firestore 보안 규칙 권한 오류가 발생했습니다!\n\n[해결 방법]\n1. Firebase 콘솔(https://console.firebase.google.com) 접속\n2. Firestore Database > 규칙(Rules) 탭 클릭\n3. 아래 규칙으로 수정한 뒤 '게시(Publish)' 클릭:\n\nrules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /{document=**} {\n      allow read, write: if request.auth != null;\n    }\n  }\n}");
              } else {
                alert('단어장 등록 중 오류가 발생했습니다: ' + err.message);
              }
            } finally {
              if (btn) btn.disabled = false;
            }
          }, 60);
        }
      }

      async function deleteAdminWordBook(slotId, titleId) {
        const slotName = (slotId === 'slot_1') ? '1번' : '2번';
        if (confirm(`⚠️ 정말 서버에서 [${slotName} 단어장]을 삭제하시겠습니까?\n\n삭제 시 소속 학생들의 화면에서도 해당 단어장이 즉시 제거됩니다.`)) {
          showUploadLoading("🗑️ 서버에서 단어장 삭제 중...", `[${slotName} 단어장] 데이터를 서버에서 제거하는 중입니다.`, 40);
          setTimeout(async () => {
            try {
              updateUploadLoading(70, "☁️ Firestore 데이터베이스에서 제거 중...");
              await db.collection('academies').doc(academyId).collection('wordBooks').doc(slotId).delete();
              
              const titleEl = document.getElementById(titleId);
              const contentEl = document.getElementById(slotId === 'slot_1' ? 'admin-wb1-content' : 'admin-wb2-content');
              if (titleEl) titleEl.value = '';
              if (contentEl) contentEl.value = '';
              if (slotId === 'slot_1') wb1Days = { "Day 1": "" };
              else wb2Days = { "Day 1": "" };
              
              updateAdminWordBookStatus(slotId, '', null);

              updateUploadLoading(100, "✅ 서버 삭제 완료!");
              setTimeout(() => {
                hideUploadLoading();
                alert(`🗑️ [${slotName} 단어장]이 서버에서 성공적으로 삭제되었습니다.`);
              }, 400);
            } catch (err) {
              console.error(err);
              hideUploadLoading();
              if (err.message && (err.message.includes('permission') || err.message.includes('Permissions'))) {
                alert("⚠️ Firebase Firestore 보안 규칙 권한 오류가 발생했습니다!\n\nFirestore Database > 규칙(Rules) 탭에서 권한 허용을 확인해주세요.");
              } else {
                alert('삭제 중 오류가 발생했습니다: ' + err.message);
              }
            }
          }, 60);
        }
      }

      const btnWb1Save = document.getElementById('btn-admin-wb1-save');
      if (btnWb1Save) btnWb1Save.onclick = () => saveAdminWordBook('slot_1', 'admin-wb1-title', 'btn-admin-wb1-save');
      const btnWb1Del = document.getElementById('btn-admin-wb1-delete');
      if (btnWb1Del) btnWb1Del.onclick = () => deleteAdminWordBook('slot_1', 'admin-wb1-title');

      const btnWb2Save = document.getElementById('btn-admin-wb2-save');
      if (btnWb2Save) btnWb2Save.onclick = () => saveAdminWordBook('slot_2', 'admin-wb2-title', 'btn-admin-wb2-save');
      const btnWb2Del = document.getElementById('btn-admin-wb2-delete');
      if (btnWb2Del) btnWb2Del.onclick = () => deleteAdminWordBook('slot_2', 'admin-wb2-title');

      await loadAdminWordBooks();

      loadAdminStudents(academyId);
    } catch (err) {
      console.error(err);
      alert("관리자 로그인 중 오류가 발생했습니다: " + err.message);
    }
  }

  let currentAdminStudents = [];

  async function loadAdminStudents(academyId) {
    const studentList = document.getElementById('admin-student-list');
    const studentCount = document.getElementById('admin-student-count');
    if (studentList) studentList.innerHTML = '<li style="color:white;">로딩 중...</li>';
    
    currentAdminStudents = [];
    try {
      const qs = await db.collection('users').where('academyId', '==', academyId).get();
      if (studentCount) studentCount.textContent = `${qs.size}명`;
      if (studentList) studentList.innerHTML = '';
      
      if (qs.empty) {
        if (studentList) studentList.innerHTML = '<li style="color:var(--text-sub); text-align:center; padding:20px;">등록된 학생이 없습니다.</li>';
        return;
      }
      
      qs.forEach(doc => {
        const data = doc.data();
        
        let joinDateStr = '미상';
        const dateObj = data.joinedAt || data.createdAt || data.updatedAt;
        if (dateObj) {
          let d;
          if (dateObj.toDate && typeof dateObj.toDate === 'function') d = dateObj.toDate();
          else d = new Date(dateObj);
          if (!isNaN(d.getTime())) {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const hh = String(d.getHours()).padStart(2, '0');
            const min = String(d.getMinutes()).padStart(2, '0');
            joinDateStr = `${yyyy}.${mm}.${dd} ${hh}:${min}`;
          }
        }

        currentAdminStudents.push({
          name: data.displayName || '이름 없음',
          phone: data.phoneNumber || '-',
          email: data.email || '-',
          joinedAt: joinDateStr
        });

        const li = document.createElement('li');
        li.style.cssText = 'background: rgba(0,0,0,0.2); padding: 12px 16px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.05);';
        
        const phoneHtml = data.phoneNumber ? `<span style="font-size: 12px; color: #a5b4fc; margin-left: 8px; font-weight: normal;">📞 ${esc(data.phoneNumber)}</span>` : '<span style="font-size: 12px; color: var(--text-sub); margin-left: 8px; font-weight: normal;">(전화번호 미입력)</span>';

        const infoDiv = document.createElement('div');
        infoDiv.innerHTML = `<div style="font-size: 15px; font-weight: 600; color: white; display: flex; align-items: center; flex-wrap: wrap; gap: 4px;">
                              <span>${esc(data.displayName || '이름 없음')}</span>
                              ${phoneHtml}
                             </div>
                             <div style="font-size: 12px; color: var(--text-sub); margin-top: 4px; display: flex; gap: 12px; flex-wrap: wrap;">
                               <span>✉️ ${esc(data.email || '이메일 없음')}</span>
                               <span>📅 등록일: ${joinDateStr}</span>
                             </div>`;
        
        const delBtn = document.createElement('button');
        delBtn.textContent = '삭제';
        delBtn.style.cssText = 'background: #ff4d4f; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;';
        delBtn.onclick = async () => {
          if (confirm(`${data.displayName || '학생'} 학생을 학원 명단에서 삭제하시겠습니까?`)) {
            try {
              await db.collection('users').doc(doc.id).update({
                academyId: null,
                academyName: null
              });
              loadAdminStudents(academyId);
            } catch (err) {
              console.error(err);
              alert("학생 삭제에 실패했습니다.");
            }
          }
        };
        
        li.appendChild(infoDiv);
        li.appendChild(delBtn);
        if (studentList) studentList.appendChild(li);
      });
      
    } catch (err) {
      console.error(err);
      if (studentList) studentList.innerHTML = '<li style="color:#ff6b6b;">목록을 불러오지 못했습니다.</li>';
    }
  }

  // 📊 Excel Export Event Handler
  const btnExportExcel = document.getElementById('btn-admin-export-excel');
  if (btnExportExcel) {
    btnExportExcel.onclick = () => {
      if (!currentAdminStudents || currentAdminStudents.length === 0) {
        alert("다운로드할 학생 목록이 없습니다.");
        return;
      }
      
      let csv = '\uFEFF';
      csv += '이름,전화번호,이메일,등록일\n';
      currentAdminStudents.forEach(st => {
        const name = `"${st.name.replace(/"/g, '""')}"`;
        const phone = `"${st.phone.replace(/"/g, '""')}"`;
        const email = `"${st.email.replace(/"/g, '""')}"`;
        const joined = `"${st.joinedAt.replace(/"/g, '""')}"`;
        csv += `${name},${phone},${email},${joined}\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      link.setAttribute('href', url);
      link.setAttribute('download', `학생목록_${todayStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
  }


  async function fetchUserProfile(uid) {
    if (!db) return;
    try {
      const userDoc = await db.collection('users').doc(uid).get();

      // Populate phone input if exists
      const userPhoneInput = document.getElementById('user-phone-input');
      if (userDoc.exists && userDoc.data().phoneNumber) {
        if (userPhoneInput) userPhoneInput.value = userDoc.data().phoneNumber;
      }
      
      // Sync down progress data first
      try {
        const progressQs = await db.collection('users').doc(uid).collection('progress').get();
        progressQs.forEach(doc => {
          const oldVal = localStorage.getItem(doc.id);
          const newVal = doc.data().value;
          if (oldVal !== newVal) {
            localStorage.setItem(doc.id, newVal);
          }
        });
        console.log("Firestore progress synced down to local.");
      } catch (e) {
        console.error("Progress sync failed", e);
      }

      const btnOpenAcademyModal = document.getElementById('btn-open-academy-modal');

      // 로그인 완료 시 즉시 메인 학습 화면(view-input)으로 전환 (화면 멈춤 방지)
      showView('view-input');
      loadDBList();

      if (userDoc.exists && userDoc.data().academyId && !userDoc.data().deleted) {
        const data = userDoc.data();
        currentAcademyId = data.academyId;
        currentAcademyName = data.academyName;
        if (userAcademyDisplay) userAcademyDisplay.textContent = `소속: ${data.academyName || currentAcademyId}`;
        
        try {
          const acaDoc = await db.collection('academies').doc(currentAcademyId).get();
          if (acaDoc.exists) {
            applyAcademyBranding(acaDoc.data());
          }
        } catch(e){}

        // 학원 등록 상태: 버튼을 '학원탈퇴'로 변경
        if (btnOpenAcademyModal) {
          btnOpenAcademyModal.textContent = '학원탈퇴';
          btnOpenAcademyModal.style.color = '#ff6b6b';
          btnOpenAcademyModal.style.borderColor = 'rgba(255,107,107,0.5)';
          btnOpenAcademyModal.style.background = 'rgba(255,107,107,0.15)';
        }

        // 학원 소속인 경우 해당 학원 전용 단어장(slot_1, slot_2)을 서버에서 동기화
        try {
          const wbQs = await db.collection('academies').doc(currentAcademyId).collection('wordBooks').get();
          let wb1Data = null;
          let wb2Data = null;
          wbQs.forEach(doc => {
            if (doc.id === 'slot_1') wb1Data = doc.data();
            if (doc.id === 'slot_2') wb2Data = doc.data();
          });
          if (wb1Data) localStorage.setItem(`academy_wb_${currentAcademyId}_slot_1`, JSON.stringify(wb1Data));
          else localStorage.removeItem(`academy_wb_${currentAcademyId}_slot_1`);
          
          if (wb2Data) localStorage.setItem(`academy_wb_${currentAcademyId}_slot_2`, JSON.stringify(wb2Data));
          else localStorage.removeItem(`academy_wb_${currentAcademyId}_slot_2`);
        } catch(e) {
          console.error("Student academy wordbooks sync failed", e);
        }

        updateCategoryTabTitles();
        if (academyInviteModal) academyInviteModal.classList.add('hidden');
      } else {
        // 학원 미등록 상태: 즉시 학원 초대 코드 등록 팝업 강제 표시!
        currentAcademyId = null;
        if (btnOpenAcademyModal) {
          btnOpenAcademyModal.textContent = '학원등록';
          btnOpenAcademyModal.style.color = '#a5b4fc';
          btnOpenAcademyModal.style.borderColor = 'rgba(165,180,252,0.5)';
          btnOpenAcademyModal.style.background = 'rgba(165,180,252,0.2)';
        }
        
        updateCategoryTabTitles();

        // 구글 로그인 후 학원 미등록인 경우 바로 학원 등록(초대 코드 입력) 창을 팝업!
        if (userAcademyDisplay) userAcademyDisplay.textContent = "소속: 학원 미등록 (초대 코드 입력 필요)";
        if (academyInviteModal) academyInviteModal.classList.remove('hidden');
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      showView('view-input');
      loadDBList();
    }
  }

 })();
