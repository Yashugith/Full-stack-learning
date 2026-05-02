import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, TrendingUp, Users, FileText,
  Settings, ChevronLeft, Zap, Globe, LogOut
} from 'lucide-react';
import { useFreight } from '../../context/FreightContext';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/shipments', icon: Package, label: 'Shipments' },
  { to: '/analytics', icon: TrendingUp, label: 'Analytics' },
  { to: '/carriers', icon: Users, label: 'Carriers' },
  { to: '/rates', icon: Globe, label: 'Freight Rates' },
  { to: '/documents', icon: FileText, label: 'Documents' },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useFreight();
  const { user, logout } = useAuth();

  return (
    <motion.aside
      className="sidebar"
      animate={{ width: sidebarOpen ? 220 : 64 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Zap size={16} strokeWidth={2.5} />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              className="logo-text"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
            >
              CargoMind
            </motion.span>
          )}
        </AnimatePresence>
        <button
          className="collapse-btn"
          onClick={() => setSidebarOpen(o => !o)}
          title={sidebarOpen ? 'Collapse' : 'Expand'}
        >
          <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }} transition={{ duration: 0.25 }}>
            <ChevronLeft size={14} />
          </motion.div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
                MAIN
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={!sidebarOpen ? label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    className="nav-active-bg"
                    layoutId="activeNav"
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}
                <span className="nav-icon">
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 1.8} />
                </span>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      className="nav-label"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.15 }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          title={!sidebarOpen ? 'Settings' : undefined}
        >
          <span className="nav-icon"><Settings size={16} strokeWidth={1.8} /></span>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                className="nav-label"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="sidebar-user"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <div className="user-avatar">{user?.name?.split(' ').map(n=>n[0]).join('') || 'U'}</div>
              <div className="user-info">
                <span className="user-name">{user?.name || 'User'}</span>
                <span className="user-role">{user?.role || 'Manager'}</span>
              </div>
              <button
                onClick={logout}
                title="Logout"
                style={{
                  background: 'none', border: 'none', color: 'var(--text-muted)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  padding: 4, borderRadius: 4, transition: 'color 0.15s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <LogOut size={13} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
