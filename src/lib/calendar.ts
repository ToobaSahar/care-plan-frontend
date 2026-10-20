/* ──────────────────────────────────────────────────────────────────────────
   Calendar arithmetic for DateField.

   Kept free of React and of Date-object mutation so the grid logic can be
   reasoned about and tested on its own. Values are ISO `YYYY-MM-DD` strings,
   matching what `<input type="date">` stores, so swapping the control changes
   nothing about what is persisted.

   Everything is computed in local time. Parsing an ISO date with `new Date()`
   treats it as UTC, which shifts the day backwards for anyone west of
   Greenwich — a date of birth is a calendar fact, not an instant.
   ────────────────────────────────────────────────────────────────────────── */

export interface CalendarDay {
  /** ISO `YYYY-MM-DD`. */
  iso: string;
  day: number;
  /** False for the leading/trailing days borrowed from adjacent months. */
  inMonth: boolean;
  isToday: boolean;
}

const ISO = /^(\d{4})-(\d{2})-(\d{2})$/;

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

/** UK weeks start on Monday. */
export const WEEKDAY_INITIALS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

export function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function toIso(year: number, monthIndex: number, day: number): string {
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
}

/** Parses an ISO date without timezone drift. Returns null when unparseable. */
export function parseIso(value: string | undefined | null): Date | null {
  if (!value) return null;
  const m = ISO.exec(value.trim());
  if (!m) return null;

  const [, y, mo, d] = m;
  const year = Number(y);
  const monthIndex = Number(mo) - 1;
  const day = Number(d);
  const date = new Date(year, monthIndex, day);

  // Rejects impossible dates that would otherwise roll over (e.g. 2025-02-31).
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== monthIndex ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function todayIso(): string {
  const now = new Date();
  return toIso(now.getFullYear(), now.getMonth(), now.getDate());
}

export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/** Clamps a day to the target month, so 31 Jan → 28 Feb rather than 3 Mar. */
export function shiftMonth(year: number, monthIndex: number, delta: number) {
  const total = year * 12 + monthIndex + delta;
  return { year: Math.floor(total / 12), monthIndex: ((total % 12) + 12) % 12 };
}

/**
 * Six weeks of days for a month grid, Monday-first.
 *
 * Always 42 cells so the panel does not change height between months, which
 * would make the calendar jump under the pointer.
 */
export function buildMonthGrid(year: number, monthIndex: number): CalendarDay[] {
  const today = todayIso();
  const firstWeekday = (new Date(year, monthIndex, 1).getDay() + 6) % 7; // Mon = 0
  const thisMonth = daysInMonth(year, monthIndex);

  const prev = shiftMonth(year, monthIndex, -1);
  const prevDays = daysInMonth(prev.year, prev.monthIndex);

  const cells: CalendarDay[] = [];

  for (let i = firstWeekday - 1; i >= 0; i--) {
    const day = prevDays - i;
    const iso = toIso(prev.year, prev.monthIndex, day);
    cells.push({ iso, day, inMonth: false, isToday: iso === today });
  }

  for (let day = 1; day <= thisMonth; day++) {
    const iso = toIso(year, monthIndex, day);
    cells.push({ iso, day, inMonth: true, isToday: iso === today });
  }

  const next = shiftMonth(year, monthIndex, 1);
  for (let day = 1; cells.length < 42; day++) {
    const iso = toIso(next.year, next.monthIndex, day);
    cells.push({ iso, day, inMonth: false, isToday: iso === today });
  }

  return cells;
}

/** `14 Oct 2026` — matches lib/format's date style. */
export function formatIsoForDisplay(value: string): string {
  const d = parseIso(value);
  if (!d) return value;
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

export function addDaysIso(iso: string, days: number): string {
  const d = parseIso(iso) ?? new Date();
  d.setDate(d.getDate() + days);
  return toIso(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isWithin(iso: string, min?: string, max?: string): boolean {
  if (min && iso < min) return false;
  if (max && iso > max) return false;
  return true;
}
