import React from 'react';
import { Navigate } from 'react-router-dom';

// Simulated authentication function
const isAuthenticated = () => {
  // Replace this with your actual authentication logic
  return !!localStorage.getItem('user');
};

const AuthGuard = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthGuard;
