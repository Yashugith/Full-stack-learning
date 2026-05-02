import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FreightProvider } from './context/FreightContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Shipments from './pages/Shipments';
import Analytics from './pages/Analytics';
import Carriers from './pages/Carriers';
import FreightRates from './pages/FreightRates';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import Landing from './pages/auth/Landing';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OtpVerifyPage from './pages/auth/OtpVerifyPage';
import SetPasswordPage from './pages/auth/SetPasswordPage';

const Fade = ({ children, k }) => (
  <motion.div key={k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
    {children}
  </motion.div>
);

const LoadingScreen = () => (
  <div style={{
    minHeight: '100vh', background: 'var(--bg-primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexDirection: 'column', gap: 16,
  }}>
    <div style={{
      width: 40, height: 40, background: 'var(--accent)',
      borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 18, boxShadow: '0 0 20px rgba(0,212,255,0.4)',
      animation: 'pulse-dot 1.5s ease-in-out infinite',
    }}>⚡</div>
    <span style={{ color: 'var(--text-muted)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
      Restoring session...
    </span>
  </div>
);

function AppRouter() {
  const { authStep } = useAuth();

  return (
    <AnimatePresence mode="wait">
      {authStep === 'loading'       && <Fade k="loading"><LoadingScreen /></Fade>}
      {authStep === 'landing'       && <Fade k="landing"><Landing /></Fade>}
      {authStep === 'register'      && <Fade k="register"><RegisterPage /></Fade>}
      {authStep === 'verify-otp'    && <Fade k="otp"><OtpVerifyPage /></Fade>}
      {authStep === 'set-password'  && <Fade k="setpw"><SetPasswordPage /></Fade>}
      {authStep === 'login'         && <Fade k="login"><LoginPage /></Fade>}
      {authStep === 'forgot-password' && <Fade k="forgot"><LoginPage /></Fade>}
      {authStep === 'app'           && (
        <Fade k="app">
          <FreightProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="shipments" element={<Shipments />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="carriers" element={<Carriers />} />
                  <Route path="rates" element={<FreightRates />} />
                  <Route path="documents" element={<Documents />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </FreightProvider>
        </Fade>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
