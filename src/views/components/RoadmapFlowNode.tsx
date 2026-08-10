import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import type { CSSProperties } from "react";
import type { NodeStatus, RoadmapStyle } from "../../types/roadmap";
import { AlertIcon, CheckIcon, LockIcon, SkillIcon } from "../icons";

export interface RoadmapFlowNodeData {
  title: string;
  emoji: string;
  status: NodeStatus;
  optional?: boolean;
  image?: string;
  titleInside?: boolean;
  /** ditandai saat sedang di-drag ke posisi yang akan overlap. */
  warning?: boolean;
  style?: RoadmapStyle;
  [key: string]: unknown;
}

const WARN_COLOR = "#f59e0b";

// Handle jelas (dot biru) saat bisa dihubungkan (editor); tersembunyi saat read-only (mahasiswa).
const connectHandleStyle = {
  width: 11,
  height: 11,
  background: "var(--color-primary)",
  border: "2px solid var(--color-canvas)",
};
const hiddenHandleStyle = { width: 6, height: 6, opacity: 0, border: "none" };

function RoadmapFlowNode({ data, isConnectable }: NodeProps) {
  const node = data as RoadmapFlowNodeData;
  const handleStyle = isConnectable ? connectHandleStyle : hiddenHandleStyle;
  const status = node.status;
  const locked = status === "locked";
  const rounded = node.style?.nodeRounded ?? false;
  const borderWidth = node.style?.nodeBorderWidth ?? 2;
  const iconSize = node.style?.iconSize ?? 24;
  const textSize = node.style?.textSize ?? 12;
  const textAlign = node.style?.textAlign ?? "center";
  const textPos = node.style?.textPosition ?? "bottom";
  const roundedClass = rounded ? "rf-rounded" : "";
  const boxDim = iconSize + 28;
  const isRow = textPos === "left" || textPos === "right";
  const iconFirst = textPos === "bottom" || textPos === "right";
  const warning = node.warning === true;
  const warnBorder: CSSProperties = warning ? { borderColor: WARN_COLOR } : {};

  const frame =
    status === "completed"
      ? "border-neon bg-neon/10 text-ink"
      : status === "available"
        ? "border-primary bg-primary-soft text-ink"
        : "border-line bg-surface text-muted";

  const media = node.image ? (
    <img
      src={node.image}
      alt=""
      className={`object-cover ${roundedClass}`}
      style={
        node.titleInside
          ? { width: iconSize, height: iconSize }
          : { width: "100%", height: "100%" }
      }
    />
  ) : locked ? (
    <LockIcon size={iconSize} />
  ) : (
    <SkillIcon size={iconSize} />
  );

  const titleStyle: CSSProperties = { fontSize: textSize, textAlign, width: isRow ? 116 : 104 };
  const titleEl = node.title ? (
    <span
      className={`inline-block font-medium leading-tight ${locked ? "text-muted" : "text-ink"}`}
      style={titleStyle}
    >
      {node.title}
    </span>
  ) : null;

  const completedBadge =
    status === "completed" ? (
      <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neon text-ink">
        <CheckIcon className="h-3 w-3" />
      </span>
    ) : null;

  const contentClass = `flex items-center gap-1.5 ${isRow ? "flex-row" : "flex-col"}`;

  let content;
  if (node.titleInside) {
    // Border membungkus ikon + teks jadi satu (arah sesuai posisi teks).
    content = (
      <div
        className={`relative overflow-hidden border-solid px-3 py-2.5 ${contentClass} ${frame} ${roundedClass}`}
        style={{ borderWidth, ...warnBorder }}
      >
        {iconFirst ? (
          <>
            {media}
            {titleEl}
          </>
        ) : (
          <>
            {titleEl}
            {media}
          </>
        )}
        {completedBadge}
      </div>
    );
  } else {
    // Ikon punya kotak sendiri; teks di samping/atas/bawah tanpa border.
    const iconBox = (
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden border-solid ${frame} ${roundedClass} ${
          locked ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        style={{ borderWidth, width: boxDim, height: boxDim, ...warnBorder }}
      >
        {status === "available" && !node.image ? (
          <span
            className={`pointer-events-none absolute inset-0 animate-pulse border-2 border-primary ${roundedClass}`}
          />
        ) : null}
        {media}
        {completedBadge}
      </div>
    );
    content = (
      <div className={contentClass}>
        {iconFirst ? (
          <>
            {iconBox}
            {titleEl}
          </>
        ) : (
          <>
            {titleEl}
            {iconBox}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center gap-1.5">
      {warning ? (
        <span
          className="pointer-events-none absolute -top-5 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap px-1.5 py-0.5 text-[9px] font-bold"
          style={{ background: WARN_COLOR, color: "#1c1c1c" }}
        >
          <AlertIcon className="h-2.5 w-2.5" /> akan overlap
        </span>
      ) : null}

      <Handle type="target" position={Position.Top} style={handleStyle} />

      {content}

      {node.optional ? (
        <span className="rounded-full bg-elevate px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted">
          opsional
        </span>
      ) : null}

      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </div>
  );
}

export default RoadmapFlowNode;
