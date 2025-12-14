export const seedCycleAccuracies = [
  { subjectId: 1, accuracies: [82, 75, 68] },
  { subjectId: 2, accuracies: [90, 74, 63, 77] },
  { subjectId: 3, accuracies: [71, 55] },
  { subjectId: 4, accuracies: [88, 79, 72, 65, 93] },
  { subjectId: 5, accuracies: [76] },
  { subjectId: 6, accuracies: [69, 81] },
  { subjectId: 7, accuracies: [85, 73, 66] },
  { subjectId: 8, accuracies: [78] },
  { subjectId: 9, accuracies: [92, 83, 75, 61] },
  { subjectId: 10, accuracies: [70, 64] },
  { subjectId: 11, accuracies: [87, 80, 52, 76, 68] },
  { subjectId: 12, accuracies: [74, 71, 69] },
  { subjectId: 13, accuracies: [63] },
  { subjectId: 14, accuracies: [82, 77] },
  { subjectId: 15, accuracies: [88, 79, 72, 65] },
  { subjectId: 16, accuracies: [90] },
  { subjectId: 17, accuracies: [84, 70, 58] },
  { subjectId: 18, accuracies: [76, 68] },
  { subjectId: 19, accuracies: [81] },
  { subjectId: 20, accuracies: [79, 73, 91, 67, 60] },
  { subjectId: 21, accuracies: [85, 74] },
  { subjectId: 22, accuracies: [83, 77, 69, 62] },
  { subjectId: 23, accuracies: [88] }
] as const;

export const buildSeedCycles = (referenceDate = new Date()) => {
  const baseTime = referenceDate.getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;

  return seedCycleAccuracies.flatMap(({ subjectId, accuracies }) =>
    accuracies.map((accuracy, index) => ({
      subjectId,
      accuracy,
      date: new Date(baseTime - index * oneDayMs).toISOString()
    }))
  );
};
