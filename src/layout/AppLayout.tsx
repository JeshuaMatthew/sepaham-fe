import { Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PROFILE_QUERY_KEY, fetchProfile } from "@/features/profile/services/profileService";
import { getAccount } from "@/features/auth/utils/account";
import AppNavbar from "@/layout/AppNavbar";
import PageTransition from "@/components/animations/PageTransition";

/**
 * AppLayout — shell aplikasi dengan navigasi global (navbar atas) + Outlet.
 */

function AppLayout() {
  const { data } = useQuery({ queryKey: PROFILE_QUERY_KEY, queryFn: fetchProfile });
  const avatarUrl = data?.avatarUrl ?? "https://i.pravatar.cc/64?img=13";
  const isFacultyUser = getAccount().role === "faculty";
  const location = useLocation();

  return (
    <div className="flex h-screen flex-col bg-canvas">
      <AppNavbar avatarUrl={avatarUrl} isFaculty={isFacultyUser} />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <PageTransition key={location.pathname} className="h-full">
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}

export default AppLayout;
