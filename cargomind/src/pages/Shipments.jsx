import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { List, Grid } from 'lucide-react';
import { useFreight } from '../context/FreightContext';
import ShipmentCard from '../components/shipments/ShipmentCard';
import ShipmentDetailPanel from '../components/shipments/ShipmentDetailPanel';
import StatusBadge from '../components/ui/StatusBadge';
import ProgressBar from '../components/ui/ProgressBar';
import { STATUS_CONFIG } from '../data/mockData';
import './Shipments.css';

const STATUS_FILTERS = ['all', 'in_transit', 'delayed', 'customs', 'delivered', 'processing'];

export default function Shipments() {
  const { filteredShipments, filterStatus, setFilterStatus, selectedShipment, setSelectedShipment } = useFreight();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  return (
    <div className="shipments-page">
      <ShipmentDetailPanel
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
      />

      {/* Toolbar */}
      <div className="sp-toolbar">
        <div className="status-filters">
          {STATUS_FILTERS.map(status => (
            <button
              key={status}
              className={`filter-chip ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'All Shipments' : STATUS_CONFIG[status]?.label || status}
            </button>
          ))}
        </div>
        <div className="view-toggles">
          <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
            <Grid size={14} />
          </button>
          <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
            <List size={14} />
          </button>
        </div>
      </div>

      {/* Count */}
      <div className="result-count">
        <span>{filteredShipments.length} shipment{filteredShipments.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="shipments-grid">
          {filteredShipments.map((s, i) => (
            <ShipmentCard
              key={s.id}
              shipment={s}
              index={i}
              onClick={setSelectedShipment}
            />
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="shipments-list-wrap">
          <div className="list-header">
            <span>ID</span>
            <span>Route</span>
            <span>Carrier</span>
            <span>Commodity</span>
            <span>Status</span>
            <span>Progress</span>
            <span>ETA</span>
          </div>
          {filteredShipments.map((s, i) => (
            <motion.div
              key={s.id}
              className="list-row"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelectedShipment(s)}
            >
              <span className="lr-id">{s.id}</span>
              <span className="lr-route">{s.origin.city} → {s.destination.city}</span>
              <span className="lr-carrier">{s.carrier}</span>
              <span className="lr-commodity">{s.commodity}</span>
              <span><StatusBadge status={s.status} /></span>
              <div className="lr-progress">
                <ProgressBar value={s.progress} color={STATUS_CONFIG[s.status]?.color} height={4} showLabel />
              </div>
              <span className="lr-eta">{s.eta}</span>
            </motion.div>
          ))}
        </div>
      )}

      {filteredShipments.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No shipments found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
