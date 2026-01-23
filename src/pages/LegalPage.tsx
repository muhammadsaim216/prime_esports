import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface LegalPageProps {
  title: string;
  content: React.ReactNode;
}

export default function LegalPage({ title, content }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      
      <main className="flex-grow pt-40 pb-20 container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-12 text-[#e91e63]">
          {title}
        </h1>
        
        <div className="prose prose-invert prose-zinc max-w-none border-t border-white/10 pt-10">
          <div className="space-y-8 text-zinc-300 leading-relaxed font-medium">
            {content}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}