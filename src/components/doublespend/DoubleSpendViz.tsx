import React from 'react';
import { useDoubleSpend, CONFIRMATIONS_REQUIRED } from './useDoubleSpend';
import Card from '../shared/Card';
import Label from '../shared/Label';
import Button from '../shared/Button';
import SectionTitle from '../shared/SectionTitle';
import { T } from '../../theme';

const BlockPill: React.FC<{ label: string | number; isFirst: boolean; attack: boolean }> = ({ label, isFirst, attack }) => (
  <div style={{
    flexShrink: 0, width: 42, height: 42,
    background: isFirst ? (attack ? T.red + '22' : T.grn + '22') : attack ? T.red + '11' : T.blu + '11',
    border: `1px solid ${isFirst ? (attack ? T.red : T.grn) : attack ? T.red + '44' : T.blu + '44'}`,
    borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, color: attack ? T.red : isFirst ? T.grn : T.blu, fontFamily: T.fn,
    animation: 'fadeIn .3s ease',
  }}>{label}</div>
);

const PROB_TABLE_COLS = [1, 2, 3, 4, 5, 6, 10];
const PROB_TABLE_ROWS = [10, 20, 30, 40];

const DoubleSpendViz: React.FC = () => {
  const { qPct, setQ, running, hBlocks, aBlocks, result, confs, successProb, run, reset } = useDoubleSpend();

  return (
    <div>
      <SectionTitle
        icon="⚠"
        title="DOUBLE-SPEND ATTACK"
        sub="An attacker pays a merchant then secretly mines an alternate chain to reverse that payment. They must outpace the honest network before enough confirmations accumulate. Satoshi proved this fails exponentially."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <Card>
          <Label>Attacker’s Share of Total Hashrate</Label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <input type="range" min={1} max={49} value={qPct} disabled={running}
              onChange={e => setQ(Number(e.target.value))}
              style={{ flex: 1, accentColor: T.red }} />
            <div style={{ fontFamily: T.fn, fontSize: 26, fontWeight: 700, color: qPct >= 40 ? T.red : T.ora, minWidth: 54 }}>
              {qPct}%
            </div>
          </div>
          <div style={{ fontSize: 11, color: T.mut, marginBottom: 16 }}>
            Honest: {100 - qPct}% &nbsp;|&nbsp; Attacker: {qPct}%
            {qPct >= 45 && <span style={{ color: T.red }}> — approaching 51% attack!</span>}
          </div>

          <div style={{ background: T.card2, borderRadius: 6, padding: 12, marginBottom: 16 }}>
            <Label>P(success after {CONFIRMATIONS_REQUIRED} confirmations)</Label>
            <div style={{ fontFamily: T.fn, fontSize: 30, fontWeight: 700, color: successProb < 0.5 ? T.grn : successProb < 10 ? T.ora : T.red }}>
              {successProb < 0.001 ? '<0.001' : successProb.toFixed(3)}%
            </div>
            <div style={{ fontSize: 10, color: T.mut, marginTop: 4 }}>
              Formula: (q/p)^z — q={qPct}%, p={100 - qPct}%, z={CONFIRMATIONS_REQUIRED}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={run} disabled={running}>{running ? '⚔ RACING…' : '▶ SIMULATE RACE'}</Button>
            <Button color={T.mut} onClick={reset} disabled={running}>↺ RESET</Button>
          </div>
        </Card>

        <Card>
          <div style={{ marginBottom: 14 }}>
            <Label>Honest Chain (Merchant sees)</Label>
            <div style={{ background: T.card2, borderRadius: 6, padding: 10, minHeight: 58 }}>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {hBlocks.map((_, i) => (
                  <BlockPill key={i} label={i === 0 ? '₿' : i} isFirst={i === 0} attack={false} />
                ))}
              </div>
              {confs > 0 && (
                <div style={{ fontSize: 11, color: confs >= CONFIRMATIONS_REQUIRED ? T.grn : T.ora, marginTop: 8 }}>
                  {confs < CONFIRMATIONS_REQUIRED
                    ? `⏳ ${confs}/${CONFIRMATIONS_REQUIRED} confirmations…`
                    : `✓ ${CONFIRMATIONS_REQUIRED} confirmations — PAYMENT CONFIRMED`}
                </div>
              )}
            </div>
          </div>

          <div>
            <Label>Attacker’s Secret Chain</Label>
            <div style={{ background: T.card2, borderRadius: 6, padding: 10, minHeight: 58 }}>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {aBlocks.map((_, i) => (
                  <BlockPill key={i} label={i === 0 ? '↺' : i} isFirst={i === 0} attack={true} />
                ))}
              </div>
              {aBlocks.length > 0 && (
                <div style={{ fontSize: 11, color: T.mut, marginTop: 8 }}>
                  {hBlocks.length > aBlocks.length
                    ? `Honest leads by ${hBlocks.length - aBlocks.length} block(s)`
                    : '⚠ Attacker has caught up!'}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {result && (
        <div style={{
          padding: 20, borderRadius: 8, marginBottom: 20,
          background: result === 'honest' ? T.grn + '0d' : T.red + '0d',
          border: `1px solid ${result === 'honest' ? T.grn + '44' : T.red + '44'}`,
        }}>
          {result === 'honest' ? (
            <>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.grn, marginBottom: 8 }}>
                ✓ DOUBLE SPEND FAILED — PAYMENT SECURED
              </div>
              <div style={{ fontSize: 12, color: T.mut }}>
                The honest chain reached {CONFIRMATIONS_REQUIRED} confirmations before the attacker caught up.
                With only {qPct}% hashrate the probability of success was just {successProb.toFixed(3)}%.
                This is precisely why Satoshi recommended waiting for 6 confirmations.
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.red, marginBottom: 8 }}>
                ⚠ DOUBLE SPEND SUCCEEDED — CHAIN REORG!
              </div>
              <div style={{ fontSize: 12, color: T.mut }}>
                The attacker’s chain overtook the honest chain and invalidated the payment.
                In practice, acquiring {qPct}% of Bitcoin’s hashrate costs billions of dollars.
              </div>
            </>
          )}
        </div>
      )}

      <Label>Attack success probability — Satoshi’s original analysis (z = confirmations)</Label>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: T.fn, fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.brd}` }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', color: T.mut }}>q</th>
              {PROB_TABLE_COLS.map(z => (
                <th key={z} style={{ padding: '8px 10px', color: z === 6 ? T.ora : T.mut, fontWeight: z === 6 ? 700 : 400 }}>
                  z={z}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PROB_TABLE_ROWS.map(qp => {
              const qi = qp / 100, pi = 1 - qi;
              return (
                <tr key={qp} style={{ borderBottom: `1px solid ${T.brd}22` }}>
                  <td style={{ padding: '7px 12px', color: qp >= 40 ? T.red : T.txt }}>{qp}%</td>
                  {PROB_TABLE_COLS.map(z => {
                    const v = Math.pow(qi / pi, z) * 100;
                    return (
                      <td key={z} style={{
                        padding: '7px 10px', textAlign: 'center',
                        color: v < 0.01 ? T.grn : v < 1 ? T.ora : T.red,
                        fontWeight: z === 6 ? 700 : 400,
                        background: z === 6 ? T.ora + '08' : 'transparent',
                      }}>
                        {v < 0.0001 ? '≈0' : v.toFixed(v < 0.01 ? 4 : 2)}%
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoubleSpendViz;
