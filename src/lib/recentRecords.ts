import { supabase } from './supabase';

/* ──────────────────────────────────────────────────────────────────────────
   People this colleague opened recently, on this device.

   Storage holds record ids only, per staff account: a shared tablet keeps
   nothing readable about a service user, and the next shift's account starts
   with its own list. Names live in memory for the session, filled for free
   when an assessment opens (it already has the name) and otherwise read in
   one bounded query — never more than RECENT_LIMIT rows, never the same ids
   twice at once, and never again once answered.
   ────────────────────────────────────────────────────────────────────────── */

/** How many people the rail lists, and so the most this module ever reads. */
export const RECENT_LIMIT = 3;

export interface RecentPerson {
  id: string;
  full_name: string | null;
  nhs_number: string | null;
}

const keyFor = (staffId: string) => `careframe.recent.${staffId}`;

/** Remembered ids, most recent first. Storage can be refused; that reads as empty. */
export function readRecent(staffId: string): string[] {
  try {
    const raw = window.localStorage.getItem(keyFor(staffId));
    const ids: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids)
      ? ids.filter((id): id is string => typeof id === 'string').slice(0, RECENT_LIMIT)
      : [];
  } catch {
    return [];
  }
}

export function rememberRecent(staffId: string, id: string): void {
  try {
    const next = [id, ...readRecent(staffId).filter((x) => x !== id)].slice(0, RECENT_LIMIT);
    window.localStorage.setItem(keyFor(staffId), JSON.stringify(next));
  } catch {
    /* A forgotten shortcut is not worth an error. */
  }
}

/* ── Session cache ─────────────────────────────────────────────────────────
   Per account, so one colleague's lookups never answer another's. `null`
   records "asked, and there is no such person" (deleted, or not readable),
   which stops a stale id from being re-queried on every page.            */

const cache = new Map<string, Map<string, RecentPerson | null>>();
const inflight = new Map<string, Promise<void>>();

function cacheFor(staffId: string): Map<string, RecentPerson | null> {
  let entries = cache.get(staffId);
  if (!entries) {
    entries = new Map();
    cache.set(staffId, entries);
  }
  return entries;
}

/** Records a person the caller already has in hand, so the rail needs no read. */
export function primeRecent(staffId: string, person: RecentPerson): void {
  cacheFor(staffId).set(person.id, person);
}

export interface ResolvedRecent {
  /** Known people, in recency order. */
  people: RecentPerson[];
  /** True while some ids have not been looked up yet. */
  pending: boolean;
}

/** What can be shown right now, from memory alone. Synchronous. */
export function resolveRecent(staffId: string, ids: string[]): ResolvedRecent {
  const entries = cacheFor(staffId);
  const people: RecentPerson[] = [];
  let pending = false;
  for (const id of ids) {
    if (!entries.has(id)) pending = true;
    const person = entries.get(id);
    if (person) people.push(person);
  }
  return { people, pending };
}

/** Looks up whichever of `ids` are not cached yet, in one query. */
export function loadRecent(staffId: string, ids: string[]): Promise<void> {
  const entries = cacheFor(staffId);
  const missing = ids.filter((id) => !entries.has(id));
  if (missing.length === 0) return Promise.resolve();

  // StrictMode mounts twice and two screens can mount the rail in quick
  // succession; identical requests share one round trip.
  const key = `${staffId}:${[...missing].sort().join(',')}`;
  const running = inflight.get(key);
  if (running) return running;

  const request = (async () => {
    try {
      const { data, error } = await supabase
        .from('service_users')
        .select('id, full_name, nhs_number')
        .in('id', missing);
      if (error) throw error;

      const found = new Map(((data ?? []) as RecentPerson[]).map((p) => [p.id, p]));
      for (const id of missing) entries.set(id, found.get(id) ?? null);
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, request);
  return request;
}
