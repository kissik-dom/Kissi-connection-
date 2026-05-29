import { useConvexAuth } from "convex/react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Crown,
  Globe,
  Lock,
  Mic,
  Monitor,
  Shield,
  Users,
  Video,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/* ── animation helpers ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── Coat of arms SVG ──────────────────────────────────── */
function CoatOfArms({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shield */}
      <path
        d="M100 10 C60 10 20 40 20 90 C20 150 100 230 100 230 C100 230 180 150 180 90 C180 40 140 10 100 10Z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Crown star */}
      <path
        d="M100 40 L108 58 L128 58 L112 70 L118 88 L100 76 L82 88 L88 70 L72 58 L92 58Z"
        fill="currentColor"
      />
      {/* Divider */}
      <line x1="55" y1="105" x2="145" y2="105" stroke="currentColor" strokeWidth="1.5" />
      {/* Laurel curves */}
      <path d="M55 120 Q100 150 145 120" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M65 138 Q100 160 135 138" stroke="currentColor" strokeWidth="1" fill="none" />
      {/* Crown at bottom */}
      <circle cx="100" cy="178" r="14" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M94 173 L100 163 L106 173" fill="currentColor" />
    </svg>
  );
}

/* ── decorative animated particles ─────────────────────── */
function GoldParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-royal-gold/30"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: [null, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

/* ── Main Landing Page ─────────────────────────────────── */
export function LandingPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* ═══ HERO — full viewport, navy background ═══ */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center px-4 bg-royal-navy overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-royal-navy via-royal-navy to-[#050c16]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(160,128,48,0.08)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(160,128,48,0.05)_0%,transparent_50%)]" />
          {/* Gold grid lines — subtle */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.015]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#c4a84d" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <GoldParticles />
        </div>

        {/* Coat of arms watermark */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.04, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <CoatOfArms className="w-[500px] h-[600px] text-royal-gold" />
        </motion.div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Royal crest */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex justify-center"
          >
            <div className="relative">
              <div className="size-20 rounded-full border-2 border-royal-gold/30 flex items-center justify-center glow-gold">
                <Crown className="size-8 text-royal-gold" />
              </div>
              {/* Decorative ring */}
              <motion.div
                className="absolute inset-[-8px] rounded-full border border-royal-gold/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </div>
          </motion.div>

          {/* Motto above title */}
          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-royal-gold/60 text-xs tracking-[0.35em] uppercase font-sans font-medium"
          >
            The Royal Kissi Kingdom
          </motion.p>

          {/* Title — serif, commanding */}
          <motion.h1
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] royal-heading"
          >
            <span className="text-royal-cream">Kingdom</span>
            <br />
            <span className="gold-shimmer">Connection</span>
          </motion.h1>

          {/* Decorative gold line */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center gap-4"
          >
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-royal-gold/40" />
            <div className="size-1.5 rounded-full bg-royal-gold/50" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-royal-gold/40" />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-royal-cream/50 text-base md:text-lg max-w-xl mx-auto leading-relaxed font-light font-sans tracking-wide"
          >
            The official diplomatic conferencing platform.
            <br className="hidden sm:block" />
            Sovereign-grade video for councils, ceremonies & state affairs.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            {!isAuthenticated && !isLoading && (
              <>
                <Button
                  size="lg"
                  className="text-base h-14 px-10 bg-gradient-to-r from-royal-gold-dark via-royal-gold to-royal-gold-light text-royal-navy font-semibold font-sans hover:brightness-110 transition-all shadow-lg shadow-royal-gold/20"
                  asChild
                >
                  <Link to="/join">
                    Join a Meeting
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base h-14 px-10 border-royal-gold/30 text-royal-cream/80 hover:bg-royal-gold/10 hover:text-royal-cream font-sans"
                  asChild
                >
                  <Link to="/login">Request a Meeting</Link>
                </Button>
              </>
            )}
            {isAuthenticated && (
              <Button
                size="lg"
                className="text-base h-14 px-10 bg-gradient-to-r from-royal-gold-dark via-royal-gold to-royal-gold-light text-royal-navy font-semibold font-sans hover:brightness-110 transition-all shadow-lg shadow-royal-gold/20"
                asChild
              >
                <Link to="/dashboard">
                  Enter the Kingdom
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            )}
          </motion.div>

          {/* Trust badges */}
          <motion.div
            custom={6}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center gap-8 pt-6 text-xs text-royal-cream/30 font-sans tracking-wider uppercase"
          >
            <span className="flex items-center gap-1.5">
              <Lock className="size-3" />
              Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="size-3" />
              Sovereign
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="size-3" />
              Global
            </span>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="w-5 h-8 rounded-full border border-royal-gold/20 flex items-start justify-center p-1.5">
            <motion.div
              className="w-1 h-2 rounded-full bg-royal-gold/40"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        </motion.div>
      </section>

      {/* ═══ FEATURES — dark card section ═══ */}
      <section className="relative py-24 md:py-32 bg-[#050c16]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(160,128,48,0.04)_0%,transparent_70%)]" />

        <div className="container relative z-10">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.p
              custom={0}
              variants={fadeUp}
              className="text-royal-gold/50 text-xs tracking-[0.3em] uppercase font-sans font-medium mb-4"
            >
              Capabilities
            </motion.p>
            <motion.h2
              custom={1}
              variants={fadeUp}
              className="text-3xl md:text-5xl font-bold tracking-tight text-royal-cream royal-heading mb-4"
            >
              Conferencing Worthy of
              <br />
              <span className="gold-text">the Crown</span>
            </motion.h2>
            <motion.div custom={2} variants={fadeUp}>
              <div className="gold-line w-32 mx-auto mt-6" />
            </motion.div>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {[
              {
                icon: Video,
                title: "Crystal Video",
                desc: "HD video conferencing with adaptive bitrate. Every expression, every nuance — captured with clarity.",
              },
              {
                icon: Users,
                title: "Diplomatic Rooms",
                desc: "Private chambers for councils, ceremonies, and state affairs. Each room with its own protocol.",
              },
              {
                icon: Shield,
                title: "Sovereign Security",
                desc: "End-to-end encryption with sovereign-grade protocols. What happens in the chamber stays in the chamber.",
              },
              {
                icon: Monitor,
                title: "Virtual Backgrounds",
                desc: "A curated library of royal settings — throne rooms, gardens, diplomatic halls. Upload your own.",
              },
              {
                icon: Globe,
                title: "Global Reach",
                desc: "Connect with dignitaries worldwide. Low-latency infrastructure across every continent.",
              },
              {
                icon: Mic,
                title: "Recording & Archive",
                desc: "Record sessions for the royal archive. Every meeting preserved with timestamp precision.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                variants={scaleIn}
                className="group relative overflow-hidden rounded-xl border border-royal-gold/10 bg-royal-navy/50 p-8 transition-all duration-500 hover:border-royal-gold/25 hover:bg-royal-navy/80"
              >
                <div className="absolute top-0 right-0 -mt-10 -mr-10 size-32 rounded-full bg-royal-gold/5 blur-3xl transition-all duration-500 group-hover:bg-royal-gold/10" />
                <div className="relative">
                  <div className="size-12 rounded-xl border border-royal-gold/20 bg-royal-gold/5 flex items-center justify-center mb-6">
                    <feature.icon className="size-5 text-royal-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-royal-cream mb-3 font-sans tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-royal-cream/40 leading-relaxed font-sans">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ STATS ROW ═══ */}
      <section className="relative py-20 bg-royal-navy border-y border-royal-gold/10">
        <div className="absolute inset-0 bg-gradient-to-r from-royal-gold/[0.02] via-transparent to-royal-gold/[0.02]" />
        <div className="container relative z-10">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { value: "256-bit", label: "Encryption" },
              { value: "99.9%", label: "Uptime" },
              { value: "50+", label: "Backgrounds" },
              { value: "∞", label: "Meetings" },
            ].map((stat, i) => (
              <motion.div key={stat.label} custom={i} variants={fadeUp} className="space-y-2">
                <p className="text-3xl md:text-4xl font-bold gold-text royal-heading">
                  {stat.value}
                </p>
                <p className="text-xs text-royal-cream/30 tracking-wider uppercase font-sans">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="relative py-24 md:py-32 bg-[#050c16] coat-watermark overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-royal-navy/50 to-transparent" />
        <div className="container relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl mx-auto space-y-8"
          >
            <motion.div custom={0} variants={fadeUp}>
              <Crown className="size-10 text-royal-gold/40 mx-auto mb-4" />
            </motion.div>
            <motion.h2
              custom={1}
              variants={fadeUp}
              className="text-3xl md:text-5xl font-bold text-royal-cream royal-heading"
            >
              Begin Your
              <br />
              <span className="gold-shimmer">Royal Session</span>
            </motion.h2>
            <motion.p
              custom={2}
              variants={fadeUp}
              className="text-royal-cream/40 text-base font-sans"
            >
              Join the conferencing platform trusted by the Royal Kissi Kingdom.
            </motion.p>
            <motion.div custom={3} variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="text-base h-14 px-10 bg-gradient-to-r from-royal-gold-dark via-royal-gold to-royal-gold-light text-royal-navy font-semibold font-sans hover:brightness-110 shadow-lg shadow-royal-gold/20"
                asChild
              >
                <Link to="/join">
                  Join a Meeting
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base h-14 px-10 border-royal-gold/30 text-royal-cream/70 hover:bg-royal-gold/10 font-sans"
                asChild
              >
                <Link to="/signup">Create an Account</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-royal-navy border-t border-royal-gold/10 py-10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg border border-royal-gold/20 flex items-center justify-center">
                <Crown className="size-4 text-royal-gold" />
              </div>
              <span className="text-royal-cream/70 font-semibold text-sm font-sans">
                Royal Kingdom Connection
              </span>
            </div>
            <p className="text-royal-cream/25 text-xs font-sans italic tracking-wide">
              © {new Date().getFullYear()} The Royal Kissi Kingdom — Omnividens, Omnipotens, Omniaeternus
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
