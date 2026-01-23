import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      
      <main className="flex-grow pt-40 pb-20 container mx-auto px-4 max-w-4xl">
        <Badge className="mb-4 bg-[#e91e63]/10 text-[#e91e63] border-[#e91e63]/30">Legal Documentation</Badge>
        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-12 text-white">
          Terms of <span className="text-[#e91e63]">Service</span>
        </h1>
        
        <div className="space-y-10 border-t border-white/10 pt-10">
          <section className="bg-zinc-900/30 p-6 rounded-2xl border border-white/5">
            <h2 className="text-xl font-bold text-white uppercase italic mb-4">1. Acceptance of Terms</h2>
            <p className="text-zinc-300 leading-relaxed">
              By accessing or using the Prime Esports Service, you agree to be bound by these Terms of Service (“Terms”). If you do not agree, you may not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase italic mb-4">2. Use of the Service</h2>
            <p className="text-zinc-300">
              You must follow all rules and regulations. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase italic mb-4">3. User Conduct</h2>
            <p className="text-zinc-300 mb-4 font-bold">You agree not to use the Service to:</p>
            <ul className="list-disc pl-5 text-zinc-300 space-y-2">
              <li>Violate any law or regulation</li>
              <li>Post harmful or offensive content</li>
              <li>Attempt to access unauthorized areas of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase italic mb-4">4. Intellectual Property</h2>
            <p className="text-zinc-300 italic">
              All code, designs, logos, and content associated with the Service remain the property of Prime Esports. You may not copy or use them outside of what is explicitly allowed.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}