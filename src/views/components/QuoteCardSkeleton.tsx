function QuoteCardSkeleton() {
  return (
    <div
      className="flex flex-col gap-4 rounded-card  p-6"
      aria-hidden="true"
    >
      <div className="h-3 w-32 rounded-full bg-elevate animate-shimmer" />
      <div className="flex flex-col gap-2">
        <div className="h-5 w-full rounded-full bg-elevate animate-shimmer" />
        <div className="h-5 w-3/4 rounded-full bg-elevate animate-shimmer" />
        <div className="h-3 w-28 rounded-full bg-elevate animate-shimmer" />
      </div>
    </div>
  );
}

export default QuoteCardSkeleton;
