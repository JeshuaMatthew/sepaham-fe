function CollabRequestCardSkeleton() {
  return (
    <div
      className="flex flex-col gap-3 rounded-card  p-5"
      aria-hidden="true"
    >
      <div className="h-4 w-3/5 rounded-full bg-elevate animate-shimmer" />
      <div className="h-3 w-full rounded-full bg-elevate animate-shimmer" />
      <div className="h-3 w-4/5 rounded-full bg-elevate animate-shimmer" />
      <div className="flex gap-1.5">
        <div className="h-5 w-16 rounded-full bg-elevate animate-shimmer" />
        <div className="h-5 w-16 rounded-full bg-elevate animate-shimmer" />
      </div>
      <div className="mt-1 flex items-center justify-between border-t border-line pt-3">
        <div className="h-7 w-28 rounded-full bg-elevate animate-shimmer" />
        <div className="h-7 w-20 rounded-full bg-elevate animate-shimmer" />
      </div>
    </div>
  );
}

export default CollabRequestCardSkeleton;
