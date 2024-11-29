import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LocationProvider } from "./contexts/LocationContext";
import BottomNav from "./components/BottomNav";
import Index from "./pages/Index";
import Scanner from "./pages/Scanner";
import History from "./pages/History";
import Stations from "./pages/Stations";
import Settings from "./pages/Settings";
import Balance from "./pages/Balance";
import ReceiptDetails from "./pages/ReceiptDetails";
import Premium from "./pages/Premium";
import Referral from "./pages/Referral";
import WithdrawalRequest from "./pages/WithdrawalRequest";
import Notifications from "./pages/Notifications";
import NotificationDetails from "./pages/NotificationDetails";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LocationProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-md mx-auto bg-white min-h-screen relative px-6">
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/auth/login"
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/auth/register"
                    element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/auth/forgot-password"
                    element={
                      <PublicRoute>
                        <ForgotPassword />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/auth/reset-password"
                    element={
                      <PublicRoute>
                        <ResetPassword />
                      </PublicRoute>
                    }
                  />

                  {/* Protected Routes */}
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <Index />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/scanner"
                    element={
                      <PrivateRoute>
                        <Scanner />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      <PrivateRoute>
                        <History />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/stations"
                    element={
                      <PrivateRoute>
                        <Stations />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/stations/:id"
                    element={
                      <PrivateRoute>
                        <Stations />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <PrivateRoute>
                        <Settings />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/balance"
                    element={
                      <PrivateRoute>
                        <Balance />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/receipts/:id"
                    element={
                      <PrivateRoute>
                        <ReceiptDetails />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/premium"
                    element={
                      <PrivateRoute>
                        <Premium />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/referral"
                    element={
                      <PrivateRoute>
                        <Referral />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/withdrawal-request"
                    element={
                      <PrivateRoute>
                        <WithdrawalRequest />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/notifications"
                    element={
                      <PrivateRoute>
                        <Notifications />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/notifications/:id"
                    element={
                      <PrivateRoute>
                        <NotificationDetails />
                      </PrivateRoute>
                    }
                  />
                </Routes>
                <BottomNav />
              </BrowserRouter>
            </div>
          </div>
        </TooltipProvider>
      </LocationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;