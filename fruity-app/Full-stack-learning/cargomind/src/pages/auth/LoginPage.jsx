import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Eye, EyeOff, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';
import BrandPanel from './BrandPanel';

export default function LoginPage() {
  const { login, forgotPassword, loading, error, info, goToRegister, goToLanding } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';
    if (mode === 'login' && password.length < 6) errs.password = 'Enter your password';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (mode === 'login') {
      await login(email.trim(), password);
    } else {
      const ok = await forgotPassword(email.trim());
      if (ok) setMode('login');
    }
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
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                className="auth-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <button className="auth-back-btn" onClick={goToLanding}>
                  ← Back to home
                </button>

                <div className={`auth-step-icon ${mode === 'login' ? 'cyan' : 'yellow'}`}>
                  {mode === 'login'
                    ? <LogIn size={22} color="var(--accent)" strokeWidth={1.8} />
                    : <Mail size={22} color="var(--yellow)" strokeWidth={1.8} />
                  }
                </div>

                <h2 className="auth-step-title">
                  {mode === 'login' ? 'Sign in to CargoMind' : 'Reset your password'}
                </h2>
                <p className="auth-step-sub">
                  {mode === 'login'
                    ? 'Use your registered email and password to access your dashboard.'
                    : 'Enter your email. We\'ll send a reset OTP to verify your identity.'}
                </p>

                <AnimatePresence>
                  {error && (
                    <motion.div className="auth-error-box" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      ⚠ {error}
                    </motion.div>
                  )}
                  {info && (
                    <motion.div className="auth-info-box" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      ℹ {info}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="auth-fields">
                  {/* Email */}
                  <div className="field-wrap">
                    <label className="field-label">Email Address</label>
                    <input
                      type="email"
                      className={`field-input ${fieldErrors.email ? 'err' : ''}`}
                      placeholder="aryan@company.com"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setFieldErrors(f => ({ ...f, email: '' })); }}
                      autoFocus
                      autoComplete="email"
                    />
                    {fieldErrors.email && <span style={{ fontSize: 11, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>{fieldErrors.email}</span>}
                  </div>

                  {/* Password (login only) */}
                  {mode === 'login' && (
                    <div className="field-wrap">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="field-label">Password</label>
                        <button
                          type="button"
                          onClick={() => setMode('forgot')}
                          style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                        >
                          Forgot password?
                        </button>
                      </div>
                      <div className="field-input-wrap">
                        <input
                          type={showPw ? 'text' : 'password'}
                          className={`field-input ${fieldErrors.password ? 'err' : ''}`}
                          placeholder="Enter your password"
                          value={password}
                          onChange={e => { setPassword(e.target.value); setFieldErrors(f => ({ ...f, password: '' })); }}
                          autoComplete="current-password"
                        />
                        <button type="button" className="field-toggle-btn" onClick={() => setShowPw(s => !s)}>
                          {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      {fieldErrors.password && <span style={{ fontSize: 11, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>{fieldErrors.password}</span>}
                    </div>
                  )}

                  <button type="submit" className="auth-submit" disabled={loading}>
                    {loading
                      ? <><span className="btn-spinner" /> {mode === 'login' ? 'Signing in...' : 'Sending OTP...'}</>
                      : mode === 'login' ? 'Sign In →' : 'Send Reset OTP →'
                    }
                  </button>
                </form>

                {mode === 'forgot' && (
                  <div className="auth-link-row">
                    <button onClick={() => setMode('login')}>← Back to login</button>
                  </div>
                )}

                <div className="auth-divider">or</div>

                <div className="auth-link-row">
                  Don't have an account?{' '}
                  <button onClick={goToRegister}>Create one free</button>
                </div>

                <div className="sec-badges">
                  {['Email + password auth', 'SHA-256 hashed', 'Session token', '7-day remember'].map(b => (
                    <span key={b} className="sec-badge">🔒 {b}</span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
