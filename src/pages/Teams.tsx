import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, ChevronRight, UserPlus } from "lucide-react"; // Added UserPlus icon
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth"; // Added to check for logged-in user

interface Player {
  id: string;
  name: string;
}

interface Achievement {
  id: string;
  title: string;
}

interface Team {
  id: string;
  name: string;
  game: string;
  category: string;
  logo: string;
  description: string | null;
  players: Player[];
  team_achievements: Achievement[];
}

export default function Teams() {
  const { user } = useAuth(); // Hook to get current user
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*');

      if (error) {
        console.error("Teams Fetch Error:", error.message);
      } else if (data) {
        setTeams(data);
        const uniqueCategories = [...new Set(data.map(team => team.category))];
        setCategories(["All", ...uniqueCategories]);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- NEW JOIN LOGIC ---
  const handleJoinTeam = async (teamId: string) => {
    if (!user) {
      alert("Please login to apply for a roster!");
      return;
    }

    const { error } = await supabase
      .from('team_applications')
      .insert([{ 
        user_id: user.id, 
        team_id: teamId,
        status: 'pending' 
      }]);

    if (error) {
      if (error.code === '23505') {
        alert("You have already applied for this roster!");
      } else {
        alert("Error sending application: " + error.message);
      }
    } else {
      alert("Application sent successfully! Admin will review your request.");
    }
  };

  const filteredTeams = selectedCategory === "All" 
    ? teams 
    : teams.filter(team => team.category === selectedCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-esports-dark py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              Professional Rosters
            </Badge>
            <h1 className="mb-4 font-display text-4xl font-bold uppercase text-white md:text-5xl">
              Our <span className="text-primary">Teams</span>
            </h1>
            <p className="text-gray-300">
              World-class players competing at the highest level across multiple esports titles.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="border-b bg-secondary/30 py-4">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Teams Grid */}
      <section className="py-16">
        <div className="container">
          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 pt-0">
                    <Skeleton className="mb-4 h-12 w-full" />
                    <Skeleton className="mb-4 h-20 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredTeams.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredTeams.map((team) => (
                <Card key={team.id} className="card-hover group overflow-hidden border-none bg-card/50">
                  {/* Team Header */}
                  <div className="relative bg-gradient-to-br from-primary/10 to-transparent p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-background text-3xl shadow-lg border border-white/5">
                        {team.logo}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold italic uppercase tracking-tighter">{team.name}</CardTitle>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-widest">{team.game}</Badge>
                          <Badge variant="outline" className="text-[10px] uppercase font-bold opacity-70">{team.category}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {team.description}
                    </p>

                    {/* Achievements Section */}
                    {team.team_achievements && team.team_achievements.length > 0 && (
                      <div className="pt-4 border-t border-white/5">
                        <h4 className="mb-3 flex items-center gap-2 text-xs font-black uppercase italic tracking-wider text-primary">
                          <Trophy className="h-3 w-3" />
                          Recent Success
                        </h4>
                        <ul className="space-y-2">
                          {team.team_achievements.slice(0, 2).map((achievement) => (
                            <li key={achievement.id} className="text-xs font-medium text-gray-400 flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span className="truncate">{achievement.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="space-y-2 pt-2">
                      {/* NEW: Apply Button */}
                      <Button 
                        onClick={() => handleJoinTeam(team.id)}
                        variant="secondary" 
                        className="w-full font-bold uppercase italic text-xs tracking-widest py-6 bg-primary/10 hover:bg-primary hover:text-white transition-all"
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Apply to Join
                      </Button>

                      {/* Original Action Button */}
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
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-bold uppercase italic tracking-widest">No squads found.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/5 bg-secondary/10 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 font-display text-3xl font-black uppercase italic tracking-tighter">
              Join the <span className="text-primary">Legacy</span>
            </h2>
            <p className="mb-8 text-muted-foreground font-medium">
              Think you have what it takes to wear the Prime jersey? Our scouts are always watching.
            </p>
            <Button size="lg" className="font-black uppercase italic tracking-tighter px-12" asChild>
              <Link to="/scrims">Apply Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}