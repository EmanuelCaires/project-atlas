import type { DeveloperProject } from "../../projects/types";
import type { EvidenceTimelineEvent, EvidenceTimelineEventType } from "../types";

type TimelineProject = Pick<
  DeveloperProject,
  "id" | "title" | "created_at" | "started_at" | "completed_at" | "github_verified_at"
>;

const EVENT_FIELDS: ReadonlyArray<{
  field: "created_at" | "started_at" | "completed_at" | "github_verified_at";
  type: EvidenceTimelineEventType;
}> = [
  { field: "created_at", type: "project_added" },
  { field: "started_at", type: "project_started" },
  { field: "completed_at", type: "project_completed" },
  { field: "github_verified_at", type: "repository_confirmed" },
];

export function buildEvidenceTimeline(
  projects: readonly TimelineProject[],
): EvidenceTimelineEvent[] {
  const events = projects.flatMap((project) =>
    EVENT_FIELDS.flatMap(({ field, type }): EvidenceTimelineEvent[] => {
      const date = project[field];
      if (!date || !Number.isFinite(Date.parse(date))) return [];

      return [{
        id: `${project.id}:${type}`,
        projectId: project.id,
        projectTitle: project.title,
        type,
        date,
      }];
    }),
  );

  return [...events].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}
