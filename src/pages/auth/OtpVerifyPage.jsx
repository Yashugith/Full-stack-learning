import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';
import BrandPanel from './BrandPanel';

export default function OtpVerifyPage() {
  const {
    submitOtp, resendOtp, loading, error, info,
    otpTarget, otpTimer, fallbackOtp,
    goBack, emailConfigured,
  } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showFallback, setShowFallback] = useState(false);
  const [verified, setVerified] = useState(false);
  const refs = useRef([]);

  useEffect(() => { refs.current[0]?.focus(); }, []);

  // Auto-submit when all 6 filled
  useEffect(() => {
    if (otp.every(d => d !== '') && !loading && !verified) {
      handleVerify(otp.join(''));
    }
    // eslint-disable-next-line
  }, [otp]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 5) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(''));
      refs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleVerify = async (code) => {
    if (loading || verified) return;
    const ok = await submitOtp(code);
    if (!ok) {
      setOtp(['', '', '', '', '', '']);
      refs.current[0]?.focus();
    } else {
      setVerified(true);
    }
  };

  const maskedEmail = otpTarget
    ? otpTarget.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(Math.min(b.length, 6)) + c)
    : '';

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
              <button className="auth-back-btn" onClick={goBack}>
                ← Change details
              </button>

              <div className="auth-step-icon green">
                <ShieldCheck size={22} color="var(--green)" strokeWidth={1.8} />
              </div>

              <h2 className="auth-step-title">Verify your email</h2>
              <p className="auth-step-sub">
                We sent a 6-digit code to{' '}
                <strong style={{ color: 'var(--text-primary)' }}>{maskedEmail}</strong>
                <br />
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Valid for 10 minutes · Max 5 attempts
                </span>
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
                {verified && (
                  <motion.div className="auth-success-box" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    ✓ Verified! Setting up your account...
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Fallback OTP reveal (only when EmailJS not configured) */}
              {fallbackOtp && (
                <div className="fallback-otp-box">
                  <div className="fob-header">
                    <span className="fob-label">⚡ Demo Mode — Your OTP</span>
                    <button className="fob-toggle" onClick={() => setShowFallback(s => !s)}>
                      {showFallback ? <EyeOff size={12} /> : <Eye size={12} />}
                      {showFallback ? 'Hide' : 'Reveal'}
                    </button>
                  </div>
                  {showFallback ? (
                    <motion.code
                      className="fob-code"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {fallbackOtp.split('').join(' ')}
                    </motion.code>
                  ) : (
                    <code className="fob-code" style={{ letterSpacing: '0.5em' }}>● ● ● ● ● ●</code>
                  )}
                  <p className="fob-hint">
                    {emailConfigured
                      ? 'Also sent to your email'
                      : 'Add EmailJS keys to .env to send real emails →'}
                  </p>
                </div>
              )}

              {/* OTP Input Boxes */}
              <div className="otp-boxes" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <motion.input
                    key={i}
                    ref={el => refs.current[i] = el}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className={`otp-box ${digit ? 'filled' : ''} ${error ? 'err' : ''} ${verified ? 'ok' : ''}`}
                    disabled={loading || verified}
                    animate={error ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                    transition={{ duration: 0.35 }}
                  />
                ))}
              </div>

              {/* Manual verify button (if not auto-submitted) */}
              {!otp.every(d => d !== '') && (
                <button
                  className="auth-submit green-btn"
                  disabled={otp.filter(d => d !== '').length < 6 || loading || verified}
                  onClick={() => handleVerify(otp.join(''))}
                >
                  {loading ? <><span className="btn-spinner" /> Verifying...</> : 'Verify OTP →'}
                </button>
              )}

              {/* Resend */}
              <div className="resend-row">
                <span>Didn't receive it?</span>
                {otpTimer > 0 ? (
                  <span className="resend-timer">Resend in <strong>{otpTimer}s</strong></span>
                ) : (
                  <button className="resend-btn" onClick={resendOtp} disabled={loading}>
                    <RefreshCw size={12} /> Resend OTP
                  </button>
                )}
              </div>

              <div className="sec-badges">
                {['Cryptographically secure OTP', '10-min expiry', '5 attempt limit', 'Rate limited'].map(b => (
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
