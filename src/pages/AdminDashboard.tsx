import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, FileText, Bell, Settings, LayoutDashboard, ClipboardList, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: "Total Players", value: "0", icon: Users },
    { label: "Active Tryouts", value: "0", icon: ClipboardList },
    { label: "Pending Apps", value: "0", icon: FileText },
    { label: "Announcements", value: "0", icon: Bell },
  ]);
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch Stats from your real tables
        const { count: playersCount } = await supabase.from("profiles").select("*", { count: 'exact', head: true });
        const { count: tryoutsCount } = await supabase.from("tryouts").select("*", { count: 'exact', head: true });
        const { count: pendingCount } = await supabase.from("tryout_applications").select("*", { count: 'exact', head: true }).eq('status', 'pending');
        
        setStats([
          { label: "Total Players", value: String(playersCount || 0), icon: Users },
          { label: "Active Tryouts", value: String(tryoutsCount || 0), icon: ClipboardList },
          { label: "Pending Apps", value: String(pendingCount || 0), icon: FileText },
          { label: "Announcements", value: "0", icon: Bell },
        ]);

        // 2. Fetch Recent Applications
        const { data: apps } = await supabase
          .from("tryout_applications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);

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
            <p className="text-muted-foreground">Real-time management for Prime Esports</p>
          </div>
          <Button asChild className="font-bold italic uppercase">
            <Link to="/admin/announcements/new">New Announcement</Link>
          </Button>
        </div>

        {/* Real Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-white/10 bg-secondary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground uppercase font-bold">{stat.label}</p>
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary">{loading ? "..." : stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar Navigation */}
          <nav className="space-y-2">
            {[
              { icon: LayoutDashboard, label: "Overview", href: "/admin" },
              { icon: Users, label: "Players", href: "/admin/players" },
              { icon: ClipboardList, label: "Tryouts", href: "/admin/tryouts" },
              { icon: FileText, label: "Applications", href: "/admin/applications" },
              { icon: Settings, label: "Settings", href: "/admin/settings" },
            ].map((item) => (
              <Link 
                key={item.label} 
                to={item.href} 
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-secondary/10 px-4 py-3 transition-all hover:bg-primary hover:text-black group"
              >
                <item.icon className="h-5 w-5 text-primary group-hover:text-black" />
                <span className="font-bold uppercase text-sm italic">{item.label}</span>
                <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
              </Link>
            ))}
          </nav>

          {/* Real Recent Applications */}
          <Card className="lg:col-span-2 border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
              <CardTitle className="text-xl italic uppercase tracking-widest">Recent Applications</CardTitle>
              <Button variant="outline" size="sm" asChild className="text-xs border-primary/50 hover:bg-primary hover:text-black">
                <Link to="/admin/applications">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recentApps.length > 0 ? (
                  recentApps.map((app) => (
                    <div key={app.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-secondary/5 p-4 transition-colors hover:border-primary/30">
                      <div>
                        <h4 className="font-bold text-primary uppercase">{app.full_name || "New Applicant"}</h4>
                        <p className="text-xs text-muted-foreground uppercase">
                          {app.role || "Player"} • {app.game || "General"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="border-primary/50 text-primary uppercase text-[10px]">
                          {app.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-8 px-3 text-xs uppercase hover:bg-primary hover:text-black" asChild>
                           <Link to={`/admin/applications/${app.id}`}>Review</Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-muted-foreground uppercase text-xs">No applications found in database.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}