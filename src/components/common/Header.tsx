import React from 'react';
import { colors } from '../../utils/formatting';
import { useTheme } from '../../context/ThemeContext';
import { Icon, XIcon } from './Icon';

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
  const { theme, toggleTheme } = useTheme();
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
        <div className="logo">Market Dashboard</div>
        <div className="hdr-meta">
          <div style={{ letterSpacing: '1px' }}>{date}</div>
          <strong>{time}</strong>
        </div>
        {/*<div className="live">
          <span className="dot" />
          HKT LIVE
        </div>*/}
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
        <button
          type="button"
          className="btn btn-theme"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          <Icon name={theme === 'light' ? 'dark_mode' : 'light_mode'} size="sm" />
        </button>
        <button type="button" className="btn btn-x" onClick={onSnap}>
          <Icon name="photo_camera" size="sm" />
          SNAP
        </button>
        <button type="button" className="btn btn-x" onClick={onShareX}>
          <XIcon size={13} />
          SHARE
        </button>
        <button type="button" className="btn btn-x" onClick={onCopy}>
          <Icon name="content_copy" size="sm" />
          COPY
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
