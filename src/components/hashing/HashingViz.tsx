import React from 'react';
import { useHashing } from './useHashing';
import Card from '../shared/Card';
import Label from '../shared/Label';
import SectionTitle from '../shared/SectionTitle';
import { T } from '../../theme';

const PROPERTIES = [
  { icon: '⚡', name: 'Deterministic',       desc: 'Same input always produces the same output' },
  { icon: '🌊', name: 'Avalanche Effect', desc: '1 bit change flips ≈50% of all output bits' },
  { icon: '🔒', name: 'One-Way',          desc: 'Cannot reverse-engineer the original input' },
  { icon: '📏', name: 'Fixed Length',     desc: 'Any input always produces exactly 256 bits' },
  { icon: '🛡', name: 'Collision Resistant', desc: 'Astronomically hard to find two matching inputs' },
  { icon: '⏱',    name: 'Fast Forward / Slow Reverse', desc: 'Milliseconds to compute — years to brute-force' },
];

const HashingViz: React.FC = () => {
  const { input, setInput, hash, changed, examples } = useHashing();

  return (
    <div>
      <SectionTitle
        icon="#"
        title="CRYPTOGRAPHIC HASHING (SHA-256)"
        sub="SHA-256 maps any input to a fixed 256-bit fingerprint. Change a single character and roughly half of all output bits flip — the avalanche effect that makes blockchain tampering immediately detectable."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div>
          <Label>Input (any length)</Label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{
              width: '100%', minHeight: 110, background: T.card2,
              border: `1px solid ${T.brd}`, color: T.txt, fontFamily: T.fn,
              fontSize: 13, padding: 12, borderRadius: 6,
              resize: 'vertical', outline: 'none', boxSizing: 'border-box',
            }}
          />
          <div style={{ marginTop: 6, fontSize: 11, color: T.mut }}>
            {input.length} bytes in → always 32 bytes out
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {examples.map(ex => (
              <button key={ex} onClick={() => setInput(ex)} style={{
                background: input === ex ? T.ora + '22' : T.card2,
                border: `1px solid ${input === ex ? T.ora : T.brd}`,
                color: input === ex ? T.ora : T.txt,
                borderRadius: 4, padding: '4px 9px',
                fontFamily: T.fn, fontSize: 10, cursor: 'pointer',
              }}>{ex}</button>
            ))}
          </div>
        </div>

        <div>
          <Label>SHA-256 Output — 256 bits (64 hex chars)</Label>
          <div style={{
            background: T.card2, border: `1px solid ${T.brd}`, borderRadius: 6,
            padding: 12, minHeight: 110, fontFamily: T.fn, fontSize: 13,
            lineHeight: 2, wordBreak: 'break-all', letterSpacing: 1,
          }}>
            {hash.split('').map((ch, i) => (
              <span key={i} style={{ color: changed.includes(i) ? T.red : T.grn, transition: 'color .4s' }}>
                {ch}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 14, fontSize: 11 }}>
            <span><span style={{ color: T.red }}>■</span><span style={{ color: T.mut }}> {changed.length} chars changed ({hash ? Math.round(changed.length / 64 * 100) : 0}%)</span></span>
            <span><span style={{ color: T.grn }}>■</span><span style={{ color: T.mut }}> unchanged</span></span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {PROPERTIES.map(p => (
          <Card key={p.name} style={{ padding: 14 }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>{p.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.ora, marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: T.mut, lineHeight: 1.5 }}>{p.desc}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HashingViz;
