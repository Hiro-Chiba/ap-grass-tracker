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
  const isInGoal = status?.effectiveCount !== undefined ? status.effectiveCount >= target : false;

  const rowClassName = clsx(
    "flex items-center gap-4 rounded-md px-3 py-3",
    isPriority ? "bg-red-100" : !isInGoal ? "bg-red-50" : "bg-white"
  );

  return (
    <div className={rowClassName}>
      <div className="flex w-44 items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
        {isPriority ? (
          <span className="flex items-center gap-1 rounded-full bg-red-200 px-2 py-1 text-[11px] font-bold text-red-800">
            🔥 <span>今日やる</span>
          </span>
        ) : null}
        <span className="truncate">{subject.name}</span>
      </div>
      <div className="relative flex items-center gap-1" style={{ minWidth }} aria-label={`${subject.name} の進捗`}>
        <TargetLine position={target} />
        {orderedCycles.map((cycle) => (
          <Square key={cycle.id} accuracy={cycle.accuracy} />
        ))}
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
