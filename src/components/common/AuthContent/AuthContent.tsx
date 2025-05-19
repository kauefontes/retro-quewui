import React from 'react';
import { useAuth } from '../../../contexts/AuthUtils';
import { EmptyState } from '../EmptyState';

interface AuthContentProps {
  /** Content to show when user is authenticated */
  children: React.ReactNode;
  /** Optional content to show when user is not authenticated */
  fallback?: React.ReactNode;
  /** If true, will only show content to users with admin role */
  requireAdmin?: boolean;
  /** If true, hides content completely when not authenticated instead of showing a message */
  hideCompletely?: boolean;
}

/**
 * Component for conditional rendering based on authentication state
 * Shows different content based on whether user is logged in
 */
export const AuthContent: React.FC<AuthContentProps> = ({ 
  children, 
  fallback = null,
  requireAdmin = false,
  hideCompletely = false
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  // Show loading state while authentication is being checked
  if (loading) {
    return <EmptyState 
      title="Checking Authentication" 
      message="Please wait while we verify your authentication..." 
      isLoading={true}
    />;
  }
  
  // If admin is required, check user role
  if (requireAdmin && (!user || user.role !== 'admin')) {
    if (hideCompletely) return null;
    
    return fallback || null;
  }
  
  // Otherwise just check if authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  } else {
    if (hideCompletely) return null;
    
    // Return fallback or nothing, making pages accessible without login messages
    return fallback || null;
  }
};

export default AuthContent;