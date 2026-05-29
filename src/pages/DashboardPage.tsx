import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Crown,
  Disc,
  Plus,
  Radio,
  Shield,
  Users,
  Video,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "../../convex/_generated/api";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function DashboardPage() {
  const user = useQuery(api.auth.currentUser);
  const meetingStats = useQuery(api.meetings.stats);
  const upcomingMeetings = useQuery(api.meetings.listUpcoming);
  const rooms = useQuery(api.rooms.listActive);
  const recordingStats = useQuery(api.recordings.stats);

  const stats = [
    {
      title: "Active Rooms",
      value: rooms?.length ?? 0,
      icon: Video,
      gradient: "from-royal-gold/20 to-royal-gold/5",
      iconColor: "text-royal-gold",
      borderColor: "border-royal-gold/20",
    },
    {
      title: "Upcoming",
      value: meetingStats?.scheduled ?? 0,
      icon: Calendar,
      gradient: "from-royal-emerald/20 to-royal-emerald/5",
      iconColor: "text-royal-emerald",
      borderColor: "border-royal-emerald/20",
    },
    {
      title: "Live Now",
      value: meetingStats?.live ?? 0,
      icon: Radio,
      gradient: "from-red-500/20 to-red-500/5",
      iconColor: "text-red-500",
      borderColor: "border-red-500/20",
    },
    {
      title: "Recordings",
      value: recordingStats?.total ?? 0,
      icon: Disc,
      gradient: "from-royal-navy/20 to-royal-navy/5",
      iconColor: "text-royal-navy",
      borderColor: "border-royal-navy/20",
    },
  ];

  return (
    <motion.div className="space-y-8" initial="hidden" animate="visible">
      {/* ── Welcome banner with gold gradient ── */}
      <motion.div
        custom={0}
        variants={fadeUp}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-royal-navy via-royal-navy-light to-royal-navy p-6 md:p-8"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(160,128,48,0.1)_0%,transparent_60%)]" />
        <div className="absolute top-4 right-4 opacity-[0.04]">
          <Crown className="size-32 text-royal-gold" />
        </div>

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="size-10 rounded-full bg-royal-gold/10 border border-royal-gold/20 flex items-center justify-center">
                <Crown className="size-4 text-royal-gold" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-royal-cream royal-heading">
                  Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
                </h1>
                <p className="text-royal-cream/40 text-sm font-sans">
                  Royal Kingdom Connection — Command Centre
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-gradient-to-r from-royal-gold-dark to-royal-gold text-royal-navy font-semibold font-sans hover:brightness-110 shadow-lg shadow-royal-gold/10"
              asChild
            >
              <Link to="/rooms">
                <Plus className="size-4" />
                New Room
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-royal-gold/20 text-royal-cream/60 hover:bg-royal-gold/10 hover:text-royal-cream font-sans"
              asChild
            >
              <Link to="/calendar">
                <Calendar className="size-4" />
                Calendar
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ── Stats grid with subtle animations ── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.title} custom={i + 1} variants={scaleIn}>
            <Card className={`border ${stat.borderColor} overflow-hidden group hover:shadow-md transition-all`}>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-sans">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold tracking-tight mt-1 royal-heading">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`size-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`size-4 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Main content grid ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming meetings */}
        <motion.div custom={5} variants={fadeUp}>
          <Card className="border-royal-gold/10 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg royal-heading">
                <Calendar className="size-5 text-royal-gold" />
                Upcoming Meetings
              </CardTitle>
              <CardDescription className="font-sans text-xs">
                Scheduled diplomatic sessions and councils
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!upcomingMeetings || upcomingMeetings.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Calendar className="size-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-sans">No upcoming meetings</p>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-royal-gold mt-1 font-sans text-xs"
                    asChild
                  >
                    <Link to="/diplomatic">Schedule a meeting</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {upcomingMeetings.slice(0, 5).map((meeting) => (
                    <div
                      key={meeting._id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-gradient-to-br from-royal-gold/15 to-royal-gold/5 flex items-center justify-center shrink-0">
                          <Video className="size-4 text-royal-gold" />
                        </div>
                        <div>
                          <p className="font-medium text-sm font-sans">{meeting.title}</p>
                          <p className="text-xs text-muted-foreground font-sans">
                            {formatDate(meeting.scheduledAt)}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] border-royal-gold/20 text-royal-gold-dark capitalize font-sans"
                      >
                        {meeting.meetingType}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Active rooms */}
        <motion.div custom={6} variants={fadeUp}>
          <Card className="border-royal-gold/10 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg royal-heading">
                <Users className="size-5 text-royal-emerald" />
                Active Rooms
              </CardTitle>
              <CardDescription className="font-sans text-xs">
                Available meeting rooms in the kingdom
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!rooms || rooms.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Video className="size-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-sans">No active rooms</p>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-royal-gold mt-1 font-sans text-xs"
                    asChild
                  >
                    <Link to="/rooms">Create a room</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {rooms.slice(0, 5).map((room) => (
                    <div
                      key={room._id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-gradient-to-br from-royal-emerald/15 to-royal-emerald/5 flex items-center justify-center shrink-0">
                          <Users className="size-4 text-royal-emerald" />
                        </div>
                        <div>
                          <p className="font-medium text-sm font-sans">{room.name}</p>
                          <p className="text-xs text-muted-foreground capitalize font-sans">
                            {room.type} · Max {room.maxParticipants}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-royal-gold/20 hover:bg-royal-gold/10 font-sans"
                        asChild
                      >
                        <Link to={`/meeting/${room.slug}`}>
                          Join
                          <ArrowRight className="size-3" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Quick actions ── */}
      <motion.div custom={7} variants={fadeUp}>
        <Card className="border-royal-gold/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg royal-heading">
              <Crown className="size-5 text-royal-gold" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { href: "/rooms", icon: Video, label: "Meeting Rooms", sub: "Create & manage", color: "from-royal-gold/15 to-royal-gold/5", iconColor: "text-royal-gold" },
                { href: "/calendar", icon: Calendar, label: "Calendar", sub: "View schedule", color: "from-royal-emerald/15 to-royal-emerald/5", iconColor: "text-royal-emerald" },
                { href: "/admin", icon: Shield, label: "Admin Panel", sub: "Full control", color: "from-royal-navy/15 to-royal-navy/5", iconColor: "text-royal-navy" },
                { href: "/admin?tab=recordings", icon: Disc, label: "Recordings", sub: "View archives", color: "from-royal-burgundy/15 to-royal-burgundy/5", iconColor: "text-royal-burgundy" },
              ].map((action) => (
                <Button
                  key={action.href}
                  variant="outline"
                  className="h-auto py-4 justify-start gap-3 border-royal-gold/10 hover:bg-royal-gold/5 hover:border-royal-gold/20 transition-all font-sans"
                  asChild
                >
                  <Link to={action.href}>
                    <div className={`size-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shrink-0`}>
                      <action.icon className={`size-4 ${action.iconColor}`} />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.sub}</p>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
