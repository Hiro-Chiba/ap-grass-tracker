import { SubjectRows } from "@/components/grass/SubjectRow";
import { getSubjectStatuses, pickPrioritySubjects } from "@/lib/calc";
import { getCyclesForUser } from "@/lib/cycles";
import { requireUser } from "@/lib/auth";
import { getSubjects } from "@/lib/subjectsStore";

export default async function GridPage() {
  const user = await requireUser();
  const cycles = await getCyclesForUser(user.id);
  const subjects = await getSubjects();
  const statuses = getSubjectStatuses(cycles, subjects);
  const priorityStatus = pickPrioritySubjects(cycles, statuses);

  return (
    <SubjectRows
      cycles={cycles}
      subjects={subjects}
      statuses={statuses}
      prioritizedSubjectIds={priorityStatus.map((status) => status.subjectId)}
    />
  );
}
