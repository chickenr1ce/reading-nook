## Stack
- **Next.js** 16 (App Router, Turbopack) · **React** 19 · **TypeScript** 5 (strict)
- **Tailwind v4** (via `@tailwindcss/postcss`) · **Motion** (fka Framer Motion, `motion/react`)
- **Phosphor** icons · **Upstash Redis** (`@upstash/redis`) · **nanoid** for IDs

## Layout
```
app/            Next.js App Router pages + API routes + globals.css
  api/books/    CRUD for shared bookshelf (hash per book, sorted-set indexes)
  api/recs/     Book recommendations between users
  api/checkin/  Daily check-in tracking (streaks, calendar)
components/
  ambient/      Fireplace glow, FairyLights strand, GrainOverlay (all client leaves)
  shelf/        Bookshelf grid, BookCard, BookDetail modal, AddBookForm dropdown, ShelfToggle
  recs/         RecDrawer (slide-out panel), RecCard
  stats/        CheckInButton (streak + calendar), CozyStats
  ui/           Nav, ThemeProvider, ThemeToggle (3-theme pill)
lib/            Redis client (lazy Proxy), CRUD helpers (books/recs/checkin), names
types/          Book, Rec, CheckIn, UserId ("you" | "her"), StreakData, MonthCheckins
```

## Commands
```
npm run dev      next dev (Turbopack)
npm run build    next build
npm run start    next start
npm run lint     eslint
npx tsc --noEmit typecheck (no script, run manually)
```

## Conventions
- **Client boundaries**: components using Motion/`useState`/browser APIs start with `"use client"` at line 1
- **Path alias**: `@/*` maps to `.` (e.g. `import { redis } from "@/lib/kv"`)
- **Types**: `import type` for type-only imports; shared types in `types/index.ts`
- **CSS**: semantic tokens (`bg-surface`, `text-accent`) via Tailwind `@theme inline` bound to CSS custom properties; themes (`forest`/`garden`/`starlight`) set via `[data-theme]` on `<html>`
- **Icons**: Phosphor exclusively
- **No test suite** configured

## Watch out for
- **Lazy Redis**: `lib/kv.ts` exports a Proxy that creates the Upstash client on first call, not at import. This avoids a Vercel edge-case where env vars (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) aren't available at module init.
- **User IDs vs names**: internal UserId is `"you" | "her"`. Display names live in `lib/names.ts` — change only that file to rename users.
- **Redis data model**: books → hash `books:{id}` + sorted-set indexes `books:index:{you,her,all}`. Check-ins → hash `checkin:{userId}:{date}` + sorted set `checkin:dates:{userId}`. Reset via `DELETE /api/checkin`.
- **Tailwind v4**: uses `@import "tailwindcss"` + `@theme inline` in CSS. No `tailwind.config.ts`. PostCSS plugin is `@tailwindcss/postcss`.
- **`page.tsx` is `force-dynamic`**: it calls Redis in a server component — cannot be statically rendered.
