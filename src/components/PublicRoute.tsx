import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  if (loading) {
    return null; // or a loading spinner
  }

  if (user) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};