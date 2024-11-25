import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-md mx-auto bg-white min-h-screen relative px-6">
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/scanner" element={<Scanner />} />
                <Route path="/history" element={<History />} />
                <Route path="/stations" element={<Stations />} />
                <Route path="/stations/:id" element={<Stations />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/balance" element={<Balance />} />
                <Route path="/receipts/:id" element={<ReceiptDetails />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/referral" element={<Referral />} />
                <Route path="/withdrawal-request" element={<WithdrawalRequest />} />
              </Routes>
              <BottomNav />
            </BrowserRouter>
          </div>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;