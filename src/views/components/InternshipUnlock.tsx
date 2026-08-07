import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { InternshipContact } from "../../types/internship";
import InternshipContactCard from "./InternshipContactCard";
import InternshipContactCardSkeleton from "./InternshipContactCardSkeleton";
import { LockIcon, PartyIcon } from "../icons";

interface InternshipUnlockProps {
  contacts: InternshipContact[];
  unlocked: boolean;
  unlockPercent: number;
  currentPercent: number;
  completedCount: number;
  totalCount: number;
  isLoading: boolean;
}

function InternshipUnlock({
  contacts,
  unlocked,
  unlockPercent,
  currentPercent,
  completedCount,
  totalCount,
  isLoading,
}: InternshipUnlockProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Reveal kartu saat terbuka.
  useEffect(() => {
    if (!unlocked || isLoading) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-contact]", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.08,
      });
    }, rootRef);
    return () => ctx.revert();
  }, [unlocked, isLoading]);

  // --- Terkunci ---
  if (!unlocked) {
    return (
      <section className="flex flex-col gap-4 rounded-card  p-6">
        <div className="flex items-center gap-3">
          <LockIcon className="h-6 w-6 shrink-0 text-muted" />
          <div className="flex flex-col">
            <h2 className="font-display text-lg font-semibold text-ink">Internship contacts</h2>
            <p className="text-sm text-muted">
              Complete <span className="font-semibold text-ink">{unlockPercent}%</span> of the
              roadmap to unlock companies you can reach out to for an internship.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-elevate">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500"
              style={{ width: `${currentPercent}%` }}
            />
            {/* penanda ambang */}
            <span
              className="absolute top-0 h-full w-0.5 bg-neon"
              style={{ left: `${unlockPercent}%` }}
            />
          </div>
          <span className="text-xs text-muted">
            You're at {currentPercent}% ({completedCount}/{totalCount} skills) · need {unlockPercent}%
          </span>
        </div>
      </section>
    );
  }

  // --- Terbuka ---
  return (
    <section ref={rootRef} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-neon">
          <PartyIcon className="h-5 w-5" /> Internship contacts unlocked!
        </h2>
        <p className="text-sm text-muted">
          You're at {currentPercent}% — here are companies you can reach out to for an internship
          on this track.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="border-r border-b border-line">
              <InternshipContactCardSkeleton />
            </div>
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <div className=" p-6 text-center text-sm text-muted">
          No internship contacts for this roadmap track yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2">
          {contacts.map((contact) => (
            <div data-contact key={contact.id} className="border-r border-b border-line">
              <InternshipContactCard contact={contact} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default InternshipUnlock;
