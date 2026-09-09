import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PROFILE_QUERY_KEY, fetchProfile } from "@/features/profile/services/profileService";
import { getAccount } from "@/features/auth/utils/account";
import AppSidebar from "@/layout/AppSidebar";
import SidebarToggle from "@/layout/SidebarToggle";
import PageTransition from "@/components/animations/PageTransition";

const STORAGE_KEY = "sepaham:sidebar-open";

function AppLayout() {
  const { data } = useQuery({ queryKey: PROFILE_QUERY_KEY, queryFn: fetchProfile });
  const avatarUrl = data?.avatarUrl ?? "https://i.pravatar.cc/64?img=13";
  const isFacultyUser = getAccount().role === "faculty";
  const location = useLocation();

  const [open, setOpen] = useState<boolean>(() => {
    try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
  });

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, next ? "1" : "0"); } catch { /* */ }
      return next;
    });
  };

  // Lebar sidebar saat ini — dipakai sebagai `left` untuk SidebarToggle
  const sidebarWidth = open ? "13rem" : "3.5rem"; // w-52 = 13rem, w-14 = 3.5rem

  return (
    <div className="relative flex h-screen flex-row bg-canvas">
      <AppSidebar avatarUrl={avatarUrl} isFaculty={isFacultyUser} open={open} />

      {/* Tombol toggle mengambang tepat di tepi kanan sidebar */}
      <SidebarToggle open={open} onToggle={toggle} />

      <main
        className="min-h-0 flex-1 overflow-y-auto transition-[margin] duration-200 ease-out"
        style={{ marginLeft: 0 }}
      >
        <PageTransition key={location.pathname} className="h-full">
          <Outlet />
        </PageTransition>
      </main>

      {/* Invisible element yang posisinya mengikuti lebar sidebar — dipakai
          sebagai anchor `left` untuk SidebarToggle via CSS custom property */}
      <style>{`:root { --sidebar-width: ${sidebarWidth}; }`}</style>
    </div>
  );
}

export default AppLayout;
