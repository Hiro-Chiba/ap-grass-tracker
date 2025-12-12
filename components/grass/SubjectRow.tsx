import clsx from "clsx";

import { StudyCycle, SubjectStatus } from "@/lib/types";
import { Subject, subjects } from "@/lib/subjects";
import { getTargetForSubject } from "@/lib/targets";
import { isEffectiveCycle } from "@/lib/calc";
import Square from "./Square";
import TargetLine from "./TargetLine";

type SubjectRowProps = {
  subject: Subject;
  cycles: StudyCycle[];
  status?: SubjectStatus;
  isPriority?: boolean;
  dimmed?: boolean;
};

export default function SubjectRow({ subject, cycles, status, isPriority, dimmed }: SubjectRowProps) {
  const ineffective = cycles.filter((cycle) => !isEffectiveCycle(cycle.accuracy));
  const effective = cycles.filter((cycle) => isEffectiveCycle(cycle.accuracy));
  const target = getTargetForSubject(subject);
  const maxSquares = Math.max(effective.length, target + 1);

  const isOverTarget = effective.length > target;
  const isInGoal = status?.inGoal ?? effective.length >= target;
  const stateLabel = !isInGoal ? "未達" : isOverTarget ? "超過" : "到達";

  const rowClassName = clsx(
    "flex items-start gap-3 rounded border px-3 py-4 transition dark:border-slate-800",
    isPriority
      ? "border-red-600 ring-2 ring-red-200 dark:ring-red-800"
      : "border-slate-200",
    isInGoal ? "bg-slate-50 text-slate-700 opacity-80 dark:bg-slate-800/50 dark:text-slate-200" : "bg-white/70",
    dimmed && "grayscale-[40%] opacity-60",
    isOverTarget && "cursor-not-allowed"
  );

  const badgeClassName = (variant: "warn" | "safe" | "info") =>
    clsx(
      "rounded-full px-2 py-1 text-[11px] font-semibold",
      variant === "warn" && "bg-red-50 text-red-700 ring-1 ring-red-500/60 dark:bg-red-900/30 dark:text-red-100",
      variant === "safe" && "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/60 dark:bg-emerald-900/30 dark:text-emerald-100",
      variant === "info" && "bg-slate-100 text-slate-700 ring-1 ring-slate-300 dark:bg-slate-800 dark:text-slate-100"
    );

  return (
    <div className={rowClassName}>
      <div className="w-48 space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{subject.name}</p>
          {isPriority ? <span className={badgeClassName("warn")}>🔥 今日やる</span> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className={badgeClassName(isInGoal ? "safe" : "warn")}>{stateLabel}</span>
          <span className={badgeClassName("info")}>カテゴリ: {subject.category}</span>
          {!isInGoal ? <span className={badgeClassName("warn")}>合格ライン未達</span> : null}
          {isOverTarget ? <span className={badgeClassName("info")}>操作対象外</span> : null}
          {ineffective.length > 0 ? <span className={badgeClassName("warn")}>理解不足 {ineffective.length}</span> : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-1" aria-label="無効周回">
          {ineffective.map((cycle) => (
            <Square key={cycle.id} accuracy={cycle.accuracy} />
          ))}
        </div>
        <div
          className="relative flex items-center gap-1 pt-2"
          style={{ minWidth: `${maxSquares * 28}px` }}
          aria-label="有効周回"
        >
          <TargetLine position={target} />
          {effective.map((cycle) => (
            <Square key={cycle.id} accuracy={cycle.accuracy} />
          ))}
        </div>
      </div>
    </div>
  );
}

export const SubjectRows = ({
  cycles,
  statuses,
  prioritizedSubjectId
}: {
  cycles: StudyCycle[];
  statuses: SubjectStatus[];
  prioritizedSubjectId?: number;
}) => {
  const statusMap = new Map(statuses.map((item) => [item.subjectId, item]));
  const shouldDim = Boolean(prioritizedSubjectId);

  return (
    <div className="space-y-2">
      {subjects.map((subject) => (
        <SubjectRow
          key={subject.id}
          subject={subject}
          cycles={cycles.filter((cycle) => cycle.subjectId === subject.id)}
          status={statusMap.get(subject.id)}
          isPriority={prioritizedSubjectId === subject.id}
          dimmed={shouldDim && prioritizedSubjectId !== subject.id}
        />
      ))}
    </div>
  );
};
