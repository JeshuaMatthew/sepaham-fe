interface CollabFiltersProps {
  /** semua tag role yang tersedia. */
  roles: string[];
  active: string;
  onChange: (role: string) => void;
}

function CollabFilters({ roles, active, onChange }: CollabFiltersProps) {
  const chip = (value: string, label: string) => (
    <button
      key={value}
      type="button"
      onClick={() => onChange(value)}
      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        active === value
          ? "bg-primary/20 text-ink"
          : "border border-line text-muted hover:text-ink"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted">Filter berdasarkan role yang dibutuhkan:</span>
      <div className="flex flex-wrap gap-2">
        {chip("semua", "Semua")}
        {roles.map((role) => chip(role, role))}
      </div>
    </div>
  );
}

export default CollabFilters;
