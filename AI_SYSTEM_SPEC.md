# VocabMaster (토플 영단어 학습 PWA) - AI 및 시스템 명세서 (System Specification)

> **문서 목적:** 이 문서는 다른 AI 어시스턴트나 개발자가 **VocabMaster** 프로젝트의 아키텍처, 데이터 모델, 핵심 상태 머신(State Machine), 비동기 테스트 루프, UI/UX 디자인 규칙 및 PWA 로직을 단번에 100% 정확하게 이해하고 유지보수/확장할 수 있도록 작성된 종합 기술 명세서입니다.

---

## 1. 프로젝트 개요 & 기술 스택 (Overview & Tech Stack)
*   **프로젝트명:** VocabMaster (토플 영단어 집중 학습 및 테스트 PWA)
*   **아키텍처:** Single-Page Application (SPA) + Progressive Web App (PWA)
*   **기술 스택:**
    *   **Core:** 순수 HTML5, CSS3, ES6+ Vanilla JavaScript (프레임워크/라이브러리 없음, React/Vue/Tailwind 미사용)
    *   **TTS Engine:** 브라우저 내장 `window.speechSynthesis` (Web Speech API)
    *   **PWA:** Service Worker (`sw.js`), Web App Manifest (`manifest.json`), 오프라인 지원 및 모바일 홈 화면 추가
    *   **State Persistence:** `localStorage` (`vocabMasterProgress` 키로 Day별 학습 진행률, 정답/오답 상태 저장)
    *   **Hosting/CD:** GitHub Repository (`main` 브랜치) 및 Vercel 자동 배포

---

## 2. 파일 구조 및 역할 (File Structure & Roles)

```text
vocab-trainer/
├── index.html        # SPA 전체 구조 (5개 뷰 섹션: 홈/학습/목록/테스트/결과)
├── style.css         # 다크모드 글래스모피즘 디자인 시스템, 품사 뱃지 스타일, 타임라인/리스닝 애니메이션
├── app.js            # 싱글톤 상태 관리(App), 비동기 테스트 루프, TTS 제어, 이벤트 리스너, 로컬스토리지 I/O
├── sw.js             # PWA 서비스 워커 (Network-First 캐싱 전략, 즉시 활성화 및 오래된 캐시 정리)
├── manifest.json     # PWA 설치 및 모바일 앱 아이콘/화면 설정
└── DB/               # 토플 영단어 텍스트 데이터베이스
    ├── 토플영단어 day1.txt ~ day5.txt
```

---

## 3. 핵심 데이터 모델 및 상태 관리 (Data Models & State Machine)

### 3.1 단어 객체 구조 (Word Object Schema)
데이터베이스(`dayX.txt`)에서 로드 및 파싱된 각 단어는 다음과 같은 객체 구조를 가집니다.
```javascript
{
  id: 1,              // 단어 고유 ID (1부터 시작)
  word: "state",      // 영단어 스펠링
  meanings: [         // 뜻 및 품사 목록 (배열)
    { pos: "n", meaning: "상태, 국가, 주" },
    { pos: "v", "meaning": "명시하다, 진술하다" }
  ],
  passed: false,      // 현재 라운드에서 정답(O)을 맞췄는지 여부
  attempts: 0         // 오답(X) 또는 시간 초과 횟수
}
```

### 3.2 글로벌 상태 싱글톤 (`App` Object)
`app.js` 전역에 선언된 싱글톤 객체로 전반적인 상태를 제어합니다.
```javascript
const App = {
  currentDay: 1,          // 현재 학습 중인 Day (1~5)
  words: [],              // 현재 Day의 전체 단어 목록 (Word Object 배열)
  testPool: [],           // 현재 라운드에서 테스트 중인 단어 목록 (Round 1: 전체, Round 2+: 전 라운드 오답)
  round: 1,               // 현재 테스트 라운드 번호
  currentTestIndex: 0,    // testPool 내 현재 진행 중인 단어 인덱스
  phase: 'study',         // 현재 활성 화면 뷰 ('study' | 'list' | 'test' | 'result' | 'final')
  ttsSpeed: 0.8           // TTS 발음 속도 (기본 0.8x)
};
```

---

## 4. SPA 화면 구성 (5 View Sections)
`index.html`은 `<section class="view">` 태그로 구분된 5개의 화면을 가지며, `showView(viewId)` 함수를 통해 전환됩니다.
1.  **`#view-study` (단어 학습 카드 뷰):** 플래시카드 형태. 앞면(스펠링)/뒷면(뜻+품사) 플립, TTS 발음 듣기, 이전/다음 이동.
2.  **`#view-list` (전체 단어 목록 뷰):** 테이블 형태의 단어 사전. 단어 검색, 품사별 필터링, 개별 발음 듣기 기능.
3.  **`#view-test` (실전 테스트 뷰):** 비동기 제어 루프가 실행되는 핵심 테스트 화면 (상세 UX 흐름은 5장 참조).
4.  **`#view-result` (라운드 결산 뷰):** 각 라운드 종료 시 정답/오답 통계 표시, 오답만 모아 다음 라운드(`Round N+1`) 진행.
5.  **`#view-final` (최종 축하 뷰):** 오답이 0개가 되어 Day 학습을 완료했을 때 나타나는 최종 완료 화면.

---

## 5. 비동기 테스트 루프 및 타임라인 UX (The Core Test Loop)

테스트 단계(`App.phase === 'test'`)는 `async/await` 기반의 **`runTestRound()`** 및 **`resumeTestRound()`** 함수로 구동됩니다. 사용자의 입력 대기는 `Promise`를 반환하는 `waitForRevealOrPrev()` 및 `waitForOXOrPrev()`를 통해 비동기 처리됩니다.

### 5.1 테스트 단계별 UX 흐름 (Step-by-Step Flow)
*   **Step 1: 발음 청취 단계 (0초~2초)**
    *   단어 진입 직후 스펠링과 뜻이 숨겨진 상태에서 `speak(wordObj.word)` 호출로 발음이 자동 재생됩니다.
    *   화면 중앙에 애니메이션 헤드셋 아이콘(`🎧 발음을 듣고 스펠링을 맞춰보세요`)이 2초간 노출됩니다 (`#test-listening-zone`).
*   **Step 2: 스펠링 공개 & 뜻 유추 단계 (2초~)**
    *   2초 후 헤드셋이 사라지고 단어 스펠링(`state`)이 큰 글씨로 나타납니다 (`#test-word`).
    *   **[핵심 UX 규칙 - 스포일러 방지]:** 이 단계에서는 실제 품사(`[n]`, `[v]`)를 절대 노출해서는 안 됩니다! 단어 바로 아래에는 단지 **`"품사 N개"`** (예: `품사 2개`)라는 중립적인 텍스트 힌트만 깔끔한 알약 뱃지로 표시합니다 (`#test-pos-hint`).
*   **Step 3: 15초 제한 시간 타임라인 (0초~15초)**
    *   스펠링 공개와 동시에 `startWordTimer(15000, handleWordTimeout)`가 가동됩니다.
    *   화면 상단에 15.0초부터 0.0초까지 줄어드는 눈이 편안한 **블루-인디고 바(`linear-gradient(90deg, #3b82f6, #6366f1)`)**가 실시간 애니메이션됩니다.
    *   **[시간 초과 규칙]:** 15초 동안 뜻 확인이나 O/X 클릭이 없으면 `TIMEOUT` 시그널이 발생하며, 해당 단어는 자동으로 **X(몰랐어요/오답) 처리**(`attempts++`, `wrongThisRound.push`)되고 다음 단어로 자동 진행됩니다.
*   **Step 4: 뜻 확인 및 자가 평가 단계 (Reveal & O/X)**
    *   사용자가 `[뜻 확인하기]` 버튼을 누르면 `#test-meanings` 영역이 열리면서 실제 뜻과 **품사별 고유 컬러 뱃지(`[n]`, `[v]` 등, 크기 18px)**가 명확하게 렌더링됩니다.
    *   `[O 알고 있어요]` 클릭 시: `wordObj.passed = true`, 정답 카운트 증가.
    *   `[X 몰랐어요]` 클릭 시: `wordObj.attempts++`, 오답 목록(`wrongThisRound`)에 추가.
*   **Step 5: 안전한 네비게이션 예외 처리**
    *   테스트 도중 `◀ 이전 단어` 버튼이나 상단 `[홈으로]` 버튼을 누르면 즉시 `stopWordTimer()` 및 `window.speechSynthesis.cancel()`이 실행되어 타이머와 음성이 멈추고 안전하게 이전 상태로 복귀합니다.

---

## 6. 다중 라운드 오답 제거 로직 (Multi-Round Elimination)
*   **Round 1:** 선택한 Day의 전체 단어를 셔플하여 테스트합니다.
*   **Round 2 이후:** 이전 라운드에서 `X`를 누르거나 시간 초과(`TIMEOUT`)된 단어(`wrongThisRound`)들만 모아 `App.testPool`을 재구성한 뒤 셔플하여 테스트를 진행합니다.
*   **학습 완료 조건:** 특정 라운드 종료 시 오답 단어가 0개(`wrongThisRound.length === 0`)가 되면 학습 완결로 판정하고 `#view-final` 화면으로 전환합니다.

---

## 7. UI/UX 디자인 규칙 및 CSS 뱃지 시스템 (Design System & POS Colors)

### 7.1 품사(POS)별 고유 컬러 규칙 (`style.css`)
품사는 시각적 인지력을 높이기 위해 HSL/RGB 기반의 고유한 컬러와 테두리가 지정되어 있으며, 다른 규칙에 덮어씌워지지 않도록 `!important`가 적용되어 있습니다.
| 품사 (약어) | 컬러명 | 배경색 / 텍스트 색상 | CSS 클래스 |
| :--- | :--- | :--- | :--- |
| **명사 (n)** | Blue / Cyan | `rgba(59, 130, 246, 0.25)` / `#60a5fa` | `.pos-n` |
| **동사 (v)** | Red / Rose | `rgba(244, 63, 94, 0.25)` / `#fb7185` | `.pos-v` |
| **형용사 (a)** | Green / Emerald | `rgba(16, 185, 129, 0.25)` / `#34d399` | `.pos-a` |
| **부사 (ad)** | Amber / Orange | `rgba(245, 158, 11, 0.25)` / `#fbbf24` | `.pos-ad` |
| **전치사 (prep)** | Purple / Violet | `rgba(168, 85, 247, 0.25)` / `#c084fc` | `.pos-prep` |
| **접속사 (conj)** | Pink / Magenta | `rgba(236, 72, 153, 0.25)` / `#f472b6` | `.pos-conj` |
| **숙어/구 (phr)** | Teal / Cyan | `rgba(6, 182, 212, 0.25)` / `#22d3ee` | `.pos-phr` |

### 7.2 품사 뱃지 렌더링 원칙
1.  **뜻 목록 및 최종 성적표:** `.pos-badge` 클래스를 통해 `font-size: 18px`, `padding: 5px 14px`의 큼직하고 명확한 컬러 뱃지로 렌더링해야 합니다.
2.  **단어 맞추기 단계 (`#test-pos-hint`):** 스포일러를 막기 위해 위 컬러 뱃지를 절대 사용하지 않으며, 단지 `posHintEl.textContent = "품사 N개"` 문구만 반투명 화이트 스타일(`rgba(255,255,255,0.1)`)로 출력합니다.

---

## 8. PWA 서비스 워커 및 캐싱 전략 (Service Worker Strategy)
`sw.js`는 웹앱 배포 시 새로고침 오류나 이전 캐시 잔류를 방지하기 위해 **Network-First (네트워크 우선, 실패 시 캐시 폴백)** 전략과 **즉시 활성화** 로직을 사용합니다.

```javascript
// 1. 설치 시 즉시 대기 상태 건너뛰기
self.addEventListener('install', (e) => {
  self.skipWaiting();
  /* ...캐시 저장 로직... */
});

// 2. 활성화 시 이전 버전 캐시 즉시 청소 및 클라이언트 제어권 획득
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Network-First fetch: 네트워크에서 최신 버전을 먼저 가져오고, 실패(오프라인) 시 캐시 반환
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => { cache.put(e.request, responseToCache); });
        }
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
```

---

## 9. 다른 AI를 위한 개발 및 유지보수 가이드 (Guidelines for LLMs)
이 프로젝트의 코드를 수정하거나 기능을 추가하려는 LLM / AI 어시스턴트는 다음 규칙을 반드시 숙지하고 준수해야 합니다:
1.  **Vanilla JS 원칙 준수:** 빌드 도구(Webpack/Vite 등)나 외부 라이브러리(jQuery/Tailwind 등)를 도입하지 말고 기존 HTML/CSS/JS 파일 체계를 유지하세요.
2.  **테스트 UX 스포일러 금지:** `app.js`의 `runTestRound()`나 `resumeTestRound()` 수정 시, 뜻 공개(`waitForRevealOrPrev` 완료) 이전 단계에 품사의 종류(`n`, `v` 등)가 노출되는 코드를 작성하지 마세요.
3.  **PWA 캐시 버전 관리:** `index.html`, `style.css`, `app.js`의 기능을 수정했다면 `sw.js` 상단의 `CACHE_NAME` (예: `'vocabmaster-v34'`) 버전을 반드시 1 증가시켜 배포하세요.
4.  **타이머 안전성:** 비동기 루프 내에서 화면을 전환하거나 이탈하는 기능(예: 재시험 선택, 홈 이동 등)을 추가할 때는 반드시 `stopWordTimer()`와 `window.speechSynthesis.cancel()`을 먼저 호출하세요.
