import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Trophy, MapPin, Twitter, Twitch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface Player {
  id: string;
  name: string;
  role: string;
  country: string;
  image_url: string | null;
  twitter_url: string | null;
  twitch_url: string | null;
}

interface Achievement {
  id: string;
  title: string;
  year: string | null;
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

export default function TeamDetail() {
  const { id } = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTeam(id);
    }
  }, [id]);

  const fetchTeam = async (teamId: string) => {
    try {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        players (*),
        team_achievements (*)
      `)
      // Check if teamId is a UUID or a name/slug
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

  if (loading) {
    return (
      <Layout>
        <section className="bg-esports-dark py-16 md:py-24">
          <div className="container">
            <Skeleton className="mb-6 h-8 w-32" />
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
              <Skeleton className="h-24 w-24 rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-16 w-96" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!team) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="mb-4 text-2xl font-bold">Team Not Found</h1>
          <Button asChild>
            <Link to="/teams">Back to Teams</Link>
          </Button>
        </div>
      </Layout>
    );
  }

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

      {/* Achievements */}
      {team.team_achievements && team.team_achievements.length > 0 && (
        <section className="border-b bg-secondary/30 py-8">
          <div className="container">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {team.team_achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-2 rounded-full border bg-background px-4 py-2"
                >
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{achievement.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Roster */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-8 text-center font-display text-3xl font-bold uppercase">
            Active <span className="text-primary">Roster</span>
          </h2>

          {team.players && team.players.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {team.players.map((player) => (
                <Card key={player.id} className="card-hover group overflow-hidden">
                  {/* Player Image */}
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-muted">
                    {player.image_url ? (
                      <img 
                        src={player.image_url} 
                        alt={player.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-display text-6xl font-bold text-primary/30">
                          {player.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4 text-center">
                    <h3 className="font-display text-lg font-bold">{player.name}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {player.role}
                    </Badge>
                    <div className="mt-2 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {player.country}
                    </div>

                    {/* Social Links */}
                    <div className="mt-3 flex justify-center gap-2">
                      {player.twitter_url && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <a href={player.twitter_url} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {player.twitch_url && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <a href={player.twitch_url} target="_blank" rel="noopener noreferrer">
                            <Twitch className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {!player.twitter_url && !player.twitch_url && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Twitter className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Twitch className="h-4 w-4" />
                          </Button>
                        </>
                      )}
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

      {/* Join CTA */}
      <section className="border-t bg-secondary/30 py-16">
        <div className="container text-center">
          <h2 className="mb-4 font-display text-2xl font-bold">
            Want to Join {team.name}?
          </h2>
          <p className="mb-6 text-muted-foreground">
            Check if there are any open positions for this team.
          </p>
          <Button asChild>
            <Link to="/scrims">View Open Tryouts</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
