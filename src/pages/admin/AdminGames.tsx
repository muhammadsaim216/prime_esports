import { useState, useEffect } from "react";
import { Plus, Trash2, Gamepad2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function AdminGames() {
  const [games, setGames] = useState<{id: string, name: string}[]>([]);
  const [newGame, setNewGame] = useState("");
  const { toast } = useToast();

  useEffect(() => { fetchGames(); }, []);

  const fetchGames = async () => {
    const { data } = await supabase.from("games").select("*").order("name");
    if (data) setGames(data);
  };

  const addGame = async () => {
    if (!newGame) return;
    const { error } = await supabase.from("games").insert([{ name: newGame }]);
    if (error) {
      toast({ title: "Error", description: "Game already exists or error occurred", variant: "destructive" });
    } else {
      setNewGame("");
      fetchGames();
      toast({ title: "Success", description: "Game added successfully!" });
    }
  };

  const deleteGame = async (id: string) => {
    await supabase.from("games").delete().eq("id", id);
    fetchGames();
  };

  return (
    <AdminLayout title="Game Management" description="Add or remove games supported for Scrims">
      <div className="max-w-md space-y-6">
        <div className="flex gap-2">
          <Input 
            placeholder="Enter Game Name (e.g. Minecraft)" 
            value={newGame} 
            onChange={(e) => setNewGame(e.target.value)} 
          />
          <Button onClick={addGame}><Plus className="h-4 w-4 mr-1" /> Add</Button>
        </div>

        <div className="grid gap-2">
          {games.map((game) => (
            <Card key={game.id}>
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Gamepad2 className="h-4 w-4 text-primary" />
                  <span className="font-medium">{game.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteGame(game.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}