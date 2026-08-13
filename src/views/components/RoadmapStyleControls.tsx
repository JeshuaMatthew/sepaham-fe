import type { RoadmapStyle } from "@/features/roadmap/types/roadmap";

interface RoadmapStyleControlsProps {
  style: RoadmapStyle;
  onChange: (next: RoadmapStyle) => void;
}

/** Panel styling roadmap: sudut node, tebal border, warna grup & koneksi. */
function RoadmapStyleControls({ style, onChange }: RoadmapStyleControlsProps) {
  const set = (patch: Partial<RoadmapStyle>) => onChange({ ...style, ...patch });
  const borderWidth = style.nodeBorderWidth ?? 2;
  const iconSize = style.iconSize ?? 24;
  const textSize = style.textSize ?? 12;

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-card border border-line bg-surface p-4 text-xs">
      <span className="font-semibold text-ink">Styling:</span>

      {/* Sudut membulat */}
      <button
        type="button"
        onClick={() => set({ nodeRounded: !style.nodeRounded })}
        aria-pressed={style.nodeRounded ?? false}
        className={`rounded-full px-3 py-1.5 font-semibold transition-colors ${
          style.nodeRounded ? "bg-primary/20 text-ink" : "border border-line text-muted hover:text-ink"
        }`}
      >
        Sudut membulat
      </button>

      {/* Tebal border node */}
      <label className="flex items-center gap-2">
        <span className="text-muted">Tebal border</span>
        <input
          type="range"
          min={1}
          max={6}
          step={1}
          value={borderWidth}
          onChange={(event) => set({ nodeBorderWidth: Number(event.target.value) })}
          className="h-1 w-24 cursor-pointer accent-primary"
        />
        <span className="w-8 font-mono text-ink">{borderWidth}px</span>
      </label>

      {/* Ukuran ikon */}
      <label className="flex items-center gap-2">
        <span className="text-muted">Ukuran ikon</span>
        <input
          type="range"
          min={16}
          max={64}
          step={2}
          value={iconSize}
          onChange={(event) => set({ iconSize: Number(event.target.value) })}
          className="h-1 w-24 cursor-pointer accent-primary"
        />
        <span className="w-9 font-mono text-ink">{iconSize}px</span>
      </label>

      {/* Ukuran teks */}
      <label className="flex items-center gap-2">
        <span className="text-muted">Ukuran teks</span>
        <input
          type="range"
          min={9}
          max={22}
          step={1}
          value={textSize}
          onChange={(event) => set({ textSize: Number(event.target.value) })}
          className="h-1 w-24 cursor-pointer accent-primary"
        />
        <span className="w-9 font-mono text-ink">{textSize}px</span>
      </label>

      {/* Perataan teks */}
      <label className="flex items-center gap-2">
        <span className="text-muted">Rata teks</span>
        <select
          value={style.textAlign ?? "center"}
          onChange={(event) => set({ textAlign: event.target.value as RoadmapStyle["textAlign"] })}
          className="rounded-lg border border-line bg-surface px-2 py-1 text-xs text-ink focus:border-primary focus:outline-none"
        >
          <option value="left">Kiri</option>
          <option value="center">Tengah</option>
          <option value="right">Kanan</option>
        </select>
      </label>

      {/* Posisi teks relatif logo */}
      <label className="flex items-center gap-2">
        <span className="text-muted">Posisi teks</span>
        <select
          value={style.textPosition ?? "bottom"}
          onChange={(event) =>
            set({ textPosition: event.target.value as RoadmapStyle["textPosition"] })
          }
          className="rounded-lg border border-line bg-surface px-2 py-1 text-xs text-ink focus:border-primary focus:outline-none"
        >
          <option value="bottom">Bawah logo</option>
          <option value="top">Atas logo</option>
          <option value="left">Kiri logo</option>
          <option value="right">Kanan logo</option>
        </select>
      </label>

      {/* Warna background grup */}
      <label className="flex items-center gap-2">
        <span className="text-muted">BG grup</span>
        <input
          type="color"
          value={style.groupBg ?? "#888888"}
          onChange={(event) => set({ groupBg: event.target.value })}
          className="h-7 w-9 cursor-pointer border border-line bg-canvas"
        />
      </label>

      {/* Warna koneksi (vertex) */}
      <label className="flex items-center gap-2">
        <span className="text-muted">Warna koneksi</span>
        <input
          type="color"
          value={style.edgeColor ?? "#888888"}
          onChange={(event) => set({ edgeColor: event.target.value })}
          className="h-7 w-9 cursor-pointer border border-line bg-canvas"
        />
      </label>

      {/* Reset warna */}
      {style.groupBg || style.edgeColor ? (
        <button
          type="button"
          onClick={() => set({ groupBg: undefined, edgeColor: undefined })}
          className="cursor-pointer font-semibold text-muted hover:text-ink"
        >
          Reset warna
        </button>
      ) : null}
    </div>
  );
}

export default RoadmapStyleControls;

