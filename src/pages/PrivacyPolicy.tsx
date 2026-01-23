import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      
      <main className="flex-grow pt-40 pb-20 container mx-auto px-4 max-w-4xl">
        <Badge className="mb-4 bg-[#e91e63]/10 text-[#e91e63] border-[#e91e63]/30">Legal Documentation</Badge>
        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4 text-white">
          Privacy <span className="text-[#e91e63]">Policy</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-12">Effective Date: January 23, 2026</p>
        
        <div className="space-y-10 border-t border-white/10 pt-10">
          <section>
            <h2 className="text-xl font-bold text-white uppercase italic mb-4">1. Introduction</h2>
            <p className="text-zinc-300 leading-relaxed">
              Prime Esports (“we”, “us”, “our”) built the Prime Esports webapp used for managing esports players, scrims, announcements, and related features (“Service”). This Privacy Policy explains what information we collect, how it’s used, and users’ rights regarding that information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase italic mb-4">2. Information We Collect</h2>
            <ul className="list-disc pl-5 text-zinc-300 space-y-3">
              <li><strong className="text-white">Personal Data:</strong> When you register or interact with the app, we may collect your name, email address, username, and any other data you choose to provide.</li>
              <li><strong className="text-white">Usage Data:</strong> We may automatically collect data about how the Service is accessed and used, such as IP address, device type, browser type, pages visited, and timestamps.</li>
              <li><strong className="text-white">Cookies:</strong> We use cookies to enhance your experience and analyze site usage.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase italic mb-4">3. How We Use Your Information</h2>
            <p className="text-zinc-300 mb-4">We use your information to:</p>
            <ul className="list-disc pl-5 text-zinc-300 space-y-2">
              <li>Provide and maintain the Service</li>
              <li>Improve user experience</li>
              <li>Send updates or announcements if you consent</li>
              <li>Monitor and prevent abuse or violations of our terms</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white uppercase italic mb-4">4. Third-Party Sharing</h2>
            <p className="text-zinc-300 italic bg-zinc-900/50 p-4 border-l-2 border-[#e91e63]">
              We may share your data with service providers who help operate the Service. We do not sell your personal information to third parties outside necessary operations.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}