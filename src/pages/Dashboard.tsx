import { Link } from "react-router-dom";
import { User, FileText, Bell, Settings, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { mockApplications, mockAnnouncements } from "@/data/mockData";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user, username, loading } = useAuth();
  
  const displayName = username || user?.email?.split('@')[0] || 'Player';

  if (loading) {
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
          <h1 className="font-display text-3xl font-bold">Welcome back, <span className="text-primary">{displayName}</span></h1>
          <p className="text-muted-foreground">Manage your profile and track your applications</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">{displayName.charAt(0).toUpperCase()}</div>
                  <div>
                    <h3 className="font-semibold">{displayName}</h3>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <nav className="space-y-1">
              {[
                { icon: User, label: "Profile", href: "/dashboard" },
                { icon: FileText, label: "My Applications", href: "/dashboard/applications" },
                { icon: Bell, label: "Announcements", href: "/dashboard/announcements" },
                { icon: Settings, label: "Settings", href: "/dashboard/settings" },
              ].map((item) => (
                <Link key={item.label} to={item.href} className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-secondary">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span>{item.label}</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Applications */}
            <Card>
              <CardHeader><CardTitle>My Tryout Applications</CardTitle></CardHeader>
              <CardContent>
                {mockApplications.length > 0 ? (
                  <div className="space-y-4">
                    {mockApplications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <h4 className="font-semibold">{app.position}</h4>
                          <p className="text-sm text-muted-foreground">{app.team} • Applied {app.appliedDate}</p>
                        </div>
                        <Badge variant={app.status === "pending" ? "secondary" : app.status === "reviewed" ? "default" : "outline"}>
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No applications yet. <Link to="/tryouts" className="text-primary hover:underline">Browse tryouts</Link></p>
                )}
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card>
              <CardHeader><CardTitle>Recent Announcements</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnnouncements.map((ann) => (
                    <div key={ann.id} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <h4 className="font-semibold">{ann.title}</h4>
                        {ann.priority === "high" && <Badge variant="destructive">Important</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{ann.content}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{ann.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
