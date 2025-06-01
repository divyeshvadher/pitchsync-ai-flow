import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import InvestorDashboard from "./pages/InvestorDashboard";
import FounderDashboard from "./pages/FounderDashboard";
import FounderSubmission from "./pages/FounderSubmission";
import PitchDetails from "./pages/PitchDetails";
import SignIn from "./pages/SignIn";
import SignUpFounder from "./pages/SignUpFounder";
import SignUpInvestor from "./pages/SignUpInvestor";
import SignUpRedirect from "./pages/SignUpRedirect";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Web3InvestorDashboard from "./pages/Web3InvestorDashboard";
import PortfolioPage from "./pages/PortfolioPage";
import MessagesPage from "./pages/MessagesPage";
import AnalyticsPage from "./pages/AnalyticsPage";

// These are placeholder pages for the investor navigation
const DealsPage = () => {
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view');
  
  return view === 'web3' ? <Web3InvestorDashboard /> : <InvestorDashboard />;
};
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUpRedirect />} />
            <Route path="/signup/founder" element={<SignUpFounder />} />
            <Route path="/signup/investor" element={<SignUpInvestor />} />
            <Route 
              path="/submit" 
              element={
                <ProtectedRoute requiredRole="founder">
                  <FounderSubmission />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pitch/:id" 
              element={
                <ProtectedRoute>
                  <PitchDetails />
                </ProtectedRoute>
              } 
            />
            
            {/* New investor navigation routes */}
            <Route 
              path="/deals" 
              element={
                <ProtectedRoute requiredRole="investor">
                  <DealsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/portfolio" 
              element={
                <ProtectedRoute requiredRole="investor">
                  <PortfolioPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notes" 
              element={
                <ProtectedRoute requiredRole="investor">
                  <div>Notes Page</div>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute requiredRole="investor">
                  <AnalyticsPage />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

// Dynamic dashboard router based on user role
function DashboardRouter() {
  const { isFounder, isInvestor } = useAuth();
  
  if (isFounder) {
    return <FounderDashboard />;
  }
  
  if (isInvestor) {
    return <Navigate to="/deals" />;
  }
  
  return <Navigate to="/" />;
}

export default App;
