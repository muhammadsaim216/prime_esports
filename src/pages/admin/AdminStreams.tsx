import { useState, useEffect } from "react";
import { Plus, Video, Monitor, Loader2, Trash2, ExternalLink, Zap, Image as ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function AdminStreams() {
  const [streams, setStreams] = useState<any[]>([]);
  const [scrims, setScrims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [streamType, setStreamType] = useState<"third-party" | "direct">("third-party");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    thumbnail_url: "", // Added thumbnail state
    scrim_id: "none",
    goLiveNow: true,
  });

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchStreams();
    fetchScrims();
  }, []);

  const fetchStreams = async () => {
    setLoading(true);
    const { data } = await supabase.from("streams").select("*").order("created_at", { ascending: false });
    if (data) setStreams(data);
    setLoading(false);
  };

  const fetchScrims = async () => {
    const { data } = await supabase.from("scrims").select("id, title");
    if (data) setScrims(data);
  };

  const handleCreateStream = async () => {
    if (!user) return;
    setIsSubmitting(true);

    const streamKey = streamType === "direct" ? `PRIME_${Math.random().toString(36).substring(2, 10).toUpperCase()}` : null;

    const { error } = await supabase.from("streams").insert([{
      title: formData.title,
      description: formData.description,
      url: streamType === "third-party" ? formData.url : null,
      thumbnail_url: formData.thumbnail_url, // Added to insert
      stream_key: streamKey,
      status: formData.goLiveNow ? "live" : "scheduled",
      scrim_id: formData.scrim_id === "none" ? null : formData.scrim_id,
      created_by: user.id,
      streamer_name: user.email?.split('@')[0] || "Prime Admin"
    }]);

    if (error) {
      toast({ title: "Creation Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "GO LIVE SUCCESSFUL", description: "Your stream is now active." });
      fetchStreams();
      setDialogOpen(false);
      setFormData({ title: "", description: "", url: "", thumbnail_url: "", scrim_id: "none", goLiveNow: true });
    }
    setIsSubmitting(false);
  };

  const deleteStream = async (id: string) => {
    const { error } = await supabase.from("streams").delete().eq("id", id);
    if (!error) {
      toast({ title: "Stream Terminated", description: "The broadcast has been removed." });
      fetchStreams();
    }
  };

  return (
    <AdminLayout title="BROADCAST CENTER" description="Manage your Prime Esports live feeds">
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.3em]">Active Transmissions: {streams.length}</h2>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#E14B4B] hover:bg-[#c43a3a] text-white h-12 px-8 rounded-xl font-black italic uppercase tracking-tighter shadow-lg shadow-red-500/20 transition-all active:scale-95">
              <Plus className="mr-2 h-5 w-5" /> Start Broadcast
            </Button>
          </DialogTrigger>
          {/* ADDED: max-h and overflow-y-auto to fix the screen cut-off issue */}
          <DialogContent className="rounded-[2.5rem] border-none p-8 max-w-md bg-white shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
            <DialogHeader>
              <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-[#1A1A1A]">New Stream</DialogTitle>
              <DialogDescription className="font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Configure your live feed settings</DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="third-party" onValueChange={(v: any) => setStreamType(v)} className="mt-6">
              <TabsList className="grid grid-cols-2 bg-zinc-100 rounded-2xl p-1 h-12">
                <TabsTrigger value="third-party" className="rounded-xl font-black text-[10px] uppercase data-[state=active]:bg-white data-[state=active]:text-[#E14B4B] transition-all">External Link</TabsTrigger>
                <TabsTrigger value="direct" className="rounded-xl font-black text-[10px] uppercase data-[state=active]:bg-white data-[state=active]:text-[#E14B4B] transition-all">Direct RTMP</TabsTrigger>
              </TabsList>

              <div className="space-y-4 mt-6">
                <div className="space-y-1.5">
                  <Label className="uppercase font-black text-[10px] tracking-widest text-zinc-400 ml-1">Stream Title</Label>
                  <Input className="rounded-xl bg-zinc-50 border-zinc-100 h-12 focus-visible:ring-[#E14B4B] font-bold" placeholder="Enter stream name..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <Label className="uppercase font-black text-[10px] tracking-widest text-zinc-400 ml-1">Description</Label>
                  <Input className="rounded-xl bg-zinc-50 border-zinc-100 h-12 focus-visible:ring-[#E14B4B] font-bold" placeholder="Brief details..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                {/* ADDED: Thumbnail URL Field */}
                <div className="space-y-1.5">
                  <Label className="uppercase font-black text-[10px] tracking-widest text-zinc-400 ml-1">Thumbnail URL (Optional)</Label>
                  <div className="relative">
                    <Input className="rounded-xl bg-zinc-50 border-zinc-100 h-12 focus-visible:ring-[#E14B4B] font-bold pl-10" placeholder="https://image-link.com/..." value={formData.thumbnail_url} onChange={e => setFormData({...formData, thumbnail_url: e.target.value})} />
                    <ImageIcon className="absolute left-3 top-3.5 h-5 w-5 text-zinc-300" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="uppercase font-black text-[10px] tracking-widest text-zinc-400 ml-1">Link to Scrim (Optional)</Label>
                  <Select value={formData.scrim_id} onValueChange={(v) => setFormData({ ...formData, scrim_id: v })}>
                    <SelectTrigger className="h-12 rounded-xl border-zinc-100 bg-zinc-50 font-bold focus:ring-[#E14B4B]">
                      <SelectValue placeholder="Select a scrim" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-zinc-100">
                      <SelectItem value="none" className="font-bold uppercase text-xs">No Scrim Linked</SelectItem>
                      {scrims.map((s) => <SelectItem key={s.id} value={s.id} className="font-bold uppercase text-xs">{s.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {streamType === "third-party" ? (
                  <div className="space-y-1.5">
                    <Label className="uppercase font-black text-[10px] tracking-widest text-zinc-400 ml-1">YouTube/Twitch URL</Label>
                    <Input className="rounded-xl bg-zinc-50 border-zinc-100 h-12 focus-visible:ring-[#E14B4B] font-bold" placeholder="https://..." value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} />
                  </div>
                ) : (
                  <div className="p-6 rounded-[2rem] bg-[#E14B4B]/5 border border-[#E14B4B]/10 text-center">
                    <Zap className="h-8 w-8 text-[#E14B4B] mx-auto mb-2" />
                    <p className="text-xs font-black uppercase italic text-[#E14B4B]">RTMP Mode Active</p>
                    <p className="text-[9px] text-zinc-400 uppercase font-bold mt-1 tracking-wider">A unique stream key will be generated</p>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <span className="text-xs font-black uppercase italic tracking-tight">Go Live Now</span>
                  <Switch checked={formData.goLiveNow} onCheckedChange={c => setFormData({...formData, goLiveNow: c})} className="data-[state=checked]:bg-[#E14B4B]" />
                </div>

                <Button onClick={handleCreateStream} disabled={isSubmitting} className="w-full h-16 bg-[#E14B4B] hover:bg-[#c43a3a] text-white rounded-2xl font-black italic uppercase text-lg shadow-xl shadow-red-500/20 transition-all">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "START BROADCAST"}
                </Button>
              </div>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-[#E14B4B]" /></div>
      ) : (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {streams.map((s) => (
            <Card key={s.id} className="rounded-[2.5rem] border-zinc-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
              <div className="aspect-video bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                {/* Updated: Show thumbnail if available, otherwise show placeholder icon */}
                {s.thumbnail_url ? (
                  <img src={s.thumbnail_url} alt={s.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                ) : (
                  <Video className="h-16 w-16 text-zinc-800 transition-transform group-hover:scale-110 duration-500" />
                )}
                <Badge className="absolute top-6 left-6 bg-[#E14B4B] animate-pulse uppercase font-black italic text-[10px] px-3 py-1 rounded-full shadow-lg">
                  {s.status === 'live' ? 'LIVE' : 'SCHEDULED'}
                </Badge>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black italic uppercase text-2xl tracking-tighter text-[#1A1A1A] leading-none">{s.title}</h3>
                    <p className="text-xs font-bold text-zinc-400 uppercase mt-2 tracking-wide">{s.description || 'No description provided'}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-zinc-300 hover:text-[#E14B4B] hover:bg-red-50 rounded-full transition-colors" onClick={() => deleteStream(s.id)}>
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
                
                {s.stream_key && (
                  <div className="mt-6 p-4 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-1">RTMP Stream Key</p>
                    <div className="flex items-center justify-between">
                      <code className="text-xs font-black text-[#E14B4B] tracking-wider">{s.stream_key}</code>
                      <Zap className="h-3 w-3 text-[#E14B4B]" />
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-zinc-50 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-[#E14B4B]" />
                     <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Server Active</span>
                   </div>
                   <Button variant="link" className="text-[#E14B4B] font-black italic uppercase text-[10px] p-0 h-auto" asChild>
                     <a href={s.url || "#"} target="_blank" rel="noreferrer">Open Preview <ExternalLink className="ml-1 h-3 w-3" /></a>
                   </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}