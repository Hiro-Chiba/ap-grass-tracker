export default function TargetLine({ position }: { position: number }) {
  return (
    <div className="relative h-6">
      <div
        className="absolute inset-y-0 w-[3px] bg-red-700 shadow-[0_0_0_1px_rgba(127,29,29,0.35)]"
        style={{ left: `${position * 28}px` }}
        aria-label={`目標位置 ${position}`}
      >
        <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-white px-1 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700 shadow-sm dark:bg-slate-900 dark:text-red-200">
          合格ライン
        </span>
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold text-red-800 dark:text-red-200">
          ここを超えないと不合格
        </span>
      </div>
    </div>
  );
}
