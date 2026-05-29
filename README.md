# Reading Nook

A cozy, shared digital bookshelf for two. Track what you're reading, rate books, send recommendations to each other, and keep a daily reading streak.

Built with Next.js 16, React 19, Tailwind CSS 4, and Upstash Redis. Deployed on Vercel.

## Features

- **Dual bookshelf** — toggle between two readers' shelves
- **Smart cover search** — type a title and get matches from Open Library + AniList (light novels too) with cover art, author, and one-click auto-fill
- **Full editing** — edit title, author, cover URL, status, rating, and notes inline in the detail modal
- **Book recommendations** — send book recs to the other reader with a note; mark as read
- **Daily check-in** — tap in each day to build a reading streak
- **Cozy atmosphere** — fireplace, fairy lights, and film grain overlay

## Getting started

### Prerequisites

- Node.js 20+
- An [Upstash Redis](https://console.upstash.com) database (free tier works)

### Setup

```bash
# Clone and install
git clone <repo-url>
cd reading-nook
npm install

# Create environment file
cp .env.example .env.local
```

Fill in `.env.local` with your Upstash credentials from the [Upstash Console](https://console.upstash.com):

```env
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

```bash
# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deploy

Connect the repo to Vercel — it auto-detects Next.js. Add the two `UPSTASH_*` environment variables in the Vercel dashboard, and you're live.

## Project structure

```
├── app/
│   ├── api/
│   │   ├── books/         # CRUD for books
│   │   ├── checkin/       # Daily check-in endpoint
│   │   ├── covers/        # Cover image lookup (Open Library → AniList)
│   │   ├── recs/          # Book recommendations
│   │   └── search/        # Title search with results
│   ├── layout.tsx
│   └── page.tsx           # Server component → fetches data → passes to client
├── components/
│   ├── ambient/           # Fireplace, fairy lights, grain overlay
│   ├── recs/              # Recommendation cards + send drawer
│   ├── shelf/             # Bookshelf grid, book cards, detail modal, add form
│   ├── stats/             # Streak calendar, check-in button
│   └── ui/                # Nav, shared UI primitives
├── lib/
│   ├── books.ts           # Book CRUD against Upstash Redis
│   ├── checkin.ts         # Daily check-in + streak logic
│   ├── kv.ts              # Upstash Redis client
│   ├── names.ts           # Display name mapping
│   └── recs.ts            # Recommendation CRUD
├── types/
│   └── index.ts           # Book, Rec, CheckIn, StreakData types
└── public/                # Static assets
```

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Animation | [motion](https://motion.dev) |
| Icons | [Phosphor](https://phosphoricons.com) |
| Database | [Upstash Redis](https://upstash.com/redis) |
| Hosting | [Vercel](https://vercel.com) |
| Language | TypeScript |
