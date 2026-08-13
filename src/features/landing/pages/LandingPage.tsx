import { Navigate, useNavigate } from "react-router-dom";
import { isLoggedIn } from "@/features/auth/utils/account";
import LandingContainer from "@/features/landing/components/LandingContainer";
import PageTransition from "@/components/animations/PageTransition";

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
