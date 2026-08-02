import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useAuth();

  // Redirect unauthorized visitors directly to Home page so Admin/Analytics routes stay completely hidden
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};
