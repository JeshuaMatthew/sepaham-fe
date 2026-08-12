import { Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PROFILE_QUERY_KEY, fetchProfile } from "../../services/profileService";
import { getAccount } from "../../utils/account";
import AppNavbar from "../components/AppNavbar";
import PageTransition from "../components/animations/PageTransition";

/**
 * AppLayout — shell aplikasi dengan navigasi global (navbar atas) + Outlet.
 * Membungkus halaman-halaman inti; halaman auth/onboarding TIDAK memakainya.
 */

function AppLayout() {
  const { data } = useQuery({ queryKey: PROFILE_QUERY_KEY, queryFn: fetchProfile });
  const avatarUrl = data?.avatarUrl ?? "https://i.pravatar.cc/64?img=13";
  const isFaculty = getAccount().role === "faculty";
  const location = useLocation();

  return (
    <div className="flex h-screen flex-col bg-canvas">
      <AppNavbar avatarUrl={avatarUrl} isFaculty={isFaculty} />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <PageTransition key={location.pathname} className="h-full">
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}

export default AppLayout;
