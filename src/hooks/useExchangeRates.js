import { useState, useEffect } from 'react';
import { fetchExchangeRates } from '../services/exchangeRateApi';

export function useExchangeRates() {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [liveData, setLiveData] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await fetchExchangeRates();
      setRates(result.rates);
      setLastUpdate(result.lastUpdate);
      setLiveData(result.success);
      setLoading(false);
    }
    load();
    // Refresh every 30 minutes
    const interval = setInterval(load, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { rates, loading, lastUpdate, liveData };
}
