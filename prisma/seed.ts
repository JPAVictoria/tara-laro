import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ─── FreeToGame API types ──────────────────────────────────────────────────

interface FreeToGameItem {
  id: number
  title: string
  thumbnail: string
  short_description: string
  game_url: string
  genre: string
  platform: string
  publisher: string
  developer: string
  release_date: string
  freetogame_profile_url: string
}

// ─── Static paid games (covers fetched from FreeToGame search or hardcoded) ─

const PAID_GAMES = [
  {
    title: 'Elden Ring',
    genre: ['RPG', 'Action', 'Souls-like'],
    description: 'An open-world action RPG set in the Lands Between, crafted by FromSoftware and George R.R. Martin.',
    avgRating: 9.5,
    releaseDate: new Date('2022-02-25'),
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg',
  },
  {
    title: 'The Legend of Zelda: Tears of the Kingdom',
    genre: ['Action', 'Adventure', 'Open World'],
    description: 'Link returns to Hyrule in a sky-spanning sequel with new Ultrahand and Fuse mechanics.',
    avgRating: 9.6,
    releaseDate: new Date('2023-05-12'),
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/2/22/The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg',
  },
  {
    title: "Baldur's Gate 3",
    genre: ['RPG', 'Turn-Based', 'Fantasy'],
    description: 'A deep, choice-driven RPG set in the Forgotten Realms with full co-op and stunning production.',
    avgRating: 9.8,
    releaseDate: new Date('2023-08-03'),
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5b/Baldur%27s_Gate_3_cover_art.jpg',
  },
  {
    title: 'God of War Ragnarök',
    genre: ['Action', 'Adventure', 'Mythology'],
    description: 'Kratos and Atreus face Ragnarök across the Nine Realms in this cinematic Norse epic.',
    avgRating: 9.4,
    releaseDate: new Date('2022-11-09'),
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/e/ee/God_of_War_Ragnar%C3%B6k_cover.jpg',
  },
  {
    title: 'Hollow Knight',
    genre: ['Metroidvania', 'Indie', 'Platformer'],
    description: 'A challenging hand-drawn underground kingdom teeming with secrets, bosses, and lore.',
    avgRating: 9.3,
    releaseDate: new Date('2017-02-24'),
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5a/Hollow_Knight_Cover.jpg',
  },
  {
    title: 'Hades',
    genre: ['Roguelike', 'Action', 'Indie'],
    description: 'Defy the god of the Underworld in this rogue-like dungeon crawler with a rich narrative.',
    avgRating: 9.3,
    releaseDate: new Date('2020-09-17'),
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Hades_cover_art.jpg',
  },
  {
    title: 'Cyberpunk 2077',
    genre: ['RPG', 'Open World', 'Sci-Fi'],
    description: 'Night City, a megalopolis obsessed with power, glamour, and body modification.',
    avgRating: 8.7,
    releaseDate: new Date('2020-12-10'),
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg',
  },
  {
    title: 'Red Dead Redemption 2',
    genre: ['Open World', 'Action', 'Western'],
    description: 'The epic tale of outlaw Arthur Morgan set across the vast and rugged heart of America.',
    avgRating: 9.7,
    releaseDate: new Date('2018-10-26'),
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg',
  },
  {
    title: 'Stardew Valley',
    genre: ['Simulation', 'RPG', 'Indie'],
    description: 'Escape to the countryside and build the farm of your dreams in this beloved indie gem.',
    avgRating: 9.4,
    releaseDate: new Date('2016-02-26'),
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fd/Logo_of_Stardew_Valley.png',
  },
  {
    title: 'The Witcher 3: Wild Hunt',
    genre: ['RPG', 'Open World', 'Fantasy'],
    description: 'Geralt of Rivia hunts the Wild Hunt across a living, breathing dark fantasy world.',
    avgRating: 9.8,
    releaseDate: new Date('2015-05-19'),
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg',
  },
]

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// ─── Fetch free-to-play games from FreeToGame ──────────────────────────────

async function fetchFreeToPlayGames(): Promise<FreeToGameItem[]> {
  try {
    process.stdout.write('Fetching free-to-play games from FreeToGame API...\n')
    const res = await fetch('https://www.freetogame.com/api/games?platform=pc&sort-by=rating')
    if (!res.ok) throw new Error(`FreeToGame API error: ${res.status}`)
    const data = await res.json() as FreeToGameItem[]
    process.stdout.write(`Fetched ${data.length} free-to-play games\n`)
    return data.slice(0, 20)
  } catch (e) {
    process.stderr.write(`Warning: Could not fetch from FreeToGame API: ${(e as Error).message}\n`)
    return []
  }
}

function mapGenre(genre: string): string[] {
  const map: Record<string, string[]> = {
    'MMORPG': ['RPG', 'MMO', 'Online'],
    'Shooter': ['Action', 'Shooter'],
    'Strategy': ['Strategy', 'Simulation'],
    'Moba': ['Strategy', 'Action', 'Online'],
    'Racing': ['Racing', 'Sports'],
    'Sports': ['Sports'],
    'Social': ['Social', 'Casual'],
    'Sandbox': ['Sandbox', 'Open World'],
    'Open-World': ['Open World', 'Adventure'],
    'Survival': ['Survival', 'Action'],
    'Battle-Royale': ['Action', 'Battle Royale'],
    'Card': ['Card', 'Strategy'],
    'Action-RPG': ['RPG', 'Action'],
    'Fighting': ['Action', 'Fighting'],
    'Anime': ['RPG', 'Anime'],
    'Fantasy': ['RPG', 'Fantasy'],
    'Sci-Fi': ['Sci-Fi', 'Action'],
  }
  return map[genre] ?? [genre]
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  process.stdout.write('Seeding games...\n')

  let created = 0

  // Seed paid/premium games with static cover art
  for (const game of PAID_GAMES) {
    const id = toSlug(game.title)
    const result = await prisma.game.upsert({
      where: { id },
      update: { coverUrl: game.coverUrl },
      create: { id, ...game },
    })
    if (result.createdAt.getTime() === result.updatedAt.getTime()) created++
  }
  process.stdout.write(`Seeded ${PAID_GAMES.length} paid games\n`)

  // Seed free-to-play games from FreeToGame API
  const freeGames = await fetchFreeToPlayGames()
  for (const g of freeGames) {
    const id = toSlug(g.title)
    const result = await prisma.game.upsert({
      where: { id },
      update: { coverUrl: g.thumbnail },
      create: {
        id,
        title: g.title,
        coverUrl: g.thumbnail,
        genre: mapGenre(g.genre),
        description: g.short_description,
        avgRating: 7.0 + Math.random() * 2,
        releaseDate: g.release_date ? new Date(g.release_date) : null,
      },
    })
    if (result.createdAt.getTime() === result.updatedAt.getTime()) created++
  }

  const total = PAID_GAMES.length + freeGames.length
  process.stdout.write(`Done — ${created} created, ${total - created} already existed. Total: ${total} games.\n`)
}

main()
  .catch((e) => {
    process.stderr.write(`${e}\n`)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
