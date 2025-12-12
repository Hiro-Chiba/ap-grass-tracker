import {
  aggregateKpis,
  countEffectiveCycles,
  countIneffectiveCycles,
  countStagnantSubjects,
  countSubjectsInGoal,
  getSubjectStatus,
  isEffectiveCycle
} from "../calc";
import { subjects } from "../subjects";
import { StudyCycle } from "../types";

const cycles: StudyCycle[] = [
  { id: "1", subjectId: 7, accuracy: 80, date: "2024-01-01" },
  { id: "2", subjectId: 7, accuracy: 50, date: "2024-01-02" },
  { id: "3", subjectId: 8, accuracy: 72, date: "2024-01-03" },
  { id: "4", subjectId: 8, accuracy: 65, date: "2024-01-04" },
  { id: "5", subjectId: 13, accuracy: 71, date: "2024-01-05" }
];

describe("calc utilities", () => {
  test("effective cycle rule", () => {
    expect(isEffectiveCycle(69)).toBe(false);
    expect(isEffectiveCycle(70)).toBe(true);
    expect(isEffectiveCycle(90)).toBe(true);
  });

  test("counting effective / ineffective cycles", () => {
    expect(countEffectiveCycles(cycles)).toBe(3);
    expect(countIneffectiveCycles(cycles)).toBe(2);
  });

  test("subject status includes goal judgement", () => {
    const subject = subjects.find((item) => item.id === 7);
    const status = getSubjectStatus(cycles, 7);
    expect(status.effectiveCount).toBe(1);
    expect(status.target).toBe(subject ? (subject.name === "データベース" ? 4 : 3) : 3);
    expect(status.inGoal).toBe(false);
  });

  test("counts for KPI aggregation", () => {
    const statuses = subjects.slice(0, 5).map((subject) => getSubjectStatus(cycles, subject.id));
    expect(countSubjectsInGoal(statuses)).toBe(0);
    expect(countStagnantSubjects(statuses)).toBe(1);
  });

  test("aggregate KPIs returns totals", () => {
    const kpi = aggregateKpis(cycles);
    expect(kpi.totalEffective).toBe(3);
    expect(kpi.inGoalSubjects).toBeGreaterThanOrEqual(0);
    expect(kpi.stagnantSubjects).toBeGreaterThanOrEqual(0);
  });
});
