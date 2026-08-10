function HomeCollabCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-5" aria-hidden="true">
      <div className="h-4 w-2/3 rounded-full bg-elevate animate-shimmer" />
      <div className="h-3 w-full rounded-full bg-elevate animate-shimmer" />
      <div className="h-3 w-4/5 rounded-full bg-elevate animate-shimmer" />
      <div className="flex gap-1.5 pt-1">
        <div className="h-5 w-16 bg-elevate animate-shimmer" />
        <div className="h-5 w-16 bg-elevate animate-shimmer" />
      </div>
    </div>
  );
}

export default HomeCollabCardSkeleton;
