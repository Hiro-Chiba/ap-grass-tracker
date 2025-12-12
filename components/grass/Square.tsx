import clsx from "clsx";

export type SquareProps = {
  accuracy?: number;
};

const backgroundByAccuracy = (accuracy?: number) => {
  if (accuracy === undefined) return "";
  if (accuracy >= 80) return "bg-emerald-700";
  if (accuracy >= 70) return "bg-emerald-500";
  return "border border-emerald-500 text-emerald-700";
};

export default function Square({ accuracy }: SquareProps) {
  const className = clsx(
    "flex h-6 w-6 items-center justify-center rounded-sm text-[10px] font-bold transition",
    backgroundByAccuracy(accuracy)
  );

  return <div className={className}>{accuracy !== undefined && accuracy < 70 ? "□" : ""}</div>;
}
