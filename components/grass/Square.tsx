import clsx from "clsx";

export type SquareProps = {
  accuracy?: number;
};

const backgroundByAccuracy = (accuracy?: number) => {
  if (accuracy === undefined) return "";
  if (accuracy >= 80) return "bg-emerald-700";
  if (accuracy >= 70) return "bg-emerald-500";
  return "border-2 border-red-500 bg-red-50 text-red-700";
};

export default function Square({ accuracy }: SquareProps) {
  const isInvalid = accuracy !== undefined && accuracy < 70;
  const className = clsx(
    "relative flex h-6 w-6 items-center justify-center rounded-sm text-[10px] font-bold transition",
    backgroundByAccuracy(accuracy)
  );

  return (
    <div className="relative group">
      <div className={className} aria-label={isInvalid ? "無効周回" : "有効周回"} title={isInvalid ? "理解不足のまま進んでいます" : undefined}>
        {isInvalid ? "□" : ""}
      </div>
      {isInvalid ? (
        <div className="pointer-events-none absolute -top-10 left-1/2 hidden w-40 -translate-x-1/2 rounded bg-red-700 px-2 py-1 text-[10px] font-semibold text-white shadow-lg group-hover:block group-active:block">
          理解不足のまま進んでいます
        </div>
      ) : null}
    </div>
  );
}
