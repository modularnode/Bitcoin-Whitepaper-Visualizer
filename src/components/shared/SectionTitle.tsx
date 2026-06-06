import React from 'react';
import { T } from '../../theme';

interface SectionTitleProps { icon: string; title: string; sub: string; }

const SectionTitle: React.FC<SectionTitleProps> = ({ icon, title, sub }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ fontSize: 17, fontWeight: 700, color: T.ora, letterSpacing: 2 }}>{title}</span>
    </div>
    <p style={{ margin: 0, fontSize: 12, color: T.mut, maxWidth: 620, lineHeight: 1.7 }}>{sub}</p>
  </div>
);

export default SectionTitle;
