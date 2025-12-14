import { Category } from "./subjects";

export type StudyCycle = {
  id: string;
  subjectId: number;
  accuracy: number;
  date: string;
  userId?: string;
};

export type SubjectStatus = {
  subjectId: number;
  effectiveCount: number;
  ineffectiveCount: number;
  target: number;
  inGoal: boolean;
  category: Category;
};

export type PrioritySubjectStatus = SubjectStatus & {
  importanceWeight: number;
  forgettingFactor: number;
  shortageFactor: number;
  daysSinceLastEffective: number | null;
};
