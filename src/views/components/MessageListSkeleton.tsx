const ROWS = [
  { avatar: true, lines: ["60%", "40%"] },
  { avatar: true, lines: ["75%"] },
  { avatar: true, lines: ["50%", "68%", "30%"] },
  { avatar: true, lines: ["45%"] },
];

function MessageListSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-4" aria-hidden="true">
      {ROWS.map((row, index) => (
        <div key={index} className="flex gap-3 px-2">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-elevate animate-shimmer" />
          <div className="flex flex-1 flex-col gap-2 pt-1">
            <div className="h-3 w-28 rounded-full bg-elevate animate-shimmer" />
            {row.lines.map((width, lineIndex) => (
              <div
                key={lineIndex}
                className="h-3 rounded-full bg-elevate animate-shimmer"
                style={{ width }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MessageListSkeleton;
