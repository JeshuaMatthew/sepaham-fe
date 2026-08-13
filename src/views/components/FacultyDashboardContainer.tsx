import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, ChatIcon, DocIcon, GradIcon, MapIcon, TargetIcon, UsersIcon } from "@/shared/icons";

const CARDS: {
  to: string;
  Icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}[] = [
  {
    to: "/faculty/students",
    Icon: UsersIcon,
    title: "Student progress",
    description: "See each student's roadmap, GitHub, projects & career readiness — and their CV.",
  },
  {
    to: "/faculty/roadmaps",
    Icon: MapIcon,
    title: "Manage roadmaps",
    description: "Add/edit the roadmap list and each roadmap's skill tree.",
  },
  {
    to: "/faculty/groups",
    Icon: ChatIcon,
    title: "Group moderation",
    description: "Ban group chats & calls if needed — without reading their messages.",
  },
  {
    to: "/faculty/requests",
    Icon: TargetIcon,
    title: "Project requests",
    description: "Close 'find a team' requests so no one else can join.",
  },
  {
    to: "/faculty/onboarding",
    Icon: DocIcon,
    title: "Onboarding questions",
    description: "Compose the statements students answer on a Likert scale.",
  },
];

function FacultyDashboardContainer() {
  return (
    <div className="min-h-screen bg-canvas px-6 py-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="grad-blue flex flex-col gap-2 p-6 sm:p-7">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Faculty panel
          </span>
          <h1 className="flex items-center gap-2 font-display text-3xl font-bold text-ink">
            <GradIcon className="h-7 w-7" /> Faculty dashboard
          </h1>
          <p className="text-sm text-muted">
            Track every student's progress, edit roadmaps, and moderate groups & project requests.
          </p>
        </header>

        <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2">
          {CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="flex flex-col gap-3 border-r border-b border-line p-6"
            >
              <card.Icon className="h-7 w-7 text-primary" />
              <h2 className="font-display text-lg font-semibold text-ink">{card.title}</h2>
              <p className="text-sm text-muted">{card.description}</p>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                Open <ArrowRightIcon className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboardContainer;
