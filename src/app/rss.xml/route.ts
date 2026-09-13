import { getPublishedPosts } from "@/lib/posts";
import { brand, siteUrl } from "@/data/site";

// A plain RSS 2.0 feed at /rss.xml — the one distribution channel that
// doesn't depend on any social platform's algorithm: feed readers, email
// digest tools (Kill the Newsletter, Feedbin, etc.), and aggregators like
// Planet-style React Native/JS roundups can all pick up new posts the
// moment they're published, with zero manual sharing required. Linked
// from <head> via layout.tsx's alternates.types so browsers/readers can
// auto-discover it.
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  try {
    posts = await getPublishedPosts();
  } catch {
    posts = [];
  }

  const items = posts
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(brand.name)} — Notes</title>
    <link>${siteUrl}/blog</link>
    <description>Notes on React Native, shipping imperfect things, and building ${escapeXml(brand.name)}.</description>
    <language>en</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
