import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Calendar, Clock, Users, DollarSign, Layers, Loader2 } from "lucide-react";
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
  team_format: string;
  scheduled_at: string;
  is_paid: boolean;
  price: number | null;
  max_players: number;
  status: "upcoming" | "live" | "completed" | "cancelled";
  created_at: string;
}

const GAME_FORMAT_OPTIONS: Record<string, string[]> = {
  "PUBG": ["Solo", "Duo", "Squad"],
  "PUBG Mobile": ["Solo", "Duo", "Squad"],
  "Free Fire": ["Solo", "Duo", "Squad"],
  "Valorant": ["5v5", "1v1"],
  "CS2": ["5v5", "2v2", "1v1"],
  "Apex Legends": ["Solo", "Duo", "Trio"],
  "Fortnite": ["Solo", "Duo", "Trio", "Squad"],
  "Default": ["Solo", "Duo", "Trio", "Squad", "5v5"]
};

const statuses = ["upcoming", "live", "completed", "cancelled"];

export default function AdminScrims() {
  const [scrims, setScrims] = useState<Scrim[]>([]);
  const [availableGames, setAvailableGames] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingScrim, setEditingScrim] = useState<Scrim | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    game: "",
    team_format: "Squad",
    scheduled_at: "",
    is_paid: false,
    price: 0,
    max_players: 10,
    status: "upcoming" as const,
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchScrims();
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const { data } = await supabase.from("games").select("name").order("name");
    if (data) {
      setAvailableGames(data);
      if (data.length > 0 && !formData.game) {
        setFormData(prev => ({ 
          ...prev, 
          game: data[0].name,
          team_format: GAME_FORMAT_OPTIONS[data[0].name]?.[0] || "Squad"
        }));
      }
    }
  };

  const fetchScrims = async () => {
    setLoading(true);
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
    const defaultGame = availableGames[0]?.name || "";
    setFormData({
      title: "",
      description: "",
      game: defaultGame,
      team_format: GAME_FORMAT_OPTIONS[defaultGame]?.[0] || "Squad",
      scheduled_at: "",
      is_paid: false,
      price: 0,
      max_players: 10,
      status: "upcoming",
    });
    setEditingScrim(null);
  };

  const handleGameChange = (gameName: string) => {
    const availableFormats = GAME_FORMAT_OPTIONS[gameName] || GAME_FORMAT_OPTIONS["Default"];
    setFormData({ 
      ...formData, 
      game: gameName, 
      team_format: availableFormats[0] 
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to save scrims.", variant: "destructive" });
      return;
    }

    if (!formData.title || !formData.scheduled_at) {
      toast({ title: "Required Fields", description: "Please fill in title and schedule date.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    // Construct the payload exactly as the database expects
    const scrimData = {
      title: formData.title,
      description: formData.description,
      game: formData.game,
      team_format: formData.team_format,
      scheduled_at: formData.scheduled_at,
      is_paid: formData.is_paid,
      price: formData.is_paid ? Number(formData.price) : 0,
      max_players: Number(formData.max_players),
      status: formData.status,
      created_by: user.id,
    };

    let result;
    if (editingScrim) {
      result = await supabase
        .from("scrims")
        .update(scrimData)
        .eq("id", editingScrim.id);
    } else {
      result = await supabase.from("scrims").insert(scrimData);
    }

    if (result.error) {
      toast({ title: "Update Failed", description: result.error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: editingScrim ? "Scrim updated successfully!" : "New scrim created!" });
      fetchScrims();
      setDialogOpen(false);
      resetForm();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("scrims").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Scrim removed from listing." });
      fetchScrims();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-green-600";
      case "upcoming": return "bg-[#E14B4B]"; // Logo Red for upcoming
      case "completed": return "bg-zinc-500";
      case "cancelled": return "bg-red-700";
      default: return "bg-zinc-500";
    }
  };

  return (
    <AdminLayout title="SCRIMS MANAGEMENT" description="Create and manage your competitive event listings">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Badge variant="outline" className="px-3 py-1 rounded-lg border-zinc-200">
            {scrims.length} total scrims
          </Badge>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-[#E14B4B] hover:bg-[#c43a3a] text-white gap-2 h-11 px-6 rounded-xl font-bold uppercase transition-all">
              <Plus className="h-5 w-5" /> Create Scrim
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md w-[95vw] max-h-[90vh] overflow-y-auto rounded-[32px] p-8">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-black italic uppercase">
                {editingScrim ? "Edit Scrim" : "New Scrim"}
              </DialogTitle>
              <DialogDescription>Enter the event details below to update the listing.</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Title</Label>
                <Input className="h-12 rounded-xl" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Tournament Title" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Game</Label>
                  <Select value={formData.game} onValueChange={handleGameChange}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {availableGames.map((g) => <SelectItem key={g.name} value={g.name}>{g.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Format</Label>
                  <Select value={formData.team_format} onValueChange={(v) => setFormData({ ...formData, team_format: v })}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(GAME_FORMAT_OPTIONS[formData.game] || GAME_FORMAT_OPTIONS["Default"]).map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Scheduled At</Label>
                <Input type="datetime-local" className="h-12 rounded-xl" value={formData.scheduled_at} onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Status</Label>
                  <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => <SelectItem key={s} value={s} className="uppercase font-bold">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Max Slots</Label>
                  <Input type="number" className="h-12 rounded-xl" value={formData.max_players} onChange={(e) => setFormData({ ...formData, max_players: parseInt(e.target.value) })} />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border p-4 bg-zinc-50/50">
                <div className="space-y-0.5">
                  <Label className="font-bold uppercase text-[11px]">Paid Entry</Label>
                  <p className="text-[10px] text-muted-foreground uppercase">Enable entry fees</p>
                </div>
                <Switch checked={formData.is_paid} onCheckedChange={(c) => setFormData({ ...formData, is_paid: c })} />
              </div>

              {formData.is_paid && (
                <div className="space-y-2">
                  <Label className="font-bold uppercase text-[11px] tracking-widest text-muted-foreground">Entry Fee (PKR)</Label>
                  <Input type="number" className="h-12 rounded-xl" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} />
                </div>
              )}

              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="w-full h-14 bg-[#E14B4B] hover:bg-[#c43a3a] text-white rounded-2xl font-black uppercase italic tracking-wider transition-all"
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : editingScrim ? "Update Scrim" : "Create Scrim"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-[#E14B4B]" /></div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {scrims.map((scrim) => (
            <Card key={scrim.id} className="rounded-3xl border-zinc-100 shadow-sm overflow-hidden transition-all hover:border-[#E14B4B]/30">
              <CardHeader className="pb-3 border-b border-zinc-50 bg-zinc-50/30">
                <div className="flex items-center justify-between">
                  <Badge className={`${getStatusColor(scrim.status)} text-white font-black uppercase text-[10px] px-3 h-6 italic`}>
                    {scrim.status}
                  </Badge>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-white shadow-sm" onClick={() => {
                      setEditingScrim(scrim);
                      setFormData({
                        title: scrim.title,
                        description: scrim.description || "",
                        game: scrim.game,
                        team_format: scrim.team_format || "Squad",
                        scheduled_at: scrim.scheduled_at.slice(0, 16),
                        is_paid: scrim.is_paid,
                        price: scrim.price || 0,
                        max_players: scrim.max_players,
                        status: scrim.status as any,
                      });
                      setDialogOpen(true);
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-3xl p-8 max-w-sm">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="uppercase font-black italic">Delete Event?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone. This scrim will be removed forever.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col gap-2">
                          <AlertDialogCancel className="rounded-xl border-none bg-zinc-100 uppercase font-bold h-12">Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 rounded-xl uppercase font-bold h-12" onClick={() => handleDelete(scrim.id)}>Delete Now</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <CardTitle className="text-xl font-black uppercase italic tracking-tight mt-3">{scrim.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-zinc-600">
                    <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center"><Calendar className="h-4 w-4 text-[#E14B4B]" /></div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-zinc-400">Date</p>
                      <p className="text-xs font-bold">{format(new Date(scrim.scheduled_at), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-600">
                    <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center"><Clock className="h-4 w-4 text-[#E14B4B]" /></div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-zinc-400">Time</p>
                      <p className="text-xs font-bold">{format(new Date(scrim.scheduled_at), "h:mm a")}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-zinc-600">
                    <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center"><Users className="h-4 w-4 text-[#E14B4B]" /></div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-zinc-400">Slots</p>
                      <p className="text-xs font-bold">{scrim.max_players} Max</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-600">
                    <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center"><DollarSign className="h-4 w-4 text-[#E14B4B]" /></div>
                    <div>
                      <p className="text-[9px] uppercase font-bold text-zinc-400">Entry</p>
                      <p className="text-xs font-bold text-green-600">{scrim.is_paid ? `PKR ${scrim.price}` : "FREE"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 border-none px-3 uppercase text-[9px] font-bold tracking-widest">{scrim.game}</Badge>
                  <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 border-none px-3 uppercase text-[9px] font-bold tracking-widest">{scrim.team_format}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}