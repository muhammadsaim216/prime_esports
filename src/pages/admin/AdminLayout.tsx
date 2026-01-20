import { ReactNode, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, ClipboardList, FileText, Video, Radio, Bell, Settings, LogOut, ChevronRight, Megaphone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Users, label: "Players", href: "/admin/players" },
  { icon: ClipboardList, label: "Scrims", href: "/admin/scrims" },
  { icon: FileText, label: "Applications", href: "/admin/applications" },
  { icon: Video, label: "Streams", href: "/admin/streams" },
  { icon: Bell, label: "Announcements", href: "/admin/announcements" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();

  useEffect(() => {
    // Only redirect if we are certain the loading is finished 
    // AND the user is definitely not an admin.
    if (!loading) {
      if (!user || isAdmin === false) {
        navigate("/auth"); // Changed from /login to /auth to match your setup
      }
    }
  }, [user, isAdmin, loading, navigate]);

  // Enhanced Loading Screen to prevent flicker
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-xs font-bold uppercase italic tracking-widest text-muted-foreground">
          Authenticating Admin...
        </p>
      </div>
    );
  }

  // If loading is done but session failed, return null while useEffect redirects
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="font-display text-sm font-bold text-primary-foreground">P</span>
          </div>
          <span className="font-display font-bold tracking-tight">ADMIN PANEL</span>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          {sidebarLinks.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors font-medium",
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full border-t p-4 bg-card">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive" 
            onClick={signOut}
          >
            <LogOut className="h-4 w-4" />
            <span className="font-bold uppercase text-xs">Log Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-6">
          <div className="flex-1">
            <h1 className="font-display text-xl font-bold italic uppercase tracking-tight text-primary">
              {title}
            </h1>
            {description && <p className="text-xs text-muted-foreground font-medium">{description}</p>}
          </div>
          <Button variant="outline" size="sm" asChild className="font-bold hover:bg-primary hover:text-primary-foreground">
            <Link to="/">View Site</Link>
          </Button>
        </header>

        <div className="p-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}