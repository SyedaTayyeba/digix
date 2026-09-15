import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Wraps every /admin/* route except /admin/login. Redirects to login if
 * there's no authenticated user once the initial /api/auth/me check has
 * resolved. Backend authorization is still the real security boundary —
 * this only controls what the UI shows/redirects to.
 */
export default function ProtectedAdminRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-sm text-white/50">
        Checking your session…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
