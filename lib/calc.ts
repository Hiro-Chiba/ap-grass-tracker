import {
  calculateImportanceWeight,
  pickFireSubjects,
  type FireSubjectInput
} from "./fire";
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
  const prioritySubjects = pickPrioritySubjects(cycles, statuses).length;
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

export const getLastEffectiveDate = (cycles: StudyCycle[], subjectId: number): Date | null => {
  const effectiveCycles = cycles.filter(
    (cycle) => cycle.subjectId === subjectId && isEffectiveCycle(cycle.accuracy)
  );
  if (effectiveCycles.length === 0) return null;

  return effectiveCycles.reduce<Date>((latest, cycle) => {
    const current = new Date(cycle.date);
    return current.getTime() > latest.getTime() ? current : latest;
  }, new Date(effectiveCycles[0].date));
};

const isSameDate = (left: Date, right: Date): boolean =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const studiedEffectivelyToday = (
  cycles: StudyCycle[],
  subjectId: number,
  referenceDate: Date
): boolean =>
  cycles.some(
    (cycle) =>
      cycle.subjectId === subjectId &&
      isEffectiveCycle(cycle.accuracy) &&
      isSameDate(new Date(cycle.date), referenceDate)
  );

const buildFireInputs = (
  cycles: StudyCycle[],
  statuses: SubjectStatus[],
  referenceDate: Date
): FireSubjectInput[] =>
  statuses.map((status) => {
    const lastEffectiveAt = getLastEffectiveDate(cycles, status.subjectId);
    const targetLaps = Math.max(status.target, 1);
    const effectiveLaps = status.effectiveCount;
    const studiedToday = studiedEffectivelyToday(cycles, status.subjectId, referenceDate);

    return {
      subjectId: status.subjectId,
      lastEffectiveAt,
      targetLaps,
      effectiveLaps,
      studiedToday
    };
  });

export const pickPrioritySubjects = (
  cycles: StudyCycle[],
  statuses: SubjectStatus[],
  referenceDate = new Date()
) => {
  const fireInputs = buildFireInputs(cycles, statuses, referenceDate);
  const prioritized = pickFireSubjects(fireInputs, referenceDate);

  return prioritized
    .map((item) => {
      const status = statuses.find((candidate) => candidate.subjectId === item.subjectId);
      if (!status) return null;

      return {
        ...status,
        importanceWeight: calculateImportanceWeight(item.subjectId),
        forgettingFactor: item.forgettingFactor,
        shortageFactor: item.shortageFactor
      };
    })
    .filter((status): status is SubjectStatus => Boolean(status));
};
