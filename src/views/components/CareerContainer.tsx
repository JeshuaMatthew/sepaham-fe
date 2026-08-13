import type { ChangeEvent, ComponentType } from "react";
import type { CareerMatch } from "@/features/career/services/careerService";
import type { CareerProfile } from "@/features/career/types/career";
import type { InternshipContact } from "@/features/career/types/internship";
import {
  ArrowRightIcon,
  CheckIcon,
  CompassIcon,
  DocIcon,
  GithubIcon,
  MailIcon,
  MapIcon,
  PinIcon,
  SparkleIcon,
  UsersIcon,
} from "@/shared/icons";

interface CareerContainerProps {
  topMatches: CareerMatch[];
  contacts: InternshipContact[];
  profile: CareerProfile | null;
  isLoading: boolean;
  hasCv: boolean;
  cvName: string | null;
  githubConnected: boolean;
  onUploadCv: (event: ChangeEvent<HTMLInputElement>) => void;
  onConnectGithub: () => void;
  onGoConsult: () => void;
  onGoRoadmap: () => void;
  onGoPartner: () => void;
}

const SOURCE_ICON: Record<string, ComponentType<{ className?: string }>> = {
  roadmap: MapIcon,
  github: GithubIcon,
  projects: UsersIcon,
  cv: DocIcon,
};

/** Render kontak sebagai link (email/URL) atau teks (telepon). */
function ContactValue({ value }: { value: string }) {
  if (/^https?:\/\//.test(value)) {
    return (
      <a href={value} target="_blank" rel="noreferrer" className="text-primary hover:underline">
        {value.replace(/^https?:\/\/(www\.)?/, "")}
      </a>
    );
  }
  if (value.includes("@")) {
    return (
      <a href={`mailto:${value}`} className="text-primary hover:underline">
        {value}
      </a>
    );
  }
  return <span className="text-ink">{value}</span>;
}

function CareerContainer({
  topMatches,
  contacts,
  profile,
  isLoading,
  hasCv,
  cvName,
  githubConnected,
  onUploadCv,
  onConnectGithub,
  onGoConsult,
  onGoRoadmap,
  onGoPartner,
}: CareerContainerProps) {
  if (isLoading || !profile) {
    return (
      <div className="min-h-full bg-canvas px-6 py-10 sm:px-8">
        <div className="mx-auto h-[420px] w-full max-w-4xl rounded-card border border-line bg-surface animate-shimmer" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-canvas px-6 py-10 sm:px-8">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* LEFT COLUMN: Overview & Readiness */}
        <div className="flex flex-col gap-8 lg:col-span-4">
          <header className="flex flex-col gap-2">
            <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
              <CompassIcon className="h-3.5 w-3.5" /> Career
            </span>
            <h1 className="font-display text-3xl font-bold text-ink">Your career path</h1>
            <p className="text-sm text-muted">
              Your overall readiness and AI insights.
            </p>
          </header>

          {/* Lengkapi data (CV / GitHub) bila belum saat onboarding */}
          {!hasCv || !githubConnected ? (
            <section className="flex flex-col gap-3 border border-blue bg-surface p-5">
              <div className="flex flex-col gap-0.5">
                <h2 className="font-display text-base font-semibold text-ink">Complete your profile</h2>
                <p className="text-sm text-muted">
                  Add these so we can analyze your career more accurately.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {hasCv ? (
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                    <CheckIcon className="h-4 w-4 text-primary" /> CV uploaded
                    {cvName ? <span className="text-ink text-xs">· {cvName}</span> : null}
                  </span>
                ) : (
                  <label className="inline-flex cursor-pointer items-center gap-1.5 border border-line px-3 py-1.5 text-sm font-semibold text-primary w-max">
                    <DocIcon className="h-4 w-4" /> Upload CV
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={onUploadCv}
                      className="hidden"
                    />
                  </label>
                )}
                {githubConnected ? (
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                    <CheckIcon className="h-4 w-4 text-primary" /> GitHub connected
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={onConnectGithub}
                    className="inline-flex cursor-pointer items-center gap-1.5 border border-line px-3 py-1.5 text-sm font-semibold text-primary w-max"
                  >
                    <GithubIcon className="h-4 w-4" /> Connect GitHub
                  </button>
                )}
              </div>
            </section>
          ) : null}

          {/* Ringkasan kesiapan */}
          <section className="flex flex-col gap-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="flex flex-col">
                <span className="font-display text-4xl font-bold text-ink">{profile.readiness}%</span>
                <span className="text-sm text-muted">
                  Career readiness · <span className="text-ink">{profile.level}</span>
                </span>
              </div>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-elevate">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500"
                style={{ width: `${profile.readiness}%` }}
              />
            </div>

            <div className="grid grid-cols-1 border-l border-t border-line">
              {profile.sources.map((source) => {
                const Icon = SOURCE_ICON[source.key];
                return (
                  <div key={source.key} className="flex flex-col gap-2 border-r border-b border-line p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                        <Icon className="h-4 w-4 text-primary" /> {source.label}
                      </span>
                      <span className="font-mono text-xs text-muted">{source.score}%</span>
                    </div>
                    <span className="font-display text-lg font-bold text-ink">{source.value}</span>
                    <span className="text-xs text-muted">{source.detail}</span>
                    <div className="mt-auto h-1.5 w-full overflow-hidden rounded-full bg-elevate">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${source.score}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-6 pt-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-ink">Strengths</h3>
                {profile.strengths.length ? (
                  <ul className="flex flex-col gap-1.5 text-sm text-muted">
                    {profile.strengths.map((strength) => (
                      <li key={strength} className="inline-flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {strength}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted">Still forming — complete roadmap skills.</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-ink">Next steps</h3>
                <ul className="flex flex-col gap-1.5 text-sm text-muted">
                  {profile.nextSteps.map((step) => (
                    <li key={step} className="inline-flex items-start gap-2">
                      <ArrowRightIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" /> {step}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={onGoRoadmap}
                    className="cursor-pointer text-xs font-semibold text-primary"
                  >
                    Open roadmap
                  </button>
                  <button
                    type="button"
                    onClick={onGoPartner}
                    className="cursor-pointer text-xs font-semibold text-primary"
                  >
                    Find a project team
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Matches & Contacts */}
        <div className="flex flex-col gap-8 lg:col-span-8">
          
          {/* 1. Top 3 careers */}
          <section className="grad-blue flex flex-col gap-4 p-6 sm:p-7">
            <div className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                <SparkleIcon className="h-3.5 w-3.5" /> AI career match
              </span>
              <h2 className="font-display text-2xl font-bold text-ink">Top careers for you</h2>
              <p className="text-sm text-muted">Ranked from your questionnaire, roadmap & activity.</p>
            </div>

            <div className="grid grid-cols-1 divide-y divide-white/20 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {topMatches.map((match, index) => (
                <div key={match.role.id} className="flex flex-col gap-2 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-muted">#{index + 1}</span>
                    <span className="font-display text-xl font-bold text-ink">{match.fitPercent}%</span>
                  </div>
                  <h3 className="font-display text-base font-semibold text-ink leading-tight">{match.role.title}</h3>
                  <p className="text-xs leading-relaxed text-muted">{match.role.tagline}</p>
                  <div className="mt-auto flex flex-wrap gap-1 pt-2">
                    {match.role.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="border border-white/20 px-1.5 py-0.5 font-mono text-[10px] text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. Kontak perusahaan */}
          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-0.5">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
                <MailIcon className="h-5 w-5 text-accent" /> Companies you can reach out to
              </h2>
              <p className="text-sm text-muted">Matched to your top career paths.</p>
            </div>

            {contacts.length === 0 ? (
              <p className="text-sm text-muted">
                No matching company contacts yet — keep progressing your roadmap.
              </p>
            ) : (
              <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex flex-col gap-1.5 border-r border-b border-line p-5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-display text-sm font-semibold text-ink">
                        {contact.company}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted">
                        <PinIcon className="h-3 w-3" /> {contact.location} · {contact.type}
                      </span>
                    </div>
                    <span className="text-xs text-muted">{contact.position}</span>
                    <span className="text-xs text-muted">PIC: {contact.pic}</span>
                    <span className="text-xs">
                      <ContactValue value={contact.contact} />
                    </span>
                    {contact.note ? (
                      <span className="text-[11px] italic text-muted">{contact.note}</span>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 3. Consult AI */}
          <button
            type="button"
            onClick={onGoConsult}
            className="grad-blue flex items-center gap-4 border border-blue p-6 text-left"
          >
            <SparkleIcon className="h-8 w-8 shrink-0 text-ink" />
            <div className="flex flex-col">
              <span className="font-display text-lg font-semibold text-ink">
                Consult the career AI
              </span>
              <span className="text-sm text-muted">
                Ask about your progress, next steps, and how to get job-ready.
              </span>
            </div>
            <ArrowRightIcon className="ml-auto h-5 w-5 shrink-0 text-ink" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CareerContainer;
