import { useState, useEffect } from "react";
import { Calendar, Clock, Users, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Layout } from "@/components/layout/Layout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Tryout {
  id: string;
  team_name: string;
  game: string;
  position: string;
  requirements: string | null;
  description: string | null;
  deadline: string;
  status: string;
}

const availabilityOptions = [
  "Weekday Mornings",
  "Weekday Afternoons",
  "Weekday Evenings",
  "Weekend Mornings",
  "Weekend Afternoons",
  "Weekend Evenings",
];

export default function Tryouts() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTryout, setSelectedTryout] = useState<Tryout | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    discord: "",
    age: "",
    country: "",
    currentRank: "",
    peakRank: "",
    hoursPerWeek: "",
    previousTeams: "",
    achievements: "",
    whyJoin: "",
    availability: [] as string[],
    agreeToTerms: false,
  });

  useEffect(() => {
    fetchTryouts();
  }, []);

  const fetchTryouts = async () => {
    try {
      const { data, error } = await supabase
        .from('Tryouts')
        .select('*')
        .in('status', ['open', 'closing_soon'])
        .order('deadline');

      if (error) throw error;
      setTryouts(data || []);
    } catch (error) {
      console.error('Error fetching tryouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    toast({
      title: "Application Submitted!",
      description: "We'll review your application and get back to you soon.",
    });
    setSelectedTryout(null);
    setFormData({
      fullName: "",
      email: "",
      discord: "",
      age: "",
      country: "",
      currentRank: "",
      peakRank: "",
      hoursPerWeek: "",
      previousTeams: "",
      achievements: "",
      whyJoin: "",
      availability: [],
      agreeToTerms: false,
    });
  };

  const toggleAvailability = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter((a) => a !== option)
        : [...prev.availability, option],
    }));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-esports-dark py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
              Join the Team
            </Badge>
            <h1 className="mb-4 font-display text-4xl font-bold uppercase text-white md:text-5xl">
              Open <span className="text-primary">Tryouts</span>
            </h1>
            <p className="text-gray-300">
              Ready to compete at the highest level? Browse our open positions and submit your application.
            </p>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="border-b bg-secondary/30 py-8">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-4 text-center font-display text-lg font-semibold uppercase">
              General Requirements
            </h2>
            <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2 md:grid-cols-4">
              {[
                "Must be 16+ years old",
                "Fluent in English",
                "Reliable internet connection",
                "Committed team player",
              ].map((req, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-8 text-center font-display text-3xl font-bold uppercase">
            Available <span className="text-primary">Scrims</span>
          </h2>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="mb-4 h-12 w-full" />
                    <Skeleton className="mb-4 h-20 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : tryouts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {tryouts.map((tryout) => (
                <Card key={tryout.id} className="card-hover">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-xl">
                          🎮
                        </div>
                        <div>
                          <CardTitle className="text-lg">{tryout.position}</CardTitle>
                          <p className="text-sm text-muted-foreground">{tryout.team_name}</p>
                        </div>
                      </div>
                      <Badge
                        variant={tryout.status === "closing_soon" ? "destructive" : "default"}
                      >
                        {tryout.status === "closing_soon" ? "Closing Soon" : "Open"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">{tryout.description}</p>

                    <div className="mb-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-medium">Game:</span>
                        <Badge variant="outline">{tryout.game}</Badge>
                      </div>
                      {tryout.requirements && (
                        <div className="flex items-start gap-2 text-sm">
                          <Check className="mt-0.5 h-4 w-4 text-primary" />
                          <span className="font-medium">Requirements:</span>
                          <span className="text-muted-foreground">{tryout.requirements}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium">Deadline:</span>
                        <span className="text-muted-foreground">
                          {new Date(tryout.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full gap-2"
                          onClick={() => setSelectedTryout(tryout)}
                        >
                          Apply Now
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="font-display text-xl">
                            Apply for {tryout.position} - {tryout.team_name}
                          </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                          {/* Personal Information */}
                          <div className="space-y-4">
                            <h3 className="font-semibold">Personal Information</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name *</Label>
                                <Input
                                  id="fullName"
                                  required
                                  value={formData.fullName}
                                  onChange={(e) =>
                                    setFormData({ ...formData, fullName: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  required
                                  value={formData.email}
                                  onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="discord">Discord Tag *</Label>
                                <Input
                                  id="discord"
                                  placeholder="username#0000"
                                  required
                                  value={formData.discord}
                                  onChange={(e) =>
                                    setFormData({ ...formData, discord: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="age">Age *</Label>
                                <Input
                                  id="age"
                                  type="number"
                                  min="16"
                                  required
                                  value={formData.age}
                                  onChange={(e) =>
                                    setFormData({ ...formData, age: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="country">Country *</Label>
                                <Input
                                  id="country"
                                  required
                                  value={formData.country}
                                  onChange={(e) =>
                                    setFormData({ ...formData, country: e.target.value })
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          {/* Gaming Stats */}
                          <div className="space-y-4">
                            <h3 className="font-semibold">Gaming Stats</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-2">
                                <Label htmlFor="currentRank">Current Rank *</Label>
                                <Input
                                  id="currentRank"
                                  placeholder="e.g., Immortal 2, Global Elite"
                                  required
                                  value={formData.currentRank}
                                  onChange={(e) =>
                                    setFormData({ ...formData, currentRank: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="peakRank">Peak Rank *</Label>
                                <Input
                                  id="peakRank"
                                  placeholder="Highest rank achieved"
                                  required
                                  value={formData.peakRank}
                                  onChange={(e) =>
                                    setFormData({ ...formData, peakRank: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="hoursPerWeek">Hours Available Per Week *</Label>
                                <Select
                                  value={formData.hoursPerWeek}
                                  onValueChange={(value) =>
                                    setFormData({ ...formData, hoursPerWeek: value })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select hours" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="10-20">10-20 hours</SelectItem>
                                    <SelectItem value="20-30">20-30 hours</SelectItem>
                                    <SelectItem value="30-40">30-40 hours</SelectItem>
                                    <SelectItem value="40+">40+ hours</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* Experience */}
                          <div className="space-y-4">
                            <h3 className="font-semibold">Experience</h3>
                            <div className="space-y-2">
                              <Label htmlFor="previousTeams">Previous Teams</Label>
                              <Textarea
                                id="previousTeams"
                                placeholder="List any previous teams you've played for..."
                                value={formData.previousTeams}
                                onChange={(e) =>
                                  setFormData({ ...formData, previousTeams: e.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="achievements">Notable Achievements</Label>
                              <Textarea
                                id="achievements"
                                placeholder="Tournament placements, rankings, etc..."
                                value={formData.achievements}
                                onChange={(e) =>
                                  setFormData({ ...formData, achievements: e.target.value })
                                }
                              />
                            </div>
                          </div>

                          {/* Availability */}
                          <div className="space-y-4">
                            <h3 className="font-semibold">Availability</h3>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                              {availabilityOptions.map((option) => (
                                <div
                                  key={option}
                                  className={`cursor-pointer rounded-lg border p-3 text-center text-sm transition-colors ${
                                    formData.availability.includes(option)
                                      ? "border-primary bg-primary/10"
                                      : "hover:border-primary/50"
                                  }`}
                                  onClick={() => toggleAvailability(option)}
                                >
                                  {option}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Why Join */}
                          <div className="space-y-2">
                            <Label htmlFor="whyJoin">Why do you want to join Prime Esports? *</Label>
                            <Textarea
                              id="whyJoin"
                              required
                              placeholder="Tell us about your motivation and goals..."
                              className="min-h-[100px]"
                              value={formData.whyJoin}
                              onChange={(e) =>
                                setFormData({ ...formData, whyJoin: e.target.value })
                              }
                            />
                          </div>

                          {/* Terms */}
                          <div className="flex items-start gap-2">
                            <Checkbox
                              id="terms"
                              checked={formData.agreeToTerms}
                              onCheckedChange={(checked) =>
                                setFormData({ ...formData, agreeToTerms: checked as boolean })
                              }
                            />
                            <Label htmlFor="terms" className="text-sm leading-relaxed">
                              I agree to the terms and conditions and understand that submitting
                              false information may result in disqualification.
                            </Label>
                          </div>

                          <Button
                            type="submit"
                            className="w-full"
                            disabled={!formData.agreeToTerms}
                          >
                            Submit Application
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No Scrims at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t bg-secondary/30 py-16">
        <div className="container">
          <h2 className="mb-8 text-center font-display text-3xl font-bold uppercase">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <div className="mx-auto max-w-3xl space-y-4">
            {[
              {
                q: "What is the tryout process like?",
                a: "After submitting your application, our coaching staff will review it within 1-2 weeks. If selected, you'll be invited to participate in practice sessions and scrimmages with the team.",
              },
              {
                q: "Do I need previous team experience?",
                a: "While previous team experience is preferred for most positions, we do consider exceptional solo players for our academy programs.",
              },
              {
                q: "Are tryouts paid?",
                a: "No, tryouts are completely free. Players who make the roster will receive competitive salaries and benefits.",
              },
              {
                q: "Can I apply for multiple positions?",
                a: "Yes, you can submit applications for multiple positions. However, we recommend focusing on the role that best matches your skills.",
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
