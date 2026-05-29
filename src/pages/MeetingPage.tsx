import { useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  CameraOff,
  ChevronUp,
  Copy,
  Crown,
  Hand,
  LayoutGrid,
  MessageSquare,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  MoreHorizontal,
  Phone,
  Plus,
  Radio,
  Settings,
  Smile,
  Upload,
  Users,
  Video,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "../../convex/_generated/api";

/* ═══════════════════════════════════════════════════════════
   VIRTUAL BACKGROUNDS — extensive library
   ═══════════════════════════════════════════════════════════ */
const BACKGROUND_CATEGORIES = [
  {
    name: "Royal",
    backgrounds: [
      { id: "throne-room", label: "Throne Room", gradient: "linear-gradient(135deg, #2a1810 0%, #1a0e08 50%, #0a0604 100%)" },
      { id: "council-chamber", label: "Council Chamber", gradient: "linear-gradient(135deg, #0a1628 0%, #132240 50%, #0a1628 100%)" },
      { id: "royal-garden", label: "Royal Garden", gradient: "linear-gradient(135deg, #0a2a1a 0%, #1a4a2a 50%, #0d3318 100%)" },
      { id: "ceremony-hall", label: "Ceremony Hall", gradient: "linear-gradient(135deg, #3a1020 0%, #2a0815 50%, #1a0510 100%)" },
      { id: "diplomatic-hall", label: "Diplomatic Hall", gradient: "linear-gradient(135deg, #1a2440 0%, #0d1628 50%, #0a1020 100%)" },
      { id: "palace-library", label: "Palace Library", gradient: "linear-gradient(135deg, #2a1f10 0%, #3a2a15 50%, #1a1208 100%)" },
    ],
  },
  {
    name: "Professional",
    backgrounds: [
      { id: "modern-office", label: "Modern Office", gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" },
      { id: "clean-white", label: "Clean White", gradient: "linear-gradient(135deg, #e8e8e8 0%, #f0f0f0 50%, #fafafa 100%)" },
      { id: "warm-study", label: "Warm Study", gradient: "linear-gradient(135deg, #2c1810 0%, #3a2418 50%, #2c1810 100%)" },
      { id: "boardroom", label: "Boardroom", gradient: "linear-gradient(135deg, #1a1a2a 0%, #252540 50%, #1a1a2a 100%)" },
      { id: "minimalist", label: "Minimalist", gradient: "linear-gradient(135deg, #f5f0e8 0%, #e8e0d0 50%, #d4c9b8 100%)" },
      { id: "conference", label: "Conference", gradient: "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)" },
    ],
  },
  {
    name: "Nature",
    backgrounds: [
      { id: "sunset-coast", label: "Sunset Coast", gradient: "linear-gradient(135deg, #1a0a2e 0%, #3a1848 30%, #8a4020 70%, #c48030 100%)" },
      { id: "mountain-lake", label: "Mountain Lake", gradient: "linear-gradient(135deg, #0a2040 0%, #1a4060 50%, #0a3050 100%)" },
      { id: "forest", label: "Forest", gradient: "linear-gradient(135deg, #0a1a0a 0%, #1a3a1a 50%, #0d2a0d 100%)" },
      { id: "aurora", label: "Aurora", gradient: "linear-gradient(135deg, #0a0a2e 0%, #1a2a4e 30%, #0a4a3e 70%, #0a2a2e 100%)" },
      { id: "desert-dune", label: "Desert Dune", gradient: "linear-gradient(135deg, #c4a060 0%, #a08040 50%, #806020 100%)" },
      { id: "ocean", label: "Ocean", gradient: "linear-gradient(135deg, #001428 0%, #002848 50%, #001838 100%)" },
    ],
  },
  {
    name: "Abstract",
    backgrounds: [
      { id: "navy-gradient", label: "Navy Gradient", gradient: "linear-gradient(135deg, #0a1628 0%, #1a2d50 50%, #0a1628 100%)" },
      { id: "gold-gradient", label: "Gold Gradient", gradient: "linear-gradient(135deg, #3a2a10 0%, #6a4a20 50%, #3a2a10 100%)" },
      { id: "soft-blur", label: "Soft Blur", gradient: "linear-gradient(135deg, #f0e8d8 0%, #e8d8c8 30%, #d8c8b8 70%, #f0e8d8 100%)" },
      { id: "dark-mesh", label: "Dark Mesh", gradient: "linear-gradient(135deg, #0a0a14 0%, #141428 50%, #0a0a14 100%)" },
      { id: "warm-tone", label: "Warm Tone", gradient: "linear-gradient(135deg, #2a1a10 0%, #4a3020 50%, #2a1a10 100%)" },
      { id: "cool-blue", label: "Cool Blue", gradient: "linear-gradient(135deg, #0a1a3a 0%, #1a3a5a 50%, #0a2040 100%)" },
    ],
  },
];

const ALL_BACKGROUNDS = BACKGROUND_CATEGORIES.flatMap((c) => c.backgrounds);

/* ═══════════════════════════════════════════════════════════
   MEETING PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
export function MeetingPage() {
  const { slug } = useParams<{ slug: string }>();
  const room = useQuery(api.rooms.getBySlug, { slug: slug ?? "" });
  const user = useQuery(api.auth.currentUser);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [isInLobby, setIsInLobby] = useState(false);
  const [selectedBg, setSelectedBg] = useState("none");
  const [showBgPanel, setShowBgPanel] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [bgCategory, setBgCategory] = useState("Royal");
  const [handRaised, setHandRaised] = useState(false);
  const [customBgs, setCustomBgs] = useState<{ id: string; label: string; gradient: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Camera stream
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    } catch {
      // Camera access denied or unavailable
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      for (const track of stream.getTracks()) track.stop();
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        for (const track of stream.getTracks()) track.stop();
      }
    };
  }, [stream]);

  // Custom background upload
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      const newBg = {
        id: `custom-${Date.now()}`,
        label: file.name.replace(/\.[^.]+$/, ""),
        gradient: `url(${url}) center/cover`,
      };
      setCustomBgs((prev) => [...prev, newBg]);
      setSelectedBg(newBg.id);
      toast.success("Background uploaded");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  /* ── Loading state ── */
  if (room === undefined) {
    return (
      <div className="flex items-center justify-center h-screen bg-royal-navy">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="size-16 rounded-full border border-royal-gold/20 bg-royal-gold/5 flex items-center justify-center mx-auto">
            <Video className="size-6 text-royal-gold animate-pulse" />
          </div>
          <p className="text-royal-cream/40 text-sm font-sans">Connecting to room...</p>
        </motion.div>
      </div>
    );
  }

  /* ── Room not found ── */
  if (room === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-royal-navy">
        <motion.div
          className="text-center space-y-6 max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="size-20 rounded-full border border-royal-gold/10 bg-royal-gold/5 flex items-center justify-center mx-auto">
            <Video className="size-8 text-royal-cream/20" />
          </div>
          <h2 className="text-2xl font-bold text-royal-cream royal-heading">Room Not Found</h2>
          <p className="text-royal-cream/40 text-sm font-sans">
            This meeting room does not exist or has been removed.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              className="border-royal-gold/20 text-royal-cream/60 hover:bg-royal-gold/10 font-sans"
              asChild
            >
              <Link to="/join">Try Another ID</Link>
            </Button>
            <Button
              variant="outline"
              className="border-royal-gold/20 text-royal-cream/60 hover:bg-royal-gold/10 font-sans"
              asChild
            >
              <Link to="/">Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Meeting link copied");
  };

  const selectedBgStyle =
    selectedBg === "none"
      ? undefined
      : [...ALL_BACKGROUNDS, ...customBgs].find((b) => b.id === selectedBg)?.gradient;

  /* ══════════════════════════════════════════════════════
     LOBBY — "Host has been notified"
     ══════════════════════════════════════════════════════ */
  if (isInLobby) {
    return (
      <div className="flex items-center justify-center h-screen bg-royal-navy">
        <motion.div
          className="text-center space-y-8 max-w-md px-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* Pulsing ring */}
          <div className="relative flex justify-center">
            <motion.div
              className="absolute size-24 rounded-full border border-royal-gold/20"
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="absolute size-24 rounded-full border border-royal-gold/15"
              animate={{ scale: [1, 1.7, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
            />
            <div className="size-24 rounded-full border-2 border-royal-gold/30 bg-royal-gold/5 flex items-center justify-center">
              <Crown className="size-10 text-royal-gold" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-royal-cream royal-heading">
              Waiting to be admitted
            </h2>
            <p className="text-royal-cream/40 text-sm font-sans leading-relaxed">
              The host has been notified that you're here.
              <br />
              You'll be let in soon.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-royal-cream/20 text-xs font-sans uppercase tracking-wider">
              Meeting Room
            </p>
            <p className="text-royal-cream/60 font-semibold font-sans">{room.name}</p>
          </div>

          {/* Animated dots */}
          <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="size-2 rounded-full bg-royal-gold/40"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{
                  duration: 1.2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          <Button
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 font-sans"
            onClick={() => {
              setIsInLobby(false);
              stopCamera();
            }}
          >
            Leave Waiting Room
          </Button>
        </motion.div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════
     PRE-MEETING LOBBY — camera preview, bg selection
     ══════════════════════════════════════════════════════ */
  if (!isInMeeting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-royal-navy">
        <motion.div
          className="w-full max-w-2xl mx-auto px-4 py-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Room info */}
          <div className="text-center space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold text-royal-cream royal-heading">
              {room.name}
            </h1>
            {room.description && (
              <p className="text-royal-cream/40 text-sm font-sans">{room.description}</p>
            )}
            <div className="flex items-center justify-center gap-3">
              <Badge variant="outline" className="capitalize border-royal-gold/20 text-royal-gold/60 text-xs font-sans">
                {room.type}
              </Badge>
              <Badge variant="outline" className="border-royal-cream/10 text-royal-cream/40 text-xs font-sans">
                <Users className="size-3 mr-1" />
                Max {room.maxParticipants}
              </Badge>
            </div>
          </div>

          {/* Video preview */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-[#0d1a2e] border border-royal-gold/10">
            {selectedBgStyle && (
              <div className="absolute inset-0" style={{ background: selectedBgStyle }} />
            )}
            {!selectedBgStyle && (
              <div className="absolute inset-0 bg-gradient-to-b from-[#132240] to-[#0a1628]" />
            )}
            {stream && !isVideoOff ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                {isVideoOff ? (
                  <div className="size-24 rounded-full bg-royal-gold/10 border border-royal-gold/20 flex items-center justify-center">
                    <span className="text-3xl font-bold text-royal-cream/80 font-serif">
                      {user?.name?.charAt(0)?.toUpperCase() ?? "G"}
                    </span>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <Camera className="size-8 mx-auto text-royal-cream/20" />
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-royal-gold/20 text-royal-cream/50 hover:bg-royal-gold/10 font-sans text-xs"
                      onClick={startCamera}
                    >
                      Enable Camera
                    </Button>
                  </div>
                )}
              </div>
            )}
            {/* Preview controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`size-11 rounded-full flex items-center justify-center transition-all ${
                  isMuted
                    ? "bg-red-500 text-white"
                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                }`}
              >
                {isMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`size-11 rounded-full flex items-center justify-center transition-all ${
                  isVideoOff
                    ? "bg-red-500 text-white"
                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                }`}
              >
                {isVideoOff ? <CameraOff className="size-4" /> : <Camera className="size-4" />}
              </button>
            </div>
          </div>

          {/* Background selector — compact */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-royal-cream/30 uppercase tracking-wider font-sans">
                Virtual Background
              </p>
              <div className="flex gap-1">
                {BACKGROUND_CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setBgCategory(cat.name)}
                    className={`text-xs px-2.5 py-1 rounded-full font-sans transition-all ${
                      bgCategory === cat.name
                        ? "bg-royal-gold/20 text-royal-gold"
                        : "text-royal-cream/30 hover:text-royal-cream/50"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* None option */}
              <button
                type="button"
                onClick={() => setSelectedBg("none")}
                className={`size-10 rounded-lg border-2 transition-all shrink-0 ${
                  selectedBg === "none"
                    ? "border-royal-gold scale-110"
                    : "border-royal-cream/10 hover:border-royal-gold/40"
                }`}
                style={{
                  background: "repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 50% / 8px 8px",
                }}
                title="None"
              />
              {/* Category backgrounds */}
              {BACKGROUND_CATEGORIES.find((c) => c.name === bgCategory)?.backgrounds.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setSelectedBg(bg.id)}
                  className={`size-10 rounded-lg border-2 transition-all shrink-0 ${
                    selectedBg === bg.id
                      ? "border-royal-gold scale-110"
                      : "border-royal-cream/10 hover:border-royal-gold/40"
                  }`}
                  style={{ background: bg.gradient }}
                  title={bg.label}
                />
              ))}
              {/* Custom uploads */}
              {customBgs.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setSelectedBg(bg.id)}
                  className={`size-10 rounded-lg border-2 transition-all shrink-0 ${
                    selectedBg === bg.id
                      ? "border-royal-gold scale-110"
                      : "border-royal-cream/10 hover:border-royal-gold/40"
                  }`}
                  style={{ background: bg.gradient }}
                  title={bg.label}
                />
              ))}
              {/* Upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="size-10 rounded-lg border-2 border-dashed border-royal-cream/10 hover:border-royal-gold/30 flex items-center justify-center transition-all shrink-0"
                title="Upload custom background"
              >
                <Upload className="size-3.5 text-royal-cream/30" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleBgUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Join buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1 h-13 text-base bg-gradient-to-r from-royal-gold-dark via-royal-gold to-royal-gold-light text-royal-navy font-semibold font-sans hover:brightness-110 shadow-lg shadow-royal-gold/20"
              onClick={() => {
                setIsInMeeting(true);
                if (!stream) startCamera();
                toast.success("Joined the meeting");
              }}
            >
              <Video className="size-5" />
              Join Now
            </Button>
            <Button
              variant="outline"
              className="border-royal-gold/20 text-royal-cream/50 hover:bg-royal-gold/10 font-sans"
              onClick={copyLink}
            >
              <Copy className="size-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════
     IN-MEETING — Zoom-like layout
     ══════════════════════════════════════════════════════ */
  return (
    <div className="flex flex-col h-screen bg-[#0a0e18]">
      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d1220]/90 backdrop-blur-lg border-b border-white/5 z-20">
        <div className="flex items-center gap-3">
          <Crown className="size-4 text-royal-gold" />
          <h2 className="font-semibold text-sm text-white/80 font-sans">{room.name}</h2>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px] px-1.5 py-0">
            <Radio className="size-2.5 mr-0.5 animate-pulse" />
            LIVE
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/30 text-xs font-sans font-mono">
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <button
            type="button"
            onClick={copyLink}
            className="text-white/30 hover:text-white/60 transition-colors p-1"
          >
            <Copy className="size-3.5" />
          </button>
        </div>
      </div>

      {/* ── VIDEO GRID ── */}
      <div className="flex-1 relative flex">
        <div
          className={`flex-1 p-3 grid gap-3 ${
            showParticipants || showChat ? "mr-0" : ""
          }`}
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
            gridAutoRows: "1fr",
          }}
        >
          {/* Self video */}
          <div className="video-tile relative">
            {selectedBgStyle && (
              <div className="absolute inset-0" style={{ background: selectedBgStyle }} />
            )}
            {!selectedBgStyle && (
              <div className="absolute inset-0 bg-gradient-to-b from-[#132240] to-[#0a1628]" />
            )}
            {stream && !isVideoOff ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-24 md:size-28 rounded-full bg-royal-gold/10 border border-royal-gold/20 flex items-center justify-center">
                  <span className="text-4xl font-bold text-royal-cream/80 font-serif">
                    {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                  </span>
                </div>
              </div>
            )}
            {/* Name badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <Badge className="bg-black/60 text-white/90 text-xs border-0 backdrop-blur-sm font-sans">
                {user?.name ?? "You"} (You)
              </Badge>
              {isMuted && (
                <div className="size-6 rounded-full bg-red-500/80 flex items-center justify-center">
                  <MicOff className="size-3 text-white" />
                </div>
              )}
              {handRaised && (
                <div className="size-6 rounded-full bg-yellow-500/80 flex items-center justify-center">
                  <Hand className="size-3 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Other participant slots */}
          <div className="video-tile flex items-center justify-center">
            <div className="text-center space-y-4">
              <Users className="size-12 mx-auto text-white/10" />
              <p className="text-white/20 text-sm font-sans">Waiting for others...</p>
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-royal-gold/20 text-royal-gold/50 hover:bg-royal-gold/10 font-sans"
                onClick={copyLink}
              >
                <Plus className="size-3" />
                Invite
              </Button>
            </div>
          </div>
        </div>

        {/* ── SIDE PANELS ── */}
        <AnimatePresence>
          {showParticipants && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-white/5 bg-[#0d1220] overflow-hidden"
            >
              <div className="p-4 space-y-4 w-[280px]">
                <div className="flex items-center justify-between">
                  <h3 className="text-white/80 text-sm font-semibold font-sans">Participants (1)</h3>
                  <button type="button" onClick={() => setShowParticipants(false)}>
                    <X className="size-4 text-white/30" />
                  </button>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                  <div className="size-8 rounded-full bg-royal-gold/20 flex items-center justify-center text-xs font-bold text-royal-gold font-sans">
                    {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-sans">{user?.name ?? "You"}</p>
                    <p className="text-white/30 text-[10px] font-sans">Host</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {showChat && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-white/5 bg-[#0d1220] overflow-hidden"
            >
              <div className="p-4 space-y-4 w-[320px] h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="text-white/80 text-sm font-semibold font-sans">Chat</h3>
                  <button type="button" onClick={() => setShowChat(false)}>
                    <X className="size-4 text-white/30" />
                  </button>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-white/20 text-xs font-sans">No messages yet</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-royal-gold/30 font-sans"
                  />
                  <Button size="sm" className="bg-royal-gold/20 text-royal-gold hover:bg-royal-gold/30 font-sans">
                    Send
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── VIRTUAL BG PANEL (bottom sheet) ── */}
        <AnimatePresence>
          {showBgPanel && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 bg-[#0d1220]/95 backdrop-blur-xl border-t border-white/5 p-4 z-10"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white/80 text-sm font-semibold font-sans">Virtual Backgrounds</h3>
                <button type="button" onClick={() => setShowBgPanel(false)}>
                  <X className="size-4 text-white/30" />
                </button>
              </div>
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                {BACKGROUND_CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setBgCategory(cat.name)}
                    className={`text-xs px-3 py-1.5 rounded-full font-sans whitespace-nowrap transition-all ${
                      bgCategory === cat.name
                        ? "bg-royal-gold/20 text-royal-gold"
                        : "text-white/30 hover:text-white/50 bg-white/5"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <button
                  type="button"
                  onClick={() => setSelectedBg("none")}
                  className={`size-14 rounded-lg border-2 transition-all shrink-0 ${
                    selectedBg === "none"
                      ? "border-royal-gold"
                      : "border-white/10 hover:border-royal-gold/40"
                  }`}
                  style={{
                    background: "repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 50% / 8px 8px",
                  }}
                  title="None"
                />
                {BACKGROUND_CATEGORIES.find((c) => c.name === bgCategory)?.backgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setSelectedBg(bg.id)}
                    className={`size-14 rounded-lg border-2 transition-all shrink-0 ${
                      selectedBg === bg.id
                        ? "border-royal-gold"
                        : "border-white/10 hover:border-royal-gold/40"
                    }`}
                    style={{ background: bg.gradient }}
                    title={bg.label}
                  />
                ))}
                {customBgs.map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setSelectedBg(bg.id)}
                    className={`size-14 rounded-lg border-2 transition-all shrink-0 ${
                      selectedBg === bg.id
                        ? "border-royal-gold"
                        : "border-white/10 hover:border-royal-gold/40"
                    }`}
                    style={{ background: bg.gradient }}
                    title={bg.label}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="size-14 rounded-lg border-2 border-dashed border-white/10 hover:border-royal-gold/30 flex items-center justify-center transition-all shrink-0"
                >
                  <Upload className="size-4 text-white/30" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── BOTTOM TOOLBAR — Zoom-style ── */}
      <div className="meeting-toolbar px-4 py-3 border-t border-white/5 z-20">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Left group */}
          <div className="flex items-center gap-1.5">
            <ToolbarButton
              active={!isMuted}
              danger={isMuted}
              icon={isMuted ? MicOff : Mic}
              label={isMuted ? "Unmute" : "Mute"}
              onClick={() => setIsMuted(!isMuted)}
              hasChevron
            />
            <ToolbarButton
              active={!isVideoOff}
              danger={isVideoOff}
              icon={isVideoOff ? CameraOff : Camera}
              label={isVideoOff ? "Start Video" : "Stop Video"}
              onClick={() => setIsVideoOff(!isVideoOff)}
              hasChevron
            />
          </div>

          {/* Center group */}
          <div className="flex items-center gap-1.5">
            <ToolbarButton
              active={isScreenSharing}
              icon={isScreenSharing ? MonitorOff : Monitor}
              label="Share Screen"
              onClick={() => {
                setIsScreenSharing(!isScreenSharing);
                toast(isScreenSharing ? "Screen sharing stopped" : "Screen sharing started");
              }}
              accent={isScreenSharing}
            />
            <ToolbarButton
              active={showParticipants}
              icon={Users}
              label="Participants"
              onClick={() => {
                setShowParticipants(!showParticipants);
                setShowChat(false);
              }}
            />
            <ToolbarButton
              active={showChat}
              icon={MessageSquare}
              label="Chat"
              onClick={() => {
                setShowChat(!showChat);
                setShowParticipants(false);
              }}
            />
            <ToolbarButton
              active={handRaised}
              icon={Hand}
              label={handRaised ? "Lower Hand" : "Raise Hand"}
              onClick={() => {
                setHandRaised(!handRaised);
                toast(handRaised ? "Hand lowered" : "Hand raised");
              }}
              accent={handRaised}
            />
            <ToolbarButton
              icon={Smile}
              label="Reactions"
              onClick={() => toast("👏")}
            />
            <ToolbarButton
              active={showBgPanel}
              icon={LayoutGrid}
              label="Backgrounds"
              onClick={() => setShowBgPanel(!showBgPanel)}
            />
            <ToolbarButton
              icon={MoreHorizontal}
              label="More"
              onClick={() => toast.info("More options")}
            />
          </div>

          {/* Right group */}
          <div>
            <button
              type="button"
              onClick={() => {
                setIsInMeeting(false);
                stopCamera();
                toast("You left the meeting");
              }}
              className="h-9 px-5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium font-sans flex items-center gap-2 transition-colors"
            >
              <Phone className="size-4 rotate-[135deg]" />
              Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Toolbar button component ── */
function ToolbarButton({
  icon: Icon,
  label,
  onClick,
  active,
  danger,
  accent,
  hasChevron,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  active?: boolean;
  danger?: boolean;
  accent?: boolean;
  hasChevron?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all ${
        danger
          ? "bg-red-500/20 hover:bg-red-500/30"
          : accent
            ? "bg-royal-gold/20 hover:bg-royal-gold/30"
            : active
              ? "bg-white/10 hover:bg-white/15"
              : "hover:bg-white/5"
      }`}
      title={label}
    >
      <div className="relative flex items-center">
        <Icon
          className={`size-4.5 ${
            danger ? "text-red-400" : accent ? "text-royal-gold" : "text-white/70"
          }`}
        />
        {hasChevron && (
          <ChevronUp className="size-2.5 text-white/30 ml-0.5" />
        )}
      </div>
      <span className={`text-[10px] font-sans ${danger ? "text-red-400/80" : "text-white/40"}`}>
        {label}
      </span>
    </button>
  );
}
