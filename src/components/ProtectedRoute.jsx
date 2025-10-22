import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return null;
  if (!user) {
    return <Navigate to={`/login?from=${encodeURIComponent(loc.pathname + loc.search)}`} replace />;
  }
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to={"/"} replace />;
  }
  return <Outlet />;
}
