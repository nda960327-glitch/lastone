-- ═══════════════════════════════════════════════════════════════════════
-- DOACore — Supabase(Postgres) 스키마
-- Supabase 대시보드 → SQL Editor 에 통째로 붙여넣고 실행하세요.
-- 여러 번 실행해도 안전합니다 (idempotent).
--
-- 설계 원칙
--   1. 학원 코드(관리자코드/초대코드)는 별도 테이블에 두고 SELECT 정책을
--      아예 만들지 않는다 → 클라이언트에서 절대 읽을 수 없다.
--      코드 검증은 SECURITY DEFINER 함수(RPC)로만 한다.
--   2. role / academy_id 는 컬럼 단위 GRANT 로 잠근다 → 학생이 스스로
--      관리자로 승격할 수 없다.
--   3. profiles 정책에서 profiles 를 다시 조회하면 무한 재귀가 나므로
--      my_role() / my_academy() 헬퍼(SECURITY DEFINER)를 거친다.
-- ═══════════════════════════════════════════════════════════════════════

-- ── 확장 ─────────────────────────────────────────────────────────────
create extension if not exists pgcrypto;

-- ═════════════════════════════════════════════════════════════════════
-- 테이블
-- ═════════════════════════════════════════════════════════════════════

-- 학원 (공개 정보)
create table if not exists public.academies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  brand_name  text,
  brand_logo  text,
  brand_sub   text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 학원 비밀 코드 (클라이언트에서 읽을 수 없음)
create table if not exists public.academy_secrets (
  academy_id  uuid primary key references public.academies(id) on delete cascade,
  admin_code  text not null unique,
  invite_code text not null unique
);

-- 사용자 프로필 (auth.users 1:1)
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,
  display_name text,
  real_name    text,
  phone        text,
  avatar_url   text,
  provider     text,                        -- google | kakao | naver
  academy_id   uuid references public.academies(id) on delete set null,
  academy_name text,
  role         text not null default 'student'
               check (role in ('student', 'admin', 'superadmin')),
  joined_at    timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists profiles_academy_idx on public.profiles(academy_id);

-- 학습 진도 (localStorage 미러)
create table if not exists public.progress (
  user_id    uuid not null references auth.users(id) on delete cascade,
  key        text not null,
  value      text,
  updated_at timestamptz not null default now(),
  primary key (user_id, key)
);

-- 학원 전용 단어장 (관리자 화면의 1번/2번 슬롯)
-- days: { "Day 1": "apple [n] 사과\n...", "Day 2": "..." }
create table if not exists public.word_books (
  academy_id uuid not null references public.academies(id) on delete cascade,
  slot       text not null check (slot in ('slot_1', 'slot_2')),
  title      text,
  days       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (academy_id, slot)
);

-- 제목으로 관리하는 부가 단어장 파일 (기존 vocabularies 경로 호환)
create table if not exists public.vocabularies (
  academy_id uuid not null references public.academies(id) on delete cascade,
  title      text not null,
  content    text,
  updated_at timestamptz not null default now(),
  primary key (academy_id, title)
);

-- 전역 설정 (최고관리자 코드 등) — 클라이언트 직접 접근 금지
create table if not exists public.app_config (
  key   text primary key,
  value text
);

-- 최고관리자 코드 초기값 (기존 기본값 유지)
insert into public.app_config (key, value)
values ('super_admin_code', 'admin_nodoa327')
on conflict (key) do nothing;

-- ── updated_at 자동 갱신 ─────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists t_academies_touch on public.academies;
create trigger t_academies_touch before update on public.academies
  for each row execute function public.touch_updated_at();

drop trigger if exists t_profiles_touch on public.profiles;
create trigger t_profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ═════════════════════════════════════════════════════════════════════
-- 가입 시 프로필 자동 생성
-- ═════════════════════════════════════════════════════════════════════
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url, provider)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name',
             new.raw_user_meta_data->>'full_name',
             new.raw_user_meta_data->>'nickname',
             '이름 없음'),
    coalesce(new.raw_user_meta_data->>'avatar_url',
             new.raw_user_meta_data->>'picture',
             new.raw_user_meta_data->>'profile_image'),
    coalesce(new.raw_app_meta_data->>'provider', 'unknown')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ═════════════════════════════════════════════════════════════════════
-- 헬퍼 (RLS 재귀 방지용 — SECURITY DEFINER 라 RLS를 우회한다)
-- ═════════════════════════════════════════════════════════════════════
create or replace function public.my_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.my_academy()
returns uuid language sql stable security definer set search_path = public as $$
  select academy_id from public.profiles where id = auth.uid()
$$;

-- ═════════════════════════════════════════════════════════════════════
-- RLS
-- ═════════════════════════════════════════════════════════════════════
alter table public.academies       enable row level security;
alter table public.academy_secrets enable row level security;
alter table public.profiles        enable row level security;
alter table public.progress        enable row level security;
alter table public.word_books      enable row level security;
alter table public.vocabularies    enable row level security;
alter table public.app_config      enable row level security;

-- ── profiles ─────────────────────────────────────────────────────────
drop policy if exists profiles_select_self  on public.profiles;
drop policy if exists profiles_select_staff on public.profiles;
drop policy if exists profiles_insert_self  on public.profiles;
drop policy if exists profiles_update_self  on public.profiles;
drop policy if exists profiles_delete_self  on public.profiles;

create policy profiles_select_self on public.profiles
  for select using (id = auth.uid());

-- 학원 관리자는 소속 학생만, 최고관리자는 전체
create policy profiles_select_staff on public.profiles
  for select using (
    public.my_role() = 'superadmin'
    or (public.my_role() = 'admin' and academy_id is not null and academy_id = public.my_academy())
  );

create policy profiles_insert_self on public.profiles
  for insert with check (id = auth.uid());

create policy profiles_update_self on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy profiles_delete_self on public.profiles
  for delete using (id = auth.uid());

-- 🔒 학생이 스스로 role/academy 를 바꿔 관리자로 승격하는 것을 막는다.
--    이 컬럼들은 RPC(SECURITY DEFINER)를 통해서만 바뀐다.
revoke update on public.profiles from authenticated;
grant  update (display_name, real_name, phone, avatar_url) on public.profiles to authenticated;

-- ── progress : 본인 것만 ─────────────────────────────────────────────
drop policy if exists progress_all_self on public.progress;
create policy progress_all_self on public.progress
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ── academies ────────────────────────────────────────────────────────
drop policy if exists academies_select    on public.academies;
drop policy if exists academies_update    on public.academies;
drop policy if exists academies_super_all on public.academies;

-- 소속 학원 정보는 소속원이 읽는다. 최고관리자는 전부.
create policy academies_select on public.academies
  for select using (
    public.my_role() = 'superadmin' or id = public.my_academy()
  );

-- 브랜드 설정은 해당 학원 관리자만 수정
create policy academies_update on public.academies
  for update using (public.my_role() = 'admin' and id = public.my_academy())
  with check  (public.my_role() = 'admin' and id = public.my_academy());

-- 학원 생성/삭제는 최고관리자만 (RPC 로 처리하지만 정책도 같이 건다)
create policy academies_super_all on public.academies
  for all using (public.my_role() = 'superadmin')
  with check (public.my_role() = 'superadmin');

-- ── academy_secrets : 정책 없음 = 아무도 직접 못 읽는다 ──────────────
--    (RPC 함수만 SECURITY DEFINER 로 접근)

-- ── word_books / vocabularies ────────────────────────────────────────
-- 읽기: 소속 학생 전원 / 쓰기: 해당 학원 관리자만
drop policy if exists wb_select    on public.word_books;
drop policy if exists wb_write     on public.word_books;
drop policy if exists vocab_select on public.vocabularies;
drop policy if exists vocab_write  on public.vocabularies;

create policy wb_select on public.word_books
  for select using (
    public.my_role() = 'superadmin' or academy_id = public.my_academy()
  );
create policy wb_write on public.word_books
  for all using (
    public.my_role() = 'superadmin'
    or (public.my_role() = 'admin' and academy_id = public.my_academy())
  ) with check (
    public.my_role() = 'superadmin'
    or (public.my_role() = 'admin' and academy_id = public.my_academy())
  );

create policy vocab_select on public.vocabularies
  for select using (
    public.my_role() = 'superadmin' or academy_id = public.my_academy()
  );
create policy vocab_write on public.vocabularies
  for all using (
    public.my_role() = 'superadmin'
    or (public.my_role() = 'admin' and academy_id = public.my_academy())
  ) with check (
    public.my_role() = 'superadmin'
    or (public.my_role() = 'admin' and academy_id = public.my_academy())
  );

-- ── app_config : 정책 없음 = RPC 로만 접근 ───────────────────────────

-- ═════════════════════════════════════════════════════════════════════
-- RPC — 코드 검증은 전부 여기서만
-- ═════════════════════════════════════════════════════════════════════

-- 초대 코드로 학원 등록
create or replace function public.join_academy(
  p_invite_code text, p_real_name text, p_phone text
) returns table (academy_id uuid, academy_name text)
language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_name text;
begin
  if auth.uid() is null then raise exception '로그인이 필요합니다'; end if;

  select s.academy_id, a.name into v_id, v_name
  from public.academy_secrets s
  join public.academies a on a.id = s.academy_id
  where s.invite_code = btrim(p_invite_code);

  if v_id is null then raise exception '유효하지 않은 초대 코드입니다'; end if;

  update public.profiles set
    academy_id = v_id, academy_name = v_name,
    real_name = coalesce(nullif(btrim(p_real_name), ''), real_name),
    display_name = coalesce(nullif(btrim(p_real_name), ''), display_name),
    phone = coalesce(nullif(btrim(p_phone), ''), phone),
    joined_at = now()
  where id = auth.uid();

  return query select v_id, v_name;
end $$;

-- 학원 탈퇴
create or replace function public.leave_academy()
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception '로그인이 필요합니다'; end if;
  update public.profiles
     set academy_id = null, academy_name = null, role = 'student'
   where id = auth.uid();
end $$;

-- 관리자 코드 확인 → 통과하면 role='admin' 으로 승격
create or replace function public.enter_admin_mode(p_admin_code text)
returns table (academy_id uuid, academy_name text)
language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_name text;
begin
  if auth.uid() is null then raise exception '로그인이 필요합니다'; end if;

  select s.academy_id, a.name into v_id, v_name
  from public.academy_secrets s
  join public.academies a on a.id = s.academy_id
  where s.admin_code = btrim(p_admin_code);

  if v_id is null then raise exception '유효하지 않은 관리자 코드입니다'; end if;

  update public.profiles
     set role = 'admin', academy_id = v_id, academy_name = v_name
   where id = auth.uid();

  return query select v_id, v_name;
end $$;

-- 최고관리자 코드 확인 → 통과하면 role='superadmin'
create or replace function public.enter_super_admin(p_code text)
returns boolean language plpgsql security definer set search_path = public as $$
declare v_ok boolean;
begin
  if auth.uid() is null then raise exception '로그인이 필요합니다'; end if;
  select (value = btrim(p_code)) into v_ok
    from public.app_config where key = 'super_admin_code';
  if coalesce(v_ok, false) then
    update public.profiles set role = 'superadmin' where id = auth.uid();
    return true;
  end if;
  return false;
end $$;

-- 최고관리자 코드 변경
create or replace function public.set_super_admin_code(p_new text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if public.my_role() <> 'superadmin' then raise exception '권한이 없습니다'; end if;
  if btrim(coalesce(p_new, '')) = '' then raise exception '코드가 비어 있습니다'; end if;
  update public.app_config set value = btrim(p_new) where key = 'super_admin_code';
end $$;

-- 학원 생성 (최고관리자 전용)
create or replace function public.create_academy(
  p_name text, p_admin_code text, p_invite_code text
) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  if public.my_role() <> 'superadmin' then raise exception '권한이 없습니다'; end if;

  if exists (select 1 from public.academy_secrets
             where admin_code = btrim(p_admin_code) or invite_code = btrim(p_invite_code)) then
    raise exception '이미 사용 중인 코드입니다';
  end if;

  insert into public.academies (name) values (btrim(p_name)) returning id into v_id;
  insert into public.academy_secrets (academy_id, admin_code, invite_code)
  values (v_id, btrim(p_admin_code), btrim(p_invite_code));
  return v_id;
end $$;

-- 학원 삭제 (최고관리자 전용) — 소속 학생 연결도 해제
create or replace function public.delete_academy(p_academy_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if public.my_role() <> 'superadmin' then raise exception '권한이 없습니다'; end if;
  update public.profiles
     set academy_id = null, academy_name = null, role = 'student'
   where academy_id = p_academy_id;
  delete from public.academies where id = p_academy_id;  -- secrets/vocab 은 cascade
end $$;

-- 초대 코드 변경 (해당 학원 관리자 또는 최고관리자)
create or replace function public.set_invite_code(p_academy_id uuid, p_new text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not (public.my_role() = 'superadmin'
          or (public.my_role() = 'admin' and public.my_academy() = p_academy_id)) then
    raise exception '권한이 없습니다';
  end if;
  if btrim(coalesce(p_new, '')) = '' then raise exception '코드가 비어 있습니다'; end if;
  update public.academy_secrets set invite_code = btrim(p_new) where academy_id = p_academy_id;
end $$;

-- 학원 이름 + 코드 한 번에 수정 (최고관리자 전용)
-- 이름이 바뀌면 소속 학생들의 academy_name 도 같이 갱신한다.
create or replace function public.update_academy_admin(
  p_academy_id uuid, p_name text, p_admin_code text, p_invite_code text
) returns void
language plpgsql security definer set search_path = public as $$
begin
  if public.my_role() <> 'superadmin' then raise exception '권한이 없습니다'; end if;

  if exists (select 1 from public.academy_secrets
             where academy_id <> p_academy_id
               and (admin_code = btrim(p_admin_code) or invite_code = btrim(p_invite_code))) then
    raise exception '다른 학원이 이미 쓰는 코드입니다';
  end if;

  update public.academies set name = btrim(p_name) where id = p_academy_id;
  update public.academy_secrets
     set admin_code = btrim(p_admin_code), invite_code = btrim(p_invite_code)
   where academy_id = p_academy_id;
  update public.profiles set academy_name = btrim(p_name) where academy_id = p_academy_id;
end $$;

-- 학생을 학원 명단에서 제외 (해당 학원 관리자 또는 최고관리자)
create or replace function public.unlink_student(p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_aca uuid;
begin
  select academy_id into v_aca from public.profiles where id = p_user_id;
  if not (public.my_role() = 'superadmin'
          or (public.my_role() = 'admin' and public.my_academy() = v_aca)) then
    raise exception '권한이 없습니다';
  end if;
  update public.profiles
     set academy_id = null, academy_name = null
   where id = p_user_id;
end $$;

-- 최고관리자 화면용 학원 목록 (코드 포함 — 최고관리자만)
create or replace function public.list_academies_admin()
returns table (id uuid, name text, admin_code text, invite_code text,
               student_count bigint, created_at timestamptz)
language plpgsql security definer set search_path = public as $$
begin
  if public.my_role() <> 'superadmin' then raise exception '권한이 없습니다'; end if;
  return query
    select a.id, a.name, s.admin_code, s.invite_code,
           (select count(*) from public.profiles p where p.academy_id = a.id),
           a.created_at
    from public.academies a
    left join public.academy_secrets s on s.academy_id = a.id
    order by a.created_at desc;
end $$;

-- 내 학원의 초대 코드 조회 (관리자 화면용)
create or replace function public.my_invite_code()
returns text language plpgsql security definer set search_path = public as $$
declare v text;
begin
  if public.my_role() not in ('admin', 'superadmin') then raise exception '권한이 없습니다'; end if;
  select invite_code into v from public.academy_secrets where academy_id = public.my_academy();
  return v;
end $$;

-- ── 실행 권한 ────────────────────────────────────────────────────────
grant execute on function
  public.join_academy(text, text, text),
  public.leave_academy(),
  public.enter_admin_mode(text),
  public.enter_super_admin(text),
  public.set_super_admin_code(text),
  public.create_academy(text, text, text),
  public.delete_academy(uuid),
  public.update_academy_admin(uuid, text, text, text),
  public.unlink_student(uuid),
  public.set_invite_code(uuid, text),
  public.list_academies_admin(),
  public.my_invite_code(),
  public.my_role(),
  public.my_academy()
to authenticated;
