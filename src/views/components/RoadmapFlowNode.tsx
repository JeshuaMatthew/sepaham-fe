import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import type { NodeStatus } from "../../types/roadmap";
import { CheckIcon, LockIcon, SkillIcon } from "../icons";

export interface RoadmapFlowNodeData {
  title: string;
  emoji: string;
  status: NodeStatus;
  optional?: boolean;
  [key: string]: unknown;
}

const handleStyle = {
  width: 8,
  height: 8,
  background: "var(--color-elevate)",
  border: "1px solid var(--color-line)",
};

function RoadmapFlowNode({ data }: NodeProps) {
  const node = data as RoadmapFlowNodeData;
  const status = node.status;
  const locked = status === "locked";

  const frame =
    status === "completed"
      ? "border-neon bg-neon/10 text-ink"
      : status === "available"
        ? "border-primary bg-primary-soft text-ink"
        : "border-line bg-surface text-muted";

  return (
    <div className="flex w-28 flex-col items-center gap-1.5">
      <Handle type="target" position={Position.Top} style={handleStyle} />

      <div
        className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 text-2xl ${frame} ${
          locked ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        {status === "available" ? (
          <span className="pointer-events-none absolute inset-0 animate-pulse rounded-2xl border-2 border-primary" />
        ) : null}
        <span aria-hidden="true">
          {locked ? <LockIcon className="h-6 w-6" /> : <SkillIcon className="h-6 w-6" />}
        </span>
        {status === "completed" ? (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-neon text-ink">
            <CheckIcon className="h-3 w-3" />
          </span>
        ) : null}
      </div>

      <span
        className={`text-center text-xs font-medium leading-tight ${
          locked ? "text-muted" : "text-ink"
        }`}
      >
        {node.title}
      </span>

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
