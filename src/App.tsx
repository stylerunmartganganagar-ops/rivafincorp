import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Transactions from "./pages/Transactions";
import Refunds from "./pages/Refunds";
import Disputes from "./pages/Disputes";
import Settlements from "./pages/Settlements";
import Payouts from "./pages/Payouts";
import Analytics from "./pages/Analytics";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import RefundPolicy from "./pages/RefundPolicy";
import Chargebacks from "./pages/Chargebacks";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Important from "./pages/Important";
import PaymentLinks from "./pages/PaymentLinks";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminAuth from "./pages/admin/AdminAuth";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminUserDetail from "./pages/admin/UserDetail";
import AdminTransactions from "./pages/admin/Transactions";
import AdminSettlements from "./pages/admin/Settlements";
import AdminPayouts from "./pages/admin/Payouts";
// Settings imports
import ProfileSettings from "./pages/settings/ProfileSettings";
import KycSettings from "./pages/settings/KycSettings";
import NotificationSettings from "./pages/settings/NotificationSettings";
import SecuritySettings from "./pages/settings/SecuritySettings";
import ApiSettings from "./pages/settings/ApiSettings";
import WebhookSettings from "./pages/settings/WebhookSettings";
import ActivityLog from "./pages/settings/ActivityLog";

const queryClient = new QueryClient();

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    // Always scroll to top on route change
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location.pathname, location.search]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/help" element={<Help />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/important" element={<Important />} />
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
            <Route path="/refunds" element={<ProtectedRoute><Refunds /></ProtectedRoute>} />
            <Route path="/disputes" element={<ProtectedRoute><Disputes /></ProtectedRoute>} />
            <Route path="/settlements" element={<ProtectedRoute><Settlements /></ProtectedRoute>} />
            <Route path="/payment-links" element={<ProtectedRoute><PaymentLinks /></ProtectedRoute>} />
            <Route path="/payouts" element={<ProtectedRoute><Payouts /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/settings/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
            <Route path="/settings/kyc" element={<ProtectedRoute><KycSettings /></ProtectedRoute>} />
            <Route path="/settings/notifications" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
            <Route path="/settings/security" element={<ProtectedRoute><SecuritySettings /></ProtectedRoute>} />
            <Route path="/settings/api" element={<ProtectedRoute><ApiSettings /></ProtectedRoute>} />
            <Route path="/settings/webhooks" element={<ProtectedRoute><WebhookSettings /></ProtectedRoute>} />
            <Route path="/settings/activity" element={<ProtectedRoute><ActivityLog /></ProtectedRoute>} />
            <Route path="/chargebacks" element={<ProtectedRoute><Chargebacks /></ProtectedRoute>} />
            <Route path="/admin-auth" element={<ProtectedRoute><AdminAuth /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminProtectedRoute><AdminLayout /></AdminProtectedRoute></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/:id" element={<AdminUserDetail />} />
              <Route path="transactions" element={<AdminTransactions />} />
              <Route path="settlements" element={<AdminSettlements />} />
              <Route path="payouts" element={<AdminPayouts />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
