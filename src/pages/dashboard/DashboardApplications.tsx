import { Link } from "react-router-dom";
import { User, FileText, Bell, Settings, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Application {
  id: string;
  scrim_id: string;
  status: string;
  message: string | null;
  created_at: string;
  scrim?: {
    title: string;
    game: string;
  };
}

const navItems = [
  { icon: User, label: "Profile", href: "/dashboard" },
  { icon: FileText, label: "My Applications", href: "/dashboard/applications" },
  { icon: Bell, label: "Announcements", href: "/dashboard/announcements" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardApplications() {
  const { user, username, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const displayName = username || user?.email?.split('@')[0] || 'Player';

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("scrim_applications")
      .select(`
        id,
        scrim_id,
        status,
        message,
        created_at,
        scrims (
          title,
          game
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setApplications(data.map(app => ({
        ...app,
        scrim: Array.isArray(app.scrims) && app.scrims.length > 0 ? app.scrims[0] : undefined
      })));
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="container py-8 flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'accepted': return 'default';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">My <span className="text-primary">Applications</span></h1>
          <p className="text-muted-foreground">Track the status of your scrim applications</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{displayName}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-secondary ${
                    item.href === "/dashboard/applications" ? "bg-secondary" : ""
                  }`}
                >
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span>{item.label}</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Application History</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/scrims">Browse Scrims</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <h4 className="font-semibold">{app.scrim?.title || "Unknown Scrim"}</h4>
                          <p className="text-sm text-muted-foreground">
                            {app.scrim?.game || "Unknown"} • Applied {new Date(app.created_at).toLocaleDateString()}
                          </p>
                          {app.message && (
                            <p className="mt-1 text-sm text-muted-foreground italic">"{app.message}"</p>
                          )}
                        </div>
                        <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No applications yet.{" "}
                    <Link to="/scrims" className="text-primary hover:underline">
                      Browse scrims
                    </Link>
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
