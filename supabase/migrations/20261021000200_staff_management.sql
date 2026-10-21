-- ============================================================================
-- CareFrame — staff management groundwork.
--
-- The first migration established who may reach records. This one makes the
-- roster something an administrator can run from inside the product, and
-- turns the three roles from a convention into something the database itself
-- defends.
--
-- Written as a separate file rather than an edit to 20261021000100 so it
-- applies cleanly whether or not that one has already run.
--
-- Apply with:  supabase db push
--        or:   paste into Supabase Studio -> SQL Editor -> Run
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1. A new account carries its intended role from the moment it exists
-- ---------------------------------------------------------------------------

-- The admin API creates the auth user and this trigger creates the matching
-- staff row in the same transaction. Previously the role was always the
-- default and had to be corrected by a second statement, which left a window
-- — however brief — where a new viewer could write records.
create or replace function public.handle_new_staff_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested text := new.raw_user_meta_data ->> 'role';
  resolved  public.staff_role;
begin
  -- Metadata is caller-supplied, so an unrecognised value falls back to the
  -- least surprising role rather than raising and failing the signup.
  resolved := case
    when requested in ('admin', 'assessor', 'viewer') then requested::public.staff_role
    else 'assessor'::public.staff_role
  end;

  insert into public.staff (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    resolved
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. Keep the roster in step with the accounts behind it
-- ---------------------------------------------------------------------------

-- An administrator changing an address in Studio should not silently leave
-- the roster showing the old one.
create or replace function public.sync_staff_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is distinct from old.email then
    update public.staff set email = new.email, updated_at = now() where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_updated_sync_staff on auth.users;
create trigger on_auth_user_updated_sync_staff
  after update of email on auth.users
  for each row execute function public.sync_staff_email();

-- `updated_at` is shown in the team list as "last changed", so it has to be
-- maintained by the database; an application that forgets to set it makes the
-- column worse than useless.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists staff_touch_updated_at on public.staff;
create trigger staff_touch_updated_at
  before update on public.staff
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 3. The roster cannot be locked
-- ---------------------------------------------------------------------------

-- Without this, one mis-click — demoting yourself, or deactivating the only
-- administrator — leaves an organisation with care records it can no longer
-- administer, and no way back except a support ticket.
--
-- Enforced here rather than in the API because the API is not the only way in:
-- Studio, a script and a future service all reach this table directly.
create or replace function public.protect_last_administrator()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  was_admin boolean := old.role = 'admin' and old.is_active;
  still_admin boolean := tg_op = 'UPDATE' and new.role = 'admin' and new.is_active;
begin
  if was_admin and not still_admin then
    if not exists (
      select 1 from public.staff
      where id <> old.id and role = 'admin' and is_active
    ) then
      raise exception
        'Cannot remove the last active administrator. Appoint another one first.'
        using errcode = 'check_violation';
    end if;
  end if;

  return case tg_op when 'DELETE' then old else new end;
end;
$$;

drop trigger if exists staff_protect_last_admin on public.staff;
create trigger staff_protect_last_admin
  before update or delete on public.staff
  for each row execute function public.protect_last_administrator();

-- ---------------------------------------------------------------------------
-- 4. Reading the roster
-- ---------------------------------------------------------------------------

-- The team screen is sorted by name and filtered by role, and the roster is
-- the one table every authenticated request already touches on sign-in.
create index if not exists staff_role_idx  on public.staff (role) where is_active;
create index if not exists staff_email_idx on public.staff (lower(email));

-- ---------------------------------------------------------------------------
-- 5. The permission vocabulary
-- ---------------------------------------------------------------------------

-- One place that answers "what may this role do", rather than the question
-- being re-answered in each policy, each endpoint and each component. Adding
-- a capability later means a row here and a branch in the two client-side
-- maps that mirror it — not an audit of every call site.
--
-- The RLS policies keep calling can_write_records() / is_admin() because a
-- policy must stay cheap; this table is what those two names *mean*, and what
-- a finer-grained policy would be built from.
create table if not exists public.role_permissions (
  role       public.staff_role not null,
  permission text not null,
  primary key (role, permission)
);

comment on table public.role_permissions is
  'What each role may do. The source of truth for authorisation decisions above the row level; mirrored in the app and the API.';

insert into public.role_permissions (role, permission) values
  ('viewer',   'records:read'),

  ('assessor', 'records:read'),
  ('assessor', 'records:write'),
  ('assessor', 'careplan:generate'),

  ('admin',    'records:read'),
  ('admin',    'records:write'),
  ('admin',    'careplan:generate'),
  ('admin',    'staff:read'),
  ('admin',    'staff:manage')
on conflict (role, permission) do nothing;

-- Answers "may I?" for the caller, so a future policy or view can ask the
-- same question the API asks without duplicating the matrix.
create or replace function public.has_permission(permission text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.staff s
    join public.role_permissions p on p.role = s.role
    where s.id = (select auth.uid())
      and s.is_active
      and p.permission = has_permission.permission
  );
$$;

revoke all on function public.has_permission(text) from public, anon;
grant execute on function public.has_permission(text) to authenticated;

-- The matrix is not secret, and the app reads it to decide what to render.
-- It is reference data, so staff may read it and nobody may write it through
-- the API; changing it is a migration, which is the point.
alter table public.role_permissions enable row level security;
alter table public.role_permissions force row level security;

drop policy if exists role_permissions_read on public.role_permissions;
create policy role_permissions_read on public.role_permissions
  for select to authenticated using (public.is_active_staff());

revoke all on public.role_permissions from anon;
grant select on public.role_permissions to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Prove it
-- ---------------------------------------------------------------------------

do $$
declare
  unprotected text;
begin
  select string_agg(c.relname, ', ' order by c.relname) into unprotected
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity;

  if unprotected is not null then
    raise exception 'RLS still disabled on: %', unprotected;
  end if;

  if (select count(*) from public.role_permissions) < 9 then
    raise exception 'Permission matrix did not seed.';
  end if;

  raise notice 'Staff management ready: roles defended, permission matrix seeded.';
end
$$;

commit;
