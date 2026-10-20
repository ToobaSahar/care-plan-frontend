/**
 * One set of display formats for the whole product.
 *
 * Three date formats were shipping across the three surfaces (`1945-01-12`,
 * `31/07/2025 15:52`, `1 Oct 2025`). On a record that is read by clinicians and
 * printed into an admission pack, an ambiguous date is a safety problem before
 * it is a style one.
 *
 * UK locale throughout: this is a UK social-care product.
 */

const LOCALE = 'en-GB';

function parse(value: unknown): Date | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** `12 Jan 1945` — the product's standard date. */
export function formatDate(value: unknown, fallback = '—'): string {
  const d = parse(value);
  if (!d) return typeof value === 'string' && value.trim() ? value : fallback;
  return d.toLocaleDateString(LOCALE, { day: 'numeric', month: 'short', year: 'numeric' });
}

/** `12 Jan 1945, 15:52` — only where the time genuinely matters. */
export function formatDateTime(value: unknown, fallback = '—'): string {
  const d = parse(value);
  if (!d) return fallback;
  return `${formatDate(d)}, ${d.toLocaleTimeString(LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

/** Whole years, or null when the date is missing or implausible. */
export function ageFrom(dateOfBirth: unknown): number | null {
  const dob = parse(dateOfBirth);
  if (!dob) return null;
  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) years--;
  return years >= 0 && years < 130 ? years : null;
}

/** `07814 334901` — UK mobile and landline grouping, left alone if unrecognised. */
export function formatPhone(value: unknown, fallback = '—'): string {
  const raw = String(value ?? '').replace(/[^\d+]/g, '');
  if (!raw) return fallback;

  const national = raw.startsWith('+44') ? `0${raw.slice(3)}` : raw;
  const digits = national.replace(/\D/g, '');

  // Mobiles are 11 digits starting 07; some records drop the leading zero.
  if (digits.length === 10 && digits.startsWith('7')) return `0${digits.slice(0, 4)} ${digits.slice(4)}`;
  if (digits.length === 11 && digits.startsWith('07')) return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  if (digits.length === 11) return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;

  return String(value);
}

/** `485 777 3291` — NHS numbers are always read in 3-3-4. */
export function formatNhsNumber(value: unknown, fallback = '—'): string {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (digits.length !== 10) return String(value ?? '') || fallback;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}
