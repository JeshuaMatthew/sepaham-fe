function BadgeItemSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2" aria-hidden="true">
      <div className="h-16 w-16 rounded-2xl bg-elevate animate-shimmer" />
      <div className="h-3 w-14 rounded-full bg-elevate animate-shimmer" />
      <div className="h-2 w-10 rounded-full bg-elevate animate-shimmer" />
    </div>
  );
}

export default BadgeItemSkeleton;
