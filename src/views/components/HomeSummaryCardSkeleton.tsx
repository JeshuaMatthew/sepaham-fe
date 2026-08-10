function HomeSummaryCardSkeleton() {
  return (
    <div
      className="flex flex-col gap-3 rounded-card  p-5"
      aria-hidden="true"
    >
      <div className="h-10 w-10 rounded-xl bg-elevate animate-shimmer" />
      <div className="flex flex-col gap-1.5">
        <div className="h-5 w-16 rounded-full bg-elevate animate-shimmer" />
        <div className="h-3 w-24 rounded-full bg-elevate animate-shimmer" />
        <div className="h-3 w-20 rounded-full bg-elevate animate-shimmer" />
      </div>
    </div>
  );
}

export default HomeSummaryCardSkeleton;
