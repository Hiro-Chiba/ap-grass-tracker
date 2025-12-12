import clsx from "clsx";

import { StudyCycle, SubjectStatus } from "@/lib/types";
import { Subject, subjects } from "@/lib/subjects";
import { getTargetForSubject } from "@/lib/targets";
import Square, { SLOT_WIDTH, SQUARE_SIZE } from "./Square";
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
  const minWidth = Math.max(orderedCycles.length, target) * SLOT_WIDTH + SQUARE_SIZE;

  const rowClassName = clsx(
    "flex items-center gap-4 rounded-xl border border-slate-200/70 bg-white/80 px-3 py-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/70",
    isPriority && "outline outline-2 outline-orange-200/70 dark:outline-orange-400/40"
  );

  return (
    <div className={rowClassName}>
      <div className="flex w-48 flex-col gap-1 text-slate-900 dark:text-white">
        <div className="flex items-center gap-2 text-base font-semibold">
          {isPriority ? <span aria-hidden>🔥</span> : null}
          <span className="truncate">{subject.name}</span>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {subject.category}
        </span>
      </div>
      <div className="relative flex items-center gap-1" style={{ minWidth }} aria-label={`${subject.name} の進捗`}>
        <TargetLine position={target} />
        {orderedCycles.map((cycle) => (
          <Square key={cycle.id} accuracy={cycle.accuracy} />
        ))}
      </div>
      <div className="ml-auto text-sm font-semibold text-slate-700 dark:text-slate-200">{`${
        status?.effectiveCount ?? 0
      } / ${target}`}</div>
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
