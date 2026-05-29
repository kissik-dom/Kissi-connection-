import { useConvexAuth } from "convex/react";
import {
  ArrowRight,
  Check,
  Crown,
  Globe,
  Mic,
  Monitor,
  Shield,
  Users,
  Video,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-20 md:py-32">
        {/* Royal pattern background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-royal-navy/5 via-transparent to-royal-gold/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(160,128,48,0.08)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(10,22,40,0.06)_0%,transparent_50%)]" />
          <svg className="absolute top-0 left-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="royal-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M30 5 L35 20 L50 20 L38 30 L42 45 L30 36 L18 45 L22 30 L10 20 L25 20 Z" fill="#a08030" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#royal-pattern)" />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Royal Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-royal-gold/30 bg-royal-gold/5 text-sm font-medium text-royal-gold-dark">
            <Crown className="size-4 fill-royal-gold text-royal-gold" />
            The Royal Kissi Kingdom
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            Royal Kingdom
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-royal-gold-dark via-royal-gold to-royal-gold-light">
              Connection
            </span>
          </h1>

          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The official diplomatic video conferencing platform of the Royal Kissi Kingdom.
            Connect with dignitaries, host council meetings, and conduct royal ceremonies
            with sovereign-grade security and elegance.
          </p>

          {!isAuthenticated && !isLoading && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                size="lg"
                className="text-base h-12 px-8 bg-royal-navy hover:bg-royal-navy-light text-royal-cream"
                asChild
              >
                <Link to="/signup">
                  Enter the Kingdom
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base h-12 px-8 border-royal-gold/40 text-royal-navy hover:bg-royal-gold/10"
                asChild
              >
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          )}
          {isAuthenticated && (
            <div className="pt-2">
              <Button
                size="lg"
                className="text-base h-12 px-8 bg-royal-navy hover:bg-royal-navy-light text-royal-cream"
                asChild
              >
                <Link to="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          )}

          <div className="flex items-center justify-center gap-6 pt-4 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1.5">
              <Check className="size-4 text-royal-gold" />
              <span>End-to-end encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="size-4 text-royal-gold" />
              <span>Royal-grade security</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="size-4 text-royal-gold" />
              <span>Free to use</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 border-t border-royal-gold/10 bg-gradient-to-b from-transparent to-royal-navy/[0.02]">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-royal-gold tracking-widest uppercase mb-3">
              Royal Features
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Conferencing Fit for Royalty
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Every feature designed with the dignity and security
              befitting the Royal Kissi Kingdom.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {/* Diplomatic Rooms */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-royal-cream/30 border border-royal-gold/15 p-6 md:p-8 transition-all hover:shadow-lg hover:border-royal-gold/30">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 size-24 rounded-full bg-royal-gold/10 blur-2xl transition-all group-hover:bg-royal-gold/20" />
              <div className="relative">
                <div className="inline-flex size-11 items-center justify-center rounded-xl bg-royal-gold/10 mb-5">
                  <Globe className="size-5 text-royal-gold" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Diplomatic Rooms</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Dedicated meeting rooms for diplomatic discussions with
                  customizable access controls and protocols.
                </p>
              </div>
            </div>

            {/* HD Video */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-royal-cream/30 border border-royal-gold/15 p-6 md:p-8 transition-all hover:shadow-lg hover:border-royal-gold/30">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 size-24 rounded-full bg-royal-emerald/10 blur-2xl transition-all group-hover:bg-royal-emerald/20" />
              <div className="relative">
                <div className="inline-flex size-11 items-center justify-center rounded-xl bg-royal-emerald/10 mb-5">
                  <Video className="size-5 text-royal-emerald" />
                </div>
                <h3 className="font-semibold text-lg mb-2">HD Video Calls</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Crystal-clear video conferencing powered by WebRTC
                  for seamless royal communications.
                </p>
              </div>
            </div>

            {/* Security */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-royal-cream/30 border border-royal-gold/15 p-6 md:p-8 transition-all hover:shadow-lg hover:border-royal-gold/30">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 size-24 rounded-full bg-royal-navy/10 blur-2xl transition-all group-hover:bg-royal-navy/20" />
              <div className="relative">
                <div className="inline-flex size-11 items-center justify-center rounded-xl bg-royal-navy/10 mb-5">
                  <Shield className="size-5 text-royal-navy" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Sovereign Security</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  End-to-end encryption with sovereign-grade protocols
                  protecting every conversation.
                </p>
              </div>
            </div>

            {/* Meeting Management - wide card */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card to-royal-cream/30 border border-royal-gold/15 p-6 md:p-8 md:col-span-2 lg:col-span-2 transition-all hover:shadow-lg hover:border-royal-gold/30">
              <div className="absolute bottom-0 left-0 -mb-8 -ml-8 size-32 rounded-full bg-royal-gold/10 blur-2xl transition-all group-hover:bg-royal-gold/20" />
              <div className="relative flex flex-col md:flex-row md:items-center gap-6">
                <div className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-royal-gold/10">
                  <Users className="size-7 text-royal-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Diplomatic Connect & Scheduling
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Schedule meetings with dignitaries, manage invitations, and
                    coordinate across time zones. Full agenda management with
                    council, ceremony, and diplomatic meeting types.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-royal-navy text-royal-cream p-6 md:p-8 transition-all hover:shadow-lg">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 size-32 rounded-full bg-royal-gold/10 blur-2xl" />
              <div className="relative">
                <Crown className="size-6 text-royal-gold mb-3" />
                <h3 className="font-semibold text-lg mb-2">Begin Your Session</h3>
                <p className="text-royal-cream/70 text-sm leading-relaxed mb-4">
                  Join the royal conferencing platform used by the Kissi Kingdom.
                </p>
                <Button
                  size="sm"
                  className="bg-royal-gold text-royal-navy hover:bg-royal-gold-light font-semibold"
                  asChild
                >
                  <Link to="/signup">
                    Get Started
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Row */}
      <section className="py-16 border-t border-royal-gold/10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div className="space-y-2">
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-royal-gold/10 mx-auto">
                <Video className="size-5 text-royal-gold" />
              </div>
              <p className="font-semibold text-sm">Video Rooms</p>
              <p className="text-xs text-muted-foreground">Unique links</p>
            </div>
            <div className="space-y-2">
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-royal-gold/10 mx-auto">
                <Mic className="size-5 text-royal-gold" />
              </div>
              <p className="font-semibold text-sm">Recording</p>
              <p className="text-xs text-muted-foreground">Save sessions</p>
            </div>
            <div className="space-y-2">
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-royal-gold/10 mx-auto">
                <Monitor className="size-5 text-royal-gold" />
              </div>
              <p className="font-semibold text-sm">Virtual Backgrounds</p>
              <p className="text-xs text-muted-foreground">Royal themes</p>
            </div>
            <div className="space-y-2">
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-royal-gold/10 mx-auto">
                <Shield className="size-5 text-royal-gold" />
              </div>
              <p className="font-semibold text-sm">Admin Panel</p>
              <p className="text-xs text-muted-foreground">Full control</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-royal-gold/10 py-8 bg-royal-navy/[0.02]">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Crown className="size-4 text-royal-gold" />
              <span className="font-semibold text-foreground">Royal Kingdom Connection</span>
            </div>
            <p className="text-xs">
              © {new Date().getFullYear()} The Royal Kissi Kingdom — <em>Omnividens, Omnipotens, Omniaeternus</em>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
