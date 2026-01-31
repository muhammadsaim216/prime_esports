import { useState, useEffect } from "react";
import { Search, User, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AdminLayout } from "./AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Profile {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  discord_id: string | null;
  created_at: string;
  role: "admin" | "moderator" | "user"; 
}

export default function AdminPlayers() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchAllProfiles();
  }, []);

  const fetchAllProfiles = async () => {
    setLoading(true);
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profileError) {
      toast({ title: "Fetch Error", description: profileError.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const { data: roleData } = await supabase.from("user_roles").select("user_id, role");
    const roleMap = new Map(roleData?.map((r) => [r.user_id, r.role]) || []);

    const mergedData = profileData.map((p) => ({
      ...p,
      role: (roleMap.get(p.user_id) || "user") as "admin" | "moderator" | "user",
    }));

    setProfiles(mergedData);
    setLoading(false);
  };

  const handleRoleUpdate = async (userId: string, newRole: "admin" | "moderator" | "user") => {
    // Correctly update role: Delete existing and insert new (standard Supabase pattern for this table)
    await supabase.from("user_roles").delete().eq("user_id", userId);

    if (newRole !== "user") {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: newRole });
      if (error) {
        toast({ title: "Update Failed", description: error.message, variant: "destructive" });
        return;
      }
    }

    toast({ title: "Success", description: "Role updated successfully!" });
    fetchAllProfiles();
  };

  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch = p.username.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout title="USER DIRECTORY" description="Manage all registered profiles">
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search all profiles..." 
            className="pl-10 h-12 rounded-xl" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Profiles</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
            <SelectItem value="moderator">Moderators</SelectItem>
            <SelectItem value="user">Users</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Badge variant="secondary" className="px-3 py-1 rounded-lg">
          {profiles.length} Profiles Registered
        </Badge>
      </div>

      <div className="grid gap-3">
        {loading ? (
          <div className="text-center py-10">Updating Directory...</div>
        ) : (
          filteredProfiles.map((profile) => (
            <Card key={profile.id} className="rounded-2xl border-muted/50">
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback className="font-bold bg-muted text-muted-foreground">
                      {profile.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold uppercase italic">{profile.username}</h4>
                      {profile.role !== 'user' && (
                        <Badge className={`${profile.role === 'admin' ? 'bg-red-500' : 'bg-blue-500'} text-[10px] h-5 uppercase`}>
                          {profile.role}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">Joined {format(new Date(profile.created_at), "MMM d, yyyy")}</p>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-xl font-bold gap-2">
                      <UserPlus className="h-4 w-4" /> CHANGE ROLE
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-3xl max-w-[400px] max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-center uppercase font-black">Change Role</AlertDialogTitle>
                      <AlertDialogDescription className="text-center">Select status for {profile.username}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid gap-3 py-4">
                      <Button variant={profile.role === "user" ? "default" : "secondary"} className="h-12 rounded-xl font-bold" onClick={() => handleRoleUpdate(profile.user_id, "user")}>USER</Button>
                      <Button variant={profile.role === "moderator" ? "default" : "secondary"} className="h-12 rounded-xl font-bold" onClick={() => handleRoleUpdate(profile.user_id, "moderator")}>MODERATOR</Button>
                      <Button className={`h-12 rounded-xl font-bold ${profile.role !== "admin" ? "bg-red-600 hover:bg-red-700 text-white" : ""}`} onClick={() => handleRoleUpdate(profile.user_id, "admin")}>ADMIN</Button>
                    </div>
                    <AlertDialogFooter className="sm:justify-center">
                      <AlertDialogCancel className="w-full rounded-xl border-none bg-muted/50 font-bold uppercase">Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
}