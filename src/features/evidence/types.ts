export type ProjectEvidenceInput = {
  description: string | null;
  githubUrl: string | null;
  githubVerified: boolean;
  liveUrl: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  status: "planning" | "in_progress" | "completed" | "archived";
  skillsCount: number;
};

export type EvidenceBreakdown = {
  project: number;
  description: number;
  github: number;
  liveDemo: number;
  screenshot: number;
  skills: number;
  featured: number;
  completed: number;
};

export type EvidenceResult = {
  score: number;
  breakdown: EvidenceBreakdown;
};

export type EvidenceTimelineEventType =
  | "project_added"
  | "project_started"
  | "project_completed"
  | "repository_confirmed";

export type EvidenceTimelineEvent = {
  id: string;
  projectId: string;
  projectTitle: string;
  type: EvidenceTimelineEventType;
  date: string;
};
