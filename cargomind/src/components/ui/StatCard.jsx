import React from 'react';
import { motion } from 'framer-motion';
import './StatCard.css';

export default function StatCard({ icon: Icon, label, value, sub, color = 'accent', index = 0 }) {
  return (
    <motion.div
      className={`stat-card stat-card--${color}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        <div className="stat-card__icon">
          <Icon size={14} strokeWidth={2} />
        </div>
      </div>
      <div className="stat-card__value">{value}</div>
      {sub && <div className="stat-card__sub">{sub}</div>}
      <div className="stat-card__glow" />
    </motion.div>
  );
}
