const WEEKS = 53;
const DAYS = 7;

function CommitStreakSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-hidden="true">
      <div className="flex flex-wrap gap-6">
        <div className="h-10 w-24 rounded-lg bg-elevate animate-shimmer" />
        <div className="h-10 w-24 rounded-lg bg-elevate animate-shimmer" />
        <div className="h-10 w-24 rounded-lg bg-elevate animate-shimmer" />
      </div>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-1">
          {Array.from({ length: WEEKS }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {Array.from({ length: DAYS }).map((_, dayIndex) => (
                <span
                  key={dayIndex}
                  className="h-[11px] w-[11px] rounded-[3px] bg-elevate animate-shimmer"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommitStreakSkeleton;
