import { useEffect, useMemo, useState } from 'react';
import { loadRecent, readRecent, resolveRecent, type ResolvedRecent } from '../lib/recentRecords';

const EMPTY: ResolvedRecent = { people: [], pending: false };

/**
 * The people this colleague opened last, for the workspace rail.
 *
 * Renders from memory on the first paint when it can — the usual case after
 * opening an assessment — and only reads what memory cannot answer. A failed
 * read leaves whatever is known on screen rather than an error in the rail.
 */
export function useRecentlyOpened(staffId: string | undefined): ResolvedRecent & { count: number } {
  // Read once per account: the list only changes on the assessment screen,
  // and the rail is remounted on the way back from it.
  const ids = useMemo(() => (staffId ? readRecent(staffId) : []), [staffId]);

  const [state, setState] = useState<ResolvedRecent>(() =>
    staffId ? resolveRecent(staffId, ids) : EMPTY,
  );

  useEffect(() => {
    if (!staffId) {
      setState(EMPTY);
      return;
    }

    const initial = resolveRecent(staffId, ids);
    setState(initial);
    if (!initial.pending) return;

    let live = true;
    loadRecent(staffId, ids)
      .then(() => {
        if (live) setState(resolveRecent(staffId, ids));
      })
      .catch((err: unknown) => {
        console.warn('Recently opened unavailable:', err);
        if (live) setState({ people: resolveRecent(staffId, ids).people, pending: false });
      });

    return () => {
      live = false;
    };
  }, [staffId, ids]);

  return { ...state, count: ids.length };
}
