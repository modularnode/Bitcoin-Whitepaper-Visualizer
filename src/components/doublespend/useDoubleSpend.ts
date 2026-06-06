import { useState, useRef, useEffect } from 'react';

export const CONFIRMATIONS_REQUIRED = 6;

export interface UseDoubleSpendReturn {
  qPct: number;
  setQ: (v: number) => void;
  running: boolean;
  hBlocks: string[];
  aBlocks: string[];
  result: 'honest' | 'attacker' | null;
  confs: number;
  successProb: number;
  run: () => void;
  reset: () => void;
}

export function useDoubleSpend(): UseDoubleSpendReturn {
  const [qPct, setQPct] = useState<number>(30);
  const [running, setRunning] = useState<boolean>(false);
  const [hBlocks, setH] = useState<string[]>([]);
  const [aBlocks, setA] = useState<string[]>([]);
  const [result, setResult] = useState<'honest' | 'attacker' | null>(null);
  const [confs, setConfs] = useState<number>(0);
  const iref = useRef<ReturnType<typeof setInterval> | null>(null);

  const q = qPct / 100;
  const p = 1 - q;
  const successProb = q < p ? Math.pow(q / p, CONFIRMATIONS_REQUIRED) * 100 : 100;

  const setQ = (v: number): void => setQPct(v);

  const run = (): void => {
    if (iref.current) clearInterval(iref.current);
    setH(['₿ Alice→Merchant: 1 BTC']);
    setA(['↺ Alice→Alice: 1 BTC (secret)']);
    setResult(null); setConfs(0); setRunning(true);

    let h = 1, a = 0, acc = 0;
    const qi = qPct / 100;
    const pi = 1 - qi;

    iref.current = setInterval(() => {
      h++;
      acc += qi / pi;
      const add = Math.floor(acc + (Math.random() < (acc % 1) ? 1 : 0));
      acc = 0;
      a += add;

      const c = h - 1;
      setConfs(c);
      setH(prev => {
        const arr = [...prev];
        while (arr.length < h) arr.push(`Block #${arr.length}`);
        return arr;
      });
      setA(prev => {
        const arr = [...prev];
        while (arr.length < a + 1) arr.push(`Attack #${arr.length}`);
        return arr;
      });

      if (a >= h) {
        if (iref.current) clearInterval(iref.current);
        setRunning(false); setResult('attacker');
      } else if (c >= CONFIRMATIONS_REQUIRED) {
        if (iref.current) clearInterval(iref.current);
        setRunning(false); setResult('honest');
      }
    }, 650);
  };

  const reset = (): void => {
    if (iref.current) clearInterval(iref.current);
    setRunning(false); setH([]); setA([]); setResult(null); setConfs(0);
  };

  useEffect(() => () => { if (iref.current) clearInterval(iref.current); }, []);

  return { qPct, setQ, running, hBlocks, aBlocks, result, confs, successProb, run, reset };
}
