import { CheckIcon } from "@/shared/icons";

interface GuidedEssayInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

const ESSAY_PROMPTS = [
  "Saya tertarik membuat aplikasi web atau mobile dan memecahkan bug arsitektur...",
  "Saya menyukai analisis data, machine learning, visualisasi, dan statistika...",
  "Saya penasaran dengan cyber security, jaringan, Linux server, dan cloud infra...",
  "Saya senang mendesain antarmuka pengguna, user experience, dan wireframe di Figma...",
  "Saya tertarik mengatur roadmap produk, koordinasi tim scrum, dan strategi bisnis...",
];

export default function GuidedEssayInput({ value, onChange, disabled }: GuidedEssayInputProps) {
  const minLength = 50;
  const currentLength = value.trim().length;
  const progressPercent = Math.min(100, Math.round((currentLength / minLength) * 100));
  const isSatisfied = currentLength >= minLength;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 text-xs text-muted">
        <span className="font-semibold text-ink">Inspirasi topik:</span>
        {ESSAY_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!value) onChange(prompt);
              else onChange(`${value} ${prompt}`);
            }}
            className="rounded border border-line bg-surface px-2.5 py-1 text-xs text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer text-left"
          >
            "{prompt.slice(0, 36)}…"
          </button>
        ))}
      </div>

      <div className="relative">
        <textarea
          rows={6}
          disabled={disabled}
          placeholder="Tuliskan minat, ketertarikan teknologi, proyek yang pernah kamu buat atau ingin kamu pelajari di masa depan (minimal 50 karakter)..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-none rounded-xl border border-line bg-surface p-4 text-sm text-ink placeholder:text-muted/60 focus:border-primary focus:outline-none transition-colors"
        />
        <div className="flex items-center justify-between px-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-elevate">
              <div
                className={`h-full transition-all duration-300 ${
                  isSatisfied ? "bg-accent" : "bg-primary"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className={isSatisfied ? "text-accent font-medium" : "text-muted"}>
              {currentLength}/{minLength} karakter minimum
            </span>
          </div>
          {isSatisfied && (
            <span className="text-accent font-medium flex items-center gap-1">
              <CheckIcon className="h-4 w-4" aria-hidden="true" /> Siap dianalisis
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
