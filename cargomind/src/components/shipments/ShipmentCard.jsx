import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, AlertTriangle, Package } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import ProgressBar from '../ui/ProgressBar';
import { STATUS_CONFIG } from '../../data/mockData';
import './ShipmentCard.css';

export default function ShipmentCard({ shipment, onClick, index = 0 }) {
  const config = STATUS_CONFIG[shipment.status];
  const hasAlert = shipment.alerts.length > 0;

  return (
    <motion.div
      className={`shipment-card ${hasAlert ? 'has-alert' : ''}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => onClick(shipment)}
      whileHover={{ y: -2 }}
    >
      {hasAlert && (
        <div className="alert-strip">
          <AlertTriangle size={10} />
          {shipment.alerts[0].message}
        </div>
      )}

      <div className="sc-header">
        <div className="sc-id-group">
          <Package size={13} className="sc-pkg-icon" />
          <span className="sc-id">{shipment.id}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StatusBadge status={shipment.status} />
          <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>

      <div className="sc-route">
        <div className="sc-city">
          <span className="sc-country">{shipment.origin.country}</span>
          <span className="sc-city-name">{shipment.origin.city}</span>
        </div>
        <div className="sc-route-line">
          <div className="sc-dot" />
          <div className="sc-line">
            <motion.div
              className="sc-line-fill"
              initial={{ width: 0 }}
              animate={{ width: `${shipment.progress}%` }}
              transition={{ duration: 0.9, delay: 0.3 + index * 0.05 }}
              style={{ background: config?.color }}
            />
          </div>
          <div className="sc-dot" style={{ background: shipment.status === 'delivered' ? 'var(--green)' : 'var(--border-bright)' }} />
        </div>
        <div className="sc-city" style={{ textAlign: 'right' }}>
          <span className="sc-country">{shipment.destination.country}</span>
          <span className="sc-city-name">{shipment.destination.city}</span>
        </div>
      </div>

      <div className="sc-meta">
        <div className="sc-meta-item">
          <span className="meta-label">Carrier</span>
          <span className="meta-val">{shipment.carrier}</span>
        </div>
        <div className="sc-meta-item">
          <span className="meta-label">Container</span>
          <span className="meta-val mono">{shipment.containerType}</span>
        </div>
        <div className="sc-meta-item">
          <span className="meta-label">ETA</span>
          <span className="meta-val mono">{shipment.eta}</span>
        </div>
        <div className="sc-meta-item">
          <span className="meta-label">Commodity</span>
          <span className="meta-val">{shipment.commodity}</span>
        </div>
      </div>

      <div className="sc-progress-row">
        <span className="sc-progress-label">Journey Progress</span>
        <span className="sc-progress-pct" style={{ color: config?.color }}>{shipment.progress}%</span>
      </div>
      <ProgressBar value={shipment.progress} color={config?.color} height={3} />
    </motion.div>
  );
}
