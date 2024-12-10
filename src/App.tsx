import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LocationProvider } from "./contexts/LocationContext";
import BottomNav from "./components/BottomNav";
import routes from "./routes";
import { useAuth } from "./contexts/AuthContext";
import { Routes, Route } from "react-router-dom";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen relative">
        <Toaster />
        <Sonner />
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
        {user && <BottomNav />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocationProvider>
          <TooltipProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </LocationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;