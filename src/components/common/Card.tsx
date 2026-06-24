import React from 'react';
import { colors } from '../../utils/formatting';

interface CardProps {
  label: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ label, children, style }) => {
  return (
    <div
      style={{
        background: colors.bg2,
        border: `1px solid ${colors.border}`,
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '9px',
        ...style,
      }}
    >
      <div
        style={{
          padding: '7px 11px',
          fontSize: '10px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: colors.accent,
          background: colors.bg3,
          borderBottom: `1px solid ${colors.border}`,
          fontWeight: 500,
          fontFamily: 'IBM Plex Mono, monospace',
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
};
