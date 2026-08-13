import { useState } from "react";

interface GroupPopupProps {
  name: string;
  memberCount: number;
  onRename: (oldName: string, newName: string) => void;
  onUngroup: (name: string) => void;
}

/** Popup ringkas untuk mengedit sebuah grup (muncul di samping grup). */
function GroupPopup({ name, memberCount, onRename, onUngroup }: GroupPopupProps) {
  const [draft, setDraft] = useState(name);

  const apply = () => {
    const next = draft.trim();
    if (next && next !== name) onRename(name, next);
  };

  return (
    <div className="flex w-56 flex-col gap-2.5 rounded-card border border-line bg-canvas p-3 shadow-lg">
      <span className="text-xs font-semibold text-ink">
        Grup <span className="text-muted">· {memberCount} node</span>
      </span>
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={apply}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
        placeholder="Nama grup"
        className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm font-semibold text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
      />
      <button
        type="button"
        onClick={() => onUngroup(name)}
        className="w-fit cursor-pointer text-xs font-semibold text-danger hover:underline"
      >
        Bubarkan grup
      </button>
    </div>
  );
}

export default GroupPopup;

