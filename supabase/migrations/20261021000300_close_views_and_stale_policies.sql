-- ============================================================================
-- CentiCare — close what migration 100 left open.
--
-- Two gaps, both found by signing in as a real account that was deliberately
-- not on the staff roster and asking the API for everything:
--
--   1. STALE POLICIES. Migration 100 dropped only the four policies it was
--      about to create. Any permissive policy that already existed — the
--      "Enable read access for all users" template is the usual source —
--      survived, and policies are OR'd. Fifteen tables, including every
--      *_care_plan table, still returned rows to a signed-in stranger.
--
--   2. VIEWS. That migration's loop and its assertion both filtered on
--      relkind = 'r', so views were neither protected nor counted. A view
--      runs with its owner's rights unless told otherwise, which means it
--      reads straight past the row level security on the tables beneath it.
--      `embedding_status_view` returned service user names.
--
-- Anonymous callers were never affected — migration 100 removed the anon
-- role's grants, and grants are checked before policies. This is about who
-- gets through once they hold any valid account.
--
-- Apply AFTER 20261021000200_staff_management.sql.
--
--   supabase db push      or      Studio -> SQL Editor -> Run
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1. Remove every policy, then put back only the ones this project defines
-- ---------------------------------------------------------------------------

-- Deliberately destructive, and the point. A lockdown migration that leaves
-- policies it does not recognise is not a lockdown. Each one is named as it
-- goes so the change is auditable from the migration output.
do $$
declare
  r record;
  dropped int := 0;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
  loop
    raise notice 'dropping policy %.% : %', r.schemaname, r.tablename, r.policyname;
    execute format('drop policy %I on %I.%I', r.policyname, r.schemaname, r.tablename);
    dropped := dropped + 1;
  end loop;

  raise notice '% policies removed; the project''s own are recreated below.', dropped;
end
$$;

-- ---------------------------------------------------------------------------
-- 2. Rebuild the policies, over every kind of table
-- ---------------------------------------------------------------------------

-- `relkind in ('r','p')` this time: ordinary tables and partitioned tables.
-- Migration 100 covered only 'r'.
do $$
declare
  t text;
begin
  for t in
    select c.relname
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind in ('r', 'p')
      and c.relname not in ('staff', 'role_permissions')  -- handled explicitly
      and c.relname not like 'pg_%'
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);

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

-- The roster: readable by colleagues, writable only by an admin.
alter table public.staff enable row level security;
alter table public.staff force row level security;

create policy staff_self_or_roster on public.staff
  for select to authenticated
  using (id = (select auth.uid()) or public.is_active_staff());

create policy staff_admin_insert on public.staff
  for insert to authenticated with check (public.is_admin());

create policy staff_admin_update on public.staff
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy staff_admin_delete on public.staff
  for delete to authenticated using (public.is_admin());

-- Reference data, if migration 200 has run. Changing it is a migration.
do $$
begin
  if to_regclass('public.role_permissions') is not null then
    execute 'alter table public.role_permissions enable row level security';
    execute 'alter table public.role_permissions force row level security';
    execute 'create policy role_permissions_read on public.role_permissions
               for select to authenticated using (public.is_active_staff())';
  end if;
end
$$;

-- ---------------------------------------------------------------------------
-- 3. Views
-- ---------------------------------------------------------------------------

-- A view cannot carry row level security of its own. By default it executes
-- as its owner, so it reads the underlying tables with the owner's rights and
-- the caller's restrictions never apply — which is exactly how
-- `embedding_status_view` was handing out service user names.
--
-- `security_invoker` (PostgreSQL 15+) flips that: the view runs as whoever
-- queried it, so the policies rebuilt above do apply, and the view keeps
-- working unchanged for staff. Below 15 there is no such switch, so the only
-- safe move is to take the grant away and say so.
do $$
declare
  v record;
  modern boolean := current_setting('server_version_num')::int >= 150000;
begin
  for v in
    select c.relname
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'v'
  loop
    if modern then
      execute format('alter view public.%I set (security_invoker = true)', v.relname);
      execute format('revoke all on public.%I from anon', v.relname);
      execute format('grant select on public.%I to authenticated', v.relname);
      raise notice 'view %: now runs as the caller, so table policies apply', v.relname;
    else
      execute format('revoke all on public.%I from anon, authenticated', v.relname);
      raise notice 'view %: PostgreSQL < 15, access revoked instead', v.relname;
    end if;
  end loop;
end
$$;

-- A materialized view holds its own copy of the data, so no policy on the
-- source tables can reach it. There is no safe way to expose one to a role
-- that should not see everything in it.
do $$
declare
  m record;
begin
  for m in
    select c.relname
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'm'
  loop
    execute format('revoke all on public.%I from anon, authenticated', m.relname);
    raise notice 'materialized view %: access revoked (cannot hold policies)', m.relname;
  end loop;
end
$$;

-- ---------------------------------------------------------------------------
-- 4. Functions
-- ---------------------------------------------------------------------------

-- PostgreSQL grants EXECUTE to PUBLIC on every new function, so each of the
-- embedding and search helpers was callable by anyone holding an account.
-- Neither application calls any of them from the browser; the API reaches
-- them with the service role key, which is unaffected.
--
-- Everything is revoked, then only this project's four predicates are handed
-- back — they have to be callable because the policies above invoke them.
do $$
declare
  f record;
begin
  for f in
    select p.oid::regprocedure as sig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
  end loop;
end
$$;

do $$
declare
  fn text;
begin
  foreach fn in array array[
    'public.is_active_staff()',
    'public.can_write_records()',
    'public.is_admin()',
    'public.has_permission(text)'
  ] loop
    if to_regprocedure(fn) is not null then
      execute format('grant execute on function %s to authenticated', fn);
    end if;
  end loop;
end
$$;

-- ---------------------------------------------------------------------------
-- 5. Prove it — this time over every relkind, not just ordinary tables
-- ---------------------------------------------------------------------------

do $$
declare
  problem text;
  n_tables int;
  n_views int;
  n_policies int;
begin
  -- Tables without RLS.
  select string_agg(c.relname, ', ' order by c.relname) into problem
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind in ('r','p') and not c.relrowsecurity;
  if problem is not null then
    raise exception 'RLS still disabled on: %', problem;
  end if;

  -- Policies this project did not create.
  select string_agg(tablename || '.' || policyname, ', ') into problem
  from pg_policies
  where schemaname = 'public'
    and policyname not in (
      'staff_select','staff_insert','staff_update','staff_delete',
      'staff_self_or_roster','staff_admin_insert','staff_admin_update',
      'staff_admin_delete','role_permissions_read');
  if problem is not null then
    raise exception 'Unrecognised policies remain: %', problem;
  end if;

  -- Views still running as their owner.
  if current_setting('server_version_num')::int >= 150000 then
    select string_agg(c.relname, ', ') into problem
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'v'
      and coalesce(
            (select option_value from pg_options_to_table(c.reloptions)
              where option_name = 'security_invoker'), 'false') <> 'true';
    if problem is not null then
      raise exception 'Views still run as their owner: %', problem;
    end if;
  end if;

  -- Any grant at all to anon, over every relkind.
  select string_agg(distinct table_name, ', ') into problem
  from information_schema.role_table_grants
  where grantee = 'anon' and table_schema = 'public';
  if problem is not null then
    raise exception 'anon still holds grants on: %', problem;
  end if;

  select count(*) into n_tables from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relkind in ('r','p');
  select count(*) into n_views from pg_class c join pg_namespace n on n.oid=c.relnamespace
    where n.nspname='public' and c.relkind='v';
  select count(*) into n_policies from pg_policies where schemaname='public';

  raise notice 'Verified: % tables all with RLS, % views running as the caller, % policies, no anon grants.',
    n_tables, n_views, n_policies;
end
$$;

commit;
