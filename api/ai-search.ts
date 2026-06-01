import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Centillion AI Search — Live web search via DuckDuckGo (no API key needed).
 *
 * GET /api/ai-search?q=your+query
 * Returns: { results: [{ title, url, snippet }], query }
 */

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const query =
    typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (!query)
    return res.status(400).json({ error: "q parameter required" });

  const numResults = Math.min(
    parseInt(String(req.query.n || "10"), 10) || 10,
    20
  );

  try {
    const resp = await fetch(
      `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      }
    );

    if (!resp.ok) {
      return res.status(502).json({ error: "Search service unavailable" });
    }

    const html = await resp.text();
    const results: { title: string; url: string; snippet: string }[] = [];

    const clean = (s: string) =>
      s
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#x27;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, " ")
        .trim();

    // Parse result blocks
    const blockRe =
      /class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?class="result__snippet"[^>]*>([\s\S]*?)<\/(?:span|a)>/g;
    let m;
    while (
      (m = blockRe.exec(html)) !== null &&
      results.length < numResults
    ) {
      const rawUrl = m[1];
      const title = clean(m[2]);
      const snippet = clean(m[3]);
      // Decode DDG redirect URL
      let url = rawUrl;
      try {
        if (rawUrl.includes("uddg=")) {
          url = decodeURIComponent(
            rawUrl
              .replace(/^.*uddg=/, "")
              .replace(/&rut=.*$/, "")
          );
        }
      } catch {
        url = rawUrl;
      }
      if (title && url) results.push({ title, url, snippet });
    }

    return res.status(200).json({ results, query });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
