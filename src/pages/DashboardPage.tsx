import { useQuery } from "convex/react";
import {
  ArrowRight,
  Calendar,
  Crown,
  Disc,
  Globe,
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
      color: "text-royal-gold",
      bg: "bg-royal-gold/10",
    },
    {
      title: "Upcoming Meetings",
      value: meetingStats?.scheduled ?? 0,
      icon: Calendar,
      color: "text-royal-emerald",
      bg: "bg-royal-emerald/10",
    },
    {
      title: "Live Now",
      value: meetingStats?.live ?? 0,
      icon: Radio,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      title: "Recordings",
      value: recordingStats?.total ?? 0,
      icon: Disc,
      color: "text-royal-navy",
      bg: "bg-royal-navy/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Crown className="size-5 text-royal-gold" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Royal Kingdom Connection Dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="bg-royal-navy hover:bg-royal-navy-light text-royal-cream"
            asChild
          >
            <Link to="/rooms">
              <Plus className="size-4" />
              New Room
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-royal-gold/30 hover:bg-royal-gold/10"
            asChild
          >
            <Link to="/diplomatic">
              <Calendar className="size-4" />
              Schedule Meeting
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-royal-gold/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bg}`}>
                <stat.icon className={`size-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Meetings */}
        <Card className="border-royal-gold/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5 text-royal-gold" />
              Upcoming Meetings
            </CardTitle>
            <CardDescription>
              Scheduled diplomatic sessions and council meetings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!upcomingMeetings || upcomingMeetings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="size-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No upcoming meetings</p>
                <Button
                  variant="link"
                  size="sm"
                  className="text-royal-gold mt-1"
                  asChild
                >
                  <Link to="/diplomatic">Schedule a meeting</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingMeetings.slice(0, 5).map((meeting) => (
                  <div
                    key={meeting._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-royal-gold/10 flex items-center justify-center shrink-0">
                        <Video className="size-4 text-royal-gold" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{meeting.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(meeting.scheduledAt)}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs border-royal-gold/30 text-royal-gold-dark capitalize"
                    >
                      {meeting.meetingType}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Rooms */}
        <Card className="border-royal-gold/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5 text-royal-emerald" />
              Active Rooms
            </CardTitle>
            <CardDescription>
              Available meeting rooms in the kingdom
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!rooms || rooms.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Video className="size-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No active rooms</p>
                <Button
                  variant="link"
                  size="sm"
                  className="text-royal-gold mt-1"
                  asChild
                >
                  <Link to="/rooms">Create a room</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {rooms.slice(0, 5).map((room) => (
                  <div
                    key={room._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-royal-emerald/10 flex items-center justify-center shrink-0">
                        <Users className="size-4 text-royal-emerald" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{room.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {room.type} · Max {room.maxParticipants}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs border-royal-gold/30 hover:bg-royal-gold/10"
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
      </div>

      {/* Quick Actions */}
      <Card className="border-royal-gold/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="size-5 text-royal-gold" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 justify-start gap-3 border-royal-gold/15 hover:bg-royal-gold/5 hover:border-royal-gold/30"
              asChild
            >
              <Link to="/rooms">
                <div className="size-10 rounded-lg bg-royal-gold/10 flex items-center justify-center shrink-0">
                  <Video className="size-4 text-royal-gold" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">Meeting Rooms</p>
                  <p className="text-xs text-muted-foreground">Create & manage</p>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 justify-start gap-3 border-royal-gold/15 hover:bg-royal-gold/5 hover:border-royal-gold/30"
              asChild
            >
              <Link to="/diplomatic">
                <div className="size-10 rounded-lg bg-royal-emerald/10 flex items-center justify-center shrink-0">
                  <Globe className="size-4 text-royal-emerald" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">Diplomatic Connect</p>
                  <p className="text-xs text-muted-foreground">Schedule meetings</p>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 justify-start gap-3 border-royal-gold/15 hover:bg-royal-gold/5 hover:border-royal-gold/30"
              asChild
            >
              <Link to="/admin">
                <div className="size-10 rounded-lg bg-royal-navy/10 flex items-center justify-center shrink-0">
                  <Shield className="size-4 text-royal-navy" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">Admin Panel</p>
                  <p className="text-xs text-muted-foreground">Full control</p>
                </div>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 justify-start gap-3 border-royal-gold/15 hover:bg-royal-gold/5 hover:border-royal-gold/30"
              asChild
            >
              <Link to="/admin?tab=recordings">
                <div className="size-10 rounded-lg bg-royal-burgundy/10 flex items-center justify-center shrink-0">
                  <Disc className="size-4 text-royal-burgundy" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">Recordings</p>
                  <p className="text-xs text-muted-foreground">View archives</p>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
