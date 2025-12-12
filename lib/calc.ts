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

export const aggregateKpis = (cycles: StudyCycle[]): { totalEffective: number; inGoalSubjects: number; stagnantSubjects: number } => {
  const statuses = subjects.map((subject) => getSubjectStatus(cycles, subject.id));
  return {
    totalEffective: countEffectiveCycles(cycles),
    inGoalSubjects: countSubjectsInGoal(statuses),
    stagnantSubjects: countStagnantSubjects(statuses)
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

export const pickPrioritySubject = (cycles: StudyCycle[], statuses: SubjectStatus[]): SubjectStatus | undefined => {
  const candidates = statuses
    .map((status) => ({ status, lastTriedAt: getLastAttemptDate(cycles, status.subjectId) }))
    .filter((item) => item.lastTriedAt && !item.status.inGoal && item.status.ineffectiveCount > 0)
    .sort((a, b) => {
      if (!a.lastTriedAt || !b.lastTriedAt) return 0;
      return a.lastTriedAt.getTime() - b.lastTriedAt.getTime() || a.status.subjectId - b.status.subjectId;
    });

  return candidates[0]?.status;
};
