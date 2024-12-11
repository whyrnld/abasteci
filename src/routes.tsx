import { Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "@/components/PrivateRoute";
import { PublicRoute } from "@/components/PublicRoute";

import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Stations from "@/pages/Stations";
import Receipts from "@/pages/Receipts";
import Wallet from "@/pages/Wallet";
import Referral from "@/pages/Referral";
import ReferralStats from "@/pages/ReferralStats";
import PriceAlerts from "@/pages/PriceAlerts";

export const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
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

    <Route
      path="/profile"
      element={
        <PrivateRoute>
          <Profile />
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
      path="/receipts"
      element={
        <PrivateRoute>
          <Receipts />
        </PrivateRoute>
      }
    />

    <Route
      path="/wallet"
      element={
        <PrivateRoute>
          <Wallet />
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

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);