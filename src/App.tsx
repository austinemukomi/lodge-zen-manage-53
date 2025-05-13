
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Pages
import Dashboard from "./pages/Index";
import Bookings from "./pages/Bookings";
import NotFound from "./pages/NotFound";

// Components
import { AuthModal } from "./components/auth/AuthModal";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(true);

  // Handling authentication state changes
  const handleAuthChange = (open: boolean) => {
    setAuthModalOpen(open);
    // If modal is closed and user is not authenticated, reopen it
    if (!open && !isAuthenticated) {
      setTimeout(() => setAuthModalOpen(true), 100);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {isAuthenticated ? (
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          ) : (
            <>
              <AuthModal open={authModalOpen} onOpenChange={handleAuthChange} />
              <div className="h-screen flex items-center justify-center bg-[#F9FAFB]">
                {/* This div ensures the page has content while the modal is open */}
              </div>
            </>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
