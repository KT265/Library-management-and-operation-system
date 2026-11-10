import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { UserRole } from '../../types';

export interface ProtectedRouteProps {
  /**
   * Required user role to access this route (e.g. 'admin').
   * If omitted, any authenticated user ('customer', 'admin', 'curator') is allowed.
   */
  requiredRole?: UserRole;

  /**
   * Target URL to redirect unauthenticated users to. Defaults to '/login'.
   */
  redirectTo?: string;

  /**
   * Optional child components when used as a direct wrapper.
   * If omitted, renders React Router <Outlet /> for nested layout routes.
   */
  children?: React.ReactNode;
}

/**
 * Route guard component protecting views against unauthenticated and unauthorized access.
 * Automatically saves the attempted location in router state for post-login redirection.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  redirectTo = '/login',
  children,
}) => {
  const { isAuthenticated, user, isAuthLoading } = useStore();
  const location = useLocation();

  // 1. Initial auth state restoration guard (prevents flash of redirect on reload)
  if (isAuthLoading) {
    return (
      <div
        id="auth-loading-spinner"
        data-testid="auth-loading-spinner"
        className="min-h-screen flex items-center justify-center bg-surface"
      >
        <div
          role="status"
          aria-label="Đang tải phiên đăng nhập"
          className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"
        />
      </div>
    );
  }

  // 2. Unauthenticated access check: Redirect to /login with attempted location
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 3. Role enforcement check: If requiredRole is specified, enforce user.role
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    // Non-admin patron attempting to access admin route is redirected to storefront home
    return <Navigate to="/" replace />;
  }

  // 4. Render children if wrapped directly, or Outlet for nested layout routes
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
