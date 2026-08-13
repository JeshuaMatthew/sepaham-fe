import type { ComponentType } from "react";
import { ArrowRightIcon } from "@/shared/icons";

interface HomeSummaryCardProps {
  icon: ComponentType<{ className?: string }>;
  value: string;
  label: string;
  hint: string;
  onClick: () => void;
}

function HomeSummaryCard({ icon: Icon, value, label, hint, onClick }: HomeSummaryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-3  p-5 text-left hover:border-primary/50"
    >
      <div className="flex items-center justify-between">
        <Icon className="h-6 w-6 text-primary" />
        <ArrowRightIcon className="h-4 w-4 text-muted group-hover:text-ink" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="font-display text-xl font-bold text-ink">{value}</span>
        <span className="text-sm font-semibold text-ink">{label}</span>
        <span className="text-xs text-muted">{hint}</span>
      </div>
    </button>
  );
}

export default HomeSummaryCard;
