import clsx from "clsx";

export const SQUARE_SIZE = 16;
export const SQUARE_GAP = 4;
export const SLOT_WIDTH = SQUARE_SIZE + SQUARE_GAP;

export type SquareProps = {
  accuracy?: number;
};

const backgroundByAccuracy = (accuracy?: number) => {
  if (accuracy === undefined) return "bg-[#E5E7EB]";
  if (accuracy >= 80) return "bg-[#059669]";
  if (accuracy >= 70) return "bg-[#6EE7B7]";
  return "bg-[#E5E7EB]";
};

export default function Square({ accuracy }: SquareProps) {
  const className = clsx("h-4 w-4 rounded-sm", backgroundByAccuracy(accuracy));

  return <div className={className} aria-hidden />;
}
