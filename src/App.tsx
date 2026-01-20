import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Home from "./pages/Home";
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";
import Tryouts from "./pages/Tryouts";
import Scrims from "./pages/Scrims";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminScrims from "./pages/admin/AdminScrims";
import AdminStreams from "./pages/admin/AdminStreams";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminPlayers from "./pages/admin/AdminPlayers";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:id" element={<TeamDetail />} />
            <Route path="/tryouts" element={<Tryouts />} />
            <Route path="/scrims" element={<Scrims />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminOverview />} />
            <Route path="/admin/scrims" element={<AdminScrims />} />
            <Route path="/admin/streams" element={<AdminStreams />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
            <Route path="/admin/players" element={<AdminPlayers />} />
            <Route path="/admin/announcements" element={<AdminAnnouncements />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
