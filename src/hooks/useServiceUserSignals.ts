import { useEffect, useRef, useState } from 'react';
import {
  fetchSectionProgress,
  getServiceUsersOverview,
  type ServiceUsersOverview,
} from '../lib/serviceUserSignals';

/* ──────────────────────────────────────────────────────────────────────────
   Signals for the service users list: an overview read once, and per-person progress
   read for whichever page is on screen.

   Both are enhancements over the list, never preconditions for it. A failure
   is logged and leaves the corresponding state `unavailable`, so the page
   shows a dash rather than an error over the people it did load.
   ────────────────────────────────────────────────────────────────────────── */

export type SignalState<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'unavailable' };

/** The overview across all service users, read through the short-lived shared cache. */
export function useServiceUsersOverview(): SignalState<ServiceUsersOverview> {
  const [overview, setOverview] = useState<SignalState<ServiceUsersOverview>>({ status: 'loading' });

  useEffect(() => {
    let live = true;
    getServiceUsersOverview()
      .then((data) => live && setOverview({ status: 'ready', data }))
      .catch((err: unknown) => {
        console.warn('Service users overview unavailable:', err);
        if (live) setOverview({ status: 'unavailable' });
      });
    return () => {
      live = false;
    };
  }, []);

  return overview;
}

export function useServiceUserSignals(visibleIds: string[]) {
  const overview = useServiceUsersOverview();
  const [progress, setProgress] = useState<SignalState<Map<string, number>>>({
    status: 'loading',
  });
  const requestId = useRef(0);

  // A stable key, so a re-render with the same rows does not re-query.
  const idsKey = visibleIds.join(',');

  useEffect(() => {
    const ids = idsKey ? idsKey.split(',') : [];
    const id = ++requestId.current;
    setProgress((prev) => (prev.status === 'ready' ? prev : { status: 'loading' }));

    fetchSectionProgress(ids)
      .then((data) => {
        if (id === requestId.current) setProgress({ status: 'ready', data });
      })
      .catch((err: unknown) => {
        console.warn('Section progress unavailable:', err);
        if (id === requestId.current) setProgress({ status: 'unavailable' });
      });
  }, [idsKey]);

  return { overview, progress };
}
