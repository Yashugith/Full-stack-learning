import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import './Landing.css';

/* ─── Animated world dots background ─── */
function WorldGrid() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Dots layout
    const cols = 80, rows = 40;
    const dots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: (c / cols) * canvas.width,
          y: (r / rows) * canvas.height,
          phase: Math.random() * Math.PI * 2,
          speed: 0.008 + Math.random() * 0.012,
          base: 0.06 + Math.random() * 0.12,
        });
      }
    }

    // Animated "ships" crossing
    const ships = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: (0.2 + Math.random() * 0.6) * canvas.height,
      speed: 0.3 + Math.random() * 0.5,
      trail: [],
    }));

    let t = 0;
    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw dots
      dots.forEach(d => {
        const alpha = d.base + Math.sin(t * d.speed + d.phase) * 0.08;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`;
        ctx.fill();
      });
      // Draw ships + trails
      ships.forEach(s => {
        s.x += s.speed;
        if (s.x > canvas.width + 20) s.x = -20;
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 60) s.trail.shift();
        s.trail.forEach((p, i) => {
          const alpha = (i / s.trail.length) * 0.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 229, 160, ${alpha})`;
          ctx.fill();
        });
        // Ship dot
        ctx.beginPath();
        ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#00e5a0';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00e5a0';
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="world-canvas" />;
}

/* ─── Animated counter ─── */
function Counter({ to, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = to / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= to) { setVal(to); clearInterval(timer); }
          else setVal(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── Feature card ─── */
function FeatureCard({ icon, title, desc, color, index }) {
  return (
    <motion.div
      className="feature-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <div className="fc-icon" style={{ background: `${color}18`, border: `1px solid ${color}33` }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
      </div>
      <h3 className="fc-title">{title}</h3>
      <p className="fc-desc">{desc}</p>
      <div className="fc-glow" style={{ background: color }} />
    </motion.div>
  );
}

/* ─── Main Landing ─── */
export default function Landing() {
  const { goToLogin } = useAuth();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, -60]);

  const features = [
    { icon: '📦', title: 'Live Shipment Tracking', desc: 'Monitor every container across ocean, air, and road in real-time with animated progress and port-by-port status.', color: '#00d4ff' },
    { icon: '📊', title: 'Analytics & KPIs', desc: 'On-time rates, revenue by lane, carrier benchmarks, and 20+ freight KPIs visualized in stunning interactive charts.', color: '#00e5a0' },
    { icon: '💱', title: 'Live Freight Rates', desc: 'Spot rates for 10+ trade lanes updated weekly. Built-in currency converter with live exchange rates across 160 currencies.', color: '#f5c842' },
    { icon: '🏆', title: 'Carrier Scorecards', desc: 'Benchmark Maersk, MSC, CMA CGM, Hapag-Lloyd and more on reliability, on-time performance, and average delay.', color: '#ff8c42' },
    { icon: '🛃', title: 'Document Center', desc: 'Track all trade documents — Bills of Lading, commercial invoices, packing lists, and customs declarations — in one place.', color: '#a78bfa' },
    { icon: '🔔', title: 'Smart Alerts', desc: 'Instant notifications for delays, customs holds, and delivery confirmations. Never be caught off-guard by supply chain disruptions.', color: '#ff4d6a' },
  ];

  return (
    <div className="landing">
      {/* ── NAV ── */}
      <nav className="land-nav">
        <div className="land-logo">
          <div className="land-logo-icon">⚡</div>
          <span>CargoMind</span>
        </div>
        <div className="land-nav-links">
          <a href="#features">Features</a>
          <a href="#stats">Why Us</a>
          <a href="#how">How It Works</a>
        </div>
        <button className="land-login-btn" onClick={goToLogin}>
          Sign In →
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="land-hero" ref={heroRef}>
        <WorldGrid />
        <motion.div className="hero-content" style={{ opacity: heroOpacity, y: heroY }}>
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="hb-dot" />
            Live freight intelligence platform
          </motion.div>

          <motion.h1
            className="hero-headline"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Global Freight.
            <br />
            <span className="hero-accent">Total Visibility.</span>
          </motion.h1>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            CargoMind gives freight managers, shipping coordinators, and supply chain teams a single command center — live shipment tracking, carrier performance, freight rates, and document control in one platform.
          </motion.p>

          <motion.div
            className="hero-ctas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <button className="cta-primary" onClick={goToLogin}>
              Access Dashboard
              <span className="cta-arrow">→</span>
            </button>
            <a href="#features" className="cta-ghost">
              See Features ↓
            </a>
          </motion.div>

          <motion.div
            className="hero-tags"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {['Ocean FCL/LCL', 'Air Freight', 'Road FTL', '160+ Currencies', 'Carrier Analytics'].map(tag => (
              <span key={tag} className="hero-tag">{tag}</span>
            ))}
          </motion.div>
        </motion.div>

        <div className="hero-scroll-hint">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            ↓
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="land-stats" id="stats">
        <div className="stats-inner">
          {[
            { label: 'Shipments Tracked', value: 12400, suffix: '+' },
            { label: 'Trade Lanes', value: 312, suffix: '' },
            { label: 'Carriers Monitored', value: 48, suffix: '' },
            { label: 'On-Time Rate', value: 91, suffix: '%' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="land-stat"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="land-stat-val">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="land-stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="land-features" id="features">
        <div className="section-inner">
          <motion.div
            className="section-label"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            PLATFORM CAPABILITIES
          </motion.div>
          <motion.h2
            className="section-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Everything your freight team needs
          </motion.h2>
          <div className="features-grid">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="land-how" id="how">
        <div className="section-inner">
          <motion.div className="section-label" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            HOW IT WORKS
          </motion.div>
          <motion.h2 className="section-heading" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Up and running in 3 steps
          </motion.h2>
          <div className="steps-row">
            {[
              { n: '01', title: 'Enter Mobile Number', desc: 'Log in with your registered mobile number — no passwords to remember or reset.' },
              { n: '02', title: 'Verify OTP', desc: 'Receive a 6-digit one-time password via SMS to your registered number. Valid for 5 minutes.' },
              { n: '03', title: 'Access Dashboard', desc: 'Full access to your company\'s freight data, carrier performance, and document center — instantly.' },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                className="step-card"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="step-num">{step.n}</div>
                <div className="step-connector" style={{ display: i < 2 ? 'block' : 'none' }} />
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="land-cta-banner">
        <motion.div
          className="cta-banner-inner"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="cta-banner-glow" />
          <h2>Ready to take control of your supply chain?</h2>
          <p>Join freight teams tracking billions in cargo value on CargoMind.</p>
          <button className="cta-primary" onClick={goToLogin}>
            Get Started — It's Free
            <span className="cta-arrow">→</span>
          </button>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="land-footer">
        <div className="land-logo">
          <div className="land-logo-icon">⚡</div>
          <span>CargoMind</span>
        </div>
        <p className="footer-copy">© 2024 CargoMind. Built for freight professionals.</p>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#stats">About</a>
          <a href="#how">Security</a>
        </div>
      </footer>
    </div>
  );
}
