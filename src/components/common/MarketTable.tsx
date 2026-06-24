import React, { useMemo, useState } from 'react';
import { getSymbolMeta } from '../../data/symbolMeta';
import { colors, formatPrice } from '../../utils/formatting';
import type { Holding, MarketData, MarketTableOptions } from '../../types';
import { Sparkline } from './Sparkline';
import { BpsCell, PctCell } from './PctCell';
import { SymbolLink } from './TradingViewModal';

interface MarketTableProps extends MarketTableOptions {
  data: MarketData[];
  holdings?: Record<string, Holding[]>;
}

const thStyle: React.CSSProperties = {
  padding: '6px 10px',
  fontSize: '9.5px',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: colors.text3,
  background: colors.bg3,
  borderBottom: `1px solid ${colors.border}`,
  fontWeight: 500,
};

const tdStyle: React.CSSProperties = {
  padding: '6px 10px',
  fontSize: '12px',
};

function RankBadge({ rank }: { rank: number }) {
  const top = rank <= 3;
  return (
    <span
      className={top ? 'rank g' : 'rank'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '18px',
        height: '18px',
        borderRadius: '2px',
        fontSize: '9.5px',
        fontWeight: 600,
        background: top ? 'rgba(255,143,0,.1)' : colors.bg4,
        color: top ? colors.amber : colors.text3,
      }}
    >
      {rank}
    </span>
  );
}

function TrendCell({ value }: { value?: boolean }) {
  if (value === true) {
    return (
      <span className="ema-up" title="10-EMA > 20-EMA · Short-term uptrend" style={{ color: colors.green, fontSize: '13px', fontWeight: 600 }}>
        ✓
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="ema-dn" title="10-EMA ≤ 20-EMA" style={{ color: colors.text3, fontSize: '12px', opacity: 0.5 }}>
        ✗
      </span>
    );
  }
  return <span style={{ color: colors.text3, fontSize: '11px' }}>—</span>;
}

function HoldingsButton({
  expanded,
  onToggle,
}: {
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={`expand-btn${expanded ? ' open' : ''}`}
      onClick={onToggle}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        background: 'none',
        border: 'none',
        color: colors.text3,
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '10px',
        cursor: 'pointer',
        padding: 0,
        letterSpacing: '0.5px',
      }}
    >
      <span
        style={{
          transition: 'transform .2s',
          display: 'inline-block',
          transform: expanded ? 'rotate(90deg)' : undefined,
        }}
      >
        ▸
      </span>{' '}
      TOP 10
    </button>
  );
}

function HoldingsPanel({ sym, holdings }: { sym: string; holdings: Holding[] }) {
  const meta = getSymbolMeta(sym);
  return (
    <div className="holdings-inner" style={{ padding: '8px 11px 10px 28px', background: colors.bg4 }}>
      <div
        className="h-title"
        style={{
          fontSize: '10px',
          color: colors.text3,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}
      >
        TOP 10 HOLDINGS BY WEIGHT — {meta.name}
      </div>
      <div className="h-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        {holdings.map((h) => (
          <div
            key={h.s}
            className="h-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: colors.bg3,
              border: `1px solid ${colors.border}`,
              borderRadius: '2px',
              padding: '3px 7px',
              fontSize: '11px',
            }}
          >
            <span className="h-w" style={{ color: colors.accent, fontSize: '10px', minWidth: '30px', textAlign: 'right' }}>
              {h.w.toFixed(1)}%
            </span>
            <span className="h-sym" style={{ color: colors.text, fontWeight: 500 }}>
              {h.s}
            </span>
            <span className="h-nm" style={{ color: colors.text3, fontSize: '10px' }}>
              {h.n}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const MarketTable: React.FC<MarketTableProps> = ({
  data,
  holdings = {},
  rank = false,
  hasPrice = true,
  isYield = false,
  showSpark = true,
  showTrend = false,
  showHoldings = false,
  benchmarkSym,
  sortBy = 'w1',
  sortOrder = 'desc',
  nameLabel = 'Name',
  priceLabel = 'Price',
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      const aVal = Number((a as unknown as Record<string, unknown>)[sortBy] ?? 0);
      const bVal = Number((b as unknown as Record<string, unknown>)[sortBy] ?? 0);
      const cmp = aVal - bVal;
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [data, sortBy, sortOrder]);

  const colCount =
    (rank ? 1 : 0) +
    1 +
    (hasPrice ? 1 : 0) +
    4 +
    (showSpark ? 1 : 0) +
    (showTrend ? 1 : 0) +
    (showHoldings ? 1 : 0);

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'IBM Plex Mono, monospace' }}>
      <thead>
        <tr>
          {rank && <th style={{ ...thStyle, textAlign: 'left' }}>#</th>}
          <th style={{ ...thStyle, textAlign: 'left' }}>{nameLabel}</th>
          {hasPrice && <th style={{ ...thStyle, textAlign: 'right' }}>{isYield ? 'Yield%' : priceLabel}</th>}
          <th style={{ ...thStyle, textAlign: 'right' }}>{isYield ? '1D (bps)' : '1D%'}</th>
          <th style={{ ...thStyle, textAlign: 'right' }}>1W%</th>
          <th style={{ ...thStyle, textAlign: 'right' }}>52W Hi%</th>
          <th style={{ ...thStyle, textAlign: 'right' }}>YTD%</th>
          {showSpark && <th style={{ ...thStyle, textAlign: 'center' }}>5D</th>}
          {showTrend && <th style={{ ...thStyle, textAlign: 'center' }}>Trend</th>}
          {showHoldings && <th style={{ ...thStyle, textAlign: 'left' }}>Holdings</th>}
        </tr>
      </thead>
      <tbody>
        {sorted.map((item, idx) => {
          const meta = getSymbolMeta(item.sym);
          const displayName = item.name || meta.name;
          const flag = item.flag || meta.flag;
          const isBenchmark = benchmarkSym && item.sym === benchmarkSym;
          const symHoldings = holdings[item.sym];
          const isExpanded = expanded[item.sym] ?? false;

          return (
            <React.Fragment key={item.sym}>
              <tr
                className={isBenchmark ? 'bench-row' : undefined}
                style={{
                  borderBottom: `1px solid rgba(31,90,255,.1)`,
                  background: isBenchmark ? 'rgba(31,90,255,.04)' : undefined,
                }}
              >
                {rank && (
                  <td style={{ ...tdStyle, textAlign: 'left' }}>
                    <RankBadge rank={idx + 1} />
                  </td>
                )}
                <td style={{ ...tdStyle, textAlign: 'left' }}>
                  <SymbolLink sym={item.sym} name={displayName} flag={flag} />
                  <span style={{ color: colors.text3, fontSize: '10px', display: 'block', letterSpacing: '0.5px' }}>
                    {meta.sym || item.sym}
                  </span>
                </td>
                {hasPrice && item.price !== undefined && (
                  <td style={{ ...tdStyle, textAlign: 'right', color: colors.text }}>
                    {formatPrice(item.price)}
                  </td>
                )}
                {hasPrice && item.price === undefined && (
                  <td style={{ ...tdStyle, textAlign: 'right', color: colors.text3 }}>—</td>
                )}
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  {isYield ? <BpsCell value={item.d1} /> : <PctCell value={item.d1} />}
                </td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <PctCell value={item.w1} badge />
                </td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <PctCell value={item.hi52} maxPct={30} />
                </td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <PctCell value={item.ytd} maxPct={20} />
                </td>
                {showSpark && (
                  <td style={{ ...tdStyle, textAlign: 'center', padding: '4px 8px' }}>
                    <Sparkline data={item.spark ?? []} />
                  </td>
                )}
                {showTrend && (
                  <td style={{ ...tdStyle, textAlign: 'center', padding: '3px 8px' }}>
                    <TrendCell value={item.ema_uptrend} />
                  </td>
                )}
                {showHoldings && (
                  <td style={{ ...tdStyle, textAlign: 'left' }}>
                    {symHoldings?.length ? (
                      <HoldingsButton
                        expanded={isExpanded}
                        onToggle={() =>
                          setExpanded((prev) => ({ ...prev, [item.sym]: !prev[item.sym] }))
                        }
                      />
                    ) : (
                      <span style={{ color: colors.text3, fontSize: '9px' }}>—</span>
                    )}
                  </td>
                )}
              </tr>
              {showHoldings && isExpanded && symHoldings?.length ? (
                <tr className="holdings-row show">
                  <td colSpan={colCount} style={{ padding: 0 }}>
                    <HoldingsPanel sym={item.sym} holdings={symHoldings} />
                  </td>
                </tr>
              ) : null}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};
