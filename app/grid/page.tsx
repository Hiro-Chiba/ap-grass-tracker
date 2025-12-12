"use client";

import { SubjectRows } from "@/components/grass/SubjectRow";
import { getSubjectStatuses, pickPrioritySubject } from "@/lib/calc";
import { useCycleStore } from "@/lib/useCycleStore";

export default function GridPage() {
  const { cycles } = useCycleStore();
  const statuses = getSubjectStatuses(cycles);
  const priorityStatus = pickPrioritySubject(cycles, statuses);

  return <SubjectRows cycles={cycles} statuses={statuses} prioritizedSubjectId={priorityStatus?.subjectId} />;
}
