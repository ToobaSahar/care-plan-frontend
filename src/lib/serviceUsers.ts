import { supabase } from './supabase';

/* ──────────────────────────────────────────────────────────────────────────
   Service user queries for the service users list.

   Paging and searching both happen in Postgres, not in the browser. With a
   client-side filter over a server-paged list, a search would only ever match
   the rows that happened to be on screen — which is worse than no search at
   all on a list an assessor is scanning for one person.
   ────────────────────────────────────────────────────────────────────────── */

export interface ServiceUserRow {
  id: string;
  full_name: string | null;
  created_at: string;
  /** Shown beside the name: two people can share one, but not these. */
  nhs_number?: string | null;
  date_of_birth?: string | null;
  postcode?: string | null;
}

export interface ServiceUserPage {
  rows: ServiceUserRow[];
  /** Total matching the current query, across all pages. */
  total: number;
}

export interface FetchServiceUsersParams {
  /** 1-indexed. */
  page: number;
  pageSize: number;
  /** Trimmed search term; empty means unfiltered. */
  query?: string;
  signal?: AbortSignal;
}

/** Postgres treats these as wildcards inside LIKE patterns. */
function escapeLikePattern(value: string): string {
  return value.replace(/([\\%_])/g, '\\$1');
}

export async function fetchServiceUsers({
  page,
  pageSize,
  query = '',
  signal,
}: FetchServiceUsersParams): Promise<ServiceUserPage> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // `count: 'exact'` returns the total for the filtered set, which is what the
  // pager needs; `head: false` keeps the rows in the same round trip.
  let request = supabase
    .from('service_users')
    .select('id, full_name, created_at, nhs_number, date_of_birth, postcode', { count: 'exact' })
    .order('created_at', { ascending: false })
    // created_at is not unique in this data, so without a tiebreaker the same
    // row can appear on two pages. id makes the ordering total.
    .order('id', { ascending: false })
    .range(from, to);

  const term = query.trim();
  if (term) {
    request = request.ilike('full_name', `%${escapeLikePattern(term)}%`);
  }

  if (signal) {
    request = request.abortSignal(signal);
  }

  const { data, error, count } = await request;

  if (error) throw error;

  return {
    rows: (data ?? []) as ServiceUserRow[],
    total: count ?? 0,
  };
}
