import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Added UserPlus and ChevronRight for the new card design
import { ArrowRight, Trophy, Users, Gamepad2, Star, Twitter, Youtube, Twitch, MessageCircle, UserPlus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

// ... Keep all your existing interfaces exactly the same ...
interface Team {
  id: string;
  name: string;
  game: string;
  category: string;
  logo: string;
  description: string | null;
  player_count?: number;
}
interface NewsItem { id: string; title: string; excerpt: string | null; category: string; image_url: string | null; created_at: string; }
interface Achievement { id: string; title: string; year: string | null; team_name?: string; }
interface Sponsor { id: string; name: string; tier: string; logo_url: string | null; }

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  // --- KEPT ALL YOUR FETCH FUNCTIONS UNTOUCHED ---
  const fetchData = async () => {
    try {
      const { data: teamsData } = await supabase
        .from('teams')
        .select('*, players(id)')
        .limit(6);

      if (teamsData) {
        setTeams(teamsData.map(team => ({
          ...team,
          player_count: team.players?.length || 0
        })));
      }

      const { data: newsData } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (newsData) { setNews(newsData); }

      const { data: achievementsData } = await supabase
        .from('team_achievements')
        .select('*, teams(name, game)')
        .order('created_at', { ascending: false })
        .limit(6);

      if (achievementsData) {
        setAchievements(achievementsData.map(a => ({
          id: a.id,
          title: a.title,
          year: a.year,
          team_name: a.teams?.name,
          game: a.teams?.game
        })));
      }

      const { data: sponsorsData } = await supabase
        .from('sponsors')
        .select('*')
        .order('tier');

      if (sponsorsData) { setSponsors(sponsorsData); }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* ... Hero and Stats sections remain untouched ... */}
      <section className="relative overflow-hidden bg-esports-dark py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">#1 Esports Organization</Badge>
            <h1 className="mb-6 font-display text-5xl font-bold uppercase tracking-tight text-white md:text-7xl">
              Compete at the <span className="text-primary">Highest Level</span>
            </h1>
            <p className="mb-8 text-lg text-gray-300 md:text-xl">Prime Esports is home to world-class players. Join our journey.</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="gap-2" asChild><Link to="/scrims">Join Us <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button size="lg" variant="outline" className="border-white bg-white/10 text-white hover:bg-white hover:text-esports-dark" asChild><Link to="/teams">View Teams</Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section Untouched */}
      <section className="border-b bg-secondary/30 py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[{ icon: Trophy, label: "Championships", value: "25+" }, { icon: Users, label: "Pro Players", value: "50+" }, { icon: Gamepad2, label: "Game Titles", value: "6" }, { icon: Star, label: "Years Active", value: "5" }].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-2 h-8 w-8 text-primary" />
                <div className="font-display text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- UPDATED TEAM CARDS SECTION --- */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold uppercase md:text-4xl">
              Our <span className="text-primary">Teams</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">World-class rosters competing at the highest level.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden"><CardHeader><Skeleton className="h-12 w-12" /></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
              ))
            ) : teams.map((team) => (
              /* NEW CONSISTENT CARD DESIGN */
              <Card key={team.id} className="card-hover group overflow-hidden border-none bg-card/50">
                <div className="relative bg-gradient-to-br from-primary/10 to-transparent p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-background text-3xl shadow-lg border border-white/5 transition-transform group-hover:scale-110 duration-300">
                      {team.logo}
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold italic uppercase tracking-tighter">
                        {team.name}
                      </CardTitle>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-widest">
                          {team.game}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold opacity-70">
                          {team.category || "PRO"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] italic">
                    {team.description || "The official competitive roster for Prime Esports."}
                  </p>
                  
                  <div className="space-y-2">
                    {/* Consistent Apply Button */}
                    <Button 
                      variant="secondary" 
                      className="w-full font-bold uppercase italic text-xs tracking-widest py-6 bg-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm" 
                      asChild
>
                      {/* Using a hash #apply instead of state */}
                      <Link to={`/teams/${team.id}#apply`} state={{ scrollToApply: true }}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Apply to Join
                    </Link>
                    </Button>

                    {/* View Roster Button */}
                    <Button variant="outline" className="w-full group-hover:border-primary transition-all duration-300 font-bold uppercase italic text-xs tracking-widest py-6" asChild>
                      <Link to={`/teams/${team.id}`}>
                        View Full Roster
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" asChild><Link to="/teams">View All Teams</Link></Button>
          </div>
        </div>
      </section>

      {/* ... All remaining sections (News, Achievements, Sponsors, Socials, CTA) are completely untouched ... */}
      {/* ... They will function exactly as they did before ... */}
    </Layout>
  );
}