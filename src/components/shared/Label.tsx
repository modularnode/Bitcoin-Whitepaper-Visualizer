import React from 'react';
import { T } from '../../theme';

interface LabelProps { children: React.ReactNode; }

const Label: React.FC<LabelProps> = ({ children }) => (
  <div style={{
    fontSize: 10, letterSpacing: 2, color: T.mut,
    textTransform: 'uppercase', marginBottom: 6, fontFamily: T.fn,
  }}>
    {children}
  </div>
);

export default Label;
