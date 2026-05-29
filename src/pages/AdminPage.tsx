import { useMutation, useQuery } from "convex/react";
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Shield className="size-6 text-royal-gold" />
          Admin Panel
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage rooms, meetings, users, and recordings
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-royal-gold/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-royal-gold/10 flex items-center justify-center">
                <Video className="size-4 text-royal-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rooms?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">Total Rooms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-royal-gold/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-royal-emerald/10 flex items-center justify-center">
                <Calendar className="size-4 text-royal-emerald" />
              </div>
              <div>
                <p className="text-2xl font-bold">{meetingStats?.total ?? 0}</p>
                <p className="text-xs text-muted-foreground">Total Meetings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-royal-gold/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Disc className="size-4 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{recordingStats?.total ?? 0}</p>
                <p className="text-xs text-muted-foreground">Recordings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-royal-gold/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-royal-navy/10 flex items-center justify-center">
                <Settings className="size-4 text-royal-navy" />
              </div>
              <div>
                <p className="text-2xl font-bold">{meetingStats?.live ?? 0}</p>
                <p className="text-xs text-muted-foreground">Live Now</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue={defaultTab}
        onValueChange={(v) => setSearchParams({ tab: v })}
        className="space-y-6"
      >
        <TabsList className="bg-muted/60 border border-royal-gold/10">
          <TabsTrigger value="rooms" className="data-[state=active]:bg-card">
            <Video className="size-3.5 mr-1.5" />
            Rooms
          </TabsTrigger>
          <TabsTrigger value="meetings" className="data-[state=active]:bg-card">
            <Calendar className="size-3.5 mr-1.5" />
            Meetings
          </TabsTrigger>
          <TabsTrigger value="recordings" className="data-[state=active]:bg-card">
            <Disc className="size-3.5 mr-1.5" />
            Recordings
          </TabsTrigger>
        </TabsList>

        {/* Rooms Tab */}
        <TabsContent value="rooms">
          <Card className="border-royal-gold/10">
            <CardHeader>
              <CardTitle>All Rooms</CardTitle>
              <CardDescription>
                Manage meeting rooms across the kingdom
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!rooms || rooms.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Video className="size-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No rooms created yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Room</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Max</TableHead>
                        <TableHead>Recording</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rooms.map((room) => {
                        const Icon = roomTypeIcons[room.type] ?? Video;
                        return (
                          <TableRow key={room._id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="size-8 rounded-lg bg-royal-gold/10 flex items-center justify-center shrink-0">
                                  <Icon className="size-3.5 text-royal-gold" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">
                                    {room.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {room.slug}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs capitalize">
                                {room.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {room.maxParticipants}
                            </TableCell>
                            <TableCell>
                              {room.hasRecording ? (
                                <Badge variant="outline" className="text-xs text-royal-gold-dark border-royal-gold/30 bg-royal-gold/5">
                                  Yes
                                </Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">No</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={room.isActive}
                                onCheckedChange={(v) =>
                                  toggleRoom(room._id, v)
                                }
                              />
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {formatDate(room._creationTime)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  removeRoom({ id: room._id });
                                  toast.success("Room deleted");
                                }}
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
              <CardTitle>All Meetings</CardTitle>
              <CardDescription>
                View and manage all scheduled and past meetings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!meetings || meetings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="size-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No meetings scheduled yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Meeting</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Scheduled</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
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
                                <p className="font-medium text-sm">
                                  {meeting.title}
                                </p>
                                {meeting.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {meeting.description}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs capitalize">
                                {meeting.meetingType}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`text-xs capitalize ${statusColors[meeting.status]}`}
                              >
                                {meeting.status === "live" && (
                                  <span className="size-1.5 rounded-full bg-red-500 animate-pulse mr-1" />
                                )}
                                {meeting.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {formatDate(meeting.scheduledAt)}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {meeting.duration
                                ? formatDuration(meeting.duration)
                                : "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  removeMeeting({ id: meeting._id });
                                  toast.success("Meeting deleted");
                                }}
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
              <CardTitle>Recordings</CardTitle>
              <CardDescription>
                Manage meeting recordings and archives
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!recordings || recordings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Disc className="size-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No recordings yet</p>
                  <p className="text-xs mt-1">
                    Recordings will appear here after meetings with recording enabled
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Recording</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
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
                              <p className="font-medium text-sm">
                                {recording.title}
                              </p>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`text-xs capitalize ${statusColors[recording.status]}`}
                              >
                                {recording.status === "recording" && (
                                  <span className="size-1.5 rounded-full bg-red-500 animate-pulse mr-1" />
                                )}
                                {recording.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {recording.duration
                                ? formatDuration(recording.duration)
                                : "—"}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {formatDate(recording._creationTime)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  removeRecording({ id: recording._id });
                                  toast.success("Recording deleted");
                                }}
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
    </div>
  );
}
