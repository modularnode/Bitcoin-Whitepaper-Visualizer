import React, { useState } from 'react';
import { TabId, TabDef } from './types';
import { T } from './theme';
import TransactionViz from './components/transactions/TransactionViz';
import HashingViz     from './components/hashing/HashingViz';
import BlocksViz      from './components/blocks/BlocksViz';
import NonceViz       from './components/nonce/NonceViz';
import ProofOfWorkViz from './components/proofofwork/ProofOfWorkViz';
import NodesViz       from './components/nodes/NodesViz';
import DoubleSpendViz from './components/doublespend/DoubleSpendViz';

const TABS: TabDef[] = [
  { id: 'tx',   label: 'Transactions',  icon: '⛓' },
  { id: 'hash', label: 'Hashing',       icon: '#'      },
  { id: 'blk',  label: 'Blocks',        icon: '▦' },
  { id: 'non',  label: 'Nonce',         icon: '🔢' },
  { id: 'pow',  label: 'Proof of Work', icon: '⛏' },
  { id: 'p2p',  label: 'P2P Nodes',     icon: '◉' },
  { id: 'dbl',  label: 'Double Spend',  icon: '⚠' },
];

const TAB_COMPONENTS: Record<TabId, React.FC> = {
  tx:   TransactionViz,
  hash: HashingViz,
  blk:  BlocksViz,
  non:  NonceViz,
  pow:  ProofOfWorkViz,
  p2p:  NodesViz,
  dbl:  DoubleSpendViz,
};

const App: React.FC = () => {
  const [tab, setTab] = useState<TabId>('tx');
  const ActiveTab = TAB_COMPONENTS[tab];

  return (
    <div style={{ background: T.bg, minHeight: '100vh', fontFamily: T.fn, color: T.txt }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{
        borderBottom: `1px solid ${T.brd}`, padding: '13px 22px',
        display: 'flex', alignItems: 'center', gap: 14,
        position: 'sticky', top: 0, zIndex: 10,
        background: T.card + 'ee', backdropFilter: 'blur(12px)',
      }}>
        <div style={{
          width: 38, height: 38, background: T.ora, borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, fontWeight: 900, color: '#000', flexShrink: 0,
        }}>₿</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: 3 }}>BITCOIN WHITEPAPER</div>
          <div style={{ fontSize: 9, color: T.mut, letterSpacing: 2 }}>
            INTERACTIVE VISUALIZATIONS · SATOSHI NAKAMOTO 2008
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 10, color: T.mut, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: T.grn, fontSize: 8 }}>●</span>
          P2P Electronic Cash System
        </div>
      </div>

      {/* ── Tab bar ────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', borderBottom: `1px solid ${T.brd}`,
        overflowX: 'auto', padding: '0 14px',
        background: T.card + '88',
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer',
            color: tab === t.id ? T.ora : T.mut,
            borderBottom: `2px solid ${tab === t.id ? T.ora : 'transparent'}`,
            fontSize: 11, letterSpacing: 1.5, whiteSpace: 'nowrap',
            fontFamily: T.fn, transition: 'all .2s',
            fontWeight: tab === t.id ? 700 : 400,
          }}>
            {t.icon} {t.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ── Active tab ─────────────────────────────────────────────────────── */}
      <div style={{ padding: 24, maxWidth: 1040, margin: '0 auto', animation: 'fadeIn .3s ease' }}>
        <ActiveTab />
      </div>
    </div>
  );
};

export default App;
