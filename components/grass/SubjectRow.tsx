import clsx from "clsx";

import { StudyCycle, SubjectStatus } from "@/lib/types";
import { Subject, subjects } from "@/lib/subjects";
import { getTargetForSubject } from "@/lib/targets";
import Square, { SLOT_WIDTH, SQUARE_GAP } from "./Square";
import TargetLine from "./TargetLine";

type SubjectRowProps = {
  subject: Subject;
  cycles: StudyCycle[];
  status?: SubjectStatus;
  isPriority?: boolean;
};

const sortByDate = (cycles: StudyCycle[]) =>
  [...cycles].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

export default function SubjectRow({ subject, cycles, status, isPriority }: SubjectRowProps) {
  const target = getTargetForSubject(subject);
  const orderedCycles = sortByDate(cycles);
  const maxSlots = Math.max(target, orderedCycles.length || 1);
  const trackWidth = maxSlots * SLOT_WIDTH - SQUARE_GAP;
  const slots = Array.from({ length: maxSlots }, (_, index) => orderedCycles[index]);

  const rowClassName = clsx(
    "flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-5 shadow-sm sm:gap-5 dark:border-slate-800/60 dark:bg-slate-900/70",
    isPriority && "outline outline-2 outline-orange-200/70 dark:outline-orange-400/40"
  );

  return (
    <div className={rowClassName}>
      <div className="flex items-start justify-between gap-3 text-slate-900 dark:text-white">
        <div className="flex flex-col gap-1">
          <span className="w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800/70 dark:text-slate-300">
            {subject.category}
          </span>
          <p className="text-lg font-bold leading-6 sm:text-xl">{subject.name}</p>
        </div>
        {isPriority ? (
          <span className="flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600 shadow-inner dark:bg-orange-500/15 dark:text-orange-200" aria-label="今日やる分野">
            <span aria-hidden>🔥</span>
            今日やる
          </span>
        ) : null}
      </div>
      <div className="flex flex-col items-start gap-3">
        <div
          className="relative flex items-center gap-[6px] overflow-visible"
          style={{ minWidth: trackWidth }}
          aria-label={`${subject.name} の進捗`}
        >
          <TargetLine position={target} />
          {slots.map((cycle, index) => (
            <Square key={cycle?.id ?? `empty-${index}`} accuracy={cycle?.accuracy} />
          ))}
        </div>
        <div className="flex w-full items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 sm:text-sm">
          <span className="text-slate-500 dark:text-slate-400">目標 {target} 周</span>
          <span className="text-slate-900 dark:text-white">有効 {status?.effectiveCount ?? 0} / {target}</span>
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
  const subjectOrder = subjects.map((subject) => subject.id);

  if (prioritizedSubjectId) {
    const index = subjectOrder.indexOf(prioritizedSubjectId);
    if (index > -1) {
      subjectOrder.splice(index, 1);
      subjectOrder.unshift(prioritizedSubjectId);
    }
  }

  return (
    <div className="space-y-2">
      {subjectOrder.map((subjectId) => {
        const subject = subjects.find((item) => item.id === subjectId);
        if (!subject) return null;
        return (
          <SubjectRow
            key={subjectId}
            subject={subject}
            cycles={cycles.filter((cycle) => cycle.subjectId === subjectId)}
            status={statusMap.get(subjectId)}
            isPriority={prioritizedSubjectId === subjectId}
          />
        );
      })}
    </div>
  );
};
