import React from 'react';
import { useNodes } from './useNodes';
import { NodePoint, Edge } from '../../types';
import Card from '../shared/Card';
import Button from '../shared/Button';
import SectionTitle from '../shared/SectionTitle';
import { T } from '../../theme';

const NetworkEdge: React.FC<{ a: NodePoint; b: NodePoint }> = ({ a, b }) => {
  const lit = a.active && b.active;
  return (
    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
      stroke={lit ? T.grn : T.brd} strokeWidth={lit ? 2 : 1}
      opacity={lit ? 0.9 : 0.5} style={{ transition: 'all .3s' }} />
  );
};

const NetworkNode: React.FC<{ node: NodePoint }> = ({ node: n }) => (
  <g>
    {n.active && (
      <circle cx={n.x} cy={n.y} r="28" fill="none" stroke={T.grn} strokeWidth="1" opacity="0.4">
        <animate attributeName="r" from="18" to="36" dur=".7s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.7" to="0" dur=".7s" repeatCount="indefinite" />
      </circle>
    )}
    <circle cx={n.x} cy={n.y} r="18"
      fill={n.active ? T.grn + '22' : T.card2}
      stroke={n.active ? T.grn : n.source ? T.ora : T.brd}
      strokeWidth={n.source ? 2.5 : 1.5}
      style={{ transition: 'all .3s' }} />
    {n.source && <circle cx={n.x} cy={n.y} r="7" fill={T.ora} opacity="0.85" />}
    <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle"
      fill={n.active ? T.grn : T.txt} fontSize="9" fontFamily={T.fn}
      style={{ transition: 'fill .3s' }}>
      {n.lbl.replace('Node ', '')}
    </text>
    <text x={n.x} y={n.y + 30} textAnchor="middle" fill={T.mut} fontSize="9" fontFamily={T.fn}>
      {n.lbl}
    </text>
  </g>
);

const NodesViz: React.FC = () => {
  const { nodes, edges, casting, done, tx, setTx, txHash, addNode, broadcast } = useNodes();

  const getNode = (id: number): NodePoint | undefined => nodes.find(n => n.id === id);

  return (
    <div>
      <SectionTitle
        icon="◉"
        title="PEER-TO-PEER NETWORK"
        sub="Bitcoin runs on a decentralised P2P network with no central server. Each node stores the full blockchain and propagates new transactions and blocks to its peers via a gossip protocol."
      />

      <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button onClick={broadcast} disabled={casting}>
          {casting ? '📡 BROADCASTING…' : '📡 BROADCAST TX'}
        </Button>
        <Button color={T.blu} onClick={addNode} disabled={nodes.length >= 12}>
          ＋ ADD NODE ({nodes.length}/12)
        </Button>
        {done && (
          <span style={{ fontSize: 11, color: T.grn, padding: '4px 10px', background: T.grn + '11', borderRadius: 4, border: `1px solid ${T.grn}33` }}>
            ✓ Transaction propagated to all nodes
          </span>
        )}
      </div>

      <div style={{ marginBottom: 12, padding: '8px 14px', background: T.card2, borderRadius: 6, border: `1px solid ${T.brd}`, display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: T.mut }}>TX:</span>
        <input value={tx} onChange={e => setTx(e.target.value)} style={{
          flex: 1, background: 'none', border: 'none',
          color: T.txt, fontFamily: T.fn, fontSize: 12, outline: 'none',
        }} />
        <span style={{ fontSize: 10, color: T.mut }}>TXID: {txHash}…</span>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <svg width="100%" viewBox="0 0 620 400" style={{ display: 'block', background: T.card }}>
          <defs>
            <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M28 0L0 0 0 28" fill="none" stroke={T.brd} strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="620" height="400" fill="url(#grid)" opacity="0.5" />
          {edges.map(([a, b]: Edge, i: number) => {
            const na = getNode(a), nb = getNode(b);
            return na && nb ? <NetworkEdge key={i} a={na} b={nb} /> : null;
          })}
          {nodes.map(node => <NetworkNode key={node.id} node={node} />)}
        </svg>
      </Card>

      <div style={{ marginTop: 10, fontSize: 11, color: T.mut }}>
        <span style={{ color: T.ora }}>●</span> Source node &nbsp;
        <span style={{ color: T.grn }}>●</span> Received TX &nbsp;
        <span style={{ color: T.brd }}>—</span> P2P connection
      </div>
    </div>
  );
};

export default NodesViz;
