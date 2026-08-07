import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { LikertQuestion } from "../../types/onboarding";
import LikertQuestionItem from "./LikertQuestionItem";
import LikertQuestionItemSkeleton from "./LikertQuestionItemSkeleton";
import { AlertIcon, ArrowRightIcon } from "../icons";

interface OnboardingContainerProps {
  questions: LikertQuestion[];
  answers: Record<string, number>;
  isLoading: boolean;
  isError: boolean;
  onAnswer: (id: string, value: number) => void;
  onContinue: () => void;
  onRetry: () => void;
}

function OnboardingContainer({
  questions,
  answers,
  isLoading,
  isError,
  onAnswer,
  onContinue,
  onRetry,
}: OnboardingContainerProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const answeredCount = questions.filter((question) => answers[question.id]).length;
  const canContinue = questions.length > 0 && answeredCount === questions.length;

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
  }, [isLoading, isError]);

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

  return (
    <div ref={rootRef} className="min-h-screen bg-canvas px-6 pb-28 pt-14 sm:px-8">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        {/* Header */}
        <header data-animate className="flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Onboarding · Get to know yourself
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
                {answeredCount}/{questions.length}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-elevate">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{
                  width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        ) : null}

        {/* Daftar pertanyaan */}
        <section className="flex flex-col gap-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <LikertQuestionItemSkeleton key={index} />
              ))
            : questions.map((question, index) => (
                <div data-animate key={question.id}>
                  <LikertQuestionItem
                    question={question}
                    index={index}
                    value={answers[question.id]}
                    onChange={onAnswer}
                  />
                </div>
              ))}
        </section>
      </div>

      {/* Footer CTA */}
      <footer className="fixed inset-x-0 bottom-0 border-t border-line bg-surface/90 px-6 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4">
          <p className="hidden text-sm text-muted sm:block">
            {canContinue ? "All answered" : "Answer all questions to continue"}
          </p>
          <button
            type="button"
            onClick={onContinue}
            disabled={!canContinue}
            className={`ml-auto py-2 text-sm font-semibold ${
              canContinue ? "cursor-pointer text-primary" : "cursor-not-allowed text-muted"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              See recommendation <ArrowRightIcon className="h-4 w-4" />
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default OnboardingContainer;
