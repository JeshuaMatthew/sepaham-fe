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
} from "../icons";
import ThemeToggle from "./ThemeToggle";

interface AppNavbarProps {
  avatarUrl: string;
  isFaculty: boolean;
}

const NAV_ITEMS: { to: string; icon: ComponentType<{ className?: string }>; label: string }[] = [
  { to: "/home", icon: HomeIcon, label: "Home" },
  { to: "/roadmap", icon: MapIcon, label: "Roadmap" },
  { to: "/community", icon: ChatIcon, label: "Community" },
  { to: "/partner", icon: UsersIcon, label: "Partner" },
  { to: "/career", icon: CompassIcon, label: "Career" },
];

const FACULTY_ITEM = { to: "/faculty", icon: GradIcon, label: "Faculty" };

function AppNavbar({ avatarUrl, isFaculty }: AppNavbarProps) {
  // Dosen tak boleh melihat grup (chat/community) — item Community disembunyikan.
  const items = isFaculty
    ? [...NAV_ITEMS.filter((item) => item.to !== "/community"), FACULTY_ITEM]
    : NAV_ITEMS;
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface px-4 sm:px-6">
      {/* Brand */}
      <NavLink to="/home" title="Sepaham" className="flex shrink-0 items-center gap-2 text-primary">
        <BrandIcon className="h-5 w-5" />
        <span className="hidden font-display text-base font-bold sm:block">Sepaham</span>
      </NavLink>

      {/* Main navigation */}
      <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={item.label}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-1.5 px-2 py-1.5 text-sm font-medium ${
                  isActive ? "text-primary" : "text-muted hover:text-ink"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Profile */}
      <ThemeToggle />
      <NavLink
        to="/profile"
        title="Profile"
        className={({ isActive }) =>
          `flex h-9 w-9 shrink-0 items-center justify-center border-2 ${
            isActive ? "border-primary" : "border-transparent hover:border-line"
          }`
        }
      >
        <img src={avatarUrl} alt="Profile" className="h-7 w-7 object-cover" />
      </NavLink>
    </header>
  );
}

export default AppNavbar;
