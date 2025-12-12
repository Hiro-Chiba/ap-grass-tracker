import { StudyCycle } from "@/lib/types";
import { Subject, subjects } from "@/lib/subjects";
import { getTargetForSubject } from "@/lib/targets";
import { isEffectiveCycle } from "@/lib/calc";
import Square from "./Square";
import TargetLine from "./TargetLine";

export default function SubjectRow({ subject, cycles }: { subject: Subject; cycles: StudyCycle[] }) {
  const ineffective = cycles.filter((cycle) => !isEffectiveCycle(cycle.accuracy));
  const effective = cycles.filter((cycle) => isEffectiveCycle(cycle.accuracy));
  const target = getTargetForSubject(subject);
  const maxSquares = Math.max(effective.length, target + 1);

  return (
    <div className="flex items-center gap-3 rounded border border-slate-200 bg-white/70 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/50">
      <div className="w-48">
        <p className="text-sm font-semibold">{subject.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{subject.category}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-1" aria-label="無効周回">
          {ineffective.map((cycle) => (
            <Square key={cycle.id} accuracy={cycle.accuracy} />
          ))}
        </div>
        <div className="relative flex items-center gap-1" style={{ minWidth: `${maxSquares * 28}px` }} aria-label="有効周回">
          <TargetLine position={target} />
          {effective.map((cycle) => (
            <Square key={cycle.id} accuracy={cycle.accuracy} />
          ))}
        </div>
      </div>
    </div>
  );
}

export const SubjectRows = ({ cycles }: { cycles: StudyCycle[] }) => (
  <div className="space-y-2">
    {subjects.map((subject) => (
      <SubjectRow key={subject.id} subject={subject} cycles={cycles.filter((cycle) => cycle.subjectId === subject.id)} />
    ))}
  </div>
);
