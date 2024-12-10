import { Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Stations from "./pages/Stations";
import Referral from "./pages/Referral";
import ReferralStats from "./pages/ReferralStats";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import PriceAlerts from "./pages/PriceAlerts";

const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/stations",
    element: <Stations />,
  },
  {
    path: "/referral",
    element: <Referral />,
  },
  {
    path: "/referral-stats",
    element: <ReferralStats />,
  },
  {
    path: "/auth/register",
    element: <Register />,
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/price-alerts",
    element: <PriceAlerts />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
];

export default routes;