import { useQuery } from "convex/react";
import {
  Camera,
  CameraOff,
  Copy,
  Crown,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  Phone,
  Settings,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "../../convex/_generated/api";

const VIRTUAL_BACKGROUNDS = [
  { id: "none", label: "None", color: "transparent" },
  { id: "throne-room", label: "Throne Room", color: "#2a1810" },
  { id: "council-chamber", label: "Council Chamber", color: "#0a1628" },
  { id: "royal-garden", label: "Royal Garden", color: "#1a4a2a" },
  { id: "diplomatic-hall", label: "Diplomatic Hall", color: "#1a2440" },
  { id: "ceremony-hall", label: "Ceremony Hall", color: "#3a1020" },
];

export function MeetingPage() {
  const { slug } = useParams<{ slug: string }>();
  const room = useQuery(api.rooms.getBySlug, { slug: slug ?? "" });
  const user = useQuery(api.auth.currentUser);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [selectedBg, setSelectedBg] = useState("none");
  const [showSettings, setShowSettings] = useState(false);

  if (room === undefined) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <div className="size-12 rounded-full bg-royal-gold/10 flex items-center justify-center mx-auto animate-pulse">
            <Video className="size-5 text-royal-gold" />
          </div>
          <p className="text-muted-foreground">Loading room...</p>
        </div>
      </div>
    );
  }

  if (room === null) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <Video className="size-7 text-destructive" />
          </div>
          <h2 className="text-xl font-bold">Room Not Found</h2>
          <p className="text-muted-foreground text-sm">
            This meeting room doesn't exist or has been removed.
          </p>
          <Button
            variant="outline"
            className="border-royal-gold/30 hover:bg-royal-gold/10"
            asChild
          >
            <Link to="/rooms">Back to Rooms</Link>
          </Button>
        </div>
      </div>
    );
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Meeting link copied to clipboard");
  };

  if (!isInMeeting) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="max-w-md w-full mx-auto text-center space-y-6 p-6">
          {/* Room Info */}
          <div className="space-y-3">
            <div className="size-16 rounded-2xl bg-royal-navy flex items-center justify-center mx-auto">
              <Crown className="size-7 text-royal-gold" />
            </div>
            <h1 className="text-2xl font-bold">{room.name}</h1>
            {room.description && (
              <p className="text-muted-foreground text-sm">{room.description}</p>
            )}
            <div className="flex items-center justify-center gap-3">
              <Badge
                variant="outline"
                className="capitalize border-royal-gold/30 text-royal-gold-dark"
              >
                {room.type}
              </Badge>
              <Badge variant="outline" className="border-border">
                <Users className="size-3 mr-1" />
                Max {room.maxParticipants}
              </Badge>
            </div>
          </div>

          {/* Video Preview */}
          <div className="relative aspect-video rounded-xl bg-royal-navy overflow-hidden">
            {selectedBg !== "none" ? (
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${
                    VIRTUAL_BACKGROUNDS.find((b) => b.id === selectedBg)
                      ?.color ?? "#0a1628"
                  }, #0a1628)`,
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-royal-navy-light to-royal-navy" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              {isVideoOff ? (
                <div className="size-20 rounded-full bg-royal-gold/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-royal-cream">
                    {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                  </span>
                </div>
              ) : (
                <div className="text-center text-royal-cream/60 space-y-2">
                  <Camera className="size-8 mx-auto" />
                  <p className="text-xs">Camera preview</p>
                </div>
              )}
            </div>
            {/* Control strip in preview */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`size-10 rounded-full flex items-center justify-center transition-colors ${
                  isMuted
                    ? "bg-red-500/80 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {isMuted ? (
                  <MicOff className="size-4" />
                ) : (
                  <Mic className="size-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`size-10 rounded-full flex items-center justify-center transition-colors ${
                  isVideoOff
                    ? "bg-red-500/80 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {isVideoOff ? (
                  <CameraOff className="size-4" />
                ) : (
                  <Camera className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* Virtual Background Selector */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Virtual Background
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {VIRTUAL_BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setSelectedBg(bg.id)}
                  className={`size-10 rounded-lg border-2 transition-all ${
                    selectedBg === bg.id
                      ? "border-royal-gold scale-110"
                      : "border-border hover:border-royal-gold/50"
                  }`}
                  style={{
                    background:
                      bg.id === "none"
                        ? "repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%) 50% / 12px 12px"
                        : `linear-gradient(135deg, ${bg.color}, #0a1628)`,
                  }}
                  title={bg.label}
                />
              ))}
            </div>
          </div>

          {/* Join Button */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full h-12 text-base bg-royal-gold hover:bg-royal-gold-light text-royal-navy font-semibold"
              onClick={() => {
                setIsInMeeting(true);
                toast.success("Joined the meeting room");
              }}
            >
              <Video className="size-5" />
              Join Meeting
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-royal-gold/20 hover:bg-royal-gold/10"
              onClick={copyLink}
            >
              <Copy className="size-3" />
              Copy Meeting Link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // In-meeting view
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Meeting Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-royal-gold/10 bg-card/80 backdrop-blur">
        <div className="flex items-center gap-2">
          <Crown className="size-4 text-royal-gold" />
          <h2 className="font-semibold text-sm">{room.name}</h2>
          <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500 border-red-500/30">
            <span className="size-1.5 rounded-full bg-red-500 animate-pulse mr-1" />
            Live
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs"
            onClick={copyLink}
          >
            <Copy className="size-3" />
            Invite
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="size-3" />
          </Button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 bg-royal-navy p-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full max-w-5xl mx-auto">
          {/* Main video (self) */}
          <div className="relative rounded-xl overflow-hidden bg-royal-navy-light border border-white/5">
            {selectedBg !== "none" && (
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${
                    VIRTUAL_BACKGROUNDS.find((b) => b.id === selectedBg)
                      ?.color ?? "#0a1628"
                  }, #0a1628)`,
                }}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              {isVideoOff ? (
                <div className="size-24 rounded-full bg-royal-gold/20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-royal-cream">
                    {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                  </span>
                </div>
              ) : (
                <div className="text-center text-royal-cream/40 space-y-2">
                  <Camera className="size-10 mx-auto" />
                  <p className="text-sm">Your camera</p>
                </div>
              )}
            </div>
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-black/50 text-white text-xs border-0">
                {user?.name ?? "You"} {isMuted && "(Muted)"}
              </Badge>
            </div>
          </div>

          {/* Placeholder for other participants */}
          <div className="relative rounded-xl overflow-hidden bg-royal-navy-light border border-white/5 flex items-center justify-center">
            <div className="text-center text-royal-cream/30 space-y-3">
              <Users className="size-12 mx-auto" />
              <p className="text-sm">Waiting for participants...</p>
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-royal-gold/30 text-royal-gold hover:bg-royal-gold/10"
                onClick={copyLink}
              >
                <Copy className="size-3" />
                Share Meeting Link
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute right-4 top-4 w-64 rounded-xl bg-card/95 backdrop-blur border border-royal-gold/15 p-4 shadow-lg space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Settings className="size-4 text-royal-gold" />
              Settings
            </h3>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Virtual Background
              </p>
              <div className="grid grid-cols-3 gap-2">
                {VIRTUAL_BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.id}
                    type="button"
                    onClick={() => setSelectedBg(bg.id)}
                    className={`aspect-video rounded-md border-2 transition-all text-[9px] text-white/80 flex items-end p-1 ${
                      selectedBg === bg.id
                        ? "border-royal-gold"
                        : "border-transparent hover:border-royal-gold/50"
                    }`}
                    style={{
                      background:
                        bg.id === "none"
                          ? "repeating-conic-gradient(#666 0% 25%, #444 0% 50%) 50% / 8px 8px"
                          : `linear-gradient(135deg, ${bg.color}, #0a1628)`,
                    }}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>
            {room.hasRecording && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  🔴 Recording is enabled for this room
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Meeting Controls */}
      <div className="flex items-center justify-center gap-3 px-4 py-4 border-t border-royal-gold/10 bg-card">
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className={`size-12 rounded-full flex items-center justify-center transition-colors ${
            isMuted
              ? "bg-red-500 text-white"
              : "bg-muted hover:bg-muted/80 text-foreground"
          }`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
        </button>

        <button
          type="button"
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`size-12 rounded-full flex items-center justify-center transition-colors ${
            isVideoOff
              ? "bg-red-500 text-white"
              : "bg-muted hover:bg-muted/80 text-foreground"
          }`}
          title={isVideoOff ? "Turn on camera" : "Turn off camera"}
        >
          {isVideoOff ? (
            <CameraOff className="size-5" />
          ) : (
            <Camera className="size-5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsScreenSharing(!isScreenSharing);
            toast(
              isScreenSharing ? "Screen sharing stopped" : "Screen sharing started"
            );
          }}
          className={`size-12 rounded-full flex items-center justify-center transition-colors ${
            isScreenSharing
              ? "bg-royal-gold text-royal-navy"
              : "bg-muted hover:bg-muted/80 text-foreground"
          }`}
          title={isScreenSharing ? "Stop sharing" : "Share screen"}
        >
          {isScreenSharing ? (
            <MonitorOff className="size-5" />
          ) : (
            <Monitor className="size-5" />
          )}
        </button>

        <div className="w-px h-8 bg-border mx-1" />

        <button
          type="button"
          onClick={() => {
            setIsInMeeting(false);
            toast("You left the meeting");
          }}
          className="size-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
          title="Leave meeting"
        >
          <Phone className="size-5 rotate-[135deg]" />
        </button>
      </div>
    </div>
  );
}
