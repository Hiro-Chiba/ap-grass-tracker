import {
  calculateFireScore,
  calculateForgettingScore,
  calculateMasteryGap,
  calculatePriorityWeight,
  pickFireSubjects,
  type FireSubjectInput
} from "../fire";

describe("fire score calculation", () => {
  test("forgetting score follows Ebbinghaus-like decay", () => {
    const reference = new Date("2024-02-10T00:00:00Z");
    const halfDayAgo = new Date("2024-02-09T12:00:00Z");
    const twoDaysAgo = new Date("2024-02-08T00:00:00Z");
    const oneWeekAgo = new Date("2024-02-03T00:00:00Z");

    expect(calculateForgettingScore(halfDayAgo, reference)).toBeLessThan(
      calculateForgettingScore(twoDaysAgo, reference)
    );
    expect(calculateForgettingScore(twoDaysAgo, reference)).toBeLessThan(
      calculateForgettingScore(oneWeekAgo, reference)
    );
    expect(calculateForgettingScore(oneWeekAgo, reference)).toBeCloseTo(0.99, 2);
    expect(calculateForgettingScore(null, reference)).toBe(1.0);
  });

  test("mastery gap shrinks as doneCount grows", () => {
    expect(calculateMasteryGap(0, 10)).toBe(1);
    expect(calculateMasteryGap(5, 10)).toBe(0.5);
    expect(calculateMasteryGap(10, 10)).toBe(0);
  });

  test("priority weight is inverse of rank", () => {
    expect(calculatePriorityWeight(1)).toBe(1);
    expect(calculatePriorityWeight(5)).toBeCloseTo(0.2);
  });

  test("fire subjects are ranked by fire score with tie breakers", () => {
    const reference = new Date("2024-02-10T00:00:00Z");
    const inputs: FireSubjectInput[] = [
      {
        subjectId: 1,
        priorityRank: 1,
        lastStudiedAt: new Date("2024-02-09T00:00:00Z"),
        totalCount: 10,
        doneCount: 5
      },
      {
        subjectId: 2,
        priorityRank: 2,
        lastStudiedAt: new Date("2024-01-01T00:00:00Z"),
        totalCount: 10,
        doneCount: 2
      },
      {
        subjectId: 3,
        priorityRank: 2,
        lastStudiedAt: new Date("2023-12-01T00:00:00Z"),
        totalCount: 20,
        doneCount: 10
      }
    ];

    const [first, second] = pickFireSubjects(inputs, reference);

    expect(first.subjectId).toBe(2); // higher fire score from larger gap and forgetting
    expect(second.subjectId).toBe(3); // tie on score, older study date wins
    expect(calculateFireScore(inputs[0], reference)).toBeLessThan(calculateFireScore(inputs[1], reference));
  });

  test("stable ordering is guaranteed when all tie breakers match", () => {
    const reference = new Date("2024-02-10T00:00:00Z");
    const inputs: FireSubjectInput[] = [
      {
        subjectId: 10,
        priorityRank: 5,
        lastStudiedAt: null,
        totalCount: 4,
        doneCount: 1
      },
      {
        subjectId: 11,
        priorityRank: 5,
        lastStudiedAt: null,
        totalCount: 4,
        doneCount: 1
      }
    ];

    const [first, second] = pickFireSubjects(inputs, reference, 2);

    expect(first.subjectId).toBe(10);
    expect(second.subjectId).toBe(11);
  });
});
