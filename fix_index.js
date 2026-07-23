const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace header swipe toggle with settings button and dropdown
const headerRegex = /<label for="swipe-toggle-checkbox" class="swipe-toggle-label"[\s\S]*?<\/label>/;
const settingsBtnAndDropdown = `      <!-- 설정 버튼 -->
      <button id="btn-settings" style="position: absolute; right: 0; top: 0; background: rgba(255,255,255,0.08); padding: 8px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.15); cursor: pointer; color: #fff; font-size: 16px; display: flex; align-items: center; justify-content: center; z-index: 100; pointer-events: auto; transform: translateY(6px);">
        ⚙️ 설정
      </button>

      <!-- 설정 메뉴 (드롭다운) -->
      <div id="settings-dropdown" class="hidden" style="position: absolute; right: 0; top: 50px; background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; z-index: 101; backdrop-filter: blur(10px); min-width: 180px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); pointer-events: auto;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; color: var(--text2); text-align: left; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.1);">환경 설정</h4>
        <!-- 스와이프 모드 토글 -->
        <label for="swipe-toggle-checkbox" class="swipe-toggle-label" style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; pointer-events: auto;">
          <span style="font-size: 14px; color: #f8fafc; font-weight: 700;">스와이프 모드</span>
          <div class="toggle-switch">
            <input type="checkbox" id="swipe-toggle-checkbox">
            <span class="slider round" style="box-shadow: none;"></span>
          </div>
        </label>
      </div>`;

html = html.replace(headerRegex, settingsBtnAndDropdown);

// Insert swipe hint below test-card-el
const cardEndRegex = /<\/div>\s*<!-- 5\. 라운드 결과 화면 -->/;
const hint = `</div>
    <!-- 스와이프 모드 힌트 -->
    <div id="swipe-hint" class="hidden" style="text-align: center; margin-top: -12px; margin-bottom: 24px; opacity: 0.6; font-size: 13px; font-weight: 700; color: #f8fafc; letter-spacing: 0.5px; z-index: 5; position: relative;">
      👈 X 몰랐어요&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;밀어서 넘기기 👆&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;O 알고 있어요 👉
    </div>

    <!-- 5. 라운드 결과 화면 -->`;

html = html.replace(cardEndRegex, hint);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated index.html');
