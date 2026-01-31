import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Video, Radio, ExternalLink, Copy } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";


interface Stream {
  id: string;
  title: string;
  description: string | null;
  stream_type: "direct" | "third_party";
  embed_url: string | null;
  direct_stream_key: string | null;
  scrim_id: string | null;
  is_live: boolean;
  thumbnail_url: string | null;
  created_at: string;
}

interface Scrim {
  id: string;
  title: string;
}

export default function AdminStreams() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [scrims, setScrims] = useState<Scrim[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStream, setEditingStream] = useState<Stream | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stream_type: "third_party" as "direct" | "third_party",
    embed_url: "",
    scrim_id: "",
    is_live: false,
    thumbnail_url: "",
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchStreams();
    fetchScrims();
  }, []);

  const fetchStreams = async () => {
    const { data, error } = await supabase
      .from("streams")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setStreams(data as Stream[]);
    }
    setLoading(false);
  };

  const fetchScrims = async () => {
    const { data, error } = await supabase
      .from("scrims")
      .select("id, title")
      .in("status", ["upcoming", "live"]);

    if (!error && data) {
      setScrims(data);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      stream_type: "third_party",
      embed_url: "",
      scrim_id: "",
      is_live: false,
      thumbnail_url: "",
    });
    setEditingStream(null);
  };

  const openEditDialog = (stream: Stream) => {
    setEditingStream(stream);
    setFormData({
      title: stream.title,
      description: stream.description || "",
      stream_type: stream.stream_type,
      embed_url: stream.embed_url || "",
      scrim_id: stream.scrim_id || "",
      is_live: stream.is_live,
      thumbnail_url: stream.thumbnail_url || "",
    });
    setDialogOpen(true);
  };

  const generateStreamKey = () => {
    return `prime_${crypto.randomUUID()}`;
  };

  const handleSubmit = async () => {
    if (!user) return;

    const streamData: any = {
      title: formData.title,
      description: formData.description || null,
      stream_type: formData.stream_type,
      embed_url: formData.stream_type === "third_party" ? formData.embed_url : null,
      direct_stream_key: formData.stream_type === "direct" && !editingStream?.direct_stream_key ? generateStreamKey() : editingStream?.direct_stream_key,
      scrim_id: formData.scrim_id || null,
      is_live: formData.is_live,
      thumbnail_url: formData.thumbnail_url || null,
      created_by: user.id,
    };

    let error;
    if (editingStream) {
      const { error: updateError } = await supabase
        .from("streams")
        .update(streamData)
        .eq("id", editingStream.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("streams").insert(streamData);
      error = insertError;
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: editingStream ? "Stream updated!" : "Stream created!" });
      fetchStreams();
      setDialogOpen(false);
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("streams").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Stream has been deleted." });
      fetchStreams();
    }
  };

  const toggleLive = async (stream: Stream) => {
    const { error } = await supabase
      .from("streams")
      .update({ is_live: !stream.is_live })
      .eq("id", stream.id);

    if (!error) {
      fetchStreams();
      toast({ title: stream.is_live ? "Stream ended" : "Stream is live!" });
    }
  };

  const copyStreamKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: "Copied!", description: "Stream key copied to clipboard." });
  };

  return (
    <AdminLayout title="Streams Management" description="Manage live streams - third-party or direct">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{streams.length} total streams</Badge>
          <Badge className="bg-red-500 gap-1">
            <Radio className="h-3 w-3 animate-pulse" />
            {streams.filter((s) => s.is_live).length} live
          </Badge>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Stream
            </Button>
          </DialogTrigger>
          {/* FIXED: Added scroll and max-height to prevent parts of the dialog from being missing */}
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStream ? "Edit Stream" : "Add New Stream"}</DialogTitle>
              <DialogDescription>
                Configure your stream settings below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Stream Title</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Weekly Scrim Stream" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Stream details..." />
              </div>

              <div className="space-y-2">
                <Label>Stream Type</Label>
                <Tabs value={formData.stream_type} onValueChange={(v: any) => setFormData({ ...formData, stream_type: v })}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="third_party">Third Party</TabsTrigger>
                    <TabsTrigger value="direct">Direct Stream</TabsTrigger>
                  </TabsList>
                  <TabsContent value="third_party" className="mt-4 space-y-2">
                    <Label htmlFor="embed_url">Embed URL</Label>
                    <Input
                      id="embed_url"
                      value={formData.embed_url}
                      onChange={(e) => setFormData({ ...formData, embed_url: e.target.value })}
                      placeholder="https://www.twitch.tv/embed/channel or YouTube embed URL"
                    />
                    <p className="text-xs text-muted-foreground">
                      Paste the embed URL from Twitch, YouTube, or other streaming platforms.
                    </p>
                  </TabsContent>
                  <TabsContent value="direct" className="mt-4">
                    <div className="rounded-lg border bg-muted/50 p-4 text-center">
                      <Video className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        A unique stream key will be generated for direct streaming.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-2">
                <Label>Link to Scrim (Optional)</Label>
                <Select value={formData.scrim_id} onValueChange={(v) => setFormData({ ...formData, scrim_id: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a scrim..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No scrim</SelectItem>
                    {scrims.map((scrim) => (
                      <SelectItem key={scrim.id} value={scrim.id}>{scrim.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">Thumbnail URL (Optional)</Label>
                <Input id="thumbnail_url" value={formData.thumbnail_url} onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })} placeholder="https://..." />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="is_live">Go Live Now</Label>
                  <p className="text-sm text-muted-foreground">Mark stream as live immediately</p>
                </div>
                <Switch id="is_live" checked={formData.is_live} onCheckedChange={(c) => setFormData({ ...formData, is_live: c })} />
              </div>

              <Button onClick={handleSubmit} className="w-full">
                {editingStream ? "Update Stream" : "Create Stream"}
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
      ) : streams.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No streams yet. Add your first stream!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {streams.map((stream) => (
            <Card key={stream.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {stream.is_live && (
                      <Badge className="bg-red-500 gap-1">
                        <Radio className="h-3 w-3 animate-pulse" /> LIVE
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {stream.stream_type === "third_party" ? "Third Party" : "Direct"}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(stream)}>
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
                          <AlertDialogTitle>Delete Stream?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{stream.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(stream.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <CardTitle className="text-lg mt-2">{stream.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{stream.description}</p>
                
                {stream.stream_type === "direct" && stream.direct_stream_key && (
                  <div className="rounded-lg border bg-muted/50 p-3">
                    <Label className="text-xs">Stream Key</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs bg-background px-2 py-1 rounded flex-1 truncate">
                        {stream.direct_stream_key}
                      </code>
                      <Button variant="ghost" size="icon" onClick={() => copyStreamKey(stream.direct_stream_key!)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {stream.embed_url && (
                  <Button variant="outline" size="sm" className="gap-1" asChild>
                    <a href={stream.embed_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" /> View Stream
                    </a>
                  </Button>
                )}

                <Button
                  variant={stream.is_live ? "destructive" : "default"}
                  className="w-full"
                  onClick={() => toggleLive(stream)}
                >
                  {stream.is_live ? "End Stream" : "Go Live"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}