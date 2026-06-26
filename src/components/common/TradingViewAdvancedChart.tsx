import { memo, useEffect, useRef } from 'react';
import {
  TRADINGVIEW_ADVANCED_CHART_SCRIPT,
  buildAdvancedChartWidgetConfig,
} from '../../utils/tradingView';

interface TradingViewAdvancedChartProps {
  symbol: string;
  theme: 'light' | 'dark';
  onReady?: () => void;
}

export const TradingViewAdvancedChart = memo(function TradingViewAdvancedChart({
  symbol,
  theme,
  onReady,
}: TradingViewAdvancedChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const widgetHost = document.createElement('div');
    widgetHost.className = 'tradingview-widget-container__widget';
    widgetHost.style.height = '100%';
    widgetHost.style.width = '100%';

    const script = document.createElement('script');
    script.src = TRADINGVIEW_ADVANCED_CHART_SCRIPT;
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify(buildAdvancedChartWidgetConfig(symbol, theme));

    const finishLoading = () => {
      window.setTimeout(() => onReady?.(), 400);
    };

    script.addEventListener('load', finishLoading);
    script.addEventListener('error', finishLoading);

    container.replaceChildren(widgetHost, script);

    return () => {
      script.removeEventListener('load', finishLoading);
      script.removeEventListener('error', finishLoading);
    };
  }, [symbol, theme, onReady]);

  return (
    <div
      ref={containerRef}
      className="tradingview-widget-container tv-advanced-chart"
      style={{ height: '100%', width: '100%' }}
    />
  );
});
