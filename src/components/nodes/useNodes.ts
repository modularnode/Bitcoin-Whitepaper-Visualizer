import { useState } from 'react';
import { NodePoint, Edge } from '../../types';
import { hashStr } from '../../utils/hash';

const INIT_NODES: NodePoint[] = [
  { id: 0, x: 310, y: 150, lbl: 'Node A', active: false, source: true },
  { id: 1, x: 470, y: 90,  lbl: 'Node B', active: false },
  { id: 2, x: 510, y: 230, lbl: 'Node C', active: false },
  { id: 3, x: 200, y: 260, lbl: 'Node D', active: false },
  { id: 4, x: 360, y: 310, lbl: 'Node E', active: false },
  { id: 5, x: 140, y: 140, lbl: 'Node F', active: false },
];

const INIT_EDGES: Edge[] = [[0,1],[0,2],[0,3],[0,5],[1,2],[2,4],[3,4],[3,5],[1,4]];

function buildAdj(edges: Edge[], count: number): Map<number, number[]> {
  const adj = new Map<number, number[]>();
  for (let i = 0; i < count; i++) adj.set(i, []);
  edges.forEach(([a, b]) => { adj.get(a)!.push(b); adj.get(b)!.push(a); });
  return adj;
}

export interface UseNodesReturn {
  nodes: NodePoint[];
  edges: Edge[];
  casting: boolean;
  done: boolean;
  tx: string;
  setTx: (v: string) => void;
  txHash: string;
  addNode: () => void;
  broadcast: () => void;
}

export function useNodes(): UseNodesReturn {
  const [nodes, setNodes] = useState<NodePoint[]>(INIT_NODES);
  const [edges, setEdges] = useState<Edge[]>(INIT_EDGES);
  const [casting, setCasting] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [tx, setTx] = useState<string>('Alice → Bob: 1.5 BTC');

  const txHash = hashStr(tx).slice(0, 12);

  const addNode = (): void => {
    if (nodes.length >= 12) return;
    const id = nodes.length;
    const angle = (id / (nodes.length + 1)) * Math.PI * 2;
    const r = 150 + Math.random() * 40;
    const newNode: NodePoint = {
      id, x: 310 + Math.cos(angle) * r, y: 190 + Math.sin(angle) * r,
      lbl: `Node ${String.fromCharCode(65 + id)}`, active: false,
    };
    const c1 = Math.floor(Math.random() * nodes.length);
    const c2 = (c1 + 2) % nodes.length;
    setNodes(p => [...p, newNode]);
    setEdges(p => [...p, [c1, id], [c2, id]]);
  };

  const broadcast = (): void => {
    if (casting) return;
    setCasting(true); setDone(false);
    setNodes(p => p.map(n => ({ ...n, active: false })));

    const adj = buildAdj(edges, nodes.length);
    const delays: Record<number, number> = { 0: 0 };
    const queue: number[] = [0];
    while (queue.length) {
      const cur = queue.shift()!;
      (adj.get(cur) ?? []).forEach(nb => {
        if (delays[nb] == null) {
          delays[nb] = delays[cur] + 350 + Math.random() * 250;
          queue.push(nb);
        }
      });
    }

    nodes.forEach(({ id }) => {
      setTimeout(() => {
        setNodes(p => p.map(n => n.id === id ? { ...n, active: true } : n));
      }, delays[id] ?? 0);
    });

    const maxDelay = Math.max(...Object.values(delays));
    setTimeout(() => {
      setCasting(false); setDone(true);
      setNodes(p => p.map(n => ({ ...n, active: false })));
    }, maxDelay + 700);
  };

  return { nodes, edges, casting, done, tx, setTx, txHash, addNode, broadcast };
}
