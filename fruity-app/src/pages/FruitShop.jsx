// src/pages/FruitShop.jsx
// PAGE 1 — The Fruit Shop
// Features: search, category filter, hero banner, fruit grid with cart

import React, { useState, useMemo } from 'react'
import { FRUITS, CATEGORIES, BANNERS } from '../data/fruits.js'

export default function FruitShop() {
  const [cart, setCart] = useState({})          // { fruitId: quantity }
  const [liked, setLiked] = useState({})        // { fruitId: true/false }
  const [activeCat, setActiveCat] = useState('all')
  const [searchQ, setSearchQ] = useState('')

  // ── Derived: filter fruits by category + search ──────────────────────────
  const filtered = useMemo(() => {
    return FRUITS.filter(f => {
      const catOk = activeCat === 'all' || f.cat === activeCat
      const qOk   = f.name.toLowerCase().includes(searchQ.toLowerCase()) ||
                    f.sub.toLowerCase().includes(searchQ.toLowerCase())
      return catOk && qOk
    })
  }, [activeCat, searchQ])

  // ── Cart helpers ─────────────────────────────────────────────────────────
  const addToCart    = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }))
  const removeFromCart = (id) => setCart(c => {
    const n = (c[id] || 0) - 1
    if (n <= 0) { const next = { ...c }; delete next[id]; return next }
    return { ...c, [id]: n }
  })
  const toggleLike = (id) => setLiked(l => ({ ...l, [id]: !l[id] }))

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const f = FRUITS.find(x => x.id == id)
    return sum + (f ? f.price * qty : 0)
  }, 0)

  // ── Current banner based on active category ──────────────────────────────
  const banner = BANNERS.find(b => b.cat === activeCat) || BANNERS[0]

  // ── Checkout handler ─────────────────────────────────────────────────────
  const checkout = () => {
    if (!cartCount) { alert('Add some fruits first! 🍓'); return }
    alert(`🎉 Order placed!\n${cartCount} items for ₹${cartTotal.toFixed(2)}\nDelivery in 30 mins! 🛵`)
    setCart({})
  }

  return (
    <div className="app-shell" style={{ paddingBottom: 80 }}>

      {/* ── TOP BAR ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#b0a0bf' }}>Good morning!</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#2d1a4b' }}>
            Fresh <span style={{ color: '#ff6b6b' }}>Fruits</span> 🌸
          </div>
        </div>
        {/* Avatar */}
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          background: '#ffd6e0', border: '2.5px solid #ffaac4',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
        }}>🐻</div>
      </div>

      {/* ── SEARCH BAR ──────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#fff', border: '2px solid #ffe0f0',
        borderRadius: 18, padding: '10px 16px', marginBottom: 24,
      }}>
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" stroke="#c9b4d0" strokeWidth="2"/>
          <path d="M16.5 16.5L21 21" stroke="#c9b4d0" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          placeholder="Search your favourite fruit..."
          style={{
            border: 'none', outline: 'none', fontSize: 15, fontWeight: 600,
            color: '#2d1a4b', background: 'transparent', width: '100%',
          }}
        />
        {searchQ && (
          <button onClick={() => setSearchQ('')}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#c9b4d0', fontSize: 18 }}>
            ×
          </button>
        )}
      </div>

      {/* ── CATEGORY TABS ───────────────────────────────────────────────── */}
      <SectionLabel>Categories</SectionLabel>
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4, marginBottom: 28 }}>
        {CATEGORIES.map(cat => (
          <button key={cat.key} onClick={() => setActiveCat(cat.key)}
            style={{
              flexShrink: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            <div style={{
              width: 60, height: 60, borderRadius: 20, background: cat.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
              boxShadow: activeCat === cat.key ? '0 4px 16px rgba(0,0,0,.12)' : 'none',
              transition: 'transform .15s',
              transform: activeCat === cat.key ? 'scale(1.08)' : 'scale(1)',
            }}>
              {cat.emoji}
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: activeCat === cat.key ? '#ff6b6b' : '#9b7ab5' }}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {/* ── HERO BANNER ─────────────────────────────────────────────────── */}
      <div style={{
        borderRadius: 24, padding: '20px 20px 0', marginBottom: 28,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        background: banner.bg, overflow: 'hidden', minHeight: 130,
        transition: 'background .4s ease',
      }}>
        <div style={{ paddingBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', opacity: .7, marginBottom: 4 }}>
            {banner.tag}
          </div>
          <div
            style={{ fontSize: 21, fontWeight: 900, lineHeight: 1.2, marginBottom: 12, color: '#2d1a4b' }}
            dangerouslySetInnerHTML={{ __html: banner.title }}
          />
          <button
            onClick={() => { const f = FRUITS.find(x => x.cat === banner.cat); if (f) addToCart(f.id) }}
            style={{
              padding: '8px 18px', borderRadius: 99, border: 'none', cursor: 'pointer',
              background: banner.btnColor, color: '#fff', fontSize: 13, fontWeight: 800,
              transition: 'transform .15s',
            }}
          >
            Grab now ✨
          </button>
        </div>
        <div style={{ fontSize: 90, lineHeight: 1, marginBottom: -4, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,.15))', transition: 'all .3s' }}>
          {banner.emoji}
        </div>
      </div>

      {/* ── FRUIT GRID ──────────────────────────────────────────────────── */}
      <SectionLabel>Popular fruits</SectionLabel>
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#c9b4d0', fontWeight: 700, fontSize: 15 }}>
          No fruits found 🥲
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
          {filtered.map(f => (
            <FruitCard
              key={f.id}
              fruit={f}
              qty={cart[f.id] || 0}
              isLiked={!!liked[f.id]}
              onAdd={() => addToCart(f.id)}
              onInc={() => addToCart(f.id)}
              onDec={() => removeFromCart(f.id)}
              onLike={() => toggleLike(f.id)}
            />
          ))}
        </div>
      )}

      {/* ── CART BAR (sticky bottom) ─────────────────────────────────────── */}
      <div style={{
        position: 'fixed', bottom: 60, left: '50%', transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)', maxWidth: 388,
        background: '#2d1a4b', borderRadius: 22, padding: '14px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 8px 32px rgba(45,26,75,.25)',
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#c9a7e8' }}>
            {cartCount === 0 ? 'Your cart is empty' : `${cartCount} item${cartCount !== 1 ? 's' : ''} in cart`}
          </div>
          <div style={{ fontSize: 19, fontWeight: 900, color: '#fff' }}>₹{cartTotal.toFixed(2)}</div>
        </div>
        <button onClick={checkout} style={{
          background: '#ff6b6b', border: 'none', borderRadius: 14, padding: '11px 20px',
          fontSize: 14, fontWeight: 800, color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8, transition: 'transform .15s',
        }}>
          🛒 Checkout
        </button>
      </div>
    </div>
  )
}

// ── FruitCard ─────────────────────────────────────────────────────────────────
// Each fruit tile in the 2-column grid
function FruitCard({ fruit: f, qty, isLiked, onAdd, onInc, onDec, onLike }) {
  const stars = '★'.repeat(f.stars) + '☆'.repeat(5 - f.stars)
  return (
    <div style={{
      background: f.bg, borderRadius: 22, padding: 16, cursor: 'pointer',
      border: `2px solid ${f.border}`, position: 'relative', overflow: 'hidden',
      transition: 'transform .15s',
    }}>
      {/* Badge (Hot / Sale / Organic etc.) */}
      {f.badge && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 99,
          background: f.badgeBg, color: f.badgeColor,
        }}>
          {f.badge}
        </div>
      )}

      {/* Like button */}
      <div onClick={onLike} style={{ position: 'absolute', top: 12, left: 12, fontSize: 16, cursor: 'pointer' }}>
        {isLiked ? '❤️' : '🤍'}
      </div>

      {/* Fruit emoji */}
      <span style={{ fontSize: 52, display: 'block', marginBottom: 8, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.1))' }}>
        {f.emoji}
      </span>

      <div style={{ fontSize: 16, fontWeight: 800, color: '#2d1a4b', marginBottom: 2 }}>{f.name}</div>
      <div style={{ fontSize: 11, color: '#ffd700', letterSpacing: -1, marginBottom: 2 }}>{stars}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#b0a0bf', marginBottom: 10 }}>{f.sub}</div>

      {/* Price + Add/qty control */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: '#ff6b6b' }}>₹{f.price}</div>

        {qty > 0 ? (
          /* Quantity controller */
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RoundBtn onClick={onDec} bg="#ede7f6" color="#673ab7">−</RoundBtn>
            <span style={{ fontWeight: 900, fontSize: 15, color: '#2d1a4b', minWidth: 14, textAlign: 'center' }}>{qty}</span>
            <RoundBtn onClick={onInc} bg={f.btnColor} color="#fff">+</RoundBtn>
          </div>
        ) : (
          /* First add */
          <RoundBtn onClick={onAdd} bg={f.btnColor} color="#fff">+</RoundBtn>
        )}
      </div>
    </div>
  )
}

// ── RoundBtn — small circular add/remove button ──────────────────────────────
function RoundBtn({ onClick, bg, color, children }) {
  return (
    <button onClick={onClick} style={{
      width: 32, height: 32, borderRadius: 10, border: 'none',
      background: bg, color, fontSize: 18, fontWeight: 900,
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'transform .15s',
    }}>
      {children}
    </button>
  )
}

// ── SectionLabel — gray uppercase section heading ────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 800, color: '#c9b4d0', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 12 }}>
      {children}
    </div>
  )
}
