import React from 'react';
import { useTransactions, TxData, Owner, TX_DATA, OWNERS } from './useTransactions';
import { T } from '../../theme';

// ── Small shared pieces ───────────────────────────────────────────────────────

const Field: React.FC<{
  label: string;
  value: string;
  active: boolean;
  col?: string;
  mono?: boolean;
}> = ({ label, value, active, col, mono }) => (
  <div style={{
    padding: '6px 8px', borderRadius: 5, marginBottom: 5, transition: 'all .3s',
    background: active ? (col ?? T.ora) + '22' : T.card2,
    border: `1px solid ${active ? (col ?? T.ora) + '88' : T.brd}`,
    boxShadow: active ? `0 0 12px ${(col ?? T.ora)}33` : 'none',
  }}>
    <div style={{ fontSize: 9, color: T.mut, letterSpacing: 1.5, marginBottom: 2 }}>{label}</div>
    <div style={{ fontFamily: T.fn, fontSize: 10, color: active ? (col ?? T.ora) : T.txt, wordBreak: 'break-all' }}>
      {value}
    </div>
  </div>
);

const Arrow: React.FC<{ active: boolean; label: string; col?: string; vertical?: boolean }> = ({ active, label, col, vertical }) => (
  <div style={{
    display: 'flex', flexDirection: vertical ? 'column' : 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: 4, margin: vertical ? '2px 0' : '0 4px', transition: 'all .3s',
    opacity: active ? 1 : 0.2,
  }}>
    {!vertical && <div style={{ flex: 1, height: 1, background: active ? (col ?? T.ora) : T.brd, transition: 'all .4s' }} />}
    {vertical && <div style={{ width: 1, flex: 1, background: active ? (col ?? T.ora) : T.brd, transition: 'all .4s' }} />}
    <div style={{ fontSize: 9, color: active ? (col ?? T.ora) : T.mut, whiteSpace: 'nowrap', padding: '2px 4px', background: T.card, borderRadius: 3, border: `1px solid ${active ? (col ?? T.ora) + '66' : T.brd}` }}>
      {label}
    </div>
    {!vertical && <div style={{ fontSize: 12, color: active ? (col ?? T.ora) : T.mut }}>▶</div>}
    {vertical && <div style={{ fontSize: 12, color: active ? (col ?? T.ora) : T.mut }}>▼</div>}
  </div>
);

// ── Transaction block ─────────────────────────────────────────────────────────

const TxBlock: React.FC<{
  tx: TxData;
  idx: number;
  isFieldActive: (txIdx: number, field: string) => boolean;
  isComplete: boolean;
  isVerified: boolean;
  isCurrentTx: boolean;
}> = ({ tx, idx, isFieldActive, isComplete, isVerified, isCurrentTx }) => {
  const fa = (f: string) => isFieldActive(idx, f);
  const borderCol = isVerified ? T.grn : isComplete ? T.ora : isCurrentTx ? T.ora + '88' : T.brd;

  return (
    <div style={{
      flex: 1, minWidth: 0, padding: 12, borderRadius: 8,
      background: T.card,
      border: `2px solid ${borderCol}`,
      boxShadow: isCurrentTx ? `0 0 24px ${T.ora}22` : 'none',
      transition: 'all .4s',
    }}>
      {/* TX header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 10, color: T.ora, fontFamily: T.fn, letterSpacing: 1.5, fontWeight: 700 }}>
          TX {idx + 1}
        </span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: tx.from.col }}>{tx.from.name}</span>
          <span style={{ fontSize: 12, color: T.mut }}>→</span>
          <span style={{ fontSize: 11, color: tx.to.col }}>{tx.to.name}</span>
          {isVerified && <span style={{ fontSize: 14, color: T.grn, marginLeft: 4 }}>✓</span>}
        </div>
      </div>

      {/* ── HASH SECTION ─────────────────────────────────────── */}
      <div style={{ fontSize: 9, color: T.mut, letterSpacing: 1.5, marginBottom: 4 }}>HASH INPUTS</div>
      <Field label="PREV TX HASH" value={tx.prevHash + '…'}
        active={fa('prevHash')} col={T.cyn} />
      <Field label={tx.to.name.toUpperCase() + '’S PUBLIC KEY'} value={tx.to.pubKey}
        active={fa('pubKey')} col={T.blu} />

      <Arrow active={fa('hashArrow')} label="SHA-256" col={T.cyn} vertical />

      <Field label="HASH RESULT" value={fa('hash') || isComplete ? tx.hashOutput + '…' : '————————'}
        active={fa('hash')} col={T.cyn} />

      {/* ── SIGN / VERIFY SECTION ────────────────────────────── */}
      <div style={{ marginTop: 6 }}>
        {/* Sign operation */}
        <div style={{
          padding: '6px 8px', borderRadius: 5, marginBottom: 5, transition: 'all .3s',
          background: fa('signArrow') ? T.red + '15' : T.card2,
          border: `1px solid ${fa('signArrow') ? T.red + '66' : T.brd}`,
        }}>
          <div style={{ fontSize: 9, color: T.mut, letterSpacing: 1.5, marginBottom: 4 }}>SIGN OPERATION</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: T.fn, fontSize: 9, color: fa('signArrow') ? T.red : T.mut,
              padding: '2px 5px', background: fa('signArrow') ? T.red + '22' : T.dim,
              borderRadius: 3, border: `1px solid ${fa('signArrow') ? T.red + '55' : T.brd}` }}>
              {tx.from.name}’s PrivKey
            </span>
            <span style={{ fontSize: 10, color: fa('signArrow') ? T.ora : T.mut }}>+</span>
            <span style={{ fontFamily: T.fn, fontSize: 9, color: fa('signArrow') ? T.cyn : T.mut,
              padding: '2px 5px', background: fa('signArrow') ? T.cyn + '22' : T.dim,
              borderRadius: 3, border: `1px solid ${fa('signArrow') ? T.cyn + '55' : T.brd}` }}>
              hash
            </span>
            <span style={{ fontSize: 10, color: fa('signArrow') ? T.ora : T.mut }}>→ SIGN →</span>
          </div>
        </div>

        <Field label={'SIGNATURE (by ' + tx.from.name + ')'}
          value={fa('signature') || isComplete ? tx.signature + '…' : '————————'}
          active={fa('signature')} col={T.pur} />

        {/* Verify operation */}
        {(fa('verify') || isVerified) && (
          <div style={{
            marginTop: 6, padding: '8px 10px', borderRadius: 5, transition: 'all .4s',
            background: T.grn + '11', border: `1px solid ${T.grn}55`,
            boxShadow: `0 0 16px ${T.grn}22`,
          }}>
            <div style={{ fontSize: 9, color: T.mut, letterSpacing: 1.5, marginBottom: 6 }}>VERIFY OPERATION</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
              <span style={{ fontFamily: T.fn, fontSize: 9, color: T.pur, padding: '2px 5px', background: T.pur + '22', borderRadius: 3, border: `1px solid ${T.pur}55` }}>
                Signature
              </span>
              <span style={{ color: T.mut, fontSize: 10 }}>+</span>
              <span style={{ fontFamily: T.fn, fontSize: 9, color: T.blu, padding: '2px 5px', background: T.blu + '22', borderRadius: 3, border: `1px solid ${T.blu}55` }}>
                {tx.from.name}’s PubKey
              </span>
              <span style={{ color: T.mut, fontSize: 10 }}>+</span>
              <span style={{ fontFamily: T.fn, fontSize: 9, color: T.cyn, padding: '2px 5px', background: T.cyn + '22', borderRadius: 3, border: `1px solid ${T.cyn}55` }}>
                hash
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 9, color: T.mut }}>↓ verify(sig, pubkey, hash)</span>
              <span style={{ fontFamily: T.fn, fontSize: 13, fontWeight: 700, color: T.grn,
                padding: '2px 8px', background: T.grn + '22', borderRadius: 4, border: `1px solid ${T.grn}55`,
              }}>✓ VALID</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Chain connector ───────────────────────────────────────────────────────────

const ChainConnector: React.FC<{ fromTx: TxData; toTx: TxData; bothComplete: boolean }> = ({ fromTx, bothComplete }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 6px', minWidth: 70 }}>
    <div style={{ fontSize: 9, color: bothComplete ? T.ora : T.mut, textAlign: 'center', marginBottom: 4, letterSpacing: 1 }}>
      hash(TX)
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <div style={{ width: 24, height: 1, background: bothComplete ? T.ora : T.brd, transition: 'all .4s' }} />
      <div style={{
        width: 28, height: 28, borderRadius: 4, background: bothComplete ? T.ora + '22' : T.card2,
        border: `1px solid ${bothComplete ? T.ora : T.brd}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: T.fn, fontSize: 8, color: bothComplete ? T.ora : T.mut,
        textAlign: 'center', lineHeight: 1.2, transition: 'all .4s',
      }}>
        {bothComplete ? fromTx.hashOutput.slice(0, 6) + '…' : '???'}
      </div>
      <div style={{ fontSize: 12, color: bothComplete ? T.ora : T.mut, transition: 'color .4s' }}>▶</div>
    </div>
    <div style={{ fontSize: 9, color: T.mut, marginTop: 4, textAlign: 'center' }}>becomes<br/>prevHash</div>
  </div>
);

// ── Owner badge row ───────────────────────────────────────────────────────────

const OwnerRow: React.FC<{ owners: typeof OWNERS; currentTxIdx: number | null }> = ({ owners, currentTxIdx }) => (
  <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 20 }}>
    {owners.map((o, i) => {
      const isActive = currentTxIdx === i || currentTxIdx === i - 1;
      const role = currentTxIdx === i ? 'SENDER' : currentTxIdx === i - 1 ? 'RECIPIENT' : null;
      return (
        <div key={i} style={{ textAlign: 'center', transition: 'all .3s', opacity: isActive ? 1 : 0.45 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%', margin: '0 auto 6px',
            background: isActive ? o.col + '33' : T.card2,
            border: `2px solid ${isActive ? o.col : T.brd}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: o.col,
            boxShadow: isActive ? `0 0 20px ${o.col}55` : 'none',
            transition: 'all .35s',
          }}>{o.abbr}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? o.col : T.mut }}>{o.name}</div>
          <div style={{ fontSize: 9, color: T.mut, fontFamily: T.fn }}>pk: {o.pubKey}</div>
          {role && (
            <div style={{ fontSize: 9, marginTop: 3, padding: '1px 6px', borderRadius: 3,
              background: o.col + '22', color: o.col, border: `1px solid ${o.col}44` }}>
              {role}
            </div>
          )}
        </div>
      );
    })}
  </div>
);

// ── Progress bar ──────────────────────────────────────────────────────────────

const StepProgress: React.FC<{ step: number; total: number }> = ({ step, total }) => (
  <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
    {Array.from({ length: total + 1 }, (_, i) => (
      <div key={i} style={{
        flex: 1, height: 3, borderRadius: 2, transition: 'background .3s',
        background: i < step ? T.grn : i === step ? T.ora : T.brd,
      }} />
    ))}
  </div>
);

// ── Legend ────────────────────────────────────────────────────────────────────

const Legend: React.FC = () => (
  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 10, color: T.mut, marginTop: 16, padding: '10px 14px', background: T.card2, borderRadius: 6, border: `1px solid ${T.brd}` }}>
    {[
      { col: T.cyn, label: 'Hash value' },
      { col: T.blu, label: 'Public key' },
      { col: T.red, label: 'Private key (secret)' },
      { col: T.pur, label: 'Signature' },
      { col: T.grn, label: 'Verified ✓' },
      { col: T.ora, label: 'Active step' },
    ].map(({ col, label }) => (
      <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 10, height: 10, borderRadius: 2, background: col, display: 'inline-block' }} />
        {label}
      </span>
    ))}
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

const TransactionViz: React.FC = () => {
  const {
    step, totalSteps, currentStep, txs,
    autoPlaying, next, prev, reset, toggleAutoPlay,
    isFieldActive, isTxComplete, isTxVerified,
  } = useTransactions();

  const isSigningPhase = step >= 1 && step <= 9;
  const isVerifyPhase  = step >= 10;

  return (
    <div>
      {/* ── Header ───────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 22 }}>⛓</span>
          <span style={{ fontSize: 17, fontWeight: 700, color: T.ora, letterSpacing: 2 }}>
            CHAIN OF DIGITAL SIGNATURES
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 10, color: T.mut, padding: '3px 8px', background: T.card2, borderRadius: 4, border: `1px solid ${T.brd}` }}>
            Step {step}/{totalSteps}
          </span>
        </div>

        {/* Step info box */}
        <div style={{ padding: '12px 16px', background: T.card2, borderRadius: 8, border: `1px solid ${currentStep.substep === 'all-verified' ? T.grn : T.brd}`, transition: 'border .3s' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: currentStep.substep === 'all-verified' ? T.grn : T.ora, marginBottom: 5 }}>
            {currentStep.substep === 'all-verified' && '✓ '}{currentStep.title}
          </div>
          <div style={{ fontSize: 12, color: T.mut, lineHeight: 1.7 }}>{currentStep.desc}</div>
        </div>
      </div>

      {/* ── Phase badges ─────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { label: '↗ SIGNING PHASE', active: isSigningPhase || step === 0 },
          { label: '✔ VERIFY PHASE',  active: isVerifyPhase },
        ].map(({ label, active }) => (
          <div key={label} style={{
            fontSize: 10, letterSpacing: 1, padding: '4px 10px', borderRadius: 4,
            background: active ? T.ora + '22' : T.card2,
            color: active ? T.ora : T.mut,
            border: `1px solid ${active ? T.ora + '55' : T.brd}`,
            fontFamily: T.fn, transition: 'all .3s',
          }}>{label}</div>
        ))}
      </div>

      {/* ── Progress ─────────────────────────────────────────── */}
      <StepProgress step={step} total={totalSteps} />

      {/* ── Owner row ────────────────────────────────────────── */}
      <OwnerRow owners={OWNERS} currentTxIdx={currentStep.txIdx} />

      {/* ── Transaction chain ────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', marginBottom: 20 }}>
        {txs.map((tx, i) => (
          <React.Fragment key={i}>
            <TxBlock
              tx={tx} idx={i}
              isFieldActive={isFieldActive}
              isComplete={isTxComplete(i)}
              isVerified={isTxVerified(i)}
              isCurrentTx={currentStep.txIdx === i}
            />
            {i < txs.length - 1 && (
              <ChainConnector
                fromTx={tx}
                toTx={txs[i + 1]}
                bothComplete={isTxComplete(i)}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Controls ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
        <button onClick={prev} disabled={step === 0} style={{
          background: T.card2, color: step === 0 ? T.mut : T.txt,
          border: `1px solid ${T.brd}`, borderRadius: 5,
          padding: '8px 16px', fontFamily: T.fn, fontSize: 11,
          cursor: step === 0 ? 'not-allowed' : 'pointer', letterSpacing: 1,
        }}>◄ PREV</button>

        <button onClick={toggleAutoPlay} style={{
          background: autoPlaying ? T.red + '22' : T.ora + '22',
          color: autoPlaying ? T.red : T.ora,
          border: `1px solid ${autoPlaying ? T.red + '55' : T.ora + '55'}`,
          borderRadius: 5, padding: '8px 18px', fontFamily: T.fn,
          fontSize: 11, cursor: 'pointer', letterSpacing: 1,
        }}>{autoPlaying ? '■ PAUSE' : '▶ AUTO PLAY'}</button>

        <button onClick={next} disabled={step === totalSteps} style={{
          background: step === totalSteps ? T.card2 : T.ora,
          color: step === totalSteps ? T.mut : '#000',
          border: 'none', borderRadius: 5, padding: '8px 16px',
          fontFamily: T.fn, fontSize: 11,
          cursor: step === totalSteps ? 'not-allowed' : 'pointer',
          fontWeight: 700, letterSpacing: 1,
        }}>NEXT ►</button>

        <button onClick={reset} style={{
          background: 'none', color: T.mut, border: `1px solid ${T.brd}`,
          borderRadius: 5, padding: '8px 14px', fontFamily: T.fn,
          fontSize: 11, cursor: 'pointer', letterSpacing: 1, marginLeft: 'auto',
        }}>↺ RESET</button>
      </div>

      <Legend />
    </div>
  );
};

export default TransactionViz;
