function RepoCardSkeleton() {
  return (
    <div
      className="flex h-full flex-col gap-3 rounded-card  p-5"
      aria-hidden="true"
    >
      <div className="h-4 w-32 rounded-full bg-elevate animate-shimmer" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-3 w-full rounded-full bg-elevate animate-shimmer" />
        <div className="h-3 w-4/5 rounded-full bg-elevate animate-shimmer" />
      </div>
      <div className="flex gap-4">
        <div className="h-3 w-16 rounded-full bg-elevate animate-shimmer" />
        <div className="h-3 w-10 rounded-full bg-elevate animate-shimmer" />
      </div>
    </div>
  );
}

export default RepoCardSkeleton;
