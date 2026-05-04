import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Truck, AlertCircle, CheckCircle2, DollarSign, TrendingUp
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Sector
} from 'recharts';
import { useFreight } from '../context/FreightContext';
import StatCard from '../components/ui/StatCard';
import ShipmentCard from '../components/shipments/ShipmentCard';
import ShipmentDetailPanel from '../components/shipments/ShipmentDetailPanel';
import { MONTHLY_VOLUME, COMMODITY_BREAKDOWN, FREIGHT_RATES } from '../data/mockData';
import './Dashboard.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color, fontSize: 12 }}>
          {p.name}: {p.dataKey === 'revenue'
            ? `$${(p.value / 1000).toFixed(0)}K`
            : p.value}
        </p>
      ))}
    </div>
  );
};

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" fill="var(--text-primary)" fontSize={18} fontWeight={700}
        fontFamily="var(--font-display)">
        {payload.value}%
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--text-secondary)" fontSize={11}
        fontFamily="var(--font-mono)">
        {payload.name}
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6}
        startAngle={startAngle} endAngle={endAngle} fill={fill} />
    </g>
  );
};

export default function Dashboard() {
  const { stats, filteredShipments, selectedShipment, setSelectedShipment } = useFreight();
  const [activePieIndex, setActivePieIndex] = useState(0);

  const recentShipments = filteredShipments.slice(0, 3);

  return (
    <div className="dashboard">
      <ShipmentDetailPanel
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
      />

      {/* Stats Row */}
      <div className="stats-grid">
        <StatCard icon={Package} label="Total Shipments" value={stats.total}
          sub="This month" color="accent" index={0} />
        <StatCard icon={Truck} label="In Transit" value={stats.inTransit}
          sub="Active now" color="accent" index={1} />
        <StatCard icon={AlertCircle} label="Delayed" value={stats.delayed}
          sub="Needs attention" color="red" index={2} />
        <StatCard icon={CheckCircle2} label="Delivered" value={stats.delivered}
          sub="On time" color="green" index={3} />
        <StatCard icon={DollarSign} label="Cargo Value"
          value={`$${(stats.totalValue / 1000000).toFixed(2)}M`}
          sub="Total tracked value" color="yellow" index={4} />
        <StatCard icon={TrendingUp} label="On-Time Rate"
          value={`${stats.onTimeRate}%`}
          sub="vs 88% last month" color="green" index={5} />
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Volume & Revenue Area Chart */}
        <motion.div
          className="chart-card chart-card--large"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Shipment Volume & Revenue</h3>
              <p className="chart-sub">6-month trend</p>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-dot" style={{ background: 'var(--accent)' }} />
                <span>Shipments</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot" style={{ background: 'var(--green)' }} />
                <span>Revenue</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY_VOLUME} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="shipGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00e5a0" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00e5a0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="shipments" name="Shipments" stroke="#00d4ff" strokeWidth={2} fill="url(#shipGrad)" dot={false} />
              <Area type="monotone" dataKey="onTime" name="On-Time %" stroke="#00e5a0" strokeWidth={2} fill="url(#revGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Commodity Pie */}
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Commodity Mix</h3>
              <p className="chart-sub">By shipment volume</p>
            </div>
          </div>
          <div className="pie-wrap">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={COMMODITY_BREAKDOWN}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={80}
                  dataKey="value"
                  activeIndex={activePieIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setActivePieIndex(index)}
                  strokeWidth={0}
                >
                  {COMMODITY_BREAKDOWN.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="commodity-legend">
            {COMMODITY_BREAKDOWN.map(item => (
              <div key={item.name} className="commodity-item">
                <div className="c-dot" style={{ background: item.fill }} />
                <span className="c-name">{item.name}</span>
                <span className="c-pct">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-row">
        {/* Recent Shipments */}
        <div className="section-block">
          <div className="section-header">
            <h3 className="section-title">Recent Shipments</h3>
            <a href="/shipments" className="section-link">View all →</a>
          </div>
          <div className="recent-shipments">
            {recentShipments.map((s, i) => (
              <ShipmentCard
                key={s.id}
                shipment={s}
                index={i}
                onClick={setSelectedShipment}
              />
            ))}
          </div>
        </div>

        {/* Live Freight Rates */}
        <div className="section-block">
          <div className="section-header">
            <h3 className="section-title">Live Freight Rates</h3>
            <a href="/rates" className="section-link">Spot rates →</a>
          </div>
          <div className="rates-table">
            <div className="rates-header">
              <span>Route</span>
              <span>Mode</span>
              <span>Rate</span>
              <span>Δ 7D</span>
            </div>
            {FREIGHT_RATES.map((r, i) => (
              <motion.div
                key={r.route}
                className="rate-row"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
              >
                <span className="rate-route">{r.route}</span>
                <span className="rate-mode">{r.mode}</span>
                <span className="rate-price">${r.rate}{r.unit}</span>
                <span className={`rate-change ${r.change >= 0 ? 'pos' : 'neg'}`}>
                  {r.change >= 0 ? '+' : ''}{r.change}%
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
