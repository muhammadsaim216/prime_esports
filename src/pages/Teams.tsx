import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

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
        .select('*, players(id, name), team_achievements(id, title)')
        .order('name');

      if (error) throw error;

      if (data) {
        setTeams(data);
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(team => team.category))];
        setCategories(["All", ...uniqueCategories]);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
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
                <Card key={team.id} className="card-hover group overflow-hidden">
                  {/* Team Header */}
                  <div className="relative bg-gradient-to-br from-primary/20 to-transparent p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-background text-3xl shadow-lg">
                        {team.logo}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{team.name}</CardTitle>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge>{team.game}</Badge>
                          <Badge variant="outline">{team.category}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <p className="mb-4 text-sm text-muted-foreground">{team.description}</p>

                    {/* Achievements */}
                    {team.team_achievements && team.team_achievements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                          <Trophy className="h-4 w-4 text-primary" />
                          Recent Achievements
                        </h4>
                        <ul className="space-y-1">
                          {team.team_achievements.slice(0, 2).map((achievement) => (
                            <li key={achievement.id} className="text-sm text-muted-foreground">
                              • {achievement.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Roster Preview */}
                    <div className="mb-4">
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                        <Users className="h-4 w-4 text-primary" />
                        Roster ({team.players?.length || 0} players)
                      </h4>
                      <div className="flex -space-x-2">
                        {team.players?.slice(0, 5).map((player) => (
                          <div
                            key={player.id}
                            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium"
                            title={player.name}
                          >
                            {player.name.charAt(0)}
                          </div>
                        ))}
                        {team.players && team.players.length > 5 && (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-medium text-primary-foreground">
                            +{team.players.length - 5}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View Team Button */}
                    <Button variant="outline" className="w-full gap-2 group-hover:border-primary" asChild>
                      <Link to={`/teams/${team.id}`}>
                        View Full Roster
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No teams found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-secondary/30 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 font-display text-2xl font-bold uppercase md:text-3xl">
              Want to Join a Team?
            </h2>
            <p className="mb-6 text-muted-foreground">
              We're always looking for talented players. Check out our open tryouts and apply today.
            </p>
            <Button asChild>
              <Link to="/tryouts">View Open Tryouts</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
