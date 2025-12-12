import { Category } from "./subjects";

export type StudyCycle = {
  id: string;
  subjectId: number;
  accuracy: number;
  date: string;
};

export type SubjectStatus = {
  subjectId: number;
  effectiveCount: number;
  ineffectiveCount: number;
  target: number;
  inGoal: boolean;
  category: Category;
};
