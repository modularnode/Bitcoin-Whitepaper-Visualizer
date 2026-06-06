import { useState, useEffect, useRef } from 'react';
import { hashStr } from '../../utils/hash';
import { T } from '../../theme';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Owner {
  name: string;
  col: string;
  abbr: string;
  privKey: string;
  pubKey: string;
}

export type SubStep =
  | 'overview'
  | 'hash-inputs'
  | 'hash-computed'
  | 'signed'
  | 'verify'
  | 'all-verified';

export interface Step {
  id: number;
  txIdx: number | null;
  substep: SubStep;
  title: string;
  desc: string;
}

export interface TxData {
  from: Owner;
  to: Owner;
  prevHash: string;
  hashInput: string;
  hashOutput: string;
  signature: string;
}

export interface UseTransactionsReturn {
  step: number;
  totalSteps: number;
  currentStep: Step;
  owners: Owner[];
  txs: TxData[];
  autoPlaying: boolean;
  next: () => void;
  prev: () => void;
  reset: () => void;
  toggleAutoPlay: () => void;
  isFieldActive: (txIdx: number, field: string) => boolean;
  isTxComplete: (txIdx: number) => boolean;
  isTxVerified: (txIdx: number) => boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const OWNERS: Owner[] = [
  { name: 'Alice', col: T.pur, abbr: 'A', privKey: 'alice_priv_9f2a', pubKey: 'a3f8…2d91' },
  { name: 'Bob',   col: T.blu, abbr: 'B', privKey: 'bob_priv_c14e',   pubKey: 'b7c2…8e04' },
  { name: 'Carol', col: T.cyn, abbr: 'C', privKey: 'carol_priv_7b3d', pubKey: 'c1d5…6a77' },
  { name: 'Dave',  col: T.grn, abbr: 'D', privKey: 'dave_priv_2e8f',  pubKey: 'd9e3…3f18' },
];

function buildTxs(): TxData[] {
  return OWNERS.slice(0, -1).map((from, i) => {
    const to = OWNERS[i + 1];
    const prevHash = i === 0
      ? '0000000000000000'
      : hashStr(`tx${i - 1}:${OWNERS[i].pubKey}:${OWNERS[i - 1].privKey}`).slice(0, 16);
    const hashInput = `${prevHash}||${to.pubKey}`;
    const hashOutput = hashStr(hashInput).slice(0, 16);
    const signature = hashStr(`${from.privKey}:${hashOutput}`).slice(0, 20);
    return { from, to, prevHash, hashInput, hashOutput, signature };
  });
}

export const TX_DATA: TxData[] = buildTxs();

const STEPS: Step[] = [
  {
    id: 0, txIdx: null, substep: 'overview',
    title: 'Chain of Digital Signatures',
    desc: 'Bitcoin ownership is a chain of signed transactions. Each owner transfers the coin by signing a hash of the previous transaction combined with the next owner’s public key.',
  },
  {
    id: 1, txIdx: 0, substep: 'hash-inputs',
    title: 'TX1 — Hash Inputs',
    desc: 'Alice sends to Bob. Two values are fed into SHA-256: the genesis previous-hash (all zeros) and Bob’s public key. These uniquely identify this transfer.',
  },
  {
    id: 2, txIdx: 0, substep: 'hash-computed',
    title: 'TX1 — Hash Computed',
    desc: 'SHA-256(prev_hash ‖ Bob’s pubkey) produces a unique 256-bit digest. Any change to the inputs — even one bit — completely changes this hash.',
  },
  {
    id: 3, txIdx: 0, substep: 'signed',
    title: 'TX1 — Alice Signs',
    desc: 'Alice uses her PRIVATE KEY to sign the hash. The resulting signature is mathematically bound to both the hash and her key. Anyone can verify it, but only Alice could have created it.',
  },
  {
    id: 4, txIdx: 1, substep: 'hash-inputs',
    title: 'TX2 — Hash Inputs',
    desc: 'Bob now sends to Carol. The previous-hash is hash(TX1) — a fingerprint of the entire history so far — combined with Carol’s public key.',
  },
  {
    id: 5, txIdx: 1, substep: 'hash-computed',
    title: 'TX2 — Hash Computed',
    desc: 'SHA-256(hash(TX1) ‖ Carol’s pubkey). This hash encodes the full chain history. Tampering with TX1 would change this hash and break the chain.',
  },
  {
    id: 6, txIdx: 1, substep: 'signed',
    title: 'TX2 — Bob Signs',
    desc: 'Bob signs with his private key, proving he authorised the transfer to Carol. Bob’s public key (visible in TX1) lets anyone verify this signature.',
  },
  {
    id: 7, txIdx: 2, substep: 'hash-inputs',
    title: 'TX3 — Hash Inputs',
    desc: 'Carol sends to Dave. hash(TX2) chains the full history; Dave’s public key designates the new owner.',
  },
  {
    id: 8, txIdx: 2, substep: 'hash-computed',
    title: 'TX3 — Hash Computed',
    desc: 'SHA-256(hash(TX2) ‖ Dave’s pubkey). This digest locks in the complete ownership history from genesis.',
  },
  {
    id: 9, txIdx: 2, substep: 'signed',
    title: 'TX3 — Carol Signs',
    desc: 'Carol signs with her private key. The chain is now complete: three signed transfers from Alice → Bob → Carol → Dave.',
  },
  {
    id: 10, txIdx: 0, substep: 'verify',
    title: 'Verify TX1',
    desc: 'To verify TX1: recompute hash(genesis ‖ Bob’s pubkey), then check Alice’s signature against that hash using Alice’s PUBLIC KEY. If it matches — Alice signed it.',
  },
  {
    id: 11, txIdx: 1, substep: 'verify',
    title: 'Verify TX2',
    desc: 'Verify TX2: recompute hash(TX1 ‖ Carol’s pubkey), check Bob’s signature using Bob’s public key (found in TX1). Chain integrity confirmed so far.',
  },
  {
    id: 12, txIdx: 2, substep: 'verify',
    title: 'Verify TX3',
    desc: 'Verify TX3: hash(TX2 ‖ Dave’s pubkey), check Carol’s signature using Carol’s public key (found in TX2). All three transactions verified — Dave is the rightful owner.',
  },
  {
    id: 13, txIdx: null, substep: 'all-verified',
    title: '✓ Chain Fully Verified',
    desc: 'All three transactions are valid. The entire ownership history is cryptographically proven: genesis → Alice → Bob → Carol → Dave. No trusted third party required.',
  },
];

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useTransactions(): UseTransactionsReturn {
  const [step, setStep] = useState<number>(0);
  const [autoPlaying, setAutoPlaying] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const totalSteps = STEPS.length - 1;
  const currentStep = STEPS[step];

  const next = () => setStep(s => Math.min(s + 1, totalSteps));
  const prev = () => setStep(s => Math.max(s - 1, 0));
  const reset = () => { setStep(0); setAutoPlaying(false); };

  const toggleAutoPlay = () => setAutoPlaying(p => !p);

  useEffect(() => {
    if (!autoPlaying) { if (timerRef.current) clearTimeout(timerRef.current); return; }
    if (step >= totalSteps) { setAutoPlaying(false); return; }
    timerRef.current = setTimeout(() => setStep(s => s + 1), 1800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [autoPlaying, step, totalSteps]);

  const isFieldActive = (txIdx: number, field: string): boolean => {
    const s = currentStep;
    if (s.txIdx !== txIdx) return false;
    switch (field) {
      case 'prevHash':  return s.substep === 'hash-inputs' || s.substep === 'hash-computed' || s.substep === 'signed';
      case 'pubKey':    return s.substep === 'hash-inputs' || s.substep === 'hash-computed' || s.substep === 'signed';
      case 'hashArrow': return s.substep === 'hash-computed' || s.substep === 'signed';
      case 'hash':      return s.substep === 'hash-computed' || s.substep === 'signed';
      case 'signArrow': return s.substep === 'signed';
      case 'signature': return s.substep === 'signed';
      case 'verify':    return s.substep === 'verify';
      default: return false;
    }
  };

  const isTxComplete = (txIdx: number): boolean =>
    step > 3 + (txIdx * 3) || currentStep.substep === 'all-verified';

  const isTxVerified = (txIdx: number): boolean => {
    if (currentStep.substep === 'all-verified') return true;
    if (currentStep.substep === 'verify') return (currentStep.txIdx ?? -1) > txIdx;
    return false;
  };

  return {
    step, totalSteps, currentStep, owners: OWNERS, txs: TX_DATA,
    autoPlaying, next, prev, reset, toggleAutoPlay,
    isFieldActive, isTxComplete, isTxVerified,
  };
}
