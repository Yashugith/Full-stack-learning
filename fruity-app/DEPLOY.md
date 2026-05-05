# 🚀 DEPLOY & GITHUB GUIDE
## Fruity App — Complete Step-by-Step

---

## PART 1 — PUSH TO GITHUB 🐙

### 1.1 — Create a GitHub account (skip if you have one)
```
→ Go to: https://github.com
→ Click "Sign up"
→ Choose a username, email, password
→ Verify your email
```

---

### 1.2 — Create a new repo on GitHub

```
→ Click the "+" icon in the top-right corner
→ Select "New repository"
→ Fill in:
    Repository name:  fruity-app
    Description:      🍓 A cute fruit shop + life tracker app
    Visibility:       ✅ Public
→ ❌ Do NOT check "Add a README file"
→ ❌ Do NOT check "Add .gitignore"
→ Click "Create repository"
```

You'll see a page with setup commands — keep this open!

---

### 1.3 — Open your terminal

**Mac:** Press `Cmd + Space` → type "Terminal" → Enter

**Windows:** Press `Win + R` → type `cmd` or `powershell` → Enter

**VS Code:** Open fruity-app folder → Terminal → New Terminal

---

### 1.4 — Navigate into the project folder

```bash
# Mac / Linux
cd ~/Downloads/fruity-app

# Windows
cd C:\Users\YourName\Downloads\fruity-app

# Confirm you're in the right place — should list project files
ls        # Mac/Linux
dir       # Windows
```

---

### 1.5 — Run these commands ONE BY ONE

```bash
# ── Step 1: Initialize git ──────────────────────────────────────────────
git init
# Output: "Initialized empty Git repository in ..."

# ── Step 2: Stage all files ─────────────────────────────────────────────
git add .
# (no output = good!)

# ── Step 3: Create first commit ─────────────────────────────────────────
git commit -m "🍓 Initial commit — Fruity App"
# Output: shows list of files committed

# ── Step 4: Connect to your GitHub repo ─────────────────────────────────
# ⚠️ REPLACE "YOUR_USERNAME" with your actual GitHub username!
git remote add origin https://github.com/YOUR_USERNAME/fruity-app.git

# ── Step 5: Set branch name to "main" ───────────────────────────────────
git branch -M main

# ── Step 6: Push to GitHub! ─────────────────────────────────────────────
git push -u origin main
```

When it asks for credentials:
- **Username:** your GitHub username
- **Password:** use a Personal Access Token (not your password!)

> 🔑 **Get a token:** GitHub → Settings → Developer settings →
> Personal access tokens → Tokens (classic) → Generate new token →
> tick "repo" → Generate → copy the token → paste as password

---

### 1.6 — Verify it worked

```
→ Go to: https://github.com/YOUR_USERNAME/fruity-app
→ You should see all your files + the README with screenshots!
```

---

### 1.7 — Push future updates

```bash
# After making any changes to your code:

git add .
git commit -m "✨ your message here"
git push

# Examples of good commit messages:
# git commit -m "🍋 Add lemon smoothie recipe"
# git commit -m "🐛 Fix cart total calculation"
# git commit -m "🎨 Update banner colors"
```

---
---

## PART 2 — DEPLOY ON NETLIFY 🌐

> Netlify is FREE for personal projects. Your app gets a public URL like:
> `https://fruity-app-abc123.netlify.app`

---

### METHOD A — Drag & Drop (Easiest — no terminal needed)

```bash
# Step 1: Build the app (run this in terminal inside fruity-app folder)
npm run build

# A /dist folder is created — this is your production app
```

```
Step 2: Go to → https://app.netlify.com
Step 3: Sign up / log in (use GitHub to sign in — easiest!)
Step 4: On the dashboard, find the big box that says:
         "Want to deploy a new site without connecting to Git?"
Step 5: Drag your entire /dist folder into that box
Step 6: Wait 10 seconds...
Step 7: ✅ Your app is LIVE!
         You'll get a URL like: https://amazing-fruit-abc.netlify.app
Step 8: Click "Site settings" → "Change site name"
         to rename it to: fruity-app
         → New URL: https://fruity-app.netlify.app
```

---

### METHOD B — Connect GitHub (Best — auto deploys every push)

```
Step 1: Go to → https://app.netlify.com
Step 2: Click "Add new site" → "Import an existing project"
Step 3: Click "Deploy with GitHub"
Step 4: Authorize Netlify to access your GitHub
Step 5: Search for and select: fruity-app
Step 6: Configure build settings:
         Branch to deploy:   main
         Build command:      npm run build
         Publish directory:  dist
Step 7: Click "Deploy fruity-app"
Step 8: Wait ~1 minute for the build to complete
Step 9: ✅ Your app is LIVE!

🎯 BONUS: Now every time you do "git push",
         Netlify automatically redeploys your app!
```

---

### Netlify Custom Domain (Optional)

```
Step 1: In Netlify dashboard → "Domain settings"
Step 2: Click "Add custom domain"
Step 3: Type your domain (e.g. fruityapp.com)
Step 4: Follow DNS instructions from your domain provider
Step 5: Netlify gives you FREE SSL (https://) automatically!
```

---
---

## PART 3 — DEPLOY ON VERCEL ☁️

> Alternative to Netlify — also free, also great!

### METHOD A — Vercel CLI

```bash
# Step 1: Install Vercel CLI
npm install -g vercel

# Step 2: Run from inside fruity-app folder
vercel

# Answer the interactive prompts:
# ? Set up and deploy "fruity-app"? → Y (yes)
# ? Which scope? → your-username
# ? Link to existing project? → N (no)
# ? What's your project's name? → fruity-app (press Enter)
# ? In which directory is your code? → ./ (just press Enter)
# ? Want to modify these settings? → N (no)

# Your app is live at:
# https://fruity-app-yourname.vercel.app
```

### METHOD B — Vercel Dashboard

```
Step 1: Go to → https://vercel.com
Step 2: Sign up with GitHub
Step 3: Click "New Project"
Step 4: Import your fruity-app GitHub repo
Step 5: Vercel auto-detects Vite — just click "Deploy"
Step 6: ✅ Live in ~30 seconds!
```

---
---

## PART 4 — DEPLOY ON GITHUB PAGES 📄

> Free hosting directly from your GitHub repo!

```bash
# Step 1: Install the gh-pages package
npm install --save-dev gh-pages

# Step 2: Add this to your package.json scripts section:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"
# Also add this line at the top level of package.json:
# "homepage": "https://YOUR_USERNAME.github.io/fruity-app"
```

Then edit `vite.config.js` to add the base path:

```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  base: '/fruity-app/',   // ← add this line
})
```

```bash
# Step 3: Deploy!
npm run deploy

# Your app is live at:
# https://YOUR_USERNAME.github.io/fruity-app
```

---
---

## QUICK REFERENCE CHEATSHEET 📋

```bash
# ── LOCAL DEVELOPMENT ───────────────────────────────
npm install          # install dependencies (first time only)
npm run dev          # start dev server → http://localhost:5173
npm run build        # build for production → /dist folder
npm run preview      # preview production build locally

# ── GIT / GITHUB ────────────────────────────────────
git init                          # initialize git repo
git add .                         # stage all changes
git commit -m "your message"      # save a commit
git push                          # push to GitHub
git pull                          # get latest from GitHub
git status                        # see what changed
git log --oneline                 # see commit history

# ── NETLIFY CLI ──────────────────────────────────────
netlify login                     # log in to Netlify
netlify deploy --prod --dir=dist  # deploy to production
netlify open                      # open your live site

# ── VERCEL CLI ───────────────────────────────────────
vercel                            # deploy (interactive)
vercel --prod                     # deploy to production
vercel ls                         # list your deployments
```

---

## TROUBLESHOOTING ❗

| Problem | Solution |
|---------|----------|
| `git push` asks for password repeatedly | Set up SSH key or use credential manager |
| GitHub says "repo already exists" | Use a different name or delete old repo |
| Netlify build fails | Check build log — usually a missing dependency |
| Site shows old version after deploy | Hard refresh: `Ctrl+Shift+R` (Win) / `Cmd+Shift+R` (Mac) |
| 404 error on page refresh | The `public/_redirects` file fixes this (already included!) |
| `npm run build` fails | Run `npm install` first, then try again |
| Vercel says "no framework detected" | Select "Vite" manually in project settings |

---

## USEFUL LINKS 🔗

| Resource | URL |
|----------|-----|
| GitHub | https://github.com |
| Netlify | https://netlify.com |
| Vercel | https://vercel.com |
| Node.js Download | https://nodejs.org |
| GitHub Personal Access Tokens | https://github.com/settings/tokens |
| Netlify Docs | https://docs.netlify.com |
| Vite Docs | https://vitejs.dev/guide |

---

*Made with 🍓 — Happy deploying!*
