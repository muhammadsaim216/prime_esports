import { useState, useEffect } from "react";
import { Search, Shield, ShieldCheck, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Player {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  discord_id: string | null;
  created_at: string;
  role: string | null;
}

export default function AdminPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      toast({ title: "Error", description: profilesError.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id, role");

    if (rolesError) {
      toast({ title: "Error", description: rolesError.message, variant: "destructive" });
    }

    const roleMap = new Map(roles?.map((r) => [r.user_id, r.role]) || []);

    const playersWithRoles = profiles?.map((p) => ({
      ...p,
      role: roleMap.get(p.user_id) || "user",
    })) || [];

    setPlayers(playersWithRoles);
    setLoading(false);
  };

  const updateRole = async (userId: string, newRole: "admin" | "moderator" | "user") => {
    // First delete existing role
    await supabase.from("user_roles").delete().eq("user_id", userId);

    // Then insert new role
    const { error } = await supabase.from("user_roles").insert({
      user_id: userId,
      role: newRole,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: `Role updated to ${newRole}` });
      fetchPlayers();
    }
  };

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.username.toLowerCase().includes(search.toLowerCase()) ||
      player.discord_id?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || player.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string | null) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500 gap-1"><ShieldCheck className="h-3 w-3" /> Admin</Badge>;
      case "moderator":
        return <Badge className="bg-blue-500 gap-1"><Shield className="h-3 w-3" /> Moderator</Badge>;
      default:
        return <Badge variant="secondary" className="gap-1"><User className="h-3 w-3" /> User</Badge>;
    }
  };

  return (
    <AdminLayout title="Player Management" description="View and manage registered players">
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by username or Discord..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
            <SelectItem value="moderator">Moderators</SelectItem>
            <SelectItem value="user">Users</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary">{players.length} total players</Badge>
        <Badge className="bg-red-500">{players.filter((p) => p.role === "admin").length} admins</Badge>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-20" />
            </Card>
          ))}
        </div>
      ) : filteredPlayers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No players found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPlayers.map((player) => (
            <Card key={player.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={player.avatar_url || undefined} />
                    <AvatarFallback>{player.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{player.username}</h4>
                      {getRoleBadge(player.role)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {player.discord_id || "No Discord"} • Joined {format(new Date(player.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">Change Role</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Change Role for {player.username}</AlertDialogTitle>
                        <AlertDialogDescription>
                          Select a new role for this user. Admins have full access to the admin panel.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="grid grid-cols-3 gap-2 py-4">
                        <Button
                          variant={player.role === "user" ? "default" : "outline"}
                          onClick={() => updateRole(player.user_id, "user")}
                        >
                          User
                        </Button>
                        <Button
                          variant={player.role === "moderator" ? "default" : "outline"}
                          onClick={() => updateRole(player.user_id, "moderator")}
                        >
                          Moderator
                        </Button>
                        <Button
                          variant={player.role === "admin" ? "default" : "outline"}
                          className={player.role !== "admin" ? "bg-red-500 hover:bg-red-600" : ""}
                          onClick={() => updateRole(player.user_id, "admin")}
                        >
                          Admin
                        </Button>
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
