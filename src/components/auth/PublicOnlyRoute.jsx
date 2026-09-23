import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { Loader2 } from 'lucide-react';

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
        <p className="text-slate-400 font-medium">Checking session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    // If user arrived from an authenticated redirection, bounce them there or to dashboard
    const origin = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={origin} replace />;
  }

  return children;
};

export default PublicOnlyRoute;
