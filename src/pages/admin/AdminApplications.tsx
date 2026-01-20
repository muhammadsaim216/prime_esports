import { useState, useEffect } from "react";
import { Check, X, Clock, Mail, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Application {
  id: string;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  profiles: { username: string; discord_id: string | null } | null;
  scrims: { title: string; game: string } | null;
}

export default function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("scrim_applications")
      .select(`
        id,
        message,
        status,
        created_at,
        profiles:user_id (username, discord_id),
        scrims:scrim_id (title, game)
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setApplications(data as unknown as Application[]);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("scrim_applications")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: `Application ${status}!` });
      fetchApplications();
      setSelectedApp(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500 gap-1"><Check className="h-3 w-3" /> Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="gap-1"><X className="h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const pendingCount = applications.filter((a) => a.status === "pending").length;

  return (
    <AdminLayout title="Applications" description="Review and manage scrim applications">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{applications.length} total</Badge>
          {pendingCount > 0 && (
            <Badge className="bg-yellow-500">{pendingCount} pending</Badge>
          )}
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-24" />
            </Card>
          ))}
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {filter === "all" ? "No applications yet." : `No ${filter} applications.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <Card key={app.id} className="hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setSelectedApp(app)}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{app.profiles?.username || "Unknown User"}</h4>
                    {getStatusBadge(app.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Applied for: <span className="text-foreground">{app.scrims?.title}</span> • {app.scrims?.game}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(app.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                {app.status === "pending" && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-green-600" onClick={(e) => { e.stopPropagation(); updateStatus(app.id, "approved"); }}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive" onClick={(e) => { e.stopPropagation(); updateStatus(app.id, "rejected"); }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Application Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review the application from {selectedApp?.profiles?.username}
            </DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Applicant</p>
                  <p className="font-semibold">{selectedApp.profiles?.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedApp.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Scrim</p>
                  <p className="font-semibold">{selectedApp.scrims?.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Game</p>
                  <p className="font-semibold">{selectedApp.scrims?.game}</p>
                </div>
              </div>

              {selectedApp.profiles?.discord_id && (
                <div>
                  <p className="text-sm text-muted-foreground">Discord</p>
                  <p className="font-semibold">{selectedApp.profiles.discord_id}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground mb-2">Message</p>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm">{selectedApp.message || "No message provided."}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Applied</p>
                <p>{format(new Date(selectedApp.created_at), "MMMM d, yyyy 'at' h:mm a")}</p>
              </div>

              {selectedApp.status === "pending" && (
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1 gap-2" onClick={() => updateStatus(selectedApp.id, "approved")}>
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                  <Button variant="destructive" className="flex-1 gap-2" onClick={() => updateStatus(selectedApp.id, "rejected")}>
                    <X className="h-4 w-4" /> Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
