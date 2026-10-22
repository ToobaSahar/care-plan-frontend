import React, { cloneElement, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type TriggerProps = {
  onPointerEnter?: React.PointerEventHandler<HTMLElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLElement>;
  onFocus?: React.FocusEventHandler<HTMLElement>;
  onBlur?: React.FocusEventHandler<HTMLElement>;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

export interface TooltipProps {
  /**
   * Shown to the right of the trigger. Visual only: the trigger must carry its
   * own accessible name, because a tooltip is not announced reliably.
   */
  label: string;
  /** One element that accepts pointer, focus and click handlers. */
  children: React.ReactElement<TriggerProps>;
}

/** Keyboard focus shows the tooltip; a tap or click that focuses does not. */
function isKeyboardFocus(el: Element): boolean {
  try {
    return el.matches(':focus-visible');
  } catch {
    // Browsers without :focus-visible throw on the selector. Showing is the
    // safer failure: a keyboard user would otherwise get nothing.
    return true;
  }
}

/**
 * Names an icon-only control on hover and keyboard focus.
 *
 * Positioned against the viewport and portalled to <body>, so a scrolling
 * rail cannot clip it. Touch never opens it — a tap is an action, not a
 * question — and it closes on scroll, resize, click and Escape so it is never
 * left floating over the wrong control.
 */
export const Tooltip: React.FC<TooltipProps> = ({ label, children }) => {
  const [anchor, setAnchor] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!anchor) return;

    const hide = () => setAnchor(null);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide();
    };

    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('scroll', hide, true);
      window.removeEventListener('resize', hide);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [anchor]);

  const { props } = children;

  const trigger = cloneElement(children, {
    onPointerEnter: (e: React.PointerEvent<HTMLElement>) => {
      props.onPointerEnter?.(e);
      if (e.pointerType === 'mouse') setAnchor(e.currentTarget.getBoundingClientRect());
    },
    onPointerLeave: (e: React.PointerEvent<HTMLElement>) => {
      props.onPointerLeave?.(e);
      setAnchor(null);
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      props.onFocus?.(e);
      if (isKeyboardFocus(e.currentTarget)) setAnchor(e.currentTarget.getBoundingClientRect());
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      props.onBlur?.(e);
      setAnchor(null);
    },
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      props.onClick?.(e);
      setAnchor(null);
    },
  });

  return (
    <>
      {trigger}
      {anchor &&
        createPortal(
          <span
            aria-hidden="true"
            className="pointer-events-none fixed z-[60] -translate-y-1/2 whitespace-nowrap rounded-md border border-oat-200 bg-white px-2.5 py-1.5 text-xs font-medium text-teal-900 shadow-lg"
            style={{ top: anchor.top + anchor.height / 2, left: anchor.right + 10 }}
          >
            {label}
          </span>,
          document.body,
        )}
    </>
  );
};
