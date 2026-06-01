import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Centillion AI Transcribe — GROQ Whisper speech-to-text.
 *
 * POST /api/ai-transcribe
 * Body: multipart/form-data with "audio" file
 * Returns: { text, language, duration }
 */

export const config = {
  api: {
    bodyParser: false, // We need raw body for multipart
  },
};

// Parse multipart form data manually (works in Vercel serverless)
async function parseMultipart(
  req: VercelRequest
): Promise<{ buffer: Buffer; filename: string; contentType: string }> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      const body = Buffer.concat(chunks);
      const contentType = req.headers["content-type"] || "";
      const boundary = contentType.split("boundary=")[1];

      if (!boundary) {
        // Raw audio body (not multipart)
        const ext = contentType.includes("webm")
          ? "webm"
          : contentType.includes("mp4") || contentType.includes("m4a")
          ? "m4a"
          : contentType.includes("ogg")
          ? "ogg"
          : "wav";
        return resolve({
          buffer: body,
          filename: `recording.${ext}`,
          contentType: contentType || "audio/webm",
        });
      }

      // Parse multipart
      const boundaryBuffer = Buffer.from(`--${boundary}`);
      const parts = [];
      let start = body.indexOf(boundaryBuffer) + boundaryBuffer.length;

      while (start < body.length) {
        const end = body.indexOf(boundaryBuffer, start);
        if (end === -1) break;
        parts.push(body.slice(start, end));
        start = end + boundaryBuffer.length;
      }

      for (const part of parts) {
        const headerEnd = part.indexOf("\r\n\r\n");
        if (headerEnd === -1) continue;
        const headers = part.slice(0, headerEnd).toString();
        if (
          headers.includes('name="audio"') ||
          headers.includes('name="file"')
        ) {
          const fileData = part.slice(headerEnd + 4, part.length - 2); // strip trailing \r\n
          const filenameMatch = headers.match(/filename="([^"]+)"/);
          const ctMatch = headers.match(/Content-Type:\s*([^\r\n]+)/i);
          return resolve({
            buffer: fileData,
            filename: filenameMatch?.[1] || "recording.webm",
            contentType: ctMatch?.[1] || "audio/webm",
          });
        }
      }

      reject(new Error("No audio file found in multipart body"));
    });
    req.on("error", reject);
  });
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "POST only" });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey)
    return res.status(500).json({ error: "GROQ_API_KEY not configured" });

  try {
    const { buffer, filename, contentType } = await parseMultipart(req);

    if (!buffer || buffer.length < 100) {
      return res.status(400).json({ error: "Audio file too small or empty" });
    }

    // Send to GROQ Whisper
    const formData = new FormData();
    const blob = new Blob([buffer], { type: contentType });
    formData.append("file", blob, filename);
    formData.append("model", "whisper-large-v3-turbo");
    formData.append("response_format", "json");

    const response = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({
        error: `Transcription failed: ${err}`,
      });
    }

    const data = await response.json();
    return res.status(200).json({
      text: data.text || "",
      language: data.language || null,
      duration: data.duration || null,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
