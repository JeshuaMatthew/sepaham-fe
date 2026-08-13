import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isFaculty } from "@/features/auth/utils/account";
import PageTransition from "@/components/animations/PageTransition";

/**
 * FacultyLayout — guard untuk area dosen. Kalau akun bukan dosen,
 * alihkan ke beranda.
 */

function FacultyLayout() {
  const location = useLocation();
  if (!isFaculty()) {
    return <Navigate to="/home" replace />;
  }
  return (
    <PageTransition key={location.pathname} className="h-full">
      <Outlet />
    </PageTransition>
  );
}

export default FacultyLayout;
