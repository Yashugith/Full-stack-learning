# 🤖 NeuralChat — AI Chat Application
 
A production-ready AI chat app built with Next.js, Groq (free AI), Neon PostgreSQL, and Upstash Redis.
 
---
 
## ✨ Features
 
- 💬 Real-time streaming AI responses
- 🎨 Premium dark UI with animations
- 📱 Responsive — works on mobile, tablet, desktop
- 🔐 Secure authentication (email + password)
- 💾 Full chat history saved to database
- ⚡ Ultra-fast Llama 3 AI via Groq (completely free)
- 🌙 Dark/Light mode toggle
- 📊 Dashboard with usage stats
- ⚙️ Settings — model selection, temperature, system prompt
---
 
## 🆓 All Services Used Are FREE
 
| Service | Purpose | Cost |
|---------|---------|------|
| Groq | AI responses (Llama 3) | ✅ Free forever |
| Neon | PostgreSQL database | ✅ Free forever |
| Upstash | Redis cache | ✅ Free forever |
| Vercel | Deployment | ✅ Free forever |
 
---
 
## 📋 Prerequisites
 
- Node.js 18 or higher → nodejs.org
- VS Code → code.visualstudio.com
---
 
## 🔑 Step 1 — Get Your Free Keys
 
### 1. NEXTAUTH_SECRET
Run this command in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Copy the output.
 
---
 
### 2. GROQ_API_KEY (Free AI — No credit card!)
1. Go to https://console.groq.com
2. Sign up with Google
3. Click API Keys → Create API Key
4. Name it neuralchat → Submit
5. Copy the key (starts with gsk_)
---
 
### 3. DATABASE_URL (Free PostgreSQL)
1. Go to https://neon.tech
2. Sign up with Google
3. Click Create Project
4. Name: neuralchat → Create Project
5. Click Show password on the connection string
6. Copy the full connection string
Looks like:
```
postgresql://neondb_owner:password@ep-something.aws.neon.tech/neondb?sslmode=require
```
 
---
 
### 4. REDIS_URL (Free Redis)
1. Go to https://upstash.com
2. Sign up with Google
3. Click Create Database
4. Name: neuralchat, Region: AP Southeast 1 → Create
5. Scroll to Details section → click TCP tab
6. Click eye icon to reveal password
7. Copy the full URL
Looks like:
```
rediss://default:password@your-host.upstash.io:6379
```
 
---
 
## ⚙️ Step 2 — Setup Environment File
 
1. Find the file called .env.example in the project
2. Rename it to .env
3. Open .env and fill in your values:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
 
DATABASE_URL=YOUR_NEON_CONNECTION_STRING
 
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=YOUR_GENERATED_SECRET
 
GROQ_API_KEY=gsk_YOUR_GROQ_KEY
 
REDIS_URL=rediss://default:PASSWORD@YOUR_HOST.upstash.io:6379
 
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=
```
 
4. Save the file (Ctrl+S)
---
 
## 📦 Step 3 — Install Dependencies
 
Open terminal in VS Code and run:
```bash
npm install --legacy-peer-deps
```
Wait 2-3 minutes for it to finish.
 
---
 
## 🗄️ Step 4 — Setup Database
 
Run these commands one by one:
 
```bash
npm run db:generate
```
 
```bash
npm run db:push
```
If it asks "reset database? (y/N)" → type y and press Enter
 
```bash
npm run db:seed
```
 
You should see:
```
✅ Demo user created!
   Email:    demo@neuralchat.ai
   Password: Demo1234!
```
 
---
 
## 🚀 Step 5 — Run the App
 
```bash
npm run dev
```
 
Wait for:
```
✓ Ready in 4.2s
```
 
Open your browser and go to:
```
http://localhost:3000
```
 
---
 
## 🔐 Step 6 — Login
 
Click Sign in with Email and enter:
- Email: demo@neuralchat.ai
- Password: Demo1234!
---
 
## 📁 Project Structure
 
```
neuralchat-v2/
├── src/
│   ├── app/
│   │   ├── (app)/              ← Protected pages with sidebar layout
│   │   │   ├── dashboard/      ← Stats and recent chats
│   │   │   ├── chat/           ← New chat page
│   │   │   ├── chat/[id]/      ← Existing conversation
│   │   │   └── settings/       ← AI model and preferences
│   │   ├── api/
│   │   │   ├── auth/           ← NextAuth login handler
│   │   │   ├── chat/           ← Streaming AI endpoint
│   │   │   ├── conversations/  ← Chat history CRUD
│   │   │   └── users/stats/    ← Dashboard statistics
│   │   ├── login/              ← Login page
│   │   ├── layout.tsx          ← Root layout with fonts
│   │   ├── globals.css         ← Global styles
│   │   └── page.tsx            ← Redirects to dashboard or login
│   ├── components/
│   │   ├── chat/
│   │   │   ├── chat-interface.tsx   ← Main chat with streaming
│   │   │   ├── chat-message.tsx     ← Message bubbles + markdown
│   │   │   └── chat-input.tsx       ← Input box with send button
│   │   └── layout/
│   │       ├── sidebar.tsx          ← Left navigation sidebar
│   │       ├── app-header.tsx       ← Top header bar
│   │       └── providers.tsx        ← React Query + Auth providers
│   ├── lib/
│   │   ├── ai/openai.ts        ← Groq API streaming client
│   │   ├── auth/config.ts      ← NextAuth configuration
│   │   ├── db/prisma.ts        ← Prisma database client
│   │   ├── queue/workers.ts    ← Background job processing
│   │   └── redis/client.ts     ← Upstash Redis cache client
│   ├── store/chat.ts           ← Zustand state management
│   ├── types/index.ts          ← TypeScript type definitions
│   └── utils/
│       ├── cn.ts               ← Tailwind class merger
│       └── uuid.ts             ← UUID generator
├── prisma/
│   ├── schema.prisma           ← Database schema
│   └── seed.ts                 ← Demo data seeder
├── .env.example                ← Environment variables template
├── package.json                ← Dependencies
├── tailwind.config.js          ← Tailwind CSS config
├── next.config.mjs             ← Next.js config
└── tsconfig.json               ← TypeScript config
```
 
---
 
## 🤖 Available AI Models (All Free via Groq)
 
| Model | Best For | Speed |
|-------|---------|-------|
| Llama 3.3 70B | Complex tasks, coding, analysis | Medium |
| Llama 3.1 8B | Quick questions, everyday chat | Very Fast |
| Mixtral 8x7B | Technical writing, long documents | Fast |
| Gemma 2 9B | Balanced, accurate responses | Fast |
 
Switch models anytime in Settings page.
 
---
 
## 🛠️ Available Scripts
 
| Command | What it does |
|---------|-------------|
| npm run dev | Start development server |
| npm run build | Build for production |
| npm run start | Start production server |
| npm run db:generate | Generate Prisma client |
| npm run db:push | Push schema to database |
| npm run db:seed | Add demo user and data |
| npm run db:studio | Open Prisma database viewer |
 
---
 
## 🌐 Deploy to Vercel (Free)
 
1. Push your code to GitHub
2. Go to vercel.com → Import project
3. Connect your GitHub repo
4. Add all environment variables from your .env file
5. Click Deploy
---
 
## ❓ Common Issues
 
### "Something went wrong" when chatting
- Your GROQ_API_KEY is missing or wrong
- Go to console.groq.com and create a new key
- Paste it in .env file and restart with npm run dev
### "Cannot connect to database"
- Your DATABASE_URL is wrong
- Go to neon.tech and copy the connection string again
- Make sure it ends with ?sslmode=require
### Port already in use
```bash
npm run dev -- -p 3001
```
Then open http://localhost:3001
 
### Changes to .env not working
- Always restart the server after changing .env
- Press Ctrl+C to stop, then npm run dev again
### npm install fails
```bash
npm install --legacy-peer-deps --force
```
 
---
 
## 📞 Tech Stack
 
- Framework: Next.js 14 with App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Animations: Framer Motion
- State: Zustand + TanStack Query
- Auth: NextAuth.js v5
- Database: PostgreSQL via Prisma ORM
- AI: Groq API (Llama 3, Mixtral)
- Cache: Redis via Upstash
- Forms: React Hook Form + Zod validation
- Markdown: React Markdown with syntax highlighting
---
 
Made with ❤️ — NeuralChat
 