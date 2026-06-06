import { useState, useRef, useEffect } from 'react';
import { hashStr } from '../../utils/hash';
import { FoundBlock } from '../../types';

export const POW_BLOCK_DATA = 'txs:Alice→Bob:1BTC,Carol→Dave:0.5BTC|ts:1715000000';

export interface UseProofOfWorkReturn {
  diff: number;
  setDiff: (d: number) => void;
  mining: boolean;
  curNonce: number;
  curHash: string;
  attempts: number;
  elapsed: number;
  found: FoundBlock | null;
  start: () => void;
  stop: () => void;
}

export function useProofOfWork(): UseProofOfWorkReturn {
  const [diff, setDiffState] = useState<number>(4);
  const [mining, setMining] = useState<boolean>(false);
  const [curNonce, setN] = useState<number>(0);
  const [curHash, setCH] = useState<string>('');
  const [attempts, setAtt] = useState<number>(0);
  const [elapsed, setEls] = useState<number>(0);
  const [found, setFound] = useState<FoundBlock | null>(null);
  const live = useRef<boolean>(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setDiff = (d: number): void => { setDiffState(d); setFound(null); };

  const stop = (): void => {
    live.current = false;
    setMining(false);
    if (timer.current) clearTimeout(timer.current);
  };

  const start = (): void => {
    stop();
    setFound(null); setN(0); setAtt(0); setEls(0); setCH('');
    setMining(true);
    live.current = true;
    const t0 = Date.now();
    let n = 0;
    const target = '0'.repeat(diff);

    const tick = (): void => {
      if (!live.current) return;
      const batch = diff <= 3 ? 100 : diff <= 4 ? 500 : 1500;
      for (let i = 0; i < batch; i++) {
        const h = hashStr(`${POW_BLOCK_DATA}:n=${n}`);
        if (h.startsWith(target)) {
          setN(n); setCH(h); setAtt(n + 1); setEls(Date.now() - t0);
          setFound({ nonce: n, hash: h });
          setMining(false); live.current = false;
          return;
        }
        n++;
      }
      setN(n); setAtt(n); setEls(Date.now() - t0);
      setCH(hashStr(`${POW_BLOCK_DATA}:n=${n - 1}`));
      timer.current = setTimeout(tick, 0);
    };

    timer.current = setTimeout(tick, 10);
  };

  useEffect(() => () => {
    live.current = false;
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return { diff, setDiff, mining, curNonce, curHash, attempts, elapsed, found, start, stop };
}
