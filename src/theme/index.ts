export const T = {
  bg:    '#07090e',
  card:  '#0d1118',
  card2: '#12161f',
  brd:   '#1b2338',
  ora:   '#f7931a',
  grn:   '#00cf78',
  red:   '#ff3b50',
  blu:   '#2d7dff',
  pur:   '#a855f7',
  cyn:   '#00bcd4',
  txt:   '#ccd3e0',
  mut:   '#445568',
  dim:   '#1a2030',
  fn:    "'Courier New', monospace",
} as const;

export type Theme = typeof T;
