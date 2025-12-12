import { subjects } from "./subjects";

/**
 * 事実ベースの優先順位。値が小さいほど重要。
 * 現状は科目リストの順序をもとに 1 〜 23 を振っているため、
 * より精緻な重み付けが判明した際はこのマップを更新してください。
 */
export const priorityRankMap: Record<number, number> = subjects.reduce((acc, subject, index) => {
  acc[subject.id] = index + 1;
  return acc;
}, {} as Record<number, number>);
