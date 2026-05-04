import React from 'react';
import { motion } from 'framer-motion';
import { Star, Shield, Clock, Globe } from 'lucide-react';
import { useFreight } from '../context/FreightContext';
import ProgressBar from '../components/ui/ProgressBar';
import './Carriers.css';

function StarRating({ rating }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={11}
          fill={s <= Math.round(rating) ? 'var(--yellow)' : 'none'}
          stroke={s <= Math.round(rating) ? 'var(--yellow)' : 'var(--text-muted)'}
        />
      ))}
      <span className="rating-val">{rating}</span>
    </div>
  );
}

export default function Carriers() {
  const { carriers } = useFreight();

  return (
    <div className="carriers-page">
      <div className="carriers-grid">
        {carriers.map((carrier, i) => (
          <motion.div
            key={carrier.code}
            className="carrier-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -2 }}
          >
            <div className="cc-header">
              <div className="cc-avatar">{carrier.code.slice(0, 2)}</div>
              <div className="cc-title">
                <h3>{carrier.name}</h3>
                <span className="cc-code">{carrier.code}</span>
              </div>
              <StarRating rating={carrier.rating} />
            </div>

            <div className="cc-metrics">
              <div className="cc-metric">
                <div className="ccm-header">
                  <span className="ccm-label"><Clock size={10} /> On-Time Rate</span>
                  <span className="ccm-val" style={{ color: carrier.onTime >= 90 ? 'var(--green)' : carrier.onTime >= 85 ? 'var(--yellow)' : 'var(--red)' }}>
                    {carrier.onTime}%
                  </span>
                </div>
                <ProgressBar
                  value={carrier.onTime}
                  color={carrier.onTime >= 90 ? 'var(--green)' : carrier.onTime >= 85 ? 'var(--yellow)' : 'var(--red)'}
                  height={4}
                />
              </div>

              <div className="cc-metric">
                <div className="ccm-header">
                  <span className="ccm-label"><Shield size={10} /> Reliability</span>
                  <span className="ccm-val" style={{ color: 'var(--accent)' }}>{carrier.reliability}%</span>
                </div>
                <ProgressBar value={carrier.reliability} color="var(--accent)" height={4} />
              </div>
            </div>

            <div className="cc-stats">
              <div className="cc-stat">
                <Globe size={12} style={{ color: 'var(--text-muted)' }} />
                <span className="cc-stat-val">{carrier.lanes}</span>
                <span className="cc-stat-label">Trade Lanes</span>
              </div>
              <div className="cc-divider" />
              <div className="cc-stat">
                <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                <span className="cc-stat-val">{carrier.avgDelay}d</span>
                <span className="cc-stat-label">Avg Delay</span>
              </div>
            </div>

            <div className={`cc-badge ${carrier.onTime >= 90 ? 'excellent' : carrier.onTime >= 85 ? 'good' : 'fair'}`}>
              {carrier.onTime >= 90 ? '🏆 Top Performer' : carrier.onTime >= 85 ? '✓ Reliable' : '⚠ Monitor'}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
