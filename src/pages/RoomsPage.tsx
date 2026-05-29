import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Copy,
  Crown,
  Globe,
  Lock,
  Plus,
  Trash2,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
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
import { api } from "../../convex/_generated/api";

const roomTypeIcons = {
  diplomatic: Globe,
  council: Crown,
  public: Users,
  private: Lock,
};

const roomTypeColors = {
  diplomatic: "border-royal-gold/30 text-royal-gold-dark bg-royal-gold/5",
  council: "border-royal-burgundy/30 text-royal-burgundy bg-royal-burgundy/5",
  public: "border-royal-emerald/30 text-royal-emerald bg-royal-emerald/5",
  private: "border-royal-navy/30 text-royal-navy bg-royal-navy/5",
};

const roomGradients = {
  diplomatic: "from-royal-gold/10 to-transparent",
  council: "from-royal-burgundy/10 to-transparent",
  public: "from-royal-emerald/10 to-transparent",
  private: "from-royal-navy/10 to-transparent",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function RoomsPage() {
  const rooms = useQuery(api.rooms.list);
  const createRoom = useMutation(api.rooms.create);
  const removeRoom = useMutation(api.rooms.remove);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"diplomatic" | "council" | "public" | "private">("public");
  const [maxParticipants, setMaxParticipants] = useState("20");
  const [hasRecording, setHasRecording] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Room name is required");
      return;
    }
    setCreating(true);
    try {
      await createRoom({
        name: name.trim(),
        description: description.trim() || undefined,
        type,
        maxParticipants: Number.parseInt(maxParticipants) || 20,
        hasRecording,
      });
      toast.success("Room created successfully");
      setOpen(false);
      setName("");
      setDescription("");
      setType("public");
      setMaxParticipants("20");
      setHasRecording(false);
    } catch {
      toast.error("Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (roomId: typeof rooms extends (infer T)[] | undefined ? T extends { _id: infer I } ? I : never : never) => {
    try {
      await removeRoom({ id: roomId });
      toast.success("Room deleted");
    } catch {
      toast.error("Failed to delete room");
    }
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/meeting/${slug}`);
    toast.success("Meeting link copied");
  };

  return (
    <motion.div className="space-y-8" initial="hidden" animate="visible">
      {/* Header */}
      <motion.div custom={0} variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 royal-heading">
            <Video className="size-6 text-royal-gold" />
            Meeting Rooms
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-sans">
            Create and manage your royal meeting rooms
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-royal-navy hover:bg-royal-navy-light text-royal-cream font-sans">
              <Plus className="size-4" />
              Create Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 royal-heading">
                <Crown className="size-5 text-royal-gold" />
                Create Meeting Room
              </DialogTitle>
              <DialogDescription className="font-sans">
                Set up a new room for diplomatic meetings
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="font-sans text-xs">Room Name</Label>
                <Input
                  placeholder="e.g., Royal Council Chamber"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-royal-gold/20 focus-visible:ring-royal-gold/30 font-sans"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-sans text-xs">Description</Label>
                <Textarea
                  placeholder="Describe the purpose of this room..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-royal-gold/20 focus-visible:ring-royal-gold/30 font-sans"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-sans text-xs">Room Type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                    <SelectTrigger className="border-royal-gold/20 font-sans">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diplomatic">Diplomatic</SelectItem>
                      <SelectItem value="council">Council</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-sans text-xs">Max Participants</Label>
                  <Input
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    className="border-royal-gold/20 font-sans"
                    min="2"
                    max="100"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-royal-gold/20 p-3">
                <Label className="text-sm font-sans">Enable Recording</Label>
                <Switch
                  checked={hasRecording}
                  onCheckedChange={setHasRecording}
                />
              </div>
              <Button
                onClick={handleCreate}
                disabled={creating}
                className="w-full bg-royal-navy hover:bg-royal-navy-light text-royal-cream font-sans"
              >
                {creating ? "Creating..." : "Create Room"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Rooms Grid */}
      {!rooms || rooms.length === 0 ? (
        <motion.div custom={1} variants={fadeUp}>
          <Card className="border-royal-gold/10">
            <CardContent className="py-16 text-center">
              <Video className="size-12 mx-auto mb-4 text-royal-gold/20" />
              <h3 className="text-lg font-semibold mb-2 royal-heading">No rooms yet</h3>
              <p className="text-muted-foreground text-sm mb-4 font-sans">
                Create your first meeting room to start connecting
              </p>
              <Button
                onClick={() => setOpen(true)}
                className="bg-royal-navy hover:bg-royal-navy-light text-royal-cream font-sans"
              >
                <Plus className="size-4" />
                Create Your First Room
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room, i) => {
            const Icon = roomTypeIcons[room.type];
            const gradient = roomGradients[room.type];
            return (
              <motion.div key={room._id} custom={i + 1} variants={fadeUp}>
                <Card className="border-royal-gold/10 hover:border-royal-gold/25 transition-all group overflow-hidden">
                  {/* Gradient top edge */}
                  <div className={`h-1 bg-gradient-to-r ${gradient}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="size-9 rounded-lg bg-gradient-to-br from-royal-gold/15 to-royal-gold/5 flex items-center justify-center">
                          <Icon className="size-4 text-royal-gold" />
                        </div>
                        <CardTitle className="text-base font-sans">{room.name}</CardTitle>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] capitalize font-sans ${roomTypeColors[room.type]}`}
                      >
                        {room.type}
                      </Badge>
                    </div>
                    {room.description && (
                      <CardDescription className="mt-2 text-xs line-clamp-2 font-sans">
                        {room.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 font-sans">
                      <span className="flex items-center gap-1">
                        <Users className="size-3" />
                        Max {room.maxParticipants}
                      </span>
                      {room.hasRecording && (
                        <span className="flex items-center gap-1 text-royal-gold-dark">
                          ● Recording
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-royal-navy hover:bg-royal-navy-light text-royal-cream text-xs font-sans"
                        asChild
                      >
                        <Link to={`/meeting/${room.slug}`}>
                          Join Room
                          <ArrowRight className="size-3" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-royal-gold/20 hover:bg-royal-gold/10"
                        onClick={() => copyLink(room.slug)}
                      >
                        <Copy className="size-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive/20 hover:bg-destructive/10 text-destructive"
                        onClick={() => handleDelete(room._id)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
