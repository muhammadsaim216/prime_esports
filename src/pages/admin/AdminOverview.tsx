import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Gamepad2, FileText, Video, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Stats {
  totalPlayers: number;
  activeScrims: number;
  pendingApplications: number;
  liveStreams: number;
}

interface RecentApplication {
  id: string;
  message: string | null;
  status: string;
  created_at: string;
  profiles: { username: string } | null;
  scrims: { title: string; game: string } | null;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({ totalPlayers: 0, activeScrims: 0, pendingApplications: 0, liveStreams: 0 });
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentApplications();
  }, []);

  const fetchStats = async () => {
    const [playersRes, scrimsRes, appsRes, streamsRes] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("scrims").select("id", { count: "exact", head: true }).in("status", ["upcoming", "live"]),
      supabase.from("scrim_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("streams").select("id", { count: "exact", head: true }).eq("is_live", true),
    ]);

    setStats({
      totalPlayers: playersRes.count || 0,
      activeScrims: scrimsRes.count || 0,
      pendingApplications: appsRes.count || 0,
      liveStreams: streamsRes.count || 0,
    });
  };

  const fetchRecentApplications = async () => {
    const { data, error } = await supabase
      .from("scrim_applications")
      .select(`
        id,
        message,
        status,
        created_at,
        profiles:user_id (username),
        scrims:scrim_id (title, game)
      `)
      .order("created_at", { ascending: false })
      .limit(5);

    if (!error && data) {
      setRecentApplications(data as unknown as RecentApplication[]);
    }
    setLoading(false);
  };

  const statCards = [
    { label: "Total Players", value: stats.totalPlayers, icon: Users, color: "text-blue-500" },
    { label: "Active Scrims", value: stats.activeScrims, icon: Gamepad2, color: "text-green-500" },
    { label: "Pending Applications", value: stats.pendingApplications, icon: FileText, color: "text-yellow-500" },
    { label: "Live Streams", value: stats.liveStreams, icon: Video, color: "text-red-500" },
  ];

  return (
    <AdminLayout title="Dashboard Overview" description="Monitor and manage your esports organization">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-lg bg-secondary p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Applications</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/applications">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : recentApplications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No applications yet</p>
            ) : (
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{app.profiles?.username || "Unknown"}</p>
                      <p className="text-sm text-muted-foreground">
                        {app.scrims?.title} • {app.scrims?.game}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={app.status === "pending" ? "secondary" : app.status === "approved" ? "default" : "destructive"}>
                        {app.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(app.created_at), "MMM d")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild className="justify-start gap-2">
              <Link to="/admin/scrims">
                <Gamepad2 className="h-4 w-4" /> Create New Scrim
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start gap-2">
              <Link to="/admin/streams">
                <Video className="h-4 w-4" /> Add Stream
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start gap-2">
              <Link to="/admin/applications">
                <FileText className="h-4 w-4" /> Review Applications
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start gap-2">
              <Link to="/admin/players">
                <Users className="h-4 w-4" /> Manage Players
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
