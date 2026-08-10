import { useEffect, useRef } from "react";
import type { ChangeEvent } from "react";
import gsap from "gsap";
import type { LikertQuestion } from "../../types/onboarding";
import LikertQuestionItem from "./LikertQuestionItem";
import LikertQuestionItemSkeleton from "./LikertQuestionItemSkeleton";
import { AlertIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon, DocIcon, GithubIcon } from "../icons";

interface OnboardingContainerProps {
  phase: "cv" | "github" | "questions";
  page: number;
  pageCount: number;
  startIndex: number;
  /** pertanyaan untuk halaman saat ini (maks 5). */
  questions: LikertQuestion[];
  answers: Record<string, number>;
  cvName: string | null;
  githubConnected: boolean;
  answeredTotal: number;
  totalQuestions: number;
  currentPageAnswered: boolean;
  isLastPage: boolean;
  isLoading: boolean;
  isError: boolean;
  onAnswer: (id: string, value: number) => void;
  onCvUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onCvRemove: () => void;
  onConnectGithub: () => void;
  onCvContinue: () => void;
  onGithubContinue: () => void;
  onGithubBack: () => void;
  onNext: () => void;
  onBack: () => void;
  onRetry: () => void;
}

function OnboardingContainer({
  phase,
  page,
  pageCount,
  startIndex,
  questions,
  answers,
  cvName,
  githubConnected,
  answeredTotal,
  totalQuestions,
  currentPageAnswered,
  isLastPage,
  isLoading,
  isError,
  onAnswer,
  onCvUpload,
  onCvRemove,
  onConnectGithub,
  onCvContinue,
  onGithubContinue,
  onGithubBack,
  onNext,
  onBack,
  onRetry,
}: OnboardingContainerProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoading || isError) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-animate]", {
        y: 18,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.05,
      });
    }, rootRef);
    return () => ctx.revert();
  }, [isLoading, isError, phase, page]);

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <h2 className="font-display text-xl font-semibold text-ink">
            Couldn't load the questionnaire
          </h2>
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer py-2 text-sm font-semibold text-primary"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ---- Tahap 1: CV (layar terpisah) ----
  if (phase === "cv") {
    return (
      <div ref={rootRef} className="min-h-screen bg-canvas px-6 pb-28 pt-14 sm:px-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
          <header data-animate className="grad-blue flex flex-col gap-3 p-6 sm:p-7">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Onboarding · Step 1 of 3
            </span>
            <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
              First, your CV
            </h1>
            <p className="max-w-xl text-sm text-muted sm:text-base">
              Optional. If you have a CV, upload it — together with your GitHub, projects, and
              roadmap it powers your career progress. You can skip and add it later.
            </p>
          </header>

          <div data-animate className="flex flex-col gap-3 border border-line bg-surface p-6">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
              <DocIcon className="h-4 w-4 text-accent" /> Upload your CV
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer border border-line px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink">
                {cvName ? "Change file" : "Choose file"}
                <input type="file" accept=".pdf,.doc,.docx" onChange={onCvUpload} className="hidden" />
              </label>
              {cvName ? (
                <>
                  <span className="inline-flex items-center gap-1.5 text-sm text-ink">
                    <DocIcon className="h-4 w-4 text-muted" /> {cvName}
                  </span>
                  <button
                    type="button"
                    onClick={onCvRemove}
                    className="cursor-pointer text-sm font-semibold text-danger hover:underline"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <span className="text-sm text-muted">PDF, DOC, or DOCX · no file chosen</span>
              )}
            </div>
          </div>
        </div>

        <footer className="fixed inset-x-0 bottom-0 border-t border-line bg-surface/90 px-6 py-4 backdrop-blur sm:px-8">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4">
            <button
              type="button"
              onClick={onCvContinue}
              className="text-sm font-semibold text-muted hover:text-ink"
            >
              Skip for now
            </button>
            <button
              type="button"
              onClick={onCvContinue}
              className="inline-flex items-center gap-1.5 py-2 text-sm font-semibold text-primary"
            >
              Continue <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // ---- Tahap 2: Connect GitHub (layar terpisah) ----
  if (phase === "github") {
    return (
      <div ref={rootRef} className="min-h-screen bg-canvas px-6 pb-28 pt-14 sm:px-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
          <header data-animate className="grad-blue flex flex-col gap-3 p-6 sm:p-7">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Onboarding · Step 2 of 3
            </span>
            <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
              Connect your GitHub
            </h1>
            <p className="max-w-xl text-sm text-muted sm:text-base">
              Link your GitHub so we can factor your repos, commits & languages into your career
              progress. Optional — you can connect it later.
            </p>
          </header>

          <div data-animate className="flex flex-col gap-3 border border-line bg-surface p-6">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
              <GithubIcon className="h-4 w-4 text-accent" /> GitHub account
            </span>
            {githubConnected ? (
              <span className="inline-flex w-fit items-center gap-1.5 text-sm text-ink">
                <CheckIcon className="h-4 w-4 text-primary" /> Connected
              </span>
            ) : (
              <button
                type="button"
                onClick={onConnectGithub}
                className="inline-flex w-fit cursor-pointer items-center gap-2 border border-line px-4 py-2 text-sm font-semibold text-primary"
              >
                <GithubIcon className="h-4 w-4" /> Connect GitHub
              </button>
            )}
          </div>
        </div>

        <footer className="fixed inset-x-0 bottom-0 border-t border-line bg-surface/90 px-6 py-4 backdrop-blur sm:px-8">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4">
            <button
              type="button"
              onClick={onGithubBack}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink"
            >
              <ArrowLeftIcon className="h-4 w-4" /> Back
            </button>
            <button
              type="button"
              onClick={onGithubContinue}
              className="inline-flex items-center gap-1.5 py-2 text-sm font-semibold text-primary"
            >
              {githubConnected ? "Continue" : "Skip for now"} <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // ---- Tahap 3: Kuesioner (5 per halaman) ----
  const canFinish = totalQuestions > 0 && answeredTotal === totalQuestions;

  return (
    <div ref={rootRef} className="min-h-screen bg-canvas px-6 pb-28 pt-14 sm:px-8">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <header data-animate className="flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Onboarding · Step 3 of 3 · Page {page + 1} of {pageCount}
          </span>
          <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
            How much do you agree?
          </h1>
          <p className="max-w-xl text-sm text-muted sm:text-base">
            Answer each statement honestly on a 1–5 scale. Your answers recommend a role & sort
            the roadmaps that fit you best.
          </p>
        </header>

        {/* Progress */}
        {!isLoading ? (
          <div data-animate className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Answered</span>
              <span className="font-mono font-semibold text-ink">
                {answeredTotal}/{totalQuestions}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-elevate">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{
                  width: `${totalQuestions ? (answeredTotal / totalQuestions) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        ) : null}

        {/* Pertanyaan halaman ini */}
        <section className="flex flex-col gap-4">
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <LikertQuestionItemSkeleton key={index} />
              ))
            : questions.map((question, index) => (
                <div data-animate key={question.id}>
                  <LikertQuestionItem
                    question={question}
                    index={startIndex + index}
                    value={answers[question.id]}
                    onChange={onAnswer}
                  />
                </div>
              ))}
        </section>
      </div>

      {/* Footer navigasi */}
      <footer className="fixed inset-x-0 bottom-0 border-t border-line bg-surface/90 px-6 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Back
          </button>
          {isLastPage ? (
            <button
              type="button"
              onClick={onNext}
              disabled={!canFinish}
              className={`py-2 text-sm font-semibold ${
                canFinish ? "cursor-pointer text-primary" : "cursor-not-allowed text-muted"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                See recommendation <ArrowRightIcon className="h-4 w-4" />
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              disabled={!currentPageAnswered}
              className={`py-2 text-sm font-semibold ${
                currentPageAnswered ? "cursor-pointer text-primary" : "cursor-not-allowed text-muted"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                Next <ArrowRightIcon className="h-4 w-4" />
              </span>
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

export default OnboardingContainer;
