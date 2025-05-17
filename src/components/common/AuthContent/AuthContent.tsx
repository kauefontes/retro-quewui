import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';

interface AuthContentProps {
  /** Content to show when user is authenticated */
  children: React.ReactNode;
  /** Optional content to show when user is not authenticated */
  fallback?: React.ReactNode;
  /** If true, will only show content to users with admin role */
  requireAdmin?: boolean;
}

/**
 * Component for conditional rendering based on authentication state
 * Shows different content based on whether user is logged in
 */
export const AuthContent: React.FC<AuthContentProps> = ({ 
  children, 
  fallback = null,
  requireAdmin = false
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  // Show nothing while authentication is being checked
  if (loading) {
    return null;
  }
  
  // If admin is required, check user role
  if (requireAdmin && (!user || user.role !== 'admin')) {
    return <>{fallback}</>;
  }
  
  // Otherwise just check if authenticated
  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
};

export default AuthContent;