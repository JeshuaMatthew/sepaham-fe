import type { ChangeEvent } from "react";
import type { RoadmapNode } from "@/features/roadmap/types/roadmap";
import { EditIcon, ImageIcon, LockIcon, StarIcon } from "@/shared/icons";

interface NodeAppearancePopupProps {
  node: RoadmapNode;
  /** nama grup yang sudah ada (autocomplete). */
  groups: string[];
  onChange: (nodeId: string, patch: Partial<RoadmapNode>) => void;
  onDelete: (nodeId: string) => void;
  onEditPage: (nodeId: string) => void;
}

/** Popup ringkas untuk mengedit TAMPILAN sebuah node (muncul di samping node). */
function NodeAppearancePopup({
  node,
  groups,
  onChange,
  onDelete,
  onEditPage,
}: NodeAppearancePopupProps) {
  const groupListId = `pop-groups-${node.id}`;

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
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
        active ? "bg-primary/20 text-ink" : "border border-line text-muted hover:text-ink"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex w-64 flex-col gap-2.5 rounded-card border border-line bg-canvas p-3 shadow-lg">
      <input
        value={node.title}
        onChange={(event) => onChange(node.id, { title: event.target.value })}
        placeholder="Nama skill"
        className="rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-sm font-semibold text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
      />

      {/* Grup (opsional) */}
      <input
        value={node.group ?? ""}
        onChange={(event) => onChange(node.id, { group: event.target.value })}
        list={groupListId}
        placeholder="Grup (opsional)"
        className="rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-xs text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
      />
      <datalist id={groupListId}>
        {groups.map((group) => (
          <option key={group} value={group} />
        ))}
      </datalist>

      {/* Toggle tampilan & akses */}
      <div className="flex flex-wrap gap-1.5">
        {chip(node.titleInside ?? false, node.titleInside ? "Judul di dalam" : "Judul di bawah", () =>
          onChange(node.id, { titleInside: !node.titleInside }),
        )}
        {chip(
          node.optional ?? false,
          node.optional ? "Opsional" : "Wajib",
          () => onChange(node.id, { optional: !node.optional }),
        )}
        <button
          type="button"
          onClick={() => onChange(node.id, { alwaysUnlocked: !node.alwaysUnlocked })}
          aria-pressed={node.alwaysUnlocked ?? false}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
            node.alwaysUnlocked
              ? "border border-line text-muted hover:text-ink"
              : "bg-primary/20 text-ink"
          }`}
        >
          <LockIcon className="h-3 w-3" /> {node.alwaysUnlocked ? "Selalu terbuka" : "Terkunci"}
        </button>
      </div>

      {/* Gambar */}
      <div className="flex items-center gap-2">
        <label className="cursor-pointer rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-muted transition-colors hover:text-ink">
          <span className="inline-flex items-center gap-1">
            <ImageIcon className="h-3 w-3" /> {node.image ? "Ganti" : "Gambar"}
          </span>
          <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
        </label>
        {node.image ? (
          <>
            <img src={node.image} alt="" className="h-7 w-7 border border-line object-cover" />
            <button
              type="button"
              onClick={() => onChange(node.id, { image: undefined })}
              className="cursor-pointer text-[11px] font-semibold text-danger hover:underline"
            >
              Hapus
            </button>
          </>
        ) : null}
        {node.optional ? <StarIcon className="ml-auto h-3 w-3 text-muted" /> : null}
      </div>

      {/* Aksi */}
      <div className="flex items-center justify-between gap-2 border-t border-line pt-2">
        <button
          type="button"
          onClick={() => onEditPage(node.id)}
          className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-primary"
        >
          <EditIcon className="h-3.5 w-3.5" /> Edit halaman & materi
        </button>
        <button
          type="button"
          onClick={() => onDelete(node.id)}
          className="cursor-pointer text-xs font-semibold text-danger hover:underline"
        >
          Hapus node
        </button>
      </div>
    </div>
  );
}

export default NodeAppearancePopup;
