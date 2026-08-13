import type { RoadmapDifficulty, RoadmapSummary } from "@/features/roadmap/types/roadmap";
import { ROLE_OPTIONS } from "@/features/onboarding/utils/roleOptions";
import { EditIcon, SkillIcon } from "@/shared/icons";

interface RoadmapEditorCardProps {
  roadmap: RoadmapSummary;
  onChange: (id: string, patch: Partial<RoadmapSummary>) => void;
  onEditContent: (id: string) => void;
  onDelete: (id: string) => void;
}

const DIFFICULTIES: RoadmapDifficulty[] = ["Beginner", "Intermediate", "Advanced"];

function RoadmapEditorCard({ roadmap, onChange, onEditContent, onDelete }: RoadmapEditorCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-card  p-5">
      <div className="flex items-center gap-3">
        <input
          value={roadmap.title}
          onChange={(event) => onChange(roadmap.id, { title: event.target.value })}
          placeholder="Judul roadmap"
          className="flex-1 rounded-xl border border-line bg-surface px-3 py-2.5 text-sm font-semibold text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
        />
        <input
          type="color"
          value={roadmap.color}
          onChange={(event) => onChange(roadmap.id, { color: event.target.value })}
          aria-label="Warna aksen"
          className="h-11 w-11 shrink-0 cursor-pointer rounded-xl border border-line bg-canvas"
        />
      </div>

      <textarea
        value={roadmap.description}
        onChange={(event) => onChange(roadmap.id, { description: event.target.value })}
        rows={2}
        placeholder="Deskripsi singkat roadmap"
        className="resize-none rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
      />

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={roadmap.roleId}
          onChange={(event) => onChange(roadmap.id, { roleId: event.target.value })}
          className="rounded-lg border border-line bg-surface px-2 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
        >
          {ROLE_OPTIONS.map((role) => (
            <option key={role.id} value={role.id}>{role.label}</option>
          ))}
        </select>
        <select
          value={roadmap.difficulty}
          onChange={(event) =>
            onChange(roadmap.id, { difficulty: event.target.value as RoadmapDifficulty })
          }
          className="rounded-lg border border-line bg-surface px-2 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
        >
          {DIFFICULTIES.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
        <span className="inline-flex items-center gap-1 text-xs text-muted">
          <SkillIcon className="h-3.5 w-3.5" /> {roadmap.totalNodes} skill
        </span>
      </div>

      <div className="flex items-center gap-2 border-t border-line pt-3">
        <button
          type="button"
          onClick={() => onEditContent(roadmap.id)}
          className="inline-flex items-center gap-1.5 cursor-pointer rounded-full bg-primary/15 px-4 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/25"
        >
          <EditIcon className="h-3.5 w-3.5" /> Edit isi roadmap
        </button>
        <button
          type="button"
          onClick={() => onDelete(roadmap.id)}
          className="ml-auto cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-danger transition-colors hover:bg-danger/10"
        >
          Hapus roadmap
        </button>
      </div>
    </div>
  );
}

export default RoadmapEditorCard;

