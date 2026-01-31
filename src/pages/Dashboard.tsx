import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, FileText, Bell, Settings, ChevronRight, Users, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { user, username, loading: authLoading } = useAuth();
  
  const [applications, setApplications] = useState<any[]>([]);
  const [teamApplications, setTeamApplications] = useState<any[]>([]); // New state for Roster apps
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const displayName = username || user?.email?.split('@')[0] || 'Player';

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setDataLoading(true);

      // 1. Fetch User's Underdog Applications
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (appError) throw appError;

      // 2. Fetch User's Team Roster Applications (New Table)
      const { data: teamAppData, error: teamAppError } = await supabase
        .from('team_applications')
        .select('*, teams(name)')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      // Note: If table doesn't exist yet, we just log it instead of crashing
      if (!teamAppError) setTeamApplications(teamAppData || []);

      // 3. Fetch Latest Announcements
      const { data: annData, error: annError } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_published', true)
        .limit(3)
        .order('created_at', { ascending: false });

      if (annError) throw annError;

      setApplications(appData || []);
      setAnnouncements(annData || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  if (authLoading || dataLoading) {
    return (
      <Layout>
        <div className="container py-8 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold italic uppercase tracking-tighter">
            Welcome back, <span className="text-primary">{displayName}</span>
          </h1>
          <p className="text-muted-foreground">Manage your profile and track your applications</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="border-none bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary border border-primary/20">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold uppercase italic tracking-tighter text-lg">{displayName}</h3>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <nav className="space-y-1">
              {[
                { icon: User, label: "Profile", href: "/dashboard" },
                { icon: Users, label: "Join Team", href: "/teams" }, // New Navigation Item
                { icon: FileText, label: "My Applications", href: "/dashboard/applications" },
                { icon: Bell, label: "Announcements", href: "/dashboard/announcements" },
                { icon: Settings, label: "Settings", href: "/dashboard/settings" },
              ].map((item) => (
                <Link key={item.label} to={item.href} className="flex items-center gap-3 rounded-lg px-4 py-3 transition-all hover:bg-primary/10 group">
                  <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                  <span className="font-bold uppercase italic text-xs tracking-widest">{item.label}</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* New: Team Roster Applications */}
            <Card className="border-none bg-card/50 overflow-hidden">
              <div className="h-1 bg-primary w-full" />
              <CardHeader>
                <CardTitle className="text-sm font-black uppercase italic tracking-widest flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Roster Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {teamApplications.length > 0 ? (
                  <div className="space-y-3">
                    {teamApplications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-secondary/20 p-4 transition-hover hover:border-primary/30">
                        <div>
                          <h4 className="font-bold text-sm uppercase italic tracking-tighter">{app.teams?.name || "Esports Team"}</h4>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                            Applied: {new Date(app.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className="text-[10px] uppercase font-black italic tracking-widest" variant={app.status === "approved" ? "default" : "secondary"}>
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border-2 border-dashed border-white/5 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-4 uppercase font-bold tracking-widest">You haven't applied to any teams yet.</p>
                    <Button size="sm" variant="outline" className="font-black uppercase italic text-[10px]" asChild>
                      <Link to="/teams">Browse Roster Openings</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Original: Underdog Applications */}
            <Card className="border-none bg-card/50">
              <CardHeader><CardTitle className="text-sm font-black uppercase italic tracking-widest">My Underdog Applications</CardTitle></CardHeader>
              <CardContent>
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between rounded-lg border border-white/5 p-4 bg-secondary/10">
                        <div>
                          <h4 className="font-bold text-sm italic uppercase">{app.position}</h4>
                          <p className="text-xs text-muted-foreground">
                            {app.team} • Applied {new Date(app.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={app.status === "pending" ? "secondary" : app.status === "reviewed" ? "default" : "outline"}>
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-xs text-muted-foreground py-8 uppercase font-bold tracking-widest">No applications yet. <Link to="/tryouts" className="text-primary hover:underline">Browse tryouts</Link></p>
                )}
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card className="border-none bg-card/50">
              <CardHeader><CardTitle className="text-sm font-black uppercase italic tracking-widest">Recent Announcements</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.length > 0 ? (
                    announcements.map((ann) => (
                      <div key={ann.id} className="rounded-lg border border-white/5 p-4 bg-secondary/10">
                        <div className="mb-2 flex items-center gap-2">
                          <h4 className="font-bold text-sm uppercase italic">{ann.title}</h4>
                          {ann.priority === "high" && <Badge variant="destructive" className="text-[8px] uppercase">Important</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{ann.content}</p>
                        <p className="mt-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                          {new Date(ann.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">No recent announcements.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}