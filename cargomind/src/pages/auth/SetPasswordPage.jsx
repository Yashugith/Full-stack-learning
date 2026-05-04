import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';
import BrandPanel from './BrandPanel';

function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return { score: s, level: ['', 'weak', 'fair', 'good', 'strong'][s], label: ['', 'Weak', 'Fair', 'Good', 'Strong!'][s] };
}

const REQUIREMENTS = [
  { label: 'At least 8 characters', test: pw => pw.length >= 8 },
  { label: 'One uppercase letter', test: pw => /[A-Z]/.test(pw) },
  { label: 'One number', test: pw => /[0-9]/.test(pw) },
  { label: 'One special character', test: pw => /[^A-Za-z0-9]/.test(pw) },
];

export default function SetPasswordPage() {
  const { setNewPassword, loading, error, pendingUser } = useAuth();
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  const strength = getStrength(pw);
  const allMet = REQUIREMENTS.every(r => r.test(pw));
  const matches = pw === confirm && pw.length > 0;
  const canSubmit = allMet && matches && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    await setNewPassword(pw);
  };

  return (
    <div className="auth-shell">
      <div className="auth-bg-grid" />
      <div className="auth-bg-orb o1" />
      <div className="auth-bg-orb o2" />

      <div className="auth-split">
        <BrandPanel />

        <div className="auth-form-panel">
          <div className="auth-card">
            <motion.div
              className="auth-step"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="auth-step-icon yellow">
                <KeyRound size={22} color="var(--yellow)" strokeWidth={1.8} />
              </div>

              <h2 className="auth-step-title">
                {pendingUser ? `Welcome, ${pendingUser.name.split(' ')[0]}!` : 'Set your password'}
              </h2>
              <p className="auth-step-sub">
                Create a strong password to secure your CargoMind account.
                {pendingUser?.email && (
                  <span style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    Account: {pendingUser.email}
                  </span>
                )}
              </p>

              <AnimatePresence>
                {error && (
                  <motion.div className="auth-error-box" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    ⚠ {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="auth-fields">
                {/* Password */}
                <div className="field-wrap">
                  <label className="field-label">New Password</label>
                  <div className="field-input-wrap">
                    <input
                      type={showPw ? 'text' : 'password'}
                      className="field-input"
                      placeholder="Create a strong password"
                      value={pw}
                      onChange={e => setPw(e.target.value)}
                      autoFocus
                    />
                    <button type="button" className="field-toggle-btn" onClick={() => setShowPw(s => !s)}>
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>

                  {/* Strength bars */}
                  {pw.length > 0 && (
                    <motion.div className="pw-strength" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="pw-bars">
                        {[1, 2, 3, 4].map(n => (
                          <div
                            key={n}
                            className={`pw-bar ${strength.score >= n ? `active ${strength.level}` : ''}`}
                          />
                        ))}
                      </div>
                      {strength.label && (
                        <span className={`pw-label ${strength.level}`}>{strength.label}</span>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="field-wrap">
                  <label className="field-label">Confirm Password</label>
                  <div className="field-input-wrap">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      className={`field-input ${confirm && !matches ? 'err' : ''}`}
                      placeholder="Repeat your password"
                      value={confirm}
                      onChange={e => setConfirm(e.target.value)}
                    />
                    <button type="button" className="field-toggle-btn" onClick={() => setShowConfirm(s => !s)}>
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {confirm && !matches && (
                    <span style={{ fontSize: 11, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>
                      Passwords do not match
                    </span>
                  )}
                  {matches && (
                    <motion.span
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      style={{ fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <CheckCircle size={11} /> Passwords match
                    </motion.span>
                  )}
                </div>

                {/* Requirements checklist */}
                <div style={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: 14,
                  display: 'flex', flexDirection: 'column', gap: 6,
                }}>
                  {REQUIREMENTS.map(req => {
                    const met = req.test(pw);
                    return (
                      <div key={req.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 16, height: 16, borderRadius: '50%',
                          background: met ? 'var(--green-dim)' : 'var(--bg-card)',
                          border: `1px solid ${met ? 'var(--green)' : 'var(--border-bright)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, transition: 'all 0.2s',
                        }}>
                          {met && <CheckCircle size={10} color="var(--green)" />}
                        </div>
                        <span style={{ fontSize: 12, color: met ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {req.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="submit"
                  className="auth-submit"
                  disabled={!canSubmit}
                >
                  {loading ? (
                    <><span className="btn-spinner" /> Creating account...</>
                  ) : (
                    '🚀 Create Account & Sign In'
                  )}
                </button>
              </form>

              <div className="sec-badges">
                {['SHA-256 hashed', 'Never stored plain', 'Local IndexedDB', '7-day session'].map(b => (
                  <span key={b} className="sec-badge">🔒 {b}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
