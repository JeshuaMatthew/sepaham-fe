import type { ReactNode } from "react";
import { ArrowRightIcon, StarIcon } from "@/shared/icons";

interface EdgeStyleControlsProps {
  dashed: boolean;
  optional: boolean;
  animated: boolean;
  sourceTitle: string;
  targetTitle: string;
  onToggle: (key: "dashed" | "optional" | "animated") => void;
  onDelete: () => void;
}

function EdgeStyleControls({
  dashed,
  optional,
  animated,
  sourceTitle,
  targetTitle,
  onToggle,
  onDelete,
}: EdgeStyleControlsProps) {
  const chip = (active: boolean, label: ReactNode, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
        active ? "bg-primary/20 text-ink" : "border border-line text-muted hover:text-ink"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-3 rounded-card  p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-ink">
          Koneksi: <span className="text-muted">{sourceTitle}</span>{" "}
          <ArrowRightIcon className="inline h-3.5 w-3.5 align-middle" />{" "}
          <span className="text-muted">{targetTitle}</span>
        </span>
        <button
          type="button"
          onClick={onDelete}
          className="cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold text-danger hover:bg-danger/10"
        >
          Hapus koneksi
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {chip(dashed, "Putus-putus", () => onToggle("dashed"))}
        {chip(
          optional,
          <span className="inline-flex items-center gap-1">
            <StarIcon className="h-3 w-3" /> Opsional
          </span>,
          () => onToggle("optional"),
        )}
        {chip(animated, "Animasi", () => onToggle("animated"))}
      </div>
      <p className="text-[11px] text-muted">
        Edge <span className="text-ink">opsional</span> ditandai "opsional" & tidak mengunci node
        target.
      </p>
    </div>
  );
}

export default EdgeStyleControls;
