import React from 'react';
import { useBlocks } from './useBlocks';
import { ChainBlock } from '../../types';
import Card from '../shared/Card';
import Label from '../shared/Label';
import Button from '../shared/Button';
import SectionTitle from '../shared/SectionTitle';
import { T } from '../../theme';

const BlockCard: React.FC<{
  block: ChainBlock;
  index: number;
  valid: boolean;
  selected: boolean;
  onSelect: () => void;
}> = ({ block, index, valid, selected, onSelect }) => (
  <div
    onClick={onSelect}
    style={{
      width: 180, background: T.card, flexShrink: 0,
      border: `2px solid ${!valid ? T.red : selected ? T.ora : T.brd}`,
      borderRadius: 8, padding: 14, cursor: 'pointer', transition: 'all .3s',
      boxShadow: !valid ? `0 0 24px ${T.red}44` : 'none',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: T.ora, letterSpacing: 1 }}>BLOCK #{index}</span>
      <span style={{
        fontSize: 9, padding: '2px 6px', borderRadius: 3,
        background: valid ? T.grn + '22' : T.red + '22',
        color: valid ? T.grn : T.red,
        border: `1px solid ${valid ? T.grn + '44' : T.red + '44'}`,
      }}>{valid ? '✓ VALID' : '✗ INVALID'}</span>
    </div>
    <Label>Prev Hash</Label>
    <div style={{ fontFamily: T.fn, fontSize: 10, color: valid ? T.cyn : T.red, marginBottom: 8, wordBreak: 'break-all' }}>
      {block.prevHash.slice(0, 20)}…
    </div>
    <Label>Transactions</Label>
    {block.txs.map((tx, j) => (
      <div key={j} style={{
        fontSize: 9, color: T.txt, background: T.card2,
        padding: '2px 5px', borderRadius: 3, marginBottom: 2, wordBreak: 'break-all',
      }}>
        {tx.length > 26 ? tx.slice(0, 26) + '…' : tx}
      </div>
    ))}
    <div style={{ marginTop: 8 }}>
      <Label>Nonce</Label>
      <div style={{ fontFamily: T.fn, fontSize: 11, color: T.txt, marginBottom: 6 }}>{block.nonce}</div>
    </div>
    <Label>Hash</Label>
    <div style={{ fontFamily: T.fn, fontSize: 9, color: valid ? T.grn : T.red, wordBreak: 'break-all', lineHeight: 1.5 }}>
      {selected ? block.hash : block.hash.slice(0, 20) + '…'}
    </div>
  </div>
);

const BlocksViz: React.FC = () => {
  const { chainFinal, sel, tampered, toggleSel, tamper, reset, isValid } = useBlocks();

  return (
    <div>
      <SectionTitle
        icon="▦"
        title="THE BLOCKCHAIN"
        sub="Each block commits to the hash of the previous block, chaining all history together. Alter any block and every subsequent hash becomes invalid — you’d need to redo all the proof-of-work behind it."
      />

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button color={T.red} disabled={tampered} onClick={tamper}>
          ⚠ TAMPER BLOCK #2
        </Button>
        {tampered && <Button onClick={reset}>↺ RESET</Button>}
        <span style={{ fontSize: 11, color: T.mut, alignSelf: 'center' }}>
          Alter a block to see the chain integrity break
        </span>
      </div>

      <div style={{ display: 'flex', overflowX: 'auto', paddingBottom: 8, gap: 0 }}>
        {chainFinal.map((block, i) => {
          const valid = isValid(i, chainFinal);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <BlockCard
                block={block}
                index={i}
                valid={valid}
                selected={sel === i}
                onSelect={() => toggleSel(i)}
              />
              {i < chainFinal.length - 1 && (
                <div style={{
                  padding: '0 4px', fontSize: 22,
                  color: isValid(i + 1, chainFinal) ? T.mut : T.red,
                  transition: 'color .3s', flexShrink: 0,
                }}>→</div>
              )}
            </div>
          );
        })}
      </div>

      {tampered && (
        <div style={{
          marginTop: 14, padding: 14,
          background: T.red + '0d', border: `1px solid ${T.red}44`, borderRadius: 8,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.red, marginBottom: 6 }}>
            ⛔ CHAIN INTEGRITY BROKEN
          </div>
          <div style={{ fontSize: 12, color: T.mut, lineHeight: 1.7 }}>
            Changing Block #2’s transactions altered its hash. Blocks #3–#4 now reference an
            invalid previous hash, making them invalid too. To forge this on a live network, an attacker
            would need to redo proof-of-work for all subsequent blocks faster than the honest network
            keeps adding new ones — computationally infeasible.
          </div>
        </div>
      )}
    </div>
  );
};

export default BlocksViz;
