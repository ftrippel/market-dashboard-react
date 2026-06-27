import React from 'react';
import { colors } from '../../utils/formatting';

interface PctCellProps {
  value: number | null | undefined;
  badge?: boolean;
  maxPct?: number;
}

export const PctCell: React.FC<PctCellProps> = ({ value, badge = false, maxPct = 15 }) => {
  if (value === null || value === undefined) {
    return <span style={{ color: colors.text3 }}>—</span>;
  }

  const sign = value > 0 ? '+' : '';
  const text = `${sign}${value.toFixed(2)}%`;
  const color = value > 0 ? colors.green : value < 0 ? colors.red : colors.text3;
  const barWidth = Math.min((Math.abs(value) / maxPct) * 100, 100);

  if (badge) {
    const bg =
      value > 0 ? colors.greenDimBg : value < 0 ? colors.redDimBg : colors.neutralDimBg;
    return (
      <span
        style={{
          background: bg,
          color,
          padding: '1px 5px',
          borderRadius: '2px',
          fontSize: '10.5px',
        }}
      >
        {text}
      </span>
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '2px',
        minWidth: '52px',
      }}
    >
      <span style={{ color }}>{text}</span>
      <span
        style={{
          height: '4px',
          borderRadius: '2px',
          opacity: 0.75,
          minWidth: '2px',
          width: `${barWidth.toFixed(1)}%`,
          background: color,
        }}
      />
    </span>
  );
};

interface BpsCellProps {
  value: number | null | undefined;
  maxBps?: number;
}

export const BpsCell: React.FC<BpsCellProps> = ({ value, maxBps = 25 }) => {
  if (value === null || value === undefined) {
    return <span style={{ color: colors.text3 }}>—</span>;
  }
  const sign = value > 0 ? '+' : '';
  const text = `${sign}${value.toFixed(1)}bps`;
  const color = value > 0 ? colors.green : value < 0 ? colors.red : colors.text3;
  const barWidth = Math.min((Math.abs(value) / maxBps) * 100, 100);

  return (
    <span
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '2px',
        minWidth: '52px',
      }}
    >
      <span style={{ color }}>{text}</span>
      <span
        style={{
          height: '4px',
          borderRadius: '2px',
          opacity: 0.75,
          minWidth: '2px',
          width: `${barWidth.toFixed(1)}%`,
          background: color,
        }}
      />
    </span>
  );
};
