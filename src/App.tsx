
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Index";
import Bookings from "./pages/Bookings";
import NotFound from "./pages/NotFound";
import UserDashboard from "./pages/UserDashboard";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";

// Components
import { AuthModal } from "./components/auth/AuthModal";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "receptionist" | "user" | null>(null);

  // Handling authentication state changes
  const handleAuthChange = (open: boolean) => {
    setAuthModalOpen(open);
  };

  // Handle successful login
  const handleLoginSuccess = (role: "admin" | "receptionist" | "user") => {
    setIsAuthenticated(true);
    setUserRole(role);
    setAuthModalOpen(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthModal 
            open={authModalOpen} 
            onOpenChange={handleAuthChange}
            onLoginSuccess={handleLoginSuccess} 
          />
          
          {isAuthenticated ? (
            <Routes>
              {/* Admin routes */}
              {userRole === "admin" && (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/bookings" element={<Bookings />} />
                </>
              )}
              
              {/* Receptionist routes */}
              {userRole === "receptionist" && (
                <>
                  <Route path="/" element={<ReceptionistDashboard />} />
                  <Route path="/bookings" element={<Bookings />} />
                </>
              )}
              
              {/* User/Guest routes */}
              {userRole === "user" && (
                <>
                  <Route path="/" element={<UserDashboard />} />
                </>
              )}
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<LandingPage onLogin={() => setAuthModalOpen(true)} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
