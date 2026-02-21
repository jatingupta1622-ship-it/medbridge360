# MedBridge360

## Overview

MedBridge360 is a medical tourism and hospital comparison platform that helps users find, compare, and choose hospitals based on treatment costs, ratings, and locations. Users can search for hospitals by treatment type and location, compare them side-by-side with detailed cost breakdowns, view hospital locations on an interactive map, and get AI-powered assistance through a chatbot widget. The app includes user authentication for personalized features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14 with App Router and TypeScript
- **Styling**: Tailwind CSS with a custom design system (custom colors, fonts, animations defined in `tailwind.config.ts` and `globals.css`)
- **UI Components**: Mix of custom components and Radix UI primitives (`@radix-ui/react-dialog`, `@radix-ui/react-slot`)
- **Utility Libraries**: `class-variance-authority`, `clsx`, `tailwind-merge` for className management (combined in `src/lib/utils.ts` via the `cn()` helper)
- **Icons**: Lucide React
- **Animations**: Framer Motion (installed but referenced as "ready"), plus CSS keyframe animations
- **Maps**: Leaflet.js loaded dynamically on the client side with OpenStreetMap tiles (no npm package — loaded via CDN scripts in the map page component)
- **State Management**: React Context for auth state (`AuthProvider`), local component state with `useState` for everything else, `localStorage` for compare list persistence

### Page Structure
- `/` — Landing page with search form, stats, feature highlights
- `/results` — Hospital search results with filtering, sorting, and compare selection
- `/hospital/[id]` — Detailed hospital page with treatment selector, cost breakdown table, and treatment timeline modal
- `/compare` — Side-by-side comparison of selected hospitals
- `/map` — Interactive map showing all hospital locations
- `/login` and `/register` — Authentication pages

### Backend Architecture
- **API Layer**: Next.js API Routes (Route Handlers in `src/app/api/`)
- **Database ORM**: Prisma Client (`src/lib/prisma.ts` uses singleton pattern for dev hot-reload safety)
- **Database**: PostgreSQL (configured through Prisma)
- **Key API Endpoints**:
  - `GET /api/hospitals` — List/search hospitals with optional `treatment` and `location` query params
  - `GET /api/hospital/[id]` — Single hospital detail with treatments
  - `POST /api/login` — Email/password login, returns JWT in HTTP-only cookie
  - `POST /api/register` — User registration with bcrypt password hashing
  - `POST /api/logout` — Clears auth cookie
  - `GET /api/me` — Returns current authenticated user from JWT cookie
  - `POST /api/chat` — AI chatbot endpoint (OpenAI or fallback)

### Authentication
- **Strategy**: JWT tokens stored in HTTP-only cookies
- **Library**: `jose` for JWT signing/verification (not `jsonwebtoken` — `jose` works in Edge runtime)
- **Password Hashing**: `bcryptjs` with salt rounds of 12
- **Token Lifetime**: 7 days
- **Secret**: `JWT_SECRET` environment variable (has a fallback for dev, must be set in production)
- **Client-Side**: `AuthProvider` context component fetches `/api/me` on mount and exposes `user`, `logout`, and `refreshUser`

### Data Model (Prisma)
The schema is defined in `prisma/schema.prisma` (not shown but inferred from seed data and API usage):
- **Hospital**: `id`, `name`, `city`, `state`, `country`, `rating`, `imageUrl`, `description`, `latitude`, `longitude`, `createdAt`, `updatedAt`
- **Treatment**: `id`, `hospitalId` (FK to Hospital), `treatmentName`, `baseCost`, `surgeryCost`, `medicationCost`, `hospitalStayCost`, `durationDays`, `createdAt`, `updatedAt`
- **User**: `id`, `name`, `email` (unique), `password`, `createdAt`
- Relationship: Hospital has many Treatments

### Database Seeding
- `prisma/seed.ts` populates the database with sample hospitals (Apollo Hospitals, Fortis, Medanta, etc.) each with multiple treatments and cost breakdowns
- Run with `npm run db:seed` (uses `ts-node`)

### Build Configuration
- TypeScript and ESLint errors are ignored during builds (`ignoreBuildErrors: true`, `ignoreDuringBuilds: true`) for faster iteration
- Webpack polling enabled for file watching (important for Replit's filesystem)
- All image domains allowed via `remotePatterns`

## External Dependencies

### Database
- **PostgreSQL** — Required. Connection string should be set as `DATABASE_URL` environment variable for Prisma.

### Environment Variables Required
| Variable | Purpose | Required |
|----------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string for Prisma | Yes |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars recommended) | Yes (has dev fallback) |
| `OPENAI_API_KEY` | OpenAI API key for chatbot | No (smart fallback included) |

### Third-Party Services
- **OpenAI API** (GPT-3.5-turbo) — Powers the AI chatbot widget. When no API key is configured, the system falls back to a rule-based response generator (`generateFallbackResponse` function in the chat route). This makes the chatbot functional without an API key.
- **OpenStreetMap + Leaflet.js** — Interactive maps loaded via CDN (`unpkg.com/leaflet@1.9.4`). No API key needed.
- **Unsplash** — Hospital images are sourced from Unsplash URLs (no API key needed, just direct image URLs).

### Key NPM Packages
- `@prisma/client` + `prisma` — Database ORM and CLI
- `next` 14.0.0 — Full-stack React framework
- `jose` — JWT operations (Edge-compatible)
- `bcryptjs` — Password hashing
- `openai` — OpenAI API client
- `framer-motion` — Animation library
- `lucide-react` — Icon library
- `@radix-ui/react-dialog` — Accessible modal dialogs

### Setup Commands
```bash
npm install
npx prisma generate    # Generate Prisma client
npx prisma db push     # Push schema to database
npm run db:seed        # Seed sample data
npm run dev            # Start development server
```