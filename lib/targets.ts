import { Subject } from "./subjects";

export type TargetMap = Record<number, number>;

const CATEGORY_TARGET: Record<string, number> = {
  technology: 3,
  management: 2,
  strategy: 2
};

const SPECIAL_TARGET: Record<string, number> = {
  データベース: 4,
  ネットワーク: 4,
  セキュリティ: 4
};

export const getTargetForSubject = (subject: Subject): number => {
  if (SPECIAL_TARGET[subject.name]) {
    return SPECIAL_TARGET[subject.name];
  }
  return CATEGORY_TARGET[subject.category];
};

export const buildTargetMap = (subjects: Subject[]): TargetMap =>
  subjects.reduce<TargetMap>((acc, subject) => {
    acc[subject.id] = getTargetForSubject(subject);
    return acc;
  }, {});
