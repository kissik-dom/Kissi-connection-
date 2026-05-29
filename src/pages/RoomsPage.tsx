import { useMutation, useQuery } from "convex/react";
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
    toast.success("Meeting link copied to clipboard");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Video className="size-6 text-royal-gold" />
            Meeting Rooms
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your royal meeting rooms
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-royal-navy hover:bg-royal-navy-light text-royal-cream">
              <Plus className="size-4" />
              Create Room
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Crown className="size-5 text-royal-gold" />
                Create Meeting Room
              </DialogTitle>
              <DialogDescription>
                Set up a new room for your diplomatic meetings
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Royal Council Chamber"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-royal-gold/20 focus-visible:ring-royal-gold/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose of this room..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-royal-gold/20 focus-visible:ring-royal-gold/30"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Room Type</Label>
                  <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                    <SelectTrigger className="border-royal-gold/20">
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
                  <Label htmlFor="max">Max Participants</Label>
                  <Input
                    id="max"
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    className="border-royal-gold/20"
                    min="2"
                    max="100"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-royal-gold/20 p-3">
                <Label htmlFor="recording" className="text-sm">
                  Enable Recording
                </Label>
                <Switch
                  id="recording"
                  checked={hasRecording}
                  onCheckedChange={setHasRecording}
                />
              </div>
              <Button
                onClick={handleCreate}
                disabled={creating}
                className="w-full bg-royal-navy hover:bg-royal-navy-light text-royal-cream"
              >
                {creating ? "Creating..." : "Create Room"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rooms Grid */}
      {!rooms || rooms.length === 0 ? (
        <Card className="border-royal-gold/10">
          <CardContent className="py-16 text-center">
            <Video className="size-12 mx-auto mb-4 text-royal-gold/30" />
            <h3 className="text-lg font-semibold mb-2">No rooms yet</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Create your first meeting room to start connecting
            </p>
            <Button
              onClick={() => setOpen(true)}
              className="bg-royal-navy hover:bg-royal-navy-light text-royal-cream"
            >
              <Plus className="size-4" />
              Create Your First Room
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => {
            const Icon = roomTypeIcons[room.type];
            return (
              <Card
                key={room._id}
                className="border-royal-gold/10 hover:border-royal-gold/25 transition-all group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-9 rounded-lg bg-royal-gold/10 flex items-center justify-center">
                        <Icon className="size-4 text-royal-gold" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{room.name}</CardTitle>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs capitalize ${roomTypeColors[room.type]}`}
                    >
                      {room.type}
                    </Badge>
                  </div>
                  {room.description && (
                    <CardDescription className="mt-2 text-xs line-clamp-2">
                      {room.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
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
                      className="flex-1 bg-royal-navy hover:bg-royal-navy-light text-royal-cream text-xs"
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
            );
          })}
        </div>
      )}
    </div>
  );
}
