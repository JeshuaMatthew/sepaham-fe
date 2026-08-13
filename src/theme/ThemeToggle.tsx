import { useTheme } from "@/theme/ThemeProvider";
import { MoonIcon, SunIcon } from "@/shared/icons";
import { useGsapHover } from "@/hooks/useGsapHover";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useGsapHover<HTMLButtonElement>({ y: 0, scale: 1.15 });

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-elevate hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
}
