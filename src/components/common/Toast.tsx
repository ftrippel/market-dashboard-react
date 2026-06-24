import React, { useEffect } from 'react';
import { colors } from '../../utils/formatting';

interface ToastProps {
  message: string | null;
  onClose: () => void;
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, durationMs = 3200 }) => {
  useEffect(() => {
    if (message) {
      const timeout = setTimeout(onClose, durationMs);
      return () => clearTimeout(timeout);
    }
  }, [message, onClose, durationMs]);

  return (
    <div
      className={`toast${message ? ' show' : ''}`}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: colors.bg2,
        border: `1px solid ${colors.accent}`,
        borderRadius: '3px',
        padding: '10px 16px',
        fontSize: '11px',
        color: colors.accent,
        letterSpacing: '1px',
        zIndex: 9999,
        transform: message ? 'translateY(0)' : 'translateY(10px)',
        opacity: message ? 1 : 0,
        transition: 'all 0.25s',
        pointerEvents: message ? 'auto' : 'none',
        fontFamily: 'IBM Plex Mono, monospace',
      }}
    >
      {message}
    </div>
  );
};
