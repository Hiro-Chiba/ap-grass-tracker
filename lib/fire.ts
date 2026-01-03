import { priorityRankMap } from "./priorityRanks";
import { subjects, type Subject } from "./subjects";

export type FireSubjectInput = {
  subjectId: number;
  lastEffectiveAt: Date | null;
  targetLaps: number;
  effectiveLaps: number;
  studiedToday: boolean;
};

export type FireSubjectResult = FireSubjectInput & {
  daysSinceLastEffective: number | null;
  forgettingFactor: number;
  shortageFactor: number;
  importanceWeight: number;
  priorityWeight: number;
  priorityRank: number | null;
  fireScore: number;
};

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const EBBINGHAUS_DECAY_DAYS = 1.5; // 1.5日で記憶保持率がおよそ半減する近似値
const MAX_PRIORITY_RANK = Math.max(...Object.values(priorityRankMap));
const PRIORITY_WEIGHT_RANGE = 0.3;

const getDaysSince = (lastEffectiveAt: Date | null, referenceDate: Date): number | null => {
  if (!lastEffectiveAt) return null;
  return (referenceDate.getTime() - lastEffectiveAt.getTime()) / DAY_IN_MS;
};

export const calculateForgettingScore = (lastEffectiveAt: Date | null, referenceDate = new Date()): number => {
  const days = getDaysSince(lastEffectiveAt, referenceDate);
  if (days === null) return 1.0;

  const elapsedDays = Math.max(days, 0);
  const retention = Math.exp(-elapsedDays / EBBINGHAUS_DECAY_DAYS);
  const forgettingScore = 1 - retention;

  return Math.min(1, Math.max(0, forgettingScore));
};

export const calculateImportanceWeight = (subjectId: number): number => {
  const subject: Subject | undefined = subjects.find((item) => item.id === subjectId);
  if (!subject) return 1.0;

  if (["データベース", "ネットワーク", "セキュリティ"].includes(subject.name)) return 1.3;
  if (["基礎理論", "アルゴリズムとプログラミング"].includes(subject.name)) return 1.2;
  if (subject.category === "management") return 0.9;
  if (subject.category === "strategy") return 0.8;

  return 1.0;
};

export const calculatePriorityWeight = (subjectId: number): { rank: number | null; weight: number } => {
  const rank = priorityRankMap[subjectId] ?? null;
  if (!rank) return { rank, weight: 1.0 };
  if (MAX_PRIORITY_RANK <= 1) return { rank, weight: 1.0 };

  const normalized = (MAX_PRIORITY_RANK - rank) / (MAX_PRIORITY_RANK - 1);
  const weight = 1 + normalized * PRIORITY_WEIGHT_RANGE;

  return { rank, weight };
};

export const calculateForgettingFactor = (lastEffectiveAt: Date | null, referenceDate = new Date()): number => {
  const days = getDaysSince(lastEffectiveAt, referenceDate);
  const linearFactor = days === null ? 1.5 : Math.min(1.5, 1 + days / 7);

  const ebbinghausScore = calculateForgettingScore(lastEffectiveAt, referenceDate);
  const ebbinghausFactor = 1 + ebbinghausScore * 0.5;

  const blendedFactor = (linearFactor + ebbinghausFactor) / 2;

  return Math.min(1.5, blendedFactor);
};

export const calculateShortageFactor = (effectiveLaps: number, targetLaps: number): number => {
  if (targetLaps <= 0) return 0;
  if (effectiveLaps >= targetLaps) return 0;

  return (targetLaps - effectiveLaps + 1) / targetLaps;
};

export const calculateFireScore = (input: FireSubjectInput, referenceDate = new Date()): number => {
  const importanceWeight = calculateImportanceWeight(input.subjectId);
  const forgettingFactor = calculateForgettingFactor(input.lastEffectiveAt, referenceDate);
  const shortageFactor = calculateShortageFactor(input.effectiveLaps, input.targetLaps);
  const { weight: priorityWeight } = calculatePriorityWeight(input.subjectId);

  return importanceWeight * priorityWeight * forgettingFactor * shortageFactor;
};

export const pickFireSubjects = (
  inputs: FireSubjectInput[],
  referenceDate = new Date(),
  limit = 2
): FireSubjectResult[] => {
  const scored = inputs.map<FireSubjectResult>((input) => {
    const daysSinceLastEffective = getDaysSince(input.lastEffectiveAt, referenceDate);
    const importanceWeight = calculateImportanceWeight(input.subjectId);
    const { rank: priorityRank, weight: priorityWeight } = calculatePriorityWeight(input.subjectId);
    const forgettingFactor = calculateForgettingFactor(input.lastEffectiveAt, referenceDate);
    const shortageFactor = calculateShortageFactor(input.effectiveLaps, input.targetLaps);
    const fireScore = input.studiedToday
      ? 0
      : importanceWeight * priorityWeight * forgettingFactor * shortageFactor;

    return {
      ...input,
      daysSinceLastEffective,
      importanceWeight,
      priorityWeight,
      priorityRank,
      forgettingFactor,
      shortageFactor,
      fireScore
    };
  });

  return scored
    .filter((item) => item.shortageFactor > 0 && !item.studiedToday)
    .sort((a, b) => {
      if (b.fireScore !== a.fireScore) return b.fireScore - a.fireScore;
      if (a.priorityRank !== b.priorityRank) {
        if (a.priorityRank === null) return 1;
        if (b.priorityRank === null) return -1;
        return a.priorityRank - b.priorityRank;
      }
      if (b.importanceWeight !== a.importanceWeight) return b.importanceWeight - a.importanceWeight;
      const aTime = a.lastEffectiveAt ? a.lastEffectiveAt.getTime() : -Infinity;
      const bTime = b.lastEffectiveAt ? b.lastEffectiveAt.getTime() : -Infinity;
      if (aTime !== bTime) return aTime - bTime;
      return a.subjectId - b.subjectId;
    })
    .slice(0, limit);
};
