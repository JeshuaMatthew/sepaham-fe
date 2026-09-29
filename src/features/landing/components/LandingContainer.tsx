import { useEffect, useRef } from "react";
import type { ComponentType } from "react";
import { useQuery } from "@tanstack/react-query";
import gsap from "gsap";
import { ROLES_QUERY_KEY, fetchRoles } from "@/features/onboarding/services/roleService";
import {
  ArrowRightIcon,
  BrandIcon,
  ChartIcon,
  ChatIcon,
  CheckCircleIcon,
  CodeIcon,
  CompassIcon,
  GradIcon,
  GithubIcon,
  MapIcon,
  PhoneIcon,
  SkillIcon,
  SparkleIcon,
  UsersIcon,
  VideoIcon,
} from "@/shared/icons";

interface LandingContainerProps {
  onLogin: () => void;
  onRegister: () => void;
}

interface Feature {
  icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  tag?: string;
}

const FEATURES: Feature[] = [
  {
    icon: GradIcon,
    title: "AI-Powered Onboarding",
    desc: "Answer a short essay and assessment — our AI analyzes your interests and recommends the IT role that fits you best.",
    tag: "Smart",
  },
  {
    icon: SkillIcon,
    title: "Interactive Learning Roadmap",
    desc: "A skill tree per IT role. Unlock nodes, complete skills, and track your progress visually — never lose your way.",
    tag: "Core",
  },
  {
    icon: ChartIcon,
    title: "Career Readiness Score",
    desc: "A live score that combines your roadmap progress, GitHub activity, projects, and CV — so you know when you're internship-ready.",
    tag: "Insight",
  },
  {
    icon: CompassIcon,
    title: "AI Career Consultation",
    desc: "Chat with an AI mentor that knows your roadmap, GitHub stats, and preferences — ask about next steps, projects, or interview prep.",
    tag: "AI",
  },
  {
    icon: ChatIcon,
    title: "Slack-Style Community",
    desc: "Channels per campus or topic, threaded replies, and anonymous questions — ask anything without fear.",
    tag: "Social",
  },
  {
    icon: PhoneIcon,
    title: "Group Voice & Video Calls",
    desc: "Start a voice or video call right inside any channel. Study together, pair prep, or just hang out.",
    tag: "Live",
  },
  {
    icon: UsersIcon,
    title: "Find a Project Team",
    desc: "Post a project idea and find teammates with the skills you need. A team community is created automatically.",
    tag: "Collab",
  },
  {
    icon: GithubIcon,
    title: "GitHub Dev-Card",
    desc: "Your developer profile: public repo languages, top repos, and achievement badges.",
    tag: "Profile",
  },
  {
    icon: MapIcon,
    title: "Smart Home Feed",
    desc: "A daily summary: a motivational quote, your commit streak, career readiness, and personalized recommendations.",
    tag: "Daily",
  },
];

const STEPS: { no: string; title: string; desc: string }[] = [
  {
    no: "1",
    title: "Sign up & pick a role",
    desc: "Join as a student in seconds and let the app learn your interests.",
  },
  {
    no: "2",
    title: "Let AI find your path",
    desc: "Answer a short essay and assessment. Our AI recommends the role and roadmap that fits you.",
  },
  {
    no: "3",
    title: "Learn, connect, build",
    desc: "Follow your roadmap, join communities, find a team, and start building real projects together.",
  },
];

function LandingContainer({ onLogin, onRegister }: LandingContainerProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Jumlah role dibaca dari katalog, bukan ditulis di markup: role bisa
  // ditambah/diubah dosen lewat /faculty/roles, jadi angka hardcoded langsung
  //.bohongi orang yang membacanya.
  const { data: roles } = useQuery({ queryKey: ROLES_QUERY_KEY, queryFn: fetchRoles });
  const roleCount = roles?.length ?? 0;
  const roleCountLabel = roleCount > 0 ? `${roleCount} IT roles` : "IT roles";
  const careerPathsLabel = roleCount > 0 ? `${roleCount} career paths` : "career paths";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-reveal]", {
        y: 24,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-canvas text-ink">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-canvas/80 px-6 py-4 backdrop-blur sm:px-8">
        <div className="flex items-center gap-2 text-primary">
          <BrandIcon className="h-5 w-5" />
          <span className="font-display text-lg font-bold">Sepaham</span>
        </div>
        <nav className="ml-8 hidden items-center gap-6 text-sm text-muted md:flex">
          <a href="#features" className="transition-colors hover:text-ink">Features</a>
          <a href="#how" className="transition-colors hover:text-ink">How it works</a>
          <a href="#roles" className="transition-colors hover:text-ink">Roles</a>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <button
            type="button"
            onClick={onLogin}
            className="cursor-pointer text-sm font-semibold text-muted transition-colors hover:text-ink"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={onRegister}
            className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-primary transition-opacity hover:opacity-80"
          >
            Sign up free <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-neon/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-28 lg:py-36">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="flex flex-col items-start gap-6">
              <span
                data-reveal
                className="inline-flex items-center gap-1.5 border border-line px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-accent"
              >
                <SparkleIcon className="h-3.5 w-3.5" /> For IT students
              </span>
              <h1
                data-reveal
                className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
              >
                Learn, code, and connect in one place
              </h1>
              <p data-reveal className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                Sepaham brings together an AI-powered learning roadmap, a Slack-style
                community, and project team matching — so your journey to becoming a
                developer isn't a solo one.
              </p>
              <div data-reveal className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={onRegister}
                  className="inline-flex cursor-pointer items-center gap-2 rounded bg-primary px-6 py-3 text-base font-semibold text-canvas transition-transform hover:scale-105"
                >
                  Start for free <ArrowRightIcon className="h-4 w-4" />
                </button>
                <a
                  href="#features"
                  className="inline-flex cursor-pointer items-center gap-1.5 text-base font-semibold text-muted transition-colors hover:text-ink"
                >
                  See all features <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
              <div data-reveal className="flex flex-wrap gap-4 pt-4 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <CheckCircleIcon className="h-3.5 w-3.5 text-neon" /> Free for students
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircleIcon className="h-3.5 w-3.5 text-neon" /> {roleCountLabel}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircleIcon className="h-3.5 w-3.5 text-neon" /> AI-powered
                </span>
              </div>
            </div>

            {/* Hero illustration */}
            <div data-reveal className="hidden w-full lg:block">
              <div className="relative h-[420px] w-full">
                {/* Backdrop card */}
                <div className="absolute top-8 right-4 h-64 w-64 rounded-2xl border border-line bg-surface/50 p-6 backdrop-blur-md">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue" />
                    <div>
                      <div className="mb-1.5 h-3 w-20 rounded bg-line" />
                      <div className="h-2 w-12 rounded bg-line" />
                    </div>
                  </div>
                  <div className="mb-2 h-2 w-full rounded bg-line" />
                  <div className="mb-2 h-2 w-4/5 rounded bg-line" />
                  <div className="mb-2 h-2 w-3/5 rounded bg-line" />
                  <div className="h-2 w-2/3 rounded bg-line" />
                </div>

                {/* Roadmap card */}
                <div className="absolute top-32 left-4 h-56 w-72 rounded-2xl border border-line bg-surface/80 p-5 shadow-2xl backdrop-blur-xl">
                  <div className="mb-4 flex items-center gap-2">
                    <SkillIcon className="h-4 w-4 text-accent" />
                    <span className="font-mono text-xs uppercase tracking-wider text-muted">Frontend Engineer</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-neon" />
                      <span className="text-xs text-muted line-through">HTML & CSS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-neon" />
                      <span className="text-xs text-muted line-through">JavaScript</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-accent" />
                      <span className="text-xs font-medium text-ink">React</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border border-line" />
                      <span className="text-xs text-muted">Next.js</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border border-line" />
                      <span className="text-xs text-muted">Testing</span>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute top-4 right-16 flex items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2 shadow-lg">
                  <GithubIcon className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">7-day streak</span>
                </div>
                <div className="absolute bottom-16 right-8 flex items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2 shadow-lg">
                  <VideoIcon className="h-4 w-4 text-accent" />
                  <span className="text-xs font-medium">Group call</span>
                </div>
                <div className="absolute bottom-4 left-16 flex items-center gap-2 rounded-xl border border-line bg-canvas px-3 py-2 shadow-lg">
                  <UsersIcon className="h-4 w-4 text-neon" />
                  <span className="text-xs font-medium">3 teammates found</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section id="features" className="border-t border-line">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
          <div className="mb-12 flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Features
            </span>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Everything you need to grow
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted">
              From structured learning to real collaboration — Sepaham gives you the
              tools, the community, and the direction to become a job-ready developer.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group flex flex-col gap-3 bg-canvas p-6 transition-colors hover:bg-surface/50"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-6 w-6 text-primary transition-colors group-hover:text-accent" />
                    {feature.tag && (
                      <span className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                        {feature.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-base font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Roles ===== */}
      <section id="roles" className="border-t border-line bg-surface/30">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
          <div className="mb-12 flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Career Paths
            </span>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              {roleCount > 0 ? `${roleCount} IT roles` : "Many IT roles"}, one platform
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted">
              Each role has its own curated roadmap, learning content, and community.
              Switch anytime — your progress is always saved.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {(roles ?? []).slice(0, 8).map((role) => (
              <div
                key={role.id}
                className="flex flex-col items-center gap-2 rounded-xl border border-line bg-canvas p-4 text-center transition-colors hover:bg-surface/50"
              >
                <CodeIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                <span className="text-xs font-medium text-muted">{role.title}</span>
              </div>
            ))}
            {(roles ?? []).length > 8 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-canvas p-4 text-center">
                <SparkleIcon className="h-6 w-6 text-accent" aria-hidden="true" />
                <span className="text-xs font-medium text-muted">
                  +{(roles ?? []).length - 8} lainnya
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section id="how" className="border-t border-line">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
          <div className="mb-12 flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              How it works
            </span>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Get started in 3 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.no} className="flex flex-col gap-4 bg-canvas p-8">
                <span className="font-display text-4xl font-bold text-primary/30">
                  {step.no}
                </span>
                <h3 className="font-display text-xl font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Faculty section ===== */}
      <section className="border-t border-line bg-surface/30">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                For Faculty
              </span>
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                Guide your students with confidence
              </h2>
              <p className="max-w-lg text-sm leading-relaxed text-muted">
                A dedicated faculty dashboard to manage roadmaps, review student
                progress, moderate community requests, and update onboarding
                questions — all in one place.
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {[
                  "Edit roadmap nodes visually with drag-and-drop",
                  "Track each student's career readiness score",
                  "Moderate project team requests",
                  "Update onboarding question bank",
                  "View GitHub stats and CV uploads",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted">
                    <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-neon" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden lg:block">
              <div className="relative h-[320px] rounded-2xl border border-line bg-canvas p-6">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue" />
                  <div>
                    <div className="mb-1 h-3 w-24 rounded bg-line" />
                    <div className="h-2 w-16 rounded bg-line" />
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                    Ilustrasi — contoh tampilan progres
                  </p>
                  {[80, 65, 45].map((pct, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-lg border border-line p-3">
                      <div className="h-8 w-8 rounded-full bg-line" />
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="h-2 w-20 rounded bg-line" aria-hidden="true" />
                          <span className="text-xs text-muted">{pct}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-line">
                          <div
                            className="h-full rounded-full bg-primary/60"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8">
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-line bg-gradient-to-br from-primary/5 to-accent/5 p-12 text-center sm:p-20">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Ready to start your journey?
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-muted">
              Free for students. Sign up now and find the roadmap that fits
              you — your future self will thank you.
            </p>
            <button
              type="button"
              onClick={onRegister}
              className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded bg-primary px-8 py-3.5 text-base font-semibold text-canvas transition-transform hover:scale-105"
            >
              Sign up free <ArrowRightIcon className="h-4 w-4" />
            </button>
            <p className="text-xs text-muted">
              {careerPathsLabel} · AI-powered matching
            </p>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-line">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary">
                <BrandIcon className="h-4 w-4" />
                <span className="font-display text-sm font-semibold">Sepaham</span>
              </div>
              <p className="text-xs text-muted">
                A community &amp; learning roadmap for IT students.
              </p>
            </div>
            <div className="flex gap-12 text-xs text-muted">
              <div className="flex flex-col gap-2">
                <span className="font-semibold text-ink">Platform</span>
                <a href="#features" className="transition-colors hover:text-ink">Features</a>
                <a href="#roles" className="transition-colors hover:text-ink">Career Paths</a>
                <a href="#how" className="transition-colors hover:text-ink">How it works</a>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-semibold text-ink">For Students</span>
                <button type="button" onClick={onLogin} className="text-left transition-colors hover:text-ink">Log in</button>
                <button type="button" onClick={onRegister} className="text-left transition-colors hover:text-ink">Sign up</button>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-line pt-6 text-center text-xs text-muted">
            © 2026 Sepaham — Learn, code, and connect.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingContainer;
