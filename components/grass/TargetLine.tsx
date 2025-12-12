import clsx from "clsx";

import { SLOT_WIDTH, SQUARE_GAP } from "./Square";

export default function TargetLine({
  position,
  alignToEnd = false,
  label
}: {
  position: number;
  alignToEnd?: boolean;
  label?: string;
}) {
  const offset = Math.max(position * SLOT_WIDTH - SQUARE_GAP, 0);

  return (
    <div
      className="pointer-events-none absolute inset-y-0"
      style={alignToEnd ? { right: 0 } : { left: `${offset}px` }}
    >
      {label ? (
        <span className="absolute -top-4 right-0 translate-x-1/2 rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-700 shadow-sm dark:bg-orange-500/25 dark:text-orange-100">
          {label}
        </span>
      ) : null}
      <span
        className={clsx(
          "block h-full w-[8px] bg-orange-500/60 shadow-[0_0_0_1px_rgba(255,115,29,0.6)]",
          label && "rounded"
        )}
        aria-label={`目標周回 ${position}`}
      />
    </div>
  );
}
