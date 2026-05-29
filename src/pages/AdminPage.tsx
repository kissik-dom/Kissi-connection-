import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  Calendar,
  Crown,
  Disc,
  Globe,
  Lock,
  Settings,
  Shield,
  Trash2,
  Users,
  Video,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { api } from "../../convex/_generated/api";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const roomTypeIcons: Record<string, typeof Globe> = {
  diplomatic: Globe,
  council: Crown,
  public: Users,
  private: Lock,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") ?? "rooms";

  const rooms = useQuery(api.rooms.list);
  const meetings = useQuery(api.meetings.list);
  const recordings = useQuery(api.recordings.list);
  const meetingStats = useQuery(api.meetings.stats);
  const recordingStats = useQuery(api.recordings.stats);

  const updateRoom = useMutation(api.rooms.update);
  const removeRoom = useMutation(api.rooms.remove);
  const removeMeeting = useMutation(api.meetings.remove);
  const removeRecording = useMutation(api.recordings.remove);

  const toggleRoom = async (roomId: typeof rooms extends (infer T)[] | undefined ? T extends { _id: infer I } ? I : never : never, isActive: boolean) => {
    try {
      await updateRoom({ id: roomId, isActive });
      toast.success(isActive ? "Room activated" : "Room deactivated");
    } catch {
      toast.error("Failed to update room");
    }
  };

  return (
    <motion.div className="space-y-8" initial="hidden" animate="visible">
      {/* Header with gradient banner */}
      <motion.div
        custom={0}
        variants={fadeUp}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-royal-navy via-royal-navy-light to-royal-navy p-6"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(160,128,48,0.08)_0%,transparent_60%)]" />
        <div className="absolute top-3 right-3 opacity-[0.03]">
          <Shield className="size-24 text-royal-gold" />
        </div>
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 text-royal-cream royal-heading">
            <Shield className="size-6 text-royal-gold" />
            Admin Panel
          </h1>
          <p className="text-royal-cream/40 mt-1 text-sm font-sans">
            Complete control over rooms, meetings, and recordings
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Rooms", value: rooms?.length ?? 0, icon: Video, gradient: "from-royal-gold/15 to-royal-gold/5", color: "text-royal-gold" },
          { label: "Total Meetings", value: meetingStats?.total ?? 0, icon: Calendar, gradient: "from-royal-emerald/15 to-royal-emerald/5", color: "text-royal-emerald" },
          { label: "Recordings", value: recordingStats?.total ?? 0, icon: Disc, gradient: "from-red-500/15 to-red-500/5", color: "text-red-500" },
          { label: "Live Now", value: meetingStats?.live ?? 0, icon: Settings, gradient: "from-royal-navy/15 to-royal-navy/5", color: "text-royal-navy" },
        ].map((stat, i) => (
          <motion.div key={stat.label} custom={i + 1} variants={fadeUp}>
            <Card className="border-royal-gold/10">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <stat.icon className={`size-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold royal-heading">{stat.value}</p>
                    <p className="text-xs text-muted-foreground font-sans">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <motion.div custom={5} variants={fadeUp}>
        <Tabs
          defaultValue={defaultTab}
          onValueChange={(v) => setSearchParams({ tab: v })}
          className="space-y-6"
        >
          <TabsList className="bg-muted/60 border border-royal-gold/10">
            <TabsTrigger value="rooms" className="data-[state=active]:bg-card font-sans text-xs">
              <Video className="size-3.5 mr-1.5" />
              Rooms
            </TabsTrigger>
            <TabsTrigger value="meetings" className="data-[state=active]:bg-card font-sans text-xs">
              <Calendar className="size-3.5 mr-1.5" />
              Meetings
            </TabsTrigger>
            <TabsTrigger value="recordings" className="data-[state=active]:bg-card font-sans text-xs">
              <Disc className="size-3.5 mr-1.5" />
              Recordings
            </TabsTrigger>
          </TabsList>

          {/* Rooms Tab */}
          <TabsContent value="rooms">
            <Card className="border-royal-gold/10">
              <CardHeader>
                <CardTitle className="royal-heading">All Rooms</CardTitle>
                <CardDescription className="font-sans text-xs">
                  Manage meeting rooms across the kingdom
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!rooms || rooms.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Video className="size-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-sans">No rooms created yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-sans text-xs">Room</TableHead>
                          <TableHead className="font-sans text-xs">Type</TableHead>
                          <TableHead className="font-sans text-xs">Max</TableHead>
                          <TableHead className="font-sans text-xs">Recording</TableHead>
                          <TableHead className="font-sans text-xs">Active</TableHead>
                          <TableHead className="font-sans text-xs">Created</TableHead>
                          <TableHead className="text-right font-sans text-xs">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rooms.map((room) => {
                          const Icon = roomTypeIcons[room.type] ?? Video;
                          return (
                            <TableRow key={room._id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="size-8 rounded-lg bg-gradient-to-br from-royal-gold/15 to-royal-gold/5 flex items-center justify-center shrink-0">
                                    <Icon className="size-3.5 text-royal-gold" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm font-sans">{room.name}</p>
                                    <p className="text-[10px] text-muted-foreground font-sans font-mono">{room.slug}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-[10px] capitalize font-sans">{room.type}</Badge>
                              </TableCell>
                              <TableCell className="text-sm font-sans">{room.maxParticipants}</TableCell>
                              <TableCell>
                                {room.hasRecording ? (
                                  <Badge variant="outline" className="text-[10px] text-royal-gold-dark border-royal-gold/30 bg-royal-gold/5 font-sans">Yes</Badge>
                                ) : (
                                  <span className="text-xs text-muted-foreground font-sans">No</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Switch checked={room.isActive} onCheckedChange={(v) => toggleRoom(room._id, v)} />
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground font-sans">{formatDate(room._creationTime)}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => { removeRoom({ id: room._id }); toast.success("Room deleted"); }}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Meetings Tab */}
          <TabsContent value="meetings">
            <Card className="border-royal-gold/10">
              <CardHeader>
                <CardTitle className="royal-heading">All Meetings</CardTitle>
                <CardDescription className="font-sans text-xs">
                  View and manage all scheduled and past meetings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!meetings || meetings.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="size-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-sans">No meetings scheduled yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-sans text-xs">Meeting</TableHead>
                          <TableHead className="font-sans text-xs">Type</TableHead>
                          <TableHead className="font-sans text-xs">Status</TableHead>
                          <TableHead className="font-sans text-xs">Scheduled</TableHead>
                          <TableHead className="font-sans text-xs">Duration</TableHead>
                          <TableHead className="text-right font-sans text-xs">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {meetings.map((meeting) => {
                          const statusColors: Record<string, string> = {
                            scheduled: "bg-royal-gold/10 text-royal-gold-dark border-royal-gold/30",
                            live: "bg-red-500/10 text-red-600 border-red-500/30",
                            ended: "bg-muted text-muted-foreground border-border",
                            cancelled: "bg-destructive/10 text-destructive border-destructive/30",
                          };
                          return (
                            <TableRow key={meeting._id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium text-sm font-sans">{meeting.title}</p>
                                  {meeting.description && (
                                    <p className="text-[10px] text-muted-foreground line-clamp-1 font-sans">{meeting.description}</p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-[10px] capitalize font-sans">{meeting.meetingType}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={`text-[10px] capitalize font-sans ${statusColors[meeting.status]}`}>
                                  {meeting.status === "live" && <span className="size-1.5 rounded-full bg-red-500 animate-pulse mr-1" />}
                                  {meeting.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground font-sans">{formatDate(meeting.scheduledAt)}</TableCell>
                              <TableCell className="text-xs text-muted-foreground font-sans">{meeting.duration ? formatDuration(meeting.duration) : "—"}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => { removeMeeting({ id: meeting._id }); toast.success("Meeting deleted"); }}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recordings Tab */}
          <TabsContent value="recordings">
            <Card className="border-royal-gold/10">
              <CardHeader>
                <CardTitle className="royal-heading">Recordings</CardTitle>
                <CardDescription className="font-sans text-xs">
                  Manage meeting recordings and archives
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!recordings || recordings.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Disc className="size-10 mx-auto mb-3 opacity-20" />
                    <p className="text-sm font-sans">No recordings yet</p>
                    <p className="text-xs mt-1 font-sans">
                      Recordings will appear after meetings with recording enabled
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-sans text-xs">Recording</TableHead>
                          <TableHead className="font-sans text-xs">Status</TableHead>
                          <TableHead className="font-sans text-xs">Duration</TableHead>
                          <TableHead className="font-sans text-xs">Created</TableHead>
                          <TableHead className="text-right font-sans text-xs">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recordings.map((recording) => {
                          const statusColors: Record<string, string> = {
                            recording: "bg-red-500/10 text-red-600 border-red-500/30",
                            processing: "bg-royal-gold/10 text-royal-gold-dark border-royal-gold/30",
                            ready: "bg-royal-emerald/10 text-royal-emerald border-royal-emerald/30",
                            failed: "bg-destructive/10 text-destructive border-destructive/30",
                          };
                          return (
                            <TableRow key={recording._id}>
                              <TableCell>
                                <p className="font-medium text-sm font-sans">{recording.title}</p>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={`text-[10px] capitalize font-sans ${statusColors[recording.status]}`}>
                                  {recording.status === "recording" && <span className="size-1.5 rounded-full bg-red-500 animate-pulse mr-1" />}
                                  {recording.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground font-sans">{recording.duration ? formatDuration(recording.duration) : "—"}</TableCell>
                              <TableCell className="text-xs text-muted-foreground font-sans">{formatDate(recording._creationTime)}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => { removeRecording({ id: recording._id }); toast.success("Recording deleted"); }}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
