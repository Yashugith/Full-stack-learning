import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, X, CheckCheck } from 'lucide-react';
import { useFreight } from '../../context/FreightContext';
import { useLocation } from 'react-router-dom';
import './Topbar.css';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/shipments': 'Shipments',
  '/analytics': 'Analytics',
  '/carriers': 'Carrier Performance',
  '/rates': 'Freight Rates',
  '/documents': 'Documents',
  '/settings': 'Settings',
};

const NOTIF_ICONS = {
  alert: '⚠',
  customs: '🛃',
  delivered: '✓',
};

export default function Topbar() {
  const { searchQuery, setSearchQuery, notifications, unreadCount, markAllRead } = useFreight();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const location = useLocation();

  const title = PAGE_TITLES[location.pathname] || 'CargoMind';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="page-title">{title}</h1>
        <div className="breadcrumb">
          <span>CargoMind</span>
          <span className="sep">/</span>
          <span className="current">{title}</span>
        </div>
      </div>

      <div className="topbar-right">
        {/* Search */}
        <div className={`search-wrap ${searchFocused ? 'focused' : ''}`}>
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search shipments, carriers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>
              <X size={12} />
            </button>
          )}
        </div>

        {/* Notifications */}
        <div className="notif-wrap">
          <button
            className="icon-btn"
            onClick={() => setNotifOpen(o => !o)}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="badge">{unreadCount}</span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <motion.div
                  className="notif-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setNotifOpen(false)}
                />
                <motion.div
                  className="notif-panel"
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="notif-header">
                    <span>Notifications</span>
                    <button className="mark-read-btn" onClick={markAllRead}>
                      <CheckCheck size={12} /> Mark all read
                    </button>
                  </div>
                  <div className="notif-list">
                    {notifications.map(n => (
                      <div key={n.id} className={`notif-item ${n.read ? 'read' : ''}`}>
                        <span className="notif-icon">{NOTIF_ICONS[n.type]}</span>
                        <div className="notif-body">
                          <p>{n.message}</p>
                          <span>{n.time}</span>
                        </div>
                        {!n.read && <div className="unread-dot" />}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Live Indicator */}
        <div className="live-indicator">
          <span className="pulse-dot" />
          <span>LIVE</span>
        </div>
      </div>
    </header>
  );
}
