# 수파베이스 전환 — 콘솔 설정 가이드

코드 쪽은 준비돼 있습니다. 아래는 **콘솔에서 직접 해야 하는 작업**만 모았습니다.
순서대로 하면 40분쯤 걸립니다.

---

## 1. 수파베이스 프로젝트 만들기

1. https://supabase.com → New project (리전은 **Northeast Asia (Seoul)** 권장)
2. **Project Settings → API** 에서 두 값을 복사
3. `supabase-db.js` 맨 위 `CONFIG` 에 붙여넣기

```js
const CONFIG = {
  SUPABASE_URL:      'https://xxxxxxxx.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOi...',
};
```

> `anon key`는 공개돼도 되는 값입니다. 실제 보안은 아래 2번의 RLS가 담당합니다.
> **절대 넣으면 안 되는 건 `service_role` 키입니다.** 그건 Edge Function 쪽에서만 씁니다.

---

## 2. 스키마 + 보안 규칙 적용 ⭐ 제일 중요

**SQL Editor → New query** 에 `supabase/schema.sql` 전체를 붙여넣고 **Run**.

이걸로 파이어베이스에서 지적했던 보안 문제가 구조적으로 막힙니다.

| 막히는 것 | 방법 |
|---|---|
| 학생이 다른 학원 명단(이름·전화번호)을 보는 것 | `profiles` RLS — 본인 것 + 소속 학원 관리자만 |
| 학생이 관리자 코드를 훔쳐보는 것 | 코드를 `academy_secrets` 로 분리하고 **SELECT 정책을 아예 안 만듦** |
| 학생이 스스로 관리자로 승격하는 것 | `role` 컬럼을 컬럼 단위 GRANT 로 잠금 — RPC 로만 변경 가능 |
| 남의 학습 진도 조회/수정 | `progress` RLS — 본인 것만 |

적용 후 **Table Editor** 에서 각 테이블에 `RLS enabled` 배지가 붙었는지 확인하세요.

---

## 3. 구글 로그인

1. **Google Cloud Console → APIs & Services → Credentials → OAuth client ID (웹)**
2. **승인된 리디렉션 URI** 에 아래를 등록
   ```
   https://aavcfhdavluppcxgxuii.supabase.co/auth/v1/callback
   ```
3. 발급된 Client ID / Secret 을 수파베이스 **Authentication → Providers → Google** 에 입력하고 Enable

---

## 4. 카카오 로그인

1. https://developers.kakao.com → 애플리케이션 추가
2. **앱 설정 → 앱 키** 의 **REST API 키** 를 복사
3. **제품 설정 → 카카오 로그인** → 활성화 ON
4. **Redirect URI** 에 등록
   ```
   https://aavcfhdavluppcxgxuii.supabase.co/auth/v1/callback
   ```
5. **보안 → Client Secret** 생성 후 활성화
6. **동의항목**: 닉네임·프로필사진 필수, **이메일은 "선택 동의"** 로 켜두세요
   (필수로 하면 비즈앱 심사가 필요합니다)
7. 수파베이스 **Authentication → Providers → Kakao** 에 REST API 키 + Client Secret 입력

---

## 5. 리디렉션 주소 등록

**Authentication → URL Configuration**

- **Site URL**: `https://내앱주소.com`
- **Redirect URLs**: 아래를 전부 추가
  ```
  https://내앱주소.com/index.html
  http://localhost:8765/index.html
  ```

앱(Capacitor)으로 감쌀 때는 딥링크 스킴도 추가해야 합니다:
```
com.doacore.app://login-callback
```

---

## 6. 최고관리자 계정 만들기

스키마가 기본 코드 `admin_nodoa327` 을 심어둡니다. 첫 로그인 후 로고를 길게 눌러 이 코드를 입력하면 최고관리자가 됩니다.
**바로 다른 코드로 바꾸세요.** (최고관리자 화면 → 코드 변경)

---

## 확인 체크리스트

- [ ] 구글로 로그인 → `profiles` 테이블에 행이 자동 생성되는가
- [ ] 카카오로 로그인 → 같은가
- [ ] 카카오 계정에서 **이메일 제공에 동의하지 않고** 로그인해도 되는가
- [ ] 최고관리자 코드로 학원 생성 → `academies` + `academy_secrets` 생성 확인
- [ ] 학생 계정으로 초대 코드 입력 → 학원 등록되는가
- [ ] **학생 계정으로 `academy_secrets` 조회 시도 → 빈 결과가 나와야 정상**
- [ ] 학습 진도가 `progress` 테이블에 쌓이는가
- [ ] 다른 기기에서 로그인 → 진도가 따라오는가
