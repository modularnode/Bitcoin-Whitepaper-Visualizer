# Bitcoin Whitepaper — Interactive Visualizations

Interactive, animated visualizations of the core concepts from
[Satoshi Nakamoto's 2008 whitepaper](https://bitcoin.org/bitcoin.pdf),
built with React 18 + TypeScript 5 + Vite.

## Visualized Concepts

| Tab             | Concept                                                    |
| --------------- | ---------------------------------------------------------- |
| ⛓ Transactions  | Chain of digital signatures — how coin ownership transfers |
| # Hashing       | Real SHA-256, avalanche effect, one-way property           |
| ▦ Blocks        | Blockchain structure, tamper-evidence, chain integrity     |
| 🔢 Nonce        | How miners hunt for valid block hashes                     |
| ⛏ Proof of Work | Live mining simulation with configurable difficulty        |
| ◉ P2P Nodes     | Gossip-protocol propagation across a peer network          |
| ⚠ Double Spend  | Race simulation with Satoshi's probability analysis        |

---

## Prerequisites

| Tool                           | Minimum version            |
| ------------------------------ | -------------------------- |
| [Node.js](https://nodejs.org/) | 18.x                       |
| npm                            | 9.x (bundled with Node 18) |

---

## Quick Start

```bash
# 1 — enter project directory
cd bitcoin-whitepaper-viz

# 2 — install dependencies (once)
npm install

# 3 — start development server
npm run dev
```

Open **http://localhost:5173** in your browser.
The app hot-reloads on every file save.

---

## Available Scripts

| Command           | Description                                     |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Start Vite dev server with HMR                  |
| `npm run build`   | Type-check then bundle for production (`dist/`) |
| `npm run preview` | Serve the production build locally              |

---

## Project Structure

```
bitcoin-whitepaper-viz/
├── index.html                        # Vite entry HTML
├── vite.config.ts                    # Vite + React plugin
├── tsconfig.json                     # TypeScript (app)
├── tsconfig.node.json                # TypeScript (build tools)
├── diagrams/
│   └── concepts.md                   # Mermaid diagrams for every tab
└── src/
    ├── index.tsx                     # ReactDOM.createRoot entry point
    ├── index.css                     # Global resets + animations
    ├── App.tsx                       # Tab shell & routing
    ├── types/
    │   └── index.ts                  # Shared TypeScript interfaces
    ├── utils/
    │   └── hash.ts                   # hashStr · realSha256 · leadingZeros
    ├── theme/
    │   └── index.ts                  # Colour palette (T.ora, T.grn, …)
    └── components/
        ├── shared/                   # Card · Label · Button · SectionTitle
        ├── transactions/
        │   ├── useTransactions.ts    # State & animation logic
        │   └── TransactionViz.tsx    # UI
        ├── hashing/
        │   ├── useHashing.ts         # Async SHA-256 + diff tracking
        │   └── HashingViz.tsx
        ├── blocks/
        │   ├── useBlocks.ts          # Chain build + tamper logic
        │   └── BlocksViz.tsx
        ├── nonce/
        │   ├── useNonce.ts           # Nonce grid (useMemo)
        │   └── NonceViz.tsx
        ├── proofofwork/
        │   ├── useProofOfWork.ts     # Async mining loop
        │   └── ProofOfWorkViz.tsx
        ├── nodes/
        │   ├── useNodes.ts           # BFS broadcast + node management
        │   └── NodesViz.tsx          # SVG network graph
        └── doublespend/
            ├── useDoubleSpend.ts     # Race simulation + probability
            └── DoubleSpendViz.tsx
```

### Architecture pattern

Every tab follows a strict **logic / UI split**:

```
useXxx.ts          ← pure state + side-effects, no JSX
XxxViz.tsx         ← pure rendering, calls useXxx(), no raw state
```

This makes each hook independently testable and the UI trivially replaceable.

---

## Technology

| Library        | Role                                |
| -------------- | ----------------------------------- |
| React 18       | UI + hooks                          |
| TypeScript 5   | Type safety throughout              |
| Vite 5         | Dev server & bundler                |
| Web Crypto API | Real SHA-256 in the Hashing tab     |
| SVG (inline)   | P2P network graph                   |
| CSS-in-JS      | Inline `React.CSSProperties` styles |

No CSS framework or component library — the dark terminal aesthetic is achieved
entirely through inline styles and the theme constants in `src/theme/index.ts`.

---

## License

MIT — see [LICENSE](LICENSE).
