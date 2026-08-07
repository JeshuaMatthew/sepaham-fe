import { LIKERT_OPTIONS } from "../../utils/likert";

function LikertQuestionItemSkeleton() {
  return (
    <div
      className="flex flex-col gap-3 rounded-card  p-5"
      aria-hidden="true"
    >
      <div className="h-4 w-4/5 rounded-full bg-elevate animate-shimmer" />
      <div className="flex gap-1.5">
        {LIKERT_OPTIONS.map((option) => (
          <div key={option.value} className="h-10 flex-1 rounded-lg bg-elevate animate-shimmer" />
        ))}
      </div>
    </div>
  );
}

export default LikertQuestionItemSkeleton;
