import type { MarketData, MarketState, Holding } from '../types';

interface RawData {
  generated_at?: string;
  futures?: MarketData[];
  dxvix?: MarketData[];
  crypto?: MarketData[];
  metals?: MarketData[];
  commod?: MarketData[];
  yields?: MarketData[];
  global?: MarketData[];
  etfmain?: MarketData[];
  submarket?: MarketData[];
  sector?: MarketData[];
  sectorew?: MarketData[];
  thematic?: MarketData[];
  country?: MarketData[];
  breadth?: MarketState['breadth'];
  holdings?: Record<string, Holding[]>;
}

export async function fetchMarketData(): Promise<MarketState> {
  const response = await fetch(`${import.meta.env.BASE_URL}data.json?_=${Date.now()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  const data: RawData = await response.json();
  return transformData(data);
}

function sortByW1(data: MarketData[]): MarketData[] {
  return [...data].sort((a, b) => (b.w1 ?? 0) - (a.w1 ?? 0));
}

function prepareSectors(
  sectors: MarketData[] | undefined,
  etfmain: MarketData[] | undefined,
  benchmarkSym: string
): MarketData[] {
  const benchmark = etfmain?.find((e) => e.sym === benchmarkSym);
  let data = sectors ? [...sectors] : [];
  if (benchmark && !data.find((e) => e.sym === benchmarkSym)) {
    data.push({ ...benchmark });
  }
  return sortByW1(data);
}

function transformData(raw: RawData): MarketState {
  const etfmain = raw.etfmain ?? [];

  return {
    futures: raw.futures ?? [],
    dxvix: raw.dxvix ?? [],
    crypto: raw.crypto ?? [],
    metals: raw.metals ?? [],
    commodities: raw.commod ?? [],
    yields: raw.yields ?? [],
    global: raw.global ?? [],
    etfs: etfmain,
    submkt: sortByW1(raw.submarket ?? []),
    sectors: prepareSectors(raw.sector, etfmain, 'SPY'),
    sectorsEW: prepareSectors(raw.sectorew, etfmain, 'RSP'),
    thematic: sortByW1(raw.thematic ?? []).slice(0, 10),
    country: sortByW1(raw.country ?? []),
    breadth: raw.breadth ?? null,
    holdings: raw.holdings ?? {},
    generatedAt: raw.generated_at ?? null,
    lastUpdated: raw.generated_at ? new Date(raw.generated_at) : new Date(),
    loading: false,
    error: null,
  };
}
