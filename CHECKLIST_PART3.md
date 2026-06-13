# TaraLaro — Part 3: Color, Images & Content Checklist

> Audit date: 2026-06-13
> Three categories: (1) dark-theme conversion for light-mode screens, (2) game image / cover fix, (3) content and empty-state gaps.

---

## 🔴 Critical — Broken features

### Game images / covers

- [ ] **`GameCover` uses hardcoded SVG keys, not real IDs** — `GameCover` resolves covers via a `COVER_MAP` dict keyed by mock strings (`'lumen'`, `'stardust'`, etc.). Real games from the database have UUID ids that never match, so every real game card shows the `?` fallback. `GameCover` needs to accept a `coverUrl` prop and render that instead of the SVG map when available.

- [ ] **Game detail screen shows no cover image** — `GameDetailScreen` falls back to a `#E5E7EB` gray box when `game.coverUrl` is null/empty. The `coverUrl` field in the database may be empty for seeded games. Either seed real cover URLs or show a styled placeholder that matches TL dark theme.

- [ ] **"Game not found" on every game press from Discover** — The discover screen fetches real games from the DB (UUID ids). The `GameDetailScreen` fetches `/api/games/[id]` with that UUID. If the games table is empty the screen shows "Game not found". Run `npx prisma db seed` or manually seed at least a handful of games with `coverUrl` values so the detail screen has something to show.

---

## 🟠 Color / Theme — Light-mode screens must be converted to TL dark theme

The app has two parallel color systems. Dark-themed screens (auth, today, profile, library, community) look correct. These screens still use Tailwind-like light grays and whites and look mismatched:

### Search screen (`src/app/search.tsx`)

- [ ] **Background** — `#FAFAFA` → `TL.bg`; header `#FFFFFF` → `TL.surface`; border `#E5E7EB` → `TL.border`
- [ ] **Search bar** — `backgroundColor: '#F3F4F6'` → `TL.surface2`
- [ ] **Text colors** — `#111827` → `TL.ink`; `#6B7280` → `TL.muted`; `#9CA3AF` → `TL.faint`
- [ ] **Section header** — `backgroundColor: '#F9FAFB'` → `TL.bgTint`
- [ ] **Amber accent** — `#FACC15` / `#CA8A04` → `TL.amber`
- [ ] **Row background** — `#FFFFFF` → `TL.surface`

### Settings screen (`src/app/settings.tsx`)

- [ ] **Screen background** — `#FAFAFA` → `TL.bg`
- [ ] **Header / card backgrounds** — `#FFFFFF` → `TL.surface`
- [ ] **Borders** — `#E5E7EB` → `TL.border`
- [ ] **Labels / text** — `#111827` → `TL.ink`; `#374151` → `TL.ink2`; `#9CA3AF` → `TL.muted`
- [ ] **Amber accent** — `#FACC15` / `#CA8A04` → `TL.amber`
- [ ] **Danger row border** — `#FCA5A5` → use `TL.border` with red text `#EF4444` as-is (acceptable)

### Game detail screen (`src/screens/games/GameDetailScreen.tsx` + `src/app/games/[id].tsx`)

- [ ] **Background** — `#FFFFFF` / light backgrounds → `TL.bg`
- [ ] **Text** — `#111827` → `TL.ink`; `#6B7280` → `TL.muted`; `#4B5563` → `TL.ink2`
- [ ] **Cards / section backgrounds** — `#F3F4F6` → `TL.surface`; `#E5E7EB` → `TL.border`
- [ ] **Amber** — `#FACC15` / `#CA8A04` → `TL.amber`
- [ ] **Cover placeholder** — gray `#E5E7EB` box → `TL.surface2` with amber "?" placeholder

### Post detail screen (`src/screens/posts/PostDetailScreen.tsx` + `src/app/posts/[id].tsx`)

- [ ] **Background** — `#FFFFFF` / light → `TL.bg` / `TL.surface`
- [ ] **Text** — `#111827` → `TL.ink`; `#6B7280` → `TL.muted`; `#9CA3AF` → `TL.faint`
- [ ] **Header / card borders** — `#E5E7EB` → `TL.border`
- [ ] **Amber** — `#FACC15` → `TL.amber`

### User profile screen (`src/app/users/[username].tsx`)

- [ ] **Background** — `#FAFAFA` → `TL.bg`
- [ ] **Cards** — `#FFFFFF` → `TL.surface`
- [ ] **Text** — `#111827` → `TL.ink`; `#6B7280` → `TL.muted`
- [ ] **Amber** — `#FACC15` → `TL.amber`
- [ ] **Borders** — `#E5E7EB` → `TL.border`

### News card (`src/modules/news/components/NewsCard.tsx`)

- [ ] **Card background** — `#FFFFFF` → `TL.surface`
- [ ] **Border** — `#E5E7EB` → `TL.border`
- [ ] **Title text** — `#111827` → `TL.ink`
- [ ] **Source / time text** — `#9CA3AF` → `TL.muted`
- [ ] **Source accent** — `#CA8A04` → `TL.amber`

---

## 🟡 Content — Lacking data, placeholder text, or empty states

### Game detail (`src/screens/games/GameDetailScreen.tsx`)

- [ ] **No games in the database** — if the games table is empty, every game detail shows "Game not found". Seed at least 5–10 games with title, genre, description, and coverUrl.
- [ ] **"Write a Review" CTA is low-visibility** — the button for writing a review exists but is easy to miss. Make it more prominent (amber button, not a small link).
- [ ] **Related games section is missing** — the checklist suggestion from Part 2: add a "More like this" horizontal row using `/api/games?genre=` filtered by the current game's genre.

### Discover screen (`src/screens/discover/DiscoverScreen.tsx`)

- [ ] **Trending / New Releases sections show no games if DB is empty** — no empty-state message. Add a "No games yet — check back soon" placeholder when `games.length === 0`.

### Community screen

- [ ] **Header stats hardcoded** — "47 posts today · 18.4k active" are still fake. Either hide the stats row or pull real counts from the API.
- [ ] **All groups are hardcoded** — `GROUPS` array is local mock data. Should load from a groups API or Supabase table (or clearly label as "featured" if kept static).
- [ ] **All threads are hardcoded** — `THREADS` array is local mock data. Wire to real posts/feed endpoint.

### Today screen (`src/screens/today/TodayScreen.tsx`)

- [ ] **"+ Library" button on Today Pick has no `onPress`** — still a dead touchable (skipped in Part 2 as needing library API). Either wire to `/api/library` add endpoint or hide the button until the library API is built.
- [ ] **All games are hardcoded mock data** — `GAMES['lumen']`, `GAMES['stardust']`, etc. should load from the real games API once the DB is seeded.
- [ ] **Friend activity rows are hardcoded** — Theo, Kira, Jules are fictional. Should load from the following feed or remove the section.

### Library screen (`src/screens/library/LibraryScreen.tsx`)

- [ ] **All game rows are hardcoded** — still uses `GAMES['stardust']` etc. Should load from the user's real library entries via API once the library feature is built.

### Profile screen (`src/screens/profile/ProfileScreen.tsx`)

- [ ] **"Now Playing" uses a hardcoded mock game** — `GAMES['lumen']` hardcoded. Should load from the user's active library entry or be hidden if no games are in progress.

---

## 💡 Polish

- [ ] **`activeOpacity={0.7}`** — add to all `TouchableOpacity` components across the app for consistent press feedback (currently inconsistent).
- [ ] **Skeleton loaders** — screens that fetch async data (Profile stats, Game detail, Post detail) show nothing while loading. Add shimmer/skeleton placeholders.
- [ ] **Back button on detail screens** — confirm that `[id].tsx` route wrappers all have a back button or rely on native swipe-back (ok on iOS, not on Android).
