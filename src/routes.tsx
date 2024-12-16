import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
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
import WithdrawalDetails from "./pages/WithdrawalDetails";
import Notifications from "./pages/Notifications";
import NotificationDetails from "./pages/NotificationDetails";
import AuthIndex from "./pages/auth/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ReferralStats from "./pages/ReferralStats";
import PriceAlerts from "./pages/PriceAlerts";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    // Save current URL for redirect after login, but only if it's not an auth route
    const currentPath = window.location.pathname;
    if (!currentPath.startsWith('/auth')) {
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (user) {
    // Check for saved redirect URL
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
    sessionStorage.removeItem('redirectAfterLogin');
    return <Navigate to={redirectUrl || "/"} />;
  }

  return <>{children}</>;
};

export const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route
      path="/auth"
      element={
        <PublicRoute>
          <AuthIndex />
        </PublicRoute>
      }
    />
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
      path="/withdrawals/:id"
      element={
        <PrivateRoute>
          <WithdrawalDetails />
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
    <Route
      path="/referral-stats"
      element={
        <PrivateRoute>
          <ReferralStats />
        </PrivateRoute>
      }
    />
    <Route
      path="/price-alerts"
      element={
        <PrivateRoute>
          <PriceAlerts />
        </PrivateRoute>
      }
    />

    {/* Catch all route - redirect to auth for unauthenticated users */}
    <Route path="*" element={<Navigate to="/auth" replace />} />
  </Routes>
);
