import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Package, Ship, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import ProgressBar from '../ui/ProgressBar';
import { STATUS_CONFIG } from '../../data/mockData';
import './ShipmentDetailPanel.css';

export default function ShipmentDetailPanel({ shipment, onClose }) {
  if (!shipment) return null;
  const config = STATUS_CONFIG[shipment.status];

  return (
    <AnimatePresence>
      {shipment && (
        <>
          <motion.div
            className="detail-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="detail-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          >
            {/* Header */}
            <div className="dp-header">
              <div>
                <div className="dp-id">{shipment.id}</div>
                <StatusBadge status={shipment.status} />
              </div>
              <button className="dp-close" onClick={onClose}><X size={16} /></button>
            </div>

            <div className="dp-body">
              {/* Alerts */}
              {shipment.alerts.map((alert, i) => (
                <div key={i} className="dp-alert">
                  <AlertTriangle size={14} />
                  <p>{alert.message}</p>
                </div>
              ))}

              {/* Route */}
              <div className="dp-section">
                <div className="dp-section-title"><MapPin size={12} /> Route</div>
                <div className="dp-route-visual">
                  <div className="dp-port">
                    <span className="dp-port-label">ORIGIN</span>
                    <span className="dp-port-city">{shipment.origin.city}</span>
                    <span className="dp-port-country">{shipment.origin.country}</span>
                  </div>
                  <div className="dp-route-mid">
                    {shipment.cargoPorts.length > 0 && (
                      <div className="dp-transit-ports">
                        {shipment.cargoPorts.map(p => (
                          <span key={p} className="dp-transit-badge">{p}</span>
                        ))}
                      </div>
                    )}
                    <div className="dp-route-arrow">→</div>
                  </div>
                  <div className="dp-port" style={{ textAlign: 'right' }}>
                    <span className="dp-port-label">DESTINATION</span>
                    <span className="dp-port-city">{shipment.destination.city}</span>
                    <span className="dp-port-country">{shipment.destination.country}</span>
                  </div>
                </div>
                <div className="dp-progress-section">
                  <div className="dp-progress-header">
                    <span>Journey Progress</span>
                    <span style={{ color: config?.color, fontFamily: 'var(--font-mono)' }}>
                      {shipment.progress}%
                    </span>
                  </div>
                  <ProgressBar value={shipment.progress} color={config?.color} height={6} />
                  <div className="dp-dates">
                    <div>
                      <span className="date-label">ETD</span>
                      <span className="date-val">{shipment.etd}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="date-label">ETA</span>
                      <span className="date-val">{shipment.eta}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cargo Details */}
              <div className="dp-section">
                <div className="dp-section-title"><Package size={12} /> Cargo Details</div>
                <div className="dp-grid">
                  {[
                    ['Commodity', shipment.commodity],
                    ['Container', shipment.container],
                    ['Type', shipment.containerType],
                    ['Weight', `${shipment.weight.toLocaleString()} kg`],
                    ['Value', `$${shipment.value.toLocaleString()}`],
                    ['Current Location', shipment.currentLocation],
                  ].map(([label, val]) => (
                    <div key={label} className="dp-detail-item">
                      <span className="dp-detail-label">{label}</span>
                      <span className="dp-detail-val">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carrier */}
              <div className="dp-section">
                <div className="dp-section-title"><Ship size={12} /> Carrier Info</div>
                <div className="dp-grid">
                  {[
                    ['Carrier', shipment.carrier],
                    ['Code', shipment.carrierCode],
                    ['Vessel', shipment.vessel],
                    ['Last Update', shipment.lastUpdate],
                  ].map(([label, val]) => (
                    <div key={label} className="dp-detail-item">
                      <span className="dp-detail-label">{label}</span>
                      <span className="dp-detail-val">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="dp-section">
                <div className="dp-section-title"><FileText size={12} /> Documents</div>
                <div className="dp-docs">
                  {shipment.documents.map(doc => (
                    <div key={doc} className="dp-doc-item">
                      <CheckCircle size={12} style={{ color: 'var(--green)' }} />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
