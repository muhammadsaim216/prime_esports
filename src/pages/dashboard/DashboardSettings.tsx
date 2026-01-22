import { Link, useNavigate } from "react-router-dom";
import { User, FileText, Bell, Settings, ChevronRight, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { profileSchema, ProfileFormData } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

const navItems = [
  { icon: User, label: "Profile", href: "/dashboard" },
  { icon: FileText, label: "My Applications", href: "/dashboard/applications" },
  { icon: Bell, label: "Announcements", href: "/dashboard/announcements" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardSettings() {
  const { user, username, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      discord_id: "",
    },
  });

  const displayName = username || user?.email?.split('@')[0] || 'Player';

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("username, discord") // Changed discord_id to discord
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      form.reset({
        username: data.username || "",
        discord_id: data.discord || "", // Map 'discord' to form 'discord_id'
      });
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setLoading(true);
    // CRITICAL FIX: The key must be 'discord' to match your Supabase column
    const { error } = await supabase
      .from("profiles")
      .update({
        username: data.username,
        discord: data.discord_id, // Map form 'discord_id' to DB 'discord'
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    setLoading(false);

    if (error) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      
      // Update metadata so the Header updates without a full reload
      await supabase.auth.updateUser({
        data: { username: data.username }
      });

      // Give the user a moment to see the toast before reload
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
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

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">
            Account <span className="text-primary">Settings</span>
          </h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
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
                    item.href === "/dashboard/settings" ? "bg-secondary" : ""
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
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile details</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <FormLabel>Email</FormLabel>
                      <Input type="email" value={user?.email || ""} disabled />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Your display name" {...field} />
                          </FormControl>
                          <FormDescription>
                            Only letters, numbers, and underscores allowed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="discord_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discord ID</FormLabel>
                          <FormControl>
                            <Input placeholder="YourName#1234" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={loading} className="gap-2">
                      <Save className="h-4 w-4" />
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={handleLogout}>
                  Log Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}