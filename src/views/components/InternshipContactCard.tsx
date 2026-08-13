import { useRef } from "react";
import gsap from "gsap";
import type { InternshipContact } from "@/features/career/types/internship";
import { BriefcaseIcon, DmIcon, LinkIcon, MailIcon, PinIcon, UserIcon } from "@/shared/icons";

interface InternshipContactCardProps {
  contact: InternshipContact;
}

type ContactKind = "link" | "email" | "wa";

/** Tentukan href, label, & jenis dari string kontak: link, email, atau nomor HP/WA. */
function resolveContact(raw: string): { href: string; label: string; kind: ContactKind } {
  const value = raw.trim();
  if (/^https?:\/\//i.test(value)) {
    return { href: value, label: "Buka lowongan", kind: "link" };
  }
  if (value.includes("@")) {
    return { href: `mailto:${value}`, label: value, kind: "email" };
  }
  // Nomor HP / WhatsApp → normalisasi ke format internasional (default Indonesia).
  const digits = value.replace(/[^\d]/g, "");
  const intl = digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
  return { href: `https://wa.me/${intl}`, label: `WhatsApp ${value}`, kind: "wa" };
}

function InternshipContactCard({ contact }: InternshipContactCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { href, label, kind } = resolveContact(contact.contact);
  const ContactIcon = kind === "link" ? LinkIcon : kind === "email" ? MailIcon : DmIcon;

  const handleEnter = () => {
    gsap.to(cardRef.current, { y: -5, duration: 0.28, ease: "power3.out" });
  };
  const handleLeave = () => {
    gsap.to(cardRef.current, { y: 0, duration: 0.32, ease: "power3.out" });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="flex flex-col gap-3 rounded-card  p-5 will-change-transform"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-elevate text-xl">
          <BriefcaseIcon className="h-5 w-5 text-primary" />
        </span>
        <div className="flex flex-col">
          <h3 className="font-display text-sm font-semibold text-ink">{contact.position}</h3>
          <span className="text-xs text-muted">{contact.company}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted">
        <span className="inline-flex items-center gap-1">
          <PinIcon className="h-3.5 w-3.5" /> {contact.location}
        </span>
        <span>·</span>
        <span>{contact.type}</span>
      </div>

      <div className="inline-flex items-center gap-1 text-xs text-muted">
        <UserIcon className="h-3.5 w-3.5" /> {contact.pic}
      </div>

      {contact.note ? (
        <p className="text-xs italic text-muted">“{contact.note}”</p>
      ) : null}

      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-auto inline-flex w-fit items-center gap-1.5 cursor-pointer rounded-full bg-primary px-4 py-2 text-xs font-semibold text-ink transition-transform hover:scale-105 active:scale-95"
      >
        <ContactIcon className="h-4 w-4" /> {label}
      </a>
    </div>
  );
}

export default InternshipContactCard;
