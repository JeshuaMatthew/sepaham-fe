// Lebar bar variatif agar terlihat natural saat loading.
const BAR_WIDTHS = ["78%", "60%", "45%", "34%", "22%"];

function LanguageChartSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      {BAR_WIDTHS.map((width, index) => (
        <div key={index} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 rounded-full bg-elevate animate-shimmer" />
            <div className="h-4 w-10 rounded-full bg-elevate animate-shimmer" />
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-elevate">
            <div
              className="h-full rounded-full bg-line animate-shimmer"
              style={{ width }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LanguageChartSkeleton;
