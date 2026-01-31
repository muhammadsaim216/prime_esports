import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

export default function AdminRosters() {
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    const { data } = await supabase
      .from('team_applications')
      .select('*, teams(name), profiles(username)') // Assuming you have a profiles table
      .eq('status', 'pending');
    setApps(data || []);
  };

  const handleAction = async (id: string, newStatus: string) => {
    await supabase
      .from('team_applications')
      .update({ status: newStatus })
      .eq('id', id);
    fetchApps(); // Refresh list
  };

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl font-black uppercase italic mb-8 flex items-center gap-3">
          <ShieldAlert className="text-primary" /> Roster Management
        </h1>
        <div className="grid gap-4">
          {apps.map(app => (
            <div key={app.id} className="flex items-center justify-between p-6 bg-secondary/20 rounded-xl border border-white/5">
              <div>
                <p className="font-bold text-lg uppercase italic">{app.profiles?.username || 'Unknown Player'}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Wants to join: {app.teams?.name}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleAction(app.id, 'approved')} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Check className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button onClick={() => handleAction(app.id, 'rejected')} size="sm" variant="destructive">
                  <X className="h-4 w-4 mr-1" /> Reject
                </Button>
              </div>
            </div>
          ))}
          {apps.length === 0 && <p className="text-muted-foreground">No pending roster applications.</p>}
        </div>
      </div>
    </Layout>
  );
}