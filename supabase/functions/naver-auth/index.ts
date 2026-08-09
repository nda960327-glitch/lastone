// ═══════════════════════════════════════════════════════════════════════
// DOACore — 네이버 로그인 Edge Function
// -----------------------------------------------------------------------
// 수파베이스는 네이버를 기본 지원하지 않는다. 그래서 이 함수가 대신한다.
//
//   1. 클라이언트가 네이버 인증을 마치고 받은 code 를 여기로 보낸다
//   2. 네이버에서 access_token 을 받고 프로필을 조회한다
//   3. Admin API 로 해당 이메일의 수파베이스 계정을 찾거나 만든다
//   4. 매직링크 토큰(token_hash)을 발급해 클라이언트에 돌려준다
//   5. 클라이언트가 verifyOtp() 로 그 토큰을 세션으로 바꾼다
//
// 배포:
//   supabase functions deploy naver-auth --no-verify-jwt
//   supabase secrets set NAVER_CLIENT_ID=xxx NAVER_CLIENT_SECRET=yyy
//
// ⚠️ --no-verify-jwt 필수. 로그인 전이라 아직 JWT가 없다.
// ═══════════════════════════════════════════════════════════════════════

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  try {
    const { code, state, redirectUri } = await req.json();
    if (!code) return json({ error: 'code 가 필요합니다' }, 400);

    const CLIENT_ID = Deno.env.get('NAVER_CLIENT_ID');
    const CLIENT_SECRET = Deno.env.get('NAVER_CLIENT_SECRET');
    if (!CLIENT_ID || !CLIENT_SECRET) {
      return json({ error: '서버에 네이버 키가 설정되지 않았습니다' }, 500);
    }

    // ── 1. code → access_token ──────────────────────────────────────
    const tokenUrl = new URL('https://nid.naver.com/oauth2.0/token');
    tokenUrl.searchParams.set('grant_type', 'authorization_code');
    tokenUrl.searchParams.set('client_id', CLIENT_ID);
    tokenUrl.searchParams.set('client_secret', CLIENT_SECRET);
    tokenUrl.searchParams.set('code', code);
    if (state) tokenUrl.searchParams.set('state', state);
    if (redirectUri) tokenUrl.searchParams.set('redirect_uri', redirectUri);

    const tokenRes = await fetch(tokenUrl.toString());
    const tokenJson = await tokenRes.json();
    if (!tokenJson.access_token) {
      return json({ error: '네이버 토큰 발급 실패', detail: tokenJson }, 401);
    }

    // ── 2. 프로필 조회 ───────────────────────────────────────────────
    const meRes = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` },
    });
    const meJson = await meRes.json();
    if (meJson.resultcode !== '00' || !meJson.response) {
      return json({ error: '네이버 프로필 조회 실패', detail: meJson }, 401);
    }

    const p = meJson.response as {
      id: string; email?: string; name?: string;
      nickname?: string; profile_image?: string; mobile?: string;
    };

    // 네이버는 이메일 제공 동의가 선택이라 없을 수 있다 → 대체 주소를 만든다
    const email = p.email || `naver_${p.id}@naver-user.doacore.app`;
    const name = p.name || p.nickname || '이름 없음';

    // ── 3. 수파베이스 계정 찾기 / 만들기 ────────────────────────────
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    const meta = {
      name,
      full_name: name,
      nickname: p.nickname ?? name,
      avatar_url: p.profile_image ?? null,
      profile_image: p.profile_image ?? null,
      naver_id: p.id,
      phone_from_naver: p.mobile ?? null,
    };

    const created = await admin.auth.admin.createUser({
      email,
      email_confirm: true,          // 네이버가 이미 검증한 계정
      user_metadata: meta,
      app_metadata: { provider: 'naver', providers: ['naver'] },
    });

    if (created.error) {
      const msg = (created.error.message || '').toLowerCase();
      const already = msg.includes('already') || msg.includes('registered') || msg.includes('exists');
      // 이미 있는 계정이면 그대로 로그인시킨다 (네이버가 검증한 이메일이므로 허용)
      if (!already) {
        return json({ error: '계정 생성 실패', detail: created.error.message }, 500);
      }
    }

    // ── 4. 매직링크 토큰 발급 ────────────────────────────────────────
    const link = await admin.auth.admin.generateLink({ type: 'magiclink', email });
    const hashed = link.data?.properties?.hashed_token;
    if (link.error || !hashed) {
      return json({ error: '세션 발급 실패', detail: link.error?.message }, 500);
    }

    return json({ email, token_hash: hashed, name });
  } catch (e) {
    return json({ error: '서버 오류', detail: String(e) }, 500);
  }
});
