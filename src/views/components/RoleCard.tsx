import gsap from "gsap";
import { useGsapHover } from "../../hooks/useGsapHover";
import type { Role } from "../../types/role";
import { CompassIcon, StarIcon } from "../icons";

interface RoleCardProps {
  role: Role;
  selected: boolean;
  /** Tandai kartu ini sebagai rekomendasi utama dari AI. */
  recommended?: boolean;
  onSelect: (id: string) => void;
}

function RoleCard({ role, selected, recommended = false, onSelect }: RoleCardProps) {
  const cardRef = useGsapHover<HTMLButtonElement>({ y: -6, scale: 1 });

  const handleClick = () => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { scale: 0.97 },
        { scale: 1, duration: 0.4, ease: "back.out(2)", overwrite: "auto" },
      );
    }
    onSelect(role.id);
  };

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={handleClick}
      aria-pressed={selected}
      className={`group relative flex w-full flex-col gap-3 rounded-card border p-5 text-left will-change-transform transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
        selected ? "border-blue" : "border-transparent hover:border-line"
      }`}
    >
      {recommended ? (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 text-[11px] font-semibold text-blue">
          <StarIcon className="h-3 w-3" /> Recommended
        </span>
      ) : null}

      <CompassIcon className="h-8 w-8 text-primary" />

      <div className="flex flex-col gap-1">
        <h3 className="font-display text-lg font-semibold text-ink">{role.title}</h3>
        <p className="text-xs text-muted">{role.tagline}</p>
      </div>

      <p className="text-sm leading-relaxed text-muted">{role.description}</p>

      <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
        {role.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-line bg-canvas px-2 py-0.5 font-mono text-[11px] text-muted"
          >
            {tech}
          </span>
        ))}
      </div>
    </button>
  );
}

export default RoleCard;
