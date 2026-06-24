import { useEffect, useState } from 'react';
import { useMarketStore } from '../store/marketStore';
import { fetchMarketData } from '../services/api';

/**
 * Hook to fetch and manage market data
 */
export function useMarketData() {
  const store = useMarketStore();
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      store.setLoading(true);
      setError(null);
      const data = await fetchMarketData();
      store.loadAll(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load market data';
      setError(message);
      store.setError(message);
    } finally {
      store.setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Auto-refresh every hour (matches original HTML dashboard)
  useEffect(() => {
    const interval = setInterval(loadData, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { error, refetch: loadData };
}
