import { useEffect, useRef } from "react";
import type { ComponentType, FormEvent } from "react";
import gsap from "gsap";
import type {
  AuthCredentials,
  AuthMode,
  AuthProvider,
} from "../../types/auth";
import type { AccountRole } from "../../utils/account";
import { BrandIcon, GradIcon, UserIcon } from "../icons";
import SsoButton from "./SsoButton";

interface AuthCardProps {
  mode: AuthMode;
  role: AccountRole;
  values: AuthCredentials;
  providers: AuthProvider[];
  isSubmitting: boolean;
  errorMessage: string | null;
  onModeChange: (mode: AuthMode) => void;
  onRoleChange: (role: AccountRole) => void;
  onFieldChange: (field: keyof AuthCredentials, value: string) => void;
  onSubmit: () => void;
  onSso: (providerId: string) => void;
}

const ROLE_TABS: {
  value: AccountRole;
  label: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  { value: "student", label: "Student", icon: UserIcon },
  { value: "faculty", label: "Faculty", icon: GradIcon },
];

function AuthCard({
  mode,
  role,
  values,
  providers,
  isSubmitting,
  errorMessage,
  onModeChange,
  onRoleChange,
  onFieldChange,
  onSubmit,
  onSso,
}: AuthCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isRegister = mode === "register";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 24,
        opacity: 0,
        scale: 0.98,
        duration: 0.6,
        ease: "power3.out",
      });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div ref={cardRef} className="w-full max-w-md  p-8">
      {/* Brand */}
      <div className="mb-8 flex flex-col items-start gap-3">
        <BrandIcon className="h-7 w-7 text-primary" />
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-2xl font-bold text-ink">
            {isRegister ? "Join Sepaham" : "Sign in to Sepaham"}
          </h1>
          <p className="text-sm text-muted">
            {isRegister ? "A community made for you, IT student." : "Welcome back, dev!"}
          </p>
        </div>
      </div>

      {/* Sign in as (student / faculty) */}
      <div className="mb-6 flex flex-col gap-1.5">
        <span className="text-xs font-medium text-muted">Sign in as</span>
        <div className="flex gap-6">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => onRoleChange(tab.value)}
              aria-pressed={role === tab.value}
              className={`flex items-center gap-1.5 border-b-2 py-2 text-sm font-semibold ${
                role === tab.value
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SSO */}
      <div className="flex flex-col gap-3">
        {providers.map((provider) => (
          <SsoButton
            key={provider.id}
            provider={provider}
            disabled={isSubmitting}
            onClick={onSso}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-xs uppercase tracking-widest text-muted">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      {/* Email / password form */}
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4" noValidate>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Campus email</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@student.ac.id"
            value={values.email}
            onChange={(event) => onFieldChange("email", event.target.value)}
            className="border border-line bg-canvas px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Password</span>
          <input
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            placeholder="At least 6 characters"
            value={values.password}
            onChange={(event) => onFieldChange("password", event.target.value)}
            className="border border-line bg-canvas px-4 py-3 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
          />
        </label>

        {errorMessage ? (
          <p className="border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin border-2 border-primary border-t-transparent" />
              Processing…
            </>
          ) : isRegister ? (
            "Sign up now"
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Mode toggle */}
      <p className="mt-6 text-sm text-muted">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          type="button"
          onClick={() => onModeChange(isRegister ? "login" : "register")}
          className="cursor-pointer font-semibold text-accent hover:underline"
        >
          {isRegister ? "Sign in" : "Sign up free"}
        </button>
      </p>
    </div>
  );
}

export default AuthCard;
