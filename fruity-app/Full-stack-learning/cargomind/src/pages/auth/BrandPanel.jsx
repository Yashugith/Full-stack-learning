import React from 'react';

export default function BrandPanel() {
  return (
    <div className="auth-brand">
      <div className="ab-content">
        <div className="ab-logo">
          <div className="ab-logo-icon">⚡</div>
          <span className="ab-logo-name">CargoMind</span>
        </div>

        <h2 className="ab-headline">
          Freight intelligence<br />
          <span style={{ color: 'var(--accent)' }}>without the chaos.</span>
        </h2>
        <p className="ab-desc">
          Track global shipments, benchmark carriers, monitor live freight rates — all in one platform trusted by logistics teams worldwide.
        </p>

        <div className="ab-trust">
          {[
            'End-to-end shipment visibility across all modes',
            'Live freight rates for 10+ trade lanes',
            'Carrier scorecards — on-time, reliability, delays',
            'Document tracking — BOL, invoices, customs',
          ].map(item => (
            <div key={item} className="ab-trust-item">
              <div className="ab-trust-dot" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="ab-stats">
          {[
            { val: '12,400+', label: 'Shipments' },
            { val: '91%', label: 'On-Time' },
            { val: '48', label: 'Carriers' },
            { val: '$2B+', label: 'Cargo Value' },
          ].map(s => (
            <div key={s.label} className="ab-stat">
              <span className="ab-stat-val">{s.val}</span>
              <span className="ab-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
