# tara-laro — 30-Day Build Checklist

Gaming community app for the global gamer. Discover games, write reviews, post content, follow gamers, read gaming news. Instagram-style UI with a yellow/white palette.

**Stack:** Expo 55 · expo-router · NativeWind · Supabase · PostgreSQL · Prisma · TypeScript

---

## Week 1 — Foundation & Setup (Days 1–7)

### Day 1 — Tooling & Services Setup
- [ ] Install NativeWind + configure `tailwind.config.js` and `babel.config.js`
- [ ] Create Supabase project, save `SUPABASE_URL` + `SUPABASE_ANON_KEY`
- [ ] Install `@supabase/supabase-js`
- [ ] Initialize Prisma (`npx prisma init --datasource-provider postgresql`)
- [ ] Configure `DATABASE_URL` in `.env` pointing to Supabase Postgres
- [ ] Install `@tanstack/react-query` for data fetching

### Day 2 — Design System
- [ ] Update `src/constants/theme.ts` with yellow/white palette
- [ ] Configure NativeWind with custom colors matching palette
- [ ] Build base UI atoms: `Button`, `Input`, `Avatar`, `Card`, `Badge`, `Divider`
- [ ] Build `Typography` component variants (heading, body, caption)
- [ ] Set splash screen background to primary yellow (`#FACC15`)

### Day 3 — Prisma Schema & DB
- [ ] Write full Prisma schema (User, Game, Post, Review, Comment, Like, Follow, Notification)
- [ ] Run schema migration via Supabase dashboard (copy SQL from `prisma migrate diff`)
- [ ] Create `src/lib/prisma.ts` singleton
- [ ] Seed initial game data (10–20 games for testing)

### Day 4 — Auth Screens UI
- [ ] Build `(auth)/_layout.tsx` (full-screen, no tabs)
- [ ] Build `login.tsx` screen (email/password + OAuth buttons)
- [ ] Build `register.tsx` screen (email, password, username)
- [ ] Build `forgot-password.tsx` screen
- [ ] Style all auth screens with yellow/white branding

### Day 5 — Auth Logic
- [ ] Create `src/lib/supabase.ts` client
- [ ] Create `src/hooks/use-auth.ts` (session state, signIn, signOut, signUp)
- [ ] Wire up email/password auth via Supabase
- [ ] Add Google OAuth via Supabase (configure in Supabase dashboard)
- [ ] Add Discord OAuth via Supabase (configure in Supabase dashboard)
- [ ] Handle session persistence with `AsyncStorage`

### Day 6 — Onboarding Flow
- [ ] Build post-registration onboarding: pick username + avatar
- [ ] Build game preference picker (multi-select genre screen)
- [ ] Create `src/app/api/users/[id]+api.ts` (GET/PATCH user)
- [ ] Persist user profile to DB on first login (link Supabase user → Prisma User)
- [ ] Route guard: redirect unauthenticated users to `(auth)/login`

### Day 7 — Navigation Shell
- [ ] Build `(tabs)/_layout.tsx` with Instagram-style bottom tabs (5 tabs)
- [ ] Tab icons: Home, Discover, + (create), Bell, Profile
- [ ] Style active tab with primary yellow indicator
- [ ] Placeholder screens for all 5 tabs
- [ ] Verify deep linking + route protection

---

## Week 2 — Feed & Game Discovery (Days 8–14)

### Day 8 — Feed Screen
- [ ] Build `PostCard` component (avatar, username, image, caption, game tag, actions)
- [ ] Build `FeedHeader` (stories row placeholder + header bar)
- [ ] Build `PostActions` (like button w/ count, comment icon, share)
- [ ] Style with yellow accent on active like

### Day 9 — Feed API
- [ ] Create `src/app/api/posts/index+api.ts` (GET paginated feed, POST create)
- [ ] Prisma query: posts from followed users + trending, ordered by `createdAt` desc
- [ ] Connect Feed screen to API with React Query + infinite scroll
- [ ] Add pull-to-refresh

### Day 10 — Post Detail
- [ ] Build `posts/[id].tsx` screen (full post + comments thread)
- [ ] Build `CommentItem` component
- [ ] Create `src/app/api/posts/[id]+api.ts` (GET post with comments)
- [ ] Tap post card → navigate to detail

### Day 11 — Discover Screen UI
- [ ] Build `GameCard` component (cover image, title, genre badge, avg rating)
- [ ] Build Discover screen: sections (Trending Games, New Releases, By Genre)
- [ ] Horizontal scroll rows per section
- [ ] Search bar at top (local filter for now)

### Day 12 — Games API
- [ ] Create `src/app/api/games/index+api.ts` (GET games with filters)
- [ ] Create `src/app/api/games/[id]+api.ts` (GET game + reviews summary)
- [ ] Wire Discover screen to games API

### Day 13 — Game Detail Screen
- [ ] Build `games/[id].tsx` (cover hero, description, reviews list, "Write Review" CTA)
- [ ] Build `RatingStars` component
- [ ] Show top 5 reviews with link to all

### Day 14 — Search
- [ ] Expand search bar to full search screen (games + users + posts)
- [ ] Debounced search API queries
- [ ] Results grouped by type with section headers

---

## Week 3 — Content Creation & Social (Days 15–21)

### Day 15 — Post Creation Screen
- [ ] Install `expo-image-picker`
- [ ] Build `create.tsx` screen (photo picker, caption input, tag-a-game selector)
- [ ] Multi-image support (up to 5 images, carousel preview)
- [ ] Yellow "Post" CTA button

### Day 16 — Image Upload + Post API
- [ ] Configure Supabase Storage bucket (`posts`)
- [ ] Upload selected images to Supabase Storage, get public URLs
- [ ] Wire POST to `src/app/api/posts/index+api.ts`
- [ ] Optimistic UI update in feed after post

### Day 17 — User Profile Screen
- [ ] Build `profile.tsx` (own profile) and `users/[username].tsx` (public)
- [ ] Build `ProfileHeader` (avatar, display name, bio, follower/following counts, edit btn)
- [ ] Build `PostGrid` (3-col image grid, tappable)
- [ ] Build `StatBlock` (posts count, followers, following)

### Day 18 — Follow System
- [ ] Create follow/unfollow endpoints in `src/app/api/users/[id]+api.ts`
- [ ] Follow/Unfollow button with optimistic toggle
- [ ] Following feed vs trending toggle on Home

### Day 19 — Like & Comment
- [ ] Like/unlike endpoints in `src/app/api/posts/[id]+api.ts`
- [ ] Animated heart button (scale + color to yellow)
- [ ] Comment input on post detail screen
- [ ] Create `src/app/api/posts/[id]/comments+api.ts` (POST comment)

### Day 20 — Review Creation
- [ ] Build review composer screen (star rating picker, text input, game context)
- [ ] Create `src/app/api/reviews/index+api.ts`
- [ ] Show user's own review on game detail if already reviewed (edit mode)

### Day 21 — Review Display & Rating
- [ ] Build `ReviewCard` component (avatar, rating stars, content, date)
- [ ] Full reviews list screen for a game (`games/[id]/reviews.tsx`)
- [ ] Sort by newest / highest rating
- [ ] Recalculate `avgRating` on game record on review create/update

---

## Week 4 — Polish, News & Launch Prep (Days 22–30)

### Day 22 — Gaming News Feed
- [ ] Integrate a free gaming news API (IGDB, GamesRadar RSS, or NewsAPI)
- [ ] Build `NewsCard` component (thumbnail, headline, source, time)
- [ ] News section on Discover screen (horizontal scroll at top)
- [ ] Tap → open in-app browser via `expo-web-browser`

### Day 23 — Notifications
- [ ] Build `notifications.tsx` screen (grouped: likes, follows, comments)
- [ ] Build `NotificationItem` component with type icons
- [ ] Create `src/app/api/notifications/index+api.ts` (GET list, PATCH mark-read)
- [ ] Unread badge count on tab icon

### Day 24 — Settings Screen
- [ ] Build settings screen (edit profile, change password, sign out)
- [ ] Edit profile form: display name, bio, avatar re-upload
- [ ] Danger zone: delete account (soft-delete `deleted: true`)

### Day 25 — Realtime (Supabase Realtime)
- [ ] Subscribe to new notifications on mount in notifications screen
- [ ] Live comment count update on post detail
- [ ] Live like count (optimistic + realtime sync)

### Day 26 — Empty States & Error Handling
- [ ] Build reusable `EmptyState` component (illustration + message + CTA)
- [ ] Empty feed → "Follow some gamers or explore games"
- [ ] Error boundary wrapper for API failures
- [ ] Network offline banner

### Day 27 — Performance
- [ ] Image lazy loading with `expo-image` blurhash placeholders
- [ ] FlatList `getItemLayout` + `keyExtractor` optimization on feed
- [ ] React Query cache tuning (`staleTime`, `gcTime`)
- [ ] Memoize heavy list item components with `React.memo`

### Day 28 — App Branding
- [ ] Design new app icon (yellow background, gaming theme)
- [ ] Update splash screen to yellow with app logo
- [ ] Update `app.json`: name, scheme, colors
- [ ] Add Expo app store metadata fields

### Day 29 — EAS Build Setup
- [ ] Install EAS CLI, run `eas build:configure`
- [ ] Set up `eas.json` (development, preview, production profiles)
- [ ] Add all env vars to EAS secrets
- [ ] Trigger a preview build to test on physical device

### Day 30 — Final QA & Cleanup
- [ ] Full manual QA pass: auth flows, feed, post creation, profile, reviews, notifications
- [ ] Fix any linting errors (`expo lint`)
- [ ] No `console.log`, `any`, or `@ts-ignore` in codebase
- [ ] Write concise `README.md` (setup instructions, env vars needed)
- [ ] Tag `v0.1.0` release commit

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#FACC15` | Buttons, active states, accents |
| `primary-light` | `#FEF08A` | Backgrounds, highlights |
| `primary-dark` | `#CA8A04` | Pressed states, borders |
| `surface` | `#FFFFFF` | Cards, sheets |
| `surface-2` | `#FAFAFA` | Screen backgrounds |
| `surface-3` | `#F5F5F5` | Subtle dividers |
| `muted` | `#E5E7EB` | Borders, separators |
| `text` | `#111827` | Primary text |
| `text-2` | `#6B7280` | Secondary/muted text |

## New Dependencies (Day 1)
```bash
npx expo install nativewind tailwindcss@^3 babel-preset-expo
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
npm install prisma --save-dev
npm install @prisma/client
npx expo install @tanstack/react-query
npx expo install expo-image-picker
npm install react-native-url-polyfill
```
