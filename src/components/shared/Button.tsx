import React from 'react';
import { T } from '../../theme';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  color?: string;
  disabled?: boolean;
  small?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, color, disabled, small }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: disabled ? T.dim : (color ?? T.ora),
      color: '#000', border: 'none', borderRadius: 5,
      padding: small ? '5px 11px' : '8px 18px',
      fontFamily: T.fn, fontSize: small ? 10 : 12, fontWeight: 700,
      cursor: disabled ? 'not-allowed' : 'pointer',
      letterSpacing: 1, transition: 'all .15s',
      opacity: disabled ? 0.5 : 1, whiteSpace: 'nowrap',
    }}
  >
    {children}
  </button>
);

export default Button;
