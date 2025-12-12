import clsx from "clsx";

export const SQUARE_SIZE = 24;
export const SQUARE_GAP = 6;
export const SLOT_WIDTH = SQUARE_SIZE + SQUARE_GAP;

export type SquareProps = {
  accuracy?: number;
};

const backgroundByAccuracy = (accuracy?: number) => {
  if (accuracy === undefined) return "bg-slate-200";
  if (accuracy >= 80) return "bg-emerald-600";
  if (accuracy >= 70) return "bg-emerald-200";
  return "bg-slate-200";
};

export default function Square({ accuracy }: SquareProps) {
  const className = clsx("h-6 w-6 rounded-sm", backgroundByAccuracy(accuracy));

  return <div className={className} aria-hidden />;
}
