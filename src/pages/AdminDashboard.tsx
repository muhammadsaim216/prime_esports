import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, FileText, Bell, Settings, LayoutDashboard, ClipboardList, ChevronRight, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: "Total Players", value: "0", icon: Users },
    { label: "Active Tryouts", value: "0", icon: ClipboardList },
    { label: "Roster Requests", value: "0", icon: UserPlus }, // New Roster Stat
    { label: "Pending Apps", value: "0", icon: FileText },
  ]);
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Stats from your real tables
        const { count: playersCount } = await supabase.from("profiles").select("*", { count: 'exact', head: true });
        const { count: tryoutsCount } = await supabase.from("tryouts").select("*", { count: 'exact', head: true });
        const { count: pendingCount } = await supabase.from("tryout_applications").select("*", { count: 'exact', head: true }).eq('status', 'pending');
        
        // New: Fetch Pending Roster Applications count
        const { count: rosterCount } = await supabase
          .from("team_applications")
          .select("*", { count: 'exact', head: true })
          .eq('status', 'pending');

        setStats([
          { label: "Total Players", value: String(playersCount || 0), icon: Users },
          { label: "Active Tryouts", value: String(tryoutsCount || 0), icon: ClipboardList },
          { label: "Roster Requests", value: String(rosterCount || 0), icon: UserPlus },
          { label: "Pending Apps", value: String(pendingCount || 0), icon: FileText },
        ]);

        // 2. Fetch Recent Roster Applications (Joining actual team slots)
        const { data: apps } = await supabase
          .from("team_applications")
          .select("*, teams(name), profiles(username)")
          .order("created_at", { ascending: false })
          .limit(4);

        if (apps) setRecentApps(apps);
      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold italic uppercase tracking-tighter">
              Admin <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-muted-foreground text-sm uppercase tracking-widest">Real-time management for Prime Esports</p>
          </div>
          <Button asChild className="font-bold italic uppercase tracking-tighter">
            <Link to="/admin/announcements/new">New Announcement</Link>
          </Button>
        </div>

        {/* Real Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-white/10 bg-secondary/20 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{stat.label}</p>
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-3xl font-black text-white italic tracking-tighter">
                  {loading ? "..." : stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar Navigation */}
          <nav className="space-y-2">
            {[
              { icon: LayoutDashboard, label: "Overview", href: "/admin" },
              { icon: Users, label: "Roster Management", href: "/admin/rosters" }, // Updated Label
              { icon: ClipboardList, label: "Tryouts", href: "/admin/tryouts" },
              { icon: FileText, label: "Underdog Apps", href: "/admin/applications" },
              { icon: Bell, label: "Announcements", href: "/admin/announcements" },
              { icon: Settings, label: "Settings", href: "/admin/settings" },
            ].map((item) => (
              <Link 
                key={item.label} 
                to={item.href} 
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-secondary/10 px-4 py-3 transition-all hover:bg-primary hover:text-black group"
              >
                <item.icon className="h-4 w-4 text-primary group-hover:text-black" />
                <span className="font-bold uppercase text-xs italic tracking-widest">{item.label}</span>
                <ChevronRight className="ml-auto h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </nav>

          {/* Recent Roster Applications */}
          <Card className="lg:col-span-2 border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
              <CardTitle className="text-sm font-black italic uppercase tracking-[0.2em] flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-primary" />
                Recent Roster Requests
              </CardTitle>
              <Button variant="outline" size="sm" asChild className="text-[10px] uppercase font-bold border-primary/30 hover:bg-primary hover:text-black">
                <Link to="/admin/rosters">Manage All</Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recentApps.length > 0 ? (
                  recentApps.map((app) => (
                    <div key={app.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-secondary/5 p-4 transition-colors hover:border-primary/20">
                      <div>
                        <h4 className="font-black text-white italic uppercase text-sm tracking-tight">
                          {app.profiles?.username || "New Player"}
                        </h4>
                        <p className="text-[10px] text-primary uppercase font-bold tracking-widest">
                          Target: {app.teams?.name || "General Roster"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-primary/20 text-muted-foreground uppercase text-[9px] font-bold">
                          {new Date(app.created_at).toLocaleDateString()}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-8 px-4 text-[10px] font-black uppercase italic tracking-widest hover:bg-primary hover:text-black transition-all" asChild>
                           <Link to={`/admin/rosters`}>Action</Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-xl">
                    <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-[0.2em]">No pending roster requests.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}