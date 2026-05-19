# tara-laro

A social hub for the global gaming community. Discover new titles, read and write reviews, post your gaming content, follow other gamers, and stay up-to-date with gaming news — all in one place.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo 55 + expo-router (file-based routing) |
| Language | TypeScript |
| Styling | NativeWind (Tailwind CSS for React Native) |
| Database | PostgreSQL via Supabase |
| ORM | Prisma (via Expo API Routes) |
| Auth | Supabase Auth (Email, Google, Discord OAuth) |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime |
| Data Fetching | TanStack React Query |

## Prerequisites

- Node.js 20.19+
- Expo CLI (`npm install -g expo-cli`)
- A [Supabase](https://supabase.com) project with PostgreSQL enabled

## Environment Variables

Create a `.env` file in the project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
```

> Never commit `.env` to version control. It is already in `.gitignore`.

## Getting Started

```bash
# Install dependencies
npm install

# Push the Prisma schema to your Supabase database
npx prisma db push

# Seed initial game data
npx prisma db seed

# Start the development server
npx expo start
```

From the Expo dev server you can open the app in:
- **iOS Simulator** — press `i`
- **Android Emulator** — press `a`
- **Physical device** — scan the QR code with the Expo Go app

## Project Structure

```
src/
  app/
    (auth)/         # Login, register, forgot password
    (tabs)/         # Main tab navigation (feed, discover, create, notifications, profile)
    games/[id].tsx  # Game detail
    posts/[id].tsx  # Post detail
    users/[username].tsx
    api/            # Expo API Routes (server-side, Prisma runs here)
  components/
    ui/             # Design system atoms (Button, Input, Avatar, Card...)
    feed/           # PostCard, FeedHeader, PostActions
    games/          # GameCard, RatingStars
    profile/        # ProfileHeader, PostGrid
  lib/
    supabase.ts     # Supabase client
    prisma.ts       # Prisma client singleton
  hooks/            # use-auth, use-feed, use-game
  constants/
    theme.ts        # Color palette, spacing, typography
  types/
    index.ts        # Shared TypeScript types
```

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start the Expo dev server |
| `npm run ios` | Open in iOS simulator |
| `npm run android` | Open in Android emulator |
| `npm run lint` | Run ESLint via `expo lint` |
| `npx prisma studio` | Open Prisma Studio (DB browser) |
| `npx prisma db push` | Sync schema changes to the database |

## Build & Deploy

This project uses [EAS Build](https://docs.expo.dev/build/introduction/) for production builds.

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS (first time only)
eas build:configure

# Trigger a preview build
eas build --profile preview --platform ios
eas build --profile preview --platform android
```

Make sure all env vars are added to your EAS project secrets before building.

## Contributing

See [CHECKLIST.md](./CHECKLIST.md) for the full 30-day build roadmap.
