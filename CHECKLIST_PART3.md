# TaraLaro — Part 3: Color, Images, Real Data & Content Checklist

> Audit date: 2026-06-13
> Four categories: (1) real data / no more mock, (2) dark-theme conversion for light-mode screens, (3) game image / cover fix, (4) content and empty-state gaps.

---

## 🔴 Real Data — Remove ALL mock data, wire everything to live APIs

> **Context:** The app currently has two data layers running side-by-side:
> - A **real backend** (Prisma + Supabase + Expo Router API routes) that's mostly wired up
> - A **mock layer** (`GAMES` constant in `tl-shared.tsx`, local `GROUPS`/`THREADS` arrays, hardcoded user names) that blocks every screen from showing real content
>
> The goal of this section is to kill the mock layer entirely.

---

### Step 0 — Seed the database (do this first, everything below depends on it)

- [ ] **Run the existing seed** — `prisma/seed.ts` already has 15 real games (Elden Ring, BG3, Stardew Valley, etc.) but the database is empty. Run:
  ```bash
  npx prisma db seed
  ```
  This creates all 15 games with slug-based IDs (`elden-ring`, `baldurs-gate-3`, etc.), genres, descriptions, and ratings. **No coverUrl yet** — see the RAWG step below.

- [ ] **Add `DIRECT_URL` to `.env` if missing** — Prisma requires both `DATABASE_URL` (pooler) and `DIRECT_URL` (direct connection) for migrations and seeds. Check `.env.example` for the format.

---

### Step 1 — Real game cover images via RAWG API

> **RAWG** (`rawg.io`) is a free public game database with cover images, genres, and metadata. Free tier: 20,000 requests/month. No OAuth — just an API key.

- [ ] **Get a RAWG API key** — sign up at rawg.io/apidocs, add to `.env`:
  ```
  RAWG_API_KEY=your_key_here
  ```

- [ ] **Update `prisma/seed.ts` to fetch cover images from RAWG** — for each game in the seed list, call:
  ```
  GET https://api.rawg.io/api/games?search={title}&key={RAWG_API_KEY}&page_size=1
  ```
  Use `results[0].background_image` as the `coverUrl`. Example response field:
  ```json
  { "background_image": "https://media.rawg.io/media/games/...jpg" }
  ```
  Re-run `npx prisma db seed` after updating seed.ts — the `upsert` will patch in the coverUrls.

- [ ] **Add a `/api/games/sync` admin endpoint (optional but useful)** — POST endpoint that fetches fresh metadata + cover images from RAWG for all games in the DB and patches them. Useful when adding new games without re-running the seed manually.

---

### Step 2 — Fix `GameCard` to show real cover images

**File:** `src/modules/games/components/GameCard.tsx`

- [ ] **Replace the gray placeholder box with a real image** — `GameCard` currently renders `<View style={styles.cover} />` (a static `#E5E7EB` box). It should render:
  ```tsx
  import { Image } from 'expo-image'
  // ...
  {game.coverUrl
    ? <Image source={{ uri: game.coverUrl }} style={styles.cover} contentFit="cover" />
    : <View style={[styles.cover, styles.coverFallback]}><Text style={styles.coverQ}>?</Text></View>
  }
  ```
- [ ] **Apply TL dark theme to `GameCard` styles** — `#E5E7EB` → `TL.surface2`, `#111827` → `TL.ink`, `#CA8A04` → `TL.amber`.

---

### Step 3 — Fix `GameCover` to show real URLs

**File:** `src/components/game/GameCover.tsx`

- [ ] **Accept `coverUrl?: string | null` as a prop** — when `coverUrl` is provided, render an `<Image>` instead of looking up the SVG map. The SVG art can stay as a fallback for screens still using mock IDs (Today, Library, Profile until they're migrated).
  ```tsx
  export function GameCover({ id, coverUrl, w, h, radius, flat }: GameCoverProps) {
    if (coverUrl) {
      return <Image source={{ uri: coverUrl }} style={{ width: w, height: h, borderRadius: flat ? 0 : radius ?? TL.radiusSm }} contentFit="cover" />
    }
    // existing SVG map lookup...
  }
  ```

---

### Step 4 — Today screen: replace mock data with real API calls

**File:** `src/screens/today/TodayScreen.tsx`

- [ ] **Remove `import { GAMES } from '@/components/tl-shared'`** — this is the entire mock layer for the Today screen.

- [ ] **Today's Pick — load from real games API** — fetch the highest-rated game via `GET /api/games` (already sorted by `avgRating` desc). The first result becomes the "Today's Pick".
  ```tsx
  const { games } = useGames()
  const todayPick = games[0] ?? null
  ```

- [ ] **"Pick up where you left off" — load from user's library** — this section requires a Library API (see Step 6). Until then, hide the section when there's no real library data instead of showing fake entries.

- [ ] **"From your circle" — load from following feed** — `GET /api/posts` already returns a following feed. Map the latest posts from followed users into the friend activity row. If no one is followed, show "Follow some players to see their activity."

- [ ] **"+ Library" button on Today Pick** — wire to `POST /api/library` (Step 6) or hide until library API is built.

---

### Step 5 — Discover screen: `GameCard` already loads real data — just needs cover images

The `DiscoverScreen` already fetches from the real API via `useGames()`. Once Step 1 (seed) and Step 2 (`GameCard` image fix) are done, this screen will show real games with real covers automatically. No further changes needed to the Discover screen data flow.

- [ ] **Verify after seeding** — open Discover and confirm 15 real games appear with cover images.

---

### Step 6 — Build the Library API (UserGame model)

> Currently there is no `UserGame` model in Prisma. The Library screen and "Now Playing" are entirely mock. This is the core differentiator of the app.

- [ ] **Add `UserGame` model to `prisma/schema.prisma`**:
  ```prisma
  model UserGame {
    id        String   @id @default(cuid())
    userId    String
    gameId    String
    status    String   // "playing" | "wishlist" | "finished" | "dropped"
    progress  Int      @default(0)   // 0–100
    user      User     @relation(fields: [userId], references: [id])
    game      Game     @relation(fields: [gameId], references: [id])
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    @@unique([userId, gameId])
  }
  ```
  Add the reverse relation `userGames UserGame[]` to both `User` and `Game` models.

  > ⚠️ **Schema migration required** — run `npx prisma migrate dev --name add-user-game` after editing schema.

- [ ] **`POST /api/library`** — add a game to the user's library with a status.
  Returns `{ oldData, newData }`.

- [ ] **`GET /api/library`** — returns the authenticated user's library entries (joined with Game data), filterable by `?status=playing`.

- [ ] **`PATCH /api/library/[gameId]`** — update status or progress.

- [ ] **Wire Library screen to real API** — replace the hardcoded `PLAYING_GAMES` array with data from `GET /api/library?status=playing`.

- [ ] **Wire "Now Playing" on Profile screen** — fetch `GET /api/library?status=playing&limit=1` and show the first result. Hide the section if empty.

- [ ] **Wire "Pick up where you left off" on Today screen** — fetch `GET /api/library?status=playing&limit=2`.

- [ ] **Wire "Wishlist" / "Finished" / "Reviews" tabs in Library screen** — each tab calls `GET /api/library?status={tab}`.

- [ ] **Wire "Library" stat count on Profile screen** — `GET /api/library` returns count; show in the stats row.

---

### Step 7 — Community screen: replace mock groups and threads with real posts

**File:** `src/screens/community/CommunityScreen.tsx`

- [ ] **Remove `const GROUPS = [...]` and `const THREADS = [...]` local arrays** — these are entirely fake.

- [ ] **Wire threads to real posts feed** — `GET /api/posts` already returns a feed. Map posts into the `ThreadRow` component (post content as title, user as author, likesCount/commentsCount as stats). Navigate on press to `/posts/${post.id}`.

- [ ] **Groups section** — there is no Group model in the schema. Either:
  - (a) Remove the groups grid until groups are built, or
  - (b) Keep as "Featured Topics" with static genre-based labels (Cozy, Soulslike, JRPG, Indie) that filter the post feed by tag/game genre when tapped.

- [ ] **Header stats** — replace "47 posts today · 18.4k active" with real counts:
  - Posts today: `SELECT COUNT(*) FROM Post WHERE createdAt > now() - interval '1 day'`
  - Add `GET /api/stats` or inline the count in the existing posts endpoint.

- [ ] **Composer avatar** — replace `<Avatar name="You" />` with the real user's initials/avatar from `useAuth()` + profile query.

---

### Step 8 — Profile screen: remove all remaining hardcoded references

**File:** `src/screens/profile/ProfileScreen.tsx`

- [ ] **"Now Playing" section** — already noted in Step 6. Load from `GET /api/library?status=playing&limit=1` or hide if empty. Remove `import { GAMES }` from this file.

---

### Step 9 — Library screen: remove all hardcoded game data

**File:** `src/screens/library/LibraryScreen.tsx`

- [ ] **Remove `import { GAMES }` and the `PLAYING_GAMES` constant** — depends on Step 6 (Library API). Once `GET /api/library` is live, replace with a `useQuery` call.

- [ ] **Shelf tab counts** — replace the hardcoded `count: 3 / 14 / 142 / 48` in `SHELF_TABS` with real counts from the library API response.

---

### Step 10 — Delete the `GAMES` mock constant once all consumers are migrated

**File:** `src/components/tl-shared.tsx`

- [ ] **Remove `export const GAMES = { ... }`** — once Today, Library, and Profile screens no longer import it, delete the entire block. It's 30 lines of fictional game data that has no place in a production app.

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
