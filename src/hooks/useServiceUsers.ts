import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchServiceUsers,
  type ServiceUserRow,
} from '../lib/serviceUsers';

/* ──────────────────────────────────────────────────────────────────────────
   Service users list data.

   Owns paging, searching and the request lifecycle so the page stays
   presentational. Three things here are not optional on a list that is typed
   into:

   · Debounce, so a search is one request rather than one per keystroke.
   · Abort plus a sequence guard, so a slow early response cannot overwrite a
     fast later one and leave the list showing results for a query the user
     has already changed.
   · Clamping, so deleting rows cannot strand the view on a page past the end.
   ────────────────────────────────────────────────────────────────────────── */

const SEARCH_DEBOUNCE_MS = 300;

export interface UseServiceUsersOptions {
  pageSize?: number;
}

export interface UseServiceUsersResult {
  rows: ServiceUserRow[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  /** True only for the first load, so later pages do not blank the list. */
  isInitialLoading: boolean;
  /** True whenever a request is in flight, including page changes. */
  isFetching: boolean;
  error: string | null;
  query: string;
  setQuery: (value: string) => void;
  setPage: (page: number) => void;
  retry: () => void;
}

export function useServiceUsers({
  pageSize = 12,
}: UseServiceUsersOptions = {}): UseServiceUsersResult {
  const [rows, setRows] = useState<ServiceUserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPageState] = useState(1);
  const [query, setQueryState] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const requestId = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  // Debounce the term, and send the user back to page 1 whenever it changes —
  // page 4 of the previous query is meaningless for a new one.
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery((prev) => {
        if (prev !== query) setPageState(1);
        return query;
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const id = ++requestId.current;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsFetching(true);
    setError(null);

    fetchServiceUsers({ page, pageSize, query: debouncedQuery, signal: controller.signal })
      .then((result) => {
        // A superseded request must not write; its data is already stale.
        if (id !== requestId.current) return;
        setRows(result.rows);
        setTotal(result.total);
        setHasLoadedOnce(true);
      })
      .catch((err: unknown) => {
        if (id !== requestId.current) return;
        if (controller.signal.aborted) return;
        console.error('Error fetching service users:', err);
        setError(err instanceof Error ? err.message : 'Service users could not be loaded.');
      })
      .finally(() => {
        if (id !== requestId.current) return;
        setIsFetching(false);
      });

    return () => controller.abort();
  }, [page, pageSize, debouncedQuery, reloadToken]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize],
  );

  // If the result set shrank beneath the current page, step back into range.
  useEffect(() => {
    if (!isFetching && page > pageCount) setPageState(pageCount);
  }, [isFetching, page, pageCount]);

  const setPage = useCallback(
    (next: number) => {
      setPageState((current) => {
        const clamped = Math.min(Math.max(1, next), Math.max(1, pageCount));
        return clamped === current ? current : clamped;
      });
    },
    [pageCount],
  );

  const setQuery = useCallback((value: string) => setQueryState(value), []);
  const retry = useCallback(() => setReloadToken((n) => n + 1), []);

  return {
    rows,
    total,
    page,
    pageCount,
    pageSize,
    isInitialLoading: isFetching && !hasLoadedOnce,
    isFetching,
    error,
    query,
    setQuery,
    setPage,
    retry,
  };
}
