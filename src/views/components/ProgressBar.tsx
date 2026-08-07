interface ProgressBarProps {
  /** nilai 0–100. */
  value: number;
  label?: string;
}

function ProgressBar({ value, label }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">{label}</span>
          <span className="font-mono font-semibold text-ink">{Math.round(clamped)}%</span>
        </div>
      ) : null}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-elevate">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
