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

  // If the user isn't admin yet, send them to setup instructions.
  if (!isAdmin) return <Navigate to="/admin/setup" replace />;

  return (
    <Routes>
      <Route path="/" element={<AdminShell />} />
      <Route path="setup" element={<AdminSetup />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
