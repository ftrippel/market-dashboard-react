import { useChartModal } from '../../context/ChartModalContext';
import { colors } from '../../utils/formatting';
import { Icon } from './Icon';

export function TradingViewModal() {
  const { chart, closeChart } = useChartModal();

  if (!chart.open) return null;

  return (
    <div
      id="tv-modal"
      className="tv-modal open"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeChart();
      }}
    >
      <div id="tv-modal-box">
        <div id="tv-modal-hdr">
          <div id="tv-modal-title">
            {chart.name} · {chart.tvSym}
          </div>
          <button type="button" onClick={closeChart}>
            <Icon name="close" size="xs" />
            CLOSE
          </button>
        </div>
        <div id="tv-frame-wrap">
          <iframe
            id="tv-frame"
            title={`TradingView chart for ${chart.name}`}
            src={chart.embedUrl}
            frameBorder={0}
            allowTransparency
            scrolling="no"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

export function SymbolLink({
  sym,
  name,
  flag,
}: {
  sym: string;
  name: string;
  flag?: string;
}) {
  const { openChart } = useChartModal();

  return (
    <button
      type="button"
      className="tn-link"
      onClick={() => openChart(sym, name)}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        textAlign: 'left',
        color: colors.text,
        fontWeight: 500,
        fontSize: '12px',
        fontFamily: 'inherit',
        borderBottom: `1px dotted ${colors.linkUnderline}`,
      }}
    >
      {flag ? `${flag} ` : ''}
      {name}
    </button>
  );
}
