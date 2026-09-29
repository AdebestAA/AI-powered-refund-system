import { Navigate, Outlet } from "react-router-dom";
import useSession from "@/hooks/auth/useSession";
import { FullPageLoader } from "./full-page-loader";

export function RequireAuth() {
  const { isLoading, isAuthenticated } = useSession();
  if (isLoading) return <FullPageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function RequireAdmin() {
  const { isLoading, isAuthenticated, isAdmin } = useSession();
  if (isLoading) return <FullPageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/support" replace />;
  return <Outlet />;
}

export function GuestOnly() {
  const { isLoading, user } = useSession();
  if (isLoading) return <FullPageLoader />;
  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/support"} replace />;
  return <Outlet />;
}
