export const EXAM_DATE = new Date("2024-10-20T00:00:00+09:00");

export const daysUntilExam = (now = new Date()): number => {
  const diff = EXAM_DATE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};
