# ⚡ CargoMind — Freight & Logistics Intelligence Platform

> A production-grade B2B SaaS platform with real authentication — complete user registration, email OTP verification, password hashing with Web Crypto API, and persistent IndexedDB sessions.

---

## 🔐 Authentication System — Full Explanation

### What API is used?

**EmailJS** (`@emailjs/browser`) — https://www.emailjs.com

EmailJS lets you send real emails directly from browser JavaScript with **zero backend server**. It connects your Gmail/Outlook and sends emails via their infrastructure.

**Free tier: 200 emails/month** — perfect for a portfolio project.

### How the entire auth system works

```
Registration Flow:
  1. User fills: Name + Email + Mobile
  2. registerUser() → saves to IndexedDB (unverified, password='__pending__')
  3. storeOtp() → generates cryptographically secure 6-digit OTP via Web Crypto API
                  → saves OTP + expiry (10 min) + attempts (max 5) to IndexedDB
  4. sendOtpEmail() → calls EmailJS API → EmailJS → your Gmail → user's inbox
  5. User enters 6-digit OTP in boxes (auto-submit, paste support)
  6. verifyOtpCode() → checks IndexedDB: expiry? attempts? match?
  7. markUserVerified() → updates user record in IndexedDB (verified: true)
  8. User creates password → hashPassword() → SHA-256 via Web Crypto API
  9. createSession() → generates 32-byte random token → saves to IndexedDB
                     → token stored in localStorage for page reload restoration
 10. User enters app ✓

Login Flow:
  1. User enters email + password
  2. verifyPassword() → getUserByEmail() from IndexedDB → hash input → compare SHA-256 hashes
  3. If match → createSession() → setAuthStep('app')

Forgot Password Flow:
  1. Enter email → OTP sent to that email → verify OTP → set new password

Session Restore (page reload):
  1. getSessionUser() → reads token from localStorage
  2. Looks up session in IndexedDB → checks expiry (7 days)
  3. Gets user by userId → returns user or null
```

### Where is the data stored?

**IndexedDB** (built into every browser) — persists across:
- Page reloads ✓
- Browser restarts ✓
- New tabs ✓
- Until user clears browser data

Three object stores:
| Store | Key | What it holds |
|---|---|---|
| `users` | `id` (UUID) | name, email, mobile, passwordHash, verified |
| `sessions` | `token` (32-byte hex) | userId, expiresAt (7 days) |
| `otpStore` | `email` | otp, expiresAt (10 min), attempts count |

### Password Security

Uses **Web Crypto API** (browser built-in, zero dependencies):
```javascript
const data = new TextEncoder().encode(password + salt);
const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
```
Plain text password is **never stored anywhere**. Only the SHA-256 hash is saved to IndexedDB.

---

## 📁 Auth File Structure

```
src/
├── services/
│   ├── localDb.js          ← IndexedDB wrapper: users, sessions, OTP storage
│   └── emailService.js     ← EmailJS integration for real email delivery
├── context/
│   └── AuthContext.jsx     ← Auth state machine: register→otp→setpw→app→login
└── pages/auth/
    ├── Auth.css            ← Shared design system for all auth screens
    ├── BrandPanel.jsx      ← Left-side brand panel (reused on all auth pages)
    ├── Landing.jsx         ← Animated landing page with world-map canvas
    ├── RegisterPage.jsx    ← Name + Email + Mobile registration form
    ├── OtpVerifyPage.jsx   ← 6-box OTP entry (auto-submit, paste, fallback reveal)
    ├── SetPasswordPage.jsx ← Password creation with strength meter + requirements
    └── LoginPage.jsx       ← Email + Password login with forgot password flow
```

### Auth Step Machine
```
'loading'        → checking IndexedDB for existing session
'landing'        → public landing page
'register'       → RegisterPage (name, email, mobile)
'verify-otp'     → OtpVerifyPage (6-digit code)
'set-password'   → SetPasswordPage (create password)
'login'          → LoginPage (email + password)
'forgot-password'→ LoginPage in forgot mode
'app'            → full dashboard (protected)
```

---

## ⚙️ EmailJS Setup (5 minutes, completely free)

1. Go to **https://www.emailjs.com** → Sign up free
2. **Email Services** → Add Service → Gmail → Connect your Gmail
   - Copy the **Service ID** (e.g. `service_abc123`)
3. **Email Templates** → Create Template:
   - **Subject:** `Your CargoMind OTP: {{otp}}`
   - **Body:**
     ```
     Hi {{to_name}},

     Your CargoMind verification code is:

     {{otp}}

     This code expires in 10 minutes. Do not share it with anyone.

     — CargoMind Security Team
     ```
   - Copy the **Template ID** (e.g. `template_xyz789`)
4. **Account → General** → Copy your **Public Key**
5. Create `.env` file in project root:
   ```
   REACT_APP_EMAILJS_SERVICE_ID=service_abc123
   REACT_APP_EMAILJS_TEMPLATE_ID=template_xyz789
   REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
   ```
6. Restart dev server: `npm start`

**Without EmailJS configured:** The app still works fully. The OTP is shown in an on-screen reveal box so you can test the entire flow locally.

---

## 🚀 Installation

```bash
# 1. Unzip and enter directory
unzip cargomind-final.zip
cd cargomind

# 2. Install dependencies
npm install

# 3. (Optional) Configure EmailJS for real emails
cp .env.example .env
# Edit .env with your EmailJS credentials

# 4. Start development server
npm start
# → Opens at http://localhost:3000
```

---

## 🧭 Complete User Journey

```
/ (Landing Page)
  ↓ "Get Started" 
/register
  → Enter Name, Email, Mobile
  → OTP sent to email (or shown in fallback box if EmailJS not set up)
/verify-otp  
  → Enter 6-digit OTP (auto-submits, supports paste)
  → Max 5 attempts, 10-min expiry, 30-sec resend timer
/set-password
  → Create password (strength meter, requirements checklist)
  → SHA-256 hashed, stored in IndexedDB
/dashboard (app)
  → Full freight platform access
  → 7-day session persists across page reloads

Returning user:
  / → "Sign In" → /login
  → Email + Password → dashboard instantly
  → Page reload = session auto-restored from IndexedDB + localStorage
```

---

## ☁️ Deployment — Vercel

```bash
npm install -g vercel
vercel
# Build command: npm run build
# Output dir: build
vercel --prod
```

Add your `.env` variables in Vercel Dashboard → Project → Settings → Environment Variables.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| UI Framework | React 18 | Component architecture |
| Routing | React Router v6 | Multi-page SPA routing |
| Animation | Framer Motion | Page transitions, OTP shake, stagger |
| Charts | Recharts | Dashboard analytics |
| Auth Storage | IndexedDB | Persistent user/session/OTP database |
| Password Security | Web Crypto API | SHA-256 hashing (browser-native) |
| OTP Email | EmailJS | Real email delivery, no backend needed |
| Currency API | ExchangeRate-API | Live forex rates |
| Icons | Lucide React | Consistent icon system |
| Styling | CSS Variables | Full design token system |

---

## 🔮 Future Production Upgrades

- Replace IndexedDB with **Supabase** (PostgreSQL) for multi-device sync
- Replace EmailJS with **Resend** or **AWS SES** for higher volume
- Replace SHA-256 with **bcrypt** on a Node.js backend for stronger hashing
- Add **Google OAuth** as alternative login method
- Add **rate limiting** on OTP requests (currently client-side only)
- **2FA via TOTP** (Google Authenticator style) using `otpauth` library

---

## 📄 License

MIT — build freely, ship boldly.
