import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthProvider'; 

function PrivateRoute({ children }) {
  const { state } = useAuth();

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
