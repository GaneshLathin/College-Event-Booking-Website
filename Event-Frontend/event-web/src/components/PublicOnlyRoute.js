// src/components/PublicOnlyRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicOnlyRoute = ({ children, redirectPath = '/' }) => {
  const isAuthenticated = localStorage.getItem('jwtToken'); // Check if token exists

  if (isAuthenticated) {
    // If authenticated, redirect to the home page (EventorHome)
    return <Navigate to={redirectPath} replace />;
  }

  // If not authenticated, render the children (Login/Register)
  return children ? children : <Outlet />;
};

export default PublicOnlyRoute;