import type {
  FactItem,
  QuestionItem,
  QuestionOption,
  QuestionType,
} from "@/features/onboarding/services/onboardingService";
import { ArrowDownIcon, ArrowUpIcon } from "@/shared/icons";

const TYPE_LABEL: Record<QuestionType, string> = {
  binary: "Ya / Tidak",
  scale: "Skala 1–5",
  choice: "Pilihan ganda",
};

/** Penjelasan singkat supaya dosen paham dampaknya ke mesin rekomendasi. */
const TYPE_HINT: Record<QuestionType, string> = {
  binary: "Mahasiswa jawab Ya/Tidak. Fact dikuatkan otomatis saat pilih Ya.",
  scale: "Mahasiswa pilih 1–5. Fact baru dikuatkan di skor 4 dan 5.",
  choice: "Setiap opsi membawa fact sendiri; fact yang di-emit adalah fact dari opsi terpilih.",
};

interface QuestionEditorRowProps {
  question: QuestionItem;
  facts: FactItem[];
  /** posisi di dalam pillar (0-based) */
  order: number;
  onChange: (patch: Partial<QuestionItem>) => void;
  onDelete: () => void;
  onMove: (direction: -1 | 1) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

function QuestionEditorRow({
  question,
  facts,
  order,
  onChange,
  onDelete,
  onMove,
  canMoveUp,
  canMoveDown,
}: QuestionEditorRowProps) {
  const isChoice = question.question_type === "choice";
  const options: QuestionOption[] = question.options ?? [];

  const patchOption = (index: number, patch: Partial<QuestionOption>) => {
    const next = options.map((opt, idx) => (idx === index ? { ...opt, ...patch } : opt));
    onChange({ options: next });
  };

  const addOption = () => {
    // Fact default = fact utama pertanyaan, supaya opsi baru tetap valid.
    onChange({ options: [...options, { label: "", fact_id: question.fact_id }] });
  };

  const removeOption = (index: number) => {
    onChange({ options: options.filter((_, idx) => idx !== index) });
  };

  return (
    <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-4">
      <div className="flex items-start gap-2">
        <span className="mt-2 font-mono text-xs text-muted">{order + 1}.</span>
        <textarea
          value={question.question_text}
          onChange={(event) => onChange({ question_text: event.target.value })}
          rows={2}
          placeholder="Tulis pertanyaan… (contoh: Seberapa sering Anda menulis query SQL?)"
          className="flex-1 resize-none rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 pl-6">
        <label className="flex items-center gap-1.5 text-xs text-muted">
          <span className="sr-only">Tipe pertanyaan</span>
          <select
            value={question.question_type}
            onChange={(event) => {
              const type = event.target.value as QuestionType;
              // Opsi hanya relevan untuk `choice`; jangan biarkan data basi
              // ikut terkirim ke server.
              onChange({
                question_type: type,
                options: type === "choice" ? (options.length ? options : null) : null,
              });
            }}
            className="cursor-pointer rounded-lg border border-line bg-canvas px-2 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
          >
            {(Object.keys(TYPE_LABEL) as QuestionType[]).map((type) => (
              <option key={type} value={type}>
                {TYPE_LABEL[type]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-0 items-center gap-1.5 text-xs text-muted">
          Fact utama
          <select
            value={question.fact_id}
            onChange={(event) => onChange({ fact_id: event.target.value })}
            className="min-w-0 max-w-56 cursor-pointer rounded-lg border border-line bg-canvas px-2 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
          >
            {facts.map((fact) => (
              <option key={fact.id} value={fact.id}>
                {fact.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1.5 text-xs text-muted">
          Bobot
          <input
            type="number"
            min={0.1}
            max={10}
            step={0.1}
            value={question.weight}
            onChange={(event) => {
              const w = parseFloat(event.target.value);
              if (!Number.isNaN(w) && w >= 0.1 && w <= 10) {
                onChange({ weight: w });
              }
            }}
            className="w-16 cursor-pointer rounded-lg border border-line bg-canvas px-2 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
            title="Bobot pertanyaan untuk penentuan role (0.1–10)"
          />
        </label>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={!canMoveUp}
            title="Naikkan urutan"
            aria-label={`Naikkan urutan pertanyaan ${order + 1}`}
            className="cursor-pointer rounded-lg border border-line px-2 py-1 text-muted transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowUpIcon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={!canMoveDown}
            title="Turunkan urutan"
            aria-label={`Turunkan urutan pertanyaan ${order + 1}`}
            className="cursor-pointer rounded-lg border border-line px-2 py-1 text-muted transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowDownIcon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold text-danger transition-colors hover:bg-danger/10"
          >
            Hapus
          </button>
        </div>
      </div>

      <p className="pl-6 text-[11px] text-muted">{TYPE_HINT[question.question_type]}</p>

      {isChoice && (
        <div className="flex flex-col gap-2 pl-6">
          <span className="text-xs font-semibold text-ink">Opsi (minimal 2)</span>
          {options.map((option, optIndex) => (
            <div key={optIndex} className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
              <input
                type="text"
                value={option.label}
                onChange={(event) => patchOption(optIndex, { label: event.target.value })}
                placeholder={`Teks opsi ${optIndex + 1}`}
                className="min-w-0 flex-1 rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-xs text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none"
              />
              <select
                value={option.fact_id ?? ""}
                onChange={(event) => patchOption(optIndex, { fact_id: event.target.value })}
                className="min-w-0 cursor-pointer rounded-lg border border-line bg-canvas px-2 py-1.5 text-xs text-ink focus:border-primary focus:outline-none sm:max-w-56"
              >
                <option value="">— pilih fact —</option>
                {facts.map((fact) => (
                  <option key={fact.id} value={fact.id}>
                    {fact.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeOption(optIndex)}
                aria-label={`Hapus opsi ${optIndex + 1}`}
                className="shrink-0 cursor-pointer self-start rounded-lg px-2 py-1 text-xs font-semibold text-danger transition-colors hover:bg-danger/10 sm:self-auto"
              >
                Hapus
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="w-fit cursor-pointer rounded-lg border border-dashed border-line px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-primary hover:text-primary"
          >
            + Tambah opsi
          </button>
        </div>
      )}
    </div>
  );
}

export default QuestionEditorRow;
