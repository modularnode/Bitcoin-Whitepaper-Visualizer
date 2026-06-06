import { useState, useMemo } from 'react';
import { hashStr, leadingZeros } from '../../utils/hash';

export const BLOCK_DATA = 'Block data: Alice→Bob 1BTC, fee 0.001BTC';
export const GRID_SIZE = 120;

export interface NonceEntry {
  n: number;
  h: string;
  lz: number;
}

export interface UseNonceReturn {
  nonce: number;
  setNonce: (n: number) => void;
  hash: string;
  lz: number;
  grid: NonceEntry[];
  data: string;
}

export function useNonce(): UseNonceReturn {
  const [nonce, setNonce] = useState<number>(0);

  const hash = hashStr(`${BLOCK_DATA}:nonce=${nonce}`);
  const lz = leadingZeros(hash);

  const grid = useMemo<NonceEntry[]>(() =>
    Array.from({ length: GRID_SIZE }, (_, i) => {
      const h = hashStr(`${BLOCK_DATA}:nonce=${i}`);
      return { n: i, h, lz: leadingZeros(h) };
    }),
  []);

  return { nonce, setNonce, hash, lz, grid, data: BLOCK_DATA };
}
