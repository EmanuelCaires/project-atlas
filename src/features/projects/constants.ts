import type { ProjectStatus } from "./types";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: "Planning",
  in_progress: "In progress",
  completed: "Completed",
  archived: "Archived",
};
