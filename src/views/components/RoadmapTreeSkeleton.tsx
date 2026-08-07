// Posisi placeholder meniru sebaran node pada skill tree.
const NODE_SPOTS = [
  { x: 50, y: 6 },
  { x: 50, y: 20 },
  { x: 84, y: 20 },
  { x: 28, y: 34 },
  { x: 72, y: 34 },
  { x: 50, y: 48 },
  { x: 22, y: 63 },
  { x: 50, y: 63 },
  { x: 78, y: 63 },
  { x: 50, y: 85 },
];

function RoadmapTreeSkeleton() {
  return (
    <div
      className="relative mx-auto h-[720px] w-full max-w-2xl sm:h-[820px]"
      aria-hidden="true"
    >
      {NODE_SPOTS.map((spot, index) => (
        <div
          key={index}
          className="absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-elevate animate-shimmer"
          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
        />
      ))}
    </div>
  );
}

export default RoadmapTreeSkeleton;
