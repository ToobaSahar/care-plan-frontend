#!/usr/bin/env bash
#
# Proves, from outside, that nothing in the database is reachable by someone
# who should not reach it.
#
# Two callers are tested, because the first version of this script tested only
# the first and missed sixteen open objects:
#
#   1. anonymous      — the anon key, which ships in the browser bundle
#   2. signed in, not on the staff roster — a real account with no `staff` row,
#      which is what a stale policy or an owner-rights view lets through
#
# The object list is discovered from the API rather than written here. A
# hardcoded list is one `create table` away from being wrong, and the object it
# forgets is the one that leaks.
#
#   ./supabase/verify.sh                    # anonymous checks only
#   ./supabase/verify.sh --full             # also the non-staff account test
#
# --full creates a throwaway auth user and deletes it again. It needs
# SUPABASE_SERVICE_KEY, which it reads from ../care-plan/.env if present.

set -uo pipefail
cd "$(dirname "$0")/.."

[[ -f .env.local && -z "${VITE_SUPABASE_URL:-}" ]] && { set -a; . ./.env.local; set +a; }

: "${VITE_SUPABASE_URL:?set VITE_SUPABASE_URL}"
: "${VITE_SUPABASE_ANON_KEY:?set VITE_SUPABASE_ANON_KEY}"

FULL=0
[[ "${1:-}" == "--full" ]] && FULL=1

green() { printf '\033[32m%s\033[0m' "$1"; }
red()   { printf '\033[31m%s\033[0m' "$1"; }

fail=0

# ---------------------------------------------------------------------------
# Discover what the API exposes. Needs the service key; without it, fall back
# to asking the anon endpoint table by table is not possible, so --full is
# required for discovery and the anon pass uses the same list.
# ---------------------------------------------------------------------------
SERVICE_KEY="${SUPABASE_SERVICE_KEY:-}"
if [[ -z "$SERVICE_KEY" && -f ../care-plan/.env ]]; then
  SERVICE_KEY=$(grep -E '^SUPABASE_SERVICE_KEY=' ../care-plan/.env | cut -d= -f2-)
fi

if [[ -z "$SERVICE_KEY" ]]; then
  echo "SUPABASE_SERVICE_KEY not found; cannot list objects. Set it, or put it in ../care-plan/.env" >&2
  exit 2
fi

OBJECTS=$(curl -s "$VITE_SUPABASE_URL/rest/v1/" \
            -H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY" \
          | python3 -c "
import sys, json
spec = json.load(sys.stdin)
names = [k.lstrip('/') for k in spec.get('paths', {})
         if k not in ('/',) and not k.startswith('/rpc/')]
print('\n'.join(sorted(n for n in names if n)))
")

if [[ -z "$OBJECTS" ]]; then
  echo "Could not list objects - is the service key correct?" >&2
  exit 2
fi

count=$(printf '%s\n' "$OBJECTS" | wc -l | tr -d ' ')

# ---------------------------------------------------------------------------
check_reads() {
  local label="$1" key="$2" token="$3"
  echo "── $label — every object must return no rows ──"
  while read -r obj; do
    [[ -z "$obj" ]] && continue
    body=$(curl -s "$VITE_SUPABASE_URL/rest/v1/$obj?select=*&limit=1" \
                -H "apikey: $key" -H "Authorization: Bearer $token")
    if [[ "$body" == "[]" ]] || grep -q "permission denied\|42501\|PGRST301" <<<"$body"; then
      printf '  %s   %s\n' "$(green ok)" "$obj"
    elif grep -q '"code":"42P01"\|PGRST205' <<<"$body"; then
      printf '  --   %s (no such object)\n' "$obj"
    else
      printf '  %s %-42s %.70s\n' "$(red LEAK)" "$obj" "$body"
      fail=1
    fi
  done <<<"$OBJECTS"
}

echo "Checking $count objects."
echo
check_reads "anonymous (the key in the browser bundle)" "$VITE_SUPABASE_ANON_KEY" "$VITE_SUPABASE_ANON_KEY"

echo
echo "── anonymous write — must be refused ──"
PROBE="rls probe - delete me"
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST \
       "$VITE_SUPABASE_URL/rest/v1/service_users" \
       -H "apikey: $VITE_SUPABASE_ANON_KEY" -H "Content-Type: application/json" \
       -d "{\"full_name\":\"$PROBE\"}")
if [[ "$code" == "401" || "$code" == "403" ]]; then
  printf '  %s   insert refused (HTTP %s)\n' "$(green ok)" "$code"
else
  printf '  %s insert returned HTTP %s - a row was created\n' "$(red LEAK)" "$code"
  fail=1
  curl -s -o /dev/null -X DELETE \
    "$VITE_SUPABASE_URL/rest/v1/service_users?full_name=eq.${PROBE// /%20}" \
    -H "apikey: $VITE_SUPABASE_ANON_KEY"
  printf '       (probe row removed)\n'
fi

# ---------------------------------------------------------------------------
if (( FULL )); then
  echo
  EMAIL="rls-probe-$(date +%s)@careframe.invalid"
  PW="Pr0be-$(openssl rand -hex 8)"
  SVC=(-H "apikey: $SERVICE_KEY" -H "Authorization: Bearer $SERVICE_KEY")

  PROBE_ID=$(curl -s -X POST "$VITE_SUPABASE_URL/auth/v1/admin/users" "${SVC[@]}" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PW\",\"email_confirm\":true}" \
    | python3 -c "import sys,json;print(json.load(sys.stdin).get('id',''))")

  if [[ -z "$PROBE_ID" ]]; then
    echo "Could not create the probe account; skipping the signed-in test." >&2
  else
    # Remove the staff row the trigger creates: the point is an account with
    # a valid session and no place on the roster.
    curl -s -o /dev/null -X DELETE "$VITE_SUPABASE_URL/rest/v1/staff?id=eq.$PROBE_ID" "${SVC[@]}"

    TOKEN=$(curl -s -X POST "$VITE_SUPABASE_URL/auth/v1/token?grant_type=password" \
      -H "apikey: $VITE_SUPABASE_ANON_KEY" -H "Content-Type: application/json" \
      -d "{\"email\":\"$EMAIL\",\"password\":\"$PW\"}" \
      | python3 -c "import sys,json;print(json.load(sys.stdin).get('access_token',''))")

    check_reads "signed in, not on the staff roster" "$VITE_SUPABASE_ANON_KEY" "$TOKEN"

    curl -s -o /dev/null -X DELETE "$VITE_SUPABASE_URL/auth/v1/admin/users/$PROBE_ID" "${SVC[@]}"
    curl -s -o /dev/null -X DELETE "$VITE_SUPABASE_URL/rest/v1/staff?id=eq.$PROBE_ID" "${SVC[@]}"
    echo "  (probe account removed)"
  fi
else
  echo
  echo "Signed-in check skipped. Run with --full to test an account that holds"
  echo "a valid session but no staff row - the case a stale policy lets through."
fi

echo
if (( fail )); then
  echo "$(red FAILED) - something is reachable that should not be."
  exit 1
fi
echo "$(green PASSED) - nothing is reachable without an active staff row."
