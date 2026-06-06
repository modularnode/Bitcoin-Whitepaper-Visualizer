import React from 'react';
import { useProofOfWork, POW_BLOCK_DATA } from './useProofOfWork';
import Card from '../shared/Card';
import Label from '../shared/Label';
import Button from '../shared/Button';
import SectionTitle from '../shared/SectionTitle';
import { T } from '../../theme';

const ProofOfWorkViz: React.FC = () => {
  const { diff, setDiff, mining, curNonce, curHash, attempts, elapsed, found, start, stop } = useProofOfWork();
  const target = '0'.repeat(diff);
  const hashRate = elapsed > 0 ? Math.round(attempts / (elapsed / 1000)).toLocaleString() : '-';

  return (
    <div>
      <SectionTitle
        icon="⛏"
        title="PROOF OF WORK"
        sub="Miners brute-force a nonce until the block’s hash starts with N zeros. Finding a valid hash is intentionally expensive; verifying it takes a single computation. This asymmetry secures the chain."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <Card>
          <Label>Difficulty (leading zeros required)</Label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 5].map(d => (
              <button key={d} disabled={mining} onClick={() => setDiff(d)} style={{
                background: diff === d ? T.ora + '22' : T.card2,
                border: `1px solid ${diff === d ? T.ora : T.brd}`,
                color: diff === d ? T.ora : T.txt,
                borderRadius: 4, padding: '6px 14px',
                fontFamily: T.fn, fontSize: 12, cursor: mining ? 'not-allowed' : 'pointer',
              }}>
                {d} <span style={{ color: T.grn }}>{'0'.repeat(d)}</span>
              </button>
            ))}
          </div>

          <Label>Target</Label>
          <div style={{ fontFamily: T.fn, fontSize: 12, color: T.txt, marginBottom: 10 }}>
            <span style={{ color: T.grn }}>{target}</span>{'?'.repeat(Math.min(28, 64 - diff))}…
          </div>

          <Label>Expected attempts</Label>
          <div style={{ fontFamily: T.fn, fontSize: 13, color: T.ora, marginBottom: 18 }}>
            16<sup>{diff}</sup> = {(16 ** diff).toLocaleString()}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={start} disabled={mining}>{mining ? '⛏ MINING…' : '▶ START MINING'}</Button>
            {mining && <Button onClick={stop} color={T.red}>■ STOP</Button>}
          </div>
        </Card>

        <Card>
          <Label>Block Being Mined</Label>
          <div style={{ background: T.card2, borderRadius: 6, padding: 12, marginBottom: 12, fontFamily: T.fn, fontSize: 11, color: T.txt, lineHeight: 1.7 }}>
            <span style={{ color: T.mut }}>data: </span>
            <span style={{ wordBreak: 'break-all' }}>{POW_BLOCK_DATA.slice(0, 42)}…</span>
            <br />
            <span style={{ color: T.mut }}>nonce: </span>
            <span style={{ fontSize: 22, fontWeight: 700, color: mining ? T.ora : T.txt, transition: 'color .1s' }}>
              {curNonce.toLocaleString()}
            </span>
          </div>

          <Label>Current Hash Attempt</Label>
          <div style={{ fontFamily: T.fn, fontSize: 11, wordBreak: 'break-all', lineHeight: 1.8, minHeight: 48, color: T.txt }}>
            {curHash ? (
              <>
                <span style={{ color: curHash.startsWith(target) ? T.grn : T.red }}>{curHash.slice(0, diff)}</span>
                <span style={{ color: T.txt }}>{curHash.slice(diff)}</span>
              </>
            ) : <span style={{ color: T.mut }}>—</span>}
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            {[['Attempts', attempts.toLocaleString(), T.ora],
              ['Elapsed', (elapsed / 1000).toFixed(2) + 's', T.txt],
              ['Speed', hashRate + ' H/s', T.cyn],
            ].map(([l, v, c]) => (
              <div key={l as string} style={{ flex: 1, background: T.card2, borderRadius: 6, padding: '8px 4px', textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: c as string, fontFamily: T.fn }}>{v}</div>
                <div style={{ fontSize: 9, color: T.mut }}>{l}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {found && (
        <div style={{ padding: 20, background: T.grn + '0d', border: `1px solid ${T.grn}44`, borderRadius: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.grn, marginBottom: 12 }}>⛏ VALID BLOCK FOUND!</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 12 }}>
            {[['Nonce', found.nonce.toLocaleString()],
              ['Attempts', attempts.toLocaleString()],
              ['Time', (elapsed / 1000).toFixed(2) + 's'],
              ['Hash Rate', hashRate + ' H/s'],
            ].map(([l, v]) => (
              <div key={l} style={{ background: T.card2, borderRadius: 6, padding: 10, textAlign: 'center' }}>
                <div style={{ fontFamily: T.fn, fontSize: 15, fontWeight: 700, color: T.ora }}>{v}</div>
                <div style={{ fontSize: 10, color: T.mut }}>{l}</div>
              </div>
            ))}
          </div>
          <Label>Winning Hash</Label>
          <div style={{ fontFamily: T.fn, fontSize: 12, wordBreak: 'break-all', lineHeight: 1.8 }}>
            <span style={{ color: T.grn, fontWeight: 700 }}>{found.hash.slice(0, diff)}</span>
            <span style={{ color: T.txt }}>{found.hash.slice(diff)}</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: T.mut }}>
            Any node can verify this in one computation. Finding it took {attempts.toLocaleString()} attempts.
          </div>
        </div>
      )}
    </div>
  );
};

export default ProofOfWorkViz;
