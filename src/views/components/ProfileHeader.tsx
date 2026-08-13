import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Profile } from "@/features/profile/types/profile";
import { CalendarIcon, GradIcon, PinIcon } from "@/shared/icons";

interface ProfileHeaderProps {
  profile: Profile;
}

function ProfileHeader({ profile }: ProfileHeaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-intro]", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="flex flex-col items-center gap-5 rounded-card  p-6 text-center sm:flex-row sm:items-start sm:text-left"
    >
      <img
        data-intro
        src={profile.avatarUrl}
        alt={profile.name}
        className="h-24 w-24 shrink-0 rounded-2xl border border-line object-cover"
      />

      <div className="flex flex-col gap-3">
        <div data-intro className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h1 className="font-display text-2xl font-bold text-ink">{profile.name}</h1>
            <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              {profile.role}
            </span>
          </div>
          <p className="font-mono text-sm text-muted">@{profile.username}</p>
        </div>

        <div
          data-intro
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted sm:justify-start"
        >
          <span className="inline-flex items-center gap-1">
            <GradIcon className="h-3.5 w-3.5" /> {profile.university}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarIcon className="h-3.5 w-3.5" /> Class of {profile.batch}
          </span>
          <span className="inline-flex items-center gap-1">
            <PinIcon className="h-3.5 w-3.5" /> {profile.location}
          </span>
        </div>

        <p data-intro className="max-w-xl text-sm leading-relaxed text-ink/80">
          {profile.bio}
        </p>
      </div>
    </div>
  );
}

export default ProfileHeader;
