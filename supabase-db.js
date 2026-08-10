/* ═══════════════════════════════════════════════════════════════════════
   5SECore — 수파베이스 연결 계층 (supabase-db.js)
   -----------------------------------------------------------------------
   파이어베이스(Firestore + Firebase Auth)를 대체한다.
   app.js 는 이 파일이 노출하는 Auth / DB 만 쓴다.

   로그인: 구글 · 카카오 (둘 다 수파베이스 기본 지원)

   ⚠️ 아래 CONFIG 두 줄만 본인 값으로 채우면 동작합니다.
      키가 비어 있어도 앱은 죽지 않고 "맛보기(비로그인) 모드"로 돌아갑니다.
   ═══════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  /* ── ⚙️ CONFIG ──────────────────────────────────────────────────── */
  const CONFIG = {
    // Supabase 대시보드 → Project Settings → API
    // anon 키는 공개용이라 앱에 넣어도 된다. 실제 방어선은 schema.sql 의 RLS.
    // ⚠️ service_role 키는 절대 여기 넣지 말 것 (RLS를 전부 무시한다)
    SUPABASE_URL:      'https://aavcfhdavluppcxgxuii.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhdmNmaGRhdmx1cHBjeGd4dWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMjA2NjcsImV4cCI6MjEwMTg5NjY2N30.gp9272SRtw7ecgBEWE4jq43vtSEFYelx2LpXMoUWY80',
  };

  const configured =
    CONFIG.SUPABASE_URL.indexOf('YOUR-') === -1 &&
    CONFIG.SUPABASE_ANON_KEY.indexOf('YOUR-') === -1;

  if (!configured) {
    console.warn('[5SECore] 수파베이스 키가 아직 설정되지 않았습니다 — 맛보기(비로그인) 모드로만 동작합니다.');
  }

  const sb = (configured && global.supabase)
    ? global.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      })
    : null;

  /* 호출부에서 sb 가 없을 때 조용히 넘어가게 하는 헬퍼 */
  function off() { return Promise.resolve({ data: null, error: null, offline: true }); }
  function need() {
    if (!sb) throw new Error('로그인 서버에 연결되어 있지 않습니다.');
    return sb;
  }
  function unwrap(res) {
    if (res && res.error) throw res.error;
    return res ? res.data : null;
  }

  /* ═══════════════════════════════════════════════════════════════
     Auth
     ═══════════════════════════════════════════════════════════════ */
  let _user = null;
  let _profile = null;
  const listeners = [];

  function emit() { listeners.forEach(fn => { try { fn(_user, _profile); } catch (e) { console.error(e); } }); }

  const REDIRECT = global.location.origin + global.location.pathname;

  const Auth = {
    user()    { return _user; },
    profile() { return _profile; },
    isReady()  { return !!sb; },

    onChange(fn) { listeners.push(fn); if (_user !== null) fn(_user, _profile); },

    /** provider: 'google' | 'kakao' */
    async signIn(provider) {
      need();
      const { error } = await sb.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: REDIRECT,
          queryParams: provider === 'google' ? { prompt: 'select_account' } : undefined,
        },
      });
      if (error) throw error;
    },

    async signOut() { if (sb) await sb.auth.signOut(); _user = null; _profile = null; emit(); },

    /** 회원 탈퇴 — 프로필/진도를 지우고 계정을 삭제한다 */
    async deleteAccount() {
      need();
      // profiles 는 auth.users 삭제 시 cascade 되지만, 계정 삭제 실패에 대비해 먼저 정리
      await sb.from('progress').delete().eq('user_id', _user.id);
      await sb.from('profiles').delete().eq('id', _user.id);
      // 계정 자체 삭제는 서버 권한이 필요하다 → Edge Function 이 있으면 호출
      try {
        const { data: { session } } = await sb.auth.getSession();
        await fetch(CONFIG.SUPABASE_URL + '/functions/v1/delete-account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: CONFIG.SUPABASE_ANON_KEY,
            Authorization: 'Bearer ' + (session ? session.access_token : ''),
          },
        });
      } catch (e) { console.warn('delete-account function 미배포:', e); }
      await sb.auth.signOut();
      _user = null; _profile = null; emit();
    },
  };

  /* ═══════════════════════════════════════════════════════════════
     DB
     ═══════════════════════════════════════════════════════════════ */
  const DB = {
    /* ── 프로필 ── */
    profile: {
      async get(userId) {
        if (!sb) return null;
        const id = userId || (_user && _user.id);
        if (!id) return null;
        const { data, error } = await sb.from('profiles').select('*').eq('id', id).maybeSingle();
        if (error) { console.warn('profile.get', error); return null; }
        return data;
      },
      /** 학생이 직접 바꿀 수 있는 항목만 (role/academy_id 는 RPC 전용) */
      async update(fields) {
        if (!sb || !_user) return off();
        const allowed = {};
        ['display_name', 'real_name', 'phone', 'avatar_url'].forEach(k => {
          if (fields[k] !== undefined) allowed[k] = fields[k];
        });
        if (!Object.keys(allowed).length) return off();
        return sb.from('profiles').update(allowed).eq('id', _user.id);
      },
    },

    /* ── 학습 진도 (localStorage 미러) ── */
    progress: {
      async set(key, value) {
        if (!sb || !_user) return off();
        return sb.from('progress')
          .upsert({ user_id: _user.id, key, value: String(value), updated_at: new Date().toISOString() },
                  { onConflict: 'user_id,key' });
      },
      async list() {
        if (!sb || !_user) return [];
        const { data, error } = await sb.from('progress').select('key,value').eq('user_id', _user.id);
        if (error) { console.warn('progress.list', error); return []; }
        return data || [];
      },
      async remove(key) {
        if (!sb || !_user) return off();
        return sb.from('progress').delete().eq('user_id', _user.id).eq('key', key);
      },
      async removeByPrefix(prefix) {
        if (!sb || !_user) return off();
        return sb.from('progress').delete().eq('user_id', _user.id).like('key', prefix + '%');
      },
      async clearAll() {
        if (!sb || !_user) return off();
        return sb.from('progress').delete().eq('user_id', _user.id);
      },
    },

    /* ── 학원 ── */
    academy: {
      async get(id) {
        if (!sb || !id) return null;
        const { data, error } = await sb.from('academies').select('*').eq('id', id).maybeSingle();
        if (error) { console.warn('academy.get', error); return null; }
        return data;
      },
      async updateBrand(id, fields) {
        need();
        return unwrap(await sb.from('academies').update({
          brand_name: fields.brandName ?? null,
          brand_logo: fields.brandLogo ?? null,
          brand_sub:  fields.brandSub  ?? null,
          name:       fields.name ?? undefined,
        }).eq('id', id));
      },
      /* 최고관리자 전용 */
      async listAdmin()               { need(); return unwrap(await sb.rpc('list_academies_admin')); },
      async create(name, adminCode, inviteCode) {
        need();
        return unwrap(await sb.rpc('create_academy', {
          p_name: name, p_admin_code: adminCode, p_invite_code: inviteCode,
        }));
      },
      async remove(id)                { need(); return unwrap(await sb.rpc('delete_academy', { p_academy_id: id })); },
      async setInviteCode(id, code)   { need(); return unwrap(await sb.rpc('set_invite_code', { p_academy_id: id, p_new: code })); },
      async myInviteCode()            { need(); return unwrap(await sb.rpc('my_invite_code')); },
      async updateAll(id, name, adminCode, inviteCode) {
        need();
        return unwrap(await sb.rpc('update_academy_admin', {
          p_academy_id: id, p_name: name, p_admin_code: adminCode, p_invite_code: inviteCode,
        }));
      },
    },

    /* ── 학원 단어장 (1번/2번 슬롯) ── */
    wordBooks: {
      /** → { slot_1: {title, days}, slot_2: {...} } */
      async listByAcademy(academyId) {
        if (!sb || !academyId) return {};
        const { data, error } = await sb.from('word_books')
          .select('slot,title,days').eq('academy_id', academyId);
        if (error) { console.warn('wordBooks.list', error); return {}; }
        const out = {};
        (data || []).forEach(r => { out[r.slot] = { title: r.title, days: r.days || {} }; });
        return out;
      },
      async save(academyId, slot, title, days) {
        need();
        return unwrap(await sb.from('word_books').upsert({
          academy_id: academyId, slot, title, days,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'academy_id,slot' }));
      },
      async remove(academyId, slot) {
        need();
        return unwrap(await sb.from('word_books')
          .delete().eq('academy_id', academyId).eq('slot', slot));
      },
    },

    /* ── 제목으로 관리하는 부가 단어장 파일 ── */
    vocab: {
      async listByAcademy(academyId) {
        if (!sb || !academyId) return [];
        const { data, error } = await sb.from('vocabularies')
          .select('title,content').eq('academy_id', academyId);
        if (error) { console.warn('vocab.list', error); return []; }
        return data || [];
      },
      async upsert(academyId, title, content) {
        need();
        return unwrap(await sb.from('vocabularies').upsert({
          academy_id: academyId, title, content, updated_at: new Date().toISOString(),
        }, { onConflict: 'academy_id,title' }));
      },
    },

    /* ── 학생 목록 (관리자) ── */
    students: {
      async listByAcademy(academyId) {
        if (!sb || !academyId) return [];
        const { data, error } = await sb.from('profiles')
          .select('id,real_name,display_name,email,phone,joined_at,created_at')
          .eq('academy_id', academyId);
        if (error) { console.warn('students.list', error); return []; }
        return data || [];
      },
      async unlink(userId) { need(); return unwrap(await sb.rpc('unlink_student', { p_user_id: userId })); },
    },

    /* ── 코드 검증 RPC ── */
    rpc: {
      async joinAcademy(inviteCode, realName, phone) {
        need();
        const rows = unwrap(await sb.rpc('join_academy', {
          p_invite_code: inviteCode, p_real_name: realName, p_phone: phone,
        }));
        return rows && rows[0];      // { academy_id, academy_name }
      },
      async leaveAcademy()      { need(); return unwrap(await sb.rpc('leave_academy')); },
      async enterAdmin(code) {
        need();
        const rows = unwrap(await sb.rpc('enter_admin_mode', { p_admin_code: code }));
        return rows && rows[0];
      },
      async enterSuper(code)    { need(); return unwrap(await sb.rpc('enter_super_admin', { p_code: code })); },
      async setSuperCode(code)  { need(); return unwrap(await sb.rpc('set_super_admin_code', { p_new: code })); },
    },
  };

  /* ═══════════════════════════════════════════════════════════════
     기동
     ═══════════════════════════════════════════════════════════════ */
  async function boot() {
    if (!sb) { _user = false; emit(); return; }

    sb.auth.onAuthStateChange(async (_event, session) => {
      _user = session ? session.user : false;
      _profile = _user ? await DB.profile.get(_user.id) : null;
      emit();
    });

    const { data: { session } } = await sb.auth.getSession();
    _user = session ? session.user : false;
    _profile = _user ? await DB.profile.get(_user.id) : null;
    emit();
  }

  global.SBClient = sb;
  global.Auth = Auth;
  global.DB = DB;
  // 식별자는 숫자로 시작할 수 없어서 브랜드명(5SECore)을 그대로 쓰지 않는다
  global.AppBoot = boot();
})(window);
