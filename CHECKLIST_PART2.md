# TaraLaro — Part 2: Feature Gaps & Dead UI Checklist

> Audit date: 2026-06-13  
> All items below are either dead touchables, hardcoded mock data, or missing features.  
> Grouped by screen. Check off as you ship each fix.

---

## 🔴 Critical — App feels broken

### Tab Navigation (`src/app/(tabs)/_layout.tsx`)
- [x] **"Library" tab routes to DiscoverScreen** — renamed tab label to "Discover" to match `DiscoverScreen` ✅
- [x] **"Create" tab is hidden** — added FAB on Today/home screen that navigates to `/create` ✅
- [ ] **Notifications vs Community mismatch** — the `notifications` tab is labelled "Community" and renders `CommunityScreen`. If real per-user notifications exist (Day 25 Supabase Realtime was built), they need their own tab/screen.

---

## 🟠 Profile Screen (`src/screens/profile/ProfileScreen.tsx`)

- [x] **Settings button** — gear icon in top-right now links to `/settings` ✅
- [x] **All data is hardcoded** — profile now loads real displayName, @username, bio, and avatar initials from `GET /api/users/me` ✅
- [x] **Stats row is hardcoded** — now shows real postsCount, followersCount, followingCount from API ✅
- [x] **Follow button has no `onPress`** — replaced with "Edit Profile" button (navigates to `/settings`; Follow/Message only relevant on other users' profiles) ✅
- [x] **Message button has no `onPress`** — removed; messaging not built yet ✅
- [x] **Entry tiles have no `onPress`** — Library and Posts tiles navigate to Discover; Lists/Following show "coming soon" alert ✅
- [x] **"Library →" link in Now Playing has no handler** — now navigates to Discover tab ✅
- [ ] **Now Playing uses hardcoded game 'lumen'** — should load from actual user library API.
- [ ] **"↑" / share button removed** — left placeholder spacer only. Consider wiring a share-profile action here later.

---

## 🟠 Library Screen (`src/screens/library/LibraryScreen.tsx`)

- [ ] **All data is hardcoded** — game IDs ('stardust', 'neon', 'lumen'), progress values, session dates, tab counts (3, 14, 142, 48). Should load from the user's real library entries via API.
- [ ] **Playing rows have no `onPress`** — tapping a game row should navigate to `/games/[id]`.
- [ ] **Grid/layout toggle buttons have no `onPress`** — the two icon buttons in the header (⊞ ◎) do nothing. Implement a layout toggle or remove them.
- [ ] **Shelf tabs are decorative** — switching tabs (Wishlist, Finished, Reviews) does not change what's displayed. Each tab should filter the list.
- [ ] **Streak card is hardcoded** — "14h 32m · 5 day streak", "+3h vs last week" are mock values. Needs real play-session tracking or remove the card for now.

---

## 🟠 Today / Home Screen (`src/screens/today/TodayScreen.tsx`)

- [x] **Date and greeting are hardcoded** — now uses `new Date()` and the authenticated user's name from session ✅
- [x] **Header ◎ button has no `onPress`** — now navigates to `/search` ✅
- [ ] **"+ Library" button has no `onPress`** — tapping "Add to Library" on the Today Pick should call the library-add API.
- [ ] **Editorial quote is hardcoded** — static placeholder text. Either pull from a real editorial API or remove the section.
- [x] **"See all" / section right-links have no navigation** — `SectionLabel` now accepts `onPress`; Continue links to Discover tab, Friends links to Community tab ✅
- [ ] **All games are hardcoded mock data** — 'lumen', 'stardust', 'neon', 'cobalt', 'hollow' from the local GAMES object. Should load from the real games API.
- [ ] **Friend activity rows are hardcoded** — Theo, Kira, Jules are fictional. Should load from the following feed or remove the section.

---

## 🟠 Community Screen (`src/screens/notifications` / CommunityScreen)

- [ ] **Composer "+" button has no `onPress`** — should navigate to CreateScreen or open a bottom sheet.
- [ ] **Group cards have no `onPress`** — tapping a group does nothing. Needs a group detail screen or navigates to a filtered feed.
- [ ] **Thread rows have no `onPress`** — tapping a discussion thread does nothing. Needs a thread detail screen.
- [ ] **All groups are hardcoded** — Cozy Players, Soulslike, etc. are static mock data. Should load from a groups API or Supabase table.
- [ ] **All threads are hardcoded** — static discussion items with fake reply/like counts.
- [ ] **Header stats are hardcoded** — "47 posts today · 18.4k active" are not real numbers.

---

## 🟡 Discover Screen (`src/screens/discover/DiscoverScreen.tsx`)

- [x] **Dark theme** — converted from light (#FAFAFA) to TL dark theme ✅
- [x] **Duplicate key crash in news FlatList** — fixed, now uses `item.url` as key ✅
- [ ] **NewsCard has no `onPress`** — tapping a news article should open the article URL (`Linking.openURL(article.url)`).
- [ ] **GameCard "See all" section links** — "All Games", "Trending Games", "New Releases" section headers have no "See all" navigation.

---

## 🟡 Search Screen (`src/app/search.tsx`)

- [ ] **User search returns nothing** — the search query initialises `users: []` and never fetches users. If user search is intended, wire it to `/api/users?search=`.
- [ ] **Tapping a user result** — check whether the user result row navigates to the user profile; if not, add `router.push('/users/' + user.id)`.

---

## 🟡 Settings Screen (`src/app/settings.tsx`)

- [ ] Appears fully functional (edit profile, avatar upload, change password, sign out). **Confirm sign-out redirects to `/login` after calling `supabase.auth.signOut()`** — verify the auth listener in `_layout.tsx` handles this.

---

## 🟡 Dead/Leftover Files

- [ ] **`src/app/explore.tsx`** — contains the Expo starter template boilerplate (file-based routing docs, collapsible sections, animated images). This is not a real app screen. Either repurpose it or delete it.

---

## 💡 Suggested Improvements

### Navigation
- Add a **Floating Action Button (FAB)** on the feed/home tab for creating posts — far more discoverable than a hidden tab.
- Add a **back-to-top** button on long scrolling lists (Library, Discover).

### Profile
- Make the profile screen **context-aware**: show Follow/Message buttons only when viewing _another_ user's profile; show Edit Profile when viewing your own.
- Load avatar from Supabase Storage `avatarUrl` instead of initials.

### Library
- Real **game status tracking** (Playing / Wishlist / Finished / Dropped) per user — this is the core differentiator of the app.
- **Progress tracking** (% complete, hours played) tied to play sessions.

### Community / Social
- **Real notifications** screen distinct from the Community tab — unread badge on the tab icon.
- In-app **deep links** from notification items to the relevant post/review.

### Games
- **"Write a Review" CTA** on the game detail screen should be more prominent.
- **Related games** section on game detail (same genre, from the existing `/api/games?genre=` endpoint).

### General Polish
- Replace all hardcoded dates with `new Date().toLocaleDateString()`.
- Replace all hardcoded user names with data from `useAuth()`.
- Add **skeleton loaders** on screens that are still showing mock data (Library, Today, Profile stats).
- All `TouchableOpacity` wrappers should have `activeOpacity={0.7}` for consistent press feedback.
