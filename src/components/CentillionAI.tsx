/**
 * CentillionAI — Universal floating AI assistant for every Kissi Kingdom app.
 *
 * Features:
 * - AI chat with streaming responses (GROQ LLM)
 * - Voice recording → transcription (record, then send — like Telegram)
 * - File & photo upload (context for AI)
 * - Live web search
 * - Long-form content generation
 *
 * Drop this component anywhere: <CentillionAI appName="Shield" accentColor="#00D4AA" />
 */
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  audioUrl?: string; // voice message playback
  files?: { name: string; type: string; size: number }[];
  model?: string;
  webSearchUsed?: boolean;
  isStreaming?: boolean;
}

interface CentillionAIProps {
  appName?: string;
  accentColor?: string;
  systemContext?: string; // e.g. "You are Shield AI, security expert..."
  position?: "bottom-right" | "bottom-left";
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Read file as text for context
async function readFileAsText(file: File): Promise<string> {
  if (file.type.startsWith("text/") || file.name.match(/\.(txt|md|csv|json|js|ts|py|html|css|xml|yaml|yml|log|env)$/i)) {
    return file.text();
  }
  if (file.type === "application/json") return file.text();
  if (file.type.startsWith("image/")) {
    return `[Image: ${file.name} (${formatFileSize(file.size)})]`;
  }
  if (file.type === "application/pdf") {
    return `[PDF: ${file.name} (${formatFileSize(file.size)}) — content cannot be extracted in browser]`;
  }
  return `[File: ${file.name} (${file.type}, ${formatFileSize(file.size)})]`;
}

// ─── Inline SVG Icons (no dependency needed) ────────────────────────────────
const Icon = {
  Send: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Mic: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
  MicOff: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="1" width="6" height="11" rx="3" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" /><circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  ),
  Paperclip: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  ),
  Globe: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Bot: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  ),
  Sparkles: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L9.5 9.5L2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
    </svg>
  ),
  Stop: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
};

// ─── Component ──────────────────────────────────────────────────────────────
export default function CentillionAI({
  appName = "Centillion",
  accentColor = "#D4AF37",
  systemContext = "",
  position = "bottom-right",
}: CentillionAIProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [transcribing, setTranscribing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: uid(),
          role: "assistant",
          content: `Welcome to ${appName} AI! I can help you with anything — ask questions, upload files, record voice messages, or search the web. What would you like to do?`,
          timestamp: Date.now(),
        },
      ]);
    }
  }, []);

  // ── Send Message ────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string, audioUrl?: string, files?: File[]) => {
      if (!text.trim() && !audioUrl) return;

      const userMsg: Message = {
        id: uid(),
        role: "user",
        content: text,
        timestamp: Date.now(),
        audioUrl,
        files: files?.map((f) => ({ name: f.name, type: f.type, size: f.size })),
      };

      const assistantId = uid();
      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setPendingFiles([]);
      setLoading(true);

      // Read file contents for context
      let fileContext = "";
      if (files && files.length > 0) {
        const texts = await Promise.all(files.map(readFileAsText));
        fileContext = texts.join("\n\n---\n\n");
      }

      // Build conversation history
      const history = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        abortRef.current = new AbortController();

        const response = await fetch("/api/ai-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            conversationHistory: history,
            systemContext,
            webSearch: webSearchEnabled ? "auto" : "off",
            fileContext,
          }),
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(err.error || `HTTP ${response.status}`);
        }

        // Read SSE stream
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let buffer = "";
        let fullContent = "";
        let model = "";
        let webUsed = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "meta") {
                model = data.model || "";
                webUsed = data.webSearchUsed || false;
              } else if (data.type === "text") {
                fullContent += data.content;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: fullContent, model, webSearchUsed: webUsed }
                      : m
                  )
                );
              } else if (data.type === "error") {
                throw new Error(data.error);
              }
            } catch (e: any) {
              if (e.message?.includes("models failed")) throw e;
            }
          }
        }

        // Mark streaming done
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, isStreaming: false, model, webSearchUsed: webUsed }
              : m
          )
        );
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: `❌ Error: ${err.message}. Please try again.`,
                  isStreaming: false,
                }
              : m
          )
        );
      } finally {
        setLoading(false);
        abortRef.current = null;
      }
    },
    [messages, systemContext, webSearchEnabled]
  );

  // ── Voice Recording ─────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "audio/webm";

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const audioUrl = URL.createObjectURL(blob);

        // Transcribe
        setTranscribing(true);
        try {
          const formData = new FormData();
          const ext = mimeType.includes("mp4") ? "m4a" : "webm";
          formData.append("audio", blob, `recording.${ext}`);

          const res = await fetch("/api/ai-transcribe", {
            method: "POST",
            body: formData,
          });

          if (res.ok) {
            const data = await res.json();
            if (data.text?.trim()) {
              // Send the transcribed text as a message with audio
              await sendMessage(data.text, audioUrl);
            } else {
              // No text recognized — still send as voice
              await sendMessage("[Voice message — no speech detected]", audioUrl);
            }
          } else {
            // Transcription failed — send as voice without text
            await sendMessage("[Voice message]", audioUrl);
          }
        } catch {
          await sendMessage("[Voice message — transcription unavailable]", audioUrl);
        } finally {
          setTranscribing(false);
        }
      };

      recorder.start(250); // collect in chunks
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(
        () => setRecordingTime((t) => t + 1),
        1000
      );
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // ── File Upload ─────────────────────────────────────────────────────────
  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles = Array.from(fileList);
    setPendingFiles((prev) => [...prev, ...newFiles]);
  };

  const removePendingFile = (idx: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (loading || (!input.trim() && pendingFiles.length === 0)) return;
    const text = input.trim() || (pendingFiles.length > 0 ? `Analyze these files: ${pendingFiles.map(f => f.name).join(", ")}` : "");
    sendMessage(text, undefined, pendingFiles.length > 0 ? pendingFiles : undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // ── Stop generation ─────────────────────────────────────────────────────
  const stopGeneration = () => {
    abortRef.current?.abort();
    setLoading(false);
    setMessages((prev) =>
      prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
    );
  };

  // ── Clear chat ──────────────────────────────────────────────────────────
  const clearChat = () => {
    setMessages([
      {
        id: uid(),
        role: "assistant",
        content: `Chat cleared. How can I help you?`,
        timestamp: Date.now(),
      },
    ]);
  };

  // ── Format recording time ───────────────────────────────────────────────
  const fmtTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // ── Render ──────────────────────────────────────────────────────────────
  const posClass =
    position === "bottom-left" ? "left-4" : "right-4";

  return (
    <>
      {/* ── Floating Button ── */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="centillion-ai-fab"
          style={{
            position: "fixed",
            bottom: "20px",
            [position === "bottom-left" ? "left" : "right"]: "20px",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
            color: "#111",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 4px 20px ${accentColor}40`,
            zIndex: 9999,
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = `0 6px 30px ${accentColor}60`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = `0 4px 20px ${accentColor}40`;
          }}
          title={`${appName} AI Assistant`}
        >
          <Icon.Sparkles />
        </button>
      )}

      {/* ── Chat Panel ── */}
      {open && (
        <div
          className="centillion-ai-panel"
          style={{
            position: "fixed",
            bottom: "16px",
            [position === "bottom-left" ? "left" : "right"]: "16px",
            width: "min(420px, calc(100vw - 32px))",
            height: "min(680px, calc(100vh - 32px))",
            borderRadius: "20px",
            background: "#0D0D14",
            border: `1px solid ${accentColor}30`,
            boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${accentColor}15`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 10000,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: "14px",
            color: "#E8E8EC",
          }}
        >
          {/* ── Header ── */}
          <div
            style={{
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              background: "#12121C",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#111",
                }}
              >
                <Icon.Bot />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px" }}>{appName} AI</div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#888",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#22c55e",
                      display: "inline-block",
                    }}
                  />
                  Online · GROQ
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={clearChat}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px",
                  color: "#888",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Clear chat"
              >
                <Icon.Trash />
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px",
                  color: "#888",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                title="Close"
              >
                <Icon.X />
              </button>
            </div>
          </div>

          {/* ── Messages ── */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "92%",
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                {/* Voice message audio player */}
                {msg.audioUrl && (
                  <audio
                    controls
                    src={msg.audioUrl}
                    style={{
                      height: "32px",
                      marginBottom: "4px",
                      borderRadius: "8px",
                      maxWidth: "220px",
                    }}
                  />
                )}
                {/* File badges */}
                {msg.files && msg.files.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "4px",
                      marginBottom: "4px",
                    }}
                  >
                    {msg.files.map((f, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "10px",
                          background: "rgba(255,255,255,0.08)",
                          borderRadius: "6px",
                          padding: "2px 8px",
                          color: "#aaa",
                        }}
                      >
                        📎 {f.name}
                      </span>
                    ))}
                  </div>
                )}
                {/* Message bubble */}
                <div
                  style={{
                    background:
                      msg.role === "user"
                        ? `${accentColor}22`
                        : "rgba(255,255,255,0.04)",
                    border: `1px solid ${
                      msg.role === "user"
                        ? `${accentColor}30`
                        : "rgba(255,255,255,0.06)"
                    }`,
                    borderRadius:
                      msg.role === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    padding: "10px 14px",
                    fontSize: "13px",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {msg.content || (msg.isStreaming ? "..." : "")}
                  {msg.isStreaming && (
                    <span
                      style={{
                        display: "inline-block",
                        width: "4px",
                        height: "14px",
                        background: accentColor,
                        marginLeft: "2px",
                        animation: "centillion-blink 1s infinite",
                        verticalAlign: "text-bottom",
                      }}
                    />
                  )}
                </div>
                {/* Meta */}
                <div
                  style={{
                    fontSize: "10px",
                    color: "#666",
                    marginTop: "3px",
                    display: "flex",
                    gap: "8px",
                    alignItems: "center",
                  }}
                >
                  <span>{formatTime(msg.timestamp)}</span>
                  {msg.model && (
                    <span style={{ color: `${accentColor}aa` }}>{msg.model}</span>
                  )}
                  {msg.webSearchUsed && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                        color: "#22c55e",
                      }}
                    >
                      <Icon.Globe /> web
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Recording indicator ── */}
          {recording && (
            <div
              style={{
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(239,68,68,0.1)",
                borderTop: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#ef4444",
                    animation: "centillion-blink 1s infinite",
                  }}
                />
                Recording... {fmtTime(recordingTime)}
              </div>
              <button
                onClick={stopRecording}
                style={{
                  background: "#ef4444",
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Icon.Stop /> Stop & Send
              </button>
            </div>
          )}

          {/* ── Transcribing indicator ── */}
          {transcribing && (
            <div
              style={{
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: `${accentColor}10`,
                borderTop: `1px solid ${accentColor}20`,
                fontSize: "12px",
                color: accentColor,
              }}
            >
              <span className="centillion-ai-spinner" /> Transcribing voice...
            </div>
          )}

          {/* ── Pending files ── */}
          {pendingFiles.length > 0 && (
            <div
              style={{
                padding: "6px 12px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
              }}
            >
              {pendingFiles.map((f, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "11px",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "8px",
                    padding: "3px 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#aaa",
                  }}
                >
                  📎 {f.name} ({formatFileSize(f.size)})
                  <button
                    onClick={() => removePendingFile(i)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#ef4444",
                      cursor: "pointer",
                      fontSize: "13px",
                      lineHeight: 1,
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── Input Area ── */}
          <div
            style={{
              padding: "10px 12px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "#12121C",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {/* Toggle row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <button
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                style={{
                  background: webSearchEnabled
                    ? `${accentColor}20`
                    : "rgba(255,255,255,0.04)",
                  border: `1px solid ${
                    webSearchEnabled
                      ? `${accentColor}40`
                      : "rgba(255,255,255,0.08)"
                  }`,
                  borderRadius: "8px",
                  padding: "3px 10px",
                  color: webSearchEnabled ? accentColor : "#666",
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "all 0.2s",
                }}
              >
                <Icon.Globe /> Web Search {webSearchEnabled ? "ON" : "OFF"}
              </button>
              {loading && (
                <button
                  onClick={stopGeneration}
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: "8px",
                    padding: "3px 10px",
                    color: "#ef4444",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Icon.Stop /> Stop
                </button>
              )}
            </div>

            {/* Input + buttons */}
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
              {/* File upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading || recording}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "10px",
                  padding: "8px",
                  color: "#888",
                  cursor: loading || recording ? "not-allowed" : "pointer",
                  opacity: loading || recording ? 0.3 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
                title="Upload files or photos"
              >
                <Icon.Paperclip />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="*/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  handleFiles(e.target.files);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              />

              {/* Text input */}
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  recording
                    ? "Recording..."
                    : "Type a message or record voice..."
                }
                disabled={loading || recording}
                rows={1}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "10px 12px",
                  color: "#E8E8EC",
                  fontSize: "13px",
                  resize: "none",
                  outline: "none",
                  maxHeight: "120px",
                  lineHeight: "1.4",
                  fontFamily: "inherit",
                  opacity: loading || recording ? 0.5 : 1,
                }}
                onInput={(e) => {
                  const ta = e.currentTarget;
                  ta.style.height = "auto";
                  ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
                }}
              />

              {/* Voice / Send */}
              {input.trim() || pendingFiles.length > 0 ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                    border: "none",
                    borderRadius: "10px",
                    padding: "8px",
                    color: "#111",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.5 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "transform 0.15s",
                  }}
                  title="Send"
                >
                  <Icon.Send />
                </button>
              ) : (
                <button
                  onClick={recording ? stopRecording : startRecording}
                  disabled={loading || transcribing}
                  style={{
                    background: recording
                      ? "rgba(239,68,68,0.2)"
                      : "rgba(255,255,255,0.05)",
                    border: `1px solid ${
                      recording
                        ? "rgba(239,68,68,0.4)"
                        : "rgba(255,255,255,0.08)"
                    }`,
                    borderRadius: "10px",
                    padding: "8px",
                    color: recording ? "#ef4444" : "#888",
                    cursor: loading || transcribing ? "not-allowed" : "pointer",
                    opacity: loading || transcribing ? 0.3 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s",
                  }}
                  title={recording ? "Stop recording" : "Record voice message"}
                >
                  {recording ? <Icon.MicOff /> : <Icon.Mic />}
                </button>
              )}
            </div>

            <div
              style={{
                fontSize: "10px",
                color: "#555",
                textAlign: "center",
              }}
            >
              Powered by Centillion AI · GROQ · Free
            </div>
          </div>
        </div>
      )}

      {/* ── Inline CSS animations ── */}
      <style>{`
        @keyframes centillion-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .centillion-ai-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid ${accentColor}40;
          border-top-color: ${accentColor};
          border-radius: 50%;
          animation: centillion-spin 0.8s linear infinite;
        }
        @keyframes centillion-spin {
          to { transform: rotate(360deg); }
        }
        .centillion-ai-panel *::-webkit-scrollbar {
          width: 4px;
        }
        .centillion-ai-panel *::-webkit-scrollbar-track {
          background: transparent;
        }
        .centillion-ai-panel *::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
        }
      `}</style>
    </>
  );
}
