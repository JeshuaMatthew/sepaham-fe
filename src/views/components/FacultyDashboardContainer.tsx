import type { ComponentType } from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon, DocIcon, GradIcon, MapIcon } from "../icons";

const CARDS: {
  to: string;
  Icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
}[] = [
  {
    to: "/faculty/onboarding",
    Icon: DocIcon,
    title: "Manage Onboarding Questions",
    description: "Compose the statements students answer on a Likert scale.",
  },
  {
    to: "/faculty/roadmaps",
    Icon: MapIcon,
    title: "Manage Roadmaps",
    description: "Add/edit the roadmap list and each roadmap's skill tree.",
  },
];

function FacultyDashboardContainer() {
  return (
    <div className="min-h-screen bg-canvas px-6 py-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <header className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Faculty panel
          </span>
          <h1 className="flex items-center gap-2 font-display text-3xl font-bold text-ink">
            <GradIcon className="h-7 w-7" /> Manage content
          </h1>
          <p className="text-sm text-muted">
            As faculty, you can build onboarding questions and edit the roadmaps students see.
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
