function ServerRailSkeleton() {
  return (
    <nav
      className="flex h-full w-[68px] shrink-0 flex-col items-center gap-3 border-r border-line bg-surface py-4"
      aria-hidden="true"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-11 w-11 rounded-2xl bg-elevate animate-shimmer" />
      ))}
    </nav>
  );
}

export default ServerRailSkeleton;
