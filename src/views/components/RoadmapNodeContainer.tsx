import type {
  NodeStatus,
  NodeSubmission,
  Roadmap,
  RoadmapNode,
  SubmissionPayload,
  SubmissionState,
} from "@/features/roadmap/types/roadmap";
import MarkdownView from "./MarkdownView";
import NodeSubmissionPanel from "./NodeSubmissionPanel";
import { AlertIcon, ArrowLeftIcon, CheckIcon, SkillIcon } from "@/shared/icons";

interface RoadmapNodeContainerProps {
  roadmap: Roadmap | null;
  node: RoadmapNode | null;
  status: NodeStatus;
  article: string;
  submission: NodeSubmission;
  submissionState: SubmissionState | undefined;
  isLoading: boolean;
  isError: boolean;
  onBack: () => void;
  onSubmit: (payload: SubmissionPayload) => void;
  onStartQuiz: () => void;
  onRetry: () => void;
}

const SUBMISSION_LABEL: Record<NodeSubmission["type"], string> = {
  checkmark: "Mark done",
  file: "Submit a file",
  text: "Submit text/link",
  quiz: "Graded quiz",
};

function RoadmapNodeContainer({
  roadmap,
  node,
  status,
  article,
  submission,
  submissionState,
  isLoading,
  isError,
  onBack,
  onSubmit,
  onStartQuiz,
  onRetry,
}: RoadmapNodeContainerProps) {
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <AlertIcon className="h-10 w-10 text-muted" />
          <h2 className="font-display text-xl font-semibold text-ink">Couldn't load the lesson</h2>
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

  const isCompleted = status === "completed";

  return (
    <div className="min-h-screen bg-canvas px-6 py-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex w-fit items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent transition-colors hover:text-ink"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" /> {roadmap?.title ?? "Roadmap"}
          </button>
          {isLoading || !node ? (
            <div className="h-8 w-64 rounded-lg bg-surface animate-shimmer" />
          ) : (
            <div className="flex items-center gap-3">
              <SkillIcon className="h-7 w-7 shrink-0 text-primary" />
              <div className="flex flex-col">
                <h1 className="font-display text-2xl font-bold text-ink">{node.title}</h1>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold ${isCompleted ? "text-neon" : "text-primary"}`}>
                  {isCompleted ? (
                    <>
                      <CheckIcon className="h-3.5 w-3.5" /> Done
                    </>
                  ) : (
                    "In progress"
                  )}
                </span>
              </div>
            </div>
          )}
        </header>

        {/* Artikel */}
        {isLoading || !node ? (
          <div className="h-64 rounded-card  animate-shimmer" />
        ) : (
          <article className="rounded-card  p-6">
            <MarkdownView content={article} />
          </article>
        )}

        {/* Submission */}
        {!isLoading && node ? (
          <section className="flex flex-col gap-3 rounded-card  p-6">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted">
              {SUBMISSION_LABEL[submission.type]}
            </h2>
            <NodeSubmissionPanel
              key={node.id}
              submission={submission}
              state={submissionState}
              onSubmit={onSubmit}
              onStartQuiz={onStartQuiz}
            />
          </section>
        ) : null}
      </div>
    </div>
  );
}

export default RoadmapNodeContainer;
