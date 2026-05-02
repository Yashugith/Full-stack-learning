import React from 'react';
import { STATUS_CONFIG } from '../../data/mockData';

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, color: '#888', bg: 'rgba(136,136,136,0.1)' };
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '3px 8px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.03em',
      background: config.bg,
      color: config.color,
      border: `1px solid ${config.color}22`,
      whiteSpace: 'nowrap',
      fontFamily: 'var(--font-mono)',
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: config.color,
        animation: status === 'in_transit' ? 'pulse-dot 1.5s ease-in-out infinite' : 'none',
      }} />
      {config.label}
    </span>
  );
}
