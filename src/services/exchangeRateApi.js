// ExchangeRate-API (free tier) — https://www.exchangerate-api.com
// Provides live currency exchange rates used for freight cost conversion.
// We use the free endpoint (no key required for base USD rates).

const BASE_URL = 'https://open.er-api.com/v6/latest/USD';

export async function fetchExchangeRates() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error('Rate fetch failed');
    const data = await response.json();
    return {
      rates: data.rates,
      lastUpdate: data.time_last_update_utc,
      success: true,
    };
  } catch (err) {
    // Fallback mock rates when API is unavailable
    return {
      rates: { USD: 1, EUR: 0.92, GBP: 0.79, CNY: 7.23, SGD: 1.34, AED: 3.67, JPY: 149.2, KRW: 1325 },
      lastUpdate: new Date().toUTCString(),
      success: false,
    };
  }
}

export function convertCurrency(amount, fromCurrency, toCurrency, rates) {
  if (!rates || fromCurrency === toCurrency) return amount;
  const usdAmount = fromCurrency === 'USD' ? amount : amount / (rates[fromCurrency] || 1);
  return toCurrency === 'USD' ? usdAmount : usdAmount * (rates[toCurrency] || 1);
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
