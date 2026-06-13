import type { NewsArticle, ApiResponse } from '@/types'

const RSS_FEED = 'https://feeds.feedburner.com/ign/games-all'

interface RssItem {
  title?: string
  description?: string
  link?: string
  pubDate?: string
  enclosure?: { url?: string }
  'media:thumbnail'?: { url?: string }
  'media:content'?: { url?: string }
}

function extractImageUrl(item: Record<string, unknown>): string | null {
  const enc = item['enclosure'] as { url?: string } | undefined
  const media = item['media:thumbnail'] as { url?: string } | undefined
  const mc = item['media:content'] as { url?: string } | undefined
  return enc?.url ?? media?.url ?? mc?.url ?? null
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/g, ' ').trim()
}

export async function GET(_request: Request): Promise<Response> {
  try {
    const res = await fetch(RSS_FEED, {
      headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
    })
    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`)

    const xml = await res.text()

    const items: NewsArticle[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match: RegExpExecArray | null

    while ((match = itemRegex.exec(xml)) !== null && items.length < 20) {
      const block = match[1]!
      const title = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)?.[1] ?? block.match(/<title>(.*?)<\/title>/)?.[1] ?? ''
      const link = block.match(/<link>(.*?)<\/link>/)?.[1] ?? block.match(/<guid[^>]*>(.*?)<\/guid>/)?.[1] ?? ''
      const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? new Date().toUTCString()
      const description = block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ?? block.match(/<description>([\s\S]*?)<\/description>/)?.[1] ?? ''
      const enclosureUrl = block.match(/<enclosure[^>]+url="([^"]+)"/)?.[1] ?? block.match(/url="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i)?.[1] ?? null

      if (!title.trim() || !link.trim()) continue

      items.push({
        id: Buffer.from(link).toString('base64url'),
        title: stripHtml(title).trim(),
        summary: stripHtml(description).slice(0, 200),
        imageUrl: enclosureUrl,
        source: 'IGN',
        url: link.trim(),
        publishedAt: new Date(pubDate).toISOString(),
      })
    }

    return Response.json({ data: items, error: null } satisfies ApiResponse<NewsArticle[]>)
  } catch {
    return Response.json({ data: [], error: null } satisfies ApiResponse<NewsArticle[]>)
  }
}
