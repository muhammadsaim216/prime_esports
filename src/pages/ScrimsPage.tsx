import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, DollarSign, Gamepad2, ArrowRight, MapPin } from "lucide-react";
import { format } from "date-fns";

export default function ScrimsPage() {
  const [scrims, setScrims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicScrims();
  }, []);

  const fetchPublicScrims = async () => {
    const { data, error } = await supabase
      .from("scrims")
      .select("*")
      .in("status", ["upcoming", "live"])
      .order("scheduled_at", { ascending: true });

    if (!error) setScrims(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col selection:bg-[#e91e63]">
      {/* CRITICAL FIX: This style tag forces the Footer text to be 
         Bright White regardless of what the original component says.
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        footer, footer p, footer span, footer a {
          color: #ffffff !important;
          opacity: 1 !important;
        }
        footer h4 {
          color: #e91e63 !important;
        }
        footer a:hover {
          color: #e91e63 !important;
        }
      `}} />

      <Header />

      <main className="flex-grow pt-32">
        {/* Hero Section */}
        <section className="relative pb-20 overflow-hidden bg-gradient-to-b from-[#2a131a] via-[#0a0a0a] to-[#0a0a0a]">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-[#e91e63]/10 text-[#e91e63] border-[#e91e63]/30 px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase italic">
              #1 Esports Organization
            </Badge>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 italic leading-none">
              AVAILABLE <span className="text-[#e91e63]">SCRIMS</span>
            </h1>
          </div>
        </section>

        {/* Scrims Cards Grid */}
        <div className="container mx-auto px-4 pb-32">
          {loading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-[#141414] rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {scrims.map((scrim) => (
                <Card key={scrim.id} className="bg-[#141414] border-white/10 rounded-2xl overflow-hidden hover:border-[#e91e63]/50 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-2 px-3 py-1 bg-black rounded-lg border border-white/10">
                        <Gamepad2 className="w-4 h-4 text-[#e91e63]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white italic">
                          {scrim.game}
                        </span>
                      </div>
                      <Badge className="bg-[#e91e63] text-white font-black italic text-[10px] uppercase px-3 py-1 border-none">
                        {scrim.team_format}
                      </Badge>
                    </div>

                    {/* Forced high-contrast title */}
                    <h3 className="text-2xl font-black uppercase italic mb-8 tracking-tight text-white leading-tight">
                      {scrim.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-y-8 mb-10 border-t border-white/5 pt-8">
                      <div className="space-y-2">
                        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest italic">Date</p>
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                          <Calendar className="w-4 h-4 text-[#e91e63]" />
                          {format(new Date(scrim.scheduled_at), "MMM dd, p")}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest italic">Slots</p>
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                          <Users className="w-4 h-4 text-[#e91e63]" />
                          {scrim.max_players} Teams
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest italic">Entry</p>
                        <div className="flex items-center gap-2 text-sm font-bold text-[#e91e63]">
                          <DollarSign className="w-4 h-4" />
                          {scrim.is_paid ? `RS ${scrim.price}` : "FREE"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest italic">Region</p>
                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                          <MapPin className="w-4 h-4 text-[#e91e63]" />
                          SA / PK
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-[#e91e63] hover:bg-[#d81b60] text-white font-black uppercase tracking-widest h-14 rounded-xl group italic">
                      Register Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}