import React from 'react';
import { T } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, style, onClick }) => (
  <div
    onClick={onClick}
    style={{ background: T.card, border: `1px solid ${T.brd}`, borderRadius: 8, padding: 20, ...style }}
  >
    {children}
  </div>
);

export default Card;
