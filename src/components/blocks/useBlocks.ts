import { useState } from 'react';
import { BlockData, ChainBlock } from '../../types';
import { hashStr } from '../../utils/hash';

export const GENESIS: BlockData[] = [
  { index: 0, txs: ['Coinbase: 50 BTC → Satoshi'], nonce: 2832 },
  { index: 1, txs: ['Alice → Bob: 2 BTC', 'Carol → Dave: 0.5 BTC'], nonce: 7210 },
  { index: 2, txs: ['Bob → Eve: 1 BTC', 'Miner fee: 0.001 BTC'], nonce: 4159 },
  { index: 3, txs: ['Eve → Frank: 0.5 BTC'], nonce: 9082 },
];

export interface UseBlocksReturn {
  chainFinal: ChainBlock[];
  sel: number | null;
  tampered: boolean;
  toggleSel: (i: number) => void;
  tamper: () => void;
  reset: () => void;
  isValid: (i: number, chain: ChainBlock[]) => boolean;
}

function bHash(b: ChainBlock): string {
  return hashStr(JSON.stringify({ i: b.index, p: b.prevHash, t: b.txs, n: b.nonce }));
}

function buildChain(blocks: BlockData[]): ChainBlock[] {
  const chain: ChainBlock[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const ph = i === 0 ? '0000000000000000' : chain[i - 1].hash;
    const withPrev: ChainBlock = { ...blocks[i], prevHash: ph, hash: '' };
    withPrev.hash = bHash(withPrev);
    chain.push(withPrev);
  }
  return chain;
}

export function useBlocks(): UseBlocksReturn {
  const [blocks, setBlocks] = useState<BlockData[]>(GENESIS);
  const [sel, setSel] = useState<number | null>(null);
  const [tampered, setTampered] = useState<boolean>(false);

  const chainFinal = buildChain(blocks);

  const isValid = (i: number, chain: ChainBlock[]): boolean =>
    i === 0 || chain[i].prevHash === chain[i - 1].hash;

  const toggleSel = (i: number): void =>
    setSel(prev => (prev === i ? null : i));

  const tamper = (): void => {
    setBlocks(prev => {
      const updated = [...prev];
      updated[1] = {
        ...updated[1],
        txs: ['Alice → Bob: 2 BTC', 'Carol → Dave: 99 BTC ← FRAUD!'],
      };
      return updated;
    });
    setTampered(true);
  };

  const reset = (): void => {
    setBlocks(GENESIS);
    setTampered(false);
    setSel(null);
  };

  return { chainFinal, sel, tampered, toggleSel, tamper, reset, isValid };
}
