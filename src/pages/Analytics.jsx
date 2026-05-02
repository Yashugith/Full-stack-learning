import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { MONTHLY_VOLUME } from '../data/mockData';
import './Analytics.css';

const DELAY_DATA = [
  { week: 'W1', onTime: 94, delayed: 6 },
  { week: 'W2', onTime: 89, delayed: 11 },
  { week: 'W3', onTime: 92, delayed: 8 },
  { week: 'W4', onTime: 87, delayed: 13 },
  { week: 'W5', onTime: 95, delayed: 5 },
  { week: 'W6', onTime: 91, delayed: 9 },
];

const LANE_DATA = [
  { lane: 'Asia-USEC', volume: 38, revenue: 1240 },
  { lane: 'Asia-USWC', volume: 52, revenue: 1810 },
  { lane: 'Europe-USEC', volume: 29, revenue: 980 },
  { lane: 'Intra-Asia', volume: 41, revenue: 720 },
  { lane: 'Asia-EU', volume: 33, revenue: 1450 },
  { lane: 'ME-Asia', volume: 18, revenue: 390 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-bright)',
      borderRadius: 8,
      padding: '8px 12px',
      fontSize: 12,
    }}>
      <p style={{ color: 'var(--text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}{p.dataKey === 'revenue' ? 'K' : '%'}
        </p>
      ))}
    </div>
  );
};

const SectionTitle = ({ title, sub }) => (
  <div style={{ marginBottom: 16 }}>
    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
    {sub && <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>{sub}</p>}
  </div>
);

export default function Analytics() {
  return (
    <div className="analytics-page">
      <div className="analytics-grid">
        {/* On-Time Performance */}
        <motion.div
          className="an-card"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <SectionTitle title="On-Time Performance" sub="Weekly breakdown (%)" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DELAY_DATA} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="onTime" name="On-Time %" fill="var(--green)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="delayed" name="Delayed %" fill="var(--red)" radius={[4, 4, 0, 0]} opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Shipment Volume Trend */}
        <motion.div
          className="an-card"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <SectionTitle title="Monthly Shipment Volume" sub="6-month trend" />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY_VOLUME}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="shipments" name="Shipments" stroke="var(--accent)" strokeWidth={2} fill="url(#volGrad)" dot={{ fill: 'var(--accent)', strokeWidth: 0, r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Revenue by Lane */}
        <motion.div
          className="an-card an-card--full"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <SectionTitle title="Revenue by Trade Lane" sub="$K — current quarter" />
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={LANE_DATA} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="lane" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill="var(--yellow)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          className="an-card"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SectionTitle title="Key Performance Indicators" />
          <div className="kpi-grid">
            {[
              { label: 'Avg Transit Time', value: '18.4', unit: 'days', change: '-2.1', good: true },
              { label: 'Claims Rate', value: '0.8', unit: '%', change: '-0.3%', good: true },
              { label: 'Booking Lead Time', value: '12.2', unit: 'days', change: '+1.4', good: false },
              { label: 'CO₂ per TEU', value: '2.14', unit: 'tons', change: '-0.12', good: true },
              { label: 'Container Utilization', value: '84', unit: '%', change: '+5%', good: true },
              { label: 'Customs Dwell Time', value: '2.8', unit: 'days', change: '-0.7', good: true },
            ].map(kpi => (
              <div key={kpi.label} className="kpi-card">
                <span className="kpi-label">{kpi.label}</span>
                <div className="kpi-value">
                  {kpi.value}<span className="kpi-unit">{kpi.unit}</span>
                </div>
                <span className={`kpi-change ${kpi.good ? 'good' : 'bad'}`}>{kpi.change}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
