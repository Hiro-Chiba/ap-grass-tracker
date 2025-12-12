import { SLOT_WIDTH, SQUARE_GAP } from "./Square";

export default function TargetLine({
  position,
  alignToEnd = false
}: {
  position: number;
  alignToEnd?: boolean;
}) {
  const offset = Math.max(position * SLOT_WIDTH - SQUARE_GAP, 0);

  return (
    <div
      className="pointer-events-none absolute inset-y-0"
      style={alignToEnd ? { right: 0 } : { left: `${offset}px` }}
    >
      <span
        className="block h-full w-[8px] rounded bg-orange-500/60 shadow-[0_0_0_1px_rgba(255,115,29,0.6)]"
        aria-label={`目標周回 ${position}`}
      />
    </div>
  );
}
