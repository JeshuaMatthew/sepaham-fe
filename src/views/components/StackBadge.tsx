import { techIcon } from "../techIcons";

interface StackBadgeProps {
  tech: string;
}

/** Chip tech stack dengan ikon brand-nya. Dipakai di kartu magang & cari tim. */
function StackBadge({ tech }: StackBadgeProps) {
  const Icon = techIcon(tech);

  return (
    <span className="inline-flex items-center gap-1.5 border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
      <Icon className="h-3 w-3" /> {tech}
    </span>
  );
}

export default StackBadge;
