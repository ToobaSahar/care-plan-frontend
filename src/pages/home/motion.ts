import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';

/* ──────────────────────────────────────────────────────────────────────────
   Motion plumbing for the home page.

   Two rules hold everywhere here:

     · Content is visible by default. Hidden starting states are only applied
       once this code has run and confirmed the visitor has not asked for
       reduced motion, so a failed script or an old browser shows the page.
     · Scroll work happens in one animation frame per scroll, writes CSS custom
       properties directly, and re-renders React only when a coarse step
       changes. A scrubbed stage must not reconcile the tree sixty times a
       second.
   ────────────────────────────────────────────────────────────────────────── */

const REDUCED = '(prefers-reduced-motion: reduce)';

function matches(query: string): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query).matches
    : false;
}

/** A media query, kept current. */
export function useMediaQueryMatch(query: string): boolean {
  const [value, setValue] = useState(() => matches(query));

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia(query);
    const onChange = () => setValue(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return value;
}

export const usePrefersReducedMotion = () => useMediaQueryMatch(REDUCED);

/**
 * Plays every `[data-reveal]` inside `root` once, as it scrolls into view.
 *
 * One observer for the whole page rather than one per element. Nothing a
 * visitor needs to read is ever gated on this: every element it drives is
 * fully visible in its starting state, and the reveal only settles it into
 * place or draws a mark on it. The starting states live in CSS under
 * `.is-motion`, which is only added here.
 */
export function useRevealOnScroll(root: RefObject<HTMLElement>, enabled: boolean): void {
  // Before paint, so content already on screen is never shown, hidden, then shown.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el || !enabled || typeof IntersectionObserver === 'undefined') return;

    const pending = new Set(el.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (pending.size === 0) return;

    const reveal = (node: Element) => {
      node.classList.add('is-in');
      pending.delete(node as HTMLElement);
      io.unobserve(node);
    };

    el.classList.add('is-motion');

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
        if (pending.size === 0) stop();
      },
      /* Fires as the element's top passes about 88% of the way down the screen.
         Threshold 0, not a fraction: an element whose starting state has no
         visible area reports a ratio of 0 forever, so any fractional threshold
         would wait on a crossing that cannot happen. */
      { rootMargin: '0px 0px -12% 0px', threshold: 0 },
    );

    /* An observer only reports crossings it sees. A jump (End, a restored
       scroll position, a far anchor) can carry an element from below the
       screen to above it between two frames, and it would stay hidden. When
       scrolling pauses, anything at or above the reveal line is shown. */
    let idle = 0;
    const sweep = () => {
      idle = 0;
      const line = window.innerHeight * 0.88;
      for (const node of Array.from(pending)) {
        if (node.getBoundingClientRect().top < line) reveal(node);
      }
      if (pending.size === 0) stop();
    };
    const onScroll = () => {
      window.clearTimeout(idle);
      idle = window.setTimeout(sweep, 120);
    };
    const stop = () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(idle);
    };

    pending.forEach((node) => io.observe(node));
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      stop();
      io.disconnect();
      el.classList.remove('is-motion');
    };
  }, [root, enabled]);
}

/** Whether an element has entered the viewport yet. Latches on the first entry. */
export function useEnteredView<T extends Element>(ref: RefObject<T>, rootMargin = '0px 0px -15% 0px'): boolean {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || entered) return;
    if (typeof IntersectionObserver === 'undefined') {
      setEntered(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setEntered(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, entered]);

  return entered;
}

export type ProgressMode =
  /** 0 when the element's top meets the viewport top, 1 when its bottom meets the viewport bottom. For pinned stages. */
  | 'pinned'
  /** 0 when the element's top enters the bottom of the viewport, 1 when its bottom passes the middle. */
  | 'pass';

function progressOf(rect: DOMRect, viewport: number, mode: ProgressMode): number {
  if (mode === 'pinned') {
    const travel = rect.height - viewport;
    return travel <= 0 ? 0 : -rect.top / travel;
  }
  const start = viewport * 0.9;
  const end = viewport * 0.5 - rect.height;
  return (start - rect.top) / (start - end);
}

/**
 * Calls `onProgress` with the element's scroll progress, 0 to 1, at most once
 * per frame, and only while the element is near the viewport.
 *
 * The callback is read through a ref, so callers may pass an inline function
 * without re-subscribing on every render.
 */
export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T>,
  onProgress: (progress: number) => void,
  { mode = 'pinned', enabled = true }: { mode?: ProgressMode; enabled?: boolean } = {},
): void {
  const callback = useRef(onProgress);
  callback.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let frame = 0;
    let listening = false;

    const measure = () => {
      frame = 0;
      const p = progressOf(el.getBoundingClientRect(), window.innerHeight, mode);
      callback.current(Math.min(1, Math.max(0, p)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const listen = (on: boolean) => {
      if (on === listening) return;
      listening = on;
      if (on) {
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        schedule();
      } else {
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
      }
    };

    // Only pay for scroll handling while the element is within a screen of view.
    const io =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => listen(Boolean(entry?.isIntersecting)), {
            rootMargin: '100% 0px 100% 0px',
          });

    if (io) io.observe(el);
    else listen(true);
    measure();

    return () => {
      io?.disconnect();
      listen(false);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, mode, enabled]);
}
