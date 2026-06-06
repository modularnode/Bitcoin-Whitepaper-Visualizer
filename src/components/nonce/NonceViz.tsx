import React from 'react';
import { useNonce } from './useNonce';
import Card from '../shared/Card';
import Label from '../shared/Label';
import Button from '../shared/Button';
import SectionTitle from '../shared/SectionTitle';
import { T } from '../../theme';

const NonceViz: React.FC = () => {
  const { nonce, setNonce, hash, lz, grid, data } = useNonce();

  const difficultyLabel = (): React.ReactNode => {
    if (lz === 0) return <span style={{ color: T.mut }}>Fails all difficulty targets</span>;
    if (lz === 1) return <span style={{ color: T.txt }}>Passes difficulty 1</span>;
    if (lz === 2) return <span style={{ color: T.ora }}>Passes difficulty ≤ 2 ✓</span>;
    if (lz === 3) return <span style={{ color: T.ora }}>Passes difficulty ≤ 3 ✓✓</span>;
    return <span style={{ color: T.grn }}>Passes difficulty ≤ {lz} ✓✓✓</span>;
  };

  return (
    <div>
      <SectionTitle
        icon="🔢"
        title="THE NONCE"
        sub='A nonce (“number used once”) is a 32-bit counter appended to block data. Miners try billions of nonces per second until the resulting hash starts with enough leading zeros to satisfy the difficulty target.'
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <Card>
          <Label>Block Data (fixed)</Label>
          <div style={{
            fontFamily: T.fn, fontSize: 11, color: T.txt, background: T.card2,
            padding: 10, borderRadius: 6, marginBottom: 16, wordBreak: 'break-all', lineHeight: 1.6,
          }}>{data}</div>

          <Label>Nonce: {nonce}</Label>
          <input
            type="range" min={0} max={119} value={nonce}
            onChange={e => setNonce(Number(e.target.value))}
            style={{ width: '100%', accentColor: T.ora, marginBottom: 4 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: T.mut, marginBottom: 14 }}>
            <span>0</span><span>119</span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button small onClick={() => setNonce(Math.max(0, nonce - 1))}>◄ -1</Button>
            <Button small onClick={() => setNonce(Math.min(119, nonce + 1))}>+1 ►</Button>
            <Button small color={T.blu} onClick={() => setNonce(Math.floor(Math.random() * 120))}>RANDOM</Button>
          </div>
        </Card>

        <Card>
          <Label>SHA-256( block_data + nonce={nonce} )</Label>
          <div style={{
            background: T.card2, borderRadius: 6, padding: 12,
            fontFamily: T.fn, fontSize: 12, wordBreak: 'break-all', lineHeight: 2,
            border: `2px solid ${lz >= 4 ? T.grn : lz >= 2 ? T.ora : T.brd}`,
            transition: 'border .3s',
          }}>
            <span style={{ color: T.grn, fontWeight: 700 }}>{hash.slice(0, lz)}</span>
            <span style={{ color: T.txt }}>{hash.slice(lz)}</span>
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
            <div style={{ flex: '0 0 80px', background: T.card2, borderRadius: 6, padding: '10px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 700, color: lz >= 4 ? T.grn : lz >= 2 ? T.ora : T.mut, fontFamily: T.fn }}>{lz}</div>
              <div style={{ fontSize: 9, color: T.mut }}>Leading Zeros</div>
            </div>
            <div style={{ flex: 1, background: T.card2, borderRadius: 6, padding: 10, fontSize: 11, lineHeight: 1.7 }}>
              {difficultyLabel()}
              <div style={{ color: T.mut, marginTop: 4, fontSize: 10 }}>Real Bitcoin needs ~19 leading zeros</div>
            </div>
          </div>
        </Card>
      </div>

      <Label>Hash lottery — nonces 0–119 (click to select · green = 3+ zeros)</Label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 3 }}>
        {grid.map(({ n, h, lz: z }) => (
          <div key={n} onClick={() => setNonce(n)} style={{
            background: n === nonce ? T.ora + '22' : z >= 3 ? T.grn + '0d' : T.card2,
            border: `1px solid ${n === nonce ? T.ora : z >= 3 ? T.grn + '55' : T.brd}`,
            borderRadius: 4, padding: '4px 7px', cursor: 'pointer', transition: 'all .12s',
          }}>
            <span style={{ fontSize: 9, color: T.mut }}>n={n} </span>
            <span style={{ fontFamily: T.fn, fontSize: 10, color: z >= 3 ? T.grn : z >= 1 ? T.ora : T.txt }}>
              {'0'.repeat(z)}{h.slice(z, z + 6)}…
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NonceViz;
