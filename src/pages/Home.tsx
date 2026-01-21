import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Users, Gamepad2, Star, Twitter, Youtube, Twitch, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface Team {
  id: string;
  name: string;
  game: string;
  category: string;
  logo: string;
  description: string | null;
  player_count?: number;
}

interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  image_url: string | null;
  created_at: string;
}

interface Achievement {
  id: string;
  title: string;
  year: string | null;
  team_name?: string;
}

interface Sponsor {
  id: string;
  name: string;
  tier: string;
  logo_url: string | null;
}

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch teams with player count
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

      // Fetch published news
      const { data: newsData } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (newsData) {
        setNews(newsData);
      }

      // Fetch achievements with team info
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

      // Fetch sponsors
      const { data: sponsorsData } = await supabase
        .from('sponsors')
        .select('*')
        .order('tier');

      if (sponsorsData) {
        setSponsors(sponsorsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-esports-dark py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              #1 Esports Organization
            </Badge>
            <h1 className="mb-6 font-display text-5xl font-bold uppercase tracking-tight text-white md:text-7xl">
              Compete at the <span className="text-primary">Highest Level</span>
            </h1>
            <p className="mb-8 text-lg text-gray-300 md:text-xl">
              Prime Esports is home to world-class players competing across multiple titles. 
              Join our journey to greatness.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link to="/tryouts">
                  Join Us <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white bg-white/10 text-white hover:bg-white hover:text-esports-dark" asChild>
                <Link to="/teams">View Teams</Link>
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="border-b bg-secondary/30 py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { icon: Trophy, label: "Championships", value: "25+" },
              { icon: Users, label: "Pro Players", value: "50+" },
              { icon: Gamepad2, label: "Game Titles", value: "6" },
              { icon: Star, label: "Years Active", value: "5" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-2 h-8 w-8 text-primary" />
                <div className="font-display text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Teams */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold uppercase md:text-4xl">
              Our <span className="text-primary">Teams</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              World-class rosters competing at the highest level across multiple esports titles.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="mb-4 h-12 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : teams.length > 0 ? (
              teams.map((team) => (
                <Card key={team.id} className="card-hover group overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                        {team.logo}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {team.game}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">{team.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {team.player_count} Players
                      </span>
                      <Link
                        to={`/teams/${team.id}`}
                        className="text-sm font-medium text-primary transition-colors hover:underline"
                      >
                        View Roster →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No teams available yet.</p>
              </div>
            )}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link to="/teams">View All Teams</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold uppercase md:text-4xl">
              Latest <span className="text-primary">News</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Stay updated with announcements, match results, and organization updates.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="aspect-video" />
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-12 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : news.length > 0 ? (
              news.map((item) => (
                <Card key={item.id} className="card-hover">
                  <div className="aspect-video bg-muted" style={item.image_url ? { backgroundImage: `url(${item.image_url})`, backgroundSize: 'cover' } : {}} />
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-base leading-tight">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No news available yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-display text-3xl font-bold uppercase md:text-4xl">
              Trophy <span className="text-primary">Cabinet</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Our legacy of excellence across competitive gaming.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-lg border bg-card p-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))
            ) : achievements.length > 0 ? (
              achievements.map((achievement: any) => (
                <div
                  key={achievement.id}
                  className="group flex items-center gap-4 rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.game || achievement.team_name} • {achievement.year}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No achievements yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="border-y bg-secondary/30 py-16">
        <div className="container">
          <div className="mb-8 text-center">
            <h2 className="mb-2 font-display text-xl font-bold uppercase text-muted-foreground">
              Our Partners
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-32 rounded-lg" />
              ))
            ) : sponsors.length > 0 ? (
              sponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="flex h-16 w-32 items-center justify-center rounded-lg bg-muted/50 px-4 grayscale transition-all hover:grayscale-0"
                >
                  {sponsor.logo_url ? (
                    <img src={sponsor.logo_url} alt={sponsor.name} className="max-h-full max-w-full" />
                  ) : (
                    <span className="font-display text-sm font-semibold text-muted-foreground">
                      {sponsor.name}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No partners yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 font-display text-3xl font-bold uppercase md:text-4xl">
              Connect With <span className="text-primary">Us</span>
            </h2>
            <p className="mb-8 text-muted-foreground">
              Follow us on social media for live updates, behind-the-scenes content, and community events.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: Twitter, label: "Twitter", href: "#", followers: "250K" },
                { icon: Youtube, label: "YouTube", href: "#", followers: "500K" },
                { icon: Twitch, label: "Twitch", href: "#", followers: "100K" },
                { icon: MessageCircle, label: "Discord", href: "#", followers: "75K" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="group flex items-center gap-3 rounded-lg border bg-card px-6 py-4 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <social.icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                  <div className="text-left">
                    <div className="font-semibold">{social.label}</div>
                    <div className="text-sm text-muted-foreground">{social.followers} followers</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-esports-dark py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 font-display text-3xl font-bold uppercase text-white md:text-4xl">
              Ready to Go <span className="text-primary">Pro?</span>
            </h2>
            <p className="mb-8 text-gray-300">
              We're always looking for talented players to join our ranks. 
              Check out our open tryouts and take the first step towards your esports career.
            </p>
            <Button size="lg" className="gap-2" asChild>
              <Link to="/tryouts">
                View Open Tryouts <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
