function HomeRoadmapHeroSkeleton() {
  return (
    <section className="flex flex-col gap-5" aria-hidden="true">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-elevate animate-shimmer" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="h-3 w-32 rounded-full bg-elevate animate-shimmer" />
          <div className="h-6 w-48 rounded-full bg-elevate animate-shimmer" />
          <div className="h-3 w-40 rounded-full bg-elevate animate-shimmer" />
        </div>
      </div>
      <div className="h-2.5 w-full rounded-full bg-elevate animate-shimmer" />
      <div className="h-11 w-44 rounded-full bg-elevate animate-shimmer" />
    </section>
  );
}

export default HomeRoadmapHeroSkeleton;
