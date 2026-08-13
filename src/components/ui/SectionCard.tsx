import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <section className="flex flex-col gap-4 rounded-card p-6">
      <div className="flex flex-col gap-0.5">
        <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
        {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export default SectionCard;
