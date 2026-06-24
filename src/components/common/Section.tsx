import React from 'react';
import { colors } from '../../utils/formatting';

interface SectionProps {
  number: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ number, title, subtitle, children }) => {
  return (
    <div style={{ marginBottom: '22px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 0 7px',
          borderBottom: `1px solid ${colors.border}`,
          marginBottom: '9px',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            color: colors.accent,
            letterSpacing: '2px',
            padding: '2px 7px',
            border: `1px solid rgba(31,90,255,.2)`,
            borderRadius: '2px',
            fontFamily: 'IBM Plex Mono, monospace',
          }}
        >
          {number}
        </div>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: colors.text,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontFamily: 'IBM Plex Mono, monospace',
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: '10px',
              color: colors.text3,
              letterSpacing: '1px',
              marginLeft: 'auto',
              fontFamily: 'IBM Plex Mono, monospace',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};
