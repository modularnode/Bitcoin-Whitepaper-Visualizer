import { useState, useEffect, useRef } from 'react';
import { realSha256 } from '../../utils/hash';

export const HASH_EXAMPLES: string[] = [
  'Hello, Bitcoin!',
  'Hello, Bitcoin.',
  'Satoshi Nakamoto',
  'Block #839000',
  '1 BTC = $100000',
];

export interface UseHashingReturn {
  input: string;
  setInput: (v: string) => void;
  hash: string;
  changed: number[];
  examples: string[];
}

export function useHashing(): UseHashingReturn {
  const [input, setInput] = useState<string>('Hello, Bitcoin!');
  const [hash, setHash] = useState<string>('');
  const [changed, setChanged] = useState<number[]>([]);
  const prevRef = useRef<string>('');

  useEffect(() => {
    let dead = false;
    (async () => {
      const h = await realSha256(input);
      if (dead) return;
      if (prevRef.current) {
        const d: number[] = [];
        for (let i = 0; i < 64; i++) if (h[i] !== prevRef.current[i]) d.push(i);
        setChanged(d);
        setTimeout(() => setChanged([]), 2000);
      }
      prevRef.current = h;
      setHash(h);
    })();
    return () => { dead = true; };
  }, [input]);

  return { input, setInput, hash, changed, examples: HASH_EXAMPLES };
}
