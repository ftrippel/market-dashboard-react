import { useMemo, useState } from 'react';
import { FormattedNumberInput, Icon, Section } from '../../components/common';
import { colors, formatUsCurrency, formatUsInteger } from '../../utils/formatting';

type Direction = 'long' | 'short';

interface StopLevel {
  lbl: string;
  price: number;
  shares: number;
  pct: number;
  pnl: number;
  cls: 'sr-entry' | 'sr-mid' | 'sr-fin';
}

function levelColor(cls: StopLevel['cls']): string {
  if (cls === 'sr-entry') return colors.accent;
  if (cls === 'sr-fin') return colors.red;
  return colors.amber;
}

export function PositionCalculator() {
  const [direction, setDirection] = useState<Direction>('long');
  const [stops, setStops] = useState<1 | 2 | 3>(1);
  const [equity, setEquity] = useState(10_000_000);
  const [riskPct, setRiskPct] = useState(0.3);
  const [entry, setEntry] = useState(100);
  const [stop, setStop] = useState(95);

  const calc = useMemo(() => {
    if (!equity || !riskPct || !entry || !stop) return null;
    const rAmt = equity * (riskPct / 100);
    const rPts = Math.abs(entry - stop);
    if (!rPts) return null;

    const shares = Math.floor(rAmt / rPts);
    const posVal = shares * entry;
    const pctEq = (posVal / equity) * 100;

    const levels: StopLevel[] = [];
    if (stops === 1) {
      levels.push({
        lbl: 'Entry',
        price: entry,
        shares: 0,
        pct: 0,
        pnl: 0,
        cls: 'sr-entry',
      });
      levels.push({
        lbl: 'Final Stop',
        price: stop,
        shares: shares,
        pct: 100,
        pnl: -rPts * shares,
        cls: 'sr-fin',
      });
    } else if (stops === 2) {
      const mid = (entry + stop) / 2;
      const s1 = Math.floor(shares / 2);
      const s2 = shares - Math.floor(shares / 2);
      const pct1 = shares ? Math.round((s1 / shares) * 100) : 0;
      const pct2 = shares ? (100 - pct1) : 0;
      levels.push({
        lbl: 'Entry',
        price: entry,
        shares: 0,
        pct: 0,
        pnl: 0,
        cls: 'sr-entry',
      });
      levels.push({
        lbl: 'Stop 1 (mid)',
        price: mid,
        shares: s1,
        pct: pct1,
        pnl: -Math.abs(entry - mid) * s1,
        cls: 'sr-mid',
      });
      levels.push({
        lbl: 'Final Stop',
        price: stop,
        shares: s2,
        pct: pct2,
        pnl: -rPts * s2,
        cls: 'sr-fin',
      });
    } else {
      const gap = rPts / 3;
      const dDir = direction === 'long' ? -1 : 1;
      const s1 = Math.floor(shares / 3);
      const s2 = Math.floor(shares / 3);
      const s3 = shares - Math.floor(shares / 3) - Math.floor(shares / 3);
      const p1 = entry + gap * dDir;
      const p2 = entry + gap * 2 * dDir;
      const pct1 = shares ? Math.round((s1 / shares) * 100) : 0;
      const pct2 = shares ? Math.round((s2 / shares) * 100) : 0;
      const pct3 = shares ? (100 - pct1 - pct2) : 0;
      levels.push({
        lbl: 'Entry',
        price: entry,
        shares: 0,
        pct: 0,
        pnl: 0,
        cls: 'sr-entry',
      });
      levels.push({
        lbl: 'Stop 1 (⅓)',
        price: p1,
        shares: s1,
        pct: pct1,
        pnl: -(gap * s1),
        cls: 'sr-mid',
      });
      levels.push({
        lbl: 'Stop 2 (⅔)',
        price: p2,
        shares: s2,
        pct: pct2,
        pnl: -(gap * 2 * s2),
        cls: 'sr-mid',
      });
      levels.push({
        lbl: 'Final Stop',
        price: stop,
        shares: s3,
        pct: pct3,
        pnl: -(rPts * s3),
        cls: 'sr-fin',
      });
    }

    const totalPnl = levels.reduce((sum, lv) => sum + lv.pnl, 0);
    const totalSharesRemoved = levels.reduce((sum, lv) => sum + lv.shares, 0);
    const totalPctRemoved = levels.reduce((sum, lv) => sum + lv.pct, 0);

    const rrTargets = [1, 1.5, 2, 3, 4, 5]
      .filter((r) => r >= 2)
      .map((r) => {
        const tgt = direction === 'long' ? entry + rPts * r : entry - rPts * r;
        const pnl = rPts * r * shares;
        return { r, tgt, pnl };
      });

    return { shares, rAmt, posVal, rPts, pctEq, levels, rrTargets, totalPnl, totalSharesRemoved, totalPctRemoved };
  }, [direction, stops, equity, riskPct, entry, stop]);

  // RISK-BASED · STAGGERED STOPS

  return (
    <Section number="04" title="Position Sizing Calculator" subtitle="">
      <div className="calc-wrap">
        <div className="cpanel">
          <div className="c-ttl">
            <Icon name="chevron_right" size="sm" className="icon--label" />
            Trade Parameters
          </div>
          <div className="dir-tog">
            <button
              type="button"
              className={`dir-b long${direction === 'long' ? ' on' : ''}`}
              onClick={() => setDirection('long')}
            >
              <Icon name="arrow_upward" size="xs" /> LONG
            </button>
            <button
              type="button"
              className={`dir-b short${direction === 'short' ? ' on' : ''}`}
              onClick={() => setDirection('short')}
            >
              <Icon name="arrow_downward" size="xs" /> SHORT
            </button>
          </div>

          <div className="fg">
            <label className="fl">Account Equity ($)</label>
            <FormattedNumberInput value={equity} onChange={setEquity} />
          </div>
          <div className="fg">
            <label className="fl">Risk per Trade (%)</label>
            <FormattedNumberInput value={riskPct} onChange={setRiskPct} decimals={2} />
          </div>
          <div className="fr">
            <div className="fg">
              <label className="fl">Entry Price ($)</label>
              <FormattedNumberInput value={entry} onChange={setEntry} decimals={2} />
            </div>
            <div className="fg">
              <label className="fl">Stop Loss ($)</label>
              <FormattedNumberInput value={stop} onChange={setStop} decimals={2} />
            </div>
          </div>
          <div className="fg">
            <label className="fl">Notes</label>
            <input className="fi" type="text" placeholder="e.g. AAPL"  />
          </div>

          {calc && (
            <div className="res">
              <div className="res-big">{formatUsInteger(calc.shares)}</div>
              <div className="res-lbl">SHARES TO TRADE</div>
              <div className="res-sub">
                <div className="ri">
                  <div className="rv" style={{ color: colors.red }}>
                    {formatUsCurrency(Math.round(calc.rAmt))}
                  </div>
                  <div className="rl">Max Risk $</div>
                </div>
                <div className="ri">
                  <div className="rv">{formatUsCurrency(Math.round(calc.posVal))}</div>
                  <div className="rl">Position Value</div>
                </div>
                <div className="ri">
                  <div className="rv" style={{ color: colors.red }}>
                    {riskPct.toFixed(2)}%
                  </div>
                  <div className="rl">Max Risk %</div>
                </div>
                <div className="ri">
                  <div className="rv" style={{ color: colors.text2 }}>
                    {calc.pctEq.toFixed(1)}%
                  </div>
                  <div className="rl">% Equity</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="stops-panel">
          <div className="stops-hdr">
            <span style={{ fontSize: '9px', color: colors.text2, letterSpacing: '1px', textTransform: 'uppercase', marginRight: 'auto', display: 'inline-flex', alignItems: 'center' }}>
              <Icon name="chevron_right" size="xs" className="icon--label" />
              Staggered Stop Levels
            </span>
            <button type="button" className={`s-tab${stops === 1 ? ' on' : ''}`} onClick={() => setStops(1)}>
              1-STOP
            </button>
            <button type="button" className={`s-tab${stops === 2 ? ' on' : ''}`} onClick={() => setStops(2)}>
              2-STOP
            </button>
            <button type="button" className={`s-tab${stops === 3 ? ' on' : ''}`} onClick={() => setStops(3)}>
              3-STOP
            </button>
          </div>
          <div className="stops-body">
            <div className="sr-hdr">
              <span>Level</span>
              <span>Price</span>
              <span>Shares to Remove</span>
              <span>Shares to Remove %</span>
              <span>P&L at Stop</span>
              <span>P&L %</span>
            </div>
            {calc?.levels.map((lv) => (
              <div key={lv.lbl} className="sr">
                <span className="sr-lbl">{lv.lbl}</span>
                <span className="sr-price" style={{ color: levelColor(lv.cls), fontWeight: 600, fontSize: '14px' }}>
                  {formatUsCurrency(lv.price, 2)}
                </span>
                <span className="sr-shares" style={{ color: colors.text2, fontSize: '11px' }}>
                  {lv.shares === 0 ? '—' : `${formatUsInteger(lv.shares)} sh`}
                </span>
                <span className="sr-pct" style={{ color: colors.text2, fontSize: '11px' }}>
                  {lv.shares === 0 ? '—' : `${lv.pct}%`}
                </span>
                <span
                  className="sr-pnl"
                  style={{
                    color: lv.pnl < 0 ? colors.red : lv.pnl > 0 ? colors.green : colors.accent,
                    fontSize: '11px',
                  }}
                >
                  {lv.pnl === 0 ? '—' : formatUsCurrency(Math.round(lv.pnl))}
                </span>
                <span
                  className="sr-pnl-pct"
                  style={{
                    color: lv.pnl < 0 ? colors.red : lv.pnl > 0 ? colors.green : colors.accent,
                    fontSize: '11px',
                  }}
                >
                  {lv.pnl === 0 ? '—' : `${((lv.pnl / equity) * 100).toFixed(2)}%`}
                </span>
              </div>
            ))}

            {calc && (
              <div className="sr-total">
                <span className="sr-lbl">Total</span>
                <span className="sr-price" style={{ color: colors.text3 }}>—</span>
                <span className="sr-shares" style={{ color: colors.text2, fontSize: '11px' }}>
                  {calc.totalSharesRemoved === 0 ? '—' : `${formatUsInteger(calc.totalSharesRemoved)} sh`}
                </span>
                <span className="sr-pct" style={{ color: colors.text2, fontSize: '11px' }}>
                  {calc.totalSharesRemoved === 0 ? '—' : `${calc.totalPctRemoved}%`}
                </span>
                <span
                  className="sr-pnl"
                  style={{
                    color: calc.totalPnl < 0 ? colors.red : calc.totalPnl > 0 ? colors.green : colors.accent,
                    fontSize: '11px',
                  }}
                >
                  {calc.totalPnl === 0 ? '—' : formatUsCurrency(Math.round(calc.totalPnl))}
                </span>
                <span
                  className="sr-pnl-pct"
                  style={{
                    color: calc.totalPnl < 0 ? colors.red : calc.totalPnl > 0 ? colors.green : colors.accent,
                    fontSize: '11px',
                  }}
                >
                  {calc.totalPnl === 0 ? '—' : `${((calc.totalPnl / equity) * 100).toFixed(2)}%`}
                </span>
              </div>
            )}

            {calc && (
              <>
                <div style={{ marginTop: '22px', paddingTop: '12px', borderTop: `1px solid ${colors.border}` }}>
                  <div className="viz-note" style={{ marginBottom: '8px' }}>
                    R:R Targets
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        padding: '6px 0',
                        fontSize: '9px',
                        color: colors.text3,
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                    >
                      <span>Multiple of Risk</span>
                      <span style={{ textAlign: 'right' }}>Take Profit Level</span>
                    </div>
                    {calc.rrTargets.map(({ r, tgt }) => (
                      <div
                        key={r}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          padding: '8px 0',
                          borderBottom: `1px solid ${colors.border2}`,
                          fontSize: '11px',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ color: colors.text2, fontFamily: 'IBM Plex Mono, monospace' }}>{r}x</span>
                        <span
                          style={{
                            textAlign: 'right',
                            fontWeight: 600,
                            color: colors.green,
                            fontFamily: 'IBM Plex Mono, monospace',
                            fontSize: '13px',
                          }}
                        >
                          {formatUsCurrency(tgt, 2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
