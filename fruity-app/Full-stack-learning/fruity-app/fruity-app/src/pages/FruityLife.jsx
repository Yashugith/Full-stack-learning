// src/pages/FruityLife.jsx
// PAGE 2 — Fruity Life (tracker + recipes + fun quiz)
// Three tabs: 📊 Tracker | 🍹 Recipes | 🎮 Fun

import React, { useState, useReducer } from 'react'
import { TRACKER_FRUITS, RECIPES, QUIZ, FACTS } from '../data/fruits.js'

// ── Week day labels ──────────────────────────────────────────────────────────
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Today's index: getDay() returns 0=Sun,1=Mon... so we map to 0=Mon..6=Sun
const todayIdx = (new Date().getDay() + 6) % 7

// ── Initial week data: random 0-5 fruits for past days, 0 for today ──────────
function initWeek() {
  return DAYS.map((_, i) => (i === todayIdx ? 0 : Math.floor(Math.random() * 6)))
}

export default function FruityLife() {
  const [activeTab, setActiveTab] = useState('tracker')

  return (
    <div className="app-shell" style={{ paddingBottom: 80 }}>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#2d1a4b' }}>Fruity Life 🍒</div>
        <div style={{ fontSize: 13, color: '#b0a0bf', fontWeight: 600 }}>Your daily fruit companion ✨</div>
      </div>

      {/* ── Tab switcher ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
        {[
          { key: 'tracker', label: '📊 Tracker' },
          { key: 'recipes', label: '🍹 Recipes' },
          { key: 'fun',     label: '🎮 Fun' },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            flex: 1, padding: 10, borderRadius: 14, fontSize: 13, fontWeight: 800,
            border: activeTab === t.key ? 'none' : '2px solid #ffe0f0',
            background: activeTab === t.key ? '#ff6b6b' : '#fff',
            color: activeTab === t.key ? '#fff' : '#c9b4d0',
            cursor: 'pointer', transition: 'all .15s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ─────────────────────────────────────────────────── */}
      {activeTab === 'tracker' && <TrackerTab />}
      {activeTab === 'recipes' && <RecipesTab />}
      {activeTab === 'fun'     && <FunTab />}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 1: TRACKER — daily fruit intake logger with weekly view
// ════════════════════════════════════════════════════════════════════════════
function TrackerTab() {
  const [week, setWeek]       = useState(initWeek)     // fruits per day
  const [selected, setSelected] = useState(new Set())  // fruits selected today
  const [streak, setStreak]   = useState(Math.floor(Math.random() * 7) + 1)
  const [logged, setLogged]   = useState(false)

  // Toggle a fruit card (select / deselect)
  const toggleFruit = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Log today's fruits — updates weekly bar and streak
  const logFruits = () => {
    if (!selected.size) { alert('Pick at least one fruit! 🍓'); return }
    const next = [...week]
    next[todayIdx] = selected.size
    setWeek(next)
    setStreak(s => s + 1)
    setSelected(new Set())
    setLogged(true)
    setTimeout(() => setLogged(false), 2500)
  }

  const goalPct = Math.min(100, Math.round((selected.size / 5) * 100))

  return (
    <>
      {/* Weekly dots */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {DAYS.map((d, i) => {
          const n = i === todayIdx ? selected.size : week[i]
          const isToday = i === todayIdx
          const filled = n > 0
          return (
            <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#c9b4d0', letterSpacing: '.05em' }}>{d}</span>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                border: `2.5px solid ${isToday ? '#ff6b6b' : filled ? '#ffaac4' : '#ffe0f0'}`,
                background: filled ? '#fff0f6' : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                boxShadow: isToday ? '0 0 0 3px #ffaac444' : 'none',
              }}>
                {filled ? (['🍓','🍌','🍎','🍊','🍇','🥭'][n % 6]) : (isToday ? '☀️' : '○')}
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#ff6b6b', minHeight: 14 }}>
                {filled ? `${n}x` : ''}
              </span>
            </div>
          )
        })}
      </div>

      {/* Goal progress bar */}
      <div style={{ background: '#fff', borderRadius: 18, padding: 16, marginBottom: 16, border: '2px solid #ffe0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#2d1a4b' }}>
            🎯 Daily goal — {selected.size} / 5 fruits
          </span>
          <span style={{ fontSize: 14, fontWeight: 900, color: '#ff6b6b' }}>{goalPct}%</span>
        </div>
        <div style={{ height: 12, background: '#fff0f6', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99,
            background: 'linear-gradient(90deg,#ff6b6b,#ffaac4)',
            width: `${goalPct}%`, transition: 'width .5s cubic-bezier(.34,1.56,.64,1)',
          }} />
        </div>
      </div>

      {/* Fruit selector grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
        {TRACKER_FRUITS.map(f => {
          const sel = selected.has(f.id)
          return (
            <div key={f.id} onClick={() => toggleFruit(f.id)} style={{
              background: sel ? f.bg : '#fff',
              borderRadius: 18, padding: 12, textAlign: 'center',
              border: `2px solid ${sel ? f.btnColor : '#ffe0f0'}`,
              cursor: 'pointer', transition: 'all .15s', position: 'relative',
              transform: sel ? 'scale(1.04)' : 'scale(1)',
            }}>
              {sel && <span style={{ position: 'absolute', top: 6, right: 8, fontSize: 13 }}>✅</span>}
              <span style={{ fontSize: 30, display: 'block', marginBottom: 4 }}>{f.emoji}</span>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#2d1a4b' }}>{f.name}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#b0a0bf' }}>{f.cal} cal</div>
            </div>
          )
        })}
      </div>

      {/* Log button */}
      <button onClick={logFruits} style={{
        width: '100%', padding: 14, borderRadius: 16, border: 'none',
        background: logged ? '#4caf50' : '#ff6b6b',
        color: '#fff', fontSize: 15, fontWeight: 900, cursor: 'pointer',
        marginBottom: 16, transition: 'background .3s',
      }}>
        {logged ? 'Logged! 🎉' : "Log today's fruits 🍓"}
      </button>

      {/* Streak bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: 12, background: '#fff8e1', borderRadius: 14, border: '2px solid #ffe082',
      }}>
        <span style={{ fontSize: 22 }}>🔥</span>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#f59f00' }}>
          {streak} day streak — you're on fire!
        </span>
      </div>
    </>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 2: RECIPES — beautiful recipe cards with expandable steps
// ════════════════════════════════════════════════════════════════════════════
function RecipesTab() {
  const [expanded, setExpanded] = useState(null) // which recipe's steps are showing

  return (
    <>
      {RECIPES.map((r, i) => (
        <div key={r.name} style={{
          background: '#fff', borderRadius: 22, padding: 16, marginBottom: 14,
          border: '2px solid #ffe0f0', cursor: 'pointer', transition: 'transform .15s',
        }}
          onClick={() => setExpanded(expanded === i ? null : i)}
        >
          {/* Recipe header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <div style={{
              width: 68, height: 68, background: '#fff0f6', borderRadius: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, flexShrink: 0,
            }}>
              {r.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#2d1a4b', marginBottom: 2 }}>{r.name}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#b0a0bf', marginBottom: 6 }}>{r.meta}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {r.tags.map(t => (
                  <span key={t.t} style={{
                    fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 99,
                    background: t.c, color: t.tc,
                  }}>{t.t}</span>
                ))}
              </div>
            </div>
            {/* Expand arrow */}
            <span style={{ fontSize: 18, color: '#c9b4d0', transition: 'transform .2s', transform: expanded === i ? 'rotate(180deg)' : 'rotate(0)' }}>
              ▾
            </span>
          </div>

          {/* Fruit emoji strip */}
          <div style={{ display: 'flex', gap: 6, fontSize: 22, paddingTop: 8, borderTop: '1.5px solid #fff0f6' }}>
            {r.fruits.join(' ')}
          </div>

          {/* Expandable steps */}
          {expanded === i && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1.5px solid #ffe0f0' }}>
              {r.steps.map((step, si) => (
                <div key={si} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%', background: '#ff6b6b',
                    color: '#fff', fontSize: 11, fontWeight: 900,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>{si + 1}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#2d1a4b', lineHeight: 1.6 }}>{step}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// TAB 3: FUN — fruit trivia quiz + rotating fun facts
// ════════════════════════════════════════════════════════════════════════════
function FunTab() {
  const [quizIdx, setQuizIdx]     = useState(0)
  const [score, setScore]         = useState(0)
  const [total, setTotal]         = useState(0)
  const [answered, setAnswered]   = useState(null) // index of chosen answer
  const [factIdx, setFactIdx]     = useState(0)

  const currentQ = QUIZ[quizIdx]

  const answerQuiz = (i) => {
    if (answered !== null) return  // already answered
    setAnswered(i)
    if (i === currentQ.ans) setScore(s => s + 1)
    setTotal(t => t + 1)
    // Auto-advance after 1.3s
    setTimeout(() => {
      setAnswered(null)
      setQuizIdx(idx => idx + 1)
    }, 1300)
  }

  const resetQuiz = () => { setQuizIdx(0); setScore(0); setTotal(0); setAnswered(null) }

  const currentFact = FACTS[factIdx]

  return (
    <>
      {/* Score tracker */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: '#fff', borderRadius: 14, border: '2px solid #ffe0f0', marginBottom: 16,
      }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#b0a0bf' }}>Your score</span>
        <span style={{ fontSize: 20, fontWeight: 900, color: '#ff6b6b' }}>{score} / {total}</span>
      </div>

      {/* Quiz card */}
      <div style={{ background: '#fff', borderRadius: 22, padding: 20, marginBottom: 16, border: '2px solid #ffe0f0', textAlign: 'center' }}>
        {quizIdx >= QUIZ.length ? (
          /* Quiz complete */
          <div style={{ padding: '20px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>🏆</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#2d1a4b', marginBottom: 8 }}>Quiz complete!</div>
            <div style={{ fontSize: 14, color: '#b0a0bf', fontWeight: 700, marginBottom: 16 }}>
              You got {score} out of {QUIZ.length} correct!
            </div>
            <button onClick={resetQuiz} style={{
              padding: '12px 28px', borderRadius: 99, border: 'none',
              background: '#ff6b6b', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer',
            }}>Play again 🔄</button>
          </div>
        ) : (
          /* Active quiz question */
          <>
            <div style={{ fontSize: 72, marginBottom: 8 }}>{currentQ.fruit}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#2d1a4b', marginBottom: 16 }}>{currentQ.q}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {currentQ.opts.map((opt, i) => {
                let bg = '#fff9f0', border = '#ffe0f0', color = '#2d1a4b'
                if (answered !== null) {
                  if (i === currentQ.ans)          { bg = '#e8f5e9'; border = '#66bb6a'; color = '#2e7d32' }
                  else if (i === answered)          { bg = '#fce4ec'; border = '#ef9a9a'; color = '#c62828' }
                }
                return (
                  <button key={i} onClick={() => answerQuiz(i)} style={{
                    padding: 12, borderRadius: 14, border: `2px solid ${border}`,
                    background: bg, color, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    transition: 'all .2s', fontFamily: 'Nunito, sans-serif',
                  }}>
                    {opt}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Fun fact card */}
      <div style={{
        background: '#fff0f6', borderRadius: 18, padding: 16, border: '2px solid #ffaac4', textAlign: 'center',
      }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{currentFact.emoji}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#2d1a4b', lineHeight: 1.5, marginBottom: 12 }}>
          {currentFact.text}
        </div>
        <button
          onClick={() => setFactIdx(i => (i + 1) % FACTS.length)}
          style={{
            padding: '10px 22px', borderRadius: 99, border: 'none',
            background: '#ff6b6b', color: '#fff', fontSize: 13, fontWeight: 800,
            cursor: 'pointer', transition: 'transform .15s',
          }}
        >
          Next fact 🍀
        </button>
      </div>
    </>
  )
}
