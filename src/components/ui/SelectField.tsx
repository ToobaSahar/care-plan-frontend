import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

/* ──────────────────────────────────────────────────────────────────────────
   SelectField — the product's only dropdown.

   A native <select> renders its popup with the operating system, so it cannot
   be styled: the same field shipped a dark macOS menu on a laptop and a wheel
   on iOS, in the middle of an otherwise designed form. This is a real listbox
   that looks the same everywhere.

   What makes it safe to use in a clinical form rather than a liability:

   · Full ARIA combobox/listbox semantics, so screen readers announce it as a
     dropdown rather than as a button that does something unexplained.
   · Complete keyboard model — Up/Down/Home/End to move, Enter/Space to choose,
     Escape to dismiss, Tab to leave, plus type-ahead, because assessors work
     through long forms by keyboard.
   · The panel renders in a portal with fixed positioning, so it escapes the
     scrolling form and the `overflow-hidden` work surface instead of being
     clipped by them, and it flips above the trigger when there is no room
     below.
   · Focus returns to the trigger on close, so tab order is never lost.
   ────────────────────────────────────────────────────────────────────────── */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  /** Shown when nothing is selected, and offered as the "clear" row. */
  placeholder?: string;
  /** Fired when focus leaves the control entirely. Mirrors a native onBlur. */
  onBlur?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  id?: string;
  name?: string;
  'aria-describedby'?: string;
  'aria-label'?: string;
  className?: string;
}

interface PanelRect {
  left: number;
  top: number;
  width: number;
  /** Panel is above the trigger when there is not enough room below. */
  flipped: boolean;
  maxHeight: number;
}

const PANEL_GAP = 6;
const PANEL_MAX = 288;

export const SelectField: React.FC<SelectFieldProps> = ({
  value,
  onValueChange,
  options,
  placeholder = 'Select…',
  onBlur,
  disabled = false,
  invalid = false,
  id,
  name,
  className,
  ...aria
}) => {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const listboxId = `${triggerId}-listbox`;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  const typeAhead = useRef({ query: '', at: 0 });

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [rect, setRect] = useState<PanelRect | null>(null);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  /* ── Positioning ──────────────────────────────────────────────────────── */

  const measure = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const below = window.innerHeight - r.bottom - PANEL_GAP;
    const above = r.top - PANEL_GAP;
    const flipped = below < Math.min(PANEL_MAX, 160) && above > below;
    const maxHeight = Math.max(120, Math.min(PANEL_MAX, flipped ? above : below));

    setRect({
      left: r.left,
      top: flipped ? r.top - PANEL_GAP : r.bottom + PANEL_GAP,
      width: r.width,
      flipped,
      maxHeight,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    measure();

    // `capture` so this also fires for scrolls inside the form column, not
    // only the window — otherwise the panel detaches from its trigger.
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
    };
  }, [open, measure]);

  /* ── Open / close ─────────────────────────────────────────────────────── */

  /**
   * Returns focus to the trigger after the panel closes.
   *
   * Committing a value can cause the surrounding form section to re-render and
   * remount, which destroys this button and makes the captured ref stale — so
   * focus would land on <body> and Tab order would restart at the top of the
   * page. Re-querying by the stable `data-select` key on the next frame finds
   * whichever element now represents this field.
   */
  const restoreFocus = useCallback(() => {
    const key = name ?? triggerId;
    requestAnimationFrame(() => {
      const el = triggerRef.current?.isConnected
        ? triggerRef.current
        : document.querySelector<HTMLButtonElement>(`[data-select="${CSS.escape(key)}"]`);
      el?.focus();
    });
  }, [name, triggerId]);

  const close = useCallback(
    (returnFocus = true) => {
      setOpen(false);
      setActiveIndex(-1);
      if (returnFocus) restoreFocus();
    },
    [restoreFocus],
  );

  const openPanel = useCallback(() => {
    if (disabled) return;
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }, [disabled, selectedIndex]);

  const commit = useCallback(
    (next: string) => {
      onValueChange(next);
      onBlur?.(next);
      close();
    },
    [onValueChange, onBlur, close],
  );

  // Dismiss on an outside pointer press. `pointerdown` rather than `click` so
  // the panel closes before the underlying control takes the press.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
      setActiveIndex(-1);
      onBlur?.(value);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [open, onBlur, value]);

  // Keep the active option in view while arrowing through a long list.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    panelRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  /* ── Keyboard ─────────────────────────────────────────────────────────── */

  const step = (from: number, delta: number) => {
    const n = options.length;
    if (n === 0) return -1;
    let i = from;
    for (let guard = 0; guard < n; guard++) {
      i = (i + delta + n) % n;
      if (!options[i].disabled) return i;
    }
    return from;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        openPanel();
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'Tab':
        setOpen(false);
        setActiveIndex(-1);
        onBlur?.(value);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((i) => step(i < 0 ? -1 : i, 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((i) => step(i < 0 ? 0 : i, -1));
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(step(-1, 1));
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(step(0, -1));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeIndex >= 0 && !options[activeIndex]?.disabled) {
          commit(options[activeIndex].value);
        }
        break;
      default: {
        if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return;
        const now = Date.now();
        const t = typeAhead.current;
        t.query = now - t.at > 600 ? e.key : t.query + e.key;
        t.at = now;
        const match = options.findIndex(
          (o) => !o.disabled && o.label.toLowerCase().startsWith(t.query.toLowerCase()),
        );
        if (match >= 0) setActiveIndex(match);
        break;
      }
    }
  };

  /* ── Render ───────────────────────────────────────────────────────────── */

  const panel =
    open && rect
      ? createPortal(
          <ul
            ref={panelRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={triggerId}
            tabIndex={-1}
            style={{
              position: 'fixed',
              left: rect.left,
              top: rect.flipped ? undefined : rect.top,
              bottom: rect.flipped ? window.innerHeight - rect.top : undefined,
              width: rect.width,
              maxHeight: rect.maxHeight,
              zIndex: 60,
            }}
            className="cf-arrive overflow-y-auto overscroll-contain rounded-lg border border-oat-200 bg-white py-1 shadow-lg"
          >
            {placeholder && (
              <li
                role="option"
                aria-selected={value === ''}
                data-index={-1}
                onClick={() => commit('')}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-base text-oat-500 hover:bg-oat-100"
              >
                <span className="h-4 w-4 flex-none" aria-hidden="true" />
                {placeholder}
              </li>
            )}

            {options.map((option, i) => {
              const isSelected = option.value === value;
              const isActive = i === activeIndex;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  data-index={i}
                  onMouseEnter={() => !option.disabled && setActiveIndex(i)}
                  onClick={() => !option.disabled && commit(option.value)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-base',
                    option.disabled
                      ? 'cursor-not-allowed text-oat-400'
                      : 'cursor-pointer text-oat-900',
                    isActive && !option.disabled && 'bg-teal-50',
                    isSelected && 'font-medium text-teal-800',
                  )}
                >
                  <span className="flex h-4 w-4 flex-none items-center justify-center" aria-hidden="true">
                    {isSelected && <Check className="h-4 w-4 text-teal-600" strokeWidth={2.5} />}
                  </span>
                  {option.label}
                </li>
              );
            })}
          </ul>,
          document.body,
        )
      : null;

  return (
    <>
      {/* Carries the value for any surrounding native form submission. */}
      {name && <input type="hidden" name={name} value={value} />}

      <button
        ref={triggerRef}
        id={triggerId}
        data-select={name ?? triggerId}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-haspopup="listbox"
        aria-invalid={invalid || undefined}
        disabled={disabled}
        onClick={() => (open ? close() : openPanel())}
        onKeyDown={onKeyDown}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-md border bg-white px-3.5 py-2.5 text-left text-md shadow-[0_1px_0_rgb(31_28_24/0.02)] transition-[border-color,box-shadow] duration-fast ease-out',
          'focus:border-teal-600 focus:shadow-focus focus:outline-none',
          'disabled:cursor-not-allowed disabled:bg-oat-100 disabled:text-oat-500',
          invalid ? 'border-red-700' : 'border-oat-300 hover:border-oat-400',
          open && 'border-teal-600 shadow-focus',
          selected ? 'text-oat-900' : 'text-oat-500',
          className,
        )}
        {...aria}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 flex-none text-oat-500 transition-transform duration-fast ease-out',
            open && 'rotate-180 text-teal-600',
          )}
          aria-hidden="true"
        />
      </button>

      {panel}
    </>
  );
};

/** The yes/no pair the risk fields use, so the strings are declared once. */
export const YES_NO_OPTIONS: SelectOption[] = [
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes' },
];
