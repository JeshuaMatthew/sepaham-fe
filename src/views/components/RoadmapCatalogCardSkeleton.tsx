function RoadmapCatalogCardSkeleton() {
  return (
    <div
      className="flex w-full flex-col gap-3 rounded-card  p-5"
      aria-hidden="true"
    >
      <div className="h-14 w-14 rounded-2xl bg-elevate animate-shimmer" />
      <div className="h-5 w-40 rounded-full bg-elevate animate-shimmer" />
      <div className="h-3 w-full rounded-full bg-elevate animate-shimmer" />
      <div className="h-3 w-3/4 rounded-full bg-elevate animate-shimmer" />
      <div className="mt-1 flex gap-2">
        <div className="h-6 w-20 rounded-full bg-elevate animate-shimmer" />
        <div className="h-6 w-20 rounded-full bg-elevate animate-shimmer" />
      </div>
    </div>
  );
}

export default RoadmapCatalogCardSkeleton;
