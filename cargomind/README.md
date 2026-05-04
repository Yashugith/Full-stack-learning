<div align="center">

<br />

<img src="https://placehold.co/80x80/00d4ff/000000?text=⚡&font=montserrat" alt="CargoMind Logo" width="80" height="80" style="border-radius: 16px" />

<h1>CargoMind</h1>

<p><strong>Freight & Logistics Intelligence Platform</strong></p>

<p>
  A production-grade B2B SaaS application for freight managers, shipping coordinators,<br/>
  and supply chain teams — built with real authentication, live APIs, and a cinematic UI.
</p>

<br/>

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=flat-square&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.x-FF0055?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Recharts](https://img.shields.io/badge/Recharts-3.8-22B5BF?style=flat-square)](https://recharts.org/)
[![EmailJS](https://img.shields.io/badge/EmailJS-OTP_Auth-FF6B35?style=flat-square)](https://www.emailjs.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://cargomind.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-00e5a0?style=flat-square)](LICENSE)

<br/>

### 🔴 [Live Demo → cargomind.vercel.app](https://cargomind.vercel.app)

<br/>

![CargoMind Banner](https://placehold.co/1100x500/07080a/00d4ff?text=CargoMind+—+Search.+Track.+Deliver.&font=montserrat)

</div>

---

## 📌 Table of Contents

- [What is CargoMind?](#-what-is-cargomind)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Authentication System](#-authentication-system--how-it-works)
- [APIs Used](#-apis-used)
- [All Pages Explained](#-all-pages-explained)
- [Project Structure](#-project-structure)
- [How to Run Locally](#-how-to-run-locally)
- [Deployment on Vercel](#-deployment-on-vercel)
- [Environment Variables](#-environment-variables)
- [What I Learned Building This](#-what-i-learned-building-this)
- [Future Plans](#-future-plans)

---

## 🚢 What is CargoMind?

> **Real world problem:** Global freight is a $9 trillion industry. But most logistics teams still rely on scattered emails, PDF tracking pages, and manual Excel sheets. There's no single, beautiful, unified view of shipments, carriers, rates, and documents.

**CargoMind solves this.**

It gives freight professionals a single command center:
- 📦 Track every shipment across ocean, air, and road
- 🏆 Compare carrier performance in real time
- 💱 Convert freight costs across 160+ currencies live
- 📄 Manage all trade documents in one place
- 🔐 Secure login with real email OTP verification

**This is not a tutorial project. Every feature is built like a real product.**

---

## 🔴 Live Demo

### → **[https://cargomind.vercel.app](https://cargomind.vercel.app)**

**How to test:**
1. Click **"Get Started"** on the landing page
2. Register with your **real email** (OTP will be sent)
3. Verify OTP → Create password → Access full dashboard
4. Explore all 7 pages of the platform

---

## 🛠️ Tech Stack

### Frontend Framework

| Technology | Version | Why I Used It |
|---|---|---|
| **React** | 19.2 | Component-based UI, hooks for state management, fast re-renders |
| **React Router v7** | 7.14 | Multi-page SPA routing with nested layouts and protected routes |
| **Framer Motion** | 12.x | Production-grade animations — page transitions, spring physics, layout animations |
| **Recharts** | 3.8 | Composable, responsive charts built on D3 — area, bar, pie, line charts |
| **Lucide React** | Latest | Clean, consistent, tree-shakeable SVG icon system |
| **CSS Variables** | Native | Full design token system — colors, spacing, typography, shadows |

### Authentication & Data Storage

| Technology | Purpose | Why No Backend? |
|---|---|---|
| **IndexedDB** | Stores users, sessions, OTPs permanently in browser | Built into every browser — no server needed |
| **Web Crypto API** | SHA-256 password hashing | Browser-native crypto — zero npm dependencies |
| **localStorage** | Persists session token across page reloads | Fast key-value storage for single string token |
| **EmailJS** | Sends real OTP emails from browser JS | Connects your Gmail — no Node.js server needed |

### APIs

| API | Type | Cost | Used For |
|---|---|---|---|
| **ExchangeRate-API** | REST | Free forever | Live currency rates on Freight Rates page |
| **EmailJS API** | SDK | Free (200/month) | Sending OTP emails for 2FA authentication |

### Deployment

| Tool | Purpose |
|---|---|
| **Vercel** | Hosting + global CDN + auto HTTPS + preview deployments |

---

## 🔐 Authentication System — How It Works

This was the most challenging and most interesting part of the project.

**Goal:** Build a complete 2-factor auth system with real email OTP — with ZERO backend server.

### The Complete Flow

```
REGISTRATION (new user):

  Step 1 → User fills: Name + Email + Mobile number
  Step 2 → App calls registerUser() → saves to IndexedDB as "unverified"
  Step 3 → App calls storeOtp() → generates crypto-random 6-digit OTP
            using window.crypto.getRandomValues() — NOT Math.random()
  Step 4 → OTP saved to IndexedDB with:
            - 10 minute expiry timestamp
            - attempts counter (max 5)
  Step 5 → App calls EmailJS API → EmailJS server → user's Gmail inbox
  Step 6 → User enters 6-digit OTP in the 6 boxes
  Step 7 → verifyOtpCode() checks:
            ✅ Does OTP match?
            ✅ Is it within 10 minutes?
            ✅ Less than 5 attempts?
  Step 8 → markUserVerified() → updates IndexedDB record
  Step 9 → User creates password → hashPassword() → SHA-256 via Web Crypto
  Step 10→ createSession() → 32-byte random token → saved to IndexedDB
            + token stored in localStorage for page reload memory
  Step 11→ User enters full dashboard ✅

──────────────────────────────────────────

LOGIN (returning user):

  Step 1 → User enters email + password
  Step 2 → getUserByEmail() → fetch from IndexedDB
  Step 3 → hashPassword(input) → SHA-256
  Step 4 → Compare hashes → match? ✅ → create session
  Step 5 → Dashboard ✅

──────────────────────────────────────────

PAGE RELOAD (session restore):

  Step 1 → App reads token from localStorage
  Step 2 → getSessionUser() → look up in IndexedDB
  Step 3 → Check 7-day expiry
  Step 4 → Fetch user → straight to dashboard ✅
            (No login needed for 7 days!)

──────────────────────────────────────────

FORGOT PASSWORD:

  Enter email → OTP sent → verify → set new password ✅
```

### Security Decisions

| Feature | Implementation | Why |
|---|---|---|
| Password hashing | SHA-256 via Web Crypto API | Browser-native, zero deps, no plain text ever stored |
| OTP generation | `window.crypto.getRandomValues()` | Cryptographically secure — not predictable like Math.random() |
| Session token | 32-byte hex via Web Crypto | 256-bit entropy — practically unguessable |
| OTP expiry | 10 minutes | Industry standard for OTP validity |
| Attempt limiting | Max 5 per OTP | Prevents brute force |
| Session expiry | 7 days | Balance between security and UX |

### IndexedDB Schema

```
Database: cargomind_db (v1)

├── Object Store: users
│   ├── id           → primary key (32-byte hex token)
│   ├── name         → full name
│   ├── email        → unique index
│   ├── mobile       → unique index
│   ├── passwordHash → SHA-256 hex string
│   ├── verified     → boolean (false until OTP verified)
│   ├── role         → "Freight Manager"
│   └── createdAt    → ISO timestamp
│
├── Object Store: sessions
│   ├── token        → primary key (32-byte hex)
│   ├── userId       → index → links to users.id
│   └── expiresAt    → timestamp (7 days from creation)
│
└── Object Store: otpStore
    ├── key          → primary key (email address)
    ├── otp          → 6-digit string
    ├── expiresAt    → timestamp (10 minutes)
    └── attempts     → number (max 5)
```

---

## 🌐 APIs Used

### API 1 — ExchangeRate-API (Live Currency Rates)

**Why I chose this:** Freight invoicing always involves multi-currency conversion. A freight manager in India needs to see rates in USD, EUR, CNY, and AED simultaneously.

```
Endpoint:  GET https://open.er-api.com/v6/latest/USD
Auth:      None required (free open tier)
Updates:   Every 24 hours
Currencies: 160+ world currencies
```

**What it returns:**
```json
{
  "result": "success",
  "base_code": "USD",
  "time_last_update_utc": "Fri, 02 May 2026 00:00:00 +0000",
  "rates": {
    "USD": 1,
    "EUR": 0.921,
    "GBP": 0.789,
    "INR": 83.12,
    "CNY": 7.231,
    "SGD": 1.343,
    "AED": 3.673,
    "JPY": 149.2,
    "KRW": 1325.4
  }
}
```

**How I use it in the app:**
- Fetched on component mount in `useExchangeRates` custom hook
- Auto-refreshes every 30 minutes via `setInterval`
- Graceful fallback to hardcoded rates if API is down
- Green/yellow indicator shows live vs cached data
- Powers the currency converter on the Freight Rates page

**Files:**
```
src/services/exchangeRateApi.js   ← API call + convertCurrency() helper
src/hooks/useExchangeRates.js     ← Custom hook with auto-refresh
src/pages/FreightRates.jsx        ← Currency converter UI
```

---

### API 2 — EmailJS (OTP Email Delivery)

**Why I chose this:** Most 2FA systems need a backend server to send emails (Node.js + Nodemailer + SMTP). EmailJS lets you send real emails directly from browser JavaScript by acting as the middleware.

```
Package:   @emailjs/browser
Service:   emailjs.com
Auth:      Service ID + Template ID + Public Key
Free tier: 200 emails/month
```

**How it works:**
```
React App
   ↓ emailjs.send(serviceId, templateId, { to_email, to_name, otp })
EmailJS Servers
   ↓ (uses your connected Gmail as sender)
User's Email Inbox ✉️
```

**Template variables I use:**
```
{{to_email}}  → recipient email address
{{to_name}}   → recipient full name (for personalisation)
{{otp}}       → the 6-digit OTP code
{{expires}}   → "10 minutes" (expiry info in email body)
{{app_name}}  → "CargoMind" (branding)
```

**Fallback behavior:**
If EmailJS is not configured (no `.env` keys), the app gracefully falls back — the OTP is shown in a yellow on-screen box so you can still test the entire flow locally without any setup.

**Files:**
```
src/services/emailService.js   ← EmailJS integration + fallback logic
src/context/AuthContext.jsx    ← Calls sendOtpEmail() during registration
.env.example                   ← Shows which keys are needed
```

---

## 📱 All Pages Explained

### 🏠 Landing Page
**Route:** `/` (before login)

The first page every visitor sees. Built to impress.

- **Animated world canvas** — 80×40 dot grid with 6 "ships" sailing across using `requestAnimationFrame` and `HTML5 Canvas API`. Written from scratch, no library.
- **Parallax hero** — `useScroll` + `useTransform` from Framer Motion makes the hero fade and move as you scroll
- **Animated counters** — `IntersectionObserver` triggers number count-up animation when stats section enters viewport
- **Feature cards** — 6 cards with `whileInView` animations from Framer Motion
- **3-step "How it works"** section with staggered slide-in animations
- **CTA banner** with glowing accent button
- Fully responsive across mobile, tablet, desktop

---

### 📝 Register Page
**Auth Step:** `register`

- Name, email, and mobile number fields with validation
- Real-time field error messages
- Mobile number auto-formatter (adds space after 5 digits)
- Calls `startRegistration()` → saves to IndexedDB → triggers OTP email

---

### 🔐 OTP Verify Page
**Auth Step:** `verify-otp`

- **6 individual input boxes** — each accepts one digit
- **Auto-advance** — cursor moves to next box automatically
- **Auto-submit** — form submits the moment all 6 are filled
- **Paste support** — paste `123456` and all boxes fill instantly
- **Shake animation** — boxes shake on wrong OTP using Framer Motion
- **Fallback OTP reveal** — yellow box shows OTP when EmailJS not configured
- **30-second resend timer** — countdown before resend is allowed
- **Max 5 attempts** before lockout

---

### 🔑 Set Password Page
**Auth Step:** `set-password`

- Live **password strength meter** — 4 colored bars (Weak/Fair/Good/Strong)
- **Requirements checklist** — each requirement lights up green as you meet it
  - 8+ characters
  - One uppercase letter
  - One number
  - One special character
- **Confirm password match** indicator
- Show/hide password toggle
- SHA-256 hashes password before saving

---

### 🔓 Login Page
**Auth Step:** `login`

- Email + password form
- Show/hide password toggle
- **Forgot Password** built into same page (mode toggle)
- Forgot flow: enter email → OTP sent → verify → set new password
- Form validation with inline error messages
- Session token created on success (7-day auto-restore)

---

### 📊 Dashboard
**Route:** `/`

The main overview page.

- **6 stat cards** — Total, In Transit, Delayed, Delivered, Total Value, On-Time Rate
  - Staggered entrance animation (each card delays 70ms)
  - Glow effect on hover
- **Area chart** — 6-month shipment volume + on-time rate trend
  - Gradient fills, custom tooltip, animated on render
- **Donut chart** — Commodity mix breakdown
  - Interactive active shape with center text
  - Mouse hover expands slice
- **Recent Shipments** — Top 3 with ShipmentCard components
- **Live Freight Rates table** — 6 trade lanes with 7-day change indicators

---

### 📦 Shipments Page
**Route:** `/shipments`

- **Status filter chips** — All / In Transit / Delayed / Customs / Delivered / Processing
- **Search** — Filters by ID, city, carrier, commodity in real time
- **Grid view** — Responsive card grid
- **List view** — Dense table layout
- **ShipmentCard** shows:
  - Animated route line with progress fill
  - Alert strip for delayed/customs shipments
  - 4 metadata fields (carrier, container type, ETA, commodity)
  - Animated progress bar
- **Slide-in Detail Panel** — clicking any card opens a full drawer with:
  - Complete route visualization
  - Journey progress with dates
  - Cargo details (weight, value, container)
  - Carrier info (vessel name, last update)
  - Document checklist

---

### 📈 Analytics Page
**Route:** `/analytics`

- **On-Time Performance bar chart** — weekly on-time vs delayed %
- **Monthly Volume area chart** — 6-month shipment count trend
- **Revenue by Trade Lane** — horizontal bar chart
- **KPI Grid** — 6 metrics:
  - Avg Transit Time
  - Claims Rate
  - Booking Lead Time
  - CO₂ per TEU
  - Container Utilization
  - Customs Dwell Time
  - Each with change indicator (green = improved, red = worse)

---

### 🏆 Carriers Page
**Route:** `/carriers`

- **6 carrier scorecards** — Maersk, MSC, CMA CGM, Hapag-Lloyd, Evergreen, COSCO
- Each card shows:
  - On-time rate with animated color-coded progress bar
  - Reliability index
  - Star rating (1-5)
  - Trade lane count
  - Average delay in days
  - Performance badge (Top Performer / Reliable / Monitor)
- `whileHover={{ y: -2 }}` lift animation on each card

---

### 💱 Freight Rates Page
**Route:** `/rates`

**The page with the REAL live API.**

- **API Status Banner** — green (live) or yellow (cached) indicator
- **Currency Converter** — powered by ExchangeRate-API:
  - Amount input
  - From/To currency selectors (8 major currencies)
  - Swap button
  - Live converted amount with exchange rate shown
  - All rates vs USD displayed as chips
  - Loading skeleton while API fetches
- **Spot Freight Rates table** — 6 trade lanes:
  - Route, mode, price, 7-day change %
  - Animated fill bar showing rate change magnitude

---

### 📄 Documents Page
**Route:** `/documents`

- Search bar filters by document name or shipment ID
- Type filter chips (BOL, Invoice, Packing, Certificate, Customs)
- Summary stats (total, approved, pending, required)
- Table with:
  - Color-coded document type tags
  - Status badges (Approved ✅ / Pending ⏳ / Required ⚠️)
  - Preview and Download action buttons
  - Download disabled for required (not yet uploaded) docs

---

### ⚙️ Settings Page
**Route:** `/settings`

- **Profile section** — Name, email, role with editable inputs
- **Notifications** — Toggle switches for each alert type
- **Regional** — Currency, date format, timezone, weight unit selectors
- **Display** — Compact view, animations, cargo value visibility
- **Security** — 2FA toggle, session timeout, password change, API keys
- **Save button** — Shows "✓ Saved!" confirmation for 2 seconds
- All toggles are animated with CSS transitions

---

## 📁 Project Structure

```
cargomind/
│
├── public/
│   └── index.html
│
├── src/
│   │
│   ├── components/              # Reusable UI components
│   │   ├── layout/
│   │   │   ├── Layout.jsx       # App shell — sidebar + topbar + <Outlet/>
│   │   │   ├── Layout.css
│   │   │   ├── Sidebar.jsx      # Collapsible nav with layout animation
│   │   │   ├── Sidebar.css
│   │   │   ├── Topbar.jsx       # Search bar + notification panel + live dot
│   │   │   └── Topbar.css
│   │   │
│   │   ├── shipments/
│   │   │   ├── ShipmentCard.jsx         # Card with animated route line
│   │   │   ├── ShipmentCard.css
│   │   │   ├── ShipmentDetailPanel.jsx  # Slide-in detail drawer
│   │   │   └── ShipmentDetailPanel.css
│   │   │
│   │   └── ui/
│   │       ├── StatCard.jsx      # KPI card with glow + entrance animation
│   │       ├── StatCard.css
│   │       ├── StatusBadge.jsx   # Color-coded pill with pulsing dot
│   │       └── ProgressBar.jsx   # Framer Motion animated bar
│   │
│   ├── context/
│   │   ├── AuthContext.jsx       # 8-step auth state machine
│   │   └── FreightContext.jsx    # Global shipment data + search/filter
│   │
│   ├── data/
│   │   └── mockData.js           # Realistic shipment, carrier, rate data
│   │
│   ├── hooks/
│   │   └── useExchangeRates.js   # ExchangeRate-API with 30-min auto-refresh
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx         # Stats + charts + rates overview
│   │   ├── Dashboard.css
│   │   ├── Shipments.jsx         # Grid/list view + detail panel
│   │   ├── Shipments.css
│   │   ├── Analytics.jsx         # Performance charts + KPI grid
│   │   ├── Analytics.css
│   │   ├── Carriers.jsx          # Carrier scorecards
│   │   ├── Carriers.css
│   │   ├── FreightRates.jsx      # Live currency converter + spot rates
│   │   ├── FreightRates.css
│   │   ├── Documents.jsx         # Document tracker
│   │   ├── Documents.css
│   │   ├── Settings.jsx          # User preferences
│   │   ├── Settings.css
│   │   └── auth/
│   │       ├── Landing.jsx       # Animated canvas hero + sections
│   │       ├── Landing.css
│   │       ├── RegisterPage.jsx  # Registration form
│   │       ├── OtpVerifyPage.jsx # 6-box OTP with auto-submit
│   │       ├── SetPasswordPage.jsx # Password + strength meter
│   │       ├── LoginPage.jsx     # Login + forgot password
│   │       ├── BrandPanel.jsx    # Shared left brand sidebar
│   │       └── Auth.css          # Shared auth design system
│   │
│   ├── services/
│   │   ├── localDb.js            # IndexedDB wrapper (users/sessions/OTP)
│   │   ├── emailService.js       # EmailJS + graceful fallback
│   │   └── exchangeRateApi.js    # Live currency API + convertCurrency()
│   │
│   ├── App.jsx                   # Root — AuthProvider + AppRouter gate
│   ├── index.js                  # ReactDOM.createRoot entry point
│   └── index.css                 # Global CSS variables design system
│
├── .env.example                  # Template for environment variables
├── vercel.json                   # Vercel config (CI=false, framework)
├── package.json                  # Dependencies + scripts
└── README.md                     # This file
```

---

## 💻 How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/cargomind.git

# 2. Enter the project
cd cargomind

# 3. Install all dependencies
npm install

# 4. (Optional) Set up EmailJS for real OTP emails
cp .env.example .env
# Edit .env with your EmailJS credentials

# 5. Start development server
npm start
# App opens at http://localhost:3000
```

> **Without `.env` setup:** The app works 100% — OTP is shown in an on-screen yellow box. Register, verify, login, logout — everything works locally.

---

## ☁️ Deployment on Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
npx vercel login

# Deploy to production
npx vercel --prod
```

**After deploying — add environment variables in Vercel Dashboard:**

```
Project → Settings → Environment Variables

CI                              = false
REACT_APP_EMAILJS_SERVICE_ID    = your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID   = your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY    = your_public_key
```

Then redeploy:
```bash
npx vercel --prod
```

---

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `CI` | Set to `false` to prevent Vercel treating warnings as errors | Yes (Vercel only) |
| `REACT_APP_EMAILJS_SERVICE_ID` | Your EmailJS service ID (e.g. `service_q4161wj`) | For real emails |
| `REACT_APP_EMAILJS_TEMPLATE_ID` | Your EmailJS template ID (e.g. `template_pi7zlyp`) | For real emails |
| `REACT_APP_EMAILJS_PUBLIC_KEY` | Your EmailJS public key | For real emails |

---

## 🧠 What I Learned Building This

- **IndexedDB** — How to use the browser's built-in database with object stores, indexes, and transactions
- **Web Crypto API** — Cryptographically secure random number generation and SHA-256 hashing without any npm package
- **Framer Motion** — `AnimatePresence`, `layoutId`, `useScroll`, `useTransform`, spring animations, stagger effects
- **HTML5 Canvas** — Drawing animated dot grids and moving "ship" trails using `requestAnimationFrame`
- **React Context API** — Managing complex auth state machines across 8 different steps
- **Custom hooks** — Encapsulating API calls with loading states and auto-refresh intervals
- **EmailJS** — Sending real emails from browser JavaScript without a backend server
- **Recharts** — Building custom active shapes, custom tooltips, gradient fills
- **Vercel deployment** — Environment variables, `vercel.json` config, CI flag handling

---

## 🔮 Future Plans

- [ ] Real vessel tracking via **MarineTraffic API**
- [ ] Interactive world map with **Mapbox GL**
- [ ] Backend with **Supabase** for multi-device sync
- [ ] Push notifications via **Firebase FCM**
- [ ] AI delay predictor using port congestion data
- [ ] PDF export for Bills of Lading
- [ ] React Native mobile companion app
- [ ] Multi-language support (Hindi, Tamil, Telugu)

---

## 👩‍💻 Author

**Yashaswini S**

- 📧 Email: yashaswini3191@gmail.com
- 🌐 Live: [cargomind.vercel.app](https://cargomind.vercel.app)

---

<div align="center">

**Built from scratch with React, Framer Motion, IndexedDB, Web Crypto API & EmailJS**

<br/>

⭐ **If this project helped you or impressed you — drop a star!** ⭐

</div>
