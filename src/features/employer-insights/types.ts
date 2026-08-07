export type EmployerInsightInput = {
  profileStrength: number;
  totalProjects: number;
  completedProjects: number;
  githubProjects: number;
  liveProjects: number;
  screenshotProjects: number;
  totalSkills: number;
  verifiedSkills: number;
};

export type EmployerEvidenceGrade =
  | "Outstanding"
  | "Excellent"
  | "Strong"
  | "Developing";

export type EmployerInsight = {
  grade: EmployerEvidenceGrade;
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  confidence: "high" | "medium" | "developing";
};