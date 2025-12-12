import { SLOT_WIDTH, SQUARE_GAP } from "./Square";

export default function TargetLine({ position }: { position: number }) {
  const offset = Math.max(position * SLOT_WIDTH - SQUARE_GAP, 0);

  return (
    <div className="pointer-events-none absolute inset-y-0" style={{ left: `${offset}px` }}>
      <span className="block h-full w-[3px] bg-rose-500" aria-label={`目標周回 ${position}`} />
    </div>
  );
}
