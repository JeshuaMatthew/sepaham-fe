import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Role } from "@/features/onboarding/types/role";
import RoleCard from "@/features/onboarding/components/RoleCard";
import RoadmapLoader from "@/features/onboarding/components/RoadmapLoader";
import { AlertIcon, ArrowRightIcon } from "@/shared/icons";

interface RoleRecommendationContainerProps {
  roles: Role[];
  recommendedId: string | null;
  selectedRoleId: string | null;
  isLoading: boolean;
  isError: boolean;
  onSelectRole: (id: string) => void;
  onConfirm: () => void;
  onRetry: () => void;
}

function RoleRecommendationContainer({
  roles, recommendedId, selectedRoleId, isLoading, isError, onSelectRole, onConfirm, onRetry,
}: RoleRecommendationContainerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const recommendedRole = roles.find((role) => role.id === recommendedId) ?? null;

  useEffect(() => {
    if (isLoading || isError) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-animate]", { y: 24, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 });
    }, rootRef);
    return () => ctx.revert();
  }, [isLoading, isError]);

  if (isLoading) return <RoadmapLoader />;

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <h2 className="font-display text-xl font-semibold text-ink">Couldn't build your roadmap</h2>
          <p className="text-sm text-muted">Something went wrong processing your choices. Please try again.</p>
          <button type="button" onClick={onRetry} className="cursor-pointer py-2 text-sm font-semibold text-primary">Try again</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="min-h-screen bg-canvas px-6 pb-28 pt-14 sm:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header data-animate className="flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Step 3 of 3 · Your IT role</span>
          <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
            {recommendedRole ? (
              <>You'd make a great <span style={{ color: recommendedRole.accent }}>{recommendedRole.title}</span></>
            ) : "Pick your IT role"}
          </h1>
          <p className="max-w-xl text-sm text-muted sm:text-base">This is our recommendation from your questionnaire. Not sure? You're free to pick a different role below.</p>
        </header>
        <section data-animate className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <div key={role.id} className="border-r border-b border-line">
              <RoleCard role={role} selected={selectedRoleId === role.id} recommended={role.id === recommendedId} onSelect={onSelectRole} />
            </div>
          ))}
        </section>
      </div>
      <footer className="fixed inset-x-0 bottom-0 border-t border-line bg-surface/90 px-6 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4">
          <p className="hidden text-sm text-muted sm:block">{selectedRoleId ? "Role selected — ready for the roadmap!" : "Pick a role to continue."}</p>
          <button type="button" onClick={onConfirm} disabled={!selectedRoleId} className={`ml-auto py-2 text-sm font-semibold ${selectedRoleId ? "cursor-pointer text-primary" : "cursor-not-allowed text-muted"}`}>
            <span className="inline-flex items-center gap-1.5">Continue to Roadmap <ArrowRightIcon className="h-4 w-4" /></span>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default RoleRecommendationContainer;
