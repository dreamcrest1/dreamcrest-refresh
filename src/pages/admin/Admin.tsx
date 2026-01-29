import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { useAdminRole } from "@/hooks/useAdminRole";
import AdminShell from "@/pages/admin/AdminShell";
import AdminSetup from "@/pages/admin/AdminSetup";

export default function Admin() {
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useAdminRole(user?.id);

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (roleLoading) return null;

  return (
    <Routes>
      {/* Setup page is always reachable for logged-in users */}
      <Route path="setup" element={<AdminSetup />} />

      {/* Main admin area requires admin role */}
      <Route path="/" element={isAdmin ? <AdminShell /> : <Navigate to="/admin/setup" replace />} />

      <Route path="*" element={<Navigate to={isAdmin ? "/admin" : "/admin/setup"} replace />} />
    </Routes>
  );
}
