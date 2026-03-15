import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Carregando sessão...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
