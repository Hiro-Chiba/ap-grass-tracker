import { pickFireSubjects, type FireSubjectInput } from "./fire";
import { priorityRankMap } from "./priorityRanks";
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

const buildFireInputs = (cycles: StudyCycle[], statuses: SubjectStatus[]): FireSubjectInput[] =>
  statuses.map((status) => {
    const priorityRank = priorityRankMap[status.subjectId] ?? subjects.length;
    const lastStudiedAt = getLastAttemptDate(cycles, status.subjectId);
    const totalCount = Math.max(status.target, 1);
    const doneCount = status.effectiveCount;

    return {
      subjectId: status.subjectId,
      priorityRank,
      lastStudiedAt,
      totalCount,
      doneCount
    };
  });

export const pickPrioritySubjects = (cycles: StudyCycle[], statuses: SubjectStatus[]) => {
  const fireInputs = buildFireInputs(cycles, statuses);
  const prioritized = pickFireSubjects(fireInputs);

  return prioritized
    .map((item) => statuses.find((status) => status.subjectId === item.subjectId))
    .filter((status): status is SubjectStatus => Boolean(status));
};
