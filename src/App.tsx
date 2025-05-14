
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
import { isTokenValid, getUserRoleFromToken, clearAuthToken, parseJwt } from "./utils/authUtils";

const queryClient = new QueryClient();

interface DashboardProps {
  onLogout: () => void;
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Check for existing token on app startup
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && isTokenValid(token)) {
      const decodedToken = parseJwt(token);
      if (decodedToken) {
        const role = decodedToken.role;
        setIsAuthenticated(true);
        setUserRole(role);
        console.log("Auto-authenticated as role:", role);
      } else {
        clearAuthToken();
        console.log("Invalid token, cleared auth");
      }
    }
  }, []);

  // Handling authentication state changes
  const handleAuthChange = (open: boolean) => {
    setAuthModalOpen(open);
  };

  // Handle successful login
  const handleLoginSuccess = (role: UserRole) => {
    console.log("Login successful, role:", role);
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
                  <Route path="/admin" element={<Dashboard onLogout={handleLogout} />} />
                  <Route path="/bookings" element={<Bookings onLogout={handleLogout} />} />
                </>
              )}
              
              {/* Receptionist routes */}
              {userRole === "RECEPTIONIST" && (
                <>
                  <Route path="/" element={<ReceptionistDashboard onLogout={handleLogout} />} />
                  <Route path="/receptionist" element={<ReceptionistDashboard onLogout={handleLogout} />} />
                  <Route path="/bookings" element={<Bookings onLogout={handleLogout} />} />
                </>
              )}
              
              {/* User/Guest routes */}
              {userRole === "USER" && (
                <>
                  <Route path="/" element={<UserDashboard onLogout={handleLogout} />} />
                  <Route path="/user" element={<UserDashboard onLogout={handleLogout} />} />
                </>
              )}
              
              {/* Fallback route if paths don't match */}
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
