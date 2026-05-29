import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Crown,
  Globe,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const meetingTypeLabels = {
  diplomatic: { label: "Diplomatic Session", color: "border-royal-gold/30 text-royal-gold-dark bg-royal-gold/5" },
  council: { label: "Council Meeting", color: "border-royal-burgundy/30 text-royal-burgundy bg-royal-burgundy/5" },
  general: { label: "General Meeting", color: "border-royal-emerald/30 text-royal-emerald bg-royal-emerald/5" },
  ceremony: { label: "Royal Ceremony", color: "border-royal-navy/30 text-royal-navy bg-royal-navy/5" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function DiplomaticPage() {
  const rooms = useQuery(api.rooms.listActive);
  const meetings = useQuery(api.meetings.list);
  const upcomingMeetings = useQuery(api.meetings.listUpcoming);
  const createMeeting = useMutation(api.meetings.create);
  const cancelMeeting = useMutation(api.meetings.updateStatus);
  const removeMeeting = useMutation(api.meetings.remove);

  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roomId, setRoomId] = useState("");
  const [meetingType, setMeetingType] = useState<"diplomatic" | "council" | "general" | "ceremony">("diplomatic");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [agenda, setAgenda] = useState("");
  const [isRecorded, setIsRecorded] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) { toast.error("Title required"); return; }
    if (!roomId) { toast.error("Select a room"); return; }
    if (!date || !time) { toast.error("Set date and time"); return; }

    setCreating(true);
    try {
      const scheduledAt = new Date(`${date}T${time}`).getTime();
      if (scheduledAt < Date.now()) { toast.error("Must be in the future"); setCreating(false); return; }
      await createMeeting({
        title: title.trim(),
        description: description.trim() || undefined,
        roomId: roomId as Id<"rooms">,
        scheduledAt,
        meetingType,
        agenda: agenda.trim() || undefined,
        isRecorded,
      });
      toast.success("Meeting scheduled");
      setOpen(false);
      setTitle(""); setDescription(""); setRoomId(""); setDate(""); setTime(""); setAgenda(""); setIsRecorded(false);
    } catch { toast.error("Failed to schedule"); }
    finally { setCreating(false); }
  };

  const handleCancel = async (id: Id<"meetings">) => {
    try { await cancelMeeting({ id, status: "cancelled" }); toast.success("Cancelled"); }
    catch { toast.error("Failed"); }
  };

  const handleDelete = async (id: Id<"meetings">) => {
    try { await removeMeeting({ id }); toast.success("Deleted"); }
    catch { toast.error("Failed"); }
  };

  const pastMeetings = meetings?.filter((m) => m.status === "ended" || m.status === "cancelled") ?? [];

  return (
    <motion.div className="space-y-8" initial="hidden" animate="visible">
      {/* Header */}
      <motion.div custom={0} variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 royal-heading">
            <Globe className="size-6 text-royal-gold" />
            Diplomatic Connect
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-sans">
            Schedule and manage diplomatic meetings & royal ceremonies
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-royal-navy hover:bg-royal-navy-light text-royal-cream font-sans">
              <Plus className="size-4" />
              Schedule Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 royal-heading">
                <Crown className="size-5 text-royal-gold" />
                Schedule Meeting
              </DialogTitle>
              <DialogDescription className="font-sans">
                Arrange a new diplomatic session or royal ceremony
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label className="font-sans text-xs">Title</Label>
                <Input placeholder="e.g., Annual Diplomatic Summit" value={title} onChange={(e) => setTitle(e.target.value)} className="border-royal-gold/20 focus-visible:ring-royal-gold/30 font-sans" />
              </div>
              <div className="space-y-2">
                <Label className="font-sans text-xs">Description</Label>
                <Textarea placeholder="Brief description..." value={description} onChange={(e) => setDescription(e.target.value)} className="border-royal-gold/20 focus-visible:ring-royal-gold/30 font-sans" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-sans text-xs">Type</Label>
                  <Select value={meetingType} onValueChange={(v) => setMeetingType(v as typeof meetingType)}>
                    <SelectTrigger className="border-royal-gold/20 font-sans"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diplomatic">Diplomatic</SelectItem>
                      <SelectItem value="council">Council</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="ceremony">Ceremony</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-sans text-xs">Room</Label>
                  <Select value={roomId} onValueChange={setRoomId}>
                    <SelectTrigger className="border-royal-gold/20 font-sans"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {rooms?.map((room) => (
                        <SelectItem key={room._id} value={room._id}>{room.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-sans text-xs">Date</Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border-royal-gold/20 font-sans" />
                </div>
                <div className="space-y-2">
                  <Label className="font-sans text-xs">Time</Label>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="border-royal-gold/20 font-sans" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-sans text-xs">Agenda</Label>
                <Textarea placeholder="Meeting agenda items..." value={agenda} onChange={(e) => setAgenda(e.target.value)} className="border-royal-gold/20 focus-visible:ring-royal-gold/30 font-sans" rows={3} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-royal-gold/20 p-3">
                <Label className="text-sm font-sans">Record Meeting</Label>
                <Switch checked={isRecorded} onCheckedChange={setIsRecorded} />
              </div>
              <Button onClick={handleCreate} disabled={creating} className="w-full bg-royal-navy hover:bg-royal-navy-light text-royal-cream font-sans">
                {creating ? "Scheduling..." : "Schedule Meeting"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Tabs */}
      <motion.div custom={1} variants={fadeUp}>
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="bg-muted/60 border border-royal-gold/10">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-card font-sans text-xs">Upcoming</TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-card font-sans text-xs">All Meetings</TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-card font-sans text-xs">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {!upcomingMeetings || upcomingMeetings.length === 0 ? (
              <Card className="border-royal-gold/10">
                <CardContent className="py-16 text-center">
                  <Calendar className="size-12 mx-auto mb-4 text-royal-gold/20" />
                  <h3 className="text-lg font-semibold mb-2 royal-heading">No upcoming meetings</h3>
                  <p className="text-muted-foreground text-sm mb-4 font-sans">Schedule a diplomatic meeting to get started</p>
                  <Button onClick={() => setOpen(true)} className="bg-royal-navy hover:bg-royal-navy-light text-royal-cream font-sans">
                    <Plus className="size-4" /> Schedule Meeting
                  </Button>
                </CardContent>
              </Card>
            ) : (
              upcomingMeetings.map((m) => (
                <MeetingCard key={m._id} meeting={m} onCancel={handleCancel} onDelete={handleDelete} />
              ))
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {!meetings || meetings.length === 0 ? (
              <Card className="border-royal-gold/10">
                <CardContent className="py-16 text-center">
                  <Calendar className="size-12 mx-auto mb-4 text-royal-gold/20" />
                  <h3 className="text-lg font-semibold mb-2 royal-heading">No meetings yet</h3>
                  <p className="text-muted-foreground text-sm font-sans">Your meetings will appear here</p>
                </CardContent>
              </Card>
            ) : (
              meetings.map((m) => (
                <MeetingCard key={m._id} meeting={m} onCancel={handleCancel} onDelete={handleDelete} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastMeetings.length === 0 ? (
              <Card className="border-royal-gold/10">
                <CardContent className="py-16 text-center">
                  <Clock className="size-12 mx-auto mb-4 text-royal-gold/20" />
                  <h3 className="text-lg font-semibold mb-2 royal-heading">No past meetings</h3>
                  <p className="text-muted-foreground text-sm font-sans">Completed meetings will appear here</p>
                </CardContent>
              </Card>
            ) : (
              pastMeetings.map((m) => (
                <MeetingCard key={m._id} meeting={m} onCancel={handleCancel} onDelete={handleDelete} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

function MeetingCard({
  meeting,
  onCancel,
  onDelete,
}: {
  meeting: {
    _id: Id<"meetings">;
    title: string;
    description?: string;
    scheduledAt: number;
    meetingType: "diplomatic" | "council" | "general" | "ceremony";
    status: "scheduled" | "live" | "ended" | "cancelled";
    agenda?: string;
    isRecorded: boolean;
  };
  onCancel: (id: Id<"meetings">) => void;
  onDelete: (id: Id<"meetings">) => void;
}) {
  const typeInfo = meetingTypeLabels[meeting.meetingType];
  const statusColors = {
    scheduled: "bg-royal-gold/10 text-royal-gold-dark border-royal-gold/30",
    live: "bg-red-500/10 text-red-600 border-red-500/30",
    ended: "bg-muted text-muted-foreground border-border",
    cancelled: "bg-destructive/10 text-destructive border-destructive/30",
  };

  return (
    <Card className="border-royal-gold/10 hover:border-royal-gold/25 transition-all overflow-hidden">
      {/* Subtle gradient top */}
      <div className="h-0.5 bg-gradient-to-r from-royal-gold/20 via-royal-gold/10 to-transparent" />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2 font-sans">
              {meeting.title}
              {meeting.status === "live" && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500">
                  <span className="size-2 rounded-full bg-red-500 animate-pulse" />
                  LIVE
                </span>
              )}
            </CardTitle>
            {meeting.description && (
              <CardDescription className="font-sans text-xs">{meeting.description}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className={`text-[10px] font-sans ${typeInfo.color}`}>{typeInfo.label}</Badge>
            <Badge variant="outline" className={`text-[10px] capitalize font-sans ${statusColors[meeting.status]}`}>{meeting.status}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 font-sans">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {formatDate(meeting.scheduledAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {formatTime(meeting.scheduledAt)}
          </span>
          {meeting.isRecorded && (
            <span className="flex items-center gap-1.5 text-royal-gold-dark">
              <Video className="size-3.5" />
              Recording
            </span>
          )}
        </div>
        {meeting.agenda && (
          <div className="rounded-lg bg-muted/50 p-3 mb-4 text-xs">
            <p className="font-medium text-foreground text-[10px] mb-1 uppercase tracking-wider font-sans">Agenda</p>
            <p className="whitespace-pre-line text-muted-foreground font-sans">{meeting.agenda}</p>
          </div>
        )}
        <div className="flex gap-2">
          {meeting.status === "scheduled" && (
            <>
              <Button size="sm" className="bg-royal-navy hover:bg-royal-navy-light text-royal-cream text-xs font-sans">
                <Video className="size-3" /> Start Meeting
              </Button>
              <Button size="sm" variant="outline" className="text-xs border-destructive/20 text-destructive hover:bg-destructive/10 font-sans" onClick={() => onCancel(meeting._id)}>
                Cancel
              </Button>
            </>
          )}
          {(meeting.status === "ended" || meeting.status === "cancelled") && (
            <Button size="sm" variant="outline" className="text-xs border-destructive/20 text-destructive hover:bg-destructive/10 font-sans" onClick={() => onDelete(meeting._id)}>
              <Trash2 className="size-3" /> Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
