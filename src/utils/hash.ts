/**
 * Deterministic 64-character hex pseudo-hash (sync).
 * Used for PoW, nonce, and blockchain chain simulations where
 * performance matters more than cryptographic accuracy.
 */
export function hashStr(input: string): string {
  let a = 0xdeadbeef | 0, b = 0x41c6ce57 | 0;
  let c = 0x9e3779b9 | 0, d = 0xc2b2ae35 | 0;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    a = Math.imul(a ^ ch, 0x9e3779b9) | 0;
    b = Math.imul(b ^ ch, 0x85ebca77) | 0;
    a = (a ^ (a >>> 16)) | 0;
    b = (b ^ (b >>> 13)) | 0;
    c ^= a; d ^= b;
    c = Math.imul(c, 0x1b873593) | 0;
    d = Math.imul(d, 0xcc9e2d51) | 0;
  }
  a ^= input.length; b ^= input.length;
  a = Math.imul(a ^ (a >>> 16), 0x45d9f3b) | 0;
  b = Math.imul(b ^ (b >>> 13), 0x7fb9d0b3) | 0;
  c = Math.imul(c ^ (c >>> 16), 0xc4ceb9fe) | 0;
  d = Math.imul(d ^ (d >>> 15), 0xb7ebfb07) | 0;
  const n2h = (n: number): string => (n >>> 0).toString(16).padStart(8, '0');
  let s = n2h(a) + n2h(b) + n2h(c) + n2h(d);
  let x = a ^ c, y = b ^ d;
  while (s.length < 64) {
    x = Math.imul(x ^ (x >>> 17), 0x9e3779b9) | 0;
    y = Math.imul(y ^ (y >>> 15), 0x6c62272e) | 0;
    s += ((x ^ y) >>> 0).toString(16).padStart(8, '0');
  }
  return s.slice(0, 64);
}

/** Real SHA-256 via Web Crypto API; falls back to hashStr on error. */
export async function realSha256(msg: string): Promise<string> {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    return hashStr(msg);
  }
}

/** Count leading hex-zero characters in a hash string. */
export function leadingZeros(hash: string): number {
  let n = 0;
  for (const ch of hash) {
    if (ch === '0') n++;
    else break;
  }
  return n;
}
