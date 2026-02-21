# MedBridge360 🏥

> **Compare Medical Costs. Choose Smarter.**

A full-stack production-ready medical tourism and hospital comparison platform built with Next.js 14, TypeScript, PostgreSQL, Prisma ORM, JWT Auth, and OpenAI.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + Custom Design System |
| Backend | Next.js API Routes (Node.js) |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (HTTP-only cookies via `jose`) |
| Maps | OpenStreetMap + Leaflet.js |
| AI Chat | OpenAI GPT-3.5 / Smart Fallback |
| Animations | CSS Animations + Framer Motion ready |
| Deployment | Vercel / Any Node.js host |

---

## 📋 Features

- 🔍 **Hospital Search** — Filter by treatment name and location
- 🃏 **Hospital Cards** — Image, rating, cost estimate, compare checkbox
- 📊 **Side-by-Side Compare** — Full cost breakdown with highlighted best values
- 📋 **Detailed Hospital Page** — Full breakdown, treatment selector, cost table
- 🗓️ **Treatment Timeline** — Step-by-step treatment journey modal
- 🗺️ **Interactive Map** — OpenStreetMap with all hospital markers
- 🤖 **AI Chatbot** — Floating widget powered by OpenAI (with smart fallback)
- 🔐 **Authentication** — JWT email/password with HTTP-only cookies
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key (optional — smart fallback included)

---

### Step 1: Clone & Install

```bash
git clone <your-repo-url>
cd medbridge360
npm install
```

---

### Step 2: Configure Environment Variables

Copy the example env file:
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
```env
# Required: PostgreSQL connection string
DATABASE_URL="postgresql://username:password@localhost:5432/medbridge360"

# Required: Strong secret key for JWT (min 32 chars)
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"

# Optional: OpenAI API (smart fallback works without it)
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Optional: Google Maps (currently using OpenStreetMap/Leaflet)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

---

### Step 3: Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed with sample hospital data
npm run db:seed
```

This will seed the database with **8 real hospitals** across India including:
- Apollo Hospitals (Chennai)
- Fortis Memorial Research Institute (Gurugram)
- Medanta - The Medicity (Gurugram)
- Max Super Speciality (New Delhi)
- Kokilaben Dhirubhai Ambani Hospital (Mumbai)
- Narayana Health City (Bangalore)
- AIIMS New Delhi
- Wockhardt Hospitals (Mumbai)

Each hospital has 4 treatments with full cost breakdowns.

---

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hospitals` | Get all hospitals (supports `?treatment=` and `?location=` query params) |
| GET | `/api/hospital/:id` | Get single hospital with all treatments |
| POST | `/api/register` | Register new user |
| POST | `/api/login` | Login user |
| POST | `/api/logout` | Logout user |
| GET | `/api/me` | Get current authenticated user |
| POST | `/api/chat` | AI chatbot (uses OpenAI or smart fallback) |

---

## 🗂️ Project Structure

```
medbridge360/
├── prisma/
│   ├── schema.prisma          # Database schema (User, Hospital, Treatment)
│   └── seed.ts                # Sample data seed script
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page (/)
│   │   ├── results/           # Search results (/results)
│   │   ├── hospital/[id]/     # Hospital detail (/hospital/:id)
│   │   ├── compare/           # Compare table (/compare)
│   │   ├── map/               # Interactive map (/map)
│   │   ├── login/             # Login (/login)
│   │   ├── register/          # Register (/register)
│   │   └── api/               # All API routes
│   │       ├── hospitals/
│   │       ├── hospital/[id]/
│   │       ├── login/
│   │       ├── register/
│   │       ├── logout/
│   │       ├── me/
│   │       └── chat/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── AuthProvider.tsx
│   │   └── ui/
│   │       ├── ChatWidget.tsx
│   │       ├── HospitalCard.tsx
│   │       └── LoadingScreen.tsx
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── auth.ts            # JWT utilities
│   │   └── utils.ts           # Helper functions
│   └── types/
│       └── index.ts           # TypeScript types
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## 🌐 User Journey

```
/ (Landing)
  → /results?treatment=cardiac&location=delhi (Search Results)
    → /hospital/[id] (Hospital Details + Cost Breakdown)
      → Compare modal → /compare?ids=id1,id2 (Side-by-Side)
    → /map (Interactive Map)
  → AI Chatbot (available on every page, bottom-right)
```

---

## 🚢 Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

```bash
npm run build   # Build for production
npm run start   # Start production server
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

---

## 🔐 Security Features

- Passwords hashed with bcrypt (12 rounds)
- JWT stored in HTTP-only cookies (XSS protected)
- Input validation on all API routes
- SameSite cookie policy
- Error messages don't leak sensitive info

---

## 🤖 AI Chatbot

The chatbot uses OpenAI GPT-3.5 when an API key is provided. Without a key, it uses a built-in smart fallback that:
- Answers cardiac, cancer, orthopedic queries
- Provides cost estimates and hospital recommendations  
- Explains treatment timelines
- Context-aware within the session

---

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `JWT_SECRET` | ✅ Yes | Secret key for signing JWTs (32+ chars) |
| `OPENAI_API_KEY` | ⚪ Optional | OpenAI API key for real AI responses |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | ⚪ Optional | Not used (using OpenStreetMap) |

---

## 🙋 Troubleshooting

**Database connection errors:**
```bash
# Make sure PostgreSQL is running
# Check your DATABASE_URL format:
# postgresql://user:password@host:port/dbname
```

**Prisma errors after schema changes:**
```bash
npm run db:generate
npm run db:push
```

**OpenAI errors:**
- The app works without an API key using smart fallback responses
- Check your API key is valid and has credits

---

Built with ❤️ using Next.js 14, Prisma, PostgreSQL, and OpenAI
