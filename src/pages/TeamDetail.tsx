import { useState, useEffect, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { ArrowLeft, Trophy, MapPin, Twitter, Twitch, Send } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast"; 

interface Player { id: string; name: string; role: string; country: string; image_url: string | null; twitter_url: string | null; twitch_url: string | null; }
interface Achievement { id: string; title: string; year: string | null; }
interface Team { id: string; name: string; game: string; category: string; logo: string; description: string | null; players: Player[]; team_achievements: Achievement[]; }

export default function TeamDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { toast } = useToast();
  const applySectionRef = useRef<HTMLDivElement>(null);
  
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTeam(id);
    }
  }, [id]);

  useEffect(() => {
    const shouldScroll = location.state?.scrollToApply || location.hash === '#apply';
    if (!loading && team && shouldScroll) {
      const timer = setTimeout(() => {
        applySectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading, team, location.state, location.hash]);

  const fetchTeam = async (teamId: string) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`*, players (*), team_achievements (*)`)
        .or(`id.eq.${teamId},name.eq.${teamId}`) 
        .single();

      if (error) {
        console.error('Supabase error:', error.message);
        setTeam(null);
      } else {
        setTeam(data);
      }
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Updated Mapping: Ensure keys match your Supabase 'players' table columns
    const applicationData = {
      team_id: team?.id,
      name: formData.get('playerName'), // Mapping 'playerName' form field to 'name' column
      role: formData.get('role'),
      discord_tag: formData.get('discord') || null, 
      message: formData.get('message') || null,
      status: 'pending'
    };

    try {
      const { error } = await supabase
        .from('players') 
        .insert([applicationData]);

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Application Sent!",
        description: "Your profile has been added to the roster management section.",
      });
    } catch (error: any) {
      console.error('Error:', error.message);
      toast({
        title: "Submission Failed",
        description: "Check if the 'players' table has discord_tag and message columns.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Layout><section className="bg-esports-dark py-24"><div className="container"><Skeleton className="h-64 w-full" /></div></section></Layout>;
  if (!team) return <Layout><div className="container py-16 text-center"><Button asChild><Link to="/teams">Back</Link></Button></div></Layout>;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-esports-dark py-16 md:py-24">
        <div className="container">
          <Button variant="ghost" size="sm" className="mb-6 text-gray-300 hover:text-white" asChild>
            <Link to="/teams">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Teams
            </Link>
          </Button>

          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white p-2 shadow-xl overflow-hidden">
              {team.logo?.startsWith('http') ? (
                <img src={team.logo} alt={team.name} className="h-full w-full object-contain" />
              ) : (
                <span className="text-black font-black">{team.logo || team.name.charAt(0)}</span>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="mb-2 font-display text-4xl font-bold uppercase text-white md:text-5xl">
                {team.name}
              </h1>
              <div className="mb-4 flex flex-wrap justify-center gap-2 md:justify-start">
                <Badge className="bg-primary">{team.game}</Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {team.category}
                </Badge>
              </div>
              <p className="max-w-xl text-gray-300">{team.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roster Section */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-8 text-center font-display text-3xl font-bold uppercase">
            Active <span className="text-primary">Roster</span>
          </h2>
          {team.players && team.players.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {team.players.map((player) => (
                <Card key={player.id} className="card-hover group overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-muted text-center flex items-center justify-center">
                    {player.image_url ? (
                        <img src={player.image_url} alt={player.name} className="h-full w-full object-cover" />
                    ) : (
                        <span className="font-display text-6xl font-bold text-primary/30">{player.name.charAt(0)}</span>
                    )}
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-display text-lg font-bold">{player.name}</h3>
                    <Badge variant="secondary" className="mt-1">{player.role}</Badge>
                    <div className="mt-2 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {player.country || "Global"}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No players on this roster yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Join Section */}
      <section 
        id="apply" 
        ref={applySectionRef} 
        className="border-t bg-secondary/30 py-16 scroll-mt-24"
      >
        <div className="container max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="mb-2 font-display text-3xl font-bold uppercase">
              Apply to join <span className="text-primary">{team.name}</span>
            </h2>
            <p className="text-muted-foreground">
              Think you have what it takes? Submit your application for review.
            </p>
          </div>

          {isSubmitted ? (
            <Card className="border-primary/50 bg-primary/5 p-10 text-center animate-in fade-in zoom-in duration-300">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary p-3">
                  <Send className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold">Application Received!</h3>
              <p className="mt-2 text-muted-foreground">
                Management will review your profile and contact you on Discord.
              </p>
              <Button className="mt-6" variant="outline" onClick={() => setIsSubmitted(false)}>
                Submit Another
              </Button>
            </Card>
          ) : (
            <form onSubmit={handleApply} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium italic uppercase tracking-wider">Player Name</label>
                  <input name="playerName" required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. AcePlayer" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium italic uppercase tracking-wider">Discord Tag (Optional)</label>
                  <input name="discord" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="user#0000 (Optional)" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium italic uppercase tracking-wider">Preferred Role</label>
                <input name="role" required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Entry Fragger / IGL" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium italic uppercase tracking-wider">Experience / Notes (Optional)</label>
                <textarea 
                  name="message" 
                  className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" 
                  placeholder="Tell us about your previous teams or achievements (Optional)..." 
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full font-bold uppercase italic py-6 text-md tracking-widest">
                {isSubmitting ? "Processing Request..." : "Submit Application"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}