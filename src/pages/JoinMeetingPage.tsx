import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowRight, Crown, Keyboard, Video } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "../../convex/_generated/api";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function JoinMeetingPage() {
  const [meetingId, setMeetingId] = useState("");
  const [lookupSlug, setLookupSlug] = useState<string | null>(null);
  const navigate = useNavigate();

  // Try to resolve the entered ID to a room slug
  const roomLookup = useQuery(
    api.rooms.getBySlug,
    lookupSlug ? { slug: lookupSlug } : "skip"
  );

  const handleJoin = () => {
    const trimmed = meetingId.trim();
    if (!trimmed) {
      toast.error("Please enter a meeting ID or link");
      return;
    }

    // Extract slug from URL or use as-is
    let slug = trimmed;
    if (trimmed.includes("/meeting/")) {
      slug = trimmed.split("/meeting/").pop() ?? trimmed;
    }
    // Remove any query params or trailing slash
    slug = slug.replace(/[?#].*$/, "").replace(/\/$/, "");

    navigate(`/meeting/${slug}`);
  };

  return (
    <div className="min-h-[100vh] bg-royal-navy flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-royal-navy via-royal-navy to-[#050c16]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(160,128,48,0.06)_0%,transparent_60%)]" />
      </div>

      {/* Nav */}
      <header className="relative z-20 px-6 py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-royal-cream/60 hover:text-royal-cream transition-colors font-sans text-sm"
        >
          <Crown className="size-4 text-royal-gold" />
          <span className="font-semibold">Royal Kingdom Connection</span>
        </Link>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-md space-y-10"
          initial="hidden"
          animate="visible"
        >
          {/* Title */}
          <div className="text-center space-y-4">
            <motion.div custom={0} variants={fadeUp} className="flex justify-center">
              <div className="size-16 rounded-full border border-royal-gold/20 bg-royal-gold/5 flex items-center justify-center">
                <Video className="size-7 text-royal-gold" />
              </div>
            </motion.div>
            <motion.h1
              custom={1}
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold text-royal-cream royal-heading"
            >
              Join a Meeting
            </motion.h1>
            <motion.p
              custom={2}
              variants={fadeUp}
              className="text-royal-cream/40 text-sm font-sans"
            >
              Enter a meeting ID or paste a meeting link to join
            </motion.p>
          </div>

          {/* Input */}
          <motion.div custom={3} variants={fadeUp} className="space-y-4">
            <div className="relative">
              <Keyboard className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-royal-gold/40" />
              <Input
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                placeholder="Meeting ID or link"
                className="h-14 pl-11 pr-4 text-base bg-royal-navy-light/50 border-royal-gold/15 text-royal-cream placeholder:text-royal-cream/25 focus-visible:ring-royal-gold/30 focus-visible:border-royal-gold/30 font-sans"
              />
            </div>
            <Button
              onClick={handleJoin}
              disabled={!meetingId.trim()}
              className="w-full h-14 text-base bg-gradient-to-r from-royal-gold-dark via-royal-gold to-royal-gold-light text-royal-navy font-semibold font-sans hover:brightness-110 shadow-lg shadow-royal-gold/20 disabled:opacity-40 disabled:shadow-none"
            >
              Join Meeting
              <ArrowRight className="size-4" />
            </Button>
          </motion.div>

          {/* Divider */}
          <motion.div custom={4} variants={fadeUp} className="flex items-center gap-4">
            <div className="flex-1 h-px bg-royal-gold/10" />
            <span className="text-royal-cream/20 text-xs font-sans uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-royal-gold/10" />
          </motion.div>

          {/* Alternative actions */}
          <motion.div custom={5} variants={fadeUp} className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-12 border-royal-gold/15 text-royal-cream/60 hover:text-royal-cream hover:bg-royal-gold/10 font-sans text-sm"
              asChild
            >
              <Link to="/login">
                Request a Meeting
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-12 border-royal-gold/15 text-royal-cream/60 hover:text-royal-cream hover:bg-royal-gold/10 font-sans text-sm"
              asChild
            >
              <Link to="/signup">
                Create Account
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
