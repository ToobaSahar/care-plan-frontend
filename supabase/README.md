# Database security

Until the migration in `migrations/` is applied, every table in this project
is readable **and writable** by anyone who opens the site, because the anon
key ships in the browser bundle and row level security is off. Verified on
2026-10-21: an anonymous request returned service users with NHS numbers and
postcodes, and an anonymous POST successfully created a row.

Applying the migration is therefore the first step of any deployment, not a
follow-up task.

## Apply it

Apply them in order. `000100` establishes the roster and row level security,
`000200` adds staff management and the permission matrix, and `000300` closes
two gaps the first one left:

| | |
|---|---|
| `20261021000100_staff_and_rls.sql` | `staff` table, RLS, policies, anon revoked |
| `20261021000200_staff_management.sql` | roles from metadata, last-admin guard, permission matrix |
| `20261021000300_close_views_and_stale_policies.sql` | **required** — see below |

### Why 000300 exists

`000100` dropped only the four policies it was about to create, so any
permissive policy that already existed survived — and policies are OR'd. On
this project, fifteen tables including every `*_care_plan` table still
returned rows to anyone holding a valid account. Its loop and its assertion
also both filtered on `relkind = 'r'`, so views were neither protected nor
counted, and `embedding_status_view` was handing out service user names.

Anonymous callers were never affected: `000100` removed the `anon` role's
grants, and grants are checked before policies. The gap was in who gets
through once they hold *any* account.

`000300` drops every policy in `public` and rebuilds only the ones this
project defines, naming each one it removes; sets `security_invoker` on views
so they run as the caller; and revokes EXECUTE on the helper functions, which
PostgreSQL grants to PUBLIC by default.

## Apply them

With the Supabase CLI (preferred — the migrations stay in version control and
the same files are applied to every environment):

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

Or paste `migrations/20261021000100_staff_and_rls.sql` into
**Supabase Studio → SQL Editor** and run it.

The migration is idempotent and ends by checking its own work: if it would
leave any table unprotected, or any grant with the `anon` role, it raises and
the whole transaction rolls back. A successful run prints:

```
NOTICE: RLS verified: every table in public is protected and anon holds no grants.
```

## Then turn off public signup

Studio → **Authentication → Providers → Email**, and disable
**Allow new users to sign up**.

Without this, anyone can register an account against the project. They would
still reach no data — the migration requires an *active row in
`public.staff`*, not merely an account — but there is no reason to let
strangers create accounts in a system that holds care records.

## Create the first administrator

1. Studio → **Authentication → Users → Add user**, with
   *Auto Confirm User* ticked.
2. The `on_auth_user_created_make_staff` trigger creates the matching
   `staff` row as `assessor`. Promote it:

```sql
update public.staff
   set role = 'admin', full_name = 'Your Name'
 where email = 'you@yourcareagency.co.uk';
```

Every later colleague is added the same way and needs no SQL — the trigger
gives them an active `assessor` row.

## Roles

| Role | Reads records | Writes records | Manages staff |
|------|---------------|----------------|---------------|
| `admin` | yes | yes | yes |
| `assessor` | yes | yes | no |
| `viewer` | yes | no | no |

`assessor` is the default because it is exactly what every user could do
before this migration, so enabling RLS changes nobody's day-to-day.

## Removing someone's access

```sql
update public.staff set is_active = false where email = '...';
```

Prefer this to deleting the account: it takes effect on their next request in
both the app and the API, and it keeps `created_by` on their past entries
resolvable, which deleting would not.

## Checking it from outside

```bash
./supabase/verify.sh --full
```

It discovers every object from the API rather than working off a list — the
first version of this script used a hardcoded list and missed sixteen open
objects — and tests two callers:

1. **anonymous**, using the key that ships in the browser bundle
2. **signed in, not on the staff roster** — a throwaway account it creates and
   deletes again. This is the caller a stale policy or an owner-rights view
   lets through, and the reason `000300` was needed.

`--full` needs the service role key; it reads it from `../care-plan/.env` if
it is not in the environment. Without `--full` only the anonymous pass runs,
which on this project passed while sixteen objects were still open.
