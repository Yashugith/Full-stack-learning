import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, CheckCircle, Clock, AlertCircle, Search } from 'lucide-react';
import './Documents.css';

const DOCUMENTS = [
  { id: 'DOC-001', name: 'Bill of Lading', shipment: 'SHP-2024-7821', type: 'BOL', status: 'approved', date: '2024-03-01', size: '248 KB' },
  { id: 'DOC-002', name: 'Commercial Invoice', shipment: 'SHP-2024-7821', type: 'Invoice', status: 'approved', date: '2024-03-01', size: '124 KB' },
  { id: 'DOC-003', name: 'Packing List', shipment: 'SHP-2024-7821', type: 'Packing', status: 'approved', date: '2024-03-01', size: '96 KB' },
  { id: 'DOC-004', name: 'Bill of Lading', shipment: 'SHP-2024-7734', type: 'BOL', status: 'pending', date: '2024-03-05', size: '312 KB' },
  { id: 'DOC-005', name: 'Certificate of Origin', shipment: 'SHP-2024-7734', type: 'Certificate', status: 'pending', date: '2024-03-05', size: '186 KB' },
  { id: 'DOC-006', name: 'Customs Declaration', shipment: 'SHP-2024-7698', type: 'Customs', status: 'required', date: '2024-03-10', size: '—' },
  { id: 'DOC-007', name: 'Commercial Invoice', shipment: 'SHP-2024-7698', type: 'Invoice', status: 'approved', date: '2024-03-10', size: '148 KB' },
  { id: 'DOC-008', name: 'Insurance Certificate', shipment: 'SHP-2024-7588', type: 'Insurance', status: 'approved', date: '2024-03-08', size: '220 KB' },
];

const STATUS_MAP = {
  approved: { icon: CheckCircle, color: 'var(--green)', label: 'Approved' },
  pending: { icon: Clock, color: 'var(--yellow)', label: 'Pending Review' },
  required: { icon: AlertCircle, color: 'var(--red)', label: 'Required' },
};

const TYPE_COLORS = {
  BOL: 'var(--accent)', Invoice: 'var(--yellow)', Packing: 'var(--green)',
  Certificate: 'var(--orange)', Customs: 'var(--red)', Insurance: 'var(--text-secondary)',
};

export default function Documents() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const types = ['all', ...new Set(DOCUMENTS.map(d => d.type))];

  const filtered = DOCUMENTS.filter(d => {
    const matchSearch = !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.shipment.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || d.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="docs-page">
      <div className="docs-toolbar">
        <div className="docs-search">
          <Search size={13} style={{ color: 'var(--text-muted)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search documents..."
          />
        </div>
        <div className="type-filters">
          {types.map(t => (
            <button
              key={t}
              className={`filter-chip ${typeFilter === t ? 'active' : ''}`}
              onClick={() => setTypeFilter(t)}
            >
              {t === 'all' ? 'All Types' : t}
            </button>
          ))}
        </div>
      </div>

      <div className="docs-summary">
        {[
          { label: 'Total Documents', val: DOCUMENTS.length, color: 'var(--text-primary)' },
          { label: 'Approved', val: DOCUMENTS.filter(d => d.status === 'approved').length, color: 'var(--green)' },
          { label: 'Pending Review', val: DOCUMENTS.filter(d => d.status === 'pending').length, color: 'var(--yellow)' },
          { label: 'Required', val: DOCUMENTS.filter(d => d.status === 'required').length, color: 'var(--red)' },
        ].map(item => (
          <div key={item.label} className="doc-stat">
            <span style={{ color: item.color, fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 700 }}>{item.val}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="docs-table">
        <div className="docs-table-header">
          <span>Document</span>
          <span>Shipment</span>
          <span>Type</span>
          <span>Date</span>
          <span>Size</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {filtered.map((doc, i) => {
          const StatusIcon = STATUS_MAP[doc.status]?.icon || FileText;
          return (
            <motion.div
              key={doc.id}
              className="docs-row"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="dr-name">
                <FileText size={13} style={{ color: TYPE_COLORS[doc.type] }} />
                <span>{doc.name}</span>
              </div>
              <span className="dr-shipment">{doc.shipment}</span>
              <span className="dr-type" style={{ color: TYPE_COLORS[doc.type] }}>{doc.type}</span>
              <span className="dr-date">{doc.date}</span>
              <span className="dr-size">{doc.size}</span>
              <div className="dr-status" style={{ color: STATUS_MAP[doc.status]?.color }}>
                <StatusIcon size={11} />
                <span>{STATUS_MAP[doc.status]?.label}</span>
              </div>
              <div className="dr-actions">
                <button className="doc-action-btn" title="Preview"><Eye size={12} /></button>
                <button className="doc-action-btn" title="Download" disabled={doc.status === 'required'}>
                  <Download size={12} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
