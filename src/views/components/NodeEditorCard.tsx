import type { ChangeEvent } from "react";
import type { NodeSubmission, RoadmapNode } from "@/features/roadmap/types/roadmap";
import SubmissionEditor from "./SubmissionEditor";
import { DocIcon, ImageIcon, LockIcon, SkillIcon, StarIcon } from "@/shared/icons";

interface NodeEditorCardProps {
  node: RoadmapNode;
  index: number;
  /** nama grup yang sudah ada (untuk autocomplete). */
  groups: string[];
  selected: boolean;
  onChange: (nodeId: string, patch: Partial<RoadmapNode>) => void;
  onDelete: (nodeId: string) => void;
}

function NodeEditorCard({ node, index, groups, selected, onChange, onDelete }: NodeEditorCardProps) {
  const submission: NodeSubmission = node.submission ?? { type: "checkmark" };
  const groupListId = `node-groups-${node.id}`;

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(node.id, { image: String(reader.result) });
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const chip = (active: boolean, label: string, onClick: () => void) => (
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
          className="flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-semibold text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
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

      {/* Grup */}
      <div className="flex items-center gap-2">
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted">
          <SkillIcon className="h-3.5 w-3.5" /> Grup:
        </span>
        <input
          value={node.group ?? ""}
          onChange={(event) => onChange(node.id, { group: event.target.value })}
          list={groupListId}
          placeholder="mis. Dasar (kosongkan bila tanpa grup)"
          className="flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-xs text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
        />
        <datalist id={groupListId}>
          {groups.map((group) => (
            <option key={group} value={group} />
          ))}
        </datalist>
      </div>

      {/* Tampilan & akses node */}
      <div className="flex flex-col gap-2 border-t border-line pt-3">
        <span className="text-xs font-semibold text-ink">Tampilan & akses</span>
        <div className="flex flex-wrap items-center gap-2">
          {/* Upload gambar */}
          <label className="cursor-pointer rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-ink">
            <span className="inline-flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5" /> {node.image ? "Ganti gambar" : "Upload gambar"}
            </span>
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
          {node.image ? (
            <>
              <img
                src={node.image}
                alt="preview node"
                className="h-9 w-9 border border-line object-cover"
              />
              <button
                type="button"
                onClick={() => onChange(node.id, { image: undefined })}
                className="cursor-pointer text-xs font-semibold text-danger hover:underline"
              >
                Hapus gambar
              </button>
            </>
          ) : null}

          {/* Posisi judul */}
          {chip(node.titleInside ?? false, node.titleInside ? "Judul di dalam" : "Judul di bawah", () =>
            onChange(node.id, { titleInside: !node.titleInside }),
          )}

          {/* Terkunci / selalu terbuka */}
          <button
            type="button"
            onClick={() => onChange(node.id, { alwaysUnlocked: !node.alwaysUnlocked })}
            aria-pressed={node.alwaysUnlocked ?? false}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              node.alwaysUnlocked
                ? "border border-line text-muted hover:text-ink"
                : "bg-primary/20 text-ink"
            }`}
          >
            <LockIcon className="h-3 w-3" />
            {node.alwaysUnlocked ? "Selalu terbuka" : "Terkunci (butuh prasyarat)"}
          </button>
        </div>
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
          className="resize-y rounded-xl border border-line bg-surface px-3 py-2 font-mono text-xs text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
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

