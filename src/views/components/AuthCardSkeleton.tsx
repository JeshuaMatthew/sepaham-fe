function AuthCardSkeleton() {
  return (
    <div
      className="w-full max-w-md rounded-card  p-8"
      aria-hidden="true"
    >
      {/* Brand */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-elevate animate-shimmer" />
        <div className="h-6 w-48 rounded-full bg-elevate animate-shimmer" />
        <div className="h-4 w-56 rounded-full bg-elevate animate-shimmer" />
      </div>

      {/* SSO placeholders */}
      <div className="flex flex-col gap-3">
        <div className="h-12 rounded-full bg-elevate animate-shimmer" />
        <div className="h-12 rounded-full bg-elevate animate-shimmer" />
      </div>

      {/* Divider */}
      <div className="my-6 h-px w-full bg-line" />

      {/* Inputs */}
      <div className="flex flex-col gap-4">
        <div className="h-12 rounded-xl bg-elevate animate-shimmer" />
        <div className="h-12 rounded-xl bg-elevate animate-shimmer" />
        <div className="mt-1 h-12 rounded-full bg-elevate animate-shimmer" />
      </div>
    </div>
  );
}

export default AuthCardSkeleton;
