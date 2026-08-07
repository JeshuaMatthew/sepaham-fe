function ProfileHeaderSkeleton() {
  return (
    <div
      className="flex flex-col items-center gap-5 rounded-card  p-6 sm:flex-row sm:items-start"
      aria-hidden="true"
    >
      <div className="h-24 w-24 shrink-0 rounded-2xl bg-elevate animate-shimmer" />
      <div className="flex w-full flex-col gap-3">
        <div className="h-7 w-52 rounded-full bg-elevate animate-shimmer" />
        <div className="h-4 w-32 rounded-full bg-elevate animate-shimmer" />
        <div className="h-4 w-72 max-w-full rounded-full bg-elevate animate-shimmer" />
        <div className="h-4 w-full max-w-md rounded-full bg-elevate animate-shimmer" />
      </div>
    </div>
  );
}

export default ProfileHeaderSkeleton;
