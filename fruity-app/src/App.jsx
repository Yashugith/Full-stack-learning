// src/App.jsx
// Root component — controls which page (Shop or Life) is shown
// and renders the bottom navigation bar

import React, { useState } from 'react'
import FruitShop from './pages/FruitShop.jsx'
import FruityLife from './pages/FruityLife.jsx'

export default function App() {
  // 'shop' = Fruit Shop app | 'life' = Fruity Life tracker app
  const [activePage, setActivePage] = useState('shop')

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#fff9f0' }}>

      {/* ── Page content — only the active page renders ── */}
      {activePage === 'shop' && <FruitShop />}
      {activePage === 'life' && <FruityLife />}

      {/* ── Bottom navigation bar ── */}
      <nav className="bottom-nav">
        <NavBtn
          emoji="🛒"
          label="Shop"
          active={activePage === 'shop'}
          onClick={() => setActivePage('shop')}
        />
        <NavBtn
          emoji="🍒"
          label="Fruity Life"
          active={activePage === 'life'}
          onClick={() => setActivePage('life')}
        />
      </nav>
    </div>
  )
}

// ── NavBtn — one tab in the bottom nav ──────────────────────────────────────
function NavBtn({ emoji, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '10px 0 14px',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        transition: 'transform .15s',
      }}
    >
      <span style={{ fontSize: 22 }}>{emoji}</span>
      <span style={{
        fontSize: 11,
        fontWeight: 800,
        color: active ? '#ff6b6b' : '#c9b4d0',
        letterSpacing: '.03em',
      }}>
        {label}
      </span>
      {/* Active dot indicator */}
      {active && (
        <span style={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          background: '#ff6b6b',
          marginTop: 2,
        }} />
      )}
    </button>
  )
}
