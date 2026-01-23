import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <main className="flex-grow pt-40 pb-20 container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-black uppercase italic text-[#e91e63] mb-8">Terms of Service</h1>
        <div className="prose prose-invert text-zinc-300">
          <p>By using our platform, you agree to the following rules...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}