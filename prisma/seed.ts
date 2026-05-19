import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const games = [
  {
    title: 'Elden Ring',
    genre: ['RPG', 'Action', 'Souls-like'],
    description: 'An open-world action RPG set in the Lands Between, crafted by FromSoftware and George R.R. Martin.',
    avgRating: 9.5,
    releaseDate: new Date('2022-02-25'),
  },
  {
    title: 'The Legend of Zelda: Tears of the Kingdom',
    genre: ['Action', 'Adventure', 'Open World'],
    description: 'Link returns to Hyrule in a sky-spanning sequel with new Ultrahand and Fuse mechanics.',
    avgRating: 9.6,
    releaseDate: new Date('2023-05-12'),
  },
  {
    title: "Baldur's Gate 3",
    genre: ['RPG', 'Turn-Based', 'Fantasy'],
    description: 'A deep, choice-driven RPG set in the Forgotten Realms with full co-op and stunning production.',
    avgRating: 9.8,
    releaseDate: new Date('2023-08-03'),
  },
  {
    title: 'God of War Ragnarök',
    genre: ['Action', 'Adventure', 'Mythology'],
    description: 'Kratos and Atreus face Ragnarök across the Nine Realms in this cinematic Norse epic.',
    avgRating: 9.4,
    releaseDate: new Date('2022-11-09'),
  },
  {
    title: 'Hollow Knight',
    genre: ['Metroidvania', 'Indie', 'Platformer'],
    description: 'A challenging hand-drawn underground kingdom teeming with secrets, bosses, and lore.',
    avgRating: 9.3,
    releaseDate: new Date('2017-02-24'),
  },
  {
    title: 'Hades',
    genre: ['Roguelike', 'Action', 'Indie'],
    description: 'Defy the god of the Underworld in this rogue-like dungeon crawler with a rich narrative.',
    avgRating: 9.3,
    releaseDate: new Date('2020-09-17'),
  },
  {
    title: 'Cyberpunk 2077',
    genre: ['RPG', 'Open World', 'Sci-Fi'],
    description: 'Night City, a megalopolis obsessed with power, glamour, and body modification.',
    avgRating: 8.7,
    releaseDate: new Date('2020-12-10'),
  },
  {
    title: 'Red Dead Redemption 2',
    genre: ['Open World', 'Action', 'Western'],
    description: 'The epic tale of outlaw Arthur Morgan set across the vast and rugged heart of America.',
    avgRating: 9.7,
    releaseDate: new Date('2018-10-26'),
  },
  {
    title: 'Minecraft',
    genre: ['Sandbox', 'Survival', 'Creative'],
    description: 'Build, explore, and survive in an infinite procedurally generated world.',
    avgRating: 9.0,
    releaseDate: new Date('2011-11-18'),
  },
  {
    title: 'Stardew Valley',
    genre: ['Simulation', 'RPG', 'Indie'],
    description: 'Escape to the countryside and build the farm of your dreams in this beloved indie gem.',
    avgRating: 9.4,
    releaseDate: new Date('2016-02-26'),
  },
  {
    title: 'Persona 5 Royal',
    genre: ['JRPG', 'Turn-Based', 'Social Sim'],
    description: 'Steal the hearts of corrupt adults as the Phantom Thieves in stylish Tokyo.',
    avgRating: 9.5,
    releaseDate: new Date('2019-10-31'),
  },
  {
    title: 'Sekiro: Shadows Die Twice',
    genre: ['Action', 'Souls-like', 'Stealth'],
    description: 'Master the blade as shinobi Wolf in a brutal posture-based combat system set in Sengoku Japan.',
    avgRating: 9.2,
    releaseDate: new Date('2019-03-22'),
  },
  {
    title: 'The Witcher 3: Wild Hunt',
    genre: ['RPG', 'Open World', 'Fantasy'],
    description: 'Geralt of Rivia hunts the Wild Hunt across a living, breathing dark fantasy world.',
    avgRating: 9.8,
    releaseDate: new Date('2015-05-19'),
  },
  {
    title: 'Celeste',
    genre: ['Platformer', 'Indie', 'Precision'],
    description: 'Help Madeline survive her inner demons on her journey to the top of Celeste Mountain.',
    avgRating: 9.2,
    releaseDate: new Date('2018-01-25'),
  },
  {
    title: 'Death Stranding',
    genre: ['Action', 'Open World', 'Sci-Fi'],
    description: 'Deliver cargo across a post-apocalyptic America where connection is the only way to survive.',
    avgRating: 8.2,
    releaseDate: new Date('2019-11-08'),
  },
]

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function main() {
  process.stdout.write('Seeding games...\n')

  let created = 0
  for (const game of games) {
    const id = toSlug(game.title)
    const result = await prisma.game.upsert({
      where: { id },
      update: {},
      create: { id, ...game },
    })
    if (result.createdAt.getTime() === result.updatedAt.getTime()) created++
  }

  process.stdout.write(`Done — ${created} created, ${games.length - created} already existed.\n`)
}

main()
  .catch((e) => {
    process.stderr.write(`${e}\n`)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
