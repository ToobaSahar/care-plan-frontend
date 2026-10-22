import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/cn';
import { RailToggle } from './RailFrame';

export interface RailDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name of the dialog. */
  label: string;
  id?: string;
  children: React.ReactNode;
}

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * The section rail, opened over the content where it cannot sit beside it.
 *
 * Navigation only — the evidence column never goes in here; it reflows inline
 * instead. While open, focus moves in and is held, Escape or a tap on the
 * scrim closes it, the page behind stops scrolling, and focus goes back to
 * whatever opened it. It stays mounted so it can slide out as well as in;
 * `invisible` takes it out of the tab order and the accessibility tree once
 * the slide has finished.
 */
export const RailDrawer: React.FC<RailDrawerProps> = ({ open, onClose, label, id, children }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  // Held in a ref so a parent passing a fresh callback each render does not
  // re-run the open effect and bounce focus.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panel.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (!panel.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      root.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    // Visibility transitions only on the way out, so opening is immediate —
    // focus can move in on the same frame — and closing waits for the slide.
    <div
      className={cn(
        'fixed inset-0 z-40',
        open ? 'visible' : 'invisible transition-[visibility] duration-slow',
      )}
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-oat-950/30 transition-opacity duration-slow ease-out',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        ref={panelRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={cn(
          'absolute inset-y-0 left-0 w-[min(85vw,248px)] bg-oat-100 shadow-xl',
          'transition-transform duration-slow ease-out',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* The same edge handle the docked sidebar carries, at the same
            height, pointing back. First in order, so focus lands on it. */}
        <RailToggle
          direction="collapse"
          onClick={onClose}
          expanded={open}
          controls={id}
          label="Close sidebar"
        />
        {children}
      </div>
    </div>
  );
};
