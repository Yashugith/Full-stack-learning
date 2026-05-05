import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff, ArrowUpDown } from 'lucide-react';
import { useExchangeRates } from '../hooks/useExchangeRates';
import { convertCurrency, formatCurrency } from '../services/exchangeRateApi';
import { FREIGHT_RATES } from '../data/mockData';
import './FreightRates.css';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CNY', 'SGD', 'AED', 'JPY', 'KRW'];

export default function FreightRates() {
  const { rates, loading, lastUpdate, liveData } = useExchangeRates();
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('10000');

  const converted = rates && !isNaN(parseFloat(amount))
    ? convertCurrency(parseFloat(amount), fromCurrency, toCurrency, rates)
    : null;

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="rates-page">
      {/* API Status Banner */}
      <div className={`api-banner ${liveData ? 'live' : 'cached'}`}>
        {liveData ? <Wifi size={13} /> : <WifiOff size={13} />}
        <span>
          {liveData
            ? `Live exchange rates from ExchangeRate-API — updated ${lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : '...'}`
            : 'Using cached fallback rates — API may be temporarily unavailable'}
        </span>
        {loading && <RefreshCw size={12} className="spin" />}
      </div>

      <div className="rates-layout">
        {/* Currency Converter - Real API */}
        <motion.div
          className="converter-card"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        >
          <div className="converter-header">
            <div>
              <h3 className="conv-title">Currency Converter</h3>
              <p className="conv-sub">Live rates via ExchangeRate-API</p>
            </div>
            <div className={`api-dot ${liveData ? 'live' : ''}`} />
          </div>

          <div className="converter-form">
            <div className="conv-input-group">
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="conv-input"
                placeholder="10000"
              />
            </div>

            <div className="conv-currencies">
              <div className="conv-curr-group">
                <label>From</label>
                <select
                  value={fromCurrency}
                  onChange={e => setFromCurrency(e.target.value)}
                  className="conv-select"
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <button className="swap-btn" onClick={swapCurrencies}>
                <ArrowUpDown size={14} />
              </button>

              <div className="conv-curr-group">
                <label>To</label>
                <select
                  value={toCurrency}
                  onChange={e => setToCurrency(e.target.value)}
                  className="conv-select"
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="conv-result loading">
                <div className="skeleton" style={{ height: 40, width: '70%' }} />
              </div>
            ) : converted !== null ? (
              <div className="conv-result">
                <div className="conv-from-amount">
                  {parseFloat(amount).toLocaleString()} {fromCurrency}
                </div>
                <div className="conv-equals">=</div>
                <div className="conv-to-amount">
                  {formatCurrency(converted, toCurrency)}
                </div>
                <div className="conv-rate-display">
                  1 {fromCurrency} = {rates?.[toCurrency] && (rates[toCurrency] / (rates[fromCurrency] || 1)).toFixed(4)} {toCurrency}
                </div>
              </div>
            ) : null}
          </div>

          {/* All rates vs USD */}
          <div className="all-rates">
            <p className="all-rates-title">All rates vs USD</p>
            <div className="rates-chips">
              {loading
                ? CURRENCIES.map(c => <div key={c} className="skeleton" style={{ height: 32, width: 80 }} />)
                : CURRENCIES.filter(c => c !== 'USD').map(c => (
                  <div key={c} className="rate-chip">
                    <span className="rc-curr">{c}</span>
                    <span className="rc-rate">{rates?.[c]?.toFixed(3) ?? '—'}</span>
                  </div>
                ))}
            </div>
          </div>
        </motion.div>

        {/* Spot Freight Rates */}
        <motion.div
          className="spot-card"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="conv-title" style={{ marginBottom: 16 }}>Spot Freight Rates</h3>
          <div className="spot-table">
            <div className="spot-header">
              <span>Route</span>
              <span>Mode</span>
              <span>Rate (USD)</span>
              <span>7D Change</span>
            </div>
            {FREIGHT_RATES.map((r, i) => (
              <motion.div
                key={r.route}
                className="spot-row"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
              >
                <div className="spot-route-info">
                  <span className="sr-route">{r.route}</span>
                </div>
                <span className="sr-mode">{r.mode}</span>
                <span className="sr-price">${r.rate}{r.unit}</span>
                <div className="sr-change-wrap">
                  <span className={`sr-change ${r.change >= 0 ? 'up' : 'down'}`}>
                    {r.change >= 0 ? '▲' : '▼'} {Math.abs(r.change)}%
                  </span>
                  <div className="sr-bar">
                    <motion.div
                      className={`sr-bar-fill ${r.change >= 0 ? 'up' : 'down'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(Math.abs(r.change) * 5, 100)}%` }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.06 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="market-note">
            <span>⚡</span>
            <p>Freight rates are indicative and updated weekly from carrier tariff schedules. Final rates may vary based on equipment availability, bunker surcharges, and port fees.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
