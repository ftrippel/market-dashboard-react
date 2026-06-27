import { create } from 'zustand';
import type { MarketState, MarketData } from '../types';

interface MarketStore extends MarketState {
  loadAll: (data: Partial<MarketState>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updatePrice: (sym: string, price: number, d1: number) => void;
}

const initialState: MarketState = {
  futures: [],
  dxvix: [],
  crypto: [],
  metals: [],
  commodities: [],
  yields: [],
  global: [],
  etfs: [],
  submkt: [],
  sectors: [],
  sectorsEW: [],
  thematic: [],
  country: [],
  breadth: null,
  holdings: {},
  generatedAt: null,
  lastUpdated: null,
  loading: true,
  error: null,
};

export const useMarketStore = create<MarketStore>((set) => ({
  ...initialState,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  loadAll: (data) =>
    set({
      ...initialState,
      ...data,
      loading: false,
      error: null,
    }),

  updatePrice: (sym, price, d1) =>
    set((state) => {
      const updateArray = <T extends MarketData>(arr: T[]): T[] =>
        arr.map((item) => (item.sym === sym ? { ...item, price, d1 } : item));

      return {
        futures: updateArray(state.futures),
        dxvix: updateArray(state.dxvix),
        crypto: updateArray(state.crypto),
        metals: updateArray(state.metals),
        commodities: updateArray(state.commodities),
        yields: updateArray(state.yields),
        global: updateArray(state.global),
        etfs: updateArray(state.etfs),
        submkt: updateArray(state.submkt),
        sectors: updateArray(state.sectors),
        sectorsEW: updateArray(state.sectorsEW),
        thematic: updateArray(state.thematic),
        country: updateArray(state.country),
      };
    }),
}));
