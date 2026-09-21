import type { ComponentType } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BrandIcon,
  ChatIcon,
  CompassIcon,
  GradIcon,
  HomeIcon,
  MapIcon,
  SparkleIcon,
  UsersIcon,
} from "@/shared/icons";
import ThemeToggle from "@/theme/ThemeToggle";

interface AppSidebarProps {
  avatarUrl: string;
  isFaculty: boolean;
  /** Dikontrol dari AppLayout */
  open: boolean;
  /** false = onboarding belum selesai, nav selain Home & Onboarding di-disable */
  onboardingDone: boolean;
}

/** Item yang selalu aktif (tidak pernah di-disable) */
const ALWAYS_ITEMS: {
  to: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
}[] = [
  { to: "/home",       icon: HomeIcon,    label: "Home" },
];

/** Item yang di-lock sampai onboarding selesai */
const LOCKED_ITEMS: {
  to: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
}[] = [
  { to: "/roadmap",   icon: MapIcon,     label: "Roadmap" },
  { to: "/community", icon: ChatIcon,    label: "Community" },
  { to: "/partner",   icon: UsersIcon,   label: "Partner" },
  { to: "/career",    icon: CompassIcon, label: "Career" },
];

const FACULTY_ITEM = { to: "/faculty", icon: GradIcon, label: "Faculty" };

function AppSidebar({ avatarUrl, isFaculty, open, onboardingDone }: AppSidebarProps) {
  const navigate = useNavigate();

  // Faculty tidak perlu onboarding — semua item selalu aktif
  const lockedItems = isFaculty
    ? [{ to: "/faculty", icon: GradIcon, label: "Faculty" }]
    : LOCKED_ITEMS;

  const alwaysItems = isFaculty
    ? [{ to: "/home", icon: HomeIcon, label: "Home" }]
    : ALWAYS_ITEMS;

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col overflow-hidden border-r border-line bg-surface transition-[width] duration-200 ease-out ${
        open ? "w-52" : "w-14"
      }`}
    >
      {/* ── Header: logo ─────────────────────────────────────────── */}
      <div className="flex h-14 shrink-0 items-center border-b border-line">
        <NavLink
          to="/home"
          title="Sepaham"
          className="flex items-center gap-2.5 pl-4 text-primary"
        >
          <BrandIcon className="h-5 w-5 shrink-0" />
          {open && (
            <span className="whitespace-nowrap font-display text-base font-bold">
              Sepaham
            </span>
          )}
        </NavLink>
      </div>

      {/* ── Nav items ────────────────────────────────────────────── */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto py-3">

        {/* Items yang selalu aktif (Home) */}
        {alwaysItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) =>
                `relative mx-2 flex items-center gap-3 px-2.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-soft text-primary"
                    : "text-muted hover:bg-elevate hover:text-ink"
                }`
              }
            >
              <span className="nav-indicator absolute left-0 top-0 h-full w-0.5 bg-primary opacity-0" />
              <Icon className="h-4 w-4 shrink-0" />
              {open && <span className="overflow-hidden whitespace-nowrap">{item.label}</span>}
            </NavLink>
          );
        })}

        {/* Tab Onboarding — hanya untuk student, selalu clickable */}
        {!isFaculty && (
          <NavLink
            to="/onboarding"
            title="Onboarding"
            className={({ isActive }) =>
              `relative mx-2 flex items-center gap-3 px-2.5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-soft text-primary"
                  : onboardingDone
                  ? "text-muted hover:bg-elevate hover:text-ink"
                  : "text-blue hover:bg-elevate"
              }`
            }
          >
            <span className="nav-indicator absolute left-0 top-0 h-full w-0.5 bg-primary opacity-0" />
            <span className="relative shrink-0">
              <SparkleIcon className="h-4 w-4" />
              {/* Dot merah kecil jika belum selesai */}
              {!onboardingDone && (
                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-yellow-400" />
              )}
            </span>
            {open && (
              <span className="overflow-hidden whitespace-nowrap">
                Onboarding{!onboardingDone && " ●"}
              </span>
            )}
          </NavLink>
        )}

        {/* Divider tipis */}
        <div className="mx-4 my-1.5 border-t border-line" />

        {/* Items yang di-lock jika belum onboarding */}
        {lockedItems.map((item) => {
          const Icon = item.icon;
          const isLocked = !isFaculty && !onboardingDone;

          if (isLocked) {
            // Render sebagai div non-clickable dengan tooltip
            return (
              <div
                key={item.to}
                title={`Selesaikan onboarding untuk mengakses ${item.label}`}
                className="relative mx-2 flex cursor-not-allowed items-center gap-3 px-2.5 py-2.5 text-sm font-medium opacity-35 select-none"
              >
                <Icon className="h-4 w-4 shrink-0" />
                {open && (
                  <span className="overflow-hidden whitespace-nowrap">{item.label}</span>
                )}
                {/* Lock icon kecil di kanan */}
                {open && (
                  <svg
                    className="ml-auto h-3 w-3 shrink-0 text-muted"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect x="2" y="5" width="8" height="6" rx="0" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M4 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                )}
              </div>
            );
          }

          // Normal NavLink saat onboarding sudah selesai
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) =>
                `relative mx-2 flex items-center gap-3 px-2.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-soft text-primary"
                    : "text-muted hover:bg-elevate hover:text-ink"
                }`
              }
            >
              <span className="nav-indicator absolute left-0 top-0 h-full w-0.5 bg-primary opacity-0" />
              <Icon className="h-4 w-4 shrink-0" />
              {open && <span className="overflow-hidden whitespace-nowrap">{item.label}</span>}
            </NavLink>
          );
        })}

        {/* Tombol "Buka semua fitur" saat collapsed & belum onboarding */}
        {!isFaculty && !onboardingDone && !open && (
          <button
            type="button"
            onClick={() => void navigate("/onboarding")}
            title="Mulai onboarding untuk membuka semua fitur"
            className="mx-2 mt-1 flex items-center justify-center py-2 text-yellow-400 transition-colors hover:bg-elevate"
          >
            <span className="text-[10px] font-bold">!</span>
          </button>
        )}
      </nav>

      {/* ── Bottom: theme toggle + avatar ───────────────────────── */}
      <div className="flex shrink-0 flex-col gap-0.5 border-t border-line pb-3 pt-2">
        <div className="mx-2 flex items-center gap-3 px-2.5 py-1.5">
          <div className="shrink-0">
            <ThemeToggle />
          </div>
          {open && (
            <span className="whitespace-nowrap text-sm font-medium text-muted">Theme</span>
          )}
        </div>

        <NavLink
          to="/profile"
          title="Profile"
          className={({ isActive }) =>
            `relative mx-2 flex items-center gap-3 px-2.5 py-2 transition-colors ${
              isActive ? "bg-primary-soft" : "hover:bg-elevate"
            }`
          }
        >
          <span className="nav-indicator absolute left-0 top-0 h-full w-0.5 bg-primary opacity-0" />
          <img
            src={avatarUrl}
            alt="Profile"
            className="h-7 w-7 shrink-0 object-cover ring-2 ring-transparent"
          />
          {open && (
            <span className="whitespace-nowrap text-sm font-medium text-muted">Profile</span>
          )}
        </NavLink>
      </div>
    </aside>
  );
}

export default AppSidebar;
