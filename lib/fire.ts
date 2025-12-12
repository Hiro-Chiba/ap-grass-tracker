export type FireSubjectInput = {
  subjectId: number;
  priorityRank: number;
  lastStudiedAt: Date | null;
  totalCount: number;
  doneCount: number;
};

export type FireSubjectResult = FireSubjectInput & {
  forgettingScore: number;
  masteryGap: number;
  priorityWeight: number;
  fireScore: number;
};

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const EBBINGHAUS_DECAY_DAYS = 1.5; // 1.5日で記憶保持率がおよそ半減する近似値

const getDaysSince = (lastStudiedAt: Date | null, referenceDate: Date): number | null => {
  if (!lastStudiedAt) return null;
  return (referenceDate.getTime() - lastStudiedAt.getTime()) / DAY_IN_MS;
};

export const calculateForgettingScore = (lastStudiedAt: Date | null, referenceDate = new Date()): number => {
  const days = getDaysSince(lastStudiedAt, referenceDate);
  if (days === null) return 1.0;

  const elapsedDays = Math.max(days, 0);
  const retention = Math.exp(-elapsedDays / EBBINGHAUS_DECAY_DAYS);
  const forgettingScore = 1 - retention;

  return Math.min(1, Math.max(0, forgettingScore));
};

export const calculateMasteryGap = (doneCount: number, totalCount: number): number => {
  if (totalCount <= 0) return 1;
  return Math.max(0, 1 - doneCount / totalCount);
};

export const calculatePriorityWeight = (priorityRank: number): number => {
  if (priorityRank <= 0) return 0;
  return 1 / priorityRank;
};

export const calculateFireScore = (input: FireSubjectInput, referenceDate = new Date()): number => {
  const priorityWeight = calculatePriorityWeight(input.priorityRank);
  const forgettingScore = calculateForgettingScore(input.lastStudiedAt, referenceDate);
  const masteryGap = calculateMasteryGap(input.doneCount, input.totalCount);
  return priorityWeight * forgettingScore * masteryGap;
};

export const pickFireSubjects = (
  inputs: FireSubjectInput[],
  referenceDate = new Date(),
  limit = 2
): FireSubjectResult[] => {
  const scored = inputs.map<FireSubjectResult>((input) => {
    const priorityWeight = calculatePriorityWeight(input.priorityRank);
    const forgettingScore = calculateForgettingScore(input.lastStudiedAt, referenceDate);
    const masteryGap = calculateMasteryGap(input.doneCount, input.totalCount);
    const fireScore = priorityWeight * forgettingScore * masteryGap;
    return { ...input, priorityWeight, forgettingScore, masteryGap, fireScore };
  });

  return scored
    .sort((a, b) => {
      if (b.fireScore !== a.fireScore) return b.fireScore - a.fireScore;
      if (a.priorityRank !== b.priorityRank) return a.priorityRank - b.priorityRank;
      const aTime = a.lastStudiedAt ? a.lastStudiedAt.getTime() : -Infinity;
      const bTime = b.lastStudiedAt ? b.lastStudiedAt.getTime() : -Infinity;
      if (aTime !== bTime) return aTime - bTime;
      return a.subjectId - b.subjectId;
    })
    .slice(0, limit);
};
