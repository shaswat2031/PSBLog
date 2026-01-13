import { Navigate } from 'react-router-dom';
import { authAPI } from '../services/blogService';

/**
 * Protected Route Component
 * Ensures only authenticated users can access wrapped routes
 */
export const ProtectedRoute = ({ children }) => {
  if (!authAPI.isAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

/**
 * Admin Route Component
 * Ensures only authenticated admin users can access wrapped routes
 */
export const AdminRoute = ({ children }) => {
  if (!authAPI.isAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }
  
  const user = authAPI.getUser();
  
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default { ProtectedRoute, AdminRoute };
