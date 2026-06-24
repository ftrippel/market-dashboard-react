import { create } from 'zustand';
import type { MarketState } from '../types';

interface MarketStore extends MarketState {
  loadAll: (data: Partial<MarketState>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
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
}));
