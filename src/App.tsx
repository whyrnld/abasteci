import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LocationProvider } from "./contexts/LocationContext";
import BottomNav from "./components/BottomNav";
import { AppRoutes } from "./routes";

const queryClient = new QueryClient();

const App = () => {
  const { user } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocationProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-gray-50">
              <div className="max-w-md mx-auto bg-white min-h-screen relative px-6">
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppRoutes />
                  {user && <BottomNav />}
                </BrowserRouter>
              </div>
            </div>
          </TooltipProvider>
        </LocationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;