import { SubjectRows } from "@/components/grass/SubjectRow";
import { getSubjectStatuses, pickPrioritySubjects } from "@/lib/calc";
import { getCyclesForUser } from "@/lib/cycles";
import { requireUser } from "@/lib/auth";

export default async function GridPage() {
  const user = await requireUser();
  const cycles = await getCyclesForUser(user.id);
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
