function InternshipContactCardSkeleton() {
  return (
    <div
      className="flex flex-col gap-3 rounded-card  p-5"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-elevate animate-shimmer" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-32 rounded-full bg-elevate animate-shimmer" />
          <div className="h-3 w-20 rounded-full bg-elevate animate-shimmer" />
        </div>
      </div>
      <div className="h-3 w-2/3 rounded-full bg-elevate animate-shimmer" />
      <div className="h-8 w-28 rounded-full bg-elevate animate-shimmer" />
    </div>
  );
}

export default InternshipContactCardSkeleton;
