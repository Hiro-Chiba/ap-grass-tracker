import {
  aggregateKpis,
  countEffectiveCycles,
  countIneffectiveCycles,
  countStagnantSubjects,
  countSubjectsInGoal,
  getLastAttemptDate,
  getSubjectStatus,
  getSubjectStatuses,
  isEffectiveCycle,
  pickPrioritySubjects
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
    expect(countStagnantSubjects(statuses)).toBe(0);
  });

  test("aggregate KPIs returns totals", () => {
    const kpi = aggregateKpis(cycles);
    expect(kpi.inGoalSubjects).toBe(0);
    expect(kpi.notInGoalSubjects).toBe(subjects.length);
    expect(kpi.prioritySubjects).toBe(2);
  });

  test("last attempt date follows the most recent cycle", () => {
    const date = getLastAttemptDate(
      [
        { id: "a1", subjectId: 1, accuracy: 60, date: "2024-01-01" },
        { id: "a2", subjectId: 1, accuracy: 80, date: "2024-02-01" }
      ],
      1
    );
    expect(date?.toISOString().startsWith("2024-02-01")).toBe(true);
  });

  test("priority subject is chosen based on fire score", () => {
    const daysAgo = (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() - days);
      return date.toISOString();
    };

    const priorityCycles: StudyCycle[] = [
      { id: "p1", subjectId: 1, accuracy: 60, date: daysAgo(12) },
      { id: "p2", subjectId: 1, accuracy: 80, date: daysAgo(11) },
      { id: "p3", subjectId: 2, accuracy: 75, date: daysAgo(2) },
      { id: "p4", subjectId: 13, accuracy: 80, date: daysAgo(10) },
      { id: "p5", subjectId: 13, accuracy: 40, date: daysAgo(9) }
    ];

    const statuses = getSubjectStatuses(priorityCycles);
    const priority = pickPrioritySubjects(priorityCycles, statuses);
    expect(priority.map((item) => item.subjectId)).toEqual([9, 10]);
  });
});
