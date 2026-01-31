import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, Clock, Users,Gamepad2, Video, Radio, ExternalLink, Banknote } from "lucide-react";
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

interface Stream {
  id: string;
  title: string;
  description: string | null;
  stream_type: "direct" | "third_party";
  embed_url: string | null;
  is_live: boolean;
  thumbnail_url: string | null;
  scrim_id: string | null;
}

export default function Scrims() {
  const [scrims, setScrims] = useState<Scrim[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScrim, setSelectedScrim] = useState<Scrim | null>(null);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [applying, setApplying] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchScrims();
    fetchStreams();
  }, []);

  const fetchScrims = async () => {
    const { data, error } = await supabase
      .from("scrims")
      .select("*")
      .in("status", ["upcoming", "live"])
      .order("scheduled_at", { ascending: true });

    if (!error && data) {
      setScrims(data as Scrim[]);
    }
    setLoading(false);
  };

  const fetchStreams = async () => {
    // Use public view to avoid exposing sensitive stream keys
    const { data, error } = await supabase
      .from("streams_public")
      .select("*")
      .eq("is_live", true)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setStreams(data as Stream[]);
    }
  };

  const handleApply = async () => {
    if (!user || !selectedScrim) return;

    setApplying(true);
    const { error } = await supabase.from("scrim_applications").insert({
      scrim_id: selectedScrim.id,
      user_id: user.id,
      message: applicationMessage,
    });

    if (error) {
      toast({ title: "Application failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Application submitted!", description: "We'll review your application soon." });
      setSelectedScrim(null);
      setApplicationMessage("");
    }
    setApplying(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-green-500";
      case "upcoming": return "bg-blue-500";
      default: return "bg-muted";
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/20 to-background py-20">
        <div className="container text-center">
          <Badge variant="outline" className="mb-4">COMPETE & WATCH</Badge>
          <h1 className="font-display text-4xl font-bold md:text-5xl">
            SCRIMS & <span className="text-primary">STREAMS</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Join competitive scrimmages, watch live streams, and prove your skills against the best.
          </p>
        </div>
      </section>

      <section className="container py-12">
        <Tabs defaultValue="scrims" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="scrims" className="gap-2">
              <Gamepad2 className="h-4 w-4" /> Scrims
            </TabsTrigger>
            <TabsTrigger value="streams" className="gap-2">
              <Video className="h-4 w-4" /> Live Streams
            </TabsTrigger>
          </TabsList>

          {/* Scrims Tab */}
          <TabsContent value="scrims" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">Available Scrims</h2>
              <Badge variant="secondary">{scrims.length} active</Badge>
            </div>

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="h-48" />
                  </Card>
                ))}
              </div>
            ) : scrims.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Gamepad2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg">No Active Scrims</h3>
                  <p className="text-muted-foreground">Check back later for upcoming scrimmages.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {scrims.map((scrim) => (
                  <Card key={scrim.id} className="group hover:border-primary transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Badge className={getStatusColor(scrim.status)}>
                          {scrim.status === "live" && <Radio className="h-3 w-3 mr-1 animate-pulse" />}
                          {scrim.status}
                        </Badge>
                        {scrim.is_paid ? (
                          <Badge variant="secondary" className="gap-1">
                            <Banknote className="h-3 w-3" />{scrim.price}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Free</Badge>
                        )}
                      </div>
                      <CardTitle className="mt-2">{scrim.title}</CardTitle>
                      <CardDescription>{scrim.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Gamepad2 className="h-4 w-4" />
                          {scrim.game}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          Max {scrim.max_players}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(scrim.scheduled_at), "MMM d")}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {format(new Date(scrim.scheduled_at), "h:mm a")}
                        </div>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full" 
                            onClick={() => setSelectedScrim(scrim)}
                            disabled={!user}
                          >
                            {user ? "Apply Now" : "Login to Apply"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Apply for {scrim.title}</DialogTitle>
                            <DialogDescription>
                              Submit your application to join this scrim.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="message">Why do you want to join?</Label>
                              <Textarea
                                id="message"
                                placeholder="Tell us about your experience and why you'd be a great addition..."
                                value={applicationMessage}
                                onChange={(e) => setApplicationMessage(e.target.value)}
                                rows={4}
                              />
                            </div>
                            <Button onClick={handleApply} className="w-full" disabled={applying}>
                              {applying ? "Submitting..." : "Submit Application"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Streams Tab */}
          <TabsContent value="streams" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">Live Streams</h2>
              <Badge variant="secondary" className="gap-1">
                <Radio className="h-3 w-3 animate-pulse" />
                {streams.filter(s => s.is_live).length} live
              </Badge>
            </div>

            {streams.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Video className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg">No Live Streams</h3>
                  <p className="text-muted-foreground">Check back later for live content.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {streams.map((stream) => (
                  <Card key={stream.id} className="overflow-hidden">
                    <div className="relative aspect-video bg-muted">
                      {stream.stream_type === "third_party" && stream.embed_url ? (
                        <iframe
                          src={stream.embed_url}
                          className="absolute inset-0 w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Direct Stream</p>
                          </div>
                        </div>
                      )}
                      {stream.is_live && (
                        <Badge className="absolute top-2 left-2 bg-red-500 gap-1">
                          <Radio className="h-3 w-3 animate-pulse" /> LIVE
                        </Badge>
                      )}
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-semibold">{stream.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{stream.description}</p>
                      <div className="flex items-center gap-2 mt-4">
                        <Badge variant="outline">
                          {stream.stream_type === "third_party" ? "Twitch/YouTube" : "Direct"}
                        </Badge>
                        {stream.embed_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={stream.embed_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" /> Open
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </Layout>
  );
}
