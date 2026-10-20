/**
 * Identifier generation.
 *
 * Assessments are addressed by UUID in the URL, so a new one needs an id
 * before it has a row. Minting it client-side keeps the new-assessment route
 * addressable from the first paint: it can be refreshed, bookmarked and shared
 * immediately, instead of existing only in memory until the first save.
 */

/**
 * An RFC 4122 version 4 UUID from a cryptographic source.
 *
 * Prefers `crypto.randomUUID`, falling back to `crypto.getRandomValues` for
 * older browsers and non-secure contexts where `randomUUID` is unavailable.
 * Both paths are CSPRNG-backed — `Math.random` is never used, because these
 * ids address clinical records and must not be guessable or collide.
 */
export function newUuid(): string {
  const cryptoObj = globalThis.crypto;

  if (typeof cryptoObj?.randomUUID === 'function') {
    return cryptoObj.randomUUID();
  }

  if (typeof cryptoObj?.getRandomValues !== 'function') {
    throw new Error('Secure random source unavailable; cannot mint an assessment id.');
  }

  const bytes = new Uint8Array(16);
  cryptoObj.getRandomValues(bytes);

  // Version 4, variant RFC 4122.
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-');
}
