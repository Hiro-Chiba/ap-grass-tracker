import { subjects } from "./subjects";
import { buildTargetMap } from "./targets";
import type { StudyCycle, SubjectStatus } from "./types";

export const isEffectiveCycle = (accuracy: number): boolean => accuracy >= 70;

export const countEffectiveCycles = (cycles: StudyCycle[]): number =>
  cycles.filter((cycle) => isEffectiveCycle(cycle.accuracy)).length;

export const countIneffectiveCycles = (cycles: StudyCycle[]): number =>
  cycles.filter((cycle) => !isEffectiveCycle(cycle.accuracy)).length;

export const getSubjectStatus = (cycles: StudyCycle[], subjectId: number): SubjectStatus => {
  const targetMap = buildTargetMap(subjects);
  const subjectCycles = cycles.filter((cycle) => cycle.subjectId === subjectId);
  const effective = countEffectiveCycles(subjectCycles);
  const ineffective = countIneffectiveCycles(subjectCycles);
  const target = targetMap[subjectId];
  const subject = subjects.find((item) => item.id === subjectId);

  return {
    subjectId,
    effectiveCount: effective,
    ineffectiveCount: ineffective,
    target,
    inGoal: effective >= target,
    category: subject?.category ?? "technology"
  };
};

export const countSubjectsInGoal = (statuses: SubjectStatus[]): number =>
  statuses.filter((status) => status.inGoal).length;

export const countStagnantSubjects = (statuses: SubjectStatus[]): number =>
  statuses.filter((status) => status.effectiveCount === 0 && status.ineffectiveCount > 0).length;

export const aggregateKpis = (
  cycles: StudyCycle[]
): { inGoalSubjects: number; notInGoalSubjects: number; prioritySubjects: number } => {
  const statuses = subjects.map((subject) => getSubjectStatus(cycles, subject.id));
  const inGoalSubjects = countSubjectsInGoal(statuses);
  const notInGoalSubjects = statuses.length - inGoalSubjects;
  const prioritySubjects = pickPrioritySubject(cycles, statuses) ? 1 : 0;
  return {
    inGoalSubjects,
    notInGoalSubjects,
    prioritySubjects
  };
};

export const getSubjectStatuses = (cycles: StudyCycle[]): SubjectStatus[] =>
  subjects.map((subject) => getSubjectStatus(cycles, subject.id));

export const getLastAttemptDate = (cycles: StudyCycle[], subjectId: number): Date | null => {
  const subjectCycles = cycles.filter((cycle) => cycle.subjectId === subjectId);
  if (subjectCycles.length === 0) return null;

  return subjectCycles.reduce<Date>((latest, cycle) => {
    const current = new Date(cycle.date);
    return current.getTime() > latest.getTime() ? current : latest;
  }, new Date(subjectCycles[0].date));
};

export const hasRecentEffectiveCycle = (cycles: StudyCycle[], subjectId: number, days = 7): boolean => {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return cycles.some(
    (cycle) =>
      cycle.subjectId === subjectId &&
      isEffectiveCycle(cycle.accuracy) &&
      new Date(cycle.date).getTime() >= since.getTime()
  );
};

export const pickPrioritySubject = (cycles: StudyCycle[], statuses: SubjectStatus[]): SubjectStatus | undefined => {
  const subjectOrder = subjects.map((subject) => subject.id);

  const candidates = statuses
    .filter((status) => status.effectiveCount < status.target)
    .filter((status) => cycles.some((cycle) => cycle.subjectId === status.subjectId))
    .filter((status) => !hasRecentEffectiveCycle(cycles, status.subjectId))
    .sort((a, b) => {
      if (a.category !== b.category) {
        if (a.category === "technology") return -1;
        if (b.category === "technology") return 1;
      }
      return subjectOrder.indexOf(a.subjectId) - subjectOrder.indexOf(b.subjectId);
    });

  return candidates[0];
};
