
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'investor' | 'founder';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, loading, isInvestor, isFounder } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to signin but remember where they were trying to go
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Role-based access control
  if (requiredRole) {
    if (requiredRole === 'investor' && !isInvestor) {
      return <Navigate to="/submit" replace />;
    }
    if (requiredRole === 'founder' && !isFounder) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
