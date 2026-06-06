// ── Domain types ────────────────────────────────────────────────────────────

export interface Owner {
  name: string;
  col: string;
  pk: string;
}

export interface Transaction {
  from: Owner;
  to: Owner;
  prevHash: string;
  sig: string;
}

export interface BlockData {
  index: number;
  txs: string[];
  nonce: number;
}

export interface ChainBlock extends BlockData {
  prevHash: string;
  hash: string;
}

export interface NodePoint {
  id: number;
  x: number;
  y: number;
  lbl: string;
  active: boolean;
  source?: boolean;
}

export type Edge = [number, number];

export interface FoundBlock {
  nonce: number;
  hash: string;
}

// ── Navigation types ──────────────────────────────────────────────────────────

export type TabId = 'tx' | 'hash' | 'blk' | 'non' | 'pow' | 'p2p' | 'dbl';

export interface TabDef {
  id: TabId;
  label: string;
  icon: string;
}
