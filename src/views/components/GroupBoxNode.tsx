import type { NodeProps } from "@xyflow/react";
import type { RoadmapStyle } from "@/features/roadmap/types/roadmap";

/** Backdrop area untuk sekelompok node roadmap (lihat computeGroupBoxes). */
function GroupBoxNode({ data }: NodeProps) {
  const { label, style } = data as { label?: string; style?: RoadmapStyle };
  const rounded = style?.nodeRounded;
  // Warna hex dari <input type=color> diberi alpha ~13% agar tetap transparan.
  const background = style?.groupBg ? `${style.groupBg}22` : "rgba(255,255,255,0.025)";

  return (
    <div
      className={`relative h-full w-full border border-dashed border-white/30 ${
        rounded ? "rf-rounded" : ""
      }`}
      style={{ background }}
    >
      {/* Hanya NAMA grup yang membuka popup edit (bukan area/border kotak). */}
      <span
        data-group-label="1"
        title="Klik untuk edit grup"
        className="absolute -top-2.5 left-2 cursor-pointer bg-canvas px-1.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-muted hover:text-ink hover:underline"
      >
        {label}
      </span>
    </div>
  );
}

export default GroupBoxNode;
