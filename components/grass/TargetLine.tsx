export default function TargetLine({ position }: { position: number }) {
  return (
    <div className="relative h-6">
      <div
        className="absolute inset-y-0 w-px bg-amber-500"
        style={{ left: `${position * 28}px` }}
        aria-label={`目標位置 ${position}`}
      />
    </div>
  );
}
