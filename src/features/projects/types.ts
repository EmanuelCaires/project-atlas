export type ProjectStatus =
  | "planning"
  | "in_progress"
  | "completed"
  | "archived";

export type DeveloperProject = {
  id: string;
  title: string;
  description: string | null;
  github_url: string | null;
  live_url: string | null;
  image_url: string | null;
  status: ProjectStatus;
  is_featured: boolean;
  started_at: string | null;
  completed_at: string | null;
};

export type ProjectFormValues = {
  title: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
  status: ProjectStatus;
  isFeatured: boolean;
  startedAt: string;
  completedAt: string;
};

export const EMPTY_PROJECT_FORM: ProjectFormValues = {
  title: "",
  description: "",
  githubUrl: "",
  liveUrl: "",
  imageUrl: "",
  status: "completed",
  isFeatured: false,
  startedAt: "",
  completedAt: "",
};
