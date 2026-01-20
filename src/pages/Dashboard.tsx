import { useEffect, useState } from "react";
import { 
  User as UserIcon, 
  FileText, 
  Bell, 
  Settings, 
  ChevronRight 
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string>("Loading...");
  const [applications, setApplications] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealUserData = async () => {
      if (!user) return;
      setLoading(true);

      // 1. TRY LOCATION A: Supabase Auth Metadata (fastest)
      let finalName = user.user_metadata?.username || user.user_metadata?.display_name;

      // 2. TRY LOCATION B: The Profiles Table (most accurate)
      if (!finalName || finalName.includes('howsaim216')) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .maybeSingle();
        
        if (profileData?.username) {
          finalName = profileData.username;
        }
      }

      // 3. FALLBACK: If both fail, use the email prefix
      setDisplayName(finalName || user.email?.split('@')[0] || "Player");

      // Fetch Applications
      const { data: apps } = await supabase
        .from("applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Fetch Announcements
      const { data: anns } = await supabase
        .from("announcements")
        .select("*")
        .limit(3);

      if (apps) setApplications(apps);
      if (anns) setAnnouncements(anns);
      setLoading(false);
    };

    fetchRealUserData();
  }, [user]);

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">
            Welcome back, <span className="text-primary">{displayName}</span>
          </h1>
          <p className="text-muted-foreground">Manage your profile and track your applications</p>
        </div>

        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          <aside className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl uppercase">
                    {displayName[0]}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                <nav className="space-y-1">
                  <Button variant="ghost" className="w-full justify-between font-normal"><div className="flex items-center gap-2"><UserIcon className="h-4 w-4" /> Profile</div> <ChevronRight className="h-4 w-4" /></Button>
                  <Button variant="ghost" className="w-full justify-between font-normal"><div className="flex items-center gap-2"><FileText className="h-4 w-4" /> My Applications</div> <ChevronRight className="h-4 w-4" /></Button>
                  <Button variant="ghost" className="w-full justify-between font-normal"><div className="flex items-center gap-2"><Bell className="h-4 w-4" /> Announcements</div> <ChevronRight className="h-4 w-4" /></Button>
                  <Button variant="ghost" className="w-full justify-between font-normal"><div className="flex items-center gap-2"><Settings className="h-4 w-4" /> Settings</div> <ChevronRight className="h-4 w-4" /></Button>
                </nav>
              </CardContent>
            </Card>
          </aside>

          <main className="space-y-8">
            <Card>
              <CardHeader><CardTitle className="text-xl">My Tryout Applications</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {loading ? <Skeleton className="h-20 w-full" /> : applications.length > 0 ? (
                  applications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div><p className="font-bold">{app.position}</p><p className="text-sm text-muted-foreground">{app.team}</p></div>
                      <Badge variant="outline">{app.status}</Badge>
                    </div>
                  ))
                ) : <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">No applications found.</div>}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </Layout>
  );
}