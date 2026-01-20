import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Calendar, Clock, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Scrim {
  id: string;
  title: string;
  description: string | null;
  game: string;
  scheduled_at: string;
  is_paid: boolean;
  price: number | null;
  max_players: number;
  status: "upcoming" | "live" | "completed" | "cancelled";
  created_at: string;
}

const games = ["Valorant", "CS2", "League of Legends", "Overwatch 2", "Apex Legends", "Fortnite", "Rocket League"];
const statuses = ["upcoming", "live", "completed", "cancelled"];

export default function AdminScrims() {
  const [scrims, setScrims] = useState<Scrim[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingScrim, setEditingScrim] = useState<Scrim | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    game: string;
    scheduled_at: string;
    is_paid: boolean;
    price: number;
    max_players: number;
    status: "upcoming" | "live" | "completed" | "cancelled";
  }>({
    title: "",
    description: "",
    game: "Valorant",
    scheduled_at: "",
    is_paid: false,
    price: 0,
    max_players: 10,
    status: "upcoming",
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchScrims();
  }, []);

  const fetchScrims = async () => {
    const { data, error } = await supabase
      .from("scrims")
      .select("*")
      .order("scheduled_at", { ascending: false });

    if (!error && data) {
      setScrims(data as Scrim[]);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      game: "Valorant",
      scheduled_at: "",
      is_paid: false,
      price: 0,
      max_players: 10,
      status: "upcoming",
    });
    setEditingScrim(null);
  };

  const openEditDialog = (scrim: Scrim) => {
    setEditingScrim(scrim);
    setFormData({
      title: scrim.title,
      description: scrim.description || "",
      game: scrim.game,
      scheduled_at: scrim.scheduled_at.slice(0, 16),
      is_paid: scrim.is_paid,
      price: scrim.price || 0,
      max_players: scrim.max_players,
      status: scrim.status as "upcoming" | "live" | "completed" | "cancelled",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!user) return;

    const scrimData = {
      ...formData,
      price: formData.is_paid ? formData.price : 0,
      created_by: user.id,
    };

    let error;
    if (editingScrim) {
      const { error: updateError } = await supabase
        .from("scrims")
        .update(scrimData)
        .eq("id", editingScrim.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("scrims").insert(scrimData);
      error = insertError;
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: editingScrim ? "Scrim updated!" : "Scrim created!" });
      fetchScrims();
      setDialogOpen(false);
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("scrims").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Scrim has been deleted." });
      fetchScrims();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-green-500";
      case "upcoming": return "bg-blue-500";
      case "completed": return "bg-muted";
      case "cancelled": return "bg-red-500";
      default: return "bg-muted";
    }
  };

  return (
    <AdminLayout title="Scrims Management" description="Create and manage competitive scrimmages">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Badge variant="secondary">{scrims.length} total scrims</Badge>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Create Scrim
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingScrim ? "Edit Scrim" : "Create New Scrim"}</DialogTitle>
              <DialogDescription>
                {editingScrim ? "Update the scrim details below." : "Fill in the details for your new scrim."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Weekly Valorant Scrim" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Details about the scrim..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Game</Label>
                  <Select value={formData.game} onValueChange={(v) => setFormData({ ...formData, game: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {games.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduled_at">Scheduled Date & Time</Label>
                <Input id="scheduled_at" type="datetime-local" value={formData.scheduled_at} onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_players">Max Players</Label>
                <Input id="max_players" type="number" min={2} value={formData.max_players} onChange={(e) => setFormData({ ...formData, max_players: parseInt(e.target.value) })} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="is_paid">Paid Entry</Label>
                  <p className="text-sm text-muted-foreground">Charge players to join</p>
                </div>
                <Switch id="is_paid" checked={formData.is_paid} onCheckedChange={(c) => setFormData({ ...formData, is_paid: c })} />
              </div>
              {formData.is_paid && (
                <div className="space-y-2">
                  <Label htmlFor="price">Entry Price ($)</Label>
                  <Input id="price" type="number" min={0} step={0.01} value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} />
                </div>
              )}
              <Button onClick={handleSubmit} className="w-full">
                {editingScrim ? "Update Scrim" : "Create Scrim"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-48" />
            </Card>
          ))}
        </div>
      ) : scrims.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No scrims created yet. Create your first one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {scrims.map((scrim) => (
            <Card key={scrim.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <Badge className={getStatusColor(scrim.status)}>{scrim.status}</Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(scrim)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Scrim?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{scrim.title}" and all associated applications.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(scrim.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <CardTitle className="text-lg">{scrim.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{scrim.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(scrim.scheduled_at), "MMM d, yyyy")}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {format(new Date(scrim.scheduled_at), "h:mm a")}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    Max {scrim.max_players}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    {scrim.is_paid ? `$${scrim.price}` : "Free"}
                  </div>
                </div>
                <Badge variant="outline">{scrim.game}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
