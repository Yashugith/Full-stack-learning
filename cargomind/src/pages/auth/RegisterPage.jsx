import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';
import BrandPanel from './BrandPanel';

export default function RegisterPage() {
  const { startRegistration, loading, error, info, goToLogin, goToLanding } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', mobile: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setFieldErrors(fe => ({ ...fe, [k]: '' })); };

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Enter your full name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (form.mobile.replace(/\D/g, '').length < 10) errs.mobile = 'Enter a valid 10-digit mobile number';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await startRegistration({ name: form.name.trim(), email: form.email.trim(), mobile: form.mobile.replace(/\D/g, '') });
  };

  const formatMobile = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 10);
    return d.length > 5 ? d.slice(0, 5) + ' ' + d.slice(5) : d;
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <button className="auth-back-btn" onClick={goToLanding}>
                ← Back to home
              </button>

              <div className="auth-step-icon cyan">
                <User size={22} color="var(--accent)" strokeWidth={1.8} />
              </div>

              <h2 className="auth-step-title">Create your account</h2>
              <p className="auth-step-sub">
                Enter your details. We'll verify your email with a one-time code.
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
                {/* Full Name */}
                <div className="field-wrap">
                  <label className="field-label">Full Name</label>
                  <input
                    className={`field-input ${fieldErrors.name ? 'err' : ''}`}
                    placeholder="Aryan Kumar"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    autoFocus
                  />
                  {fieldErrors.name && <span style={{ fontSize: 11, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>{fieldErrors.name}</span>}
                </div>

                {/* Email */}
                <div className="field-wrap">
                  <label className="field-label">Email Address</label>
                  <input
                    className={`field-input ${fieldErrors.email ? 'err' : ''}`}
                    type="email"
                    placeholder="aryan@company.com"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                  />
                  {fieldErrors.email && <span style={{ fontSize: 11, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>{fieldErrors.email}</span>}
                </div>

                {/* Mobile */}
                <div className="field-wrap">
                  <label className="field-label">Mobile Number</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'var(--bg-elevated)', border: '1px solid var(--border-bright)',
                      borderRadius: 'var(--radius-md)', padding: '12px 14px',
                      fontSize: 14, color: 'var(--text-secondary)', flexShrink: 0,
                      fontFamily: 'var(--font-mono)', fontWeight: 600,
                    }}>
                      🇮🇳 +91
                    </span>
                    <input
                      className={`field-input ${fieldErrors.mobile ? 'err' : ''}`}
                      placeholder="98765 43210"
                      value={formatMobile(form.mobile)}
                      onChange={e => set('mobile', e.target.value.replace(/\D/g, ''))}
                      style={{ flex: 1, fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.05em' }}
                    />
                  </div>
                  {fieldErrors.mobile && <span style={{ fontSize: 11, color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>{fieldErrors.mobile}</span>}
                </div>

                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? <><span className="btn-spinner" /> Sending OTP...</> : 'Continue — Verify Email →'}
                </button>
              </form>

              <div className="auth-link-row">
                Already have an account?{' '}
                <button onClick={goToLogin}>Sign in</button>
              </div>

              <div className="sec-badges">
                {['SHA-256 encrypted', 'IndexedDB storage', 'EmailJS delivery', 'No backend needed'].map(b => (
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
