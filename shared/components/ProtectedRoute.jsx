import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If logged in but wrong role, redirect to their home portal
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'staff') return <Navigate to="/staff/orders" replace />;
    if (user.role === 'customer') return <Navigate to="/" replace />;
  }

  return children;
}
