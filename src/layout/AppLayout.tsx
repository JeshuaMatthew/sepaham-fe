import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PROFILE_QUERY_KEY, fetchProfile } from "@/features/profile/services/profileService";
import { getAccount } from "@/features/auth/utils/account";
import { getPreference } from "@/features/onboarding/utils/preference";
import AppSidebar from "@/layout/AppSidebar";
import SidebarToggle from "@/layout/SidebarToggle";
import OnboardingAlert from "@/layout/OnboardingAlert";
import PageTransition from "@/components/animations/PageTransition";

const SIDEBAR_KEY = "sepaham:sidebar-open";

function AppLayout() {
  const { data } = useQuery({ queryKey: PROFILE_QUERY_KEY, queryFn: fetchProfile });
  const avatarUrl = data?.avatarUrl ?? "https://i.pravatar.cc/64?img=13";

  const account = getAccount();
  const isFacultyUser = account.role === "faculty";

  // Onboarding dianggap selesai jika preference sudah ada di localStorage.
  // Faculty tidak perlu onboarding — selalu true.
  const onboardingDone = isFacultyUser || getPreference() !== null;

  const location = useLocation();

  const [open, setOpen] = useState<boolean>(() => {
    try { return localStorage.getItem(SIDEBAR_KEY) === "1"; } catch { return false; }
  });

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      try { localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0"); } catch { /* */ }
      return next;
    });
  };

  const sidebarWidth = open ? "13rem" : "3.5rem";

  return (
    <div className="relative flex h-screen flex-row bg-canvas">
      <AppSidebar
        avatarUrl={avatarUrl}
        isFaculty={isFacultyUser}
        open={open}
        onboardingDone={onboardingDone}
      />

      {/* Tombol toggle mengambang di tepi kanan sidebar */}
      <SidebarToggle open={open} onToggle={toggle} />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <PageTransition key={location.pathname} className="h-full">
          <Outlet />
        </PageTransition>
      </main>

      {/* Alert onboarding — hanya muncul jika student belum onboarding */}
      {!onboardingDone && <OnboardingAlert />}

      <style>{`:root { --sidebar-width: ${sidebarWidth}; }`}</style>
    </div>
  );
}

export default AppLayout;
