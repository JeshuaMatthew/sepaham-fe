function ActiveCommunityCardSkeleton() {
  return (
    <section
      className="flex flex-col gap-4 rounded-card  p-5"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 shrink-0 rounded-2xl bg-elevate animate-shimmer" />
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="h-4 w-40 rounded-full bg-elevate animate-shimmer" />
          <div className="h-3 w-24 rounded-full bg-elevate animate-shimmer" />
        </div>
      </div>
      <div className="grid grid-cols-1 border-l border-t border-line sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 border-r border-b border-line px-3 py-2"
          >
            <div className="h-9 w-9 shrink-0 rounded-full bg-elevate animate-shimmer" />
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="h-3 w-24 rounded-full bg-elevate animate-shimmer" />
              <div className="h-2.5 w-32 rounded-full bg-elevate animate-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ActiveCommunityCardSkeleton;
