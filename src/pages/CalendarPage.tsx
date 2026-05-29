import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Crown,
  Plus,
  Video,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const meetingTypeColors: Record<string, string> = {
  diplomatic: "bg-royal-gold/20 text-royal-gold border-royal-gold/30",
  council: "bg-royal-burgundy/20 text-royal-burgundy border-royal-burgundy/30",
  general: "bg-royal-emerald/20 text-royal-emerald border-royal-emerald/30",
  ceremony: "bg-royal-navy-light/60 text-royal-cream border-royal-cream/20",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function CalendarPage() {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(now.getDate());

  const meetings = useQuery(api.meetings.list);
  const rooms = useQuery(api.rooms.listActive);
  const createMeeting = useMutation(api.meetings.create);

  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roomId, setRoomId] = useState("");
  const [meetingType, setMeetingType] = useState<"diplomatic" | "council" | "general" | "ceremony">("diplomatic");
  const [time, setTime] = useState("10:00");
  const [agenda, setAgenda] = useState("");
  const [isRecorded, setIsRecorded] = useState(false);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const today = new Date();

  // Group meetings by day
  const meetingsByDay: Record<number, typeof meetings> = {};
  if (meetings) {
    for (const m of meetings) {
      const d = new Date(m.scheduledAt);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const day = d.getDate();
        if (!meetingsByDay[day]) meetingsByDay[day] = [];
        meetingsByDay[day]!.push(m);
      }
    }
  }

  const selectedDateMeetings = selectedDate ? meetingsByDay[selectedDate] ?? [] : [];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!roomId) {
      toast.error("Select a room");
      return;
    }
    if (!selectedDate) {
      toast.error("Select a date on the calendar");
      return;
    }

    setCreating(true);
    try {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
      const scheduledAt = new Date(`${dateStr}T${time}`).getTime();
      if (scheduledAt < Date.now()) {
        toast.error("Meeting time must be in the future");
        setCreating(false);
        return;
      }
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
      setTitle("");
      setDescription("");
      setRoomId("");
      setTime("10:00");
      setAgenda("");
      setIsRecorded(false);
    } catch {
      toast.error("Failed to schedule meeting");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial="hidden"
        animate="visible"
      >
        <motion.div custom={0} variants={fadeUp}>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 royal-heading">
            <CalendarIcon className="size-6 text-royal-gold" />
            Royal Calendar
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-sans">
            Schedule and manage your royal engagements
          </p>
        </motion.div>
        <motion.div custom={1} variants={fadeUp}>
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
                  {selectedDate
                    ? `For ${MONTHS[currentMonth]} ${selectedDate}, ${currentYear}`
                    : "Select a date on the calendar first"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-2 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label className="font-sans text-xs">Title</Label>
                  <Input
                    placeholder="e.g., Annual Diplomatic Summit"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-royal-gold/20 focus-visible:ring-royal-gold/30 font-sans"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-sans text-xs">Description</Label>
                  <Textarea
                    placeholder="Brief description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border-royal-gold/20 focus-visible:ring-royal-gold/30 font-sans"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-sans text-xs">Type</Label>
                    <Select value={meetingType} onValueChange={(v) => setMeetingType(v as typeof meetingType)}>
                      <SelectTrigger className="border-royal-gold/20 font-sans">
                        <SelectValue />
                      </SelectTrigger>
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
                      <SelectTrigger className="border-royal-gold/20 font-sans">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {rooms?.map((room) => (
                          <SelectItem key={room._id} value={room._id}>{room.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-sans text-xs">Time</Label>
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="border-royal-gold/20 font-sans"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-sans text-xs">Agenda</Label>
                  <Textarea
                    placeholder="Meeting agenda items..."
                    value={agenda}
                    onChange={(e) => setAgenda(e.target.value)}
                    className="border-royal-gold/20 focus-visible:ring-royal-gold/30 font-sans"
                    rows={3}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-royal-gold/20 p-3">
                  <Label className="text-sm font-sans">Record Meeting</Label>
                  <Switch checked={isRecorded} onCheckedChange={setIsRecorded} />
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={creating || !selectedDate}
                  className="w-full bg-royal-navy hover:bg-royal-navy-light text-royal-cream font-sans"
                >
                  {creating ? "Scheduling..." : "Schedule Meeting"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </motion.div>

      {/* Calendar & sidebar */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        {/* Calendar grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-royal-gold/10 overflow-hidden">
            {/* Month navigation */}
            <CardHeader className="bg-gradient-to-r from-royal-navy to-royal-navy-light text-royal-cream pb-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-royal-cream/60 hover:text-royal-cream hover:bg-white/10"
                  onClick={prevMonth}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <CardTitle className="text-xl royal-heading gold-text">
                  {MONTHS[currentMonth]} {currentYear}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-royal-cream/60 hover:text-royal-cream hover:bg-white/10"
                  onClick={nextMonth}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-royal-gold/10">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider font-sans"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7">
                {/* Empty cells before first day */}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-24 border-b border-r border-royal-gold/5 bg-muted/30" />
                ))}

                {/* Day cells */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isToday =
                    day === today.getDate() &&
                    currentMonth === today.getMonth() &&
                    currentYear === today.getFullYear();
                  const isSelected = day === selectedDate;
                  const dayMeetings = meetingsByDay[day] ?? [];

                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => setSelectedDate(day)}
                      className={`h-24 border-b border-r border-royal-gold/5 p-1.5 text-left transition-colors hover:bg-royal-gold/5 ${
                        isSelected ? "bg-royal-gold/10 ring-1 ring-inset ring-royal-gold/30" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span
                          className={`inline-flex items-center justify-center size-7 rounded-full text-sm font-sans ${
                            isToday
                              ? "bg-royal-gold text-royal-navy font-bold"
                              : isSelected
                                ? "text-royal-gold font-semibold"
                                : "text-foreground/70"
                          }`}
                        >
                          {day}
                        </span>
                        {dayMeetings.length > 0 && (
                          <span className="size-2 rounded-full bg-royal-gold/60 mt-2" />
                        )}
                      </div>
                      <div className="mt-1 space-y-0.5 overflow-hidden">
                        {dayMeetings.slice(0, 2).map((m) => (
                          <div
                            key={m._id}
                            className={`text-[10px] px-1.5 py-0.5 rounded truncate font-sans border ${
                              meetingTypeColors[m.meetingType] ?? "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            {m.title}
                          </div>
                        ))}
                        {dayMeetings.length > 2 && (
                          <div className="text-[10px] text-muted-foreground font-sans px-1">
                            +{dayMeetings.length - 2} more
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar — selected date details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <Card className="border-royal-gold/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base royal-heading flex items-center gap-2">
                <Clock className="size-4 text-royal-gold" />
                {selectedDate
                  ? `${MONTHS[currentMonth]} ${selectedDate}`
                  : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate && selectedDateMeetings.length === 0 && (
                <div className="text-center py-8">
                  <CalendarIcon className="size-10 mx-auto mb-3 text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground font-sans">No meetings scheduled</p>
                  <Button
                    size="sm"
                    variant="link"
                    className="text-royal-gold mt-1 font-sans"
                    onClick={() => setOpen(true)}
                  >
                    Schedule one
                  </Button>
                </div>
              )}
              {!selectedDate && (
                <div className="text-center py-8">
                  <CalendarIcon className="size-10 mx-auto mb-3 text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground font-sans">
                    Click a day to see meetings
                  </p>
                </div>
              )}
              {selectedDateMeetings.length > 0 && (
                <div className="space-y-3">
                  {selectedDateMeetings.map((m) => (
                    <div
                      key={m._id}
                      className="p-3 rounded-lg border border-royal-gold/10 bg-muted/30 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm font-sans">{m.title}</h4>
                        <Badge
                          variant="outline"
                          className={`text-[10px] capitalize shrink-0 ${
                            meetingTypeColors[m.meetingType] ?? ""
                          }`}
                        >
                          {m.meetingType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground font-sans">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {formatTime(m.scheduledAt)}
                        </span>
                        {m.isRecorded && (
                          <span className="flex items-center gap-1 text-royal-gold-dark">
                            <Video className="size-3" />
                            Rec
                          </span>
                        )}
                      </div>
                      {m.description && (
                        <p className="text-xs text-muted-foreground font-sans line-clamp-2">
                          {m.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick stats */}
          <Card className="border-royal-gold/10 bg-gradient-to-br from-royal-navy to-royal-navy-light text-royal-cream">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-royal-gold/10 flex items-center justify-center">
                  <Crown className="size-4 text-royal-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold royal-heading">{meetings?.length ?? 0}</p>
                  <p className="text-xs text-royal-cream/40 font-sans">Total Meetings</p>
                </div>
              </div>
              <div className="gold-line" />
              <p className="text-xs text-royal-cream/30 font-sans italic">
                Omnividens, Omnipotens, Omniaeternus
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
