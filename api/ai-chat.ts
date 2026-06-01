import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Centillion AI Chat — Streaming GROQ chat with web search, file context.
 * Works for every Kissi Kingdom app.
 *
 * POST /api/ai-chat
 * Body: { message, conversationHistory?, systemContext?, webSearch? }
 * Returns: SSE stream of text chunks
 */

// ── Web Search (DuckDuckGo HTML — no API key) ──────────────────────────────
async function searchWeb(query: string, numResults = 6): Promise<string> {
  try {
    const resp = await fetch(
      `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      }
    );
    if (!resp.ok) return "";
    const html = await resp.text();
    const results: string[] = [];
    const re =
      /class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
    let m;
    while ((m = re.exec(html)) !== null && results.length < numResults) {
      const clean = (s: string) =>
        s
          .replace(/<[^>]+>/g, "")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&#x27;/g, "'")
          .replace(/&quot;/g, '"')
          .trim();
      const title = clean(m[2]);
      const snippet = clean(m[3]);
      const url = decodeURIComponent(
        m[1]
          .replace(/^\/\/duckduckgo\.com\/l\/\?uddg=/, "")
          .replace(/&rut=.*$/, "")
      );
      if (title) results.push(`[${title}](${url}): ${snippet}`);
    }
    return results.length > 0 ? results.join("\n") : "";
  } catch {
    return "";
  }
}

// ── Detect if web search is useful ──────────────────────────────────────────
function shouldSearchWeb(msg: string): boolean {
  const patterns = [
    /\b(search|look up|find|what is|who is|when did|where is|how to|latest|current|news|today|price|weather|stock|score|result|update|recent)\b/i,
    /\b(20\d{2})\b/, // year reference
    /\?([\s]|$)/, // ends with question
  ];
  return patterns.some((p) => p.test(msg));
}

// ── GROQ Models ─────────────────────────────────────────────────────────────
const MODELS = [
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", maxTokens: 8192 },
  { id: "deepseek-r1-distill-llama-70b", name: "DeepSeek-R1", maxTokens: 4096 },
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B", maxTokens: 8192 },
  { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B", maxTokens: 4096 },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "POST only" });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey)
    return res.status(500).json({
      error: "GROQ_API_KEY not configured",
    });

  const {
    message = "",
    conversationHistory = [],
    systemContext = "",
    webSearch = "auto", // "auto" | "on" | "off"
    fileContext = "", // text extracted from uploaded files
    model: preferredModel,
  } = req.body || {};

  if (!message.trim())
    return res.status(400).json({ error: "message required" });

  try {
    // Web search
    let webResults = "";
    const doSearch =
      webSearch === "on" ||
      (webSearch === "auto" && shouldSearchWeb(message));
    if (doSearch) {
      webResults = await searchWeb(message);
    }

    const webContext = webResults
      ? `\n\n🌐 Live Web Search Results:\n${webResults}`
      : "";

    const fileCtx = fileContext
      ? `\n\n📎 Uploaded File Content:\n${fileContext.slice(0, 12000)}`
      : "";

    const systemPrompt = `You are Centillion AI, the intelligent assistant for The Royal Kissi Kingdom digital ecosystem.

${systemContext || "You help users with any task — writing, research, analysis, coding, creative work, and more."}

Capabilities:
- Generate long, detailed content (research papers, reports, articles — as long as needed)
- Live web search for real-time information
- Process uploaded files and photos
- Voice message transcription
- Multilingual support

When web search results are provided, use them for accurate, current information. Cite sources when relevant.
Be thorough, helpful, and format responses clearly with headers and bullet points.${webContext}${fileCtx}`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...conversationHistory.slice(-40).map((m: any) => ({
        role: m.role as "user" | "assistant",
        content: m.content?.slice(0, 10000) || "",
      })),
      { role: "user" as const, content: message },
    ];

    // Set up SSE streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Try models with fallback
    const modelsToTry = preferredModel
      ? [
          MODELS.find((m) => m.id === preferredModel) || MODELS[0],
          ...MODELS.filter((m) => m.id !== preferredModel).slice(0, 2),
        ]
      : MODELS.slice(0, 3);

    let lastError = "";

    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: model.id,
              messages,
              temperature: 0.7,
              max_tokens: model.maxTokens,
              stream: true,
            }),
          }
        );

        if (!response.ok) {
          lastError = await response.text();
          continue;
        }

        // Stream the response
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let buffer = "";

        // Send metadata first
        res.write(
          `data: ${JSON.stringify({
            type: "meta",
            model: model.name,
            webSearchUsed: webResults.length > 0,
          })}\n\n`
        );

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") {
              res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
              continue;
            }
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                res.write(
                  `data: ${JSON.stringify({ type: "text", content })}\n\n`
                );
              }
            } catch {
              // skip malformed chunks
            }
          }
        }

        res.end();
        return;
      } catch (e: any) {
        lastError = e.message;
        continue;
      }
    }

    // All models failed — send error as SSE
    res.write(
      `data: ${JSON.stringify({
        type: "error",
        error: `All models failed. ${lastError}`,
      })}\n\n`
    );
    res.end();
  } catch (error: any) {
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message });
    }
    res.write(
      `data: ${JSON.stringify({ type: "error", error: error.message })}\n\n`
    );
    res.end();
  }
}
