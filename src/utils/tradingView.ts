const TV_SYMBOL_MAP: Record<string, string> = {
  'ES1!': 'OANDA:SPX500USD',
  'NQ1!': 'OANDA:NAS100USD',
  'RTY1!': 'OANDA:US2000USD',
  'YM1!': 'OANDA:US30USD',
  'DX-Y.NYB': 'CAPITALCOM:DXY',
  'CBOE:VIX': 'AMEX:VIXY',
  VIX: 'AMEX:VIXY',
  'GC1!': 'OANDA:XAUUSD',
  'SI1!': 'OANDA:XAGUSD',
  'HG1!': 'CAPITALCOM:COPPER',
  'PL1!': 'OANDA:XPTUSD',
  'PA1!': 'OANDA:XPDUSD',
  'ALI1!': 'AMEX:JJU',
  'CL1!': 'OANDA:WTICOUSD',
  'NG1!': 'OANDA:NATGASUSD',
  US2Y: 'NASDAQ:SHY',
  US10Y: 'NASDAQ:IEF',
  US30Y: 'NASDAQ:TLT',
  '^N225': 'OANDA:JP225USD',
  '^KS11': 'AMEX:EWY',
  '^NSEI': 'AMEX:INDA',
  '000001.SS': 'SSE:000001',
  '000300.SS': 'SZSE:399300',
  '^HSI': 'FXOPEN:HSI',
  '^FTSE': 'OANDA:UK100GBP',
  '^FCHI': 'OANDA:FR40EUR',
  '^GDAXI': 'OANDA:DE30EUR',
  DXY: 'CAPITALCOM:DXY',
  UKX: 'OANDA:UK100GBP',
  BTC: 'CRYPTOCAP:BTC',
  ETH: 'CRYPTOCAP:ETH',
  SOL: 'CRYPTOCAP:SOL',
  XRP: 'CRYPTOCAP:XRP',
};

export function toTradingViewSymbol(rawSym: string): string {
  return TV_SYMBOL_MAP[rawSym] ?? rawSym;
}

export function buildTradingViewEmbedUrl(tvSym: string, theme: 'light' | 'dark' = 'dark'): string {
  const studies = JSON.stringify([
    { id: 'MAExp@tv-basicstudies', inputs: { length: 20 } },
    { id: 'MASimple@tv-basicstudies', inputs: { length: 50 } },
  ]);

  const params = new URLSearchParams({
    frameElementId: 'tv_frame',
    symbol: tvSym,
    interval: 'D',
    hidesidetoolbar: '0',
    symboledit: '1',
    saveimage: '0',
    toolbarbg: theme === 'dark' ? '131722' : 'f1f3f6',
    studies,
    theme,
    style: '1',
    timezone: 'exchange',
    withdateranges: '1',
    showpopupbutton: '1',
    overrides: '{}',
    enabled_features: '[]',
    disabled_features: '[]',
    locale: 'en',
  });

  return `https://s.tradingview.com/widgetembed/?${params.toString()}`;
}
