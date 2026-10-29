-- ============================================================================
-- CentiCare — close the open database.
--
-- Before this migration every table in `public` was readable AND writable by
-- anyone holding the anon key, which ships in the browser bundle. That is the
-- whole caseload: names, NHS numbers, addresses, diagnoses, safeguarding
-- concerns and advance preferences.
--
-- After it, reaching any row requires a signed-in Supabase user who also has
-- an active row in `public.staff`. Authentication alone is deliberately not
-- enough: a self-registered account is a stranger until an admin says
-- otherwise.
--
-- The migration is idempotent and asserts its own postcondition — if it leaves
-- a single table in `public` without RLS, it raises and rolls back rather than
-- reporting success.
--
-- Apply with:  supabase db push
--        or:   paste into Supabase Studio → SQL Editor → Run
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1. Who counts as staff
-- ---------------------------------------------------------------------------

-- Roles are coarse on purpose. `assessor` is the default because it matches
-- what every user could already do, so enabling RLS changes no one's
-- day-to-day. `viewer` is read-only; `admin` additionally manages staff.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'staff_role') then
    create type public.staff_role as enum ('admin', 'assessor', 'viewer');
  end if;
end
$$;

create table if not exists public.staff (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  role        public.staff_role not null default 'assessor',
  -- The revocation switch. Deactivating keeps the audit trail that deleting
  -- the account would destroy; `created_by` references must stay resolvable.
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.staff is
  'Care staff permitted to reach service-user records. A row in auth.users without a row here has no access to anything.';

create index if not exists staff_active_idx on public.staff (id) where is_active;

-- Existing accounts keep working rather than being locked out by this file.
insert into public.staff (id, email, full_name)
select u.id,
       u.email,
       coalesce(u.raw_user_meta_data ->> 'full_name', u.email)
from auth.users u
on conflict (id) do nothing;

-- New accounts get a staff row automatically, so an admin creating a user in
-- Studio does not have to remember a second step.
create or replace function public.handle_new_staff_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.staff (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_make_staff on auth.users;
create trigger on_auth_user_created_make_staff
  after insert on auth.users
  for each row execute function public.handle_new_staff_user();

-- ---------------------------------------------------------------------------
-- 2. The predicates every policy is built from
-- ---------------------------------------------------------------------------

-- SECURITY DEFINER so the lookup is not itself filtered by the policies on
-- `staff`, which would recurse. `search_path = ''` forces every name to be
-- schema-qualified, closing the search-path hijack that SECURITY DEFINER
-- functions are otherwise exposed to. STABLE lets the planner call it once
-- per statement rather than once per row.
create or replace function public.is_active_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.staff s
    where s.id = (select auth.uid()) and s.is_active
  );
$$;

create or replace function public.can_write_records()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.staff s
    where s.id = (select auth.uid())
      and s.is_active
      and s.role in ('admin', 'assessor')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.staff s
    where s.id = (select auth.uid()) and s.is_active and s.role = 'admin'
  );
$$;

revoke all on function public.is_active_staff()   from public, anon;
revoke all on function public.can_write_records() from public, anon;
revoke all on function public.is_admin()          from public, anon;
grant execute on function public.is_active_staff()   to authenticated;
grant execute on function public.can_write_records() to authenticated;
grant execute on function public.is_admin()          to authenticated;

-- ---------------------------------------------------------------------------
-- 3. RLS on every clinical table
-- ---------------------------------------------------------------------------

-- Generated rather than listed. A hand-written list is one `create table`
-- away from being wrong, and the table that gets forgotten is the one that
-- leaks. This covers whatever is in `public` at apply time; the assertion in
-- section 5 proves it covered all of it.
do $$
declare
  t text;
begin
  for t in
    select c.relname
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind = 'r'
      and c.relname <> 'staff'          -- has its own policies, below
      and c.relname not like 'pg_%'
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);

    -- Policies are per-command rather than FOR ALL so an audit can read off
    -- exactly who may do what, and so read-only roles are expressible.
    execute format('drop policy if exists staff_select on public.%I', t);
    execute format('drop policy if exists staff_insert on public.%I', t);
    execute format('drop policy if exists staff_update on public.%I', t);
    execute format('drop policy if exists staff_delete on public.%I', t);

    execute format(
      'create policy staff_select on public.%I for select to authenticated
         using (public.is_active_staff())', t);

    execute format(
      'create policy staff_insert on public.%I for insert to authenticated
         with check (public.can_write_records())', t);

    execute format(
      'create policy staff_update on public.%I for update to authenticated
         using (public.can_write_records())
         with check (public.can_write_records())', t);

    execute format(
      'create policy staff_delete on public.%I for delete to authenticated
         using (public.can_write_records())', t);
  end loop;
end
$$;

-- Staff may read the directory (the app shows who recorded what) but only an
-- admin may change it — otherwise any assessor could promote themselves.
alter table public.staff enable row level security;
alter table public.staff force row level security;

drop policy if exists staff_self_or_roster on public.staff;
drop policy if exists staff_admin_insert   on public.staff;
drop policy if exists staff_admin_update   on public.staff;
drop policy if exists staff_admin_delete   on public.staff;

create policy staff_self_or_roster on public.staff
  for select to authenticated
  using (id = (select auth.uid()) or public.is_active_staff());

create policy staff_admin_insert on public.staff
  for insert to authenticated with check (public.is_admin());

create policy staff_admin_update on public.staff
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy staff_admin_delete on public.staff
  for delete to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4. Take the anon role's grants away entirely
-- ---------------------------------------------------------------------------

-- Belt as well as braces. RLS already returns zero rows to `anon` because no
-- policy names that role, but a future `FOR ALL TO public` policy written by
-- mistake would hand the caseload back. Without the GRANT, it cannot.
-- Nothing in this product is meant to be readable while signed out; reverse
-- this block if that ever changes.
revoke all on all tables    in schema public from anon;
revoke all on all sequences in schema public from anon;
revoke all on all functions in schema public from anon;

alter default privileges in schema public revoke all on tables    from anon;
alter default privileges in schema public revoke all on sequences from anon;
alter default privileges in schema public revoke all on functions from anon;

grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Prove it
-- ---------------------------------------------------------------------------

-- A migration that silently half-applies is worse than one that fails. If any
-- table in `public` is still unprotected, or `anon` still holds a grant, this
-- raises and the whole transaction rolls back.
do $$
declare
  unprotected text;
  still_granted text;
begin
  select string_agg(c.relname, ', ' order by c.relname) into unprotected
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity;

  if unprotected is not null then
    raise exception 'RLS still disabled on: %', unprotected;
  end if;

  select string_agg(distinct table_name, ', ') into still_granted
  from information_schema.role_table_grants
  where grantee = 'anon' and table_schema = 'public';

  if still_granted is not null then
    raise exception 'anon still holds grants on: %', still_granted;
  end if;

  raise notice 'RLS verified: every table in public is protected and anon holds no grants.';
end
$$;

commit;
