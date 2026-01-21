import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "./AdminLayout";

interface Tryout {
  id: string;
  team_name: string;
  game: string;
  position: string;
  requirements: string | null;
  description: string | null;
  deadline: string;
  status: string;
}

export default function AdminTryouts() {
  const { toast } = useToast();
  const [tryouts, setTryouts] = useState<Tryout[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTryout, setEditingTryout] = useState<Tryout | null>(null);
  const [formData, setFormData] = useState({
    team_name: "",
    game: "",
    position: "",
    requirements: "",
    description: "",
    deadline: "",
    status: "open",
  });

  useEffect(() => {
    fetchTryouts();
  }, []);

  const fetchTryouts = async () => {
    try {
      const { data, error } = await supabase
        .from('tryouts')
        .select('*')
        .order('deadline');

      if (error) throw error;
      setTryouts(data || []);
    } catch (error) {
      console.error('Error fetching tryouts:', error);
      toast({ title: "Error", description: "Failed to fetch tryouts", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      team_name: "",
      game: "",
      position: "",
      requirements: "",
      description: "",
      deadline: "",
      status: "open",
    });
    setEditingTryout(null);
  };

  const openEditDialog = (tryout: Tryout) => {
    setEditingTryout(tryout);
    setFormData({
      team_name: tryout.team_name,
      game: tryout.game,
      position: tryout.position,
      requirements: tryout.requirements || "",
      description: tryout.description || "",
      deadline: tryout.deadline,
      status: tryout.status,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTryout) {
        const { error } = await supabase
          .from('tryouts')
          .update(formData)
          .eq('id', editingTryout.id);

        if (error) throw error;
        toast({ title: "Success", description: "Tryout updated successfully" });
      } else {
        const { error } = await supabase
          .from('tryouts')
          .insert(formData);

        if (error) throw error;
        toast({ title: "Success", description: "Tryout created successfully" });
      }

      setDialogOpen(false);
      resetForm();
      fetchTryouts();
    } catch (error) {
      console.error('Error saving tryout:', error);
      toast({ title: "Error", description: "Failed to save tryout", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tryouts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Success", description: "Tryout deleted successfully" });
      fetchTryouts();
    } catch (error) {
      console.error('Error deleting tryout:', error);
      toast({ title: "Error", description: "Failed to delete tryout", variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'default';
      case 'closing_soon': return 'destructive';
      case 'closed': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <AdminLayout title="Tryouts" description="Manage open tryout positions">
      <div className="mb-6 flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Tryout
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingTryout ? "Edit Tryout" : "Create Tryout"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="team_name">Team Name *</Label>
                  <Input
                    id="team_name"
                    value={formData.team_name}
                    onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                    placeholder="Prime Valorant"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="game">Game *</Label>
                  <Input
                    id="game"
                    value={formData.game}
                    onChange={(e) => setFormData({ ...formData, game: e.target.value })}
                    placeholder="VALORANT"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="e.g., Duelist, Support"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Input
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="e.g., Immortal 3+, 18+"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the position..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closing_soon">Closing Soon</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingTryout ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tryouts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No tryouts yet. Create your first tryout!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tryouts.map((tryout) => (
            <Card key={tryout.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{tryout.position}</CardTitle>
                    <p className="text-sm text-muted-foreground">{tryout.team_name}</p>
                  </div>
                  <Badge variant={getStatusColor(tryout.status)}>
                    {tryout.status === 'closing_soon' ? 'Closing Soon' : tryout.status.charAt(0).toUpperCase() + tryout.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{tryout.game}</Badge>
                  </div>
                  {tryout.requirements && (
                    <p className="text-sm text-muted-foreground">
                      Requirements: {tryout.requirements}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">{tryout.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Deadline: {new Date(tryout.deadline).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(tryout)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Tryout?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this tryout position.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(tryout.id)}>
                          Delete
                        </AlertDialogAction>
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
