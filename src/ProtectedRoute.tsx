

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../backend/src/useAuth';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // or a loader/spinner
  return user ? <>{children}</> : <Navigate to="/login" />;
};
