# TaraLaro — Part 3: Color, Images, Real Data & Content Checklist

> Audit date: 2026-06-13 | Last updated: 2026-06-13
> Status: **ALL ITEMS COMPLETE** ✅

---

## 🔴 Real Data — Remove ALL mock data, wire everything to live APIs

- [x] **Run seed** — `npx prisma db seed` seeds 10 paid games + up to 20 FreeToGame games with cover images ✅
- [x] **`DIRECT_URL` in `.env`** — required for migrations ✅ (user confirmed done)
- [x] **GameCard shows real cover images** — `expo-image` + `coverUrl`, dark-theme styles ✅
- [x] **GameCover accepts `coverUrl` prop** — renders real image when provided, SVG fallback otherwise ✅
- [x] **Today's Pick — real games API** — `useGames()[0]` (highest rated) ✅
- [x] **"+ Library" button on Today Pick** — calls `POST /api/library`, shows loading + "✓ Added" ✅
- [x] **"From your circle" — real posts feed** — wired to `GET /api/posts`, empty state shown ✅
- [x] **"Pick up where you left off"** — shows empty state placeholder until user adds games ✅
- [x] **`UserGame` schema** — added to `prisma/schema.prisma` with status + progress ✅ (migration run by user)
- [x] **`POST /api/library`** — upserts a game into user's library ✅
- [x] **`GET /api/library`** — returns library entries, filterable by `?status=` ✅
- [x] **`PATCH /api/library/[gameId]`** — updates status/progress ✅
- [x] **Library screen** — fully wired to real API, tabs filter by status, live counts ✅
- [x] **Profile "Now Playing"** — loads from `GET /api/library?status=playing&limit=1`, hidden if empty ✅
- [x] **Community threads** — wired to real posts feed, navigates to post detail ✅
- [x] **Community topics** — GROUPS replaced with genre-filter tiles that route to Discover ✅
- [x] **Community header stats** — removed fake numbers, replaced with real subtitle ✅
- [x] **Community composer avatar** — uses real user's name from `useAuth()` ✅
- [x] **`GAMES` mock constant deleted** from `tl-shared.tsx` — no remaining consumers ✅

---

## 🔴 Critical — Broken features

- [x] **`GameCover` uses hardcoded SVG keys** — now accepts `coverUrl` prop, renders real image ✅
- [x] **Game detail shows no cover** — dark-theme placeholder + real cover from `coverUrl` ✅
- [x] **"Game not found"** — resolved by running `npx prisma db seed` ✅

---

## 🟠 Color / Theme — All light-mode screens converted to TL dark theme

- [x] **Search screen** — full TL dark theme ✅
- [x] **Settings screen** — full TL dark theme ✅
- [x] **Game detail screen + route** — full TL dark theme ✅
- [x] **Post detail screen + route** — full TL dark theme ✅
- [x] **User profile screen** — full TL dark theme ✅
- [x] **News card** — full TL dark theme ✅

---

## 🟡 Content — All gaps addressed

- [x] **Game detail "Write a Review" CTA** — prominent amber button ✅
- [x] **Game detail "Related games"** — "More like this" horizontal row filtered by genre ✅
- [x] **Discover empty state** — shows loading state + ActivityIndicator while fetching ✅
- [x] **Community groups → genre topics** — tapping routes to Discover filtered by genre ✅
- [x] **Community header stats** — removed fake numbers ✅
- [x] **Today mock games** — removed, all using real API ✅
- [x] **Library mock rows** — removed, all using real API ✅
- [x] **Profile "Now Playing" mock** — removed, uses real library API ✅

---

## 💡 Polish

- [x] **`activeOpacity={0.7}`** — applied on all new/updated touchables ✅
- [x] **Skeleton loaders** — pulsing skeletons on Profile, Library, Game Detail, and Today screens ✅
- [x] **Back button on detail screens** — all `[id].tsx` route wrappers have `←` back button ✅
