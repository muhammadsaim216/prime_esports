import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      
      <main className="flex-grow pt-40 pb-20 container mx-auto px-4 max-w-4xl">
        <Badge className="mb-4 bg-[#e91e63]/10 text-[#e91e63] border-[#e91e63]/30">Legal Documentation</Badge>
        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-12 text-white">
          Cookie <span className="text-[#e91e63]">Policy</span>
        </h1>
        
        <div className="space-y-10 border-t border-white/10 pt-10">
          <section>
            <h2 className="text-xl font-bold text-white uppercase italic mb-4">1. What Cookies Are</h2>
            <p className="text-zinc-300 leading-relaxed">
              Cookies are small text files stored on your device when you visit the Service. They help improve functionality, remember preferences, and provide insights into how the site is used.
            </p>
          </section>

          <section className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-zinc-900 rounded-xl border border-white/5">
              <h3 className="font-bold text-[#e91e63] mb-2 uppercase text-xs">Essential</h3>
              <p className="text-xs text-zinc-400">Required for basic functionality like login sessions.</p>
            </div>
            <div className="p-4 bg-zinc-900 rounded-xl border border-white/5">
              <h3 className="font-bold text-[#e91e63] mb-2 uppercase text-xs">Performance</h3>
              <p className="text-xs text-zinc-400">Help us understand how the Service is used.</p>
            </div>
            <div className="p-4 bg-zinc-900 rounded-xl border border-white/5">
              <h3 className="font-bold text-[#e91e63] mb-2 uppercase text-xs">Preference</h3>
              <p className="text-xs text-zinc-400">Remember your settings like theme or language.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase italic mb-4">2. Your Choices</h2>
            <p className="text-zinc-300">
              You can manage your cookie preferences through your browser settings. Note that disabling cookies may limit available features of the Service.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}