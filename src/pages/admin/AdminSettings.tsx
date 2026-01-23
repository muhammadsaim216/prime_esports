import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Settings, Shield, Bell, Globe, Database, Users } from "lucide-react";

const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required").max(100, "Site name must be less than 100 characters"),
  siteDescription: z.string().max(500, "Description must be less than 500 characters").optional(),
  contactEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  discordInviteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitterUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;

export default function AdminSettings() {
  const { toast } = useToast();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoApproveApplications, setAutoApproveApplications] = useState(false);

  const form = useForm<SiteSettingsFormData>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: "Prime Esports",
      siteDescription: "Professional esports organization",
      contactEmail: "",
      discordInviteUrl: "",
      twitterUrl: "",
    },
  });

  const onSubmit = async (data: SiteSettingsFormData) => {
    try {
      // TODO: Save settings to database
      console.log("Settings saved:", data);
      toast({
        title: "Settings saved",
        description: "Your site settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings. Please try again.",
      });
    }
  };

  const handleToggleChange = (setting: string, value: boolean) => {
    toast({
      title: "Setting updated",
      description: `${setting} has been ${value ? "enabled" : "disabled"}.`,
    });
  };

  return (
    <AdminLayout title="Settings" description="Manage your site configuration and preferences">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Site Configuration
              </CardTitle>
              <CardDescription>
                Manage your site's basic information and branding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your organization name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This will be displayed in the header and browser title
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="siteDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description of your organization" {...field} />
                        </FormControl>
                        <FormDescription>
                          Used for SEO and social media previews
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="contact@example.com" {...field} />
                        </FormControl>
                        <FormDescription>
                          Public contact email for inquiries
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discordInviteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discord Invite URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://discord.gg/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="twitterUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter/X URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://twitter.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Save Changes</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage access controls and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="registration">User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to create accounts
                  </p>
                </div>
                <Switch
                  id="registration"
                  checked={registrationEnabled}
                  onCheckedChange={(checked) => {
                    setRegistrationEnabled(checked);
                    handleToggleChange("User registration", checked);
                  }}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable public access to the site
                  </p>
                </div>
                <Switch
                  id="maintenance"
                  checked={maintenanceMode}
                  onCheckedChange={(checked) => {
                    setMaintenanceMode(checked);
                    handleToggleChange("Maintenance mode", checked);
                  }}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-approve">Auto-Approve Applications</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve scrim applications
                  </p>
                </div>
                <Switch
                  id="auto-approve"
                  checked={autoApproveApplications}
                  onCheckedChange={(checked) => {
                    setAutoApproveApplications(checked);
                    handleToggleChange("Auto-approve applications", checked);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how notifications are sent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications for important events
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={(checked) => {
                    setEmailNotifications(checked);
                    handleToggleChange("Email notifications", checked);
                  }}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Events</h4>
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">New application submitted</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">User registration</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">Scrim scheduled</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="font-normal">Stream goes live</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Advanced Settings
              </CardTitle>
              <CardDescription>
                System administration and data management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  These actions are irreversible. Please proceed with caution.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    Clear Cache
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    Reset Statistics
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    Export Data
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">System Information</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version</span>
                    <span>1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Environment</span>
                    <span>Production</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Database</span>
                    <span className="text-primary">Connected</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
