function GithubNudgeCardSkeleton() {
  return (
    <div
      className="flex flex-col gap-4 rounded-card  p-6"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-elevate animate-shimmer" />
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-32 rounded-full bg-elevate animate-shimmer" />
          <div className="h-3 w-20 rounded-full bg-elevate animate-shimmer" />
        </div>
      </div>
      <div className="h-3 w-full rounded-full bg-elevate animate-shimmer" />
      <div className="h-3 w-4/5 rounded-full bg-elevate animate-shimmer" />
      <div className="h-8 w-28 rounded-full bg-elevate animate-shimmer" />
    </div>
  );
}

export default GithubNudgeCardSkeleton;
