import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ value, color = 'var(--accent)', height = 4, showLabel = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        flex: 1,
        height,
        background: 'var(--bg-elevated)',
        borderRadius: height,
        overflow: 'hidden',
      }}>
        <motion.div
          style={{ height: '100%', background: color, borderRadius: height }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
        />
      </div>
      {showLabel && (
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', minWidth: 28 }}>
          {value}%
        </span>
      )}
    </div>
  );
}
