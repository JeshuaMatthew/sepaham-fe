import type { NodeSubmission, RoadmapNode } from "../../types/roadmap";
import SubmissionEditor from "./SubmissionEditor";
import { DocIcon, StarIcon } from "../icons";

interface NodeEditorCardProps {
  node: RoadmapNode;
  index: number;
  selected: boolean;
  onChange: (nodeId: string, patch: Partial<RoadmapNode>) => void;
  onDelete: (nodeId: string) => void;
}

function NodeEditorCard({ node, index, selected, onChange, onDelete }: NodeEditorCardProps) {
  const submission: NodeSubmission = node.submission ?? { type: "checkmark" };

  return (
    <div
      id={`node-editor-${node.id}`}
      className={`flex flex-col gap-3 rounded-card border p-5 transition-colors ${
        selected ? "border-primary bg-elevate" : "border-line bg-surface"
      }`}
    >
      {/* Judul + emoji + opsional */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-muted">#{index + 1}</span>
        <input
          value={node.title}
          onChange={(event) => onChange(node.id, { title: event.target.value })}
          placeholder="Nama skill"
          className="flex-1 rounded-lg border border-line bg-canvas px-3 py-2 text-sm font-semibold text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={() => onChange(node.id, { optional: !node.optional })}
          aria-pressed={node.optional ?? false}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            node.optional
              ? "bg-primary/20 text-ink"
              : "border border-line text-muted hover:text-ink"
          }`}
        >
          {node.optional ? (
            <span className="inline-flex items-center gap-1">
              <StarIcon className="h-3 w-3" /> Opsional
            </span>
          ) : (
            "Wajib"
          )}
        </button>
        <button
          type="button"
          onClick={() => onDelete(node.id)}
          className="cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-semibold text-danger transition-colors hover:bg-danger/10"
        >
          Hapus
        </button>
      </div>

      {/* Artikel (Markdown) */}
      <div className="flex flex-col gap-1.5">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
          <DocIcon className="h-3.5 w-3.5" /> Artikel / materi (mendukung Markdown):
        </span>
        <textarea
          value={node.article ?? ""}
          onChange={(event) => onChange(node.id, { article: event.target.value })}
          rows={5}
          placeholder={"## Judul\n\nTulis materi pakai **Markdown**…"}
          className="resize-y rounded-xl border border-line bg-canvas px-3 py-2 font-mono text-xs text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
        />
      </div>

      {/* Submission */}
      <div className="flex flex-col gap-1.5 border-t border-line pt-3">
        <span className="text-xs font-semibold text-ink">Submission node</span>
        <SubmissionEditor
          submission={submission}
          onChange={(next) => onChange(node.id, { submission: next })}
        />
      </div>
    </div>
  );
}

export default NodeEditorCard;
