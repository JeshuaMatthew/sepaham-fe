import { Navigate, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../../utils/account";
import LandingContainer from "../components/LandingContainer";

/**
 * LandingPage — halaman marketing untuk pengunjung yang belum login.
 * Kalau sudah login, langsung diarahkan ke beranda. TIDAK ADA class Tailwind.
 */

import PageTransition from "../components/animations/PageTransition";

function LandingPage() {
  const navigate = useNavigate();

  if (isLoggedIn()) {
    return <Navigate to="/home" replace />;
  }

  return (
    <PageTransition className="h-full">
      <LandingContainer
        onLogin={() => navigate("/login")}
        onRegister={() => navigate("/login", { state: { mode: "register" } })}
      />
    </PageTransition>
  );
}

export default LandingPage;
