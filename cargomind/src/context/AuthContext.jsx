import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  registerUser, markUserVerified, verifyPassword,
  storeOtp, verifyOtpCode,
  createSession, getSessionUser, destroySession,
  getUserByEmail, hashPassword,
} from '../services/localDb';
import { sendOtpEmail, emailConfigured } from '../services/emailService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]           = useState(null);
  const [authStep, setAuthStep]   = useState('loading');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [info, setInfo]           = useState('');
  const [otpTarget, setOtpTarget] = useState('');
  const [otpPurpose, setOtpPurpose] = useState('');
  const [otpTimer, setOtpTimer]   = useState(0);
  const [pendingUser, setPendingUser] = useState(null);
  const [fallbackOtp, setFallbackOtp] = useState('');

  const clearMessages = useCallback(() => { setError(''); setInfo(''); }, []);

  // Restore session on load
  useEffect(() => {
    (async () => {
      try {
        const su = await getSessionUser();
        if (su && su.verified) { setUser(su); setAuthStep('app'); }
        else setAuthStep('landing');
      } catch { setAuthStep('landing'); }
    })();
  }, []);

  // OTP countdown
  useEffect(() => {
    if (otpTimer <= 0) return;
    const id = setTimeout(() => setOtpTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [otpTimer]);

  // REGISTER
  const startRegistration = useCallback(async ({ name, email, mobile }) => {
    clearMessages(); setLoading(true);
    try {
      const newUser = await registerUser({ name, email, mobile, password: '__pending__' });
      setPendingUser(newUser);
      const otp = await storeOtp(email.toLowerCase());
      const result = await sendOtpEmail(email, name, otp);
      setOtpTarget(email.toLowerCase());
      setOtpPurpose('register');
      setOtpTimer(30);
      if (result.fallback) { setFallbackOtp(result.otp); setInfo('EmailJS not configured — OTP shown below for demo.'); }
      else { setFallbackOtp(''); setInfo(`OTP sent to ${email}. Check your inbox.`); }
      setAuthStep('verify-otp');
    } catch (err) {
      if (err.message === 'EMAIL_EXISTS') setError('Email already registered. Please log in.');
      else if (err.message === 'MOBILE_EXISTS') setError('Mobile number already registered.');
      else setError('Registration failed. Please try again.');
    } finally { setLoading(false); }
  }, [clearMessages]);

  // VERIFY OTP
  const submitOtp = useCallback(async (enteredOtp) => {
    clearMessages(); setLoading(true);
    try {
      const result = await verifyOtpCode(otpTarget, enteredOtp);
      if (!result.valid) {
        const msgs = { WRONG_OTP: 'Incorrect OTP.', OTP_EXPIRED: 'OTP expired. Request a new one.', TOO_MANY_ATTEMPTS: 'Too many attempts. Request a new OTP.', OTP_NOT_FOUND: 'OTP not found. Request a new one.' };
        setError(msgs[result.reason] || 'Verification failed.');
        setLoading(false);
        return false;
      }
      if (otpPurpose === 'register') { await markUserVerified(pendingUser.id); }
      setFallbackOtp('');
      setAuthStep('set-password');
      return true;
    } catch { setError('Verification error.'); return false; }
    finally { setLoading(false); }
  }, [otpTarget, otpPurpose, pendingUser, clearMessages]);

  // RESEND OTP
  const resendOtp = useCallback(async () => {
    if (otpTimer > 0) return;
    clearMessages(); setLoading(true);
    try {
      const otp = await storeOtp(otpTarget);
      const result = await sendOtpEmail(otpTarget, pendingUser?.name || 'User', otp);
      setOtpTimer(30);
      if (result.fallback) { setFallbackOtp(result.otp); setInfo('New OTP generated — shown below.'); }
      else { setFallbackOtp(''); setInfo('New OTP sent to your email.'); }
    } catch { setError('Failed to resend OTP.'); }
    finally { setLoading(false); }
  }, [otpTarget, otpTimer, pendingUser, clearMessages]);

  // SET PASSWORD
  const setNewPassword = useCallback(async (password) => {
    clearMessages(); setLoading(true);
    try {
      const emailToFind = otpTarget || pendingUser?.email;
      const userData = await getUserByEmail(emailToFind);
      if (!userData) throw new Error('User not found');
      const ph = await hashPassword(password);
      const updatedUser = { ...userData, passwordHash: ph, verified: true };
      // Write directly to IndexedDB
      const idb = await new Promise((res, rej) => {
        const r = indexedDB.open('cargomind_db', 1);
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
      await new Promise((res, rej) => {
        const tx = idb.transaction('users', 'readwrite');
        const req = tx.objectStore('users').put(updatedUser);
        req.onsuccess = () => res();
        req.onerror = () => rej(req.error);
      });
      await createSession(userData.id);
      setUser(updatedUser);
      setAuthStep('app');
    } catch (err) {
      setError('Failed to save password: ' + (err.message || 'Unknown error'));
    } finally { setLoading(false); }
  }, [otpTarget, pendingUser, clearMessages]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    clearMessages(); setLoading(true);
    try {
      const u = await verifyPassword(email, password);
      if (!u) { setError('Invalid email or password.'); return false; }
      if (!u.verified) { setError('Account not verified. Please complete registration.'); return false; }
      await createSession(u.id);
      setUser(u);
      setAuthStep('app');
      return true;
    } catch { setError('Login failed.'); return false; }
    finally { setLoading(false); }
  }, [clearMessages]);

  // FORGOT PASSWORD
  const forgotPassword = useCallback(async (email) => {
    clearMessages(); setLoading(true);
    try {
      const existing = await getUserByEmail(email);
      if (!existing) { setError('No account found with this email.'); return false; }
      const otp = await storeOtp(email.toLowerCase());
      const result = await sendOtpEmail(email, existing.name, otp);
      setOtpTarget(email.toLowerCase());
      setOtpPurpose('forgot');
      setPendingUser(existing);
      setOtpTimer(30);
      if (result.fallback) { setFallbackOtp(result.otp); setInfo('OTP shown below (EmailJS not configured).'); }
      else { setFallbackOtp(''); setInfo(`Reset OTP sent to ${email}.`); }
      setAuthStep('verify-otp');
      return true;
    } catch { setError('Failed to initiate password reset.'); return false; }
    finally { setLoading(false); }
  }, [clearMessages]);

  // LOGOUT
  const logout = useCallback(async () => {
    await destroySession();
    setUser(null); setAuthStep('landing');
    clearMessages(); setPendingUser(null); setFallbackOtp('');
  }, [clearMessages]);

  const goToLogin    = useCallback(() => { clearMessages(); setAuthStep('login'); }, [clearMessages]);
  const goToRegister = useCallback(() => { clearMessages(); setAuthStep('register'); }, [clearMessages]);
  const goToLanding  = useCallback(() => { clearMessages(); setAuthStep('landing'); }, [clearMessages]);
  const goBack       = useCallback(() => { clearMessages(); setAuthStep('login'); }, [clearMessages]);
  const goForgot     = useCallback(() => { clearMessages(); setAuthStep('forgot-password'); }, [clearMessages]);

  return (
    <AuthContext.Provider value={{
      user, authStep, loading, error, info,
      otpTarget, otpTimer, fallbackOtp, pendingUser, emailConfigured,
      startRegistration, submitOtp, resendOtp, setNewPassword,
      login, forgotPassword, logout,
      goToLogin, goToRegister, goToLanding, goBack, goForgot,
      clearMessages,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
