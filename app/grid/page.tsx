"use client";

import { SubjectRows } from "@/components/grass/SubjectRow";
import { getSubjectStatuses, pickPrioritySubjects } from "@/lib/calc";
import { useCycleStore } from "@/lib/useCycleStore";

export default function GridPage() {
  const { cycles } = useCycleStore();
  const statuses = getSubjectStatuses(cycles);
  const priorityStatus = pickPrioritySubjects(cycles, statuses);

  return (
    <SubjectRows
      cycles={cycles}
      statuses={statuses}
      prioritizedSubjectIds={priorityStatus.map((status) => status.subjectId)}
    />
  );
}
