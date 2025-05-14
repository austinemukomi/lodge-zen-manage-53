
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Index";
import Bookings from "./pages/Bookings";
import NotFound from "./pages/NotFound";
import UserDashboard from "./pages/UserDashboard";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";

// Components
import { AuthModal } from "./components/auth/AuthModal";
import { UserRole } from "./utils/types";
import { isTokenValid, getUserRoleFromToken, clearAuthToken } from "./utils/authUtils";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Check for existing token on app startup
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && isTokenValid(token)) {
      const role = getUserRoleFromToken();
      if (role) {
        setIsAuthenticated(true);
        setUserRole(role);
      } else {
        clearAuthToken();
      }
    }
  }, []);

  // Handling authentication state changes
  const handleAuthChange = (open: boolean) => {
    setAuthModalOpen(open);
  };

  // Handle successful login
  const handleLoginSuccess = (role: UserRole) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setAuthModalOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    clearAuthToken();
    setIsAuthenticated(false);
    setUserRole(null);
    toast.success("You have been logged out successfully");
    // Navigate to landing page will happen via the Routes below
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
              {userRole === "ADMIN" && (
                <>
                  <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
                  <Route path="/bookings" element={<Bookings onLogout={handleLogout} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
              
              {/* Receptionist routes */}
              {userRole === "RECEPTIONIST" && (
                <>
                  <Route path="/" element={<ReceptionistDashboard onLogout={handleLogout} />} />
                  <Route path="/bookings" element={<Bookings onLogout={handleLogout} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
              
              {/* User/Guest routes */}
              {userRole === "USER" && (
                <>
                  <Route path="/" element={<UserDashboard onLogout={handleLogout} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
              
              {/* Fallback route if role doesn't match any defined routes */}
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
