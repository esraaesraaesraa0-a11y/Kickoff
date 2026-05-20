# ⚽ KickOff - Live Football Platform

A premium, real-time football web platform built with Next.js 16, featuring live scores, league standings, match centers, and breaking news.

![Dark Theme](https://img.shields.io/badge/Theme-Premium_Dark-0B0F17?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=flat-square)

## 🏟️ Features

- **🔴 Live Scores** — Real-time match updates with auto-refresh (30s polling)
- **📊 League Standings** — Full tables for EPL, La Liga, Champions League, Egyptian PL
- **🎯 Match Center** — Deep match details: lineups, statistics, event timelines
- **📰 News Feed** — Breaking news with league filtering
- **🌙 Dark/Light Mode** — Premium dark theme with toggle
- **📱 Fully Responsive** — Mobile-first with bottom navigation

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 16 (App Router) | SSR + ISR + Client-side rendering |
| TypeScript 5 | Type safety |
| Tailwind CSS 4 | Styling with custom sports theme |
| shadcn/ui | Component library |
| TanStack React Query | Server state management & caching |
| next-themes | Dark/Light mode |
| Lucide React | Icons |
| API-Football | Real football data (api-sports.io) |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- API-Football key (free at [api-football.com](https://www.api-football.com/))

### Installation

```bash
# Clone the repo
git clone https://github.com/esraaesraaesraa0-a11y/Kickoff.git
cd Kickoff

# Install dependencies
bun install

# Set up environment
cp .env.example .env
# Edit .env and add your API_FOOTBALL_KEY

# Run development server
bun run dev
```

### Environment Variables

```env
# Required for real data (get free key at api-football.com)
API_FOOTBALL_KEY=your_api_key_here
API_FOOTALL_BASE_URL=https://v3.football.api-sports.io

# Database (auto-configured)
DATABASE_URL=file:./db/custom.db
```

> **Note:** The platform works without an API key using built-in demo data. Add your key for real live scores!

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── fixtures/          # Live & scheduled fixtures API
│   │   ├── fixtures/[id]/     # Match detail API
│   │   └── standings/         # League standings API
│   ├── globals.css            # Custom sports theme
│   ├── layout.tsx             # Root layout + providers
│   └── page.tsx               # Main SPA page
├── components/
│   ├── football/
│   │   ├── header.tsx         # Desktop + mobile nav
│   │   ├── live-ticker.tsx    # Horizontal live scores ticker
│   │   ├── featured-matches.tsx
│   │   ├── quick-standings.tsx
│   │   ├── news-feed.tsx
│   │   ├── live-scores.tsx    # Full live scores page
│   │   ├── full-standings.tsx # Standings + top scorers
│   │   ├── match-center.tsx   # Timeline, stats, lineups
│   │   ├── full-news.tsx
│   │   ├── mobile-nav.tsx
│   │   ├── providers.tsx      # React Query provider
│   │   └── theme-provider.tsx
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── api/
│   │   ├── football-api.ts    # API-Football service layer
│   │   └── hooks.ts           # React Query hooks
│   ├── mock-data.ts           # Demo data + TypeScript types
│   └── utils.ts
└── hooks/                     # Custom React hooks
```

## 🎨 Design System

| Element | Color |
|---------|-------|
| Background | `#0B0F17` (Obsidian) |
| Surface/Cards | `#1E293B` (Slate) |
| Accent/Live | `#22C55E` (Electric Green) |
| Text Primary | `#FFFFFF` |
| Text Secondary | `#94A3B8` (Muted Gray) |

## 🔌 API Integration

The platform uses **API-Football** (api-sports.io) with smart caching:

| Data Type | Cache TTL | Auto-refresh |
|-----------|-----------|-------------|
| Live Scores | 30 seconds | ✅ |
| Fixtures by Date | 2 minutes | ✅ |
| League Standings | 5 minutes | ✅ |
| Match Details | 1 minute | ✅ |

### Smart Fallback
- **With API key** → Real live data from api-sports.io
- **Without API key** → Graceful fallback to demo data with visual indicator

## 📜 License

MIT License - feel free to use and modify!
