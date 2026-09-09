import type { ComponentType } from "react";
import { NavLink } from "react-router-dom";
import {
  BrandIcon,
  ChatIcon,
  CompassIcon,
  GradIcon,
  HomeIcon,
  MapIcon,
  UsersIcon,
} from "@/shared/icons";
import ThemeToggle from "@/theme/ThemeToggle";

interface AppSidebarProps {
  avatarUrl: string;
  isFaculty: boolean;
  /** Dikontrol dari AppLayout — true = lebar, false = collapsed */
  open: boolean;
}

const NAV_ITEMS: {
  to: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
}[] = [
  { to: "/home",      icon: HomeIcon,    label: "Home" },
  { to: "/roadmap",   icon: MapIcon,     label: "Roadmap" },
  { to: "/community", icon: ChatIcon,    label: "Community" },
  { to: "/partner",   icon: UsersIcon,   label: "Partner" },
  { to: "/career",    icon: CompassIcon, label: "Career" },
];

const FACULTY_ITEM = { to: "/faculty", icon: GradIcon, label: "Faculty" };

function AppSidebar({ avatarUrl, isFaculty, open }: AppSidebarProps) {
  const items = isFaculty
    ? [...NAV_ITEMS.filter((i) => i.to !== "/community"), FACULTY_ITEM]
    : NAV_ITEMS;

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
        {items.map((item) => {
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
              {open && (
                <span className="overflow-hidden whitespace-nowrap">{item.label}</span>
              )}
            </NavLink>
          );
        })}
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
