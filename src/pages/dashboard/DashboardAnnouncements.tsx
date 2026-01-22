import { Link } from "react-router-dom";
import { User, FileText, Bell, Settings, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { icon: User, label: "Profile", href: "/dashboard" },
  { icon: FileText, label: "My Applications", href: "/dashboard/applications" },
  { icon: Bell, label: "Announcements", href: "/dashboard/announcements" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardAnnouncements() {
  const { user, username, loading: authLoading } = useAuth();
  const { announcements, loading } = useRealtimeAnnouncements();

  const displayName = username || user?.email?.split('@')[0] || 'Player';

  if (authLoading) {
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
          <h1 className="font-display text-3xl font-bold">
            <span className="text-primary">Announcements</span>
          </h1>
          <p className="text-muted-foreground">Stay updated with the latest news (updates in real-time)</p>
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
                    item.href === "/dashboard/announcements" ? "bg-secondary" : ""
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
              <CardHeader>
                <CardTitle>Latest Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : announcements.length > 0 ? (
                  <div className="space-y-4">
                    {announcements.map((ann) => (
                      <div key={ann.id} className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <h4 className="font-semibold">{ann.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{ann.content}</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {new Date(ann.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No announcements yet.
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
function useRealtimeAnnouncements(): { announcements: any; loading: any; } {
  throw new Error("Function not implemented.");
}

