function ChannelSidebarSkeleton() {
  return (
    <aside
      className="hidden h-full w-60 shrink-0 flex-col border-r border-line bg-surface sm:flex"
      aria-hidden="true"
    >
      <div className="border-b border-line px-4 py-4">
        <div className="h-5 w-40 rounded-full bg-elevate animate-shimmer" />
      </div>
      <div className="flex flex-col gap-3 px-3 py-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-6 w-full rounded-lg bg-elevate animate-shimmer" />
        ))}
      </div>
    </aside>
  );
}

export default ChannelSidebarSkeleton;
