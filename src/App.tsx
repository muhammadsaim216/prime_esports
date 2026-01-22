import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import DashboardApplications from "./pages/dashboard/DashboardApplications";
import DashboardAnnouncements from "./pages/dashboard/DashboardAnnouncements";
import DashboardSettings from "./pages/dashboard/DashboardSettings";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminScrims from "./pages/admin/AdminScrims";
import AdminStreams from "./pages/admin/AdminStreams";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminPlayers from "./pages/admin/AdminPlayers";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminTeams from "./pages/admin/AdminTeams";
import AdminTryouts from "./pages/admin/AdminTryouts";
import AdminNews from "./pages/admin/AdminNews";
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
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:id" element={<TeamDetail />} />
            <Route path="/tryouts" element={<Tryouts />} />
            <Route path="/scrims" element={<Scrims />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected user dashboard routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/applications"
              element={
                <ProtectedRoute>
                  <DashboardApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/announcements"
              element={
                <ProtectedRoute>
                  <DashboardAnnouncements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute>
                  <DashboardSettings />
                </ProtectedRoute>
              }
            />

            {/* Protected admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/scrims"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminScrims />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/streams"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminStreams />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/players"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminPlayers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/announcements"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminAnnouncements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/teams"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminTeams />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tryouts"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminTryouts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/news"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminNews />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
