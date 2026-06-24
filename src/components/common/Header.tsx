import React from 'react';
import { colors } from '../../utils/formatting';

interface HeaderProps {
  loading: boolean;
  badgeLabel?: string;
  badgeOk?: boolean;
  onSnap?: () => void;
  onShareX?: () => void;
  onCopy?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  loading,
  badgeLabel,
  badgeOk,
  onSnap,
  onShareX,
  onCopy,
}) => {
  const [time, setTime] = React.useState<string>('—');
  const [date, setDate] = React.useState<string>('—');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      );
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const badgeText = badgeLabel ?? (loading ? 'LOADING DATA...' : 'DATA READY');
  const badgeColor = loading ? colors.text3 : badgeOk ? colors.green : colors.amber;

  return (
    <div className="hdr">
      <div className="hdr-l">
        <div className="logo">Market Command Centre</div>
        <div className="hdr-meta">
          <div style={{ letterSpacing: '1px' }}>{date}</div>
          <strong>{time}</strong>
        </div>
        <div className="live">
          <span className="dot" />
          HKT LIVE
        </div>
      </div>

      <div className="hdr-r">
        <span
          id="lastUpdatedBadge"
          style={{
            fontSize: '9px',
            color: badgeColor,
            letterSpacing: '1px',
            padding: '4px 8px',
            background: colors.bg3,
            border: `1px solid ${colors.border}`,
            borderRadius: '2px',
            maxWidth: '360px',
            textAlign: 'right',
          }}
        >
          {badgeText}
        </span>
        <button type="button" className="btn btn-snap" onClick={onSnap}>
          📸 SNAP
        </button>
        <button type="button" className="btn btn-x" onClick={onShareX}>
          𝕏 SHARE
        </button>
        <button type="button" className="btn btn-copy" onClick={onCopy}>
          ⧉ COPY
        </button>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};
