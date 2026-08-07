import { Navigate, Outlet } from "react-router-dom";
import { isFaculty } from "../../utils/account";

/**
 * FacultyLayout — guard untuk area dosen. Kalau akun bukan dosen,
 * alihkan ke beranda. Layout route react-router (di dalam AppLayout).
 */

function FacultyLayout() {
  if (!isFaculty()) {
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
}

export default FacultyLayout;
