import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  MONTH_NAMES,
  WEEKDAY_INITIALS,
  addDaysIso,
  buildMonthGrid,
  formatIsoForDisplay,
  isWithin,
  parseIso,
  shiftMonth,
  toIso,
  todayIso,
} from '../../lib/calendar';
import { cn } from '../../lib/cn';

/* ──────────────────────────────────────────────────────────────────────────
   DateField — the product's only date control.

   The native `<input type="date">` renders a different widget in every
   browser and OS, and its month/year navigation is one step at a time, which
   is painful for a date of birth eighty years ago. This picker puts month and
   year on dropdowns in the header so any date is two clicks away.

   It mirrors SelectField deliberately: same portal-and-fixed positioning so
   the panel escapes the scrolling form, same flip-when-short-of-room, same
   focus restoration by a stable `data-` key for forms that remount on write.

   The value stays ISO `YYYY-MM-DD` — identical to what the native input
   stored — so nothing downstream changes.
   ────────────────────────────────────────────────────────────────────────── */

export interface DateFieldProps {
  /** ISO `YYYY-MM-DD`, or '' when unset. */
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  /** ISO bounds. Days outside are rendered unselectable. */
  min?: string;
  max?: string;
  /** Earliest year offered in the year dropdown. Defaults to 120 years ago. */
  fromYear?: number;
  /** Latest year offered. Defaults to 10 years ahead. */
  toYear?: number;
  id?: string;
  name?: string;
  'aria-describedby'?: string;
  'aria-label'?: string;
  className?: string;
}

interface PanelRect {
  left: number;
  top: number;
  flipped: boolean;
}

const PANEL_GAP = 6;
const PANEL_WIDTH = 300;
const PANEL_HEIGHT = 348;

export const DateField: React.FC<DateFieldProps> = ({
  value,
  onValueChange,
  onBlur,
  placeholder = 'Select a date',
  disabled = false,
  invalid = false,
  min,
  max,
  fromYear,
  toYear,
  id,
  name,
  className,
  ...aria
}) => {
  const generatedId = useId();
  const triggerId = id ?? generatedId;
  const panelId = `${triggerId}-calendar`;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<PanelRect | null>(null);

  const selected = parseIso(value);
  const today = todayIso();

  // The day the arrow keys move around. Starts at the selection, or today.
  const [cursor, setCursor] = useState<string>(value || today);

  const view = useMemo(() => {
    const d = parseIso(cursor) ?? new Date();
    return { year: d.getFullYear(), monthIndex: d.getMonth() };
  }, [cursor]);

  const years = useMemo(() => {
    const now = new Date().getFullYear();
    const start = fromYear ?? now - 120;
    const end = toYear ?? now + 10;
    const out: number[] = [];
    for (let y = end; y >= start; y--) out.push(y);
    return out;
  }, [fromYear, toYear]);

  const grid = useMemo(
    () => buildMonthGrid(view.year, view.monthIndex),
    [view.year, view.monthIndex],
  );

  /* ── Positioning ──────────────────────────────────────────────────────── */

  const measure = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const below = window.innerHeight - r.bottom - PANEL_GAP;
    const flipped = below < PANEL_HEIGHT && r.top - PANEL_GAP > below;
    const left = Math.max(8, Math.min(r.left, window.innerWidth - PANEL_WIDTH - 8));
    setRect({ left, top: flipped ? r.top - PANEL_GAP : r.bottom + PANEL_GAP, flipped });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    measure();
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
    };
  }, [open, measure]);

  /* ── Open / close ─────────────────────────────────────────────────────── */

  const restoreFocus = useCallback(() => {
    const key = name ?? triggerId;
    requestAnimationFrame(() => {
      const el = triggerRef.current?.isConnected
        ? triggerRef.current
        : document.querySelector<HTMLButtonElement>(`[data-datefield="${CSS.escape(key)}"]`);
      el?.focus();
    });
  }, [name, triggerId]);

  const close = useCallback(
    (returnFocus = true) => {
      setOpen(false);
      if (returnFocus) restoreFocus();
    },
    [restoreFocus],
  );

  const openPanel = useCallback(() => {
    if (disabled) return;
    setCursor(value || today);
    setOpen(true);
  }, [disabled, value, today]);

  const commit = useCallback(
    (iso: string) => {
      if (!isWithin(iso, min, max)) return;
      onValueChange(iso);
      onBlur?.(iso);
      close();
    },
    [onValueChange, onBlur, close, min, max],
  );

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
      onBlur?.(value);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [open, onBlur, value]);

  // Move DOM focus with the cursor so screen readers follow the arrow keys.
  useEffect(() => {
    if (!open) return;
    panelRef.current
      ?.querySelector<HTMLElement>(`[data-iso="${cursor}"]`)
      ?.focus({ preventScroll: true });
  }, [open, cursor]);

  /* ── Keyboard ─────────────────────────────────────────────────────────── */

  const onGridKeyDown = (e: React.KeyboardEvent) => {
    const step = (days: number) => {
      e.preventDefault();
      setCursor((c) => addDaysIso(c, days));
    };

    switch (e.key) {
      case 'ArrowLeft': step(-1); break;
      case 'ArrowRight': step(1); break;
      case 'ArrowUp': step(-7); break;
      case 'ArrowDown': step(7); break;
      case 'Home': step(-((parseIso(cursor)!.getDay() + 6) % 7)); break;
      case 'End': step(6 - ((parseIso(cursor)!.getDay() + 6) % 7)); break;
      case 'PageUp': {
        e.preventDefault();
        const d = parseIso(cursor)!;
        const { year, monthIndex } = shiftMonth(d.getFullYear(), d.getMonth(), e.shiftKey ? -12 : -1);
        setCursor(toIso(year, monthIndex, Math.min(d.getDate(), 28)));
        break;
      }
      case 'PageDown': {
        e.preventDefault();
        const d = parseIso(cursor)!;
        const { year, monthIndex } = shiftMonth(d.getFullYear(), d.getMonth(), e.shiftKey ? 12 : 1);
        setCursor(toIso(year, monthIndex, Math.min(d.getDate(), 28)));
        break;
      }
      case 'Enter':
      case ' ':
        e.preventDefault();
        commit(cursor);
        break;
      case 'Escape':
        e.preventDefault();
        close();
        break;
      default:
        break;
    }
  };

  const goMonth = (delta: number) => {
    const { year, monthIndex } = shiftMonth(view.year, view.monthIndex, delta);
    const d = parseIso(cursor)!;
    setCursor(toIso(year, monthIndex, Math.min(d.getDate(), 28)));
  };

  /* ── Render ───────────────────────────────────────────────────────────── */

  const headerSelect =
    'rounded border border-oat-300 bg-white px-2 py-1 text-base text-oat-900 ' +
    'focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/30';

  const panel =
    open && rect
      ? createPortal(
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="false"
            aria-label="Choose a date"
            style={{
              position: 'fixed',
              left: rect.left,
              top: rect.flipped ? undefined : rect.top,
              bottom: rect.flipped ? window.innerHeight - rect.top : undefined,
              width: PANEL_WIDTH,
              zIndex: 60,
            }}
            className="cf-arrive rounded-lg border border-oat-200 bg-white p-3 shadow-lg"
          >
            {/* Month and year as dropdowns — the reason this control exists. */}
            <div className="mb-2.5 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => goMonth(-1)}
                aria-label="Previous month"
                className="rounded p-1.5 text-oat-600 hover:bg-oat-100 hover:text-oat-900"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>

              <select
                aria-label="Month"
                value={view.monthIndex}
                onChange={(e) => {
                  const d = parseIso(cursor)!;
                  setCursor(toIso(view.year, Number(e.target.value), Math.min(d.getDate(), 28)));
                }}
                className={cn(headerSelect, 'flex-1')}
              >
                {MONTH_NAMES.map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>

              <select
                aria-label="Year"
                value={view.year}
                onChange={(e) => {
                  const d = parseIso(cursor)!;
                  setCursor(toIso(Number(e.target.value), view.monthIndex, Math.min(d.getDate(), 28)));
                }}
                className={cn(headerSelect, 'w-[5.25rem]')}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => goMonth(1)}
                aria-label="Next month"
                className="rounded p-1.5 text-oat-600 hover:bg-oat-100 hover:text-oat-900"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-0.5" role="row">
              {WEEKDAY_INITIALS.map((d, i) => (
                <abbr
                  key={i}
                  title={['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][i]}
                  className="py-1 text-center text-2xs font-semibold uppercase text-oat-500 no-underline"
                >
                  {d}
                </abbr>
              ))}
            </div>

            <div className="mt-0.5 grid grid-cols-7 gap-0.5" role="grid" onKeyDown={onGridKeyDown}>
              {grid.map((cell) => {
                const isSelected = cell.iso === value;
                const isCursor = cell.iso === cursor;
                const allowed = isWithin(cell.iso, min, max);
                return (
                  <button
                    key={cell.iso}
                    type="button"
                    role="gridcell"
                    data-iso={cell.iso}
                    tabIndex={isCursor ? 0 : -1}
                    aria-selected={isSelected}
                    aria-current={cell.isToday ? 'date' : undefined}
                    disabled={!allowed}
                    onClick={() => commit(cell.iso)}
                    className={cn(
                      'h-8 rounded text-base tabular-nums transition-colors duration-fast',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600',
                      !allowed && 'cursor-not-allowed text-oat-300',
                      allowed && !cell.inMonth && 'text-oat-400 hover:bg-oat-100',
                      allowed && cell.inMonth && 'text-oat-900 hover:bg-teal-50',
                      cell.isToday && !isSelected && 'font-semibold text-teal-700 ring-1 ring-inset ring-teal-300',
                      isSelected && 'bg-teal-600 font-semibold text-white hover:bg-teal-700',
                    )}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>

            <div className="mt-2.5 flex items-center justify-between border-t border-oat-200 pt-2.5">
              <button
                type="button"
                onClick={() => commit(today)}
                disabled={!isWithin(today, min, max)}
                className="rounded px-2 py-1 text-xs font-medium text-teal-700 hover:bg-teal-50 disabled:cursor-not-allowed disabled:text-oat-400"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => { onValueChange(''); onBlur?.(''); close(); }}
                className="rounded px-2 py-1 text-xs font-medium text-oat-600 hover:bg-oat-100"
              >
                Clear
              </button>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {name && <input type="hidden" name={name} value={value} />}

      <button
        ref={triggerRef}
        id={triggerId}
        data-datefield={name ?? triggerId}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        onClick={() => (open ? close() : openPanel())}
        onKeyDown={(e) => {
          if (!open && ['ArrowDown', 'Enter', ' '].includes(e.key)) {
            e.preventDefault();
            openPanel();
          }
        }}
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
        <span className="truncate">{selected ? formatIsoForDisplay(value) : placeholder}</span>
        <CalendarDays
          className={cn('h-4 w-4 flex-none', open ? 'text-teal-600' : 'text-oat-500')}
          aria-hidden="true"
        />
      </button>

      {panel}
    </>
  );
};
