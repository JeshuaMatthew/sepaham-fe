import { useEffect, useRef } from "react";
import type { ComponentType } from "react";
import gsap from "gsap";
import {
  ActivityIcon,
  ArrowRightIcon,
  BrandIcon,
  ChatIcon,
  CodeIcon,
  MapIcon,
  SparkleIcon,
  UsersIcon,
} from "@/shared/icons";

interface LandingContainerProps {
  onLogin: () => void;
  onRegister: () => void;
}

const FEATURES: { icon: ComponentType<{ className?: string }>; title: string; desc: string }[] = [
  {
    icon: MapIcon,
    title: "Interactive learning roadmap",
    desc: "A skill tree per IT role. Work through each skill, submit proof, and track your progress.",
  },
  {
    icon: ChatIcon,
    title: "Community & calls",
    desc: "Slack-style chat: channels, threads, anonymous questions, plus group/video calls with music.",
  },
  {
    icon: UsersIcon,
    title: "Find a project team",
    desc: "Invite other students to build an app together — a team community is created automatically.",
  },
  {
    icon: ActivityIcon,
    title: "Active community",
    desc: "See who's online right now and what they're up to in each community.",
  },
  {
    icon: CodeIcon,
    title: "GitHub Dev-Card",
    desc: "Your developer profile: languages, commit streak, top repos, and achievement badges.",
  },
  {
    icon: SparkleIcon,
    title: "Smart home",
    desc: "A daily summary: a quote, your commit streak, and internship recommendations that fit you.",
  },
];

const STEPS: { no: string; title: string; desc: string }[] = [
  { no: "1", title: "Sign up & pick a role", desc: "Join as a student or faculty member in seconds." },
  { no: "2", title: "Know your interests", desc: "Answer a short questionnaire to get a role & roadmap that fit you." },
  { no: "3", title: "Learn & connect", desc: "Follow the roadmap, join communities, and find a project team." },
];

function LandingContainer({ onLogin, onRegister }: LandingContainerProps) {
  const rootRef = useRef<HTMLDivElement>(null);

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
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-canvas/80 px-6 py-4 backdrop-blur sm:px-8">
        <div className="flex items-center gap-2 text-primary">
          <BrandIcon className="h-5 w-5" />
          <span className="font-display text-lg font-bold">Sepaham</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <button type="button" onClick={onLogin} className="cursor-pointer text-sm font-semibold text-muted hover:text-ink">
            Log in
          </button>
          <button type="button" onClick={onRegister} className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-primary">
            Sign up free <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      <section className="px-6 py-20 sm:px-8 sm:py-28 lg:py-36">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-6">
            <span data-reveal className="inline-flex items-center gap-1.5 border border-line px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-accent">
              <SparkleIcon className="h-3.5 w-3.5" /> For IT students
            </span>
            <h1 data-reveal className="font-display text-4xl font-bold leading-tight sm:text-6xl lg:text-[4rem]">
              Learn, code, and connect in one place
            </h1>
            <p data-reveal className="max-w-xl text-base text-muted sm:text-lg">
              Sepaham brings together an interactive learning roadmap, a Slack-style community, and
              project team matching — so your journey to becoming a developer isn't a solo one.
            </p>
            <div data-reveal className="flex flex-wrap items-center justify-start gap-6 pt-4">
              <button type="button" onClick={onRegister} className="inline-flex cursor-pointer items-center gap-2 rounded bg-primary px-6 py-3 text-base font-semibold text-canvas transition-transform hover:scale-105">
                Start for free <ArrowRightIcon className="h-4 w-4" />
              </button>
              <button type="button" onClick={onLogin} className="cursor-pointer text-base font-semibold text-muted hover:text-ink">
                I already have an account
              </button>
            </div>
          </div>
          <div data-reveal className="hidden h-full w-full lg:block">
            <div className="relative h-[400px] w-full">
              <div className="absolute top-10 right-10 h-64 w-64 rounded-2xl border border-line bg-surface/50 p-6 backdrop-blur-md">
                <div className="mb-4 h-8 w-8 rounded-full bg-blue" />
                <div className="mb-2 h-4 w-3/4 rounded bg-line" />
                <div className="h-4 w-1/2 rounded bg-line" />
              </div>
              <div className="absolute top-40 left-10 h-56 w-72 rounded-2xl border border-line bg-surface/80 p-6 shadow-2xl backdrop-blur-xl">
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-line" />
                  <div>
                    <div className="mb-2 h-3 w-20 rounded bg-line" />
                    <div className="h-2 w-12 rounded bg-line" />
                  </div>
                </div>
                <div className="mb-2 h-2 w-full rounded bg-line" />
                <div className="h-2 w-4/5 rounded bg-line" />
              </div>
              <div className="absolute -bottom-4 right-32 flex h-24 w-48 items-center gap-3 rounded-xl border border-line bg-canvas p-4 shadow-xl">
                <ChatIcon className="h-6 w-6 text-accent" />
                <div>
                  <div className="mb-1.5 h-2 w-16 rounded bg-line" />
                  <div className="h-1.5 w-10 rounded bg-line" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Features</span>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Everything you need to grow</h2>
            <p className="max-w-xl text-sm text-muted">From structured learning to real collaboration with people on your wavelength.</p>
          </div>
          <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex flex-col gap-3 border-r border-b border-line p-6">
                  <Icon className="h-6 w-6 text-primary" />
                  <h3 className="font-display text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">How it works</span>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Get started in 3 steps</h2>
          </div>
          <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.no} className="flex flex-col gap-3 border-r border-b border-line p-6">
                <span className="font-display text-2xl font-bold text-primary">{step.no}</span>
                <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 border border-line bg-surface/50 p-12 text-center sm:p-20">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to start your journey?</h2>
          <p className="max-w-lg text-sm text-muted">Free for every student. Sign up now and find the roadmap that fits you.</p>
          <button type="button" onClick={onRegister} className="inline-flex cursor-pointer items-center gap-1.5 text-base font-semibold text-primary">
            Sign up free <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </section>

      <footer className="border-t border-line px-6 py-8 text-xs text-muted sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-2">
          <div className="flex items-center gap-2 text-primary">
            <BrandIcon className="h-3.5 w-3.5" />
            <span className="font-display text-sm font-semibold">Sepaham</span>
          </div>
          <p>A community &amp; learning roadmap for IT students.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingContainer;
