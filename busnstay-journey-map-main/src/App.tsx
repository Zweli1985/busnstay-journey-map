import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SharedJourney from "./pages/SharedJourney";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AccountDashboard from "./pages/AccountDashboard";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import RiderDashboard from "./pages/RiderDashboard";
import TaxiDashboard from "./pages/TaxiDashboard";
import HotelDashboard from "./pages/HotelDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PWAInstallPrompt from "./components/PWAInstallPrompt";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PWAInstallPrompt />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account" element={<AccountDashboard />} />
            <Route path="/restaurant" element={<RestaurantDashboard />} />
            <Route path="/rider" element={<RiderDashboard />} />
            <Route path="/taxi" element={<TaxiDashboard />} />
            <Route path="/hotel" element={<HotelDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/share/:shareCode" element={<SharedJourney />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
