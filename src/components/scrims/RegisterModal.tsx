import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface RegisterModalProps {
  scrim: any;
  isOpen: boolean;
  onClose: () => void;
}

export function RegisterModal({ scrim, isOpen, onClose }: RegisterModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    team_name: "",
    captain_discord: "",
    contact_number: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("registrations")
        .insert([
          {
            scrim_id: scrim.id,
            team_name: formData.team_name,
            captain_discord: formData.captain_discord,
            contact_number: formData.contact_number,
            status: "pending"
          }
        ]);

      if (error) throw error;

      toast.success("Registration Submitted! We will contact you on Discord.");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f0f0f] border-white/10 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic tracking-tight">
            Register for <span className="text-[#e91e63]">{scrim?.title}</span>
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Fill in your team details to secure your slot.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Team Name</label>
            <Input 
              required
              className="bg-black border-white/10 focus:border-[#e91e63] text-white"
              placeholder="e.g. PRIME ELITE"
              value={formData.team_name}
              onChange={(e) => setFormData({...formData, team_name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Captain Discord ID</label>
            <Input 
              required
              className="bg-black border-white/10 focus:border-[#e91e63] text-white"
              placeholder="username#0000"
              value={formData.captain_discord}
              onChange={(e) => setFormData({...formData, captain_discord: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">WhatsApp / Contact</label>
            <Input 
              required
              className="bg-black border-white/10 focus:border-[#e91e63] text-white"
              placeholder="+92 300 1234567"
              value={formData.contact_number}
              onChange={(e) => setFormData({...formData, contact_number: e.target.value})}
            />
          </div>

          <Button 
            disabled={loading}
            className="w-full bg-[#e91e63] hover:bg-[#d81b60] text-white font-black uppercase tracking-widest h-12 italic"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Registration"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}