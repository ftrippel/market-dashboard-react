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
      value > 0
        ? 'rgba(12,175,66,.12)'
        : value < 0
          ? 'rgba(242,54,69,.12)'
          : 'rgba(61,90,120,.15)';
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
}

export const BpsCell: React.FC<BpsCellProps> = ({ value }) => {
  if (value === null || value === undefined) {
    return <span style={{ color: colors.text3 }}>—</span>;
  }
  const sign = value > 0 ? '+' : '';
  const color = value > 0 ? colors.green : value < 0 ? colors.red : colors.text3;
  return (
    <span style={{ color }}>
      {sign}
      {value.toFixed(1)}bps
    </span>
  );
};
